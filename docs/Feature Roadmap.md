# Clarity - Feature Roadmap

**Purpose:** Scope creep parking lot. Ideas for future phases.
**Rule:** DO NOT BUILD THESE until Phase 1 is stable and tested.

---

## Phase 2: Pattern Library (Cost Reduction)

**Problem:** Calling API for every spiral costs money.

**Solution:** Local pattern matching before API.

**Features:**
- Analyze past spirals and reframes (from logs)
- Build pattern library of common spirals
- Match new spiral against known patterns
- If match >80% confidence, show cached reframe
- Only call API for novel spirals

**Example:**
```
User: "I don't deserve accommodations..."
Plugin: "You've had this spiral 5 times. Here's what helped before."
[Show previous reframe]
[Button: "Generate Fresh Reframe" if needed]
```

**Benefits:**
- Reduces API costs by 50-70%
- Instant reframes for known patterns
- Shows progress ("you've worked through this before")

**Complexity:** Medium (requires text similarity matching)

---

## Phase 3: Hypervigilance Detector

**Problem:** Brad's "daydreaming" is often hypervigilant catastrophizing, hard to distinguish in the moment.

**Solution:** Analyze daily notes for catastrophizing patterns.

**Features:**
- Scan daily tracker notes for keywords:
  - "what if", "what would they think", "I should", "I'm being"
- Count occurrences, flag threshold (e.g., 10+ "what if" in one day)
- Notification: "Hypervigilance mode detected. Take a breath."
- Suggest grounding exercises

**Example:**
```
Daily Note Analysis:
🔴 Hypervigilance Alert

Detected patterns:
• "What if" used 12 times today
• "What would other people think" - 5 times
• "I should" - 8 times

This is the catastrophizing loop from Session Log (2026-01-16).
You're running threat assessments, not actually daydreaming.

Suggested: Walk Obi, 5-minute breathing exercise, or use Clarity reframe.
```

**Complexity:** Medium (text analysis, pattern detection)

---

## Phase 4: Parents' Voice vs Reality Mode

**Problem:** Specific pattern - parents' validation withholding and "tough love" framework shows up repeatedly.

**Solution:** Dedicated reframe mode for family narratives.

**Features:**
- Toggle in settings: "Family Pattern Reframe"
- Side-by-side comparison modal:

```
┌─────────────────────────────────────────┐
│  Parents' Voice vs Reality              │
├─────────────────────────────────────────┤
│  PARENTS' FRAMEWORK:                    │
│  • Needing help = burden                │
│  • Struggling = moral failure           │
│  • Accommodations = weakness            │
│  • "I tried my best, not apologizing"   │
│                                         │
│  REALITY (DOCUMENTED):                  │
│  • You have diagnosed disabilities      │
│  • Accommodations = legal right (ADA)   │
│  • Doctor, ACCESS both approved         │
│  • French class punishment was          │
│    developmentally inappropriate        │
│                                         │
│  This is HER belief system, not truth.  │
└─────────────────────────────────────────┘
```

**Triggers:**
- Keywords: "parents", "validation", "needing help", "burden"
- Auto-detect family pattern spirals

**Complexity:** Low (template-based)

---

## Phase 5: Session Mode (Multi-Turn Conversation)

**Problem:** Single reframe might not be enough for complex spirals.

**Solution:** Conversational mode with follow-up.

**Features:**
- "Deep Dive" button in ResultModal
- Opens chat interface
- AI can ask clarifying questions:
  - "What specifically makes you think that?"
  - "Has this happened before? When?"
  - "What evidence are you using to conclude this?"
- Multi-turn conversation until user says "done"
- Log entire session as one entry

**Example:**
```
User: "I don't deserve accommodations."
AI: [Standard reframe]

User: "Deep Dive"
AI: "What specifically makes you feel you don't deserve them?"
User: "Everyone else seems to manage fine."
AI: "Are you comparing your hard-mode progress (ADHD + Crohn's + depression)
     to their easy-mode results (no documented disabilities)?"
User: "...yeah, I guess so."
AI: "This is the 'Not A Real Adult' pattern from Session Log 2026-01-21.
     You're comparing apples to oranges."
```

**Complexity:** High (conversational AI, state management)

---

## Phase 6: Integration with Mood Tracker

**Problem:** Spirals often correlate with mood drops.

**Solution:** Auto-suggest Clarity when mood drops.

**Features:**
- Monitor daily tracker notes (`Health/Mental Health/Tracker Notes/`)
- Detect significant mood drop (e.g., 7→3 like today)
- Notification: "Mood dropped to 3. Check in with Clarity?"
- One-click open reframe modal
- Log reframe to daily tracker note automatically

**Example Daily Note Entry:**
```markdown
## 2026-01-21 (Tuesday)

mood: 3
energy: 6
anxiety: 8

### Clarity Session (14:30)
**Spiral:** I don't deserve accommodations...
**Reframe:** [Brief summary]
**Mood After:** 5/10 (improved)
```

**Complexity:** Medium (file monitoring, auto-logging)

---

## Phase 7: Voice Input (Mobile Convenience)

**Problem:** Typing spirals on mobile is friction.

**Solution:** Voice-to-text for spiral input.

**Features:**
- "Record Spiral" button in modal
- Use browser's native speech recognition
- Transcribe to text, user can edit
- Submit for reframe

**Benefits:**
- Faster on mobile
- Lower friction during emotional moments
- Hands-free option

**Complexity:** Low (browser API)

---

## Phase 8: Haiku Mode (Budget Option)

**Problem:** Claude is expensive for simple spirals.

**Solution:** Use Claude Haiku (20x cheaper) for straightforward cases.

**Features:**
- Settings: "Budget Mode" toggle
- Auto-detect spiral complexity:
  - Simple = single pattern (parents' voice, height anxiety)
  - Complex = multiple patterns, novel spiral
- Route simple → Haiku ($0.001/reframe)
- Route complex → Sonnet ($0.02/reframe)

**Savings:** ~70% cost reduction for most use cases

**Complexity:** Medium (complexity detection logic)

---

## Phase 9: Weekly Pattern Report

**Problem:** Hard to see trends in spirals over time.

**Solution:** Auto-generated weekly summary.

**Features:**
- Analyze last 7 days of Clarity logs
- Identify patterns:
  - Most common spirals
  - Most effective reframes
  - Mood correlation
- Generate report:

```markdown
# Clarity Weekly Report - Jan 14-20

## Spiral Patterns
1. Accommodations/worthiness (5 times)
2. Parents' validation (3 times)
3. Height anxiety (2 times)

## Most Effective Reframes
✅ Neuropsych eval citations (worked 8/10 times)
✅ "Hard mode vs easy mode" comparison (worked 7/10 times)
⚠️ Generic "be kind to yourself" (worked 2/10 times)

## Mood Impact
Average mood before: 4.2
Average mood after: 5.8
Improvement: +38%

## Recommendation
Pattern library could handle accommodations spiral automatically now.
```

**Complexity:** Medium (log analysis, reporting)

---

## Phase 10: Therapist Export Mode

**Problem:** Want to share Clarity insights with real therapist.

**Solution:** Export formatted summary for therapy sessions.

**Features:**
- "Export for Therapist" button in logs
- Generates sanitized report:
  - Spiral patterns (anonymized if needed)
  - Reframe strategies that worked
  - Mood correlation data
  - No private details (names, specifics)
- Copy to clipboard or save as PDF

**Example:**
```markdown
Clarity Summary - January 2026

Common Thought Patterns:
1. Self-worth related to accommodations
2. Family validation concerns
3. Comparative thinking (self vs peers)

Effective Counter-Strategies:
• Evidence from diagnostic assessments
• Pattern recognition (whose voice is this?)
• Hard-mode vs easy-mode reframing

Progress Indicators:
• Using tool 2-3x/week consistently
• Average mood improvement: +1.5 points
• Faster spiral recovery (8 hrs → 2 hrs)
```

**Complexity:** Low (template-based export)

---

## Phase 11: Orbit Integration (Social Spiral Support)

**Problem:** Social anxiety spirals relate to Orbit contacts.

**Solution:** Cross-plugin context loading.

**Features:**
- Detect social spiral keywords ("awkward", "ghosting", "burden")
- Load Orbit context:
  - Last contact date
  - Relationship category (Charger/Drain/Neutral)
  - "Conversational Fuel" from contact note
- Reframe includes:
  - "Dad is a Charger - he WANTS to hear from you"
  - "Last talked 5 days ago - well within 'weekly' orbit"
  - "Conversational Fuel: Ask about Costa Rica trip"

**Example:**
```
Spiral: "I should call Dad but it's been too long and it'll be awkward."

Reframe:
ORBIT CONTEXT:
• Dad: Weekly orbit, last contact 5 days ago (ON SCHEDULE)
• Category: Charger (energizes you, not drains)
• He texted you first 3/5 recent contacts (he wants to talk)

CONVERSATIONAL FUEL:
• Ask about Costa Rica trip (Jan 18-28)
• Thank him for car insurance help
• Update on school accommodation win

This isn't awkward. This is literally ON TIME for your orbit frequency.
```

**Complexity:** Medium (cross-plugin data reading)

---

## Phase 12: Quick Reframe Button (Status Bar)

**Problem:** Opening command palette during spiral adds friction.

**Solution:** Always-visible status bar button.

**Features:**
- Status bar icon: 🧭 (compass)
- One-click opens reframe modal
- Color changes based on recent usage:
  - Green: Last used >24 hrs ago (doing well)
  - Yellow: Used 2-3 times today (rough day)
  - Red: Used 5+ times today (crisis mode - suggest calling therapist)

**Complexity:** Low (status bar API)

---

## Phase 13: Favorites/Bookmarks

**Problem:** Some reframes are particularly helpful and you want to revisit them.

**Solution:** Bookmark system.

**Features:**
- Star icon in ResultModal
- "Favorites" view in settings
- Quick access to best reframes
- Share favorites with therapist

**Complexity:** Low (data structure + UI)

---

## Phase 14: Public Release Considerations

**If this ever goes public (far future):**

**Privacy Challenges:**
- Users need their own API keys (documented setup)
- Can't include Brad's specific context files
- Need generic onboarding flow

**Generic Onboarding:**
1. "Create your context file" guide
2. Template for neuropsych/therapy notes
3. Example reframes for common spirals
4. Privacy-first messaging

**Community Value:**
- ADHD community would benefit
- Therapy supplement tool
- Evidence-based approach is unique

**Complexity:** High (onboarding UX, documentation, support)

---

## Ideas from Future Sessions

*(Add new ideas here as they come up)*

---

**Remember:** Phase 1 must be stable and tested before ANY of these get built.

Focus on core value: **Quick, evidence-based reframes using YOUR documented context.**

Don't let perfect be the enemy of good.
