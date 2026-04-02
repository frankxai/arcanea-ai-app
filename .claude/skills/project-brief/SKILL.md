---
name: project-brief
description: Create a structured project brief from a vague idea. Turns "I want to build X" into a complete brief with scope, objects, milestones, and first tasks. Use when starting any new creative project, world, product, feature, or content series. Creates Linear issues, Notion pages, and planning files automatically.
---

# Project Brief — From Idea to Structured Plan

## Core Workflow

### 1. Capture the Seed
Ask (or extract from conversation):
- **What** — one sentence of what this is
- **Why** — what problem it solves or what it creates
- **For whom** — who benefits
- **Inspired by** — reference points (games, products, stories, sites)

### 2. Expand Into Brief

```markdown
# [Project Name]

## Vision
[One paragraph — what this becomes when it's great]

## Core Objects
[What are the main things this project produces?]
- Characters / Worlds / Docs / Art / Code / Products / Content

## Scope
### In Scope
- [explicit list]

### Out of Scope
- [explicit list — what this is NOT]

## Milestones
### M1: Foundation [1-2 weeks]
- [concrete deliverables]

### M2: Core Experience [2-4 weeks]
- [concrete deliverables]

### M3: Polish & Launch [2-4 weeks]
- [concrete deliverables]

## First Tasks (This Session)
1. [immediate action]
2. [immediate action]
3. [immediate action]

## Design Direction
- Visual style reference
- Tone/voice
- Key colors/mood

## Technical Needs
- Stack / tools / APIs
- Storage / hosting
- Dependencies
```

### 3. Create Artifacts
After brief approval, automatically create:

**Linear:**
- Project (if new)
- Milestone issues for M1, M2, M3
- First task issues

**Notion:**
- Project page under Arcanea Hub
- Brief as first subpage

**Repo:**
- Planning file in `planning-with-files/`
- Canon entry if world-building (validate with `/canon-check`)

**Memory:**
- Save project context to memory for future sessions

### 4. Suggest Skills
Based on the brief, recommend which skills to use:

| Project Type | Recommended Skills |
|-------------|-------------------|
| World-building | `/world-forge`, `/canon-check`, `/character-forge` |
| Visual/art | `/arcanea-infogenius`, `/vis-scan`, `/forge` |
| Music | `/create-music`, `/suno-ai-mastery` |
| Writing | `/ultrawrite`, `/create-story`, `/draft-zero` |
| Product | `/spec`, `/frontend-design`, `/component-forge` |
| Community | `/faction-reveal`, `/origin-quiz` |
| Dev/engineering | `/arcanea-dev`, `/ultracode`, `/tdd` |
