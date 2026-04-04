# MCP Setup Plan

## Current Baseline

- Project MCP file exists: `.mcp.json`
- Claude project settings already include MCP usage toggles: `.claude/settings.local.json`
- Arcanea-local MCP binaries configured:
  - `arcanea-mcp` -> `packages/arcanea-mcp/dist/cli.js`
  - `arcanea-memory` -> `packages/memory-mcp/dist/server.js`

## Required Build Step

Run these once after pulling changes:

```bash
bash /mnt/c/Users/frank/Arcanea/scripts/setup-mcp.sh
```

If you hit `EIO` in WSL on `/mnt/c`, execute the recovery flow in `planning-with-files/FS_RECOVERY_RUNBOOK.md` before retrying.

## Why These MCPs Matter

1. `next-devtools`: fastest route/runtime diagnosis in Next.js 16.
2. `github`: end-to-end issue/PR automation.
3. `playwright`: browser-truth testing over static HTTP checks.
4. `arcanea-mcp`: Arcanea-native creative/worldbuilding toolchain.
5. `arcanea-memory`: shared persistent memory across agent sessions.
6. `supabase`: schema + data workflows where available.

## Cross-Agent Startup Order

1. Validate filesystem health first (runbook above) whenever I/O instability appears.
2. Run MCP bootstrap (`scripts/setup-mcp.sh`).
3. Confirm clients are aligned:
   - Claude: `.claude/settings.local.json` has `arcanea-mcp` + `arcanea-memory`.
   - Codex: MCP servers visible via `list_mcp_resources`.
   - OpenCode: execute build/validate commands from this repo root.

## Still Worth Building

1. `arcanea-router-mcp`: intelligent Luminor routing with explainable traces.
2. `arcanea-eval-mcp`: quality regression checks and scorecards.
3. `arcanea-vault-mcp`: unified asset provenance and ownership actions.
