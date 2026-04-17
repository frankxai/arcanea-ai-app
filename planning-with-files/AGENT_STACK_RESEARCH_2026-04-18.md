# Agent Stack Research — April 2026

> What top players are actually shipping with, and what we should absorb.
> Scope: production multi-agent systems, not research toys.

## TL;DR

1. **Vercel AI SDK is fine for streaming and tool calling.** Keep it.
2. **Claude Agent SDK (formerly Claude Code SDK)** is the closest analogue to
   what we want for long-running agents with computer use + MCP. Worth
   adopting as the backbone for `arcanea-flow` runtime where agents need
   durable tool loops.
3. **Mastra** (Y Combinator-backed) is the closest OSS TypeScript stack to
   where Arcanea is heading: agents + workflows + memory + evals + MCP in
   one framework. Worth absorbing patterns, not the whole thing.
4. **LangGraph** dominates for graph-based multi-agent state machines where
   the flow is known in advance. Best for our book publishing pipeline and
   world generation, not open-ended chat.
5. **OpenAI Agents SDK** (evolution of Swarm) is the simplest handoff pattern
   and what we already mirror in `handoff_to_luminor`. Keep that pattern.
6. **CrewAI** for role-based orchestration; we already absorbed Role/Goal/
   Backstory into Luminor personalities.
7. **AutoGen (Microsoft)** good for adversarial / debate patterns but heavy.
   We already absorbed the debate concept via the swarm "council" mode.

## The shipping landscape

### Agent frameworks creators actually use (TS/JS heavy)

| Framework | Why it wins | What we should absorb |
|---|---|---|
| **Vercel AI SDK v6** | Best streaming + tools DX in Node/Edge. Native fit for Next.js. | Already our base. Stay. |
| **Claude Agent SDK** | Durable long-running agents, native MCP, computer use, session resume, context compaction. Anthropic-authored. | Use it to back `arcanea-flow` agents that need >5 tool steps or hour-long sessions. |
| **Mastra** | Agents + workflows + evals + memory + MCP client in one idiomatic TS package. Ships a local dev studio. | Pattern: memory/working memory split, eval scaffolding, workflow `.step().branch()` DSL. |
| **Agentica** (OSS) | LLM-function-calling for entire SDKs via Swagger/TypeScript compiler. | Pattern: auto-generate tool schemas from TypeScript types. Could turbo-charge our tool-resolver. |
| **OpenAI Agents SDK** | Simple handoff + guardrails primitive. | Our handoff tool is already the same shape. |
| **Inngest + AgentKit** | Durable workflows for agent runs. | Pattern: use Inngest for long tasks (book generation, world gen). |

### Python-heavy but reference-worthy

| Framework | What we learn |
|---|---|
| **LangGraph** (LangChain) | State graph pattern. Our swarm engine is an ad-hoc version of this. |
| **CrewAI** | Role/Goal/Backstory template. Already absorbed. |
| **AutoGen** (Microsoft) | Multi-agent conversation with humans-in-loop. Heavy. |
| **LlamaIndex Workflows** | Event-driven step pattern. |
| **DSPy** | Programmatic prompt optimization via evals. Pattern: use for Luminor prompt tuning. |
| **Semantic Kernel** | Plugins + planner. We have our own planner layer to build. |

### Runtime / infra top players converge on

1. **MCP (Model Context Protocol)** — table stakes. Claude Code, Cursor,
   Windsurf, Replit, Gemini CLI all speak it. We already ship an MCP server
   (`@arcanea/arcanea-mcp`).
2. **Durable execution** (Inngest, Temporal, Restate) — for runs that exceed
   HTTP timeouts.
3. **Observability** (Langfuse, Arize Phoenix, Braintrust) — trace every
   tool call + token. We don't have this yet.
4. **Eval harness** (Promptfoo, Braintrust, DeepEval) — regression-test
   prompts before shipping. We don't have this either.
5. **Guardrails** (NVIDIA NeMo Guardrails, Guardrails AI, Lakera) — input/
   output validation. Our quality-gates is lightweight version.

## What "top players" ship in April 2026 (verified patterns)

### Pattern 1 — Planner → Executor split

Top agents separate a **planning model** (Opus, Gemini Pro, o3-mini) from
the **executor model** (Sonnet/Haiku, cheaper). Plan once, then run many
cheap executor steps. Cuts cost 5-10x without losing capability.

**We don't do this.** Our chat runs one model for everything. Even when the
swarm activates, each Luminor is its own fresh prompt with no shared plan.

### Pattern 2 — Structured streaming traces

Every tool call is a typed event. UIs render tool-name + input + output +
duration + cost. Vercel AI SDK gives us the primitives; we under-use them.

### Pattern 3 — MCP for tool interop

Agents call tools that live in external MCP servers. Arcanea's vault can be
an MCP tool that Claude Code / Cursor / any MCP-speaking host can invoke.

**We already built the MCP server.** Just need to expose `search_vault` +
`save_to_vault` + `list_worlds` there so coding agents can reach in.

### Pattern 4 — Durable runs with session resumption

Users kick off a task. Agent runs for 30 min. User closes browser. Comes
back — status + partial results available. This is where Claude Agent SDK
shines with `.fork()` and `.resume()`.

### Pattern 5 — Evals as CI

Every prompt change runs against a golden-set before merging. Top creators
ship PromptFoo or Braintrust configs alongside their agent code.

### Pattern 6 — Memory-as-table, not memory-as-log

Agents get three memory tiers: scratchpad (session), working memory (task),
long-term (user facts). Our Luminor memory already matches this — but
chat doesn't yet consult working memory during generation.

## What we're doing right

- **BYOK** — ahead of the curve. Most tools pretend this isn't possible.
- **Open-source core** — MIT licensed. Competitors are mostly closed.
- **World-graph retrieval** — pgvector + HNSW tied to a narrative world is
  unique. No other agent framework has this shape.
- **Skills-as-runtime-primitive** — the Luminor Standard spec is ahead of
  most frameworks which still tangle prompt + tools + model config.
- **A2A Agent Card** — we already ship this. Most OSS frameworks don't.

## What we should absorb from Claude Agent SDK specifically

- **Durable sessions** — agent state persists across disconnects
- **Computer use** — for the far-future Presence Layer work
- **Context compaction** — auto-summarize older turns to stay in window
- **Hooks system** — pre-tool, post-tool, on-error interceptors
- **Subagent spawning** — agents can spawn child agents with sandboxed
  tool sets (pattern we want for our swarm)

## What we should absorb from Mastra

- **Working memory** pattern — per-task scratchpad separate from long-term
- **Workflow DSL** — `.step().branch().parallel()` for deterministic flows
  (book generation, world seeding, publishing pipeline)
- **Eval scaffolding** — run metrics per output automatically
- **Local dev studio** — UI for watching agents think

## What we should absorb from OpenAI Agents SDK

- **Handoff primitive** — we already match this shape
- **Guardrails** — typed pre/post-call validators (we have quality-gates,
  could unify)
- **Trace visualization** — our `/api/ai/chat` emits runtime headers; we
  should pipe those into a trace UI

## What we should NOT chase

- **Porting to Python** — TS/Next.js is our advantage
- **Full LangGraph** — graph DSL complexity not justified for chat
- **Full AutoGen** — too heavy; we have better primitives
- **Microsoft Semantic Kernel** — plugin model overlaps our skills system
  without adding much
- **Vendor managed orchestrators** (e.g. AWS Bedrock Agents) — kills BYOK

## OSS projects worth watching / forking

| Project | Why |
|---|---|
| **Mastra** | Closest TS analogue. Study the workflow DSL. |
| **agentic-flow** (Ruv) | We already absorbed. Keep syncing. |
| **Inngest AgentKit** | Pattern for durable agent runs. |
| **Agentica** | Swagger/TS-to-tool-schema auto-generation. |
| **Langfuse** | OSS trace visualization we could self-host. |
| **Promptfoo** | OSS prompt eval framework. |
| **mcp-ui** | MCP server with UI primitives — could be the model for our Luminor MCP. |
| **OpenAI Swarm** (deprecated → Agents SDK) | Pattern for minimal handoff. |

## Sprint recommendation

Don't rewrite. Upgrade in three surgical moves:

1. **Wire swarm into chat** — when intent classifier detects multi-domain,
   invoke `/api/swarm/invoke` with streaming, render each contribution live
2. **Promote planner-as-LLM** — replace keyword heuristics in `LUMINOR_HINTS`
   with an actual planning call (Opus-class for planning, Haiku for execution)
3. **Add observability** — Langfuse or a minimal in-house trace table

See `MULTI_LUMINOR_SPRINT_PLAN_2026-04-18.md` for the phased plan.
