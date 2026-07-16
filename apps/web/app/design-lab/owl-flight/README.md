# Design Lab — Owl Flight (Hermes secluded)

**Branch:** `agent/hermes/owl-academy-scroll-preview`  
**Route:** `/design-lab/owl-flight` (noindex)  
**Worktree:** `starlight/repos/.hermes-worktrees/owl-academy-scroll`

## Why this surface

Primary `arcanea-ai-app` checkout was on Codex `codex/arcanea-homepage-world-engine` (dirty, multi-worktree). This lab must not collide with that rewrite. Isolated Hermes worktree from `origin/main`.

## Quality bar

- **Not** the standalone home HTML primitive-sphere demo as production bar.
- Uses **canon Arcanea stills** + mascot `arcanea-hero-flight.png`.
- Motion: **Lenis** (`SmoothScroll`) + **GSAP ScrollTrigger** pin/scrub (existing `components/motion/*`).
- Optional future: real GLTF guide + plate sequences; R3F only as atmosphere, never Tier-D hero.

## Stack already in apps/web

`gsap`, `@gsap/react`, `lenis`, `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`.

## Files

- `apps/web/app/design-lab/owl-flight/page.tsx`
- `apps/web/app/design-lab/owl-flight/owl-flight-experience.tsx`
- `apps/web/public/images/arcanea-universe/*` (selected stills for the journey)

## Verify

```bash
pnpm --dir apps/web dev
# open http://localhost:3001/design-lab/owl-flight
```

Vercel preview after push of this branch.
