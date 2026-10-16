# Arcanea creator launch — proposed execution sequence

16 October 2026. Programme: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276). Product journey: [#642](https://github.com/frankxai/arcanea-ai-app/issues/642). Source inspected: `75fc7fc96fefa8d33c3092b93cbc81a1a4bffa82`.

The founder's current direction includes both Arcanea's original universe and a creator-owned world platform. This proposal extends the October creator-platform backlog; it does not silently promote an older franchise-only plan or authorize a new scheduler, merchant, license, price, quota or production deployment.

## First useful outcome

An independent fantasy/science-fantasy author imports an authorized manuscript or Markdown world, receives source-linked context, creates an editable scene, reviews continuity, saves/reopens the exact work and exports a usable reader/world packet. A scene image or image brief enriches the result without making the text workflow depend on paid generation. Arcanea's own original world is the reference release.

## Order and owners

| Order                        | Existing owner                  | Required proof                                                                                                                                                          |
| ---------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — qualify revenue          | #511, #529; review current #655 | Atomic reservation/settlement, webhook replay, denied/unknown effects, measured cost and recoverable delivery.                                                          |
| 0 — resolve rights           | #661                            | Explicit generic-code/Arcanea-IP/customer-content license boundary and accurate public claims.                                                                          |
| 1 — deliver a packet         | #515 and existing shop          | Useful original free sample; reviewed Canon Starter/Worldbuilder release candidate with editable source, license, clean setup and delivery.                             |
| 1 — retain beta interest     | #514                            | Anonymous signup and retry/uncertain-state recovery, with actual persisted signal.                                                                                      |
| 2 — complete creator journey | #642, #283, #278                | Private import/context/scene/review/save/reopen/export across versions, source and temporal continuity.                                                                 |
| 3 — external connector       | #517                            | One canonical licensed package, clean external install, OAuth/world authorization, provenance, real host acceptance.                                                    |
| 3 — durable execution        | #284, SIS #143/#398             | One mission owner; bounded local/remote adapters; steering, cancellation, interruption and receipts. Refresh obsolete runtime-specific proposals before implementation. |
| 4 — expand from evidence     | #282, #285                      | Retained creators; measured 1/3/5-role comparison; one bounded cross-media/game proof.                                                                                  |

Dates are review windows: first packet/readiness in 72 hours; five consenting creator completions and a ten-creator beta in 14 days; source/connector/durable-job hardening in days 15–45; team/distribution trials in days 46–90. They are targets, not finished capabilities. Owners name the maker, distinct reviewer, paths, budget, test command and rollback before admission.

## Architecture

Keep the existing Next.js/Vercel experience, shared transactional/entitlement contracts and AI Gateway defaults. Preserve the installed AI SDK 6 path while qualifying an SDK 7 migration separately. AI SDK HarnessAgent is experimental; eve is beta. Use an Arcanea domain profile over existing SIS lifecycle/federation instead of another universal scheduler or registry. A job has exactly one durable owner. Cloudflare actors are a matched entity-workload candidate; existing Railway workers remain until a measured alternative earns migration.

Git/selected Markdown sources and hosted project revisions need an explicit authority mode, source hashes and expected-base writes. Graph/embedding indexes are projections. Do not create another canonical graph store, media lake or corpus. New web assets follow the accepted media fabric; existing storage does not move from this proposal.

Official capability references checked 16 October:

- [Ship recap: Connect GA, Drives GA, Daemons/MCP Events beta](https://vercel.com/blog/vercel-ship-2026-recap)
- [Experimental harness adapters](https://ai-sdk.dev/docs/ai-sdk-harnesses/overview)
- [Current OpenAI plugin architecture](https://developers.openai.com/plugins/concepts/plugins)
- [Managed Agents API data/runtime boundary](https://developers.openai.com/api/docs/guides/agents-api/overview)

The managed OpenAI Agents API is a beta candidate, not the default private manuscript route; its current residency/retention terms require a deliberate policy decision. A local stdio MCP server needs an appropriate bridge; no blanket "any MCP server" compatibility claim.

## Commerce and open core

Retain `apps/web/lib/billing/catalog.ts` as runtime price authority. Its current grants need low/typical/full-use economics before checkout activation. The new `scripts/model-launch-economics.mjs` diagnostic requires explicit assumptions and reports provider-spend headroom at a target contribution margin; it changes no entitlement or price.

Proposed ladder: useful free World Seed → €7 Canon Starter → €47 Worldbuilder System → €97 Publishing Studio after valid outputs. Managed continuity and publishing are recurring value; inference has a separately bounded allowance. No unlimited paid inference or lifetime hosting obligation. Proposed licensing separates reusable code/interfaces from Arcanea's own stories, characters, marks and creative assets; #661 owns review, not blanket relicensing.

## Acceptance and stop rules

- Five consenting target creators complete the private journey twice, keep an artifact and export/recover it. Recruitment and these outcomes are not yet evidenced.
- Cross-tenant/revoked access, stale revision, malformed import, duplicate delivery, provider failure, interruption, cancellation and uncertain external outcomes have explicit tests.
- Full source, meaningful creator decisions, provenance and approved media remain portable. Export is not a cancellation penalty.
- Primary journeys pass keyboard/mobile/reduced motion with exact-head independent review and rollback evidence.
- Preserve actual usage as unknown when absent. Cost includes failed attempts, tools, runtime, storage and human review.
- Do not expand models, agents, marketplaces or native apps when the primary journey fails or heavy-use economics are negative.
- GitHub issues/PRs remain executable work; Notion is the founder projection, and existing Projects are a visual index. Board membership is not inferred from an issue link.

## This change

The branch supplies an offline economics diagnostic, focused tests and this execution proposal. It does not implement the creator journey, publish a product, activate subscriptions, install agents or establish revenue. See the launch-economics state receipt for commands and remaining checks.
