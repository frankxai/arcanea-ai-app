# Current State - 2026-04-02

## Control Plane

- Repo-level agent contract now lives in `AGENTS.md`
- `planning-with-files/` is the live execution control plane
- `.arcanea/` remains the shared intelligence substrate
- `main` now also contains the verified SIS runtime/write-path tranche:
  - `.nvmrc` pinned to Node 20
  - CI rejects `npm` usage and treats typecheck as a real gate
  - canonical SIS write/read/schema/legacy-export tooling exists under `scripts/`
  - clean-worktree SIS verification now degrades gracefully when local-only config files are absent
- Tool-specific entrypoints should point to the same hierarchy:
  - `CLAUDE.md`
  - `.claude/CLAUDE.md`
  - `.arcanea/CLAUDE.md`
  - `.cursorrules`
  - `.codex/instructions.md`
  - `.gemini/instructions.md`
- SIS bridge scripts now exist locally to expose canonical `~/.starlight` state into Arcanea:
  - `scripts/sis-context-bridge.mjs`
  - `scripts/sis-mcp-server.mjs`
  - `scripts/sis-check.mjs`
  - `scripts/sis-write.mjs`
  - `scripts/sis-schema.mjs`
  - `scripts/sis-schema-check.mjs`
  - `scripts/sis-legacy-export.mjs`
  - `scripts/arcanea-memory-compat-mcp.mjs`

## Branch State

- Former dirty local trunk has been moved to `integration/agent-control-plane-unification`
- Remote `main` already contains the verified project-workspace, retrieval, trace, media, and planning slices
- Current local branch contains pushed docs-system hardening and agent-control-plane work
- Remaining loose research scripts have been quarantined outside the production `scripts/` surface

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
- A clean promotion slice now exists on `feat/docs-graph-retrieval` to fold docs into the main project graph spine
- That slice wires docs into workspace snapshots, graph enrichment, and project-aware chat retrieval instead of leaving docs as an isolated route
- `/projects/[id]` now exposes linked docs directly on the workspace page with first-class create/view actions
- The docs creation flow now follows the canonical API envelope correctly, and doc saves only create new content versions when the body actually changes
- Verification for the isolated docs slice has completed:
  - `pnpm --dir apps/web test:projects`
  - `pnpm --dir apps/web type-check`
- Integration commit review has been split into a promote-next tranche versus hold/archive in `planning-with-files/INTEGRATION_TRANCHE_REVIEW_2026-04-03.md`
- SIS context can now be materialized into `.arcanea/sis/summary.md` and exposed over a local MCP server
- SIS can now also append validated canonical entries and export a legacy `.arcanea/memory/` compatibility view without committing generated local state
- Experimental NFT/agent spreadsheet generators now live under `.arcanea/experiments/nft-agent-research/`

## Immediate Risks

- Tool-specific agent docs were drifting and had stale design/product guidance
- CI/workflow changes are now partly promoted, but the broader `integration/agent-control-plane-unification` branch still contains mixed voice/buddy/Luminor work that should not be merged wholesale
- Some recent voice/buddy/runtime commits on this integration branch still need repo-by-repo promotion judgment against `main`

## Recommendation

1. Keep broader voice/buddy/Luminor work on `integration/agent-control-plane-unification`
2. Treat `main` as the stable trunk for:
   - project workspaces
   - docs hardening
   - SIS runtime and CI discipline
3. Do live Supabase activation in the evening
4. Then continue docs/retrieval/enrichment on top of the real DB
5. Review the remaining integration-only commits one by one before any further promotion
