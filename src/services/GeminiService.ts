import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
	private genAI: GoogleGenerativeAI | null = null;

	/**
	 * Initialize the Gemini client with API key
	 */
	initialize(apiKey: string): void {
		this.genAI = new GoogleGenerativeAI(apiKey);
	}

	/**
	 * Check if service is initialized
	 */
	isInitialized(): boolean {
		return this.genAI !== null;
	}

	/**
	 * Generate a reframe for the given spiral
	 */
	async generateReframe(systemPrompt: string, userPrompt: string): Promise<string> {
		if (!this.genAI) {
			throw new Error('Gemini service not initialized. Please set your API key in settings.');
		}

		try {
			const model = this.genAI.getGenerativeModel({
				model: 'gemini-2.5-flash',
				systemInstruction: systemPrompt
			});

			const result = await model.generateContent(userPrompt);
			const response = result.response;
			const text = response.text();

			if (!text) {
				throw new Error('Empty response from Gemini');
			}

			return text;
		} catch (error: any) {
			// Handle specific error types
			if (error.message?.includes('API_KEY_INVALID')) {
				throw new Error('Invalid Gemini API key. Please check your settings.');
			}
			if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
				throw new Error('Gemini rate limit exceeded. Please wait a moment and try again.');
			}
			if (error.message?.includes('QUOTA_EXCEEDED')) {
				throw new Error('Gemini quota exceeded. Please try again tomorrow or upgrade your plan.');
			}
			
			// Re-throw with context
			throw new Error(`Gemini API error: ${error.message || 'Unknown error'}`);
		}
	}
}
