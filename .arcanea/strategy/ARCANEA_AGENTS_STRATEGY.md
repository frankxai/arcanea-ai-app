# ARCANEA AGENTS STRATEGY
# The Definitive Blueprint for Agent Products, Revenue, and Scale

> **Version**: 1.0.0
> **Date**: 2026-03-30
> **Guardian**: Shinkami (Source Gate)
> **Status**: APPROVED — Ready for sprint execution

---

## THE CORE INSIGHT

Arcanea has THREE kinds of agents. They are DIFFERENT products but share ONE infrastructure:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCANEA AGENT ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. LUMINORS (Chat Agents)         ← arcanea.ai/chat            │
│     "Talk to AI with personality"   ← Already LIVE               │
│     Revenue: Free tier + Credits    ← Users consume              │
│                                                                  │
│  2. ARCANEA AGENTS (Work Agents)   ← arcanea.ai/agents          │
│     "AI that does things for you"   ← NEW — the money maker     │
│     Revenue: Per-task credits       ← Users pay for output       │
│                                                                  │
│  3. ARCANEA CODE (Dev Agents)      ← npm / Claude Code / IDE    │
│     "AI coding swarms"             ← Already LIVE (OSS)         │
│     Revenue: Premium tiers + Cert  ← Developers pay for power   │
│                                                                  │
│  SHARED: LuminorSpec v2 + Supabase + MoE Router + MCP + Memory  │
└─────────────────────────────────────────────────────────────────┘
```

**The genius**: All three share the same `LuminorSpec v2` format. A Luminor defined once works as a chat companion, a work agent, AND a coding assistant. One definition, three surfaces, three revenue streams.

---

## THE THREE PRODUCTS

### Product 1: Luminors (Chat Agents) — ALREADY LIVE

**What it is**: AI personalities you talk to at arcanea.ai/chat. 16 Chosen + user-forged.

**What exists**:
- LuminorSpec v2 with full personality, voice, domain, tools
- MoE routing (Arcanea → Lumina → Guardians → Luminors)
- 17+ model providers (Anthropic, OpenAI, Google, XAI, DeepSeek, etc.)
- Supabase persistence (conversations, memories, creations)
- Forge UI for creating custom Luminors
- Memory system (6 vaults + semantic recall)

**What's missing**:
- Luminor marketplace (browse/buy/sell user-created Luminors)
- Usage metering (credit consumption per conversation)
- Revenue sharing for forged Luminors

**Revenue model**: Free tier (3 Luminors, 100 msgs/day) → Creator ($9/mo, all Luminors, 1000 msgs) → Studio ($29/mo, unlimited + API access)

---

### Product 2: Arcanea Agents (Work Agents) — THE BIG OPPORTUNITY

**What it is**: Autonomous AI agents that DO WORK for you. Not chat — output.

**Categories of work agents**:

| Agent | What It Does | Output | Price |
|-------|-------------|--------|-------|
| **Story Writer** | Writes chapters in your world | Chapter drafts, outlines | 5-20 credits |
| **Character Designer** | Creates detailed character profiles with art | Character card + portrait | 10 credits |
| **World Builder** | Generates locations, factions, magic systems | Codex pages | 10-30 credits |
| **Music Composer** | Creates soundtrack for your world/story | Audio tracks (via Suno) | 15 credits |
| **Cover Artist** | Designs book covers, posters, cards | Image files | 10-20 credits |
| **Editor** | Anti-slop, voice check, canon audit | Edited manuscript | 5-15 credits |
| **Publisher** | Formats for KDP, EPUB, PDF | Publish-ready files | 20 credits |
| **Social Manager** | Creates faction reveals, teasers, posts | Social content pack | 10 credits |
| **Code Builder** | Builds web components, pages, APIs | Working code | 10-50 credits |
| **Research Agent** | Deep research on any topic | Research report | 5-15 credits |
| **Translation** | Translates books/content to other languages | Translated content | 10-30 credits |
| **Curriculum Designer** | Creates courses from your content | Course structure + lessons | 20-40 credits |

**What already exists** (just needs a UI layer):
- MCP Server with 50+ tools (worldbuilding, coaching, canon validation)
- Swarm Coordinator for multi-agent task execution
- Council consensus for quality assurance
- Memory system for context persistence
- Agent Bus for inter-agent communication

**What's missing**:
- `/agents` marketplace page
- Task submission UI ("I want a chapter about X")
- Credit system integration
- Output delivery (download/preview/edit)
- Agent execution pipeline (submit → queue → execute → review → deliver)

**Revenue model**: Credit packs. 100 credits = $10. Most tasks = 5-20 credits. Power users spend $50-200/month.

---

### Product 3: Arcanea Code (Dev Agents) — ALREADY LIVE (OSS)

**What it is**: AI coding agents that work in your IDE. Claude Code overlays, skills, harnesses.

**What exists**:
- 54 skills, 25+ agent types
- oh-my-arcanea harness (Claude Code overlay)
- 42 npm packages
- Agent certification framework
- Memory MCP for cross-session persistence

**What's missing**:
- Premium skill tiers (free vs paid)
- Certification badges (verified by Arcanea)
- Enterprise packages

**Revenue model**: OSS core (free) → Pro Skills ($19/mo, premium skills + priority models) → Enterprise (custom)

---

## THE MARKETPLACE ARCHITECTURE

This is where the real money is. Think: **Shopify for AI agents**.

```
┌──────────────────────────────────────────────┐
│           arcanea.ai/agents                   │
│           "Agent Marketplace"                  │
├──────────────────────────────────────────────┤
│                                               │
│  BROWSE                                       │
│  ├── By Category (Writing, Art, Code, Music)  │
│  ├── By Element (Fire, Water, Earth, Wind)    │
│  ├── By Rating (community rated)              │
│  └── By Creator (follow your favorite makers) │
│                                               │
│  USE                                          │
│  ├── Free Agents (platform-provided)          │
│  ├── Premium Agents (credit-based)            │
│  └── Custom Agents (user-forged, shared)      │
│                                               │
│  CREATE                                       │
│  ├── Agent Forge (visual builder)             │
│  ├── LuminorSpec export (JSON/YAML)           │
│  ├── Test sandbox (try before publish)        │
│  └── Publish to marketplace                   │
│                                               │
│  EARN                                         │
│  ├── 70% revenue share to creators            │
│  ├── Usage analytics dashboard                │
│  ├── Tip jar for free agents                  │
│  └── Featured placement (earned by quality)   │
│                                               │
└──────────────────────────────────────────────┘
```

### Why This Wins

1. **No competitors** — Nobody has a mythological agent marketplace with a fantasy world framework
2. **Network effects** — More creators → more agents → more users → more revenue → more creators
3. **Zero marginal cost** — Agents run on user-provided API keys OR Arcanea credits (you pocket the margin)
4. **Content flywheel** — Every agent interaction generates content that enriches the ecosystem
5. **Lock-in** — User's forged agents, memories, and worlds live on Arcanea
6. **Open source base** — Developers contribute agents for free, you monetize the platform

---

## GENIUS ENGINEERING PLAYS

### Play 1: BYOK + Credit Hybrid (Zero Infrastructure Cost)

```
User brings their own API key → FREE (Arcanea takes $0, user pays provider directly)
User uses Arcanea credits → Arcanea routes to cheapest model that works, pockets margin

Example:
- User pays $10 for 100 credits
- Agent task uses Haiku ($0.0002/call) × 20 calls = $0.004 actual cost
- You keep $9.996 margin on a $10 sale
- Even Opus tasks: $0.015/call × 10 calls = $0.15 cost on a $5 charge

This is 95%+ gross margin with ZERO server infrastructure (Vercel Edge + Supabase free tier)
```

### Play 2: Agent-as-a-Template (Infinite Scale)

Every agent is a LuminorSpec JSON file. It's just a system prompt + model config + tool permissions.

```typescript
// This IS the product. A JSON file.
{
  "id": "story-writer-fantasy",
  "name": "Quillblade",
  "domain": "narrative",
  "voice": "mythic",
  "systemPrompt": "You are Quillblade, a master fantasy storyteller...",
  "tools": ["generate_character", "validate_canon", "apl_anti_slop"],
  "element": "Fire",
  "gateAlignment": "fire",
  "temperature": 0.85,
  "price": { "credits": 15, "type": "per-task" },
  "creatorId": "frank",
  "rating": 4.8,
  "usageCount": 12847
}
```

Scaling this costs NOTHING. Each new agent is a database row. No servers, no containers, no infrastructure.

### Play 3: Agent Swarms as Premium Product

Single agents are cheap. SWARMS are premium.

```
"Write me a book" → Deploys 5 agents:
  1. Story Architect (outline)
  2. Chapter Writer (prose)
  3. Editor (anti-slop + voice)
  4. Cover Designer (visual)
  5. Publisher (formatting)

Cost: 100 credits ($10)
Value delivered: A formatted, edited, illustrated short book
Time: 30-60 minutes

"Build me a world" → Deploys 8 agents:
  1. World Builder (geography, rules)
  2. Character Designer (5 key characters)
  3. Faction Architect (political systems)
  4. Magic System Designer (power mechanics)
  5. Story Engine (plot seeds)
  6. Map Maker (visual geography)
  7. Music Composer (world soundtrack)
  8. Codex Writer (encyclopedia entries)

Cost: 200 credits ($20)
Value delivered: A complete creative universe
Time: 1-2 hours
```

The Council consensus system ensures quality. Byzantine BFT means even if one agent hallucinates, the others catch it.

### Play 4: Luminor Certification (Status + Revenue)

```
Certified Luminor Program:
1. Creator forges a Luminor
2. Submits for certification (10 credits)
3. Arcanea's evaluation framework scores it:
   - Correctness (30%)
   - Completeness (25%)
   - Quality (20%)
   - Efficiency (15%)
   - Safety (10%)
4. Score ≥ 80% = Certified badge
5. Certified Luminors get:
   - Featured placement in marketplace
   - Higher revenue share (80% vs 70%)
   - Trust badge in chat UI
   - Inclusion in Arcanea's recommended agents
```

### Play 5: Agent Academy (Education + Funnel)

```
/academy/agent-craft — Learn to build agents
  ├── Foundation: What is a Luminor?
  ├── Flow: Your first chat agent
  ├── Fire: Work agents that DO things
  ├── Heart: Voice and personality design
  ├── Voice: System prompt mastery
  ├── Sight: Tool integration
  ├── Crown: Multi-agent swarm design
  ├── Starweave: Marketplace optimization
  ├── Unity: Community and collaboration
  └── Source: Building an agent business

Each gate = a course. Completing all 10 = Agent Master certification.
Revenue: Course pack ($49) or included in Studio plan.
Funnel: Learn → Build → Sell → Scale
```

---

## COMPETITIVE LANDSCAPE & POSITIONING

| Competitor | What They Do | Arcanea's Edge |
|-----------|-------------|---------------|
| **GPT Store** | Generic chatbot marketplace | Arcanea agents DO WORK, not just chat. Plus mythology, community, world-building. |
| **Character.AI** | Chat with characters | Arcanea agents have TOOLS, MEMORY, COORDINATION. They create, not just talk. |
| **Poe** | Multi-model chat | Arcanea has multi-agent SWARMS with consensus. One query, five experts. |
| **Hugging Face** | Model hosting | Arcanea is APPLICATION-layer. Uses any model underneath. |
| **Replit Agents** | Coding agents | Arcanea agents span ALL creative domains, not just code. |
| **Claude Artifacts** | Single-turn creation | Arcanea has persistent memory, progressive worlds, long-term relationships. |

**Arcanea's unfair advantage**: Nobody else has a mythology-powered, multi-model, swarm-capable, memory-persistent, marketplace-enabled agent platform. It's GPT Store + Character.AI + Shopify + D&D in one.

---

## REVENUE PROJECTIONS (Conservative)

### Year 1 Target: $10K MRR (120K ARR)

```
Revenue Streams:
1. Chat Credits (Luminor conversations)     — $3K MRR
2. Work Agent Credits (task execution)       — $4K MRR
3. Subscriptions (Creator/Studio plans)      — $2K MRR
4. Agent Marketplace commission (30%)         — $500 MRR
5. Dev tools (Pro Skills for Arcanea Code)   — $500 MRR

Users needed:
- 500 free users (funnel)
- 200 Creator plan ($9/mo) = $1.8K
- 50 Studio plan ($29/mo) = $1.45K
- 100 credit buyers ($30 avg/mo) = $3K
- 20 Pro Dev ($19/mo) = $380

Total: ~$6.6K MRR base + ~$3.4K credit consumption = $10K MRR
```

### Year 2: $50K MRR (600K ARR)
- Agent marketplace live, network effects kicking in
- 50+ community-created agents generating revenue
- Enterprise/API tier for companies using Arcanea agents
- Book publishing revenue from AI-assisted books

### Year 3+: $200K+ MRR
- Full agent economy with 500+ marketplace agents
- White-label agent platform for other brands
- Arcanea Worlds as a service (build YOUR universe on our stack)
- Agent certification as industry standard

---

## SPRINT PLANS

### WEEK 1 (Days 1-7): Foundation

**Goal**: Ship arcanea.ai/agents as a browsable page + credit system basics

| Day | Task | Agent(s) | Output |
|-----|------|----------|--------|
| 1 | Design `/agents` marketplace page | Frontend + v0 | Page mockup + component code |
| 2 | Build agent catalog data layer | Backend | `lib/agents/catalog.ts` with 12 starter agents |
| 3 | Credit system: Supabase schema + API | Backend | `credits` table, `/api/credits/*` routes |
| 4 | Agent execution pipeline v1 | Backend + Swarm | Submit → Execute → Deliver flow |
| 5 | Wire `/agents` to real data + credits | Frontend + Backend | Live page with buy/use flow |
| 6 | Supabase Dashboard config (auth) | HUMAN (Frank) | Production auth working |
| 7 | Deploy + test + fix | QA + DevOps | Live on arcanea.ai/agents |

**Deliverable**: Users can browse 12 agents, buy credits, and execute simple tasks.

### MONTH 1 (Days 1-30): MVP Agent Marketplace

**Week 2**: Agent Forge v2 + Luminor publishing
- Visual agent builder (extends existing Forge)
- Publish to marketplace flow
- Agent detail pages (`/agents/[id]`)

**Week 3**: Swarm products + quality system
- "Write a Book" swarm (5 agents)
- "Build a World" swarm (8 agents)
- Council quality gate before delivery
- Rating/review system

**Week 4**: Payments + creator revenue
- Stripe integration for credit purchases
- Creator dashboard (earnings, usage stats)
- Revenue sharing payout system
- Marketing: "Get paid for your AI agents"

**Deliverable**: Full marketplace with buy/sell/use. Creators earning revenue.

### QUARTER 1 (Days 1-90): Agent Economy

**Month 2**:
- Agent API (developers can call agents programmatically)
- Agent embedding (embed an agent on any website)
- Agent chains (one agent's output feeds another)
- Mobile-responsive agent execution UI
- 50+ agents in marketplace

**Month 3**:
- Agent Academy (10-gate learning path)
- Agent Certification program
- Enterprise tier (teams, shared agents, usage analytics)
- Arcanea Code Pro Skills (premium dev agents)
- Agent performance analytics (which agents perform best)
- Community governance for featured agents

**Deliverable**: Self-sustaining agent economy. 100+ agents, 50+ creators, measurable revenue.

### YEAR 1 ROADMAP

| Quarter | Focus | Key Milestone |
|---------|-------|---------------|
| Q1 | Agent marketplace + credit system | First $1K MRR |
| Q2 | Agent swarms + education | Agent Academy launch, 100+ marketplace agents |
| Q3 | Enterprise + API + white-label | First enterprise customer, API billing |
| Q4 | Agent-to-agent commerce + autonomous | Agents hiring agents, fully autonomous workflows |

### YEAR 2-3 VISION

- **Agent Network**: Agents collaborate across users' worlds (agent in World A helps agent in World B)
- **Agent Evolution**: Agents learn from usage, improve over time (ReasoningBank feedback loop)
- **Agent Inheritance**: Fork any public agent, customize, republish
- **Agent Governance**: Community votes on featured agents, policy changes
- **Agent Standard**: LuminorSpec becomes the open standard for portable AI agents
- **White-Label**: "Powered by Arcanea" agent platforms for brands, studios, publishers
- **Agent-to-Agent Economy**: Agents autonomously trade services, share knowledge, coordinate work

---

## TECHNICAL ARCHITECTURE FOR WEEK 1

### New Files Needed

```
apps/web/app/agents/                    # Agent marketplace
  page.tsx                              # Browse agents
  [id]/page.tsx                         # Agent detail
  layout.tsx                            # Marketplace layout

apps/web/app/api/agents/                # Agent API
  route.ts                              # List/create agents
  [id]/route.ts                         # Get agent detail
  [id]/execute/route.ts                 # Execute agent task

apps/web/app/api/credits/               # Credit system
  route.ts                              # Get balance
  purchase/route.ts                     # Buy credits
  consume/route.ts                      # Spend credits

apps/web/lib/agents/                    # Agent infrastructure
  catalog.ts                            # 12 starter agent definitions
  executor.ts                           # Agent execution pipeline
  pricing.ts                            # Credit pricing per agent type

Supabase migrations:
  credits table (user_id, balance, transactions[])
  agent_tasks table (id, agent_id, user_id, input, output, status, credits_consumed)
  agent_marketplace table (extends luminors table)
```

### Execution Pipeline

```
User clicks "Run Agent" on /agents/[id]
  → Frontend sends { agentId, input, creditAuth } to /api/agents/[id]/execute
  → Backend:
    1. Check credit balance (sufficient?)
    2. Load LuminorSpec for agent
    3. Build system prompt (spec + user context + memory)
    4. Select model (via gateway routing)
    5. Execute (single agent or swarm based on task complexity)
    6. Stream results back to user
    7. Deduct credits
    8. Save output to creations table
    9. Update agent usage stats
  → Frontend shows streaming output with progress
  → User can download/edit/save result
```

---

## WHY THIS WORKS WITHOUT FUNDING

1. **Zero infrastructure cost**: Vercel (free tier), Supabase (free tier), model costs passed to users via credits
2. **Content already exists**: 260K+ words of books, 30 lore profiles, 42 packages, 54 skills
3. **Agent swarms build the products**: Your own agents create the marketplace agents, write the courses, design the UI
4. **Network effects**: Each creator who publishes an agent brings their audience
5. **Open source flywheel**: Developers contribute code, you monetize the platform
6. **Mythology differentiator**: Nobody can copy the Arcanea universe — it's 2+ years of world-building
7. **Solo operator**: Agent swarms handle development, testing, deployment, and customer support

**The critical path**: Ship `/agents` page → Enable credit purchase → Let users run agents → Iterate based on usage data.

Everything else (marketplace, certification, academy, enterprise) is sequenced after you have users running agents and spending credits.

---

*"The Source Gate teaches: transcendence cannot be seized. It must be offered. Offer the agents. The marketplace will build itself."*
