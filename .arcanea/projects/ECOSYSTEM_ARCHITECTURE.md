# Arcanea Ecosystem Architecture — Complete Map

> Last Updated: 2026-03-28
> Guardian: Shinkami (Source Gate)

## How Everything Connects

```
                    ┌─────────────────────────────────────────┐
                    │          arcanea.ai (PRODUCT)           │
                    │     153 pages, 98 APIs, Supabase       │
                    │        apps/web in arcanea-ai-app       │
                    └──────────────┬──────────────────────────┘
                                   │ uses
                    ┌──────────────▼──────────────────────────┐
                    │      @arcanea/* npm packages (21)       │
                    │  core, cli, auth, os, mcp-server,       │
                    │  hooks, memory, security, rituals,      │
                    │  overlays (claude/gemini/copilot/cursor) │
                    └──────────────┬──────────────────────────┘
                                   │ powered by
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌─────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│ INTELLIGENCE    │  │  AGENT HARNESSES     │  │  CONTENT/IP      │
│                 │  │                      │  │                  │
│ ACOS (v11)      │  │ claude-arcanea       │  │ /book/ (17 coll) │
│ SIS (5 layers)  │  │ oh-my-arcanea (v4)   │  │ CANON_LOCKED.md  │
│ AIOS (v0.2.2)   │  │ arcanea-code (v1.3)  │  │ Living Lore      │
│ arcanea-flow    │  │ arcanea-vscode       │  │ Academy (5 crs)  │
│                 │  │ arcanea-openclaw     │  │ arcanea-records  │
└────────┬────────┘  └──────────┬───────────┘  └────────┬─────────┘
         │                      │                       │
         └──────────────────────┼───────────────────────┘
                                │ all share
                    ┌───────────▼───────────────────────────┐
                    │     .arcanea/ (Shared Brain)          │
                    │  MASTER_PLAN.md, CANON_LOCKED.md,     │
                    │  config/, lore/, agents/, skills/,    │
                    │  projects/, prompts/                   │
                    └───────────────────────────────────────┘
```

## Layer 1: The Product (arcanea.ai)

**Repo**: `frankxai/arcanea-ai-app` (private → production)
**Deployed**: arcanea.ai via Vercel
**Stack**: Next.js 16, React 19, TypeScript, Supabase, Vercel AI SDK

This IS the product. Everything else serves this.

| Surface | What It Does | Status |
|---------|-------------|--------|
| Chat | Talk to AI (Lumina orchestrator) | LIVE |
| Imagine | Generate images (Fal.ai) | LIVE |
| Studio | Multi-mode creation (text/image/code/music/terminal) | LIVE |
| Library | 70+ sacred texts across 17 collections | LIVE |
| Academy | 5 courses, 10 gates, quizzes | LIVE |
| Community | Profiles, follows, leaderboard, discussions | LIVE (55%) |
| Forge | Create Luminors + companions | LIVE |
| Living Lore | Interactive narrative | LIVE |

## Layer 2: Agent Harnesses (how creators USE Arcanea tools)

| Harness | Repo | Command | What It Overlays | Status |
|---------|------|---------|-----------------|--------|
| **claude-arcanea** | frankxai/claude-arcanea | `carc` | Claude Code + Intelligence OS | INSTALLED, v2.0.0 |
| **oh-my-arcanea** | frankxai/oh-my-arcanea | `opencode-arcanea` | OpenCode + Guardians + Luminor swarms | INSTALLED, v4.0.0, CANONICAL |
| **arcanea-code** | frankxai/arcanea-code | `arcanea` | Full CLI (OpenCode fork) | v1.3.3, merged upstream |
| **arcanea-vscode** | frankxai/arcanea-vscode | — | VS Code (Kilo Code fork) | Published |
| **arcanea-openclaw** | frankxai/arcanea-openclaw | — | OpenClaw fork | Reference |

**Naming rule**: `arcanea-*` = own product, `*-arcanea` = overlay on host tool

## Layer 3: Intelligence Systems (the brain)

| System | Repo | npm | Status | What It Does |
|--------|------|-----|--------|-------------|
| **ACOS** | agentic-creator-os | GitHub install | OPERATIONAL | 75+ skills, 38 agents, multi-platform |
| **SIS** | Starlight-Intelligence-System | NOT PUBLISHED | Built, not shipped | 5-layer cognition, 6 vaults, persistent memory |
| **AIOS** | arcanea-intelligence-os | @arcanea/aios v0.2.2 | Partial | 10 Guardians, canon guardrails |
| **Flow** | arcanea-flow | Local | Alpha | Swarm coordination (claude-flow fork) |

**Data flow**: ACOS → SIS → AIOS → Flow → Core Packages → MCP Servers

## Layer 4: npm Package Ecosystem (21 published)

| Package | Version | Purpose |
|---------|---------|---------|
| `arcanea` | 3.4.0 | Master CLI + OSS entry point |
| `claude-arcanea` | 2.0.0 | Claude Code Intelligence OS launcher |
| `@arcanea/core` | 0.1.0 | Types, constants, Gate frequencies |
| `@arcanea/auth` | 1.0.4 | Authentication layer |
| `@arcanea/cli` | 0.7.1 | CLI framework |
| `@arcanea/os` | 0.7.0 | Operating system layer |
| `@arcanea/mcp-server` | 0.7.0 | MCP server for AI tools |
| `@arcanea/hooks` | 0.1.0 | Lifecycle hooks |
| `@arcanea/rituals` | 0.1.0 | 12 workers, ReasoningBank |
| `@arcanea/hybrid-memory` | 0.1.0 | Memory system |
| `@arcanea/security` | 0.1.0 | Security layer |
| `@arcanea/sona-learner` | 0.1.0 | Self-optimizing learning |
| `@arcanea/creative-pipeline` | 0.1.0 | Creation pipeline |
| `@arcanea/intelligence-bridge` | 0.1.0 | Hooks + SONA + memory RL |
| `@arcanea/starlight-runtime` | 0.2.0 | Starlight execution layer |
| `@arcanea/extension-core` | 0.3.1 | Extension framework |
| `@arcanea/overlay-chatgpt` | 1.2.1 | ChatGPT overlay |
| `@arcanea/overlay-copilot` | 1.2.1 | GitHub Copilot overlay |
| `@arcanea/overlay-gemini` | 1.2.1 | Gemini overlay |
| `@arcanea/overlay-claude` | 1.2.1 | Claude overlay |
| `@arcanea/overlay-cursor` | 1.2.1 | Cursor overlay |

## Layer 5: Content IP

| Collection | Location | Count |
|-----------|----------|-------|
| Library texts | /book/ (17 collections) | 70+ |
| Canon | .arcanea/lore/CANON_LOCKED.md | 1 (immutable) |
| Living Lore | /book/living-lore/ | 2 acts |
| Academy courses | apps/web/app/academy/ | 5 courses, 20+ lessons |
| Music | arcanea-records | Studio assets |
| Training data | starlight-horizon-dataset | CC-BY-SA |

## Layer 6: Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Hosting | Vercel | arcanea.ai deployment |
| Database | Supabase | PostgreSQL + Auth + Realtime |
| AI | Vercel AI SDK → Anthropic + Google + OpenAI | LLM completions |
| Images | Fal.ai | Image generation |
| Payments | Stripe | Credits system |
| Storage | Vercel Blob + Supabase Storage | User uploads |
| DNS | Vercel | arcanea.ai domain |

## Strategy Alignment Check

**Original strategy** (from memory): "Platform is 85-95% built. The gap is distribution."

**What we confirmed today**:
- Platform: 95%+ (M009 complete, M001 95%, M007 55%)
- Distribution: Still the gap — 184 repos, 40 stars, 233 npm downloads/mo
- Evidence: 15% — no error tracking, no product analytics, no AI evals
- Credibility: Missing badges, coverage, changelogs

**The strategy is correct but incomplete.** Distribution alone won't work without evidence. Nobody adopts tools they can't verify work. The order should be:

1. EVIDENCE (prove it works) → 2. CREDIBILITY (show proof) → 3. DISTRIBUTION (ship to users)
