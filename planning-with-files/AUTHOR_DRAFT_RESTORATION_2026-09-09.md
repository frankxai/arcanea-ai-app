# Author draft restoration and database repair

Source: Codex task 01a06ecf-6107-7e80-abe9-bb0fcdc9b7f2.
Owner: this task's authoring lane in arcanea-ai-app.
Review: PR379. This record consolidates the original save-reliability plan and
the restoration follow-up; the parent objective and remaining work stay active.

## Scope and observed failure

Restore an authenticated writer's saved chapter before enabling editing, including
formatting, empty drafts and chapters without a published Markdown file. Keep API
reads and the server page consistent. Repair the missing production draft store.

Read-only Supabase inspection of the Arcanea project on 2026-09-09 found:

- public.book_chapter_drafts does not exist; columns and policies are absent.
- public.books and public.book_authors do exist.
- The existing 20260414 migration is present in Git; that alone does not prove
  installation in the live database.

The previous page always loaded published content and rejected draft-only chapters.
GET compared draft timestamps to filesystem mtimes, omitted rich JSON, and returned
published content after draft lookup errors. Those behaviors are reproduced by
the new tests.

## Files and implementation

- Save handling: immediate edit tracking, serial/coalesced requests, confirmed
  draft-only success, retry/download after failures, empty-chapter keyboard save,
  and a document-exit warning. Shared editor cleanup flushes only pending content;
  typed HTML initialization and native formatting controls preserve editor state.
- lib/author/read-draft.ts: session-scoped lookup, four-second deadline, database
  abort signal, supported document structure checks, literal-text legacy fallback.
- Author workspace page: restores the account draft, shows a retry state on
  lookup failure, and remounts the editor when the chapter identity changes.
- Author editor: accepts stored JSON and initial draft status/count/time.
- Chapter GET: shares the reader, returns rich JSON, uses private/no-store
  responses, and limits published reads to real book and chapter entries.
- Migration 20260909000001_restore_author_drafts.sql: creates the absent store or
  upgrades the legacy schema, with required ownership and authenticated owner-only
  select/insert/update/delete policies. Anonymous table access is revoked.
- Existing CI gains an isolated PostgreSQL 17 fixture and makes its result part
  of CI Status. No production credentials or production migration run are in CI.

## Acceptance and verification

1. Saved rich JSON and empty content survive reopening; a new draft-only chapter
   no longer requires a filesystem file.
2. Unknown saved state never opens an editable published fallback. Database and
   authentication deadlines return a visible retry state.
3. Draft queries constrain book, chapter and authenticated user. Responses cannot
   be stored by shared caches. Filesystem traversal and agent-instruction files
   are excluded from published API reads.
4. Fresh creation, safe reapplication and legacy upgrade pass on PostgreSQL 17.
   Real row-level security isolates two accounts, denies ownership transfer,
   denies foreign inserts/updates/deletes, and preserves rich and empty content.
5. Full type/lint/build checks, exact-head independent review and authenticated
   desktop/mobile preview verification pass before release.

Current local evidence: 21 save/editor regressions from the parent plus 21
restoration/read regressions pass. The server and component tests use explicit
boundary doubles; they do not prove a real Supabase session. Five workspace
and five API assertions failed before implementation.

Eleven original save assertions failed before their fix. Targeted ESLint,
Prettier and secret checks passed. Parent head f024eeb6 passed full CI and an
independent Gemini 2.5 Flash review; that verdict does not cover this extension.

The SQL fixture is guarded to run only in arcanea_author_draft_test. Its test
table deletion exercises legacy upgrade inside that isolated database; it is
not a production rollback script.

PostgreSQL CI, final independent review and authenticated visual verification
remain pending. Local browser/build admission is held; code and small tests
remain allowed. No production database write has occurred.

## Production migration gate and rollback

Production application is a human-gated migration under the supplied AGENTS
instructions. Prepare the exact SQL, hash, tests and independent verdict before
requesting approval. Recheck the live schema before application; unexpected
rows, policies or drift require review. Invalid legacy ownership/timestamps cause
the transaction to fail; the migration does not delete or invent manuscript data.

Apply the migration before promoting the restored editor. Then verify the real
schema/RLS and authenticated save/reopen behavior. The frontend must not be
advertised as working merely because a table exists or a preview builds.

Rollback application code if necessary while retaining the draft table and
manuscripts. Do not drop the production table as a rollback. There is no canon,
book publication, provider-registration or billing change in this work.

Remaining product work includes cross-tab/server revisions, uncertain-write
recovery, client navigation recovery and a complete authenticated browser run.
Serialization covers one mounted editor. A stalled write can remain pending;
download and exit warnings remain available. Manuscripts are not silently cached
locally. Browser exit events do not cover every mobile termination or SPA route.

The separate capabilities task owns MCP distribution, plugins, skills and the
developer portal. World Atlas and open book candidates remain separate work;
this authoring change neither publishes nor supersedes them.
