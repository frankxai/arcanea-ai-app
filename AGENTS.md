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
4. No raw visual constants in app code — use `@arcanea/design-system` tokens only.
5. If git state is dirty, stage only target files and report unrelated changes.
6. Every agent spawned must use the Luminor Engineering Kernel (`.arcanea/prompts/luminor-engineering-kernel.md`).

## Design System & MCP Stack (2026-04-18)

**Canonical source of truth:** `packages/design-system` (`@arcanea/design-system` v0.2.0) — tokens, brand kits (`arcanea`, `frankx`, `oss`), motion variants, framework-agnostic CSS vars.

**Layered architecture:**
1. `.arcanea/config/design-tokens.yaml` → platform-agnostic source
2. `packages/arcanea-design-preset.js` → Tailwind preset
3. `packages/design-system` → TS tokens + brand kits + Framer Motion variants + `tokens.css` (framework-agnostic)
4. `apps/web/components/ui/*` → Radix-wrapped primitives (Phase 2 extraction pending)

**Typography (elevated 2026-04-18):** Geist (display + body), Instrument Serif (editorial accent), Geist Mono (code). Space Grotesk is DEPRECATED per Anthropic `frontend-design` anti-pattern list and replaced for platform alignment with Vercel ecosystem.

**MCP stack for design work** (`.mcp.json.example` has the full config):
- `magic` (21st.dev) — premium UI component generation
- `v0` (Vercel) — component and page generation
- `fal` — fast image/video (FLUX Pro, Stable Video)
- `gemini` — NB2 (Arcanea default for image gen per `feedback_nb2_default.md`)
- `replicate` — Frank's fine-tuned models + Wan
- `figma-remote-mcp` — reference only, never source of truth
- `playwright` — verify rendered output
- Canva via claude.ai remote — marketing assets only

**Rules:**
- Code is truth for app UI. Figma is sketchpad. Canva is truth for marketing.
- Every new page starts from tokens + a brand kit, never hardcoded hex.
- Framer Motion provider uses `domAnimation` (not `domMax`).
- Default easing `[0.22, 1, 0.36, 1]` (expoOut). Stagger children 60ms.
- When generating a *unique* component via the `frontend-design` skill (not Arcanea brand work), vary typography away from the default stack.

**Spec:** `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md`.

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
