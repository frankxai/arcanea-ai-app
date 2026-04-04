# SIS Forward Plan

Date: 2026-04-02
Status: Local bridge + MCP working, operator surface stabilized

## What Is Working Now

- Canonical SIS home is `C:\Users\frank\.starlight`
- Bridge generator works:
  - `node scripts/sis-context-bridge.mjs`
- Local MCP server works:
  - `node scripts/sis-mcp-server.mjs`
- Repo health check works:
  - `npm run sis:check`
- Arcanea operator commands now work:
  - `arcanea sis stats`
  - `arcanea sis json`
  - `arcanea sis summary`
  - `arcanea sis sync`

## What Was Fixed Today

1. `arcanea sis <subcommand>` routing
- Root cause: brittle PowerShell argument handling collapsed single-item arrays into scalars.
- Fix: moved to explicit `ValueFromRemainingArguments` binding and forced array materialization.

2. `sis-bootstrap.ps1` stats path
- Root cause: stats depended on piping into the MCP server for simple local status reads.
- Fix: stats now read directly from the generated snapshot instead of invoking MCP.

3. PowerShell compatibility
- Root cause: use of `??` caused parse failure on this PowerShell version.
- Fix: replaced with compatible conditional logic.

## Current Verification Commands

Run these when validating the local SIS stack:

```powershell
npm run sis:check
& .\.arcanea\scripts\arcanea.ps1 sis stats
& .\.arcanea\scripts\arcanea.ps1 sis json
& .\.arcanea\scripts\arcanea.ps1 status
```

## Current Data Snapshot

- Total vault entries: 15
- Patterns: 6
- Latest eval: `2026-04-02-001.json`

Vault counts:
- strategic: 4
- technical: 5
- creative: 3
- operational: 3
- wisdom: 0
- horizon: 0

## Next High-Value Engineering Steps

1. Add write-path tooling
- Add a safe CLI or MCP write tool for appending structured entries into canonical `~/.starlight`
- Do not keep SIS read-only forever

2. Separate snapshot JSON from human export JSON
- `arcanea sis json` currently dumps the full snapshot
- Add a lighter `stats-json` mode for dashboards and scripts

3. Unify old memory-system and canonical Starlight
- Current state is two memory models:
  - older Arcanea memory packages
  - canonical `~/.starlight`
- Build one compatibility layer or migration path

4. Add contract tests for local configs
- verify `.mcp.json`
- verify `.opencode/opencode.json`
- verify `arcanea-code/.arcanea/arcanea.jsonc`
- verify launchers export `STARLIGHT_HOME`

5. Add richer vault semantics
- define stable schemas for:
  - project learnings
  - routine learnings
  - state learnings
  - creative prompt packs

## Recommended Near-Term Focus

Prioritize this order:

1. SIS write-path and schema contracts
2. config contract tests
3. memory-system unification
4. Vibe OS integration once read/write path is stable

## Acceptance Standard For “Good SIS”

Call SIS healthy when:

- one canonical memory home exists
- all local tools read from it
- at least one supported write path exists
- checks are automated
- app integrations do not fork the schema
