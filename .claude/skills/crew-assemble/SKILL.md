---
name: crew-assemble
description: Build a complete Starbound Crew — captain, members, ship, mission, emblem
gate: unity
guardian: Ino
version: 1.0.0
---

# Crew Assemble — Build a Starbound Crew

## What This Skill Does
Guides you through creating a complete Starbound Crew for the Arcanea universe using the faction architecture and CHARACTER_TEMPLATE.

## When to Use
- Creating new content for the Arcanea franchise
- Expanding the Starbound Crews roster
- Building crews for stories, social content, or codex pages

## How It Works

### Step 1: Crew Identity
Ask for or generate:
- **Crew name** (Arcanean-quality — melodic, unique, weighted)
- **Motto** (one line that captures the crew's soul)
- **Sector assignment** (Solar, Ember, Oceanic, Dream, Void Frontier, Celestial)
- **Mission type** (guardian patrol, strike team, exploration, diplomacy, covert, rescue)
- **Visual emblem** description

### Step 2: Captain (Full Profile)
Create the Captain using the full 12-field CHARACTER_TEMPLATE from `.arcanea/lore/CHARACTER_TEMPLATE.md`:
- All 12 sections filled (Identity, Affiliation, Power, Diamond, Physical, Silhouette, Voice, Companion, Relationships, Color, Moral, Arc)
- Origin class from the 8 defined in `.arcanea/lore/FACTIONS.md`
- Character Diamond must be STRONG (desire, wound, mask, truth that generate real story)

### Step 3: Crew Members (3-5)
For each member, create abbreviated profiles:
- Identity (name, age, origin class)
- Power profile (gate, element, signature ability)
- Character Diamond (4 fields)
- One signature line of dialogue
- Role in the crew (tactician, heart, wildcard, muscle, scout, etc.)

### Step 4: Ship/Base/Beast
- Name and description
- Visual design (materials, size, condition)
- Capabilities
- What it says about the crew (beloved and old? Stolen? Custom-built?)

### Step 5: Internal Tension
- What the crew fights about when there's no external threat
- Which two members clash and why
- The unresolved question that drives crew drama

### Step 6: Signature Mission
Write a 300-500 word narrative scene showing the crew in action — demonstrating their chemistry, abilities, and internal dynamics.

## Crew Design Rules (from FACTIONS.md)
1. Every crew must have a Captain (any rank, any origin)
2. A name that means something to the crew
3. A ship, beast, vehicle, or mobile base
4. A mission or jurisdiction
5. An internal tension that generates story
6. A visual emblem derived from their identity
7. 3-7 members (intimate enough for real chemistry)
8. Origin class diversity WITHIN the crew

## Canon References
- Origin classes: `.arcanea/lore/FACTIONS.md`
- Character schema: `.arcanea/lore/CHARACTER_TEMPLATE.md`
- Visual rules: `.arcanea/lore/VISUAL_DOCTRINE.md`
- Corps structure: `.arcanea/lore/STARLIGHT_CORPS_CODEX.md`
- Canon truths: `.arcanea/lore/CANON_LOCKED.md`

## Output
A complete crew document ready for inclusion in `.arcanea/lore/STARBOUND_CREWS.md` or as a standalone crew file.
