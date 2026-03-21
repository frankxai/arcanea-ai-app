# Arcanea Workflow Optimization Strategy

> How Frank works with Claude Code, Terminal, n8n, and the full tool ecosystem — optimized for speed, quality, and creative output.

---

## Current State Assessment

### What's Working
- **Claude Code (Windows/Git Bash)**: Fully functional, 9 MCP servers connected
- **Vercel Deployment**: Live at arcanea.ai, builds passing
- **60+ Skills**: Rich slash command ecosystem
- **MASTER_PLAN.md**: Strong central orchestration
- **Canon System**: CANON_LOCKED.md prevents lore drift
- **Model Routing**: Opus/Sonnet/Haiku/Gemini adaptive routing configured

### What's Broken or Underused
- **WSL/Ubuntu**: Claude Code not installed (fix: `sudo npm i -g @anthropic-ai/claude-code`)
- **n8n Workflows**: 6 workflows defined but no live instance running
- **Hook Scripts**: Referenced in settings but scripts missing from filesystem
- **Memory Vault**: `.arcanea/starlight-vault/` status unclear
- **40+ packages**: Many packages exist but build/test coverage unclear

---

## Strategy: 4 Pillars

### Pillar 1: Terminal Power — Fix & Optimize

**Goal**: Claude Code works everywhere — Windows, WSL, and remote.

#### Immediate Fixes
```bash
# In WSL Ubuntu:
sudo npm install -g @anthropic-ai/claude-code
# OR use npx alias:
echo 'alias claude="npx -y @anthropic-ai/claude-code"' >> ~/.bashrc

# Update Node in WSL (v18 → v22+):
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fix WSL networking (when it breaks):
# From PowerShell: wsl --shutdown
# Then reopen terminal
```

#### Terminal Workflow
| Task | Where | Why |
|------|-------|-----|
| Code changes, PRs | Claude Code (Windows) | Full MCP access, Vercel deploy |
| Long-running builds | WSL Ubuntu | Better process management |
| Docker/containers | WSL Ubuntu | Native Linux containers |
| Quick file ops | Either | Both work |

#### Power Aliases (add to Windows `.bashrc` or WSL `.bashrc`)
```bash
# Arcanea shortcuts
alias arc="cd /c/Users/frank/Arcanea"
alias arcdev="cd /c/Users/frank/Arcanea && npm run dev"
alias arcbuild="cd /c/Users/frank/Arcanea && npm run build"
alias arcdeploy="cd /c/Users/frank/Arcanea && vercel --prod"
alias arcstatus="git status && echo '---' && cat .arcanea/MASTER_PLAN.md | head -50"
```

---

### Pillar 2: n8n Automation — The Invisible Workforce

**Goal**: n8n handles repetitive workflows so Claude Code focuses on creative/complex work.

#### Setup Options (pick one)
| Option | Pros | Cons |
|--------|------|------|
| **n8n Cloud** (n8n.io) | Zero maintenance, always on | Monthly cost (~$20) |
| **Docker in WSL** | Free, local control | Needs WSL running |
| **Railway/Render** | Cheap, always on | Slight latency |

#### Recommended: Docker in WSL
```bash
# In WSL:
docker run -d --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=frank \
  -e N8N_BASIC_AUTH_PASSWORD=<your-password> \
  n8nio/n8n
```

#### Priority Workflows to Activate

**1. Quality Gate (`.arcanea/n8n/quality-gate.json`)**
- Trigger: Before any Vercel deploy
- Steps: Lint → Type check → Build → Lighthouse → Deploy
- Benefit: Never ship broken code

**2. Content Cascade (`.arcanea/n8n/content-cascade.json`)**
- Trigger: New Library text merged to main
- Steps: Index in Supabase → Generate social cards → Update sitemap → Notify
- Benefit: Content automatically propagates everywhere

**3. Daily Arcanea Cycle (`.arcanea/n8n/daily-arcanea-cycle.json`)**
- Trigger: Cron (e.g., 9am daily)
- Steps: Check Linear → Summarize priorities → Post to Slack/Notion → Prepare today's focus
- Benefit: Start each day with clarity

**4. Publish Manuscript (`.arcanea/n8n/publish-manuscript.json`)**
- Trigger: Manual or tag push
- Steps: Build book → Generate PDF/EPUB → Upload to stores → Update catalog
- Benefit: One-click publishing

**5. NEW: Deploy Monitor**
- Trigger: Vercel webhook (deploy complete)
- Steps: Run Lighthouse → Screenshot key pages → Compare to baseline → Alert on regression
- Benefit: Catch visual/perf regressions automatically

**6. NEW: GitHub → Linear Sync**
- Trigger: GitHub issue created/updated
- Steps: Mirror to Linear → Assign Guardian → Track in MASTER_PLAN
- Benefit: Single source of truth for tasks

---

### Pillar 3: Claude Code Mastery — Work Smarter

**Goal**: Use Claude Code's full power — agents, hooks, skills, MCP servers.

#### A. Session Protocol
Every session should follow:
```
1. /arcanea-daily          → Get oriented (priorities, blockers)
2. Work on highest priority → Use MASTER_PLAN.md queue
3. /arcanea-quality        → Verify before deploy
4. Update MASTER_PLAN.md   → Track progress
```

#### B. Parallel Agent Strategy
For complex features, spawn agents in parallel:
```
Message 1: "Build the Academy quiz system"
→ Agent 1 (coder): Build quiz component
→ Agent 2 (coder): Build API route
→ Agent 3 (tester): Write tests
→ Agent 4 (researcher): Check canon for quiz content
All spawn in ONE message, all run in background
```

#### C. MCP Server Usage Map
| Server | When to Use | Key Commands |
|--------|-------------|--------------|
| **GitHub** | PRs, issues, code search | `mcp__github__create_pull_request` |
| **Supabase** | DB queries, auth, storage | Direct SQL, RLS policies |
| **Figma** | Design reference, specs | `mcp__figma__get_design_context` |
| **Linear** | Sprint tracking | `mcp__linear__list_issues` |
| **Notion** | Long-form docs, specs | `mcp__notion__search` |
| **Vercel** | Deploy, logs, domains | `mcp__vercel__deploy_to_vercel` |
| **Playwright** | E2E testing | Browser automation |
| **Canva** | Social graphics, designs | Generate/export designs |
| **Slack** | Team comms, alerts | Send notifications |

#### D. Skill Combos (Power Moves)
| Goal | Skills to Chain |
|------|----------------|
| Ship a feature | `/arcanea-dev` → `/arcanea-test` → `/arcanea-deploy` |
| Write lore | `/arcanea-lore` → `/voice-check` → `/arcanea-quality` |
| Design page | `/arcanea-design` → `/component-forge` → `/design-review` |
| Plan sprint | `/plan-week` → `/arcanea-daily` → track in Linear |
| Create content | `/creative-master` → `/polish-content` → `/generate-social` |
| Debug issue | `/debug` → `/arcanea-test` → `/arcanea-build` |

#### E. Fix Missing Hooks
The settings reference hook scripts that don't exist. Either create them or remove from settings:

**Essential hooks to create:**
1. `session-start.sh` — Load MASTER_PLAN priorities, check git status
2. `pre-tool.sh` — Validate file paths, prevent root saves
3. `session-end.sh` — Update progress.md, remind to commit

**Remove if not needed:**
- model-route.sh (complex, better handled by CLAUDE.md instructions)
- context-tracker.sh (nice-to-have, not essential)

---

### Pillar 4: Integration Architecture — Everything Talks

**Goal**: Claude Code, n8n, Vercel, Supabase, Linear, and Slack form a connected system.

#### The Flow
```
                    ┌─────────────┐
                    │  CLAUDE CODE │ ← You work here
                    │  (Windows)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  GitHub   │ │  Vercel  │ │ Supabase │
        │  (code)   │ │ (deploy) │ │  (data)  │
        └─────┬────┘ └─────┬────┘ └─────┬────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │    n8n      │ ← Automation layer
                    │  (Docker)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Linear  │ │  Slack   │ │  Notion  │
        │ (tasks)  │ │ (alerts) │ │  (docs)  │
        └──────────┘ └──────────┘ └──────────┘
```

#### Webhook Chain
1. **Git push** → GitHub webhook → n8n → trigger Vercel deploy
2. **Vercel deploy** → webhook → n8n → run Lighthouse → post to Slack
3. **Linear issue updated** → webhook → n8n → update MASTER_PLAN.md
4. **New Library content** → n8n → index in Supabase → generate social → post

#### API Keys Needed (store in n8n credentials, NOT in code)
- Vercel token
- Supabase service key
- Linear API key
- Slack bot token
- GitHub token (already in MCP)
- Anthropic API key (for n8n AI nodes)

---

## Priority Execution Order

### This Week
1. **Install Claude Code in WSL** — `sudo npm i -g @anthropic-ai/claude-code`
2. **Update WSL Node** — v18 → v22
3. **Set up n8n in Docker** — One command, immediate value
4. **Import quality-gate.json** — First automated workflow
5. **Fix or remove broken hooks** — Clean up settings.local.json

### Next Week
6. **Import remaining n8n workflows** — content-cascade, daily-cycle
7. **Create session-start hook** — Auto-load priorities
8. **Set up Vercel → n8n webhook** — Deploy monitoring
9. **Create deploy-monitor n8n workflow** — Lighthouse + screenshots

### This Month
10. **Linear → MASTER_PLAN sync** — Automated task tracking
11. **Content pipeline** — Library text → Supabase → Social → Publish
12. **Health dashboard** — n8n workflow checking all systems

---

## Daily Workflow (Target State)

```
Morning:
  1. Open Claude Code in Arcanea directory
  2. /arcanea-daily → See priorities (auto-pulled from Linear/MASTER_PLAN)
  3. Pick highest priority task

Working:
  4. Use parallel agents for complex features
  5. /arcanea-test after each feature
  6. /arcanea-quality before any deploy
  7. n8n handles deploy monitoring in background

Evening:
  8. Update MASTER_PLAN.md with progress
  9. n8n evening-learning-cycle runs automatically
  10. Commit and push → n8n handles the rest
```

---

## Metrics to Track

| Metric | Tool | Target |
|--------|------|--------|
| Deploy frequency | Vercel + n8n | 1-2/day |
| Build success rate | n8n quality gate | >95% |
| Lighthouse score | n8n monitor | >90 all categories |
| Tasks completed/week | Linear | Track trend |
| Library texts published | Supabase | 2-3/week |
| Canon consistency | /voice-check | 100% alignment |

---

*Strategy created 2026-03-20. Review and update monthly.*
