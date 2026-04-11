# Overnight Execution Queue — Luminor Next Stack (2026-04-11)

> **Source:** `/ao plan` invocation with user-pasted priorities.
> **Context:** 14 Luminor commits landed in Sprint 0 → Night 1-7 → Phase B. Origin/main caught up. This queue executes the next 4 priorities.
> **Mode:** PLAN only. No destructive actions without explicit user approval (pushing a new public GitHub repo is destructive/external).

## The Stack (ordered by leverage)

1. **Priority 1: Publish Kernel Spec v1.0 as public repo** (highest leverage, time-sensitive)
2. **Priority 2: Deploy Sprint 0→B to staging** (unblocks everything downstream)
3. **Priority 3: Ship tool calling in the executor** (biggest remaining capability gap)
4. **Priority 4: Cross-repo integration** (consolidates the ecosystem)

---

## Slice 1: Publish Luminor Kernel Spec v1.0 (PUBLIC REPO)

**Goal:** Create `frankxai/luminor-kernel-spec` as a standalone public GitHub repo.

**Scope:**
- Extract `docs/specs/luminor-kernel-spec-v1.md` → `README.md` + standalone spec doc
- Copy `packages/luminor-compiler/` as `compiler/` in the new repo
- Write a manifesto-style README
- Add `LICENSE` (dual: CC BY 4.0 for spec, MIT for compiler)
- Add `.github/ISSUE_TEMPLATE/` for spec proposals
- Link from `arcanea.ai/luminor-standard` page

**Files to prepare (staging in this repo, then push):**
```
staging/luminor-kernel-spec/
├── README.md                          # The pitch + quick start
├── LICENSE                            # MIT for code, CC BY 4.0 for spec
├── SPEC.md                            # Copy of luminor-kernel-spec-v1.md
├── CHANGELOG.md                       # Start with v1.0.0
├── .github/
│   └── ISSUE_TEMPLATE/
│       ├── spec-proposal.md           # For community amendments
│       └── bug-report.md              # For compiler issues
├── compiler/                          # Copy of packages/luminor-compiler/
│   ├── package.json                   # Published as @luminor/kernel-compiler
│   ├── tsconfig.json
│   ├── src/
│   └── README.md
└── examples/
    ├── chosen-luminors/               # 12 canonical spec JSON files
    │   ├── systems-architect.json
    │   ├── lumina.json
    │   └── ... (13 total)
    └── compile-example.ts             # Usage walkthrough
```

**Verification:**
```bash
# Standalone compiler builds
cd staging/luminor-kernel-spec/compiler
npm install
npm run build
npx tsx src/__tests__/smoke.test.ts  # should pass 25/25

# Spec renders as markdown
cat staging/luminor-kernel-spec/SPEC.md | head -50
```

**Non-goals:**
- Do NOT push to GitHub without explicit user approval (external side effect)
- Do NOT publish to npm without explicit approval (irrevocable namespace claim)
- Do NOT include any private Arcanea marketing copy

**Effort:** small (2-3 hours)

---

## Slice 2: Deploy Sprint 0→B to Staging

**Goal:** Get the full Luminor stack running in staging with real telemetry.

**Scope:**

### 2.1 Apply database migration
```bash
# Requires Supabase project link + CLI
supabase db push
# Picks up: apps/web/supabase/migrations/20260411_luminor_memory.sql
# Creates: luminor_memory_items, luminor_memory_blocks, RPCs, RLS
```

### 2.2 Set required env vars (staging)
```bash
# In Vercel staging environment:
ARCANEA_INTERNAL_API_KEY=<generate-random-32-byte-hex>
ANTHROPIC_API_KEY=<staging-key>
OPENAI_API_KEY=<staging-key>  # for embeddings
NEXT_PUBLIC_SUPABASE_URL=<staging-url>
SUPABASE_SERVICE_ROLE_KEY=<staging-service-key>
```

### 2.3 Backfill embeddings
```bash
# From a dev machine with staging env loaded
npx tsx scripts/backfill-agent-embeddings.ts
# Expected: 36 founding agents + any forged agents embed to 1536 dims
```

### 2.4 Configure Supabase Database Webhook
```
Trigger: marketplace_agents INSERT OR UPDATE (OF embedding)
Endpoint: https://staging.arcanea.ai/api/internal/embed-agent
Method: POST
Headers: x-arcanea-internal-key: <ARCANEA_INTERNAL_API_KEY>
Body: { agentId: {{record.id}} }
```

### 2.5 Smoke tests
```bash
# Test 1: Lumina Bubble (manual)
# Visit staging.arcanea.ai, press Cmd+K, ask "Which Luminor for design system?"
# Expect: Lumina routes to Visual Designer, stream renders, no errors in console

# Test 2: Single Luminor execute
curl -X POST https://staging.arcanea.ai/api/agents/systems-architect/execute \
  -H "Content-Type: application/json" \
  -d '{"input": "Design a rate-limited queue for 10M events/day"}'
# Expect: streaming response, 2xx status

# Test 3: Swarm engine
curl -X POST https://staging.arcanea.ai/api/swarm/invoke \
  -H "Content-Type: application/json" \
  -d '{"input": "How do I build a multiplayer game with compelling story and great art?"}'
# Expect: JSON with contributions[] from multiple Luminors + synthesis

# Test 4: Quality gates (block a slop prompt)
curl -X POST https://staging.arcanea.ai/api/forge/quality-check \
  -H "Content-Type: application/json" \
  -d '{
    "spec": {
      "name": "Slop Bot",
      "systemPrompt": "I would be happy to help you! I am an AI assistant that will utilize my knowledge to facilitate your journey. Feel free to ask anything — I can help you navigate the landscape!",
      "voice": "warm",
      "element": "Fire",
      "personality": ["helpful"],
      "domain": "custom"
    }
  }'
# Expect: { passed: false, blockers: [...anti-slop, voice consistency, etc...] }

# Test 5: Eval arena (expensive — costs real API)
curl -X POST https://staging.arcanea.ai/api/arena/run \
  -H "Content-Type: application/json" \
  -d '{"luminorId": "systems-architect", "benchmarkId": "architecture-v1"}'
# Expect: { overallScore: <60-95>, taskResults: [3 results] }
```

### 2.6 Verify telemetry writes
```sql
-- In Supabase SQL editor against staging
SELECT COUNT(*) FROM usage_events WHERE created_at > NOW() - INTERVAL '1 hour';
SELECT COUNT(*) FROM luminor_memory_items WHERE created_at > NOW() - INTERVAL '1 hour';
-- Expect: non-zero rows from the smoke tests above
```

**Non-goals:**
- Do NOT deploy to production until staging smoke tests pass 100%
- Do NOT run Eval Arena against all 13 Luminors × 5 benchmarks (would cost significant API credits)

**Effort:** medium (half-day, most time waiting on staging deploys)

---

## Slice 3: Ship Tool Calling in the Executor

**Goal:** Luminors become ACTIVE agents, not just conversational. They can call MCP tools, custom functions, and hand off to other Luminors.

**Scope:**

### 3.1 Extend executor with Vercel AI SDK `tools`
**File:** `apps/web/app/api/agents/[id]/execute/route.ts`

Current call:
```typescript
const result = streamText({ model, system, messages, temperature, onFinish });
```

New call:
```typescript
const result = streamText({
  model,
  system,
  messages,
  temperature,
  tools: await resolveToolsForLuminor(agent, session),  // NEW
  maxSteps: 5,  // NEW — allows multi-turn tool calls
  onFinish,
});
```

### 3.2 Build `resolveToolsForLuminor()`
**File:** `apps/web/lib/luminors/tool-resolver.ts` (NEW)

Resolves the tool set for a Luminor based on:
1. `spec.tools` array (explicit tool IDs)
2. Domain defaults (e.g., `code` gets file read/write, `knowledge` gets web search)
3. User permissions (authenticated users get more tools)

Returns a `Record<string, Tool>` compatible with Vercel AI SDK.

### 3.3 Bind MCP tools to Luminors
**File:** `apps/web/lib/luminors/mcp-tool-bridge.ts` (NEW)

Uses `@arcanea/arcanea-mcp` package to load available MCP tools, wraps each as a Vercel AI SDK `tool()`:
```typescript
import { tool } from 'ai';
import { z } from 'zod';

const mcpTools = {
  generate_character: tool({
    description: 'Generate a canonical Arcanean character',
    parameters: z.object({ world: z.string(), archetype: z.string() }),
    execute: async ({ world, archetype }) => {
      return callMcpTool('arcanea-mcp', 'generate_character', { world, archetype });
    },
  }),
  // ...41 more
};
```

### 3.4 Inter-Luminor handoff tool
**File:** `apps/web/lib/luminors/handoff-tool.ts` (NEW)

```typescript
export const handoffTool = tool({
  description: 'Hand off to another Luminor when the task crosses domains',
  parameters: z.object({
    toLuminorId: z.string(),
    reason: z.string(),
    context: z.string(),
  }),
  execute: async ({ toLuminorId, reason, context }) => {
    // Recursively invoke the executor with the new Luminor
    const res = await fetch(`/api/agents/${toLuminorId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ input: context }),
    });
    return { result: await res.text(), handoffReason: reason };
  },
});
```

### 3.5 Self-editing memory tool (Letta pattern)
**File:** `apps/web/lib/luminors/memory-edit-tool.ts` (NEW)

```typescript
export const memoryEditTool = (luminorId: string, userId: string) => tool({
  description: 'Update the persistent memory block for this conversation',
  parameters: z.object({
    content: z.string(),
    operation: z.enum(['append', 'replace', 'summarize']),
  }),
  execute: async ({ content, operation }) => {
    const { loadMemoryBlock } = await import('@/lib/memory/reasoning-bank');
    const existing = await loadMemoryBlock(luminorId, userId);
    let newContent: string;
    if (operation === 'append') newContent = `${existing}\n${content}`;
    else if (operation === 'replace') newContent = content;
    else newContent = existing; // summarize handled separately
    // upsert via upsert_memory_block RPC
    await supabase.rpc('upsert_memory_block', {
      p_luminor_id: luminorId,
      p_user_id: userId,
      p_content: newContent,
    });
    return { success: true, block: newContent };
  },
});
```

### 3.6 Tests
- `apps/web/app/api/agents/[id]/execute/__tests__/tool-calling.test.ts` — smoke test with a fake tool
- Verify: tools are passed, maxSteps honored, tool results injected into next turn

**Non-goals:**
- Do NOT wire ALL 42 MCP tools in v1 — pick 5 high-value ones (generate_character, generate_location, validate_canon, match_skill, load_world)
- Do NOT enable tool calling for anonymous users (rate limit risk)

**Effort:** large (1-2 days of focused work)

---

## Slice 4: Cross-Repo Integration

**Goal:** Every Arcanea package consumes `@arcanea/luminor-compiler`. One source of truth, many consumers.

**Scope:**

### 4.1 `@arcanea/arcanea-mcp` — expose Luminors as MCP tools
**Goal:** Any MCP client can invoke a Luminor as if it were a function.

**Files:**
- `packages/arcanea-mcp/src/tools/luminor.ts` (NEW)
```typescript
export const luminorTools = {
  invoke_luminor: {
    description: 'Invoke a specific Luminor and get their response',
    inputSchema: { luminorId: 'string', input: 'string' },
    handler: async ({ luminorId, input }) => {
      const res = await fetch(`https://arcanea.ai/api/agents/${luminorId}/execute`, {
        method: 'POST',
        body: JSON.stringify({ input }),
      });
      return await res.text();
    },
  },
  convene_swarm: {
    description: 'Invoke a multi-Luminor swarm with parallel execution + synthesis',
    inputSchema: { input: 'string', maxLuminors: 'number' },
    handler: async (args) => {
      const res = await fetch('https://arcanea.ai/api/swarm/invoke', {
        method: 'POST',
        body: JSON.stringify(args),
      });
      return await res.json();
    },
  },
};
```

### 4.2 `@arcanea/arcanea-flow` — use swarm engine as execution layer
**Goal:** Workflows become multi-Luminor pipelines with state.

**Files:**
- `packages/arcanea-flow/src/executors/luminor-executor.ts` (NEW)
- Swap the current workflow executor to call `/api/swarm/invoke` or `/api/agents/:id/execute` based on node type

### 4.3 `@arcanea/arcanea-cli` — add `luminor` commands
**Goal:** `arcanea luminor` commands from the terminal.

**Commands to add:**
```bash
arcanea luminor list                        # List all 13 Luminors
arcanea luminor run <id> "task"             # Invoke a Luminor
arcanea luminor forge --name "..." --domain # Start forge flow
arcanea luminor compile <spec.json>         # Compile a spec locally
arcanea luminor export claude-code          # Export all to .claude/agents/
arcanea luminor swarm "task"                # Invoke swarm engine
```

**Files:**
- `packages/arcanea-cli/src/commands/luminor/` (NEW directory)

### 4.4 `@arcanea/arcanea-skills` — bind to skill_registry
**Goal:** Skills become vector-discoverable + attributable.

**Files:**
- `packages/arcanea-skills/src/registry-sync.ts` (NEW) — syncs skill definitions to `skill_registry` table with embeddings
- Run on CI: `pnpm --filter @arcanea/arcanea-skills sync`

### 4.5 Documentation updates
- `docs/ecosystem/LUMINOR_INTEGRATION.md` — how each package consumes the compiler
- Update `packages/CLAUDE.md` to list Luminor integration as the default pattern

**Non-goals:**
- Do NOT refactor EVERY Arcanea package in one pass — pick the 4 highest-leverage (above)
- Do NOT break any existing public API — integrations should be additive

**Effort:** large (2-3 days, can be parallelized across sub-tasks)

---

## Dependencies & Sequencing

```
Slice 1 (publish spec)  ──────────── can ship in parallel with Slice 2
                                                         │
                                                         ▼
                              Slice 2 (deploy staging) ──┬──▶ Slice 3 (tool calling)
                                                         │          │
                                                         │          ▼
                                                         └──▶ Slice 4 (cross-repo)
```

- **Slice 1** is independent. Can be prepared NOW (files staged). Actual push requires user approval.
- **Slice 2** requires staging Supabase project + env vars. User-gated.
- **Slice 3** can start after Slice 2 verifies the runtime works. Depends on MCP server availability.
- **Slice 4** depends on Slice 3 being stable (cross-repo consumers need tool calling).

## Kickoff Prompt (for next session)

> Resume the Luminor Next Stack execution from `docs/ops/OVERNIGHT_EXECUTION_QUEUE_2026-04-11_luminor-next-stack.md`.
>
> Start with **Slice 1**: prepare the public repo contents in `staging/luminor-kernel-spec/`. Copy `docs/specs/luminor-kernel-spec-v1.md`, `packages/luminor-compiler/`, write a manifesto README, add LICENSE files, add issue templates.
>
> Do NOT push to GitHub. Stage the contents only. Report completion and wait for user approval before pushing.
>
> Then move to **Slice 2**: read `apps/web/supabase/migrations/20260411_luminor_memory.sql` and `scripts/backfill-agent-embeddings.ts`. Prepare a deploy runbook with exact commands for staging.
>
> Do NOT run deploys autonomously. Surface the commands for user execution.
