---
title: "Building a unified command center for multiple projects"
uuid: 44944e02-1f9d-4b9a-a1ee-b4564cd1aa03
created: 2026-02-03T11:54:03.935032Z
updated: 2026-02-04T00:24:06.089944Z
source: claude.ai export
---

# Building a unified command center for multiple projects

**Frank**:

Hey. I think it's a sense of that we are building up a system. That I have one central system. Maybe it's kind of you clawed, or maybe you suggest, like, set up open web UI But this is substantial. Should have a clarity on all of our projects. Cynthia, mycenia, Fragax, and all of the other ones. Each of the wreath. We have proposal for you that we have there. And, yeah, also clarity on project status, what needs to be done and when I have a voice conversation that it can create as well, either trans or directly analog. To Cloud Code or Logex. Tasks. It can be also happening through Slack or something. But I think it's essential that we're building a clean knowledge base, clean connection of the right projects with the right channels, and that the AI assistant that we talk with Yeah. One that it has a comprehensive. View about all of the repositories that we currently have in place, But at the same time, also can just focus on one particular I mentioned the name and work on it, Yeah. Also help to contribute to it. So let's review all of the potential technological set up an architecture for this. What are all of the requirements that I have. Also see all of our other chats. I we had multiple conversations about this, and we're gonna explain my requirements. And yeah. Then at the same time, we are currently seeing this new mode bot, if this might be helping in some way,

**Claude**:

Hey Frank! This is a great time to consolidate everything - you've been building towards this unified command center across multiple conversations. Let me search through our history to pull together all the requirements and architectural discussions we've had.
```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```


```
This block is not supported on your current device yet.
```

Excellent! Now I have a comprehensive picture. Let me search for one more thing - the new mode bot you mentioned:
```
This block is not supported on your current device yet.
```

Ah - you're likely referring to **Moltbot** (formerly Clawdbot) - the viral open-source personal AI assistant that just exploded in late 2025/early 2026. It's now one of the fastest-growing open-source projects on GitHub with 60,000+ stars. Key features include persistent memory stored locally as files, full system access for automation (browser control, email management, terminal commands), voice mode with ElevenLabs integration, multi-agent routing for different contexts (work vs personal), and a skills platform like "apps for your AI."

This is actually **exactly** what you've been trying to build! Let me synthesize everything:

---

## 🎯 FRANK'S UNIFIED COMMAND CENTER - REQUIREMENTS & ARCHITECTURE

Based on our 50+ conversations, here's what you actually need:

### **CORE REQUIREMENTS**

1. **Single Source of Truth** with visibility across all projects:
   - Arcanea (flagship - 80% complete)
   - FrankX.ai (personal brand hub)
   - AI Architect Academy
   - AI Music Academy
   - animelegends.ai
   - GenCreator community

2. **Voice-First Interaction** that:
   - Captures ideas via transcription
   - Creates tasks directly (Linear/Plane/GitHub)
   - Triggers Claude Code workflows
   - Creates Starlight Transmissions automatically

3. **Repository Awareness** - AI assistant knows all codebases:
   - Main Arcanea repo (Next.js, Supabase, Gemini)
   - 30+ supporting repos (need consolidation)
   - Can focus on one project when named

4. **Knowledge Base Integration**:
   - Arcanea mythology (Guardians, Godbeasts, cosmology)
   - Brand guidelines per project
   - Technical documentation
   - Decision logs

5. **Autonomous Actions**:
   - Content generation pipelines
   - Deployment triggers
   - Metrics reporting
   - Progress updates back to you (voice/Slack)

---

### **TECHNOLOGY OPTIONS COMPARISON**

| Approach | Voice | MCP Servers | Local/Privacy | Setup Time | Your Fit |
|----------|-------|-------------|---------------|------------|----------|
| **Moltbot** | ✅ ElevenLabs | ✅ Native | ✅ Self-hosted | 2-4 hours | ⭐⭐⭐⭐⭐ |
| **Open WebUI** | ⚠️ Limited | ✅ Via plugins | ✅ Self-hosted | 1-2 hours | ⭐⭐⭐ |
| **Claude.ai + MCP** | ❌ No voice | ✅ Native | ❌ Cloud | Already have | ⭐⭐⭐ |
| **n8n + Claude Code** | Via Whisper | Via webhooks | Hybrid | 4-6 hours | ⭐⭐⭐⭐ |
| **Custom Stack** | Full control | Full control | Full control | 20+ hours | ⭐⭐ |

---

### **RECOMMENDED ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRANK'S COMMAND CENTER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   MOLTBOT    │    │   CLAUDE     │    │   GROK       │       │
│  │  (Primary)   │    │   (Backup)   │    │   (Voice)    │       │
│  │  Voice + MCP │    │   Deep Work  │    │   Quick Chat │       │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘       │
│         │                   │                                    │
│         ▼                   ▼                                    │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              MCP SERVER LAYER                         │       │
│  ├──────────────┬──────────────┬──────────────┬─────────┤       │
│  │   GitHub     │   Linear/    │   Notion/    │  n8n    │       │
│  │   (Repos)    │   Plane      │   Obsidian   │  (Auto) │       │
│  └──────────────┴──────────────┴──────────────┴─────────┘       │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐             │
│         ▼                    ▼                    ▼             │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐        │
│  │  ARCANEA   │      │  FRANKX    │      │  ACADEMIES │        │
│  │  Repo/KB   │      │  Repo/KB   │      │  Repo/KB   │        │
│  └────────────┘      └────────────┘      └────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### **IMMEDIATE ACTION PLAN**

**Week 1: Foundation**
1. Set up Moltbot on your Mac/OCI instance
2. Configure GitHub MCP server (connect all repos)
3. Configure Linear/Plane MCP server for task management
4. Test voice → task creation flow

**Week 2: Knowledge Base**
1. Create unified knowledge base structure in Obsidian/Notion
2. Import all Arcanea mythology docs
3. Set up project-specific context folders
4. Connect to Moltbot for retrieval

**Week 3: Automation**
1. n8n workflows for content pipelines
2. Starlight Transmission automation (voice → formatted → GitHub → published)
3. Daily metrics dashboard
4. Slack/Discord notifications for progress

**Week 4: Polish**
1. Claude Code integration for autonomous coding
2. Cross-project awareness testing
3. Voice UX refinement
4. Documentation

---

### **YOUR CURRENT REPOSITORY STATUS (From Our Chats)**

**SHIP NOW:**
- `arcanea` - 80% complete, needs auth + testing
- `frankx.ai-vercel-website` - Live
- `claude-skills-library` - Complete

**CONSOLIDATE:**
- 8+ Arcanea-related repos → 1 monorepo
- Multiple LobeChat forks → keep 1
- Claude infrastructure repos → 1 workspace repo

**ARCHIVE:**
- 12+ abandoned repos identified

---

### **YOUR DECISION POINTS**

1. **Project Management Tool**: Linear (paid, polished, has MCP) vs Plane (free, self-hosted, has MCP) vs AFFiNE (all-in-one)?

2. **Primary Interface**: Moltbot (voice + autonomous) vs staying with Claude.ai + Grok combination?

3. **Knowledge Base**: Obsidian (local, MD) vs Notion (collaborative, databases) vs both?

4. **Hosting**: Keep everything on OCI vs Vercel/Railway for managed services?

---

Want me to:
1. **Create detailed setup guide for Moltbot** with your specific MCP configurations?
2. **Draft the repository consolidation plan** with exact commands?
3. **Build the n8n workflow templates** for your automation needs?
4. **Design the knowledge base structure** in full detail?

This is the infrastructure layer we've been circling around in all our conversations - time to actually ship it.

**Frank**:

Why not github? Do i need notion or obsidian? unified knowledge base structure in Obsidian/Notion

**Claude**:

You're right to push back on this. Let me think clearly about what you actually need.

## GitHub as the Central Knowledge Base

**Yes, GitHub can be the single source of truth.** Here's why it makes sense for you:

| Requirement | GitHub Handles It |
|-------------|-------------------|
| Markdown native | ✅ Perfect for Claude/MCP agents |
| Version controlled | ✅ Every change tracked |
| MCP server exists | ✅ Native integration |
| Claude Code access | ✅ Direct read/write |
| Public/private flexibility | ✅ Per-repo |
| Free | ✅ Unlimited private repos |
| SEO (via GitHub Pages/Vercel) | ✅ Auto-deploy docs |
| Searchable | ✅ Code search + Copilot |

**Notion/Obsidian add complexity without clear value for your use case.** You'd be syncing between systems, which creates friction and points of failure.

---

## The Simpler Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB = EVERYTHING                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  frankx-knowledge-base/          (or monorepo structure)    │
│  ├── 00-core/                                               │
│  │   ├── FRANK-CONTEXT.md                                   │
│  │   ├── BRAND-ARCHITECTURE.md                              │
│  │   └── TERMINOLOGY.md                                     │
│  ├── 01-arcanea/                                            │
│  │   ├── CODEX.md                                           │
│  │   ├── GUARDIANS.md                                       │
│  │   └── GODBEASTS.md                                       │
│  ├── 02-frankx/                                             │
│  ├── 03-ai-architect-academy/                               │
│  ├── 04-ai-music-academy/                                   │
│  ├── 05-technical/                                          │
│  │   ├── STACK.md                                           │
│  │   └── MCP-SERVERS.md                                     │
│  ├── 06-decisions/                                          │
│  │   └── 2026-01-decisions.md                               │
│  └── 07-starlight-transmissions/                            │
│      └── 2026-02-04-transmission.md                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Every AI tool you use can read/write this directly:**
- Claude (via MCP GitHub server)
- Claude Code (native filesystem)
- Moltbot (GitHub MCP)
- n8n (GitHub nodes)
- Vercel (auto-deploy for public docs)

---

## When Would You Need Notion/Obsidian?

| Tool | Only if... |
|------|------------|
| **Notion** | You need database views (Kanban, calendar, gallery) for visual project management, OR you're collaborating with non-technical people who won't use GitHub |
| **Obsidian** | You want local-first with graph visualization of connections between ideas, OR you're offline frequently |

For your current situation - solo creator building AI systems - **GitHub alone is sufficient and simpler.**

---

## The Real Question

Do you want:

**Option A: GitHub-only**
- One repo for knowledge base
- All projects reference it via MCP
- Starlight transmissions commit directly
- Zero sync complexity

**Option B: GitHub + Linear/Plane**
- GitHub for knowledge + code
- Linear/Plane for task management (better Kanban UI than GitHub Projects)
- MCP servers for both

**Option C: GitHub + Notion**
- GitHub for code + technical docs
- Notion for visual dashboards, content calendar, CRM-style databases
- More overhead but prettier views

What's your preference? I can set up whichever architecture you choose right now.
