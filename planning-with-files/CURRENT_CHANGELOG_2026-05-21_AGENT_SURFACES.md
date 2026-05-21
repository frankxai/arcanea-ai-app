# Current Changelog — 2026-05-21

## Live agent visibility

- Added a reusable live-surface probe for Claude Code and Antigravity.
- `arcanea-orchestrator status` now prints current process, worktree, and session summaries.
- `pnpm agents:surface` writes `~/.arcanea/machine/agent-surface-status.json`.
- `pnpm agents:surface:watch` refreshes that snapshot continuously.

## Runtime shift

- Arcanea orchestrator runtime routing now treats Google-backed tasks as `agy` / Antigravity CLI instead of Gemini CLI.
- `arcanea-orchestrator doctor` and install docs now reflect the Antigravity runtime surface.

