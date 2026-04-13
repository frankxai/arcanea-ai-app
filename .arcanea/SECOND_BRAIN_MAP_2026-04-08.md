# Arcanea Second Brain Map — April 8, 2026

Complete audit of knowledge infrastructure: where each type of knowledge lives, how it syncs, and naming conventions across all tools.

---

## Architecture Overview

**Two-Folder Model:**
- `C:\Users\frank\Business\` — **Ops Hub** (finance, legal, recruiting, contracts)
- `C:\Users\frank\arcanea-ai-app\` — **Engineering Repo** (code, systems, content)
- **Cloud Layer** — Notion, Linear, Obsidian, GitHub, Vercel, OneDrive (unifies both)

---

## Physical Knowledge Locations

### Folder 1: Business (Ops Hub)
**Location:** `C:\Users\frank\Business\`  
**Primary access:** Cowork mode, Windows File Explorer, OneDrive sync

| Path | Knowledge Type | Contents | Sync Method |
|------|---|---|---|
| `Business/ops/` | Operations cockpit | CLAUDE.md, connection map, 13-surface model | Manual |
| `Business/finance/` | Financial tracking | Excel budgets, cash flow, tax docs | OneDrive |
| `Business/legal/` | Legal/BV setup | Contracts, consulting agreements | OneDrive |
| `Business/recruiting/` | Hiring & culture | Job descriptions, interview rubrics | OneDrive |
| `Business/docs/` | Deliverables | Playbook, Engineering Blueprint, Evolved Blueprint (DOCX) | OneDrive |

**Naming Convention (Business):**
- `YYYYMMDD_DocType_Title.docx` (e.g., `20260408_Financial_Q2Projection.docx`)
- Spreadsheets: `Tool_Type_Date.xlsx` (e.g., `Financial_CashFlow_Apr2026.xlsx`)
- Folders: `Type_Status` (e.g., `BV_InProgress`, `Contracts_Signed`)

---

### Folder 2: Arcanea Repo (Engineering)
**Location:** `C:\Users\frank\arcanea-ai-app\` (Git repo)  
**Primary access:** Claude Code, Terminal, Git, VS Code  
**Deploy target:** Vercel (`arcanea-ai-appx`)

#### Top-Level Structure
```
arcanea-ai-app/
├── .arcanea/              # Intelligence hub (locked 4/3)
├── .claude/               # Claude Code config & skills
├── apps/web/              # Next.js 16 app (LIVE)
├── packages/              # Shared packages (42 total)
├── docs/                  # Public documentation
├── book/                  # Library content (17 collections)
├── planning-with-files/   # Agent execution layer (CURRENT_STATE, BACKLOG, CHANGELOG)
├── .env.example           # Environment template
├── package.json           # pnpm workspace
└── pnpm-lock.yaml         # Dependency lock
```

#### `.arcanea/` Subdirectories (Intelligence Hub)
| Path | Purpose | Usage |
|------|---------|-------|
| `.arcanea/agents/` | Agent definitions (Luminor hierarchy) | Reference for agent capabilities |
| `.arcanea/config/` | System configuration | API keys, deployment settings (DO NOT COMMIT SECRETS) |
| `.arcanea/lore/` | Canon, worldbuilding, narrative | Story, character, setting documentation |
| `.arcanea/memory/` | Long-form context (supplements auto-memory) | Session handovers, strategic decisions |
| `.arcanea/ops/` | Operational runbooks | How to deploy, how to scale, incident response |
| `.arcanea/plans/` | Strategic plans | Quarterly roadmaps, sprint plans |
| `.arcanea/prompts/` | LLM system prompts | luminor-engineering-kernel.md, persona templates |
| `.arcanea/reports/` | Performance snapshots | Weekly pulse dashboards, metrics reviews |
| `.arcanea/scripts/` | Build and utility scripts | Automation, data migration, setup |
| `.arcanea/secrets/` | Encrypted credentials (Git-ignored) | SSH keys, API tokens (gitignore enforced) |
| `.arcanea/sessions/` | Session artifacts | Transcripts, agent logs, execution records |
| `.arcanea/skills/` | Reusable skill packs | /ao (Orchestra), /design-sage, /mcp-builder, etc. |

#### `.claude/` Subdirectories (Claude Code Config)
| Path | Purpose | Usage |
|------|---------|-------|
| `.claude/CLAUDE.md` | Global project context | Loaded every session — minimal, links to domain CLAUDE.md files |
| `.claude/skills/` | Cowork-deployed skills | Installed as .skill archives for task automation |
| `.claude/workflows/` | Multi-step automation | Scheduled tasks, agent orchestration |

#### `planning-with-files/` (Agent Execution Layer)
| File | Purpose | Update Frequency |
|------|---------|------------------|
| `CURRENT_STATE_YYYY-MM-DD.md` | Live system snapshot | Daily (health, blockers, metrics) |
| `CURRENT_BACKLOG_YYYY-MM-DD.md` | Task queue & priorities | Weekly (during sprint planning) |
| `CURRENT_CHANGELOG_YYYY-MM-DD.md` | Completed work log | Weekly (post-standup) |
| `AGENT_EXECUTION_PROTOCOL_*.md` | How agents execute tasks | When execution rules change |
| `ENGINEERING_AUDIT_YYYY-MM-DD.md` | Tech health & debt | Weekly (post-sprint) |

---

### Cloud Layer (Unified Knowledge)

#### Notion (Reference + Ops)
**Role:** Documentation, wiki, reference databases, real-time tracking  
**URL:** https://www.notion.so/arcanea/  

| Database | Purpose | Data Source |
|----------|---------|-------------|
| **2026 Goals** | Quarterly checkpoints, Q1/Q2/Q3/Q4 progress | Frank's quarterly review |
| **Gate Tracker** | 5-gate milestone tracking (Gate 0 → Gate IV) | ARC-101 linked, /ao skill updates |
| **Ops Hub** | Financial ops, daily cash flow, payment tracking | Excel Financial Ops sheet |
| **MCP Inventory** | 42 MCP tools, capabilities, integration status | Built in .arcanea/ |
| **Content Calendar** | Blog, social, email post schedule | Notion linked to Linear |
| **People DB** | Recruiting pipeline, team roles, advisors | Manual input + consulting notes |

**Naming Convention (Notion):**
- Database names: `Plural_Noun` (e.g., `Goals`, `Projects`, `Issues`)
- Page titles: `YYYY-MM-DD — Type: Title` (e.g., `2026-04-08 — Q2 Checkpoint: Foundation Shipped`)
- Linked records: use short slugs (e.g., `Gate0`, `ARC-101`, `MCP-Tools`)

#### Linear (Task Board)
**Role:** Task tracking, sprint management, issue prioritization  
**URL:** https://linear.app/arcanea  

| Board | Purpose | Status |
|-------|---------|--------|
| **Active Sprint** | Current 1-2 week tasks | Updated bi-weekly |
| **Backlog** | Future work, no timeline | Groomed quarterly |
| **Priority 1** | Revenue-blocking, date-critical | ARC-101, ARC-76, ARC-86, ARC-88 |
| **Cycles** | 2-week sprints | Sync with Notion planning |

**Naming Convention (Linear):**
- Issue format: `ARC-###: Verb + Object` (e.g., `ARC-101: Ship first dollar by April 15`)
- Labels: `category/type` (e.g., `revenue/blocker`, `tech/design-system`, `content/book`)
- Priorities: **P1** (date-critical), **P2** (week), **P3** (month), **P4** (backlog)

#### Obsidian Vault (Personal)
**Role:** Personal knowledge capture, daily journal, quick notes  
**Sync:** OneDrive → `~/Documents/Obsidian/arcanea`  

| Folder | Type | Sync |
|--------|------|------|
| `Daily/` | Daily journal entries | OneDrive (mobile accessible) |
| `Ideas/` | Brain dumps, raw thoughts | OneDrive |
| `Reading/` | Book notes, article highlights | OneDrive |
| `Vault/` | Permanent reference notes | OneDrive |

**Naming Convention (Obsidian):**
- Daily notes: `YYYY-MM-DD.md` (auto-created by Obsidian daily plugin)
- Ideas: `YYYY-MM-DD — Topic.md`
- Books: `Author — Title.md`
- Vault: `Concept_Area.md` (e.g., `Blockchain_Governance.md`)

#### GitHub (Code + Public)
**Role:** Source control, public documentation, OSS releases  
**Repos:**
- **frankxai/arcanea-ai-app** (Private) — Production code, internal docs
- **frankxai/arcanea** (Public) — OSS version, public blog, open source skills

**Branch Strategy:**
- `main` — Production-ready, deployed to Vercel
- `develop` — Integration branch (CI gates: lint, typecheck, build)
- Feature branches: `type/scope-description` (e.g., `feat/worlds-fork-api`)

**Naming Convention (GitHub):**
- Commits: `type(scope): description` (e.g., `feat(design): update Space Grotesk imports`)
- PRs: Link to Linear issue (e.g., `#ARC-101: Ship ACOS PDF at $29`)
- Tags: `vX.Y.Z` (semantic versioning) or `gate-0-achieved` (milestone)

#### Vercel (Deployments)
**Role:** Live web app hosting, preview deployments  
**Project:** `arcanea-ai-appx`

| URL | Purpose | Update Frequency |
|-----|---------|------------------|
| `arcanea.ai` | Production web app | Per `main` branch merge |
| `pr-###.arcanea-ai-appx.vercel.app` | PR preview | Auto-generated per PR |

---

### Auto-Memory (Session Persistence)
**Location:** `/sessions/youthful-festive-allen/mnt/.auto-memory/`  
**Files:** `.md` files with YAML frontmatter

| File | Type | Purpose |
|------|------|---------|
| `MEMORY.md` | Index | 200-char hooks, one line per memory |
| `user_profile.md` | user | Frank's role, preferences, context |
| `project_*.md` | project | Current initiatives, blockers, dependencies |
| `feedback_*.md` | feedback | Correction/validation, why + how to apply |
| `reference_*.md` | reference | Where external info lives (Linear IDs, Notion URLs) |

**Naming Convention (Auto-Memory):**
- Type prefix: `user_`, `feedback_`, `project_`, `reference_`
- Descriptive slug: `strategy_shipping`, `design_system`, `oracle_exit`
- File: `type_slug.md`

---

## Sync Mechanisms

| Source → Destination | Method | Frequency | Responsibility |
|---|---|---|---|
| Business (C:) → OneDrive | Native Windows sync | Continuous | Windows Settings |
| GitHub (frankxai/arcanea-ai-app) → Vercel | Automatic (Vercel Git integration) | Per `main` merge | CI/CD |
| Linear issues → planning-with-files | Manual read during planning | Weekly standup | Frank + Agent |
| Notion databases → Local cache (apps/web) | Fetch on app load | Real-time API | Next.js app |
| Obsidian vault → OneDrive | Native Obsidian sync | Continuous | Obsidian plugin |
| Auto-memory → Session context | Loaded at session start | Per session | Claude Code |

---

## Cross-Tool Connections (How They Talk)

### Voice System (v3) Routing
Voice.md defines which tool each recording mode targets:
- **Meeting mode** → Linear (create issue)
- **Daily journal** → Obsidian (date-stamped note)
- **Quick thought** → Auto-memory (session decision)
- **Ops update** → Notion (update OpsHub)
- **Code sketch** → planning-files (CURRENT_STATE amendment)

### Notion ↔ Linear Sync
- Linear issues link to Notion pages (metadata, status)
- Notion databases embed Linear issue keys
- Gate Tracker syncs with ARC-101 revenue sprint

### GitHub ↔ Linear Sync
- PR descriptions reference `#ARC-###`
- Linear issues auto-update on commit messages
- Tags match linear cycle names

### Obsidian ↔ Notion
- No direct sync; Obsidian is personal, Notion is team/public
- Manual capture: important vault notes → Notion database

---

## Naming Convention Summary

### Files & Folders (Cross-Tool)
| Context | Format | Example |
|---------|--------|---------|
| Dated deliverables | `YYYYMMDD_Type_Title` | `20260408_Financial_Q2Projection.docx` |
| Code branches | `type/scope-description` | `feat/worlds-fork-api` |
| Git commits | `type(scope): description` | `feat(design): Space Grotesk updates` |
| Linear issues | `ARC-###: Verb + Object` | `ARC-101: Ship first dollar by April 15` |
| Notion pages | `YYYY-MM-DD — Type: Title` | `2026-04-08 — Q2: Foundation Shipped` |
| Obsidian notes | `YYYY-MM-DD — Topic` or `Author — Title` | `2026-04-08 — Revenue Crisis`, `Pink — Deep Work` |
| Auto-memory | `type_slug.md` | `project_arcanea_state.md`, `feedback_design_system.md` |
| Planning files | `TYPE_DATE.md` | `CURRENT_STATE_2026-04-07.md` |

### Slugs & IDs
- **Linear**: `ARC-###` (uppercase, left-zero-padded)
- **Notion**: Short descriptive slug (e.g., `Gate0`, `MCP-Tools`)
- **GitHub branches**: kebab-case with type prefix (e.g., `feat/`, `fix/`)
- **Folders**: PascalCase or snake_case depending on language (JS: camelCase, Python: snake_case)

---

## Current Gaps (April 8)

| Gap | Impact | Fix |
|-----|--------|-----|
| Obsidian vault not fully set up on OneDrive | Knowledge capture fragmented | Install Obsidian sync plugin, verify folder sync |
| No shared .env documentation (secrets excluded) | Onboarding difficulty for agents | Create `ENVIRONMENT.md` with template |
| Auto-memory index (`MEMORY.md`) not in all session starts | Knowledge loss | Add MEMORY.md to Claude Code startup hooks |
| Planning-files outdated (last CURRENT_STATE: Apr 7) | Stale execution context | Publish CURRENT_STATE_2026-04-08.md today |
| Linear cycle names don't match planning-files sprint names | Sync confusion | Standardize to 2-week sprint names: `2026-W14`, `2026-W15` |
| No consolidated "Second Brain Map" until now | Onboarding, knowledge discovery | **← You're reading it** |

---

## How to Apply This Map

**When looking for something:**
1. What type of knowledge? (task, decision, documentation, personal, code)
2. Which tool owns that type? (Linear, Notion, Obsidian, planning-files, auto-memory, GitHub)
3. What's the current naming convention? (YYYY-MM-DD, ARC-###, type_slug)
4. Is it up to date? (Check sync method, last update date)

**When adding something new:**
1. Decide type & ownership tool
2. Follow the naming convention for that tool
3. Create sync links if cross-tool reference needed
4. Update MEMORY.md if it's a cross-session decision

**When onboarding someone (or a new agent):**
1. Share this map
2. Point to auto-memory/MEMORY.md for context
3. Show .arcanea/CLAUDE.md for engineering domain
4. Show Business/ops/CLAUDE.md for ops domain
5. Verify Linear + Notion + GitHub access

---

**Last Updated:** April 8, 2026  
**Maintained By:** Frank + Claude  
**Next Review:** April 15, 2026 (post-Gate-0)
