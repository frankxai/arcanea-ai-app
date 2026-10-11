# Project document recovery

Status: draft PR585; authenticated acceptance candidate in preparation, no release or production document migration.

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
