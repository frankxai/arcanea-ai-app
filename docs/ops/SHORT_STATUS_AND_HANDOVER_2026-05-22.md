# Short Status And Handover — 2026-05-22

## Current state

- Claude Code is active and supported.
- Live surface probe is working and separates Claude from Antigravity by process, worktree, and session artifacts.
- Claude's active worktree is `C:/Users/frank/Arcanea/.claude/worktrees/agent-a655583c199bc0a3d` on branch `worktree-agent-a655583c199bc0a3d`.
- That branch is working on `packages/arcanea-voice/src/server.mjs`.
- Antigravity is also active through `agy`.
- `arcanea-orchestrator status` shows both live surfaces.
- `arcanea-orchestrator status` now labels each listed worktree with explicit health.
- `pnpm --filter @arcanea/orchestrator test` is green on Windows after switching the test wrapper to `node --import tsx --test`.

## What changed

- Added `pnpm agents:surface` and `pnpm agents:surface:watch`.
- Wrote `~/.arcanea/machine/agent-surface-status.json` and `.txt`.
- Wired `arcanea-orchestrator status` to show live Claude / Antigravity context.
- Hardened `arcanea-orchestrator status` so worktree health is explicit instead of noisy.
- Fixed the orchestrator test runner wrapper so it no longer depends on a pnpm child-process PATH lookup.
- Routed Google-backed orchestrator runtime handling to `agy` / Antigravity CLI.
- Updated agent bootstrap notes so the live surface probe is discoverable.

## What Claude should pick up next

1. Keep the `@arcanea/voice` B3-lite branch moving, but avoid touching its active file unless the change is support work.
2. Auto-start the live-surface watcher at login so the snapshot stays fresh without a manual command.
3. Tighten antigravity task summaries if a cleaner title source is found in its logs.

## Verification

- `pnpm --filter @arcanea/orchestrator test`
- `pnpm agents:surface`
- `node packages/orchestrator/dist/cli.js status`
