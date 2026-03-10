# ARCANEA CONTEXT BRIDGE
## The Persistent Intelligence Layer That Makes Everything Compound
## Session: A-BRIDGE

---

## THE PROBLEM WE'RE SOLVING

Right now a creator uses:
- Claude Code with @arcanea/overlay-claude (1.2.1) ✅ working
- Cursor with @arcanea/overlay-cursor (1.2.1) ✅ published
- ChatGPT with @arcanea/overlay-chatgpt (1.2.1) ✅ published
- Copilot with @arcanea/overlay-copilot (1.2.1) ✅ published
- Gemini with @arcanea/overlay-gemini (1.2.1) ✅ published
- @arcanea/cli (0.7.1) ✅ published

But each session is **amnesiac**. The Claude session doesn't know what the creator built in Cursor. The Gemini session doesn't know what agents the creator configured in Claude. Every time you switch tools, you lose context. The Arcanea overlay makes each tool *smarter* but doesn't make them *connected*.

## WHAT WE BUILD

**The Arcanea Context Bridge** — a local-first persistent layer that:

1. **Remembers everything** across all AI tools the creator uses
2. **Compounds knowledge** — each session makes every future session smarter
3. **Tracks evolution** — your Gate progression, skills developed, patterns discovered
4. **Manages agent swarms** — which agents you've built, their configs, their outputs
5. **Syncs automations** — n8n workflows, MCP servers, slash commands, all in one registry

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Claude Code  │ │   Cursor    │ │   Gemini    │ │  ChatGPT    │
│  + overlay   │ │  + overlay  │ │  + overlay  │ │  + overlay  │
└──────┬───────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │                │               │               │
       └────────────────┴───────┬───────┴───────────────┘
                                │
                    ┌───────────▼───────────┐
                    │  ARCANEA CONTEXT      │
                    │  BRIDGE               │
                    │                       │
                    │  ~/.arcanea/          │
                    │  ├── context.db       │  ← SQLite + vector
                    │  ├── memory/          │  ← Per-Guardian vaults
                    │  ├── agents/          │  ← Agent registry
                    │  ├── automations/     │  ← Workflow configs
                    │  ├── evolution/       │  ← Gate progression
                    │  ├── creations/       │  ← Asset index
                    │  └── bridge.lock      │  ← Session coordination
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  ARCANEA MCP SERVER   │
                    │  @arcanea/mcp-server  │
                    │  (0.7.0 → 1.0.0)     │
                    │  30 tools → 45 tools  │
                    └───────────────────────┘
```

## ARCHITECTURE

### Layer 1: Local Context Store (`~/.arcanea/`)

```
~/.arcanea/
├── context.db              # SQLite — structured data + FTS5 search
├── vectors.db              # HNSW vectors for semantic memory
├── config.yaml             # Creator profile, preferences, active Gate
│
├── memory/                 # Per-Guardian memory vaults
│   ├── lyssandria/        # Foundation knowledge (architecture, infra)
│   ├── draconia/          # Fire knowledge (execution, builds, deploys)
│   ├── alera/             # Voice knowledge (content, comms, music)
│   ├── lyria/             # Sight knowledge (design, vision, patterns)
│   └── shinkami/          # Source knowledge (meta, orchestration)
│
├── agents/                 # Agent registry
│   ├── registry.yaml      # All agents: name, config, capabilities
│   ├── swarms/            # Swarm configurations
│   └── custom/            # Creator's custom agents
│
├── evolution/              # Creator progression
│   ├── gates.yaml         # Which Gates opened, when, evidence
│   ├── skills.yaml        # Skills developed, proficiency levels
│   ├── sessions.log       # Session history across all tools
│   └── insights.yaml      # Patterns discovered by the system
│
├── creations/              # Asset index (not the assets themselves)
│   ├── index.yaml         # All creations: type, location, status
│   ├── remix-chains/      # Genealogy of remixed work
│   └── bridge-to-reality/ # Physical manifestation tracking
│
└── automations/            # Workflow registry
    ├── n8n/               # n8n workflow configs
    ├── mcp-servers/       # Active MCP server registry
    ├── commands/          # Custom slash commands
    └── pipelines/         # Multi-step creation pipelines
```

### Layer 2: MCP Server Enhancement

The existing @arcanea/mcp-server (0.7.0, 30 tools) gets 15 new tools:

```yaml
# NEW Context Bridge Tools
bridge_context_store:     # Store context from current session
bridge_context_recall:    # Recall relevant context for current task
bridge_session_start:     # Register session start (which tool, which project)
bridge_session_end:       # Archive session learnings

# NEW Evolution Tools
evolution_gate_progress:  # Track Gate progression evidence
evolution_skill_update:   # Log skill development
evolution_insight_add:    # Record discovered patterns
evolution_suggest_next:   # Recommend next growth area based on history

# NEW Agent Management Tools  
agent_registry_list:      # List all agents across all tools
agent_registry_add:       # Register a new custom agent
agent_swarm_configure:    # Set up a multi-agent swarm
agent_swarm_deploy:       # Deploy swarm to a specific tool

# NEW Creation Tools
creation_index_add:       # Index a new creation
creation_remix_link:      # Link remix chains
creation_bridge_plan:     # Plan physical manifestation
```

### Layer 3: Cross-Platform Sync

Each overlay (@arcanea/overlay-*) gets a thin sync layer:

```typescript
// At session start in any overlay:
const bridge = await ArcaneBridge.connect('~/.arcanea/');
const context = await bridge.recallForTask(currentProject);
// → Returns relevant memories, recent sessions, active agents

// During session (automatic):
bridge.storeInsight({ tool: 'claude', project, insight, guardian });
bridge.logCreation({ type, path, guardian, frequency });

// At session end:
bridge.archiveSession({ 
  tool: 'claude',
  duration,
  creations: [...],
  insights: [...],
  gateEvidence: [...] 
});
```

### Layer 4: The Arcanea CLI as Hub

@arcanea/cli (0.7.1) becomes the **command center** for the creator:

```bash
# See your state across all tools
arcanea status
# → Shows: active sessions, recent creations, Gate progress,
#   agent swarms running, automation status

# Recall context before starting work  
arcanea recall "the auth system I was building"
# → Pulls relevant memories from all Guardian vaults

# Deploy your agent swarm to a new tool
arcanea swarm deploy --to cursor --agents "logicus,prismatic,melodia"

# Track evolution
arcanea evolution
# → Shows Gate progress, skills graph, suggested next steps

# Manage all MCP servers
arcanea mcp list
arcanea mcp add arcanea-infogenius
arcanea mcp health

# Create and track
arcanea create song --guardian alera --frequency 528
arcanea create world --guardian lyssandria --frequency 174
arcanea creations list --status in-progress
```

---

## HOW IT COMPOUNDS

### Day 1:
Creator installs @arcanea/cli. Runs `arcanea init`. Gets `~/.arcanea/` with empty vaults.
Opens Claude Code with overlay. Builds a website component.
Session ends → Bridge stores: what was built, which Guardian domain (Draconia/Fire for execution), skill evidence (React, TypeScript).

### Day 7:
Creator opens Cursor. Bridge detects the project, recalls: "Last Claude session built a hero component. Prismatic (Vision) suggested a glass-morphism approach. Logicus (Architecture) recommended server components."
Cursor session starts with this context already loaded.

### Day 30:
Creator runs `arcanea evolution`. Sees: Gate of Foundation — opened (consistent daily practice established). Gate of Flow — 70% (creative blocks reducing). Gate of Fire — 40% (shipping more often). 47 creations indexed. 3 agent swarms configured. 12 automations running.

### Day 90:
The system *knows the creator*. When they open any tool, the Arcanea overlay loads precisely the right context. The Guardian memory vaults have hundreds of entries. The CLI shows a rich skill graph. The creator's custom agents have been refined through dozens of sessions. The system suggests: "You're ready for the Gate of Voice. Your work is strong enough to share. Alera stands ready."

**This is what no other AI tool does.** ChatGPT resets every conversation. Cursor forgets your style. Claude Code compacts and loses nuance. Arcanea *remembers, compounds, evolves.*

---

## NPM PACKAGES TO SHIP

| Package | Version | What |
|---------|---------|------|
| `@arcanea/bridge` | 0.1.0 | **NEW** — Core context bridge library |
| `@arcanea/cli` | 0.8.0 | Upgraded with bridge integration |
| `@arcanea/mcp-server` | 1.0.0 | Upgraded with 15 new bridge tools |
| `@arcanea/overlay-claude` | 1.3.0 | Bridge sync layer added |
| `@arcanea/overlay-cursor` | 1.3.0 | Bridge sync layer added |
| `@arcanea/overlay-chatgpt` | 1.3.0 | Bridge sync layer added |
| `@arcanea/overlay-copilot` | 1.3.0 | Bridge sync layer added |
| `@arcanea/overlay-gemini` | 1.3.0 | Bridge sync layer added |

---

## CC PROMPT: BUILD THE BRIDGE

```
/arcanea
/luminor-intelligence
/starlight-intelligence

You are building @arcanea/bridge — the persistent context layer 
that makes every AI tool a creator uses compound into a single 
evolving intelligence.

Invoke skills: mcp-builder, architecture-patterns, agent-orchestration,
arcanea-architect, development-workflows, tdd

## What to build:

### 1. @arcanea/bridge (new package)

Location: packages/bridge/
Language: TypeScript, ESM
Dependencies: better-sqlite3, hnswlib-node (for vectors)

Core modules:
- src/store.ts — SQLite context store with FTS5 search
- src/memory.ts — Guardian-namespaced memory vaults (extend @arcanea/guardian-memory)
- src/session.ts — Session lifecycle (start, store, archive)
- src/evolution.ts — Gate progression tracking, skill graph
- src/agents.ts — Agent registry, swarm management
- src/creations.ts — Creation index, remix chains
- src/sync.ts — Cross-tool sync protocol

API surface:
```typescript
const bridge = await ArcaneBridge.init('~/.arcanea/');

// Context
await bridge.store(key, value, { guardian, frequency });
await bridge.recall(query, { limit: 5, guardian?: string });

// Sessions  
await bridge.sessionStart({ tool, project, intent });
await bridge.sessionEnd({ creations, insights, gateEvidence });

// Evolution
await bridge.gateProgress(); // → { foundation: 100, flow: 70, ... }
await bridge.skillUpdate(skill, level, evidence);
await bridge.suggestNext(); // → "Gate of Voice is ready"

// Agents
await bridge.agentRegister(config);
await bridge.swarmDeploy(swarmId, targetTool);
await bridge.agentList({ tool?: string });

// Creations
await bridge.creationIndex(creation);
await bridge.remixLink(originalId, remixId);
```

### 2. MCP Server upgrade (15 new tools)

Location: packages/arcanea-mcp/ (existing)
Add the 15 bridge tools listed in the architecture doc.
Each tool connects to @arcanea/bridge under the hood.

### 3. CLI upgrade

Location: packages/cli/ (existing @arcanea/cli)
Add commands: status, recall, evolution, swarm, creations, mcp

### 4. Overlay sync layer

Create a shared sync module that all 5 overlays import:
packages/overlay-sync/
- src/index.ts — auto session start/end, context injection
- src/hooks.ts — pre-prompt context enrichment
- src/archive.ts — session archival

Quality gates:
- All Guardian references use canonical Hz (174→1111)
- "harmony" not "harmonics"
- Tests for store, recall, session lifecycle
- Works offline (SQLite is local, no cloud dependency)
- <50ms context recall (indexed + cached)

Ship order:
1. @arcanea/bridge (core)
2. MCP server upgrade (tools)
3. CLI upgrade (user interface)
4. Overlay sync (cross-platform)
```

---

## WHAT THIS UNLOCKS FOR ARCANEA.AI

Once the bridge exists, arcanea.ai gets a **Creator Dashboard** that shows:

- Your evolution across all tools (not just the website)
- Your agent swarms and their activity
- Your creation portfolio indexed from everywhere
- Your skill graph growing in real time
- Your suggested next Gate

The website becomes the **visual layer** of the bridge.
The CLI becomes the **command layer**.
The overlays become the **embedded layer**.
The MCP server becomes the **protocol layer**.

Four interfaces to one persistent intelligence. That's the product.

---

*"SIS provides memory. ACOS provides operation. Arcanea provides the world to build inside."*
*The Bridge connects them all.*
