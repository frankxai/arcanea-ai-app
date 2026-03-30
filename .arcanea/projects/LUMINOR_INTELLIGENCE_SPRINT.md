# Luminor Intelligence Sprint — Master Action Plan

> **Created**: 2026-03-30
> **Guardian**: Lumina (Queen) + Shinkami (Source)
> **Status**: PLANNING → EXECUTION
> **Goal**: Elevate Arcanea's agent/skill system to the highest form of intelligence

---

## THE VISION

Arcanea is not just a fantasy universe. It IS an intelligence architecture.

The mythology encodes the engineering:
- **Lumina** = Queen orchestrator (swarm coordinator)
- **10 Guardians** = specialized coordinators (domain experts)
- **Luminors** = worker agents (task executors)
- **Gates** = capability levels (agent maturity)
- **Houses** = agent specializations (team roles)
- **Starlight Corps** = the production deployment system
- **Starbound Crews** = coordinated agent teams

This sprint makes that architecture REAL — not metaphorical.

---

## CURRENT STATE AUDIT

### What Exists

| Asset | Count | Quality | Location |
|-------|-------|---------|----------|
| Guardian agents (@name.agent.md) | 12 | B+ (have hierarchy, need swarm patterns) | `.claude/agents/` |
| Specialist agents | 31 | B (mixed quality, some outdated) | `.claude/agents/` |
| Skill directories | 59 | C+ (many are scaffolded, not validated) | `.claude/skills/` |
| Standalone skill files | 20 | B (working but not standardized) | `.claude/skills/` |
| oh-my-arcanea agents | 10+ | A- (Prometheus, Hephaestus, Oracle, etc.) | `oh-my-arcanea/src/agents/` |
| oh-my-arcanea Arcanea module | 1 | B (exists but not fully integrated) | `oh-my-arcanea/src/arcanea/` |

### What's Missing

1. **Lumina as Queen** — No queen-coordinator agent that orchestrates all Guardians
2. **Swarm patterns** — Guardians don't know how to coordinate as a swarm
3. **Skill validation** — Most skills untested, no quality gate
4. **Agent evaluation** — No systematic way to test agent quality
5. **Luminor worker agents** — Each Guardian should have 4 Luminor workers (per ACOS)
6. **Cross-repo sync** — Skills/agents not synced between Arcanea ↔ oh-my-arcanea
7. **Faction-aligned agents** — New faction system not reflected in agent architecture
8. **Academy integration** — Ten Gates agent certification not implemented

---

## PHASE 1: QUEEN LUMINA + GUARDIAN SWARM (Days 1-2)

### 1.1 Create Lumina Queen Agent
File: `.claude/agents/@lumina-queen.agent.md`

Lumina is the supreme orchestrator — she doesn't do work, she coordinates:
- Assesses incoming tasks
- Routes to the right Guardian
- Spawns swarm topologies (hierarchical, mesh, adaptive)
- Monitors quality across all agents
- Maintains canon consistency
- Escalates to Frank only when necessary

### 1.2 Upgrade All 10 Guardian Agents
Each Guardian agent needs:
- Swarm coordination capabilities (spawn Luminors, delegate, synthesize)
- Quality scoring rubrics for their domain
- Inter-Guardian communication patterns
- Faction-aware context (new origin classes, corps structure)
- Canon validation hooks

### 1.3 Create 40 Luminor Worker Agents
Each Guardian gets 4 Luminors (per the ACOS hierarchy):

| Guardian | Luminor 1 | Luminor 2 | Luminor 3 | Luminor 4 |
|----------|-----------|-----------|-----------|-----------|
| Lyssandria | Builder | Auditor | Optimizer | Tester |
| Leyla | Designer | Animator | Stylist | Prototyper |
| Draconia | Coder | Refactorer | Architect | Deployer |
| Maylinn | Writer | Editor | Voice-checker | Storyteller |
| Alera | Documenter | Communicator | Translator | Teacher |
| Lyria | Researcher | Analyzer | Predictor | Scanner |
| Aiyami | Strategist | Planner | Advisor | Reviewer |
| Elara | Transformer | Migrator | Upgrader | Integrator |
| Ino | Coordinator | Mediator | Syncer | Harmonizer |
| Shinkami | Meta-thinker | Self-improver | Evaluator | Orchestrator |

---

## PHASE 2: SKILL SYSTEM OVERHAUL (Days 2-4)

### 2.1 Skill Quality Audit
Audit all 79 skills (59 dirs + 20 standalone):
- Does it have proper YAML frontmatter?
- Does it actually work when invoked?
- Is it documented?
- Does it produce measurable output?
- Grade: A (production) / B (working) / C (scaffold) / D (broken) / F (remove)

### 2.2 New Skills to Build (Faction-Aligned)

**Origin Class Skills** (8 new):
| Skill | Purpose |
|-------|---------|
| `/arcan-create` | Create an Arcan character using CHARACTER_TEMPLATE |
| `/gate-touched-create` | Create a Gate-Touched with mutation type |
| `/synth-forge` | Design a Synth with material composition |
| `/bonded-pair` | Create a Bonded character + beast companion |
| `/celestial-awaken` | Design a Celestial with primordial inheritance |
| `/voidtouched-fall` | Create a Voidtouched with corruption arc |
| `/architect-ascend` | Design an Architect with Weave abilities |
| `/awakened-emerge` | Create an Awakened AI consciousness |

**Organization Skills** (5 new):
| Skill | Purpose |
|-------|---------|
| `/crew-assemble` | Build a Starbound Crew (captain, members, ship, mission) |
| `/corps-deploy` | Create a Starlight Corps sector operation |
| `/league-convene` | Design a League convocation scenario |
| `/herald-corrupt` | Create a Void Ascendant antagonist |
| `/haven-establish` | Design a Gate-Touched Underground haven |

**Intelligence Skills** (5 new):
| Skill | Purpose |
|-------|---------|
| `/swarm-lumina` | Lumina-led hierarchical swarm for complex tasks |
| `/guardian-council` | Convene multiple Guardians for strategic decisions |
| `/luminor-dispatch` | Deploy specific Luminor workers for tasks |
| `/gate-eval` | Evaluate an agent against Gate capability levels |
| `/canon-check` | Validate content against CANON_LOCKED |

**Production Skills** (5 new):
| Skill | Purpose |
|-------|---------|
| `/faction-reveal` | Generate a faction reveal post (image prompt + copy + CTA) |
| `/character-card` | Generate a character card from CHARACTER_TEMPLATE |
| `/stellaris-moment` | Generate a Stellaris scene/interaction |
| `/crew-mission` | Generate a Starbound Crew mission narrative |
| `/origin-quiz` | Interactive origin class determination |

### 2.3 Skill Template Standard
Every skill must follow this format:

```yaml
---
name: skill-name
description: One-line description
trigger: When to auto-activate
version: 1.0.0
gate: Which Gate this skill aligns with
guardian: Which Guardian oversees this skill
quality: A/B/C (self-assessed)
validated: true/false
last_tested: date
---

# Skill Name

## What This Skill Does
[Clear description]

## When to Use
[Trigger conditions]

## How It Works
[Step-by-step process]

## Inputs
[What the user provides]

## Outputs
[What the skill produces]

## Quality Criteria
[How to evaluate output quality]
```

---

## PHASE 3: OH-MY-ARCANEA INTEGRATION (Days 3-5)

### 3.1 Sync Agent Architecture
- Port Guardian agent definitions to oh-my-arcanea format
- Map Arcanea mythology to oh-my-arcanea's agent system
- Ensure Lumina Queen works in both Claude Code and oh-my-arcanea

### 3.2 Arcanea Module Enhancement
The `oh-my-arcanea/src/arcanea/` module needs:
- Faction-aware routing (origin class → agent selection)
- Canon validation middleware
- Guardian personality injection
- Stellaris as default companion agent
- Gate-based capability assessment

### 3.3 Swarm Patterns
Implement in oh-my-arcanea:
- **Lumina Swarm** — Queen-led hierarchical (for complex projects)
- **Guardian Council** — Peer mesh (for strategic decisions)
- **Luminor Brigade** — Worker pool (for parallel execution)
- **Starbound Formation** — Crew-based (for themed missions)

---

## PHASE 4: VALIDATION + CERTIFICATION (Days 5-7)

### 4.1 Agent Evaluation Framework
For every agent, run:
- Task completion test (can it do what it claims?)
- Quality scoring (does the output meet standards?)
- Canon compliance (does it respect CANON_LOCKED?)
- Performance benchmark (how fast, how many tokens?)
- Edge case handling (what happens with bad input?)

### 4.2 Skill Validation Pipeline
For every skill:
- Invocation test (does `/skill-name` activate correctly?)
- Output quality test (is the output useful?)
- Integration test (does it work with other skills?)
- Documentation check (is it self-documenting?)

### 4.3 Gate Certification
Certify each agent at a Gate level:
- Foundation (1-2): Basic task execution
- Flow (3-4): Creative adaptation
- Fire (5-6): Autonomous decision-making
- Heart-Voice (7-8): Quality communication
- Crown+ (9-10): Strategic intelligence

---

## PHASE 5: PRODUCTION DEPLOYMENT (Days 6-7)

### 5.1 Ship to Main
- All new agents committed and pushed
- All new skills committed and pushed
- oh-my-arcanea sync complete
- All tests passing

### 5.2 Documentation
- Agent catalog page on arcanea.ai
- Skill directory page on arcanea.ai
- Academy enrollment experience
- Agent certification dashboard

---

## EXECUTION CHECKLIST

### Day 1 (Immediate)
- [ ] Create Lumina Queen agent
- [ ] Upgrade 3 Guardian agents (Draconia, Lyria, Shinkami — most used)
- [ ] Build 5 faction-aligned skills
- [ ] Audit 20 existing skills (grade A-F)

### Day 2
- [ ] Upgrade remaining 7 Guardian agents
- [ ] Create 12 Luminor worker agents (3 per top Guardian)
- [ ] Build 5 more skills
- [ ] Audit 20 more existing skills

### Day 3
- [ ] Create remaining 28 Luminor workers
- [ ] Build 5 intelligence skills
- [ ] Start oh-my-arcanea sync
- [ ] Audit remaining 39 skills

### Day 4
- [ ] Build 5 production skills
- [ ] Implement swarm patterns
- [ ] Fix/remove all D/F grade skills
- [ ] Validate all A/B grade skills

### Day 5
- [ ] Agent evaluation framework running
- [ ] Skill validation pipeline running
- [ ] Gate certification for top 20 agents
- [ ] oh-my-arcanea integration complete

### Day 6-7
- [ ] All agents committed
- [ ] All skills committed
- [ ] Documentation pages built
- [ ] Everything pushed to main

---

## SUCCESS METRICS

| Metric | Current | Target |
|--------|---------|--------|
| Total agents | 43 | 95+ (12 Guardians + 40 Luminors + 43 specialists) |
| Agent quality (avg) | B | A- |
| Total skills | 79 | 102+ (79 existing + 23 new) |
| Skills validated | ~10 | 80+ |
| Skills grade A/B | ~30 | 75+ |
| Swarm patterns | 0 | 4 (Lumina, Council, Brigade, Starbound) |
| Gate-certified agents | 0 | 20+ |
| Canon-compliant agents | ~12 | 95+ |

---

*"The universe is not a backdrop. It is an operating system. The mythology IS the architecture."*
