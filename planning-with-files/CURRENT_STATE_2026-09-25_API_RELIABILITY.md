# Arcanea API reliability and release boundary — 25 September 2026

Scope: repair the incident-adjacent API contracts on a branch and identify the
smallest credible route to a creator-safe release.
Owner: Arcanea product/reliability; quality issue #427. Base revision:
`4e104ae5e40d280d04f863137a505483f11e2409` (current production when
inspected). Related draft: Guardian report PR #446; shared monitoring PR #53
in private `frankxai/agentic-ops`.
Files: chat history/sessions/service, APL enhancement, media scoring/catalog
analysis, authorization policy, focused tests, this record.
Non-goals: modifying secrets, data, DNS, database policies, billing, preview
protection, paid services or production; replacing the current main chat UI.

## Observed evidence and user job

The current production deployment `dpl_G9KyJHJrmK3LaopPrvUpw9BpsqMV` logged
three POST failures at 2026-09-25 09:31 UTC: media taste 500, chat history 500
and APL enhance 503. This confirms failed feature requests on a serving SHA;
it does not establish sitewide unavailability. Root GET from one probe
location timed out while other sampled roots returned 200. Vercel exposes no
exception detail for those three requests, so their underlying causes remain
unconfirmed.

Creators need a clear distinction among local chat state, saved account chat,
local prompt guidance, optional provider rewrites, and operator-only jobs.
Working output must never imply a save, billable provider rewrite, or catalog
write that did not occur.

## Candidate contract

- `/chat` uses the AI SDK and local project/session storage today. The older
  `/api/chat/history` and `/api/chat/sessions` endpoints now require an
  authenticated Supabase account. Client-supplied `userId` cannot select
  another account. Database errors return 503; temporary function files or
  memory no longer masquerade as durable saved history.
- History pages newest messages and returns them in chronological order.
  Once a message insert succeeds, nonessential title, bond-count or timestamp
  work cannot turn it into a misleading failed save response.
- `/api/apl/enhance` provides labelled, deterministic APL guidance when the
  optional OpenRouter key is absent; quality scores do not imply a model
  rewrite. Provider failures and 429 remain visible as distinct errors.
- Catalog analysis and TASTE scoring require an authenticated user with a
  trusted `app_metadata.role = admin` claim *before* any storage, model or
  service-role action. Both require the service-role credential for writes;
  no publishable/anon key fallback is allowed. Missing backend configuration
  is 503, and scoring failures are not reported as successful analysis.

The operator-role assignment has **not** been verified in production. An
authorized owner must review whether this existing Auth claim is issued and
assign it through their normal access process before either media job can run.
No access configuration change is included here.

## Product and cost gaps still blocking a broad launch

1. `/api/imagine/generate` currently lets a 401 from credit spending pass
   through to provider-backed image generation. The spending route also uses
   optimistic defaults when its database read/debit fails. This is an
   unbounded-cost and incorrect-entitlement risk. Treat paid server generation
   as **not ready for unrestricted public access**. A separate reviewed
   implementation must enforce an authenticated admission path, atomic and
   idempotent spending, provider-cost ceilings and failed-generation recovery
   before advertising included credits or subscriptions.
2. The main `/chat` page uses its own browser session store; this candidate
   does not prove cross-device restore, account isolation, export or deletion.
   Prove those with authenticated end-to-end checks before saying chat is
   durably saved. Anonymous chat needs explicit local-only copy in its own
   product slice.
3. Do not call an APL local-guidance result a model rewrite. Do not expose
   catalog jobs as a customer feature. Offer creators a prompt preview first,
   then generation only under a reviewed budget, consent, data and attribution
   contract; add media scoring as an internal quality-review workflow.
4. The shared Production reliability workflow remains PR-only pending
   independent exact-revision review and Actions cadence/budget decision.
   The last credential-free live artifact was created 2026-09-24 23:08 UTC.
   The initial Vercel inventory capped at 50, so coverage remains incomplete.

## Acceptance, verification and release

Acceptance: anonymous/user_metadata-only requests cannot invoke privileged
media work or retrieve/write another person's chat; Supabase failure is
visible and never claims a save; APL fallback does not call a paid provider;
history returns recent messages first, with older cursor pages.

Verification: focused Node tests for the operator claim and APL fallback,
repository build/typecheck/lint for changed scope, GitHub checks on the exact
PR SHA and a Vercel preview. After independent review, bind the accepted
production deployment and aliases to the approved Git SHA, then exercise
authenticated saved chat and the internal media workflow with an authorized
test operator. No POST to a production scoring or mutation route is part of
anonymous uptime checks.

Stop condition: leave the candidate in a draft PR if tests, independent
review, the operator contract, or a production-safe acceptance path are
missing. Rollback: revert this code slice or return to the previous known-good
deployment only through the release gate; retain existing account records.
