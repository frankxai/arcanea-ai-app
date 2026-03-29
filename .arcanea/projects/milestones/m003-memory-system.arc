---
milestone: M003
title: Memory System
guardian: Lyria
gate: Sight
priority: P1
progress: 75%
updated: 2026-03-30
---

# M003: Memory System

## Status: 75%

## Completed Tasks
- [x] AgentDB memory with HNSW search operational (pre-2026-03-30)
- [x] Starlight Vault instinct fragments system (pre-2026-03-30)
- [x] Memory sync MCP tools (vault_remember, vault_recall, vault_recent, vault_classify, vault_stats) (pre-2026-03-30)
- [x] Horizon memory (horizon_append, horizon_read) (pre-2026-03-30)
- [x] Memory file index system (C:\Users\frank\.claude\projects\...\memory\MEMORY.md) (pre-2026-03-30)

## Remaining Tasks
- [ ] Build `@arcanea/memory-mcp` package
  - **Blocked by**: None
  - **Owner**: agent
  - **Estimate**: 4-6 hours
  - **Details**: Standalone MCP server package for memory operations, publishable to npm
- [ ] Implement `starlight horizon share` command
  - **Blocked by**: @arcanea/memory-mcp package
  - **Owner**: agent
  - **Estimate**: 2-3 hours
  - **Details**: Cross-session memory sharing between agents
- [ ] Web API for memory access
  - **Blocked by**: @arcanea/memory-mcp package
  - **Owner**: agent
  - **Estimate**: 3-4 hours
  - **Details**: REST/GraphQL API endpoints for memory queries from the web app

## Dependencies
- Depends on: None
- Blocks: None directly (but enhances all AI features)

## Key Files
- `.arcanea/starlight-vault/` — Instinct fragments storage
- `packages/` — Target location for @arcanea/memory-mcp
- MCP tools: arcanea-memory (vault_*, horizon_*, memory_sync)

## Notes
The memory system is operationally functional with MCP tools and file-based storage. The remaining work is packaging it as a standalone npm package, adding the share command, and exposing a web API for the frontend to query memory state.
