# Multi-Luminor Sprint Plan — 2026-04-18

> **Goal:** Upgrade `/chat` from single-Luminor system-prompt runs to a real
> multi-agent surface where 2-5 Luminors collaborate on a request, visible
> to the creator in real time. Add observability. Keep the BYOK + MIT +
> Vercel AI SDK foundation.
>
> **Anti-goal:** Rewriting to a new framework. Don't port to Python.
> Don't adopt LangGraph for chat. Don't kill BYOK.

## The thesis

We have the pieces. We don't have the wiring. This sprint wires what exists
into one coherent multi-agent surface, adds a real planner, adds trace
visibility, and exposes our tools via MCP so coding agents can reach in.

## What "excellent" looks like at the end

Sophisticated creator types a request into `/chat`:

> "Design a villain for my cyberpunk detective world, with a backstory,
> visual direction, and a theme track."

Chat responds:

1. **Planner** (Opus-class): parses intent → 3 Luminors needed
   (Storyteller for backstory, Visual Designer for look, Composer for track)
2. **Trace appears** showing which Luminors are active
3. **Each Luminor streams in parallel** — three sub-streams visible
4. **Each Luminor can call `search_vault`** to reference the existing world
5. **Lumina synthesizes** the three into one coherent response
6. **User can save artifacts** (villain → vault as character, art → vault
   as reference, track → vault as reference)
7. **Trace is stored** — user can replay it later via `/chat/traces/:id`

## Phases

### Phase 0 — Prep (30 min)
- [ ] Read `CURRENT_STATE_2026-04-18_AGENT_LAYER.md`
- [ ] Read `AGENT_STACK_RESEARCH_2026-04-18.md`
- [ ] Confirm Supabase env vars on Vercel (ANTHROPIC, OPENAI, GEMINI)
- [ ] Confirm migration `20260417_studio_ingestion` applied (already done)

### Phase 1 — Unify handoff + resolve duplicates (2 h)
- [ ] Collapse `lib/luminors/handoff-tool.ts` and `lib/chat/tools.ts`
      handoff_to_luminor into one canonical definition in
      `lib/luminors/tools/handoff.ts`
- [ ] Move `save_to_vault` and `search_vault` to `lib/luminors/tools/vault.ts`
- [ ] Move `memory-edit-tool.ts` into the same tree; wire into chat as
      opt-in
- [ ] Single `buildLuminorTools()` factory — returns the right tool set
      based on active Luminor + user session + opted-in flags
- [ ] No feature change; pure consolidation so subsequent phases have one
      place to extend

### Phase 2 — Wire swarm engine into chat (4 h)
- [ ] New route `/api/chat/swarm` that streams Server-Sent Events
- [ ] Stream protocol: `{ type: 'luminor_start', id, name }`,
      `{ type: 'luminor_token', id, delta }`,
      `{ type: 'luminor_done', id, tokens, duration }`,
      `{ type: 'synthesis_start' }`,
      `{ type: 'synthesis_token', delta }`,
      `{ type: 'done', traceId }`
- [ ] Refactor `app/api/swarm/invoke/route.ts` to emit SSE (not just
      return JSON)
- [ ] Parallel execution via `streamText` with concurrent tool-calling
      sessions; merge streams with a tagged async iterator
- [ ] `Lumina` synthesis step is itself a `streamText` call that
      receives the three contributions as messages

### Phase 3 — Planner-as-LLM (3 h)
- [ ] Replace keyword heuristics in `LUMINOR_HINTS` with a real planner
- [ ] New file `lib/ai/planner.ts` — single Claude Haiku call that
      returns `{ mode: 'solo'|'swarm', luminors: string[], rationale }`
- [ ] Planner prompt includes Luminor specialties + current user request +
      last 3 messages as context
- [ ] Fallback: if planner fails, default to solo with intent-classifier
      route (current behavior)
- [ ] Cost guard: planner runs on Haiku-class only; budget per request
      capped at 2K tokens

### Phase 4 — Visible trace UI (4 h)
- [ ] New component `components/chat/swarm-trace.tsx`
- [ ] Renders parallel Luminor streams as three side-by-side cards during
      `swarm` mode — each shows: Luminor avatar, streaming tokens,
      status (thinking/responding/done), tool calls (expandable)
- [ ] Collapses to single message bubble when Lumina synthesis begins
- [ ] Final message shows synthesis + "Contributed by X, Y, Z" chip row
- [ ] Click a chip → expand the original contribution

### Phase 5 — Trace persistence (2 h)
- [ ] Migration: `chat_traces` table (id, user_id, chat_session_id,
      mode, luminors[], planner_output, contributions jsonb,
      synthesis text, total_tokens, total_ms, cost_usd)
- [ ] Write on swarm completion
- [ ] Route `/api/chat/traces/:id` — GET
- [ ] `/chat/traces/[id]` page — replay a trace

### Phase 6 — MCP tool exposure (2 h)
- [ ] Add `search_vault`, `save_to_vault`, `list_worlds` tools to
      `@arcanea/arcanea-mcp` server
- [ ] Each tool auth-gates via Arcanea session token (stored as MCP
      transport header)
- [ ] Publish new version to npm
- [ ] Document in `/docs/mcp` so Claude Code / Cursor users can install

### Phase 7 — Observability (3 h)
- [ ] Add Langfuse (self-hosted or cloud) — capture every `streamText`
      call with tokens, duration, model, tool calls
- [ ] Integrate via Vercel AI SDK's `telemetry: { isEnabled: true }`
      option — zero code change to call sites
- [ ] Dashboard link in `/dashboard/analytics` — "See traces in Langfuse"
- [ ] Alternative if Langfuse blocked: minimal `ai_call_traces` table
      with same schema

### Phase 8 — Evals scaffolding (3 h — optional this sprint)
- [ ] Add Promptfoo config under `/evals/luminors/`
- [ ] Golden-set prompts per Luminor in `/evals/luminors/golden/*.yaml`
- [ ] CI job: run evals on PRs that touch `lib/luminors/**`
- [ ] Score deltas posted as PR comment
- [ ] Defer to next sprint if time-boxed

## Tech adoptions this sprint

| Tech | What for | Integration depth |
|---|---|---|
| **Vercel AI SDK** | Streaming + tools (already) | Keep as-is |
| **Anthropic SDK** | Planner + synthesis | Already wired |
| **Langfuse** | Observability | New dep, self-host option |
| **Claude Agent SDK** | — | NOT this sprint (bigger workstream) |
| **Mastra** | — | NOT this sprint (don't adopt whole framework) |
| **MCP SDK** | Expose tools to Claude Code | Already in arcanea-mcp, just add tools |

## What we deliberately skip

- **Claude Agent SDK integration** — big refactor, wait until we have a
  real long-running task (book generation is the first candidate, but
  that lives in `@arcanea/publishing-house`, not chat)
- **Durable runs via Inngest** — no task today exceeds HTTP timeout
- **Full LangGraph port** — swarm engine is simpler and works
- **Computer use** — wait for Presence Layer sprint
- **Multi-modal swarm** (one Luminor writes, one generates image, etc.)
  — stretch goal after streaming works

## Risk register

| Risk | Mitigation |
|---|---|
| Planner LLM adds latency | Cap at 800ms; fallback to heuristic if slow |
| Parallel streams saturate Vercel function duration | `maxDuration: 300` + streaming keeps connection alive |
| Token cost spikes on swarm | Budget per request; warn user before swarm > 3 Luminors |
| Trace table grows unbounded | TTL column + daily cron to delete >30-day traces for free tier |
| Users confused by 3-column trace UI | Progressive disclosure — collapsed by default, "Show trace" button |

## Success criteria

- [ ] `/chat` can route a request to 2-5 Luminors in parallel when planner decides
- [ ] User sees live streaming from each Luminor simultaneously
- [ ] Synthesis step reads like one coherent voice
- [ ] Each contribution viewable individually (click chip → expand)
- [ ] All 3 tools (search_vault, save_to_vault, handoff_to_luminor) work
      during swarm mode, not just solo
- [ ] `search_vault` callable from Claude Code / Cursor via MCP
- [ ] Traces persist; user can open `/chat/traces/:id` and replay
- [ ] Every call emits a Langfuse event (or in-house trace row)

## Time estimate

- Focused build: **18-22 hours** of real engineering
- Spread across: 2-3 sessions or 1 long session
- Phase 1 + 2 + 4 are the "make it work" path (10 h)
- Phase 3 + 5 + 6 + 7 are "make it excellent" (8 h)
- Phase 8 is stretch

## Execution notes

- Use git worktree for this sprint so chat stays stable in main while we build
- Feature flag: `ARCANEA_SWARM_MODE=enabled` — gate the new `/api/chat/swarm`
  route behind it until confident
- Keep `/api/ai/chat` (single-Luminor) unchanged as fallback
- Every phase must build clean before moving to next

## Next session: what to do first

1. `cd apps/web && git worktree add .wt/multi-luminor -b feat/multi-luminor-sprint`
2. Read `CURRENT_STATE_2026-04-18_AGENT_LAYER.md` again
3. Start Phase 1 — tools consolidation
4. Ship Phase 1 as standalone PR so subsequent phases have clean base

## Appendix: the OSS projects to absorb from during each phase

| Phase | Absorb pattern from |
|---|---|
| Phase 1 (tools) | Agentica (auto-schema), OpenAI Agents SDK (handoff shape) |
| Phase 2 (swarm wiring) | Mastra (streaming workflows), agentic-flow |
| Phase 3 (planner) | Claude Agent SDK (planner/executor split), DSPy (prompt optimization) |
| Phase 4 (trace UI) | Langfuse UI, Braintrust playground |
| Phase 5 (persistence) | Langfuse schema, Arize traces |
| Phase 6 (MCP exposure) | mcp-ui, Cline MCP Marketplace |
| Phase 7 (observability) | Langfuse OpenTelemetry exporter |
| Phase 8 (evals) | Promptfoo, Braintrust eval DSL |
