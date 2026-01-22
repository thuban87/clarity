---
tags:
  - projects
  - active
  - clarity
  - mental-health
status: Active
priority: High
created: 2026-01-21
---
# Clarity - Project Summary

**Tagline:** Evidence-based cognitive reframing, in your pocket.
**Core Concept:** Obsidian plugin that counters catastrophizing spirals with evidence from your own neuropsych eval, therapy notes, and session logs.
**Type:** Personal mental health tool (potential public release with privacy considerations)

---

## The Problem

**Today's example:** Mood dropped 7→3 because you spent all day in catastrophizing loops:
- "I don't deserve accommodations" (despite doctor, ACCESS, ADA all saying you do)
- Rehearsing arguments with math teacher that haven't happened yet
- Couldn't even win in your own imagination
- Parents' validation withholding voice playing on repeat

**The pattern:**
- Spirals happen when you're NOT at your PC (can't access Claude Code therapy sessions)
- Catastrophizing feels TRUE in the moment
- Evidence exists (neuropsych eval, session reframes, past patterns) but you can't access it quickly
- Need to interrupt the loop BEFORE it tanks your mood for hours

**Current solution:**
- Wait until PC access
- Start Claude Code session
- Process the spiral (30+ min conversation)
- By then, mood already dropped and day is wasted

**What you need:**
- Quick access (phone or PC)
- Evidence-based reframe in under 2 minutes
- Pocket-sized therapist for pennies

---

## The Solution: Clarity

A plugin that provides **evidence-based cognitive reframing** using AI and your own documented context.

**Input:** Current spiral/narrative
**Process:** AI analyzes using your neuropsych eval, session logs, and shame reframes
**Output:** Counter-narrative with citations to YOUR evidence

**Example:**

**Input:**
> "I don't deserve accommodations. I'm just being needy and should toughen up."

**Output:**
```
🧭 Clarity Reframe

EVIDENCE AGAINST THIS NARRATIVE:

1. Medical Documentation (Neuropsych Eval, Oct 2025):
   • Moderate ADHD, Combined Presentation (CONFIRMED diagnosis)
   • Processing Speed Index: 63rd percentile (relative weakness)
   • You literally have documented disabilities

2. Legal Right (Session Log, 2026-01-21):
   • Doctor provided disability letter
   • ACCESS office approved accommodation
   • ADA protects this - not optional, not negotiable

3. Pattern Recognition (Session Log, 2026-01-16):
   • This is parents' "tough love" framework, not reality
   • "Needing help = burden" is HER belief, not medical fact
   • Previous therapist dismissed you → you left her

WHAT'S ACTUALLY TRUE:
• Accommodations = leveling the playing field (EQUAL access)
• Needy = wanting special treatment you don't need
• Reasonable = equal access via different method
• You're asking for the SECOND thing, not the first

NEXT STEP:
Email teacher with ACCESS backing when mood > 5.
Simple, reasonable: "ACCESS approved computer accommodation,
can I submit work as PDF instead of photo uploads?"

Sources:
• Health/Medical/Nuero-testing Results.md (lines 42-58)
• Health/Mental Health/Session Log.md (2026-01-21)
• Health/Mental Health/Shame Narrative Reframes - Daily Reminders.md
```

**Result:** Spiral interrupted. Evidence presented. Next action clear.

---

## Core Features (Phase 1 - Build Tonight)

### 1. Reframe Generator (Main Feature)

**Command:** "Clarity: Reframe This"

**Modal opens:**
```
┌─────────────────────────────────────────┐
│  Clarity - Cognitive Reframe            │
├─────────────────────────────────────────┤
│  What's the narrative/spiral?           │
│  ┌─────────────────────────────────┐    │
│  │ I don't deserve accommodations  │    │
│  │ because I should just toughen   │    │
│  │ up and be normal...             │    │
│  └─────────────────────────────────┘    │
│                                         │
│  How certain are you? (1-10)            │
│  [────●────] 8                          │
│                                         │
│  [Generate Reframe]  [Cancel]           │
└─────────────────────────────────────────┘
```

**Processing:**
1. Read context files:
   - `Health/Medical/Nuero-testing Results.md` (neuropsych eval)
   - `Health/Mental Health/Session Log.md` (recent entries)
   - `Health/Mental Health/Shame Narrative Reframes - Daily Reminders.md`
2. Send to AI (Gemini initially, Claude later):
   - Context: Eval + reframes + recent session notes
   - Spiral: User's input
   - Certainty: 8/10
3. AI generates counter-narrative with citations
4. Display in modal

**Output Modal:**
```
┌─────────────────────────────────────────┐
│  🧭 Clarity Reframe                     │
├─────────────────────────────────────────┤
│  [Reframe content here...]              │
│                                         │
│  Sources:                               │
│  • Health/Medical/Nuero-testing...      │
│  • Health/Mental Health/Session Log     │
│                                         │
│  [Copy to Clipboard] [Save Log] [Close] │
└─────────────────────────────────────────┘
```

---

### 2. Spiral Logger

**Auto-save spirals and reframes to:**
`Health/Mental Health/Clarity Logs/YYYY-MM-DD.md`

**Format:**
```markdown
## 2026-01-21 - 14:30

**Spiral:** I don't deserve accommodations...
**Certainty:** 8/10
**Context:** Math teacher situation, parents' validation withholding

**Reframe:**
[AI-generated reframe content]

**Mood After:** 5/10 (improved from 3/10)
**Helpful:** Yes
```

**Why log:**
- Track patterns (recurring spirals)
- See which reframes work
- Data for pattern library (future phase)
- Reference for therapy sessions

---

### 3. Settings Panel

**Configuration:**

```
┌─────────────────────────────────────────┐
│  Clarity Settings                       │
├─────────────────────────────────────────┤
│  AI Provider                            │
│  ( ) Gemini (free, backup)              │
│  (•) Claude Sonnet 4.5 (preferred)      │
│  ( ) Claude Haiku (budget mode)         │
│                                         │
│  API Keys                               │
│  Gemini: [●●●●●●●●] (set)               │
│  Claude: [●●●●●●●●] (set)               │
│                                         │
│  Context Files (auto-detected)          │
│  ☑ Neuropsych Eval                      │
│  ☑ Session Log (recent 10 entries)      │
│  ☑ Shame Reframes Doc                   │
│                                         │
│  Advanced                               │
│  ☑ Enable prompt caching (saves $)      │
│  ☑ Log spirals automatically            │
│  ☐ Ask for mood rating after reframe    │
│                                         │
│  [Save Settings]                        │
└─────────────────────────────────────────┘
```

---

### 4. Quick Commands

**Command Palette:**
- `Clarity: Reframe This` - Main reframe modal
- `Clarity: View Logs` - Open logs folder
- `Clarity: Check API Status` - Test connection + show estimated costs

**Ribbon Icon:** 🧭 (compass emoji)

**Hotkey:** Configurable (suggest: Ctrl+Shift+C for "Clarity")

---

## Technical Architecture

### File Structure

```
clarity/
├── main.ts                    # Plugin entry point
├── manifest.json
├── styles.css
├── src/
│   ├── components/
│   │   ├── ReframeModal.ts    # Main input modal
│   │   ├── ResultModal.ts     # Reframe display
│   │   └── SettingsTab.ts     # Settings UI
│   ├── services/
│   │   ├── AIService.ts       # API calls (Gemini + Claude)
│   │   ├── ContextLoader.ts   # Load neuropsych eval, session logs
│   │   ├── SpiralLogger.ts    # Save logs
│   │   └── PromptBuilder.ts   # Build AI prompts
│   ├── models/
│   │   ├── Spiral.ts          # Spiral data structure
│   │   └── Reframe.ts         # Reframe data structure
│   ├── utils/
│   │   ├── sanitizer.ts       # DOMPurify for AI output
│   │   └── caching.ts         # Prompt caching logic
│   └── settings.ts            # Settings interface
└── README.md
```

### Data Flow

```
User input (spiral)
    ↓
ContextLoader reads files
    ↓
PromptBuilder assembles context + spiral
    ↓
AIService calls API (Gemini or Claude)
    ↓
Sanitize output (DOMPurify)
    ↓
Display in ResultModal
    ↓
SpiralLogger saves to logs (if enabled)
```

---

## AI Integration Strategy

### Phase 1: Gemini (Free Tier)

**Why start with Gemini:**
- Free tier: 15 requests/minute, 1,500 requests/day
- Zero cost while testing
- Good enough for MVP
- Brad's existing Ultra subscription

**Gemini API Setup:**
```typescript
// src/services/GeminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateReframe(context: string, spiral: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-pro"
    });

    const prompt = `${context}\n\nSpiral: ${spiral}\n\nGenerate evidence-based reframe.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
```

**Cost:** $0 (free tier)

---

### Phase 2: Claude Migration (When Money Clears)

**Why upgrade to Claude:**
- Better therapeutic responses (you've experienced this)
- More nuanced understanding of complex spirals
- Consistent quality

**Claude API Setup:**
```typescript
// src/services/ClaudeService.ts
import Anthropic from "@anthropic-ai/sdk";

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateReframe(
    context: string,
    spiral: string,
    useCache: boolean = true
  ): Promise<string> {
    const systemPrompt = [
      {
        type: "text",
        text: context, // Neuropsych eval + session logs
        cache_control: useCache ? { type: "ephemeral" } : undefined
      }
    ];

    const response = await this.client.messages.create({
      model: "claude-sonnet-4.5-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `Spiral: ${spiral}\n\nProvide evidence-based reframe with citations.`
      }]
    });

    return response.content[0].text;
  }
}
```

**Cost Estimates (with caching):**
- Light use (1-2/day): $0.60-1.20/month
- Moderate (3-5/day): $1.80-3.00/month
- Heavy (8-10/day): $4.80-6.00/month

---

### Provider Abstraction

**Settings determine which service to use:**

```typescript
// src/services/AIService.ts
export class AIService {
  private gemini: GeminiService;
  private claude: ClaudeService;
  private provider: 'gemini' | 'claude-sonnet' | 'claude-haiku';

  async generateReframe(context: string, spiral: string): Promise<string> {
    switch (this.provider) {
      case 'gemini':
        return this.gemini.generateReframe(context, spiral);
      case 'claude-sonnet':
        return this.claude.generateReframe(context, spiral, true);
      case 'claude-haiku':
        return this.claudeHaiku.generateReframe(context, spiral);
    }
  }
}
```

**User can switch providers in settings:**
- Start with Gemini (free)
- Upgrade to Claude when money is available
- Fallback to Gemini if Claude quota exceeded

---

## Context Loading Strategy

### Files to Read

**1. Neuropsych Eval (cached, changes rarely):**
- Path: `Health/Medical/Nuero-testing Results.md`
- Contains: Diagnoses, cognitive profile, genetic context
- Size: ~15k chars (~4k tokens)
- Cache: Yes (rarely changes)

**2. Session Log (recent entries only):**
- Path: `Health/Mental Health/Session Log.md`
- Load: Last 3 sessions (or sessions from last 2 weeks)
- Contains: Recent patterns, insights, reframes
- Size: ~8k chars (~2k tokens)
- Cache: Yes (changes weekly)

**3. Shame Reframes Doc:**
- Path: `Health/Mental Health/Shame Narrative Reframes - Daily Reminders.md`
- Contains: Known spirals and counter-narratives
- Size: ~5k chars (~1.2k tokens)
- Cache: Yes (changes occasionally)

**Total context:** ~7k tokens (well under limits)

---

### Smart Context Loading

```typescript
// src/services/ContextLoader.ts
export class ContextLoader {
  async loadContext(): Promise<string> {
    const neuropsych = await this.loadNeuropsychEval();
    const recentSessions = await this.loadRecentSessions(3);
    const shameReframes = await this.loadShameReframes();

    return `
NEUROPSYCH CONTEXT:
${neuropsych}

RECENT SESSION INSIGHTS:
${recentSessions}

KNOWN REFRAMES:
${shameReframes}
    `.trim();
  }

  private async loadRecentSessions(count: number): Promise<string> {
    const sessionLog = await this.vault.read('Health/Mental Health/Session Log.md');

    // Parse markdown, extract last N sessions
    const sessions = this.parseSessionEntries(sessionLog);
    return sessions.slice(-count).join('\n\n');
  }
}
```

**Optimization:**
- Cache neuropsych eval (changes rarely)
- Cache shame reframes (changes occasionally)
- Only load recent session entries (not entire 500-line file)

---

## Prompt Engineering

### System Prompt Template

```
You are Clarity, a cognitive reframing assistant for Brad.

YOUR ROLE:
- Analyze catastrophizing narratives using evidence from Brad's records
- Provide counter-narratives grounded in documented facts
- Cite specific sources (file paths, dates, quotes)
- Distinguish between what's TRUE and what anxiety is amplifying

BRAD'S CONTEXT:
[Neuropsych eval, session insights, known reframes loaded here]

GUIDELINES:
1. Start with "EVIDENCE AGAINST THIS NARRATIVE"
2. Cite specific sources with file paths
3. Distinguish patterns (parents' voice vs reality, hypervigilance vs truth)
4. End with "WHAT'S ACTUALLY TRUE" summary
5. Suggest concrete next step if applicable
6. Use compassionate but direct tone

AVOID:
- Generic platitudes ("everyone struggles sometimes")
- Dismissing the spiral ("you're overthinking")
- Suggesting "just don't worry about it"
- Therapeutic jargon
```

---

### User Prompt Template

```
SPIRAL: {user_input}

CERTAINTY: {1-10 scale}

CONTEXT: {optional additional context from user}

Provide evidence-based reframe with citations to Brad's documented evidence.
```

---

## Privacy & Security

### API Key Storage

**Use Obsidian Keychain (SecretStorage API):**

Obsidian v1.11.4+ provides a built-in secrets API that uses OS-level secure storage (Windows Credential Manager, macOS Keychain, etc.).

**Store API key (from Settings UI):**
```typescript
// When user enters API key in settings
await this.app.vault.adapter.secrets.store('clarity-gemini-key', apiKey);
await this.app.vault.adapter.secrets.store('clarity-claude-key', claudeKey);
```

**Retrieve API key (in AI service):**
```typescript
// src/services/AIService.ts
const geminiKey = await this.app.vault.adapter.secrets.get('clarity-gemini-key');
const claudeKey = await this.app.vault.adapter.secrets.get('clarity-claude-key');
```

**Delete API key (if user clears it):**
```typescript
await this.app.vault.adapter.secrets.delete('clarity-gemini-key');
```

**Benefits:**
- OS-encrypted at rest (not plaintext in data.json)
- Per-device storage (keys don't sync, more secure)
- Native Obsidian API (no custom loaders needed)
- User enters key once per device in Settings UI

---

### Output Sanitization

**Problem:** AI could hallucinate XSS in reframe text.

**Solution:** DOMPurify

```typescript
import DOMPurify from 'dompurify';

const sanitizedOutput = DOMPurify.sanitize(aiResponse, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: []
});
```

---

## Success Criteria

**Phase 1 succeeds if:**
- [x] You can input a spiral and get evidence-based reframe in <2 min
- [x] Output cites YOUR documented evidence (not generic advice)
- [x] Works on mobile (Obsidian mobile app)
- [x] Costs are manageable (Gemini free, Claude <$5/month)
- [x] You actually USE it during spirals instead of waiting for PC

**The plugin has FAILED if:**
- Reframes feel generic/unhelpful (like bad therapy)
- Too slow (takes 5+ min to get reframe)
- Too expensive (can't afford to use it)
- You forget it exists and don't use it

---

## Phase 1 Checklist (Build Tonight)

### Core Functionality
- [ ] Plugin scaffold (main.ts, manifest.json, settings)
- [ ] ReframeModal component (input spiral + certainty)
- [ ] ContextLoader service (load neuropsych, session log, reframes)
- [ ] GeminiService (API integration)
- [ ] PromptBuilder (assemble context + spiral)
- [ ] ResultModal (display reframe with citations)
- [ ] Sanitizer (DOMPurify for AI output)
- [ ] Settings tab (API key input, provider selection)

### Testing
- [ ] Test with real spiral from today ("I don't deserve accommodations")
- [ ] Verify citations point to correct files
- [ ] Test on mobile (Obsidian app)
- [ ] Test Gemini API integration
- [ ] Verify sanitization works

### Polish
- [ ] Ribbon icon (compass emoji 🧭)
- [ ] Command palette entry
- [ ] Hotkey assignment
- [ ] Error handling (API failures, missing files)
- [ ] Loading states (show spinner while processing)

**Target:** 3-4 hours to MVP

---

## Future Phases (Scope Creep Territory - Document, Don't Build Yet)

### Phase 2: Pattern Library (Cost Reduction)
- Local matching of known spirals before calling API
- "You've had this spiral 5 times before. Here's what helped last time."
- Reduces API costs by 50-70%

### Phase 3: Hypervigilance Detector
- Analyze journal entries for catastrophizing language
- "You've used 'what if' 12 times today - hypervigilance mode active"
- Suggest grounding exercises

### Phase 4: Parents' Voice vs Reality
- Specific reframe mode for family narratives
- Side-by-side comparison: "What parents' voice says" vs "What's true"
- Track frequency of this pattern

### Phase 5: Session Mode
- Multi-turn conversation instead of single reframe
- "Tell me more about why you think that" → deeper exploration
- More like therapy session, less like quick lookup

### Phase 6: Integration with Mood Tracker
- Auto-suggest Clarity when mood drops significantly
- Log reframes to daily tracker notes
- Analyze correlation between spirals and mood patterns

**DO NOT BUILD THESE YET.** Park them in [[Idea List]].

---

## Cost Management Strategy

### Week 1-2 (Tight Budget)
- Use Gemini exclusively (free tier)
- Test, iterate, refine prompts
- Build pattern library foundation

### Week 3+ (After Windfall)
- Migrate to Claude Sonnet for quality
- Enable prompt caching (saves 90% on repeat context)
- Monitor costs via settings panel

### Long-Term
- Add local pattern matching (Phase 2)
- Fallback to Gemini if Claude quota exceeded
- Haiku mode for simple spirals (20x cheaper)

**Expected steady-state cost:** $2-3/month with smart caching + pattern matching

---

## Open Questions

1. Should reframes auto-save to log, or ask first?
   - **Auto-save:** Frictionless, good for pattern analysis
   - **Ask first:** Privacy control, less clutter

2. Should it integrate with daily mood tracker?
   - **Yes:** Auto-log spiral + reframe to daily note
   - **No:** Keep it standalone, less complex

3. How many session log entries to include in context?
   - **3 sessions:** Recent, manageable token count
   - **Last 2 weeks:** More context, higher cost

4. Should it suggest next actions (like therapy does)?
   - **Yes:** More helpful, actionable
   - **No:** Just reframe, user decides action

---

## Related Files

- `Health/Medical/Nuero-testing Results.md` - Neuropsych eval (context source)
- `Health/Mental Health/Session Log.md` - Therapy notes (context source)
- `Health/Mental Health/Shame Narrative Reframes - Daily Reminders.md` - Known reframes
- `Health/Mental Health/Clarity Logs/` - Spiral logs (created by plugin)

---

**Status:** Active (starting tonight)
**Priority:** High (therapeutic value + immediate need)
**Complexity:** Medium (AI integration, context loading)
**Timeline:** Phase 1 tonight (3-4 hours), refinement over weekend
**Cost:** $0 (Gemini) → $2-5/month (Claude after windfall)
