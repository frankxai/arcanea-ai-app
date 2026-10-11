# Project document recovery

Status: draft PR585; real hosted SQL and source gates pass. Mobile authenticated recovery passes at fb14788f; desktop/reduced-motion login test ambiguity is corrected locally. Back/Forward acceptance is newly added and unproven. No release or production document migration.

Scope: retain a creator's project document and its history through conflicting edits,
failed history writes, lost acknowledgements and account changes.
Owner: Codex task 01a123df-58c6-72f3-b86c-65083426cf65.
Issue: https://github.com/frankxai/arcanea-ai-app/issues/276.
Origin: https://github.com/frankxai/arcanea-ai-app.git.
Branch: agent/codex/project-document-recovery-20261011.
Worktree: the existing arcanea-foundation-20261010 checkout. Its previous clean
creation-foundation branch and commits are preserved.
Base: e07d56866397e6eacc1093cc79505c173a681da8.

## Reproduced problem

The actual PATCH handler returned 200/success after a controlled history-insert
failure and wrote content without binding the requested parent. The existing owner
RLS does not prove foreign exposure; this reproducer made no live writes.
Three initial route regressions failed against accepted source, then passed after
the correction. A separate inherited test thenable let the test process exit before
its final DELETE assertion; the corrected test now actually completes all six cases.

## Current implementation

- PATCH admits a bounded streamed operation with an expected actor, expected revision
  and stable UUID. Account changes are rejected before the RPC. Unknown fields,
  oversized bodies and unsupported values are rejected.
- The proposed save_project_document RPC locks the exact owner/project/document,
  compares its revision, and writes content, metadata and history in one transaction.
  A history failure rolls back the entire edit. Retries compare the original operation,
  revision and JSONB patch before returning the original acknowledgement.
- Existing version rows, including duplicate legacy numbers, are retained. Current
  save_revision initializes from the largest existing version. A pre-contract content
  snapshot is retained when a document had no history.
- A proposed creation trigger inserts the empty content atomically with the document.
  POST no longer acknowledges a separate failed content insert. Direct authenticated
  content/history mutation and metadata UPDATE are revoked by the new migration;
  the narrow owner-bound RPC supplies edits.
- The client writer retains an uncertain operation, protects it from caller mutation,
  verifies scope/operation/revision receipts, and resolves it before admitting a newer edit.

Supabase CLI v2.120.0 generated migration20261011131128_project_doc_revisions.sql.
The task-local binary was checked against the official release SHA-256 list; no
system installation, database credential retrieval or CLI database call occurred.

## Verification and release limits

Actual small native checks pass: nineteen save/receipt/recovery cases and all six
existing docs API contracts. Three new reload/account recovery cases failed before
the client correction and passed afterward. Selected real-source/import TypeScript
compilation has zero diagnostics, with the actual installed node/three type roots.
This is not a full workspace typecheck. Changed-source ESLint, formatter and
whitespace checks pass without new warning suppressions.
These checks use controlled database responses; they do not establish SQL rollback,
real authentication, browser behavior or customer usefulness.

The authored disposable PostgreSQL test includes actual two-connection CAS races,
legacy-history retention, owner/parent/anonymous denial, direct-write denial,
operation replay, atomic creation and forced history-error rollback. It refuses any
database with an existing auth schema before DDL. CI wiring exists locally; this
test has not run.

The editor now sends the revision/actor/operation contract through the existing
createDraftSession single writer. Every edit immediately updates an account/project/
document-scoped recovery copy. Its uncertain operation survives reload and is replayed
before a newer edit. Scoped GET and save receipts are verified; account-epoch changes
reject late results. Storage failure stays visible while the editable draft can still
save or download. Invalid/future/foreign recovery envelopes are not admitted; an
unreadable original copy is protected from writes/removal and has an explicit raw
download. The editor offers retry, full structured draft export and a confirmed reopen
of the saved version. It guards page unload and link navigation with dirty drafts,
checks deletion acknowledgement and uses token-based, 44px recovery controls.

These are locally implemented behaviors, not rendered or live acceptance. Do not
merge, apply this SQL to production, or claim complete project-document recovery
until real SQL, authenticated browser, full workspace and independent review gates pass.

Acceptance: native and actual SQL tests; authenticated compiled desktop/mobile and
reduced-motion save/reopen/export and account-switch cases; interruption recovery;
exact-revision independent source review; build/types/lint/security; protected merge;
source-bound production verification. Compare actual usable output and repair effort
against an existing editor workflow before a paid workspace claim.

Next action: obtain real hosted SQL and full workspace checks on the draft PR,
then exact-source independent review and authenticated compiled browser acceptance.
Test actual reload, held acknowledgement, storage failure, unreadable backup export,
conflict download/reopen, metadata concurrency, account switch and mobile focus.
Browser back/forward and the rich editor image-upload ownership path still need
explicit investigation; link/unload guards do not prove those behaviors.

## Design preparation

Emil design engineering, TASTE.md and DESIGN.md were read for the existing surface.
The editor recovery controls have now been applied locally, with canonical CSS
variables verified against packages/design-system/src/tokens.css and its actual
globals.css import. Rendered acceptance remains open. Root DESIGN.md contains historical guidance
that conflicts with TASTE.md and Frank's current Higgsfield ban; the current ban and
root contract govern. No visual generation or new design suppression occurred.

| Existing behavior                    | Proposed behavior                                      | Why                                         |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------------- |
| Saved followed HTTP status alone     | Saved follows an owner/operation/revision receipt      | An unconfirmed edit must remain recoverable |
| Save failure lacked recovery actions | Retry, preserve conflicting draft, reopen and download | Let a creator recover without losing text   |
| Small controls                       | Token-based 44px controls with visible focus           | Keyboard and mobile recovery must work      |

Rollback: before release, preserve this branch and correct it. After a future release,
disable edits if the contract cannot be met; retain all history, content and recovery
copies. Do not restore the known false-success route or delete creator data.

Full estate, premium creator, subscription/storage/API/credits and connected client/
local/cloud harness goal remains ACTIVE. This checkpoint closes none of those gates.

## Hosted checkpoint at5398d9861495079c8d10d9e8ed5d104c3bb69786

Draft PR585 full CI38144386309 is terminal SUCCESS: Install, Lint, TypeScript,
Build and CI Status pass. PostgreSQL17 job114484729648 ran the proposed migration
and its fixture. Its retained log proves owner/parent isolation, direct write denial,
atomic forced-history rollback, stable replay, retained legacy history, atomic new
creation and a real two-connection race with one commit and one conflict.
Log SHA256f1d8025d7413dc2415c07d23259c60b6c6255622c5e59dee93b42ab75944d91f.
No document SQL or write occurred in production.

The next candidate narrowly admits the existing independent provider review on this
owned branch with accepted-base pin e07d568, complete changed source and relevant
context, unchanged30-file/900KB limits and the existing trusted manual workflow.
It is not a review PASS. Hosted gates and review must bind the resulting revision;
authenticated compiled browser/customer acceptance remains open.

## Fresh foundation and authenticated acceptance candidate

The earlier94f62b6f candidate completed manual CI38145112813 and normal PR
CI38145077073 successfully. Independent Gemini3.1 Pro review passed at that exact
commit; all27 source hashes match Git. That review does not approve the changes
below. Production catalog inspection found chat_projects and all three document
tables absent, so the original document-only repair could not run there.

The unreleased migration now creates the original canonical project/document table
shapes when absent, without installing unrelated graph tables or replacing shared
trigger helpers. A private trigger namespace supplies missing timestamp helpers.
The creation route and restrictive INSERT policy require an actual owned project;
the save RPC locks that project before the document. Existing content/history remain.
Fresh and original-first PostgreSQL variants are authored but not yet executed on
this candidate. No production document DDL or customer document writes occurred.

The foreign/unavailable-parent creation regression returned201 before correction,
then passed with404. A real installed-Supabase missing-session regression returned
500 in both routes before correction, then passed with401 and zero network requests.
Only the SDK's missing-session classification is accepted as a guest; other auth
errors still fail closed. Incoming streams have a ten-second deadline and metadata
bounds. All23 native recovery cases, six API contracts and three actual private
configuration ownership cases pass. Changed-source lint and syntax checks pass.

Editor load-generation invalidation protects explicit reopen from old callbacks.
Native Back saves before departure and preserves a failed draft in place. Ctrl/Meta+S
flushes the single writer. Recovery controls use a real form with explicit button
types so keyboard submission and the pre-cleanup auth race can be tested.

The new hosted runner reuses the accepted disposable GoTrue/PostgREST bootstrap,
applies this actual document migration and creates two fixture-only accounts. It
admits only this owned trusted manual branch and accepts no hosted credentials.
Desktop/mobile/reduced-motion browser cases exercise actual owner save/reopen,
rich-JSON export, lost acknowledgements, same-operation replay before newer edits,
two-tab conflict preservation, unreadable original export, storage failure/native
Back,44px targets/focus, and actual A/B/A auth with a connected stale React form and
held old-account response. It has not run yet. The manual CI status requires browser
acceptance and independent review to succeed; skipped jobs cannot earn acceptance.

Local build preflight is HOLD at7755/8192MB free/required and27 task runtimes. No
new local build, browser, container, server or agent was started. Sparse local
project helper files are read through immutable Git; hosted checkout remains the
full-workspace authority. Fresh source review, actual SQL/browser execution, image
upload ownership, customer usefulness, protected merge and production acceptance
remain open. Existing private-storage cost approval is unanswered. Full goal ACTIVE.

## Exact78a7017b results and workflow correction

Actual hosted Lint and TypeScript pass at78a7017b53ec8ebc4568c891f8a45d5fbf8cfaae.
The PostgreSQL step executes both fresh and original-first expanded migration
fixtures successfully, including actual two-connection races and atomic rollback.
Retained completed job114495502342 log SHA256
7955b2add9ca4206e53feb03cf2de3543c2f2549216b674cb5d90637f6afaaf8.
Independent Gemini3.1 Pro review passes; all35 complete-source hashes match Git.
These are source/database results, not authenticated browser or production proof.

The browser job is actually SKIPPED despite its four direct prerequisites passing:
default success() inherits skipped author/world ancestors from independent review.
The current correction explicitly uses always(), !cancelled() and all four direct
success results. CI Status already denies skipped browser acceptance. The failed
workflow attempt remains preserved; no skipped test is counted as acceptance.
Observe38148018167 until terminal before a fresh corrected dispatch.

Accepted main advanced to22aa23ba106d1b9affa0adcacbcfa73e99f6e59e through ownerPR586.
The merge is conflict-free and all six incoming narrative-evidence paths match that
main byte-for-byte. Root instructions are unchanged, no deeper guide governs those
paths, and the lease explicitly admits them for integration. The reviewer base now
pins that accepted main. Production metadata is READY atdpl_Fd46HhRg7bhiNR6YvsbG9CaqQ5YX
on22aa23b; no document/private source is deployed by this task. Current production
catalog still shows all four document/project tables absent. Fresh exact checks and
authenticated acceptance must bind the integrated follow-up before release.

## Actual integrated browser failure preserved

Integrated1e0e345b completes Install/Lint/TypeScript/Build and independent review
successfully; all35 reviewed sources match Git. Manual38148947748 is terminal
FAIL because the authenticated browser fixture fails. The corrected workflow now
executes that fixture; the failure is not a skip or a reason to weaken CI Status.

Mobile actual owner save/cloud reopen, same-operation lost-ack replay before a
newer edit, two-tab conflict/export/reopen and damaged original-backup preservation
pass. It then fails during the combined storage/navigation/focus checks. Desktop
and reduced-motion fail during login. Only one password-login acceptance completes;
zero page errors and zero supplier posts are recorded. The actual service applies
the migration and cleans up successfully, including its private configuration.
All14 service source hashes and both immediate image companions match Git/images.
Both mobile saved/conflict renders are inspected and registered as failed-fixture
evidence. The global marketing footer produces an unnecessarily long editor page;
that refinement remains open, without changing another owner's layout scope here.

The next fixture change records exact controlled login/substep, numeric auth
statuses, numeric/boolean assertions, safe control-presence/overflow metadata and
failure renders. It never logs passwords, tokens, provider text or full errors.
The focus case now uses Tab/Shift+Tab to exercise actual keyboard modality rather
than inheriting a prior download click's pointer focus. The assertion and all
zero-error/account/recovery gates remain. This is diagnostic/test refinement;
login or product navigation fixes are not claimed. Current failures still need
actual diagnosis, correction and fresh exact-review/hosted acceptance.

## Hosted browser diagnosis at fb14788f7b0dc498e72ee51cc66de9cf415252b0

Manual run38149986966 executed the actual compiled browser fixture. Mobile passes
all six recovery/isolation checks, three real password logins, zero page errors and
zero supplier posts. Desktop/reduced-motion fail before authentication at the
submit-password substep. The actual render and UserNav source show two exact
Sign In buttons (desktop navigation and password form); the fixture used an
unscoped strict button locator. The corrected fixture submits the one form owning
the Email input. No product login behavior, timeout, authentication, assertion or
account boundary is weakened or bypassed. The previous failure remains retained.

The current fixture also checks real document-list navigation, native Back, Forward
and return to the saved document, with exact cloud text retained. Existing native
Back protection alone did not certify Forward; this expanded case is unproven until
its actual hosted result. Source review for fb14788f is PASS from Gemini3.1Pro with
35 actual Git-byte hashes verified. Build completion is observed separately.

Fixture cleanup removed its private configuration with no failures. This is isolated
Auth/PostgreSQL acceptance, not production or customer usefulness. The full objective
remains active; the private-storage cost decision remains unanswered.

## Clean Forward regression and local correction

The actual popstate handler was executed in a Node VM with controlled browser
history. A clean Forward destination outside the document incorrectly stopped the
router and invoked history.back (actual1/1, expected0/0). This is actual source logic
with controlled history, not browser acceptance. A five-line correction allows the
router to handle a clean destination outside the document while retaining the
duplicate-sentinel Back skip and dirty-failure draft protection. Those three actual
handler cases pass locally; changed-page ESLint passes with no suppression.

Hosted run38150886810 remains live on9fcdc305 with the old handler and added real
Back/Forward case. Preserve that original runtime result before promoting the local
fix. The next fixture gives Back, Forward and return their own failure stages, with
the same URL and cloud-content assertions. Nothing is merged or applied to production.

Fresh branch metadata confirms ready PR562 and560 are BEHIND and explicitly held
for exact independent review and real creator/provider/private-storage acceptance.
Green structural checks alone do not clear those owners' release gates. The current
source, complete-source reviews, failed runtime attempts and records remain separate.

## Full current-source acceptance and receiving reader integration

Candidate219307c9 completed normal CI38151481354 and trusted manual38151783132
SUCCESS, including Build, TypeScript, Lint, CI Status and Gemini3.1Pro independent
PASS with35 verified Git source hashes. Actual three-mode authenticated document
acceptance passes seven checks per mode,9 real password logins,0 page errors and
0 supplier posts.14 service hashes and6 inspected renders match source, with private
configuration removed and cleanup failures0. The clean-Forward source correction
is included; the specific retained-guard RED was controlled history, while the prior
basic real navigation sequence also passed. Rejected earlier attempts remain retained.

Accepted main advanced to a00d10b6cfd11558af57c516d4b4545c88cab03f through owner
PR584's private source-linked reader scene. Its30 paths enter this integration.
Only the shared private-config test conflicts: the merged admission keeps the
accepted immutable source/ref controls, accepted provider/reading-scene runner
allowlist and legacy private env context while admitting the actual document runner.
Every other incoming path must remain byte-identical to accepted main. Root guide
hash is unchanged, no deeper instruction scope governs these incoming paths, and
the lane claim now names50 integration paths. No reader creation behavior is rewritten.

The reviewer base is pinned to accepted a00 so incoming accepted files are not
misclassified as this document change. Fresh integrated full CI, complete-source
review and actual document browser acceptance remain required before protected
merge or production. Production catalog still lacks all four project/doc tables;
no migration, customer write or financial provision occurred. Production guest HTTP
returns401 without credentials; this is not source-bound signed-in acceptance.

Global marketing footer and guest-header timing seen in some authenticated fixture
captures remain craft/account-clarity followups; no cause or production incident is
claimed. Image upload/private serving/export, paid usefulness and the full objective
remain open. Browser inventory has no connected browser; no local heavy worker starts
under PP HOLD. The existing private-store/live-test cost question remains unanswered.

## Receiving reader workflow admission correction

Integrated a40ecb89 passes normal CI38153050448, independent author source review
and actual authenticated document acceptance in manual38153091941. Build remains
live when this entry is written. The separate reader run38153050418 fails because
its workflow invokes the accepted disposable Auth runner from the document branch,
outside that runner's explicit reading-scene/provider-account/main admission.
This is a runner refusal, not a failed real login or scene recovery assertion.

Only that workflow step now mirrors the unchanged runner's repository, actor and
three admitted branches. Route, account, private-config, database/PostgREST and
compiled reading-browser checks still execute on other PRs. This does not expand
fixture access or certify authenticated reader behavior on an unadmitted branch.
The complete unchanged runner enters the next document independent-review packet
alongside the complete workflow delta. The previous failure remains retained.

The accepted reader workflow is now the sole deliberate change among its29 earlier
byte-preserved incoming paths. The other28 remain identical to accepted a00 main.
The shared fixture-test conflict resolution remains separately recorded. Fresh
exact-revision review, reader CI and document CI/runtime gates must pass before
landing. Production migrations, customer acceptance and money remain unchanged.

## Accepted reader release-record integration

Exact25c33401 passes trusted manual38153894420, ready PR CI38154542385,
CodeQL38154542312 and reader38153898138.37 actual Git-byte independent review
hashes and14 service hashes are verified. All three document modes pass seven
checks each, nine real password logins, zero page errors/supplier posts, six
inspected renders with companions and successful private-config cleanup.

Before protected merge, accepted main advanced to026a5a4ffddc67827ab0c94f0ea9368e00eb9b16
through owner587's one-file append to the existing reader release record.
That exact incoming file is preserved. No application, dependency, schema or
instruction source changed in that accepted main update. The reviewer base is
pinned to026; bounded30-file/900KB admission stays unchanged. Auto-merge is disabled
while this new combined revision awaits its own exact review and hosted gates.
No release gate is waived or retried due only to observation timeout.

Production still lacks the four project/document tables and both document
functions. Reviewed migration bytes remain6950d9d46b9d04cc93968f6257a16c4c05b87459b14c0657326713c65da0ab07,
unapplied. A separate rollback-only production role proof is prepared, not executed;
it creates no customer identity and cannot establish signed-in customer acceptance.
The full objective and private storage/billing/creator/client/harness gates stay open.

## Protected production release and project-footer refinement

PR585 merged normally on11 October16:45:46UTC as a4285de66ce00cbbaa66d7f5b6910f9b627be49f,
with identical Git tree to reviewed/tested a3b1a75a. Candidate manual38155685455,
normal38155688503, reader38155688536 and CodeQL38155688938 all pass; receiving
main CI38156811344 and CodeQL38156811343 also finish SUCCESS. Six current renders
and companions were inspected.37 independent Git-byte review hashes and14 service
hashes match the exact candidate. Nine real isolated password logins cover seven
cases per mode, not production customers.

Canonical production dpl_BVi9xsxMexTeajVHq5EAvCqJPCPw is READY at accepted a4285de6,
with www/apex/app aliases. Reviewed migration20261011131128, SHA256
6950d9d46b9d04cc93968f6257a16c4c05b87459b14c0657326713c65da0ab07, is applied.
The tool assigned20261011164806; only its unique owned source-hash/byte-guarded
history row was mapped to the canonical version, keeping every statement and
all other history intact. Actual PostgreSQL17.6 table RLS/grants, unique operation
index and all three function bodies match reviewed source. Seven rollback-only
role/null-subject denials pass with zero rows/accounts retained; three canonical
anonymous HTTP checks return401/private,no-store. Signed-in production/customer
save/reopen is still unverified. No finance/storage provision or identity change.

Scope: retain focus while editing and recovering a project document. Sole root
owner continues the existing document lane; footer ownership transferred narrowly
from its separate private-assets lane, preserving the other46 paths there and
all50 original document-lane paths. Main integration has no app/SQL source delta.
Only Footer, this record, review packet, fixture source bindings and browser
verification change. Source review base now pins accepted a4285de6; all required
source/release/admission/privacy gates remain enabled. No new local heavy job.

| Before                                                               | After                                                  | Why                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| Project editor has the full marketing newsletter and dozens of links | Compact Support, Privacy and Terms on /projects routes | Keep editing/recovery controls primary and support/legal links available |
| Same public footer everywhere                                        | Existing public marketing footer remains elsewhere     | Preserve discovery and newsletter behavior                               |

The new view uses existing tokens, consistent hooks and pathname selection, no
Auth-state flicker gate or animation. The actual hosted acceptance now checks
three live link destinations,44px targets, Tab/focus, bounded compact height and
public newsletter retention alongside all seven document recovery cases. Source
receipt additionally binds Footer and root layout. Separate nested workspace
layouts were considered; that larger route restructuring is unnecessary here.
New tests/renders and fresh independent review remain pending until run. Draft
promotion only after all same-head gates pass, inspect new actual renders, normal
protected merge and verify accepted source on production. Rollback is an owned
revert of the footer slice; preserve documents, backups and all database rows.
Editor image upload/private serving/export, oversized chrome on other private
surfaces, creator usefulness, storage/commercial, clients/harness and estate
landing remain open. The full objective stays ACTIVE.

## Current render triage and scrolled controls

The cd959975 footer candidate passed manual38158561597 and normal38158559678
with exact35 review and16 service Git-byte source bindings. Three modes passed
eight cases each, nine actual isolated password logins, zero page errors or
supplier posts, zero production writes and successful private-config cleanup.
All nine PNGs were actually inspected, companions hash-verified and registered
in the existing rolling generation ledger as browser captures, generated:false.
Footer scope passed, with61px height in each mode and visible focus. Full-surface
visual acceptance remains false: the desktop saved captures show a sticky
controls/global-nav collision; full-page public captures contain large blank
offscreen sections and do not establish public animation/visibility acceptance.
No hook rule or file is suppressed. The existing DocEditor neutral quote border
is intentional typography; that older finding is not a footer regression.

Accepted main advanced through owner589 to a561c3e2c34eb0898339e53377b11f47eadf956c.
Its separate five book-review consumer files are integrated and preserved exactly.
No incoming app, Auth, SQL, dependency or instruction source changed. Review
base pins a561; earlier cd results are retained and cannot approve the next head.

| Before                                                           | After                                    | Why                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| Sticky document controls and fixed global nav both use top:0     | Controls use the existing --nav-h offset | Keep persistent controls available without covering their pointer targets |
| Full-page public capture scales footer text too small to inspect | Capture the actual public footer element | Review newsletter and link layout at its real size                        |

An ordinary non-sticky header would avoid the collision, but loses persistent
controls in longer drafts. Retaining sticky controls below the existing nav
token preserves the accepted editor workflow without changing the global nav,
its other routes or the root layout. The actual browser regression checks real
post-scroll geometry and elementFromPoint for Documents, type and both buttons.
It reproduces the old top:0 overlap temporarily, restores the real style in
finally, verifies all current controls, and retains a viewport capture. Actual
Navbar and globals.css source bindings are included. All seven document recovery
cases and existing footer/public-newsletter checks remain. The newly authored
regression is pending current hosted execution; do not claim its pass yet.

Scope remains six files relative to accepted a561: Footer, document page, review
packet, browser verifier, service source bindings and this record. Existing
owner/branch/privacy/admission30-file/900KB limits are unchanged. No new local
build, browser, agent or worktree is started. Required current build, types, lint,
independent review, browser renders, ready CodeQL, protected merge and accepted
production checks are pending. No database change is needed. The full objective
and signed-in production/private assets/customer/commercial/harness gaps remain
open. Rollback reverts only this chrome/refinement slice and preserves all data.
