# Changelog — @arcanea/orchestrator

## 1.2.0 — 2026-04-18

Adaptive routing + workflow templates.

### Added
- **Adaptive routing (Phase 8).** `run` now re-ranks candidates by local
  `~/.arcanea/history.jsonl` success data — success rate × 10 + speed
  bonus − recent-failure penalty. Never overrides surface/preference, only
  reorders within. Auto-enables at ≥10 events (`adaptiveRouting: auto`
  default). Override: `config adaptiveRouting on|off`.
- **`learn <task>`** — shows baseline vs adaptive ranking side-by-side
  with per-candidate stats (runs, success%, avg ms).
- **Workflow templates.** Three starters in `workflows/`:
  `build-landing-page`, `refactor-typescript-strict`,
  `add-feature-end-to-end`. Variable substitution via `--var key=value`.
- **`workflow list/show/run`** commands.
- Package now ships `workflows/` + `CHANGELOG.md` in the tarball.

### Compatibility
- No breaking changes from 1.1.0.
- Config migration: new optional `adaptiveRouting` key. Default `auto`.

## 1.1.0 — 2026-04-18

Planner + Reasoning Bank.

### Added
- `plan <goal>` — decomposes a high-level goal into 3-7 dispatchable sub-tasks via `claude -p` (haiku-4-5). Emits JSON. `--out <file>` to save, `--dry-run` for template, `--execute` (stub).
- `history [--limit N] [--json]` — reads `~/.arcanea/history.jsonl` and prints recent runs in a table.
- `stats [--json]` — aggregates per-task→model: run count, success rate (color-coded), average duration.
- Every `run` invocation now appends an event to `~/.arcanea/history.jsonl`. Opt out with `--no-history`.
- Automatic log rotation at 10 MB, keeps last 3 archives (`history.jsonl.0`, `.1`, `.2`).

### Tested
- 29 unit + smoke tests across `@arcanea/router-spec` (8) and `@arcanea/orchestrator` (21).
- `pnpm --filter @arcanea/orchestrator test` — passes.
- `pnpm --filter @arcanea/router-spec test` — passes.

### Compatibility
- No breaking changes from 1.0.0. All existing commands work identically.
- New file: `~/.arcanea/history.jsonl`. Safe to delete to reset.

---

## 1.0.0 — 2026-04-18

Rename from `@arcanea/arcanea-code`.

### Changed
- Package name: `@arcanea/arcanea-code` → `@arcanea/orchestrator`.
- Bin names: `arcanea-code` → `arcanea-orchestrator` + `arco` (short alias).
- Log prefix: `[arcanea-code]` → `[arcanea]`.
- Positioning: dispatcher framed as full orchestrator (routes + plans + swarms + learns).

### Deprecated
- `@arcanea/arcanea-code@0.1.x` on npm, with migration message pointing here.

---

## 0.1.1 — 2026-04-17 (as `@arcanea/arcanea-code`)

- Legal/disclaimer sections added to README.
- `files` in package.json trimmed to `dist`, `scripts`, assets.
- LICENSE file included in tarball.

---

## 0.1.0 — 2026-04-17 (as `@arcanea/arcanea-code`)

Initial publish. Commands: `list-models`, `list-tasks`, `explain`, `run`, `swarm` (stub), `doctor`, `config`, `status`.
