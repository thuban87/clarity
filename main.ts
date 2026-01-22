import { Plugin, Notice } from 'obsidian';
import { ClaritySettings, DEFAULT_SETTINGS } from './src/settings';
import { ClaritySettingsTab } from './src/components/SettingsTab';
import { ReframeModal, SpiralData } from './src/components/ReframeModal';
import { ResultModal, ReframeResult } from './src/components/ResultModal';
import { GeminiService } from './src/services/GeminiService';
import { ContextLoader } from './src/services/ContextLoader';
import { PromptBuilder } from './src/services/PromptBuilder';
import { SpiralLogger, LogEntry } from './src/services/SpiralLogger';

export default class ClarityPlugin extends Plugin {
	settings: ClaritySettings;
	
	// Services
	private geminiService: GeminiService;
	private contextLoader: ContextLoader;
	private promptBuilder: PromptBuilder;
	private spiralLogger: SpiralLogger;

	async onload() {
		await this.loadSettings();

		// Initialize services
		this.geminiService = new GeminiService();
		this.contextLoader = new ContextLoader(this.app, this.settings);
		this.promptBuilder = new PromptBuilder();
		this.spiralLogger = new SpiralLogger(this.app, this.settings);

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
		// Show loading notice
		const loadingNotice = new Notice('Generating reframe...', 0);

		try {
			// Check if AI service is ready
			if (this.settings.aiProvider === 'gemini') {
				if (!this.settings.geminiApiKey) {
					loadingNotice.hide();
					new Notice('Please set your Gemini API key in settings');
					return;
				}
				if (!this.geminiService.isInitialized()) {
					this.geminiService.initialize(this.settings.geminiApiKey);
				}
			}

			// Load context
			const { fullContext, sources } = await this.contextLoader.loadContext();

			// Build prompts
			const systemPrompt = this.promptBuilder.buildSystemPrompt(fullContext);
			const userPrompt = this.promptBuilder.buildUserPrompt(spiralData);

			// Generate reframe
			let reframeContent: string;
			
			if (this.settings.aiProvider === 'gemini') {
				reframeContent = await this.geminiService.generateReframe(systemPrompt, userPrompt);
			} else {
				// TODO: Add Claude support
				throw new Error('Claude provider not yet implemented. Please use Gemini for now.');
			}

			loadingNotice.hide();

			// Create result
			const result: ReframeResult = {
				content: reframeContent,
				provider: this.settings.aiProvider,
				sources
			};

			// Track mood after for logging
			let moodAfter: number | undefined;

			// Show result modal
			const resultModal = new ResultModal(
				this.app,
				this,
				result,
				async () => {
					// Manual save callback
					await this.logSpiral(spiralData, result, moodAfter);
				},
				this.settings.includeMoodRating 
					? (mood: number) => { moodAfter = mood; }
					: undefined
			);
			resultModal.open();

			// Auto-save if enabled
			if (this.settings.autoSaveToLog) {
				// Delay slightly to allow mood rating if enabled
				setTimeout(async () => {
					await this.logSpiral(spiralData, result, moodAfter);
				}, this.settings.includeMoodRating ? 5000 : 100);
			}

		} catch (error: any) {
			loadingNotice.hide();
			console.error('Clarity: Failed to generate reframe:', error);
			new Notice(`Failed to generate reframe: ${error.message}`);
		}
	}

	/**
	 * Log a spiral and reframe
	 */
	private async logSpiral(
		spiralData: SpiralData, 
		result: ReframeResult, 
		moodAfter?: number
	): Promise<void> {
		try {
			const entry: LogEntry = {
				spiral: spiralData,
				reframe: result,
				moodAfter
			};
			await this.spiralLogger.logEntry(entry);
		} catch (error) {
			console.error('Failed to log spiral:', error);
			new Notice('Failed to save to log');
		}
	}
}
