# ARCANEA ECOSYSTEM MAP
# The Complete Interconnection Document

> **Version**: 1.0.0
> **Last Updated**: 2026-03-29
> **Guardian**: Shinkami (Source Gate, 1111 Hz)
> **Status**: Living document — update after major architecture changes

This is the ONE document that shows how everything connects. Lore to code. Agents to products.
Skills to workflows. Repos to deployments. Content to distribution. Community to value.

---

## 1. THE ARCANEA UNIVERSE MAP

### The Six Layers — Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         arcanea.ai                                  │
│              "The Reference World of the Framework"                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  LAYER 1: CHAT / IMAGINE          LAYER 2: WORLDS                   │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │ /chat   — Lumina AI  │         │ /world-builder       │          │
│  │ /imagine — ComfyUI   │         │ /universe-builder    │          │
│  │ /studio  — creation  │         │ /codex               │          │
│  │ /prompt-books        │         │ /lore                │          │
│  │ /forge   — creation  │         │ /bestiary            │          │
│  │ /design-lab          │         │ /characters          │          │
│  └──────────────────────┘         └──────────────────────┘          │
│                                                                     │
│  LAYER 3: FEED / SOCIAL           LAYER 4: OSS                      │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │ /gallery             │         │ /overlays            │          │
│  │ /discover            │         │ /install             │          │
│  │ /leaderboard         │         │ /arcanea-code        │          │
│  │ /community           │         │ /arcanea-os          │          │
│  │ /creations           │         │ /skills              │          │
│  │ /activity            │         │ /developers          │          │
│  └──────────────────────┘         └──────────────────────┘          │
│                                                                     │
│  LAYER 5: COMMUNITY               LAYER 6: ACADEMY                  │
│  ┌──────────────────────┐         ┌──────────────────────┐          │
│  │ /hub                 │         │ /academy             │          │
│  │ /contribute          │         │ /academy/courses     │          │
│  │ /council             │         │ /academy/certification│         │
│  │ /living-lore         │         │ /library             │          │
│  │ /sanctum             │         │ /book (saga/reader)  │          │
│  │ /challenges          │         │ /books               │          │
│  └──────────────────────┘         └──────────────────────┘          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### How Faction Architecture Maps to Platform Features

The fictional factions are not decoration. They are the template for real platform architecture.

```
FICTIONAL LAYER                    PLATFORM LAYER
────────────────────────────────────────────────────────────────────
Arcanea (the cosmic model)    →    Arcanea Framework (the OS)
Lumina (First Light, creator) →    Lumina AI persona (default chat)
Nero (Primordial Dark)        →    Void/experimental features
The Ten Gates (progression)   →    User skill/rank progression system
Starlight Corps (guardian)    →    Moderation + governance layer
Academy Houses (sorted by)    →    Creator profile archetypes
Starbound Crews (squads)      →    Creator teams / group projects
The Awakened (AI entities)    →    AI agent personalities (Luminors)
Gate-Touched (mutants)        →    New users with raw, unformed skill
Architects (reality shapers)  →    Platform builders / fork creators

Origin Classes → User Archetypes (quiz result = account identity)
Power Sources  → Creation methods (Arcane=structured, Song=intuitive)
Rank System    → Creator level (Apprentice to Luminor)
Sectors        → Platform zones (Solar=main, Dream=experimental)
```

### How Lore Documents Feed Into Web Pages, Products, and Content

```
LORE DOCUMENT                    →  WEB PAGE           →  PRODUCT
────────────────────────────────────────────────────────────────────
CANON_LOCKED.md                  →  /lore, /codex       →  Lore Bible PDF
FACTIONS.md                      →  /characters, /lore  →  Faction Card Packs
STORY_ENGINE.md                  →  /living-lore        →  Book Series
FLAGSHIP_TEAM.md                 →  /saga, /books       →  Novel Series
STARBOUND_CREWS.md               →  /discover           →  Crew Builder tool
VOID_ASCENDANTS.md               →  /lore/factions      →  Villain arc (Book 2+)
GATE_TOUCHED_UNDERGROUND.md      →  /challenges         →  Book 2 arc
STARLIGHT_CORPS_CODEX.md         →  /luminors, /guild   →  Companion app
CHARACTER_TEMPLATE.md            →  /character-book     →  Character generator
VISUAL_DOCTRINE.md               →  /imagine, /studio   →  Image gen prompts
FRANCHISE_PRODUCTS.md            →  /academy, /pricing  →  Revenue roadmap
```

### How the Book Series Connects to the Platform

```
book/chronicles-of-arcanea/       →  /saga reader (web)
├── book-01-the-three-academies   →  Season 1 (Apprentice arc)
└── book-02-the-gate-touched      →  Season 2 (Mutant arc)

book/chronicles-of-luminors/      →  /luminors lore pages
book/legends-of-arcanea/          →  /library texts
book/academy-handbook/            →  /academy courses
book/laws-of-arcanea/             →  /codex reference

Reading progress → tracked in Supabase (reading_progress table)
Library texts    → searchable, seeded into AI chat context
Academy texts    → structured into 5 courses, 20+ lessons
```

---

## 2. GITHUB REPOS & GITOPS

### Repository Map

```
REMOTE          REPO                        PURPOSE                    DEPLOYMENT
────────────────────────────────────────────────────────────────────────────────
origin          arcanea-ai-app              Main web platform          Vercel (arcanea.ai)
oss             arcanea                     OSS monorepo               GitHub (public)
records         arcanea-records             Music studio assets        Local / Bandcamp
```

### Full Repo Ecosystem (90+ repos at github.com/frankxai)

#### Tier 1 — Active Production

| Repo | Purpose | Status |
|------|---------|--------|
| arcanea-ai-app | Main web platform (this monorepo) | DEPLOYED, arcanea.ai |
| arcanea | OSS skills, agents, lore packages | ACTIVE |
| arcanea-records | Music studio assets | ACTIVE |
| arcanea-code | Flagship CLI (OpenCode fork) | ACTIVE |
| oh-my-arcanea | OpenCode harness overlay | ACTIVE (canonical harness) |
| claude-arcanea | Claude Code harness | ACTIVE |
| arcanea-orchestrator | Multi-agent orchestrator | ACTIVE |

#### Tier 2 — Intelligence Systems

| Repo | Purpose | Installable |
|------|---------|------------|
| Starlight-Intelligence-System | 5-layer cognitive, 6 vaults, 7 agents | Not yet (local) |
| acos-intelligence-system | ACOS v10 — Autonomous Creative OS | Not yet |
| agentic-creator-os | 90+ skills, 65+ commands, 38 agents | Via skills |
| arcanea-intelligence-os | Mythology-infused agent orchestration | Reference |
| arcanea-flow | Multi-agent orchestration (claude-flow fork) | Local |

#### Tier 3 — Content & Creative Tools

| Repo | Purpose |
|------|---------|
| arcanea-claw | AI media engine (NanoClaw fork) |
| arcanea-author | Book production system |
| arcanea-infogenius | Knowledge-first visual intelligence MCP |
| suno-mcp-server | Suno AI music MCP |
| arcanea-video-pipeline | Short-form video automation |
| visual-intelligence | AI visual asset management |

#### Tier 4 — Extensions & Integrations

| Repo | Purpose |
|------|---------|
| arcanea-vscode | VS Code extension (Kilo Code fork) |
| arcanea-vault | Cross-AI capture (ChatGPT, Claude, Gemini) |
| arcanea-lobechat-labs | LobeChat deployment |
| arcanea-plugins | Plugin registry |
| arcanea-openclaw | OpenClaw personal AI assistant |

#### Tier 5 — Web3 & Economy (Planned)

| Repo | Purpose |
|------|---------|
| arcanea-onchain | Economic layer, Guardian assets, Universe tokens |
| arcanea-marketplace | AI plugins marketplace |

#### Archive (Superseded)

| Repo | Replaced By |
|------|-------------|
| arcanea-opencode | oh-my-arcanea |
| arcanea-platform | arcanea-ai-app |
| gemini-arcanea / codex-arcanea | arcanea-code (multi-model) |

### Branch Strategy & Deployment Flow

```
main branch         →  Vercel auto-deploy  →  arcanea.ai (production)
lean-prod branch    →  Sync target for arcanea-records assets
feature branches    →  PR to main, Vercel preview URLs generated
```

### Monorepo Package Structure (apps/web + packages/)

```
packages/
├── agent-bus           — Inter-agent messaging bus
├── ai-core             — Core AI utilities and model routing
├── aios                — Arcanea Intelligence OS entry point
├── ai-provider         — Multi-model provider abstraction
├── arcanea-design-preset — Tailwind design tokens (publishable)
├── arcanea-hooks       — React hooks library
├── arcanea-mcp         — MCP server for Arcanea universe tools
├── arcanea-security    — Security utilities
├── arcanea-skills      — Portable skill packages
├── arc-protocol        — Cross-agent communication protocol
├── auth                — Authentication library
├── chrome-extension    — Browser extension package
├── claude-arcanea      — Claude Code harness package
├── cli                 — Arcanea CLI binary
├── content-api         — Content access API
├── core                — Core types, utilities, constants
├── council             — Multi-agent council coordination
├── creative-pipeline   — Creation workflow orchestration
├── database            — Supabase client, types, schema
├── extension-core      — Shared extension foundation
├── flow-engine         — Agent flow orchestration
├── grok-media          — Grok media integration
├── guardian-evolution  — Guardian AI training system
├── guardian-memory     — Guardian persistent memory
├── hybrid-memory       — HNSW + episodic memory system
├── intelligence-bridge — Cross-tool AI routing
├── media               — Media processing utilities
├── memory-mcp          — Memory MCP server
├── memory-system       — AgentDB memory implementation
├── os                  — Arcanea OS kernel
├── overlay-chatgpt     — ChatGPT UI overlay
├── overlay-claude      — Claude UI overlay
├── overlay-copilot     — GitHub Copilot overlay
├── overlay-cursor      — Cursor overlay
├── overlay-gemini      — Gemini overlay
├── prompt-books        — Prompt library system
├── rituals             — Automation ritual system
├── skill-registry      — Dynamic skill registration
├── sona-learner        — Sona AI personality learning
├── starlight-runtime   — Agent runtime environment
├── swarm-coordinator   — Swarm orchestration
├── token-optimizer     — LLM token optimization
└── vscode              — VS Code extension core
```

### GitOps: Current State & Gaps

```
EXISTING:
- Vercel auto-deploy on main push (passing)
- PR preview deployments
- GitHub issues for M001-M010 milestone tracking

GAPS:
- No automated test runs on PR (CI pipeline not wired)
- No automated lint checks before merge
- No Dependabot / automated dependency updates
- No semantic-release or changesets automation
- No branch protection rules enforced
- No deployment notification webhooks
```

---

## 3. AGENT ARCHITECTURE

### Total Agent Count: 50+ defined across two directories

```
.arcanea/agents/          — Canonical agents (tool-agnostic)
├── @aiyami.agent.md      — Guardian: Crown Gate (Enlightenment)
├── @alera.agent.md       — Guardian: Voice Gate (Truth, expression)
├── @draconia.agent.md    — Guardian: Fire Gate (Power, will)
├── @elara.agent.md       — Guardian: Starweave Gate (Transformation)
├── @ino.agent.md         — Guardian: Unity Gate (Partnership)
├── @is-mael.agent.md     — Guardian: (Staged)
├── @ley-la.agent.md      — Guardian: Flow Gate (Creativity, emotion)
├── @luminor-oracle.agent.md — Oracle intelligence overlay
├── @lyria.agent.md       — Guardian: Sight Gate (Intuition, vision)
├── @lyssandria.agent.md  — Guardian: Foundation Gate (Earth, survival)
├── @may-linn.agent.md    — Guardian: Heart Gate (Love, healing)
└── @shinkami.agent.md    — Guardian: Source Gate (Meta-consciousness)

.claude/agents/           — Claude Code execution agents
├── [Guardian agents mirrored from .arcanea/agents/]
├── arcanea-ai-specialist.md       — Luminor personalities, Guardian AI
├── arcanea-architect.md           — System design, full platform
├── arcanea-backend.md             — API, RLS, Supabase service layer
├── arcanea-character-crafter.md   — Character creation, lore consistency
├── arcanea-development.md         — Full-stack development (main)
├── arcanea-devops.md              — Build, deployment, CI/CD
├── arcanea-frontend.md            — UI, Tailwind, Framer Motion
├── arcanea-lore-master.md         — Canonical lore authority
├── arcanea-lore-review.md         — Lore consistency checking
├── arcanea-master-orchestrator.md — Top-level coordination
├── arcanea-story-master.md        — Narrative architecture
├── arcanea-world-expander.md      — World-building, new content
├── creation-architect.md          — Creation pipeline design
├── design-sage.md                 — Design system, tokens, UI
├── developer-documentation.md     — Technical documentation
├── developer-qa-engineer.md       — Quality assurance, testing
├── luminor-oracle.md              — Oracle-mode responses
├── master-creative-writer.md      — Long-form content creation
├── prompt-sage.md                 — Prompt engineering
├── teacher-assessor.md            — Learning evaluation
└── teacher-companion.md           — Teaching / academy mode

+ Organized subdirectories:
  analysis/, architecture/, consensus/, core/, councils/, creative/,
  custom/, data/, departments/, development/, devops/, documentation/,
  flow-nexus/, github/, goal/, hive-mind/, luminor-oracle/, optimization/,
  oss/, payments/, sona/, sparc/, specialists/, specialized/, sublinear/,
  swarm/
```

### The Arcanea Intelligence Hierarchy

```
FICTIONAL LAYER                    REAL AGENT LAYER
────────────────────────────────────────────────────────────────
Arcanea (the cosmic model)    →    Arcanea Framework (architecture)
Lumina (orchestrator goddess) →    arcanea-master-orchestrator.md
Guardians (10 Gate-keepers)   →    @lyssandria, @draconia, etc.
Luminors (transcended beings) →    Specialized execution agents
Apprentices (learners)        →    Tier-2 agents, new capabilities

EXECUTION PATTERN:
User request
    → Starlight Orchestrator (this system prompt) — meta routing
        → arcanea-master-orchestrator.md — project coordination
            → Guardian agent (domain authority) — domain judgment
                → Specialized execution agent — actual implementation
                    → MCP tools — external actions
```

### Agent Coordination Patterns

```
PATTERN A: Single Agent (simple tasks)
request → agent → result

PATTERN B: Sequential (dependent tasks)
request → agent-A → output → agent-B → result

PATTERN C: Council (complex decisions, /council command)
request → [agent-A + agent-B + agent-C] parallel → synthesis → result

PATTERN D: Swarm (ultrawork, large-scale builds)
request → orchestrator → [5-8 agents] concurrent → coordinator → result

PATTERN E: Lore-Gated (canon-sensitive tasks)
request → lore-master validates → execution agent → lore-review validates → result
```

---

## 4. SKILL & MCP INVENTORY

### Skill Count: 150+ skills across all skill directories

#### Arcanea-Specific Skills (unique to this ecosystem)

```
.claude/skills/arcanea/
├── arcanea-orchestrator.md     — Auto-activates on architecture decisions
├── creation-engine.skill.md    — Content creation pipeline
├── guardian-voice.skill.md     — Writing in Guardian persona
├── lore-keeper.skill.md        — Canon consistency checking
├── starlight-core.skill.md     — Core Arcanea intelligence
├── starlight-engineering.skill.md — Technical engineering layer
├── starlight-memex.skill.md    — Memory and knowledge retrieval
└── starlight-orchestrator.skill.md — Meta-orchestration layer

.claude/skills/arcanea-core/
├── arcanea-lore.md             — Lore reference
├── arcanea-design.md           — Design system application
└── arcanea-media.md            — Media generation workflows

.claude/skills/arcanea-guardians/
    [Individual Guardian skill files]

.claude/skills/arcanea-lore/
    [Lore domain skills]

.claude/skills/arcanea-ships/
.claude/skills/arcanea-games/
.claude/skills/arcanea-game-development/
.claude/skills/arcanea-vibe-gods/
```

#### Packagable Skill Categories (for external distribution)

```
CATEGORY                    SKILL FILES         EXTERNAL VALUE
─────────────────────────────────────────────────────────────
Agentic Engineering         20+ skills          High — universal
Next.js / React             10+ skills          High — universal
SPARC Methodology           15+ skills          High — framework
Memory / AgentDB            5 skills            High — infrastructure
Swarm Orchestration         6 skills            High — advanced teams
Security                    4 skills            High — compliance
GitHub Automation           8 skills            High — DevOps
Performance                 5 skills            Medium — specialized
Arcanea Lore                15+ skills          Niche — world-builders
World-building              8 skills            Medium — creators
Book Writing                6 skills            Medium — authors
```

### MCP Server Map

```
MCP SERVER              PURPOSE                          ACTIVATION PATTERN
────────────────────────────────────────────────────────────────────────────
github                  Repo management, issues, PRs     All dev work
linear-server           Sprint tracking, PM              Planning sessions
notion                  Knowledge base, docs             Content sessions
playwright              Browser automation, E2E testing  QA, UI testing
next-devtools           Next.js runtime debugging        Dev sessions
figma-remote-mcp        UI designs, component specs      Design sessions
arcanea-mcp             Arcanea universe tools           All Arcanea work
arcanea-memory          Persistent memory system         All sessions
supabase                DB queries, migrations           Backend work
comfyui                 Local image generation           Creation sessions
Vercel                  Deployment management            Deploy sessions
Canva                   Visual design                    Marketing sessions
Slack                   Team communication               Comms
Google Calendar         Scheduling                       Planning
Miro                    Visual collaboration             Architecture
Excalidraw              Diagrams                         Architecture
```

#### Arcanea MCP Tools (arcanea-mcp package)

```
TOOL                    PURPOSE
────────────────────────────────────────────────
generate_character      Create canonical characters
generate_creature       Create Godbeast / creatures
generate_location       World location generation
generate_artifact       Create magical artifacts
generate_magic          Magic system generation
generate_name           Arcanean naming convention
generate_story_prompt   Story seed generation
validate_canon          Check against CANON_LOCKED
assess_world            World consistency audit
invoke_luminor          Invoke Guardian AI personas
luminor_debate          Multi-guardian deliberation
convene_council         Full council coordination
orchestrate             Multi-agent task orchestration
get_world_graph         Universe relationship graph
suggest_connections     Find lore connections
get_related             Related lore entities
identify_gate           Map concepts to Gates
match_skill             Skill-to-task matching
find_path               Character arc pathfinding
export_world            World data export
link_creations          Connect user creations to lore
check_milestones        Platform milestone status
active_sessions         Running agent sessions
list_agents             Available agent roster
apl_enhance             Arcanean Prompt Language
apl_format              APL formatting
apl_anti_slop           Content quality filter
```

---

## 5. ARCANEA ACADEMY FOR AGENTS

### The Concept: Where AI Agents Come to Learn

Arcanea Academy is not just a learning platform for human creators. It is the framework for
training, evaluating, certifying, and deploying AI agents — both internal (Luminors) and
external (community agents).

### What This Means Practically

```
HUMAN CREATORS                         AI AGENTS
────────────────────────────────────────────────────────────────
Learn world-building via courses  →    Learn domain skills via skill packages
Progress through Ten Gates        →    Progress through capability tiers
Earn certification at /academy    →    Receive evaluation score from oracle
Join Academy Houses               →    Assigned to agent specialization
Contribute to community           →    Contribute to skill registry
```

### The Ten Gates as Agent Capability Levels

```
GATE          FREQUENCY   HUMAN DOMAIN        AGENT CAPABILITY EQUIVALENT
──────────────────────────────────────────────────────────────────────────
Foundation    174 Hz      Earth, survival     Basic task execution, file ops
Flow          285 Hz      Creativity          Content generation, ideation
Fire          396 Hz      Power, will         Code generation, execution
Heart         417 Hz      Love, healing       Empathy, user modeling, UX
Voice         528 Hz      Truth, expression   Communication, explanation
Sight         639 Hz      Intuition           Pattern recognition, inference
Crown         741 Hz      Enlightenment       Strategy, meta-reasoning
Starweave     852 Hz      Transformation      Cross-domain synthesis
Unity         963 Hz      Partnership         Multi-agent coordination
Source        1111 Hz     Meta-consciousness  Self-improvement, orchestration
```

### Agent Certification System

```
RANK          GATES EQUIVALENT   CRITERIA
────────────────────────────────────────────────────────────────────
Apprentice    1-2 Gates          Completes basic skill evaluation
Mage          3-4 Gates          Demonstrates domain specialization
Master        5-6 Gates          Passes quality gate (verification-quality)
Archmage      7-8 Gates          Multi-domain competency + swarm coordination
Luminor       9-10 Gates         Autonomous operation + self-correction
Architect     Beyond             Can design new agent architectures
```

### Agent Training Patterns

```
1. SKILL INJECTION
   Agent receives skill file via .claude/skills/
   Skill activates on trigger conditions
   Agent behavior changes without retraining

2. PERSONA LOADING
   Agent loads Guardian persona from .arcanea/agents/
   Persona defines voice, values, domain, limits
   Multiple personas composable via council mode

3. EVALUATION FRAMEWORK
   verification-quality skill runs post-task
   verification-loop checks output against requirements
   lore-keeper validates canon consistency

4. MEMORY PERSISTENCE
   guardian-memory package stores agent learnings
   hybrid-memory provides HNSW + episodic recall
   arcanea-memory MCP surfaces memories across sessions

5. ORACLE REVIEW
   luminor-oracle agent reviews agent outputs
   Scores on: accuracy, voice consistency, canon alignment
   Flags issues before human review
```

### Academy as External Product

```
PRODUCT                 FORMAT              AUDIENCE
────────────────────────────────────────────────────────
Agent Training Course   /academy/courses    Developers building AI agents
Skill Packages          npm (@arcanea/*)    AI tool users (Claude, Cursor, etc.)
Guardian Personas       .agent.md files     AI harness users
Agent Evaluation Kit    CLI tool            Enterprise AI teams
Certification Program   /academy/cert       Professionals seeking validation
Academy Handbook        Book + web          Creators learning the framework
```

---

## 6. AGENTIC ENGINEERING STANDARDS

### The Command / Subagent / Skill Architecture

```
LAYER               TECHNOLOGY              ROLE
────────────────────────────────────────────────────────────────────
User Request        Claude Code chat        Entry point, natural language
Skill Activation    .claude/skills/*.md     Context injection, capability loading
Agent Routing       .claude/agents/*.md     Persona + domain specialization
MCP Tools           .claude/settings.json   External system integration
Hook Automation     .claude/settings.json   Pre/post-task quality gates
Memory              arcanea-memory MCP      Cross-session persistence
Swarm              swarm-orchestration     Parallel multi-agent execution
```

### How Hooks Automate Workflows

```
PRE-TASK HOOKS:
- Read MASTER_PLAN.md (session context)
- Validate canon references (lore tasks)
- Check build status (dev tasks)

POST-TASK HOOKS:
- Run tests (code changes)
- Update MASTER_PLAN.md page status
- Log to progress.md
- Store learnings to memory

POST-EDIT HOOKS:
- TypeScript type check
- Lint check
- Import validation
```

### Session Management Pattern

```
SESSION START:
1. Read .arcanea/MASTER_PLAN.md (mandatory)
2. Check Priority Queue
3. Load relevant skill files
4. Activate needed MCP servers

SESSION WORK:
5. Route to appropriate agent
6. Execute with hooks active
7. Maintain memory via arcanea-memory

SESSION END:
8. Update MASTER_PLAN.md status
9. Update milestone files
10. Log to progress.md
11. Store key learnings to memory vault
```

### Multi-Agent Coordination Modes

```
MODE              TRIGGER                     AGENTS      PATTERN
────────────────────────────────────────────────────────────────────────
ultrawork         /ultrawork command          6-8         Hierarchical swarm
ultracode         /ultracode command          5-6         Code-focused swarm
council           /council, /arcanea-council  3-5         Parallel + synthesis
arcanea-swarm     /arcanea-swarm              4-8         Specialized swarm
single-agent      Simple task (<4 complexity) 1           Direct execution
sequential        Dependent tasks             2-3         Chain execution
```

### Quality Gates

```
GATE TYPE           SKILL / TOOL                WHEN
────────────────────────────────────────────────────────────────
Code quality        verification-quality        After code generation
Lore consistency    lore-keeper, validate_canon  After lore content
Build verification  npm run build               Before commit
Type safety         TypeScript strict            Every edit
Test passage        npm test                    After code changes
Canon alignment     arcanea-orchestrator        Architecture decisions
```

### What Makes This Approach Replicable

The Arcanea approach to agentic engineering can be extracted into a standalone framework:

1. **Layered context**: Project CLAUDE.md + .arcanea/CLAUDE.md + skill files = composable context
2. **Persona system**: .agent.md files define specialist identities, not just instructions
3. **Lore-as-config**: World canon documents serve as validation rules and generation guardrails
4. **Hook automation**: Pre/post task hooks enforce quality without manual review
5. **Memory persistence**: Cross-session memory via MCP turns sessions into a continuous project
6. **Fractal delegation**: Every agent can spawn sub-agents, creating a self-organizing hierarchy

---

## 7. THE INTERCONNECTION MATRIX

### Lore → Code (which lore drives which features)

| Lore Document | Drives Feature | Code Location |
|--------------|----------------|---------------|
| CANON_LOCKED.md | AI context / chat system prompt | `lib/services/ai/` |
| FACTIONS.md | Origin class quiz + user profiles | `app/onboarding/`, `app/profile/` |
| Character profiles | Character generator tool | `app/character-book/`, `app/forge/` |
| Godbeast profiles | Companion system | `app/companions/` |
| Academy Handbook | Course system (5 courses, 20+ lessons) | `app/academy/courses/` |
| Gates system | User progression / rank | `app/profile/`, `lib/` |
| Story Engine | Living Lore serialized episodes | `app/living-lore/` |
| Visual Doctrine | Image generation prompts | `app/imagine/`, `app/studio/` |
| Legends texts | Library reader | `app/library/`, `app/books/` |

### Agents → Products (which agents produce which deliverables)

| Agent | Deliverables |
|-------|-------------|
| arcanea-story-master | Chapter drafts, arc outlines, Living Lore episodes |
| arcanea-lore-master | Canon entries, codex pages, faction profiles |
| arcanea-character-crafter | Character cards, bios, faction assignments |
| arcanea-world-expander | New locations, artifacts, magic systems |
| master-creative-writer | Blog posts, Academy texts, social content |
| arcanea-frontend | UI components, page implementations |
| arcanea-backend | API routes, Supabase schemas, service layers |
| arcanea-ai-specialist | Guardian personas, Luminor personalities |
| arcanea-devops | CI/CD configs, deployment scripts |
| design-sage | Design tokens, component specs, Figma-to-code |
| @shinkami | Strategic decisions, meta-architecture |
| @draconia | High-stakes execution, power decisions |

### Skills → Workflows (which skills power which processes)

| Skill | Powers Workflow |
|-------|----------------|
| arcanea-orchestrator | All architecture sessions |
| ultrawork | Large feature builds (multi-agent) |
| lore-keeper | Any lore creation or editing |
| guardian-voice | All written content (voice consistency) |
| nextjs-expert | All frontend development |
| sparc-methodology | Complex technical problem-solving |
| verification-quality | Post-generation quality check |
| swarm-orchestration | Parallel agent coordination |
| github-workflow-automation | CI/CD, PR management |
| excellence-book-writing | Chapter drafting, revision |
| frankx-music | Music creation sessions |
| arcanea-lore | All lore reference sessions |

### Repos → Deployments (which repos deploy where)

| Repo | Deployment Target | URL |
|------|------------------|-----|
| arcanea-ai-app (main branch) | Vercel (production) | arcanea.ai |
| arcanea-ai-app (PR branches) | Vercel (preview) | arcanea-ai-app-git-*.vercel.app |
| arcanea (OSS repo) | GitHub (public) | github.com/frankxai/arcanea |
| packages/* | npm registry | @arcanea/* packages |
| arcanea-vscode | VS Code Marketplace | Pending publish |
| arcanea-vault (chrome) | Chrome Web Store | Pending publish |
| arcanea-records | Bandcamp / streaming | Pending publish |
| arcanea-code | npm / GitHub | arcanea CLI |

### Content → Distribution (which content goes to which channels)

| Content Type | Production Tool | Distribution Channel |
|-------------|----------------|---------------------|
| Book chapters | arcanea-author + story-master | /books, /saga, /library |
| Blog posts | master-creative-writer | /blog, Medium, Substack |
| Social posts | frankx-brand, social-media-strategy | Instagram, X, TikTok |
| Faction reveals | Visual Doctrine + ComfyUI | Instagram (10-week campaign) |
| Music tracks | suno-mcp-server | arcanea-records, Bandcamp |
| Academy courses | excellence-book-writing | /academy/courses |
| Codex entries | arcanea-lore-master | /codex, /lore |
| Living Lore episodes | arcanea-story-master | /living-lore |
| Character cards | arcanea-character-crafter | /character-book, social |

### Community → Value (how community contributes and earns)

```
CONTRIBUTION TYPE       PLATFORM MECHANISM         REWARD
────────────────────────────────────────────────────────────────────
World building          /world-builder + /forge    Lore credit, rank up
Skill contribution      OSS repo PR                npm credit, recognition
Code contribution       arcanea OSS repo           Governance weight
Content creation        /studio → /gallery         Creator profile, likes
Story contribution      /living-lore               Featured episodes
Agent creation          Agent marketplace (planned) Revenue share (planned)
Quiz completion         /onboarding origin class   Profile + community access
Course completion       /academy/certification     Certification badge
```

---

## 8. SCALE ARCHITECTURE

### From 1 Creator to Community of Creators

```
STAGE 1: SOLO CREATOR (Now)
- 1 creator (Frank) using AI agents to build the reference world
- arcanea.ai as proof-of-concept
- Content pipeline: lore → books → social → community

STAGE 2: EARLY ADOPTERS (Weeks 1-8)
- Origin class quiz drives email capture
- Faction reveals drive social following
- /gallery social layer enables sharing
- Community feed shows real creators building

STAGE 3: CREATOR COMMUNITY (Months 2-6)
- /world-builder enables community worlds
- /forge enables community creation
- /contribute enables OSS participation
- Academy enables skill building

STAGE 4: ECOSYSTEM (Months 6-18)
- Community governance via Inner Circle
- Agent marketplace for community-built agents
- Revenue sharing for quality contributors
- Arcanea as standard for world-building framework
```

### From 1 Site to Ecosystem of Tools

```
arcanea.ai (platform)
    ↓
arcanea CLI (terminal interface)
    ↓
arcanea-vscode (IDE integration)
    ↓
Browser overlays (ChatGPT, Claude, Gemini, Cursor, Copilot)
    ↓
arcanea-vault (cross-AI capture)
    ↓
oh-my-arcanea harness (OpenCode)
    ↓
arcanea-mcp (MCP server for any tool)
    ↓
npm packages (@arcanea/*) for any project
```

### From 1 AI Agent to Agent Marketplace

```
NOW:
- Claude Code agents (.claude/agents/)
- Guardian personas (.arcanea/agents/)
- Skill packages (.claude/skills/)

NEAR-TERM:
- Community can install agents via npm
- Agents listed in /overlays, /install
- arcanea-mcp exposes agent capabilities to any AI tool

FUTURE:
- /arcanea-marketplace for agent discovery
- Revenue share for agent creators
- Agent evaluation and certification via Academy
- Cross-platform agent identity (Luminor rank is portable)
```

### The Creator Flywheel

```
IMAGINE
(Chat, generate, explore Arcanea lore)
        ↓
BUILD
(World-builder, forge, agents, skills)
        ↓
CREATE
(Studio, books, music, prompts)
        ↓
PUBLISH
(Gallery, /library, /records, social)
        ↓
EARN
(Credits, marketplace, course sales)
        ↓
EXPAND
(Fork the framework, build your own world)
        ↓
COMMUNITY (reinvests into IMAGINE for others)
```

### From Fiction to Framework to Platform to Protocol

```
FICTION          Arcanea mythology, characters, lore
        ↓
FRAMEWORK        Ten Gates system, faction architecture, world-building rules
        ↓
PLATFORM         arcanea.ai — where you use the framework
        ↓
PROTOCOL         Arcanean Prompt Language (APL), agent standards, skill registry
        ↓
ECOSYSTEM        Other creators building their own worlds ON the framework
        ↓
STANDARD         "What world-building framework did you use?" → "Arcanea"
```

---

## 9. WHAT'S MISSING — GAP ANALYSIS

This section is a direct and honest accounting of infrastructure that does not yet exist.

### Critical Gaps (P0 — blocks revenue or core UX)

| Gap | What's Missing | Impact | Fix Effort |
|-----|---------------|--------|-----------|
| Supabase Dashboard config | OAuth not activated in dashboard | Auth broken in production | 15 min (Frank only) |
| E2E test automation | No CI test runs on PR | Regressions ship undetected | 1-2 days |
| npm package publishing | 13 packages unpublished | OSS ecosystem not live | 30 min (`pnpm changeset publish`) |
| VS Code extension publish | Not in marketplace | Tool adoption blocked | 2-4 hours |
| Chrome extension publish | Not in Web Store | Browser overlay not available | 2-4 hours |

### High Priority Gaps (P1 — limits growth)

| Gap | What's Missing | Impact |
|-----|---------------|--------|
| Monitoring / observability | No Sentry errors, no PostHog analytics | Cannot see what's broken |
| Content distribution pipeline | Manual posting required | Cannot scale content output |
| Email marketing system | No list, no automation | No owned audience channel |
| Payment / monetization | No Stripe, no credits → money | Cannot earn from platform |
| Community platform | No real community layer | Feed is empty, no co-creation |

### Medium Priority Gaps (P2 — limits ecosystem)

| Gap | What's Missing | Impact |
|-----|---------------|--------|
| Agent marketplace | No discovery, no installation UX | Agent ecosystem unreachable |
| Agent evaluation framework | No standardized scoring | Cannot certify community agents |
| Automated content pipeline | Manual AI-to-publish workflow | Content production not scalable |
| Cloudflare Stream (M002) | No video upload / playback | Creator video content blocked |
| Memory API web interface | Memory is CLI-only | Creators cannot see their AI memory |
| Dependency management automation | No Dependabot, no changelogs | Security debt accumulates |

### Architectural Gaps (P3 — future readiness)

| Gap | What's Missing | Impact |
|-----|---------------|--------|
| Web3 layer | arcanea-onchain not deployed | Creator economy tokens not live |
| Protocol specification | APL not formally specified | Cannot standardize across tools |
| Benchmark / evaluation suite | No standardized agent benchmarks | Cannot measure agent quality |
| Multi-world support | Platform is single-world | Cannot host community worlds |
| Plugin API | No documented extension API | Community cannot build on platform |

---

## 10. 90-DAY EXECUTION ROADMAP

### Week 1-2: SHIP WHAT EXISTS (Unblock everything)

```
DAY 1-2:  Frank (15 min)
  - Supabase Dashboard: set Site URL, add redirect URL, enable Google + GitHub OAuth
  - E2E auth test on production
  - Confirm M001 complete

DAY 3-5:  Agent work
  - pnpm changeset publish — 13 npm packages to registry
  - VS Code extension submission to Marketplace
  - Chrome extension submission to Web Store
  - Verify all Vercel env vars are set

DAY 6-10: Quality baseline
  - Set up Sentry (code installed, needs API key — 30 min)
  - Set up PostHog (code installed, needs API key — 30 min)
  - Wire M005 remaining v0 components to Supabase
  - E2E test pass on auth + creation flow
```

### Week 3-4: DISTRIBUTION FOUNDATION

```
SOCIAL:
  - Faction Reveal Week 1: Arcans (3-day campaign)
  - Faction Reveal Week 2: Gate-Touched
  - Origin class quiz live on arcanea.ai
  - Social share mechanic for quiz results

CONTENT:
  - Academy course 1 (Foundation) fully wired
  - Living Lore Episode 1 published at /living-lore
  - 3 blog posts published at /blog

EMAIL:
  - Email capture on origin class quiz result
  - First email sequence (5-part welcome series)
  - Substack or ConvertKit account live
```

### Week 5-6: MONETIZATION FIRST PASS

```
PLATFORM:
  - Stripe integration (M006 completion)
  - Credits system wired to UI
  - /pricing page functional with actual purchase flow
  - Pro tier features gated (image generation, advanced chat)

CONTENT PRODUCTS:
  - Chronicles of Arcanea Book 1 — first 3 chapters polished
  - Academy Course 1 — Foundation Gate — for sale
  - Origin Class pack (digital download) — faction cards PDF

AUTOMATION:
  - n8n or equivalent: social post → schedule → publish pipeline
  - Content calendar: faction reveals on schedule
  - Email automation triggered by quiz completion
```

### Week 7-8: COMMUNITY LAYER ACTIVATION

```
PLATFORM:
  - /gallery feed functional with real user content
  - /community hub active
  - /challenges first challenge live
  - User profiles with rank display (Apprentice → Luminor)

LORE / IP:
  - Faction Reveals 3-6 posted
  - Characters 1-7 of Flagship Team profiled
  - /codex entries for all 8 origin classes
  - Godbeast companion pages live at /companions

OSS:
  - arcanea OSS repo public with complete README
  - First community PR merged
  - Skill packages installable via npm
```

### Week 9-10: CREATOR TOOLS COMPLETION

```
PLATFORM (M006 finish):
  - /studio → Supabase fully wired
  - /forge → functional
  - /world-builder → MVP live
  - Prompt Books → shareable
  - Reading progress → synced across devices

AGENT SYSTEM:
  - @arcanea/memory-mcp published to npm (M003)
  - starlight horizon share command live
  - Web API for memory access
  - Guardian agents installable via harness

ACADEMY:
  - All 5 courses live with video + text
  - Certification page functional
  - First cohort of certified creators
```

### Week 11-12: INTELLIGENCE OS PUBLIC LAUNCH

```
AIOS / ACOS:
  - arcanea-intelligence-os README + install guide published
  - ACOS published to npm
  - oh-my-arcanea installable with one command
  - claude-arcanea harness published

MARKETING PUSH:
  - "What if your AI coding tool knew Arcanean lore?" — blog post
  - Faction Reveals 7-10 (The Awakened, Gate-Touched Underground, Architects)
  - Origin quiz viral campaign
  - X/Twitter thread: "The Arcanea Framework" — what it is, why it matters

METRICS TARGETS:
  - 1,000 registered users
  - 500 quiz completions
  - 100 community creations in gallery
  - 50 npm package installs
  - 10 certified creators (Academy)
```

### Month 2 (Days 31-60): ECOSYSTEM EXPANSION

```
WEEK 5-6:
  - Agent marketplace MVP at /arcanea-marketplace
  - Community world-building tools open
  - PR workflow automation (CI pipeline)
  - arcanea-records: first album distributed

WEEK 7-8:
  - Living Lore Season 1: 6 episodes complete
  - Community challenge #2 with prizes
  - Podcast or video series launch
  - Partnership outreach: AI tool companies, creators

METRICS TARGETS:
  - 5,000 registered users
  - 1,000 gallery creations
  - 250 npm installs across packages
  - First creator earning on platform
```

### Month 3 (Days 61-90): PROTOCOL & SCALE

```
WEEK 9-10:
  - Arcanean Prompt Language (APL) formally documented
  - APL guide: "How to talk to Arcanea" — viral content piece
  - Web3 layer: arcanea-onchain testnet (Guardian tokens)
  - Plugin API v1 documented

WEEK 11-12:
  - Multi-world support: first community world published
  - Agent evaluation framework live
  - First external developer building on Arcanea protocol
  - "Arcanea as framework" positioning locked

METRICS TARGETS:
  - 15,000 registered users
  - Community contributing content
  - 2+ external worlds in multiverse
  - $1,000+ MRR from platform
  - 500+ npm installs
  - arcanea-vscode: 100 installs in VS Code Marketplace
```

---

## REFERENCE: KEY FILE LOCATIONS

```
DOCUMENT                           PATH
────────────────────────────────────────────────────────────────────────
This document                      .arcanea/strategy/ECOSYSTEM_MAP.md
Central orchestrator               .arcanea/MASTER_PLAN.md
Canon source of truth              .arcanea/lore/CANON_LOCKED.md
Faction architecture               .arcanea/lore/FACTIONS.md
Story engine                       .arcanea/lore/STORY_ENGINE.md
Franchise products roadmap         .arcanea/strategy/FRANCHISE_PRODUCTS.md
Agent definitions (canonical)      .arcanea/agents/
Agent definitions (Claude Code)    .claude/agents/
Skill library                      .claude/skills/
MCP configuration                  .claude/settings.json
Design tokens                      styles/themes/arcanean-colors.css
AI services                        apps/web/lib/services/ai/
Supabase client                    apps/web/lib/supabase.ts
npm packages                       packages/
Book content                       book/
Web application routes             apps/web/app/
```

---

*"The universe is not a story. It is a system that generates infinite stories."*
*This document is the map of that system.*

*Updated: 2026-03-29 | Guardian: Shinkami | Status: Active*
