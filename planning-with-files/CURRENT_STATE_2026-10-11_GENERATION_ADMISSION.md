# Durable generation admission and video recovery

Owner: Codex lead, programme276 and existing credit/recovery529. Branch
`agent/codex/generation-admission-20261011`; base
`5745705c6f881d250d6a46336a6662de0d746d24`. Work uses the existing accepted billing
kernel and private operation schema. Reader560, companion562, chat567 and the
foreign505 checkout remain with their existing owners.

Creator outcome: generate an actual clip from an image, recover the same accepted
job after interruption, and receive its recorded output without duplicate paid
submissions or fabricated successful credit admission. Compare with repeatedly
submitting to a separate video tool after a lost response: this path retains the
account-bound request and job identity. Provider quality and buyer value remain
unmeasured in this slice.

## Defects reproduced before correction

Two native tests failed against accepted source: a failed legacy balance read
returned successful admission, and an unknown provider outcome became a refunded
terminal failure. Legacy spends read fields inconsistent with the credit migration,
ignored debit errors and fell back to daily grants. Animation and the legacy image
route consumed that admission. Animation also retried paid providers after an
uncertain outcome and could return a reimagined image as video.

## Implementation

- Retire standalone `/api/credits/spend` with410 and no data/provider access.
- Route `/api/ai/generate-image` through the same image handler, account admission,
  request key, catalog quote and durable operation as Imagine. It uses the modern
  generation payload; old edit/variation fields are not a supported operation.
- Quote `video.clip` from the existing catalog. Authenticate with actual getUser;
  bind the operation and its fingerprint to that actor and requested settings.
- Select Grok or configured fal once before submission. Preserve both configured
  video capabilities; remove paid fallthrough and fake image-as-video output.
- Checkpoint the accepted provider request in the existing private running operation
  result. Reuse its service-only permissions; add no schema, public grant or store.
- Retry may only poll that recorded provider job. Valid completed results enter
  existing staging/settlement and replay. An unknown start, lost checkpoint response,
  ambiguous poll, expiry or missing key stays pending; no inferred refund or new job.
- Trust only fixed provider origins; validate fal queue URLs before attaching a
  server credential, refuse redirects, bound transport/polling and sanitize errors.
- Browser image/video retries retain separate session keys without raw prompts or
  images. Only a correlated confirmed artifact clears a successful operation key.
  An inline image's saved URL is retained in the displayed row before animation.

Remaining recovery limit: a submission accepted by the provider whose request ID
never reached a committed checkpoint needs operator/provider reconciliation. Never
repeat that POST or refund by guess. Provider output retention, object ownership,
private media migration and cross-device operation history need their existing
media/workspace acceptance; this repair does not claim those are delivered.

## Verification and production boundaries

Fresh PP admitted one interactive workload: bounded, 9194 MB free against4096 MB,
23 task runtimes and pause-new-swarms. No new agent fleet, local model or server.
Existing local dependencies were reused. Two original reproducers pass after repair;
focused kernel/actual-handler/transport/checkpoint tests pass. A41-case intermediate
full billing/request suite passed before the checkpoint extension. Fresh full suite,
formatting, changed lint, hosted build/types and exact-source independent review
must cover the final candidate. Fixtures use synthetic accounts/keys/transports;
no actual provider generation or production user/credit write occurred.

Local web TypeScript reported missing `@arcanea/schemas` workspace links and an
associated atlas type error after main564; this checkout retains its earlier
installed dependencies. Do not attribute those to this generation patch or suppress
the check. A fresh hosted frozen install is authoritative for the candidate build.

Installed Supabase connector read-only SQL confirmed the connected project is
Arcanea, `hcfhyssdzphudaqatxbk`, ACTIVE_HEALTHY. Billing operations, reserve/recovery
functions and legacy balance table were absent. This is a demonstrated deployment
gap; the code's fail-closed behavior is not working paid production acceptance.
No production migration, grant, subscription, payment or environment write was
performed. Catalog prices, costs and commercial release remain unvalidated.

Independent review uses the existing manually dispatched provider rail, restricted
to this owned branch, the full exact head and pinned base. Source hashes, full
contexts, model/usage and final findings are retained in its existing artifact.
Earlier review receipts cannot approve this source. Every required gate remains.

## Acceptance and rollback

Required: no provider work on malformed/account/credit denial; one paid submission
per operation; no secret/URL leakage; actor-isolated checkpoint; safe same-key
recovery/replay; confirmed artifact correlation; unchanged receiving gates; hosted
preview and source-bound review; main/domain verification after protected merge.
Authenticated production generation remains gated by live schema/key/release and
approved bounded provider acceptance. The broader goal remains active and incomplete.

Rollback is a reviewed forward change that keeps unsafe legacy admission closed;
do not re-enable defaults, unlimited claims or paid fallback. Preserve accepted
operation receipts and other owners' changes.

## Active legacy callers reconciled before landing

A complete app/package caller scan found Image Studio and the Page cover editor still using legacy payloads. Both now use the existing durable request helper, stable retry keys and modern generation receipt. Image Studio preserves its layout and displays actual HTTPS or validated inline images; failed/anonymous calls show errors and retain prior output. Simulated provider logs and branded success/failure substitutes are removed. The cover editor requests one hosted-URL Grok image at16:9 because Pages refuses inline cover bytes; actual provider availability/model compatibility remains part of the separate managed-inference release gate. No new asset upload or public media exposure was added.

A separate inherited image-provider fallback chain may repeat paid work on uncertain outcomes and uses old provider models. Managed inference remains unconfigured in production; this must be repaired and independently verified before that release. This patch does not certify the inherited image transport or paid creation. Existing reserved IPv6 classification gaps are also reproduced privately for a subsequent security slice. Older exact-source receipts remain evidence of earlier revisions only; every final caller refinement requires fresh review/checks.

## Image transport repair awaiting exact-head acceptance

Two controlled real-transport reproducers failed against9160f899: ambiguous OpenRouter failure submitted paid work to Grok, and a forced provider's lost response became an ordinary refundable failure. The replacement selects one provider before submission and keeps unknown submission/body/batch/output outcomes pending. No new provider key, paid generation, production schema or billing activation occurred.

Grok uses the documented grok-imagine-image-2.0 deferred request with aspect_ratio, records its accepted ID in the existing private actor-bound running operation, and retries through GET-only recovery. Checkpoint loss stops polling; expired or malformed jobs stay pending. OpenRouter disables upstream fallback and preserves pending batches with unknown responses. Gemini uses the existing accepted Nano Banana 2 family through documented REST configuration. Direct image callers without durable admission fail before provider access; the Luminor tool still needs a governed creator workflow adapter. OpenRouter/Gemini lost synchronous output requires reconciliation, and image output above the existing delivery cap requires governed storage work. These are open limitations, not completed creator outcomes.

New transport, actual handler and actor-isolation cases cover saved image recovery, refusal, pending/expired jobs, batch ambiguity, provider credentials, source validation and body deadlines. Existing required CI now also runs the native billing/generation suite. Earlier PR574 hosted results apply only to9160f899; the final transport revision needs fresh hosted checks and independent source review. Authenticated Studio/Page cover acceptance and commercial/schema release remain incomplete.

## Disposable authenticated acceptance baseline

Owned fixture outputs: scripts/run-generation-service-fixture.mjs, scripts/generation-provider-fixture.mjs, scripts/verify-generation-preview-browser.cjs, scripts/tests/generation-fixture.test.mjs and supabase/tests/generation-service-fixture.sql. The existing world runner is preserved. A manually dispatched, exact branch/actor-scoped hosted job runs real PostgreSQL17/GoTrue/PostgREST, both actual billing migrations and their financial/concurrency assertions. Compiled Studio/Page cover journeys test anonymous/credit denial, accepted job checkpoint, same-key reload/replay, downloaded bytes, private Data API/RPC and foreign Page denial, cover save/reopen and desktop/mobile/reduced-motion captures. Only the disposable process receives an ephemeral fixture admin token. Deterministic supplier transport is redirected to loopback through a guarded server-only import hook; inherited provider/payment credentials are rejected before startup. Zero paid inference and zero production writes.

This is a baseline reproducer, not an acceptance pass. Source inspection found both clients using the default Next image optimizer for arbitrary validated provider URLs, while its allowlist omits xAI hosts. The baseline browser run must expose actual receipt-to-render failures before the client is repaired. The stale author fixture cannot stand in for this head. Each screenshot gets a rendered-fixture sidecar and source asset hash; fixtures do not establish image quality, demand or commercial release. Fresh source review now includes actual image configuration and complete billing SQL sources.
