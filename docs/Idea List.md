---
tags:
  - projects
  - active
  - clarity
  - ideas
---
## Planned Phases

Phase 2: Pattern Library (Cost Reduction)
  Goal: Reduce API costs by matching new spirals to previously solved ones.
   - [x] Build indexer to read past spirals/reframes from Health/Mental Health/Clarity Logs/
   - [x] Implement local text similarity algorithm (fuzzy matching)
   - [x] Create logic to display cached reframe if match confidence > 80%
   - [x] Add "Generate Fresh Reframe" button for overrides

  Phase 3: Hypervigilance Detector
  Goal: Distinguish between daydreaming and active threat assessment.
   - [ ] Implement daily note scanner (watcher) for Health/Mental Health/Tracker Notes/
   - [ ] Create keyword counter for specific triggers ("what if", "everyone thinks", "I should")
   - [ ] Set up threshold logic (e.g., >10 occurrences = alert)
   - [ ] Build notification system: "Hypervigilance detected, try grounding"

  Phase 4: Mom's Voice vs Reality Mode
  Goal: Specifically target family-origin narratives with a side-by-side comparison.
   - [ ] Add "Family Pattern Reframe" toggle in settings
   - [ ] Create "Mom's Framework vs. Reality" comparison template
   - [ ] Implement keyword detection for family triggers ("mom", "burden", "validation")
   - [ ] Hardcode the specific "Reality" evidence (ADA rights, diagnoses) for this mode

  Phase 5: Session Mode
  Goal: Allow for multi-turn exploration of complex spirals.
   - [ ] Create "Deep Dive" button in the Result Modal
   - [ ] Build chat interface (UI component) for back-and-forth interaction
   - [ ] Implement conversational state management (keeping history context)
   - [ ] Update logger to save full conversation threads, not just single reframes

  Phase 6: Mood Tracker Integration
  Goal: Proactively offer help when mood drops.
   - [ ] Create file watcher for Daily Tracker notes
   - [ ] Implement logic to parse "mood: X" frontmatter or inline fields
   - [ ] Add trigger: If mood drops significantly (e.g., >3 points) or hits low threshold
   - [ ] Auto-log Clarity usage back into the Daily Note

  Phase 7: Voice Input
  Goal: Reduce friction for logging spirals on mobile.
   - [ ] Add "Record" button to the main Reframe Modal
   - [ ] Implement browser native Speech-to-Text API
   - [ ] Create transcription review/edit view before submission

  Phase 8: Haiku Mode (Budgeting)
  Goal: Use cheaper models for simple problems.
   - [ ] Add "Budget Mode" toggle in settings
   - [ ] Implement complexity router (Simple Pattern vs. Complex/Novel)
   - [ ] Route simple queries to Claude Haiku ($0.001) and complex to Sonnet ($0.02)

  Phase 9: Weekly Pattern Report
  Goal: Visualize progress and recurring themes.
   - [ ] Implement log analysis service (last 7 days)
   - [ ] Create aggregation logic for most common spiral types
   - [ ] Calculate "Mood Improvement" metrics (avg before vs. avg after)
   - [ ] Generate Markdown report file automatically on Mondays

  Phase 10: Therapist Export Mode
  Goal: Share insights without sharing raw data.
   - [ ] Create "Export" action in the settings or ribbon
   - [ ] Implement PII sanitizer (remove specific names if configured)
   - [ ] Format output for readability (Summarized Patterns, effective strategies)
   - [ ] Add "Copy to Clipboard" or "Save as PDF" function

  Phase 11: Orbit Integration
  Goal: Context-aware reframes for social anxiety.
   - [ ] Implement Cross-Plugin reading (read Orbit data files)
   - [ ] Fetch "Last Contact Date" and "Relationship Category" (Charger/Drain)
   - [ ] Inject Orbit data into the AI Context Prompt
   - [ ] Create specific social reframe logic ("You are within frequency", "Conversational Fuel")

  Phase 12: Quick Reframe (Status Bar)
  Goal: Immediate access and usage visualization.
   - [ ] Add clickable Compass icon 🧭 to Obsidian Status Bar
   - [ ] Implement color-coding logic (Green = unused recently, Red = high usage/crisis)
   - [ ] Hook click event to open Reframe Modal

  Phase 13: Favorites/Bookmarks
  Goal: Save the "gold standard" reframes.
   - [ ] Add "Star" icon to Result Modal
   - [ ] Create "Favorites" storage (json or separate markdown file)
   - [ ] Build "View Favorites" UI tab or command

  Phase 14: Public Release Prep
  Goal: generalize the tool for others.
   - [ ] Refactor Context Loader to handle generic file paths
   - [ ] Create onboarding "Wizard" to help users create their own Context files
   - [ ] Write documentation on how to get/secure personal API keys
   - [ ] Remove hardcoded "Brad" references from prompts

## New Ideas
