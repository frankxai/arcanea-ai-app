# Payments hardening: Stripe mirror + webhook integrity

- Status: built on `agent/opencode/payments-hardening-2026-11-07`; draft PR open; migration apply human-gated
- Date: 7 November 2026
- Author: OpenCode build lane
- Base revision: `0bc84365469` (`origin/main`, 7 November 2026)
- Scope: `apps/web/app/api/stripe/**`, `apps/web/lib/stripe/**`, `apps/web/lib/billing/**`, `supabase/migrations/**`
- Revision of this document: drafted with the branch; it describes intent and reviewed evidence, not deployed truth

## Why this exists

Arcanea's billing rail is Polar; the Stripe checkout route predates it and is gated behind `lib/billing/stripe-gate.ts` (billing switch plus a reviewed for-sale tier status). The webhook was still the weakest file in the payment path:

1. The Stripe client was constructed with no explicit API version, so an SDK bump could move the whole integration across an API version without a review.
2. Events were not deduplicated. Stripe delivers at least once; a replay could rewrite a tier.
3. `checkout.session.completed` set `profiles.subscription_tier` from `session.metadata.tier` without ever reading the subscription's status or its actual price. A cancelled or unpaid subscription, or an unmapped price, was not represented.
4. Nothing was mirrored locally, so support, reconciliation and any future billing UI had no read model and depended on live Stripe calls.

## Goals

1. Verify signatures over the raw body, pin the API version, and deduplicate event ids.
2. Grant entitlement from the subscription's real status and configured price only.
3. Keep a local mirror of customers, products, prices and subscriptions.
4. Never break a customer's access on incomplete information: unmapped prices and unknown statuses change nothing.
5. Return 200 for verified but unhandled events; 400 for bad signatures; 500 only when work failed, so Stripe retries.

## Non-goals

- No checkout, pricing or portal UI change. Checkout stays behind its existing gate.
- No move away from Polar, and no claim about which rail is primary. This slice hardens the Stripe surface that exists.
- No invoice, payment-intent or credit-grant handling. Credits stay in `credit_balances` and are not touched here.
- No browser read model. Mirror tables are server-only until a reviewed account surface needs them.

## Design

| Concern | Decision | Reason |
| --- | --- | --- |
| API version | `2026-02-25.clover`, explicit in `lib/stripe/server.ts` | it is the version stripe-node v20.4.1 ships; pinning makes an SDK bump a reviewed change |
| Period bounds | read from `subscription.items.data[0].current_period_start/end` | API 2025-03-31 moved them off the subscription root |
| Quantity | `item.quantity ?? 1`, never NOT NULL | the field is optional in the SDK types |
| Idempotency | `stripe_processed_events.event_id` checked at start, written after success | a marker written first would swallow a failed delivery |
| Duplicate writes | all mirror writes are upserts | replays are harmless even if two deliveries race |
| Tier source | env price ids (`STRIPE_PRICE_CREATOR`, `STRIPE_PRICE_STUDIO`), the same vars the checkout gate requires | one mapping, no guessing from price nicknames |
| Granting states | `active`, `trialing` | access follows paid/trial state |
| Revoking states | `canceled`, `unpaid`, `incomplete_expired`, `paused` → `spark` | terminal states must not keep a paid tier |
| Dunning | `past_due`, `incomplete`, unknown → no change | a retrying card should not instantly lose access; unknown states never upgrade |
| Unmapped price | no tier change | fail closed on entitlement, never invent one |
| Customer link | `session.metadata.user_id` at checkout; fallback `profiles.stripe_customer_id`; backfilled into the mirror | works for existing customers created before the mirror |
| Access | RLS enabled on every mirror table, `anon`/`authenticated` revoked, `service_role` granted, no policies | payment rows are not browser-readable |
| Foreign keys | none between Stripe ids | event order is not guaranteed; mirrors must accept any arrival order |

### Entitlement matrix

| Subscription status | Configured price | Result |
| --- | --- | --- |
| `active` | creator/studio | set that tier |
| `trialing` | creator/studio | set that tier |
| `active` | unmapped | leave profile unchanged |
| `past_due` | any | leave profile unchanged |
| `incomplete` | any | leave profile unchanged |
| `canceled` / `unpaid` / `incomplete_expired` / `paused` | any | set `spark` |
| unknown future status | any | leave profile unchanged |

### Event coverage

| Event | Action |
| --- | --- |
| `checkout.session.completed` (subscription mode) | retrieve subscription, mirror customer + subscription, grant tier, write `stripe_customer_id` |
| `customer.subscription.created/updated/deleted` | mirror subscription, resolve user via metadata → mirror → profile, apply entitlement |
| `customer.created/updated` | mirror customer |
| `product.created/updated` | mirror product |
| `price.created/updated` | mirror price |
| anything else | 200, no write |

## Files

| File | Change |
| --- | --- |
| `supabase/migrations/20261107000001_payments_mirror.sql` | new mirror tables + event ledger, fail-closed grants |
| `apps/web/lib/stripe/server.ts` | pinned Stripe client + webhook secret accessor |
| `apps/web/lib/billing/stripe-mirror.ts` | pure row builders and entitlement decisions |
| `apps/web/app/api/stripe/webhook/route.ts` | rewritten handler |
| `apps/web/lib/billing/__tests__/stripe-mirror.test.ts` | decision/row tests |
| `apps/web/lib/billing/__tests__/payments-mirror-contract.test.ts` | migration contract |

## Acceptance criteria

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Entitlement matrix holds, including unmapped price and unknown status | 13 node:test cases in `stripe-mirror.test.ts` | pass (run 2026-11-07) |
| 2 | Migration is additive, fail-closed, and keeps the idempotency ledger | 5 node:test cases in `payments-mirror-contract.test.ts` | pass (run 2026-11-07) |
| 3 | Route parses and transforms | esbuild transform of `route.ts` and `server.ts` | pass; not a typecheck |
| 4 | Full `apps/web` typecheck/lint/build | not run on this branch | **not evidenced** — monorepo install and Next build exceed this lane's budget |
| 5 | Live event replay | requires `stripe` CLI + test keys + applied migration | **not evidenced** — human-gated |

The honest limit: this branch has runnable evidence for the decision logic and the schema contract, and syntax evidence for the route. It does not have compiler or runtime evidence for the route in the app build. Treat criterion 4 as a merge gate, not a formality.

## Rollout

1. Review the draft PR; resolve criterion 4 in CI (the repo's own gates) before marking ready.
2. Apply the migration to the target Supabase project. **Before** deploying the route: without `stripe_processed_events` the webhook returns 500 by design.
3. Deploy the webhook.
4. Replay a real test-mode event with `stripe trigger customer.subscription.updated`; confirm one mirror row and one event-ledger row, and a second replay returns `{received: true, duplicate: true}`.
5. Check `profiles.subscription_tier` for an active creator subscription, and for a cancelled one.

## Rollback

Revert the branch. Mirror tables are additive and unread by other paths; dropping them is optional cleanup, not required. No grants or policies need restoring because none were opened.

## Risks and follow-ups

- **Two billing rails.** Polar remains the product rail; this slice hardens Stripe without deciding its future. If Stripe is retired, the mirror and route go with it.
- **Webhook before migration.** A deploy without the migration fails closed with 500s. That is intentional and must be sequenced.
- **No invoice events.** `invoice.payment_failed` does not change entitlement yet; Stripe updates subscription status for the retry lifecycle, which this route mirrors.
- **Deleted customers.** `customer.deleted` is acknowledged and ignored; mirror rows are retained for reconciliation. A retention decision is needed before this data grows.
- **Portal compatibility.** `stripe_customer_id` is written on the profile at checkout, so the existing portal route keeps working.
- **Polar parity.** The same integrity ideas (event dedup, status-derived entitlement) have not been applied to Polar events; that is its own slice.
