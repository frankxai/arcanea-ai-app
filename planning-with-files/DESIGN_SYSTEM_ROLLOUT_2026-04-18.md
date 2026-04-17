# Design System Rollout — 2026-04-18

**Status:** Foundation + typography elevation shipped. Reference page pending user selection.
**Owner:** Frank (product) · Claude Code (implementation)
**Canonical spec:** `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md`
**Tracking:** Linear project [Design System 2026](https://linear.app/arcanea/project/design-system-2026-073a9aee539c) · Notion Dev Hub TBD

## What's shipped (verifiable on disk + origin)

### v0.1.0 — Foundation (commit `f862d609`, branch `feat/design-system-foundation`)
- `packages/design-system` scaffold: tokens, brand-kits, motion variants, README, tsconfig
- `.mcp.json.example` with Magic / v0 / Fal / Gemini / Replicate
- Initial spec

### v0.2.0 — Typography elevation + runtime application (commit `886c8215` + this turn, branch `worktree-design-evolution`)
- Geist replaces Space Grotesk + Inter everywhere in `apps/web` runtime
  - `apps/web/app/layout.tsx` — GeistSans + GeistMono via `geist/font/sans`
  - `apps/web/app/globals.css` — `--font-display` and `--font-inter` aliased to `--font-geist-sans`
  - `packages/arcanea-design-preset.js` — Tailwind fontFamily updated with Geist, Instrument Serif editorial family added
- Instrument Serif added for editorial moments (hero, pull-quotes)
- `tokens.css` framework-agnostic export
- `AGENTS.md` — new Design System & MCP Stack section + updated Execution Law
- `.claude/CLAUDE.md` and `apps/web/CLAUDE.md` — font line updated
- `.arcanea/skills/arcanea-frontend-excellence/SKILL.md` — new advanced skill extending Anthropic frontend-design
- `docs/superpowers/specs/claude-cowork-handoff-template.md` — reusable handoff template
- `geist` npm package installed in `apps/web`

## Phased rollout (execution plan)

### Phase 1 — COMPLETE (2026-04-17 → 2026-04-18)
- [x] Package scaffold
- [x] MCP stack wired in `.mcp.json.example`
- [x] Typography elevated off anti-pattern fonts
- [x] Framework-agnostic CSS vars
- [x] AGENTS.md alignment
- [x] Advanced frontend excellence skill

### Phase 2 — Week 2 (pending user start)
- [ ] Pick ONE reference page (hero candidate: homepage, pricing, or `/chat`)
- [ ] Generate 3 variants via Magic + v0; user picks
- [ ] Hero imagery via Fal or Gemini NB2
- [ ] Full motion choreography using `@arcanea/design-system/motion`
- [ ] Playwright verification at 3 widths
- [ ] Lighthouse ≥90 on Vercel preview
- [ ] Ship to production — measure before/after
- [ ] Port Magic UI primitive #1 (Animated Beam) to `@arcanea/design-system/primitives`

### Phase 3 — Week 3–4
- [ ] Revamp 3 more pages (one per day, user reviews each)
- [ ] Extract repeated patterns into `@arcanea/design-system/components`
- [ ] Port remaining Magic UI primitives: Border Beam, Marquee, Number Ticker, Interactive Grid, Spotlight
- [ ] Motion v12 migration: `framer-motion` → `motion/react` imports
- [ ] Write `@arcanea/design-system/primitives` README

### Phase 4 — Week 5
- [ ] FrankX site adopts `@arcanea/design-system` with `frankx` kit
- [ ] Validate brand kit swap in live deployment
- [ ] Document per-tenant onboarding playbook

### Phase 5 — Week 6
- [ ] Public `arcanea-design-system` OSS repo scaffold (cherry-pick from monorepo)
- [ ] Claude marketplace plugin `.claude/plugins/arcanea-design/` — bundle skill + MCP config + agent defs + tokens
- [ ] shadcn-style component registry (`components.json` + `@arcanea/*` namespaces)
- [ ] Publish `@arcanea-fonts/*` NPM packages (Fontsource pattern) for any custom typefaces we add
- [ ] Launch: blog post, tweet thread, template repo for creators to fork

## Success metrics

| Metric | Target | Current |
|---|---|---|
| Every new page uses tokens | 100% (no raw hex in diff) | enforced this commit forward |
| New-page lead time | spec → shipped in <4 hours | unmeasured |
| Brand-kit swap time | <1 day for new tenant | untested |
| Lighthouse per revamped page | ≥90 all four metrics | unmeasured |
| Typography compliance | 0 Space Grotesk / Inter in new code | 100% (enforced in skill) |

## Open questions — RESOLVED 2026-04-18

1. **Reference page for Phase 2:** ✅ **Homepage hero** — max visibility, forces full-stack exercise. Tracked as [ARC-177](https://linear.app/arcanea/issue/ARC-177).
2. **Newsreader:** ✅ **Keep as legacy serif fallback**. Instrument Serif is the new default for editorial moments (`font-editorial` class). Deprecate Newsreader gradually as pages revamp.
3. **OSS sync timing:** ✅ **Phase 5** — wait until 2+ pages battle-tested. Tracked as [ARC-183](https://linear.app/arcanea/issue/ARC-183).
4. **Claude plugin distribution:** ✅ **Committed at `packages/claude-plugin-design/`**. Scaffolded this turn with skill + MCP recipe + agent defs + tokens + install guide. Tracked as [ARC-182](https://linear.app/arcanea/issue/ARC-182).
5. **Linear project:** ✅ **Created** — [Design System 2026](https://linear.app/arcanea/project/design-system-2026-073a9aee539c) with 9 Phase 2–5 issues.

## Linear issues

- [ARC-176](https://linear.app/arcanea/issue/ARC-176) — Merge v0.1.0 + v0.2.0 PRs (Urgent)
- [ARC-177](https://linear.app/arcanea/issue/ARC-177) — Phase 2: Revamp homepage hero (High)
- [ARC-178](https://linear.app/arcanea/issue/ARC-178) — Phase 2: Port Animated Beam primitive
- [ARC-179](https://linear.app/arcanea/issue/ARC-179) — Phase 3: Revamp 3 additional pages
- [ARC-180](https://linear.app/arcanea/issue/ARC-180) — Phase 3: Port 5 remaining primitives + Motion v12
- [ARC-181](https://linear.app/arcanea/issue/ARC-181) — Phase 4: FrankX adopts design system
- [ARC-182](https://linear.app/arcanea/issue/ARC-182) — Phase 5: Claude marketplace plugin
- [ARC-183](https://linear.app/arcanea/issue/ARC-183) — Phase 5: Public OSS repo mirror
- [ARC-184](https://linear.app/arcanea/issue/ARC-184) — Phase 5: shadcn multi-registry

## Links

- PR (foundation): https://github.com/frankxai/arcanea-ai-app/pull/new/feat/design-system-foundation
- PR (v0.2.0 evolution): https://github.com/frankxai/arcanea-ai-app/pull/new/worktree-design-evolution
- Canonical package: `packages/design-system/`
- Skill: `.arcanea/skills/arcanea-frontend-excellence/SKILL.md`
- Spec: `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md`
- Cowork template: `docs/superpowers/specs/claude-cowork-handoff-template.md`

## Branch discipline note

`worktree-design-evolution` is an isolated worktree branch (off `feat/design-system-foundation`) created specifically to avoid the parallel-agent branch-flipping chaos observed during this rollout. Future large edits to the design system should use the same pattern: enter a named worktree, commit, push, PR.
