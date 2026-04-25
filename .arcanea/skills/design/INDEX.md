# Arcanea Design Skills Index

> Last updated 2026-04-25
> Canonical routing for all design-related skills across user-global and project-local scopes.

## Authority order (read these first)

1. `TASTE.md` (repo root) — curatorial bar, banned patterns, seven excellence gates. **Read before generating any UI.**
2. `DESIGN.md` (repo root) — [Google Labs DESIGN.md spec](https://github.com/google-labs-code/design.md), machine-readable tokens + rationale. Open-sourced 2026-04-21.
3. `@arcanea/design-system` v0.3.0 — runtime token package: `tokens.ts`, `brand-kits.ts`, `motion.ts`, `tokens.css`, primitives.
4. `apps/web/CLAUDE.md` — app-specific rules (Server Components, content loader, Author Studio publishing).
5. The skills below.

## Canonical skills (use these)

| Skill | Use when | Scope |
|---|---|---|
| **arcanea-frontend-excellence** | Building/revamping pages on Arcanea-family properties (Arcanea, FrankX, OSS) | `.arcanea/skills/` (committed) |
| **arcanea-design-system** | Cosmic design language reference — palette, glass, glow, typography patterns | `.claude/skills/arcanea/design-system/` (local) |
| **frontend-design** (Anthropic) | One-off artifacts, unique demos, NOT Arcanea-branded | Global `~/.claude/skills/frontend-design/` |
| **ui-ux-pro-max** | Design review on existing code — "make this better", audits | Global |
| **skill-creator** | Creating new skills, not building UI | Global |

## Canonical slash commands

From `packages/claude-plugin-design/commands/`:

- `/design-brief <context>` — start a page design brief (invokes `design-architect`)
- `/design-ship <target>` — full end-to-end page revamp (orchestrates all 5 subagents)
- `/design-review <page>` — quality review with Playwright + Lighthouse (no code changes)
- `/design-verify <page>` — alias for `/design-review`

## Canonical subagents

From `packages/claude-plugin-design/agents/`:

- `design-architect` — brief + aesthetic + brand kit selection
- `design-generator` — 3 variants via Magic + v0
- `design-motion` — Framer Motion choreography
- `design-imagery` — Fal / Gemini / Replicate image generation
- `design-verifier` — Playwright + Lighthouse + diff-grep quality gate

## Deprecated / avoid for new work

- `framer-expert` — Framer.com service specific; we build in code
- `component-forge` — superseded by `design-generator` subagent
- `design-lab-build` — old workflow; use `/design-ship` instead
- `design-review` skill (old) — use `/design-review` slash command

## Overlap decisions

- **`arcanea-design` vs `arcanea-design-system`**: `arcanea-design` is deprecated; use `arcanea-design-system` for the cosmic reference, `arcanea-frontend-excellence` for production builds
- **`ui-ux-pro-max` vs `design-verifier`**: Pro-max is for exploratory design reviews and audits; verifier is the PR-blocking quality gate
- **`frontend-design` vs `arcanea-frontend-excellence`**: Use frontend-design ONLY when the output must NOT carry Arcanea brand (standalone demos, generic components, educational examples). Use arcanea-frontend-excellence for everything shipped to Arcanea-family sites.

## Brand kits (not skills, but relevant here)

From `@arcanea/design-system/brand-kits`:
- `arcanea` — Atlantean teal + Arcanean gold, cosmic dark
- `frankx` — Purple + cyan + gold, dark slate
- `oss` — Teal + aquamarine, pure black

Set the active kit per property; never mix.

## Typography (non-negotiable)

- Display + Body: **Geist** (via `geist/font/sans`)
- Editorial accent: **Instrument Serif**
- Code: **Geist Mono** (fallback JetBrains Mono)
- NEVER: Space Grotesk, Inter, Cinzel, Arial (anti-pattern list from `frontend-design`)

## MCP stack

Required for `/design-ship` end-to-end flow:

- `magic` — 21st.dev component gen
- `v0` — Vercel full-page gen
- `fal` — FLUX Pro imagery
- `gemini` — NB2 (Arcanea image default)
- `replicate` — Frank's fine-tuned + Wan
- `figma-remote-mcp` — reference only
- `playwright` — verification

Plus Canva via claude.ai remote for marketing artifacts (not app UI).

## Canonical spec

`docs/superpowers/specs/2026-04-17-agentic-design-system-design.md` — the source of truth for architecture decisions.

## Planning

`planning-with-files/DESIGN_SYSTEM_ROLLOUT_2026-04-18.md` — current phase, open decisions, Linear issue links.

## Project tracker

[Design System 2026 on Linear](https://linear.app/arcanea/project/design-system-2026-073a9aee539c) — 9 issues across Phase 2–5.
