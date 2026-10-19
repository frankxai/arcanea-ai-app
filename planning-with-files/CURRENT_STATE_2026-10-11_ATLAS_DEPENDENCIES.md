# Atlas frozen dependency repair

Owner: Codex thread `01a127b9-5a4e-7b83-ae44-ddc8e8a6a8cb`.
Origin: `https://github.com/frankxai/arcanea-ai-app.git`.
Branch: `agent/codex/atlas-dependencies-20261011`.
Base: `d2285fb74f296ce783d3f0fed9bdef6959e3f9d9`.
Issue: [598](https://github.com/frankxai/arcanea-ai-app/issues/598).
Related programme: #276; Dependabot alerts #83, #76 and #74.

User job: maintain a repeatable dependency foundation for Arcanea's creative
workspace and retained Atlas configuration. Atlas currently has no tracked
pages. This slice repairs its graph and checks actual dependencies; the broader
creator, manuscript, model and tenant release remains open.

Scope: Atlas package manager/configuration/lock/README, the complete graph
verifier, source-map and native Sharp regression tests, the focused hosted
workflow and this pickup. Nine explicit files are owned in a separate lane.
The root application lock/workspace, official canon and peer product work
remain outside the write scope.

The original v6 frozen lock actually fails PNPM 11.28.4 with
`ERR_PNPM_LOCKFILE_BREAKING_CHANGE`. Source-map registry archives 1.2.1 and
1.2.2 were validated against SHA512 SRI and SHA1 before bounded extraction;
no lifecycle scripts ran. The same five behavior tests fail three methods
against 1.2.1 and pass all five against 1.2.2. They exercise invalid quantities,
oversized and nested offsets, and normal mapping/code preservation without
walking or serializing huge gaps. An unrelated indexed column-zero boundary
returns null in both versions; the valid control queries within the segment.

The migration normalizes the exact source-bound graph to lock v9, preserving
292 snapshots, all top-level versions/specifiers and unrelated metadata/edges.
It updates only source-map-js, Sharp and Sharp's packaged native family.
Twenty-eight target registry metadata records have matching SRI, platform,
engine and peer metadata, subject to PNPM's explicit optional-peer wildcard
normalization. Legacy `dev`/`requiresBuild` fields are removed and optional
peers move to modern snapshot placement. This is an explicit offline migration;
PNPM regeneration and a local full installation are not claimed.
PNPM 11.28.4's local frozen lock-only validation passed supply-chain checks
for all 291 metadata entries. That check does not install native binaries.

The executable graph verifier compares the complete graph to the immutable
base. Linux/Windows hosted jobs must perform frozen standalone installation,
seven actual dependency behaviors, a configuration build and dependency-input
mutation checks. Native tests check loaded librsvg >=2.63.2 and correct pixels
from a benign SVG. They do not demonstrate exploitation. Root build, type,
lint and required CI gates also remain required.

The local machine's build admission was HOLD at 5606 MB free against 8192 MB
required; only ordinary editing and small sequential tests were performed.
No new local workers, full install, browser or build were started. Machine
policy loading does not imply runtime enforcement across other agents.
Root guide SHA256: `36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`.
Quality policy SHA256: `7911a4568a41fd3be4402ad5e1d1846e7ddd0e069b57b5b1536dd98cc387b481`.
Canon remained read-only at SHA256
`58c9c86fd3b540e274d478b91096523031132388b7b18b2fa1d67dee676bf54f`.

Acceptance pending: frozen installation and native behavior on both hosted
platforms, changed-scope build/types/lint, exact-revision independent review,
normal merge, receiving checks and Dependabot ingestion. No alert was manually
dismissed. http-cache-semantics #74 has no published patch and stays open;
deployed reachability is unproven. Missing Atlas pages and a production/customer
journey remain separate open work. No new model ranking, paid/private manuscript
experiment, canon approval, final edition or publication is claimed.

Recovery: revert this reviewed dependency slice through a normal PR if the
frozen graph or supported runtime fails. Preserve the baseline and failed
attempts, and keep the issue open until receiving verification succeeds.
