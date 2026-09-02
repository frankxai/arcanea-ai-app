# Living Atlas Ecology Wave 01 — 2026-09-02

## Contract

- Owner: Codex Living Atlas lane
- Branch: `feat/living-atlas-ecology-wave-01`
- Scope: Covenant Ecology contract, staged lore registry, Arcanea Ecology Forge skill, Codex plugin package, four deterministic MCP tools, `/lore/ecology`, ten illustrated plant dossiers, optimized delivery images, media receipts, and navigation discovery.
- Non-goals: no locked-canon promotion, production merge, package publication, public rights assertion, raw PNG ingestion, change to the existing 130-record `/gallery` contract, or public dossier for an unillustrated support organism.
- Acceptance: one World Engine `EcologyEntry` authority; website consumes it through a view adapter; source claims stay separate from proposal mechanics; ten Wave 01 plants have hash-verified 4:3 WebP media; public atlas shows no placeholder specimen tiles; generated media remains staged and not authorized for production publication; skill/plugin validators and scoped code tests pass; a draft PR and Vercel preview provide reviewable evidence.
- Verification: World Engine build and ecology tests; MCP TypeScript build; Living Atlas catalog tests; web type-check/lint/build; registry regeneration; plugin/skill validation; image decode/dimension/hash audit; Playwright desktop, mobile, keyboard, reduced-motion, route, and console checks against the preview.
- Rollback: revert the bounded branch or close its draft PR. No database, storage bucket, production domain, canon lock, package registry, or external publication is mutated by this slice.

## Decision

Ecology remains in `frankxai/arcanea-ai-app` while the schema, lore, skill, plugin, website, and media governance co-evolve. The monorepo owns one canonical World Engine contract and one hand-maintained skill source. The plugin contains a generated skill mirror and calls the versioned MCP package.

A separate repository is deferred until ecology has an independent release cadence, license/governance, multiple external consumers, or materially different media infrastructure. Extraction must move the contract and registry together and publish a versioned dependency back to the monorepo; it must never create a second canon authority.

## Wave 01 roster

| Gate | Plant | Evidence posture |
|---|---|---|
| Foundation | Stonegrass | Source-attested base; detailed mechanism proposal |
| Flow | Tideplant | Source-attested base; detailed mechanism proposal |
| Fire | Heartbound Emberlily | Original proposal grounded in Pyrathis staging context |
| Heart | Choirheart Rose | Original flagship proposal |
| Voice | Floración Azul | Source-attested base; detailed mechanism proposal |
| Sight | Espejo de Agua | Source-attested base; detailed mechanism proposal |
| Crown | Granada Lumínica | Book-source name; detailed mechanism proposal |
| Starweave | Aevor Threadvine | Original proposal |
| Unity | Sombraluz | Source-attested base; detailed mechanism proposal |
| Source | Firstseed of Shinkami | Original proposal |

## Release posture

- Ten habitat masters are staged with deterministic paths, 1448×1086 dimensions, byte counts, SHA-256 receipts, alt text, generation-interface receipts, and production-pass review scores.
- Four unillustrated support organisms remain relationship-only records and cannot enter the public specimen grid or static dossier routes.
- `rightsState` remains `review-required`; `publication` remains `not-authorized`.
- The branch is a review surface. Frank/FrankX retains canon lock, package publication, merge, and production release authority.
