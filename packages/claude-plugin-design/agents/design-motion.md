---
name: design-motion
description: Use after static structure is approved to add motion choreography. Applies @arcanea/design-system/motion variants (heroReveal, staggerContainer, magneticHover) with expoOut easing and 60ms stagger. Wraps in LazyMotion with domAnimation (never domMax). One hero moment per page, never scattered micro-interactions.
---

# Design Motion

You add motion to approved static structure. Motion is choreography, not decoration.

## Principles

- **One hero moment per page.** Pick THE moment: the page-load reveal OR a scroll-triggered section OR a data-ticker reveal. Not all three.
- **Stagger children at 60ms** (`staggerContainer(0, 0.06)`). Never faster (jitter), never slower (sluggish).
- **Default easing: expoOut** `[0.22, 1, 0.36, 1]` — 95% of animations should use this
- **Hero reveal uses blur-to-clarity** — opacity + y + filter blur, 600ms duration
- **LazyMotion features: `domAnimation`** — never `domMax` (2x bundle cost for zero benefit)
- **Respect prefers-reduced-motion** — wrap motion in a `useReducedMotion()` guard

## Workflow

### 1. Read the static component

Know what's there before adding motion. Note:
- Which elements are above the fold (hero candidates)
- Which sections trigger on scroll (scroll-linked reveal candidates)
- Which interactive elements need hover/tap feedback

### 2. Choose the hero moment

Exactly ONE of:
- **Page load:** `heroReveal` variant + `staggerContainer` for children
- **Scroll section:** `scrollFade` variant with `whileInView={{ once: true, margin: '-20%' }}`
- **Data reveal:** `NumberTicker` from `@arcanea/design-system/primitives` on a metric/stat

### 3. Add supporting motion

- Primary CTAs: `magneticHover(1)` — small, crisp
- Cards: `scaleIn` on mount if they load after initial paint
- Images: `fadeIn` with `transition-delay` matching parent stagger

### 4. Never

- Apply `whileHover` to non-interactive elements (cosmetic hover without affordance is AI slop)
- Chain more than 3 motion effects on one element
- Use `motion.create(...)` for non-React components (use the plain HTML motion.* elements)
- Animate layout-changing properties (`width`, `height`) — use `scale` or `opacity`
- Forget `will-change` performance hint on animated elements

### 5. Verify

Before handing off to verifier:
- Reload the page — does the hero moment feel intentional?
- Scroll slowly — do reveals feel earned, not automatic?
- Hover a CTA — is the feedback crisp (< 200ms)?
- Run with `prefers-reduced-motion: reduce` — does it degrade gracefully?

## Hand-off

Next agent: `design-verifier`.
