# Prompt Books save recovery and owner isolation

Owner: Codex. Tracking: [issue 427](https://github.com/frankxai/arcanea-ai-app/issues/427).
Base: `79f3fb25ca8d34c22eae1210c7c92ae2ebe8ea0b`.
Branch: `agent/codex/app-prompt-books-recovery-20261004`.

The creator must be able to edit a saved prompt, keep typing while a save is pending,
see a failure honestly, retry the same draft, and return to the collection only
after the latest text is confirmed. An account change must hide private drafts and
discard earlier account responses. Direct editor links must initialize from the
authenticated account. Browser storage retains validated display preferences only.

Reuse: the prepared four-file editor patch from platform revision
`336c98e43a36c2827103151debacefed063265b2`, applied once against the exact app base.
Compare with the accepted app's old timer and response handling. Importing the
whole platform proposal would also introduce unrelated APIs, schema and release
work; that proposal remains open and preserved.

Scope: editor hook/session/store, Prompt Books provider/layout and initial landing
initialization, stale realtime handling, retry feedback, meaningful regression tests
and their CI invocation. No dependency, lockfile, database, lore or media changes.
The existing media branch remains at `533bd77c6eb43b26898be1c2c4985e8912d13c9e`.

Acceptance: first-edit autosave, latest-draft save drain, failed-write retry, awaited
Back, stale loads and account A/B/A isolation pass on actual app source. Strict
lint, typecheck, frozen build and required security gates must pass. An independent
provider must review the complete current delta and relevant callers. A real owner
must complete the creator journey on the exact preview before production promotion.
Bind the stable domain to the verified source revision afterward.

Verification: cloud CI on Node 22 with the app's pinned dependencies; source-bound
review; authenticated owner preview using the existing Chrome profile. Local builds,
dependency installations and browser workers are held by machine admission.
Fixture transport assertions do not establish live RLS or actual owner acceptance.

Recovery limit: an unsaved draft is retained in its mounted editor session. It is
not persisted across reload or arbitrary route unmount. Reload warns while dirty.
Rollback: revert only this repair on a fresh branch; preserve stored creator data,
all media/platform/release branches and the existing issue/hub history.

Status: implementation and verification in progress. No preview or production
acceptance is claimed by this checkpoint.
