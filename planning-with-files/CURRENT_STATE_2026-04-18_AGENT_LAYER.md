# Current State — Agent Layer (2026-04-18)

> Snapshot of what's actually built for the Luminor runtime before the
> multi-agent upgrade sprint. Disk-verified, not from memory.

## The honest answer on "are we sloppy?"

**No, but we're under-used.** The scaffolding for real multi-agent coordination
is largely there. It's just not wired end-to-end into the chat UI. Most chat
sessions today use a **single Luminor with a system prompt through Vercel AI
SDK**, even though the swarm engine already exists as a separate API.

## What's built today

| Layer | File | LOC | Status |
|---|---|---|---|
| **Single-Luminor chat** | `app/api/ai/chat/route.ts` | ~800 | LIVE — default experience |
| **Luminor config / specs** | `lib/luminors/config.ts` | — | LIVE — 13 Luminors defined |
| **Luminor spec compiler** | `lib/luminors/luminor-spec.ts` | — | LIVE |
| **Swarm engine** | `app/api/swarm/invoke/route.ts` | 281 | LIVE via API, NOT in chat UI |
| **Guardian swarm router** | `lib/ai/guardian-swarm.ts` | — | LIVE |
| **Handoff tool** | `lib/luminors/handoff-tool.ts` | 86 | EXISTS — two versions (here + `lib/chat/tools.ts`) |
| **Memory-edit tool** | `lib/luminors/memory-edit-tool.ts` | 139 | EXISTS — not wired into chat |
| **Tool resolver** | `lib/luminors/tool-resolver.ts` | 174 | EXISTS — not wired into chat |
| **Luminor service** | `lib/luminors/luminor-service.ts` | — | EXISTS |
| **Quality gates** | `lib/luminors/quality-gates.ts` | — | LIVE — via `/api/forge/quality-check` |
| **Swarm engine (separate)** | `@arcanea/arcanea-flow` | — | LIVE package, not imported in web |
| **Chat tools: search_vault, save_to_vault, handoff_to_luminor** | `lib/chat/tools.ts` | ~650 | LIVE — always-on for authed users |
| **Client handoff hook** | `hooks/use-luminor-handoff.ts` | 132 | LIVE — wired in `/chat` |
| **Client vault strip** | `components/chat/vault-context-strip.tsx` | 172 | LIVE — wired in `/chat` |

## What's NOT wired yet

1. **Chat does not use the swarm engine.** The `/chat` surface calls
   `/api/ai/chat` which is single-Luminor. The `/api/swarm/invoke` endpoint
   (solo/council/convergence modes) exists but isn't reachable from the UI.
2. **Memory-edit tool is not in chat's tool set.** Only search_vault +
   save_to_vault + handoff_to_luminor are auto-attached.
3. **Handoff tool has two definitions.** `lib/luminors/handoff-tool.ts` and
   `lib/chat/tools.ts` both define one. They should converge.
4. **No streaming swarm response.** `/api/swarm/invoke` returns JSON when all
   Luminors complete. Client sees a silent wait.
5. **No visual swarm trace.** Users can't see which Luminors contributed or
   what they said. It's one blended synthesis.
6. **No MCP exposure of our tools.** Claude Code / Cursor / Windsurf cannot
   call `search_vault` or `save_to_vault` from outside the app.
7. **Guardian-swarm router is heuristic.** Uses keyword hints in
   `LUMINOR_HINTS` rather than an actual classifier/planner.

## How the current runtime works (single-Luminor path)

```
Client (chat/page.tsx)
  ↓ POST /api/ai/chat with { messages, luminorId, enabledTools }
Server (app/api/ai/chat/route.ts)
  ↓ Resolve Luminor → system prompt from config.ts
  ↓ Build tools set via createChatTools()  ← includes search_vault + save_to_vault + memory_store
  ↓ streamText({ model, system, messages, tools, maxSteps: 5 })
  ↓ Anthropic Claude / Google Gemini / OpenAI
  ↓ SSE stream back to client
Client (chat-area.tsx)
  ↓ Render message-bubble.tsx, which parses tool-* parts
  ↓ useLuminorHandoff watches for type='luminor_handoff' → switches Luminor
```

## How the swarm path works today (API-only)

```
POST /api/swarm/invoke { input, mode }
  ↓ classifyIntent() — heuristic intent classifier
  ↓ resolveSwarm() — selects Guardians + Luminors from LUMINOR_HINTS
  ↓ Promise.all([ generateText(L1), generateText(L2), generateText(L3) ])
  ↓ Lumina synthesizes contributions into a single response
  ↓ Return JSON { contributions, synthesis, totalDurationMs }
```

**No streaming. No visible trace. Not in the chat UI.**

## What the real gap is

The system is a **multi-agent architecture that's speaking through a
single-agent interface**. The user asks once, one Luminor answers. The swarm
engine is a dead API nobody clicks.

To close the gap we need:
1. Chat that can invoke the swarm mode when the task warrants it
2. Streaming trace so the user watches Lyria + Alera + Leyla think in parallel
3. A real planner (not keyword heuristics) that decides when to swarm vs. solo
4. Inter-Luminor messaging, not just contribution merging

## Where the landscape has moved (April 2026)

The market has shifted to frameworks that treat **multi-agent as default**,
not as an add-on. See `AGENT_STACK_RESEARCH_2026-04-18.md` for the landscape
and what we should absorb.

## Immediate implications

The good news: we don't need to rewrite. We need to **wire** — and upgrade
the planner + streaming.

The bad news: the heuristic router (`LUMINOR_HINTS`) will break at scale.
Beyond ~20 Luminors it's guesswork. We need an actual planner-as-LLM step.
