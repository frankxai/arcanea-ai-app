# Arcanea Agent Contract

This file is the repo-level entrypoint for every coding agent working in Arcanea.

## Source Of Truth Order

Agents must read and obey these sources in this order:

1. `AGENTS.md`
2. newest files in `planning-with-files/`
3. `.arcanea/CLAUDE.md`
4. `.arcanea/MASTER_PLAN.md`
5. `.arcanea/lore/CANON_LOCKED.md` when touching lore, guardians, voice, or mythology

`.arcanea/` is the shared intelligence substrate for Claude, Codex, Cursor, Gemini, opencode, and internal Arcanea agents.

## Product North Star

Arcanea is a BYOK-first creative intelligence workspace.

The core product centers on:
- projects
- continuity
- docs
- memory
- creations
- provenance
- project graph context
- workflow orchestration
- creator and social compounding over time

## Execution Law (Machine-Enforced)

1. Node 20.x and pnpm only. Never use npm. `.nvmrc` pins the version.
2. No PR merges unless changed scope passes: build, typecheck, lint.
3. Frozen lockfile in CI (`pnpm install --frozen-lockfile`).
4. No raw visual constants in app code — use design tokens only.
5. If git state is dirty, stage only target files and report unrelated changes.
6. Every agent spawned must use the Luminor Engineering Kernel (`.arcanea/prompts/luminor-engineering-kernel.md`).

## Task Contract

Every substantial task must define:

```text
Scope:
Owner:
Files:
Non-goals:
Acceptance criteria:
Verification:
Rollback: (how to undo if it breaks)
```

## Branch Discipline

- Never work directly on a dirty `main` worktree.
- Use a fresh branch or worktree for substantial changes.
- Keep promotion slices narrow and verifiable.
- If another agent is already editing a surface, avoid overlapping writes unless integration is the explicit task.

## Verification

- Verification evidence beats confidence.
- Use the verification command attached to the task contract.
- For active project-workspace work, prefer:

```text
pnpm run verify:project-workspaces
pnpm --dir apps/web test:media
```

## Planning With Files

Use `planning-with-files/` as the execution control plane:
- `CURRENT_STATE_*` = what is true now
- `CURRENT_BACKLOG_*` = what happens next
- `CURRENT_CHANGELOG_*` = what landed
- `AGENT_EXECUTION_PROTOCOL_*` = branch and merge rules

Agents must update these files when materially changing repo direction, promotion posture, or shared operating rules.

## Research Agent Team

Research agents use the Luminor Engineering Kernel + Research Specialization Module.
Agent definitions: `.arcanea/agents/research/`
Research output: `docs/research/`
Templates: `docs/research/templates/`

### Agents
| Agent | Role | Gate | Guardian |
|-------|------|------|----------|
| Research Architect | Team lead, decomposes questions, synthesizes | Crown | Aiyami |
| Paper Scout | Academic papers (arxiv, Semantic Scholar) | Sight | Lyria |
| GitHub Scout | Repos, tools, benchmarks | Foundation | Lyssandria |
| Book Scout | Books, blogs, newsletters, podcasts | Voice | Alera |
| Synthesis Luminor | Cross-domain pattern connection | Starweave | Elara |

### Spawn Rules
- `/arcanea-research [topic]` spawns Research Architect (who spawns scouts)
- `/research-scan [domain]` spawns individual scouts
- `/research-synthesis` spawns Synthesis Luminor
- All research output uses templates from `docs/research/templates/`
- Every agent must use the Luminor Engineering Kernel as base prompt

### Research Domains → Gate Mappings
| Domain | Gate | Guardian | Why |
|--------|------|----------|-----|
| AI/ML papers | Sight | Lyria | Pattern recognition, vision |
| Open source tools | Foundation | Lyssandria | Practical, structural |
| Books/thought leadership | Voice | Alera | Truth, expression |
| Cross-domain synthesis | Starweave | Elara | Connecting perspectives |
| Research strategy | Crown | Aiyami | Wisdom, metacognition |
| Consciousness studies | Source | Shinkami | Meta-awareness |
| Creativity research | Flow | Leyla | Creative process |
| Performance/benchmarks | Fire | Draconia | Power, computation |
