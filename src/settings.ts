import { App, TFolder, TFile } from 'obsidian';

/**
 * Plugin settings interface
 */
export interface ClaritySettings {
	// AI Provider
	aiProvider: 'gemini' | 'claude-sonnet' | 'claude-haiku';
	
	// API Keys (stored in data.json - not ideal but SecretStorage API is buggy)
	// TODO: Migrate to SecretStorage when API is stable
	geminiApiKey: string;
	claudeApiKey: string;
	
	// Context file paths (relative to vault root)
	contextFiles: string[];
	
	// Log file location
	logFolder: string;
	
	// Behavior
	autoSaveToLog: boolean;
	includeMoodRating: boolean;
	sessionCount: number; // How many recent sessions to include from Session Log
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: ClaritySettings = {
	aiProvider: 'gemini',
	geminiApiKey: '',
	claudeApiKey: '',
	contextFiles: [
		'Health/Medical/Nuero-testing Results.md',
		'Health/Mental Health/Session Log.md',
		'Health/Mental Health/Shame Narrative Reframes - Daily Reminders.md'
	],
	logFolder: 'Health/Mental Health/Clarity Logs',
	autoSaveToLog: true,
	includeMoodRating: false,
	sessionCount: 3
};

/**
 * Keychain key names for API secrets
 */
export const KEYCHAIN_KEYS = {
	GEMINI: 'clarity-gemini-key',
	CLAUDE: 'clarity-claude-key'
} as const;

/**
 * Get all markdown files in vault for autocomplete
 */
export function getMarkdownFiles(app: App): string[] {
	const files: string[] = [];
	app.vault.getMarkdownFiles().forEach(file => {
		files.push(file.path);
	});
	return files.sort();
}

/**
 * Get all folders in vault for autocomplete
 */
export function getFolders(app: App): string[] {
	const folders: string[] = [];
	const rootFolder = app.vault.getRoot();
	
	function walkFolder(folder: TFolder) {
		if (folder.path !== '/') {
			folders.push(folder.path);
		}
		folder.children.forEach(child => {
			if (child instanceof TFolder) {
				walkFolder(child);
			}
		});
	}
	
	walkFolder(rootFolder);
	return folders.sort();
}
