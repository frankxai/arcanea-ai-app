# Design Brief — *The Russian-Speaker* (Ruslan's book)

**Date:** 2026-05-15
**Author:** Claude (via `/arcanea-book-cover` 5-phase method)
**Artefact:** Book cover, 2:3 portrait, NB2 (`gemini-3.1-flash-image-preview`)
**Save path:** `apps/web/public/images/books/russian-from-tashkent-cover-nb2.png`
**Status:** Locked. Ready for generation.

---

## Phase 1 — Design thinking

### Central tension
Ruslan is a Russian-speaker who is not Russian. Not Uzbek. Born in Tashkent, exiled to Russia, returned to Tashkent to work at the embassy of a state that watches him. **The tension is categorical homelessness** — every place claims a partial version of him and rejects the rest. He is at home everywhere and nowhere.

### Emotional register
Quiet observation. Dry, restrained, slightly cold. The dignity of someone who watched and remembered. Not melancholy, not nostalgic — **clear-eyed**. The register of Bezmozgis, Krasikov, Hemon. Nothing performed.

### Iconic image
The **chinar tree** (*Platanus orientalis*, Чинар, Tashkent's canonical street tree) standing in the courtyard of a Soviet panel apartment block, late summer afternoon, 1989. The tree is the witness. It stands when the country falls. It is still there when the boy returns from Russia. It is cut down in 2007, by which time he is already someone else. The tree lives the entire arc.

### Genre expectations vs subversion
**Shelf:** post-Soviet literary fiction (Bezmozgis, Krasikov, Hemon, Ismailov, Matar).
**Give them:** photographic feel, muted palette, single hero color, object-as-metaphor (Mendelsund mode), restrained serif typography.
**Subvert:** the Brezhnev-nostalgia cover (red star, Cyrillic-stencil, snowy GULAG, samovar-babushka). This is not that book. Tashkent is dry, golden, hot — not the frozen East.

### Color emotional key
**Dust gold** — the dry late-afternoon Tashkent light of August 1989. Supported by **concrete grey** (the panel-block facade) and **deep shadow** (under the tree, the held breath). Three hues only.

---

## Phase 2 — Best-practice principles active

- **Chip Kidd:** One image, one emotion. Illustrate the *feeling* (the in-between, the before-the-fall), not the plot.
- **Peter Mendelsund:** Visual metaphor — the tree is the in-between protagonist who can't speak.
- **Coralie Bickford-Smith:** Pattern + symbol, limited palette, typography is the hero on restraint.
- **Genre = literary fiction:** photograph-crop register, object as metaphor, serif title, negative space.

---

## Phase 3 — Composition lock

**Frame:** 2:3 portrait, 1024 × 1536 target.

**Image:**
A single mature chinar tree (oriental plane, *Platanus orientalis*) standing in the courtyard of a late-Soviet apartment block in Tashkent, late August afternoon, 1989. The tree dominates the frame — broad spreading canopy reaching into the upper two-thirds, mottled pale-and-grey bark, large palm-shaped leaves beginning to turn the particular yellow of a Central Asian August (not yet fall, just the edge). Behind the tree: the textured concrete facade of a nine-story panel-block apartment, slightly out of focus, in deep shadow — one rectangular window on the fifth floor lit warm-gold from within (a single domestic detail, almost missable). Below the tree: a courtyard of weathered asphalt, dry dust drifting at the base, with the suggestion of a long shadow falling across it. The composition is vertical, restrained, photographic.

**Hierarchy:**
1. The chinar tree (witness, anchor, the held thing)
2. The lit fifth-floor window (the family, the small life, just-perceptible)
3. The asphalt and the long shadow (the ground, the present-tense before the fall)

**Light:**
Golden-hour, raking from upper-left, low angle. Long shadows. Dust held in the air catching the light. The tree's canopy backlit, the lit window reading warm against the cool-grey facade. Late summer 1989 quality — dry, retrospective, suspended.

**Palette:** strict three-hue band.
- **Dust gold** (≈ #c89a4a, dirtied — the hero light)
- **Concrete grey** (≈ #8a8780, with cool undertone — the facade, the asphalt)
- **Deep shadow** (≈ #1f1d19 — the negative)
- Negative space: warm cream / bleached late-summer sky (≈ #e8dcc4) showing through the upper canopy

**Typography (designed in post, not in-image):**
Leave the **lower fifth** of the composition clean negative space for type. The prompt instructs NB2 to keep the bottom of the frame empty.

Title typography (added in post-processing):
- **Title:** "THE RUSSIAN-SPEAKER" — Instrument Serif Italic, two lines max, lower-left, ink-on-warm-paper register
- **Author:** "FrankX" — Geist Regular, bottom-right, very small, tracked
- **Optional eyebrow:** "A NOVEL" — Geist Uppercase Light, tracked, just above title
- **Optional dedication line:** "for Ruslan" — Geist Italic, micro, bottom-center (decide at type pass)

---

## Phase 4 — Anti-patterns to reject (must be in prompt)

1. **No Brezhnev-nostalgia cliché** — no red stars, hammer-sickle, GULAG snow, propaganda posters, Soviet stencil typography, Constructivist red-and-black
2. **No babushka / samovar / matryoshka kitsch** — this is Central Asia in August, not a Russian-folk-tale stage set
3. **No magical-realism, no fantasy elements** — no glowing tree, no spirits, no aurora, no fairy-tale luminescence; the warmth is sunlight, not magic
4. **No people front-and-center** — the lit window is the only human suggestion, and it is small enough to be missable
5. **No Arcanea aesthetic** — no glassmorphism, no teal-and-gold-on-void, no crystal nodes, no glass cards, no Atlantean Teal #00bcd4. **This is literary fiction, not premium-visual data design.**
6. **No saturated colors** — the palette is held tight in midtones; no neon, no oversaturated golden-hour HDR, no Instagram filter
7. **No 3D render look** — photographic restraint, no glossy CGI surface, no perfect symmetry, no architectural-viz cleanliness
8. **No invented tree** — must read as a real *Platanus orientalis* / chinar: broad palmate leaves, mottled pale-and-dark camouflage bark, sprawling lateral branches; not a generic "tree silhouette"
9. **No date stamp, no caption, no embedded text inside the image** — the bottom is reserved for type added in post
10. **No film grain overlay or fake "vintage" filter** — the period feeling comes from light and composition, not from a sepia wash

---

## Phase 5 — NB2 prompt (final)

> Photographic book cover for a literary novel, 2:3 portrait orientation. A single mature chinar tree (oriental plane, *Platanus orientalis*) stands in the courtyard of a late-Soviet nine-story panel apartment block in Tashkent, Uzbekistan, late summer 1989. The tree dominates the upper two-thirds of the frame: broad spreading canopy of large palm-shaped leaves just beginning to turn yellow at the edges, mottled pale-and-grey camouflage bark on a thick trunk, sprawling lateral branches. Behind the tree, slightly out of focus in deep shadow, the textured concrete facade of the Soviet apartment block — one single rectangular window on the fifth floor lit warm-gold from within, very small in the frame, almost missable. Below the tree: weathered asphalt courtyard, dry dust drifting at the base, a long late-afternoon shadow falling across the ground. Golden-hour light raking from upper-left, low angle, dust held in air catching the light, tree canopy backlit. Strict three-hue palette: dust gold (#c89a4a dirtied), cool concrete grey (#8a8780), deep shadow (#1f1d19), with warm bleached cream sky showing through the canopy. Photographic restraint, like a Saul Leiter or William Eggleston frame; literary-fiction cover register, like FSG / Knopf / Riverhead post-Soviet diaspora novels (Bezmozgis, Krasikov, Hemon). The **lower fifth of the composition must be kept clean negative space** for title typography to be added later — no text, no caption, no embedded type, no watermark, no signature. No red stars, no Soviet propaganda iconography, no babushka, no samovar, no fairy-tale luminescence, no glowing tree, no magical realism, no glassmorphism, no Arcanea teal-and-gold, no neon, no oversaturated HDR, no 3D CGI look, no film-grain overlay, no symmetrical centered framing. Just a real tree, a real wall, a real courtyard, in real Tashkent light, in 1989. Quiet, observed, before the fall.

---

## Phase 6 — Validation checklist (post-generation)

- [ ] Title would be readable when added to lower fifth at thumbnail size (200px wide)?
- [ ] Genre signal is literary fiction (not fantasy, not Arcanea, not propaganda kitsch)?
- [ ] One hero color (dust gold) dominates; supporting hues stay restrained?
- [ ] Tree is recognizable as chinar / *Platanus orientalis* (palmate leaves, mottled bark, broad spread)?
- [ ] No AI artifacts in the trunk, leaves, or facade?
- [ ] Lower fifth is empty negative space (ready for type)?
- [ ] The lit window reads as a single warm rectangle, not a glowing portal?
- [ ] Late August 1989 quality (dry, golden, suspended) — not winter, not propaganda-red?
- [ ] Portrait ratio confirmed (2:3, not square)?
- [ ] A reader on the FSG / Riverhead shelf would nod (not laugh, not recoil)?

---

## Phase 7 — Integration

1. Save to `apps/web/public/images/books/russian-from-tashkent-cover-nb2.png`
2. Add `russian-from-tashkent` to `COVER_MAP` in:
   - `apps/web/app/books/drafts/page.tsx`
   - `apps/web/app/books/drafts/[slug]/page.tsx`
3. Add `russian-from-tashkent` to `ACCENT_MAP` — recommend **`amber`** (matches the dust-gold hero color and won't clash with the dark Arcanea card chrome)
4. Log NB2 in `book.yaml` `ai_transparency.models_used` (already done)

---

## Coexistence in the drafts grid

The grid currently holds:
- *Forge of Ruin* — blackened iron / grimdark (red accent)
- *Tides of Silence* — cyan / aquatic (cyan accent)
- *Heart of Pyrathis* — fire-amber (amber accent)
- *Song of Van Linh* — teal forest (teal accent)
- *Las Tierras de Luz* — golden Veldoria (amber accent)
- *Das Mädchen, das drei Sprachen hörte* — Adriatic limestone-warm (amber accent)
- **NEW** — *The Russian-Speaker* — dust-gold Tashkent (amber accent)

This cover sits next to *Mädchen* (also amber, also warm, also literary, also memoir-fiction). Distinguished by **register**: Mädchen is gouache-and-pencil children's picture-book; *Russian-Speaker* is photographic adult literary. They share the warmth pole; they part on medium and audience.
