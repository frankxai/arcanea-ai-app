# Code standards proposal — 2026-09-05

State: IN_PROGRESS; reversible branch proposal. This record describes the proposed change, not a production release or a refreshed whole-repository inventory.

## Contract

- Scope: CI result integrity, changed-file formatting, runtime instructions, and safe Git recovery.
- Owner: Codex implementation; independent code reviewer in this task.
- Files: `.github/workflows/ci.yml`, `scripts/check-changed-format.sh`, `scripts/tests/changed-format.test.mjs`, `AGENTS.md`, `CLAUDE.md`, and this record.
- Acceptance: Git and formatter failures propagate; unusual tracked paths remain intact; runtime-compatible cache keys agree; install success is required directly; existing build/lint/typecheck requirements remain in place.
- Rollback: revert this bounded proposal. No data migration, product runtime, or deployment-topology change.

## Changes

Formatting now resolves the exact base and head, materializes the NUL-delimited Git diff, and fails if comparison or Prettier fails. The former process substitution could hide a Git failure behind a successful empty read. Tests cover spaces, newlines, option-like filenames, missing bases, a failed diff process, formatter failure, deletion, and rename.

TypeScript uses Turbo's exit code directly instead of deciding success from a diagnostic count. Dependency cache keys include platform, architecture, Node, pnpm, and lockfile. Checkout credentials are not persisted and workflow permissions are read-only.

The aggregate requires installation as well as lint, typecheck, and build. Cached downstream jobs cannot make a failed installation appear successful. Node instructions read `.nvmrc`; Git locks require investigation of the owning operation before removal.

## Verification and remaining gates

The focused formatting suite passes six tests; Bash syntax passes. Independent review verified the actual aggregate shell rejects failed, cancelled, or skipped installation while downstream jobs report success.

Full application build, lint, and typecheck remain required before merge; the local source snapshot is partial. GitHub CI and repository protection must be checked on the final proposed revision. No production claim follows from these focused tests.

Pending cost-control PR #334 overlaps CI and proposes draft skips. Reconcile it explicitly during review; preserve earned aggregate results and do not treat equality with a local main ref as evidence of what Vercel deployed.
