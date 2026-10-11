# Account-bound provider credentials

Scope: bind browser provider, model, search and audio credentials to the resolved
account; fence stale authentication results and pending requests after a switch.
Owner: Codex thread `01a1269f-23eb-7bb2-b609-77d731cacc50`, sole writer in
`arcanea-provider-account-20261011`, branch `agent/codex/provider-account-20261011`.
Base: `fdd0867769842d16ced46c8c095bbe6ca755e072`.
Issue: existing [276](https://github.com/frankxai/arcanea-ai-app/issues/276).

Files: provider-preferences and its regressions; use-provider/use-conversation;
Auth context; provider settings; voice credential helper/tests; chat input and
message voice consumers; author AI panel; voice room/browser voice/settings;
voice demos and companion chat route; the existing root preference tests, voice
browser verifier and CI native-test command; this pickup.
Non-goals: production secrets, database migrations, paid provider requests,
publication, unrelated visual redesign, or promotion of held reader/chat/entry PRs.

Creator job: use personal provider keys in one account without another account
on the same browser inheriting them. The alternative is manually removing every
browser-wide key between users. This repair preserves each account's configuration
and keeps older unattributed keys untouched, requiring users to re-enter them.

Acceptance criteria: pending identity reads no credentials; guest, account A and
account B remain separate; legacy provider/author/voice keys are not silently
adopted; stale settings cannot save after an account switch; auth initialization
cannot overwrite a newer event; interrupted chat/audio requests stop and late
results cannot affect the next actor. Browser storage remains browser-local and
is not an encrypted vault or protection against same-origin malicious script.

Verification: reproduce legacy/account leakage before correction, run native
storage/voice regressions, changed-scope lint/format/type checks, hosted full
build/types/lint and an exact-revision independent review. Browser actor-switch
checks and authenticated production acceptance remain pending until observed.
Runtime: checked-in Node 24 and pnpm 11.28.4, explicitly selected by Frank.
Rollback: reviewed revert of this slice; preserve account and legacy data. Disable
the affected request flow while repairing rather than restoring shared-key reads.

Machine admission: interactive BOUNDED, one workload, no additional agents;
9,392 MB available RAM. Binding fallback storage check at 05:12:07 UTC on
11 October returned 92.21 GiB / 9.69%, admitted for one sparse worktree under
the storage contract. Historical Quick sensor is stale and was not reused as
fresh admission. No dependency install or new service was started.

Instruction sources: AGENTS.md `36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`;
SYSTEM.md `956bffb790243c7a18e3ace32cac6bf2ffbd44d0b0debff148ae098f0d7f4a4a`;
SCHEMA.md `1ad2c1e05b9dbffc9c260614c247f8c02f10f6b084ede0aa31beb0c5b31208c9`;
SKILLS.md `adf329ceddca1e5488411b7fd84c5ff39e76f491bc96099a02891ccd1e8fa919`.
Route guard/check passed and the same owned claim was refreshed for twenty
explicit files after the full Git source scan found additional consumers.
Supported ownership claim
`ops-e9fe428396c3413bf4e6` was acquired. Other held candidates and foreign leases
remain intact; the overlap with this thread's held use-conversation candidate is
intentional source integration and does not promote that candidate.

## Local verification

The initial legacy-read and unresolved-identity regressions failed on the accepted
helper before correction. The three other first-run failures were expected API
signature differences, not additional independently reproduced incidents.
After correction, eight credential storage/room regressions and twenty-four voice
route/privacy/recovery cases pass under Node 24.16.0, with synthetic keys and
intercepted provider transport. The native command uses Node's `--test-force-exit`
because the inherited rate limiter keeps an interval alive; the first non-forced
run was stopped through its own tool session and is not an exit-zero receipt.
No real user account, provider media, paid credit or production write was used.

The existing nine root preference/model-copy tests also pass with a private
dependency-resolution adapter pointing at the already installed TypeScript.
The first adapter returned an incomplete module export and failed three copy
checks; its explicit CommonJS adapter corrected that local harness error. The
repository's dependency contract was not changed to accommodate the harness.

An actual-source AuthProvider handler harness reproduces the stale initial lookup
on the accepted base, then passes seven assertions on this source: delayed lookup
retains a newer event, sign-out revokes reads before network completion, and an
older sign-out completion cannot erase a newer sign-in. This uses synthetic React
hook/session adapters, not a React browser mount or real GoTrue authentication.

Changed-scope ESLint passed using the same existing configuration and installed
dependency checkout. No dependencies or lockfile changed. A browser-qa admission
returned BOUNDED but measured CPU 80%, above its 75% ceiling; no new local browser
worker/server was launched. Full fresh hosted types/build/lint, rendered behavior,
complete independent review and production acceptance remain open.

Auth events update the credential token synchronously, before React renders. A
session lookup captured before a newer event cannot replace that event's actor.
Account transitions invalidate earlier tokens even when the same account signs in
again. Provider settings remount on that transition and check the token again at
save. Chat SDK instances and audio/author consumers cancel or remount, and request
callbacks reject stale tokens. These mechanisms require hosted actor-switch and
late-response checks; passing storage tests alone does not prove every UI path.

Source guidance inspected: [Supabase auth events](https://supabase.com/docs/reference/javascript/auth-onauthstatechange)
and [React external stores](https://react.dev/reference/react/useSyncExternalStore).
The installed AI SDK useChat source recreates its Chat instance when the id changes
and prevents an earlier instance's subscription from updating the new snapshot.
This source inspection does not establish live provider cancellation or refunds.

## Hosted recovery

Draft [576](https://github.com/frankxai/arcanea-ai-app/pull/576) first published
`ac8f964714f90a8037ccc5c618c6374aace4d56b`. Hosted Lint passed, including the
native cases, while TypeScript failed on two implicit callback parameter types
from the existing mock/Supabase client union. The callback now names
AuthChangeEvent and Session explicitly. Fresh hosted verification is required;
the earlier failure remains part of the evidence.

Review-lite admission later returned HOLD with 4,528 MB available and 6,144 MB
required. No provider review was called. The unsubmitted core review packet's
strict scan flagged three source-manifest SHA256 values next to paths containing
`credential`; the redacted records identify manifest values, not customer keys.
The adapter now labels digest and path separately and the unsubmitted core packet
passes the strict scan, while keeping
the full payload scan and immutable source/hash validation enabled. No blocked
packet is sent, no paid budget is assumed, and no complete review is claimed.

Request-state refinement also clears branch transcripts and private transient
conversation state on actor transition. The inherited URL-prompt handler waits
for a valid actor before consuming its initial prompt, preventing a pending-auth
denial from losing that prompt. Its existing automatic-send behavior remains an
inherited acceptance gap; the held entry567 candidate handles deliberate staged
entry, URL privacy and account-bound history and still needs separate promotion.

## Compiled account-boundary verification

At source `1cc0cd056045ca856634cc63b4f1e378c089033e`, hosted TypeScript and Lint
pass in PR run38115743305 and manual run38115808934. The full compiled-browser
run is still in progress. Vercel's status check reports success; exact deployment
source binding and rendered account acceptance are separate checks.

The admitted credentials-core source review returned zero reported cost but
`finish_reason: length` after 6,000 completion tokens. It supplies no valid
verdict. Its response and receipt are preserved privately. A later review-lite
probe returned HOLD at 5,215 MB available / 6,144 MB required; no further review
call was made under that refusal.

The existing compiled voice verifier now also exercises provider settings and
chat with guest/A/B identity changes through the real installed Supabase
BroadcastChannel subscriber. Synthetic sessions, local fixture keys and denied
intercepted chat responses cover a same-turn stale settings submission, unchanged
actor refresh, returning to saved keys, unused legacy keys, model/key selection,
and a pending chat abort on account switch. Three existing desktop/mobile/reduced
motion modes will run these assertions. This verifier is newly authored and
requires hosted execution before any pass claim. It is neither a real GoTrue login
nor a database ownership, cross-device persistence or provider-quality test.

The first expanded hosted run38116393712 at84147abc passes TypeScript/lint and
compiles the app, but fails its new settings fixture because it asks for the Google
field while the selected guest provider is OpenRouter. The verifier now selects
the provider before checking its field and expects only the selected account's
field to exist. After saving clears the old model choice, it chooses Flash through
the actual chat picker. This is a test correction; fresh hosted execution remains
required and the failing run is retained.

## SDK callback isolation

Inspection of the installed AI SDK found that id-based recreation changes the
Chat instance but forwards earlier instance callbacks through the hook's latest
options ref. A native reproduction with actual SDK Chat/hook source and the
application's callback delivers a pending A error to B after render but before
passive cleanup. The hook now gives each actor revision an explicit memoized Chat
instance, keeping transport and callbacks bound to that actor. The native CI
regression executes that application configuration against the installed SDK;
React scheduling and transport remain synthetic. It verifies same-actor instance
retention, old-actor error denial and current-actor error visibility. Hosted full
verification and independent review must cover this new source.

Run38117065473 at4c9910b3 again passes types/lint and compiles, but settings
assertions time out because server middleware redirects this unauthenticated
offline fixture to login. The retained earlier aria snapshot confirms the same
gate; selecting a provider alone did not resolve the first failure. The compiled
verifier now preserves and checks that server denial, then exercises public chat
guest/A/B credentials, picker persistence, same-actor refresh and pending abort.
Authenticated settings UI, including same-turn stale save, remains an explicit
release requirement. The existing author fixture is source-bound to another
isolated preview; its account configuration cannot be silently repurposed. A
secure configuration-location question is pending while independent work proceeds.

## Promotion and follow-up

Frank merged PR576 at `0661416b66c2674eb63a84a9597ca1163eb2d378` while the
later SDK fix `ec63769aaee38df41a0e06ef5223b68da56cf289` was still outside that
PR's accepted head. Production deployment `dpl_DrRY9DDU4YHQDQoB34E9XYRFbqZA`
reports READY for the merge source; canonical HTTP and authenticated settings
acceptance have not been established. The SDK regression also reproduces on
that exact merged source: a late A error invokes B's callback before passive
cleanup. The explicit-instance fix passes the same regression. This is actual
installed SDK/application source with synthetic React scheduling and transport.

The follow-up integrates accepted main into the existing owned feature branch,
preserving incoming generation574 and routing changes. Only the conversation
hook, SDK regression, existing native CI step, browser verifier and this pickup
are intended to differ from accepted main. Native ownership/security checks
remain enabled. The newer branch-name claim was refused because the active
claim belongs to the existing branch; that branch and claim are retained.

Hosted run [38118469758](https://github.com/frankxai/arcanea-ai-app/actions/runs/38118469758)
at ec63769 passes TypeScript, Lint and app compilation, then fails the account
fixture because it targets the unused CompactModelPicker. The verifier now uses
AgentHeader's rendered buttons and distinct initial account models to await the
actual account state. Failed account runs retain an aria snapshot. Fresh hosted
execution is required. The authenticated settings fixture failures on 84147 and
4c991 remain recorded; public chat does not prove protected settings saves.

Independent review at 4c991: the eleven-source core review returned WARN with
nine findings requiring lead reconciliation; the chat review returned malformed
JSON and supplies no valid verdict. Earlier Lightning review truncated. These
are partial attempts, not release approval. Fresh review-lite admission at
06:40 UTC returned HOLD, 4,348 MB available / 6,144 MB required; no further
reviewer, browser or additional agent was started. Complete exact-revision
review and authorized two-account settings verification remain release gates.

Follow-up source cdfd16e3 passes TypeScript, Lint and compilation in run38119301242,
then fails its exact send-count assertion: the fixture also counted chat's GET
readiness probe as an inference request. GET now receives a separate unconfigured
fixture response; only POST enters the request count and pending-request gate.
The exact A/B/guest send-count and account-key assertions remain required.

Before that fixture refinement, the complete five-file follow-up and sixteen
context files at cdfd16e3 received an independent static PASS with no findings
from nvidia/nemotron-3-ultra-550b-a55b:free. Source/head/base/manifest and all
twenty-one file hashes were validated; reported total127109 tokens and cost0.
The earlier core WARN's nine findings were separately reconciled against eleven
unchanged source hashes. Its WARN remains recorded. Review-lite was freshly
BOUNDED at 06:52 UTC, 10,307 MB available / 6,144 required, before the single
coherent review workload. The changed verifier still requires fresh exact-source
review and hosted execution; real authenticated settings remain unverified.

E267's complete twenty-one-source static review also returned PASS with no findings
and cost0. Its full run38119990806 passed types, lint and compilation, reached
the final guest-model check after account key/model/abort assertions, then failed
because the broad Auto text locator also matched the focus-mode Auto control.
The locator now requires the model label span, preserving both controls and the
exact assertions. Fresh compiled execution and source-bound review are required.

A read-only public control probe reproduced the old Auto locator's two matches
and the corrected locator's single model match on desktop1440 and mobile375.
It executes each actual verifier locator, checks Flash selection and preserves
focus Auto. AgentHeader's source hash equals the mapped production0661416 source.
No account/provider request or outbound mutation occurred; the browser closed.
This proves locator fidelity only, not the SDK follow-up or authenticated settings.
Fresh browser-qa admission at07:14 was BOUNDED, 9,988 MB free /8,192 required,
CPU35 percent. No localhost server, dependency install or additional agent was used.

## Isolated protected settings acceptance

Source 3a22e0ae passes full hosted run38120918429, including compiled public-chat
account assertions in desktop, mobile and reduced motion. Its final full review
timed out and its partial Cohere response was malformed; final independent
approval remains open. Hub255 and programme276 retain the exact results.

The next acceptance job reuses the existing disposable PostgreSQL/GoTrue/PostgREST
projection pattern instead of repurposing the restricted author preview. It
creates two temporary accounts, uses the actual login UI and unchanged server
middleware, and checks account-specific provider saves/reloads, cross-tab conflict
denial, interrupted storage recovery and a stale form submission immediately after
the actual cross-tab auth subscriber runs. The timing hook does not synthesize a
session; the other tab signs in through GoTrue. Fixture cookie clearing prepares
the account switch and does not certify the product sign-out UI.

Scope: Finish isolated two-account protected-settings acceptance for this repair.
Owner: codex-provider-account-20261011.
Files: scripts/run-provider-account-fixture.mjs,
scripts/verify-provider-settings-browser.cjs, .github/workflows/ci.yml and this
existing pickup; prior SDK fix paths remain in the same candidate.
Non-goals: Hosted Supabase/project changes, production data or migrations,
author fixture scope, live provider calls, pricing, canon or permissions.
Acceptance criteria: Exact-source compiled settings pass with nine real isolated
password logins across three modes, both actors' independent save/reload/return,
cross-tab and same-turn stale-save denial, storage failure/retry and zero AI POSTs.
Verification: Native syntax/format and hosted provider-account-preview; retain
safe source/image hashes and masked screenshots. Fresh exact-source independent
review is still required. Production/provider/customer evidence remains separate.
Rollback: Revert only this fixture/job wiring; preserve the account and SDK fixes.

The runner is restricted to this owned hosted branch, exact GITHUB_SHA and Frank's
actor. It refuses inherited Supabase/provider credentials, binds services to
loopback, creates random ephemeral tokens and removes its own containers/network
and private configuration. No local containers, build or browser started under
the latest review-lite RAM HOLD (4,681 MB free /6,144 required). Ordinary source
editing and small checks remain permitted. The new fixture is implemented but
has not yet earned hosted or independent acceptance.
