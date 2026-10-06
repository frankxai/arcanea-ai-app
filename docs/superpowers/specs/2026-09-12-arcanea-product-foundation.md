# Arcanea creator product foundation

Date: 2026-09-12. Status: proposed architecture and commercial hypotheses, not a
release approval, activated subscription catalog, legal opinion, or revenue report.
Source: Codex task `01a0930b-6362-7e20-b6f9-3c0c34d969df`.
Read with [the auth incident](../../ops/AUTH_RECOVERY_2026-09-12.md) and
[the bounded backlog](../../../planning-with-files/CURRENT_BACKLOG_2026-09-12_AUTH_PRODUCT.md).

## Product decision

Arcanea helps a creator turn an original world into a coherent book, a discoverable
website, and interactive characters. Its advantage should be continuity across those
outputs: the same approved character, timeline, rights record and visual reference
follow the work from outline to trailer to character agent.

Benchmark to beat: [Campfire](https://www.campfirewriting.com/pricing) for its connected
writing/worldbuilding workflow and [World Anvil](https://www.worldanvil.com/pricing)
for organizing and presenting a world. Arcanea should prove a better _complete export_
for one creator before claiming feature superiority. These are product references;
no customer interviews, conversion results or willingness-to-pay evidence have been
collected in this task.

The first paid result: a creator can install a kit, produce a checked world bible and
chapter, and export a working author/world website with the sources. Use the existing
Author Studio, World Engine, skills, publishing package and creator-starter pipeline.
Do not start another general chat application or rebuild the Academy here.

### Three business options

| Option                        | What customers buy                                          | Cost and operating consequence                                                          | Decision                                   |
| ----------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------ |
| Kits and renewable library    | Downloadable tools, templates, updates and editions; BYOK   | Small platform costs; creator pays inference and their deployments                      | Recommended first                          |
| Hosted workspace subscription | Account storage, collaboration and capped managed inference | Persistent privacy, availability, abuse, metering and support obligations               | Separate explicit operating-model approval |
| Marketplace                   | Third-party creators sell their own worlds/tools            | Seller verification, payouts, tax, moderation, rights disputes and take-rate accounting | Later; not needed for own-product sales    |

This preserves the estate's customer-operated-runtime doctrine. “BYOK” does not make
support, refunds, hosting, payment fees or software maintenance free. A subscription
can sell library updates without promising Arcanea-funded compute. Do not silently
turn the proposed hosted option into an active service.

## Customer journey and tiers

### Strategy clarification after the production audit

Recommendation: a portable creative product business with a small account and
delivery service. Preserve the estate's customer-operated-runtime rule. The website
is the storefront, documentation, samples, installer, license/download account and
optional export workbench. Existing hosted chat remains a transitional capability;
it is not evidence that hosted inference is the chosen subscription business.

| Surface                   | What Arcanea provides                                                          | Where the creator's work runs                        | Operating commitment                                                             |
| ------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| Downloadable kit / plugin | Original examples, schemas, prompts, skills, quality checks, templates         | Customer's chosen tool and files                     | Updates, compatibility, purchase support and statutory remedies                  |
| Local MCP                 | Canon validation, approved-source lookup, exports and controlled local actions | Customer's machine or deployment                     | Signed/versioned releases, minimal permissions and security fixes                |
| Public ChatGPT plugin     | Packaged skills; optional authenticated entitlement and catalog tools          | ChatGPT's environment; remote tools run where hosted | Provider review, privacy policy and any remote endpoint's availability           |
| Arcanea website           | Discover, sample, obtain, install, manage purchases, export                    | Public web plus minimal private account records      | Auth, entitlements, transactional email, privacy requests and security           |
| Self-deployed workbench   | World graph, continuity editor, model connections and media briefs             | Creator's Vercel/Supabase/provider accounts          | Clear setup, upgrade and export instructions; no promise to operate their server |

MCP is an integration protocol, not the product or a privacy exemption. Use skills
for repeatable craft, plugins for installation/distribution, and MCP only where
live data or controlled actions are necessary. A skills-only plugin is a viable
first edition; it does not require an Arcanea-hosted model endpoint. OpenAI's
[current skills documentation](https://developers.openai.com/plugins/concepts/skills)
explicitly supports packaged workflows without an MCP server.

The [OpenAI public plugin rules](https://developers.openai.com/plugins/app-guidelines)
currently prohibit selling digital subscriptions/content in the plugin or promoting
an upgrade transaction. Existing subscribers can sign in to use their entitlements.
Do not place a Polar/Stripe checkout tool, upgrade CTA, API-key field, password field
or full-chat-history parameter in the published plugin. Sell through the owned
storefront and use the plugin to deliver a useful, reviewed capability. Public MCP
submission requires a [stable HTTPS endpoint](https://developers.openai.com/plugins/build/mcp-server);
local stdio alone does not satisfy that channel. A skills-only package avoids that
endpoint until a real tool requires it.

[Claude plugins](https://claude.com/docs/plugins/overview) and
[Claude Code marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
provide another distribution channel. Validate each supported host with the same
sample world and export fixtures; installation support does not prove identical
permissions, file access, billing, or execution behavior across products.

### What a subscription funds

Use one renewable Creator library first, with optional team licensing when there is
team demand. The three tier names below are hypotheses, not three launch obligations.
One-off kits remain a useful purchase for creators who do not need ongoing updates.
Renewal must buy real new editions, maintained integrations, improved checks and
usable assets. Do not charge merely for access to a thin API proxy. Keep earned
downloads usable after cancellation under the product license; never revoke the
creator's own output. Arcanea earns product revenue, not a royalty on every book
its customer sells. Marketplace fees for optional distribution would be a separate,
explicit service agreement, not a default claim on IP.

Creator ownership and data custody are independent. Recommended terms preserve
the customer's pre-existing and original contributions; Arcanea retains its kit
and software rights, with a clear commercial-use license. Do not promise exclusive
copyright in every generated element. The [US Copyright Office's AI work](https://www.copyright.gov/ai/)
distinguishes human authorship from purely generated output; other jurisdictions
and provider/license conditions must be assessed for the actual seller and market.
This is a proposed product boundary, not published legal language.

### Minimum data responsibilities

| Data                                  | Target custody and access                                                                   | Required behavior before claiming it                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Worlds, manuscripts, character memory | Customer files by default; explicit opt-in for hosted saving                                | Versioned export with canon, assets and references; no hidden ingestion                                                    |
| Model keys                            | Customer tool/vault; current web storage is plaintext and sends keys through Arcanea on use | Accurate disclosure, no key logging, no unrelated-provider forwarding; session-only storage is a later compatibility slice |
| Identity and purchases                | Arcanea's private account service and payment processor                                     | Minimal fields, own-account access, retention schedule and deletion request path                                           |
| Entitlements and payment customer IDs | Server-controlled private records                                                           | Never publicly readable or user-editable profile attributes                                                                |
| Analytics and errors                  | Minimal aggregate events and sanitized errors                                               | No manuscript/key capture, documented retention and consent where required                                                 |
| Published books/media/agents          | Explicit customer-selected destination                                                      | Preview, rights/provenance check, publish confirmation and rollback/unpublish                                              |

Even without hosting manuscripts, Arcanea still processes account, purchase and
support data. Payment merchant-of-record service reduces specific tax/payment
work; it does not transfer all privacy, product security, consumer or IP duties.
The previously observed profile grants remain a paid-release blocker until migrated
and tested with anonymous, owner and other-user identities.

### Production experience acceptance and skill use

Use Supabase auth/RLS guidance for sessions, grants, private storage, signed URLs and
deletion; Vercel deployment/env guidance for preview-to-production checks and rollback;
AI SDK guidance for streaming, cancellation, typed tools and sanitized failures;
OpenAI documentation for structured outputs, evaluations and provider-specific data
settings; Superpowers debugging/TDD/review for reproducible failures and regressions;
Arcanea's Premium Web OS for hierarchy, accessibility and responsive verification.
Eve is optional internal workflow tooling; adopting it is not a customer feature or
a reason to host autonomous customer agents.

The provider-settings scene has one primary task: choose one provider, enter its
key, understand its route, save and continue. Use the existing Arcanea tokens, a
single-column form, native labeled controls, 44px targets, explicit show/hide,
optional search disclosure, persistent errors and a clear exit. No decorative
animation or new media dependencies. Benchmark the clarity of Vercel's connection
settings; verify Arcanea at desktop and 375px with keyboard and reduced motion.

Release acceptance: Google sign-in returns to the requested protected page; refresh
preserves the session; sign-out blocks a fresh protected request; invalid callback
recovers; settings never equate a saved key with verified access; blocked storage
and stale-tab writes are explicit; a provider receives only its own key; cancel and
upstream errors are recoverable; purchases use signed, idempotent events; export,
refund/cancel, deletion and cross-account access have exercised paths. The current
slice addresses auth and provider settings, not this entire release contract.

Start with one completed path: explore a sample → start a private draft → connect a
provider → approve a world bible → draft and revise → export → choose a publication
destination. Publishing and sending are explicit user actions. Every page states
what is saved, where it is saved, who can see it and what happens next.

| Proposed tier  | Concrete entitlement                                                                                          | Renewal/cancellation behavior                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Explorer       | Public samples, a starter kit, local drafts and export                                                        | Free; never erase a draft to induce purchase                                                              |
| Creator        | Versioned world kits, prompt/skill library, tested website starters and updates                               | Updates/download access ends with the paid term; already downloaded versions retain the purchased license |
| Author         | Creator plus manuscript workflows, continuity/voice evaluations, EPUB/print preparation and launch/media kits | Same license boundary; no promise of sales, acceptance or copyright protection                            |
| Studio license | Team-use license, shared workflow templates and character-agent website packages                              | Seats and client-work rights must be explicit; no resale of raw kits by default                           |

Internal price hypotheses for testing: Creator $19/month, Author $49/month, Studio
$129/month; one-off kits $29–99, website bundles $79–199, book/media editions $9–49.
These are research bands, not checkout prices or validated offers. Test a smaller
annual update license against a monthly membership: recurring fees require a
credible release cadence. No “unlimited AI”, lifetime cloud hosting, fabricated
capacity, founding countdown or implied income guarantee.

Use per-product demand capture before pricing goes live. Continue the existing
`codex/arcanea-commercial-truth-20260910` integration: shared capture schema, durable
success, skippable price/role/outcome questions, and checkout gated on a fresh product
PASS. Update the estate product registry before a new product page is built.

## What to sell

Each kit contains an original worked example, editable sources, a concise quickstart,
license, supported versions, quality fixtures and a complete export. A pile of prompts
without a demonstrated outcome is insufficient.

| Kit family                        | Deliverables                                                                         | Required quality proof                                            |
| --------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Epic fantasy                      | World bible, magic constraints, factions, timeline, character arcs, chapter workflow | Contradiction report; cause/effect and limitation tests           |
| Science fiction                   | Technology rules, ecology, political economy, travel constraints                     | Scientific claims sourced; speculative rules labeled              |
| Cozy / romance / mystery          | Relationship and clue graphs, setting, beats, voice and continuity checks            | Spoiler controls, clue fairness, relationship progression         |
| Tabletop / game worlds            | Locations, encounters, NPC cards, branching state and session packs                  | Playthrough and state-restoration fixtures; system license review |
| Illustrated stories               | Character sheets, scene/palette references, layout and accessible exports            | Character consistency, legibility and print proof                 |
| Creator / digital-business worlds | Original brand story, persona guide, offers, content system and website              | Truthful claims, usable conversion path, no guaranteed earnings   |

Add-on products: author-site starter, world atlas starter, book-launch site,
character companion site, prompt/evaluation pack, trailer/storyboard kit and release
checklists. Genre packs share the same small core schema and export contract.

### From book to living character

The authored character bible is authoritative. The character agent references a
versioned, owner-approved subset; it never rewrites canon from a chat. Store source
IDs, spoiler ceiling, narrative time, audience rating, safety boundaries, tool
permissions and memory policy separately from its voice instructions. Readers can
reset/delete their conversations. The character clearly identifies itself as AI.

V1 character tools: answer with canon citations, recount permitted scenes, explain
the world and offer an approved reading link. No purchases, posting, memory sharing
or autonomous website changes. Later actions require scoped capabilities and user
approval. Cross-reader memory and private author notes are never retrieval sources.

An exported website belongs in the creator's own repository and Vercel account.
It must build from a clean install, work without animation, include real privacy and
contact surfaces, and expose no admin/provider secret. Domain registration and
provider bills are separate costs. Customer content is not copied into Arcanea's
own canon without a separate rights grant.

## Quality pipeline

1. Brief: genre, reader, promise, constraints, sources and rights.
2. Plan: beat structure, character wants/conflicts and world rules.
3. Draft: bounded chapters/scenes using only the approved source version.
4. Deterministic checks: schema, names, dates, locations, unresolved references,
   forbidden spoilers, export completeness and provenance.
5. Independent critique: continuity, voice, pacing, factual support, representation,
   originality and reader comprehension. Record disagreements and revisions.
6. Human editorial acceptance: approve the actual prose and assets; preserve an
   authorship/edit history. A high model score alone never certifies publication.
7. Package: EPUB/PDF/web plus editable sources, captions, alt text and license.
8. Market: synopsis, sample, cover, audience-specific landing page, mailing-list
   capture, launch calendar, trailer/storyboard and character teasers.
9. Publish: owner confirms channels and rights; measure sample-to-download,
   completion, return usage, refunds and contribution rather than output volume.

Use [KDP's current content guidelines](https://kdp.amazon.com/en_US/help/topic/G200672390)
at submission: AI-generated text/images/translations require disclosure there;
AI-assisted work is treated differently. Other retailers need their own checks.
No automatic bulk book publishing or unsolicited marketing.

## Payments and entitlement architecture

Recommend Polar for the first digital-kit subscription if the existing organization
and product are eligible. Its downloads/license benefits reduce custom delivery work;
use its [Next.js adapter](https://polar.sh/docs/guides/nextjs) after design approval.
Ordinary Stripe Payments + Billing is an alternative when control or existing
customers justify tax/accounting operations. Stripe also offers
[Managed Payments](https://docs.stripe.com/payments/managed-payments), a distinct MoR
product with its own eligibility and fees; do not conflate it with ordinary Stripe.
No provider account or agreement was inspected or activated here.

One product catalog maps stable internal product/version IDs to provider price IDs
and a license version. Retain existing Stripe lifecycle handlers until existing
customer obligations are reconciled. Adding Polar must not charge the same
subscription through two providers or discard paid access on a migration.

Proposed data model (migration pending): private `billing_customers`,
`billing_subscriptions`, `billing_events`, `entitlements`, `orders`,
`download_grants`, and `usage_events`. The user may read their own purchased state;
only a verified server transaction may grant/change it. Public profiles contain
display fields only. Never trust `user_metadata`, a query-string price, a client
success redirect or user-editable `profiles.subscription_tier` as proof of payment.

Checkout authenticates the customer, uses a server allowlist of released prices,
binds their internal ID, reuses an idempotency key and returns provider-hosted checkout.
The return page displays pending until reconciliation confirms payment.

Webhook handling: verify the signature against the raw body, deduplicate
`provider + event_id` in a database transaction, load authoritative provider state,
validate customer/product/currency/payment status, then update entitlements. Event
timestamps alone do not safely order replayed events. Failed reconciliation retries
with bounded backoff and an alert. Run a periodic reconciliation job after approval.
Never grant a paid renewal merely because a billing cycle started; Polar's
[event contract](https://polar.sh/docs/integrate/webhooks/events) distinguishes the
cycle from successful payment and end-of-term cancellation from immediate revocation.

Acceptance fixtures: duplicate/out-of-order events, invalid signature, wrong user,
wrong price, failed payment, partial refund, full refund, dispute, cancellation at
term end, immediate revocation, upgrade/downgrade and provider outage. Preserve read,
export and deletion rights after cancellation. Downloaded files cannot be revoked
technically; the license defines continuing use.

Managed inference, if separately approved, needs an atomic reserve → run → settle /
release ledger, deduplicated jobs, concurrency limits and hard per-user/provider
ceilings. Never put paid video/image work behind an unlimited plan. Existing credit
routes need consolidation before monetization; the earlier commercial audit found
multiple balances and non-atomic spending.

## Economics: what we keep per paying user

No verified billing transactions or active paying-user denominator were available,
so actual ARPPU and profit are **unknown**. The executable model is
`node scripts/model-creator-economics.mjs`; override e.g. `--members=1000` or
`--price=49 --inference=10`. It is a forecast, not accounting software.

Default assumptions: tax-inclusive USD price; 21% illustrative VAT; 3% refund reserve;
6.5% + $0.50 transaction fee; 0.5% estimated payout/FX reserve on net proceeds;
per-user infra/support reserves shown below; $102.25 monthly fixed-cost assumption
($100 operating reserve plus one active payout's $2.25 fixed fees). No Arcanea-paid
inference. Actual tax, account plan, card mix, currency and payout basis must replace
these assumptions before launch. Full payment fees are conservatively retained after
refunds. Payout fees here are an approximation, not an exact Polar statement.

| Hypothesis | Price incl. tax | Infra + support reserve | Contribution per paid member | At 100 members after fixed costs |
| ---------- | --------------- | ----------------------- | ---------------------------- | -------------------------------- |
| Creator    | $19             | $3.20                   | $10.23                       | $920.64/month                    |
| Author     | $49             | $6.00                   | $29.42                       | $2,839.55/month                  |
| Studio     | $129            | $15.00                  | $79.06                       | $7,803.31/month                  |

These figures exclude acquisition, salaries, development, legal work, disputes and
income tax. They are not net profit. Subtract actual managed inference dollar for
dollar from contribution. At scale, allocate costs to the actual mix of tiers, not
three separate homogeneous customer populations.

[Polar's current fees](https://polar.sh/resources/pricing), checked 2026-09-12, list
Starter at 5% + $0.50 and a 1.5% non-US-card surcharge. The earlier 4% + $0.40 rate
is grandfathered for eligible pre-May-27 organizations, with a subscription surcharge.
Do not assume this account qualifies or upgrade away a grandfathered plan without
an explicit decision. Compare actual total fees with Stripe for the intended mix.

Operational metrics: collected revenue ex-tax/refunds; ARPPU per unique payer;
recognized recurring revenue excluding one-off kits; gross contribution by product;
conversion; activation to first usable export; paid retention/churn; refund/dispute
rate; support cost; token/media cost; p95 job cost and spend exposure. Do not report
GMV or VAT collected as Arcanea revenue. A marketplace take rate is a separate later
model, not all seller proceeds.

## User data and legal readiness

This is an implementation brief requiring entity-specific legal review. Identify the
actual seller/legal entity, address, jurisdiction, tax status, privacy contact,
audience age policy and operating role before activating terms. Existing generic
Delaware/arbitration copy is not evidence that those terms fit this business.

| Data                       | Proposed location and access                                                       | Lifecycle and controls to implement                                                  |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Sign-in                    | Supabase Auth; verified session on server                                          | Minimal identity scopes, session expiry, recovery, account deletion                  |
| Private worlds/manuscripts | Creator device/repo by default; opted-in Supabase project if hosted model approved | Owner/collaborator policies, explicit publication, version/export/delete             |
| Public author profile      | Deliberate public projection only                                                  | No billing IDs, private metadata or activity timestamps by default                   |
| Provider keys              | Creator runtime; optional server transit disclosed                                 | No logs, analytics, URLs or database plaintext; no false browser-only claim          |
| Orders and entitlements    | Private billing tables and processor                                               | Retain only needed records; statutory finance retention may survive account deletion |
| Generation provenance      | Project-scoped references, model/version, rights and job metadata                  | Export with artifacts; redact prompts from telemetry by default                      |
| Operational telemetry      | Redacted events with pseudonymous account/job IDs                                  | Suggested 30-day raw-log policy; validate vendor retention before promising it       |

[GDPR principles](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en)
require purpose limitation, minimization, lawful processing and demonstrable controls.
Map each purpose to a lawful basis; obtain separate optional marketing consent, avoid
bundling it into service terms, and implement electronic access/correction/export/
erasure requests. Define deletion across blobs, vectors, logs and backups and disclose
backup expiry. Encryption at rest is not end-to-end encryption. EU hosting alone does
not settle all international-transfer obligations: record processors, DPAs, regions
and transfer safeguards. Counsel should scope GDPR, consumer, accessibility and
platform/intermediary obligations against the actual service and customer markets.

For [EU distance sales](https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_en.htm),
show seller, total cost, recurring terms, cancellation and remedies before payment.
Immediate digital-content delivery and loss of withdrawal rights require the proper
express consent/acknowledgment and durable confirmation where applicable; do not use
a blanket “no refunds” policy. A MoR handles specified transaction responsibilities,
not Arcanea's complete privacy, IP or product obligations.

Creator ownership wording must distinguish user inputs, human edits, generated outputs,
licensed kit materials and third-party assets. Retain source/license/consent evidence,
provide a takedown process, and obtain permission for voices/likenesses. The
[US Copyright Office](https://www.copyright.gov/ai/) distinguishes human authorship
from purely generated material; do not promise exclusive copyright merely because a
user wrote a prompt. License and trademark availability are separate checks.

For AI characters and media, implement clear AI disclosure, consent controls and
provenance. The Commission's [Article 50 guidance](https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems)
addresses transparency obligations applying from August 2026; scope the provider/
deployer obligations and transitional rules with the current deployment. Do not
market the characters as real people or agents as professional legal/medical advisers.

## Platform choices and boundaries

- **OpenAI:** use the existing AI SDK OpenAI provider for ordinary streaming and
  typed tools; use Responses features only where needed. Structured outputs support
  world/character schemas, tool calls enable approved project operations, retrieval
  can cite canon, and realtime/audio can support character conversations. Pick model
  IDs from the current catalog and evaluate quality/cost per task; this proposal does
  not call any particular model “best”. Keep model/provider adapters replaceable.
  [Tools](https://developers.openai.com/api/docs/guides/tools) and
  [data controls](https://developers.openai.com/api/docs/guides/your-data) need
  endpoint-specific review: no training by default does not mean zero retention.
  Files, hosted retrieval and conversation state need explicit deletion handling;
  qualify ZDR eligibility before making a privacy promise.
- **AI SDK:** retain the installed v6 line and typed provider adapters. Use schema
  validation, bounded steps, abort/timeouts, normalized usage receipts and
  explicit tool approvals. Set telemetry input/output recording off by default;
  keep operational events free of manuscript content.
  [Structured outputs](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data)
  and [telemetry](https://ai-sdk.dev/docs/ai-sdk-core/telemetry) are capabilities to
  integrate and test, not evidence the current app already uses them correctly.
- **Supabase:** Auth with PKCE, verified server identity, private storage with short
  signed links, RLS plus column grants, schema migrations and restore tests. Test
  as anon and two distinct users. Do not use the service role in ordinary user reads.
  Separate branch data for realistic QA before storing customer manuscripts.
- **Vercel:** isolated previews, explicit environment contracts, observability,
  firewall/rate limits and budget alerts. Bind a coherent source SHA to each preview
  and promotion. Current project summary says `framework=services`, Node 24 while
  repo guidance says Node 20: reconcile deliberately, not during the auth incident.
- **eve:** [Vercel's framework](https://vercel.com/blog/introducing-eve) combines
  durable workflows, channels and sandboxed execution. It is a candidate for an
  exported character agent or long-running manuscript/media pipeline. Pilot one
  bounded workflow with budget/permissions/tenant tests. Ordinary chat does not need
  a second orchestrator. Keep agent-generated code in isolated sandboxes and bind
  replay/resume to the same owner and idempotent job.

## Release evidence required

Authentication works on the canonical origin; two-user isolation passes; private
billing state cannot be edited by the buyer; payment replay/refund/cancellation tests
pass in sandbox; a real kit installs and exports cleanly; independent buyer critique
is resolved; legal entity/terms and pricing are approved; support/refund paths work;
cost ceilings and rollback are rehearsed. Then activate one product, measure its
actual economics, and expand the catalog from demand evidence.

The auth correction, test suite and financial model are this task's implemented
artifacts. The tiers, catalog, migrations, new payment integration and legal terms
remain proposed. Do not convert this document into public promises by copying it
onto a pricing page.
