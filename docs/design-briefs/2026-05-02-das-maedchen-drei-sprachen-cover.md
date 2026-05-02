# Design Brief — *Das Mädchen, das drei Sprachen hörte*

**Date:** 2026-05-02
**Author:** design-architect (via /design-brief)
**Artefacts:**
- A — Book cover (2:3 portrait, fed to NB2 / Gemini 3.1 Flash Image via `/arcanea-book-cover`)
- B — Drafts page hero at `apps/web/app/books/drafts/das-maedchen-drei-sprachen`
**Status:** Locked. Ready for downstream generation.

---

## Brief

A six-year-old German girl named Mila stands at a sun-warm Croatian limestone wall on Mali Lošinj, her hand near a cluster of real smilje (*Helichrysum italicum*) — papery gold flowers that pulse once, like a single firefly heartbeat, when she names the world in all three of her languages. Beside her, Luna the black harbour cat with a single white moon over her left eye watches the wall. The Adriatic is a quiet pale-teal slip behind them. The image must feel hand-touched, slightly imperfect, the way a real picture-book illustrator paints — not a render. This is *her* book. Made by a person, for a child crossing languages.

---

## Aesthetic direction

**editorial — gouache-and-pencil-texture editorial.** The Beatrice Alemagna / Sydney Smith / Komako Sakai axis. Visible brush mark. Visible pencil line where gouache lifts. Soft matte paper grain. White of the page allowed to breathe through the limestone. Colour mixed dirty (never pure), warm-leaning, values held in a narrow midtone band with one gold accent that reads as light, not magic.

**Defended because:**
1. The only way to honour the Janosch + Lindgren + Ungerer reference stratum is to commit to physical-media surface
2. Physical-media texture is the single hardest thing for AI to fake convincingly, so committing hard pushes NB2 toward the right reference well
3. It lets the cover hold a warm-light pole next to forge-of-ruin's grimdark pole in the grid without ever competing on saturation — different rooms in the same library

---

## Brand kit

**arcanea** — but with the cover artwork itself led by **smilje gold** (≈ #d8a73a, dirtied) and **pale Adriatic limestone-teal** (≈ #a8c4c0, dusty). The Atlantean Teal `#00bcd4` stays in the page hero chrome (CTA, language-trio chip, focus rings) — it does **not** enter the cover artwork.

---

## Hierarchy (cover)

1. **Mila's hand approaching the smilje on the limestone wall** — the gesture of naming. The pause before the word.
2. **Luna the black cat with the white moon-mark** — low and watchful, grounding the lower third.
3. **The single pulsing smilje** — one cluster lit one stop hotter than the rest, the warmth source.

Title and author sit *below* this trio. The Adriatic, the dolphin, the village — all suggested, none competing.

---

## Composition lock — Cover (2:3 portrait, 1024 × 1536 target)

**Image:** Mila in three-quarter profile, kneeling at a low Croatian drystone wall, right hand reaching slowly toward a cluster of smilje growing from a crack in the limestone — hand near, not touching, the *moment before* naming. Luna sits on the wall to the right, tail curled, white moon-mark catching light. Behind the wall: a soft slip of pale Adriatic, and at the far horizon a single tiny dolphin-curve breaching — readable only on second look (Val is a *promise*, not a feature). Light: golden-hour from upper left, raking across limestone, picking out one smilje cluster brighter than the rest — *that* is the magic, a single flower lit one stop hotter, like a firefly not fairy dust.

**Type lockup:**
- **Title:** *"Das Mädchen, das drei Sprachen hörte"* — **Instrument Serif Italic**, two lines, lower-third left, dirty-ink black on warm cream. The title sits on the wall's stone, like it was always there.
- **Subtitle / language trio:** "Deutsch · Hrvatski · English" — **Geist Light**, small, tracked, tight under title.
- **Author / publisher mark:** bottom-right, Geist Regular, very small. Arcanea Open Library mark only on back flap, never on front.

**Colour & light:** dominant midtone band of warm limestone-cream, smilje-gold, dusty Adriatic-teal. One gold accent (the lit smilje). One cool accent (Luna's black + the sea slip). **No third hue. No gradient sky** — sky is a single dusty wash.

---

## Composition lock — Page hero (`/books/drafts/das-maedchen-drei-sprachen`)

**Layout (desktop, 12-col):**

- **Left 5 cols:** the cover artwork in a glass card (`bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm`), 2:3, no border crop, soft shadow beneath. The artwork's warm gold reads against the dark Arcanea background and instantly differentiates it from forge-of-ruin's blackened iron tone two cards over.
- **Right 7 cols:**
  - **Eyebrow:** tiny **Geist Uppercase** tracked: `OPEN LIBRARY · DRAFTS · AGES 5–8`
  - **Title:** **Instrument Serif Regular**, 56–72px, two lines max, warm cream
  - **Tagline:** **Geist** 18–20px, soft white/70 — *"Auf einer Insel im Kvarner lernt Mila, dass jedes Wort drei Türen hat."*
  - **Language trio:** three glass-card chips, **Atlantean Teal #00bcd4** outline + label: `Deutsch` `Hrvatski` `English`
  - **Read CTA:** solid Atlantean Teal pill, **Geist Medium**, "Read sample chapter →"
  - **Secondary:** "Read in original German · Hrvatski prijevod · English version"
  - **Below the fold:** small attribution row — illustrator credit, written-in-Mali-Lošinj line, smilje botanical note in **Geist Mono** micro-text.

**Coexistence with forge-of-ruin in grid:** forge-of-ruin holds the *cold-iron-darkness* pole (blackened steel, low-key, ash). This cover holds the *warm-stone-noon* pole (limestone, smilje gold, sun-soft). They share: matte texture, hand-feel, restrained palette discipline, Instrument Serif title treatment, identical card chrome. They differ only in *colour temperature* and *value key* — exactly how a real curated bookshelf works. The grid reads as range, not chaos.

---

## Motion profile

**calm** — and **one** hero motion moment only: when the page hero loads, the lit smilje cluster on the cover image performs a single, slow, almost-missable golden pulse (1.4s ease-in-out, opacity 1.0 → 1.15 → 1.0, scale 1.0 → 1.02 → 1.0), once, never repeating until route revisit. **That is the entire motion budget.** No parallax. No shimmer. No floating petals.

---

## Anti-patterns — things the NB2 prompt MUST reject

1. Pixar-large eyes, anime eyes, glossy plastic skin, "cute" stylisation
2. Disney mouth shapes, smiling-tooth grin, posed cheer
3. Glitter, sparkle particles, lens flares, bokeh dots, fairy dust
4. Rainbow gradients, magenta/cyan duotone, neon, saturated sky
5. Digital airbrush smoothness, render-engine lighting, 3D depth-of-field
6. Generic "Mediterranean" — bougainvillea cliché, white-and-blue Greek-island palette, Venetian gondolas, pirate flags
7. "Magical girl" tropes — wand, tiara, swirling sleeves, kawaii sidekicks
8. Invented plants — must read as real *Helichrysum italicum* (small clustered papery yellow florets on grey-green narrow leaves, woody base)
9. Symmetrical centred portrait, eye-contact-with-camera, hero-pose
10. Title in a fantasy script font, gold-foil-stamp effect, drop shadow on type

---

## NB2 prompt seed (for `/arcanea-book-cover`)

> Children's picture-book cover illustration, 2:3 portrait, in the tradition of Beatrice Alemagna, Sydney Smith, Komako Sakai, and Tomi Ungerer — gouache and coloured pencil on warm cream paper, visible brush texture and pencil grain, slightly imperfect by hand. A six-year-old girl in a simple linen dress kneels at a low Croatian drystone limestone wall on Mali Lošinj, three-quarter profile, her right hand reaching slowly toward a cluster of real smilje (*Helichrysum italicum*, small papery yellow florets, narrow grey-green leaves), one cluster lit one stop brighter than the others — like firefly light, not fairy dust. A black harbour cat with a single white moon-mark over its left eye sits on the wall beside her. Behind: a thin dusty-teal slip of Adriatic, far horizon a tiny dolphin curve. Golden-hour light from upper left, raking limestone. Palette: warm limestone cream, dirty smilje gold, dusty Adriatic teal — three hues only. Matte, hand-painted, restrained. Empty lower-third for title type. No digital airbrush, no Pixar eyes, no sparkle, no gradients, no symmetry.

## Page hero seed (only if separate editorial illustration needed)

> Editorial spot illustration, gouache-and-pencil, in the tradition of Carson Ellis and Isabelle Arsenault — a single sprig of real *Helichrysum italicum* (smilje) lying across a sun-warm grey limestone surface, three small Croatian-island wildflower companions (sea-lavender, wild thyme), painted at slight angle as if just gathered. One smilje floret glows one stop hotter than the rest. Warm cream paper showing through. No background. No frame. No type. Matte, restrained, hand-touched. Three-hue palette: cream, smilje gold, dusty teal-grey.

---

## Hand-off

**Next:** `/arcanea-book-cover` against `gemini-3.1-flash-image-preview` (NB2) using the prompt seed above. Generate 3 variants. Save to `apps/web/public/images/books/das-maedchen-drei-sprachen-cover-v{1,2,3}.png`.

**After cover lands:**
1. `design-generator` to wire `/books/drafts/das-maedchen-drei-sprachen` hero per the composition lock above
2. `design-motion` for the single golden-pulse moment
3. `design-verifier` for Lighthouse + screenshot diff against forge-of-ruin grid neighbour
