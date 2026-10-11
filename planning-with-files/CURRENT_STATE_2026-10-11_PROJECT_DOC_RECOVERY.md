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
