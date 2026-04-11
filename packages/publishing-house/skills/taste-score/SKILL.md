---
name: taste-score
description: Run the TASTE 5D quality gate on any markdown content. Offline, deterministic, no API calls required.
trigger: on-demand
version: 0.3.0
author: FrankX
claw: media-claw
luminor: Lyria
gate: Sight
inputs:
  - name: content
    type: string
    description: Markdown content to score
    required: true
  - name: metadata
    type: object
    description: Title, author, language, collection
    required: true
  - name: world_context
    type: object
    description: Characters, factions, locations from World Graph
    required: false
outputs:
  - name: technical
    type: int
    description: Technical Fit score (0-100)
  - name: aesthetic
    type: int
    description: Aesthetic/Design score (0-100)
  - name: canon
    type: int
    description: Story/Canon alignment score (0-100)
  - name: impact
    type: int
    description: Transformative Impact score (0-100)
  - name: uniqueness
    type: int
    description: Experiential Uniqueness score (0-100)
  - name: total
    type: int
    description: Composite score (0-100)
  - name: tier
    type: string
    description: hero / gallery / thumbnail / reject
  - name: passes_gate
    type: boolean
    description: Whether content passes the 60-point gate
  - name: feedback
    type: "list[string]"
    description: Per-dimension feedback for revision
dependencies:
  node: [">=20"]
  typescript: ["@arcanea/publishing-house/quality"]
---

# TASTE 5D Quality Gate

Score any markdown content against 5 dimensions, no API calls needed.

**T** Technical Fit — formatting, structure, readability, link validity
**A** Aesthetic/Design — visual quality, typography, asset dimensions
**S** Story/Canon — alignment with World Graph (characters, factions, locations)
**T** Transformative Impact — hook strength, pacing, dialogue, sensory density
**E** Experiential Uniqueness — originality, anti-slop, vocabulary diversity

## Runtime

Fully offline. Runs on any Node 20+ environment. No dependencies on external APIs.

## Usage

```javascript
import { scoreTASTE } from '@arcanea/publishing-house/quality/taste-gate';

const result = await scoreTASTE({
  content: markdownString,
  metadata: { title: 'Chapter 1', author: 'FrankX', language: 'en' },
  worldContext: {
    characters: ['Lumina', 'Nero', 'Taelith'],
    factions: ['Starlight Corps'],
    locations: ['Crystalpeak'],
  },
});

console.log(result.total, result.tier);
// 93 "hero"
```

## Verified Performance

Tested on `book/luminor-rising/the-first-bonding/chapter-01-the-warmth-before-the-name.md`:

```
Technical:   100/100
Aesthetic:    87/100
Canon:       100/100
Impact:       79/100
Uniqueness:  100/100
TOTAL:        93/100 (HERO)
```
