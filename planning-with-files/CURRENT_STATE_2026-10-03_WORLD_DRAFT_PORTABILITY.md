# Reopenable world drafts

Source: active Arcanea goal, issue #276 and existing draft #496. Owner: Codex.
Branch: `agent/codex/arcanea-homepage-workbench-20261002`. Portability base:
`d70251204e3fa6aeb0bb8566f3cd3f81c6c03d62`, integrating accepted main `4e1d914f1916987d0b059be9ca4c35077f9b6d9d`
into the prior homepage proposal. No GitHub merge or production change.

## Task contract

User job: carry a complete world, its original concept and retry identity from
one tab/device into another without regenerating it. Existing alternative is a
world-only JSON download plus browser-tab recovery, which has no file reopening
control and does not carry the original concept or draft identity.

Scope: extend the existing creator and schema; restorable version1 JSON export,
validated file import, legacy world-only support, confirmation, previous text
recovery and failure handling. Reuse the current generator, private account save,
world display and homepage workflow. No new editor, repo, runtime or paid AI call.

Files: creator page, draft-portability helper/test, existing world-draft browser
runner, existing CI, this record and `docs/strategy/arcanea-world-draft-portability-2026-10-03.md`.
The separate integration commit imports twelve already-merged main files,
including the Next16.3.6 patch, dependency lock and feedback entry boundary.

Acceptance: complete known text fields survive export/reopen; current text is
preserved on bad JSON, unsupported fields/version, cancellation and storage
failure; previous text survives reload; older exports allocate a new valid ID;
imports do not call generation/save APIs or require sign-in; keyboard/mobile375/
reduced-motion proof; exact-head native required CI and browser source bindings.
Independent final review and human release acceptance remain required before
promotion. Native fixtures alone do not establish actual model quality or paid
creator value. Rollback: leave the draft unmerged, or revert this portability
commit while retaining the accepted-main integration and existing homepage work.

## Implementation and limits

Export uses the existing recovery envelope, retaining concept, UUID and the
complete validated world. Concept art/account state are excluded explicitly.
Canonical saved-account routing is kept separately from the original world slug,
so save response routing does not change an exported source world.

Raw/normalized JSON has the existing150000-character recovery ceiling. File reads
are bounded to600000 bytes for UTF-8; schema counts/field limits remain unchanged.
Unsupported fields are refused recursively, avoiding silent loss when using
unfamiliar export formats. Legacy world JSON keeps all known fields but its lost
concept cannot be recovered: use its description/tagline/name, capped500 chars,
and explain this in the UI. A new UUID marks that legacy import as a new draft.

File validation precedes confirmation/storage. Existing text is backed up before
replacement. Successful storage changes are rolled back on failure; if rollback
also fails, the error says browser recovery is uncertain and asks the creator to
export the still-visible text. Native Storage operations are assumed individually
atomic; this does not establish crash-safe multi-key writes or cross-tab/device
sync. Same-UUID edited files still get a backup and a visible restore action.
An outstanding read blocks reset, refine, generation and another import. Unmount
invalidates its continuation. The original file is never modified.

Local native tsx cannot start because the installed Windows esbuild binary is
missing. No install was attempted. Existing Sucrase3.35.1 erasure/module conversion
runs exact source tests under Node22.23.2/Zod3.25.76; this is runtime fixture proof,
not native tsx or TypeScript checking. Initial ten tests pass. Final formatting,
native CI and real Chromium execution must be read from subsequent exact-head
receipts. No inherited provider PASS applies to these new files.

Budget: one lead, ordinary text/small tests, existing dependencies only, no new
node_modules/worktree/local full build/server/browser/media/provider fanout.
Disk about14.18% free, bounded. Remote verification uses existing native CI.
Stop on ownership/source changes or failed required checks; retain all failures.
Policies loaded in this session are instructions, not universal enforcement.

Broader setup remains open: curated installs/rights, reader integration, launcher
upstream ownership, legacy recovery, manuscript selection, community demand and
revenue. Keep #487/#499/#500/#501/#502 and shared AuthorOS/World Repo/SIS/runtime/
media owners. Heart/licence/engine and #408/#277/#427 remain human gates.

Source review follow-up: an identical imported draft could clear a pending new concept without confirmation. Show that pending text so it can be copied and require confirmation before clearing it. A native browser regression cancels the identical import and checks that the concept remains. Preserve first source f108c1b3 and all its CI attempts; final-source checks must use the resulting revision.
