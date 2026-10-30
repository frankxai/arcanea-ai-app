# World platform and local graph portability — 30 October 2026

## Task contract

Owner: Arcanea product programme #276; local delivery #517, continuity #283/#642. User job: retain a local world graph with lore and media metadata and resume it in another agent session without overwriting creator work. Product base: `d2929ecd3245eacdf4911d12582296305dc348e9`. Implementation scope: existing MCP package; architecture and backlog mapping. No new repository, dependency, cloud service, database migration, price, license, canon change or provider inference.

Acceptance: graph/metadata roundtrip; create-only destination; corrupt/unsupported/oversized data denied before mutation; no URL fetch or execution of imported text; explicit persistence; package build/typecheck, lint, tests and distinct review. Stop before production promotion without required hosted gates. Rollback: remove the three new tool registrations and their module; prior saved worlds are unchanged.

## Implemented

- `export_world_bundle`, `inspect_world_bundle`, `import_world_bundle` in the opt-in `world` toolset.
- `arcanea.creation-graph.bundle.v1` is a transport envelope for the existing local graph, not a new full-world manifest. It carries graph metadata, source session/time, conservative trust/canon labels and canonical SHA-256 integrity.
- 2 MB UTF-8, 5,000 nodes, 20,000 edges, depth/node/string bounds. Duplicate/dangling graph references and unsupported fields refuse.
- Import refuses existing in-memory, saved or corrupt saved destinations. It creates memory only; the existing explicit `save_world` operation provides persistence. No multi-process transaction or hosted tenant guarantee is claimed.
- Media references remain data. Media bytes, external documents, journey memory, credential stores and Supabase records are not read by this exporter. Sensitive values already embedded in graph metadata or reference URLs are preserved and require review/redaction before sharing.
- [Full platform specification](../docs/architecture/ARCANEA_WORLD_PLATFORM_2026-10-30.md): experiences, Vercel/Cloudflare/Supabase ownership, three graphs, data contract, agents, MCP/OAuth, proposed tiers, economics, storage, legal requirements and existing issue sequence.

## Verification and independent review

Node 24.22.1 and repository-pinned pnpm 11.28.4. Frozen filtered installs pass with lifecycle scripts disabled; no lockfile/dependency changes. Strict package build and no-emit typecheck pass. Package verification passes. Scoped ESLint passes with existing root React/pages configuration notices. Changed-file Prettier and scoped whitespace checks pass. Estate guard reports 0 critical and 0 high; pre-existing medium/low findings are outside this change.

Rebuilt full MCP suite: **447/447 pass**, 49 suites, zero skipped. New transfer suite: **15/15 pass**, including an actual in-memory MCP client export→inspect→import, metadata and relationship retention, checksum tampering, invalid versions/claims, dangling/duplicate references, malformed input, structural/byte bounds, non-JSON metadata, inert injected text/URLs, absent-source nonmutation, sparse-array data loss, oversized live metadata and saved-target collision.

Independent reviewer examined first code commit `4c534524764b2c01a2ac730ef46f695de8c4cf45` and found two P2 defects: sparse arrays with compensating extra fields could lose data, and exporting an absent session allocated it. Both were corrected with regressions. The reviewer accepted runtime candidate `feb8e0036ef6ba000a06e3be2a2adfe6908b5950`, reran 15/15 tests and independently checked combined oversized values/keys and corrupt saved targets. No remaining findings for the local single-user scope. This is substantive independent review, not a formal GitHub approval or hosted acceptance.

Retained attempts: initial shared local clone failed because partial-clone objects were unavailable; direct sparse clone succeeded. First frozen install lacked the sparse `patches/` directory; adding it fixed installation. First broad suite had 10 library-search failures because `book/` was not materialized; after adding that existing directory all tests passed, without changing search code. One patch failed context matching atomically and was reapplied against formatted source. Whole-tree whitespace found regenerated pre-existing dist differences; generated dist drift is excluded from this source-only change. Builds are required before package execution/tests.

## Source adoption and live baseline

AGENTS read from product base: SHA-256 `00207d780ef3d98d7d260fe979b650199a8c1fbaab475ac684d3fa0630307267`. Luminor Engineering Kernel SHA-256 `ce8791a6455dfc6f6f4de13c7925beeb1d07f64dcd194ebdbdb9708b3553634f`. Portfolio main observed at `d98f814ccafe8b6ab4d87d42360a78a07bf4d41b`; actual Registry architecture/authority records read because projected AGENT_BRIEF returned404. These records establish session loading, not adoption by other hosts.

Existing production deployment `dpl_4vGqMUzX8veXX9AEMaVNBYfh7DGf` is READY and binds source `d2929ecd3245eacdf4911d12582296305dc348e9` to `arcanea.ai`. `/api/health`200 reports healthy/live/ready and public-data readiness; `/worlds`200. GET `/api/mcp`405 correctly says POST required; this is not proof of authenticated MCP operation. Supabase project health and public table inventory were read, not changed. Vercel Connect lookup returned404; its customer connection path remains unproven. Supabase advisor findings remain under existing #242.

## Release state and next task

Local scope CHECKED; full programme IN_PROGRESS. Source review, full local package tests and documentation do not publish npm, enable hosted ChatGPT writes or deploy a Cloudflare world agent. Required hosted checks, exact final-head acceptance and production/package release remain gates. No paid-provider cost or customer activation was measured; model/tool cost in this chat is not reported as zero merely because no provider generation call was made.

Next accepted outcome: #642/#517 prove a private world-context/change-proposal journey with two synthetic tenants, OAuth scope/revoke, retained work and export. #529 resolves the existing credit-denomination/margin inconsistency before new allowances are activated. Keep the full roadmap in the linked architecture document and existing issues rather than opening a duplicate programme.
