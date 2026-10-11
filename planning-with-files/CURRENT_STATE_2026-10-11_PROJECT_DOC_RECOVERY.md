# Project document recovery

Status: local implementation in progress; no release or production migration.

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

Actual small native checks pass: ten save/receipt/recovery cases and all six existing
docs API contracts. Changed-source ESLint, formatter and whitespace checks pass.
These checks use controlled database responses; they do not establish SQL rollback,
real authentication, browser behavior or customer usefulness.

The authored disposable PostgreSQL test includes actual two-connection CAS races,
legacy-history retention, owner/parent/anonymous denial, direct-write denial,
operation replay, atomic creation and forced history-error rollback. It refuses any
database with an existing auth schema before DDL. CI wiring exists locally; this
test has not run.

The current editor page still sends the old revisionless contract. Do not push this
checkpoint as a ready product, merge it, apply its SQL to production or claim that
project editing is repaired. Complete the caller, immediate draft backup, recovery,
conflict preservation, exact acknowledgement handling and export first.

Acceptance: native and actual SQL tests; authenticated compiled desktop/mobile and
reduced-motion save/reopen/export and account-switch cases; interruption recovery;
exact-revision independent source review; build/types/lint/security; protected merge;
source-bound production verification. Compare actual usable output and repair effort
against an existing editor workflow before a paid workspace claim.

Next action: wire the existing editor to the retained operation/revision writer and
account-scoped draft recovery. Reuse createDraftSession for one mounted writer.
Then obtain real hosted SQL/browser evidence and independent review.

## Design preparation

Emil design engineering, TASTE.md and DESIGN.md were read for the existing surface.
No visual change has been applied yet. Root DESIGN.md contains historical guidance
that conflicts with TASTE.md and Frank's current Higgsfield ban; the current ban and
root contract govern. No visual generation or new design suppression occurred.

| Existing behavior                  | Proposed behavior                                      | Why                                         |
| ---------------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| Saved follows HTTP status alone    | Saved follows an owner/operation/revision receipt      | An unconfirmed edit must remain recoverable |
| Save failed has no recovery action | Retry, preserve conflicting draft, reopen and download | Let a creator recover without losing text   |
| Small controls                     | Token-based 44px controls with visible focus           | Keyboard and mobile recovery must work      |

Rollback: before release, preserve this branch and correct it. After a future release,
disable edits if the contract cannot be met; retain all history, content and recovery
copies. Do not restore the known false-success route or delete creator data.

Full estate, premium creator, subscription/storage/API/credits and connected client/
local/cloud harness goal remains ACTIVE. This checkpoint closes none of those gates.
