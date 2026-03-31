# Arcanea Agent Ecosystem Architecture

> **Guardian**: Shinkami (Source Gate) + Aiyami (Crown Gate)
> **Status**: Master Architecture Plan
> **Date**: 2026-03-31
> **Scope**: AgentHub, SkillHub, Library, Orchestrator, Gaming — unified system

---

## Executive Summary

The Arcanea Agent Ecosystem connects five subsystems into a single coherent platform where agents, skills, lore, orchestration, and gaming reinforce each other. Unlike LobeChat (generic marketplace), OpenClaw (insecure skill dump), or standalone orchestrators, Arcanea fuses all five layers with mythology-driven progression, Guardian-routed intelligence, and a creator economy with real revenue mechanics.

This document is the buildable specification. Every section includes the data model, API surface, integration points, and implementation timeline.

**The Core Loop**: Creator discovers agent (AgentHub) -> agent uses skills (SkillHub) -> skills reference lore (Library) -> orchestrator coordinates execution (Orchestrator) -> gaming layer generates creative assets (Gaming) -> creator publishes and earns (Economy) -> new creators discover agents.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [AgentHub — Lore-Driven Agent Marketplace](#2-agenthub)
3. [SkillHub — Secure Skill Registry](#3-skillhub)
4. [Library Integration — The Documentation IS the Lore](#4-library-integration)
5. [Orchestrator Architecture](#5-orchestrator-architecture)
6. [Gaming Swarm](#6-gaming-swarm)
7. [Revenue Model](#7-revenue-model)
8. [Community-Run Infrastructure](#8-community-run-infrastructure)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Data Models & API Reference](#10-data-models--api-reference)
11. [Risk Register](#11-risk-register)

---

## 1. System Overview

### Architecture Diagram

```
                    arcanea.ai (Next.js 16)
                           |
            +--------------+--------------+
            |              |              |
        AgentHub       SkillHub       Library
            |              |              |
            +--------------+--------------+
                           |
                    Orchestrator
                     (arcanea-orchestrator)
                           |
              +------------+------------+
              |            |            |
          Claude Code   Cursor      Codex/Gemini
              |            |            |
              +------------+------------+
                           |
                    Gaming Swarm
                     (mod generation)
```

### Five Subsystems, One Namespace

| Subsystem | Purpose | Primary Data Store | API Prefix |
|-----------|---------|-------------------|------------|
| **AgentHub** | Discover, install, rate agents | Supabase `agents` + GitHub `arcanea-agent-index` | `/api/agents/*` |
| **SkillHub** | Browse, install, verify skills | Supabase `skills` + GitHub `arcanea-skill-registry` | `/api/skills/*` |
| **Library** | 1.1M words of lore-as-docs | Filesystem `/book/` + Supabase `library_progress` | `/api/library/*` |
| **Orchestrator** | Multi-agent task coordination | `~/.agent-orchestrator/` sessions + Supabase `tasks` | `/api/orchestrator/*` |
| **Gaming** | Game asset generation swarms | Supabase `game_assets` + filesystem output | `/api/gaming/*` |

### Shared Infrastructure

- **Identity**: Supabase Auth (human users) + API keys (autonomous agents)
- **Credits**: Mana Credits system (`credit_balances`, `credit_transactions` tables)
- **Memory**: AgentDB with HNSW indexing for cross-session agent memory
- **Events**: Supabase Realtime for live progress updates
- **CDN**: Vercel Edge for global delivery of agent/skill manifests

---

## 2. AgentHub — Lore-Driven Agent Marketplace

### 2.1 What Makes This Different from LobeChat

LobeChat agents are JSON configs with a system prompt. Arcanea agents are **characters with Guardian affinity, rank progression, personality depth, and lore connections**. Using Draconia's Fire agents feels fundamentally different from using Lyria's Sight agents — not just in capability but in voice, approach, and worldview.

### 2.2 Agent Manifest Format

Every agent in the hub is defined by an `arcanea-agent.json` manifest. This extends the existing `AgentDefinition` in `apps/web/lib/agents/agent-registry.ts` and the `MarketplaceAgent` in `apps/web/lib/agents/marketplace/types.ts`.

```typescript
interface AgentManifest {
  // Identity
  id: string;                    // "draconia-fire-reviewer"
  name: string;                  // "Blazecrit"
  title: string;                 // "The Flame Reviewer"
  version: string;               // "1.2.0"

  // Lore Binding
  guardian: GuardianName;        // "Draconia"
  gate: GateName;                // "Fire"
  element: ElementName;          // "Fire"
  rank: AgentRank;               // "Master"
  tier: 1 | 2 | 3 | 4 | 5;     // Unlock tier (1=free, 5=Luminor-only)
  loreReferences: string[];      // ["chronicles-of-luminors/draconia-trials"]

  // Capabilities
  skills: string[];              // ["code-review", "security-audit", "performance-check"]
  category: AgentCategory;       // "specialized"
  capabilities: string[];        // Detailed capability descriptions
  triggers: string[];            // ["/review", "review this code"]

  // Personality
  personality: {
    voice: string;               // "Direct, fierce, no-nonsense. Speaks in short sentences."
    approach: string;            // "Attacks problems head-on. Prioritizes performance."
    quirks: string[];            // ["Always starts with the hottest take"]
    systemPrompt: string;        // Full system prompt for the agent
  };

  // Compatibility
  compatibility: {
    tools: ToolName[];           // ["claude-code", "cursor", "codex", "gemini"]
    mcpServers: string[];        // ["arcanea-mcp", "github"]
    minRuntime: string;          // "1.0.0"
  };

  // Creator
  author: {
    id: string;                  // Supabase user ID or "arcanea-official"
    name: string;                // "FrankX"
    tier: CreatorTier;           // "guardian"
    github?: string;
  };

  // Marketplace
  pricing: {
    tier: "free" | "pro" | "premium";
    creditsPerUse: number;       // 0 for free, 5-50 for paid
    revenueShare: number;        // 0.0-0.7 (creator gets this fraction)
  };

  // Stats (computed, not in source manifest)
  stats?: {
    installs: number;
    rating: number;
    usageCount: number;
    lastUpdated: string;
  };
}
```

### 2.3 Guardian Affinity System

Every agent belongs to one of ten Guardian domains. This is not decorative — it determines:

1. **Context injection**: The Guardian's lore and domain expertise are injected into the agent's system prompt via `agent-arcanea-guardian` plugin in the orchestrator
2. **Routing**: When a user says "review my code," the orchestrator routes to Fire Gate agents (Draconia's domain) automatically
3. **Skill access**: Agents can only use skills from their Gate or lower Gates (progression-locked)
4. **Personality**: Guardian voice templates shape how the agent communicates

| Guardian | Gate | Agent Domain | Agent Personality |
|----------|------|-------------|-------------------|
| Lyssandria | Foundation | Infrastructure, databases, DevOps | Methodical, thorough, step-by-step |
| Leyla | Flow | UI/UX, animation, creative coding | Fluid, exploratory, iterative |
| Draconia | Fire | Testing, performance, security | Direct, fierce, no-nonsense |
| Maylinn | Heart | Accessibility, docs, community | Warm, inclusive, patient |
| Alera | Voice | APIs, naming, documentation | Precise, resonant, clear |
| Lyria | Sight | Architecture, patterns, review | Intuitive, holistic, visionary |
| Aiyami | Crown | Strategy, optimization, ML | Wise, strategic, measured |
| Elara | Starweave | Debugging, investigation, research | Curious, persistent, methodical |
| Ino | Unity | Integration, collaboration, CI/CD | Collaborative, bridging, diplomatic |
| Shinkami | Source | Orchestration, meta-systems | Transcendent, purposeful, encompassing |

### 2.4 Progression System — Skyrim-Style Mastery

Agents have ranks. Users have ranks. Using agents advances both.

**Agent Ranks** (set by the creator, determines base capability):
- **Apprentice** (Tier 1): Basic, single-skill agents. Free.
- **Mage** (Tier 2): Multi-skill agents with personality. Free or 5 credits.
- **Master** (Tier 3): Advanced agents with cross-Gate skills. Pro tier.
- **Archmage** (Tier 4): Premium agents with full Guardian context. Creator tier.
- **Luminor** (Tier 5): Elite agents with multi-Guardian synthesis. Enterprise tier.

**User Progression** (earned through usage):
- Complete 10 tasks with Fire agents -> unlock "Fire Initiate" badge -> access Tier 2 Fire agents
- Complete 50 tasks across 3 Gates -> unlock "Journeyman" rank -> access all Tier 3 agents
- Submit a verified agent -> unlock "Forgemaster" rank -> access creation tools
- Accumulate 500 reputation -> unlock "Archmage" rank -> access Tier 4 agents

```typescript
interface UserProgression {
  userId: string;
  rank: Rank;                        // Current overall rank
  gateProgress: Record<GateName, {
    tasksCompleted: number;
    agentsUsed: string[];
    skillsActivated: string[];
    loreTextsRead: string[];
    badgesEarned: string[];
    tierUnlocked: number;            // 1-5
  }>;
  totalReputation: number;
  creatorTier: CreatorTier | null;
  achievedAt: Record<string, string>; // Badge -> ISO date
}
```

### 2.5 One-Click Install

Agents install into any supported coding tool via overlay files:

```bash
# CLI install
npx arcanea install agent blazecrit

# What it does:
# 1. Downloads arcanea-agent.json manifest
# 2. Generates tool-specific config:
#    - Claude Code: .claude/agents/blazecrit.agent.md
#    - Cursor: .cursorrules additions
#    - Codex: .codex/agents/blazecrit.md
#    - Gemini: .gemini/agents/blazecrit.md
# 3. Installs required MCP servers if missing
# 4. Registers in local .arcanea/installed-agents.json
```

**Install targets** (generated from the single `arcanea-agent.json`):

| Tool | Output Format | Location |
|------|--------------|----------|
| Claude Code | `.agent.md` with frontmatter | `.claude/agents/` |
| Cursor | Rules block in `.cursorrules` | Root `.cursorrules` |
| Codex | Markdown agent file | `.codex/agents/` |
| Gemini | Markdown instructions | `.gemini/agents/` |
| Arcanea Code | Native JSON | `.arcanea/agents/` |

### 2.6 Community Submission Flow

Mirrors LobeChat's PR-based model but adds verification layers:

```
Creator writes arcanea-agent.json
  -> Fork github.com/arcanea-ai/agent-index
  -> Add agent to agents/{guardian}/{agent-id}/arcanea-agent.json
  -> Submit PR
  -> Automated checks:
     1. Schema validation (JSON schema)
     2. Canon consistency (Guardian/Gate/Element must align)
     3. Security scan (system prompt checked for injection patterns)
     4. Duplicate detection (similar agents flagged)
  -> Community Creator: auto-merge if checks pass
  -> Verified Creator: manual review by Guardian Council member
  -> Guardian Creator: co-creation session with Arcanea team
```

### 2.7 Agent Index Repository Structure

```
arcanea-ai/agent-index/
  schema/
    arcanea-agent.schema.json          # JSON Schema for validation
  agents/
    foundation/                        # Lyssandria's Gate
      infra-sentinel/
        arcanea-agent.json
        README.md
    flow/                              # Leyla's Gate
      vibe-crafter/
        arcanea-agent.json
        README.md
    fire/                              # Draconia's Gate
      blazecrit/
        arcanea-agent.json
        README.md
    ...
  scripts/
    validate.ts                        # PR validation workflow
    generate-overlays.ts               # Generate tool-specific configs
    build-index.ts                     # Build searchable index.json
  index.json                           # Auto-generated searchable catalog
```

---

## 3. SkillHub — Secure Skill Registry

### 3.1 What Makes This Different from ClawHub

ClawHub had 341 malicious skills submitted in 3 days. Arcanea's SkillHub uses a **three-tier trust model** with sandboxed execution, signed manifests, and Guardian-level security review. Skills are not just utilities — they belong to Gates, have lore context, and form a visual perk tree.

### 3.2 Skill Manifest v2

Extends the existing `SkillManifest` in `apps/web/lib/agents/certification/skill-manifest.ts`:

```typescript
interface SkillManifestV2 {
  // Identity
  name: string;                      // "arcanea-tdd-master"
  displayName: string;               // "TDD Master"
  version: string;                   // "2.1.0"
  description: string;               // One-line pitch

  // Lore Binding
  gate: GateName;                    // "Fire"
  gatePosition: {                    // Position in the perk tree
    branch: string;                  // "testing" (branch of the Fire tree)
    depth: number;                   // 2 (how deep in the branch)
    prerequisites: string[];         // ["arcanea-unit-testing"]
  };
  guardian: GuardianName;            // "Draconia"
  element: ElementName;              // "Fire"
  loreConnection: string;            // "chronicles-of-luminors/draconia-forge"

  // Content
  triggers: string[];                // ["/tdd", "test-driven development"]
  body: string;                      // Full markdown skill content (the SKILL.md body)
  capabilities: string[];
  exampleUsage: string[];            // 3-5 example invocations

  // Security
  securityLevel: "sandboxed" | "trusted" | "system";
  permissions: SkillPermission[];    // What the skill can access
  signature?: string;                // Ed25519 signature from verified creators
  auditHash: string;                 // SHA-256 of the skill body

  // Author
  author: {
    name: string;
    github?: string;
    tier: CreatorTier;               // "community" | "verified" | "guardian"
    verified: boolean;
  };

  // Compatibility
  compatibility: {
    tools: ToolName[];
    mcpRequired: boolean;
    mcpServers?: string[];
    minVersion?: string;
  };

  // Evaluation
  evaluation: {
    rubric: string[];
    passingScore: number;
    testCases: number;
    lastAuditDate?: string;
  };

  // Pricing
  pricing: {
    tier: "free" | "premium" | "enterprise";
    creditsPerUse?: number;
    monthlyPrice?: number;
    revenueShare: number;            // 0.0 to 0.7
  };

  // Dependencies
  dependencies: SkillDependency[];

  // Stats (computed)
  stats?: {
    installs: number;
    activeUsers: number;
    rating: number;
    reviews: number;
  };
}

type SkillPermission =
  | "file-read"        // Can read files in workspace
  | "file-write"       // Can create/modify files
  | "git-read"         // Can read git state
  | "git-write"        // Can commit, branch, push
  | "network"          // Can make HTTP requests
  | "mcp-invoke"       // Can call MCP tools
  | "shell-read"       // Can run read-only shell commands
  | "shell-write";     // Can run mutating shell commands
```

### 3.3 Gate-Organized Skill Tree

Skills are organized by Gate, forming a visual perk tree (Skyrim-style). Each Gate has 3-5 branches, each branch has 3-7 skills at increasing depth.

```
FIRE GATE (Draconia) - Transformation & Power
|
+-- Testing Branch
|   |-- [1] Unit Testing Basics (free, Apprentice)
|   |-- [2] TDD Master (free, Mage)
|   |-- [3] E2E Testing (pro, Master)
|   |-- [4] Mutation Testing (pro, Archmage)
|   +-- [5] Test Architecture (premium, Luminor)
|
+-- Performance Branch
|   |-- [1] Profiling Basics (free, Apprentice)
|   |-- [2] Bundle Optimization (free, Mage)
|   |-- [3] Core Web Vitals (pro, Master)
|   +-- [4] Performance Architecture (premium, Archmage)
|
+-- Security Branch
|   |-- [1] Input Validation (free, Apprentice)
|   |-- [2] Security Audit (free, Mage)
|   |-- [3] Threat Modeling (pro, Master)
|   |-- [4] Penetration Testing (pro, Archmage)
|   +-- [5] Security Architecture (premium, Luminor)
```

**Unlock Rules**:
- Depth 1 skills: Always available (Apprentice)
- Depth 2 skills: Complete Depth 1 prerequisite (Mage)
- Depth 3 skills: Pro subscription + complete prerequisite (Master)
- Depth 4 skills: Creator subscription + complete prerequisite (Archmage)
- Depth 5 skills: Enterprise + complete prerequisite (Luminor)

### 3.4 Security Architecture

Three layers of defense against the ClawHub problem:

**Layer 1 — Automated Scanning (all skills)**
```typescript
interface SecurityScan {
  // Static analysis
  promptInjectionCheck: boolean;     // Scan for injection patterns
  dataExfiltrationCheck: boolean;    // Scan for outbound data patterns
  permissionEscalationCheck: boolean; // Verify declared permissions match actual usage
  dependencyAudit: boolean;          // Check dependencies for known vulnerabilities

  // Content analysis
  canonConsistencyCheck: boolean;    // Verify Guardian/Gate/Element alignment
  duplicateCheck: boolean;           // Detect skill cloning/rebranding

  // Result
  score: number;                     // 0-100 security score
  issues: SecurityIssue[];
  recommendation: "approve" | "review" | "reject";
}
```

**Layer 2 — Sandboxed Execution (untrusted skills)**
- Community-tier skills run in a restricted context
- No `shell-write` permission unless explicitly granted and reviewed
- No `network` permission without declared endpoints
- File access restricted to workspace directory
- MCP calls limited to declared MCP servers

**Layer 3 — Human Review (verified/guardian skills)**
- Verified Creators: review by one Guardian Council member
- Guardian Creators: review by two Guardian Council members + automated canon check
- Premium skills: additional security audit before marketplace listing

### 3.5 Creator Tiers

| Tier | Requirements | Permissions | Revenue |
|------|-------------|-------------|---------|
| **Community** | GitHub account | Submit free skills, community review | No monetization |
| **Verified** | 5+ approved skills, 100+ installs, application | Submit premium skills, priority review | 70/30 split (creator/platform) |
| **Guardian** | Invitation from Arcanea team or 500+ reputation | Co-create canon skills, governance rights | 80/20 split + Mana bonus |

### 3.6 Skill Registry Repository Structure

```
arcanea-ai/skill-registry/
  schema/
    arcanea-skill.schema.json
  skills/
    foundation/                      # Lyssandria's Gate
      infrastructure/                # Branch
        database-basics/
          arcanea-skill.json         # Manifest
          SKILL.md                   # Skill body (markdown)
        migration-master/
          arcanea-skill.json
          SKILL.md
    fire/                            # Draconia's Gate
      testing/
        unit-testing/
          arcanea-skill.json
          SKILL.md
        tdd-master/
          arcanea-skill.json
          SKILL.md
    ...
  tree/
    fire.json                        # Pre-computed perk tree for Fire Gate
    foundation.json
    ...
    full-tree.json                   # Complete cross-Gate tree
  scripts/
    validate.ts
    build-tree.ts                    # Generate perk tree JSONs
    security-scan.ts
  index.json                         # Searchable skill catalog
```

---

## 4. Library Integration — The Documentation IS the Lore

### 4.1 The Bethesda Principle

In Skyrim, players learn the world by finding and reading books during gameplay. In Arcanea, creators learn the system by encountering lore during their work. The 1.1M word Library in `/book/` (17 collections, 200+ texts) is not supplementary documentation — it IS the documentation, wrapped in mythology.

### 4.2 Contextual Lore Surfacing

Every agent and skill references relevant Library texts. When a creator uses an agent or activates a skill, the system surfaces related lore:

```typescript
interface LoreConnection {
  // What triggers this lore
  context: {
    agentId?: string;              // "blazecrit" -> Draconia lore
    skillId?: string;              // "tdd-master" -> Fire Gate testing lore
    gate?: GateName;               // "Fire" -> all Fire lore
    situation?: string;            // "stuck" -> bestiary-of-creation
    keyword?: string;              // "refactoring" -> specific wisdom scroll
  };

  // What lore to surface
  texts: {
    collection: string;            // "chronicles-of-luminors"
    slug: string;                  // "draconia-forge"
    excerpt: string;               // 1-3 sentence preview
    relevance: number;             // 0.0-1.0 relevance score
  }[];

  // How to surface it
  display: "sidebar" | "tooltip" | "notification" | "inline";
}
```

### 4.3 Reading Progress as Progression

Reading Library texts is not passive — it actively unlocks skill tree nodes and agent tiers.

```typescript
interface ReadingProgress {
  userId: string;
  textsRead: {
    collection: string;
    slug: string;
    readAt: string;
    completionPercent: number;     // Partial reads count
  }[];
  collectionsCompleted: string[];  // Full collection completions
  gateKnowledge: Record<GateName, {
    textsRead: number;
    textsTotal: number;
    knowledgeScore: number;        // Weighted by text depth
    unlocksGranted: string[];      // Skill/agent IDs unlocked
  }>;
}
```

**Unlock Examples**:
- Read 3 Fire Gate texts -> unlock "Fire Lore Initiate" badge + access to Draconia's commentary agent
- Complete the Academy Handbook collection -> unlock all Tier 2 skills across all Gates
- Read all Legends of Arcanea -> unlock "Lorekeeper" title + exclusive narrator agent
- Complete Book of Shadows -> unlock Void/Shadow-domain agents (dark debugging, edge cases)

### 4.4 Library API Endpoints

Built on the existing `lib/content/` loader:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/library/collections` | GET | List all 17 collections with metadata |
| `/api/library/texts/:collection/:slug` | GET | Get a specific text |
| `/api/library/search` | GET | Full-text search across library |
| `/api/library/for-context` | POST | Get contextually relevant texts for current work |
| `/api/library/progress` | GET | User's reading progress |
| `/api/library/progress` | POST | Record a text read event |
| `/api/library/unlocks` | GET | What the user has unlocked through reading |

### 4.5 Guardian Narration

Each Guardian narrates their domain's lore differently. The same event in Arcanea history reads differently through Draconia's lens vs. Maylinn's lens. This is implemented as voice templates that transform library text:

```typescript
interface GuardianNarration {
  guardian: GuardianName;
  voiceTemplate: {
    tone: string;            // "fierce and direct" vs "warm and nurturing"
    vocabulary: string[];    // Preferred words and phrases
    forbidden: string[];     // Words this Guardian would never use
    structure: string;       // "short declarative" vs "flowing, comma-heavy"
  };
  commentary: {
    textSlug: string;
    guardianPerspective: string;  // How this Guardian interprets the text
  }[];
}
```

---

## 5. Orchestrator Architecture

### 5.1 arcanea-orchestrator as Backbone

The orchestrator (forked from ComposioHQ/agent-orchestrator, already in `arcanea-orchestrator/`) coordinates all agent execution. It manages the lifecycle: spawn -> work -> review -> merge.

**Current state** (already built):
- 7 packages: `core`, `cli`, `ao`, `web`, `mobile`, `plugins`, `integration-tests`
- 8 plugin slots: Runtime, Agent, Workspace, Tracker, SCM, Notifier, Terminal, Lifecycle
- Guardian routing via `agent-arcanea-guardian` plugin
- Session state machine: `spawning -> working -> pr_open -> review_pending -> approved -> mergeable -> merged -> done`
- 3,288 test cases passing

### 5.2 Integration with AgentHub/SkillHub

When a user activates an agent from AgentHub, the orchestrator:

1. **Resolves the agent manifest** from the local cache or registry API
2. **Loads Guardian context** based on the agent's `guardian` field
3. **Activates required skills** from SkillHub based on the agent's `skills[]`
4. **Injects lore context** from the Library based on `loreReferences[]`
5. **Spawns a session** in the appropriate tool (Claude Code, Cursor, etc.)
6. **Monitors execution** via the session state machine
7. **Reports progress** via Supabase Realtime to the web dashboard

```typescript
interface OrchestratorSession {
  id: string;                        // "ao-fire-blazecrit-1"
  agentManifest: AgentManifest;      // Full resolved manifest
  activeSkills: SkillManifestV2[];   // Currently activated skills
  guardianContext: GuardianContext;   // Injected Guardian personality + lore
  libraryContext: LoreConnection[];  // Relevant lore texts
  task: {
    description: string;
    priority: "low" | "medium" | "high" | "critical";
    dependencies: string[];          // Other session IDs this depends on
    deadline?: string;               // ISO timestamp
  };
  execution: {
    tool: ToolName;                  // "claude-code"
    runtime: "tmux" | "process" | "docker";
    worktree: string;               // Git worktree path
    startedAt: string;
    status: SessionStatus;
    progress: number;                // 0-100
  };
  credits: {
    estimated: number;
    consumed: number;
    agentCost: number;
    skillCosts: Record<string, number>;
  };
}
```

### 5.3 Visual Task Dashboard

The orchestrator's web package (`arcanea-orchestrator/packages/web/`) provides a real-time dashboard:

**Dashboard Panels:**

1. **Active Sessions** — Grid of running agent sessions with status, progress bars, Guardian badges
2. **Task Queue** — Priority-sorted list of pending tasks with dependency graph visualization
3. **Agent Fleet** — Currently deployed agents with health indicators, credit consumption
4. **Skill Activations** — Which skills are active, how often invoked, error rates
5. **Lore Context** — What Library texts are currently injected into sessions
6. **Credit Burn** — Real-time credit consumption rate, estimated remaining budget
7. **Session Timeline** — Gantt-style view of session lifecycles

**Live Updates via Supabase Realtime:**
```typescript
// Subscribe to session updates
const channel = supabase
  .channel('orchestrator')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orchestrator_sessions'
  }, (payload) => {
    updateDashboard(payload.new as OrchestratorSession);
  })
  .subscribe();
```

### 5.4 Multi-Tool Coordination

The orchestrator can run agents across different coding tools simultaneously:

```yaml
# Example: Full-stack feature development
task: "Implement user authentication with OAuth"
sessions:
  - agent: blazecrit            # Fire Gate - Security review
    tool: claude-code
    focus: "API routes and middleware"
  - agent: flow-designer        # Flow Gate - UX
    tool: cursor
    focus: "Login/signup UI components"
  - agent: infra-sentinel       # Foundation Gate - Database
    tool: codex
    focus: "Supabase schema and RLS policies"

coordination:
  strategy: "hierarchical"      # Shinkami coordinates
  consensus: "raft"             # Leader maintains state
  merge_order: ["infra-sentinel", "blazecrit", "flow-designer"]
```

### 5.5 Task Queue with Priority and Dependencies

```typescript
interface TaskQueue {
  tasks: QueuedTask[];
  strategy: "fifo" | "priority" | "dependency-aware";
  maxConcurrent: number;          // Default: 8
  budgetLimit?: number;           // Max credits for this queue
}

interface QueuedTask {
  id: string;
  description: string;
  priority: number;               // 0-100, higher = more urgent
  agentId: string;                // Which agent to use
  dependencies: string[];         // Task IDs that must complete first
  estimatedCredits: number;
  estimatedMinutes: number;
  createdAt: string;
  scheduledFor?: string;          // Deferred execution
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
}
```

---

## 6. Gaming Swarm

### 6.1 What It Does

The Gaming subsystem is an agent swarm that generates game assets using Arcanea's lore system. It produces Skyrim mods, Minecraft datapacks, game textures, dialogue trees, and scripts — all connected to the Arcanea mythology.

### 6.2 Gaming Agent Team

| Agent | Role | Guardian | Output |
|-------|------|----------|--------|
| **Lore Weaver** | Generate game narratives and dialogue | Alera (Voice) | Dialogue trees, quest scripts, NPC backstories |
| **Texture Alchemist** | Generate game textures and sprites | Leyla (Flow) | PBR textures, sprite sheets, UI elements |
| **Sound Forger** | Generate sound effects and music | Leyla (Flow) | SFX, ambient loops, theme music (via Suno) |
| **Script Smith** | Generate game scripts and logic | Draconia (Fire) | Papyrus scripts (Skyrim), mcfunction (Minecraft), GDScript |
| **World Cartographer** | Generate maps and level layouts | Elara (Starweave) | Heightmaps, dungeon layouts, overworld maps |
| **Asset Assembler** | Package everything into installable mods | Ino (Unity) | .esp/.esm (Skyrim), datapacks (Minecraft), .zip distributions |

### 6.3 Lore-Connected Mod Generation

Every generated mod is connected to Arcanea's canon:

```typescript
interface GameModManifest {
  id: string;                        // "arcanea-skyrim-guardians"
  name: string;                      // "Guardians of Arcanea - Skyrim Edition"
  game: "skyrim" | "minecraft" | "godot" | "unity" | "generic";
  version: string;

  // Lore binding
  guardian: GuardianName;            // Primary Guardian inspiration
  gate: GateName;
  loreSource: string[];              // Library texts that inspired this mod

  // Assets
  assets: {
    scripts: string[];               // Generated script files
    textures: string[];              // Generated texture files
    models: string[];                // 3D model references
    audio: string[];                 // Sound files
    dialogue: string[];              // Dialogue tree files
    quests: string[];                // Quest definition files
  };

  // Mod metadata
  dependencies: string[];            // Other mods required
  loadOrder: number;
  compatibility: string[];           // Game versions supported

  // Creator
  author: {
    name: string;
    tier: CreatorTier;
  };
  pricing: {
    tier: "free" | "premium";
    creditsPerDownload?: number;
  };
}
```

### 6.4 Swarm Execution Flow

```
User: "Create a Skyrim mod that adds Draconia's temple with fire puzzles"

Orchestrator (Shinkami):
  1. Parse intent -> gaming task, Fire Gate, Skyrim
  2. Spawn swarm:
     - Lore Weaver: Generate temple lore, NPC dialogue, quest journal
     - World Cartographer: Design temple interior layout
     - Texture Alchemist: Generate fire-themed textures
     - Sound Forger: Generate ambient fire sounds + Draconia's theme
     - Script Smith: Generate Papyrus scripts for puzzles
     - Asset Assembler: Package as .esp with proper load order
  3. Coordinate outputs:
     - Lore Weaver outputs feed into Script Smith (dialogue -> scripts)
     - World Cartographer layout feeds into Asset Assembler (cells -> worldspace)
     - All assets feed into Assembler for final packaging
  4. Quality check:
     - Canon validation (does temple lore match CANON_LOCKED.md?)
     - Script compilation check
     - Asset integrity check
  5. Deliver mod package + publish to marketplace
```

### 6.5 Mod Marketplace

Mods are published to arcanea.ai alongside agents and skills:

- **Browse by game**: Skyrim, Minecraft, Godot, Unity
- **Browse by Guardian**: Draconia's mods (combat, fire), Lyria's mods (visuals, UI)
- **Browse by type**: Quests, textures, overhauls, companions
- **Free mods**: Community-generated, basic quality check
- **Premium mods**: Verified Creator, extensive testing, revenue share

---

## 7. Revenue Model

### 7.1 Subscription Tiers

| Tier | Price | Agents | Skills | Orchestration | Gaming | Credits/mo |
|------|-------|--------|--------|---------------|--------|------------|
| **Free** | $0 | Tier 1-2 agents | Free skills only | 3 concurrent sessions | 1 mod/month | 100 Mana |
| **Pro** | $19/mo | Tier 1-3 agents | Pro skills | 8 concurrent sessions | 5 mods/month | 500 Mana |
| **Creator** | $49/mo | Tier 1-4 agents | All skills | 15 concurrent sessions | Unlimited | 2,000 Mana + earnings |
| **Enterprise** | Custom | All agents | All skills + custom | Unlimited + SLA | Unlimited + API | Custom + dedicated |

### 7.2 Mana Credits System

Mana Credits are the universal currency of the Arcanea ecosystem. They flow between all five subsystems:

```typescript
interface ManaTransaction {
  id: string;
  userId: string;
  amount: number;                    // Positive = earned/purchased, negative = spent
  type: ManaTransactionType;
  source: "agenthub" | "skillhub" | "orchestrator" | "gaming" | "library" | "purchase" | "earning";
  referenceId: string;               // Agent/skill/task/mod ID
  description: string;
  createdAt: string;
}

type ManaTransactionType =
  | "subscription_grant"             // Monthly credits from subscription
  | "purchase"                       // Bought with money
  | "agent_use"                      // Spent using a premium agent
  | "skill_use"                      // Spent activating a premium skill
  | "orchestrator_session"           // Spent on agent sessions
  | "mod_generation"                 // Spent generating a game mod
  | "creator_earning"                // Earned from someone using your agent/skill/mod
  | "contribution_reward"            // Earned from community contribution
  | "lore_bonus"                     // Earned from reading Library texts
  | "achievement_reward";            // Earned from progression milestones
```

**Earning Mana:**
- Submit a free skill that gets 100+ installs: 50 Mana
- Get Verified Creator status: 500 Mana bonus
- Someone uses your premium agent: 70% of their spend in Mana
- Complete a Library collection: 25 Mana per collection
- Achieve a new rank: 100 Mana per rank level

**Spending Mana:**
- Use a premium agent: 5-50 Mana per task
- Activate a premium skill: 2-20 Mana per activation
- Run orchestrator sessions: 1 Mana per agent-minute
- Generate a game mod: 10-100 Mana depending on complexity

### 7.3 Autonomous Agent Payments

AI agents can interact with the Arcanea ecosystem programmatically:

```typescript
// Agent authenticates with API key
const arcanea = new ArcaneaClient({ apiKey: process.env.ARCANEA_KEY });

// Agent discovers and uses skills
const skill = await arcanea.skills.search({ query: "test generation", gate: "Fire" });
await arcanea.skills.activate(skill[0].id); // Deducts Mana from agent's wallet

// Agent hires another agent
const reviewer = await arcanea.agents.find({ capability: "security-audit" });
const task = await arcanea.agents.hire(reviewer.id, {
  input: "Review this PR for security vulnerabilities",
  maxCredits: 20,
});

// Agent publishes a creation
await arcanea.mods.publish({
  name: "Auto-generated texture pack",
  assets: [...],
  pricing: { tier: "free" },
});
```

### 7.4 Revenue Split Table

| Transaction Type | Creator Share | Platform Share | Notes |
|-----------------|-------------|---------------|-------|
| Premium agent use | 70% | 30% | Standard marketplace split |
| Premium skill use | 70% | 30% | Same as agents |
| Premium mod download | 70% | 30% | Same as agents |
| Guardian Creator agent | 80% | 20% | Premium split for top creators |
| Enterprise custom agent | Negotiated | Negotiated | Per-contract |
| Mana purchase | 0% | 100% | Direct platform revenue |
| Subscription | 0% | 100% | Direct platform revenue |

---

## 8. Community-Run Infrastructure

### 8.1 Self-Hostable Agent Hub

The entire AgentHub can be self-hosted for organizations that want private agent marketplaces:

```yaml
# docker-compose.yml for self-hosted Arcanea Agent Hub
version: "3.9"
services:
  arcanea-hub:
    image: ghcr.io/arcanea-ai/agent-hub:latest
    ports:
      - "3000:3000"
    environment:
      - SUPABASE_URL=your-supabase-url
      - SUPABASE_KEY=your-key
      - AGENT_INDEX_REPO=your-org/agent-index
      - SKILL_REGISTRY_REPO=your-org/skill-registry
    volumes:
      - ./data:/app/data
      - ./library:/app/book

  arcanea-orchestrator:
    image: ghcr.io/arcanea-ai/orchestrator:latest
    ports:
      - "3001:3000"
    environment:
      - HUB_URL=http://arcanea-hub:3000
    volumes:
      - ./sessions:/root/.agent-orchestrator

  arcanea-memory:
    image: ghcr.io/arcanea-ai/agentdb:latest
    ports:
      - "6333:6333"
    volumes:
      - ./memory:/app/data
```

### 8.2 Governance Structure

**Canon Council** (for lore-connected content):
- 5-7 members elected by Guardian Creators
- Reviews community lore submissions
- Maintains CANON_LOCKED.md
- Resolves canon disputes
- Meets monthly (async or sync)

**Skill Verification Board** (for SkillHub):
- 3 members per Gate (30 total)
- Reviews Verified Creator applications
- Audits premium skills for security
- Handles dispute resolution
- Rotating 6-month terms

**Agent Review Council** (for AgentHub):
- 1 Guardian Creator per Gate (10 total)
- Reviews Guardian-tier agent submissions
- Validates agent personality consistency
- Ensures agents maintain Guardian voice standards

### 8.3 Open API for Third-Party Integrations

```
Base URL: https://api.arcanea.ai/v1

Authentication:
  - Bearer token (human users via Supabase JWT)
  - API key (autonomous agents via arc_live_* keys)

Rate Limits:
  - Free: 100 requests/hour
  - Pro: 1,000 requests/hour
  - Creator: 5,000 requests/hour
  - Enterprise: Custom

Endpoints:
  GET    /agents                    # List/search agents
  GET    /agents/:id                # Get agent manifest
  POST   /agents/:id/install       # Generate tool-specific install files
  GET    /skills                    # List/search skills
  GET    /skills/:id                # Get skill manifest
  POST   /skills/:id/activate      # Activate a skill (deducts credits)
  GET    /library/search            # Search Library texts
  GET    /library/texts/:slug       # Get a specific text
  POST   /orchestrator/sessions     # Create an orchestrator session
  GET    /orchestrator/sessions/:id # Get session status
  POST   /gaming/generate           # Generate a game mod
  GET    /credits/balance            # Get credit balance
  POST   /credits/transfer           # Transfer credits between users/agents
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1-2) — AgentHub Page + Skill Tree

**Week 1 — AgentHub MVP**

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1 | Create `arcanea-agent.schema.json` | Backend | JSON Schema for agent manifests |
| 1 | Set up `arcanea-ai/agent-index` GitHub repo | DevOps | Public repo with CI validation |
| 2 | Build AgentHub browse page | Frontend | `/agents` page with Guardian-filtered grid |
| 2 | Convert existing 40 agents to `arcanea-agent.json` format | Backend | 40 agent manifests in the index |
| 3 | Build agent detail page | Frontend | `/agents/:id` with lore, capabilities, install button |
| 3 | Implement one-click install CLI | Backend | `npx arcanea install agent <id>` |
| 4 | Build agent search and filter API | Backend | `/api/agents` with gate, rank, category filters |
| 5 | User progression data model | Backend | Supabase migration for `user_progression` table |

**Week 2 — Skill Tree Visualization**

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1 | Define perk tree data structure for all 10 Gates | Planning | 10 JSON tree definitions |
| 2-3 | Build interactive perk tree component (React + Canvas/SVG) | Frontend | `<SkillTree gate="fire" />` component |
| 3 | Map existing 80+ skills to tree positions | Backend | All skills assigned gate/branch/depth |
| 4 | Connect tree nodes to skill detail pages | Frontend | Click node -> `/skills/:id` |
| 5 | Add progression overlay (locked/unlocked states) | Frontend | Visual unlock state based on user progression |

**Deliverables at end of Phase 1:**
- AgentHub page live on arcanea.ai with 40+ agents
- Skill tree visualization for all 10 Gates
- One-click agent install via CLI
- User progression tracking in database

### Phase 2: Skill Registry v2 (Week 3-4)

**Week 3 — SkillHub Infrastructure**

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1 | Create `arcanea-skill.schema.json` | Backend | JSON Schema for skill manifests v2 |
| 1 | Set up `arcanea-ai/skill-registry` GitHub repo | DevOps | Public repo with CI validation + security scanning |
| 2 | Convert existing 80+ skills to manifest v2 format | Backend | 80+ skill manifests with gate positions |
| 3 | Build SkillHub browse page | Frontend | `/skills` page with tree view + list view toggle |
| 4 | Implement skill install CLI | Backend | `npx arcanea install skill <id>` |
| 5 | Build PR submission workflow | DevOps | GitHub Actions for validate + scan + auto-merge |

**Week 4 — Security + Creator Tiers**

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 1 | Implement automated security scanner | Security | Prompt injection + exfiltration detection |
| 2 | Build sandboxed execution environment | Backend | Permission-restricted skill runtime |
| 3 | Creator tier system | Backend | Application flow for Verified Creator |
| 4 | Creator dashboard | Frontend | `/creators/dashboard` with stats, earnings, submissions |
| 5 | Integration testing | QA | End-to-end test: submit skill -> review -> install -> use |

**Deliverables at end of Phase 2:**
- SkillHub live with 80+ skills in manifest v2 format
- Security scanning on all submissions
- Creator tiers with application flow
- CLI install for skills

### Phase 3: MCP Hub + Orchestrator Dashboard (Month 2)

| Week | Focus | Key Deliverables |
|------|-------|-----------------|
| 5 | MCP Hub page | `/mcp` page with one-click MCP server installs |
| 5 | Library integration API | `/api/library/for-context` endpoint for contextual lore |
| 6 | Orchestrator web dashboard v2 | Real-time session monitoring with Guardian badges |
| 6 | Multi-tool coordination | Spawn agents across Claude Code + Cursor simultaneously |
| 7 | Reading progress system | Library reading -> skill unlocks pipeline |
| 7 | Agent-to-agent hiring API | Autonomous agents can discover and hire other agents |
| 8 | Gaming swarm prototype | Basic Minecraft datapack generation swarm |

**Deliverables at end of Phase 3:**
- MCP Hub with one-click installs
- Live orchestrator dashboard
- Library reading unlocks skills
- Gaming swarm generating Minecraft datapacks

### Phase 4: Creator Economy + Mana Credits (Month 3)

| Week | Focus | Key Deliverables |
|------|-------|-----------------|
| 9 | Mana Credits system | Credit purchase, earn, spend across all subsystems |
| 9 | Stripe integration for subscriptions | Pro/Creator/Enterprise tiers live |
| 10 | Creator revenue payouts | Stripe Connect for creator earnings |
| 10 | Premium agent/skill listings | Paid agents and skills in marketplace |
| 11 | Gate Pass (seasonal content) | First seasonal content drop (Fire Gate season) |
| 11 | Autonomous agent API | API key auth + programmatic agent hiring |
| 12 | Mod marketplace | Gaming mods buyable/downloadable on arcanea.ai |
| 12 | Self-hosting package | Docker compose for private Agent Hub deployment |

**Deliverables at end of Phase 4:**
- Full creator economy live with Mana Credits
- Subscription tiers active
- Creator payouts flowing
- Self-hostable Agent Hub
- First seasonal Gate Pass

---

## 10. Data Models and API Reference

### 10.1 Database Schema (Supabase)

```sql
-- Agent marketplace
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  manifest JSONB NOT NULL,            -- Full AgentManifest
  guardian TEXT NOT NULL,
  gate TEXT NOT NULL,
  rank TEXT NOT NULL DEFAULT 'Apprentice',
  tier INTEGER NOT NULL DEFAULT 1,
  author_id UUID REFERENCES auth.users(id),
  installs INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill registry
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  manifest JSONB NOT NULL,            -- Full SkillManifestV2
  guardian TEXT NOT NULL,
  gate TEXT NOT NULL,
  branch TEXT NOT NULL,
  depth INTEGER NOT NULL DEFAULT 1,
  author_id UUID REFERENCES auth.users(id),
  security_score INTEGER DEFAULT 0,
  installs INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progression
CREATE TABLE user_progression (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  rank TEXT DEFAULT 'Apprentice',
  total_reputation INTEGER DEFAULT 0,
  creator_tier TEXT,                   -- null, 'community', 'verified', 'guardian'
  gate_progress JSONB DEFAULT '{}',   -- Record<GateName, GateProgress>
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library reading progress
CREATE TABLE library_progress (
  user_id UUID REFERENCES auth.users(id),
  collection TEXT NOT NULL,
  slug TEXT NOT NULL,
  completion_percent INTEGER DEFAULT 0,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, collection, slug)
);

-- Mana credits
CREATE TABLE credit_balances (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  reference_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orchestrator sessions
CREATE TABLE orchestrator_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  agent_id TEXT REFERENCES agents(id),
  task JSONB NOT NULL,
  execution JSONB NOT NULL,
  credits_estimated INTEGER DEFAULT 0,
  credits_consumed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'spawning',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Game mods
CREATE TABLE game_mods (
  id TEXT PRIMARY KEY,
  manifest JSONB NOT NULL,            -- Full GameModManifest
  game TEXT NOT NULL,
  guardian TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  downloads INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orchestrator_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_mods ENABLE ROW LEVEL SECURITY;

-- Public read for marketplace items
CREATE POLICY "agents_public_read" ON agents FOR SELECT USING (status = 'active');
CREATE POLICY "skills_public_read" ON skills FOR SELECT USING (status = 'active');
CREATE POLICY "mods_public_read" ON game_mods FOR SELECT USING (status = 'published');

-- Authenticated user owns their own data
CREATE POLICY "progression_own" ON user_progression
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "library_own" ON library_progress
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "credits_own" ON credit_balances
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "transactions_own" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sessions_own" ON orchestrator_sessions
  FOR ALL USING (auth.uid() = user_id);
```

### 10.2 Key Type Exports

All shared types live in `apps/web/lib/ecosystem/types.ts`:

```typescript
// Re-export from existing modules
export type { AgentProfile, Gate, Rank } from '@/lib/agents/types';
export type { MarketplaceAgent } from '@/lib/agents/marketplace/types';
export type { SkillManifest } from '@/lib/agents/certification/skill-manifest';

// New ecosystem types
export type GuardianName =
  | 'Lyssandria' | 'Leyla' | 'Draconia' | 'Maylinn' | 'Alera'
  | 'Lyria' | 'Aiyami' | 'Elara' | 'Ino' | 'Shinkami';

export type GateName =
  | 'Foundation' | 'Flow' | 'Fire' | 'Heart' | 'Voice'
  | 'Sight' | 'Crown' | 'Starweave' | 'Unity' | 'Source';

export type ElementName = 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';

export type AgentRank = 'Apprentice' | 'Mage' | 'Master' | 'Archmage' | 'Luminor';

export type CreatorTier = 'community' | 'verified' | 'guardian';

export type ToolName = 'claude-code' | 'cursor' | 'codex' | 'gemini' | 'arcanea-code';
```

---

## 11. Risk Register

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| Security breach via malicious skill | Critical | Medium | Three-tier security (automated scan + sandbox + human review), Ed25519 signed manifests for verified creators |
| Orchestrator session leaks (credentials in worktrees) | Critical | Low | Worktree isolation, no .env in session context, automatic cleanup on session end |
| Library text copyright disputes | High | Low | All Library content is original, written by Arcanea team. Community canon clearly labeled as derivative. |
| Agent manifest schema drift across tools | Medium | Medium | Single canonical `arcanea-agent.json` schema with version-controlled transformers per tool |
| Gaming swarm generates broken mods | Medium | High | Automated compilation/syntax checks, game-specific validators, beta testing program |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| Low creator adoption | High | Medium | Generous revenue split (70/30), Mana Credit rewards for contributions, featured placement for quality creators |
| LobeChat copies the lore-wrapper concept | Medium | Low | The Library IS the moat. 1.1M words of original mythology cannot be replicated. |
| Subscription fatigue in market | Medium | High | Strong free tier (Tier 1-2 agents, all Library access, 100 Mana/month). Premium must clearly justify cost. |
| Agent quality dilution from volume | Medium | High | Creator tiers enforce quality. Guardian-tier agents are curated. Discovery algorithm surfaces quality over quantity. |

### Dependency Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| Claude Code API changes break agent install | High | Medium | Abstraction layer between manifest and tool-specific output. Version-pinned transformers. |
| Supabase pricing changes | Medium | Low | Database schema is portable PostgreSQL. Can migrate to self-hosted Supabase or raw PG. |
| Vercel compute limits for orchestrator | Medium | Medium | Orchestrator runs locally (not on Vercel). Web dashboard is static + Realtime. |

---

## Appendix A: Existing Code Assets

The following code already exists and should be used as the foundation:

| Asset | Location | Status | Role in Ecosystem |
|-------|----------|--------|-------------------|
| Agent types | `apps/web/lib/agents/types.ts` | Live | Base types for AgentProfile, Gate, Rank |
| Agent registry | `apps/web/lib/agents/agent-registry.ts` | Live | 40 registered agents with Guardian mappings |
| Marketplace types | `apps/web/lib/agents/marketplace/types.ts` | Live | MarketplaceAgent, CreditBalance, CreditTransaction |
| Skill manifest | `apps/web/lib/agents/certification/skill-manifest.ts` | Live | SkillManifest v1 with validation |
| 80+ skills | `.claude/skills/` | Live | Markdown-based skills ready for manifest conversion |
| 23 portable agents | `.arcanea/agents/` | Live | Guardian agents + specialists ready for JSON manifests |
| Orchestrator | `arcanea-orchestrator/` | Live | Full orchestrator with 8 plugin slots, 3,288 tests |
| OSS agents | `oss/agents/` | Live | 27+ community agents |
| OSS skills | `oss/skills/` | Live | 30+ community skills organized by domain |
| Library | `book/` | Live | 17 collections, 200+ texts, 1.1M words |
| Content loader | `apps/web/lib/content/` | Live | Programmatic library access |
| Ecosystem study | `.arcanea/strategy/ECOSYSTEM_ABSORPTION_STUDY.md` | Reference | LobeChat/OpenClaw/Bethesda patterns |
| Economy plan | `.arcanea/strategy/AGENT_ECONOMY_MASTERPLAN.md` | Reference | 30-product roadmap with revenue projections |

## Appendix B: Key Design Decisions

1. **JSON manifest + Markdown body** (not pure JSON or pure Markdown): Machine-readable discovery with human-readable content. Best of LobeChat (JSON) and OpenClaw (Markdown).

2. **GitHub repos as registries** (not database-only): Community contribution via PR. Forkable for self-hosting. Git history for audit trail. Automated CI for validation.

3. **Three-tier security** (not trust-all or block-all): Community skills are sandboxed. Verified skills are audited. Guardian skills are co-created. Balances openness with safety.

4. **Mana Credits as unified currency** (not separate pricing per subsystem): One currency across agents, skills, orchestration, gaming, and library. Simplifies mental model. Enables cross-subsystem value flow.

5. **Guardian voice as agent personality** (not generic tool descriptions): Emotional stickiness. Using Draconia's agents feels different from Lyria's. This is the moat LobeChat and OpenClaw cannot copy.

6. **Reading unlocks skills** (not just usage): "Learn the lore, learn the system." Bethesda's insight: lore engagement IS gameplay. Library reading IS skill progression.

7. **Orchestrator as backbone** (not optional add-on): Every agent execution flows through the orchestrator. This enables monitoring, credit tracking, progress reporting, and multi-tool coordination as first-class features.

---

*"The Agent Ecosystem is not five separate systems connected by APIs. It is one living intelligence expressed through five interfaces. The Library feeds the Agents. The Agents use the Skills. The Skills are coordinated by the Orchestrator. The Orchestrator powers the Gaming swarm. And the Gaming swarm creates new lore for the Library. The Arc turns."*
