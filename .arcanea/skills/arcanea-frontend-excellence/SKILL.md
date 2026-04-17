---
name: arcanea-frontend-excellence
description: Premium frontend implementation for Arcanea-family properties. Extends Anthropic's frontend-design with Arcanea tokens, brand kits, MCP-driven generation (Magic/v0/Fal/Gemini/Replicate), and April 2026 best practices. TRIGGER on page/component/hero builds that must ship to production on Arcanea, FrankX, or OSS sites.
version: 1.0.0
author: Arcanea
tags: [design, frontend, ui, production, excellence, agentic]
triggers:
  - build page
  - build component
  - design hero
  - revamp page
  - new page
  - production-ready UI
  - "make it beautiful"
  - Arcanea design
---

# Arcanea Frontend Excellence

> Ship work that survives the Linear/Vercel/Stripe bar. No AI-slop aesthetics. No generic defaults.

## When to use this skill vs siblings

| Skill | Use when |
|---|---|
| **arcanea-frontend-excellence** (this) | Building for Arcanea, FrankX, OSS, or any property consuming `@arcanea/design-system` — brand-consistent production UI |
| **frontend-design** (Anthropic) | One-off components, artifacts, demos with NO Arcanea brand constraint — forces bold aesthetic variance |
| **ui-ux-pro-max** | Design review and audit of existing code ("make it beautiful", "what's wrong with this") |
| **skill-creator** | Authoring new skills, not building UI |

If Arcanea brand applies → this skill. If a unique artifact → frontend-design. Two modes, chosen deliberately.

## Canonical inputs (read before touching pixels)

- Package: `@arcanea/design-system` v0.2.0+ (`packages/design-system/`)
- Tokens: `@arcanea/design-system/tokens` | CSS: `@arcanea/design-system/tokens.css`
- Brand kits: `@arcanea/design-system/brand-kits` — `getBrandKit('arcanea' | 'frankx' | 'oss')`
- Motion variants: `@arcanea/design-system/motion`
- Tailwind preset: `packages/arcanea-design-preset.js`
- Spec: `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md`
- Anti-patterns: `frontend-design` skill's avoidance list

## Typography (non-negotiable 2026 stack)

- **Display + Body:** Geist (via `geist/font/sans`)
- **Editorial accent:** Instrument Serif (via `next/font/google`)
- **Code:** Geist Mono or JetBrains Mono
- **NEVER:** Space Grotesk, Inter, Arial, Roboto, Cinzel — all on anti-pattern lists

## MCP stack (use together)

```
Discover → Magic + v0 generate 3 variants
Imagery → Fal (FLUX Pro) or Gemini NB2 for heroes
Custom models → Replicate (Frank's fine-tuned + Wan video)
Marketing → Canva (via claude.ai remote)
Reference → Figma (never source of truth)
Verify → Playwright browser check + Vercel preview
```

## Execution workflow (every page, every time)

### 1. Brief — state the purpose in one paragraph
- Who is this for? What must they do here? What's the ONE thing they remember?
- Pick an aesthetic extreme (minimal / maximalist / editorial / brutalist / luxury / playful)
- Choose the brand kit (`arcanea` default; `frankx` or `oss` as needed)

### 2. Generate — don't hand-write what MCPs can generate
- `magic` MCP: "premium [hero/bento/pricing] section, Arcanea dark cosmic theme, Geist font, [specific vibe]" — get 2 variants
- `v0` MCP: "full-page [purpose], [same brand context]" — get 1 variant
- Pick what survived. Refactor into our tokens — never accept raw hex from MCP output.

### 3. Hero imagery — never use stock
- `fal` MCP with FLUX Pro for editorial imagery
- `gemini` MCP with NB2 for fast iterations
- `replicate` for custom fine-tuned models
- Always produce 3 options, pick with user review

### 4. Assemble — code is truth
- Import tokens: `import { cosmic, brand, gold, easings } from '@arcanea/design-system/tokens'`
- Import motion: `import { heroReveal, staggerContainer, transitions } from '@arcanea/design-system/motion'`
- Use Tailwind classes via preset. Never inline hex.
- Framer Motion: `<LazyMotion features={domAnimation}>` — never `domMax`

### 5. Motion choreography (one set, orchestrated)
- Default easing: `[0.22, 1, 0.36, 1]` (expoOut)
- Stagger children: 60ms (`staggerContainer(0, 0.06)`)
- Hero: `heroReveal` variant (blur-to-clarity, 600ms)
- Hover: `magneticHover(1)` on primary CTAs only
- Scroll-linked opacity/y on revealed sections

### 6. Verify — before claiming done
- `playwright` MCP: screenshot the rendered surface at 1920, 1440, 768 widths
- Check Lighthouse on Vercel preview: ≥90 on all four metrics
- Kill the dev server when done (RAM discipline — see `feedback_ops_workflow`)
- Confirm no hardcoded hex in your diff
- Confirm no `domMax` slipped in

### 7. Commit — narrow, typed
- `feat(pages/[name]): [what shipped]` — one commit per page revamp
- Stage specific files only, never `git add .`
- Never `Co-Authored-By` trailers — Arcanea is sovereign

## Hard rules (Execution Law inheritance)

From `AGENTS.md` Execution Law:
1. Node 20.x and pnpm only
2. Build + typecheck + lint must pass before PR
3. Frozen lockfile in CI
4. `@arcanea/design-system` tokens only — never raw hex
5. Stage specific files; report unrelated changes
6. Use Luminor Engineering Kernel for spawned agents

## Anti-patterns (refuse to ship these)

- Space Grotesk / Inter defaults in any new code
- Purple-gradient-on-white (Anthropic flagged cliche)
- Centered hero with one CTA and an illustration (AI-slop default)
- `font-display: font-sans` with no hierarchy
- Animations scattered like decoration instead of orchestrated reveal
- Light mode when the brand is dark-first
- Hardcoded font-family in a styled-component when preset handles it
- Stock photography — use Fal/Gemini/Replicate generations only

## Verification checklist (paste into PR description)

- [ ] Uses `@arcanea/design-system/tokens` — no raw hex in diff
- [ ] Typography: Geist display, Geist body, Instrument Serif (if editorial), Geist/JetBrains Mono
- [ ] Motion choreographed with `heroReveal` + `staggerContainer` where appropriate
- [ ] LazyMotion features: `domAnimation` not `domMax`
- [ ] Hero imagery generated via Fal/Gemini/Replicate (not stock)
- [ ] Playwright screenshot attached at 3 widths
- [ ] Lighthouse ≥90 on preview deploy
- [ ] Brand kit applied correctly (`arcanea` / `frankx` / `oss`)
- [ ] No `pnpm dev` process left running
- [ ] One commit, specific files, conventional message

## Patterns to absorb next (Phase 2+)

From the 2026-04-18 GitHub audit:
- shadcn v4+ multi-registry with `@arcanea/*` namespaces
- Magic UI primitives: Animated Beam, Border Beam, Marquee, Number Ticker, Interactive Grid, Spotlight
- Fontsource NPM pattern for custom fonts
- Motion v12 `motion/react` import migration

## References

- Canonical spec: `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md`
- Design bible: `.claude/skills/arcanea/design-system/SKILL.md` (local)
- Anthropic base: `~/.claude/skills/frontend-design/SKILL.md`
- Anti-pattern list: inherited from `frontend-design`
- Brand voice: `.arcanea/lore/CANON_LOCKED.md` (for hero copy)
