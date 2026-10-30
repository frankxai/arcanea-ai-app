# Firstlight 02 — The Kindred Realms

Experimental public review exhibition, not accepted fictional canon.

Owning issue: <https://github.com/frankxai/arcanea-ai-app/issues/697>.
Product route: `/gallery/firstlight-02`, linked from `/gallery`.

## Authority and scope

The fictional source belongs to
`frankxai/arcanean-library/content/proposals/firstlight-02` (merged source `8c64a0aab586a0f98ab0ba4670cf378c51f5a27b`, PR #6).
This repository renders an immutable projection. Source checksums are in
`projection-receipt.json` and the downloadable catalog.

Registry decision `architecture_media_fabric_v2` governs storage: public
checksum-addressed Vercel Blob originals and WebP renditions; GitHub carries
proposals, prompts, lineage, review packets and implementation. No image master
is committed here. The generated PNG and its derived WebP have separate hashes.

The Supabase asset metadata/approval plane is not admitted or mutated by this
bounded release. GitHub review packets are durable proposals and evidence,
not a replacement transactional approval database. Public display approval
binds each exact source PNG; it grants no canon or runtime authority.

Design authority: `Starlight-Intelligence/starlight-design-intelligence` at
`99794fdae86db53fb8b090c66028818edd3dba66`, `brand-packs/arcanea`.
Product chrome uses the existing `@arcanea/design-system` CSS tokens and fonts.

## Publication gate

Run with the actual complete source files:

```sh
node scripts/import-firstlight-02.mjs CHARACTERS_JSON ASSETS_JSON REVIEW_QUEUE_JSON FICTION_SOURCE_COMMIT
node --test scripts/tests/firstlight-projection.test.mjs scripts/tests/firstlight-trial-engine.test.mjs scripts/tests/openrouter-build-boundary.test.cjs
```

The importer refuses private lore, canon promotion, missing media, duplicate
images, mismatched identities, mutable or hostile delivery URLs, missing exact
prompts, and display approval not bound to the original master hash. All twenty
artworks must be registered before it writes the release projection.

The gallery exposes character and view query parameters for review links:
`?character=seli&view=sheet`. Category and search filters also survive in the URL.
Comparison is a local, reversible party selection.

Review receipts must target the canonical `arcanea.fl02.<slug>` ID and exact
asset checksum, name the reviewer and lens, and preserve findings. Use the
downloadable `review-queue.json`; submit receipts through a pull request to the
fiction owner. An exhibition approval never changes `canon_state: proposal`.

## Cooperation trial

`apps/web/public/firstlight-02/trial/` contains a dependency-free scripted browser
simulation. No provider calls, credentials, external tools or durable jobs run.
The action sequence is Observe → Plan → Recover → Bind → Repair → Craft → Verify.
The fixed seed and shared budget are preserved across the two contract variants.
An independent verifier checks the final artifact and bound source receipt.

The sixteen engine tests cover deterministic replay, dependency denial,
pre-mutation budgets, duplicate callbacks, source substitution, bounded repair,
artifact identity and acceptance. They establish local simulation behavior,
not benchmark superiority or a real business result.

`mission-contracts.json` translates the pattern into bounded research, offer and
media-production missions. These are templates, not executed campaigns.
`UNREAL-HANDOFF.md` specifies the authored 75-second game slice. It contains no
Unreal build, rig or production-render claim. The original visual proposals
still require authored geometry, rigging and continuity decisions.

## Proposed follow-on: Replay Forge

Within this product and the existing agent substrate, compile one failed real
workflow trace into the mission envelope. Preserve the source trace revision,
input artifacts and budget. Compare the baseline contract with exactly one
changed handoff contract, then pass each result to an independent artifact
verifier. Acceptance requires a replayable trace, both bounded run receipts and
verifier decisions bound to the actual output hashes. The current scripted
crossing demonstrates the interface only; no live-agent benchmark is claimed.

## Product verification

The app uses Node 24 and the repository's pinned pnpm 11.28.4. Build workspace
dependencies before standalone app typechecking:

```sh
corepack pnpm exec turbo run build --filter='@arcanea/web^...'
corepack pnpm --filter @arcanea/web type-check
corepack pnpm --filter @arcanea/web lint
corepack pnpm --filter @arcanea/web build
```

The dedicated existing-toolchain browser suite covers 375, 768 and 1440 pixel
CSS viewports, all artwork loading, no horizontal overflow, shared links,
search/filter/dialog/compare controls, the full cooperation trial and its
downloaded evidence. It records real screenshots and can explicitly capture
the existing production gallery before release:

```sh
corepack pnpm --filter @arcanea/web exec playwright test --config playwright.firstlight.config.ts
```

`FIRSTLIGHT_CAPTURE_BASELINE=1` admits the read-only production baseline capture.
`PLAYWRIGHT_BASE_URL` chooses the actual tested candidate, and
`FIRSTLIGHT_EVIDENCE_DIR` chooses the local evidence destination. An optional
`FIRSTLIGHT_CHROMIUM_EXECUTABLE_PATH` selects an installed test browser; it never
attaches to an authenticated personal browser.

The model arena previously requested a public supplier catalog during every
production build. The build now uses its existing static fallback; hourly
runtime catalog revalidation is preserved. Regression tests prove zero supplier
requests during the build phase without sending any real network requests.

## Rollback

Revert this bounded gallery and projection through a reviewed pull request.
Keep immutable generated masters, provenance and independent review receipts.
No database migration, domain change or provider credential change is involved.
