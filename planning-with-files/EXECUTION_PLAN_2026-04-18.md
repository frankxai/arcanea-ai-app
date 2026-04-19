# Multi-Luminor Sprint — Execution Plan 2026-04-18

> Active execution plan. Sprint plan is in `MULTI_LUMINOR_SPRINT_PLAN_2026-04-18.md`.
> This file tracks the concrete moves per phase.

## Goal

Wire the existing swarm engine into `/chat` so creators see 2-5 Luminors collaborate in
real time. Unify tool definitions. Add observability. Ship behind a feature flag.

## Status: IN PROGRESS

| Phase | Name | Status | Notes |
|---|---|---|---|
| 0 | Prep | complete | Planning files written, disk state verified |
| 1 | Unify handoff + resolve duplicates | in_progress | Start here |
| 2 | Wire swarm engine into chat | pending | SSE streaming |
| 3 | Planner-as-LLM | pending | Haiku classifier |
| 4 | Visible trace UI | pending | Side-by-side streams |
| 5 | Trace persistence | pending | `chat_traces` table |
| 6 | MCP tool exposure | pending | Expose via @arcanea/arcanea-mcp |
| 7 | Observability | pending | Langfuse or in-house |
| 8 | Evals | deferred | Next sprint |

## Phase 1 — Tool consolidation (concrete moves)

### Current duplication

| Tool | Definition in `lib/chat/tools.ts` | Definition in `lib/luminors/` |
|---|---|---|
| `handoff_to_luminor` | Yes, line 337 — returns structured payload | Yes in `handoff-tool.ts` — fetches external URL |
| `search_vault` | Yes, line 346 — live, works | No |
| `save_to_vault` | Yes, line 263 — live, works | No |
| `memory_store` | Yes, line 450 — user_memories | No |
| `update_memory` (Letta) | No | Yes in `memory-edit-tool.ts` — luminor_memory_blocks |
| `web_search` | Yes, line 198 — live, Tavily/Brave | Stub in `tool-resolver.ts` line 50 |
| `image_generate` | Yes, line 180 — live | No |
| `deep_research` | Yes, line 222 — live | No |
| Domain tools (suggest_code, describe_asset, create_outline, cite_source) | No | In `tool-resolver.ts` |

### Target structure

```
apps/web/lib/luminors/tools/
  index.ts       — buildLuminorTools(ctx): LuminorToolSet — canonical factory
  handoff.ts     — handoff_to_luminor (from chat/tools.ts — better shape)
  vault.ts       — search_vault + save_to_vault (from chat/tools.ts)
  memory.ts      — memory_store (user_memories) + update_memory (Letta block)
  web.ts         — web_search + deep_research (from chat/tools.ts)
  image.ts       — image_generate (from chat/tools.ts)
  domain.ts      — suggest_code, describe_asset, create_outline, cite_source
  types.ts       — shared types and context interfaces
```

### Moves

1. Create `lib/luminors/tools/types.ts` with canonical `LuminorToolSet` + `LuminorToolContext`
2. Create `lib/luminors/tools/{handoff,vault,memory,web,image,domain}.ts` — each exports a `build*()` function
3. Create `lib/luminors/tools/index.ts` with `buildLuminorTools(ctx)` factory
4. Rewrite `lib/chat/tools.ts` as thin adapter: `createChatTools()` calls `buildLuminorTools()` with chat context
5. Rewrite `lib/luminors/tool-resolver.ts` to call `buildLuminorTools()` instead of building inline
6. Delete `lib/luminors/handoff-tool.ts` (orphaned, inferior)
7. Delete `lib/luminors/memory-edit-tool.ts` once migrated into `tools/memory.ts`
8. Build `apps/web` — must pass before Phase 2

### Callers that must keep working

- `app/api/ai/chat/route.ts` — `createChatTools()` at line 638, reads `chatToolSet.*`
- `app/api/agents/[id]/execute/route.ts` — `resolveToolsForLuminor()` at line 483

### Success criteria

- [ ] Build clean
- [ ] `createChatTools()` signature unchanged (backward compat)
- [ ] `resolveToolsForLuminor()` signature unchanged (backward compat)
- [ ] All 7 chat tools still accessible via `createChatTools()`
- [ ] All Luminor tools still accessible via `resolveToolsForLuminor()`
- [ ] No new dependencies
- [ ] Handoff uses the better shape (structured payload, not external fetch)

## Phase 2 — Wire swarm into chat

### Approach

1. New route: `apps/web/app/api/chat/swarm/route.ts` — streams SSE
2. Event types:
   - `{ type: 'plan', mode, luminors }` — planner output
   - `{ type: 'luminor_start', id, name, guardian }`
   - `{ type: 'luminor_token', id, delta }`
   - `{ type: 'luminor_tool', id, tool, input, output }`
   - `{ type: 'luminor_done', id, tokensIn, tokensOut, durationMs }`
   - `{ type: 'synthesis_start' }`
   - `{ type: 'synthesis_token', delta }`
   - `{ type: 'done', traceId, totalMs, totalTokens }`
   - `{ type: 'error', message }`
3. Parallel `streamText({ model, ... })` per Luminor — merge via tagged async iterator
4. Synthesis step is itself `streamText` with Lumina system prompt
5. Feature flag: `ARCANEA_SWARM_MODE` env var OR `?swarm=1` query param

## Working notes

- RAM: 2.5GB free — work sequentially, no parallel agents
- Linter reversion risk on lib/chat/tools.ts — commit fast
- Don't break `/api/agents/[id]/execute` — it's used by handoff already
