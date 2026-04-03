# Current Changelog - 2026-04-02

## Landed Today

- Added the first durable project run graph tranche on `feat/run-graph-control-plane`:
  - `project_runs` and `project_run_events` migration
  - run list/detail APIs
  - cost preflight API
  - run list/detail pages
  - run graph server helpers
  - run API contract tests
- Added direct project workspace navigation into the run layer
- Updated project graph activation to include the run migration
- Moved active local work off `main` onto `integration/agent-control-plane-unification`
- Added repo-level `AGENTS.md` as the top-level agent contract
- Unified agent source-of-truth hierarchy across:
  - `CLAUDE.md`
  - `.claude/CLAUDE.md`
  - `.arcanea/CLAUDE.md`
  - `.cursorrules`
  - `.codex/instructions.md`
  - `.gemini/instructions.md`
- Added fresh planning control files for 2026-04-02 reflecting the new branch posture and review backlog
- Verified the SIS bridge against real `~/.starlight` data and replaced the fragile shell-based MCP smoke check with a Node-based one
- Promoted a second safe tranche to `main`:
  - `.nvmrc` pin for Node 20
  - CI enforcement for pnpm-only usage and blocking typecheck
  - canonical SIS schema/write/export tooling
  - Arcanea memory compatibility MCP bridge
  - clean-worktree-safe SIS contract checks
  - root/app verification remained green after promotion
- Hardened the project docs MVP slice on `integration/agent-control-plane-unification`:
  - normalized docs routes onto the shared API response contract
  - enforced project scoping on doc detail routes
  - fixed the editor payload shape and `novel` command/upload contracts
  - added docs API contract coverage to `pnpm --dir apps/web test:projects`
  - repaired the ops dashboard `worktree.prunable` type mismatch so `tsc --noEmit` is honest again
- Quarantined stray NFT/agent spreadsheet generator scripts into `.arcanea/experiments/nft-agent-research/` and documented them as non-production research artifacts

## Still Pending

- promote `feat/run-graph-control-plane` after review
- scoped review and promotion decision for Claude's notes/docs slice
- live Supabase activation
- real Supabase type regeneration
- line-by-line review of the remaining voice/buddy/Luminor commits on `integration/agent-control-plane-unification`
