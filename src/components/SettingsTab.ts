import { App, PluginSettingTab, Setting, TextComponent, Notice } from 'obsidian';
import type ClarityPlugin from '../../main';
import { ClaritySettings, DEFAULT_SETTINGS, getMarkdownFiles, getFolders } from '../settings';

export class ClaritySettingsTab extends PluginSettingTab {
	plugin: ClarityPlugin;

	constructor(app: App, plugin: ClarityPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Header
		containerEl.createEl('h1', { text: 'Clarity Settings' });

		// AI Provider Section
		containerEl.createEl('h2', { text: 'AI Provider' });

		new Setting(containerEl)
			.setName('AI Provider')
			.setDesc('Select which AI provider to use for reframes')
			.addDropdown(dropdown => dropdown
				.addOption('gemini', 'Gemini (Free tier)')
				.addOption('claude-sonnet', 'Claude Sonnet (Best quality)')
				.addOption('claude-haiku', 'Claude Haiku (Budget)')
				.setValue(this.plugin.settings.aiProvider)
				.onChange(async (value) => {
					this.plugin.settings.aiProvider = value as ClaritySettings['aiProvider'];
					await this.plugin.saveSettings();
				}));

		// Gemini API Key
		new Setting(containerEl)
			.setName('Gemini API Key')
			.setDesc('Your Gemini API key')
			.addText(text => {
				text.inputEl.type = 'password';
				text.setPlaceholder('Enter API key...');
				text.setValue(this.plugin.settings.geminiApiKey);
				text.onChange(async (value) => {
					this.plugin.settings.geminiApiKey = value;
					await this.plugin.saveSettings();
				});
			})
			.addButton(button => button
				.setButtonText('Clear')
				.onClick(async () => {
					this.plugin.settings.geminiApiKey = '';
					await this.plugin.saveSettings();
					new Notice('Gemini API key cleared');
					this.display();
				}));

		// Claude API Key
		new Setting(containerEl)
			.setName('Claude API Key')
			.setDesc('Your Claude API key')
			.addText(text => {
				text.inputEl.type = 'password';
				text.setPlaceholder('Enter API key...');
				text.setValue(this.plugin.settings.claudeApiKey);
				text.onChange(async (value) => {
					this.plugin.settings.claudeApiKey = value;
					await this.plugin.saveSettings();
				});
			})
			.addButton(button => button
				.setButtonText('Clear')
				.onClick(async () => {
					this.plugin.settings.claudeApiKey = '';
					await this.plugin.saveSettings();
					new Notice('Claude API key cleared');
					this.display();
				}));

		// Context Files Section
		containerEl.createEl('h2', { text: 'Context Files' });
		containerEl.createEl('p', { 
			text: 'Files containing your documented context (neuropsych eval, therapy notes, etc.)',
			cls: 'setting-item-description'
		});

		// List existing context files
		this.plugin.settings.contextFiles.forEach((filePath, index) => {
			this.createContextFileEntry(containerEl, filePath, index);
		});

		// Add new context file button
		new Setting(containerEl)
			.addButton(button => button
				.setButtonText('+ Add Context File')
				.onClick(() => {
					this.plugin.settings.contextFiles.push('');
					this.display(); // Refresh to show new entry
				}));

		// Log Settings
		containerEl.createEl('h2', { text: 'Logging' });

		new Setting(containerEl)
			.setName('Log Folder')
			.setDesc('Where to save spiral logs')
			.addText(text => {
				text.setPlaceholder('Health/Mental Health/Clarity Logs');
				text.setValue(this.plugin.settings.logFolder);
				
				// Add folder autocomplete
				this.addFolderAutocomplete(text);
				
				text.onChange(async (value) => {
					this.plugin.settings.logFolder = value;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Auto-save to log')
			.setDesc('Automatically save spirals and reframes to daily log')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoSaveToLog)
				.onChange(async (value) => {
					this.plugin.settings.autoSaveToLog = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Include mood rating')
			.setDesc('Ask for mood before/after reframe')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeMoodRating)
				.onChange(async (value) => {
					this.plugin.settings.includeMoodRating = value;
					await this.plugin.saveSettings();
				}));

		// Advanced Section
		containerEl.createEl('h2', { text: 'Advanced' });

		new Setting(containerEl)
			.setName('Session count')
			.setDesc('How many recent therapy sessions to include in context')
			.addSlider(slider => slider
				.setLimits(1, 10, 1)
				.setValue(this.plugin.settings.sessionCount)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.sessionCount = value;
					await this.plugin.saveSettings();
				}));

		// Reset to defaults
		new Setting(containerEl)
			.setName('Reset to defaults')
			.setDesc('Reset all settings to default values (clears API keys)')
			.addButton(button => button
				.setButtonText('Reset')
				.setWarning()
				.onClick(async () => {
					this.plugin.settings = { ...DEFAULT_SETTINGS };
					await this.plugin.saveSettings();
					new Notice('Settings reset to defaults');
					this.display();
				}));
	}

	/**
	 * Create a context file entry with autocomplete and remove button
	 */
	private createContextFileEntry(containerEl: HTMLElement, filePath: string, index: number): void {
		new Setting(containerEl)
			.setName(`Context file ${index + 1}`)
			.addText(text => {
				text.setPlaceholder('Path to file...');
				text.setValue(filePath);
				
				// Add file autocomplete
				this.addFileAutocomplete(text);
				
				text.onChange(async (value) => {
					this.plugin.settings.contextFiles[index] = value;
					await this.plugin.saveSettings();
				});
			})
			.addButton(button => button
				.setIcon('trash')
				.setTooltip('Remove')
				.onClick(async () => {
					this.plugin.settings.contextFiles.splice(index, 1);
					await this.plugin.saveSettings();
					this.display();
				}));
	}

	/**
	 * Add file autocomplete to a text input
	 */
	private addFileAutocomplete(textComponent: TextComponent): void {
		const inputEl = textComponent.inputEl;
		const files = getMarkdownFiles(this.app);
		
		// Create datalist for autocomplete
		const datalistId = `clarity-files-${Date.now()}`;
		const datalist = createEl('datalist', { attr: { id: datalistId } });
		files.forEach(file => {
			datalist.createEl('option', { value: file });
		});
		inputEl.parentElement?.appendChild(datalist);
		inputEl.setAttribute('list', datalistId);
	}

	/**
	 * Add folder autocomplete to a text input
	 */
	private addFolderAutocomplete(textComponent: TextComponent): void {
		const inputEl = textComponent.inputEl;
		const folders = getFolders(this.app);
		
		// Create datalist for autocomplete
		const datalistId = `clarity-folders-${Date.now()}`;
		const datalist = createEl('datalist', { attr: { id: datalistId } });
		folders.forEach(folder => {
			datalist.createEl('option', { value: folder });
		});
		inputEl.parentElement?.appendChild(datalist);
		inputEl.setAttribute('list', datalistId);
	}
}
