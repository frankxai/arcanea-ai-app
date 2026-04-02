# Luminor Agent System — Execution Plan

> **Status**: ACTIVE — Priority #1 Infrastructure Project
> **Guardian**: Shinkami (Source Gate)
> **Created**: 2026-04-03
> **Branch**: product/arcanea-mcp-v1 (or main)

---

## The Thesis

The Luminor Engineering Kernel (`.arcanea/prompts/luminor-engineering-kernel.md`) is the most valuable prompt asset in the Arcanea ecosystem. It transforms any model — haiku, sonnet, or opus — into a sovereign engineering intelligence. A haiku agent with this kernel outperforms a generic sonnet agent because **the prompt carries the intelligence, not just the model**.

The plan: **inject this kernel into every sub-agent Claude Code spawns**, creating an army of Luminor-grade agents across all projects. Then extend with domain-specific modules (like the GitHub module already exists) for specialized swarms.

---

## What Already Exists

| Asset | Location | Status |
|-------|----------|--------|
| Engineering Luminor Kernel | `.arcanea/prompts/luminor-engineering-kernel.md` | CANONICAL |
| GitHub Module | `.arcanea/prompts/luminor-github-module.md` | CANONICAL |
| claude-flow MCP | Installed, `mcp__claude-flow__*` tools available | ACTIVE |
| Arcanea MCP (28 tools) | `packages/arcanea-mcp/` | BUILT |
| Memory MCP (8 tools) | `packages/memory-mcp/` | BUILT |
| SIS Hooks | `.claude/settings.json` | ACTIVE (session init) |
| PP Guardian Prompts | `/pp` skill (10 Guardian prompts) | PROVEN |

## What We're Building

### 1. Luminor Module Library (Domain Specializations)

Each module appends to the kernel for domain-specific intelligence:

| Module | File | Purpose | Status |
|--------|------|---------|--------|
| `kernel` | `luminor-engineering-kernel.md` | Core identity + reasoning doctrine | DONE |
| `github` | `luminor-github-module.md` | Repo governance, PR review, CI/CD | DONE |
| `frontend` | `luminor-frontend-module.md` | React/Next.js, design system, perf | TODO |
| `backend` | `luminor-backend-module.md` | API, Supabase, auth, data modeling | TODO |
| `mcp` | `luminor-mcp-module.md` | MCP server development, SDK, transport | TODO |
| `lore` | `luminor-lore-module.md` | Canon validation, worldbuilding, voice | TODO |
| `ops` | `luminor-ops-module.md` | Deploy, monitor, health, CI/CD | TODO |
| `security` | `luminor-security-module.md` | Secrets, auth, input validation, audit | TODO |
| `test` | `luminor-test-module.md` | TDD, E2E, integration, coverage | TODO |
| `research` | `luminor-research-module.md` | Deep investigation, multi-source synthesis | TODO |

### 2. arcanea-flow Agent Spawn Integration

**How it works**: When Claude Code spawns a sub-agent via `Agent` tool, the prompt MUST include:
1. The Luminor kernel (always)
2. The relevant domain module (based on task type)
3. The specific task instructions

```
Agent prompt = Luminor Kernel + Domain Module + Task Instructions
```

**Implementation**: A hook or skill that auto-prepends the kernel to every agent spawn. Or: arcanea-flow wraps claude-flow and injects Luminor prompts into `agent_spawn`.

### 3. arcanea-flow Architecture

```
arcanea-flow (Arcanea orchestration layer)
  ├── luminor-kernel.md          → injected into ALL agent spawns
  ├── modules/                   → domain specializations
  │   ├── github.md
  │   ├── frontend.md
  │   ├── mcp.md
  │   └── ...
  ├── spawn-config.yaml          → which module for which agent type
  ├── memory integration         → vault_remember/recall per agent
  └── wraps claude-flow CLI      → swarm_init, agent_spawn, task_orchestrate
```

### 4. Model Routing with Luminor Intelligence

| Task Complexity | Model | Luminor Boost | Result |
|----------------|-------|---------------|--------|
| Scout/audit | haiku | kernel + module | Thinks like a senior engineer at haiku cost |
| Code/review | sonnet | kernel + module | Principal engineer quality at sonnet cost |
| Architecture | opus | kernel + module | Transcendent systems thinking |

**Key insight**: The kernel raises the floor. A haiku agent without the kernel is a junior intern. With the kernel, it's a focused specialist. The module adds domain mastery.

---

## Execution Phases

### Phase 1: Module Library (Day 1)
- [ ] Write 4 priority modules: frontend, backend, mcp, ops
- [ ] Test each module by spawning haiku agents with kernel + module
- [ ] Compare output quality: with kernel vs without
- [ ] Validate that haiku+kernel outperforms generic sonnet

### Phase 2: Auto-Injection (Day 1-2)
- [ ] Create `/luminor-spawn` skill that reads kernel + module and constructs agent prompt
- [ ] OR: Create a pre-agent hook in settings.json that auto-injects
- [ ] OR: Build into arcanea-flow as native feature
- [ ] Decide approach based on what's simplest and most reliable

### Phase 3: arcanea-flow Wrapper (Day 2-3)
- [ ] Fork or extend claude-flow with Luminor injection
- [ ] Add spawn-config.yaml mapping agent types → modules
- [ ] Integrate vault memory (agents read/write to Starlight Vaults)
- [ ] Register as MCP server alongside claude-flow

### Phase 4: Validation & Optimization (Day 3-4)
- [ ] Run side-by-side comparison: Luminor haiku vs generic sonnet on same task
- [ ] Measure: code quality, architectural awareness, proactivity, output density
- [ ] Refine kernel based on results
- [ ] Document the Luminor Prompting methodology for OSS release

---

## Excellence Criteria

The Luminor agent system succeeds when:

1. **Every sub-agent thinks like a principal engineer** — no shallow, generic outputs
2. **haiku agents produce sonnet-quality work** for focused tasks
3. **Agents are proactive** — they surface risks, suggest improvements, don't wait to be told
4. **Cross-session memory works** — agents remember context via Starlight Vaults
5. **Zero configuration** — the kernel injects automatically, not manually per spawn
6. **Composable** — kernel + any module = instant domain expert
7. **The system improves itself** — agents can suggest kernel/module refinements

---

## What Makes This Superior to Everything Else

| Approach | Problem |
|----------|---------|
| Generic agent prompts ("you are a coder") | Shallow, no reasoning doctrine, no quality bar |
| Per-agent custom prompts | Doesn't scale, inconsistent quality |
| Framework-only (LangGraph, CrewAI) | No prompt intelligence, just plumbing |
| Fine-tuned models | Expensive, inflexible, can't compose |
| **Luminor System** | **Composable prompt intelligence + model routing + memory** |

The Luminor system is unique because:
- **The kernel IS the intelligence** — portable across any model, any framework
- **Modules are composable** — mix and match for any domain
- **It's model-agnostic** — works with haiku, sonnet, opus, GPT, Gemini
- **It compounds** — every session makes the modules better
- **It's the Arcanea product** — this IS what we sell/distribute

---

## Immediate Next Actions

1. Read this plan at session start
2. Write the 4 priority domain modules
3. Test with haiku agent spawns
4. Wire into agent spawn workflow
5. Commit and iterate
