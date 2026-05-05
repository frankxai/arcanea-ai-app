# Las Tierras de Luz — Overnight Excellence Pass
**Date:** 2026-05-05
**Author:** FrankX (synthesized) · Co-author: Ana Cecilia Cancino
**Status:** AWAITING FRANK APPROVAL on Wave 4 (substrate decision) — Waves 1-3, 5, 6 are unblocked
**Supersedes:** Augments `LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md` (does not replace its line-edits)

---

## 0. The brief (Frank, 2026-05-05)

> *"Initial feedback was not great — missing depth, tension, dialogue, and general hooks. Immersion into Arcanea world and Kingdom of Light deeper lore, magical flora and fauna. Make more visually appealing like the Mädchen book. Per-chapter image, glow card with glow flow. Co-author full name: Ana Cecilia Cancino."*

Plus the deeper substrate exploration in `.intake/MIRA_v0.1.md` — Venezuelan/Pemón/convergence layer (Lumes / Eldrian / phenakite / Aiyala / four-tradition convergence). Treated here as Bela's Aurevaldan folk-cosmology, not as a setting relocation.

---

## 1. The diagnosis (verified on disk this turn)

| Surface | Current state | Gap |
|---|---|---|
| Prose (12 ch, ~41K words) | Council-reviewed 7-8 register, signature flaw documented | 30% precision-edit pass already mapped, never executed |
| Visual treatment | Cover only. No per-chapter images. No `BOOK_DESCRIPTIONS`/`BOOK_CHARACTERS`/`ACCENT_MAP` entries in `[slug]/page.tsx` | Renders with default styling — does NOT match Mädchen gold standard |
| Co-author credit | "Ana Cancino" in `book.yaml`, `AUTHORS_NOTE.md`, `BIBLE.md` | Needs full-name update to **Ana Cecilia Cancino** |
| Lore depth | BIBLE has rich flora/fauna/cosmology; chapters surface ~50% of it | Magical flora/fauna underused; Kingdom of Light deeper hooks thin |
| Dialogue density | Some chapters drift to interior monologue (esp. Ch 4, 8, 10) | Voice-engine flaw: reflection out-runs scene |
| Convergence layer | Absent from prose; lives only in MIRA_v0.1.md | Decision needed: weave as Aurevaldan folk-cosmology (Wave 4) or hold for Book 2 |
| Tension hooks | First-page hook is meditative, not propulsive | Chapter openings need stronger forward-pulls |

---

## 2. The plan — six waves

### WAVE 1 — Visual kit + author credit (BLOCKED ON NOTHING · 60 min)

Pure infrastructure. Ships before Frank wakes.

1. Update `apps/web/app/books/drafts/[slug]/page.tsx`:
   - `COVER_MAP['las-tierras-de-luz']` — already has `las-tierras-de-luz-cover.png`, keep
   - `ACCENT_MAP['las-tierras-de-luz']` — gold/amber palette (light/seer book): `text-amber-300`, `bg-amber-400/10`, `border-amber-400/20`, `glow: 'bg-amber-900/[0.08]'`
   - `BOOK_DESCRIPTIONS['las-tierras-de-luz']` — tagline + 3-paragraph description (drafted in §6 below)
   - `BOOK_CHARACTERS['las-tierras-de-luz']` — Mira / Remedios / Tomás / Bela / Don Emilio / Marisol / Señor Vidal / Lucía (8 cards)
   - `bookTint` switch case → `'gold'` for las-tierras-de-luz
2. Co-author rename: `Ana Cancino` → `Ana Cecilia Cancino` across:
   - `book/las-tierras-de-luz/book.yaml`
   - `book/las-tierras-de-luz/AUTHORS_NOTE.md` (3 occurrences)
   - `book/las-tierras-de-luz/BIBLE.md` (1 occurrence)
   - any glossary/credits
3. Verify: `pnpm --dir apps/web run build` passes; visual diff of `/books/drafts/las-tierras-de-luz` vs `/books/drafts/das-maedchen-drei-sprachen` should now match treatment.

### WAVE 2 — Council line-edit pass on existing 12 chapters (UNBLOCKED · ~3 hours)

Execute the precision-edits already mapped in `LAS_TIERRAS_REWRITE_PLAN_2026-04-25.md` §3 — never executed. Plus extend to Ch 4-12 using the same flaw pattern.

**Signature flaw (per all 5 council reviewers):** *prose lands the miracle in correct flat tone, then appends one sentence explaining that a miracle just landed.*

Per-chapter cuts already specified:
- Ch 1: omniscient summary block, doubled fragility metaphor, mother's not-seeing trim
- Ch 2: italicized landing of discovery, busy-mother editorializing, pre-attributed notebook phrase, 600-800 word compression
- Ch 3: narrating loneliness before showing, "three fingers" repetition (4× → 2×), certainty undermine, owl repetition, Bela's chest-touch unconscious gesture, dream sequence elevation

New for Ch 4-12 (this plan adds):
- Ch 4 (cuaderno): notebook entries should land WITHOUT the post-paragraph commentary that explains them
- Ch 5 (Marisol): the dog's gaze IS the scene; resist analyzing it
- Ch 6 (papá llamó): father absence — currently 2,788 words, the shortest chapter, likely needs more scene-weight not less; check for "telling the loneliness" vs "rendering it"
- Ch 7 (costa): first new region — magical flora/fauna currency check; the BIBLE has *espejo de agua, sombracalle pre-passage, La Que Espera* and the chapter likely under-uses them
- Ch 8 (tentación del nombre): introspective by design; preserve
- Ch 9 (treinta-y-dos): the count IS the climax of Beat 2; trim any sentence that names the loneliness
- Ch 10 (umbral): shortest at 2,323 — flagging as suspect; may need a scene added, not cut
- Ch 11 (la hora de Bela): Beat 4 (First Contact) — Bela's chest-touch gesture must be preserved; Aurevaldan harvest song should land WITHOUT translation
- Ch 12 (Las Tierras de Luz): landing — final image must not narrate its own meaning

Dispatched to: **Line Editor & Voice Alchemist** + **Developmental Editor** (parallel passes per chapter).

### WAVE 3 — Depth, tension, dialogue, hooks (UNBLOCKED · ~4 hours)

Frank's primary feedback. This is additive, not subtractive.

**Per-chapter "first-line hook" pass.** Current Ch 1 opens *"She woke before the bells did."* That works. Audit the other 11 — flag any chapter that opens on summary, exposition, or weather. Target: a sensory object or an action in motion within the first three sentences.

**Dialogue density audit.** Each chapter currently runs ~2-4K words. Target ratio: minimum 25% dialogue (raya style, no quotation marks). Chapters that fall below: insert at least one new dialogue beat that earns its scene.
- Ch 4 (cuaderno) is the worst offender — a notebook chapter is by nature interior. Insert one mother-Mira exchange in the kitchen and one Tomás interruption.
- Ch 6 (papá llamó) — the phone call IS dialogue, but check if it lands or if narration crowds it out.
- Ch 8 (tentación) — interior by design; one Bela-Mira exchange minimum.

**Tension hooks per chapter.** Each chapter needs one moment of *forward pull* — a question the reader carries to the next chapter. Map and sharpen:
- Ch 1: Marisol's first direct look (already exists, sharpen)
- Ch 2: Don Emilio's amber-rose destello waking — but reader doesn't yet know what it MEANS for Mira. Plant: she touches the bread, and feels three notes against her palm. (NEW)
- Ch 3: Bela's blue-door, "hace buena tarde para las luces, ¿no?" — already strong
- Ch 4: notebook entries — needs a mystery-hook (a phrase Mira doesn't remember writing? a date that doesn't match?) NEW IDEA — Frank decision
- Ch 5: Marisol bringing Mira to a place she's never been led
- Ch 6: father's voice on the phone, three notes audible behind him in the city
- Ch 7: Costa de los Mil Reflejos — La Que Espera is sighted — already strong
- Ch 8: temptation of naming — what does Mira almost say aloud and to whom?
- Ch 9: thirty-two destellos — but who is the 33rd refusing?
- Ch 10: el umbral — short chapter, may NEED a tension scene (Bela's house door opening, then closing)
- Ch 11: la hora de Bela — Beat 4, the meeting; structural climax already
- Ch 12: las tierras de luz — landing; the hook closes outward, not forward

**Magical flora/fauna deployment audit.** BIBLE has 8 flora + 8 fauna + 4 semi-mythic creatures. Map each to which chapters they appear in. Any creature with zero appearances by Ch 12: insert one scene OR cut from BIBLE for Book 2.

Dispatched to: **Character Psychologist** (dialogue) + **Developmental Editor** (hooks, structure) + **World Architect** (flora/fauna deployment).

### WAVE 4 — Deeper Arcanea / Kingdom of Light substrate (NEEDS FRANK CALL · ~5 hours)

**The decision Frank must make before this wave runs:**

Option A — **Weave the convergence layer as Aurevaldan folk-cosmology** (recommended)
The four-tradition convergence (Pemón mawari · Kabbalah Nitzotzot · Vedic anu-atma · Hesychast uncreated light = Lumes / Eldrian-fragments) becomes a single Aurevaldan oral tradition Bela carries. NOT named with our terms. Surfaces as fragments of grandmother-stories Bela tells Mira in Ch 11-12. Phenakite-equivalent appears in Bela's tin box (Veldarín name: TBD — *piedra de los velos*?). Marisol's role expands toward Aiyala-equivalent (a Lume-coalesced creature) — but resolve: Marisol is the *waiting* dog in this book; the Lume-coalesced creature emerges in Book 2. Sayri (pure Lume-swarm) also Book 2.

Pros: respects the locked Veldoria framing, lets the convergence land through a believer's voice (Bela), preserves the BIBLE.
Cons: subordinates the convergence to a side-character's tradition rather than centering it in Mira's experience.

Option B — **Pivot the book's substrate** (NOT recommended without Ana's call)
Move the setting to a Venezuelan substrate (real tepui, Catatumbo, Pemón cosmology surfaced). Veldoria becomes Aurevalde's neighbor. This is a structural rewrite — 41K words touched.

Pros: lets MIRA_v0.1.md's research land at full weight.
Cons: invalidates Council 2026-04-25 review, restarts the book from BIBLE-up, doubles the sensitivity-reader requirement.

**My read:** Option A. The MIRA_v0.1.md is research — it surfaces *what Mira sees* described in four traditions. The BIBLE has already encoded the in-world mechanism (Gates, destellos, oscuro, First Light scattering). Both can co-exist if the Aurevaldan folk-tradition is the convergence's vessel. Option B should be Book 2 if Ana wants it: *Ana Cecilia Cancino's* Kingdom-of-Light book, set in a Venezuelan-coded Realm where the convergence is centered. Two sister books.

**If Option A:** Wave 4 specific moves —
1. Add a `FOLK_COSMOLOGY_AUREVALDE.md` sister doc to `book/las-tierras-de-luz/` with the four-tradition substrate framed as Aurevaldan grandmother-stories (no real-world tradition names)
2. Insert in Ch 11 (la hora de Bela): one passage where Bela tells Mira an Aurevaldan story containing the convergence's central image (sparks scattered through abundance, gathering through attention)
3. Insert in Ch 11 or 12: Bela's tin box opens, Mira sees the *piedra de los velos* (phenakite-equivalent) and a photograph of a woman who looks like Mira from 60 years ago
4. Update BIBLE §"Aurevalde" to add the cosmology tradition
5. Glossary: add *piedra de los velos*, *los esparcidos* (the scattered ones), *retornantes* (those who gather)

Dispatched to: **Lore Master** + **Consciousness Fiction Master** + **Sensitivity Reader** (final read).

### WAVE 5 — Visual generation (UNBLOCKED · ~2 hours)

**12 per-chapter NB2 images.** Match Mädchen book treatment.

Reference inputs:
- 5 intake images at `.intake/` (May 5 ChatGPT renders + Tierra de Luz prompts) — use as style anchors
- BIBLE landscape descriptions (piedra viva, sombraluz, Río Claro, plateau, costa)

NB2 prompt pattern (per Frank's preference for `gemini-3.1-flash-image-preview`):
```
[Chapter scene description]
Cinematic magical realism. Mediterranean valley town carved from pale gold-cream piedra viva. Soft prismatic light particles (small, ambient, unobtrusive — not lens flares). Warm dawn or dusk palette. Teal-cyan secondary highlights. No text overlay. 16:9.
```

Per-chapter image briefs (1 sentence each):
- Ch 1: Mira sitting against La Abuela's trunk at dawn, Chispa above her shoulder, schoolyard empty
- Ch 2: Don Emilio's bakery, three loaves on a marble counter, an amber-rose glow rising near his chest
- Ch 3: A blue door across a narrow street, an old woman sitting on the threshold with a bowl of green beans
- Ch 4: A small lined notebook on a windowsill, evening light on its pages, valley rooftops beyond
- Ch 5: A grey-brown dog (Marisol) walking ahead of Mira down an empty street, looking back over her shoulder
- Ch 6: A telephone receiver on a wooden table, a single light burning in the kitchen behind, late evening
- Ch 7: La Costa de los Mil Reflejos — chalk cliffs above an inland sea, distant figure half-submerged at horizon
- Ch 8: A name being almost-spoken — a girl's mouth in profile, valley plaza behind, dusk
- Ch 9: A market plaza at the hour of destellos — many warm spots of glow visible against blue twilight
- Ch 10: A threshold — Mira at Bela's blue door, hand raised but not yet touching
- Ch 11: Bela in her courtyard, an opalescent glow rising from her chest, a tin box open on the table
- Ch 12: Wide valley shot at dawn — multiple destellos visible in windows, the tepui-equivalent silhouetted (LOW priority for tepui mention; Veldoria has the Shoulders ranges)

All 12 saved as `apps/web/public/images/books/las-tierras-de-luz-ch01.png` through `-ch12.png`.

**Optional:** cover refresh — current `las-tierras-de-luz-cover.png` works; only refresh if Frank greenlights.

Dispatched to: **Visualist** (image direction) + image gen via NB2 / `mcp__fal__generate_image` if NB2 unavailable.

### WAVE 6 — Web integration + verify (UNBLOCKED · 30 min)

1. Add `![Capítulo N: <title>](/images/books/las-tierras-de-luz-ch<NN>.png)` line at the top of each of the 12 chapter files (immediately after the `# DAS MÄDCHEN…`-equivalent title — see Mädchen Ch 1 for exact pattern)
2. Build: `pnpm --dir apps/web run build`
3. Local visual verify: `/books/drafts/las-tierras-de-luz` vs `/books/drafts/das-maedchen-drei-sprachen`
4. Commit + push (do NOT deploy without Frank's explicit "ship" greenlight per memory rule `feedback_ship_means_ship.md`)

---

## 3. Wave dependencies

```
Wave 1 (visual kit) ──┬─→ Wave 5 (image gen) ──→ Wave 6 (integration)
                     │
Wave 2 (line-edit) ──┼─→ Wave 4 (substrate, IF Option A) ──→ Wave 6
                     │
Wave 3 (depth/tension)┘
```

Wave 1 and Wave 2 can run in parallel.
Wave 3 depends on Wave 2 (don't add new prose into chapters being precision-edited simultaneously).
Wave 4 depends on Frank's call.
Wave 5 can start immediately on Wave 1 completion.

---

## 4. Estimated total runtime

| Wave | Runtime | Owner |
|---|---|---|
| 1 — Visual kit + author rename | 60 min | Coder agent |
| 2 — Council line-edit pass | ~3 hours | Line Editor + Developmental Editor (parallel) |
| 3 — Depth/tension/dialogue/hooks | ~4 hours | Character Psychologist + Developmental Editor + World Architect |
| 4 — Substrate weave (if Option A) | ~5 hours | Lore Master + Consciousness Fiction Master + Sensitivity Reader |
| 5 — Visual generation (12 images) | ~2 hours | Visualist + NB2 |
| 6 — Web integration + verify | 30 min | Coder + Tester |
| **Total (sequential)** | ~15 hours | — |
| **Total (parallel waves 1+2+3+5)** | ~6 hours | — |

Overnight feasible at parallel cadence.

---

## 5. Excellence bar (the 7 gates per memory `feedback_quality_standard.md`)

1. **First Principles** — Mira's gift is attention, not power. Every new beat respects this.
2. **Voice** — Veldarín / raya / no italics / no bracketed translations. Convergence stays implicit.
3. **Design** — page treatment matches Mädchen at parity.
4. **Performance** — `pnpm --dir apps/web run build` passes; per-chapter images are NB2 PNG, lazy-loaded by Next/Image.
5. **Journey** — first-line hooks, tension carried chapter-to-chapter, dialogue density ≥ 25%.
6. **Engineering** — page.tsx maps populated; build clean; no broken Image paths.
7. **Strategy** — does NOT pivot setting. Aurevaldan folk-cosmology absorbs the convergence. Book 2 (Ana's-led) is the Venezuelan-coded sister.

---

## 6. Drafted page.tsx entries (ready to paste, Wave 1)

```typescript
// ACCENT_MAP
'las-tierras-de-luz': {
  primary: 'text-amber-300',
  bg: 'bg-amber-400/10',
  border: 'border-amber-400/20',
  glow: 'bg-amber-900/[0.08]',
},

// COVER_MAP — already exists
'las-tierras-de-luz': '/images/books/las-tierras-de-luz-cover.png',

// BOOK_DESCRIPTIONS
'las-tierras-de-luz': {
  tagline: 'An eleven-year-old in a quiet Realm of the Kingdom of Light wakes one morning to a small prismatic light hovering above her chest — and discovers no one else can see it. Across the narrow street, behind a blue door, an old woman who has been waiting her whole adult life looks up and sees.',
  paragraphs: [
    'Mira lives in Veldoria, a Realm of the Second Settling — a valley of piedra viva and slow rivers, where the stones still hold yesterday\'s heat against your palm and the old sombraluz tree in the schoolyard has been called La Abuela for longer than anyone remembers. On an ordinary morning in la hora de Nero, the warmth above her heart resolves into something visible. She names her quietly: Chispa.',
    'In the days that follow, Mira learns to wake the dormant lights in every being she passes — the baker who has hummed three notes for forty years, the dog who has been walking her to school for four, the silver cat who decides things about people. But her mother sees something and not the something. Her best certainty becomes her loneliest knowing.',
    'Then, across the street, Señora Bela — who came to Veldoria from Aurevalde sixty years ago and has been waiting without knowing she was waiting — looks up from a bowl of green beans and lets her gaze settle three fingers above Mira\'s shoulder. A magical-realism novel of the Kingdom of Light, of inherited longing, and of the three notes that crossed a lost Realm-corridor to find their child.',
  ],
},

// BOOK_CHARACTERS
'las-tierras-de-luz': [
  { name: 'Mira', role: 'The First Witness (11)', desc: 'Prismatic destello she has named Chispa. Hears the valley\'s hum no one else admits to.' },
  { name: 'Remedios', role: 'The Mother', desc: 'Twenty-six years at the bread shop. Wears a piedra viva pendant she has stopped noticing.' },
  { name: 'Tomás', role: 'The Brother (6)', desc: 'Azul-claro destello so bright it erupts. Mira does not sing near him often.' },
  { name: 'Señora Bela', role: 'The Believer (78)', desc: 'Came from Aurevalde sixty years ago. Her destello opalescent, held hidden the way a hand cups a candle.' },
  { name: 'Don Emilio', role: 'The Baker', desc: 'Hummed three notes every morning for forty years. Earned his sweetness after a quiet grief.' },
  { name: 'Marisol', role: 'The Witness-Dog', desc: 'Has been walking Mira to school for four years at six feet distance. Sees, cannot wake.' },
  { name: 'Señor Vidal', role: 'The Sealed One', desc: 'Oscuro destello — Nero\'s natural mystery. Trusts nothing he cannot measure twice.' },
  { name: 'Lucía', role: 'The Plaza Guitarist', desc: 'Learned every song from someone she no longer speaks to.' },
],

// bookTint switch case
slug === 'las-tierras-de-luz' ? 'gold' :
```

---

## 7. The four open decisions for Frank (please reply with letters)

**A. Substrate weave — Option A (Aurevaldan folk-cosmology, my recommendation) or Option B (relocate to Venezuelan substrate)?** Default A.

**B. Cover refresh — keep current `las-tierras-de-luz-cover.png`, or generate v2/v3 like Mädchen has?** Default keep.

**C. Wave 4 timing — execute tonight if Option A, or defer Wave 4 to Ana's review?** Default execute (it's the largest single quality gain).

**D. Ship/deploy — after Wave 6, commit + push + Vercel deploy, or hold for Ana's read first?** Default hold for Ana per the sensitivity protocol.

---

*Plan v1 — assembled from disk read 2026-05-05. Nothing here cited from memory; all chapter counts, cover paths, page.tsx entries, and BIBLE references verified this turn.*
