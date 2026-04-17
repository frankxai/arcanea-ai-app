# @arcanea/design-system

Canonical design system for the Arcanea ecosystem. Consumed by `apps/web`, OSS repos, FrankX sites, and any future Creator property.

## What's inside

- **tokens** — cosmic palette, brand colors, elemental colors, typography, radii, shadows, easings, durations, glass recipes
- **brand-kits** — swappable brand identity (Arcanea, FrankX, OSS) with typed `BrandKit` schema
- **motion** — Framer Motion variants and transitions absorbed from motion-primitives / aceternity patterns

## Usage

```ts
import { cosmic, brand, easings } from '@arcanea/design-system/tokens';
import { arcanea, getBrandKit } from '@arcanea/design-system/brand-kits';
import { heroReveal, staggerContainer, transitions } from '@arcanea/design-system/motion';
```

## Design hierarchy

1. **Source of truth**: `.arcanea/config/design-tokens.yaml`
2. **Tailwind preset**: `packages/arcanea-design-preset.js` (consumed by `apps/web/tailwind.config.ts`)
3. **TypeScript tokens**: this package (consumed by components, motion, brand-aware UI)

## Brand kits

Three kits ship today. Add more by extending `BrandKit` in `src/brand-kits.ts`.

```ts
const kit = getBrandKit('frankx');
// kit.palette.primary === '#AB47C7'
```

## Typography (2026 premium stack)

- **Display + Body:** Geist (Vercel) — `npm i geist` or load via `@vercel/geist-font`
- **Editorial accent:** Instrument Serif (Google Fonts) — for hero moments, pull-quotes
- **Code:** Geist Mono (with JetBrains Mono fallback)

Space Grotesk is DEPRECATED as of v0.2.0. Anthropic's `frontend-design` skill lists it as a generic/overused anti-pattern. Geist is the 2026 standard for AI-platform and creator-tool aesthetics and aligns with our Vercel deployment.

## Motion principles

- Default easing: `expoOut` — `[0.22, 1, 0.36, 1]`
- Stagger children: 60ms (`staggerContainer(0, 0.06)`)
- Hero reveal: 600ms slow + blur-to-clarity
- Never use `domMax` — always `domAnimation` in the provider

## Patterns absorbed (2026 audit)

- **shadcn/ui v4+** — multi-registry pattern (`components.json` with namespaced registries + Bearer auth). Phase 2 target.
- **Magic UI** — 5 "wow" primitives to port next: Animated Beam, Border Beam, Marquee, Number Ticker, Interactive Grid, Spotlight
- **motion-primitives** — variant shape and stagger defaults (adopted)
- **Vercel Geist** — typography + design pattern (adopted)
- **Fontsource** — NPM font distribution pattern (Phase 3)
- **Motion v12 (`motion/react`)** — upcoming migration from `framer-motion` when we bump to v12

## Next phases

- Phase 2: port the 5 Magic UI primitives as `@arcanea/design-system/primitives`; extract `apps/web/components/ui/*` as `@arcanea/design-system/components`
- Phase 3: shadcn-style component registry (`components.json` + `@arcanea/*` namespaces) so any repo can `npx shadcn add @arcanea/hero`
- Phase 4: publish a public `agentic-design-system` repo (docs + MCP recipes + skill pack) + Claude marketplace plugin
