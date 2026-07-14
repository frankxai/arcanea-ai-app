# Arcanea Product Rebuild — Decision and Execution Packet

**Status:** active planning lane; no production mutation authorized
**Owner:** Codex Arcanea Product-Rebuild Lead
**Branch:** `codex/arcanea-product-rebuild-20260714`
**Decision horizon:** foundation now; paid launch only after ledger, security, and preview gates pass

## 1. The product we are building

Arcanea should not become a generic gallery of image and video models. Its product is a **world-continuity studio**:

> A creator turns a brief and references into a persistent world, makes media inside that world, inspects its lineage
> and rights, then reuses the world across scenes, stories, campaigns, and collaborators.

The core activation loop is:

```text
Choose or create a World → write a brief + add references → choose Auto / Quality / Fast / BYOK
→ reserve visible compute → generate asynchronously → inspect / revise / compare → save to World Memory
→ reuse, share, export, or call through MCP
```

This is deliberately different from a model catalog. The durable advantages are continuity, provenance, project memory,
portable BYOK, and a credible creative record. Arcanea's product chrome stays an AI-lab: calm, editorial, readable and
high-trust. Mythic language belongs in the work and ceremony, not in dense game-like controls.

## 2. Discovery findings that block a paid, public launch

The existing monorepo already contains web, Supabase, Stripe, model, and MCP surfaces. It is not a greenfield build.
The main risk is inconsistency between those surfaces, rather than absence of features.

1. **Three competing image paths and a placeholder video path.** `lib/imagine/generate.ts`,
   `api/ai/generate-image`, and `api/studio/generate-image` use divergent provider flows. The video route does not
   persist a durable job record or status lifecycle.
2. **Credits are not a financial ledger.** Current code and migrations disagree on table and transaction shapes; a
   demo in-memory fallback, a non-atomic debit pattern, and a missing `/api/credits/spend` dependency make paid
   generation unsafe. Do not sell hosted-generation credits until this is replaced.
3. **Stripe is only a subscription shell today.** Checkout, portal, and webhook handling do not yet prove event
   idempotency, entitlement reconciliation, credit packs, or cancellation/payment-failure handling.
4. **The remote MCP boundary is unsafe as deployed design.** The HTTP transport is unauthenticated with permissive
   CORS and process-local sessions. Several media tools accept arbitrary local paths and must remain local-only; they
   cannot be exposed in a hosted multi-tenant MCP server.
5. **Model information is hard-coded and speculative.** A large catalog mixes capability, price, availability, and
   benchmark claims without a provider-specific adapter, version contract, availability check, or cost receipt.
6. **The Vercel configuration needs reconciliation before release.** The repository and remote project disagree on
   framework/runtime facts; `arcanea.ai` is not currently verified as an attached Vercel domain. Domain or production
   routing is a human gate.

## 3. Product experience: borrow the pattern, not the competitor's skin

Higgsfield's public product describes a useful interaction pattern: one canvas, chained workflows, a model picker,
collaboration, and an MCP surface. Its public model menus also show why creators expect images, editing, video, and
references to feel like one workspace. Arcanea will not copy its visual treatment, language, or layouts. Instead it
will adapt the interaction grammar to a world-building niche.

### The five product layers

1. **Arrival / Forge** — a clear promise, recent World examples, a single composer, and BYOK/privacy trust signals.
   Mobile starts with the composer, not a video or decorative world scene.
2. **World Canvas** — brief, references, context cards, model route, queue, and outputs in one responsive workspace.
   The canvas is a working surface, not an infinite novelty board.
3. **Creation Inspector** — output variants, before/after, prompt and references, model/version, cost, safety result,
   provenance, export rights, and “continue this world” action.
4. **World Memory / Library** — characters, locations, styles, objects, scenes, source assets, and their versioned
   relationships. This is Arcanea's differentiating persistence layer.
5. **MCP and sharing** — scoped tools let a creator's agent read or write only an authorized project. Every
   externally-triggered creation returns a job receipt, not an opaque fire-and-forget response.

### Visual direction and evidence

The local estate has Arcanea hero media under `C:\Users\frank\starlight\higgsfield\assets\arcanea`, but its brief is
an older “mystical chamber” direction. It is not automatically suitable for the current AI-lab product surface. Existing
product screenshots in `docs/screenshots/` provide baseline capture evidence; no validated Higgsfield competitor
screenshots were found in the local archive.

Fresh competitive and Arcanea captures are a required design-loop task, not a reason to copy. Each capture must record
source URL, date, viewport, permission/terms assessment, and the interaction principle extracted. It must be visually
reviewed at desktop, mobile, and reduced-motion before a premium page ships. Browser capture is currently deferred by
the machine admission gate; do not claim that review until it has actually run.

## 4. Provider and model strategy

### Resolve the names before implementation

The requested names appear to be informal references. The implementation will use canonical provider/model IDs and
will not silently substitute a model:

| Requested name | Working interpretation | Launch disposition |
| --- | --- | --- |
| “Nanon” | Google **Nano Banana** image family | add through a direct Google adapter after API/key and regional checks |
| “Mana” | likely **Wan 2.6** | add through a queued fal adapter after evaluation |
| “GPT-2” | likely **GPT Image 2**, not the legacy GPT-2 language model | confirm the intended API SKU; begin with the currently supported GPT Image API |
| “C-DAN” | likely **Seedance 2.0** | add through a queued fal adapter after evaluation |

If any of these mappings is wrong, correct the label before provider work starts. Model names in customer UI must be
product names; immutable canonical IDs and versions live in the provider registry.

### Small, high-quality launch matrix

Do not expose dozens of untested endpoints. Start with a measured pack:

- **Image:** Google Nano Banana fast/pro quality route and OpenAI GPT Image route. Google documents Nano Banana as
  native image generation/editing; its current family includes an efficiency and a professional variant. Replace the
  legacy Imagen/Gemini-2.0 fallback rather than adding a fourth image stack.
- **Video:** Google Veo 3.1 for native-audio, reference-directed, controlled cinematic work; Seedance 2.0 and Wan 2.6
  via fal for comparative workflows. Google documents Veo's asynchronous operation and reference-image capabilities;
  fal exposes model-specific queue/API schemas and pricing per model page.
- **Later, only after adapter/eval passes:** OpenAI Sora video, xAI/Grok image/video, Kling, Flux, audio, upscaling,
  and specialized editing. “Available in a competitor UI” is not evidence that an API is available, permitted, or
  economical for Arcanea.

Every model route needs a versioned capability card: input modes, maximum refs, aspect ratios, duration/resolution,
audio, regions, content policy, API status, asynchronous webhook/poll strategy, provider cost basis, customer credit
cost, and a source URL. A provider availability check runs at deploy and at submission; stale catalog data fails closed.

### One orchestration contract

Replace direct route-to-vendor calls with a single Generation Orchestrator:

```text
validated request → entitlement + policy → deterministic cost quote → atomic reservation
→ generation job + provider attempt → webhook/poll → asset validation/provenance
→ settlement or immutable refund → project/world attachment → client event stream
```

The adapter interface is media-aware, not OpenAI-compatible by assumption. A queued video adapter, a synchronous
image adapter, and a streaming text adapter are distinct implementations. The orchestrator owns retries, idempotency,
timeouts, provider fallbacks, error taxonomy, and customer-visible receipts.

## 5. Supabase foundation

Use Supabase as the tenancy and durable-record system, never an optional log around a provider call. The migration work
is intentionally deferred until a reviewed schema packet is approved.

Required records:

- `projects`, `project_memberships`, `worlds`, `world_entity_versions`, and `world_relationships`;
- `generation_jobs`, `generation_attempts`, `provider_runs`, `generation_events`, and idempotency keys;
- `assets`, `asset_variants`, `asset_provenance`, `reference_assets`, and signed/private storage paths;
- `credit_wallets`, immutable `credit_ledger`, `usage_reservations`, `entitlements`, and `billing_event_receipts`;
- `mcp_installations`, credential references, scopes, audit events, and revocation timestamps;
- a versioned `provider_capabilities` registry and provider cost snapshot.

Rules:

- RLS is project and membership first. A user never infers another tenant's world, asset, job, or billing record.
- Store media in private buckets; hand browsers short-lived signed URLs. Preserve original asset, derivative, and
  provenance separately.
- Debit through a transaction/RPC with a unique idempotency key. Reserve before a costly provider call, settle from
  the provider receipt, and issue an immutable compensating refund only on a verified failure.
- BYOK secrets are encrypted and isolated by user/provider. Never accept a generic cross-provider header and never
  expose a raw key to the browser or MCP client.
- Product analytics is privacy-minimal; no PII enters the analytics event schema.

## 6. MCP: separate local power from hosted authority

Arcanea needs two deliberately different MCP products.

1. **Local stdio MCP:** can work with a creator's explicitly selected local workspace. Filesystem/media execution
   tools are capability-gated, path-allowlisted, and never reachable through a public HTTP endpoint.
2. **Hosted remote MCP:** uses authenticated, project-scoped access with explicit write/generate scopes, allowed
   origins, rate limits, audit logs, revocation, and per-request entitlements. It creates one server/session context
   per connection; it does not share an unauthenticated singleton server or process-local durable state.

Tool groups are split into public discovery, authenticated project read, authenticated project write, and privileged
local-only. `world-persistence` moves from repository JSON to RLS-backed durable records for hosted use. Contract tests
cover tool discovery, schema validation, scope denial, rate limiting, session cleanup, and no filesystem escape.

## 7. Billing recommendation — Stripe first, Polar only for a different business choice

“Poller.sh” is treated here as **Polar.sh**; please correct that if another product was meant.

### Decision

Use **Stripe Payments + Stripe Billing pay-as-you-go** as the primary billing system. The codebase already depends on
Stripe, and Arcanea needs an internal, real-time cost ledger regardless of which checkout vendor is used. Start with
Stripe Checkout, Customer Portal, webhooks, subscriptions, one-time credit packs, and the internal immutable ledger.
Do **not** buy Stripe's annual Billing contract at launch. Stripe's current pay-as-you-go Billing price is 0.7% of
Billing volume; its advertised annual plans start at $620/month, which is premature for an unproven product.

Do **not** make Stripe's Billing Credits public preview the source of truth. It may assist invoice accounting later,
but real-time generation authorization, cost reconciliation, refunds, and fraud controls must remain Arcanea-owned.

Polar is a credible later option when merchant-of-record tax handling is the dominant constraint for a digital,
international product. It is not the best first choice for a high-cost, multi-provider generation marketplace: its
current Starter plan is free but 5% + $0.50 per transaction, whereas the platform still needs the same usage ledger.
If legal/tax simplicity outweighs payment control, take **Polar Starter** first; its published break-even for **Pro
($20/month)** is about $1,379 monthly sales. Do not integrate both systems in the first release.

### Recommended customer offer to test (after margin calibration)

| Offer | Price | Included | Guardrail |
| --- | ---: | --- | --- |
| BYOK Free | $0 | Worlds, continuity, local MCP, and 300 welcome Arcana credits | no recurring hosted video allowance |
| Creator | $19/month | 1,900 Arcana credits, private worlds, standard queue | all media shows its debit before submit |
| Studio | $49/month | 4,900 Arcana credits, collaboration and priority queue | no unlimited premium-video promise |
| Top-ups | $10 / $30 / $100 | 1,000 / 3,000 / 10,000 Arcana credits | no silent expiry; purchased balance is ledgered |

At launch, one Arcana credit represents **$0.01 of checkout value**, not a false universal “one generation.” The debit
is `ceil(provider cost × 1.85 × 100)` credits, rounded and published before submission. That creates a roughly 46%
provider-cost ceiling before payment fees/operations; every model cost card is versioned, and changes apply only to
future requests. This is a starting hypothesis, not a pricing launch decree: run an internal paid-generation bakeoff
and update the multiplier/prices only with actual vendor receipts, target margin, regional tax, and fraud results.

### What to buy now (only after Frank's approval)

1. Stripe: a standard account using Payments and Billing pay-as-you-go; **no annual Billing plan** and no Connect
   until Arcanea has real marketplace payouts.
2. Provider evaluation: one budget-capped, server-side project/account per selected provider; begin with a **$100
   maximum test budget each** for Google, OpenAI, and fal, with alerting and no user-facing sale. Do not buy a
   Higgsfield consumer subscription as a product dependency.
3. Production provider commitments: none until the model bakeoff produces quality, latency, legal, and unit-cost
   evidence. Then choose the smallest pay-as-you-go/credit commitment that covers the 30-day forecast.

This section requests a financial and legal approval before any account creation, spend, price activation, tax setting,
or customer charge.

## 8. Delivery plan and acceptance gates

### Phase 0 — Stabilize and make the truth visible

**Scope:** inventory all generation entry points, stop adding model routes, feature-flag hosted paid generation and
remote write/generate MCP paths until their replacements are live.

**Pass condition:** one source of truth for current capability, a route-to-orchestrator migration map, and no demo
credit fallback reachable in production.

### Phase 1 — Data, identity, and money foundation

**Scope:** reviewed Supabase migration packet, RLS tests, private storage, durable jobs, atomic reservation/settlement,
Stripe event receipt table, and entitlement service.

**Pass condition:** concurrent debit test, webhook replay test, failed-provider refund test, tenant-isolation test, and
manual migration rollback are all proven in a non-production Supabase environment.

### Phase 2 — Provider adapter and evaluation plane

**Scope:** Generation Orchestrator, model registry, adapter fixtures, Google image/video, OpenAI image, fal Seedance
and Wan adapters, webhook/poll workers, cost caps, safety and provenance receipts.

**Pass condition:** every launch model passes a fixed prompt/reference evaluation suite, has a cost/latency receipt,
and returns consistent job state without a paid provider call in CI.

### Phase 3 — World Canvas experience

**Scope:** static composition first; responsive composer, canvas, queue, inspector, lineage, World Memory, empty/error
states, and accessible/reduced-motion interactions.

**Pass condition:** a first-time mobile creator completes the activation loop without a fake output; desktop/mobile
screens and motion evidence score at least 26/30 under the estate quality gate.

### Phase 4 — Secure MCP and collaboration

**Scope:** local/remote split, scoped authorization, OAuth/client onboarding decision, audit trail, rate limits,
tool-contract tests, and project sharing.

**Pass condition:** a remote token cannot access a filesystem tool or another project; local tooling cannot escape an
approved workspace; security review signs off.

### Phase 5 — Billing activation and release

**Scope:** approved Price IDs/configuration, Checkout/Portal, idempotent verified webhooks, customer receipts, spend
limits, support/refund procedure, preview deployment, and production readiness review.

**Pass condition:** checkout-to-entitlement-to-job-to-settlement reconciliation is proven end-to-end in test mode;
two independent models/providers review the result; Vercel preview, performance, accessibility, security, and
rollback checks pass. Production/domain promotion requires named human approval.

## 9. Team operating model

When machine admission permits, this work divides into five non-overlapping lanes plus an independent verifier:

- **Platform/Supabase engineer:** schema, RLS, ledger, storage, migrations, rollback.
- **Model-router and eval engineer:** adapters, model registry, provider contracts, cost and quality bakeoff.
- **Product experience engineer/designer:** World Canvas, responsive product story, design evidence and visual QA.
- **MCP/security engineer:** local/remote boundary, scopes, auth, audit, threat-model and tests.
- **Billing/release engineer:** Stripe test-mode, webhooks, entitlements, Vercel preview and observability.
- **Independent verifier:** read-only cross-provider security, migration, UX, and release review.

The current PP admission gate is HOLD, so no swarm or browser workload has been started. This packet is intentionally
serial until RAM/CPU/task pressure drains; it is not a claim that the specialist build lanes are already running.

## 10. Immediate next implementation packet

The next code lane, once separately claimed, should be **“Generation Ledger and Job Contract”** only:

- new schema/migration proposal and generated types;
- atomic `reserve_generation` / `settle_generation` / `refund_generation` functions with idempotency;
- durable job state machine and provider-attempt interface;
- removal of production demo-credit fallback;
- fixture-based tests and a rollback document.

It explicitly excludes new visual polish, live provider keys, Stripe live mode, production migrations, and Vercel
promotion. That sequencing makes every later model, payment, MCP, and UX improvement safer to ship.

## References checked in this planning pass

- [Higgsfield public product surface](https://higgsfield.ai/) — interaction patterns and public model menu only.
- [Google image generation / Nano Banana](https://ai.google.dev/gemini-api/docs/image-generation?hl=en) and
  [Google video generation / Veo](https://ai.google.dev/gemini-api/docs/video) — supported media capabilities and
  asynchronous workflow.
- [OpenAI GPT Image model documentation](https://developers.openai.com/api/docs/models/gpt-image-1) and
  [OpenAI video API reference](https://platform.openai.com/docs/api-reference/videos) — provider contracts, not a
  promise that every web product SKU is available to Arcanea.
- [fal model API overview](https://fal.ai/docs/documentation/model-apis/overview),
  [Seedance 2.0 API](https://fal.ai/models/bytedance/seedance-2.0/text-to-video/api), and
  [Wan 2.6 guide](https://fal.ai/learn/devs/wan-26-developer-guide-mastering-next-generation-video-generation).
- [Stripe Billing pricing](https://stripe.com/billing/pricing) and
  [Stripe Billing Credits documentation](https://docs.stripe.com/billing/subscriptions/usage-based/billing-credits).
- [Polar pricing](https://polar.sh/resources/pricing) and
  [Polar merchant-of-record documentation](https://polar.sh/docs/merchant-of-record/introduction).
