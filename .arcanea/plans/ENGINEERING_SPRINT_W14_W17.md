# Arcanea Agent Ecosystem — 4-Week Engineering Sprint

> **Goal**: Build the unified Agent Ecosystem (AgentHub + SkillHub + Library + Orchestrator + Gaming)
> **Sprint**: W14-W17 (April 1 — April 25, 2026)
> **Status**: Planning Complete — Ready to Execute
> **Source**: `.arcanea/strategy/AGENT_ECOSYSTEM_ARCHITECTURE.md`
> **Guardian**: Shinkami (Source Gate)
> **Connects to**: `task_plan.md` (Grimoire/Sessions/AIS — runs in parallel)

---

## What Already Exists (Don't Rebuild)

| Asset | Location | Status |
|-------|----------|--------|
| Agent registry (38 agents) | `apps/web/lib/agents/agent-registry.ts` | LIVE |
| Agent marketplace types | `apps/web/lib/agents/marketplace/types.ts` | LIVE |
| Skill manifest schema | `apps/web/lib/agents/certification/skill-manifest.ts` | LIVE |
| Skill tree + AgentHub page | `apps/web/app/agents/hub/` | JUST SHIPPED |
| GlowCard component | `apps/web/components/saga/glow-card.tsx` | LIVE |
| Credit ledger | Supabase `credit_ledger` table | LIVE |
| arcanea-orchestrator | `arcanea-orchestrator/` | BUILT (412 files) |
| MCP server | `packages/arcanea-mcp/` | LIVE |
| 67 Claude Code skills | `.claude/skills/` | LIVE |
| 28 OSS skills | `oss/skills/` | LIVE |
| 5 AI tool overlays | `packages/overlay-*` | BUILT |
| Library (1.1M words) | `book/` | LIVE |
| Supabase Auth + RLS | 10 migrations | LIVE |

**Principle: Wire what exists. Build only what's missing.**

---

## Week 1: AgentHub Foundation (April 1-4)

### Day 1 — Agent Manifest Schema + 5 Reference Agents

**Morning: Create the manifest package**
```
NEW: packages/arcanea-agent-manifest/
  ├── package.json
  ├── src/
  │   ├── types.ts          — AgentManifest interface (from architecture doc)
  │   ├── schema.ts         — JSON Schema for validation
  │   ├── validator.ts      — validate(manifest) → ValidationResult
  │   └── generator.ts      — generateToolConfig(manifest, tool) → config file
  └── tsconfig.json
```

**Afternoon: Create 5 official agents**
```
NEW: agents/
  ├── foundation/kael-architect/arcanea-agent.json
  ├── fire/ash-reviewer/arcanea-agent.json
  ├── flow/mira-designer/arcanea-agent.json
  ├── void/kessa-researcher/arcanea-agent.json
  └── heart/elio-documenter/arcanea-agent.json
```

Each agent manifest:
- Full `arcanea-agent.json` per architecture spec
- Personality voice from their Chronicle character
- Skills array mapping to real existing skills
- Lore references to actual book chapters
- Tool compatibility (Claude Code + Cursor + Codex)

**End of Day 1 Checkpoint:**
- [ ] `npx tsx packages/arcanea-agent-manifest/src/validator.ts agents/fire/ash-reviewer/arcanea-agent.json` passes
- [ ] All 5 manifests valid
- [ ] Types exported and importable

---

### Day 2 — Agent Install CLI

**The CLI flow:**
```bash
npx arcanea install agent ash-reviewer
# → Downloads manifest
# → Generates .claude/agents/ash-reviewer.agent.md
# → Generates .cursorrules addition
# → Registers in .arcanea/installed-agents.json
# → Prints: "🔥 Ash (Fire Gate, Master) installed. /review to activate."

npx arcanea list agents
# → Shows installed agents with Gate colors

npx arcanea remove agent ash-reviewer
# → Cleans all generated files
```

**Implementation:**
```
EDIT: packages/arcanea-cli/src/commands/agent-install.ts   (or create if CLI is oh-my-arcanea)
EDIT: packages/arcanea-cli/src/commands/agent-list.ts
EDIT: packages/arcanea-cli/src/commands/agent-remove.ts
NEW:  packages/arcanea-agent-manifest/src/tool-generators/
  ├── claude-code.ts     — generates .agent.md from manifest
  ├── cursor.ts          — generates .cursorrules block
  ├── codex.ts           — generates .codex/agents/*.md
  └── index.ts           — router by tool name
```

**End of Day 2 Checkpoint:**
- [ ] `npx arcanea install agent ash-reviewer` works end-to-end
- [ ] Generated `.claude/agents/ash-reviewer.agent.md` is valid
- [ ] `npx arcanea list agents` shows installed agents
- [ ] `npx arcanea remove agent ash-reviewer` cleans up

---

### Day 3 — Agent API Routes

**4 routes connecting frontend ↔ Supabase:**
```
NEW: apps/web/app/api/agents/hub/route.ts
  GET — List agents with filters (gate, tier, category, search)
  Returns: AgentManifest[] with computed stats

NEW: apps/web/app/api/agents/hub/[id]/route.ts
  GET — Single agent detail with full manifest + stats + reviews

NEW: apps/web/app/api/agents/hub/install/route.ts
  POST — Track install (auth required), increment counter
  Body: { agentId, tool }

NEW: apps/web/app/api/agents/hub/rate/route.ts
  POST — Rate agent 1-5 (auth required)
  Body: { agentId, rating, review? }
```

**Database migration:**
```sql
-- 20260401000001_agent_hub.sql
CREATE TABLE public.agent_manifests (
  id TEXT PRIMARY KEY,
  manifest JSONB NOT NULL,
  author_id UUID REFERENCES auth.users,
  gate TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,
  installs INTEGER DEFAULT 0,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.agent_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_id TEXT REFERENCES public.agent_manifests NOT NULL,
  tool TEXT NOT NULL,
  installed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, agent_id, tool)
);

CREATE TABLE public.agent_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_id TEXT REFERENCES public.agent_manifests NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- RLS
ALTER TABLE public.agent_manifests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agents are publicly readable" ON public.agent_manifests FOR SELECT USING (true);
CREATE POLICY "Authors can update own agents" ON public.agent_manifests FOR UPDATE USING (auth.uid() = author_id);
```

**End of Day 3 Checkpoint:**
- [ ] All 4 API routes respond correctly
- [ ] Migration applied to Supabase
- [ ] 5 official agents seeded in database
- [ ] `GET /api/agents/hub?gate=Fire` returns Fire agents

---

### Day 4 — Wire Skill Tree to Real Data + Polish

**Connect the dots:**
```
EDIT: apps/web/app/agents/hub/page.tsx
  — Fetch agents from /api/agents/hub instead of static data
  — Wire skill tree nodes to matching agents
  — Add click-to-install modal (copy CLI command)

EDIT: apps/web/components/agents/skill-tree.tsx
  — Add agent count badges per Gate branch
  — Wire click handler to open agent detail
  — Add "Install" CTA in skill detail panel

NEW: apps/web/components/agents/agent-detail-modal.tsx
  — Full agent profile: name, Guardian, skills, lore refs, install buttons
  — "Related Lore" section linking to /books chapters
  — Install buttons per tool (Claude Code / Cursor / Codex)
```

**End of Day 4 Checkpoint:**
- [ ] Skill tree shows real agent counts
- [ ] Click agent → detail modal with install flow
- [ ] "Related Lore" links resolve to actual /books chapters
- [ ] Build passes, push to production
- [ ] arcanea.ai/agents/hub shows live data

---

## Week 2: SkillHub + Security (April 7-11)

### Day 5 — Skill Manifest v2
- [ ] Extend `skill-manifest.ts` with Gate affinity, tier, lore refs
- [ ] Script to migrate 67 existing skills to v2 format
- [ ] Each skill assigned to a Gate based on domain analysis

### Day 6 — Security Sandbox
- [ ] Layer 1: Automated regex scanner for injection patterns
- [ ] Layer 2: Sandbox executor (run skill in isolated context)
- [ ] Layer 3: Human review queue with Supabase table

### Day 7 — SkillHub Page
- [ ] `/skills` page with Gate-organized browser
- [ ] Skill cards with GlowCard, tier badges, Gate colors
- [ ] Search + filter + one-click install

### Day 8 — Creator Tiers + Submission
- [ ] Creator tier system (Community → Verified → Guardian)
- [ ] `/skills/submit` page with guided wizard
- [ ] GitHub PR template for community submissions

### Day 9 — Library ↔ Skills/Agents Cross-Link
- [ ] `/api/library/context` — relevant lore for any skill/agent
- [ ] "Related Lore" sections on all detail pages
- [ ] Reading progress → skill tree node unlocks (gamification)

---

## Week 3: Orchestrator + Gaming (April 14-18)

### Orchestrator Dashboard
- [ ] `/orchestrator` page with real-time task board
- [ ] Agent status cards with Gate colors
- [ ] Multi-tool coordination view (Claude Code / Cursor / Codex)
- [ ] Task history with credits consumed

### Gaming Swarm MVP
- [ ] 6-agent gaming team definitions
- [ ] `/gaming` page with mod generation wizard
- [ ] Skyrim mod output: dialogue, scripts, textures
- [ ] Mod preview + download flow

---

## Week 4: Revenue + Community (April 21-25)

### Mana Credits Economy
- [ ] Agent usage → credit deduction
- [ ] Creator revenue splits (70/30, 80/20 for Guardians)
- [ ] Stripe credit purchase integration
- [ ] Autonomous agent API key billing

### Community Self-Hosting
- [ ] `docker-compose.yml` for self-hosted hub
- [ ] Community governance roles
- [ ] Season 1: "The Kindling" content plan

---

## Parallel Tracks (Other Agents Handle)

These run alongside this sprint but are owned by other Claude Code/Codex instances:

| Track | Owner | Status |
|-------|-------|--------|
| Grimoire product pipeline | Other CC instance | In progress (task_plan.md) |
| Lore writing (Below the Ley, Kindled) | This session's writing agents | Continuous |
| Ops/DevOps (CI, monitoring) | Codex instance | Active |
| arcanea-orchestrator core | Separate repo | Built, needs dashboard |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Supabase OAuth not configured | High | Blocks install tracking | Can ship with anonymous tracking first |
| npm publish blocked | Medium | Blocks CLI distribution | Use npx with GitHub registry instead |
| Other agents conflict on same files | Medium | Merge conflicts | Stay in `/agents/hub`, `/skills`, `/api/agents/hub` namespace |
| Skill security not tight enough | Low | Malicious skills | Conservative: manual review only until Layer 1+2 proven |
| Scope creep into Gaming | High | Delays AgentHub | Gaming is Week 3 ONLY if Weeks 1-2 ship |

---

## Decisions Log

| Decision | Why | Date |
|----------|-----|------|
| Wire existing assets, don't rebuild | 42 packages already exist | 2026-03-31 |
| `/agents/hub` as new route (not replace `/agents`) | Other agent built Grimoire at `/agents` | 2026-03-31 |
| Agent manifest as JSON (not YAML) | JSON Schema validation, programmatic generation | 2026-03-31 |
| 5 official agents named after Chronicle characters | Strongest possible reference implementation | 2026-03-31 |
| Skyrim perk tree already shipped | Visual is done, now wire to real data | 2026-03-31 |

---

## How to Start

```bash
# Day 1, Morning:
mkdir -p packages/arcanea-agent-manifest/src
# Create types.ts, schema.ts, validator.ts
# Then create 5 reference agent manifests

# Day 1, Afternoon:
mkdir -p agents/foundation/kael-architect
mkdir -p agents/fire/ash-reviewer
mkdir -p agents/flow/mira-designer
mkdir -p agents/void/kessa-researcher
mkdir -p agents/heart/elio-documenter
# Write arcanea-agent.json for each
```

---

*"The ecosystem is not five separate products. It is one platform with five faces."*
