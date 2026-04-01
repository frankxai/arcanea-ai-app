# Arcanea Brand Guidelines
## Voice, Visual Identity & Design System

---

## 1. Brand Essence

**What Arcanea Is**: A creative universe operating system — the framework for building AI-powered fantasy worlds. Both a working product (chat, imagine, create) AND the reference world showing what the framework can build.

**Brand Position**: Where Unreal Engine meets D&D meets WordPress — but for AI-powered world-building.

**Brand Promise**: Every interaction moves the creator toward imagining, building, publishing, and earning.

**Core Tension**: Arcanea competes against nothing. The challenge is comprehension, not differentiation.

---

## 2. Voice & Tone

### Voice Attributes

| Attribute | Description | Do | Don't |
|-----------|-------------|----|----- |
| **Elevated** | Mythic gravitas without pretension | "The Gate opens for those who seek" | "Click here to get started!" |
| **Accessible** | Wisdom that anyone can use | "Start small, but start daily" | Academic jargon or gatekeeping |
| **Actionable** | Every truth is usable | "Place your hands on your solar plexus" | Vague philosophical musings |
| **Inclusive** | Universal truths, no cultural appropriation | "Every creator contains all Five Elements" | Culturally specific religious references |
| **Confident** | Knows what it is without arrogance | "These books are equipment for living" | "We're the best AI platform ever" |

### Tone Scale (Context-Dependent)

```
MYTHIC ━━━━━━━━━━━━━━━━━━━━━━━━━━━ PRACTICAL
← Lore, Canon, Library content    Product UI, onboarding, docs →

REVERENT ━━━━━━━━━━━━━━━━━━━━━━━━━ PLAYFUL
← Meditation, Elements, Rituals   Quiz, social, community →

COSMIC ━━━━━━━━━━━━━━━━━━━━━━━━━━━ PERSONAL
← Universe-scale mythology        Creator journey, "your path" →
```

### Signature Phrases (Use These)
- "Enter seeking, leave transformed, return whenever needed."
- "These books are not entertainment. They are equipment for living."
- "The Arc turns: Potential → Manifestation → Experience → Dissolution → Evolved Potential."
- "What you contemplate at dawn shapes all that follows."
- "Every creator has an origin."

### Words We Use / Words We Avoid

| Use | Avoid |
|-----|-------|
| Creator, Builder, Architect | User, Customer, Consumer |
| Origin Class | Race, Species (for Arcanean factions) |
| Gate, Element, Guardian | Level, Category, Admin |
| Forge, Craft, Weave | Generate, Produce, Output |
| The Arc | The Journey (too generic) |
| Luminor | Expert, Master (outside Arcanean context) |
| Grimoire | Manual, Guide (for Library content) |

---

## 3. Visual Identity

### Color Palette

**Primary Colors**

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Atlantean Teal | `#7fffd4` | 127, 255, 212 | Primary accent, CTAs, links, highlights |
| Cosmic Blue | `#78a6ff` | 120, 166, 255 | Secondary accent, information, secondary UI |
| Gold Bright | `#ffd700` | 255, 215, 0 | Titles, premium elements, achievement markers |

**Background Colors**

| Name | Hex | Usage |
|------|-----|-------|
| Void Black | `#0a0a12` | Primary background |
| Card Dark | `#12121e` | Card backgrounds, elevated surfaces |
| Surface | `#1a1a2e` | Secondary surfaces |

**Text Colors**

| Name | Hex | Usage |
|------|-----|-------|
| Pure White | `#ffffff` | Primary headings |
| Light Text | `#e8e6f0` | Body text on dark backgrounds |
| Dim Text | `#9a98a8` | Secondary text, captions, metadata |

**Element Colors** (Used for faction/element-specific content)

| Element | Color | Hex |
|---------|-------|-----|
| Fire | Flame Red-Orange | `#ff6b35` |
| Water | Crystal Blue | `#4fc3f7` |
| Earth | Living Green | `#66bb6a` |
| Wind | Silver White | `#cfd8dc` |
| Void/Spirit | Deep Purple / Gold | `#7c4dff` / `#ffd700` |

### Typography

| Use | Font | Fallback | Weight |
|-----|------|----------|--------|
| Display / Headings | Cinzel | Georgia, serif | Bold (700) |
| Body Text | Crimson Pro | Georgia, serif | Regular (400) |
| UI Elements | Inter | -apple-system, sans-serif | Medium (500) |
| Code / Technical | JetBrains Mono | monospace | Regular (400) |

### Design Effects

- **Glass morphism**: `backdrop-blur-xl bg-white/5 border border-white/10`
- **Aurora gradients**: Subtle teal-to-blue-to-purple gradient shifts on backgrounds
- **Cosmic glow**: `box-shadow: 0 0 30px rgba(127, 255, 212, 0.15)` on key elements
- **Star particles**: Subtle animated dots on landing/hero sections
- **Dark-first**: All surfaces default dark. Light mode is not supported.

### Logo Usage

The Arcanea wordmark uses Cinzel Bold in Pure White or Gold Bright. The icon mark is the Starweave symbol (✦). Minimum clear space around the logo equals the height of the "A" in Arcanea.

---

## 4. Content Architecture

### The Six Layers (Every piece of content belongs to one or more)

1. **Chat / Imagine** — The creation surface
2. **Worlds** — The framework for building YOUR universe
3. **Feed** — Social layer, discovery, inspiration
4. **OSS** — Open ecosystem, repos, packages, skills
5. **Community** — Co-creators, governance, inner circle
6. **Academy** — Learning, courses, the Arcanean Code

### Content Voice by Layer

| Layer | Voice | Example |
|-------|-------|---------|
| Chat | Warm, personal, present | "I hear you. Let's explore that." |
| Worlds | Mythic, expansive, structured | "The Ten Gates govern all consciousness." |
| Feed | Energetic, celebratory, social | "Look what this creator forged." |
| OSS | Technical, precise, helpful | "Install with `npx arcanea init`" |
| Community | Inclusive, collaborative, honest | "Your voice shapes what Arcanea becomes." |
| Academy | Educational, encouraging, deep | "Mastery is not a destination. It is a practice." |

---

## 5. Canon Consistency Rules

All content MUST align with `.arcanea/lore/CANON_LOCKED.md`. Key non-negotiables:

1. **Nero is NOT evil.** Shadow (corrupted Void) is the Dark Lord's perversion of Nero.
2. **Void and Spirit are dual aspects of the Fifth Element.** Void = potential (Nero's aspect). Spirit = transcendence (Lumina's aspect).
3. **Light is Fire's creation aspect.** Not a separate element.
4. **Shadow is corrupted Void.** Void without Spirit.
5. **Gods/Goddesses are identities; "Guardian" is their role** as Gate-keepers.
6. **The Ten Gates use Extended Solfeggio frequencies** (174-1111 Hz, each unique).
7. **Malachar is the Dark Lord.** Formerly Lumina's champion. Fell into Hungry Void after forced fusion attempt with Shinkami.

### Canon Checklist (Before Publishing Any Content)
- [ ] Uses Lumina/Nero duality (not generic light/darkness)
- [ ] References Five Elements including Void
- [ ] Uses Ten Gates system with proper Guardian names
- [ ] Proper magic terminology (Arcane/Song/Mana/Anima)
- [ ] The Arc referenced for cycles/death/rebirth
- [ ] Origin classes use correct names and descriptions

---

## 6. Product Presentation

### Digital Products

**Grimoire**: Dark cosmic theme. A5 format. Gold titles, teal accents, dark backgrounds. Feels like a sacred artifact, not a PDF.

**Overlay Packs**: Clean ZIP structure with README.md at top. Professional package.json. Clear installation instructions. The .claude/ folder IS the product.

**Quiz**: Minimal dark UI. One question per screen. Teal progress bar. Gold result header. Shareable result card with origin class, archetypes, weakness.

### Pricing Display

Always show prices with the product name and one-line value prop:
```
The Arcanean Grimoire — Vol. I
Curated wisdom from the Library of Arcanea. 146 pages.
$19.99
```

Never use aggressive sales language. The content sells itself. The tone is: "This exists. It's beautiful. It's yours if you want it."

---

## 7. Social Media Guidelines

### Profile Setup

**Handle**: @arcanea.ai (or @arcanea_ where unavailable)
**Bio format**: "The creative universe operating system. Chat. Imagine. Build. | arcanea.ai"
**Profile image**: Starweave symbol (✦) in teal on dark background
**Header**: Aurora gradient with "Discover Your Origin" tagline

### Post Formats

**Lore Quote** (2-3x/week):
```
"[Quote from the Library]"
— [Attribution], [Source]

[Link to full text]
```

**Faction Reveal** (1x/week during campaign):
```
[Emblem Image]

[FACTION NAME]
"[Tagline]"

[3-sentence description]

Which origin class are you? → arcanea.ai/quiz
```

**Builder Spotlight** (1x/week after community forms):
```
[Creator's work image/screenshot]

[Creator name] forged [what they built] using the Arcanea framework.

"[Their quote about the experience]"

Build yours → arcanea.ai
```

### Hashtags
Primary: #Arcanea #DiscoverYourOrigin
Secondary: #AIWorldBuilding #CreativeAI #FantasyAI
Campaign-specific: #FactionReveal #OriginClass #TenGates

---

*Brand guidelines v1.0 — 2026-03-31*
*Owner: Frank Riemer / Arcanea*
*Review cadence: Monthly*
