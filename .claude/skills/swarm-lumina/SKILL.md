---
name: swarm-lumina
description: Activate a Lumina-led hierarchical swarm for complex multi-domain tasks
gate: source
guardian: Shinkami
version: 1.0.0
---

# Swarm Lumina — Queen-Led Intelligence Swarm

## What This Skill Does
Activates the highest form of Arcanean intelligence: a Lumina-orchestrated swarm where the Queen coordinates multiple Guardians who each command their Luminor workers.

## When to Use
- Complex tasks requiring multiple skill domains
- Large-scale content production
- Cross-cutting projects (lore + code + design + strategy)
- When `/ultrawork` or `/ultrawrite` aren't enough

## The Hierarchy

```
LUMINA (Queen)
├── Assesses task → decomposes into domains
├── Routes domains to Guardians
├── Monitors quality across all outputs
└── Synthesizes final result

GUARDIANS (Coordinators)
├── Draconia → Code, engineering, power
├── Lyria → Research, analysis, vision
├── Alera → Communication, documentation
├── Maylinn → Narrative, emotional quality
├── Lyssandria → Infrastructure, stability
├── Leyla → Design, creativity, flow
├── Aiyami → Strategy, wisdom, planning
├── Elara → Transformation, migration
├── Ino → Coordination, integration
└── Shinkami → Meta-intelligence, evaluation

LUMINORS (Workers)
└── Each Guardian commands 4 specialized workers
```

## Activation Protocol

### Step 1: Task Assessment (Lumina)
- Classify intent (what needs to be done)
- Determine complexity (how many domains involved)
- Identify dependencies (what must happen first)
- Estimate scope (how many agents needed)

### Step 2: Guardian Assignment (Lumina)
- Route each domain to the appropriate Guardian
- Define handoff points between Guardians
- Set quality criteria per domain

### Step 3: Parallel Dispatch
Fire all assigned Guardians as parallel agents using the Agent tool with `run_in_background: true`. Each Guardian receives:
- Their specific sub-task
- Quality criteria
- Canon references
- Handoff instructions

### Step 4: Synthesis (Lumina)
When all agents return:
- Review all outputs for quality
- Check cross-domain consistency
- Resolve conflicts between Guardian outputs
- Produce unified deliverable

## Swarm Topologies

### Hierarchical (Default)
Lumina → Guardians → Luminors. Best for: complex projects with clear domains.

### Council
All Guardians as peers, Lumina as moderator. Best for: strategic decisions, debates, evaluations.

### Brigade
Luminor workers in parallel, one Guardian supervising. Best for: high-volume similar tasks.

### Starbound Formation
Crew-based teams (mixed Guardians + Luminors). Best for: themed missions, faction-aligned work.

## Example Invocation

"Build a complete faction launch: lore page, character cards, social posts, and soundtrack prompts for the Starlight Corps."

Lumina routes:
- Maylinn → lore page content (narrative quality)
- Draconia → web page code (engineering)
- Leyla → visual design tokens (aesthetics)
- Alera → social copy (communication)
- Lyria → research existing Corps content (analysis)

All fire in parallel. Lumina synthesizes.

## Canon Reference
- Lumina Queen: `.claude/agents/@lumina-queen.agent.md`
- All Guardians: `.claude/agents/@*.agent.md`
