# Arcanea Codex — Prompting System v2

**Job:** `codex-encyclopedia-preview-batch2-2026-07-16`  
**Continuity from:** `codex-encyclopedia-preview-2026-07-16` (Draconis, Veloura, Sol, Arion)  
**SSOT inject:** `CANON_LOCKED.md` · `VISUAL_DOCTRINE.md` · `CHARACTER_CORE.md` · `lore/godbeasts/*`  
**Quality bar:** museum-grade encyclopedia hero (score30 target ≥ 28) · luxury cosmic myth-tech · no AI slop

---

## Why v2 (batch-1 upgrades)

| Batch-1 weakness | v2 fix |
|------------------|--------|
| Single-paragraph prompt soup | Layered design card → compiled prompt |
| Generic “ultra-premium 8K” noise | Concrete camera, material, light, and beat |
| Weak identity locks for humans | Face age / expression / costume / prop locks |
| Godbeast forms sometimes too “pretty generic fantasy” | Distinct silhouette + Vael Crystal material |
| Same camera language for cast vs beasts | Separate **Portrait Bible** vs **Godbeast Hero** templates |
| No explicit anti-slop | Hard positive constraints (what to show instead of “no X”) |
| No motion plan until after still | Motion beat sheet written *with* still prompt |

---

## Design Card Schema (fill before every generate)

```yaml
id: 05-mera-tidecrest
entity_class: cast | godbeast
name: Mera Tidecrest
role: Water-memory bender / truth witness
gate_or_domain: Flow-adjacent Water · memory
frequency_hz: null | 174–1111
bonded_to: null | Goddess name
silhouette: one-line 50px-readable shape
materials: 3–5 VISUAL_DOCTRINE materials only
palette: primary / secondary / accent
light: cosmic dusk + domain light behavior
environment: locked place or academy micro-set
camera: lens + angle + crop (portrait 3:4 | landscape 16:9)
pose_beat: emotional story beat (1 action)
prop: signature object from CHARACTER_CORE / crystal
identity_lock: age, ancestry cues, expression, mark
forbidden: plastic, mud-medieval, isekai glow, neon, spandex, text, watermark, UI
motion_seed: 1–2 sentence I2V plan
```

---

## Compile Rules

1. **Open with identity:** `SUBJECT NAME — ROLE` (encyclopedia card tone).
2. **Form first, pretty second:** silhouette → materials → light → environment → camera.
3. **Materials whitelist only:** crystal, starlight metal, living stone, sacred obsidian, celestial gold, liquid light, nacre, prismatic crystal, void-silk, embersteel — never plastic/leather-only fantasy kitsch.
4. **Light law:** warm gold × cool cosmic blue; domain accent secondary. Never flat gray / neon.
5. **Cast portraits:** high-fashion heroic character bible; controlled power FX (not magic-explosion wallpaper).
6. **Godbeasts:** CREATURES not people-in-suits; monumental scale; Gate temple / realm anchor.
7. **Ban list as positives:** “museum still photography grade, coherent anatomy, single hero subject, clean encyclopedia crop” instead of “no bad hands no blur”.
8. **No text / no watermark / no logo / no UI** always.
9. **Crop:** cast default `portrait` (3:4 / portrait aspect); godbeast default `landscape` (16:9).
10. **Motion seed** must preserve identity (slow, readable, no morph chaos).

---

## Templates

### A. Cast Portrait Bible

```
Cinematic encyclopedia portrait of {NAME}, {ROLE}.
{AGE_SEX_ANCESTRY}, {FACE_EXPRESSION_IDENTITY}, {MARK_IF_ANY}.
Costume: {MYTH_TECH_LAYERS + FACTION MATERIALS}, silhouette {SILHOUETTE}.
Signature prop: {PROP} held/worn with narrative weight.
Pose beat: {BEAT}.
Environment: {PLACE}, {ATMOSPHERE}.
Light: {LIGHT_BEHAVIOR}, halo particle micro-field, volumetric god-rays restrained.
Camera: {LENS}, three-quarter or frontal hero, shallow DOF on eyes, premium fashion editorial + mythic gravity.
Look: luxury cosmic myth-tech, high-fashion heroic, photoreal museum-grade character bible still.
No text, no watermark, no UI, no logo. Portrait aspect.
```

### B. Godbeast Encyclopedia Hero

```
Cinematic encyclopedia hero of {NAME}, sacred Godbeast of the {GATE} Gate ({HZ} Hz), bonded to {GODDESS}.
Form: {CREATURE_FORM_SILHOUETTE} — {SCALE}.
Materials: {VAEL_CRYSTAL + BODY MATERIALS from doctrine}.
Presence: {DOMAIN_ABILITY_VISUALIZED} as environmental physics, not cartoon FX.
Realm: {TEMPLE_OR_REALM}, {TIME_OF_DAY}, cosmic dusk base + domain color.
Camera: wide IMAX hero, {ANGLE}, vertical awe, subject readable at thumbnail.
Look: luxury cosmic myth-tech creature design, photoreal museum-grade, franchise flagship key art.
No text, no watermark, no UI. Landscape 16:9.
```

---

## Batch-2 Design Cards

### 05 — Mera Tidecrest (cast)
- Silhouette: fluid dancer-scholar; trailing water-glass ribbons; vial at hip
- Materials: nacre armor accents, water-glass jewelry, silver-threaded Athenaeum coat, liquid light hair tips
- Palette: ocean blue / silver / seafoam / crystal clear
- Light: liquid shimmer + bioluminescent memory-specks
- Place: calm lesson pool / Abyssal Athenaeum edge, Thal'Maris light
- Beat: listening into still water; one hand above surface; sealed vial unopened
- Prop: sealed water-memory vial
- Identity: young adult woman, precise empathy eyes (sea-glass green-blue), formal distance cracking into courage

### 06 — Emilia (cast)
- Silhouette: adaptive inventor; multi-lens gauntlet arm; upright creator stance
- Materials: prismatic crystal, chameleon-weave atelier coat, starlight metal instrument joints
- Palette: iridescent pearl + spectrum edge accents
- Light: prismatic split near gauntlet; soft white core
- Place: Synthesis workshop overlooking academy crystal spires at dusk
- Beat: calibrating Prisma gauntlet; spectrum threads map a Gate pattern in air
- Prop: many-lensed Prisma gauntlet / field kit of repaired parts
- Identity: young adult woman, elegant invention in eyes, brilliance-as-distance softening

### 07 — Headmaster Akamoto (cast)
- Silhouette: tall bonded captain; weathered flight harness; calm command
- Materials: star-forged harness metal, heat-scarred living leather-crystal hybrid straps, ember-gold rank threads, dragon-scale pauldron fragment
- Palette: deep ember + cosmic blue night + celestial gold
- Light: controlled fire-heat from bond, cool mountain night around
- Place: Akamoto Roost cliff aerie; dragon silhouette soft-bokeh behind
- Beat: orders a dragon stand-down with one open hand; protective severity
- Prop: weathered flight harness with repair marks
- Identity: mature adult male East-Asian-inspired mentor features, silver-streaked dark hair, frighteningly calm eyes

### 08 — Kaelith (godbeast · Foundation · 174 Hz · Lyssandria)
- Form: colossal living-mountain basalt titan-beast (quadruped earth-drake / stone-aurochs hybrid), gravity-warped stance
- Materials: Kaelith Stone (gravity-dense living stone), gold root-veins, moss-crystal geodes, sacred mountain plate
- Presence: air bends toward mass; dust falls upward near shoulders
- Realm: Foundation Temple / living mountain cathedral, gold veins pulsing
- Silhouette: immovable mountain with beast head + tectonic limbs

### 09 — Otome (godbeast · Voice · 528 Hz · Alera)
- Form: crystalline Resonite song-crane / truth-heron (tall sacred avian), throat and primary feathers of vibrating Otome Resonite; wind-ribbon wake
- Materials: Otome Resonite, hollow crystal chimes, wind-woven light membranes, starlight metal beak crest
- Presence: visible harmonic rings; false light shatters into clear tone particles
- Realm: Voice Gate spire above Desert of Echoes / high wind temple, creation-frequency glow (warm-teal + silver)
- Silhouette: tall vertical avian with resonance halo rings (not musical notation glyphs)

### 10 — Laeylinn (godbeast · Heart · 417 Hz · Maylinn)
- Form: Worldtree Deer — organic + crystalline; living jade antlers as branching canopy
- Materials: Laeylinn Jade (grows, heals cracks), living bark-glass hide, soft bioluminescent heart-light
- Presence: ground blooms where hooves land; cracks in jade seal themselves
- Realm: Heart Gate meadow / Whispering Meadows edge at cosmic dusk, soft rose-jade light
- Silhouette: noble stag with worldtree antler crown

---

## Motion Seeds (I2V)

| ID | Seed |
|----|------|
| Mera | Water surface micro-ripples, hair + nacre shimmer, memory-specks drift, gentle push-in to eyes |
| Emilia | Prisma lenses tick, spectrum threads breathe, coat iridescence shift, workshop light drift |
| Akamoto | Harness straps micro-flex, heat shimmer on pauldron, dragon breath steam bokeh, slow calm turn |
| Kaelith | Gold veins pulse 174-slow, dust orbits mass, micro rock-shift, majestic weighty push-in |
| Otome | Resonance rings expand/fade, feather-crystal vibration, wind ribbons, slow vertical orbit |
| Laeylinn | Jade antlers grow micro-buds then settle, meadow biolume, heart-light pulse, gentle turn |

---

## Scoring (30-pt gate — ship ≥ 28)

Identity lock · Silhouette · Materials luxury · Light law · Composition · Lore place · Anti-slop · Motion readiness · Franchise distinctness · Crop usability

---

## Output naming

```
05-mera-tidecrest.{png,mp4}
06-emilia-synthesis.{png,mp4}
07-akamoto-headmaster.{png,mp4}
08-kaelith-godbeast-foundation.{png,mp4}
09-otome-godbeast-voice.{png,mp4}
10-laeylinn-godbeast-heart.{png,mp4}
```
