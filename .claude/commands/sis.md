---
description: Starlight Intelligence System — recall, search, confirm, or contradict SIS entries. Default subcommand is `recent`.
---

# /sis — Starlight Intelligence System

Thin wrapper over the `mcp__starlight-sis__*` MCP tools. Use for fast cross-session recall of decisions, insights, and facts recorded through session hooks or explicit saves.

## Subcommands

Parse `$ARGUMENTS` for the first word; default to `recent` if empty.

### `recent [N]`
Show the last N SIS entries (default 10).
```
mcp__starlight-sis__sis_recent_entries(limit=N)
```
Render as table: date · type · summary (first 80 chars of body).

### `search <query>`
Full-text search across SIS entries.
```
mcp__starlight-sis__sis_search(query="<query>")
```
Also offer to run `sis_vault_search` for matching vault JSONL entries.

### `stats`
Show entry counts by type, entries added this week, and stale-entry count.
```
mcp__starlight-sis__sis_stats()
mcp__starlight-sis__sis_stale()
```

### `confirm <id>` / `contradict <id>` / `invalidate <id>`
Mark an entry status — routes to the matching MCP tool.

### `types`
List all SIS entry types in the schema.
```
mcp__starlight-sis__sis_entry_types()
```

### `append <type> <body>`
Write a new SIS entry. Requires a type from `types`.
```
mcp__starlight-sis__sis_append_entry(type="<type>", body="<body>")
```
Use sparingly — most entries should come from session hooks, not manual saves.

## Relationship to Other Commands

- `/sis` reads the SIS **entry stream** (session hooks populate this automatically)
- `/starlight-vault` reads the `~/.starlight/vaults/*.jsonl` **insight vaults** (populated by `/handover`)
- `/handover` writes to both

SIS = event log. Vaults = distilled wisdom. Use `/sis recent` to see what the last session hook captured; use `/starlight-vault search` to find decisions.

Related: `/ao` routes work to CLIs, `/pulse` shows life-domain scorecard, `/arcanea-status` shows repo + memory state including latest SIS entries.
