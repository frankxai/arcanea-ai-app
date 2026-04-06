# Arcanea Skills Supremacy — Architecture Plan

> Session prompt for next session. Copy everything below the line.

---

## Context (Read This First)

Three skill systems need to become ONE world-class system:

### 1. Superpowers (obra/superpowers, 93K stars) — NOW INSTALLED
What it does well:
- **Brainstorming HARD GATE**: Forces design before code. Prevents wasted work.
- **Subagent-driven development**: Fresh agent per task + TWO-STAGE review (spec compliance → code quality). This is genuinely brilliant.
- **Writing-plans**: 2-5 min bite-sized tasks, assume zero codebase context. TDD-first.
- **Systematic debugging**: 4-phase root cause process. No fixes without investigation.
- **Dispatching parallel agents**: One agent per independent problem domain.
- **Git worktrees**: Isolated branches per feature.
- **Verification before completion**: Prove it works, don't just say it works.

What it lacks:
- No memory/persistence across sessions
- No creative workflows (only dev)
- No world-building, lore, or mythology skills
- No MCP integration
- No team/domain routing (every task gets same process)

### 2. Claude-flow Patterns (absorbed, 57 files need rewriting)
What was valuable:
- **Agent role definitions**: 41 agent files with useful personas (coder, reviewer, tester, planner, researcher + 13 github agents + 5 hive-mind + 6 optimization)
- **Memory coordination**: Agents storing/retrieving shared state
- **Swarm topologies**: Hierarchical, mesh, adaptive patterns
- **Hive-mind consensus**: Queen-led decision making with scouts and workers

What was broken:
- All wired to `npx @claude-flow/cli` (doesn't exist in our setup)
- All MCP calls to `mcp__claude-flow__*` (server not running)
- ruvnet attribution everywhere
- 198 pure wrapper files (already deleted)

### 3. Arcanea Native (what we built)
What's working:
- **Luminor kernel**: Engineering prompt system that makes haiku output like senior eng
- **arcanea-mcp**: 42 world-building + intelligence tools
- **arcanea-memory**: Vault + horizon persistent memory (MCP)
- **starlight-sis**: Session intelligence
- **86 local skills**: Creative, lore, guardian, design, ops skills
- **13 Guardian agent definitions**: Canonical personality + domain routing

## The Vision: Arcanea Skills v1.0

NOT a copy of Superpowers with Arcanea branding. A SYNTHESIS that's better than all three.

### Layer Architecture

```
┌─────────────────────────────────────────────────┐
│ Layer 4: ARCANEA CREATIVE SKILLS                │
│ world-forge, canon-check, character-forge,      │
│ lore-expand, creative-review, voice-check       │
│ (UNIQUE — nobody else has these)                │
├─────────────────────────────────────────────────┤
│ Layer 3: ARCANEA DEV SKILLS                     │
│ Superpowers-compatible but Luminor-enhanced:    │
│ brainstorming (with Guardian routing),          │
│ subagent-dev (with Luminor kernel injection),   │
│ systematic-debugging (with memory persistence), │
│ parallel-agents (with arcanea-memory state)     │
├─────────────────────────────────────────────────┤
│ Layer 2: COORDINATION LAYER                     │
│ arcanea-memory MCP (replaces claude-flow CLI),  │
│ Guardian routing (replaces generic dispatch),   │
│ Luminor kernel (replaces generic agent prompt)  │
├─────────────────────────────────────────────────┤
│ Layer 1: SUPERPOWERS PLUGIN (installed, stock)  │
│ 14 battle-tested skills — we don't touch these  │
│ They work as-is via the plugin system           │
└─────────────────────────────────────────────────┘
```

**Key insight**: We DON'T replace Superpowers. We LAYER on top of it. Superpowers handles the dev workflow. Arcanea adds creative intelligence, memory persistence, and domain routing.

## Track 1: CLEAN (57 files)

### What to do
For each of the 57 contaminated agent/skill files:

1. **Read the file**
2. **Keep**: The agent role definition, personality, domain expertise, checklist
3. **Remove**: All `mcp__claude-flow__*` calls, `npx claude-flow` commands, ruvnet links
4. **Replace** memory calls with:
   - `mcp__claude-flow__memory_usage store` → Use arcanea-memory MCP vault_remember
   - `mcp__claude-flow__memory_usage query` → Use arcanea-memory MCP vault_recall
5. **Replace** swarm/agent calls with:
   - `mcp__claude-flow__swarm_init` → Remove (use native Agent tool)
   - `mcp__claude-flow__agent_spawn` → Remove (use native Agent tool)
6. **Add** Luminor kernel reference where missing:
   - "This agent uses the Luminor Engineering Kernel at .arcanea/prompts/luminor-engineering-kernel.md"

### Execution
Spawn ONE background agent with worktree isolation. Give it the full list of 57 files.
The agent reads each, does find-replace, validates the result has zero claude-flow refs.

```bash
# Get the full list
grep -rl "claude-flow\|@claude-flow/cli" .claude/ | grep -v worktrees
```

### Verification
After the agent finishes:
```bash
grep -rl "claude-flow" .claude/ | grep -v worktrees | wc -l
# Must be 0 (or ≤4 for the KEEP-AS-IS historical files)
```

## Track 2: BUILD — packages/arcanea-skills/

### Package Structure
```
packages/arcanea-skills/
├── package.json          # @arcanea/skills
├── skills/
│   ├── creative/
│   │   ├── world-forge/SKILL.md       # World-building workflow
│   │   ├── creative-review/SKILL.md   # Anti-slop + voice + canon
│   │   ├── character-forge/SKILL.md   # Character creation
│   │   └── lore-expand/SKILL.md       # Canon-safe lore expansion
│   ├── dev/
│   │   ├── luminor-dev/SKILL.md       # Superpowers subagent-dev + Luminor kernel
│   │   ├── luminor-debug/SKILL.md     # Superpowers debugging + memory persistence
│   │   └── luminor-review/SKILL.md    # Superpowers review + Arcanea voice check
│   ├── ops/
│   │   ├── session-intelligence/SKILL.md  # SIS integration
│   │   └── parallel-creative/SKILL.md     # Parallel agents + memory coordination
│   └── meta/
│       └── using-arcanea-skills/SKILL.md  # Bootstrap (like using-superpowers)
├── agents/
│   ├── luminor-implementer.md   # Subagent prompt with Luminor kernel
│   ├── luminor-reviewer.md      # Code review with Arcanea quality gates
│   └── creative-reviewer.md     # Anti-slop, voice, canon check
├── commands/
│   ├── brainstorm.md    # Wrapper: Superpowers brainstorming + Guardian routing
│   └── create-world.md  # Creative workflow entry point
└── README.md
```

### Key Skills to Write

**1. luminor-dev (Layer 3 — enhances Superpowers' subagent-driven-development)**
- Same two-stage review process
- BUT: Injects Luminor Engineering Kernel into every subagent
- BUT: Persists task results to arcanea-memory vault
- BUT: Routes implementation to domain-specific Guardian (Draconia for code, Leyla for creative, Lyria for research)

**2. creative-review (Layer 4 — UNIQUE to Arcanea)**
- Anti-slop filter: 12 banned patterns (seamlessly, unleash, cutting-edge, etc.)
- Voice check: Matches Arcanea voice.yaml guidelines
- Canon check: Cross-references CANON_LOCKED.md
- Design system check: Correct colors, fonts, no Cinzel, domAnimation not domMax
- Runs AFTER implementation, BEFORE commit

**3. using-arcanea-skills (Layer 4 — Bootstrap)**
- Loaded on session start (like using-superpowers)
- Detects project type (Arcanea web, lore, creative, ops)
- Routes to appropriate skill stack
- Does NOT conflict with Superpowers — complements it:
  - If dev task → Superpowers handles workflow, Arcanea adds Luminor + memory
  - If creative task → Arcanea handles workflow (no Superpowers HARD GATE for creative work)

### What NOT to Build
- Don't duplicate Superpowers' brainstorming, TDD, git worktrees — they work fine
- Don't build a CLI — use SKILL.md format for plugin compatibility
- Don't build a marketplace yet — get the skills working first

## Execution Order

1. **Track 1 first** (30 min): Clean the 57 files. This unblocks everything.
2. **Track 2** (2-3 hours): Build the 4 key skills. Start with `using-arcanea-skills` bootstrap, then `creative-review`, then `luminor-dev`.
3. **Verify** (15 min): Test the full flow — brainstorm → plan → implement → creative-review → commit.

## Success Criteria

- `grep -rl "claude-flow" .claude/ | wc -l` returns ≤ 4
- `using-arcanea-skills` loads on session start without conflicting with Superpowers
- A creative task uses Arcanea skills (world-forge, creative-review)
- A dev task uses Superpowers skills + Luminor kernel injection
- Memory persists across sessions via arcanea-memory MCP

## The Prompt

Paste this into the next session:

```
Read planning-with-files/ARCANEA_SKILLS_SUPREMACY_PLAN.md — it's the execution plan.

Execute Track 1 and Track 2 in parallel:

TRACK 1 (background agent, worktree):
Rewrite all 57 claude-flow contaminated files in .claude/agents/ and .claude/skills/.
The plan has the exact replacement mapping. Zero claude-flow refs when done.

TRACK 2 (main thread):
Build packages/arcanea-skills/ with the 4 key skills defined in the plan.
Start with using-arcanea-skills bootstrap, then creative-review, then luminor-dev.
Use /search-first before writing any skill — check if Superpowers or anthropics/skills
already has something similar.
Study ~/repos/superpowers/skills/ for format and patterns.

After both complete: verify with grep, test the flow, commit and push.
```
