# Arcanea Agentic Design System — Design Spec

**Date:** 2026-04-17
**Status:** Foundation shipped. Iterative rollout in progress.
**Owner:** Frank
**Tracking:** Linear issue TBD, Notion Dev Hub TBD

## Problem

Arcanea sites, FrankX, and OSS repos share brand DNA but not infrastructure. Each page was styled ad-hoc with Tailwind utilities. Motion was inconsistent. Brand kit for non-Arcanea properties did not exist. Premium component libraries (21st.dev Magic, v0, motion-primitives) were not wired to Claude Code.

Result: shipped pages looked "a bit ugly" relative to peers (Linear, Vercel, Stripe). Generation velocity was gated by hand-writing components the industry has already solved.

## Goals

1. One canonical design system consumed by every Arcanea-family property.
2. Swappable brand kits — same primitives, different identity (Arcanea, FrankX, OSS, future Creator tenants).
3. Claude Code can generate premium UI on demand (Magic + v0 + Fal + Gemini + Replicate MCPs).
4. Motion choreography standardized (stagger, reveal, hero, scroll) — not reinvented per page.
5. Reference implementation: one page revamped to prove the stack, then roll forward iteratively with user feedback.

## Non-Goals

- Public OSS release of the design system (Phase 3; requires internal battle-testing first).
- Component library replacement — existing `apps/web/components/ui/*` stays in place.
- Figma source of truth — code is truth; Figma is sketchpad.

## Architecture

Four layers, bottom-up:

### Layer 1: Tokens (platform-agnostic)
- **Source:** `.arcanea/config/design-tokens.yaml`
- **TypeScript export:** `@arcanea/design-system/tokens`
- **Tailwind preset:** `packages/arcanea-design-preset.js`

### Layer 2: Brand Kits (identity swap)
- `@arcanea/design-system/brand-kits`
- `BrandKit` interface: palette, fonts, motion profile, logo paths
- Ships with `arcanea`, `frankx`, `oss`
- Consumer picks kit at app level via `getBrandKit(id)`

### Layer 3: Motion (behavior)
- `@arcanea/design-system/motion`
- Framer Motion variants and transitions
- Patterns absorbed from motion-primitives, magicui, aceternity
- Standard easing: `expoOut [0.22, 1, 0.36, 1]`
- Standard stagger: 60ms between children

### Layer 4: Components (UI)
- Today: `apps/web/components/ui/*` (40+ Radix-wrapped primitives)
- Phase 2: extract into `@arcanea/design-system/components` for cross-app consumption

## MCP Stack (Claude Code side)

Wired in `.mcp.json`:

| MCP | Purpose | Key env var |
|---|---|---|
| `magic` (21st.dev) | Premium UI component generation | `TWENTYFIRST_API_KEY` |
| `v0` (Vercel) | Full-page and section generation | `V0_API_KEY` |
| `fal` | Fast FLUX Pro, Stable Video | `FAL_KEY` |
| `gemini` | NB2 image gen (Arcanea default) | `GEMINI_API_KEY` |
| `replicate` | Frank's fine-tuned models + Wan | `REPLICATE_API_TOKEN` |
| `figma-remote-mcp` | Reference + handoff | (OAuth via claude.ai) |
| `playwright` | Browser verification | n/a |
| Canva (via claude.ai) | Marketing asset creation | (OAuth via claude.ai) |

## Brand Kit Separation Strategy

Every app consumes `@arcanea/design-system` and declares its active kit via a single export:

```ts
// apps/web/lib/brand.ts
import { arcanea } from '@arcanea/design-system/brand-kits';
export const brand = arcanea;
```

FrankX site imports `frankx`. OSS imports `oss`. No cross-contamination. Adding a new tenant = add a `BrandKit` entry, not a new design system.

## Content Studio Roles

| Tool | Role | Truth? |
|---|---|---|
| Code (Next.js + Tailwind + tokens) | App UI | ✅ |
| Canva | Marketing: social, ads, decks, OG | ✅ for marketing |
| Figma | Exploration, handoff notes | ❌ reference only |
| 21st.dev Magic + v0 | Generate → refine → ship | feeds code |
| Fal / Gemini / Replicate | Hero imagery, brand assets | feeds code or Canva |
| Spline | Future: one 3D hero per key page | embed |

## Rollout (6 weeks, iterative with feedback)

### Week 1 (now)
- ✅ Ship `@arcanea/design-system` package (tokens + brand-kits + motion)
- ✅ Wire 5 design-oriented MCPs (Magic, v0, Fal, Gemini, Replicate)
- ✅ Commit spec
- ✅ v0.2.0 typography elevation: Space Grotesk → Geist + Instrument Serif (see "Typography Evolution" below)
- ✅ Framework-agnostic `tokens.css` for Astro/Svelte/Vue/HTML consumers
- Pending user action: drop API keys via `setx`

## Typography Evolution (2026-04-18)

**Why we moved off Space Grotesk:**
- Anthropic's `frontend-design` skill explicitly lists Space Grotesk as a generic/overused choice to avoid
- Previous agents defaulted to it without aesthetic justification; it conflicted with the "distinctive AI lab premium" bar
- Inter is also banned by the same skill — it was our body fallback

**New stack (v0.2.0):**
- Display + Body: **Geist** — Vercel's font, battle-tested for AI/creator platforms, aligned with our deployment ecosystem, `npm i geist` drop-in
- Editorial accent: **Instrument Serif** — Google Fonts, dramatic editorial moments (hero, pull-quotes)
- Code: **Geist Mono** (with JetBrains Mono fallback)

**What stays:** cosmic palette, brand colors, elemental colors, motion variants, glass recipes — all unchanged.

## Patterns Absorbed (2026 GitHub audit)

Research agent audit of shadcn-ui/ui, magicui, vercel/geist, motion-primitives, fontsource yielded:

1. **shadcn/ui v4+ multi-registry pattern** — `components.json` with namespaced `@arcanea/*` registries + Bearer auth for private components. Target: Phase 3.
2. **Magic UI 5 wow primitives** — Animated Beam, Border Beam, Marquee, Number Ticker, Interactive Grid, Spotlight. Port as `@arcanea/design-system/primitives`. Target: Phase 2.
3. **Geist typography** — already adopted in v0.2.0.
4. **Fontsource NPM pattern** — `@arcanea-fonts/*` scoped packages for non-Google fonts with woff2 + CSS imports. Target: Phase 3.
5. **Motion v12** — migrate `framer-motion` → `motion/react` imports when we bump peerDep to v12. Target: Phase 2.

### Week 2
- Pick ONE page (proposed: homepage hero or pricing). Revamp using full stack. Measure before/after.
- Wire Linear issue + Notion page for tracking.

### Week 3–4
- Revamp 3 more pages, one at a time, user reviews each
- Extract repeated patterns into `@arcanea/design-system/components`

### Week 5
- FrankX site adopts `@arcanea/design-system` with `frankx` kit
- Validate brand kit swap works in practice

### Week 6
- Public `agentic-design-system` repo: docs, MCP recipes, skill pack
- Publish as template others can adopt

## Success Criteria

- Every new page starts from tokens + brand kit, never hardcoded hex
- New page time: spec → shipped in <4 hours using MCP stack
- Brand kit swap for a new tenant: <1 day
- Lighthouse scores ≥90 on every revamped page
- User can say "make this feel more X" and get a result matching the kit's motion profile

## What Others Built (referenced, not copied)

- **shadcn/ui** — Radix primitive layer (we already use this pattern)
- **motion-primitives** — variant shape and stagger defaults
- **magicui** — hero effects (beams, number-flow, marquee) — recipes in our motion.ts
- **aceternity** — blur-to-clarity reveal — codified as `heroReveal`
- **cult-ui** — family-pack aesthetic — reference for Phase 2 components
- **originui** — 400+ free components — mine for Phase 2 inspiration
- **park-ui** — framework-agnostic tokens — validates our YAML-source pattern

## Open Questions

1. When FrankX site adopts this, does it live in the same monorepo or stay separate? (Decision: defer to Week 5.)
2. Do we publish `@arcanea/design-system` privately to npm or keep workspace-only? (Decision: workspace-only until Week 6.)
3. Spline integration: own package or inline per-page? (Decision: inline first, extract if repeated 3+ times.)

## Commit Trail

- `feat(design-system): scaffold package with tokens, brand kits, motion`
- `feat(mcp): add magic, v0, fal, gemini, replicate MCPs`
- `docs(specs): agentic design system design spec`
