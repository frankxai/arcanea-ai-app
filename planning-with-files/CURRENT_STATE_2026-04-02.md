# Current State - 2026-04-02

## Control Plane

- Repo-level agent contract now lives in `AGENTS.md`
- `planning-with-files/` is the live execution control plane
- `.arcanea/` remains the shared intelligence substrate
- Tool-specific entrypoints should point to the same hierarchy:
  - `CLAUDE.md`
  - `.claude/CLAUDE.md`
  - `.arcanea/CLAUDE.md`
  - `.cursorrules`
  - `.codex/instructions.md`
  - `.gemini/instructions.md`

## Branch State

- Former dirty local trunk has been moved to `integration/agent-control-plane-unification`
- Remote `main` already contains the verified project-workspace, retrieval, trace, media, and planning slices
- Current local branch also contains new uncommitted Claude docs-system work and agent-ops work that still needs scoped review before promotion

## What Is True Now

- Arcanea mainline product center is still `arcanea-ai-app`
- Verified `main` already includes:
  - project workspaces
  - project graph APIs
  - project-aware retrieval
  - trace and enrichment scaffolding
  - gallery cleanup
  - planning control files
- Live Supabase activation is still the main external blocker for the project graph
- Claude is now adding notes/docs and agent-ops work locally

## Immediate Risks

- Large uncommitted feature work landed locally without a clean promotion branch
- Tool-specific agent docs were drifting and had stale design/product guidance
- CI/workflow changes from the current local work still need scoped review before trust

## Recommendation

1. Keep all current local work on `integration/agent-control-plane-unification`
2. Normalize agent instructions first
3. Review Claude docs-system work into a scoped promotion branch
4. Do live Supabase activation in the evening
5. Then continue docs/retrieval/enrichment on top of the real DB
