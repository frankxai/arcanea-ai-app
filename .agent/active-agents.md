# Active Agents — arcanea-ai-app

Git coordination ledger. Updated per AGENTS.md §4 protocol.

## Branch: claude/arcanea-kraken-monster-system-t24p73

| Agent | Harness | Scope | Status |
|---|---|---|---|
| Claude | Claude Code | Conductor — schema, TypeScript types, route stubs, DAM, docs | ACTIVE |
| Codex | OpenAI Codex | Executor — service tests, seed scripts, build validation | STANDBY |

## Scope partitions (never overlap)

**Claude owns:**
- `supabase/migrations/`
- `apps/web/lib/atlas/**`
- `apps/web/app/atlas/**`
- `apps/web/docs/**`
- `apps/web/lib/media/image-registry.ts`
- `.agent/**`

**Codex owns:**
- `tests/atlas/**`
- `scripts/seed-atlas.mjs`
- `apps/web/lib/atlas/__tests__/**`

## Coordination protocol

1. Check this file before starting work.
2. Claim a scope partition by adding a row.
3. Never commit to a file another live agent is mid-rewrite on.
4. Integrate through `pnpm build` gate before merging overlapping scopes.

## Notes

- Push target: `origin` only. Never `records`.
- pnpm only — never npm install in this repo.
- Dev server (`pnpm dev`) — only when actively testing UI; kill after.
- RAM ceiling: 16 GB. Max 4-5 concurrent instances. Check `cat /proc/meminfo | grep MemFree` before spawning.
