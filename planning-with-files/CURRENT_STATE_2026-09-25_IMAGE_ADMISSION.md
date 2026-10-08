# Image generation admission and credit contract — 25 September 2026

Base: production SHA `4e104ae5e40d280d04f863137a505483f11e2409`.
Scope: `/api/imagine/generate`, a small admission helper, and focused tests.
No credentials, prices, access policy, production data, or provider configuration changed.

## Immediate repair

The generation route previously ignored a 401 returned by `/api/credits/spend`
and could call a paid image provider for an anonymous request. It also invoked
the optional APL enhancement _before_ checking credit admission. The candidate
blocks all non-success spend responses, requires an explicit JSON
`success: true` even for HTTP 200, treats unavailable admission as 503, and
bounds the requested image count and prompt length. Authentication and credit
checks now precede optional enhancement and image generation. The public
`/imagine` page remains browsable; server-backed generation requires sign-in.

## Release hold: credit ledger cannot yet attest a spend

The migration `supabase/migrations/20260324000001_credits_system.sql` defines
`purchased_credits`, `daily_credits_remaining`, `daily_credits_reset_at` and
`is_forge_subscriber`. Current `/api/credits/spend` and `/api/credits/balance`
read/write `purchased`, `daily_used`, `daily_reset` and `is_forge`, which do
not match that schema. Supabase `.upsert()` returns errors in its result, but
the spend route ignores those results and can respond `success: true` without
a debit. Read errors similarly trigger optimistic free defaults. This draft
does **not** make a 200 from the spend endpoint a reliable debit receipt.

Also, one credit is charged per request while the main image UI asks for four
images and the credit catalog describes one image per credit. Pricing and
provider cost ceilings need explicit product approval before selling credits.

Before releasing paid image generation: reconcile the deployed schema against
the migration, add an atomic idempotent admission/debit transaction with a
unique request key, publish a consistent price and image-count contract, and
verify failure recovery and refunds in an authenticated staging environment.
Do not promote this draft alone as proof that the billing system is safe.

## Verification and gate

Focused tests cover explicit success, anonymous denial, insufficient credit,
rate limits, and misleading 200 responses. Require full CI and independent
review of the exact SHA. Confirm current production deployment/SHA separately
after any reviewed promotion. Never send an anonymous POST to this paid route
as an uptime check. Rollback by reverting the code slice through release review.
