# Google sign-in recovery

Source: Codex task `01a0930b-6362-7e20-b6f9-3c0c34d969df`, 2026-09-12.
Owner: this task. Repo: `frankxai/arcanea-ai-app`.
Branch: `codex/arcanea-auth-product-foundation-20260912`.

## Observed failure

Production `dpl_CtrBKHU1a2esxzDmGGdjncjwqFRQ`, commit
`42611939e679f336c0f59e543373fe07b29edcd1`, served www.arcanea.ai.
In Chrome, `/auth/login?next=%2Fsettings%2Fproviders` rendered normally. Clicking
Continue with Google immediately displayed “Authentication is not configured yet.
Please check back soon.” No Google page was reached.

`vercel env ls production` showed only `BLOB_READ_WRITE_TOKEN`. Both
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were absent.
The deployed login code checks these browser build-time values before OAuth.
Supabase project `hcfhyssdzphudaqatxbk` is ACTIVE_HEALTHY; its public authorize
endpoint returned 302 to Google using its registered Supabase callback.
This proves initiation configuration, not a completed user session.

## Repair and prevention

Restore the existing public URL/anon binding in Vercel, then rebuild. Do not add a
service-role key to the browser or rotate any credential. Changing a runtime variable
without rebuilding does not replace Next.js's inlined public bundle values.

Preview environment now contains the two public values. No secret value is recorded
here. Initial redeploys of the unchanged production commit were canceled by the
repository's ignored-build logic: it treats an identical source tree as skippable,
even when the environment changed. A new coherent auth build-check commit provides
the reviewable preview; do not repeatedly redeploy the unchanged SHA.

`scripts/check-auth-env.mjs` fails production builds for missing browser bindings,
placeholder/insecure URLs, privileged keys, malformed keys and mismatched legacy
project references. This is a configuration check, not cryptographic validation.
It prints variable names and errors only. Offline builds remain possible; opt a
Preview into the gate with `CHECK_AUTH_ENV=1`. Turbo includes both gate selectors
in its environment and cache key. The app build invokes the gate before Next.js.

## Acceptance and release

- Regression: `node --test scripts/tests/auth-env.test.mjs` (red observed, then 8 pass).
- Preview: build READY; login button reaches Google's account selection/consent;
  callback stays on the approved origin and establishes an authenticated session.
- Production: same public binding, new build, repeat original login path, refresh,
  protected settings, sign out and sign in again. Record what actually passed.
- No new billing, provider compute keys, RLS changes or migrations in this repair.

Promotion remains pending until the preview is inspected and the required production
approval is supplied. An account/consent prompt requiring the user's action is a
handoff; reaching Google is not proof of a completed session.

## Data and billing follow-up

Read-only catalog inspection found RLS enabled on all returned public tables.
This is not proof of correct isolation. `profiles` has an unrestricted public SELECT
policy and a self-update policy. Column grants include SELECT and UPDATE on
`subscription_tier`, `stripe_customer_id`, `subscription_ends_at`, and `metadata`.
The Stripe portal code reads `stripe_customer_id` from that profile. Treat this as a
release blocker for paid features: separate private billing state, restrict writes,
and test two-account isolation before activation. No customer row was read or changed.
Supabase's advisor also reported leaked-password protection disabled.

Related existing work: #307 (environment binding), #333 (public Supabase boundary),
#403 (world creation), commercial-truth branch dated 2026-09-10. Preserve their scope.

Rollback: revert the bounded build-gate commit if faulty; restore the last verified
deployment for a release regression. Removing the missing-binding repair restores
the reported auth outage. No database rollback is involved.
