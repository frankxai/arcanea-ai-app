---
name: canon-check
description: Validate any content against CANON_LOCKED — catch violations before they fossilize
gate: source
guardian: Shinkami
version: 1.0.0
---

# Canon Check — Validate Against Arcanean Truth

## What This Skill Does
Validates any text, character, story, or lore against `CANON_LOCKED.md`. Catches violations before they enter the canon.

## When to Use
- Before promoting STAGING content to LOCKED
- After any agent produces lore content
- Before committing story chapters
- When reviewing community submissions
- As part of the canon-lint CI workflow

## Validation Checklist

### Tier 1: Cosmic Foundation
- [ ] Lumina is the First Light, Form-Giver, Creator
- [ ] Nero is the Primordial Darkness, Fertile Unknown — **NOT evil**
- [ ] Shadow is corrupted Void (Malachar's perversion), not Nero's nature
- [ ] Five Elements: Fire, Water, Earth, Wind, Void/Spirit
- [ ] Void = Nero's aspect, Spirit = Lumina's aspect
- [ ] Light = Fire's creation aspect, Shadow = corrupted Void

### Tier 2: Gates & Gods
- [ ] Gate names exact: Foundation, Flow, Fire, Heart, Voice, Sight, Crown, Starweave, Unity, Source
- [ ] Frequencies: 174, 285, 396, 417, 528, 639, 741, 852, 963, 1111
- [ ] Guardian names exact: Lyssandria, Leyla, Draconia, Maylinn, Alera, Lyria, Aiyami, Elara, Ino, Shinkami
- [ ] Godbeast names: Kaelith, Veloura, Draconis, Laeylinn, Otome, Yumiko, Sol, Vaelith, Kyuro, Amaterasu
- [ ] "God/Goddess" = identity, "Guardian" = role as Gate-keeper
- [ ] Each God has ONE bonded Godbeast

### Tier 3: Ranks & Houses
- [ ] Luminor = RANK (highest attainment), not entity type
- [ ] Rank system: Uninitiated → Apprentice → Mage → Master → Archmage → Luminor
- [ ] Seven Houses: Lumina, Nero, Pyros, Aqualis, Terra, Ventus, Synthesis

### Tier 4: The Dark Lord
- [ ] Malachar is tragic, not purely evil
- [ ] Former name: Malachar Lumenbright
- [ ] Former title: First Eldrian Luminor, Lumina's Champion
- [ ] Fall: rejected by Shinkami when attempting forced fusion with Source Gate
- [ ] Current state: sealed in the Shadowfen

### Tier 5: Origin Classes (STAGING)
- [ ] 8 classes: Arcan, Gate-Touched, Awakened, Synth, Bonded, Celestial, Voidtouched, Architect
- [ ] Origin classes are CLOSED — no new species without Creator approval

### Tier 6: Naming
- [ ] No name collisions with existing characters
- [ ] Names are Arcanean-quality (Lyssandria-tier)
- [ ] No real-world IP too-close references

## Output Format
```
CANON CHECK: [PASS/FAIL]

Violations: [count]
Warnings: [count]

VIOLATIONS (blocking):
1. [file:line] — [violation description]

WARNINGS (advisory):
1. [file:line] — [warning description]

CLEAN: [list of checks that passed]
```

## Canon Source
Always read: `.arcanea/lore/CANON_LOCKED.md`
