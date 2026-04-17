# AMCAS Progress — 2026-04-18 Overnight Session

## Phase Status

| Phase | Status | Commit | Notes |
|-------|--------|--------|-------|
| A. Tests | ✅ DONE | (cherry-picked) | 29 tests, 100% green. 21 orchestrator + 8 router-spec. |
| B. Planner | ✅ DONE | `7fac6ef0` | `plan <goal>` decomposes via claude -p (haiku-4-5). Verified live on "add a /pricing page" → 4 sensible tasks. |
| C. History + stats | ✅ DONE | (bundled in D) | Reasoning bank at `~/.arcanea/history.jsonl`. run auto-logs. history + stats commands. |
| D. Publish v1.1.0 | ✅ DONE | `d9ccc2d9` | `@arcanea/orchestrator@1.1.0` live on npm. Installs cleanly. |
| E. Docs + handover | ✅ DONE | (this commit) | README + CHANGELOG + HANDOVER_2026-04-18_AM.md. |
| F. Final push | ✅ DONE | (this commit) | Working tree clean. origin/main ahead. |

## Session log

**2026-04-18 00:30** — Planning files created. Starting Phase A.
**00:45** — Phase A: 29 tests passing (8 router-spec + 21 orchestrator). First commit.
**01:15** — Phase B: Planner built. Live test against "add a /pricing page" returned 4 valid tasks: research.quick → code.frontend → nav.fast → code.review. Gotcha: claude -p hangs on stdin without explicit `stdin: 'ignore'`. Fixed. Committed.
**02:00** — Phase C: history.ts + commands/history.ts + commands/stats.ts. run.ts instrumented. First event logged at 22:58:12. Committed.
**02:30** — Phase D: v1.1.0 published to npm. Verified `npm i -g @arcanea/orchestrator@1.1.0` installs + works.
**02:45** — Phase E: README updated, CHANGELOG added, HANDOVER doc written.

## Errors encountered

| Phase | Error | Attempts | Resolution |
|-------|-------|----------|------------|
| A | `tsx --test tests/*.test.ts` glob didn't expand on Windows | 1 | Use explicit filenames in script |
| B | `claude -p` hung with "no stdin data received in 3s" warning | 1 | Pass `stdin: 'ignore'` to execa |

## Decisions (also in findings)

| Decision | Rationale |
|---|---|
| Use node's built-in test runner via tsx | Zero new deps |
| JSONL for history (not SQLite) | Filesystem-native, grep-friendly |
| `--no-history` opt-out, not opt-in | Learning needs data by default |
| Log at `~/.arcanea/history.jsonl` | Co-locate with config.yaml |
| Planner uses `claude -p` + haiku-4-5 | Max sub covers it, cheap/fast |
| Planner emits JSON | Easier to pipe + validate |
| Silent history write failures | Never break a dispatch over a log write |
| 10MB rotation, keep 3 archives | Reasonable upper bound, won't fill disk |
