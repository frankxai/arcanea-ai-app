# Current State — 2026-05-22 — Live Surfaces and Voice Support

## Proven facts

- `C:/Users/frank/Arcanea/.claude/worktrees/agent-a655583c199bc0a3d` is the live Claude worktree.
- Its branch is `worktree-agent-a655583c199bc0a3d`.
- The branch head is `5f3c117f` and the current code target is `packages/arcanea-voice/src/server.mjs`.
- `arcanea-orchestrator status` now prints live Claude / Antigravity activity.
- `arcanea-orchestrator status` now labels git worktrees with explicit health and no longer buries the state in raw git noise.
- `pnpm agents:surface` writes the machine snapshot to `~/.arcanea/machine/agent-surface-status.json`.
- `pnpm --filter @arcanea/orchestrator test` is green after switching the test runner wrapper to `node --import tsx --test`.
- Antigravity is live under `agy` and is no longer treated as Gemini CLI in routing or doctor output.
- **NEW:** The `.arcanea/hooks/post-chapter-commit.sh` hook is fully verified and functional. Running deliberation on `book/forge-of-ruin/chapters/00-prologue.md` successfully spins up the stdio MCP server for `@arcanea/author-council` and writes the comprehensive markdown deliberation audit to `book/forge-of-ruin/council-audits/2026-05-22-00-prologue.md`.
- **NEW:** The premium Next.js Vercel template in `c:\Users\frank\arcanea-templates\templates\cosmic-landing\` has been successfully staged, committed, and pushed to the remote repository.

## Quality bar

- Support the active Claude voice branch without interfering with the branch-local implementation.
- Keep live-surface output truthful, concise, and resilient to local checkout health issues.
- Use file-backed handoff artifacts so the next session can resume without re-discovery.

## Working constraints

- Memory is below the parallel threshold, so the current session is sequential.
- The repo is dirty; do not widen the blast radius.
- Treat worktree health as ecosystem hygiene, not as a reason to rewrite unrelated code.
