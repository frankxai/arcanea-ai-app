---
name: character-forge
description: Forge a canon-consistent Arcanean character using the full 12-field CHARACTER_TEMPLATE
gate: fire
guardian: Draconia
version: 1.0.0
---

# Character Forge — Create an Arcanean Character

## What This Skill Does
Interactive character creation using the full 12-field CHARACTER_TEMPLATE. Produces franchise-grade characters that plug into the Arcanea universe.

## When to Use
- Creating heroes, villains, NPCs for stories
- Building characters for faction content
- Designing characters for the Codex, social reveals, or cards

## How It Works

### Step 1: Choose Origin Class
Present the 8 origin classes from `.arcanea/lore/FACTIONS.md`:

| Origin | Power Source | Energy |
|--------|-------------|--------|
| **Arcan** | Arcane (structured elemental channeling) | Trained, refined, academic |
| **Gate-Touched** | Frequency (chaotic resonance) | Volatile, unstable, raw |
| **Awakened** | Code (computational-arcane) | Digital, precise, transcendent |
| **Synth** | Mana (crystallized energy) | Constructed, philosophical |
| **Bonded** | Song (sympathetic resonance) | Primal, loyal, dual |
| **Celestial** | Anima (cosmic life force) | Awe-inspiring, divine |
| **Voidtouched** | Shadow (corrupted Void) | Dark, powerful, eroding |
| **Architect** | Weave (reality manipulation) | Subtle, terrifying, rare |

Auto-populate defaults based on choice (typical gates, elements, faction affiliations).

### Step 2: Identity
```yaml
name:           # Generate Arcanean-quality name (Lyssandria-tier)
aliases:        # Nicknames, titles
age:
pronouns:
origin_class:   # From Step 1
```

### Step 3: Character Diamond (MOST IMPORTANT)
```yaml
desire:     # What they consciously want
wound:      # The formative trauma that drives them
mask:       # The persona they show the world
truth:      # What they must learn for their arc to resolve
```
**Rules**: Desire must conflict with wound. Mask must hide the wound. Truth must challenge the mask. Without tension, the character is decoration.

### Step 4-12: Complete Remaining Fields
Walk through: Affiliation, Power Profile, Physical Presence, Signature Silhouette, Voice & Speech, Companion, Relationships, Color & Light Code, Moral Alignment, Arc Trajectory.

### Step 13: Validate
- Check name against existing character roster (no collisions)
- Verify canon compliance (correct Gates, elements, power sources)
- Ensure Character Diamond has real tension
- Verify origin class matches power source

### Step 14: Generate Outputs
- Full YAML character profile
- 1-paragraph narrative introduction
- 1 "poster description" for image generation
- 1 signature line of dialogue

## Anti-Patterns (from CHARACTER_TEMPLATE.md)
- No chosen ones. No prophecies with names.
- No power without cost.
- No single-trait characters.
- No aesthetic without substance.
- No edgelords (dark ≠ interesting).
- No copies (every character must surprise).

## Canon References
- Character schema: `.arcanea/lore/CHARACTER_TEMPLATE.md`
- Origin classes: `.arcanea/lore/FACTIONS.md`
- Visual rules: `.arcanea/lore/VISUAL_DOCTRINE.md`
- Canon: `.arcanea/lore/CANON_LOCKED.md`
