# World draft editing and safe cancellation

Scope: make long world drafts easier to edit and preserve unapplied work through
cancelled discard or a supported browser reload. Owner: Codex task
`01a1254f-d5b4-7ba0-a3dd-9b8ca0969cea`, sole writer in
`arcanea-world-editor-20261011`, branch `agent/codex/world-editor-20261011`.
Origin: `https://github.com/frankxai/arcanea-ai-app.git`.
Base: `a131c1e9dfa2a2e6b8d93e1be4bd32c43794afc1`.
Owning work: existing programme #276, creator outcome #191 and release #427.

Files: apps/web/components/worlds/world-draft-editor.tsx,
apps/web/app/worlds/create/page.tsx (dirty-state relay, existing leave warning and
restore/refine guards), apps/web/components/navigation/footer.tsx (narrow newsletter
reflow), scripts/verify-world-draft-browser.cjs and this record.

User job: revise the complete world, including its later characters and locations,
without searching a single long form or silently discarding unfinished fields.
Reuse the released editor, canonical world schema, private save/recovery and the
existing compiled browser fixture. This slice changes no generation, account,
database, cloud save, identity, commerce or public-canon authority.

## Evidence and design decision

Baseline source a131c1e passed CI 38114200438. The existing world-draft suite's
original 1440/375px and reduced-motion captures were recovered from artifact
11692413425, with companion provenance and generation-ledger entries validated
against the accepted local schema. Desktop and phone originals were inspected.
They prove the compiled synthetic fixture, not production account or creator use.
Source inspection identifies the cancellation failure: Cancel unconditionally
clears the editing buffer. The existing suite exercises applied edit/reload and
export but does not exercise unapplied cancellation.

Three bounded arrangements were considered: the existing uninterrupted form;
tabs that show one content type at a time; and visible content groups with a
section outline. The outline is selected because it keeps adjacent world content
inspectable, preserves existing field labels and gives phone users wrapped direct
links without hiding later fields. The existing Geist/dark/teal design remains.

The feel contract keeps text editing and keyboard navigation immediate. Actions
have quiet press feedback, 44px targets and visible focus. Group headings receive
keyboard focus with fixed-header clearance. No gesture, timeline, animation
dependency or raster asset serves this editing job; those passes are skipped.

| Before                                     | After                                                          | Why                                                     |
| ------------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------- |
| One uninterrupted field list               | Named world-content groups and direct section links            | Find later content without losing the rest of the draft |
| Cancel immediately clears edits            | Changed content requires explicit discard confirmation         | A cancelled discard preserves unfinished work           |
| No unapplied working-copy action           | Download the complete working buffer, including invalid fields | Keep incomplete work without applying or publishing it  |
| Editing actions remove the focused control | Enter focuses the world name; apply/cancel returns to Edit     | Keyboard users retain a clear location                  |

Working-copy downloads are marked `arcanea.world-working-edits.v1`; they are not
accepted world exports. Automatic editor-buffer recovery/import remains outside
this slice. Browser beforeunload is a scoped warning, not a mobile persistence
guarantee. It is attached only while content differs, removed after reversal or
closure, and may not fire for app switching or client-side routing. A creator
must apply or download work before leaving. No guarantee of full tab-loss recovery
is made. Existing applied-draft recovery remains authoritative.

The existing parent owns the single beforeunload listener and the explicit Worlds
back-link confirmation. The editor reports committed dirty state through a stable callback,
clears it on unmount and resets it in the existing account-reset lifecycle;
open-editor state still blocks saving, export and regeneration. No second unload
listener is introduced. The parent's existing large file is not rewritten.
The restore action and already-open refinement choices now share that edit guard.
Absent and empty optional backstory/location text are equivalent only for dirty
tracking; downloads still preserve the actual whole buffer. Repeated download
failures restore error focus. No account or authentication authority is changed.

## Acceptance and verification

The authored compiled browser suite covers 320/375/768/1440px and reduced motion:
section-link keyboard/focus/header clearance; reflow; invalid-field rejection;
complete working-copy bytes without changing storage/export authority; download
failure and retry with the buffer retained; cancelled
discard; cancelled reload; confirmed discard and returned focus; reversed-input
warning cleanup; applied edit/reload; exact JSON export and existing recovery.
Tab traversal, actual header bounds, optional-field reversal, immediate cleanup
after apply/cancel, repeated download failure and disabled restore/refine choices
are authored checks. Dirty account-reset/unmount behavior has source cleanup;
this anonymous fixture does not prove an authenticated account transition.
Retain zero model requests and no unexpected runtime errors. The new modes and
editor captures require actual hosted execution; authored coverage is not a pass.

Required release checks: pinned Node 24/pnpm 11.28.4, frozen lockfile, existing full
build/type/lint/security and `node scripts/verify-world-draft-browser.cjs` against
the compiled app. Local browser/build admission is HOLD; use the existing hosted
CI path, without starting another server or weakening required checks. Source
formatting and small targeted checks are allowed. Independent exact-head review,
fresh original editor captures and source-bound preview/production inspection
remain required before qualifying promotion. A test is authored, not passed,
until its actual result is inspected. Initial candidate 2907e21 was superseded
after finding the parent's existing open-editor unload guard. Its owned run
38116090708 was cancelled during installation; it provides no passed result.
The corrected revision must exercise clean/reversed warning removal through the
existing parent. Under the mission's explicit hosted-CI
instruction, publish only this owned candidate branch to run the existing gates
before opening the required draft PR. The local build preflight at 05:49 UTC was
HOLD: 3769 MB free against 8192 MB required. No local server, dependency install
or full build is authorised by that reading. Enabled ownership/security hooks,
component transpile and script syntax checks remain local; transpile uses the
already installed TypeScript 6.0.3 and is not the pinned project typecheck.

Root AGENTS SHA256:
`36b534b6a33f240aa752e4360ab08468702cbaa366c85c3ca9db0e0b21fd2ca5`.
apps/web/CLAUDE SHA256:
`a43b1abc5f46c7cfd82605644f5a017cb7d3e8f34a6147f808416ad29a160a0e`.
Root/app instructions, current source/recovery planning, shared hub/master-plan
context, TASTE/DESIGN, restored SYSTEM/SCHEMA/SKILLS, design routing/spec/rollout,
task contracts, Emil, frontend and Arcanea frontend guidance were explicitly read.
Older Node 20, Higgsfield, 16 percent disk and foreign-primary writing instructions
are superseded by the current user/runtime/machine contracts. The foreign primary
and its dirty work remain untouched. Routing and exclusive ownership passed;
claims record hashes and ownership, not runtime compliance.

Independent v0 Max review of ada7f61 returned STATIC WARN. Its five reviewed
attachments and supplied hashes are retained privately. It had no base checkout,
executed no tests and viewed no candidate screenshots. The candidate refinements
address its dirty-unmount, optional reversal, repeated-error focus and controlled
dialog assertions, strengthen actual Tab/header checks and protect the inherited
restore/refine holes. The revised source needs a fresh review with the base diff.
Reported review usage: 0.0006 plan credits; mission total 0.0028, zero on-demand.
These provider units do not establish an observed dollar conversion or balance.

The second static review of 2c932e4 found no application-code blocker and two P3
test weaknesses: missing-header fallback and unowned confirmation handlers. Both
are addressed by asserting the actual header and capturing/validating/resolving
each confirmation. The explicit page back link is named Back to worlds so the
test cannot silently select a global/footer route. This review used 0.0003 plan
credits, bringing reported mission usage to 0.0031 with zero on-demand usage.

Hosted CI 38116235991 at superseded ada7f61 passed frozen install, lint and
typecheck; its actual compiled build succeeded, then the world browser script
failed with dialog.dismiss already handled. The former broad Worlds-link
selector and unawaited confirmation handler left a second listener to consume
the reload dialog. All failed evidence is retained; this is not a passed run.
The corrected candidate needs fresh hosted execution and exact-source review.

The exact-head static review of a12255b returned PASS for its inspected source;
it did not run browser checks or inspect captures. Its 0.0003 plan-credit usage
brings observed mission v0 usage to 0.0034, with zero on-demand usage. Hosted run
38116878526 passed frozen install, lint, typecheck and the compiled application
build, then failed the cancelled-reload assertion: Chromium retained the page
but Playwright reported navigation timeout instead of ERR_ABORTED. The revised
test requires the beforeunload dialog, dismisses it, checks the expected aborted
or timed-out navigation, and verifies that the original document object and the
unapplied field survive. This avoids accepting a reconstructed draft after reload.
The latest browser-qa preflight remains HOLD: 4063 MB free against
8192 MB required. No local browser was started. This correction changes test
evidence only; the application source remains unchanged from the static PASS.
Fresh hosted execution and exact-revision review are still required.

The c181173 static review passed and used 0.0002 plan credits, bringing observed
mission v0 usage to 0.0036 with zero on-demand. Its actual hosted run38117590844
again passed frozen install, lint, typecheck and the compiled application build.
The strengthened cancellation test retained the original document and invalid
field, then reproduced an unload warning immediately after confirmed Cancel.
The prior passive-effect relay allowed dirty-state cleanup to lag the closed
editor. The parent now keeps one listener reading a synchronous dirty ref; a
stable callback updates that ref; the editor's committed buffer owns its visible
dirty state, without an unused parent state or another parent render. The editor
reports committed dirty/reversed state and unmount cleanup in layout effects,
and explicitly clears it in successful Apply/confirmed Cancel handlers. Account
reset uses the same callback. Warning-free reload checks now also verify the
guard is already clear through a cancellable event before actual navigation.
This is an application correction; the earlier static PASS does not approve its
new bytes. The retained failed run is not a passing recovery result. Fresh
hosted browser proof, exact-source review and original captures remain required.

Independent static review of 5ee4872 found no concrete dirty-state/data-loss
blocker, with two P3 findings: the mounted listener's possible Firefox bfcache
cost and an earlier lifecycle description that no longer matched that candidate.
Its observed usage was 0.0003 plan credits, bringing mission v0 units to 0.0039.
The latest callback synchronously attaches the single stable handler only when
dirty and removes it on reversal, Apply, Cancel, unmount or account reset. A
parent cleanup effect also removes that same handler. This retains immediate
navigation safety while avoiding an always-attached listener for clean work.
The current description now names the stable report callback. No Firefox
runtime/cache or typing-performance measurement is claimed. The previous
5ee4872 run remains separate evidence; changed source needs fresh review and CI.

The 19c1278 exact-source independent static review passed with no concrete
findings in the bounded scope; no runtime or image review was claimed. The
superseded 5ee4872 hosted run38118201120 passed install, lint, typecheck and the
compiled build, then completed the world recovery cases in desktop, 375px,
reduced-motion desktop and tablet modes. It failed the added 320px whole-page
overflow assertion before opening the editor. Eight original captures from
artifact11694083991 were recovered with validated provenance; the phone and
desktop editor originals were inspected. This is partial browser evidence,
with the failed narrow case retained as a release blocker.

The shared footer email input retained its intrinsic minimum width in a flex
row; it can now shrink while the Subscribe button remains intact. Both controls
have 44px targets. The editor fieldset also allows its grid and full-width
textareas to shrink below their intrinsic minimum. The whole-page overflow
assertion is unchanged; failure now records offending bounds and an original
diagnostic capture. Newsletter control bounds are checked in all five modes;
the test never submits the live form. This extends the owned slice by the named
footer file solely for reflow. Its existing subscription behavior is unchanged.
The latest build preflight remains HOLD at8097 MB free against8192 required;
no local build/browser or additional worker was started. These new application
bytes still need fresh hosted CI, original 320px/editor captures and independent
exact-revision review.

Rollback: revert only this component/test slice through a reviewed PR. No database
migration or user-data rewrite is involved. Preserve working-copy files, prior
receipts, all foreign branches and the existing applied-draft recovery records.
Stop any session-owned worker at handoff. Current status: source candidate; hosted
checks, exact-revision independent review and release remain pending.
