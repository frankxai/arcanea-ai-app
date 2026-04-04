# FrankX Intelligence Architecture — Full Ecosystem Map

> The meta-system that connects all tools, data flows, intelligence layers, and workflows into one coherent machine.

**Date**: 2026-04-03
**Status**: AUDIT + BLUEPRINT

---

## 1. THE CURRENT ECOSYSTEM — What You Actually Have

### 1.1 Development & Code

| System | What It Does | Status | Connection Quality |
|--------|-------------|--------|-------------------|
| **Claude Code** (primary) | AI-powered coding, 9 MCP servers, 54+ skills, hooks | FULLY WIRED | A+ — central nervous system |
| **Vercel** | Deployment, preview, prod for arcanea.ai | LIVE | A — MCP connected via claude_ai_Vercel |
| **GitHub** (90+ repos) | Source control, issues, PRs, Actions | LIVE | A — MCP connected, but no cross-repo automation |
| **Supabase** | DB, Auth, Realtime, Edge Functions | LIVE | B+ — MCP connected, World Graph tables deployed |
| **VS Code** | Editor, arcanea-vscode extension | LIVE | B — no MCP bridge back to Claude Code |
| **Cursor / Windsurf** | Alternative AI editors | AVAILABLE | C — ACOS skills shared, no state sync |
| **Google AI Studio** | Gemini experimentation, model testing | OCCASIONAL | D — manual, no automation |
| **Coworker** (Claude companion) | Parallel Claude instance | AVAILABLE | D — no shared state with main Claude Code |

### 1.2 Knowledge & Second Brain

| System | What It Does | Status | Connection Quality |
|--------|-------------|--------|-------------------|
| **Obsidian** | Personal knowledge graph, notes, PKM | EXISTS | F — COMPLETELY DISCONNECTED |
| **Notion** | Docs, specs, project wikis | LIVE | C — MCP available but underused |
| **Linear** | Sprint tracking, issues, priorities | LIVE | B — MCP connected, but manual sync |
| **Arcanea Library** | 190K+ words, 20 collections in /book/ | LIVE | A — programmatic access via content loader |
| **SIS (Starlight)** | 5-layer cognitive arch, 6 vaults | BUILT | C — local only, SDK not published |
| **ACOS Memory** | Agent trajectories, learning loops | LIVE | B — hooks capture, but no dashboard |

### 1.3 Content & Creative

| System | What It Does | Status | Connection Quality |
|--------|-------------|--------|-------------------|
| **Suno AI** | Music generation | LIVE | B — MCP server exists |
| **ComfyUI** | Local image generation | AVAILABLE | B — MCP server exists, workflows built |
| **Canva** | Design, social media graphics | AVAILABLE | C — MCP exists, underused |
| **CapCut** | Video editing (S25 pipeline) | LIVE | D — manual, phone-only |
| **Grok AI** | Image gen + animation (S25) | LIVE | D — manual, phone-only |
| **Midjourney / DALL-E** | Image gen alternatives | OCCASIONAL | D — no automation |

### 1.4 Business & Finance

| System | What It Does | Status | Connection Quality |
|--------|-------------|--------|-------------------|
| **LemonSqueezy** | Payments (pre-BV) | PLANNED | F — not connected yet |
| **Stripe** | Future payments (post-BV) | CODE EXISTS | F — needs API keys |
| **PostHog** | Product analytics | CODE EXISTS | F — needs API key (5 min) |
| **Sentry** | Error tracking | CODE EXISTS | F — needs DSN (5 min) |
| **Vercel Analytics** | Web analytics | AVAILABLE | C — Vercel MCP can query |
| **Google Analytics** | Traffic, SEO | UNKNOWN | F — not set up |

### 1.5 Communication & Community

| System | What It Does | Status | Connection Quality |
|--------|-------------|--------|-------------------|
| **Slack** | Team comms, notifications | AVAILABLE | B — MCP connected |
| **Discord** | Community (planned) | PLANNED | F — Eliza OS designed, not deployed |
| **Gmail** | Email, notifications | AVAILABLE | C — MCP available |
| **Google Calendar** | Scheduling | AVAILABLE | C — MCP available |
| **TikTok** | Content publishing | LIVE | D — manual via S25 |

### 1.6 Automation & Orchestration

| System | What It Does | Status | Connection Quality |
|--------|-------------|--------|-------------------|
| **n8n** | Workflow automation | DESIGNED | D — not deployed |
| **Zapier** | Simple automations | AVAILABLE | C — MCP exists |
| **Claude Code Hooks** | Pre/post tool automation | LIVE | A — 5+ hooks active |
| **Arcanea-Flow** | Multi-agent swarm orchestration | ALPHA | C — local only |
| **GitHub Actions** | CI/CD | LIVE | B — basic pipelines |

---

## 2. THE WIRING GAPS — What's Not Connected

### Critical Gaps (Grade F — Zero Connection)

| Gap | Impact | Fix Time | Fix Method |
|-----|--------|----------|------------|
| **Obsidian ↔ Everything** | Second brain is an island | 2 hours | Obsidian MCP server + vault sync |
| **LemonSqueezy ↔ Vercel** | Can't take money | 1 hour | API key + webhook |
| **PostHog ↔ Vercel** | Flying blind on user behavior | 5 min | Set env var |
| **Sentry ↔ Vercel** | Can't see production errors | 5 min | Set DSN env var |
| **Google Analytics ↔ Site** | No SEO/traffic data | 15 min | GA4 tag |
| **Finance tracking** | No revenue dashboard | 2 hours | LemonSqueezy → PostHog funnel |

### Serious Gaps (Grade D — Manual Only)

| Gap | Impact | Fix Method |
|-----|--------|------------|
| **Coworker ↔ Claude Code** | Parallel work can't share state | Shared memory via SIS vaults |
| **Phone pipelines ↔ Desktop** | Content created on S25 stays on S25 | Google Drive auto-sync + n8n ingest |
| **Google AI Studio ↔ Workflow** | Gemini experiments are throwaway | API integration, not Studio UI |
| **ComfyUI ↔ Content pipeline** | Images generated but not auto-filed | n8n workflow: generate → tag → publish |

### Moderate Gaps (Grade C — Underused)

| Gap | Impact | Fix Method |
|-----|--------|------------|
| **Notion ↔ Linear** | Docs and tasks are separate | Linear-Notion sync (built into Linear) |
| **Gmail ↔ Workflows** | Email is manual | Gmail MCP for notifications + auto-drafts |
| **Calendar ↔ Planning** | Time not mapped to sprints | Google Calendar MCP for time-blocking |
| **Canva ↔ Brand** | Design not automated | Canva MCP for template-based generation |

---

## 3. SECRETS MANAGEMENT — The Current Reality

### Where Secrets Live Now
```
Location                          Risk Level    What's There
─────────────────────────────────────────────────────────────
Vercel Environment Variables      LOW           Production API keys
.env.local (gitignored)          MEDIUM         Local dev keys
Global .npmrc                     HIGH          npm auth token (in plaintext!)
GitHub Secrets                    LOW           CI/CD tokens
Supabase Dashboard               LOW           DB connection strings
Browser sessions                  MEDIUM         OAuth cookies
.arcanea/scripts/secrets/        UNKNOWN        New, unreviewed
```

### What It SHOULD Be

```
┌─────────────────────────────────────────────────┐
│           SECRETS ARCHITECTURE                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  TIER 1 — Production (Vercel Env Vars)          │
│  ├─ All API keys for arcanea.ai                 │
│  ├─ Supabase service role key                   │
│  ├─ AI provider keys (Gemini, Claude, etc.)     │
│  └─ Payment provider keys                       │
│                                                  │
│  TIER 2 — Development (1Password / Bitwarden)   │
│  ├─ Local dev .env template in 1Password        │
│  ├─ npm auth tokens                             │
│  ├─ MCP server credentials                      │
│  └─ One command: `op inject < .env.template`    │
│                                                  │
│  TIER 3 — CI/CD (GitHub Secrets)                │
│  ├─ Vercel deploy token                         │
│  ├─ npm publish token                           │
│  └─ Supabase access token                       │
│                                                  │
│  TIER 4 — Agent Access (scoped, read-only)      │
│  ├─ MCP servers get scoped tokens only          │
│  ├─ Claude Code reads from env, never files     │
│  └─ No agent can access Tier 1 directly         │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Quick Win: 1Password CLI
```bash
# Install 1Password CLI
winget install AgileBits.1Password.CLI

# Create .env from template stored in 1Password
op inject -i .env.template -o .env.local

# Rotate all tokens from one place
op item edit "Arcanea Dev Keys" --field npm_token="new-value"
```

---

## 4. THE INTELLIGENCE ARCHITECTURE — How It Should All Connect

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FRANK'S INTELLIGENCE ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─── CAPTURE LAYER ───────────────────────────────────────────┐    │
│  │ Obsidian (thoughts)  │  Claude Code (code)  │  Phone (media) │   │
│  │ Notion (docs)        │  Linear (tasks)      │  Gmail (comms)  │  │
│  │ Slack (conversations)│  Browser (research)  │  Calendar (time)│  │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌─── SYNC LAYER (the missing piece) ──────────────────────────┐   │
│  │                                                               │   │
│  │  n8n (self-hosted) — THE CENTRAL BUS                         │   │
│  │  ├─ Obsidian → SIS vault (daily sync)                        │   │
│  │  ├─ Linear → Notion (bi-directional)                         │   │
│  │  ├─ GitHub → Linear (auto-create issues from TODOs)          │   │
│  │  ├─ Gmail → Slack (filtered notifications)                   │   │
│  │  ├─ Vercel deploys → Slack (status)                          │   │
│  │  ├─ PostHog events → Notion (weekly digest)                  │   │
│  │  ├─ LemonSqueezy → Finance sheet (revenue tracking)          │   │
│  │  ├─ Sentry → Linear (auto-create bug issues)                 │   │
│  │  └─ Phone media → Google Drive → Arcanea assets              │   │
│  │                                                               │   │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌─── INTELLIGENCE LAYER ──────────────────────────────────────┐   │
│  │                                                               │   │
│  │  SIS (Starlight) — PERSISTENT MEMORY                         │   │
│  │  ├─ Vault: Canon (Arcanea lore + decisions)                  │   │
│  │  ├─ Vault: Code (architecture patterns + learnings)          │   │
│  │  ├─ Vault: Business (metrics, revenue, goals)                │   │
│  │  ├─ Vault: Creative (content ideas, drafts, feedback)        │   │
│  │  ├─ Vault: Personal (health, habits, growth)                 │   │
│  │  └─ Vault: Network (contacts, collaborators, community)      │   │
│  │                                                               │   │
│  │  ACOS — SKILL EXECUTION                                      │   │
│  │  ├─ 75+ skills, 38 agents, auto-activation                   │   │
│  │  └─ Routes tasks to right agent/model                        │   │
│  │                                                               │   │
│  │  AIOS — MYTHOLOGY ENGINE                                     │   │
│  │  ├─ 10 Guardians, canon guardrails                           │   │
│  │  └─ Routes to domain (Fire=code, Water=creative, etc.)       │   │
│  │                                                               │   │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌─── ACTION LAYER ────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  Claude Code ← MCP → GitHub, Vercel, Supabase, Linear,      │   │
│  │                       Notion, Slack, Playwright, Figma,       │   │
│  │                       ComfyUI, Suno, Canva, Gmail, Calendar   │   │
│  │                                                               │   │
│  │  Coworker ← shares SIS vaults → Parallel Claude instance     │   │
│  │                                                               │   │
│  │  Luminors ← deployed on → GPT, Gem, LobeChat, arcanea.ai    │   │
│  │                                                               │   │
│  └────────────────────────┬──────────────────────────────────────┘  │
│                            │                                         │
│                            ▼                                         │
│  ┌─── OBSERVE LAYER ───────────────────────────────────────────┐   │
│  │                                                               │   │
│  │  PostHog — user behavior, funnels, retention                  │   │
│  │  Sentry — errors, performance, releases                       │   │
│  │  Vercel Analytics — Core Web Vitals, traffic                  │   │
│  │  LemonSqueezy Dashboard — revenue, subscriptions              │   │
│  │  GitHub Insights — repo health, PR velocity                   │   │
│  │  Linear — sprint velocity, backlog health                     │   │
│  │                                                               │   │
│  │  UNIFIED DASHBOARD (n8n → Notion page or Obsidian canvas)    │   │
│  │  ├─ Daily: errors, deploys, revenue                          │   │
│  │  ├─ Weekly: velocity, retention, content performance          │   │
│  │  └─ Monthly: strategic metrics, trends, goals vs actuals      │   │
│  │                                                               │   │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. MULTI-DEVICE ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────┐
│                    DEVICE MESH                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DEV-001 (Yoga C940) — PRIMARY COMMAND CENTER                  │
│  ├─ Claude Code (5 instances max after 64GB upgrade)           │
│  ├─ VS Code + arcanea-vscode                                   │
│  ├─ Obsidian (vault synced via Git or Obsidian Sync)           │
│  ├─ ComfyUI (local GPU generation)                             │
│  ├─ n8n (self-hosted, always running)                          │
│  ├─ All MCP servers                                            │
│  └─ WSL (ComfyUI, n8n, background services)                   │
│                                                                 │
│  DEV-002 (Dell) — SECONDARY / OVERFLOW                         │
│  ├─ Claude Code (overflow tasks)                               │
│  ├─ Coworker (parallel research)                               │
│  └─ Obsidian (same vault via sync)                             │
│                                                                 │
│  MOB-003 (S25) — CONTENT CAPTURE                               │
│  ├─ Grok AI → CapCut → TikTok pipeline                        │
│  ├─ Google Drive auto-upload (camera + CapCut output)          │
│  ├─ Obsidian Mobile (quick capture)                            │
│  └─ Claude iOS (voice → task creation via Linear MCP)          │
│                                                                 │
│  CLOUD — ALWAYS-ON SERVICES                                    │
│  ├─ Vercel (arcanea.ai hosting)                                │
│  ├─ Supabase (database, auth, realtime)                        │
│  ├─ GitHub (source of truth)                                   │
│  ├─ n8n Cloud OR Railway (if local n8n unreliable)             │
│  └─ PostHog + Sentry (observability)                           │
│                                                                 │
│  SYNC FABRIC                                                    │
│  ├─ Obsidian Sync OR Git (knowledge base)                      │
│  ├─ Google Drive (media files)                                 │
│  ├─ GitHub (code, all repos)                                   │
│  ├─ SIS vaults at ~/.starlight (machine-local, git-synced)     │
│  └─ 1Password (secrets, shared across devices)                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. BUSINESS INTELLIGENCE WIRING

### Revenue Pipeline (when ready)
```
User visits arcanea.ai
  → PostHog tracks behavior (free, 1M events/month)
  → User tries Chat/Imagine (free tier)
  → User hits credit wall
  → LemonSqueezy checkout (pre-BV)
  → Webhook → n8n → Supabase credits table
  → Revenue event → PostHog (conversion tracking)
  → Daily digest → Notion "Business Dashboard" page
  → Weekly → Obsidian "Business Review" note
```

### Content Performance Pipeline
```
Publish article/creation
  → Vercel Analytics (page views)
  → PostHog (engagement, scroll depth)
  → Social shares (TikTok views, etc.)
  → n8n aggregates weekly → Notion "Content Performance"
  → Feed back into content strategy
```

### Cost Tracking
```
Monthly costs to monitor:
  ├─ Vercel ($0-20/month at current scale)
  ├─ Supabase ($0-25/month)
  ├─ AI API spend (Gemini free → Claude/GPT costs)
  ├─ Domain (~$12/year)
  ├─ LemonSqueezy (2.9% + 30¢ per transaction)
  └─ Total: Track in a simple Notion table or Google Sheet
```

---

## 7. QUICK WORKFLOWS — What You Need Daily

### Morning Startup (5 min)
```
Claude Code: /arcanea-daily
  → Reads: git status across repos
  → Reads: Linear sprint state
  → Reads: Sentry errors (once connected)
  → Reads: Vercel deploy status
  → Reads: PostHog key metrics (once connected)
  → Outputs: "Today's brief" + priority list
```

### Content Sprint
```
/create-article → draft in staging
/polish-content → FrankX voice
/generate-images → ComfyUI MCP or Canva MCP
/publish-content → publish to arcanea.ai
/generate-social → platform-optimized posts
```

### Code Sprint
```
/arcanea-dev → activate dev team
/ultracode → parallel coding agents
/arcanea-build → diagnose + fix errors
/arcanea-deploy → Vercel deployment
/arcanea-quality → comprehensive checks
```

### Weekly Review
```
/weekly-recap → generates cross-project report
  → Git activity across all repos
  → Linear velocity
  → Content published
  → Revenue (once connected)
  → Health metrics (PP audit)
```

### Capture → Process → Act (throughout day)
```
Phone: Quick note in Obsidian Mobile → syncs to vault
Desktop: Process notes in Obsidian → extract tasks → Linear
Claude Code: /superintelligence → deep strategic thinking
Evening: /session-sync → summarize + update state files
```

---

## 8. BEST OF EACH SYSTEM — What To Use For What

| Need | Best Tool | Why Not Others |
|------|-----------|---------------|
| **Strategic thinking** | Obsidian (linked notes, graph view) | Notion too structured, Linear too task-focused |
| **Project management** | Linear | Fast, keyboard-driven, developer-native |
| **Documentation** | Notion | Collaboration, templates, embeds |
| **Code** | Claude Code | 54+ skills, MCP mesh, hooks |
| **Quick tasks** | Linear | One shortcut to create |
| **Long-form writing** | Claude Code /author-team | Multi-agent prose quality |
| **Image generation** | ComfyUI (local) or Canva (quick) | Local = free + private |
| **Music** | Suno via MCP | Already integrated |
| **Deployment** | Vercel (auto) | Already wired |
| **Analytics** | PostHog | Free tier is massive, dev-friendly |
| **Errors** | Sentry | Industry standard, free tier |
| **Finance** | LemonSqueezy → Google Sheet | Simple until scale requires Stripe |
| **Automation** | n8n (self-hosted) | Free, visual, MCP-compatible |
| **Secrets** | 1Password CLI | Cross-device, one source |

---

## 9. THE 10-STEP SPRINT — Wire It All Together

### Phase 1: Observability (30 min, TODAY)
- [ ] Set Sentry DSN on Vercel (5 min)
- [ ] Set PostHog key on Vercel (5 min)
- [ ] Add GA4 tag to arcanea.ai (15 min)
- [ ] Verify all three report data (5 min)

### Phase 2: Secrets (1 hour)
- [ ] Install 1Password CLI
- [ ] Create "Arcanea Dev Keys" vault
- [ ] Migrate .npmrc token to 1Password
- [ ] Create .env.template with `op://` references
- [ ] Document in .arcanea/scripts/secrets/README.md

### Phase 3: Obsidian Bridge (2 hours)
- [ ] Install Obsidian MCP server (community or build)
- [ ] Set up vault at ~/Obsidian/Arcanea (or sync existing)
- [ ] Create sync: Obsidian daily notes → SIS capture vault
- [ ] Create sync: Linear sprint → Obsidian weekly review template
- [ ] Enable Obsidian Git plugin for cross-device sync

### Phase 4: n8n Central Bus (3 hours)
- [ ] Deploy n8n (Docker on WSL or Railway free tier)
- [ ] Workflow 1: Sentry error → Linear issue
- [ ] Workflow 2: LemonSqueezy purchase → Supabase credits
- [ ] Workflow 3: Vercel deploy → Slack notification
- [ ] Workflow 4: Weekly metrics digest → Notion page

### Phase 5: Finance Pipeline (1 hour)
- [ ] Set up LemonSqueezy account + first product
- [ ] Webhook to n8n → log to Google Sheet
- [ ] PostHog revenue tracking event

### Phase 6: Linear ↔ Notion Sync (30 min)
- [ ] Enable Linear's built-in Notion integration
- [ ] Map projects to Notion pages
- [ ] Auto-sync sprint status

### Phase 7: Phone Pipeline (1 hour)
- [ ] Google Drive auto-upload from S25
- [ ] n8n: Watch Google Drive folder → process → Arcanea assets
- [ ] Obsidian Mobile configured with same vault

### Phase 8: Coworker Shared State (1 hour)
- [ ] Publish SIS SDK to npm (or use local link)
- [ ] Share ~/.starlight vaults via git
- [ ] Both Claude Code instances read same vaults

### Phase 9: Dashboard (2 hours)
- [ ] Notion "Arcanea Command Center" page
- [ ] Embedded: Vercel status, PostHog graph, Linear sprint
- [ ] n8n populates daily/weekly sections automatically
- [ ] OR: Obsidian Canvas with live embeds

### Phase 10: Google AI Studio → API (30 min)
- [ ] Replace AI Studio manual use with Gemini API calls
- [ ] Route through Claude Code's AI model routing
- [ ] Experiments become reproducible, not throwaway

---

## 10. WHAT YOU'RE NOT USING THAT YOU SHOULD

| Tool | Why | Effort |
|------|-----|--------|
| **PostHog** | You literally have the code installed. Set one env var. | 5 min |
| **Sentry** | Same. One env var. | 5 min |
| **Gmail MCP** | Auto-draft responses, filter notifications | 10 min config |
| **Google Calendar MCP** | Time-block sprints, auto-schedule | 10 min config |
| **Canva MCP** | Generate social graphics from templates | Already connected |
| **Obsidian** | Your second brain is offline. That's a crime. | 2 hours |
| **n8n** | The glue between everything. Without it, you're the glue. | 3 hours |
| **1Password CLI** | Secrets scattered across files = breach waiting to happen | 1 hour |

---

## Summary

**Current state**: 25+ tools, 9 MCP connections, 4 intelligence systems — but the sync layer is **you manually copying between systems**.

**Target state**: n8n as central bus, Obsidian as second brain, PostHog/Sentry for visibility, 1Password for secrets, SIS for agent memory — all wired through MCP and webhooks so information flows automatically.

**Total time to wire**: ~12 hours of focused work across 10 phases.

**The payoff**: Every insight captured. Every error tracked. Every sale logged. Every agent shares memory. You stop being the router and start being the strategist.
