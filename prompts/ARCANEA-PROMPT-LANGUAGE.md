# Arcanean Prompt Language (APL) v3.0

> *"The difference between AI slop and something that moves you is seventeen words of intention."*

APL is a prompt enrichment system. It takes whatever you're asking AI to make and elevates the output from generic to extraordinary. It works across any model (Claude, Gemini, GPT, Suno, Midjourney, ComfyUI) and any genre — fantasy, sci-fi, business, personal, abstract.

The Arcanean mythology (Gates, Elements, Guardians) is available as flavor when you want it. But the core of APL is model-agnostic and mythology-optional. It's about asking better questions so AI gives you better answers.

---

## The Problem APL Solves

AI output is mediocre by default. Not because the models are bad — because the prompts are vague. "Write a character" gets you a generic character. "Create a landscape" gets you every landscape.

APL fixes this with three principles:

1. **The Anchor** — force one concrete, specific detail into every prompt. Specificity is the enemy of slop.
2. **The Exclusion** — tell the AI what NOT to do. Most quality comes from removing the bad, not adding the good.
3. **The Sensory Ground** — engage at least two senses. If you can't see it, hear it, or feel it, it doesn't exist yet.

These three things alone will transform your output. Everything else in APL is enrichment.

---

## The Three Moves

### Move 1: Anchor It

Every APL prompt has one non-negotiable: `@anchor` — a single concrete detail that prevents the AI from going generic.

```
Without anchor:  "Create a wise mentor character"
With anchor:     "Create a wise mentor whose hands shake when she lies"
```

```
Without anchor:  "Compose epic fantasy music"
With anchor:     "Compose a track where the strings drop out completely at the climax, leaving only a single voice"
```

The anchor does three things: it gives the AI a focal point, it makes the output specific to YOUR vision, and it's the detail that makes someone say "that's different."

### Move 2: Exclude the Defaults

AI has strong defaults. APL names them so you can reject them:

```
@exclude  generic-fantasy    — "in a world where...", ancient prophecies, chosen ones
@exclude  purple-prose       — "hauntingly beautiful ethereal majesty cascading..."
@exclude  ai-slop            — "I'd be happy to", "it's important to note", "let's dive in"
@exclude  symmetry           — not everything needs perfect parallel structure
@exclude  resolution         — sometimes the best ending is an open question
@exclude  perfection         — scars, asymmetry, and wear are more interesting than polish
@exclude  explanation        — trust the audience. Don't explain the metaphor.
```

You don't need all of these every time. Pick the ones your prompt is most likely to trigger.

### Move 3: Ground It in the Body

Before any concept, establish a physical sensation:

```
Weak:   "The ancient library held countless secrets"
Strong: "The library smelled like dust and copper. The books were warm to the touch."
```

```
Weak:   "A powerful magical artifact"
Strong: "It hummed at a frequency you felt in your teeth, not your ears"
```

This works for visuals (what's the atmosphere?), music (what does the silence between notes feel like?), and narrative (ground the reader in one non-visual sense before anything else).

---

## Full APL Syntax

When you want the full system, APL prompts can include any of these fields. **All are optional except @anchor:**

```
@form     — what you're making (character, location, song, image, lore, name, system)
@tone     — emotional register (mythic, intimate, fierce, reverent, playful, tense, raw)
@anchor   — one concrete detail that grounds everything (REQUIRED)
@exclude  — what to avoid (comma-separated)
@render   — visual style (cinematic, concept-art, icon, premium-photo)
@phonetics — name style (tolkien, marvel, miyazaki, ancient)
@gate     — Arcanean Gate energy, if building within the mythology (optional)
@element  — Five Element palette, if using elemental flavor (optional)

[body]    — the actual creative direction, in plain language
```

### Example: Character (no mythology)

```
@form     character
@tone     intimate
@anchor   she counts things when she's nervous — ceiling tiles, buttons, heartbeats
@exclude  chosen-one, tragic-backstory-dump, flawless

A data scientist who quit her job to open a bakery. She's brilliant
and she knows it, which makes her terrible at asking for help.
Her sourdough starter is named after her thesis advisor.
She's funnier than she realizes and sadder than she admits.
```

### Example: Character (with Arcanean flavor)

```
@form     character
@tone     fierce
@gate     Fire
@element  Fire
@anchor   a scar that glows like cooling lava when she's angry
@exclude  generic-fantasy, chosen-one, villain-monologue
@phonetics ancient

A warrior-teacher of the Fire Gate. She burned away everything
that wasn't essential — relationships, possessions, even her
original name. She teaches by sparring. Every lesson leaves a mark.
Her students fear her and would die for her.
```

Both prompts produce excellent characters. The Gate and Element add thematic richness if you want it, but the quality comes from the anchor, exclusions, and specificity.

---

## The Sensory Palettes

These are enrichment vocabularies. Use them to make any prompt more vivid — whether you're building in Arcanea's mythology or your own world.

| Palette | Visual | Sound | Texture | Motion |
|:--------|:-------|:------|:--------|:-------|
| **Fire** | Ember, forge, molten glass, cooling lava | Crackle, roar, sharp percussion | Rough, hot, crystalline | Explosive, consuming, ascending |
| **Water** | Tide, mirror, rain on still surface, depth | Resonance, echo, sustained notes | Smooth, cool, yielding | Flowing, spiraling, tidal |
| **Earth** | Root, stone, moss, bone, fossil | Low hum, drum, grinding | Gritty, dense, layered | Slow, deliberate, growing |
| **Wind** | Cloud, feather, spark, horizon line | Whistle, chime, breath | Light, sharp, electric | Swift, scattered, orbiting |
| **Void** | Starfield, ink, absence, potential | Silence, sub-bass, overtone | Weightless, vast, paradoxical | Still, imploding, transcendent |

You don't have to call these "elements." They're just five sensory families. Use whichever one adds the right flavor to your prompt.

---

## The Quality Ladder

APL recognizes four levels of output quality. Each level adds one layer of intentionality:

### Level 1: Clear (beats 80% of AI output)
Just add an anchor. One specific detail.
```
"A castle on a cliff" → "A castle where the south wall has been rebuilt three times and each layer is a different stone"
```

### Level 2: Vivid (beats 95% of AI output)
Add an exclusion and a sensory ground.
```
@anchor   the south wall, rebuilt three times in different stone
@exclude  generic-medieval, pristine-fortress
The wind through the mismatched stones makes a sound the locals call "the argument."
```

### Level 3: Resonant (beats 99% of AI output)
Add emotional subtext — what does this creation MEAN?
```
@anchor   the south wall, rebuilt three times in different stone
@exclude  generic-medieval, pristine-fortress
@tone     bittersweet
The castle keeps getting attacked from the south because that's where the road to
the capital is. Every generation rebuilds it. The different stones are a family history
you can read with your hands. The newest layer is the weakest.
```

### Level 4: Genius (the top shelf)
Add a contradiction or paradox — something that shouldn't work but does.
```
@anchor   the south wall, rebuilt three times in different stone
@exclude  generic-medieval, pristine-fortress, resolution
@tone     bittersweet
The castle's weakest wall is also its most beautiful. Visitors come from across
the continent to see the south face — three layers of stone, three colors,
three centuries of being broken and remade. The family could reinforce it.
They choose not to. The vulnerability IS the monument.
```

**This is the core of APL.** The difference between generic AI output and something that gives you chills is specificity, exclusion, sensory grounding, and one good paradox.

---

## Anti-Slop Patterns

These are the most common AI failure modes and how APL prevents them:

| AI Default | APL Counter |
|:-----------|:------------|
| "In a world where..." opener | `@exclude generic-fantasy` — start with action, image, or dialogue |
| Adjective avalanche | `@exclude purple-prose` — one strong noun beats three weak adjectives |
| Everything is epic/beautiful/ancient | `@tone` forces a specific register — intimate, playful, tense, raw |
| Characters describe themselves | `@anchor` forces a SHOWN detail, not a TOLD one |
| Moral clarity (pure good vs. pure evil) | `@exclude perfection` — interesting characters have contradictions |
| Resolution in the last paragraph | `@exclude resolution` — some prompts should end with open questions |
| "As a [role], I..." self-referencing | `@exclude ai-slop` — respond as the thing, not about the thing |
| Symmetric structure (3 pillars, 5 principles...) | `@exclude symmetry` — asymmetry is more natural and interesting |
| Name cliches (Shadowbane, Darkwood) | `@phonetics` — choose a linguistic register that has weight |

---

## Using APL Across Models

### Text (Claude, Gemini, GPT)
Pass the full APL block as a prefix to your prompt. The model will follow the constraints and produce within them.

### Images (Midjourney, ComfyUI, Nano Banana, DALL-E)
Translate to image prompt format: extract nouns, adjectives, atmosphere, and `@render` style. The `@anchor` becomes the focal point. Strip all narrative verbs.

```
APL:    @element Fire, @anchor cooling lava scar, @render cinematic, @tone fierce
Image:  "fierce warrior, cinematic lighting, glowing lava-like scar on face,
         ember particles in air, dark forge background, film grain, shallow depth of field"
```

### Music (Suno, Udio)
The sensory palette maps to instrumentation. The `@tone` guides mood. The `@anchor` becomes the signature moment — the 5 seconds someone would hum back.

### Multi-modal Coherence
When creating matching content (character + portrait + theme music), use the SAME `@anchor` and `@tone` across all three prompts. That's what makes a world feel consistent.

---

## Arcanean Flavor (Optional Layer)

If you're building within Arcanea's mythology, you can add `@gate` and `@element` for thematic richness. These are not required for APL to work — they're enrichment for when you want your creation to feel like it belongs in the Arcanean multiverse.

### The Ten Gates as Creative Modes

Each Gate changes HOW the AI approaches the work:

| Gate | Mode | Direction |
|:-----|:-----|:----------|
| **Foundation** | Structure first. Build the container. | "Make it solid. Make it real." |
| **Flow** | Emotion first. Let feeling lead form. | "Let it breathe. No forcing." |
| **Fire** | Momentum. Cut everything unnecessary. | "Make it hit. Ship it." |
| **Heart** | Tenderness. Authentic connection. | "Make it kind. Make it true." |
| **Voice** | Express the unsayable. Clarity. | "One true sentence. No hiding." |
| **Sight** | See what others miss. | "Look deeper. What's really here?" |
| **Crown** | Teach. Illuminate. | "Explain so they can do it themselves." |
| **Starweave** | Transform perspective. | "Show it from an impossible angle." |
| **Unity** | Collaboration. Fusion. | "Two voices becoming one." |
| **Source** | Meta-creation. Systems. | "Build the tool, not the thing." |

### Canon Reference

When using Arcanean mythology, these are locked:
- **Lumina** = First Light, creation. **Nero** = Primordial Dark, potential (NOT evil).
- **Five Elements**: Fire, Water, Earth, Wind, Void/Spirit
- **Frequencies**: 174 - 285 - 396 - 417 - 528 - 639 - 741 - 852 - 963 - 1111 Hz
- **Names**: Lyssandria-tier quality. No Shadowbane, no Darkwood.
- Full canon: `.arcanea/lore/CANON_LOCKED.md`

---

## Template Index

See `prompts/templates/` for ready-to-use templates:

| Template | What It Does | Mythology Required? |
|:---------|:-------------|:-------------------|
| `character.md` | Create beings with depth, shadow, voice | No |
| `location.md` | Build places that feel lived-in | No |
| `magic-system.md` | Design consistent, bounded power systems | No |
| `visual-style.md` | Generate images with intentional aesthetics | No |
| `music-direction.md` | Compose tracks with emotional architecture | No |
| `lore-consistency.md` | Audit content against established canon | Yes (Arcanea-specific) |
| `name-generator.md` | Forge names with phonetic intention | No |
| `creature.md` | Design creatures as elemental expressions | No |
| `scene.md` | Write moments that shift something | No |
| `world-seed.md` | Bootstrap an entire world from one idea | No |

---

## The Promise

APL doesn't tell you what to create. It asks you better questions about what you already want to create. The anchor forces you to be specific. The exclusion forces you to be honest about what you don't want. The sensory ground forces you to make it real.

The mythology is a gift, not a cage. Use it when it enriches. Ignore it when it doesn't. The quality comes from the craft, not the lore.

---

*Make it specific. Make it sensory. Make it surprising.*
*That's the whole system. Everything else is vocabulary.*
