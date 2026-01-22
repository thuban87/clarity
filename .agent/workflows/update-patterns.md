---
description: How to update Clarity Patterns file with local AI
---

# Update Clarity Patterns

This workflow shows how to update your `Clarity Patterns.md` file using local AI (Antigravity or Claude CLI).

## When to Run
- Weekly (recommended)
- After a batch of new spirals/reframes
- When you notice the pattern library isn't catching common spirals

## Prerequisites
- Have Clarity logs accumulated in `Health/Mental Health/Clarity Logs/`
- Pattern file exists at configured path (default: `Health/Mental Health/Clarity Patterns.md`)
- **Note:** Unhelpful reframes are archived to `Clarity Logs/Archived - Unhelpful/` — exclude this folder from pattern scans!

---

## For Antigravity (Gemini CLI in VS Code)

Paste this prompt:

```
I need you to analyze my Clarity spiral logs and update my pattern file.

1. Read the logs from: Health/Mental Health/Clarity Logs/
2. Read the current patterns from: Health/Mental Health/Clarity Patterns.md (if it exists)
3. Identify recurring spiral themes (look for similar triggers, narratives, concerns)
4. For each pattern found:
   - Extract common trigger keywords
   - Note frequency of occurrence
   - Identify the most effective reframe (what worked best)
   - List source files
5. Update the pattern file with new patterns or refine existing ones

Use this format for each pattern:

## Pattern: [Pattern Name]
- **Triggers:** keyword1, keyword2, keyword3
- **Frequency:** X occurrences
- **Effective Reframe:**
  > [The reframe content that worked well]
- **Sources:** file1.md, file2.md
```

---

## For Claude CLI

```bash
claude "Analyze my Clarity logs and update my pattern file. 
Logs are in: Health/Mental Health/Clarity Logs/
Patterns file: Health/Mental Health/Clarity Patterns.md

Identify recurring spirals, extract trigger keywords, and update the patterns file with effective reframes."
```

---

## Pattern File Format

```markdown
---
lastUpdated: 2026-01-22
totalPatterns: 3
---

## Pattern: Accommodation Worthiness
- **Triggers:** don't deserve, needy, burden, accommodations, help, weak
- **Frequency:** 12 occurrences
- **Effective Reframe:**
  > EVIDENCE: Neuropsych eval confirms ADHD diagnosis. ACCESS approved accommodations legally.
  > This is "hard mode vs easy mode" - documented disability, not weakness.
- **Sources:** Nuero-testing Results.md, Session Log

## Pattern: Parents' Validation
- **Triggers:** mom, dad, parents, approval, disappointed, good enough
- **Frequency:** 8 occurrences  
- **Effective Reframe:**
  > Whose voice is this? This is their belief framework, not documented truth.
  > Your documented successes exist independent of their acknowledgment.
- **Sources:** Session Log, Shame Narrative Reframes
```

---

## After Updating

1. Patterns are cached for 1 minute in the plugin
2. Close and reopen Obsidian, OR
3. Toggle Pattern Mode off/on in settings to force reload

The plugin will now match new spirals against your updated patterns!
