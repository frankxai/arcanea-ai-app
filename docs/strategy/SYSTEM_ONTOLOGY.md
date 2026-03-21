# Arcanea System Ontology — Full Graph

> Complete map of everything installed, where it lives, what talks to what, and what needs fixing.
> Generated: 2026-03-20

---

## Hardware

```
┌──────────────────────────────────────────────────────────┐
│ LAPTOP: Intel i7-9750H @ 2.60GHz                        │
│ RAM: 16 GB                                               │
│ GPU: NVIDIA GTX 1650 Max-Q + Intel UHD 630              │
│ DISK C: 476 GB (46 GB free — 90% FULL!)                 │
│ DISK G: 476 GB (43 GB free — 91% FULL!)                 │
│ OS: Windows 11 Home 10.0.26200                          │
└──────────────────────────────────────────────────────────┘
```

**CRITICAL**: Both disks are ~90% full. This affects build performance, Docker viability, and WSL storage.

---

## Operating Systems Layer

```
┌─────────────────────────────────────────────┐
│              WINDOWS 11 HOME                 │
│  Shell: Git Bash (primary), PowerShell, CMD │
│                                              │
│  ┌──────────────────────┐  ┌──────────────┐ │
│  │   WSL2: Ubuntu       │  │ WSL2: Podman │ │
│  │   State: Running     │  │ State: Stopped│ │
│  │   Node: v18.19.1     │  │ (unused)     │ │
│  │   Claude: NOT HERE   │  │              │ │
│  └──────────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────┘
```

---

## Tool Inventory — Windows (Git Bash PATH)

### Installed & Working
| Tool | Version | Purpose | Notes |
|------|---------|---------|-------|
| **Node.js** | v24.8.0 | JavaScript runtime | Current |
| **npm** | v11.6.1 | Package manager | Has .npmrc conflict |
| **pnpm** | v8.15.0 | Monorepo package manager | Used by Arcanea |
| **Python** | 3.13.7 | Scripting, media tools | |
| **Git** | 2.53.0 | Version control | |
| **GitHub CLI** | 2.85.0 | GitHub operations | |
| **Vercel CLI** | 42.2.0 | Deployment | |
| **VS Code** | 1.109.5 | IDE | 39 extensions |
| **Chocolatey** | 0.11.3 | Windows package manager | |
| **winget** | 1.28.220 | Windows package manager | |

### Installed but BROKEN
| Tool | Issue | Fix |
|------|-------|-----|
| **claude-code** (npm global) | This is a FAKE — custom OpenRouter CLI v1.0.0 from Jan 2025, NOT Anthropic's Claude Code | `npm uninstall -g claude-code && npm install -g @anthropic-ai/claude-code` |
| **Cursor** | Cursor.exe not found at expected path | Reinstall or update Cursor |
| **Podman WSL** | Machine exists but stopped, podman not in PATH | Start or remove |

### NOT Installed (should be)
| Tool | Why Needed | Install |
|------|-----------|---------|
| **Docker Desktop** | n8n, containers, dev environments | `winget install Docker.DockerDesktop` |
| **Bun** | Fast JS runtime, used by some packages | `winget install Oven-sh.Bun` |
| **Supabase CLI** | Local dev, migrations | `npm install -g supabase` |
| **Turbo** | Build orchestration | `npm install -g turbo` |

### NOT Installed (optional)
| Tool | Use Case | Decision |
|------|----------|----------|
| **Ollama** | Local LLMs | Skippable — 16GB RAM is tight |
| **Go** | Backend tools | Not needed for current stack |
| **Rust/Cargo** | WASM, performance tools | Only if building WASM agents |
| **Java** | Not needed | Skip |

---

## Tool Inventory — WSL Ubuntu

| Tool | Version | Status |
|------|---------|--------|
| **Node.js** | v18.19.1 | OUTDATED — needs v22+ |
| **npm** | (old) | Works but limited |
| **Python3** | Installed | Works |
| **Git** | Installed | Works |
| **Claude Code** | NOT INSTALLED | Needs `sudo npm i -g @anthropic-ai/claude-code` |
| **Docker** | NOT INSTALLED | Not available |
| **Podman** | NOT INSTALLED | Separate WSL distro exists but unused |

---

## NPM Global Packages — Windows

| Package | Version | Status |
|---------|---------|--------|
| `@arcanea/mcp-server` | 0.3.0 | Linked to monorepo |
| `@bigcookie/mcp-nano-banana-image` | 1.2.0 | Image gen MCP |
| `@nanana-ai/mcp-server-nano-banana` | 0.1.2 | Nano Banana MCP |
| `@openai/codex` | 0.92.0 | OpenAI Codex CLI |
| `@sanity/cli` | 3.80.1 | Sanity CMS |
| `@willh/nano-banana-mcp` | - | Nano Banana variant |
| `arcanea-intelligence-os` | 0.2.2 | Linked to monorepo |
| `claude-arcanea` | 0.2.2 | Linked to monorepo |
| **`claude-code`** | **1.0.0** | **WRONG PACKAGE — OpenRouter CLI, not Anthropic** |
| `eas-cli` | 16.31.0 | Expo Application Services |
| `nano-banana-mcp` | 1.0.3 | Yet another Nano Banana |
| `npm` | 11.6.1 | npm itself |
| `pnpm` | 10.11.0 | Also global (dual with 8.15.0?) |
| `vercel` | 42.2.0 | Vercel CLI |
| `yarn` | 1.22.22 | Yarn Classic |

**Cleanup needed**: 3 Nano Banana variants, fake claude-code, dual pnpm versions

---

## VS Code Extensions (39)

### AI & Agent
- `anthropic.claude-code` — Claude Code (THIS is the real one, running as VS Code extension)
- `github.copilot-chat` — GitHub Copilot
- `continue.continue` — Continue AI
- `openai.chatgpt` — OpenAI ChatGPT
- `kilocode.kilo-code` — Kilo Code
- `coderabbit.coderabbit-vscode` — CodeRabbit

### Arcanea
- `frankxai.arcanea-vscode` — Custom Arcanea extension

### Development
- `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode` — Code quality
- `ms-python.*` — Python support
- `ms-toolsai.jupyter*` — Jupyter notebooks
- `ms-azuretools.vscode-docker`, `ms-azuretools.vscode-containers` — Docker
- `ms-kubernetes-tools.vscode-kubernetes-tools` — K8s
- `bierner.markdown-*` (7 extensions) — Markdown suite
- `codacy-app.codacy` — Code analysis

### Remote
- `ms-vscode-remote.remote-containers` — Dev containers
- `github.remotehub`, `github.codespaces` — Remote repos
- `ms-vscode.remote-repositories`, `ms-vscode.azure-repos` — Azure repos

---

## Project Directory Structure

```
C:\Users\frank\
├── Arcanea/                    ← MAIN PROJECT (monorepo)
│   ├── apps/
│   │   ├── web/                ← Next.js 16 main app (arcanea.ai)
│   │   └── premium-web/        ← Premium tier
│   ├── packages/ (40)
│   │   ├── ai-core/            ← AI abstraction layer
│   │   ├── ai-provider/        ← Provider routing
│   │   ├── agent-bus/          ← Inter-agent communication
│   │   ├── agentdb/            ← Agent memory database
│   │   ├── arcanea-mcp/        ← MCP server (local)
│   │   ├── arcanea-hooks/      ← Lifecycle hooks
│   │   ├── arcanea-security/   ← Security layer
│   │   ├── auth/               ← Authentication
│   │   ├── chrome-extension/   ← Browser extension
│   │   ├── cli/                ← Arcanea CLI
│   │   ├── content-api/        ← Content management
│   │   ├── core/               ← Core framework
│   │   ├── council/            ← AI council system
│   │   ├── creative-pipeline/  ← Content generation
│   │   ├── database/           ← Database layer
│   │   ├── flow-engine/        ← Workflow engine
│   │   ├── guardian-evolution/  ← Guardian progression
│   │   ├── guardian-memory/     ← Guardian state
│   │   ├── hybrid-memory/      ← Memory system
│   │   ├── intelligence-bridge/ ← AI integration
│   │   ├── media/              ← Media handling
│   │   ├── memory-mcp/         ← Memory MCP server
│   │   ├── memory-system/      ← Memory abstraction
│   │   ├── os/                 ← Arcanea OS
│   │   ├── overlay-*/          ← 5 IDE overlays
│   │   ├── prompt-books/       ← Prompt templates
│   │   ├── rituals/            ← Daily rituals
│   │   ├── skill-registry/     ← Skill management
│   │   ├── sona-learner/       ← Learning system
│   │   ├── starlight-runtime/  ← Starlight engine
│   │   ├── swarm-coordinator/  ← Multi-agent swarm
│   │   ├── token-optimizer/    ← Token efficiency
│   │   └── vscode/             ← VS Code extension
│   ├── arcanea-*/  (17 sub-projects)
│   │   ├── arcanea-agents/
│   │   ├── arcanea-claw/       ← Media pipeline
│   │   ├── arcanea-companion/  ← Companion app (Next.js)
│   │   ├── arcanea-ecosystem/
│   │   ├── arcanea-flow/
│   │   ├── arcanea-game-development/
│   │   ├── arcanea-infogenius/ ← Knowledge system
│   │   ├── arcanea-library-superintelligence/
│   │   ├── arcanea-lore/       ← Lore system
│   │   ├── arcanea-luminor/    ← Luminor engine
│   │   ├── arcanea-mobile/     ← React Native app
│   │   ├── arcanea-onchain/    ← Web3/blockchain
│   │   ├── arcanea-opencode/   ← OpenCode integration
│   │   ├── arcanea-records/    ← Music/records
│   │   ├── arcanea-skills-opensource/
│   │   └── arcanea-soul/       ← Soul system
│   ├── book/                   ← Library of Arcanea (17 collections)
│   ├── .arcanea/               ← Config, lore, agents, workflows
│   ├── .claude/                ← Claude Code config (70+ dirs)
│   └── ... (configs, scripts, docs)
│
├── FrankX/                     ← Personal brand
│   ├── ai-architect-academy/
│   ├── content/
│   └── frankx/
│
├── Starlight-Intelligence-System/ ← Intelligence framework
│   ├── agents/, commands/, core/
│   ├── hooks/, integrations/
│   └── memory/
│
├── Serenia/                    ← Related project
├── CascadeProjects/            ← Sanity CMS project
├── Development/                ← General dev
└── claude-code/                ← FAKE claude-code (OpenRouter CLI)
```

---

## Cloud Services & Integrations

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUD LAYER                               │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Vercel  │  │ Supabase │  │  GitHub  │  │  Linear  │       │
│  │ Deploy   │  │ DB/Auth  │  │ Code/PRs │  │  Tasks   │       │
│  │ arcanea  │  │ hcfhyss  │  │ FrankX   │  │ Sprints  │       │
│  │ .ai      │  │ dzphuda  │  │ repos    │  │          │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │              │              │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐       │
│  │  Notion  │  │  Figma   │  │  Slack   │  │  Canva   │       │
│  │  Docs    │  │  Design  │  │  Comms   │  │  Design  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Anthropic│  │  Google  │  │  OpenAI  │                      │
│  │ Claude   │  │  Gemini  │  │  GPT/    │                      │
│  │ API      │  │  API     │  │  Codex   │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## MCP Server Graph

```
                    ┌─────────────────┐
                    │   CLAUDE CODE   │
                    │  (VS Code ext)  │
                    └────────┬────────┘
                             │ MCP Protocol
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
    │ Remote  │        │  Local  │        │  NPX    │
    │ (HTTP)  │        │ (Node)  │        │(spawned)│
    └────┬────┘        └────┬────┘        └────┬────┘
         │                  │                   │
   ┌─────┼─────┐      ┌────┼────┐        ┌────┼────┐
   │     │     │      │         │        │    │    │
 Figma Notion Linear  arcanea  arcanea  next  GH  Play-
 (mcp  (mcp   (mcp   -mcp     -memory  dev   MCP  wright
 .fig  .not   .lin   (local)  (local)  tools
 ma.)  ion.)  ear.)
   │     │     │      │         │        │    │    │
   │     │     │      │         │        │    │    │
   ▼     ▼     ▼      ▼         ▼        ▼    ▼    ▼
 Figma Notion Linear  Canon    Vault   Next  Git  Browser
 Cloud Cloud  Cloud   System   Memory  .js   Hub  Auto
                                App
   +
 Supabase (mcp.supabase.com)
   │
   ▼
 PostgreSQL + Auth + Storage + Realtime
```

---

## Data Flow Architecture

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  Frank  │────▶│  Claude  │────▶│  Code    │
│ (human) │     │   Code   │     │ Changes  │
└─────────┘     └────┬─────┘     └────┬─────┘
                     │                 │
              ┌──────▼──────┐   ┌─────▼──────┐
              │  MCP Tools  │   │    Git      │
              │ (9 servers) │   │  Commit     │
              └──────┬──────┘   └─────┬──────┘
                     │                 │
         ┌───────────┼─────┐    ┌─────▼──────┐
         ▼           ▼     ▼    │   GitHub   │
      Supabase    Figma  Notion │   Push     │
      (data)     (design)(docs) └─────┬──────┘
                                      │
                               ┌──────▼──────┐
                               │   Vercel    │
                               │   Deploy    │
                               └──────┬──────┘
                                      │
                               ┌──────▼──────┐
                               │  arcanea.ai │
                               │   (LIVE)    │
                               └─────────────┘

  ══════════════════════════════════════════
  MISSING AUTOMATION LAYER (n8n not running)
  ══════════════════════════════════════════

  GitHub ──webhook──▶ n8n ──▶ Lighthouse
  Vercel ──webhook──▶ n8n ──▶ Slack alert
  Linear ──webhook──▶ n8n ──▶ MASTER_PLAN
  Content ─trigger──▶ n8n ──▶ Social posts
```

---

## Critical Decisions

### 1. Ubuntu WSL — Keep or Drop?

**RECOMMENDATION: KEEP but minimize usage**

| Factor | Assessment |
|--------|-----------|
| Disk space | WSL uses virtual disk on C: — you're at 46 GB free, tight |
| RAM | 16 GB total — WSL takes 2-4 GB when running |
| Use case | Mainly for Docker/containers and Linux-native tools |
| Alternative | Windows native Node v24 works fine for most tasks |

**Decision**: Keep Ubuntu for Docker only. Do ALL Claude Code work from Windows/Git Bash or VS Code extension. Don't duplicate tools in WSL.

### 2. Docker vs Podman

**RECOMMENDATION: Docker Desktop**

| Factor | Docker | Podman |
|--------|--------|--------|
| WSL integration | Native, excellent | Has own WSL distro (you already have `podman-machine-default`) |
| n8n support | Official images | Works but less documented |
| Disk usage | ~2-3 GB | ~2-3 GB |
| RAM usage | 2-4 GB | Similar |
| Windows support | Docker Desktop (GUI) | Podman Desktop |
| Community | Larger, more tutorials | Growing |
| Your setup | `/c/Program Files/Docker/` EXISTS (partially installed) | WSL distro exists but stopped |

You already have Docker partially installed. Podman machine exists but never configured. **Stick with Docker** — less friction, better n8n support. Remove the podman WSL distro to save space.

```bash
# Clean up podman WSL distro (saves disk)
wsl --unregister podman-machine-default
```

### 3. Why Claude Code Wasn't Working

**Root cause found**: You have TWO things called "claude-code":

1. **`claude-code` npm global** (at `C:\Users\frank\AppData\Roaming\npm\node_modules\claude-code\`) — This is a **FAKE/custom package** from Jan 2025 that talks to OpenRouter. It's NOT Anthropic's Claude Code. That's why `claude` command fails.

2. **Anthropic's Claude Code** — Installed as VS Code extension (`anthropic.claude-code`), working perfectly. But never installed as a CLI tool.

**Fix**:
```bash
# Remove the fake one
npm uninstall -g claude-code

# Install the real one
npm install -g @anthropic-ai/claude-code

# Verify
claude --version
# Should show: Claude Code vX.X.X (Anthropic)
```

### 4. OpenCode Status

OpenCode (`arcanea-opencode/`) exists as a sub-project in the monorepo but was **never installed globally**. It's a local project, not a CLI tool.

---

## Storage Crisis & Cleanup Plan

**Both drives at ~90% full.** This is the #1 systemic risk.

### Immediate Space Recovery
| Action | Est. Savings |
|--------|-------------|
| `npm cache clean --force` | 1-5 GB |
| Clear `node_modules` in unused sub-projects | 5-10 GB |
| `wsl --unregister podman-machine-default` | 1-3 GB |
| Clean Windows temp files | 2-5 GB |
| Remove `claude-code` fake package + demo.gif (11MB) | 11 MB |
| Clean `.next` build caches | 1-2 GB |

```bash
# Run these on Windows:
npm cache clean --force
# Remove node_modules from sub-projects not actively built:
rm -rf arcanea-companion/node_modules
rm -rf arcanea-mobile/node_modules
rm -rf arcanea-onchain/node_modules
rm -rf arcanea-game-development/node_modules
# Clear temp
powershell.exe -Command "Remove-Item $env:TEMP\* -Recurse -Force -ErrorAction SilentlyContinue"
```

### Long-term: Move to External/Cloud
- Move `G:` overflow projects to cloud storage
- Consider GitHub Codespaces for heavy builds (saves local disk + RAM)
- Use Vercel remote builds instead of local builds

---

## Recommended Architecture (Target State)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRANK'S WORKSTATION                       │
│                                                              │
│  ┌─────────────────────────────┐  ┌───────────────────────┐ │
│  │      VS Code / Claude       │  │     Terminal          │ │
│  │   (PRIMARY WORKSPACE)       │  │   (Git Bash)          │ │
│  │                             │  │                       │ │
│  │  Claude Code extension ✓    │  │  git, npm, vercel,    │ │
│  │  9 MCP servers ✓            │  │  gh, pnpm             │ │
│  │  60+ skills ✓               │  │                       │ │
│  │  Copilot ✓                  │  │  claude CLI (NEW)     │ │
│  │  Arcanea extension ✓       │  │                       │ │
│  └─────────────────────────────┘  └───────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────┐                            │
│  │      WSL Ubuntu             │                            │
│  │   (CONTAINERS ONLY)         │                            │
│  │                             │                            │
│  │  Docker Engine              │                            │
│  │  └── n8n container          │                            │
│  │  └── (future containers)    │                            │
│  │                             │                            │
│  │  Node v22 (for builds)      │                            │
│  └─────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │  GitHub  │  │  Vercel  │  │ Supabase │
   │          │◀─│          │  │          │
   └──────────┘  └──────────┘  └──────────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
                 ┌──────▼──────┐
                 │    n8n      │
                 │ (automation)│
                 └──────┬──────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
          Linear     Slack     Notion
```

---

## Execution Checklist

### Phase 1: Fix (Today)
- [ ] Uninstall fake claude-code: `npm uninstall -g claude-code`
- [ ] Install real Claude Code CLI: `npm install -g @anthropic-ai/claude-code`
- [ ] Remove podman WSL distro: `wsl --unregister podman-machine-default`
- [ ] Clean npm cache: `npm cache clean --force`
- [ ] Clean unused node_modules (5+ sub-projects)

### Phase 2: Set Up (This Week)
- [ ] Install/configure Docker Desktop
- [ ] Run n8n in Docker container
- [ ] Import quality-gate workflow into n8n
- [ ] Update Node in WSL to v22
- [ ] Fix or remove hook scripts from settings

### Phase 3: Optimize (This Month)
- [ ] Wire Vercel → n8n webhooks
- [ ] Wire GitHub → n8n webhooks
- [ ] Create deploy monitoring workflow
- [ ] Clean up 3 redundant Nano Banana npm packages
- [ ] Evaluate GitHub Codespaces for heavy builds
- [ ] Disk cleanup — target 100 GB free on C:

---

*System ontology generated 2026-03-20. Update when major changes occur.*
