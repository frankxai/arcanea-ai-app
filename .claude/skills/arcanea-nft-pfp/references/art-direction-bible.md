# Arcanea NFT Forge — Art Direction Bible

> This document is the SINGLE SOURCE OF TRUTH for visual taste.
> Every agent involved in NFT generation MUST read this before producing prompts.
> Last updated after 12-image quality audit (2026-04-02).

---

## THE ARCANEA PFP IDENTITY

### Two Signature Elements (Present on EVERY Character)

**1. THE STARLIGHT MARK**
A small teal crystal mark on the LEFT temple. Always visible in the 3/4 view.
The shape indicates rank — this is the visual "power level" indicator:

| Rank | Gates | Mark Shape | Glow Intensity |
|------|-------|-----------|----------------|
| Apprentice | 0-2 | Single teal dot | Faint, barely visible |
| Mage | 3-4 | Small diamond shape | Soft glow |
| Master | 5-6 | Triangle | Clear glow |
| Archmage | 7-8 | Pentagon | Strong glow, light bleeds onto skin |
| Luminor | 9-10 | Multi-pointed star | Intense, casts teal light on face |

The Starlight Mark is Arcanea's "Azuki headband" — the one thing that makes it instantly recognizable.
It MUST appear on every single PFP. Non-negotiable.

**Prompt instruction:** "Small teal (#2dd4bf) crystal mark on the left temple — [shape for rank], softly glowing"

**2. SACRED GEAR**
One statement piece of Arcanean equipment. Not medieval armor — designed fashion-tech
infused with Vael Crystal energy. Think: if Rick Owens designed tech-armor for a god.

Sacred Gear categories (one per character, this is the main trait):

| Gear Type | Description | Visual Feel |
|-----------|-------------|-------------|
| **Starlight Collar** | High-neck collar piece with embedded crystal and metal filigree | Futuristic priestly, frames the face |
| **Void Pauldron** | Single asymmetric shoulder piece (left only) with glowing crystal core | Military-fashion, strong silhouette |
| **Resonance Visor** | Thin metallic band across bridge of nose or above eyes | Tech-mystical, Clone X energy |
| **Gate Chain** | Geometric pendant on a chain — shape matches unlocked Gate | Streetwear-luxury, status symbol |
| **Crystal Crown** | Floating/fixed headpiece with Vael Crystal shards | Divine authority, Luminor exclusive |
| **Ember Gauntlet** | Single forearm piece, angular design with glowing veins | Power display, warrior class |

**Rules:**
- ONE Sacred Gear per character maximum (constraint is quality)
- The Gear has TWO materials: dark base metal + one glowing crystal/accent
- The Gear MUST be visible at 48px thumbnail (bold shape, not fine detail)
- The Gear reflects the character's element (fire=ember crystal, water=flowing crystal, etc.)

---

## LESSONS LEARNED (From 16 Generations, 2026-04-02)

### What We Got WRONG (Never Do Again)

1. **"Masterpiece, best quality"** — NOISE TOKENS. Never use. Use specific rendering instructions instead.
2. **Action poses / showing hands** — PFPs are STILL portraits. No hands, no arms below elbow, no action. EVER.
3. **Fantasy RPG aesthetics** — Torn cloaks, leather bracers, medieval armor = 2015 gaming art. NOT competitive in 2026 NFT market.
4. **Too many traits** — 10-12 traits per character makes it busy and unreadable at avatar size. Maximum 6-7.
5. **"Beautiful" over "cool"** — Beauty is forgettable. Cool is iconic. Push for unbothered confidence, not heroic beauty.
6. **Inconsistent crop** — Some showed half-body, some showed hands. STRICT: head + shoulders, cut at mid-chest, identical every time.
7. **Cosmic gradient backgrounds** — These are concept art, not PFP. FLAT SOLID COLOR. Always.
8. **Cinematic tier for collections** — Too photorealistic, loses iconic quality. Reserve for 1/1 hero pieces only. Premium3D is the collection sweet spot.

### What We Got RIGHT (Always Do)

1. **3/4 view angle** — 25-30 degrees head turn. Creates depth + personality. Never dead-center front.
2. **Flat solid background** — Clean, professional, scales perfectly as avatar.
3. **Material diversity in premium3d** — Matte fabric + brushed metal + glowing crystal in ONE image creates "worth thousands" feel.
4. **Subsurface scattering** — Light through ears, nose bridge, crystals. Makes it feel ALIVE.
5. **Color temperature shift** — Warm amber highlights + cool teal shadows = visual richness.
6. **The Starlight Mark concept** — Simple, recognizable, ranks visually. This IS the signature.
7. **Teal + gold + dark charcoal palette** — The Arcanea DNA. Consistent across all characters.
8. **Power progression through traits** — Apprentice→Luminor should be IMMEDIATELY obvious from the image.

---

## STRICT PROMPT RULES

### Format Block — PORTRAIT-PLUS (Default Crop)
```
NFT PFP character portrait. Square 1:1.
3/4 view, head turned 25 degrees.
Frame cuts at UPPER CHEST — Sacred Gear collar/pauldron visible,
upper outfit visible. Character fills 72% of frame vertically.
Character's eye line at 38% from top of frame.
NO hands visible. NO arms below elbow.
Flat solid [COLOR] background — DARK and MOODY (navy, charcoal, plum, forest).
Small teal crystal mark on left temple — [RANK SHAPE], softly glowing.
```

### Atmosphere Block (From Taste Profile — Include in EVERY prompt)
```
ATMOSPHERE: Rich, deep, moody. Controlled dramatic light with color
temperature shift — warm amber on lit side, cool teal-purple on shadow side.
One element softly glows besides the Starlight Mark. Everything else is
material and form. NOT flat studio lighting.

FACE: The hero of this image. 40% of visual attention. Defined bone structure.
Eyes with clear catchlights and PERSONALITY — this character has a specific
inner life. Subtle expression, not exaggerated. NOT a template smirk.

RESTRAINT: Maximum 4-5 colors on character. One accent color. One glow
source. If a trait doesn't earn its place, remove it.
```

### Crop Options (Portrait-Plus is DEFAULT)
| Crop | When | Prompt |
|------|------|--------|
| **portrait-plus** (DEFAULT) | All collection pieces | Upper chest, collar/pauldron visible, no hands |
| upperbody | Showcase pieces, rich gear display | Head to waist, hands can show |
| showcase | 1/1 hero pieces only | Three-quarter body, full outfit |
| ~~headshot~~ | REMOVED | — |

### Expression Block (Include in EVERY prompt)
```
Expression: confident and unbothered. Half-lidded eyes. Closed mouth with subtle
asymmetric smirk. Chin tilted very slightly up. The energy of someone who knows
something you don't. NOT determined, NOT fierce, NOT sweet — COOL.
```

### Trait Limit Rule
Maximum 7 traits per character:
1. Skin tone + mark
2. Eye color/style
3. Hair style + color
4. Sacred Gear (one piece)
5. Outfit (one main piece)
6. One accessory (chain, earring, or hair piece)
7. One color accent

If you're adding an 8th trait, REMOVE one first. Constraint creates quality.

### Negative Prompt (Universal)
```
text, watermark, hands, fingers, arms below elbow, action pose, fighting stance,
narrative scene, environment, landscape, gradient background, particles, bokeh,
full body, multiple characters, medieval armor, leather bracers, torn fabric,
fantasy robes, generic RPG, warrior pose, concept art composition,
masterpiece, best quality (these are noise tokens)
```

---

## RENDERING TIER SELECTION

| Use Case | Tier | Why |
|----------|------|-----|
| 10K collection | **premium3d** | Best balance of quality + stylization + consistency |
| Clean brand collection | graphic | Bold, simple, maximum trait clarity at small size |
| 1/1 hero auctions | cinematic | Maximum detail, film-quality |
| Marketing/website art | cinematic | Beautiful but not for mass collection |
| Quick concept testing | graphic | Fastest to evaluate trait designs |

**Default to premium3d for production.** It's the tier that most closely matches what sells for thousands.

---

## COLOR PALETTE (Locked)

### Universal Arcanea NFT Palette
| Color | Hex | Use |
|-------|-----|-----|
| Charcoal Black | #1a1a2e | Dark backgrounds, outfit base |
| Deep Navy | #141b2d | Alternative dark background |
| Arcanea Teal | #2dd4bf | Signature accent, Starlight Mark, crystal glow |
| Celestial Gold | #d4a017 | Metal filigree, chain, Sacred Gear accent |
| Warm Amber | #d4870a | Skin highlights, warm light |
| Star White | #f0f0ff | Hair, rim light, Luminor glow |
| Dusty Sage | #8a8378 | Neutral background option |
| Void Black | #0a0a0f | Void Crystal, deep shadows |

### Per-Element Accent Colors (One additional accent per character)
| Element | Accent | Use |
|---------|--------|-----|
| Fire | Ember Orange #ff6b35 | Crystal glow, energy accent |
| Water | Ocean Blue #4a9eff | Crystal glow, energy accent |
| Earth | Forest Green #2d8a4e | Crystal glow, energy accent |
| Wind | Silver White #c0c8d4 | Crystal glow, energy accent |
| Void | Deep Purple #6b21a8 | Crystal glow, energy accent |

---

## CULTURAL POSITIONING

### What Arcanea NFTs Are NOT
- NOT medieval fantasy (Game of Thrones / D&D aesthetic)
- NOT generic anime (oversaturated isekai)
- NOT pixel art or retro
- NOT photorealistic human portraits
- NOT "edgy" dark/horror

### What Arcanea NFTs ARE
- Cosmic tech-fashion (Rick Owens meets sacred geometry)
- Aspirational identity (you want to BE this character)
- Modern luxury (could be on a fashion magazine cover)
- Culturally hybrid (Tokyo streetwear + cosmic mythology + high fashion)
- Collectible design objects (like a premium vinyl figure rendered digitally)

### The Feeling
When someone sets an Arcanea PFP as their Discord/X avatar, they should feel:
"This represents the version of me that has unlocked something others haven't."

NOT: "This is a cool fantasy character I like."

The difference is IDENTITY vs APPRECIATION. Top NFTs are identity. We must be identity.

---

## AGENT KNOWLEDGE REQUIREMENTS

Any agent (.claude/agents/) involved in NFT generation MUST know:

1. **This document** — Art Direction Bible (load first)
2. **CANON_LOCKED.md** — For element/rank/faction accuracy
3. **VISUAL_DOCTRINE.md** — For faction-specific palettes and materials
4. **FACTIONS.md** — For origin class visual codes
5. **The 5 Fixes** — Strict crop, signature element, fewer traits, attitude over beauty, cultural modernity

### Agent Prompt Template
When an agent generates an NFT PFP, its system prompt should include:
```
You are an elite NFT art director. Your standard is Clone X, Azuki, DeGods.
Before generating any image, verify:
[ ] Strict crop: head + shoulders only, no hands, no arms below elbow
[ ] Starlight Mark visible on left temple (correct rank shape)
[ ] ONE Sacred Gear piece (bold, readable at 48px)
[ ] Maximum 7 traits
[ ] Flat solid background color
[ ] Expression: unbothered confident, not fierce/sweet/determined
[ ] Rendering tier: premium3d unless specified otherwise
[ ] No "masterpiece/best quality" noise tokens
[ ] Cultural feel: 2026 fashion-tech, not 2015 fantasy RPG
```
