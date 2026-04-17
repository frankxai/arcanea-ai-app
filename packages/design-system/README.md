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

## Motion principles

- Default easing: `expoOut` — `[0.22, 1, 0.36, 1]`
- Stagger children: 60ms (`staggerContainer(0, 0.06)`)
- Hero reveal: 600ms slow + blur-to-clarity
- Never use `domMax` — always `domAnimation` in the provider

## Patterns absorbed

- **shadcn/ui** — Radix primitive layer (already in `apps/web/components/ui`)
- **motion-primitives** — variant shape and stagger defaults
- **magicui / aceternity** — hero reveal blur-fade, magnetic hover intensity

## Next phases

- Phase 2: extract `apps/web/components/ui/*` primitives as `@arcanea/design-system/components`
- Phase 3: generate a public `agentic-design-system` repo (docs + MCP recipes + skill pack)
