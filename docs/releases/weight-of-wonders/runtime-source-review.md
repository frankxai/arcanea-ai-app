# The Weight of Wonders — independent runtime source review

Verifier: `/root/wonders_verifier`  
Review date: 2026-09-09  
Scope: exact runtime PR 375 head `bb8220e5e1ea5205380c460e618ace8992e6f2b9`

## Current verdict

**SOURCE PASS; release remains BLOCKED pending successful rendered/CI evidence and production proof.**

The route, dossier, schema, public API and MCP source preserve the experimental trust boundary. No source reviewed here claims a playable game, published novel, locked canon, package publication or deployed availability. The API returns no records unless both `includeProposals=true` and `includeExperimental=true`; its filters are bounded. The MCP reader requires both boolean opt-ins before network access, uses a fixed production origin, URL-encodes caller input, rejects redirects, times out, constrains the collection identity/status/count and fails closed if the response weakens `EXPERIMENTAL` status.

The pages use the existing design tokens and type variables, no raw colors, no new font, no decorative motion, and no banned copy. Native links, buttons, details, radio inputs, a labelled textarea, focus-visible outlines, `aria-pressed`, live status text and a visible manual-copy field establish a sound accessible structure. Actual keyboard order, contrast against imagery, reflow, computed fonts, touch behavior and screen-reader output remain runtime questions.

## Resolved source issues

- `CopyBrief` originally kept “Copied to clipboard” after the selected ending changed, while the textarea had updated and the clipboard was stale. The maker added a `value`-dependent reset and the browser script now checks copy → change ending → “Ready to copy” + updated textarea. Source review passes this fix; the built interaction still requires capture.
- The collection title now supplies `The Weight of Wonders` to the root `%s | Arcanea` template, avoiding duplicated `| Arcanea` branding. The Open Graph title may remain fully branded.
- The collection-hero decode selector now targets `section[aria-labelledby="wonders-title"] img`, so a navbar image cannot accidentally satisfy the readiness check.
- The capture plan now covers both Orvess and the portrait-oriented Vesrane dossier in desktop, 375px mobile and reduced-motion states. It also creates real mobile and font-request-blocked type specimens.
- Clipboard success stays on the primary page; rejection now runs on an isolated page with an injected failure and verifies the exact recovery text plus full textarea selection. This removes the former temporal-dead-zone and clipboard-stub contamination failures.
- The Event Timing report now distinguishes measured entries from a truthful `<16 ms` observer upper bound. It requires real click interactions and never reports an unobserved interaction duration as measured zero.
- The final metric correction retains every raw event, excludes `interactionId=0` events from the INP-style candidate, groups qualifying event entries by interaction ID, and applies the unchanged 200 ms budget to the slowest group. All state reports, captures and the built-app manifest are written before the runner applies that gate, so a failure remains diagnosable rather than becoming a partial four-file artifact.
- Computed typography now positively asserts Instrument Serif at weight 400 for the heading, Geist for body/control and Geist Mono for the textarea.
- The first c059 exact-head CI capture exposed an ambiguous phase-description locator because the same sentence also appears in the manual-copy field. ca642 correctly restricted the selector to a paragraph, but incorrectly anchored its first sentence to the end of the three-sentence paragraph. b2b1378 removes that end anchor while retaining paragraph scope. The capture manifest records the CI checkout (`builtCommit`) and PR head (`reviewedSourceCommit`) separately, so evidence from GitHub's synthetic merge commit is not mislabeled as a head-commit build.

All 18 local review files produce the same Git blob IDs as `runtime-final-scope.json` for exact head `bb8220e5e1ea5205380c460e618ace8992e6f2b9` and tree `61241e2cb64f432076623e0f9ef780865df954a4`. GitHub's current PR test merge `23f292170675f9253b553ba4e55afb7c473642eb` has the same tree, with parents `6836e8d55a5e4c6c33dc68a2c5b67d82dcb1a726` and bb8220, so a successful artifact that records the merge as `builtCommit` and bb8220 as `reviewedSourceCommit` tests the reviewed source tree. The 16 product/source blobs remain identical to c059; subsequent commits change only the two proof-harness scripts. The three browser scripts pass Node syntax checking, and the scoped paragraph assertion matches the single corresponding source record. These source-level corrections become release evidence only after exact-head CI executes them and preserves its reports and PNGs. A computed family declaration and `document.fonts.status === "loaded"` are not on their own proof that a face rendered; the normal specimen, blocked-font specimen and request evidence must be assessed together.

## Verified source behaviors

- Collection and all six item records use schema literals for `EXPERIMENTAL`; IDs, slugs and reciprocal boss/place pairs are constrained.
- Each boss exposes three selectable phases and three radio-button outcomes. The selected outcome changes the generated brief.
- Clipboard rejection produces a specific manual-copy instruction; the textarea is always present and selects its contents on focus.
- Dossiers render every `artNote`, keeping image evidence distinct from encounter/story proposals.
- Dossier images preserve declared aspect ratios; portrait art uses a height-aware full-image container and every dossier offers a direct full-art link.
- Collection metadata says “experimental concepts”; dossier metadata begins “Experimental”. Open Graph image metadata includes dimensions and alt text.
- The collection labels the trilogy “Proposed” and the prose “opening fragment”; its footer says encounters are authored concepts and the trilogy is an outline.
- The public API's default, proposal-only and double-opt-in states are directly tested as `0`, `0`, and `6`. Malformed kind input is tested as `400`.
- MCP tests prove no network access without both opt-ins, fixed-origin query construction and fail-closed handling of a downgraded canon status.
- The CSS uses existing Arcanea tokens. Computed token-pair checks give contrast ratios of 17.05:1 for primary-on-void, 9.09:1 for secondary-on-void and 8.66:1 for teal-on-void; image-overlay contrast still needs browser evidence.
- The release copy scan reports zero diagnostic hits on the collection and dossier routes. The only gallery-page scanner hits are the existing Sovereign Depths proper name/import paths, not copy defects.

## Evidence still required

- Frozen runtime exact-head commit and exact changed-file/textual-diff scope.
- Passing typecheck, lint, build and focused web/MCP tests at that exact head.
- 1440px desktop, 375px mobile and reduced-motion PNG captures of collection and representative portrait/landscape dossiers.
- Interaction JSON and captures for reciprocal navigation, all phase/outcome controls, copy success, stale-status reset, clipboard-failure fallback, public API `0/0/6`, MCP opt-ins and six exact delivered image hashes.
- Computed-font JSON tied to the preview URL, plus desktop/mobile and webfont-blocked fallback specimens.
- Item-level typography and complete-page visual scores based on those artifacts.
- Accessibility, performance, link, claims, privacy, analytics and console reports whose JSON content exactly matches the receipt summaries.
- Preview/production URL correspondence, reviewed production commit, exact production changed paths, post-deploy verification and an ancestor rollback commit.
