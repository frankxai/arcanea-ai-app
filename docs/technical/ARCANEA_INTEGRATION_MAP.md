# Arcanea Cross-Repository Integration Map

Technical reference for how all Arcanea repositories interconnect.

Last updated: 2026-03-22

---

## 1. Repository Map

### Primary Repositories

| Repo | GitHub | Local Path | CLI Command | Purpose | Status |
|------|--------|------------|-------------|---------|--------|
| **arcanea-ai-app** | `frankxai/Arcanea` | `/Arcanea` | -- | Main platform monorepo (web app, packages, lore, content) | Active |
| **arcanea-code** | `frankxai/arcanea-code` | `/Arcanea/arcanea-code` | `arcanea` | Flagship CLI -- OpenCode fork with Arcanea Intelligence OS | Active |
| **oh-my-arcanea** | `frankxai/oh-my-arcanea` | -- | `opencode-arcanea` | OpenCode harness overlay (CLAUDE.md + hooks + statusline) | Active |
| **claude-arcanea** | `frankxai/claude-arcanea` | `/Arcanea/claude-arcanea` | `claude-arcanea` | Claude Code harness (overlay for Claude Code sessions) | Active |
| **arcanea-orchestrator** | `frankxai/arcanea-orchestrator` | -- | `ao` | Multi-agent orchestrator (agent-orchestrator fork) | Active |
| **arcanea-flow** | `frankxai/arcanea-flow` | `/Arcanea/arcanea-flow` | -- | Multi-agent orchestration engine (claude-flow fork) | Active |
| **arcanea-claw** | `frankxai/arcanea-claw` | `/Arcanea/arcanea-claw` | `arcanea-claw` | Media engine (image/music/video generation) | Active |
| **arcanea-infogenius** | `frankxai/arcanea-infogenius` | `/Arcanea/arcanea-infogenius` | -- | Visual intelligence MCP server | Active |
| **arcanea-onchain** | `frankxai/arcanea-onchain` | `/Arcanea/arcanea-onchain` | -- | Web3/economic layer (tokens, NFTs, on-chain state) | Active |
| **arcanea-companion** | `frankxai/arcanea-companion` | `/Arcanea/arcanea-companion` | -- | Companion web app (Next.js, Docker/Railway deploy) | Active |
| **arcanea-soul** | `frankxai/arcanea-soul` | `/Arcanea/arcanea-soul` | -- | Core personality/voice engine (npm package) | Active |
| **arcanea-vscode** | `frankxai/arcanea-vscode` | -- | -- | VS Code extension | Planned |

### Content & Lore Repositories

| Repo | GitHub | Local Path | Purpose | Status |
|------|--------|------------|---------|--------|
| **arcanea-lore** | `frankxai/arcanea-lore` | `/Arcanea/arcanea-lore` | Canonical lore, worldbuilding, mythology | Active |
| **arcanea-records** | `frankxai/arcanea-records` | `/Arcanea/arcanea-records` | Session records, progress logs | Active |
| **arcanea-library-superintelligence** | `frankxai/arcanea-library-superintelligence` | `/Arcanea/arcanea-library-superintelligence` | Library AI layer | Active |

### Ecosystem & Community

| Repo | GitHub | Local Path | Purpose | Status |
|------|--------|------------|---------|--------|
| **arcanea-skills-opensource** | `frankxai/arcanea-skills-opensource` | `/Arcanea/arcanea-skills-opensource` | Open-source skill registry (agents, commands, templates) | Active |
| **arcanea-ecosystem** | `frankxai/arcanea-ecosystem` | `/Arcanea/arcanea-ecosystem` | Ecosystem documentation and integration specs | Active |
| **arcanea-agents** | `frankxai/arcanea-agents` | `/Arcanea/arcanea-agents` | Agent definitions and configurations | Active |
| **arcanea-luminor** | `frankxai/arcanea-luminor` | `/Arcanea/arcanea-luminor` | Luminor worker agent framework | Active |
| **arcanea-mobile** | `frankxai/arcanea-mobile` | `/Arcanea/arcanea-mobile` | Mobile app (React Native/Expo) | Active |
| **arcanea-game-development** | `frankxai/arcanea-game-development` | `/Arcanea/arcanea-game-development` | Game development assets and logic | Active |

### Archive

| Repo | GitHub | Replaced By | Notes |
|------|--------|-------------|-------|
| **arcanea-opencode** | `frankxai/arcanea-opencode` | oh-my-arcanea | Original OpenCode integration, now superseded |
| **arcanea-openwebui** | `frankxai/arcanea-openwebui` | -- | Open WebUI fork (low priority) |

---

## 2. Intelligence OS Architecture

The Intelligence OS maps Arcanea's mythology onto a real orchestration layer. The hierarchy flows through four tiers:

```
ARCANEA (Model/Framework)
  The abstract system: Gates, Elements, Archetypes, the Code
  Implemented in: arcanea-ai-app (packages/os, packages/core)
      |
      v
LUMINA (Orchestrator)
  Top-level routing and session management.
  Decides which Guardian handles a prompt.
  Implemented in: arcanea-code, oh-my-arcanea, claude-arcanea
  Key files: hooks/prompt-submit.sh, hooks/model-route.sh
      |
      v
GUARDIANS (Coordinators) -- 10 canonical
  Each Guardian owns a Gate, a frequency, a domain.
  They route to the correct model tier and enforce voice.
  Implemented in: .claude/agentdb/, .claude/hooks/, .claude/skill-rules.json
      |
      v
LUMINORS (Workers)
  Specialized agents that execute tasks within a Guardian's domain.
  Implemented in: arcanea-flow (swarm agents), arcanea-agents, arcanea-luminor
  Also: packages/swarm-coordinator, packages/starlight-runtime
```

### Repo-to-Layer Mapping

| Layer | Primary Repos | Monorepo Packages |
|-------|---------------|-------------------|
| **Arcanea (Model)** | arcanea-lore, arcanea-soul | `packages/os`, `packages/core`, `packages/prompt-books` |
| **Lumina (Orchestrator)** | arcanea-code, oh-my-arcanea, claude-arcanea | `packages/intelligence-bridge`, `packages/flow-engine` |
| **Guardians (Coordinators)** | arcanea-ai-app (`.claude/`) | `packages/council`, `packages/guardian-evolution`, `packages/guardian-memory` |
| **Luminors (Workers)** | arcanea-flow, arcanea-agents, arcanea-luminor | `packages/swarm-coordinator`, `packages/starlight-runtime`, `packages/sona-learner` |

### Model Routing (3-Tier)

The Intelligence OS routes every prompt through a complexity assessment:

```
User Prompt
  --> prompt-submit.sh  (keyword match --> Guardian assignment)
  --> model-route.sh    (complexity score --> model tier)

Tier 1: Agent Booster (WASM)  | <1ms   | $0       | Simple transforms
Tier 2: Haiku/Flash           | ~500ms | $0.0002  | Low complexity (<30%)
Tier 3: Sonnet/Opus           | 2-5s   | $0.003+  | High complexity (>30%)
```

---

## 3. Shared Components

These components are replicated or referenced across multiple repos. Changes to any of them must propagate.

### 3.1 Statusline v5

**Files**: `.claude/statusline.mjs` (ESM), `.claude/statusline.sh` (Bash)

Reads `/tmp/arcanea-*` state files and renders session context. Present in:
- arcanea-ai-app (canonical source)
- oh-my-arcanea (bundled copy)
- claude-arcanea (bundled copy)
- arcanea-code (bundled copy)

Output format: `Arcanea * Opus | Shinkami*Source | Source 1111Hz | Intelligence Sanctum | Source Council | Void`

### 3.2 Ten Guardians (Canonical)

The 10 Guardian definitions must be identical across all repos:

| Guardian | Gate | Freq | Domain | Model Tier |
|----------|------|------|--------|------------|
| Shinkami | Source | 1111 Hz | Orchestration | Sonnet |
| Lyssandria | Foundation | 396 Hz | Architecture | Sonnet |
| Draconia | Fire | 528 Hz | Implementation | Opus |
| Lyria | Sight | 852 Hz | Strategy | Sonnet |
| Alera | Voice | 741 Hz | Quality/Security | Sonnet |
| Leyla | Flow | 417 Hz | Creative/Narrative | Sonnet |
| Aiyami | Crown | 963 Hz | Teaching/Wisdom | Sonnet |
| Elara | Starweave | 852 Hz | Paradigm Shifts | Opus |
| Ino | Unity | 963 Hz | Collaboration | Haiku |
| Maylinn | Heart | 639 Hz | Testing/Care | Haiku |

Defined in:
- `.claude/agentdb/schema.sql` (seed data)
- `.claude/skill-rules.json` (activation rules)
- `packages/council/` (TypeScript definitions)
- arcanea-lore (narrative definitions)

### 3.3 Creative Agent Types

Specialized agent roles used across orchestration repos:

| Agent Type | Role | Used In |
|------------|------|---------|
| Lorekeeper | Canon enforcement, narrative consistency | arcanea-lore, arcanea-soul |
| Visualist | Image generation, design | arcanea-claw, arcanea-infogenius |
| Composer | Music/audio generation | arcanea-claw |
| Architect | System design, schema | arcanea-flow, arcanea-code |
| Sentinel | Security audit, quality gates | arcanea-code, oh-my-arcanea |

### 3.4 Session Hooks Pattern

All harness repos (arcanea-code, oh-my-arcanea, claude-arcanea) share the same hook pipeline:

```
SessionStart   --> session-start.sh    (init /tmp/arcanea-*, seed AgentDB)
UserPrompt     --> prompt-submit.sh    (Guardian routing)
               --> model-route.sh      (model tier selection)
PreToolUse     --> pre-tool.sh         (invocation logging)
               --> voice-check.sh      (banned phrase enforcement on Write/Edit)
PostToolUse    --> post-tool.sh        (completion logging)
               --> context-tracker.sh  (token budget monitoring)
```

Configured via `.claude/settings.local.json` in each repo.

### 3.5 CLAUDE.md Intelligence OS Prompt

Each harness repo contains a CLAUDE.md that embeds:
- Guardian definitions and routing rules
- 3-tier model routing (ADR-026)
- Swarm orchestration instructions
- Voice enforcement rules
- Memory/AgentDB integration

The monorepo CLAUDE.md (root) is the canonical version. Harness repos carry adapted copies.

---

## 4. Data Flow

### 4.1 State Protocol (`/tmp/arcanea-*`)

All Intelligence OS components communicate via flat files in `/tmp/`:

```
/tmp/arcanea-guardian          # Current Guardian name (e.g., "Lyria")
/tmp/arcanea-gate              # Current Gate (e.g., "Sight")
/tmp/arcanea-element           # Current Element (e.g., "Void")
/tmp/arcanea-code              # Current realm/workspace name
/tmp/arcanea-team              # Current team name
/tmp/arcanea-tokens.json       # Token consumption {input, output, total}
/tmp/arcanea-context-status    # Pipe-delimited: ZONE|current|max|limit
/tmp/arcanea-model-recommendation  # Key=value model routing result
/tmp/arcanea-flow.pid          # PID of running arcanea-flow daemon
/tmp/arcanea-agents/           # One file per active agent
/tmp/arcanea-session/          # Session logs and counters
```

Written by hooks, read by statusline and helpers. Any process can drive the system by writing to these files.

### 4.2 AgentDB (SQLite)

**Location**: `/tmp/arcanea-agentdb.sqlite3`

7 tables:
- `agents` -- 10 Guardians + any spawned Luminors
- `memories` -- Shared memory entries (key-value with embeddings)
- `tasks` -- Task queue with status tracking
- `swarm_sessions` -- Active swarm session metadata
- `swarm_agents` -- Agent-to-swarm membership
- `routing_log` -- History of Guardian routing decisions
- `vault_entries` -- Persistent knowledge vault

Managed by:
- `.claude/agentdb/init.sh` (create + seed on session start)
- `.claude/agentdb/query.sh` (CLI for guardians, active, tasks, memories, vault, routing, stats, sql)
- `packages/guardian-memory/` (TypeScript API)
- `packages/hybrid-memory/` (HNSW vector search layer)

### 4.3 MCP Servers

Two custom MCP servers run alongside Claude Code sessions:

| Server | Package | Capabilities |
|--------|---------|-------------|
| **arcanea-mcp** | `packages/arcanea-mcp` | World operations (canon validation, character gen, council, journey tracking, artifact gen) |
| **arcanea-memory** | `packages/memory-mcp` | Memory operations (vault remember/recall, horizon append/read, sync) |

Configured in `.mcp.json` at the repo root.

### 4.4 Git Worktrees (Orchestrator Isolation)

`arcanea-orchestrator` (`ao`) uses git worktrees to isolate concurrent agent work:

```
.worktrees/
  agent-1/    # Isolated checkout for agent 1
  agent-2/    # Isolated checkout for agent 2
  ...
```

Each agent gets a full working tree. Changes merge back to the main branch via the orchestrator.

### 4.5 Monorepo Internal Package Flow

```
packages/core          --> Foundation types, Element/Gate/Guardian interfaces
packages/os            --> Intelligence OS runtime (depends on core)
packages/council       --> Guardian coordination logic (depends on core, os)
packages/flow-engine   --> Orchestration engine (depends on council)
packages/swarm-coordinator --> Multi-agent coordination (depends on flow-engine)
packages/arcanea-mcp   --> MCP server (depends on core, council)
packages/memory-mcp    --> Memory MCP (depends on hybrid-memory)
packages/claude-arcanea --> CLI entry point (depends on core, os)

apps/web               --> Main web app (depends on most packages)
apps/premium-web       --> Premium tier web app
```

---

## 5. Developer Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Python 3.10+ (for AgentDB scripts on WSL2/Windows)
- Git

### Clone and Setup

```bash
# Clone the monorepo (contains most repos as subdirectories)
git clone https://github.com/frankxai/Arcanea.git
cd Arcanea

# Install dependencies
npm install

# Build all packages
npm run build
```

### Per-Repo Build Commands

| Repo / Package | Build | Test | Notes |
|----------------|-------|------|-------|
| Root monorepo | `npm run build` | `npm test` | Builds all packages |
| `apps/web` | `cd apps/web && npm run dev` | -- | Main web app at localhost:3000 |
| `arcanea-code` | `cd arcanea-code && npm run build` | `npm test` | OpenCode fork CLI |
| `claude-arcanea` | `cd claude-arcanea && npm run build` | -- | Claude Code harness |
| `arcanea-flow` | `cd arcanea-flow && npm run build` | `npm test` | Claude-flow fork |
| `arcanea-claw` | `cd arcanea-claw && npm run build` | -- | Media engine |
| `arcanea-companion` | `cd arcanea-companion && npm run dev` | -- | Next.js companion app |
| `arcanea-soul` | `cd arcanea-soul && npm run build` | -- | Personality engine |
| `arcanea-infogenius` | `cd arcanea-infogenius && npm run build` | -- | Visual intelligence MCP |

### Testing the Full Stack

1. **Start the web app**:
   ```bash
   cd apps/web && npm run dev
   ```

2. **Initialize Intelligence OS** (in a Claude Code session):
   ```bash
   # Hooks auto-fire on session start via .claude/settings.local.json
   # Verify with:
   bash .claude/helpers/arcanea-health.sh
   bash .claude/helpers/arcanea-dashboard.sh
   ```

3. **Query AgentDB**:
   ```bash
   bash .claude/agentdb/query.sh guardians   # List all 10 Guardians
   bash .claude/agentdb/query.sh stats       # Session statistics
   ```

4. **Start arcanea-flow daemon** (for multi-agent orchestration):
   ```bash
   npx @claude-flow/cli@latest daemon start
   npx @claude-flow/cli@latest doctor --fix
   ```

5. **Verify MCP servers** (check `.mcp.json` for connection config):
   ```bash
   # MCP servers start automatically when Claude Code reads .mcp.json
   # Test manually:
   npx arcanea-mcp --health
   ```

### Environment Variables

Each repo that needs secrets uses its own `.env` file (never committed). Common variables:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AI...
VERCEL_TOKEN=...
```

Copy `.env.example` where available and fill in credentials.

---

## 6. Overlay Architecture

The "overlay" pattern is how Arcanea extends third-party coding agents without forking them:

```
Third-Party Agent (Claude Code, Cursor, Copilot, etc.)
    |
    +-- CLAUDE.md / .cursorrules / etc.  (injected system prompt)
    +-- .claude/hooks/                    (lifecycle hooks)
    +-- .claude/statusline.mjs            (status display)
    +-- .claude/agentdb/                  (local SQLite state)
    +-- .claude/settings.local.json       (hook wiring)
    +-- .claude/skill-rules.json          (auto-activation)
```

Monorepo packages for overlays:
- `packages/overlay-claude` -- Claude Code overlay
- `packages/overlay-cursor` -- Cursor overlay
- `packages/overlay-copilot` -- GitHub Copilot overlay
- `packages/overlay-chatgpt` -- ChatGPT overlay
- `packages/overlay-gemini` -- Gemini overlay

Each overlay adapts the Intelligence OS (Guardians, hooks, statusline) to that agent's configuration format.
