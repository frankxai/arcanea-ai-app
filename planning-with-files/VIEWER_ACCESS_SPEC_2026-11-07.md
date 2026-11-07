# viewer.v1: authenticated identity, plan and offers (Arcanea)

- Status: built on `agent/opencode/viewer-access-2026-11-07`; draft PR; additive, no migration
- Date: 7 November 2026
- Author: OpenCode build lane
- Base revision: `0bc84365469` (`origin/main`, 7 November 2026)
- Counterpart: GenCreator ADR-017 (`frankxai/gencreator.ai`, same `viewer.v1` schema)
- Scope: `apps/web/lib/billing/viewer.ts`, `apps/web/app/api/v1/me/**`, tests

## Why

Arcanea already knows a signed-in person's plan in two places: `/api/billing/balance` returns plan, credits, entitlements and action costs, and `/settings/billing` renders them. What it did not have is the canonical account contract the portfolio is standardising on: the same `viewer.v1` shape GenCreator now serves, with identity, the effective plan, entitlements and actionable offers in one read.

The gap that matters is fail-closed plan resolution. The existing balance route reports `ENTITLEMENTS[account.plan]` regardless of `planStatus`. The ledger normally moves a canceled subscription back to Spark, but the read model should not depend on that having happened before it grants a paid entitlement.

## Goals

1. Serve `GET /api/v1/me` with the shared `viewer.v1` schema.
2. Resolve the effective plan from both plan id and billing status: `active`, `trialing` and `past_due` keep the plan; `none`, `canceled`, `revoked`, `paused` and unknown plans resolve to Spark.
3. Read credits from the billing ledger; read plan features and credit packs from the catalog, never from hard-coded strings.
4. Return actionable offers only: other plans plus credit packs, never the active plan.
5. Fail closed: 401 without a session, 503 when the ledger is unavailable.

## Non-goals

- No checkout, price, Polar product or portal change.
- No replacement of `/api/billing/balance`; both read the same ledger, and consolidating them is a later call.
- No UI consumer in this slice.
- No change to the auth pages or middleware.

## Pattern provenance

- Supabase, "Creating a Supabase client for SSR" and "Choosing an auth method" (fetched 7 November 2026): cookie-scoped server client, `getUser` for a server-confirmed record, private cache headers.
- Next.js, `route.js` reference (fetched 7 November 2026): Route Handler conventions and `runtime`/`dynamic` segment config.

Patterns adopted from current vendor docs; no template files copied.

## Design

| Concern        | Decision                                          | Reason                                                               |
| -------------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| Identity       | `createClient()` server client + `auth.getUser()` | current Supabase SSR guidance; cookie presence is not authentication |
| Plan source    | `getAccount(user.id)`                             | the billing ledger is already the source of credits and plan         |
| Effective plan | `effectivePlanId(plan, status)`                   | a plan that cannot pay must not grant its entitlements               |
| Entitlements   | `ENTITLEMENTS[effectivePlan]`                     | catalog is the single source of features                             |
| Offers         | `PLANS` minus effective plan, plus `CREDIT_PACKS` | actionable, no repetition, no invented price                         |
| Errors         | 401 unauthorized, 503 `ledger_unavailable`        | never a fabricated free account on ledger failure                    |
| Caching        | `private, no-store` and `no-referrer`             | account data must not be cached                                      |

### Fail-closed matrix

| planStatus                                                              | Result                                                                                                        |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `active`                                                                | plan until `currentPeriodEnd` plus a 24-hour webhook-latency allowance, then Spark; no period end means Spark |
| `trialing`                                                              | same rule as `active`                                                                                         |
| `past_due`                                                              | Spark. The ledger has no `past_due_at`, so any grace window would be invented and could cover an unpaid cycle |
| cancel-at-period-end (`active` or `canceled`) before `currentPeriodEnd` | plan as recorded until the paid period ends                                                                   |
| cancel-at-period-end after `currentPeriodEnd`, or with no date          | Spark                                                                                                         |
| `canceled` without period-end state                                     | Spark                                                                                                         |
| `revoked`                                                               | Spark                                                                                                         |
| `paused`                                                                | Spark                                                                                                         |
| `none`                                                                  | Spark                                                                                                         |
| unknown plan id                                                         | Spark                                                                                                         |

`member` means an account exists; `paid` is the access-relevant flag and is true only for a paid catalog plan. Offers are upgrades only and actionable only when `billingReadiness().live` is true and the recovery schema is present, which are the same conditions `/api/billing/checkout` enforces. Lower plans and Spark are never offered, and credit packs appear only when their Polar product is configured. When checkout is closed, `offers` is empty and `nextOffer` is null rather than pointing at a checkout that returns 503.

## Acceptance criteria

| #   | Criterion                                            | Evidence                                                             | Status                            |
| --- | ---------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------- |
| 1   | Status-to-plan matrix, unknown plan, credits, offers | 7 node:test cases in `apps/web/lib/billing/__tests__/viewer.test.ts` | pass (run 2026-11-07)             |
| 2   | Route auth and 503 behaviour                         | code review; route reuses the existing balance-route pattern         | not runtime-tested                |
| 3   | App typecheck/lint/build                             | not run in this lane                                                 | **not evidenced**; CI is the gate |
| 4   | Live probe                                           | requires deploy + signed-in account                                  | not claimed                       |

## Rollout

Additive route; no migration and no env change. Deploy, then call `GET /api/v1/me` signed in (200 with `viewer.v1`) and signed out (401). The existing `/api/billing/balance` keeps working.

## Rollback

Revert the branch. No data, grants or catalog entries were added.

## Risks and follow-ups

- **Duplicate reads.** `/api/billing/balance` and `/api/v1/me` answer overlapping questions. Consolidation waits until a client actually consumes one of them.
- **Ledger availability.** Without the billing migration the endpoint returns 503, matching the balance route.
- **Cancellation semantics.** A period-end cancellation keeps paid access until `currentPeriodEnd`, matching `mapPolarEvent`. Revocation, pause and an expired cancellation resolve to Spark.
- **Offer eligibility.** Offers come from the same readiness check as `/api/billing/checkout`; a closed billing configuration yields no offer instead of a dead link.
- **Scope.** No prices or checkout links are returned; buying still goes through the gated billing routes.
