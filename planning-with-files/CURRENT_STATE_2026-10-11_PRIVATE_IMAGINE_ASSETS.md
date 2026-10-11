# Private retained Imagine assets

Scope: a signed-in creator keeps an image, reopens it in the correct account,
downloads its actual bytes and explicitly authorizes any animation handoff without
silently publishing the source. This is part of the full world/chapter/continuity/
media/reopen/export programme, not a substitute for that outcome.

Owner: Codex task `01a123df-58c6-72f3-b86c-65083426cf65`, sole writer in the existing
`arcanea-gateway-admission-20261010` worktree. Origin:
`https://github.com/frankxai/arcanea-ai-app.git`. Branch:
`agent/codex/private-imagine-assets-20261011`. Base:
`0dd501281f89f0612454b1200ba40f8fac5799f6`. Issues: programme276 and trust529.

Files currently changed: Imagine's favorites helper, native favorites regression,
ImageCard, Imagine page and this record. The admitted scope also includes save,
gallery and private asset retrieval routes and their helper/tests. Further SQL,
animation or hosted-verifier changes require an explicit scope extension first.
No foreign checkout or index is written. Preserve578/579 and the reader/entry lanes.

## Evidence and implemented foundation

The frozen accepted helper at0dd5012 reads an unowned global localStorage manifest
without account authority. The actual helper reproducer exposes controlled A scene
metadata without an owner argument. It makes no network calls or production writes;
this is a native reproduction, not an authenticated-browser result.

The repair requires the existing synchronous Auth actor/epoch for every favorite
read/write. A/B/A stale uploads cannot commit or update the next account's UI.
Unowned legacy manifests are preserved without importing or displaying them.
Browser namespaces are not encryption and do not provide cross-device persistence.

A favorite now requires a valid successful save receipt. HTTP denial, transport
failure, session-only responses and failed local writes remain visible failures;
an expiring provider URL is never silently substituted for a saved receipt.
Corrupt metadata remains preserved. Inline image bytes are bounded through the
accepted decoder; raw inline bytes are not duplicated into the metadata cache.
The local cache bound is an implementation guard, not a paid storage entitlement.

ImageCard passes captured authority, exposes an accessible save toggle and error,
and keeps its 44px favorite target visible on touch and keyboard focus. Downloads
reuse the bounded PNG/JPEG/WEBP decoder with correct filenames and a guarded original
link fallback. Favorite previews avoid the unauthenticated Next image optimizer.
Unrelated component behavior was retained. The required changed-file formatting
gate normalizes the touched legacy ImageCard source, including its CRLF and JSX
layout. All five changed files pass the existing formatter. No new image, canon or marketing asset was generated.

Twelve focused native cases and the existing ten request/export cases pass.
Changed-source lint passes. Full type/build, authenticated/rendered acceptance and
exact-revision independent review are not earned for this branch.

## Full acceptance, still open

- Private new writes and authenticated owner-scoped byte reads. Existing public
  objects must not be deleted, relabelled as private or silently republished.
- Durable Postgres metadata with source, rights, checksum, accessible description,
  operation identity and private lifecycle. A creator can recover the saved record
  if the browser cache is lost. Gallery pagination must not lose older records.
- Atomic per-account byte admission, including concurrent/uncertain uploads. No
  client-controlled quota, blind retry, automatic deletion or unapproved overage.
  The current commerce catalog defines no numeric storage entitlement; do not
  invent one or advertise capacity before configuration and enforcement are proven.
- Stable retries and checksum-bound completion. A lost upload acknowledgement
  retains the same asset identity and reservation until the object is reconciled.
- Input bounds compatible with actual Vercel request limits. Direct client upload
  tokens, if used, require authenticated owner/path/type/size binding and verified
  completion; an upload callback cannot promote arbitrary content.
- Private animation sources delivered only after explicit creator intent, with
  owner validation before credit reservation and current documented supplier input.
  The present animation/save route is not yet changed and still relies on public
  URLs. A private route must not break it or expose images merely to make it work.
- Real two-account Auth/Postgres/storage-fixture save/reopen/export, guest/foreign
  denial, malformed/oversized bytes, quota exhaustion, duplicate completion,
  interrupted upload, expired authority and storage failure. Require original
  desktop/mobile/reduced-motion captures with companions and visual-ledger entries.
- Same-head source review, build/type/lint/native/hosted acceptance, protected merge
  and source-bound production verification. Actual customer usefulness and paid
  activation remain separate programme gates.

## Architecture, admission and rollback

Current reviewed Registry `b4b82e3d1430846d62707973a66584de4f2e4776` was read through
the authorized connection: manifest, exclusions, repositories, artifact authorities
and architecture decisions, with hashes retained privately. The registered Arcanea
product remains the source; no new portfolio artifact authority is invented.
`architecture_media_fabric_v2` is accepted: Postgres metadata and governed Blob
delivery. The earlier R2-default decision is superseded. Reusing Supabase Storage
was considered against the accepted Blob path; no measured exception or migration
is approved. Current official Blob private/client-upload and xAI image-to-video
documentation were checked. Installed Blob SDK is2.8.0; no dependency change.

Machine review-lite admission is HOLD at2483MB free/6144MB required,27 runtimes.
Only text edits and small native/lint checks ran. No new local browser, build,
agent, server, vendor store, provider call or production database/configuration
change occurred. Keep existing public assets and all account data. No financial
transaction, price, subscription or rights grant is authorized by this record.

Rollback is an owned reviewed revert that preserves asset bytes, reservations,
metadata and unowned legacy browser data. Reverting the account helper restores the
known cross-account leak and false-success behavior, so record that consequence.
The slice remains unfinished and must stay draft. The complete native goal is ACTIVE.
