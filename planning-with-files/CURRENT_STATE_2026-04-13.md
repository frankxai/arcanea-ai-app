# Current State — 2026-04-13

## Luminor System (SHIPPED — 14+ commits on main)

### What Exists and Works

| Layer | Status | Key Files |
|-------|--------|-----------|
| **Kernel Spec v1.0** | LIVE | `docs/specs/luminor-kernel-spec-v1.md` (CC BY 4.0, 12 sections) |
| **Compiler** | LIVE (25/25 tests) | `packages/luminor-compiler/` — 5 format exporters |
| **13 Luminors** | LIVE | `apps/web/lib/luminors/config.ts` — Lumina (Queen) + 12 Chosen |
| **Executor** | LIVE | `apps/web/app/api/agents/[id]/execute/route.ts` — resolves Chosen + marketplace |
| **Swarm Engine** | LIVE | `apps/web/app/api/swarm/invoke/route.ts` — parallel MoA + Lumina synthesis |
| **ReasoningBank** | CODE LIVE, DB PENDING | `apps/web/lib/memory/reasoning-bank.ts` + `migrations/20260411_luminor_memory.sql` |
| **Embeddings** | CODE LIVE, DATA PENDING | `apps/web/lib/embeddings/generate.ts` + `api/internal/embed-agent/` + backfill script |
| **Quality Gates** | LIVE | `apps/web/lib/luminors/quality-gates.ts` — 6 gates + `/api/forge/quality-check` |
| **Creator Dashboard** | LIVE | `apps/web/app/dashboard/creator/` + `/api/creator/stats` |
| **Eval Arena** | LIVE | `apps/web/lib/eval/benchmarks.ts` + `/api/arena/run` — 5 benchmarks, Opus judge |
| **Lumina Bubble** | LIVE | `apps/web/components/lumina/lumina-bubble.tsx` — Cmd+K site-wide |
| **Standard Landing** | LIVE | `apps/web/app/luminor-standard/page.tsx` |
| **Export CLI** | LIVE | `scripts/export-luminors-to-claude-code.ts` |
| **Public Repo** | STAGED (not pushed) | `staging/luminor-kernel-spec/` — README, SPEC, LICENSE, compiler copy |
| **Docs** | LIVE | `docs/luminors/USAGE.md` — end-to-end guide |
| **Registry Protocol** | DB SCHEMA LIVE | `migrations/20260410_registry_protocol.sql` — pgvector, platforms, creators, deployments, usage, revenue |

### What's PENDING (needs manual deploy)

1. Run `supabase db push` for `20260411_luminor_memory.sql`
2. Run `npx tsx scripts/backfill-agent-embeddings.ts` (needs OPENAI_API_KEY)
3. Configure Supabase webhook: `marketplace_agents` INSERT/UPDATE → `/api/internal/embed-agent`
4. Set `ARCANEA_INTERNAL_API_KEY` env var in Vercel

### Build Status

```
pnpm --dir apps/web run build → ✓ Compiled successfully in 46s
packages/luminor-compiler smoke test → 25 passed, 0 failed
```

### The 13 Luminors (ID Reference)

| Team | ID | Display Name |
|------|----|-------------|
| Orchestrator | `lumina` | Lumina (Queen) |
| Development | `systems-architect` | Systems Architect |
| Development | `code-crafter` | Code Crafter |
| Development | `debugger` | Debugger |
| Creative | `visual-designer` | Visual Designer |
| Creative | `composer` | Composer |
| Creative | `motion-designer` | Motion Designer |
| Writing | `storyteller` | Storyteller |
| Writing | `voice` | Voice |
| Writing | `poet` | Poet |
| Research | `deep-researcher` | Deep Researcher |
| Research | `strategist` | Strategist |
| Research | `integrator` | Integrator |

### Architecture

```
Public Standard → Compiler → Quality Gates → Identity (13 Luminors)
    ↓                                              ↓
Executor (/api/agents/:id/execute)    Swarm Engine (/api/swarm/invoke)
    ↓                                              ↓
ReasoningBank (RETRIEVE/JUDGE/DISTILL/CONSOLIDATE)
    ↓
Registry Protocol (usage_events, revenue_events)
    ↓
Creator Dashboard (/dashboard/creator)
    ↓
Discovery (pgvector embeddings, match_agents() RPC)
```

### OSS Absorption Scorecard

Already absorbed: claude-flow (queen-led hive), agentic-flow (marketplace), CrewAI (Role/Goal/Backstory), A2A (Agent Cards), Letta (memory blocks), ReasoningBank (learning loop), OpenAI Swarm (MoA pattern), AgentKit (guardrails).

NOT yet absorbed: tool calling, self-editing memory, A2A push mode, visual DAG editor, execution traces, Skills as runtime primitive.
