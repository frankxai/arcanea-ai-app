# ARCANEA AGENTS — Ship Sprint Plan

> **Goal**: Ship arcanea.ai/agents as a live, credit-powered agent marketplace
> **Timeline**: This session (massive parallel execution)
> **Status**: EXECUTING

---

## Architecture Decision

**NO new frameworks.** Build on our existing stack:
- Vercel AI SDK (multi-provider streaming + tools) — already production
- Our agent bus, council, swarm coordinator — already built
- Supabase (auth, credits, tasks, marketplace) — already configured
- Next.js 16 App Router + Edge Runtime — already deployed

**Why this wins**: Zero new dependencies, zero ops, zero infrastructure cost, ships today.

---

## What We're Building

### Phase 1: Data Layer (Agent 1)
```
apps/web/lib/agents/marketplace/
  catalog.ts          — 12 starter work agents with LuminorSpec
  credits.ts          — Credit balance, purchase, consume functions
  executor.ts         — Agent execution pipeline
  types.ts            — AgentTask, CreditTransaction, MarketplaceAgent types
```

### Phase 2: API Routes (Agent 2)
```
apps/web/app/api/agents/
  route.ts            — GET (list agents), POST (create agent)
  [id]/route.ts       — GET (agent detail)
  [id]/execute/route.ts — POST (run agent task, streams response)

apps/web/app/api/credits/
  route.ts            — GET (balance)
  purchase/route.ts   — POST (buy credits — Stripe later, free starter pack now)
```

### Phase 3: UI Pages (Agent 3)
```
apps/web/app/agents/
  layout.tsx          — Marketplace layout with cosmic theme
  page.tsx            — Browse agents (grid, filters, search)
  [id]/page.tsx       — Agent detail + "Run Agent" CTA

apps/web/components/agents/
  agent-card.tsx      — Card component for marketplace grid
  agent-runner.tsx    — Task submission + streaming output UI
  credit-badge.tsx    — Credit balance display
```

### Phase 4: Supabase Schema (Agent 4)
```sql
-- Credits system
CREATE TABLE credits (
  user_id UUID REFERENCES profiles(id),
  balance INTEGER DEFAULT 100,  -- Everyone starts with 100 free credits
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  type TEXT CHECK (type IN ('purchase', 'consume', 'bonus', 'refund')),
  agent_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent tasks (execution history)
CREATE TABLE agent_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  agent_id TEXT NOT NULL,
  input JSONB NOT NULL,
  output TEXT,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  credits_consumed INTEGER DEFAULT 0,
  model_used TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Marketplace agents (extends luminors)
CREATE TABLE marketplace_agents (
  id TEXT PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id),
  spec JSONB NOT NULL,  -- Full LuminorSpec
  category TEXT NOT NULL,
  price_credits INTEGER DEFAULT 10,
  rating NUMERIC(3,2) DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## The 12 Starter Agents

| ID | Name | Category | Credits | Description |
|----|------|----------|---------|-------------|
| story-writer | Quillblade | Writing | 15 | Fantasy story writer, chapters + outlines |
| character-designer | Soulforge | Creative | 10 | Character profiles with backstory + traits |
| world-builder | Cosmograph | Creative | 20 | Locations, factions, magic systems |
| editor | Inkwarden | Writing | 10 | Anti-slop, voice check, canon audit |
| code-builder | Codeweaver | Development | 15 | React components, API routes, utilities |
| research-agent | Loreseeker | Knowledge | 10 | Deep research on any topic |
| music-composer | Resonance | Music | 15 | Soundtrack prompts, lyrics, audio concepts |
| cover-artist | Visioncraft | Visual | 10 | Book covers, character portraits, scenes |
| publisher | Bindmaster | Publishing | 20 | Format for KDP, EPUB, PDF |
| social-manager | Heraldspark | Marketing | 10 | Social posts, faction reveals, teasers |
| translator | Tonguebridge | Language | 15 | Translate content to any language |
| curriculum-designer | Gatewarden | Education | 20 | Course structure, lessons, assessments |

---

## Execution Pipeline Architecture

```
User clicks "Run" on /agents/[id]
  │
  ├── 1. Auth check (Supabase session)
  ├── 2. Credit check (sufficient balance?)
  ├── 3. Load agent spec (marketplace_agents or catalog)
  ├── 4. Build system prompt:
  │      spec.systemPrompt
  │      + user context (profile, memories)
  │      + task-specific input
  │      + tool permissions from spec
  ├── 5. Select model (gateway routing)
  ├── 6. Execute via Vercel AI SDK:
  │      streamText({ model, system, messages, tools })
  ├── 7. Stream response to client
  ├── 8. On complete:
  │      - Deduct credits
  │      - Save task to agent_tasks
  │      - Update usage_count
  │      - Save output to creations (optional)
  └── 9. Return downloadable result
```

---

## Marketing Name & Positioning

**Name**: "Arcanea Agents" (simple, clear, brandable)
**Tagline**: "AI that creates for you"
**URL**: arcanea.ai/agents

**Why it matters**: Chat is talking. Agents are DOING. Everyone has chatbots. Nobody has a mythological agent marketplace where AI creates stories, worlds, music, and code — and creators earn money from their custom agents.

**How it builds autonomously**:
1. Agent swarms build new agents (your coding agents create marketplace agents)
2. Community creates agents (70% revenue share incentivizes creators)
3. Each agent interaction generates content (creations feed the gallery)
4. Usage data improves routing (ReasoningBank feedback loop)

**Money while you sleep**: Credits auto-deduct. Marketplace commission auto-collects. Stripe webhooks handle payments. Zero manual intervention.
