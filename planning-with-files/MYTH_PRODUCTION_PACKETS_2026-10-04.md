# Source-backed myth production packets

## Task contract

- User job: assemble a research-backed creative brief, preserve uncertainty and citations, and estimate production plus review cost before commissioning assets.
- Local product decision: extend the existing creator-starters package and its generated downloads with a pure, deterministic compiler. No new app, database, model provider or billing service.
- Scope: twelve metadata-only research seeds; strict brief/catalog validation; source and packet fingerprints; separate editorial proposals; explicit bounded production estimates; portable JSON/Markdown; CLI; existing build integration; failure-path tests; CI inclusion.
- Owner: Codex implementation; Frank product/editorial/commercial authority. No autonomous merge or release authority.
- Owning issue: https://github.com/frankxai/arcanea-ai-app/issues/510
- Base SHA: `79f3fb25ca8d34c22eae1210c7c92ae2ebe8ea0b`, also the inspected READY production deployment source.
- Branch: `agent/codex/myth-production-packets-20261004`.
- Portfolio policy: `frankxai/agentic-ops` at `551e2f0435322c8d9c7c2745acce1c68d1eb2848`; reviewed STRATEGY, ROADMAP, QUALITY and product registry. Arcanea World Seed remains a validation candidate; Creator Launch OS remains an existing proposed commercial direction. This increment does not activate a third revenue release.
- Relevant skills consulted in this session: Arcanean Worldbuilder, Supabase and Vercel. The work changes no Arcanea lore or visual interface; canon and web visual-release gates are not exercised by this increment.
- Files: `packages/arcanea-creator-starters/{myth-atlas.v1.json,myth-brief.example.json,package.json,README.md}`, `src/myth-packets.mjs`, `scripts/{compile-myth-packet.mjs,myth-packets.test.mjs,build.mjs,build.test.mjs}`, `.github/workflows/ci.yml`, this contract.
- Non-goals: manuscripts, canon edits, legal clearance, trademark searches, source-text scraping, asset generation, new pricing, checkout activation, RLS changes or a public product release. Existing draft release-manifest PR #509 remains separate; there is no second release gate.
- Budget: zero paid model calls, zero external production jobs, zero checkout/production mutations. Maximum four example deliverables in planning documentation; one curated twelve-record research fixture. Existing frozen lockfile; no new dependencies.
- Stop condition: passing changed-scope tests/build/format, reviewable draft PR and an honest environment report. Failed broad app checks are reported rather than silently relaxed.

## Acceptance and verification

1. Every selected myth keeps its witness anchor, URL, evidence status, edition-rights status, geography uncertainty and research questions. Proposed transformations are explicit questions, not attested facts.
2. A Mapuche research lead remains distinct and carries a consultation requirement. None of the twelve seeds implies a complete source study, an exhaustive mythology catalog or a verified historical Odyssey route.
3. A creator cannot inject canon approval, rights clearance or a provider key through the v1 input contract. Every output is research-stage, unreviewed and ineligible for release.
4. Production planning counts all attempts and all associated review time. Invalid rates/counts, excessive selections, duplicate identifiers and computed monetary overflow fail. An overrun remains inspectable with `withinBudget: false`; no execution follows.
5. Packet content is reproducible, copy-isolated from inputs and hashable independent of object-key order. Fingerprints detect change, not authenticity or ownership.
6. CLI inputs are bounded regular files, errors produce nonzero exit status and no partial success packet, Markdown treats creator text as data, and generated outputs retain existing ownership/drift checks.
7. Existing nine starters and ten HTML pages keep their source/render behavior. The existing app build adapter produces four extra research downloads and CI runs their tests.

Verification commands use Node 22 and pinned pnpm 8.15.0:

```text
pnpm install --filter @arcanea/creator-starters --frozen-lockfile --lockfile-only --ignore-scripts
node --test packages/arcanea-creator-starters/scripts/build.test.mjs packages/arcanea-creator-starters/scripts/interactions.test.mjs packages/arcanea-creator-starters/scripts/myth-packets.test.mjs
node packages/arcanea-creator-starters/scripts/build.mjs --compat --check
node scripts/build-creator-starters.mjs
node scripts/build-creator-starters.mjs --check
node packages/arcanea-creator-starters/scripts/compile-myth-packet.mjs --brief packages/arcanea-creator-starters/myth-brief.example.json
```

Also check changed files with repository Prettier 3.9.9, `node --check` on changed JavaScript, and `git diff --check`. This package has no TypeScript sources or package typecheck task. Passing these checks is scoped evidence, not evidence of a full Next.js build or live customer workflow.

## Seven product-engineering layers

| Layer                        | Product capability                                                                      | Engineering boundary                                                                                                            | Revenue hypothesis and proof                                                                                                                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Evidence                  | Explain which witness says what, with conflicting versions and uncertain geography      | Stable record IDs; versioned witness/claim links; immutable source snapshots; metadata precedes rights-cleared source bytes     | Trust and research speed are reasons to choose the tool. Measure citation retention and time to a usable brief. V1 ships metadata seeds, not a finished evidence graph.                                               |
| 2. Transformation            | Convert a mythic mechanism into an original human-world conflict                        | Separate attestation, editorial interpretation and proposed invention; keep decisions attached to source digests                | Sell an original authored experience with a clear reader promise. Evaluate character agency and emotional payoff with readers; avoid generic creature renaming. V1 ships questions for editors, not finished fiction. |
| 3. Production                | Compile one approved creative brief into text, image, audio and interactive work orders | Typed/validated job inputs; bounded retries; idempotency keys; worker leases; cancellation; exact source/brief versions         | Lower cost per accepted asset and shorter time to a publishable edition. V1 budgets attempts and review; jobs and provider adapters are future integrations.                                                          |
| 4. Evaluation                | Accept outputs against explicit editorial and format criteria                           | Separate model/provider receipts from human approval; classify failure reasons; regression fixtures; no model self-approval     | Rework and support costs fall when bad outputs stop early. Measure first-pass acceptance, revision rounds, cost per accepted output and unresolved defects. V1 preserves pending editorial decisions.                 |
| 5. Editions and rights       | Assemble reviewed assets into editions, language variants and license scopes            | Dependency graph from witness to brief to asset to edition; content digests; version-specific licenses; update impact reports   | Reuse approved original work across reading, learning and creator formats. Measure edition build time and reuse without losing attribution. V1 provides fingerprints; it does not grant rights.                       |
| 6. Commerce                  | Sell an exact version and reliably deliver its entitlement                              | Existing seller/checkout adapter; signed webhooks; event deduplication; transactional grants; refund/revocation; reconciliation | Track net collected revenue, fulfillment, support and contribution. Validate a complete test purchase/refund before promising paid delivery. V1 does not change payments.                                             |
| 7. Distribution and learning | Connect source interest and creation outcomes to paid demand                            | Small event vocabulary; attribution; cohort analysis; controlled experiments; separate internal hypotheses from public proof    | Retention, second purchase and healthy contribution justify scaling. Validate one offer before multiple brands; do not count pageviews or generated assets as revenue.                                                |

The durable advantage is the connected evidence and decision trail plus measured editorial outcomes. A larger prompt library alone is easy to reproduce. The compiler is the first executable boundary; the rest is deliberately sequenced behind observable user value.

## Two offers, one infrastructure

Arcanea can validate an original World Seed: an authored short encounter, four reviewed illustrations, and a source note that distinguishes mythology from invention. Keep any new idea outside approved canon until editorial review. The first user segment is an adult purchaser or creator; an ages-8-12 setting does not require child accounts. Read a complete draft with actual readers before expanding it into a season, game or learning library.

The same packet capability can become a module inside Creator Launch OS for independent writers and small studios: select witnesses, prepare a creative brief, track revisions and export a portable production kit. Offer the useful outcome of less research/rework time. Put a second brand behind it only after buyer evidence warrants the acquisition and support overhead. Keep catalog, jobs, receipts and entitlements shared; product/brand presentation and licensing are distinct.

Do not sell this example as a ready story pack. The example is a planning fixture. Its title and setting are proposals, and its compiled creative questions do not constitute original finished characters or narrative expression.

### Unit economics experiment

Use the existing `scripts/model-creator-economics.mjs` rather than creating a second margin service. Override every monetary assumption; its historical defaults are not current fee quotes. Separate one-off editorial/production cost from per-sale marginal cost and monthly service cost.

For an explicitly illustrative EUR 29 digital edition, assume tax-inclusive pricing, 21% tax, 3% refund reserve on ex-tax revenue, 6.5% transaction fee plus EUR 0.50, zero separate payout fee, EUR 0.50 fulfillment/infra and EUR 2 support reserve. Contribution is approximately EUR 18.36 per sale, before acquisition, writing, development, legal and fixed overhead. The example's EUR 49 production/review estimate is recovered after three sales under those assumptions; this is not whole-project break-even and does not show the story is ready or that anybody will buy it. Currency must remain consistent; no conversion occurs in the utility.

The same EUR 49 should not be charged as new marginal production cost on every sale of an existing edition. Conversely, a commissioned/custom edition needs fresh production and writing cost in its service quote. Subscriptions need evidence of recurring jobs and repeat value; do not substitute a subscription for an unproven one-time product.

### Next executable sequence

| Order | Concrete increment                                                                                                  | Evidence before expanding                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Complete witness reading for the three example selections and produce one human-authored outline                    | Source anchors/variants checked; original plot and character choices recorded; no imported modern franchise assets                                                    |
| 2     | Observe five adult creators assembling a packet and five target readers evaluating an authored sample, with consent | Time to usable brief, missing fields, comprehension, character investment and willingness to purchase recorded; invitations/recruitment are not executed here         |
| 3     | Attach packets to the existing owner-scoped project/catalog workflow                                                | Anonymous and cross-owner denial tests; immutable revision relation; reviewed actor and timestamp; no service-role key in browser                                     |
| 4     | Implement only the next production format users need                                                                | Job idempotency and cancellation; per-project/provider budget; cost receipts; human acceptance; retries cannot exceed authorized budget                               |
| 5     | Deliver one reviewed offer through the existing commerce layer                                                      | Test order, verified webhook, exact edition entitlement, download, duplicate event and refund paths all pass; seller/tax/pricing authority recorded                   |
| 6     | Instrument paid delivery and second-use behavior                                                                    | Proposed events: packet_compiled, packet_revised, asset_accepted, edition_delivered, purchase_refunded. No content, keys or child personal data in analytics payloads |
| 7     | Expand only the demonstrated bottleneck                                                                             | A second edition when reader demand is real; studio seats when collaboration repeats; licensing when a buyer needs defined reuse scope                                |

The five-person cohorts and prices above are experiment proposals, not recruited participants, approved prices, accounts, orders or revenue. Gate future spend with collected evidence and explicit provider budgets rather than a calendar alone.

## Stack and runtime boundaries

- GitHub owns source, tests, contracts, reviewed manifests and release commits. Work targets `frankxai/arcanea-ai-app`, the repository behind the inspected Arcanea Vercel project.
- Vercel runs the existing web surface. Generated metadata/packet files join the current build adapter; a draft PR is not production. Portfolio default for new web assets is Vercel Blob/Image, with a documented measured exception when needed. Static research downloads do not need a new object-storage service.
- Supabase remains business truth for existing projects/catalog/assets/publishing. Next integration should add the minimum versioned packet relation to those owner-scoped records, not a second world database. This task has not audited RLS or added tables.
- Keep the app's existing Stripe routes as the first integration surface until account configuration and end-to-end checkout evidence say otherwise. A digital-goods merchant-of-record option such as Polar needs seller/region/product eligibility and operating-model review before routing orders. Do not run duplicate subscription or entitlement truth in both providers.
- BYOK generation still incurs platform/editorial/support cost. The deterministic compiler performs validation, formatting, provenance and budget arithmetic locally. Models are optional bounded workers for creative proposals; they do not approve evidence, rights or releases.
- Blockchain is not a prerequisite for provenance, payments or licensing. Investigate it only for a buyer requirement that ordinary signed/versioned records cannot meet; an on-chain token does not itself establish copyright or transfer permissions.

### Observed commerce prerequisite

Reviewed credit fulfillment updates the balance and records the purchase separately. The repository migration creates a non-unique payment-reference index, and the handler does not inspect every database result before acknowledgement. This is source evidence, not a deployed-database audit. Revenue-readiness issue #511 tracks atomic, idempotent fulfillment, verified payment validation, retryable failure handling, refund/reconciliation and isolated test evidence. Resolve this prerequisite before scaling credit-backed creator production. No live payment events were sent and no payment behavior changes are included in this compiler PR.

### Future integration contract

Use a project-scoped packet revision with `owner_id`, existing project relation, immutable packet digest, atlas/brief digests and an explicit editorial state. Authenticate before lookup; authorize through RLS and repeat authorization in mutation commands. Treat a packet digest as content identity, never as an access token. A later source revision marks dependent creative work for review rather than silently rewriting released editions.

A production command should identify the exact packet revision, deliverable, format and provider, plus a maximum authorized attempt count and monetary ceiling. Reserve budget transactionally before enqueueing; key duplicate requests by owner/project/packet/deliverable/attempt. Workers claim leases, persist provider request IDs and cost receipts, and stop at cancellation or budget exhaustion. If a provider times out after submission, reconcile the recorded request before retrying; otherwise a retry can buy the same asset twice. Keep actual usage and reserved budget separate and settle reservations after terminal states. No browser should hold privileged database or provider keys.

An edition must reference accepted asset revisions, contributor/rights records and a reviewed release manifest. Checkout metadata should reference an immutable offer/edition; fulfillment grants the licensed version and scope from server-owned product data. Never derive privileges or credit quantity from arbitrary client metadata. Deduplicate verified provider events inside the same transaction as the grant; acknowledge durable completion; treat refunds and chargebacks as explicit entitlement transitions. The app already has checkout routes, but these proof obligations remain before claiming commercial readiness.

Proposed analytics carry project/packet/edition identifiers, event version and outcome only. Correlate compile-to-acceptance time, first-pass acceptance, production cost, support burden and paid delivery. Content text, source bytes, prompts, API keys and child personal data are outside this event contract. These are proposed integration boundaries, not implemented APIs, jobs, database tables or analytics instrumentation.

### Rights and brand boundary

Ancient-source research does not authorize copying a modern translation, franchise character, logo, illustration or score. This task performs no trademark clearance for Arcanea or a new label. A launch needs territory/class-specific screening of the intended brand, contributor/asset terms and edition-specific reuse decisions. Record human expressive decisions and revisions in the authorship trail; in the U.S., the Copyright Office says prompts alone do not establish the requisite human authorship of generated output. This observation does not determine protection or clearance for a proposed Arcanea work.

Sources checked 2026-10-04:

- Polar merchant-of-record responsibilities: https://polar.sh/docs/merchant-of-record/introduction
- U.S. Copyright Office, AI copyrightability and human authorship: https://www.copyright.gov/newsnet/2025/1060.html
- Ancient witness and institutional research links are retained per record in `myth-atlas.v1.json`; `anchor-located` and `reading-pending` do not imply full-text or reuse review.

## Validation results and environment

Results are recorded below after checks. Highest intended environment for this task is a GitHub draft implementation candidate; no merge, production deployment, seller activation, paid job or customer validation is claimed.

- Node runtime: 22.23.3, matching `.nvmrc` major 22. pnpm 8.15.0, matching repository pin.
- Frozen-lockfile-only validation succeeded with no lockfile diff; this package adds no dependencies. Full dependency materialization was stopped and is not claimed complete.
- Changed-scope build generated 43 artifacts, retaining nine website starters and ten HTML pages; repeated check reported zero drift. Compatibility manifest check passed.
- Final compiler/export/browser-interaction/economics suite: 36 tests passed, zero failures and zero skips. It includes a nonblocking special-file input regression, budget boundaries, overflow, identity preservation and CLI failure paths.
- Changed-file Prettier 3.9.9 and JavaScript syntax checks passed for all eleven changed files; `git diff --check` passed.
- Programmatic use of the existing economics utility confirmed EUR 18.36 illustrative contribution and three sales to cover the fixture's EUR 49 estimate under the fully specified assumptions. This is not observed revenue or full-project break-even.
- Full Next.js build/typecheck and live checkout validation are not evidenced locally. The draft candidate remains subject to repository CI and exact-head review before any authorized promotion.

## Rollback

Before merge, close the draft PR and leave main untouched. After an authorized merge, revert this isolated commit and rebuild generated creator-starters outputs from source. No database migration, entitlement, provider job or paid asset requires rollback. Preserve user-owned packet copies; do not delete locally edited generated files to make checks pass.
