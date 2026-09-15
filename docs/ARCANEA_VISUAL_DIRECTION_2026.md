# Arcanea Visual Direction 2026

Status: design/media brief for Genesis, Chosen Responsibility, and Creator Forge. This is not a locked canon file.

Updated: 2026-06-26

## Visual Thesis

Arcanea should look like a premium creative intelligence lab where living worlds are being born, not a generic fantasy portal.

The visual system should merge:

- luminous mythic intelligence
- cinematic worldbuilding
- editorial publishing seriousness
- precision software craft
- rights/provenance trust

Avoid the easy trap: purple fantasy gradients, floating symbols, generic wizards, and vague cosmic spectacle.

## Authority Conflicts To Resolve

Before a full visual rollout, resolve these local contradictions:

| Conflict | Risk | Recommendation |
|---|---|---|
| `DESIGN.md` and `TASTE.md` emphasize different palette language. | Agents may drift into one-note teal/blue or old gold fantasy. | Treat dark AI-lab premium with controlled teal/gold/ivory as the product UI default. |
| Older visual docs/assets lean on sacred geometry or generic glass language. | The product can look like fantasy wallpaper rather than software. | Keep mythic symbols inside artifacts/world content, not primary UI chrome. |
| Existing assets vary between app chrome and README/fantasy banners. | Inconsistent premium perception. | Use `apps/web/public/brand/arcanea-dashboard-hero-premium.png` as current strongest hero anchor. |
| Onboarding and dashboard still carry older mythology-first language. | The Call -> Gift -> Trial arc is not yet product-native. | Redesign onboarding around Genesis before expanding media campaigns. |

## First-Viewport Image Direction

The first viewport should make the product legible without reading copy:

```text
a creator speaks or writes a sentence
-> a coherent living world seed appears
-> laws, characters, visual DNA, music, rights, and memory form around it
```

The image must show the actual product promise: creation turning into an owned world artifact.

## Visual DNA

| Dimension | Direction |
|---|---|
| Materials | dark glass, vellum-light panels, brushed black metal, luminous ink, crystalline memory shards |
| Light | intelligent gold, white-blue source glow, soft cinematic rim light |
| Color posture | neutral black/graphite base with controlled gold, cyan, and warm ivory accents |
| Forms | world maps, character silhouettes, manuscript pages, graph lines, proof seals, memory constellations |
| Motion | slow reveal, ink-to-interface, constellation linking, proof seal resolving |
| Texture | editorial paper grain meets high-end AI lab polish |

## Forbidden Visuals

- Generic robed wizard as primary brand symbol.
- Cultic circles, worship scenes, or chosen-elite imagery.
- Dehumanized enemies.
- Random orbs or gradient blobs.
- Purple-blue fantasy haze as the whole palette.
- Stock-photo creator staring at floating UI.
- Crypto wallet/minting as the emotional center.
- Busy route-feature collages that hide the Genesis promise.

## Hero Concept Prompts

Use these as production prompts for image/video tools. Each prompt must be followed by critic review and visual QA before becoming final.

### Concept 1: The First Gift

```text
Ultra-premium cinematic product hero for Arcanea, a creative intelligence lab where a human creator writes one sentence and a living world seed forms above a dark glass desk: miniature terrain, two character silhouettes, luminous manuscript pages, rights/provenance seal, memory graph threads, intelligent gold and white-blue source light, editorial sci-fi fantasy, precise software UI details, no wizard robes, no cult symbols, no generic fantasy portal, no purple haze, 16:9, high-end Apple/Vercel-level polish, readable negative space for headline, ready for critic
```

Negative constraints:

```text
no cult, no worship, no dehumanized enemy, no NFT hype, no stock photo, no random orbs, no low-detail UI, no fake unreadable text walls, no childish fantasy, no one-note purple palette
```

### Concept 2: The Drift Answered

```text
Cinematic wide hero image for Arcanea's Chosen Responsibility doctrine: a creator stands before fragmented streams of misinformation, forgotten manuscripts, disconnected social signals, and tool interfaces; from their workspace emerges a coherent living world map with named laws, a first gift card, and a proof artifact; mood is calm, responsible, luminous, premium, source-grounded, not apocalyptic, not fear-based, gold/cyan/ivory accents on graphite, sophisticated editorial composition, 16:9, ready for critic
```

Negative constraints:

```text
no screaming crowds, no political enemy, no panic propaganda, no chosen-one superiority, no religious cult framing, no generic cyberpunk
```

### Concept 3: Creator Forge

```text
Premium Arcanea Creator Forge visual: a world bible transforms into market-ready creator products on a refined studio table: character cards, visual DNA swatches, prompt pack, music waveform, rights sheet, publishing edition, agent workflow diagram, all connected by subtle memory/provenance threads; elegant dark editorial AI studio, warm ivory paper, black glass, gold foil accents, precise typography-like layout without readable fake brand text, 16:9, ready for critic
```

Negative constraints:

```text
no cluttered dashboard collage, no cheap fantasy props, no crypto coins, no exaggerated neon, no low-quality mockups
```

## Mobile Visual Direction

Mobile should crop around the artifact, not the creator. The first view should show:

- Gift card.
- World seed.
- One proof artifact.
- Clear CTA.

Avoid tiny dashboard screenshots.

## Motion Direction

Motion should feel like cognition becoming structure.

| Moment | Motion |
|---|---|
| Call submitted | text breathes into a stable intent chip |
| Gift appears | card resolves from luminous ink and locks into readable structure |
| World seed | map/laws/characters assemble in restrained stagger |
| Proof artifact | seal or checkmark appears only after user action |
| SIS record | memory thread connects artifact to source/rights/canon status |

Motion rules:

- Use restrained 180-600ms transitions.
- Avoid constant sparkle.
- Avoid loading theatrics that delay proof.
- Respect reduced motion.
- Use one signature behavior per page.
- Do not depend on autoplay video for comprehension.
- Prefer world-graph edge draw and proof-ledger reveal over floating particles.

## Image QA Gate

Score each generated asset out of 30:

| Criterion | Points |
|---|---|
| Product promise legible | 5 |
| Arcanea-specific visual DNA | 5 |
| Premium craft | 5 |
| No forbidden patterns | 5 |
| Supports text/layout | 4 |
| Rights/source suitability | 3 |
| Mobile crop viability | 3 |

Ship at 26+. Iterate at 22-25. Restart below 22.

## Front-End Visual Risk Register

| Surface | Risk | Fix |
|---|---|---|
| Dashboard | Still reads like a library/product hub rather than a proof ledger. | Reframe around Gift, active world, proof artifacts, and next mission. |
| Onboarding | Older "Awaken" and guardian-first flow competes with The Call. | Make The Call the first action; guardians/Luminors appear as support later. |
| World generation | Gift, right-use, source/rights, and proof metadata are not first-class. | Persist those fields in world generation and SIS records. |
| Media pipeline | Provider/docs/assets are uneven. | Create a media manifest with source, usage tier, prompts, and QA score. |
| Accessibility | Broad lint disables and ambient motion can hide issues. | Verify reduced motion, contrast, focus, and mobile screenshots before release. |

## First Visual Production Queue

1. Generate three hero candidates using the prompts above.
2. Score with the 30-point gate.
3. Pick one visual direction for `/genesis`.
4. Produce desktop and mobile crops.
5. Verify with actual screenshots, not imagination.
6. Record prompt, model, source rights, and score in SIS.
