# Arcanea Agent Harness — Massive Action Plan

> Build the world's first creative-intelligence-native multi-agent orchestrator.
> Not just code — worlds, characters, books, music, and products.

---

## The Insight Nobody Else Has

Every multi-agent orchestrator (claude-flow, agent-orchestrator, oh-my-claudecode) solves ONE problem: **code faster**. They spawn workers, distribute tasks, merge PRs.

Arcanea solves a DIFFERENT problem: **create faster**. Code is just one output. The same orchestration engine should write a chapter, generate character art, compose a soundtrack, AND push the code that serves it — all in one swarm session.

**This is the moat.** Nobody else has a creative intelligence layer on top of multi-agent coding.

---

## Architecture: Three Layers

```
┌─────────────────────────────────────────────────────┐
│              ARCANEA INTELLIGENCE OS                 │
│  Guardians · Gates · Arc Phases · Luminor Wisdom    │
│  Statusline · Hooks · Skills · MCP Servers          │
│  Memory (vault + horizon) · Learning · Routing      │
├─────────────────────────────────────────────────────┤
│           ARCANEA ORCHESTRATOR                       │
│  Task decomposition · Git worktree isolation        │
│  Agent spawn/monitor · Shared memory bus            │
│  Result aggregation · Conflict resolution           │
├─────────────────────────────────────────────────────┤
│              AGENT BACKENDS                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │Claude│  │Codex │  │Open  │  │Aider │           │
│  │ Code │  │ CLI  │  │Code  │  │      │           │
│  └──────┘  └──────┘  └──────┘  └──────┘           │
│  Each in its own git worktree, reporting to bus     │
└─────────────────────────────────────────────────────┘
```

---

## Repo Map (Final, Clean)

| Repo | Command | Purpose |
|------|---------|---------|
| **arcanea-code** | `arcanea` | The flagship CLI — fork of anomalyco/opencode with full Intelligence OS. For ALL creation: code, worlds, characters, books, content |
| **oh-my-arcanea** | `opencode-arcanea` | Community harness — makes any OpenCode into Arcanea-powered. Fork of oh-my-opencode |
| **claude-arcanea** | `claude-arcanea` | Claude Code overlay — Guardian agents + statusline + skills |
| **arcanea-flow** | (library) | Multi-agent orchestration engine (forked from claude-flow concepts) |
| **arcanea-claw** | `arcanea-claw` | Media engine — image/video/audio pipeline |
| **arcanea-vscode** | (extension) | VS Code extension — Kilo Code fork with Guardians |
| **arcanea-openwebui** | (web) | Open WebUI fork — browser-based Arcanea |

### Archive / Consolidate
- **arcanea-opencode** → ARCHIVE. Redundant with oh-my-arcanea. Was a confused fork direction.

---

## Phase 1: Foundation (This Weekend)

### 1.1 Fix Session Start Hook ✅ DONE
- Replaced python3 with sqlite3 CLI fallback

### 1.2 Ship oh-my-arcanea v4.0.0 ✅ IN PROGRESS
- [x] Rename package.json to oh-my-arcanea
- [x] Add `opencode-arcanea` bin entry
- [x] Update author, repo URLs, description
- [x] Keep upstream oh-my-opencode binaries as optionalDeps
- [ ] Wire Guardian overlay (copy from arcanea-opencode/src/agents/)
- [ ] Add Arcanea CLAUDE.md / statusline / hooks
- [ ] Test build: `bun run build`
- [ ] Push to GitHub
- [ ] Publish: `npm publish` as oh-my-arcanea@4.0.0

### 1.3 Statusline v5 ✅ DONE
- Rate limits, context %, lines velocity, dynamic Guardian

---

## Phase 2: Orchestrator Core (Week 1)

### The Multi-Agent Problem
You want ONE command that spawns Claude Code, Codex, and OpenCode agents in parallel, each in isolated worktrees, coordinated by a shared task queue.

**Key insight from research:**

| Project | Stars | Pattern | Multi-Backend? |
|---------|-------|---------|----------------|
| ruvnet/claude-flow | 22,272 | Hierarchical mesh, MCP-based | Claude only |
| ComposioHQ/agent-orchestrator | 5,056 | Git worktree isolation, agent-agnostic | Claude + Codex + Aider |
| Yeachan-Heo/oh-my-claudecode | 10,826 | Parallel execution, teams | Claude only |
| anomalyco/opencode | ~5k | TUI-based, plugin system | Multi-model |

**ComposioHQ/agent-orchestrator** is the closest to what you want — agent-agnostic with git worktree isolation. But it has no creative intelligence layer.

### 2.1 Build arcanea-flow orchestrator module
```
arcanea-flow/
├── src/
│   ├── orchestrator.ts      # Task decomposition + assignment
│   ├── worktree-manager.ts  # Git worktree isolation per agent
│   ├── backends/
│   │   ├── claude-code.ts   # Spawn claude --print in worktree
│   │   ├── codex.ts         # Spawn codex --quiet in worktree
│   │   ├── opencode.ts      # Spawn opencode in worktree
│   │   └── aider.ts         # Spawn aider --yes in worktree
│   ├── memory-bus.ts        # Shared context between agents
│   ├── result-merger.ts     # Aggregate worktree changes
│   └── guardian-router.ts   # Route tasks to best backend
```

### 2.2 Task Distribution Strategy
```
User: "Build the Academy page with lore integration"

Orchestrator decomposes:
  → Claude Code (Opus): Architecture + API routes [worktree: academy-api]
  → Claude Code (Sonnet): UI components [worktree: academy-ui]
  → Codex: Test suite [worktree: academy-tests]
  → OpenCode: Database migrations [worktree: academy-db]

Each agent works in isolation. Orchestrator:
  1. Monitors progress via filesystem
  2. Resolves merge conflicts
  3. Aggregates into single PR
```

### 2.3 Why This ISN'T Overnight Work
- **Runtime testing**: Each backend has different CLI flags, exit codes, output formats
- **Merge resolution**: When 4 agents touch overlapping files, conflict resolution needs human-level judgment
- **Memory coherence**: Agents need shared context without shared git state
- **Creative routing**: Deciding "this is a lore task, send to Claude Opus" vs "this is a migration, send to Codex" needs the Guardian system

**Realistic: 2 weeks for a working orchestrator with 2 backends (Claude Code + OpenCode)**

---

## Phase 3: Creative Intelligence (Week 2-3)

### 3.1 Creative Agent Types (unique to Arcanea)
| Agent | Backend | Purpose |
|-------|---------|---------|
| Lorekeeper | Claude Opus | Canon-safe narrative writing |
| Visualist | Gemini + Imagen | Character/scene art generation |
| Composer | Suno MCP | Soundtrack/atmosphere music |
| Architect | Claude Opus | System design + code |
| Builder | Claude Sonnet / Codex | Implementation |
| Reviewer | Claude Haiku | Code review + quality |
| Publisher | CLI tools | Build, test, deploy |

### 3.2 arcanea-code as Creative CLI
arcanea-code (fork of anomalyco/opencode) becomes the unified creative CLI:
```bash
arcanea                    # Interactive TUI
arcanea build              # Code mode
arcanea create             # Creative mode (lore, art, music)
arcanea swarm              # Multi-agent orchestration
arcanea publish            # Build + deploy pipeline
```

The key differentiation: `arcanea create` doesn't exist in any other tool. It's worldbuilding, character design, book writing — powered by the same agent orchestration as coding.

---

## Phase 4: Extensions (Week 3-4)

### 4.1 arcanea-vscode
- Guardian sidebar with Gate progress
- Statusline in VS Code footer
- Inline lore references (hover over character name → canon info)
- "Channel Guardian" command palette action

### 4.2 arcanea-chrome
- Arcanea overlay on any AI chat (ChatGPT, Gemini, etc.)
- Captures conversations to Arcanea Vault
- Guardian personality injection

### 4.3 arcanea-claw
- Media pipeline: scan → classify → process → store
- Image generation via Nano Banana / Imagen
- Video pipeline for social content

---

## What Can Ship NOW vs Later

### Ship This Weekend
1. ✅ Session hook fix
2. ✅ Statusline v5
3. oh-my-arcanea v4.0.0 on npm (Guardian agents + statusline)
4. arcanea-opencode → ARCHIVED on GitHub

### Ship Week 1
5. arcanea-flow orchestrator with Claude Code + OpenCode backends
6. Git worktree isolation working
7. `arcanea swarm` command in arcanea-code

### Ship Week 2
8. Creative agents (Lorekeeper, Visualist)
9. Memory bus between agents
10. arcanea-code v1.0.0 on npm

### Ship Week 3-4
11. Codex + Aider backend support
12. arcanea-vscode v1.0.0
13. arcanea-chrome v1.0.0
14. Community launch: "Turn any coding agent into an Arcanea-powered one"

---

## Anti-Pattern: Don't Build What Exists

- **Don't** rebuild claude-flow's MCP protocol — use it
- **Don't** rebuild oh-my-opencode's agent harness — overlay on it
- **Don't** rebuild OpenCode's TUI — fork and extend it
- **Don't** rebuild Composio's worktree manager — study and improve
- **DO** build the creative intelligence layer nobody else has
- **DO** build the Guardian routing that makes it Arcanea
- **DO** build the cross-backend orchestrator that unifies them all

---

## The One-Line Pitch

> "Arcanea is the intelligence layer that turns any AI coding tool into a creative universe builder."

Not a replacement for Claude Code. Not a replacement for OpenCode. The layer on top that makes ALL of them part of one creative system.
