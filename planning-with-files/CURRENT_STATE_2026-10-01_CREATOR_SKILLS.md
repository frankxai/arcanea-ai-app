# Curated creator workflows and installer boundary

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owner: Codex, `agent/codex/arcanea-source-consolidation-20261001`.
Owning issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Base for this slice: `64fbf3491064e4c7a68c1055a1b35250bb929ee1`.
Underlying main: `2b9a0a5e421d39d272a0f00fef764b3cbe10b3b3`.
State: candidate implementation on a review branch; broader objective active.

Scope: four portable creator workflow candidates in the existing skills package;
catalog-controlled API and installation with support files and overwrite refusal.
Owner files: package README, manifest, index, installer, catalog, catalog validator,
tests, the four candidate directories, and this task record.
Non-goals: root licensing, publishing, canon edits, repo archives, legacy migrations,
launcher edits, plugin activation, MCP/runtime duplication, website or commerce changes.
Acceptance: zero candidates installed; only evidenced ready entries can be selected;
support files preserved; unchanged user skills and destination boundaries; exact source
hashes; truthful counts and pending review status.
Verification: Node 22.23.2 via fnm, matching `.nvmrc`. Installer regression reproduced
against the old implementation in a temporary home: it installed undeclared material.
The replacement tests cover candidate exclusion, passport gates, source identity and
references, ready fixtures, dry run, support copying, existing user work, changed bytes,
Windows junctions and unknown options. Ready fixture evidence is synthetic test data.
Eight Node tests passed. All four skills passed skill-creator quick validation using
Python UTF-8 mode; the validator's Windows default encoding initially failed on a curly
quote in continuity-check. Prettier formatted the explicit deliverables. Secret checks
remain enabled for staging and commit.
Rollback: revert this slice's explicit files; no user-home install or production effect.
Skills: skill-creator workflow for portable instructions and support examples; humanizer
for prose. Emil/Apple guidance from the earlier proposal has no UI runtime in this slice.
Budget/stop: one lead, text edits and small local Node/Python checks; no dependency install,
build fanout, servers, media generation or new worktree. Stop before release or migration.

## What changed

- `world-build` revises the existing candidate; its old source is pinned in its passport.
- `continuity-check`, `scene-to-media` and `quest-adapt` are newly authored procedures
  using the same original Tideglass example. Earlier sources are preserved for review.
- Passports are pending for rights, behavioral evaluation and independent provider review.
- Installer/API use the catalog instead of scanning or advertising every legacy folder.
- Manifest excludes legacy directories and marks the package private pending release.
  Legacy MIT metadata is unchanged; this is not a legal clearance decision.

## Verification boundaries and dependencies

Worked examples are author-created; no independent behavioral evaluation is claimed.
Source hashes bind declared evidence to files but cannot authenticate those declarations.
Local CLI checks do not establish full app lint/typecheck/build, required CI checks,
different-harness sign-off, harness compatibility or creator value in actual use.
Quest instructions preserve an existing engine/Realm Graph contract; this slice does not
supersede #421 WorldPack MCP work or #388 MCP refactoring. No live game was tested.

The launcher checkout remains another harness's branch with no origin; its routing check
holds. No guessed remote or launcher write was made. Other app roots/plugin manifests,
working-set links, source salvage and the fold remain open. Rights and Heart-frequency
rulings remain Frank's decisions; this slice uses no official mythology.

The hub handover at `frankxai/agentic-ops-hub` is required at slice close. Its exact session,
ledger and next-prompt files are held by another active lane as of this slice's check,
so this continuation must be appended there when ownership clears. Preserve the earlier
Arcanea handover and other current prompts. Update existing issue #276 with this evidence.

Next bounded action: run forward evaluations from fresh requests against pinned candidate
bytes, record outputs and failure cases, obtain independent review and rights decisions,
then reconcile existing skill variants before promotion. Keep this package private and
candidates internal while those gates are open.

## Fresh requests and independent-review attempt

Continuation base: `ecb22a33a3bfb8becd77c5c02966c6122f8c86b9`. Current main observed
on 2026-10-01: `ed25729ceaee02f6c622119edd0c34ef9987f785`; the added MCP reader
documentation commit changes no files in this candidate package. This branch has
not been rebased or integrated into main.

Prepared four original Ember Post requests and explicit rubrics in
`packages/arcanea-skills/evals/creator-smoke-2026-10-01.json`, with committed source
and aggregate skill hashes. Cases cover accepted facts/authorized revisions,
contradictions/false positives/manuscript injection, media fidelity/unknown rights,
and an existing quest state format/reachable endings/unavailable transmission.

One independent-provider attempt requested Sonnet 4.6 through Claude Code 2.1.286,
using the repo kernel and Senior review routing. It ran with no tools, MCP loading
or slash commands and reached the 300-second timeout with zero stdout bytes.
The session-owned process was terminated. No outputs, findings, model receipt,
cost receipt or sign-off were obtained. $3 was a configured maximum, not known
spend. Actual served model and failure cause remain unknown. No second run was
started. The original packet exposed all cases and checks to the reviewer; a
repeat must isolate contexts and hide rubrics from the producer.

Highest evidence: pinned source, prepared cases, local regression tests and a
failed CLI attempt receipt. Zero cases executed, no behavioral pass claimed.
Passports remain pending, package private, all four candidates internal. Existing
11 Node tests passed again before this documentation-only continuation. No app
build/typecheck/lint, CI, real-home install, rights decision or public release.

The hub lane was free at this continuation's check. Save the attempt and next
action in its existing session/ledger/prompt and comment on issue #276. This
supersedes the earlier hub-ownership hold without erasing that observation.
Rollback: revert these four evidence/documentation files. Next: restore a bounded
review harness, run isolated saved requests and resolve rights before promotion.
