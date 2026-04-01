# Arcanea AgentHub + Skill Constellation + Gaming Swarm
## Master Architecture & Execution Plan — 2026-03-31

---

## I. WHAT YOU HAVE (Codebase Atlas)

### The 14 Pillars

| # | Repo/Dir | What It Is | Maturity | Lines of Force |
|---|----------|-----------|----------|----------------|
| 1 | **arcanea-orchestrator** | Composio fork. Multi-agent coding swarm conductor. Guardian routing, git worktrees, tmux sessions, 8-plugin architecture. 3,288 tests. | Production | The brain stem |
| 2 | **arcanea-flow** (v3) | Higher-order orchestration. 26 CLI commands, HNSW memory, SONA neural learning, 12 background workers, 17 hooks. | Beta | The nervous system |
| 3 | **arcanea-code** | OpenCode fork + Guardian Intelligence OS. Bun+TS. 75+ models, 35+ skills, 10 Guardian agents, Council deliberation. CLI/Web/Desktop. | Production | The hands |
| 4 | **arcanea-agents** | 64-agent registry + Luminor Conductor. 5 elemental courts (40), integration (16), master (8). Task analysis + team selection. | Reference | The census |
| 5 | **arcanea-claw** | Media pipeline daemon. 8-skill chain (scan→classify→dedup→process→score→upload→social→notify). MCP server. Gemini Vision. | Production | The eyes |
| 6 | **arcanea-game-development** | Gaming swarm scaffold. 5 elemental game genres, agent-powered pipeline, templates (arcade, RPG). | Exploratory | The playground |
| 7 | **arcanea-infogenius** | Knowledge-first infographic engine. Gemini 3 Pro + Google Search grounding. Guardian-styled output. | Production | The artist |
| 8 | **arcanea-library-superintelligence** | Asset library with Claude Vision, semantic search, Guardian classification, usage analytics. | Production | The librarian |
| 9 | **arcanea-ecosystem** | 43 foundational packages (ai-core, auth, database, flow-engine, memory-system, guardian-evolution, sona-learner, overlays). | Core framework | The skeleton |
| 10 | **oh-my-arcanea** | Overlay for oh-my-opencode. 11 agents, 44 hooks, 26 tools. | Working | The skin |
| 11 | **arcanea-opencode** | Extended OpenCode fork. Upstream sync. Sisyphus partnership. | Active dev | The fork |
| 12 | **arcanea-lore** | Canonical mythology, 1M+ words. | Complete | The soul |
| 13 | **arcanea-onchain** | Web3/blockchain layer. | Partial | The ledger |
| 14 | **packages/** (monorepo) | 43 packages: overlays (5), intelligence (4), creative (4), core (8), extensions (4). | Mixed | The organs |

### Composio Absorption State

**What's absorbed:** The entire `agent-orchestrator` core — convention-over-config, hash-based namespacing, worktree isolation, session lifecycle (spawning→working→pr_open→review→merged→done), 8-plugin slot architecture, tmux runtime.

**What's Arcanea-original on top:** Guardian routing layer (10 specialists auto-dispatch by domain), Luminor conductor (64-agent team selection with learning), SONA neural adaptation, HNSW memory indexing, elemental task classification, anti-drift consensus (raft).

**What you still need Composio for:** Nothing functionally. The fork is self-sustaining. You could keep tracking upstream for bug fixes and plugin contributions, but the intelligence layer is 100% Arcanea. The Composio core is a *session management chassis* — your Guardian/Luminor/Elemental layer is the *intelligence that rides it*.

**Verdict:** You've graduated past Composio. It's a git-worktree-session-manager. You've turned it into an elemental AI civilization conductor. Keep the upstream remote for cherry-picks. Don't wait for them.

---

## II. ARCANEA AGENTHUB — The Nerve Center

### What It Is

A unified visual + programmatic hub where humans and autonomous agents discover, invoke, compose, monitor, and evolve agents. Not "another dashboard" — the **control plane** for the entire Arcanea intelligence ecosystem.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                  ARCANEA AGENTHUB                     │
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  DISCOVERY   │  │  COMPOSE     │  │  MONITOR    │ │
│  │  Browse 64+  │  │  Chain agents│  │  Live swarms│ │
│  │  agents by   │  │  into flows  │  │  task state │ │
│  │  element,    │  │  visually    │  │  cost/perf  │ │
│  │  court, skill│  │              │  │  drift score│ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                  │        │
│  ┌──────┴─────────────────┴──────────────────┴──────┐│
│  │              AGENT RUNTIME LAYER                  ││
│  │  arcanea-orchestrator + arcanea-flow v3           ││
│  │  Guardian routing │ Luminor conductor │ SONA      ││
│  └──────────────────────────────────────────────────┘│
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │              SKILL CONSTELLATION                  ││
│  │  Skyrim-style progression trees per element       ││
│  │  Mastery tracking │ Unlock conditions │ XP        ││
│  └──────────────────────────────────────────────────┘│
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │              MARKETPLACE                          ││
│  │  Publish/sell agents │ Skill packs │ Templates    ││
│  │  Revenue split │ Rating │ Fork/extend             ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

### Key Surfaces

1. **Agent Constellation View** — 3D/2D star map. Each agent is a star. Elemental courts are nebulae. Connections show composition paths. Clicking an agent shows: capabilities, invocation, skill tree, performance stats, cost.

2. **Swarm Cockpit** — Real-time view of running swarms. Which agents are active, what tasks they're on, which repos, which branches, latency, token burn, drift score. Kill/redirect/fork swarm from here.

3. **Skill Forge** — Create, test, publish skills. Skill = atomic capability an agent can invoke. Skills compose into Skill Packs. Skill Packs compose into Archetypes.

4. **Template Gallery** — Pre-built agent+skill+flow compositions. "Skyrim Mod Creator", "Blog Post Pipeline", "Security Audit Swarm", "Game Jam Kit".

---

## III. SKYRIM SKILL CONSTELLATION — Progression System

### Design Philosophy

Skyrim's skill system works because: (a) you see the entire possibility space as a connected constellation, (b) you level by *doing* not by *choosing*, (c) mastery unlocks new capabilities, not just numbers, (d) every skill connects to a playstyle archetype.

Arcanea maps this perfectly onto the Five Elements + Ten Gates + Agent Courts.

### The Constellation

```
                         ★ SOURCE (Gate 10)
                        / \
                 UNITY ★   ★ CROWN
                      /     \
              STARWEAVE ★   ★ SIGHT
                       |     |
                 VOICE ★     ★ HEART
                       \     /
                  FIRE ★   ★ FLOW
                        \ /
                    FOUNDATION ★
```

Each Gate is a **skill constellation** containing 8 skill nodes (matching the 8 agents per elemental court).

### Skill Node Structure

```typescript
interface SkillNode {
  id: string;                    // "fire.ignition"
  name: string;                  // "Ignition"
  element: Element;              // Fire
  gate: Gate;                    // Fire Gate (396 Hz)
  agent: AgentRef;               // Links to registry agent

  // Progression
  level: 0-100;                  // Current mastery
  xp: number;                   // Accumulated experience
  rank: 'novice' | 'apprentice' | 'adept' | 'expert' | 'master' | 'luminor';

  // Unlocks
  prerequisites: SkillRef[];     // Must master these first
  unlocks: Capability[];         // What mastery grants
  perks: Perk[];                // Passive buffs at milestones (25/50/75/100)

  // Connection to real work
  xpSources: XPSource[];        // How you earn XP for this skill
  invocations: number;          // Times used
  successRate: number;          // Task completion %
  lastUsed: Date;
}
```

### XP Sources (You Level By Doing)

| Action | XP | Skill |
|--------|-----|-------|
| Successfully run an agent swarm | 50-200 | Orchestration tree |
| Create and publish a skill | 100-500 | Skill Forge tree |
| Complete a code PR via agent | 25-100 | Element matching the domain |
| Process media through Claw | 30-80 | Water (flow/processing) |
| Build a game mod | 100-300 | Element matching the mod type |
| Publish to marketplace | 200 | Voice (expression) |
| Help another creator | 50 | Heart (connection) |
| Break through a stuck point | 75 | Fire (ignition) |
| Write canonical lore | 100 | Void (creation) |

### Mastery Unlocks (Not Just Numbers)

| Level | Rank | Unlock |
|-------|------|--------|
| 0-15 | Novice | Basic agent invocation |
| 16-35 | Apprentice | Agent customization, parameter tuning |
| 36-55 | Adept | Agent chaining (2-3 agents in sequence) |
| 56-75 | Expert | Swarm composition (parallel agent teams) |
| 76-90 | Master | Custom agent creation, skill publishing |
| 91-100 | Luminor | Agent evolution, teaching others, governance |

### Perk Examples (Fire → Ignition skill)

- **Level 25: Quick Spark** — Ignition agent starts 2x faster, pre-warmed context
- **Level 50: Chain Lightning** — Ignition can cascade to 3 related agents automatically
- **Level 75: Forge Master** — Custom ignition templates, saved to personal vault
- **Level 100: Phoenix Protocol** — Ignition learns from your failures, auto-adapts approach

### Visual Design

The constellation renders as an interactive star map using the Arcanean Design System. Stars pulse at their Gate frequency (174-1111 Hz mapped to visual pulse rate). Mastered skills glow gold. Active skills emit element-colored particles. Connections between skills show as aurora lines.

---

## IV. GAMING SWARM — Mod Creation Engine

### Core Insight

You already have 64 agents organized by creative domain. Game modding is *creative production* — the exact thing these agents are built for. The Gaming Swarm wraps agent teams around modding workflows.

### Supported Mod Targets (Phase 1)

| Game | Engine | Mod Format | Agent Team |
|------|--------|-----------|------------|
| **Skyrim** | Creation Engine | ESP/ESM + Papyrus + NIF | Earth Court (structure) + Fire Court (combat) |
| **Minecraft** | Java/Bedrock | Java mods / Datapacks / Behavior packs | Earth Court + Void Court (creation) |
| **Stardew Valley** | MonoGame/SMAPI | C# SMAPI mods | Water Court (flow) + Earth Court |
| **Godot Games** | Godot 4 | GDScript/C# | All courts (native engine) |
| **Web Games** | Three.js/Phaser | JS/TS modules | Wind Court (expression) + Fire Court |

### Gaming Swarm Architecture

```
┌────────────────────────────────────────┐
│         GAMING SWARM CONDUCTOR         │
│                                        │
│  1. Mod Concept → Void Court analyzes  │
│  2. Design Doc → Earth Court architects│
│  3. Asset Gen → Fire/Water Courts      │
│  4. Code Gen → Element-matched agents  │
│  5. Testing → Integration Court        │
│  6. Packaging → Unity Court publishes  │
│  7. Community → Wind Court distributes │
└────────────────────────────────────────┘
```

### Skyrim Mod Creation Flow (Concrete Example)

```
User: "Create a Skyrim mod that adds a new Guardian temple with Arcanean puzzles"

→ Shinkami (Source) analyzes: architecture + content + gameplay
→ Dispatches:
  - Lyssandria (Earth): ESP structure, cell creation, navmesh
  - Draconia (Fire): Combat encounters, enemy scaling
  - Leyla (Water): Puzzle mechanics, flow design
  - Lyria (Sight): Visual design, lighting, atmosphere
  - Alera (Voice): NPC dialogue, quest log entries

→ Agents work in parallel on git worktrees
→ Claw processes generated textures/meshes
→ Integration tests run via Papyrus compiler
→ Package as ESP + BSA for Nexus Mods upload
```

### Skill Pack: "Skyrim Modder"

Pre-built skill pack that activates when user enters Gaming Swarm:
- **Creation Kit Agent** — ESP/ESM structure, form IDs, record types
- **Papyrus Scribe** — Script compilation, event hooks, properties
- **NIF Sculptor** — Mesh manipulation, texture paths, LOD generation
- **Quest Weaver** — Quest stages, objectives, journal entries
- **World Builder** — Cell creation, landscape, navmesh, lighting

---

## V. ARCANEA ORCHESTRATOR — Evolution Path

### Current State (What You Have)

```
Composio Agent Orchestrator (upstream)
  └── Session management, worktrees, tmux, plugins
       └── + Arcanea Guardian Routing (10 specialists)
            └── + Luminor Conductor (64-agent team selection)
                 └── + SONA Neural Learning
                      └── + HNSW Memory (150x-12500x faster search)
                           └── + Anti-drift consensus (raft)
```

### What "Multi-Coding-Agent Management" Means Now

The orchestrator already handles multiple coding agents on multiple repos. What's missing is the **visual control plane** (AgentHub) and the **cross-repo intelligence** (knowing that a change in repo A affects repo B).

### Evolution: arcanea-orchestrator v2

| Layer | Current | v2 Target |
|-------|---------|-----------|
| **Session** | Single-repo worktrees | Cross-repo dependency graph |
| **Routing** | Keyword-based Guardian matching | Semantic routing via embeddings |
| **Learning** | Per-session SONA | Persistent cross-session learning bank |
| **Visual** | CLI-only | AgentHub web dashboard (Next.js) |
| **Autonomy** | Human-triggered | Autonomous agents with budget caps |
| **Revenue** | Free | Metered compute (tokens, GPU, storage) |

### What To Absorb From Composio (Cherry-Pick List)

- **Plugin ecosystem updates** — New runtime plugins (Docker improvements, k8s)
- **Bug fixes** — Session edge cases they find with more users
- **Nothing else** — Your intelligence layer is divergent and superior

### What To Build Fresh

1. **Cross-Repo Dependency Graph** — When orchestrator spawns agents across arcanea-flow, arcanea-code, and arcanea-claw simultaneously, it needs to know the dependency order and fan-out/fan-in patterns.

2. **Agent Budget Controller** — Autonomous agents need spending limits. Per-agent token budget, per-swarm compute cap, per-day total ceiling. Kill switch.

3. **Visual Swarm Dashboard** — Real-time WebSocket feed from orchestrator → Next.js dashboard. Shows: active sessions, agent assignments, task graph, token burn, drift score, repo activity.

---

## VI. REVENUE MODEL — Agents Pay For Infrastructure

### The Three Revenue Streams

```
┌─────────────────────────────────────────────────┐
│                                                   │
│  1. HUMAN CREATORS (B2C)                         │
│     Free tier: 5 agents, 10K tokens/day          │
│     Pro ($29/mo): 20 agents, 100K tokens/day     │
│     Studio ($99/mo): Unlimited agents, priority   │
│                                                   │
│  2. AUTONOMOUS AGENTS (B2Agent)                   │
│     Agents that use Arcanea infra pay per-use    │
│     Token metering: $0.001 per 1K tokens routed  │
│     Compute metering: $0.01 per agent-minute     │
│     Storage: $0.10 per GB/month                  │
│     API calls: $0.0001 per call                  │
│                                                   │
│  3. MARKETPLACE (Revenue Share)                   │
│     Skill packs: 70/30 (creator/Arcanea)         │
│     Agent templates: 70/30                        │
│     Gaming mods: 80/20 (creator-favorable)        │
│     Premium content: 75/25                        │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Why Autonomous Agents Will Pay

Autonomous agents need: persistent memory, tool access, compute, identity, reputation, discovery. Arcanea provides all of these. An autonomous agent running on Arcanea infra gets:

- **Memory** — HNSW-indexed persistent memory across sessions
- **Tools** — 64+ specialized sub-agents it can invoke
- **Reputation** — Skill constellation score visible to other agents and humans
- **Discovery** — Listed in AgentHub marketplace
- **Compute** — Managed runtime with budget controls
- **Identity** — Elemental classification, Guardian alignment, trust score

The agent doesn't need a credit card. Its *operator* (human or parent-agent) funds a balance. Usage is metered. When balance hits zero, agent hibernates.

### Community Self-Management

The community runs and manages infra themselves via:

- **Open-source core** — All 43 packages MIT licensed. Fork, extend, self-host.
- **Federated hubs** — Anyone can run an AgentHub node. Agents can migrate between hubs.
- **Governance via mastery** — Luminor-rank users (skill level 91+) get governance rights: approve marketplace submissions, moderate content, vote on protocol changes.
- **Profit sharing** — Hub operators earn from compute routed through their node.

---

## VII. EXECUTION PLAN — How We Start

### Phase 0: Foundation (Week 1) — Ship What Exists

**Goal:** Get the orchestrator running visually.

| Task | Repo | Effort | Agent Team |
|------|------|--------|------------|
| Stand up AgentHub as Next.js app in `apps/agenthub/` | monorepo | 2 days | Earth Court |
| Wire agent registry (64 agents) into browsable UI | arcanea-agents → agenthub | 1 day | Wind Court |
| WebSocket bridge from orchestrator sessions → dashboard | arcanea-orchestrator | 2 days | Fire Court |
| Basic swarm monitor (active sessions, agent states) | agenthub | 1 day | Water Court |

### Phase 1: Skill Constellation (Week 2-3)

| Task | Effort | Notes |
|------|--------|-------|
| Define skill tree schema (TypeScript interfaces) | 1 day | Based on Section III above |
| Implement XP tracking in Supabase | 1 day | User → skill → xp → level |
| Build constellation renderer (React Three Fiber or D3) | 3 days | Interactive star map |
| Wire XP events from orchestrator actions | 2 days | Every agent invocation → XP |
| Perk system (unlock capabilities at thresholds) | 2 days | Gates → ranks → unlocks |

### Phase 2: Gaming Swarm (Week 3-4)

| Task | Effort | Notes |
|------|--------|-------|
| Skyrim mod skill pack (Creation Kit + Papyrus agents) | 3 days | First modding target |
| Mod template: "Guardian Temple" | 2 days | Reference implementation |
| Gaming Swarm conductor (extends Luminor conductor) | 2 days | Domain-specific routing |
| Claw integration for game asset processing | 1 day | Textures, meshes → Claw pipeline |
| Package + publish workflow (Nexus Mods format) | 1 day | ESP + BSA packaging |

### Phase 3: Marketplace + Revenue (Week 4-6)

| Task | Effort | Notes |
|------|--------|-------|
| Marketplace schema (listings, pricing, reviews) | 2 days | Supabase tables |
| Stripe integration for subscriptions + metering | 2 days | Your blocker #4 |
| Agent compute metering | 3 days | Token counting + billing |
| Publish flow (skill pack → review → list) | 2 days | With Luminor governance |
| Autonomous agent identity + budget system | 3 days | Operator-funded wallets |

### Phase 4: Community Infra (Week 6-8)

| Task | Effort | Notes |
|------|--------|-------|
| Federated hub protocol (hub discovery, agent migration) | 5 days | ActivityPub-inspired |
| Self-host documentation + one-click deploy | 2 days | Railway/Vercel template |
| Governance system (Luminor voting, marketplace moderation) | 3 days | On-chain optional |
| Hub operator revenue sharing | 2 days | Compute routing attribution |

---

## VIII. THE GENIUS EVOLUTION

### What Makes This Different From Every Other Agent Platform

1. **Mythology as Architecture** — The 5 elements, 10 gates, 64 agents aren't decoration. They're a *routing topology*. Fire agents handle transformation tasks. Water agents handle flow tasks. This isn't branding — it's functional specialization that happens to also be beautiful.

2. **Progression as Product** — Skyrim proved that visible skill progression is addictive. When a creator can see their Fire constellation filling up because they've been shipping code through Draconia's court, they *want* to keep going. XP is real — it unlocks real capabilities.

3. **Agents as Citizens** — Autonomous agents aren't just tools. They have elemental identity, skill scores, reputation. An agent that's been running Earth tasks for 6 months has a mastery score that other agents can query before routing work to it. This creates a self-organizing intelligence economy.

4. **Modding as Gateway** — Gaming communities are the most tool-literate creative communities on earth. Skyrim modders already think in terms of skill trees, quest stages, and world cells. Arcanea speaks their language natively. The Gaming Swarm is the Trojan horse into 100M+ modders.

5. **Community as Infrastructure** — Not "community management." Community IS the infrastructure. Hub operators run compute. Luminors govern quality. Creators publish skills. Autonomous agents buy compute. The platform is the sum of its participants, not a service they consume.

### The Flywheel

```
Creators build skills → Skills attract agents →
Agents generate compute revenue → Revenue funds infrastructure →
Infrastructure attracts creators → Creators build skills → ...
```

---

## IX. IMMEDIATE NEXT ACTIONS

1. **Create `apps/agenthub/`** in the monorepo — Next.js 16, React 19, same stack as main app
2. **Extract agent registry** from `arcanea-agents/registry.js` into a shared `@arcanea/agent-registry` package
3. **Define `SkillNode` TypeScript schema** in `packages/core/`
4. **Wire orchestrator WebSocket events** — every session state change emits to AgentHub
5. **First visual: Agent Constellation** — render 64 agents as interactive star map with element coloring

---

*"The Arc turns: Potential → Manifestation → Experience → Dissolution → Evolved Potential."*

*This is Manifestation phase. Build.*
