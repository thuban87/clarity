import { App, Modal, Setting, Notice } from 'obsidian';
import type ClarityPlugin from '../../main';

export interface SpiralData {
	narrative: string;
	certainty: number;
	context?: string;
	moodBefore?: number;
}

export class ReframeModal extends Modal {
	plugin: ClarityPlugin;
	private narrative: string = '';
	private certainty: number = 5;
	private context: string = '';
	private moodBefore: number | undefined;
	private onSubmit: (data: SpiralData) => void;

	constructor(app: App, plugin: ClarityPlugin, onSubmit: (data: SpiralData) => void) {
		super(app);
		this.plugin = plugin;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('clarity-reframe-modal');

		// Title
		contentEl.createEl('h2', { text: '🧭 Clarity Reframe' });

		// Narrative input
		contentEl.createEl('label', { text: "What's the narrative/spiral?" });
		const textArea = contentEl.createEl('textarea', {
			cls: 'clarity-narrative-input',
			attr: { 
				placeholder: "I don't deserve accommodations because...",
				rows: '4'
			}
		});
		textArea.addEventListener('input', (e) => {
			this.narrative = (e.target as HTMLTextAreaElement).value;
		});

		// Certainty selector (1-10 buttons)
		contentEl.createEl('label', { text: 'How certain are you? (1-10)' });
		const certaintyContainer = contentEl.createDiv({ cls: 'clarity-certainty-container' });
		
		for (let i = 1; i <= 10; i++) {
			const btn = certaintyContainer.createEl('button', {
				text: String(i),
				cls: `clarity-certainty-btn ${i === this.certainty ? 'active' : ''}`
			});
			btn.addEventListener('click', () => {
				this.certainty = i;
				// Update active state
				certaintyContainer.querySelectorAll('.clarity-certainty-btn').forEach((b, idx) => {
					b.classList.toggle('active', idx + 1 === i);
				});
			});
		}

		// Optional context
		contentEl.createEl('label', { text: 'Additional context (optional)' });
		const contextInput = contentEl.createEl('textarea', {
			cls: 'clarity-context-input',
			attr: { 
				placeholder: 'What triggered this? Any specific situation?',
				rows: '2'
			}
		});
		contextInput.addEventListener('input', (e) => {
			this.context = (e.target as HTMLTextAreaElement).value;
		});

		// Mood before (if enabled in settings)
		if (this.plugin.settings.includeMoodRating) {
			contentEl.createEl('label', { text: 'Current mood (1-10)' });
			const moodContainer = contentEl.createDiv({ cls: 'clarity-mood-container' });
			
			for (let i = 1; i <= 10; i++) {
				const btn = moodContainer.createEl('button', {
					text: String(i),
					cls: 'clarity-mood-btn'
				});
				btn.addEventListener('click', () => {
					this.moodBefore = i;
					moodContainer.querySelectorAll('.clarity-mood-btn').forEach((b, idx) => {
						b.classList.toggle('active', idx + 1 === i);
					});
				});
			}
		}

		// Buttons
		const buttonContainer = contentEl.createDiv({ cls: 'clarity-button-container' });
		
		const cancelBtn = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelBtn.addEventListener('click', () => this.close());

		const submitBtn = buttonContainer.createEl('button', { 
			text: 'Generate Reframe',
			cls: 'mod-cta'
		});
		submitBtn.addEventListener('click', () => {
			if (!this.narrative.trim()) {
				new Notice('Please enter your spiral/narrative');
				return;
			}
			
			this.onSubmit({
				narrative: this.narrative,
				certainty: this.certainty,
				context: this.context || undefined,
				moodBefore: this.moodBefore
			});
			this.close();
		});

		// Focus on textarea
		textArea.focus();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
