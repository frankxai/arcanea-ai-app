# SIS And Memory Architecture

Generated: 2026-06-12
Status: canonical direction for memory cleanup and integration

## Summary

SIS is the vendor-agnostic continuity substrate for Arcanea. It should provide
the durable context that survives model changes, tool changes, branch churn, and
session compaction.

Arcanea currently has multiple memory-related packages and docs. The rule going
forward is simple: SIS is canonical; package-level memory systems either
integrate with SIS or are treated as legacy/adapters.

## Memory Types

| Type        | Lifetime           | Purpose                                                         |
| :---------- | :----------------- | :-------------------------------------------------------------- |
| `decision`  | durable            | Product, architecture, naming, licensing, and policy decisions  |
| `feedback`  | durable            | Frank preferences, quality bar, taste, and repeated corrections |
| `reference` | durable            | Stable external or internal references                          |
| `project`   | 14-day default TTL | Session snapshots, sprint notes, branch state, temporary plans  |
| `archive`   | cold storage       | Expired project context retained for archaeology                |

## Required Protocol

- Every memory entry that cites current state should include a `Decays-when:` line.
- `project_*` entries decay after 14 days unless promoted.
- `decision` and `feedback` entries remain in the live index.
- `MEMORY.md` must be reconciled against disk at handoff.
- Drift greater than 5 unindexed entries should block "memory healthy" claims.
- Memory claims should include provenance: how the agent learned the fact.

## Integration Points

- `pnpm run sis:sync`: refresh shared context.
- `pnpm run sis:append`: append new SIS memory or context records.
- `pnpm run sis:check`: validate SIS health.
- `pnpm run sis:contracts`: validate task-contract metadata.
- `packages/memory-mcp`: MCP bridge for memory access.
- `packages/hybrid-memory` and `packages/guardian-memory`: adapters or legacy layers until explicitly reconciled.

## Cleanup Backlog

1. Reconcile `MEMORY.md` drift against all memory files on disk.
2. Add TTL/decay handling for stale `project_*` entries.
3. Promote durable decisions and feedback out of project snapshots.
4. Resolve the vault path mismatch noted in the May 6 memory audit.
5. Wire Arcanea workflow packages to SIS instead of re-implementing continuity.
6. Add a memory hygiene check to session handoff.

## Acceptance Criteria

Memory is healthy when:

- indexed memory matches disk within the allowed drift threshold
- old project snapshots do not crowd out durable decisions
- agents can find the latest current state without reading stale session dumps
- SIS is the source of continuity for Arcanea OS, not a parallel system
