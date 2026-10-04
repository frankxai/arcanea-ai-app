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

Independent GitHub Copilot balanced review of revision `339d96a` found a stale
load-error status write and missing direct realtime A/B/A coverage. The correction
binds collection error handling to selection and session generations and adds
actual registered-callback tests plus honest current-error checks. Revision
`b6fa83e` passed eight pinned SDK/service regressions, strict lint, changed-file
formatting and app typecheck. Those results do not approve the correction yet.
The existing Quality Gate workflow is disabled externally; this candidate adds
the high/critical dependency audit to active CI rather than inferring a security
pass from that absent run. Existing workflow settings remain untouched.

The second Copilot review at `928f92e` identified direct-link initialization order,
tag responses outside the actor generation guard, initialization status from
superseded loads, stale error status after successful selection recovery, and an
alert border outside the semantic tokens. The follow-up reuses one verified actor
boundary for CRUD and tag mutations, waits for the route owner/session, binds
aggregate load status to its generations, and adds real SDK/service lifecycle
regressions plus a built direct-link collection-tag request assertion. Tag addition
uses the existing composite key without deleting other assignments. No schema or
dependency change. Current independent review and engineering acceptance must be
rebound to the resulting revision; earlier passes approve only their own source.

The third independent review at `482bff1` found a current collection failure
hidden by route selection, omitted tag associations cleared by autosave/realtime,
context/example/chain writes outside awaited Back, a same-owner stale template
response, and one retry border constant. The correction tracks each resource
independently, preserves omitted cached tags, shares one immutable editor draft
and save drain for all eight fields, guards template results and navigation by
actor/session, and uses the semantic retry border. Preference hydration and load
tracking are separate modules. Fresh exact-revision checks and review remain
required; the unchanged dependency audit still blocks promotion.

The fourth independent review at `35b4bfd` confirms the collection-status,
tag-cache and store-size corrections. Its further findings require retaining
PostgreSQL timestamp precision for load/write/realtime/editor freshness and
preserving normal loading feedback while the owner's direct-link read is pending.
One shared comparator now retains all fractional digits and normalizes timezones;
actual SDK/cache/editor regressions and a built delayed-load case cover these.
The repeated registered-realtime-test finding is reconciled with the existing
actual callback registration/invocation test, which passes. Fresh source review,
build and owner acceptance remain required after this correction.
