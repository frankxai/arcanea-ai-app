# AMCAS Findings — 2026-04-18

Discoveries, gotchas, and decisions made during overnight autonomous execution.

## Start state (2026-04-18 ~00:30 local)

- `@arcanea/orchestrator@1.0.0` live on npm
- `@arcanea/router-spec@1.0.1` live on npm
- `@arcanea/arcanea-code@0.1.0/1` deprecated with migration message
- Local bin: `arcanea-orchestrator` + `arco` both working via `npm link`
- `claude -p` verified to use Max sub (no BYOK charge)
- Doctor detected all 4 CLIs correctly (claude=sub, opencode=free, codex=byok, gemini=unknown)
- `origin/main` at commit `dd264994` (includes the rename)
- RAM: 3.4 GB free

## Observations

(Populated during execution)

## Errors Encountered

| Phase | Error | Attempt | Resolution |
|-------|-------|---------|------------|
| — | — | — | — |

## Decisions

| Decision | Rationale |
|---|---|
| Use node's built-in test runner (not vitest/jest) | Zero new deps, faster install, stable API |
| JSONL for history (not SQLite) | Filesystem-native, grep-friendly, no schema migration pain |
| `--no-history` opt-out, not opt-in | Learning only works if data collected by default |
| Log to `~/.arcanea/history.jsonl` (same dir as config) | Co-locate user state |
| Planner calls `claude -p` (not OpenAI) | Max sub covers it; keeps costs at ~$0 |
| Planner emits JSON (not YAML) | Easier to pipe to `jq` / `--execute` later |
