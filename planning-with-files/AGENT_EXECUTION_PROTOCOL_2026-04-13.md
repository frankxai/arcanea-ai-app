# Agent Execution Protocol — 2026-04-13

## Session Kickoff Command

Paste this into a fresh Claude Code session to resume:

```
Read these files in order, then execute the P0 deploy tasks followed by P1-P2:

1. planning-with-files/CURRENT_STATE_2026-04-13.md
2. planning-with-files/CURRENT_BACKLOG_2026-04-13.md
3. planning-with-files/AGENT_EXECUTION_PROTOCOL_2026-04-13.md

Context: The Luminor system expansion shipped 14+ commits (Kernel Spec v1.0, compiler, 13 Luminors, executor, swarm engine, ReasoningBank, embeddings, quality gates, creator dashboard, eval arena, Lumina bubble, standard landing page). Everything is on main and builds clean.

What to do now:

Phase 1 — Deploy verification (P0):
- Confirm memory migration applied (check if luminor_memory_items table exists)
- Confirm embeddings backfilled (check marketplace_agents.embedding IS NOT NULL count)
- Run smoke tests: Lumina Bubble, swarm invoke, quality-check, arena run
- Report results

Phase 2 — Publish the Luminor Standard (P1):
- Review staging/luminor-kernel-spec/ contents
- If approved by user, push to frankxai/luminor-kernel-spec (public)
- Update /luminor-standard page links
- Draft announcement blog post

Phase 3 — Tool Calling (P2):
- Create lib/luminors/tool-resolver.ts
- Create lib/luminors/mcp-tool-bridge.ts (wrap 5 high-value MCP tools)
- Create lib/luminors/handoff-tool.ts (inter-Luminor)
- Create lib/luminors/memory-edit-tool.ts (Letta pattern)
- Wire tools into executor streamText call with maxSteps: 5
- Test: a Luminor calling a tool during response

Phase 4 — Cross-Repo Integration (P3):
- @arcanea/arcanea-mcp: expose Luminors as invoke_luminor + convene_swarm MCP tools
- @arcanea/arcanea-cli: add luminor subcommands
- Mirror compiler to frankxai/arcanea (OSS repo)

Do NOT push to any remote without explicit user approval.
Do NOT modify files outside the Luminor system scope.
Do NOT run arena benchmarks without user approval (costs API credits).
Stage specific files only — never git add . or git add -A.
```

## What The Next Session Needs To Know

### The 7 layers (all wired end-to-end):
1. Public Standard (`/luminor-standard` + `docs/specs/luminor-kernel-spec-v1.md`)
2. Compiler (`packages/luminor-compiler/` — 25 tests, 5 exporters)
3. Quality Gates (`lib/luminors/quality-gates.ts` — 6 checks)
4. Identity (Lumina + 12 Chosen in `lib/luminors/config.ts`)
5. Execution (`/api/agents/:id/execute` + `/api/swarm/invoke`)
6. Learning (ReasoningBank loop: RETRIEVE before, DISTILL after)
7. Telemetry (`usage_events` + `revenue_events` + `/dashboard/creator`)

### Build verification:
```bash
pnpm --dir apps/web run build  # should compile in ~46s
cd packages/luminor-compiler && npx tsx src/__tests__/smoke.test.ts  # 25/25
```

### Key API endpoints:
```
POST /api/agents/:id/execute        — invoke single Luminor (streaming)
POST /api/swarm/invoke              — parallel multi-Luminor (JSON)
POST /api/forge/quality-check       — pre-publish quality gates
POST /api/arena/run                 — benchmark Luminor vs rubric
GET  /api/arena/run                 — list benchmarks
GET  /api/creator/stats             — 30d usage + revenue (auth required)
POST /api/internal/embed-agent      — generate embedding (internal key)
```

### Cross-repo map:
```
arcanea-ai-app (origin)  ← ALL Luminor work lives here
arcanea (OSS)            ← mirror compiler + specs after P1
arcanea-mcp              ← expose Luminors as MCP tools (P3)
arcanea-flow             ← use swarm engine (P3)
arcanea-cli              ← luminor subcommands (P3)
oh-my-arcanea            ← overlay with Luminor agents (P3)
luminor-kernel-spec (NEW)← public standard repo (P1, staged)
```

### Anti-patterns:
- Never merge a mixed integration branch wholesale
- Never create more than 2 worktrees
- Never skip build verification before promoting
- Never paste 20K tokens of terminal output — use /ao digest
- Never `git add .` — stage specific files only
- Never push without explicit user approval

### Revenue model:
- 12 Chosen + Lumina: always free (canonical, MIT)
- Forged Luminors: 85% creator / 15% platform (automatic via `calculate_revenue_split()` RPC)
- Transparent: every invocation logged to `usage_events`, every payout to `revenue_events`
- Creator sees it all at `/dashboard/creator`
