---
name: world-forge
description: Structured world-building workflow for creating consistent fantasy/sci-fi universes. Use when building new worlds, factions, magic systems, geography, cultures, timelines, or any universe element. Validates against existing canon, generates interconnected lore, and saves to the project graph. Works for Arcanea's own universe AND for any creator building their own world through the platform.
---

# World Forge — Build Universes That Hold Together

## Core Principle
Every world element must connect to at least 2 other elements. Isolated lore is dead lore.

## World-Building Layers

Build in this order — each layer depends on the previous:

### Layer 1: Cosmology
- What are the fundamental forces?
- Creation myth — how did this world begin?
- Cosmic duality or tension (Arcanea: Lumina/Nero)
- Validate: Does this contradict existing canon? → `/canon-check`

### Layer 2: Elements & Systems
- Magic / technology / power system
- Rules and limits (what CAN'T it do?)
- How is power gained, lost, transferred?
- Resource system (what's scarce, what's abundant?)

### Layer 3: Geography & Realms
- Major regions / realms / territories
- Climate, resources, natural features
- Borders, trade routes, conflict zones
- Map relationships (who borders whom, who trades with whom)

### Layer 4: Cultures & Factions
- Major groups and their values
- Government / leadership structures
- Relationships between factions (ally, rival, neutral)
- Naming conventions per culture
- Use `/character-forge` for key figures

### Layer 5: History & Timeline
- Major eras / ages
- Pivotal events
- How the present state came to be
- Prophecies or future tensions

### Layer 6: Daily Life
- What do ordinary people do?
- Economy, food, entertainment
- Coming-of-age, death rituals
- Technology level in daily life

## Output Format

For each world element, generate:

```markdown
# [Element Name]

## Classification
Type: [cosmology | element | geography | faction | history | culture]
Canon Status: [staging | evolving | locked]
Connected To: [list of related elements]

## Description
[2-3 paragraphs]

## Connections
- Relates to [X] because [why]
- Conflicts with [Y] because [why]
- Depends on [Z] because [why]

## Open Questions
- [unresolved tension or detail]

## Creator Notes
- [meta-notes about design intent]
```

## For Arcanea's Own Universe
Always validate against `.arcanea/lore/CANON_LOCKED.md`:
- Use existing Guardians, Gates, Elements, Houses
- Never contradict established duality (Lumina/Nero)
- Check faction naming conventions
- Run `/canon-check` before saving

## For Creator Worlds (on the platform)
- Save as project docs when docs system is live
- Link to creator's project graph
- Generate world bible as exportable document
- Suggest image prompts for key locations/characters via `/forge`

## Consistency Checks
After building, verify:
- [ ] Every faction has at least one ally and one rival
- [ ] Magic system has clear limits
- [ ] Geography supports the political structure
- [ ] Timeline has no paradoxes
- [ ] Naming is consistent within each culture
- [ ] At least one unresolved tension exists (drives story)
