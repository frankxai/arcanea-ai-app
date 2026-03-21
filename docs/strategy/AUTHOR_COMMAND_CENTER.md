# Author Command Center — The Complete Publishing House OS

> *"Every solo creator needs the infrastructure of a publishing house. This is that infrastructure."*

---

## 1. The Problem

Solo creators and small publishers manage:
- 5-10 writing tools (Notion, Obsidian, Scrivener, Word, Google Docs)
- 3-5 publishing platforms (Amazon KDP, Apple Books, IngramSpark, Kobo, Substack)
- 4-6 social channels (LinkedIn, X, Instagram, YouTube, TikTok, Newsletter)
- 2-3 AI assistants (Claude, ChatGPT, Gemini, Perplexity)
- Multiple coding agents (Claude Code, Cursor, OpenCode, Codex)
- Community platforms (Discord, Slack, Reddit)
- Analytics tools (Google Analytics, BookReport, KDP reports)
- Design tools (Canva, Figma, Midjourney)
- Audio tools (Suno, ElevenLabs, Descript)
- Financial tracking (Stripe, PayPal, crypto wallets)

**No single system connects them.** The author context-switches 20+ times per day between tools that don't talk to each other.

---

## 2. The Author Command Center

### What It Is

A unified dashboard + agent orchestration layer that sits ON TOP of all existing tools. It doesn't replace Notion or Scrivener — it CONNECTS them through a single intelligence layer.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 AUTHOR COMMAND CENTER                         │
│              (Dashboard + Agent Orchestration)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ CHAMBERS  │  │  AGENTS  │  │ PUBLISH  │  │ OBSERVE  │   │
│  │          │  │          │  │          │  │          │   │
│  │ Writing  │  │ Team     │  │ Pipeline │  │ Analytics│   │
│  │ Editing  │  │ Status   │  │ Platform │  │ Community│   │
│  │ Research │  │ Tasks    │  │ Schedule │  │ Revenue  │   │
│  │ World    │  │ Memory   │  │ Formats  │  │ Feedback │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
├──────────────────── INTEGRATIONS ────────────────────────────┤
│                                                              │
│  Writing:    Notion, Obsidian, Scrivener, Word, VS Code     │
│  AI:         Claude, ChatGPT, Gemini, Perplexity            │
│  Agents:     Claude Code, OpenCode, Codex, Gemini CLI       │
│  Publish:    KDP, Apple, IngramSpark, Substack, Ghost       │
│  Social:     LinkedIn, X, Instagram, YouTube, TikTok        │
│  Design:     Canva, Figma, Midjourney, Nano Banana          │
│  Audio:      Suno, ElevenLabs, Descript                     │
│  Community:  Discord, Slack, OpenClaw/ClawHub               │
│  Analytics:  Google Analytics, BookReport, Stripe            │
│  Automation: n8n, GitHub Actions, Claude Code Hooks          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. The Four Chambers

### Chamber 1: Writing & Creation

The author's creative workspace. Not another editor — a meta-layer OVER their preferred editor.

| Feature | How It Works | Tool Integration |
|---------|-------------|-----------------|
| **Project Overview** | See all books, series, chapters at a glance | Reads from markdown files, Notion, Obsidian |
| **Word Count Dashboard** | Track daily/weekly/monthly velocity | Git commit analysis + file watcher |
| **Chapter Status Board** | Kanban: Draft → Review → Revised → Final | Syncs with Notion boards or markdown |
| **Voice Consistency** | Run /voice-check on any chapter | Claude Code Orpheus agent |
| **Canon Dashboard** | See all established facts, search semantically | memsearch-sqlite, /codex-link |
| **Character Tracker** | All characters, appearances, relationships | Character Diamond files + Mnemosyne |
| **Timeline View** | Events across all books, chronological | Extracted from manuscripts |
| **Writing Modes** | Fire/Water/Earth/Wind/Void (Arcanean) | Temperature + prompt adjustment |

**Integration with existing tools:**

| Tool | How AuthorOS Connects | What Flows |
|------|----------------------|-----------|
| **Notion** | MCP server (already configured) | Databases, pages, wikis → AuthorOS reads/writes |
| **Obsidian** | Reads .md vault directly | Notes, daily journals, character files |
| **Scrivener** | Export .scriv → markdown pipeline | Chapters, research, notes |
| **Word/DOCX** | /docx skill (bidirectional) | Track changes, comments, formatting |
| **Google Docs** | API via n8n or MCP | Collaborative editing, comments |
| **VS Code/Cursor** | Native markdown editing | Same files, different editor |
| **Medium/Substack** | API publishing via n8n | Blog posts, newsletters |

### Chamber 2: Agent Team Management

See your AI team working. Assign tasks. Review output.

| Feature | How It Works |
|---------|-------------|
| **Agent Status Board** | Which agents are active, what they're working on |
| **Task Queue** | Pending, in-progress, completed tasks per agent |
| **Memory Health** | memsearch chunk count, index freshness, search quality |
| **Quality Scores** | Anti-slop rate, canon compliance, voice consistency |
| **Cost Tracker** | API costs per agent, per model, per task |
| **Agent Selection** | Choose which coding agent handles which task |

**Multi-agent orchestration views:**

```
┌─────────────────────────────────────────────────┐
│ AGENT TEAM — Active Session                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ Claude Code (Opus)     ● ACTIVE                  │
│ └── Revising chapter 5 (structural pass)         │
│     Progress: ████████░░ 80%                     │
│     Cost: $0.12                                  │
│                                                  │
│ OpenCode (Gemini)      ● ACTIVE                  │
│ └── Drafting chapter 6 scenes 1-3                │
│     Progress: ██████░░░░ 60%                     │
│     Cost: $0.03                                  │
│                                                  │
│ Codex (GPT)            ○ IDLE                    │
│ └── Last: Research medieval siege warfare         │
│     Available for next task                      │
│                                                  │
│ Mnemosyne (Memory)     ● BACKGROUND              │
│ └── Index updated: 2,208 chunks (8 new)          │
│     Last search: "Kael's wound" (0.82 match)     │
│                                                  │
│ SHARED MEMORY: 2,208 chunks | 121 files | 29 MB │
└─────────────────────────────────────────────────┘
```

### Chamber 3: Publishing Pipeline

From manuscript to every platform.

| Stage | Tools | Automation |
|-------|-------|-----------|
| **Format** | pandoc, LaTeX, KindleGen | `publish/` scripts |
| **Cover Art** | Canva, Midjourney, Nano Banana | /forge or /generate-images |
| **Metadata** | ISBN, categories, keywords | Template + AI suggestion |
| **Upload** | KDP, Apple, IngramSpark | n8n workflows (API) |
| **Newsletter** | Substack, Ghost, ConvertKit | n8n + content cascade |
| **Social** | LinkedIn, X, Instagram | /generate-social skill |
| **Web** | arcanea.ai, Ghost blog, frankx.ai | Git push → Vercel deploy |
| **Audio** | ElevenLabs, Suno | Audio pipeline scripts |
| **Web3** | Story NFTs, world licenses | arcanea-onchain |

**Content cascade automation:**
```
New Chapter Committed
  ↓ (git hook)
  ├── Update word count dashboard
  ├── Re-index in memsearch-sqlite
  ├── Extract key quotes for social
  ├── Generate chapter illustration prompt
  └── Queue newsletter excerpt
```

### Chamber 4: Observation & Analytics

See what's happening after you publish.

| Metric | Source | Update |
|--------|--------|--------|
| **Sales** | KDP, Apple, IngramSpark reports | Daily |
| **Reviews** | Amazon, Goodreads, BookBub | Weekly |
| **Social engagement** | LinkedIn, X, Instagram analytics | Daily |
| **Newsletter** | Substack/ConvertKit metrics | Per-send |
| **Community** | Discord/Slack activity | Real-time |
| **Website** | Google Analytics, Vercel | Real-time |
| **Revenue** | Stripe, PayPal, crypto | Daily |
| **Reader Feedback** | OpenClaw/ClawHub requests | On-demand |
| **Agent Performance** | Quality scores, cost, speed | Per-session |

**Community Management via OpenClaw/ClawHub:**
- Request beta readers through human-in-the-loop platform
- Get structured feedback on specific chapters
- A/B test titles, covers, blurbs with real readers
- Track reader engagement across the series
- Agents process feedback → summarize → recommend changes

---

## 4. Tool Decision Matrix for Authors

### Writing Tools — Which to Use When

| Tool | Best For | AuthorOS Integration | IP Safety |
|------|----------|---------------------|-----------|
| **Obsidian** | World-building, research, daily notes | Direct .md vault read | Local files, you own everything |
| **Notion** | Project management, databases, collaboration | MCP server (configured) | Cloud, Notion ToS applies |
| **Scrivener** | Long-form manuscript management | Export → markdown pipeline | Local files, you own everything |
| **Word/DOCX** | Editor handoff, track changes | /docx skill bidirectional | Local files + cloud (OneDrive) |
| **Google Docs** | Real-time collaboration | API via n8n | Cloud, Google ToS applies |
| **VS Code** | Technical authors, markdown-native | Native (same files) | Local files |
| **Medium** | Blog publishing | API publish | Medium owns distribution |
| **Substack** | Newsletter + paid subscriptions | API via n8n | You own subscribers |
| **Ghost** | Self-hosted blog | API via n8n | Full ownership |

### AI Assistants — Which to Use When

| AI | Best For | Cost | Integration |
|----|----------|------|-------------|
| **Claude (chat)** | Deep reasoning, long docs, careful writing | $20/mo Pro | Copy/paste skills or Claude Projects |
| **ChatGPT** | Broad knowledge, cultural refs, plugins | $20/mo Plus | Custom GPTs with author instructions |
| **Gemini** | Multimodal (image analysis), Google integration | Free/Pro | Gemini CLI + API |
| **Perplexity** | Research, fact-checking, citations | $20/mo Pro | Research agent |

### Coding Agents — Which to Use When

| Agent | Best For | Model | Cost |
|-------|----------|-------|------|
| **Claude Code** | Deep revision, structure, complex reasoning | Opus 4.6 | Subscription |
| **OpenCode** | Multi-model creative drafting (Gemini+MiniMax) | Mixed | API costs |
| **Codex** | Research, broad knowledge, GPT integration | GPT | API costs |
| **Gemini CLI** | Image generation, visual world-building | Gemini | Free tier |
| **Cursor** | Code-heavy projects, technical authoring | Mixed | Subscription |

---

## 5. IP Protection & Security

### For Authors

| Concern | How AuthorOS Protects |
|---------|----------------------|
| **Manuscript theft** | Local-first: manuscripts stay on YOUR machine. memsearch-sqlite is LOCAL SQLite, not cloud. |
| **AI training concerns** | Use API keys with data opt-out. Claude API has data opt-out. Gemini API has data opt-out. |
| **Canon integrity** | CANON_LOCKED.md is git-tracked, tamper-evident, human-approved only |
| **Version history** | Git tracks every change, every author, every timestamp |
| **Backup** | Local → git → cloud (encrypted). You control all three layers. |
| **Copyright** | All content is yours. AuthorOS is a tool, not a platform. MIT license means no IP claims. |
| **Secrets** | Pre-commit hooks block API keys. .env files gitignored. |

### For Publishing Houses

| Concern | How AuthorOS Handles |
|---------|---------------------|
| **Multi-author access** | Git branches per author, merge via PR review |
| **Editorial workflow** | Track changes via /docx, comments, approval gates |
| **Brand consistency** | Voice fingerprint per imprint, enforced by Orpheus agent |
| **Audit trail** | Full git history + agent logs + quality gate results |
| **Scalability** | Each book = a directory. Each series = a repo. No limits. |

---

## 6. The Solo Creator Publishing House

### How One Person Operates as a Full Publishing House

```
YOU (The Creator)
├── STRATEGY
│   └── Council mode → 5 advisors debate direction
├── CREATION
│   ├── /arcanea-author inception → concept to blueprint
│   ├── /arcanea-author write → chapters with memory
│   └── /arcanea-author revise → Seven-Pass quality
├── PRODUCTION
│   ├── /publish → epub, pdf, kindle, web
│   ├── /forge → cover art, illustrations
│   └── /create-music → soundtrack per chapter
├── MARKETING
│   ├── /generate-social → platform-optimized posts
│   ├── /factory → content cascade automation
│   └── Community agents → Discord/Slack management
├── ANALYTICS
│   ├── Sales dashboards (KDP, Apple, IngramSpark)
│   ├── Engagement metrics (social, newsletter)
│   └── Agent performance (cost, quality, speed)
└── OPERATIONS
    ├── n8n workflows → automated publishing
    ├── GitHub Actions → CI/CD for books
    └── Agents → manage routine tasks autonomously
```

### The Agent Team That Runs Your Publishing House

| Agent | Role | Runs When |
|-------|------|----------|
| **Calliope** | Drafts new content | On command |
| **Orpheus** | Polishes prose, checks voice | After every draft |
| **Mnemosyne** | Maintains memory, checks continuity | Always (background) |
| **Momus** | Reviews plans and manuscripts critically | Before publishing |
| **Thoth** | Quick quality checks | Pre-commit hook |
| **Sisyphus** | Orchestrates complex multi-step tasks | On command |
| **Community Agent** | Monitors Discord/Slack, reports feedback | Scheduled (daily) |
| **Analytics Agent** | Pulls KDP/Apple/social metrics | Scheduled (daily) |
| **Newsletter Agent** | Drafts weekly newsletter from new content | Scheduled (weekly) |
| **Social Agent** | Creates platform-specific posts | On publish |

---

## 7. Where This Gets Built

### Phase 1: Author Dashboard (Next.js page on arcanea.ai)

Route: `arcanea.ai/studio/author`

Sections:
- Project overview (books, chapters, word counts)
- Agent status (active, idle, tasks)
- Memory health (chunks, index freshness)
- Quality scores (anti-slop, canon compliance)
- Recent activity feed

### Phase 2: Publishing Automation (n8n + hooks)

Workflows:
- Manuscript → format → upload → notify
- New chapter → newsletter excerpt → schedule
- Social content → resize → post → track

### Phase 3: Analytics Integration

Sources:
- KDP reports (API or scraping)
- Substack/Ghost analytics (API)
- Social platform APIs
- Stripe/PayPal (revenue tracking)

### Phase 4: Community Management

Platforms:
- OpenClaw/ClawHub for human-in-the-loop feedback
- Discord bot for community engagement
- Beta reader management pipeline

---

## 8. The frankx.ai/books + /acos System

### What Already Works

```
frankx.ai/books     → Book listings, purchase links
ACOS (/acos skill)  → Routes "write a book" to AuthorOS
SIS                  → Memory persistence across sessions
Library of Arcanea   → 200K+ words of proof content
```

### What Gets Smoother

| Current Pain | Solution |
|-------------|----------|
| Can't see all books/progress at once | Author Dashboard (arcanea.ai/studio/author) |
| Agent work is invisible | Agent Status Board with progress bars |
| No publishing automation | n8n workflows triggered by git push |
| Community feedback is manual | OpenClaw agent requests + summary |
| Can't track revenue across platforms | Unified analytics dashboard |
| Content scattered across tools | Notion MCP + Obsidian vault + memsearch = unified view |
| Social posting is manual | /generate-social + n8n auto-post |

### The Ideal Daily Flow

```
MORNING (30 min)
├── Open Author Dashboard → see overnight agent results
├── Review: agent drafted 2 chapters, social agent posted 3 times
├── Check: 14 new Discord messages (agent summarized: 3 important)
├── Decide: approve chapter drafts or request revision pass
└── Assign: "Orpheus: run prose pass on chapter 12"

CREATION TIME (2-4 hours)
├── /arcanea-author write chapter 13 --mode fire
├── Deep work, agents handle canon/continuity in background
└── /describe "the moment she realizes" → sensory expansion

AFTERNOON (30 min)
├── /arcanea-author revise chapter 12 (Orpheus finished)
├── Review quality gate: 8/9 PASS (one continuity note)
├── Fix continuity → approve → agent formats for publication
└── /generate-social "chapter 12 key moment" → scheduled

EVENING (15 min)
├── Dashboard: 3,400 words today, 67% of weekly target
├── Revenue: $127 today (KDP $89, Apple $23, Substack $15)
├── Community: 42 new followers, 3 beta reader applications
└── Agent: newsletter drafted for Thursday, awaiting approval
```

---

## 9. Multi-Agent Framework Decisions

### What We Use

| Framework | Purpose | Why |
|-----------|---------|-----|
| **Claude Code agents** | Primary creation + revision | Best reasoning, best prose |
| **OpenCode agents** | Multi-model creative routing | Gemini for images, MiniMax for voice |
| **n8n** | Workflow automation | Visual, self-hosted, 400+ integrations |
| **GitHub Actions** | CI/CD for repos | Free, integrated with git |
| **Claude Code Hooks** | Session lifecycle | Auto-capture, quality gates |
| **MCP servers** | Tool connections | Notion, Supabase, GitHub, Figma |
| **memsearch-sqlite** | Shared memory | File-based, all agents read/write |

### What We Still Need

| Need | Solution | Priority |
|------|----------|----------|
| Multi-terminal orchestrator | Central task file + shared SQLite | High |
| Visual dashboard | Next.js page on arcanea.ai | High |
| Publishing MCP | KDP/Apple/IngramSpark API | Medium |
| Audio MCP | ElevenLabs + Suno wrapper | Medium |
| Community bot | Discord bot + OpenClaw integration | Medium |
| Revenue tracker | Stripe + KDP report parser | Low |
| Mobile writing companion | arcanea-mobile integration | Low |

---

## 10. Why This Is The Best Approach

1. **Tool-agnostic**: Authors keep their favorite tools. We add intelligence on top.
2. **Local-first**: Manuscripts never leave your machine unless you choose.
3. **Agent-transparent**: See what agents do, what they cost, how they perform.
4. **Progressive**: Start with skills → add memory → add agents → add automation → add analytics.
5. **Solo-to-house**: Same system works for one creator or a 50-person publishing house.
6. **Mythology-optional**: AuthorOS works without Arcanea. Arcanea makes it magical.
