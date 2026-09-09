# Author draft save reliability

Source: Codex task 01a06ecf-6107-7e80-abe9-bb0fcdc9b7f2.
Parent objective: improve Arcanea's connected product, creative content, and
developer ecosystem. This is one bounded implementation within that objective.

## Change

The author editor previously cleared its unsaved state on HTTP 401, had no
recovery controls after failed requests, allowed concurrent writes, and learned
about edits only after the autosave debounce. The shared editor also flushed
on callback changes and repeated completed saves on unmount.

The candidate reports edits immediately, serializes writes within one mounted
editor, coalesces queued snapshots, and accepts only confirmed draft responses.
Failed saves keep unsaved status and offer retry and plain-text download.
The browser receives a beforeunload warning while changes are unconfirmed.
Keyboard save includes an intentionally empty chapter.

The shared editor captures content before teardown, flushes only pending work,
and uses the current save callback without treating a callback change as exit.
No database schema, account permissions, publication, or canon changes.

## Acceptance and evidence

- Eleven regressions failed against the previous components for the actual
  failure symptoms, then passed against the implementation.
- Twenty-one focused Node regressions cover save errors, confirmation, ordering,
  immediate changes, downloads, keyboard save, teardown, initialization and toolbar state.
- The tests execute the real TSX with mocked React hooks and editor/browser APIs.
  They are logic regressions, not a real React or browser integration verdict.
- CI runs these regressions in the existing lint job.
- Targeted ESLint passed for both edited components with zero warnings.
- Prettier and diff whitespace checks passed for the explicit deliverables.
- Exact commands: `node --test scripts/tests/author-editor.test.mjs scripts/tests/doc-editor.test.mjs`.
- Full CI, desktop/mobile preview, and independent provider review are required
  before release. Local browser/build admission is currently held; no release
  acceptance is inferred from the focused tests.

## Open limitations and next work

1. Reopening currently loads the published filesystem chapter in the server page.
   The API reads drafts but compares their timestamp with filesystem mtime, which
   is not a publication revision. It also omits stored rich-text JSON in GET.
   Next slice: restore the authenticated writer's draft before enabling editing,
   fail visibly on lookup errors, and test persistence across reload/redeployment.
2. Serialization applies within one mounted editor. Cross-tab/device conflicts
   and a network failure after a server accepts a request require a server-side
   revision protocol; this candidate does not claim to solve them.
3. beforeunload protects document exits where browsers support the event.
   Client-side navigation and mobile termination need a separate recovery design.
   Unsaved content remains in memory unless explicitly downloaded; no silent
   local storage of manuscripts was added.
4. A stalled fetch can keep the saving indicator active. The download action and
   exit warning remain available. Add a bounded request deadline together with
   the server revision protocol so uncertain writes cannot race a retry.
5. The first independent review (Gemini 2.5 Flash, head 649f32356) requested
   changes to the inherited HTML-to-JSON cast. The correction uses Tiptap's
   typed HTML parser without emitting an edit; stored JSON takes precedence.
   A fresh independent verdict and Vercel preview evidence remain pending.
   The second review repeated the removed cast finding; the current-head regression
   verifies that HTML reaches the dedicated parser prop. It also identified
   missing toolbar active state, which now uses the editor context and a native
   button with aria-pressed. The prior implementation did not consume isActive.
   Rollback is a revert of this bounded change; there is no data migration.

## Coordination

The separate capability task owns plugin installation, MCP distribution, developer
portal delivery, and legacy skill reconciliation. Its files are outside this lane.
The World Atlas task owns its active atlas work. Their work remains substantive
and unfinished; neither task is archived or superseded by this slice.
