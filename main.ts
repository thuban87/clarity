import { Plugin, Notice } from 'obsidian';
import { ClaritySettings, DEFAULT_SETTINGS } from './src/settings';
import { ClaritySettingsTab } from './src/components/SettingsTab';
import { ReframeModal, SpiralData } from './src/components/ReframeModal';
import { ResultModal, ReframeResult } from './src/components/ResultModal';
import { GeminiService } from './src/services/GeminiService';
import { ContextLoader } from './src/services/ContextLoader';
import { PromptBuilder } from './src/services/PromptBuilder';
import { SpiralLogger, LogEntry } from './src/services/SpiralLogger';
import { PatternMatcher } from './src/services/PatternMatcher';

export default class ClarityPlugin extends Plugin {
	settings: ClaritySettings;

	// Services
	private geminiService: GeminiService;
	private contextLoader: ContextLoader;
	private promptBuilder: PromptBuilder;
	private spiralLogger: SpiralLogger;
	private patternMatcher: PatternMatcher;

	async onload() {
		await this.loadSettings();

		// Initialize services
		this.geminiService = new GeminiService();
		this.contextLoader = new ContextLoader(this.app, this.settings);
		this.promptBuilder = new PromptBuilder();
		this.spiralLogger = new SpiralLogger(this.app, this.settings);
		this.patternMatcher = new PatternMatcher(this.app, this.settings);

		// Initialize AI service with stored key
		this.initializeAIService();

		// Add ribbon icon
		this.addRibbonIcon('compass', 'Clarity: Reframe', () => {
			this.openReframeModal();
		});

		// Add command
		this.addCommand({
			id: 'reframe',
			name: 'Reframe This',
			callback: () => {
				this.openReframeModal();
			}
		});

		// Add settings tab
		this.addSettingTab(new ClaritySettingsTab(this.app, this));

		console.log('Clarity plugin loaded');
	}

	onunload() {
		console.log('Clarity plugin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		// Reinitialize services with new settings
		this.contextLoader = new ContextLoader(this.app, this.settings);
		this.spiralLogger = new SpiralLogger(this.app, this.settings);
		this.patternMatcher = new PatternMatcher(this.app, this.settings);
		// Reinitialize AI service if key changed
		this.initializeAIService();
	}

	/**
	 * Initialize AI service with stored API key
	 */
	private initializeAIService(): void {
		if (this.settings.aiProvider === 'gemini' && this.settings.geminiApiKey) {
			this.geminiService.initialize(this.settings.geminiApiKey);
		}
		// TODO: Add Claude initialization when implemented
	}

	/**
	 * Open the reframe modal
	 */
	private openReframeModal(): void {
		const modal = new ReframeModal(this.app, this, async (spiralData: SpiralData) => {
			await this.processSpiral(spiralData);
		});
		modal.open();
	}

	/**
	 * Process a spiral and generate reframe
	 */
	private async processSpiral(spiralData: SpiralData): Promise<void> {
		const loadingNotice = new Notice('Generating reframe...', 0);

		try {
			let result: ReframeResult;

			// Pattern matching flow based on mode
			if (this.settings.patternMode === 'full') {
				// Full mode: try pattern match first, use cached reframe if found
				const match = await this.patternMatcher.findMatch(spiralData.narrative);

				if (match && match.score >= this.settings.patternMatchThreshold) {
					// Use cached reframe from pattern
					loadingNotice.hide();
					result = {
						content: match.pattern.effectiveReframe,
						provider: 'pattern',
						sources: match.pattern.sources,
						isPatternMatch: true,
						patternScore: match.score,
						patternName: match.pattern.name
					};
				} else {
					// No match or below threshold - call API with patterns as context
					result = await this.generateApiReframe(spiralData, true);
					loadingNotice.hide();
				}
			} else if (this.settings.patternMode === 'patterns-api') {
				// Patterns + API mode: always call API but include patterns as context
				result = await this.generateApiReframe(spiralData, true);
				loadingNotice.hide();
			} else {
				// Off mode: normal Phase 1 flow (no patterns)
				result = await this.generateApiReframe(spiralData, false);
				loadingNotice.hide();
			}

			// Track mood after for logging
			let moodAfter: number | undefined;

			// Show result modal
			const resultModal = new ResultModal(
				this.app,
				this,
				result,
				async (wasHelpful: boolean) => {
					await this.logSpiral(spiralData, result, moodAfter, wasHelpful);
				},
				this.settings.includeMoodRating
					? (mood: number) => { moodAfter = mood; }
					: undefined
			);
			resultModal.open();

		} catch (error: any) {
			loadingNotice.hide();
			console.error('Clarity: Failed to generate reframe:', error);
			new Notice(`Failed to generate reframe: ${error.message}`);
		}
	}

	/**
	 * Generate reframe via API
	 */
	private async generateApiReframe(spiralData: SpiralData, includePatterns: boolean): Promise<ReframeResult> {
		// Check if AI service is ready
		if (this.settings.aiProvider === 'gemini') {
			if (!this.settings.geminiApiKey) {
				throw new Error('Please set your Gemini API key in settings');
			}
			if (!this.geminiService.isInitialized()) {
				this.geminiService.initialize(this.settings.geminiApiKey);
			}
		}

		// Load context
		const { fullContext, sources } = await this.contextLoader.loadContext();

		// Optionally include pattern file as additional context
		let enrichedContext = fullContext;
		if (includePatterns) {
			const patternContent = await this.patternMatcher.getPatternFileContent();
			if (patternContent) {
				enrichedContext += '\n\n---\n\n### Known Patterns\n(Past spirals and effective reframes)\n\n' + patternContent;
			}
		}

		// Build prompts
		const systemPrompt = this.promptBuilder.buildSystemPrompt(enrichedContext);
		const userPrompt = this.promptBuilder.buildUserPrompt(spiralData);

		// Generate reframe
		let reframeContent: string;

		if (this.settings.aiProvider === 'gemini') {
			reframeContent = await this.geminiService.generateReframe(systemPrompt, userPrompt);
		} else {
			throw new Error('Claude provider not yet implemented. Please use Gemini for now.');
		}

		return {
			content: reframeContent,
			provider: this.settings.aiProvider,
			sources
		};
	}

	/**
	 * Log a spiral and reframe
	 */
	private async logSpiral(
		spiralData: SpiralData,
		result: ReframeResult,
		moodAfter?: number,
		wasHelpful?: boolean
	): Promise<void> {
		try {
			const entry: LogEntry = {
				spiral: spiralData,
				reframe: result,
				moodAfter,
				wasHelpful
			};
			await this.spiralLogger.logEntry(entry);
		} catch (error) {
			console.error('Failed to log spiral:', error);
			new Notice('Failed to save to log');
		}
	}
}
