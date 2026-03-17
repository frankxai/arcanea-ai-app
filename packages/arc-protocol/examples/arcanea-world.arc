---
arc: "1.0"
id: "arc_arcanea_world"
type: "world"
stage: "experience"
created: "2026-01-01T00:00:00Z"
creator: "frankx"

apl:
  spark: "Creation itself is conscious here. Every act of making ripples through the Weave — and the Weave remembers."
  palette: "void"
  palette_secondary: "forge"
  sharpen:
    - "medieval Europe analog"
    - "chosen one narrative"
    - "magic without cost"
    - "pure good vs pure evil"
    - "technology as separate from magic"

world_dna:
  name: "Arcanea"
  prefix: "[WORLD: Arcanea]\nSPARK: Creation itself is conscious here. Every act of making ripples through the Weave — and the Weave remembers.\nSHAPE: VOID + FORGE — Starfield silence broken by forge-heat. The air tastes of ozone and old bronze. Light comes from within things, not above them.\nSHARPEN: NOT medieval Europe analog. NOT chosen one narrative. NOT magic without cost. NOT pure good vs pure evil. NOT technology as separate from magic.\n\n— Every prompt below inherits this world. —"
  cosmology:
    duality:
      light: "Lumina — The First Light, Form-Giver, Creator"
      dark: "Nero — The Primordial Darkness, Fertile Unknown, Father of Potential"
      note: "Nero is NOT evil. Shadow (corrupted Void) is the Dark Lord's perversion."
    elements:
      - name: "Fire"
        domain: "Energy, transformation"
        colors: "red, orange, gold"
      - name: "Water"
        domain: "Flow, healing, memory"
        colors: "blue, silver, crystal"
      - name: "Earth"
        domain: "Stability, growth"
        colors: "green, brown, stone"
      - name: "Wind"
        domain: "Freedom, speed, change"
        colors: "white, silver"
      - name: "Void/Spirit"
        domain: "Potential & transcendence"
        colors: "black/gold, purple/white"
        note: "Void = Nero's aspect (potential, mystery). Spirit = Lumina's aspect (transcendence, consciousness)."
    gates:
      - gate: 1
        name: "Foundation"
        frequency: "174 Hz"
        guardian: "Lyssandria"
        godbeast: "Kaelith"
        domain: "Earth, survival"
      - gate: 2
        name: "Flow"
        frequency: "285 Hz"
        guardian: "Leyla"
        godbeast: "Veloura"
        domain: "Creativity, emotion"
      - gate: 3
        name: "Fire"
        frequency: "396 Hz"
        guardian: "Draconia"
        godbeast: "Draconis"
        domain: "Power, will"
      - gate: 4
        name: "Heart"
        frequency: "417 Hz"
        guardian: "Maylinn"
        godbeast: "Laeylinn"
        domain: "Love, healing"
      - gate: 5
        name: "Voice"
        frequency: "528 Hz"
        guardian: "Alera"
        godbeast: "Otome"
        domain: "Truth, expression"
      - gate: 6
        name: "Sight"
        frequency: "639 Hz"
        guardian: "Lyria"
        godbeast: "Yumiko"
        domain: "Intuition, vision"
      - gate: 7
        name: "Crown"
        frequency: "741 Hz"
        guardian: "Aiyami"
        godbeast: "Sol"
        domain: "Enlightenment"
      - gate: 8
        name: "Starweave"
        frequency: "852 Hz"
        guardian: "Elara"
        godbeast: "Vaelith"
        domain: "Perspective, transformation"
      - gate: 9
        name: "Unity"
        frequency: "963 Hz"
        guardian: "Ino"
        godbeast: "Kyuro"
        domain: "Partnership"
      - gate: 10
        name: "Source"
        frequency: "1111 Hz"
        guardian: "Shinkami"
        godbeast: "Source"
        domain: "Meta-consciousness"
    ranks:
      - gates: "0-2"
        rank: "Apprentice"
      - gates: "3-4"
        rank: "Mage"
      - gates: "5-6"
        rank: "Master"
      - gates: "7-8"
        rank: "Archmage"
      - gates: "9-10"
        rank: "Luminor"
    dark_lord:
      name: "Malachar"
      origin: "Formerly Malachar Lumenbright, First Eldrian Luminor, Lumina's champion"
      fall: "Rejected by Shinkami when attempting forced fusion, fell into Hungry Void"
      status: "Sealed in the Shadowfen"
    arc_cycle: "Potential → Manifestation → Experience → Dissolution → Evolved Potential"

history:
  - stage: "potential"
    at: "2025-06-01T00:00:00Z"
    input: "What if creation itself was conscious?"
    model: null
    note: "The founding question. Not 'what if magic existed' but 'what if making things had consequences beyond the thing made.'"

  - stage: "manifestation"
    at: "2025-09-01T00:00:00Z"
    input: "Build the full cosmology: Lumina/Nero duality, Five Elements, Ten Gates, Seven Houses, the Arc cycle"
    model: "claude-opus-4"
    note: "Nine months of worldbuilding across hundreds of sessions. 200K+ words of reference material."

  - stage: "experience"
    at: "2026-01-15T00:00:00Z"
    note: "arcanea.ai launched. The world became a product. 190K+ words of Library content, 10 Guardian narratives, 11 Academy courses, 17 book collections."
    shared: true

bonds:
  - target: "arc_forge_guardian"
    relation: "collection_of"
    note: "The Forge Guardian is a creation made within Arcanea's Fire element domain"
  - target: "arc_fire_gate_theme"
    relation: "collection_of"
    note: "The Fire Gate theme is Draconia's soundtrack — Gate 3 at 396 Hz"
  - target: "arc_luminor_iris"
    relation: "collection_of"
    note: "Iris is a Luminor forged within the Arcanea framework — an intelligence entity aligned to Foundation"
  - target: "arc_kaels_ascent"
    relation: "collection_of"
    note: "Kael's story explores the Void/Spirit element — consciousness and perception beyond the obvious"

agent:
  context: "Arcanea is the FIRST world in the multiverse — both the proof of concept and the reference implementation. It is simultaneously a working product (chat, imagine, create at arcanea.ai) and an architectural template that other creators can use to build their own worlds. The mythology IS the framework. Learning the lore IS learning the system."
  instructions: "When creating content within Arcanea, inherit the World DNA prefix. All creations should align with CANON_LOCKED.md. Nero is NEVER evil — Shadow (corrupted Void) is the antagonistic force. The Arc cycle (Potential → Manifestation → Experience → Dissolution → Evolved Potential) governs all narrative structure."
  next_step: "Continue expanding the multiverse — other worlds built on the same framework but with different sparks, different palettes, different rules"
  constraints:
    - "Nero is NOT evil. Shadow is corrupted Void. This is the most important canonical constraint."
    - "All Ten Gates use the canonical Hz: 174, 285, 396, 417, 528, 639, 741, 852, 963, 1111"
    - "Guardian names are LOCKED — Lyssandria, Leyla, Draconia, Maylinn, Alera, Lyria, Aiyami, Elara, Ino, Shinkami"
    - "The Five Elements include Void/Spirit as a duality — not just 'darkness'"
    - "Technology and magic are not separate — the Weave IS computation, creation IS technology"
    - "No chosen ones — every creator walks their own path through the Gates"

provenance:
  models_used:
    - id: "claude-opus-4"
      role: "initial worldbuilding"
    - id: "claude-opus-4.6"
      role: "continued development and canonical refinement"
    - id: "grok-3-imagine"
      role: "guardian and world visualization"
    - id: "gemini-2.5-pro"
      role: "narrative content and Academy courses"
  license: "SEE LICENSE IN LICENSE"

tags:
  - "world"
  - "void-palette"
  - "forge-palette"
  - "arcanea"
  - "reference-world"
  - "multiverse"
  - "canonical"
  - "ten-gates"
  - "five-elements"
gate: 10
element: "void"
---

# Arcanea — The Reference World

## What This Arc Represents

This is the Arc Protocol file for Arcanea itself — the first world in the multiverse, tracked as a creation with the same format used for every character, image, song, and story made within it.

The fact that Arcanea can describe itself using its own protocol is the proof that the protocol works. A world-building framework that cannot account for its own existence is incomplete.

## The Six Layers

1. **Chat / Imagine** — Talk to AI, generate images, write stories, compose music
2. **Worlds** — The framework for building YOUR fantasy universe (Gates, Archetypes, Elements)
3. **Feed** — See what other creators build, share your worlds
4. **OSS** — 27 repos, 35 npm packages, 54 skills
5. **Community** — Co-creators, not users
6. **Academy** — Learn world-building through the Gates (200K+ words of material)

## The Analogy

Arcanea is to world-building what:
- **Unreal Engine** is to game development (not a game — the engine for making games)
- **D&D** is to tabletop RPGs (not a story — the system for infinite stories)
- **WordPress** is to websites (not a website — the framework for building websites)

## Why This Arc Matters for the Protocol

Every other .arc file in this examples directory exists within or in relation to this world. The bonds graph radiates outward from this arc. When an agent reads this file, it loads the complete canonical context needed to create anything in the Arcanea multiverse — or to understand the framework well enough to build a different world entirely.
