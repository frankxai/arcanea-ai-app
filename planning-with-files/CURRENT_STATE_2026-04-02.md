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
- New clean worktree branch `feat/run-graph-control-plane` isolates the run graph tranche away from dirty `main`
- Remote `main` already contains the verified project-workspace, retrieval, trace, media, and planning slices
- Current local branch contains pushed docs-system hardening and agent-control-plane work
- Remaining loose research scripts have been quarantined outside the production `scripts/` surface

## What Is True Now

- Arcanea mainline product center is still `arcanea-ai-app`
- The first durable project run graph slice now exists in a clean promotion branch:
  - run migration
  - run APIs
  - run status pages
  - explicit cost preflight
  - run graph persistence into `project_graph_edges`
- Verified `main` already includes:
  - project workspaces
  - project graph APIs
  - project-aware retrieval
  - trace and enrichment scaffolding
  - gallery cleanup
  - planning control files
- Live Supabase activation is still the main external blocker for the project graph
- Claude is now adding notes/docs and agent-ops work locally
- SIS context can now be materialized into `.arcanea/sis/summary.md` and exposed over a local MCP server
- SIS can now also append validated canonical entries and export a legacy `.arcanea/memory/` compatibility view without committing generated local state
- Experimental NFT/agent spreadsheet generators now live under `.arcanea/experiments/nft-agent-research/`
- The root `main` worktree is no longer safe for substantial edits because concurrent work there includes unresolved merge state

## Immediate Risks

- Tool-specific agent docs were drifting and had stale design/product guidance
- CI/workflow changes are now partly promoted, but the broader `integration/agent-control-plane-unification` branch still contains mixed voice/buddy/Luminor work that should not be merged wholesale
- Some recent voice/buddy/runtime commits on this integration branch still need repo-by-repo promotion judgment against `main`

## Recommendation

1. Keep broader voice/buddy/Luminor work on `integration/agent-control-plane-unification`
2. Use clean worktrees for new product slices instead of touching the dirty root `main` worktree
3. Treat `main` as the stable trunk for:
   - project workspaces
   - docs hardening
   - SIS runtime and CI discipline
4. Promote the run graph tranche from `feat/run-graph-control-plane`
5. Do live Supabase activation in the evening
6. Then continue docs/retrieval/enrichment on top of the real DB
7. Review the remaining integration-only commits one by one before any further promotion
