# Billing runbook — turning checkout on

Owner: Frank. Everything here is an account or production action an agent must not take alone.
Code references: `apps/web/lib/billing/*`, `supabase/migrations/20261005000001_billing_kernel.sql`.

## 0. Preconditions

- Branch `claude/admiring-heisenberg-besi86` merged (or the billing kernel files cherry-picked).
- `pnpm --dir apps/web test:billing` passes locally.

## 1. Polar

1. polar.sh → organization `arcanea` → Settings → complete identity and payout. Confirm with the
   API: `organizations_list` must show `capabilities.checkout_payments: true`.
2. Products (create in **sandbox** first at sandbox.polar.sh, then repeat in production):

   | Catalog SKU | Polar product | Type | Price |
   | --- | --- | --- | --- |
   | `creator` | Arcanea Creator | subscription, monthly | €19.00 |
   | `studio` | Arcanea Studio | subscription, monthly | €79.00 |
   | `pack-500` | 500 credits | one-time | €5.00 |
   | `pack-2500` | 2,500 credits | one-time | €19.00 |
   | `pack-8000` | 8,000 credits | one-time | €49.00 |

   Tax behaviour: inclusive. Copy each product id.
3. Access token: Settings → Developers → create an organization access token with scopes
   `checkouts:write`, `customer_sessions:write`, `products:read`, `orders:read`,
   `subscriptions:read`.
4. Webhook: Settings → Webhooks → endpoint `https://www.arcanea.ai/api/webhook/polar`, format
   Standard Webhooks, events `order.paid`, `subscription.active`, `subscription.updated`,
   `subscription.canceled`, `subscription.revoked`, `subscription.past_due`,
   `subscription.paused`, `subscription.resumed`. Copy the secret.

## 2. Vercel (project `arcanea-ai-app`, Production and Preview)

```
POLAR_ACCESS_TOKEN=polar_oat_…
POLAR_SERVER=sandbox            # switch to production after step 5
POLAR_WEBHOOK_SECRET=whsec_…
POLAR_PRODUCT_CREATOR=…
POLAR_PRODUCT_STUDIO=…
POLAR_PRODUCT_PACK_500=…
POLAR_PRODUCT_PACK_2500=…
POLAR_PRODUCT_PACK_8000=…
NEXT_PUBLIC_SITE_URL=https://www.arcanea.ai
```

`/pricing` shows purchase buttons only when `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET` and both
plan product ids are present. Packs appear individually as their ids are added.

## 3. Supabase (project `hcfhyssdzphudaqatxbk`)

Apply `supabase/migrations/20261005000001_billing_kernel.sql` through the dashboard SQL editor or
the Supabase MCP `apply_migration`. It creates three tables and nine functions, grants nothing to
`anon`, and leaves every existing table untouched. Then run the security advisors; the new tables
must show no RLS findings.

Rollback: `drop table billing_events, credit_ledger, billing_accounts cascade;` plus
`drop function` for the nine `billing_*` functions. No existing data is affected.

## 4. Verify in sandbox

1. Sign in with a test account. Visit `/settings/billing`: Plan Spark, 25 credits (welcome grant).
2. `/pricing` → Buy 500 credits → Polar sandbox checkout → test card 4242… → redirected to
   `/settings/billing?checkout=success`.
3. Within a minute: `credit_ledger` has a `purchase` row with reference `polar:order:<id>`,
   `billing_events` has the delivery with `processed_at` set, balance reads 525.
4. Redeliver the same webhook from the Polar dashboard: response `{duplicate:true}`, balance
   unchanged.
5. `/imagine` → generate 2 standard images → balance drops by 20; `credit_ledger` shows
   `reserve` then `settle`.
6. Subscribe to Creator → `billing_accounts.plan = creator`, `plan_status = active`, +1,500 credits
   from the `subscription_create` order.
7. Cancel from the portal → `plan_status = canceled`, `cancel_at_period_end = true`, plan unchanged
   until Polar sends `subscription.revoked`.

## 5. Go live

Set `POLAR_SERVER=production`, replace the token, secret and product ids with the production
values, redeploy. Make one real €5 purchase yourself and refund it from Polar. Then announce to the
Founding Circle list (`waitlists` table) with the 40% discount code created in Polar → Discounts.

## 6. Operating

- Failed webhook deliveries: `select * from billing_events where error is not null`. Polar retries
  on our 500; the ledger is idempotent so a retry never double-grants.
- Manual credit adjustment (support): `select billing_grant_credits('<user>', 100, 'adjust',
  'support:<ticket>', '{"by":"frank"}')` with the service role.
- Weekly: `select kind, count(*), sum(amount) from credit_ledger where created_at > now() -
  interval '7 days' group by kind`.
