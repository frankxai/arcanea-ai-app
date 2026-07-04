# Arcanea Agent Contract

This file is the repo-level entrypoint for every coding agent working in Arcanea.

## Source Of Truth Order

Agents must read and obey these sources in this order:

1. `AGENTS.md`
2. newest files in `planning-with-files/`
3. `.arcanea/CLAUDE.md`
4. `.arcanea/MASTER_PLAN.md`
5. `.arcanea/lore/CANON_LOCKED.md` when touching lore, guardians, voice, or mythology
6. `TASTE.md` (curatorial judgment) and `DESIGN.md` (Google Labs spec, machine tokens) when touching any visual surface

`.arcanea/` is the shared intelligence substrate for Claude, Codex, Cursor, Gemini, opencode, and internal Arcanea agents.

`DESIGN.md` (root) conforms to the [Google Labs DESIGN.md spec](https://github.com/google-labs-code/design.md) open-sourced 2026-04-21 â€” YAML frontmatter holds machine-readable tokens, markdown body holds rationale. `TASTE.md` (root) holds the curatorial bar that tokens cannot encode (voice, banned patterns, the seven excellence gates). Both are the runtime authority for any agent generating UI; runtime token package `@arcanea/design-system` v0.3.0 is the implementation surface.

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
4. No raw visual constants in app code â€” use `@arcanea/design-system` tokens only.
5. If git state is dirty, stage only target files and report unrelated changes.
6. Every agent spawned must use the Luminor Engineering Kernel (`.arcanea/prompts/luminor-engineering-kernel.md`).
7. Every Agent dispatch sets `model:` explicitly per task class (Apex/Senior/Mechanical/External). Default-Opus is wasteful â€” see `planning-with-files/MODEL_ROUTING_DISCIPLINE_2026-04-26.md`.
8. Before any parallel agent dispatch, check free RAM (`cat /proc/meminfo | grep MemFree`). Below 2 GB free, work sequentially. 16 GB machine; non-negotiable per `CLAUDE.md`.

## Design System & MCP Stack (2026-04-18)

**Canonical source of truth:** `packages/design-system` (`@arcanea/design-system` v0.2.0) â€” tokens, brand kits (`arcanea`, `frankx`, `oss`), motion variants, framework-agnostic CSS vars.

**Layered architecture:**
1. `.arcanea/config/design-tokens.yaml` â†’ platform-agnostic source
2. `packages/arcanea-design-preset.js` â†’ Tailwind preset
3. `packages/design-system` â†’ TS tokens + brand kits + Framer Motion variants + `tokens.css` (framework-agnostic)
4. `apps/web/components/ui/*` â†’ Radix-wrapped primitives (Phase 2 extraction pending)

**Typography (elevated 2026-04-18):** Geist (display + body), Instrument Serif (editorial accent), Geist Mono (code). Space Grotesk is DEPRECATED per Anthropic `frontend-design` anti-pattern list and replaced for platform alignment with Vercel ecosystem.

**MCP stack for design work** (`.mcp.json.example` has the full config):
- `magic` (21st.dev) â€” premium UI component generation
- `v0` (Vercel) â€” component and page generation
- `fal` â€” fast image/video (FLUX Pro, Stable Video)
- `gemini` â€” NB2 (Arcanea default for image gen per `feedback_nb2_default.md`)
- `replicate` â€” Frank's fine-tuned models + Wan
- `figma-remote-mcp` â€” reference only, never source of truth
- `playwright` â€” verify rendered output
- Canva via claude.ai remote â€” marketing assets only

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

### Research Domains â†’ Gate Mappings
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

## Design Taste Kernel

For any site, app, landing page, dashboard, visual identity, brand, motion, media, social, or frontend task, apply the shared Design Taste Kernel before handoff:

- C:\Users\frank\starlight\repos\DESIGN_TASTE.md
- C:\Users\frank\starlight\repos\WEB_EXPERIENCE_STANDARD.md
- C:\Users\frank\starlight\repos\MOTION_TASTE_RUBRIC.md
- C:\Users\frank\starlight\repos\MULTI_AGENT_DESIGN_COUNCIL.md
- C:\Users\frank\starlight\repos\VISUAL_QA_GATE.md

When motion, scroll, generated media, GIF/video, or premium polish matters, route through the Motion Design Studio plugin/skills and verify the result visually.


<!-- PREMIUM-WEB-OS:START -->
## Premium Intelligence Web OS Adoption

This repo participates in the Starlight Premium Intelligence Web OS.

For any website, app, landing page, dashboard, brand surface, visual asset, motion system, 3D/WebGL scene, generated media, or public-facing UI work:

- Read the estate OS first: `C:\Users\frank\starlight\repos\_intelligence\README.md`.
- Use the activation contract: `C:\Users\frank\starlight\repos\_intelligence\adoption\activation-contract.md`.
- Treat `C:\Users\frank\starlight\repos\_intelligence\` as the source of truth for premium web taste, design, motion, WebGL, copy, assets, and quality gates.
- Use `/pwo` or the `premium-web-os` skill for full builds; use `/mad` for a design council pass.
- Use `/pwo review-pr` before absorbing another agent's PR or branch.
- Use `/pwo absorb-assets` before using external, generated, scientific, audio, video, or 3D assets.
- Use `/pwo motion-score` before shipping cinematic scroll, sound-paired motion, or complex choreography.
- Build static composition first, add Track A local motion second, add Track B GSAP/Lenis scroll only when earned, and add 3D only with fallback and reduced-motion behavior.
- Use VIS through `C:\Users\frank\starlight\repos\visual-intelligence` for asset provenance, curation packets, rights, and publication records.
- Use `C:\Users\frank\starlight\repos\_intelligence\visual-worlds\neural-cosmos.md` for neuroscience, cerebrum, spine, electron, signal, or golden spiral direction.
- Do not copy reference sites or agencies. Deconstruct principles and create original execution.
- Do not ship without responsive, accessibility, performance, reduced-motion, and visual QA checks appropriate to the change.

Repo-local instructions remain authoritative when stricter.
<!-- PREMIUM-WEB-OS:END -->
