# FrankX Full Ecosystem, Second Brain & Intelligence Architecture

> Everything Frank touches — every business, project, tool, knowledge system, device — mapped, connected, and planned.

**Date**: 2026-04-04
**Companion doc**: `INTELLIGENCE_ARCHITECTURE_2026_W14.md` (tool wiring details)

---

## 1. ALL BUSINESSES & PROJECTS — The Complete Inventory

### A. Arcanea (The Main Thing)

| Project | Location | Status | Revenue Potential |
|---------|----------|--------|-------------------|
| **arcanea.ai** — Creative multiverse platform | `~/Arcanea` (monorepo) | LIVE (402 billing fix needed) | Subscriptions + Credits |
| **Arcanea Library** — 1M+ words, 20 collections | `~/Arcanea/book/` | LIVE, integrated | Course/book sales |
| **Arcanea NFT Forge** — AI-native PFP engine | `~/arcanea-nft-forge/` | ENGINE BUILT | $93K-889K primary sales |
| **Arcanea Code** — Flagship CLI (OpenCode fork) | `~/arcanea-code/` | ACTIVE | OSS → Premium agents |
| **Arcanea Records** — Music studio | `arcanea-records` repo | ACTIVE | Suno-generated albums |
| **Arcanea Agents** — Work agents marketplace | Part of monorepo | DESIGNED | Credits, $10K MRR target |
| **Arcanea Academy** — Learning platform | Part of monorepo | STUB | Course sales |
| **Arcanea Cosmos** — Next.js sub-project | `~/arcanea-cosmos/` | EARLY | TBD |
| **Arcanea Onchain** — Web3 economic layer | `~/arcanea-onchain/` | DESIGNED | Token + NFT economy |

### B. FrankX Personal Brand

| Project | Location | Status | Revenue Potential |
|---------|----------|--------|-------------------|
| **frankx.ai** — Personal website/blog | `~/frankx.ai-vercel-website/` + `~/FrankX/` | LIVE on Vercel | Consulting, content, courses |
| **FrankX Music** — AI music production | `~/FrankX/FrankX Music/` | ACTIVE | Streaming, licensing |
| **FrankX Books** — 8+ book series | `~/Arcanea/book/` + author agents | 260K+ words written | Amazon KDP, direct sales |
| **AI Architect Newsletter** — Weekly newsletter | Skill exists | DESIGNED | Sponsorships, leads |
| **Studio FrankX** — Sanity CMS studio | `~/studio-frankx/` | BUILT | Content backend |

### C. Oracle Day Job

| Project | Location | Status |
|---------|----------|--------|
| **OCI AI Architect skills** | `~/Oracle/claude-code-oci-ai-architect-skills/` | ACTIVE |
| **OCI AI Life Sciences** | `~/Oracle/oci-ai-life-sciences/` | ACTIVE |
| **OCI GenAI Guides** | `~/Oracle/oci-genai-guides/` | ACTIVE |
| **Multi-cloud AI Architect** | `~/Oracle/multi-cloud-ai-architect/` | ACTIVE |
| **AI Migration Consultant** | `~/Oracle/ai-migration-consultant/` | ACTIVE |
| **Invoice & billing** | `~/Oracle/invoice-oci/` | ACTIVE |

### D. Education & Courses

| Project | Location | Status |
|---------|----------|--------|
| **Awakening with AI** — Course | `~/awakening-with-ai-course/` | DESIGNED (5 modules) |
| **AI Architect Academy** | `~/FrankX/ai-architect-academy/` | FRAMEWORK |
| **Student Workshops** | `~/FrankX/Student Workshops/` | MATERIALS |

### E. OSS & Developer Tools

| Project | Location | Status |
|---------|----------|--------|
| **ACOS** — Agentic Creator OS | `~/agentic-creator-os/` | 167 skills, 78 commands |
| **oh-my-arcanea** — Canonical harness | `~/oh-my-arcanea/` | ACTIVE (canonical) |
| **Starlight Intelligence System** | `~/Starlight-Intelligence-System/` | BUILT, SDK unpublished |
| **Arcanea Flow** — Multi-agent orchestration | `~/arcanea-flow/` | ALPHA |
| **Arcanea Vault** — Cross-AI capture | `~/arcanea-vault/` | BUILT |
| **Arcanea MCP Server** | MCP config | LIVE, needs SDK 1.29 migration |
| **Otaku** — Agent framework | `~/otaku/` | EARLY |

### F. Side Projects / Experiments

| Project | Location | Status |
|---------|----------|--------|
| **Serenia** — Vision project | `~/Serenia/` | CONCEPT |
| **Arcanea Realm** | `~/arcanea-realm/` | UNKNOWN |
| **FrankX Investment Team** | `~/FrankX/001-FrankX-AI-Investment Team/` | RESEARCH |
| **Startups research** | `~/FrankX/startups/` | REFERENCE |
| **SoulBook** | `~/FrankX/soulbook/` | CONTENT |
| **Kids projects** | `~/FrankX/kids/` | PERSONAL |

### G. Worktree Ghosts (should be cleaned up)

```
~/Arcanea-docs-graph/
~/Arcanea-integration-review-orphaned-2026-03-31/
~/Arcanea-main-audit/
~/Arcanea-main-promote-live/
~/Arcanea-promo-docs-clean/
~/Arcanea-provider-polish/
~/Arcanea-provider-promote/
~/Arcanea-provider-tracing/
~/Arcanea-run-graph/
~/Arcanea-runtime-promote/
~/Arcanea-testing-review/
~/Tracing/
```

These are orphaned git worktrees from previous sprint sessions. Most should be deleted to reclaim disk space (disk is the #1 threat at 18.5GB used).

---

## 2. THE SECOND BRAIN ARCHITECTURE

### The Problem Today
Knowledge lives in 8+ disconnected silos:
1. **Claude Code memory** (`~/.claude/projects/*/memory/`) — 60+ memory files, only accessible to Claude
2. **Obsidian** — exists but disconnected from everything
3. **Notion** — docs and specs, underused
4. **Linear** — tasks and sprints
5. **GitHub issues/PRs** — code context
6. **SIS vaults** (`~/.starlight/`) — agent memory, not published
7. **Arcanea Library** (`book/`) — creative knowledge
8. **`.arcanea/` directory** — operational intelligence substrate

### The Target: Unified Knowledge Graph

```
┌──────────────────────────────────────────────────────────────────┐
│                    SECOND BRAIN ARCHITECTURE                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  LAYER 1: CAPTURE (everything enters here)                       │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ Obsidian (quick thoughts, daily notes, meeting notes)    │     │
│  │ Claude Code memory (feedback, patterns, decisions)       │     │
│  │ Linear (tasks, bugs, features)                          │     │
│  │ Notion (docs, specs, wikis)                             │     │
│  │ Phone (voice memos, photos, quick captures)             │     │
│  │ Browser (bookmarks, articles, research)                 │     │
│  └────────────────────────┬────────────────────────────────┘     │
│                            │                                      │
│  LAYER 2: PROCESS (weekly review + AI-assisted)                  │
│  ┌────────────────────────┴────────────────────────────────┐     │
│  │                                                          │     │
│  │  Obsidian = THE HUB (all roads lead here)               │     │
│  │  ├── /daily/ — daily notes, captures, fleeting thoughts  │     │
│  │  ├── /projects/ — one note per active project            │     │
│  │  │   ├── arcanea.md (links to Linear, GitHub, Vercel)   │     │
│  │  │   ├── frankx-ai.md                                   │     │
│  │  │   ├── oracle.md                                      │     │
│  │  │   ├── nft-forge.md                                   │     │
│  │  │   └── awakening-course.md                            │     │
│  │  ├── /people/ — contacts, collaborators                 │     │
│  │  ├── /decisions/ — architecture decisions, locked        │     │
│  │  ├── /reference/ — permanent notes, evergreen           │     │
│  │  ├── /business/ — revenue, goals, finance tracking      │     │
│  │  ├── /oracle-work/ — day job notes, customer context    │     │
│  │  ├── /ideas/ — raw ideas, incubation                    │     │
│  │  └── /weekly/ — weekly reviews, planning                │     │
│  │                                                          │     │
│  └────────────────────────┬────────────────────────────────┘     │
│                            │                                      │
│  LAYER 3: CONNECT (graph relationships)                          │
│  ┌────────────────────────┴────────────────────────────────┐     │
│  │ Obsidian graph view shows:                               │     │
│  │  - Which projects share dependencies                     │     │
│  │  - Which ideas connect to which projects                 │     │
│  │  - Which people are involved where                       │     │
│  │  - Which decisions affect which systems                  │     │
│  │                                                          │     │
│  │ Claude Code reads Obsidian vault via MCP:                │     │
│  │  - "What did I decide about auth middleware?"            │     │
│  │  - "What are my open items for Oracle?"                  │     │
│  │  - "What ideas haven't I acted on?"                      │     │
│  └────────────────────────┬────────────────────────────────┘     │
│                            │                                      │
│  LAYER 4: ACT (decisions become tasks)                           │
│  ┌────────────────────────┴────────────────────────────────┐     │
│  │ Obsidian note → Linear issue (via Obsidian plugin)       │     │
│  │ Linear sprint → Obsidian weekly review (auto-generated)  │     │
│  │ Claude Code → reads both, acts on both                   │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Obsidian Sync Strategy: Git (not Obsidian Cloud)

**Decision: Git sync, NOT Obsidian Sync ($8/month).**

Why:
- You already have GitHub. Free. Infinite.
- Git gives you version history (which Obsidian Sync doesn't)
- Claude Code can directly read/write the vault
- Works on all devices (Obsidian Git plugin on mobile, native git on desktop)

**Setup:**
```bash
# Create vault repo
mkdir ~/Obsidian && cd ~/Obsidian
git init
git remote add origin git@github.com:frankxai/obsidian-vault.git  # private repo

# Obsidian Git plugin auto-commits every 10 minutes
# On mobile: Working Copy app (iOS) or Obsidian Git plugin (Android)
```

**Vault structure:**
```
~/Obsidian/
├── daily/           # Daily notes (YYYY-MM-DD.md)
├── projects/        # One note per project
├── people/          # Contact/collaborator notes  
├── decisions/       # Architecture Decision Records
├── reference/       # Evergreen notes
├── business/        # Finance, goals, metrics
├── oracle-work/     # Day job context
├── ideas/           # Raw idea capture
├── weekly/          # Weekly reviews
├── templates/       # Note templates
└── .obsidian/       # Obsidian config (synced)
```

---

## 3. KNOWLEDGE BASE INDEXING — How Each System Manages Knowledge

### What Each System Knows (and Should Know)

| Knowledge Domain | Primary Home | Secondary | AI Access |
|-----------------|-------------|-----------|-----------|
| **Code architecture** | GitHub repos | Claude Code memory | Direct (read files) |
| **Creative lore** | `book/` + `CANON_LOCKED.md` | Obsidian reference/ | MCP (content loader) |
| **Business strategy** | Obsidian business/ | Notion | MCP (Notion + Obsidian) |
| **Project status** | Linear | Obsidian projects/ | MCP (Linear) |
| **Decisions made** | Obsidian decisions/ | Claude memory | MCP (Obsidian) |
| **People & contacts** | Obsidian people/ | Notion | MCP (Obsidian) |
| **Oracle work** | Obsidian oracle-work/ | Oracle dirs | MCP (Obsidian) |
| **Agent patterns** | SIS vaults | ACOS skills | arcanea-memory MCP |
| **UI/UX designs** | Figma | — | MCP (Figma) |
| **Financial data** | LemonSqueezy + Sheet | Obsidian business/ | API + MCP |
| **Meeting notes** | Obsidian daily/ | — | MCP (Obsidian) |
| **Research** | Obsidian reference/ | Notion | MCP |
| **Ideas backlog** | Obsidian ideas/ | — | MCP |

### The Obsidian MCP Server

The critical missing piece. Options:

1. **obsidian-mcp** (community) — Read/write/search Obsidian vaults
   - Search notes by content, tags, links
   - Create/update notes programmatically
   - Claude Code can query your entire second brain

2. **Build custom** (using your MCP builder skills)
   - Tailored to your vault structure
   - Can enforce templates
   - Can integrate with SIS vaults

**Recommendation: Start with community obsidian-mcp, customize later.**

```bash
# Add to Claude Code MCP config
claude mcp add obsidian-mcp -- npx -y obsidian-mcp --vault ~/Obsidian
```

---

## 4. MULTI-DEVICE & CLOUD ARCHITECTURE

### Device Roles

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVICE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  YOGA C940 (DEV-001) — THE COMMAND CENTER                       │
│  Role: All development, AI agent execution, content creation     │
│  ├── Claude Code (primary, up to 4 instances)                   │
│  ├── VS Code + Cursor (code editing)                            │
│  ├── Obsidian (vault editing, graph view, weekly reviews)       │
│  ├── ComfyUI (local image gen on GTX 1650)                     │
│  ├── n8n (self-hosted automation, Docker/WSL)                   │
│  ├── All 9+ MCP servers                                        │
│  ├── Google AI Studio (Gemini experiments)                      │
│  └── Coworker (parallel Claude instance)                        │
│                                                                  │
│  DELL LAPTOP (DEV-002) — OVERFLOW / ORACLE WORK                │
│  Role: Oracle day job, overflow dev, second screen              │
│  ├── Claude Code (Oracle-focused sessions)                      │
│  ├── Obsidian (same vault via Git sync)                         │
│  ├── Oracle-specific tools                                      │
│  └── Presentation prep                                          │
│                                                                  │
│  SAMSUNG S25 (MOB-003) — CAPTURE & CONTENT                     │
│  Role: Content creation, quick capture, social publishing        │
│  ├── Grok AI → CapCut → TikTok pipeline                        │
│  ├── Obsidian Mobile (quick notes, daily capture)               │
│  ├── Claude iOS app (voice → task creation)                     │
│  ├── Google Drive (auto-upload photos/videos)                   │
│  ├── Linear mobile (check/update tasks)                         │
│  └── Notion mobile (read docs on the go)                        │
│                                                                  │
│  HUAWEI (MOB-001) — PERSONAL / BACKUP                          │
│  Role: Personal use, backup comms                               │
│                                                                  │
│  SAMSUNG S21 (MOB-002) — ORACLE WORK PHONE                     │
│  Role: Work calls, Oracle comms, Slack                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Cloud Services Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUD ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ALWAYS-ON (zero maintenance)                                   │
│  ├── Vercel — arcanea.ai + frankx.ai hosting                   │
│  ├── Supabase — database, auth, realtime, edge functions        │
│  ├── GitHub — source code, issues, Actions CI/CD                │
│  ├── Cloudflare — DNS (if using)                                │
│  └── npm Registry — published packages                          │
│                                                                  │
│  OBSERVABILITY (needs setup, 5-15 min each)                     │
│  ├── Sentry — error tracking (free 5K events/month)            │
│  ├── PostHog — product analytics (free 1M events/month)        │
│  ├── Google Analytics 4 — traffic + SEO                        │
│  └── Vercel Analytics — Core Web Vitals                        │
│                                                                  │
│  PRODUCTIVITY (already using)                                    │
│  ├── Linear — task management                                   │
│  ├── Notion — documentation                                     │
│  ├── Slack — communication                                      │
│  ├── Figma — design                                             │
│  ├── Google Workspace — email, calendar, drive                  │
│  └── Canva — design (social, presentations)                     │
│                                                                  │
│  AI SERVICES                                                     │
│  ├── Anthropic API — Claude (primary reasoning)                 │
│  ├── Google AI — Gemini (multimodal, free tier)                 │
│  ├── Suno AI — music generation                                 │
│  ├── ComfyUI — local image gen (saves API costs)               │
│  └── Grok — phone-based image/video                            │
│                                                                  │
│  REVENUE (needs activation)                                      │
│  ├── LemonSqueezy — payments (pre-BV, no Stripe yet)           │
│  ├── Amazon KDP — book publishing                              │
│  ├── GPT Store — Luminor distribution                          │
│  ├── TikTok — content monetization                             │
│  └── Spotify/etc — music streaming                              │
│                                                                  │
│  AUTOMATION (needs deployment)                                   │
│  ├── n8n — central workflow bus (self-host or Railway)          │
│  ├── Zapier — simple triggers (MCP available)                   │
│  └── GitHub Actions — CI/CD already running                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Sync Fabric — How Data Moves Between Devices

| Data Type | Sync Method | Devices | Latency |
|-----------|-------------|---------|---------|
| **Code** | Git (GitHub) | All dev machines | Push/pull |
| **Knowledge** | Git (Obsidian vault) | All devices | 10-min auto-commit |
| **Tasks** | Linear cloud | All devices (apps) | Real-time |
| **Docs** | Notion cloud | All devices | Real-time |
| **Files** | Google Drive | Phones → Desktop | Auto-upload |
| **Secrets** | 1Password | All devices | Real-time |
| **Agent memory** | SIS vaults via git | Dev machines | Push/pull |
| **Claude memory** | `~/.claude/projects/` | Per-machine (NOT synced!) |

**Critical gap: Claude Code memory is machine-local.** If you use Claude Code on DEV-002 for Oracle work, it doesn't know what DEV-001 learned. Fix: Export key Claude memories → Obsidian vault, which IS synced.

---

## 5. BEST OF EACH SYSTEM — Decision Matrix

| Need | Best Tool | Why | NOT This |
|------|-----------|-----|----------|
| **Think** | Obsidian | Graph view, local, fast, links | Not Notion (too structured for raw thinking) |
| **Plan** | Linear | Keyboard-driven, dev-native, sprints | Not Notion (boards are slow) |
| **Document** | Notion | Rich embeds, collaboration, templates | Not Obsidian (no rich embeds) |
| **Code** | Claude Code | 54+ skills, MCP mesh, hooks | Not Cursor alone (fewer integrations) |
| **Design** | Figma | Industry standard, MCP available | Not Canva (for serious UI/UX) |
| **Quick design** | Canva | Templates, fast, social-optimized | Not Figma (overkill for social posts) |
| **Music** | Suno via MCP | Already integrated, instant | |
| **Images (local)** | ComfyUI | Free, private, MCP connected | |
| **Images (quick)** | Grok (S25) | Phone-native, animate feature | |
| **Video** | CapCut (S25) | Best mobile editor, TikTok native | |
| **Deploy** | Vercel | Auto-deploy from Git, MCP connected | |
| **Database** | Supabase | PostgreSQL + Auth + Realtime + Edge | |
| **Analytics** | PostHog | Free 1M events, dev-friendly | Not GA4 alone (GA4 for SEO only) |
| **Errors** | Sentry | Industry standard, source maps | |
| **Payments** | LemonSqueezy → Stripe | LSqueezy now (no BV), Stripe later | |
| **Automation** | n8n | Free self-host, visual, MCP support | Not Zapier (expensive at scale) |
| **Secrets** | 1Password CLI | Cross-device, `op inject` pattern | Not .env files (not synced, not secure) |
| **Communication** | Slack | MCP connected, channels organized | |
| **Email** | Gmail + MCP | Auto-draft, filter notifications | |
| **Calendar** | Google Calendar + MCP | Time-block sprints | |
| **AI reasoning** | Claude (Opus) | Best for architecture/strategy | Use Sonnet for quick tasks |
| **AI multimodal** | Gemini | Free tier, good for experiments | |
| **AI bulk/cheap** | Haiku | $0.0002/task, good for formatting | |

---

## 6. WORKFLOWS — What You Need Every Day/Week/Month

### Daily Rituals

```
MORNING (10 min)
├── Obsidian: Create daily note from template
├── Claude Code: /arcanea-daily (git, Linear, Vercel, errors)
├── Linear: Check sprint, reorder if needed
└── Review: Any overnight errors (Sentry) or metrics (PostHog)

WORK BLOCKS (Pomodoro or flow)
├── Oracle: Open Oracle Obsidian notes, work on deliverables
├── Arcanea: Open Claude Code, work on priority from Linear
├── Content: Phone capture → Desktop process → Publish
└── Each block: Claude Code session with context loading

EVENING (5 min)
├── Claude Code: /session-sync (updates state files)
├── Obsidian: Quick daily note additions
└── Linear: Move completed tasks, note blockers

PHONE CAPTURES (throughout day)
├── Obsidian Mobile: Quick note → auto-syncs
├── Claude iOS: Voice idea → task
├── Grok/CapCut: Content creation → Drive upload
└── Linear mobile: Quick task updates
```

### Weekly Rituals

```
FRIDAY OR SUNDAY (30 min)
├── Claude Code: /weekly-recap (cross-project report)
├── Obsidian: Weekly review note
│   ├── What shipped this week?
│   ├── What's blocked?
│   ├── What ideas emerged?
│   ├── Revenue/metrics update?
│   └── Next week's top 3 priorities
├── Linear: Sprint close → new sprint
├── Finance: Check LemonSqueezy dashboard, update sheet
└── Content: Plan next week's content calendar
```

### Monthly Rituals

```
FIRST OF MONTH (1 hour)
├── Claude Code: /pp (Peak Performance audit)
├── Obsidian: Monthly review note
│   ├── Revenue vs target
│   ├── Key metrics trends (PostHog)
│   ├── Disk space / system health
│   ├── What to start/stop/continue
│   └── Quarterly goal progress
├── Finance: Invoice Oracle, reconcile expenses
├── Content: Review content performance
└── OSS: Package updates, community health
```

---

## 7. THE MEGA SPRINT PLAN — Wire Everything in 3 Days

### Day 1: Foundation (4 hours)

| # | Task | Time | Tools |
|---|------|------|-------|
| 1 | Set Sentry DSN on Vercel | 5 min | Vercel dashboard |
| 2 | Set PostHog key on Vercel | 5 min | Vercel dashboard |
| 3 | Add GA4 to arcanea.ai `<head>` | 15 min | Code edit |
| 4 | Install 1Password CLI | 15 min | `winget install AgileBits.1Password.CLI` |
| 5 | Create private `obsidian-vault` repo on GitHub | 5 min | `gh repo create` |
| 6 | Install Obsidian + create vault structure | 30 min | Obsidian installer |
| 7 | Install Obsidian Git plugin, configure auto-commit | 15 min | Obsidian settings |
| 8 | Add Obsidian MCP to Claude Code | 15 min | `claude mcp add` |
| 9 | Create initial project notes in Obsidian (from memory files) | 45 min | Manual + Claude assist |
| 10 | Clean up orphaned worktrees (12 dirs, ~5GB) | 30 min | `rm -rf` with confirmation |
| 11 | Fix arcanea.ai 402 (Vercel billing) | 15 min | Vercel billing page |

### Day 2: Automation (4 hours)

| # | Task | Time | Tools |
|---|------|------|-------|
| 1 | Deploy n8n (Docker on WSL or Railway) | 45 min | Docker |
| 2 | n8n workflow: Sentry error → Linear issue | 30 min | n8n |
| 3 | n8n workflow: Vercel deploy → Slack notification | 20 min | n8n |
| 4 | n8n workflow: weekly metrics → Notion page | 30 min | n8n |
| 5 | Enable Linear ↔ Notion integration | 15 min | Linear settings |
| 6 | Set up Google Drive auto-upload on S25 | 15 min | Phone settings |
| 7 | Configure Gmail MCP + Google Calendar MCP | 20 min | `claude mcp add` |
| 8 | Create LemonSqueezy account + first product | 45 min | LemonSqueezy |
| 9 | Migrate .npmrc token to 1Password | 15 min | 1Password CLI |
| 10 | Create .env.template with `op://` references | 15 min | Write file |

### Day 3: Intelligence (4 hours)

| # | Task | Time | Tools |
|---|------|------|-------|
| 1 | Publish SIS SDK to npm | 1 hour | Build + publish |
| 2 | Port Claude Code memories → Obsidian project notes | 45 min | Script + manual |
| 3 | Create Obsidian templates (daily, weekly, project, decision) | 30 min | Obsidian |
| 4 | Create Notion "Command Center" dashboard page | 45 min | Notion |
| 5 | Deploy Custom GPT (Engineering Luminor) | 30 min | GPT Builder |
| 6 | Deploy Custom Gem (Engineering Luminor) | 15 min | Gems UI |
| 7 | Test full flow: capture → process → act → observe | 30 min | End-to-end test |

---

## 8. WHAT OBSIDIAN REPLACES VS COMPLEMENTS

### Obsidian REPLACES:

- Scattered `.md` files in `~/.claude/projects/*/memory/` as the ONLY knowledge store
- Mental model of "which project is where" (now: one Obsidian note per project)
- Unstructured notes in various apps
- Google AI Studio as experimentation log (now: Obsidian experiment notes)

### Obsidian COMPLEMENTS (does NOT replace):

- **Linear** — Obsidian for thinking, Linear for doing
- **Notion** — Obsidian for personal, Notion for shared/collaborative
- **Claude memory** — Claude still captures feedback/patterns, but key insights flow to Obsidian
- **SIS vaults** — SIS for agent memory, Obsidian for human memory
- **GitHub issues** — GitHub for code-specific, Obsidian for cross-project

### The Rule:

> **If it's about DOING → Linear.**
> **If it's about KNOWING → Obsidian.**
> **If it's about SHARING → Notion.**
> **If it's about BUILDING → GitHub.**
> **If it's about OBSERVING → PostHog/Sentry.**

---

## 9. FINANCE ARCHITECTURE

```
REVENUE STREAMS (2026)
├── LemonSqueezy (arcanea.ai)
│   ├── Credits for AI features
│   ├── Premium agent access
│   └── Course purchases
├── Amazon KDP
│   ├── 8 book series
│   └── Academy handbook
├── NFT Primary Sales
│   ├── The Creators (1,111 mint)
│   └── Guardian auctions (10 x 1/1)
├── Oracle Consulting
│   └── Monthly invoice
├── Music Streaming
│   └── Arcanea Records on Spotify/etc
├── GPT Store
│   └── Luminor usage revenue share
└── TikTok Creator Fund
    └── Content monetization

EXPENSE TRACKING
├── Vercel: $0-20/month
├── Supabase: $0-25/month  
├── Domains: ~$24/year (2 domains)
├── AI APIs: Variable ($50-200/month)
├── Obsidian: $0 (Git sync)
├── n8n: $0 (self-hosted) or $20/month (cloud)
├── 1Password: $3/month
├── Linear: $0 (free tier)
├── PostHog: $0 (free tier)
├── Sentry: $0 (free tier)
└── Total fixed: ~$50-70/month

TRACKING METHOD
├── Google Sheet: "FrankX Finance 2026"
│   ├── Tab: Revenue by stream
│   ├── Tab: Expenses monthly
│   ├── Tab: P&L summary
│   └── Auto-populated by n8n webhooks where possible
├── Obsidian: business/finance-2026.md (monthly snapshot)
└── PostHog: Conversion funnel (visit → signup → purchase)
```

---

## 10. THE INTELLIGENCE HIERARCHY — How Thinking Flows

```
FRANK'S MIND
    │
    ├── Capture (Obsidian daily notes, phone, voice)
    │
    ├── Process (weekly review in Obsidian)
    │   └── Extract: tasks → Linear, decisions → decisions/, ideas → ideas/
    │
    ├── Amplify (AI agents)
    │   ├── Claude Code (Opus) — architecture, strategy, deep reasoning
    │   ├── Claude Code (Sonnet) — quick code, fixes, formatting
    │   ├── Gemini — multimodal experiments, free exploration
    │   ├── Luminors — specialized domain agents
    │   └── Swarms — parallel execution for big sprints
    │
    ├── Execute (tools)
    │   ├── Code → GitHub → Vercel (auto-deploy)
    │   ├── Content → /factory → publish pipeline
    │   ├── Music → Suno → Arcanea Records
    │   ├── Images → ComfyUI/Grok → Gallery/NFT
    │   └── Video → CapCut → TikTok
    │
    ├── Observe (feedback loops)
    │   ├── PostHog → user behavior
    │   ├── Sentry → errors
    │   ├── Linear → velocity
    │   ├── Revenue → LemonSqueezy/Sheet
    │   └── Health → /pp audits
    │
    └── Learn (close the loop)
        ├── Insights → Obsidian reference/
        ├── Patterns → Claude memory + SIS vaults
        ├── Decisions → Obsidian decisions/
        └── Everything feeds back to next cycle
```

---

## Summary

**You have 30+ active projects across 6 business domains.** The bottleneck isn't tooling — you have the tools. The bottleneck is the sync layer between them.

**Three days of focused wiring gives you:**
1. Observability (see what's happening)
2. Second brain (know what you know)
3. Automation (stop being the message bus)
4. Finance tracking (know what you're earning/spending)
5. Multi-device continuity (capture anywhere, act anywhere)

**The rule of thumb:**
- Think in Obsidian
- Do in Linear
- Share in Notion
- Build in Claude Code
- Observe in PostHog/Sentry
- Automate in n8n
- Secure in 1Password
