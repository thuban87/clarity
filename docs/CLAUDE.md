# CLAUDE.md - Clarity

**Purpose:** Instructions for AI assistants working on the **Clarity** project.
**Last Updated:** January 21, 2026

---

## ⚠️ CRITICAL: Git Protocol
**DO NOT perform git commands.**
- The user will handle all git operations.
- **Your Job:** Suggest commit messages/descriptions when a task is done.
- **Reminder:** When starting a new session, remind the user to check branches.

---

## Project Overview

**Clarity** is a cognitive reframing plugin for Obsidian.
**Goal:** Provide evidence-based counter-narratives to catastrophizing spirals using AI and Brad's documented context (neuropsych eval, therapy notes, shame reframes).

**Core Value:** Pocket-sized therapist. Quick reframes (under 2 min) using Brad's OWN evidence, accessible on mobile.

---

## Sensitive Context

**This is a mental health tool.** Handle with care:

1. **Never dismiss spirals** - User is asking for help when he uses this
2. **Evidence-based only** - Pull from documented facts, not generic platitudes
3. **Privacy-first** - API keys in `data.json` (gitignored), no logging sensitive data
4. **Test thoughtfully** - Real spirals are vulnerable moments

---

## Development Environment

**Source:** `C:\Users\bwales\projects\obsidian-plugins\clarity`
**Deploy:** `G:\My Drive\IT\Obsidian Vault\My Notebooks\.obsidian\plugins\clarity`
**Build:** `npm run dev` (watches and copies to deploy target)

**Context Files (Read-Only):**
- `Health/Medical/Nuero-testing Results.md` - Neuropsych eval
- `Health/Mental Health/Session Log.md` - Therapy notes
- `Health/Mental Health/Shame Narrative Reframes - Daily Reminders.md` - Known reframes

**Output Files (Plugin Creates):**
- `Health/Mental Health/Clarity Logs/YYYY-MM-DD.md` - Spiral logs

---

## AI Provider Strategy

### Phase 1: Gemini (Current)
- **Why:** Free tier, zero cost while testing
- **Model:** `gemini-2.5-flash`
- **Limits:** 15 req/min, 1,500 req/day
- **API:** `@google/generative-ai` npm package

### Phase 2: Claude (After Windfall ~Week 3)
- **Why:** Better therapeutic responses, more nuanced
- **Model:** `claude-sonnet-4.5-20250514`
- **Cost:** ~$2-5/month with caching
- **API:** `@anthropic-ai/sdk` npm package

### Settings Toggle
User can switch providers in settings. Graceful fallback if preferred provider fails.

---

## Architecture Principles

### 1. Separation of Concerns
```
Components (UI)  →  Services (Logic)  →  Utils (Pure Functions)
```

- **Components:** Obsidian Modals (vanilla TS, no React)
- **Services:** AI calls, context loading, logging
- **Utils:** Sanitization, caching, file I/O

### 2. Privacy-First
- API keys stored in plugin `data.json` (standard Obsidian settings)
- No logging of API keys (even in debug mode)
- DOMPurify all AI outputs before rendering
- User controls what gets saved to logs

### 3. Mobile-Friendly
- Modals work on mobile Obsidian app
- Text inputs are touch-friendly
- No desktop-only features in Phase 1

---

## Key Services

### AIService
**Responsibility:** Abstract AI provider (Gemini or Claude)

```typescript
export class AIService {
  async generateReframe(context: string, spiral: string): Promise<string> {
    // Route to Gemini or Claude based on settings
  }
}
```

### ContextLoader
**Responsibility:** Load neuropsych eval, session logs, shame reframes

```typescript
export class ContextLoader {
  async loadContext(): Promise<string> {
    // Read files, parse, assemble context
  }

  private async loadRecentSessions(count: number): Promise<string> {
    // Extract last N sessions from Session Log
  }
}
```

### PromptBuilder
**Responsibility:** Build AI prompts with context + spiral

```typescript
export class PromptBuilder {
  buildSystemPrompt(context: string): string {
    // System instructions + context
  }

  buildUserPrompt(spiral: string, certainty: number): string {
    // Spiral + certainty + instructions
  }
}
```

### SpiralLogger
**Responsibility:** Save spirals + reframes to logs

```typescript
export class SpiralLogger {
  async logSpiral(spiral: Spiral, reframe: Reframe): Promise<void> {
    // Append to Health/Mental Health/Clarity Logs/YYYY-MM-DD.md
  }
}
```

---

## Data Models

### Spiral
```typescript
interface Spiral {
  id: string; // UUID
  timestamp: string; // ISO 8601
  narrative: string; // User input
  certainty: number; // 1-10 scale
  context?: string; // Optional additional context
}
```

### Reframe
```typescript
interface Reframe {
  id: string; // UUID
  spiralId: string; // Links to Spiral
  timestamp: string;
  content: string; // AI-generated reframe (sanitized)
  provider: 'gemini' | 'claude-sonnet' | 'claude-haiku';
  sources: string[]; // File paths cited
  moodBefore?: number; // Optional mood rating
  moodAfter?: number; // Optional mood rating
  helpful?: boolean; // User feedback
}
```

---

## Prompt Engineering

### System Prompt Structure

```
You are Clarity, a cognitive reframing assistant.

YOUR ROLE:
- Analyze catastrophizing using evidence from Brad's records
- Provide counter-narratives grounded in documented facts
- Cite specific sources (file paths, quotes)
- Distinguish TRUE vs. anxiety amplification

BRAD'S CONTEXT:
[Neuropsych eval, session insights, reframes]

GUIDELINES:
1. Start with "EVIDENCE AGAINST THIS NARRATIVE"
2. Cite sources with file paths
3. Identify patterns (parents' voice, hypervigilance)
4. End with "WHAT'S ACTUALLY TRUE"
5. Suggest next step if applicable

AVOID:
- Generic platitudes
- Dismissing the spiral
- Therapeutic jargon
```

### User Prompt Structure

```
SPIRAL: {narrative}
CERTAINTY: {1-10}
CONTEXT: {optional}

Provide evidence-based reframe with citations.
```

---

## Caching Strategy (Claude Only)

**Why:** Neuropsych eval + reframes rarely change. Cache them to save 90% on token costs.

```typescript
const systemPrompt = [
  {
    type: "text",
    text: neuropsychEval + shameReframes,
    cache_control: { type: "ephemeral" } // Cache for 5 min
  },
  {
    type: "text",
    text: recentSessionEntries // Fresh, not cached
  }
];
```

**Savings:** $0.034/request → $0.02/request (40% cost reduction)

---

## Error Handling

### API Failures
```typescript
try {
  const reframe = await aiService.generateReframe(context, spiral);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    new Notice('API rate limit hit. Try again in a minute.');
  } else if (error.code === 'INVALID_KEY') {
    new Notice('Invalid API key. Check settings.');
  } else {
    new Notice('Reframe failed. Check console for details.');
    console.error('AI error:', error);
  }
}
```

### Missing Context Files
```typescript
if (!neuropsychEval) {
  new Notice('Neuropsych eval not found. Reframe may be less accurate.');
  // Continue with partial context
}
```

### Graceful Degradation
- If preferred provider fails, try fallback
- If all providers fail, show helpful error
- Never crash the plugin

---

## Testing Protocol

### Test Spiral (From Today's Session)
```
Spiral: "I don't deserve accommodations. I'm just being needy and should toughen up."
Certainty: 8/10
Context: Math teacher hasn't approved homework accommodation yet, parents' disapproving voice
```

**Expected Reframe Should Include:**
- Citation to neuropsych eval (ADHD diagnosis)
- Citation to session log (ACCESS approval)
- Pattern recognition (parents' tough love framework)
- Distinction: Needy vs. reasonable accommodation
- Next step: Email teacher when mood > 5

### Manual Test Checklist
- [ ] Input spiral → receive reframe
- [ ] Reframe cites correct files
- [ ] Sources link to actual file paths
- [ ] Output is sanitized (no XSS)
- [ ] Works on mobile
- [ ] Settings panel saves correctly
- [ ] Log files created in correct location

---

## Session Handoff Protocol

At end of each session:

1. **Update `Handoff Log.md`** with:
   - What was built/tested
   - Any bugs discovered
   - Next session starting point

2. **Suggest commit message:**
   ```bash
   git commit -m "feat: implement reframe modal with Gemini integration"
   ```

3. **Test before documenting:**
   - Build plugin
   - Test in Obsidian (dev vault)
   - Verify core functionality works
   - THEN update docs

---

## Workflow Guidelines

### The "Brad Protocol"
- **Micro-steps:** Break coding into atomic tasks
- **Therapeutic tone:** Remember this is mental health support
- **Privacy-first:** Never log sensitive data
- **Mobile-aware:** Test on mobile if possible

### Don't:
- ❌ Generic therapy advice ("everyone struggles")
- ❌ Dismissive reframes ("you're overthinking")
- ❌ Log API keys anywhere
- ❌ Skip DOMPurify sanitization
- ❌ Break mobile compatibility

### Do:
- ✅ Use Brad's documented evidence
- ✅ Cite specific file paths
- ✅ Handle errors gracefully
- ✅ Test with real spirals
- ✅ Keep it under 2 min from input to reframe

---

## Security Checklist

- [ ] API keys stored in plugin settings (`data.json`)
- [ ] Settings UI uses password field for API key entry
- [ ] DOMPurify all AI outputs
- [ ] No logging of sensitive data
- [ ] No hardcoded API keys
- [ ] Graceful handling of missing keys

---

## Open Questions for User

1. Auto-save spirals to log, or ask first?
2. Include mood rating before/after in log?
3. How many session log entries to include? (3 sessions vs 2 weeks)
4. Should reframes suggest next actions?
5. Integrate with daily mood tracker notes?

---

**When in doubt, prioritize:**
1. Privacy (API keys, sensitive data)
2. Speed (under 2 min reframes)
3. Evidence (cite Brad's files, not generic advice)
4. Mobile (must work on phone)
