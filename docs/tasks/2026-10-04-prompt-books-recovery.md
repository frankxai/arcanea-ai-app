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
review; authenticated owner preview using the existing Chrome profile. Machine admission
is checked before local intensive work; no local dependency installs or builds.
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

The fifth Copilot review at `a5ff4de` found template creation reading the previous
stored prompt and a hook refresh skipped while a save was pending. Template creation
now drains the editor first, rechecks the actor generation, then reads the current
owner prompt through a guarded store action. It reuses the existing createTemplate
service, whose is_public mapping matches the read-only live column catalog. No
customer rows were read and no SQL writes were made. The dialog initializes from
the current draft, retains failure feedback and uses the installed Radix primitive
for keyboard focus, Escape and modal behavior, with sentence case and mobile sizing.
The hook retries refresh when dirty/saving flags clear. SDK and built-app regressions
cover template field fidelity, A/B/A rejection, failure retry, and a newer cached
revision arriving during a save. Retry actions meet the 44px touch target. Fresh
checks and complete exact-revision review are required after this correction.

The sixth independent review at `9c788d9` arrived after the typed-fixture correction.
It found refreshed content paired with stale dialog variables, and the newly
formatted dialog exposing existing UI ratchet violations. One reconciliation
function keeps custom metadata for surviving placeholders, initializes new names
and omits removed names in both the rendered dialog and the final confirmed
template write. New SDK and built regressions cover refresh during the save barrier.
The dialog uses focus-visible replacements and transition-colors. Earlier failed
type, UI checks and superseded native packets remain retained by revision.

The complete native xAI source review at `8fb1cca` returned WARN with four findings.
Draft writes now condition on the verified owner and exact loaded updated_at,
read the actual SDK result, and require its eight fields to match the attempted
snapshot before confirmation. Conflicts retain locally edited fields, merge
remote untouched fields and require an explicit retry. Full timestamp precision
is retained. A returned row from another actor cannot acknowledge a draft.

Resource reads capture their starting cache and reconcile arrivals, removals and
newer revisions without replacing intervening changes. Failed direct-link reads
show a Retry loading action. Template creation checks the confirmed editor fields
against the owner cache, reconciles placeholders, and uses an idempotent primary
key with ignoreDuplicates plus an owner-guarded read. Unacknowledged operations
can resume after A/B/A within this runtime without duplicate templates. This
private recovery map does not survive browser reload; mounted drafts likewise
are not a durable offline journal. No dependency, schema or live SQL change.

Actual pinned SDK transport regressions and built browser cases cover conditional
write conflict/retry, false confirmation, delayed resource reads, loading recovery,
lost template acknowledgement and same-owner epoch retry. The e2e transport is
separate from a real signed-in preview creator acceptance. Current exact source
checks and independent review remain required. Existing security advisories,
missing authenticated acceptance and unfinished platform/release work stay open.

The seventh Copilot review at `cd2a59e` recommends changes: collection/tag
mutation and realtime updates lacked the load path's revision guard, and JSONB
object-key ordering could falsely dirty or conflict a successfully saved draft.
A shared structural JSON comparator now canonicalizes object keys while retaining
array order in editor comparisons, conflict field merging and pending-template
identity. Collection/tag updates use the existing precision comparator. Actual
registered callback regressions cover stale current-session updates; actual SDK
roundtrips cover reordered JSONB confirmation and template recovery. The built
editor case covers multi-parameter roundtrip and reload. Corrupted copy/comments
are repaired. Earlier42 SDK/11 browser passes remain bound to `cd2a59e`; fresh
current-source verification and independent review are required.

The eighth Copilot review at `499ac38` confirms the prior five corrections but
finds an older tag-assignment snapshot can overwrite a newer confirmed cache
when edits overlap. Mutations are now serialized per owner/session/prompt; the
verified actor is checked again after waiting, and the association query is the
last awaited read before cache application. Actual pinned SDK tests cover overlap,
queued A/B/A rejection before writing and queue recovery after failed refresh.
Prior `c53ce4d` passes47 SDK regressions, TypeScript and strict lint/format;
its browser/build result remains source-bound. Fresh50 SDK/current source review
are required. Security audit and owner preview acceptance still hold production.
