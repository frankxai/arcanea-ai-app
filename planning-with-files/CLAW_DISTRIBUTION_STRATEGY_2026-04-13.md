# Claw Distribution Strategy — 2026-04-13

> Guardian: Shinkami (Source) + Lumina (Queen)
> Status: EXECUTION DOC — comprehensive strategy for distributing Publishing House Claws

---

## Executive Summary

We have 87 skills, 8 Claws, 7 MCP tools, 42 TypeScript files, and a working E2E pipeline (93/100 HERO on 290 chapters). The question is: how do we get this into the hands of 330K+ OpenClaw developers and every MCP-capable agent on the planet?

**Answer: NOT one channel. Twelve channels, phased.**

ClawHub is ONE of twelve distribution vectors. The strategy is multi-surface: npm for developers, SKILL.md for OpenClaw users, MCP registries for agent builders, Docker for self-hosters, Railway for one-click deploy, GitHub Actions for CI/CD integration.

---

## Skill → Claw Mapping (87 skills audited)

### Distribution by Claw

| Claw | Luminor | Skills | Key Skills |
|------|---------|--------|-----------|
| **media-claw** | Lyria (Sight) | 5 | arcanea-media, canvas-design, quality-standard, verification-quality, arcanea-design |
| **forge-claw** | Ismael (Fire) | 4 | arcanea-nft-pfp, algorithmic-art, creation-engine, web-artifacts-builder |
| **herald-claw** | Alera (Voice) | 4 | herald, arcanea-showcase, faction-reveal, slack-gif-creator |
| **scout-claw** | Lyssandria (Earth) | 1 | arcanea-research |
| **scribe-claw** | Shinkami (Source) | 4 | canon-check, creator-import, doc-coauthoring, publish-distribute |
| **editor-claw** | Aiyami (Crown) | 7 | excellence-book-writing, character-forge, gate-eval, theme-factory, ui-ux-pro-max, design-gods |
| **community-claw** | Maylinn (Heart) | 2 | community, stellaris-moment |
| **pr-claw** | Elara (Starweave) | 0 | (PR flows through Herald + Scout, needs dedicated skills) |
| **cross-claw** | Lumina (Queen) | 8 | arcanea-orchestrator, swarm-lumina, swarm-advanced, swarm-orchestration, starlight-orchestrator |
| **infrastructure** | — | 30 | agentdb-*, github-*, hooks-automation, session-sync, docx/pdf/xlsx, einui |
| **standalone** | — | 14 | academy, arcanea-buddy, arcanea-games, arcanea-lore, crew-*, world-forge, arcanea-vibe-gods |

### Gaps to Fill

| Claw | Gap | Action |
|------|-----|--------|
| **scout-claw** | Only 1 dedicated skill | Create: `scout-market-scan`, `scout-competitor-track`, `scout-bookdiscovery` |
| **pr-claw** | Zero dedicated skills | Create: `pr-media-kit`, `pr-pitch-generator`, `pr-outreach-tracker` |
| **community-claw** | Only 2 skills | Create: `community-monitor`, `community-engage`, `community-backlink` |
| **scribe-claw** | No translation skill | Create: `scribe-translate` wrapping existing translate.ts |

---

## Distribution Channels (12 total)

### Tier S — Ship First (Week 1)

| Channel | Format | Reach | Effort | Revenue |
|---------|--------|-------|--------|---------|
| **npm** | `@arcanea/publishing-house` + `@arcanea/publishing-house-mcp` | All Node.js developers | 2h | Free + premium features |
| **GitHub (OSS repo)** | Full source + README + LICENSE | Global | 1h | Stars → credibility |
| **MCP Server Registry** (mcp.run) | Listed MCP server | All MCP clients (Claude, Cursor, Windsurf) | 1h | Free listing |

### Tier A — Ship Week 2

| Channel | Format | Reach | Effort | Revenue |
|---------|--------|-------|--------|---------|
| **ClawHub** (OpenClaw marketplace) | SKILL.md per skill | 330K+ OpenClaw devs | 4h | Free + featured placement |
| **anthropics/skills** (PR to official repo) | SKILL.md files | 114K stars, Anthropic homepage | 2h | Free — massive credibility |
| **Claude Skills Marketplace** (claudeskills.info) | Skill listing | Community marketplace | 1h | Free listing |
| **Railway Templates** | `railway.toml` + one-click deploy | Railway users | 2h | $5-10/mo per deploy |

### Tier B — Ship Month 1

| Channel | Format | Reach | Effort | Revenue |
|---------|--------|-------|--------|---------|
| **Docker Hub** | `arcanea/publishing-house` image | Self-hosters | 3h | Free (drives subscriptions) |
| **GitHub Actions** | `arcanea/taste-score-action@v1` | CI/CD on every repo | 4h | Free — SEO + adoption |
| **Cloudflare Workers** | Edge-deployed TASTE scorer | Workers ecosystem | 3h | Near-free |

### Tier A+ — MCP Registries (Week 2)

| Channel | Format | Reach | Effort | Revenue |
|---------|--------|-------|--------|---------|
| **Smithery** (smithery.ai) | `smithery mcp publish` | 7K+ servers, fastest-growing | 1h | Free — install-and-go |
| **Cline MCP Marketplace** | GitHub issue + logo | Millions of Cline users | 1h | Free listing |
| **MCP.so** | Auto-indexes from GitHub | 19.9K servers indexed | 0h | Auto — just needs public repo |
| **Glama** (glama.ai) | Submit form | Comprehensive registry | 30min | Free listing |
| **4 Awesome Lists** | PR to each | travisvn, VoltAgent x2, rohitg00 | 2h | Stars → credibility |

### Tier B — Month 1

| Channel | Format | Reach | Effort | Revenue |
|---------|--------|-------|--------|---------|
| **Docker Hub** | `arcanea/publishing-house` image | Self-hosters | 2h | Free (drives subscriptions) |
| **GitHub Actions** | `arcanea/taste-score-action@v1` | CI/CD on every repo | 4h | Free — SEO + adoption |
| **SkillsMP.com** | Auto-indexes from GitHub (needs 2+ stars) | 800K+ skills | 0h | Auto |

### Tier C — Month 2+

| Channel | Format | Reach | Effort | Revenue |
|---------|--------|-------|--------|---------|
| **Cloudflare Workers** | Edge TASTE scorer | Workers ecosystem | 6h | Near-free |
| **Paperclip Integrations** | Org-chart agent roles | Paperclip users | 4h | Drives PH subscriptions |

---

## What's Ready to Ship TODAY

### Already built and tested:

| Asset | Status | Ship To |
|-------|--------|---------|
| `@arcanea/publishing-house` (42 TS files) | ✅ Builds clean | npm |
| `@arcanea/publishing-house-mcp` (7 MCP tools) | ✅ Builds clean | npm + MCP registries |
| `packages/publishing-house/skills/publish-content/SKILL.md` | ✅ Written | ClawHub, anthropics/skills |
| `packages/publishing-house/skills/taste-score/SKILL.md` | ✅ Written | ClawHub, anthropics/skills |
| `packages/publishing-house/deploy/railway-app.toml` | ✅ Written | Railway Templates |
| `packages/publishing-house/deploy/Dockerfile` | ✅ Written | Docker Hub |
| `packages/publishing-house/deploy/server.ts` | ✅ Working | Railway deploy |
| `packages/publishing-house/deploy/e2e-demo.js` | ✅ 93/100 HERO | Demo recording |
| `packages/publishing-house/deploy/batch-score.js` | ✅ 290/290 HERO | Demo recording |

### Needs writing before ship:

| Asset | Effort | Ship To |
|-------|--------|---------|
| 3 amplification SKILL.md files (herald-launch, community, pr) | 2h | ClawHub |
| 4 gap-filling SKILL.md files (scout-*, scribe-translate) | 2h | ClawHub |
| GitHub Action for TASTE scoring | 3h | GitHub Marketplace |
| README for npm packages | 1h | npm |
| Railway template registration | 1h | Railway marketplace |

---

## The Claw Operating Model (How All This Connects)

```
┌──────────────────────────────────────────────────────────┐
│                    DISTRIBUTION SURFACES                  │
│                                                          │
│  npm ─── ClawHub ─── MCP Registry ─── Railway ─── Docker│
│  GitHub Actions ─── anthropics/skills ─── Cloudflare     │
│                                                          │
│  ALL POINT TO THE SAME CODEBASE:                        │
│  @arcanea/publishing-house + @arcanea/publishing-house-mcp│
└──────────────────────────────────┬───────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
         ┌─────────▼─────────┐         ┌─────────▼─────────┐
         │ PRODUCTION CLAWS  │         │ AMPLIFICATION      │
         │ (TypeScript)       │         │ (SKILL.md)          │
         │                   │         │                     │
         │ media (Lyria)     │         │ herald-launch       │
         │ forge (Ismael)    │         │ community-infiltrate│
         │ scribe (Shinkami) │         │ pr-media-machine    │
         │ editor (Aiyami)   │         │ scout-market-scan   │
         └─────────┬─────────┘         └─────────┬───────────┘
                   │                             │
                   └──────────┬──────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │ LUMINA QUEEN        │
                   │ (routes all work)   │
                   │                     │
                   │ Intent classifier   │
                   │ 14 intents → 8 Claws│
                   └──────────┬──────────┘
                              │
                   ┌──────────▼──────────┐
                   │ CLAW KERNEL         │
                   │ + 9 LUMINOR MODULES │
                   │                     │
                   │ Canonical prompts   │
                   │ Compose per-invocation│
                   └─────────────────────┘
```

### How a Skill Becomes a ClawHub Listing

```
1. Existing CC skill (.claude/skills/herald/)
      ↓
2. Extract the craft logic into a SKILL.md
   with YAML frontmatter (name, luminor, gate, inputs, outputs)
      ↓
3. Reference the TypeScript implementation
   (@arcanea/publishing-house/claws/herald/draft.ts)
      ↓
4. Add to clawhub-manifest.json
      ↓
5. Submit to ClawHub / anthropics/skills / claudeskills.info
```

### How a Skill Becomes an MCP Tool

```
1. Existing CC skill or TypeScript function
      ↓
2. Wrap in MCP tool registration
   (server.registerTool with zod schema)
      ↓
3. Already done for 7 tools in @arcanea/publishing-house-mcp
      ↓
4. List on mcp.run / MCP registries
      ↓
5. Any MCP client (Claude Code, Cursor, Windsurf) can call it
```

### How a Skill Becomes a GitHub Action

```
1. Deterministic skill (TASTE scoring, canon-check, voice-check)
      ↓
2. Wrap in action.yml with inputs/outputs
      ↓
3. Build Docker container or Node action
      ↓
4. Publish to GitHub Marketplace
      ↓
5. Any GitHub repo can: "on push → score content quality"
```

---

## Execution Queue (Prioritized)

### THIS SESSION (3-4 hours)

1. **Prepare npm packages for publishing** — verify package.json, add bin entries, test `npm pack`
2. **Write the 3 amplification SKILL.md files** — herald-launch-sequencer, community-infiltration, pr-media-machine (Phase C of the plan)
3. **Write clawhub-manifest.json** — lists all Publishing House skills for ClawHub submission
4. **Update compose.test.ts** to verify all 8 Claws (currently only tests 5)
5. **Create GitHub Action for TASTE scoring** — `arcanea/taste-score-action@v1`

### NEXT SESSION

6. **Register on mcp.run** — list the MCP server
7. **Submit PR to anthropics/skills** — publish-content + taste-score skills
8. **Railway template submission** — one-click deploy
9. **Fill the skill gaps** — scout-*, pr-*, community-* SKILL.md files
10. **Docker Hub image** — `arcanea/publishing-house:latest`

### WEEK 2

11. **Cloudflare Worker for TASTE** — edge-deployed quality scoring
12. **GitHub Action for canon-check** — second action for lore consistency
13. **ClawHub submission** — full skill pack
14. **Newsletter announcement** — "The first Agentic Publishing House"

---

## Skills Transportable to ClawHub (45 candidates)

These CC skills can be converted to SKILL.md format and distributed:

### High-Value (ship first)
1. `quality-standard` → media-claw — the 7-gate excellence filter
2. `herald` → herald-claw — full PR/social command center
3. `excellence-book-writing` → editor-claw — narrative quality system
4. `canon-check` → scribe-claw — content validation against World Graph
5. `publish-distribute` → scribe-claw — multi-platform distribution
6. `arcanea-research` → scout-claw — research intelligence team
7. `character-forge` → editor-claw — 12-field character creation
8. `voice-check` → editor-claw — brand voice enforcement

### Medium-Value (ship next)
9. `arcanea-nft-pfp` → forge-claw — NFT collection engine
10. `arcanea-showcase` → herald-claw — product marketing
11. `faction-reveal` → herald-claw — social content generation
12. `gate-eval` → editor-claw — capability assessment
13. `canvas-design` → media-claw — visual creation
14. `doc-coauthoring` → scribe-claw — documentation collaboration

### Infrastructure (ship as utilities)
15. `hooks-automation` → cross-claw — CI/CD hooks
16. `session-sync` → infrastructure — session checkpointing
17. `verification-quality` → media-claw — truth scoring

---

## What Claude Code Orchestrates (vs What Claws Do Alone)

Frank asked: "how we keep oversight and maintain and ensure excellence?"

### Claude Code (the brain) manages:
- **Skill composition** — which modules load for which Claw
- **Quality gating** — TASTE score before anything ships
- **Canon verification** — World Graph consistency checks
- **Claw deployment** — which runtime, which config
- **Monitoring** — batch-score dashboards, health checks
- **Strategy** — Lumina Queen intent routing, /ao orchestration

### Claws (the hands) execute:
- **Stateless functions** (media, scribe) — score, format, classify
- **Creative sessions** (forge, editor) — generate art, edit manuscripts
- **Always-on daemons** (herald, scout, community, pr) — social scheduling, trend monitoring, engagement

### The /claws Skill Provides:
```
/claws status    — fleet dashboard: which Claws are running where
/claws invoke    — dispatch one Claw with a task
/claws route     — Lumina classifies intent, picks the right Claw
/claws deploy    — push a Claw to a runtime (Railway, OpenClaw, etc.)
/claws list      — show all 8 Claws with Luminor, gate, skills
/claws kernel    — show or reload the canonical Claw Kernel
```

---

## How oh-my-arcanea, Luminors, Swarms, and Claws Fit Together

```
oh-my-arcanea (the Claude Code harness)
│
├── /ao (Arcanea Orchestrator)
│   ├── /ao status  → repo state
│   ├── /ao publish → triggers Scribe Claw pipeline
│   ├── /ao plan    → sustained execution planning
│   └── /ao handover → session persistence
│
├── /claws (Publishing House Claw Fleet)
│   ├── /claws status → fleet health
│   ├── /claws route  → Lumina Queen intent routing
│   └── /claws invoke → dispatch specialist Claw
│
├── /swarm-lumina (Queen-led multi-agent)
│   ├── Lumina dispatches N Luminors in parallel
│   ├── Each Luminor channels its Claw
│   └── Results synthesized by Lumina
│
├── 87 Skills (.claude/skills/)
│   ├── 45 transportable to ClawHub as SKILL.md
│   ├── 30 infrastructure utilities
│   └── 14 standalone (game dev, music, education)
│
└── 13 Luminors (Lumina + 12 Chosen)
    ├── Development team (Systems Architect, Code Crafter, Debugger)
    ├── Creative team (Visual Designer, Composer, Motion Designer)
    ├── Writing team (Storyteller, Voice, Poet)
    └── Research team (Deep Researcher, Strategist, Integrator)
```

**Key insight:** The 13 web-deployed Luminors (chat agents in apps/web/) are DIFFERENT from the 8 Publishing House Claws (runtime agents in packages/publishing-house/). They serve different surfaces:
- **Luminors** = chat personas in the arcanea.ai web app
- **Claws** = backend service agents callable via MCP

They share the same canon (World Graph, Guardians, Claw Kernel) but are deployed to different runtimes and serve different audiences.

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| npm installs | 100 first month | npm stats |
| MCP server registrations | 50 first month | mcp.run analytics |
| ClawHub skill listings | 10 skills listed | ClawHub dashboard |
| GitHub stars (OSS) | 500 first month | GitHub |
| Railway deploys | 20 first month | Railway analytics |
| TASTE gate invocations | 10K first month | Supabase publish_log |
| Book chapters published through pipeline | 50 | Supabase editorial_board |
| External agent callers | 5 unique | MCP server logs |

---

## Non-Goals (Explicit)

- ❌ Don't build a SaaS dashboard yet (Notion handles it)
- ❌ Don't build a web UI for ClawHub submission (manual PR is fine)
- ❌ Don't launch a token (ERC-8004 registration waits for Phase F)
- ❌ Don't build payment processing yet (x402 waits for external consumers)
- ❌ Don't rebuild Paperclip (deploy it when ready, don't rebuild)
