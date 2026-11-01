# Geographic Atlas candidate — 1 November 2026

Requirement: #283. Base `b63a7a6ab0d06768a9ced94a4751ce0ec54183e7`.
Branch: `agent/codex/timeline-geographic-atlas`.
[Contract, authority and architecture](../docs/architecture/ATLAS_GEOGRAPHY_V1.md).

The existing `/atlas` now has a geographic history tab. It uses one public fictional STAGING Realm Graph overlay, typed geographic feature values, immutable version assertion IDs and the existing validity/source/location semantics. It does not accept or rewrite Arcanea canon.

At moment 49, the original western border and West port character location appear. At 50, the border changes, the character moves to East port and a one-moment flood event appears. At 51 the event expires. Historical geometry remains available; the inspector and URL recover the selected state.

Initial tests reproduce the missing geographic API. Implementation first passes four of five new cases; graph-vs-fixture comparison exposes input-order dependence. Deterministic assertion ordering repairs it. Full engine suite: 13/13 pass. Full sequential World SDK suite: 113/113 pass, zero skipped. These include the fixture's source hash and graph/compiler authority, validity endpoints, malformed geometry, parent/reference continuity and source nonmutation.

First local browser run: 7/7 pass, including end-to-end timeline/location/history/URL interaction and 375/768/1440 × light/dark with reduced motion. An independent reviewer identifies P2 off-screen keyboard targets while zoomed and misleading filled markers for empty ports. Both are fixed; zoom regression is added. The browser spec is wired into the existing CI build job, reusing its production build and installed Chromium. Current screenshots and final rerun status are recorded below after completion.

Retained environment attempts: the first install used environment pnpm 11.25.0; frozen filtered installation was repeated successfully using repository-pinned 11.28.4. Pinned browser downloads returned invalid archives; a local official Chrome 130 headless-shell binary enabled browser checks after the full Chrome binary hit the sandbox's Unix-socket restriction. This is local older-browser evidence, not the repository-pinned hosted browser. The first dev launch omitted an explicit hostname and failed on interface enumeration; the successful runner uses 127.0.0.1. The first Playwright runner had an incorrect cwd and was corrected. Initial full web TypeScript exhausted Node's default heap; retry uses 6144 MB. No gate or compiler setting was weakened.

Initial full web lint passes. Scoped lint also passes. Final type/build/format/guard checks, exact-revision independent re-review, hosted checks and production release status remain pending until recorded with evidence. Before images exist at all six required viewport/theme combinations; after images must be recaptured after the final UI edit. No Lighthouse/field CWV claim is made.

Recovery: revert this slice. Existing constellation, locked source, manuscripts, publication approvals and database state remain intact. No new server, agent scheduler, storage or paid inference is introduced. Follow-up scope is accepted geography and reviewed source adapters, then city coordinates and publication projections, rather than inventing more official lore.

## Final source and local qualification

- Web TypeScript: 9/9 Turbo tasks pass with the larger heap.
- Full web lint passes; final changed-file lint and Prettier checks pass.
- Final full engine suite remains 13/13; continuity and impact both reuse the Realm Graph. Full sequential World SDK remains 113/113, zero skipped.
- Corrected browser suite: 7/7 pass. It verifies the zoom keyboard correction, URL reload, malformed URL fallback, old/new boundary vertices, the character move, event expiry, earlier-source history and all six viewport/theme combinations with reduced motion.
- Independent reviewer `atlas_review` rechecks both corrections, reruns all five geographic cases and inspects actual 375-dark and1440-light screenshots. No remaining concrete changed-scope defect found. This is an independent source/visual review, not a formal GitHub approval.
- Estate guard: zero critical, zero high; 10 pre-existing medium and224 low findings remain outside scope. No settings/policy changes.
- Locked source remains byte-identical at the hash above. No changes under `.arcanea/lore/`.

Before/after lossless browser images and source screenshot hashes are in [docs/evidence/atlas-geography](../docs/evidence/atlas-geography/). Images are local development-server evidence on Chrome130; the repository-pinned hosted browser remains a separate check. The feature introduces no automatic animation; existing dark page styling was inspected under both theme preferences. No Lighthouse or field CWV measurement was run.

Default full production build fails locally while fetching existing Instrument Serif and JetBrains Mono Google Fonts. No font or TLS policy is changed. Alternate webpack build is an additional environment diagnostic, not a replacement for the default hosted gate. Production promotion remains withheld until the exact-head default build, required hosted review and receiving checks pass.

The webpack diagnostic compiles the application, then fails its generated route-export checks on existing `project*RouteDeps` exports under `/api/projects`. Those route files are byte-identical to the base and outside this slice. The normal `next typegen` + web TypeScript gate passed separately; neither local production build attempt is recorded as a complete build pass. Required default hosted build remains the release gate.
