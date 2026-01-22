import { App, TFile, Notice } from 'obsidian';
import type { ClaritySettings } from '../settings';

export interface LoadedContext {
	fullContext: string;
	sources: string[];
}

export class ContextLoader {
	private app: App;
	private settings: ClaritySettings;

	constructor(app: App, settings: ClaritySettings) {
		this.app = app;
		this.settings = settings;
	}

	/**
	 * Load all context from configured files
	 */
	async loadContext(): Promise<LoadedContext> {
		const sources: string[] = [];
		const contextParts: string[] = [];

		for (const filePath of this.settings.contextFiles) {
			if (!filePath.trim()) continue;
			
			try {
				const content = await this.loadFile(filePath);
				if (content) {
					contextParts.push(this.formatContextSection(filePath, content));
					sources.push(filePath);
				}
			} catch (error) {
				console.warn(`Clarity: Could not load context file "${filePath}":`, error);
				// Continue with other files
			}
		}

		if (contextParts.length === 0) {
			new Notice('Warning: No context files could be loaded. Reframe may be less accurate.');
		}

		return {
			fullContext: contextParts.join('\n\n---\n\n'),
			sources
		};
	}

	/**
	 * Load a single file's content
	 */
	private async loadFile(filePath: string): Promise<string | null> {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		
		if (!file || !(file instanceof TFile)) {
			console.warn(`Clarity: File not found: ${filePath}`);
			return null;
		}

		const content = await this.app.vault.read(file);
		
		// For Session Log, extract only recent entries based on settings
		if (filePath.toLowerCase().includes('session log')) {
			return this.extractRecentSessions(content);
		}

		return content;
	}

	/**
	 * Extract recent sessions from Session Log file
	 * Assumes sessions are separated by ## headers with dates
	 */
	private extractRecentSessions(content: string): string {
		const sessionCount = this.settings.sessionCount;
		
		// Split by session headers (## followed by date-like patterns)
		const sessionPattern = /^## .+/gm;
		const matches = [...content.matchAll(sessionPattern)];
		
		if (matches.length === 0) {
			// No session headers found, return full content
			return content;
		}

		// Get the last N sessions
		const startIndex = Math.max(0, matches.length - sessionCount);
		const relevantMatches = matches.slice(startIndex);

		if (relevantMatches.length === 0) {
			return content;
		}

		// Extract from the first relevant session to end of file
		const startPosition = relevantMatches[0].index || 0;
		return content.substring(startPosition);
	}

	/**
	 * Format a context section with header
	 */
	private formatContextSection(filePath: string, content: string): string {
		const fileName = filePath.split('/').pop() || filePath;
		return `### ${fileName}\n(Source: ${filePath})\n\n${content}`;
	}
}
