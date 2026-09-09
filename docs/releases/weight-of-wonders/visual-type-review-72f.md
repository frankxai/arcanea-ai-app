# Weight of Wonders runtime — visual and typography artifact review

Date: 2026-09-09  
Verifier: `/root/wonders_verifier`  
Artifact: GitHub Actions artifact `10106520192`, run `34356936701`, Build job `102485023303`  
Artifact ZIP SHA-256: `1ec58cd528623aa700813f3ed9f0ffdf206887bc62af6c9bb0b6e7c07f70534a`  
Built merge commit: `d30230f0c786cfafa5496e0f022a203c5de762c9`  
Reviewed source: `72f3056400916e187f61b02f50515084bf8c3753`, tree `14bba85703c67cf505a5aa30daafc0bd41793057`

## Integrity

The extracted artifact contains 35 files. Its manifest contains 26 capture records across desktop 1440×900, mobile 375×812, and desktop reduced-motion. Every recorded PNG exists and independently matches the manifest's byte count and SHA-256.

This is a nonfinal artifact because the desktop interaction gate fails at 208 ms. The visual/type findings below are intentionally separated so unchanged presentation does not need another full aesthetic review after a harness-only performance-evidence correction.

## Visual verdict

**PASS — 28/30.** All Weight of Wonders imagery that was blank in the earlier race-affected artifact visibly renders here. The same visual presentation may carry forward if later commits change only the evidence harness and exact capture hashes change solely from a fresh run.

| Criterion | Score | Evidence |
|---|---:|---|
| Hierarchy | 5/5 | The collection hero makes artwork, experimental status, title, premise, and two actions readable in that order. Dossiers give artwork and identity clear priority. |
| Composition | 5/5 | Desktop uses asymmetry and large image fields; 375px layouts restack without horizontal overflow. Atlas pairings remain legible as boss/place relationships. |
| Imagery | 5/5 | Hero, atlas, Orvess, and Vesrane all render in desktop/mobile/reduced captures with correct orientation and strong source fidelity. |
| Responsive behavior | 4/5 | Collection and dossier reports both record reflow true at 375px. The fixed assistant bubble can cover a small amount of text at one scroll position, but the content remains scrollable and no content is structurally lost. |
| Interaction presentation | 4/5 | Phase selection, radio state, consequence copy, and manual brief have clear selected/focus/state treatment. The encounter desk remains dense on 375px but readable. |
| Host fit | 5/5 | Existing Arcanea navigation, dark canvas, restrained teal selection, editorial display face, and Geist UI typography are preserved without a competing visual system. |

Inspected Weight of Wonders captures:

- desktop: hero, atlas, encounter desk, Orvess dossier, Vesrane dossier;
- mobile 375: hero, atlas, encounter desk, Orvess dossier, Vesrane dossier;
- reduced motion: hero, atlas, encounter desk, Orvess dossier, Vesrane dossier.

Reduced-motion presentation is visually stable and matches the intended static hierarchy. The report records no animation name and a `0.01ms` transition duration (`1e-05s`) under reduced preference.

## Typography verdict

**BLOCKED as final portable evidence; implementation checks pass.** The computed typography and fallback mechanics support the intended 15/16 score, but the two dedicated tall specimen PNGs are visibly obstructed by fixed host UI and cannot serve as clean final specimens yet.

Positive evidence:

- Desktop and reduced-motion `h1`: `"Instrument Serif", Migra, Georgia, serif`, weight 400, 86.4 px / 82.08 px.
- Mobile `h1`: same family and weight, 48 px / 45.6 px.
- Body and controls: Geist stack, weight 400, 16 px / 24 px.
- Manual copy: Geist Mono stack, weight 400, 12.48 px / 19.968 px.
- `document.fonts.status` is `loaded` in all three route-state reports.
- Mobile and fallback reports record horizontal reflow true.
- The fallback run blocked webfont requests and retained a 343 px-wide specimen inside the 375 px viewport.

Artifact defect:

- In both `weight-of-wonders-type-specimen-mobile-375.png` and `weight-of-wonders-type-specimen-fallback-375.png`, the fixed Arcanea navbar is stitched across the current-phase paragraph during the tall element screenshot.
- The fixed “Open Arcanea assistant” bubble also overlaps outcome text.
- The screenshot option intended to hide `nav.fixed` did not work in the actual artifact. This is observable in both PNGs, so source intent cannot override the rendered evidence.

Required correction: on the isolated specimen page only, explicitly hide `nav.fixed` and `[aria-label="Open Arcanea assistant"]` in the DOM, assert both are hidden, and then capture the specimen. Normal route screenshots must continue to include the real host UI. A clean normal-font and blocked-webfont specimen is required before assigning the final typography score.

## Other gates observed in the same artifact

- Console/page diagnostics pass in every state: four raw local telemetry errors, all four narrowly classified as expected; zero unexpected console errors and zero page errors.
- Public API opt-ins return 0 / 0 / 6 and `EXPERIMENTAL`; all six delivered image responses are HTTP 200 and match their expected hashes.
- Local lab LCP/CLS observations are within contract: desktop 624 ms / 0.02435; mobile 464 ms / 0; reduced 640 ms / 0.00216.
- Interaction latency passes mobile at 104 ms and reduced motion at 88 ms, but desktop fails at 208 ms. This artifact remains blocked for release regardless of the visual pass.

No ready-to-merge verdict is issued from this artifact.

## Superseding six-entry harness proof

The harness-only candidate at reviewed source `5f58391e087405bd0d798415543ec4f3e55554f7` supersedes the two evidence defects above for the unchanged six-entry presentation:

- CI run `34359016340`, Build job `102492573308`: success.
- Built merge `ab5d9084f3f86f39f38d87557fe6d0a705a09ac8`; source tree `c55c642c46bf64a335f070452b0ff9f0ceefc6ad`.
- Artifact `10107452042`, ZIP SHA-256 `6dfab2287efd0160cd04beb36b0f62550741f19e65eb96a8883a86fb232dee93`.
- 35 extracted files; all 26 manifest capture hashes and byte counts verify independently.
- Lab interaction maxima: desktop 160 ms, mobile 64 ms, reduced motion 80 ms. All retain the 200 ms gate and pass.
- Every state has zero unexpected console errors and zero page errors.
- Both normal and blocked-webfont 375px specimen PNGs are now clean: no fixed navbar or assistant bubble is present, no content is obscured, and no horizontal clipping is visible.

**Typography: PASS — 15/16 for the six-entry base.**

| Criterion | Score | Evidence |
|---|---:|---|
| Role fit | 4/4 | Instrument Serif supplies the editorial story voice; Geist supports controls and body copy; Geist Mono distinguishes the portable brief. |
| Hierarchy and rhythm | 4/4 | Display headings, uppercase labels, phase titles, consequences, and the manual brief form a clear reading order with consistent spacing. |
| Responsive reading | 4/4 | The full 343px specimen reflows at 375px with readable lines, intact controls, and no overlap in both normal and fallback states. |
| Availability and fallback | 3/4 | Normal state reports loaded declared families; the fallback state blocks five actual WOFF2 requests and remains readable. The blocked run proves resilient layout and readability, while computed CSS family strings alone cannot name the browser's ultimately selected local fallback face. |

This superseding artifact validates the corrected evidence method and unchanged base visual/type system. It is not the final release artifact because the approved scope subsequently expands to twelve entries. The final twelve-entry build must reproduce these gates and add direct evidence for the six newly activated records.
