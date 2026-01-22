import { App, TFile } from 'obsidian';
import type { ClaritySettings } from '../settings';

/**
 * Parsed pattern from pattern file
 */
export interface Pattern {
    name: string;
    triggers: string[];
    frequency?: number;
    effectiveReframe: string;
    sources: string[];
}

/**
 * Match result from pattern matching
 */
export interface PatternMatch {
    pattern: Pattern;
    score: number; // 0-1
    matchedTriggers: string[];
}

/**
 * Pattern matching service
 * Loads patterns from file and matches spirals against them
 */
export class PatternMatcher {
    private app: App;
    private settings: ClaritySettings;
    private patterns: Pattern[] = [];
    private lastLoaded: number = 0;
    private readonly CACHE_DURATION = 60000; // 1 minute cache

    constructor(app: App, settings: ClaritySettings) {
        this.app = app;
        this.settings = settings;
    }

    /**
     * Load patterns from the pattern file
     */
    async loadPatterns(): Promise<Pattern[]> {
        // Return cached if recent
        if (Date.now() - this.lastLoaded < this.CACHE_DURATION && this.patterns.length > 0) {
            return this.patterns;
        }

        const file = this.app.vault.getAbstractFileByPath(this.settings.patternFilePath);
        if (!file || !(file instanceof TFile)) {
            console.log('Clarity: Pattern file not found:', this.settings.patternFilePath);
            this.patterns = [];
            return [];
        }

        try {
            const content = await this.app.vault.read(file);
            this.patterns = this.parsePatterns(content);
            this.lastLoaded = Date.now();
            console.log(`Clarity: Loaded ${this.patterns.length} patterns`);
            return this.patterns;
        } catch (e) {
            console.error('Clarity: Failed to load patterns:', e);
            this.patterns = [];
            return [];
        }
    }

    /**
     * Parse pattern file content into Pattern objects
     */
    private parsePatterns(content: string): Pattern[] {
        const patterns: Pattern[] = [];

        // Split by ## Pattern: headers
        const patternBlocks = content.split(/^## Pattern:/gm).slice(1);

        for (const block of patternBlocks) {
            try {
                const pattern = this.parsePatternBlock(block);
                if (pattern) {
                    patterns.push(pattern);
                }
            } catch (e) {
                console.warn('Clarity: Failed to parse pattern block:', e);
            }
        }

        return patterns;
    }

    /**
     * Parse a single pattern block
     */
    private parsePatternBlock(block: string): Pattern | null {
        const lines = block.trim().split('\n');
        if (lines.length === 0) return null;

        const name = lines[0].trim();
        let triggers: string[] = [];
        let frequency: number | undefined;
        let effectiveReframe = '';
        let sources: string[] = [];
        let inReframe = false;
        let reframeLines: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            // Check for field markers
            if (line.startsWith('- **Triggers:**')) {
                const triggerText = line.replace('- **Triggers:**', '').trim();
                triggers = triggerText.split(',').map(t => t.trim().toLowerCase());
            } else if (line.startsWith('- **Frequency:**')) {
                const freqMatch = line.match(/(\d+)/);
                if (freqMatch) {
                    frequency = parseInt(freqMatch[1]);
                }
            } else if (line.startsWith('- **Sources:**')) {
                const sourceText = line.replace('- **Sources:**', '').trim();
                sources = sourceText.split(',').map(s => s.trim());
            } else if (line.startsWith('- **Effective Reframe:**')) {
                inReframe = true;
            } else if (inReframe && line.startsWith('- **')) {
                // End of reframe section
                inReframe = false;
                effectiveReframe = reframeLines.join('\n').trim();
            } else if (inReframe) {
                // Accumulate reframe lines (strip > quote markers)
                reframeLines.push(line.replace(/^\s*>\s?/, ''));
            }
        }

        // Handle reframe if it's the last section
        if (inReframe && reframeLines.length > 0) {
            effectiveReframe = reframeLines.join('\n').trim();
        }

        if (!name || triggers.length === 0) {
            return null;
        }

        return { name, triggers, frequency, effectiveReframe, sources };
    }

    /**
     * Find best matching pattern for a spiral
     */
    async findMatch(spiralText: string): Promise<PatternMatch | null> {
        await this.loadPatterns();

        if (this.patterns.length === 0) {
            return null;
        }

        const spiralLower = spiralText.toLowerCase();
        let bestMatch: PatternMatch | null = null;

        for (const pattern of this.patterns) {
            const match = this.scoreMatch(spiralLower, pattern);
            if (match && (!bestMatch || match.score > bestMatch.score)) {
                bestMatch = match;
            }
        }

        return bestMatch;
    }

    /**
     * Score how well a spiral matches a pattern
     * Scoring: Any match = 50% base, +10% per additional trigger, max 100%
     */
    private scoreMatch(spiralLower: string, pattern: Pattern): PatternMatch | null {
        const matchedTriggers: string[] = [];

        // Check each trigger
        for (const trigger of pattern.triggers) {
            if (this.fuzzyContains(spiralLower, trigger)) {
                matchedTriggers.push(trigger);
            }
        }

        if (matchedTriggers.length === 0) {
            return null;
        }

        // Scoring: 1 match = 50%, each additional match adds 10%, max 100%
        // This ensures even a single trigger match can pass a 50% threshold
        const baseScore = 0.5;
        const bonusPerMatch = 0.1;
        const additionalMatches = matchedTriggers.length - 1;
        const score = Math.min(baseScore + (additionalMatches * bonusPerMatch), 1.0);

        console.log(`Clarity: Pattern "${pattern.name}" matched ${matchedTriggers.length} triggers [${matchedTriggers.join(', ')}] = ${Math.round(score * 100)}%`);

        return { pattern, score, matchedTriggers };
    }

    /**
     * Fuzzy string contains check
     * Handles word boundaries and minor variations
     */
    private fuzzyContains(text: string, trigger: string): boolean {
        // Exact substring match
        if (text.includes(trigger)) {
            return true;
        }

        // Word boundary match (for single words)
        if (!trigger.includes(' ')) {
            const wordPattern = new RegExp(`\\b${this.escapeRegex(trigger)}\\b`, 'i');
            if (wordPattern.test(text)) {
                return true;
            }
        }

        // Simple Levenshtein for short triggers (typo tolerance)
        if (trigger.length >= 4 && trigger.length <= 10) {
            const words = text.split(/\s+/);
            for (const word of words) {
                if (this.levenshteinDistance(word, trigger) <= 2) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Escape special regex characters
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Calculate Levenshtein distance between two strings
     */
    private levenshteinDistance(a: string, b: string): number {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix: number[][] = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * Get raw pattern file content for sending to API
     */
    async getPatternFileContent(): Promise<string | null> {
        const file = this.app.vault.getAbstractFileByPath(this.settings.patternFilePath);
        if (!file || !(file instanceof TFile)) {
            return null;
        }
        return await this.app.vault.read(file);
    }

    /**
     * Check if patterns are available
     */
    async hasPatterns(): Promise<boolean> {
        await this.loadPatterns();
        return this.patterns.length > 0;
    }
}
