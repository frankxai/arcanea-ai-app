# Timeline-aware Atlas: first geographic slice

Status: implementation candidate, not canon acceptance or production promotion.
Owning requirement: [Realm Graph #283](https://github.com/frankxai/arcanea-ai-app/issues/283).
Product base: `b63a7a6ab0d06768a9ced94a4751ce0ec54183e7`.

## Task contract

- Scope: extend `/atlas` with one geographic survey, navigable regions and settlements, a historical moment control, and linked character/event locations.
- Owner: Codex implementation; separate `atlas_review` code/continuity/accessibility review; existing GitHub CI and release workflow.
- Files: existing Atlas route; geographic schemas in `@arcanea/schemas`; deterministic projection in `@arcanea/world-engine`; one Realm Graph fixture; unit/integration/browser tests; existing CI build job; this receipt and planning pickup.
- Non-goals: canon promotion, manuscript import, hosted authoring, database migration, map tiles, city interiors, connected-world navigation, Worldtree cosmology or publication filtering.
- Acceptance: a moment change replaces geometry and linked metadata without overwriting earlier versions; malformed or discontinuous references refuse; keyboard/touch alternatives work at 375/768/1440; existing constellation remains available; source canon stays byte-identical.
- Verification: schema/engine builds, full web types/lint/build, world-engine and World SDK suites, real Playwright interaction and breakpoint captures, independent review, exact-head hosted checks.
- Budget: no new dependency, service, provider call or model inference in the feature. Local computation and existing CI only. This is bounded fixture data, not a scale benchmark.
- Stop: no agent canon promotion; no production claim without receiving deployment/source verification; do not waive required checks.
- Rollback: revert this isolated slice through a normal PR; no data migration or destructive operation is needed.

## Inspection and authority

[PR #564](https://github.com/frankxai/arcanea-ai-app/pull/564) supplies the retained constellation/corridor interface and world engine. [PR #628](https://github.com/frankxai/arcanea-ai-app/pull/628) supplies the current locked-canon projection. The compiler continues to read `.arcanea/lore/CANON_LOCKED.md`, pinned to SHA-256 `58c9c86fd3b540e274d478b91096523031132388b7b18b2fa1d67dee676bf54f`.

The file still describes realm geography as STAGING. A world-engine function or document naming something canonical does not override the compiler's locked-source boundary. This slice adds no official Arcanea coordinates, chronology or character movements.

Main was inspected alongside `agent/codex/gentle-powers-atlas` (PR #701), documentation PR #703 and `feat/living-atlas-ecology-wave-01` at `1e2ebd922c11dc44be641d528af2e41e0154e002`. The latter contains ecology/catalog work, not a versioned geographic map; no foreign branch is merged or rewritten. Academy and Arcanean Library current READMEs establish separate World Proof and narrative roles. Records was inspected but not treated as canon authority. Named `frankxai/arcanea-canon` and `arcanea-architecture-os` lookups returned 404; installed-repository searches returned no matching source. Their contents are unverified.

The required agentic-ops `registry/projections/AGENT_BRIEF.md` lookup returned 404. The current command `ARCHITECTURE-STACK.md` was read. This slice retains existing Next.js/Vercel, SVG and repository state; it makes no new technology, storage, runtime or partner decision. Local `TASTE.md`, `DESIGN.md`, design-system tokens and the web-release gate were loaded. The external Arcanea typography pack could not be read; this uses the local authoritative tokens without inventing a replacement pack.

## One graph, a disposable projection

`packages/world-engine/fixtures/atlas-staging.json` is an ordinary `realm.arcanea.graph.v0` STAGING overlay. It owns the synthetic place/timeline/character/event IDs and uses existing `location` assertions. The fixture source text is preserved separately; every assertion declares its actual SHA-256. No manual character catalog or alternate canon ledger is added.

`geography` assertion values hold a versioned `atlas.feature.v1` geometry and parent/world reference. The assertion owns the stable subject ID, distinct version ID, source, canon status and existing `[from,to)` validity interval. `atlasTimeline` supplies the synthetic viewport timeline and era labels. `to: null` means open-ended, not a claim about real chronology. A local 1000 × 640 survey plane avoids pretending these are terrestrial coordinates or a completed planetary projection.

The pure projector is explicitly a **STAGING visualizer**, not an authority verifier. It parses this bounded atlas overlay, rejects invalid geometry and temporal relationships, and returns a non-canon projection. The deployed route reads only that public fictional fixture; it does not run Git or load locked/private prose at runtime. Tests and hosted CI reopen the exact overlay through the existing `openRealmGraph` compiler against Git, compare both projection paths and exercise continuity/impact. A future accepted-canon adapter must use verified graph authority; passing JSON into this visualizer cannot promote anything.

The current slice supports simple closed polygons without holes, region-to-settlement containment and one world/timeline per projection. It rejects self-intersections, duplicate IDs, overlapping versions, gaps between a feature's consecutive versions, invalid timeline bounds, unknown geometry fields, absent parent coverage, out-of-region settlements and dangling/temporally absent locations. Features may enter or leave the timeline; references must remain valid whenever active. This is reference/geometry continuity, not a general terrain simulation or manuscript contradiction detector.

## Working demonstration

Open `/atlas?tab=geography&moment=49&place=place:fixture-west`.

At 49, inspect the original western boundary and cartographer at West port. Advance the range control by one keyboard step: at 50 the western boundary changes, the cartographer appears at East port, and a one-moment survey flood becomes visible. At 51 that event disappears. Region IDs remain stable while version assertion IDs change. Source history can restore the earlier view. Reload retains moment and place.

The existing constellation remains the default Atlas view. The new geographic component is loaded only when its tab is selected. SVG controls have HTML place-selection alternatives, visible keyboard focus and a zoom mode that renders only the chosen region's interactive shapes. No new automatic motion is introduced. Earlier boundaries have a dashed overlay; character markers use filled/hollow states with a textual legend and equivalent location metadata.

## Direction and extension seams

Three directions were considered: extend the constellation into a geographic metaphor; add a tiled/WebGL map stack; or add an SVG survey with a linked inspector. The linked survey wins because it demonstrates actual temporal geometry and provenance while reusing the current canvas approach, avoiding tile infrastructure, dependencies and a competing world store. The local existing Atlas and ecology branch were inspected as the accepted product benchmarks; no market-leadership claim is made.

City maps can add another coordinate-space adapter keyed to the same place IDs. Connected worlds can share graph relationships while retaining separate map coordinate systems. Cosmology belongs in the existing constellation/topology view, linked by world IDs. Publication-specific views should select reviewed graph snapshots and source visibility through the existing work/scene/release dependency boundary. None of these paths requires copying canon into the map or mutating historical versions.

## Evidence and release state

See `planning-with-files/CURRENT_STATE_2026-11-01_GEOGRAPHIC_ATLAS.md` for the exact candidate checks, independent findings, retained failed attempts, hosted status and highest evidenced environment. Source hashes prove identity; schema/test passes do not prove canon approval or customer acceptance.
