---
type: milestone
id: m003-memory-system
project: arcanea
name: Memory System v1 Launch
status: in_progress
gate: sight
guardian: Lyria
element: void
priority: P1
created: 2026-02-27
target: 2026-03-10
progress: 75
tasks:
  - id: t001
    name: StarlightVaults core implementation
    status: done
    note: packages/memory-system/ — 6-vault constellation, ArcaneMD format
  - id: t002
    name: FileBackend with word index
    status: done
    note: 352 lines, hot cache, per-vault index.json
  - id: t003
    name: CLI (starlight binary)
    status: done
    note: remember, recall, stats, horizon, guardians, sync
  - id: t004
    name: MEMORY.md Bridge
    status: done
    note: Auto-syncs vaults → Claude Code 200-line native format
  - id: t005
    name: Integration tests
    status: done
    note: 38/38 passing, zero TS errors
  - id: t006
    name: "@arcanea/memory-mcp server"
    status: pending
    note: MCP server wrapping vault operations
  - id: t007
    name: "starlight horizon share"
    status: pending
    note: CC-BY-SA dataset sharing — the long-term moat
  - id: t008
    name: Web API at arcanea.ai
    status: pending
    depends_on: [m001-supabase-auth]
---

# M003 — Memory System v1 Launch

Sight milestone. Ship the memory system that lets agents and humans share persistent, structured knowledge.

## Context

StarlightVaults is built and tested. The MEMORY.md bridge works. What remains is the MCP server (so other agents can use it), the horizon sharing protocol, and the web API.

## The Moat

HorizonLedger dataset (CC-BY-SA) — "Build the thing that outlasts the thing."
