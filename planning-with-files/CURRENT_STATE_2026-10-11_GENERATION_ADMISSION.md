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

## First hosted baseline and Luminor handoff repair

Exact baseline b78f764964820e3eb4fac104881c6b4559c49ae7 / workflow38116846514 passed Install, Lint, TypeScript and Build. Real PostgreSQL17 kernel/recovery assertions and concurrent finalization/duplicate checks passed in isolated containers. The authenticated generation job failed at browser startup without browser rows or screenshots: bare root resolution of @playwright/test returns MODULE_NOT_FOUND, while app-scoped createRequire resolves the installed dependency. The runner is corrected to use the accepted world verifier's app-scoped resolution and retain a controlled bootstrap failure phase. This failure does not yet reproduce a rendering failure or certify authenticated acceptance.

Independent Gemini3.1Pro review FAIL has32 verified exact-source bindings and agreed packet/final-text hashes: two high rendering findings, plus a critical Luminor direct-provider call lacking durable admission. Rendering stays pending until the actual compiled baseline runs. The Luminor tool now prepares a bounded, escaped image draft and local Imagine link for explicit creator submission, with truthful awaiting_creator status and no provider/billing imports or calls. Actual chat rendering builds the local link from the validated prompt, ignoring a forged returned href; native tests cover zero inference, prompt/ratio validation, escaping, link destination and no completed-image claim. This restores a useful review handoff, not autonomous agent image generation. Aspect ratio is suggested for the creator to select in Imagine.

Accepted main302cca0cbccbece0773174536b577ea442aa20de was merged remotely into this branch as3a409d289ab82b93b06844f5d76900e6b3ac513b. The owned checkout fast-forwarded without overwriting the accepted reader/router work. The generation review base is now pinned to302cca0 to evaluate this slice separately from already integrated main. All current changes still need fresh hosted acceptance and exact-source review; production activation and broader product/branch/subscription/client goals remain open.

PR574 was merged from GitHub at06:18:40UTC, headb271159c, receiving main3b8120b. This lead did not promote or waive the unfinished acceptance. The owned lane now integrates receiving main, preserving accepted router sources byte-for-byte. Each conflicting receiving file matches the integrated pre-repair3a source exactly; the043 repair is preserved. The new review base is pinned to3b8120b. A follow-up PR is required for the repairs; the lease gate disallows renaming this active checkout, so retain the existing owned branch without a bypass. Hosted043 source review/TypeScript/Lint pass so far; compiled rendering remains pending. A source PASS does not resolve the earlier concrete image-render findings without runtime evidence.

Receiving main advanced to0661416b66c2674eb63a84a9597ca1163eb2d378 through merged provider-account repair576. The owned lane integrates its20 files without changing their source; only the additive CI handoff test is composed with received CI. The next source review binds base0661416 and explicitly includes the actual AuthProvider, scoped provider preferences and chat tool-result consumer. Review043 PASS has34 verified source bindings and complete packet/final-text hashes; it cannot certify either integrated head or authenticated rendering. Its full Build has now passed, and the actual disposable generation browser job is running.

Hosted043 baseline completed with seven failed rows: Studio password-login, Page owner-open and second-account isolation failed; zero supplier submissions/polls occurred. Six masked screenshots and companion sidecars are retained. The desktop capture shows Failed to fetch on sign-in. Actual next.config.js connect-src excludes HTTP loopback; the accepted world verifier explicitly sets bypassCSP for its disposable HTTP Auth rail. Generation now uses that same fixture-only browser option and discloses the exception in both receipts. Production CSP source is unchanged and is not certified. This is a fixture auth-boundary failure, not an earned image-render reproducer or production login incident. The runner also gains credential-free phase/elapsed/source heartbeats for the next hosted run, with timer cleanup. Continue the actual compiled baseline before applying the three pending rendering changes.

The first two browser baselines were blocked by fixture startup/auth boundaries, so the suspected rendering fault was reproduced independently with the installed Next16.3.8 getImgProps and ImageOptimizerCache.validateParams. The actual images configuration was extracted as its plain literal via TypeScript; the intl wrapper was not executed because the local SWC binding is unavailable. In production mode, https://generation-fixture.invalid/fixture-1.webp becomes /_next/image?... and the actual optimizer rejects it with the exact error "url" parameter is not allowed. With unoptimized it retains the original URL and has no optimizer srcSet. This is a native renderer/allowlist proof, not authenticated or paid inference acceptance.

Studio's generated output/thumbnail and the Page cover now use unoptimized. Static showcase assets retain their existing behavior; no hostname wildcard or production CSP relaxation is introduced. Studio checks download HTTP status/MIME, keeps PNG/JPEG/WEBP filenames consistent with the returned format, and reports download refusal in the existing error surface. Mobile image actions are visible without hover; desktop actions reveal on hover or keyboard focus, with reduced-motion transitions disabled. The browser verifier now checks the fixture WEBP filename as well as exact bytes. Actual authenticated rendering, download, save/reopen and account isolation still require the fresh integrated hosted run. The native renderer proof replaces the blocked baseline as the reproduction evidence before these repairs; no browser acceptance pass is implied.

## Media policy and export follow-up

Exact integrated source0b23979be9696e15622f0bc73ab710a1ec4c51bd failed manual
run38119259475. Install, TypeScript and Lint passed. Build compiled but its inherited
voice/account browser test could not find Chat provider at line726 because the
synthetic guest session cannot authorize server-protected /settings/providers.
Generation acceptance was skipped. Normal draft CI omits those browser suites and
is not full release approval. Another owner's draft578 fixes the guest precondition
and SDK account callbacks; its e2674c90 manual run still fails the later Auto picker.
That source is preserved and has not been merged into this lane.

The Gemini3.1Pro review FAIL at0b is bound to30 Git source hashes, packet and final
text hashes. Its high finding is real: the actual production img-src omitted
imgen.x.ai, xAI's documented ephemeral output host. connect-src also omitted it,
blocking CDN downloads regardless of vendor CORS. The narrow production header
change permits only that exact HTTPS host in those two directives. No wildcard
host, general server fetch proxy or unrelated provider source is admitted.

Studio's shared downloader now decodes PNG/JPEG/WEBP base64 locally without fetch;
CDN download omits cookies/referrers, refuses redirects and bounds streamed output
to8MiB and20s. Invalid status/format/empty/oversized output fails. A visible Open
original image HTTPS link offers a manual browser save when CORS refuses a direct
export; neither server fetching nor public storage is silently introduced. Mobile
controls wrap below the prompt. Native inline/CDN tests and changed app lint pass.

The hosted verifier adds a separate bypassCSP:false browser case against the real
server headers: intercepted imgen fixture bytes must load and fetch, while an
unrelated host remains blocked. Authenticated HTTP loopback journeys retain their
explicit CSP exception. They also simulate CORS refusal and check the original-link
fallback without another supplier submission. A separate real GoTrue A/B/A journey
saves/reopens distinct browser-local provider settings. This is real server-auth
admission, not actual supplier-key verification, cloud credential synchronization
or same-turn stale-save acceptance. Nine rows require a fresh exact-head pass.

The generation job builds its own fixture app. Its dependencies now require install,
lint and TypeScript, allowing its evidence collection even when unrelated gallery
acceptance fails. CI Status continues requiring both Build and authenticated
Generation success; no release gate was removed or weakened.

The official xAI output-storage documentation was reread11 October2026. Default
imgen URLs are ephemeral. Saving a Page URL does not provide durable media storage.
Private retained assets, verified quotas, customer export, cancellation recovery,
production schema/provider availability and offer economics still gate paid beta.
All current screenshots are deterministic existing-asset fixtures with companion
provenance; no real paid image has been generated. The broad estate goal stays active.

## Receipt durability after first rendered desktop run

Full hosted38120773036 at363ce5781bd fails Build's unchanged inherited guest settings
assertion and generation acceptance. Install/Types/Lint pass. Gemini3.1Pro source
PASS has32 verified exact Git source hashes, packet and final-response agreement,
zero blocking findings. Raw response-final approvalEarned:false is deliberately
written before verdict validation; validated receipt/review remains static evidence.
Actual financial SQL/recovery/concurrency assertions pass. The generation artifact
contains a desktop Studio failure capture showing the real image rendered and a
cover capture after save/reopen assertions, but no final browser-evidence.json.
This incomplete result is not a nine-case browser PASS.

The verifier previously targeted the underlying img for hover even though the
transparent action overlay covers it. It now targets the visible container, whose
descendants receive ordinary pointer interaction. Every pre-click waiter has a
rejection handler so a failed click cannot terminate the child through a second
unhandled promise. Image fulfillment ignores only races while its owned context
is explicitly closing; unexpected failures remain blocking. These are bounded
fixture repairs; the app source remains byte-identical to reviewed363ce5781bd.

Each completed/failed row now writes a serialized atomic browser receipt immediately.
Unexpected async failures retain only an allowlisted error kind and script line,
never exception text, credentials or URLs. They force the receipt and final gate to
fail even if every ordinary row passed. Final receipt is saved before browser
cleanup; parent receipt preserves supplier counters on every exit. Native tests
execute these actual helper bodies, checking incomplete rows, blocking sanitized
async errors and strict open-context versus closing-context fulfillment. Fresh
exact-head review and hosted execution remain required. The missing-receipt cause
has not been fully isolated; retained diagnostics must resolve it before release.

Two363 rendered capture companions were verified and logged in the existing global
visual ledger, zero paid inference and failed overall acceptance. The neutral2px
blockquote border in doc-editor remains under its earlier narrow false-positive
exception; no additional design suppression or unrelated editor change was added.

## Nine retained browser rows and mobile correction

Hosted run38121817359 at345b7a3ff629fba252868511ef414e613c5312e8
fails full acceptance. The receipt retains all nine rows and no async failures.
Production-header media CSP and desktop/mobile/reduced-motion Page cover save/reopen
pass, four of nine rows. Desktop Studio fails its CORS-refusal assertion; mobile
and reduced-motion Studio fail initial submission; real-auth settings fails at
account B login; the second-account denial case remains unresolved. Financial
SQL, recovery and concurrency pass. Supplier counters retain four fixture
submissions and five polls; no paid inference or production write occurred.
Gemini3.1Pro static PASS binds32 exact Git source hashes, packet and final text.
Six failed/successful render captures have verified companion hashes and existing
global visual-ledger entries. Earlier failures remain preserved.

The 375px capture reproduces a real toolbar overflow: Forge is outside the viewport.
The options now wrap and Forge gets its own mobile row, minimum44px touch size,
with bottom clearance. Count controls have accessible names. The displayed credit
quote comes from costFor(image.standard,count), matching current managed admission.
The browser gate now requires the actual Forge control in viewport and its
10-credit quote before submitting. Rendered confirmation remains pending.

Installed Playwright automatically inserts allow-origin when a route fulfills
without that header. The refused-export mock now explicitly supplies a different
origin; download refusal and manual export must still pass without a new job.
Real-auth A/B/A settings switches now use the actual Sign Out UI before another
login, preserving the server redirect for already authenticated users. These
fixture preconditions do not establish live provider verification. The B token
request includes exactly email/password. Each isolation boundary has a distinct
phase and failures retain only allowlisted kind, source line, numeric/boolean
expected and actual, never raw error bodies or credentials. Its actual failing
boundary remains unknown until the next hosted receipt.

Native fixture7/7, changed app/script lint, syntax and whitespace pass locally.
Local review-lite admission HOLD reports1858MB free versus6144MB required and
27 task runtimes; no heavy local worker or additional agent was started. Fresh
exact-revision independent review and nine-case hosted acceptance remain required.
Build retains its inherited guest-settings failure until the receiving owner
lands or explicitly admits integration of PR578. That draft at3a22e0aea375eb6c2f79410fc023d4b3f789e676
has full hosted run38120918429 PASS, but its final independent review remains open.
Do not waive Build or treat skipped draft checks as authenticated acceptance.

## Explicit PR578 receiving integration

The isolated generation receiving lane admits exact donor PR578 at3a22e0aea375eb6c2f79410fc023d4b3f789e676 for combined verification. The donor checkout, branch and owner remain untouched. Four full donor files are byte-identical; only its two-line CI test addition is composed with the receiving generation job. Donor final independent review remains open, so this is integration for review, not approval or merge. The combined hosted packet includes every full changed source and use-provider context, retaining all prior billing, Studio, CSP and actual Auth checks. Required Build and generation gates stay enforced.

Exact SHA256 donor bindings:

- `apps/web/hooks/use-conversation.ts`: `f9e612fe88a3b2132768f6972a927d2234133c108149836f02cc7732a9297178`
- `scripts/tests/provider-chat-instance.test.cjs`: `444fb461a926f93642581f348617ef64f00ac99a706615f8d89a048c427a6a3e`
- `scripts/verify-voice-credentials-browser.cjs`: `8870dd018b2f4508303b4ca08f889f117ae7932f98b50add566b301a591e8341`
- `planning-with-files/CURRENT_STATE_2026-10-11_PROVIDER_ACCOUNT.md`: `59a257a56b2a0f3485e77293ce0a9ee23c3e869b0f0c37ccfcb865e35d7f1cd9`

## Combined hosted result and reproduced generation account race

Full38123399814 ated3c808a03555b7d445955b84b0c6ad6bbe3e6f7 FAIL: Build,
Install/Types/Lint and exact37-source Gemini3.1Pro static review PASS. The final
text hash matches receipt/manifest bindings. Nine browser rows/zero async failures
are retained: CSP, all3 cover modes, mobile Studio recovery/replay/download/CORS
refusal and actual GoTrue A/B/A settings save/reopen PASS, six of nine. Desktop
and reduced-motion Studio fail input refill after reload; the capture shows the
Studio still open. Their raw exceptions remain private; cause is not established.
The verifier now uses an explicitly named accessible Image prompt control rather
than presentation placeholder text. The B denial reaches available-balance
exhaustion: direct service-role PATCH fails because bypass-RLS does not grant table
write privilege. No new table permission is granted; exhaustion uses the existing
privileged billing_reserve_credits RPC with synthetic1000 credits and asserts
actual zero balance. The succeeding API denial must still make no supplier call.
Six render companions retain fixture provenance; no paid or production work.

Lead reproduction overrides the static PASS as release evidence: the actual
requestImages helper with mocked cookie actors reproduces an A completion clearing
B's pending session key for identical inputs, followed by a fresh B retry key.
The private reproducer uses zero network requests; no customer incident is claimed.
The helper now requires a synchronous current authenticated scope/token, checks
it before/after digest, before network and after receipt parsing, and keys retry
storage by actor. Old epochs, including A-B-A, cannot clear keys or return results.
All five browser generation clients provide the existing Auth epoch; async result
updates reject stale tokens. Standalone image/Imagine state remounts on an account
epoch change. Controlled Studio/Page editor data hold behind an account-change
message while preserving the old local draft; current-account reload is required.
Initial loading waits without consuming a prompt handoff. This does not establish
a complete cross-client private-draft recovery/export journey.

Legacy pending keys are copied into an actor slot without deleting unassigned
records or changing the server's actor-bound operation identity. A per-actor
adoption marker prevents a completed legacy operation replaying forever; future
confirmed requests receive a fresh key. Native regressions prove stale completion
cannot delete B's key, B retries reuse it, unavailable/null authority cannot submit,
legacy recovery is preserved and confirmed legacy adoption permits a new operation.
Request tests10/10, Luminor handoff3/3, fixture7/7 and SDK1/1 pass. Changed app lint
passes without new warnings after render ownership uses conditional state rather
than ref access. Fresh hosted types/build/browser and independent review remain
required. No production merge, schema/provider/payment or account mutation.
