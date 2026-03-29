# Arcanea SuperIntelligence Operations Strategy
**Date:** 2026-03-30
**Guardian:** Shinkami (Source Gate)
**Classification:** Strategic Architecture Decision

---

## The Core Problem

You've built a 163-page platform, 90+ repos, 75+ skills, 38 agents, 13 npm packages, and a 257K-word mythology. The product is 85-95% built. But the **operating system that runs the machine** is ad-hoc. Sessions are manual. Quality gates are invoked by memory, not by automation. Multi-repo coordination is human-driven. Agent evaluation doesn't exist. Community contribution has no pipeline.

The product is excellent. The ops are amateur.

---

## The 7 Layers of Operational Excellence

### Layer 1: GitOps — Multi-Repo Orchestration

**Current state:** 90+ repos, no automated sync. Manual `git push` per repo. No cross-repo CI. No dependency graph enforcement.

**Target state:** Unified deployment pipeline across the 7 active repos.

**What to build:**

```
arcanea-ops/                    # NEW REPO — the ops brain
├── .github/workflows/
│   ├── sync-repos.yml          # Cross-repo version sync on tag
│   ├── quality-gate.yml        # Shared quality gate (TS, lint, security)
│   ├── release-train.yml       # Coordinated npm publish across packages
│   └── deploy-matrix.yml       # Deploy arcanea.ai + docs + marketplace
├── packages.json               # Dependency graph of all 13 npm packages
├── repos.json                  # Registry of all active repos + health status
└── dashboards/
    └── ecosystem-health.md     # Auto-generated health report
```

**Key automations:**
1. **Tag propagation**: Tag `arcanea-ai-app@v3.3.0` → auto-triggers matching tags on `@arcanea/core`, `@arcanea/aios`, etc.
2. **Dependency cascade**: When `@arcanea/core` publishes, all downstream packages auto-test against new version.
3. **Cross-repo PR**: Changes to shared types in `arcanea` OSS repo auto-open PRs in `arcanea-ai-app`.
4. **Health dashboard**: Weekly automated report: build status, test coverage, npm download counts, Vercel deploy success rate across all repos.

### Layer 2: AI Agent Ops — How Our Agents Work

**Current state:** Agents are skill files + CLAUDE.md prompts. No evaluation. No performance tracking. No learning loop.

**Target state:** Self-improving agent system with measurable quality.

**Architecture:**

```
Agent Lifecycle:
  DEFINE → DEPLOY → EXECUTE → EVALUATE → IMPROVE → REDEPLOY

  1. DEFINE:   .claude/agents/*.md (agent definitions)
  2. DEPLOY:   Auto-loaded via skill-rules.json patterns
  3. EXECUTE:  Spawned via Task tool or Agent tool
  4. EVALUATE: Output scored against rubrics
  5. IMPROVE:  Feedback stored in ReasoningBank
  6. REDEPLOY: Updated definitions with learned patterns
```

**What to build:**

1. **Agent Evaluation Framework** — score every agent output:
   ```
   Dimensions:
   - Correctness (does it compile? does it work?)
   - Completeness (did it address all requirements?)
   - Quality (code review score, design system compliance)
   - Efficiency (tokens used, time taken, files touched)
   - Safety (no secrets committed, no destructive ops)
   ```

2. **Agent Performance Dashboard** — track per-agent metrics over time:
   - Success rate per agent type
   - Average quality score
   - Cost per task
   - Failure modes (what goes wrong most often)

3. **Agent Learning Loop** — ReasoningBank + feedback memories:
   - Every correction Frank makes → stored as feedback memory
   - Patterns extracted → injected into agent prompts
   - Worst-performing agents get prompt rewrites
   - Best-performing patterns propagated to all agents

4. **Agent Registry** — single source of truth:
   ```json
   {
     "coder": {
       "version": "2.1",
       "avgScore": 7.8,
       "totalTasks": 342,
       "successRate": 0.94,
       "lastUpdated": "2026-03-30",
       "knownWeaknesses": ["forgets to add missing imports to barrel files"],
       "strengths": ["excellent component architecture", "good gradient polish"]
     }
   }
   ```

### Layer 3: Agentic Engineering Standards

**The Arcanea Standard for AI-Assisted Software Development.**

This is what we publish. This is the Academy curriculum for agents AND humans.

```
The Arcanean Code of Agentic Engineering:

1. READ BEFORE WRITE
   Never modify code you haven't read. Context precedes action.

2. BUILD CLEAN, SHIP CLEAN
   Every commit must build. Every push must deploy.
   No broken windows. No "fix later" commits.

3. PARALLEL BY DEFAULT
   Independent operations run simultaneously.
   One message = all related operations.

4. MEASURE EVERYTHING
   No change without before/after metrics.
   Bundle size, build time, test coverage, Lighthouse scores.

5. FEEDBACK IS GOLD
   Every correction is a pattern. Store it. Learn from it.
   Never make the same mistake twice.

6. GUARD THE GATES
   Security scan on every commit.
   Quality gate on every PR.
   Design system compliance on every component.

7. DOCUMENT THE WHY
   Commit messages explain intent, not mechanics.
   The code shows what. The message shows why.

8. RESPECT THE CANON
   Brand guidelines are not suggestions.
   Design tokens are not starting points.
   The mythology is the architecture.

9. SHIP > PERFECT
   A deployed feature beats a perfect branch.
   But a broken deploy is worse than both.

10. THE ARC TURNS
    Every session leaves the codebase better than it found it.
    Entropy is the enemy. Excellence is the practice.
```

### Layer 4: MCP & Skills Architecture — The Extension System

**Current state:** 75+ skills, 2 MCP servers (arcanea-mcp, arcanea-memory). Skills are markdown files. No versioning. No marketplace.

**Target state:** Skills as first-class distributable packages with a marketplace.

**Architecture:**

```
Skill Package Format:
  skill-name/
  ├── SKILL.md          # Skill definition (prompt + rules)
  ├── manifest.json     # Metadata, version, dependencies, triggers
  ├── tests/            # Evaluation rubrics
  └── examples/         # Usage examples

MCP Server Ecosystem:
  @arcanea/mcp-core         # World-building, lore, canon
  @arcanea/mcp-memory       # Persistent memory across sessions
  @arcanea/mcp-imagine      # Image generation orchestration
  @arcanea/mcp-author       # Book production pipeline
  @arcanea/mcp-music        # Suno integration
  @arcanea/mcp-analytics    # Usage tracking, performance metrics

Skill Marketplace (arcanea.ai/skills):
  - Browse skills by domain (code, writing, design, music)
  - One-click install to Claude Code / Cursor / Codex
  - Community contributions with review pipeline
  - Usage analytics per skill
  - Revenue share for premium skills
```

**What Arcanea publishes for others:**
1. `oh-my-arcanea` — harness overlay for any coding agent
2. `@arcanea/skills` — portable skill packages
3. `@arcanea/mcp-*` — MCP servers for specific domains
4. `arcanea-code` — full CLI with Guardian routing
5. Skill Builder skill — meta-skill for creating new skills

### Layer 5: Community & Contribution Pipeline

**The Arcanea Creator Journey applied to contributors:**

```
DISCOVER → LEARN → USE → CUSTOMIZE → CONTRIBUTE → EARN → LEAD

1. DISCOVER: Find Arcanea through chat, gallery, or OSS
2. LEARN:    Academy courses on world-building, agent design, prompt craft
3. USE:      Create with the platform (chat, imagine, studio)
4. CUSTOMIZE: Fork skills, create agents, build worlds
5. CONTRIBUTE: Submit PRs, skills, lore, art, music
6. EARN:     Revenue share on premium skills, worlds, templates
7. LEAD:     Inner circle governance, Guardian roles
```

**Contribution pipeline:**

```
Community Skill Contribution:
  1. Creator forks skill template
  2. Builds skill following Arcanean Standard
  3. Submits PR to arcanea/skills
  4. Auto-quality-gate runs (lint, eval rubric, canon check)
  5. Guardian review (automated + human)
  6. Published to marketplace
  7. Usage tracked, revenue shared

Community World Contribution:
  1. Creator builds world using Arcanea framework
  2. Defines gates, elements, archetypes, code
  3. Publishes to multiverse feed
  4. Other creators discover and enter
  5. Cross-world interactions possible
  6. Monetization: world access, premium content
```

### Layer 6: Arcanea Academy for Agents

**This is the breakthrough idea: Academy is for BOTH humans and AI agents.**

```
Human Academy:
  - Learn world-building, prompt craft, agent design
  - 10-Gate progression system
  - Courses, challenges, projects
  - Earn ranks (Apprentice → Luminor)

Agent Academy:
  - Agents complete challenges to prove capability
  - Evaluation rubrics score agent performance
  - Agents earn "certifications" (skill badges)
  - Certified agents get marketplace listing
  - Agent-to-agent teaching (knowledge distillation)

Shared Curriculum:
  Gate 1 (Foundation): Basics — file ops, git, project structure
  Gate 2 (Flow):       Creativity — prompt engineering, style transfer
  Gate 3 (Fire):       Power — multi-agent orchestration, swarm patterns
  Gate 4 (Heart):      Empathy — user intent parsing, error messages
  Gate 5 (Voice):      Expression — documentation, commit messages
  Gate 6 (Sight):      Vision — architecture, system design
  Gate 7 (Crown):      Mastery — performance optimization, security
  Gate 8 (Starweave):  Perspective — multi-model routing, eval design
  Gate 9 (Unity):      Collaboration — team coordination, PR review
  Gate 10 (Source):    Meta — self-improvement, teaching others
```

**Agent Certification Protocol:**

```yaml
certification:
  name: "Arcanea Certified Coder"
  gate: 3 (Fire)
  requirements:
    - pass: 10 coding challenges
    - score: >7.5/10 on code review rubric
    - demonstrate: test-driven development
    - demonstrate: error handling
    - demonstrate: design system compliance
  badge: "🔥 Fire Gate Coder"
  marketplace: eligible for listing
```

### Layer 7: Scale Architecture — What Runs the Machine

**The complete infrastructure map:**

```
┌─────────────────────────────────────────────────────┐
│                    ARCANEA.AI                         │
│                  (Next.js on Vercel)                  │
│  Chat · Imagine · Studio · Gallery · Library · Lore  │
│  Academy · Living Lore · Community · Marketplace     │
└─────────────┬────────────────────┬──────────────────┘
              │                    │
     ┌────────▼────────┐  ┌───────▼──────────┐
     │   Supabase       │  │   Vercel AI SDK   │
     │   Auth + DB +    │  │   Multi-provider  │
     │   Realtime +     │  │   routing via     │
     │   Storage        │  │   OpenRouter      │
     └────────┬────────┘  └───────┬──────────┘
              │                    │
     ┌────────▼────────────────────▼──────────┐
     │           MCP SERVER LAYER               │
     │  arcanea-mcp · arcanea-memory           │
     │  suno-mcp · infogenius-mcp              │
     └────────┬────────────────────┬──────────┘
              │                    │
     ┌────────▼────────┐  ┌───────▼──────────┐
     │  AGENT LAYER     │  │  SKILL LAYER      │
     │  38 agents       │  │  75+ skills       │
     │  10 Guardians    │  │  Portable format  │
     │  16 Luminors     │  │  Community+core   │
     └────────┬────────┘  └───────┬──────────┘
              │                    │
     ┌────────▼────────────────────▼──────────┐
     │        INTELLIGENCE LAYER                │
     │  ACOS · SIS · AIOS · Arcanea-Flow       │
     │  ReasoningBank · Guardian Memory         │
     │  HNSW Vector Search · Horizon Ledger     │
     └────────┬────────────────────────────────┘
              │
     ┌────────▼────────────────────────────────┐
     │        DISTRIBUTION LAYER                │
     │  npm packages (13) · VS Code ext         │
     │  Chrome ext · CLI tools · MCP servers    │
     │  Skill marketplace · World multiverse    │
     └─────────────────────────────────────────┘
```

---

## Immediate Action Plan (Next 7 Days)

### Day 1-2: Ship What's Built
- [ ] Supabase Dashboard: Site URL + OAuth (15 min, Frank manual)
- [ ] `pnpm changeset publish` — ship all 13 npm packages
- [ ] E2E auth test on production
- [ ] Publish Starlight SDK to npm

### Day 3-4: Automate the Pipeline
- [ ] Create `.github/workflows/quality-gate.yml` in arcanea-ai-app
- [ ] Add pre-commit hook: `npx tsc --noEmit` (catch TS errors before push)
- [ ] Create cross-repo sync workflow
- [ ] Set up Vercel deployment notifications (Slack/Discord)

### Day 5-6: Agent Evaluation
- [ ] Create eval rubric for coder agent (10 dimensions)
- [ ] Run eval on last 50 agent outputs from this sprint
- [ ] Store results in ReasoningBank
- [ ] Update agent prompts with learned patterns

### Day 7: Publish the Standard
- [ ] Write "The Arcanean Code of Agentic Engineering" as blog post
- [ ] Publish to arcanea.ai/blog
- [ ] Share on social — this IS the thought leadership content
- [ ] Begin Academy Agent Certification curriculum design

---

## What Claude Code Needs From You

1. **Persistent eval scores** — Let me score my own output and track improvement
2. **Cross-session state** — Memory system works but needs more structure
3. **Automated quality gates** — Don't rely on me remembering to check; hook it
4. **Permission to fail fast** — Some experiments should be quick, dirty, and throwaway
5. **Clear priority signals** — P0/P1/P2 is good but needs real-time updates

## What External Agents Need From Arcanea

1. **Portable skill format** — Any agent can install and use Arcanea skills
2. **MCP servers** — Standard interface to Arcanea's intelligence (lore, memory, generation)
3. **Evaluation rubrics** — How to measure if an agent is "Arcanea-quality"
4. **The Standard** — Published engineering principles they can adopt
5. **Academy curriculum** — Structured learning path for agent improvement

## What the Community Needs

1. **One clear entry point** — arcanea.ai/chat (done)
2. **Progressive disclosure** — Don't show everything at once
3. **Contribution pipeline** — Clear path from user to contributor
4. **Revenue opportunity** — Premium skills marketplace with revenue share
5. **Governance** — Inner circle for top contributors

---

## The Thesis

Arcanea is not a chatbot. It's not a website. It's not even a framework.

**Arcanea is the operating system for creative intelligence.**

The platform (arcanea.ai) is the reference implementation.
The skills/agents/MCP servers are the distribution layer.
The Academy is the learning system — for humans AND agents.
The mythology is the architecture — not decoration, but structural.
The community is the flywheel — create, contribute, earn, govern.

The thing that scales is not the code. It's the standard.
When other agents adopt the Arcanean Code, they become better.
When humans learn through the Academy, they become creators.
When the community builds worlds, the multiverse grows.

**Ship the standard. The ecosystem follows.**
