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
in its environment and cache key. Vercel invokes the gate before Turbo, so a cached
build cannot bypass it. The package manifest and dependency graph are unchanged.

## Acceptance and release

- Regression: `node --test scripts/tests/auth-env.test.mjs` (red observed, then 8 pass).
- Preview `dpl_3zp3iMH5i7puzNrp1ph3TGCySeM4`, revision `12122547f`, is READY:
  https://arcanea-ai-awkdfox8f-starlight-intelligence.vercel.app . In the browser,
  Continue with Google reaches Google's email/account sign-in page with the expected
  Supabase callback and requested settings return path. The full authenticated
  callback/session remains unverified because it requires the user's Google login.
- Follow-up moves the guard before Turbo and fixes formatting. Verify final CI and
  preview for that revision before merging the prevention change.
- Production: same public binding, new build, repeat original login path, refresh,
  protected settings, sign out and sign in again. Record what actually passed.
- No new billing, provider compute keys, RLS changes or migrations in this repair.

The user approved production auth recovery. The two public values were restored and
the existing production revision `42611939e679f336c0f59e543373fe07b29edcd1` rebuilt as
`dpl_BEg7F73UWfwrRo2AWnKx3zNsEspN` (READY), serving www.arcanea.ai:
https://arcanea-ai-axcbr9c5p-starlight-intelligence.vercel.app . No source merge,
database migration or billing activation was part of that deployment.

Full Google consent exposed a second routing problem: Supabase returned to the site's
root with a code instead of `/auth/callback`. A fresh check confirmed that the client
completed authentication after hydration: the protected providers page opened and a
new login-page request was redirected to authenticated chat. Sign-out followed by a
fresh protected-page request correctly required login; Google sign-in then succeeded
again. The production environment repair restores login. The remaining issue is the
indirect callback handoff and lost requested destination. This matches the documented
[redirect allowlist fallback](https://supabase.com/docs/guides/auth/redirect-urls);
the actual dashboard allowlist remains uninspected because dashboard login is needed.

The reviewed follow-up recovers only GET requests to `/` with a nonempty code before
rendering the homepage. It redirects within the same origin to `/auth/callback`,
copies only the code and sanitized return path, and sends `private, no-store`.
The existing PKCE/session exchange remains authoritative; no validation is bypassed.
If Supabase dropped the requested destination, recovery defaults to `/dashboard`.
The shared return-path validator also rejects backslashes, control characters,
external and normalized protocol-relative destinations in both login and callback.
Four new regression tests cover this second failure, safe routing and loop avoidance.

Correct the dashboard's canonical production callback allowlist when access is
available, preserving existing valid entries and supporting its `next` query.
No broad wildcard over unrelated Vercel projects should be added. The existing-code
production session and repeat-login checks above passed. Verify server callback,
session persistence and routing again if the follow-up code is deployed.

Independent same-provider review passed both the initial guard/model/design and the
follow-up auth routing in the staged index. Second-provider buyer critique remains unavailable:
Claude is signed out and Gemini rejects this client as unsupported. This blocks a
commercial launch, not preparation of an explicitly proposed design.

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

## Dashboard correction and successful direct return

The dashboard became accessible during the continuation. Observed Site URL:
`https://arcanea.ai`; 13 allowed redirects included the non-www callback and older
Vercel deployment patterns, but no canonical www callback.
Added only `https://www.arcanea.ai/auth/callback` and
`https://www.arcanea.ai/auth/callback?next=**`. The second entry is needed for the
current login page's return-destination query. Existing entries and Site URL were
preserved. The dashboard now shows 15 entries.

Verification: sign out through the account menu; navigate to
`https://www.arcanea.ai/settings/providers`; observe
`/auth/login?next=%2Fsettings%2Fproviders`; choose Google; land directly on the
protected `/settings/providers` page. This fixes the lost destination confirmed
in earlier attempts. No database policies or billing settings changed.

The live Vercel alias now resolves to deployment `dpl_Dxvp3ygiUNJnjQoMK8goiwuhJ1cD`,
source `93478bc52399f7cdda6d7b766d4c6986748de273`, READY. Other tasks deployed newer
main revisions after the original recovery; do not redeploy the earlier revision
or claim this continuation deployed that main change.

Two attempts to open the mobile navigation menu in the original settings tab
produced a browser load-error page. A fresh desktop chat tab supported account
menu, sign-out and repeat login. This is a separate unresolved navigation finding,
not evidence that Google sign-in still fails.

### Mobile navigation continuation

The menu failure reproduced in a fresh, authenticated Vercel preview at 375px.
The browser console identified `cannot add postgres_changes callbacks ... after
subscribe()`: desktop and mobile `NotificationBell` instances reused the same
Supabase channel topic. The continuation assigns a fresh topic per subscription,
filters inserts by recipient, and removes only the instance's own channel. Two
regressions cover concurrent mounts and remount during pending cleanup. This is
independent of the Google redirect repair and requires final preview verification.
