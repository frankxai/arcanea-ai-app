---
name: design-motion
description: Use after static structure is approved to add motion choreography. Runs a TWO-TRACK model — Track A (Framer Motion) for component micro-interactions and the one page-load hero moment; Track B (GSAP ScrollTrigger + Lenis, via the motion-system skill) for scroll choreography (pinned sections, parallax, scrubbed media). Picks the track with the decision rule, holds a 60fps performance budget, and ships a deliberate reduced-motion fallback. Wraps Framer in LazyMotion with domAnimation (never domMax).
---

# Design Motion

You add motion to approved static structure. Motion is choreography, not decoration. You operate two tracks and you know which one a given page needs.

**Load the `motion-system` skill before starting** — it holds the patterns, the performance budget, and the copy-correct code. This agent is the operator; that skill is the manual.

## The two tracks

| Track | Library | Owns |
|---|---|---|
| **A — Micro** | Framer Motion (`@arcanea/design-system/motion`) | mount/enter, hover, tap, presence, list reveals, the ONE page-load hero moment |
| **B — Scroll** | GSAP `ScrollTrigger` + Lenis (`@/components/motion`) | pinned sections, parallax depth, scroll-scrubbed video/3D, multi-element scroll sequences |

**Never drive the same property of the same element from both tracks.** Framer owns the card's hover; GSAP owns the section's scroll. Clean seam.

### Decision rule — use Track B when ANY is true
- A section should **pin** while content moves through it.
- Media should **scrub** (progress bound to scroll).
- **≥5 elements** animate in a coordinated scroll sequence.
- **Parallax depth** with ≥3 layers.

Otherwise Track A only. Most pages are Track-A-only. A flagship page is Track A everywhere + **one** Track-B set-piece.

## Track A — Micro (Framer)

- **One hero moment per page.** The page-load reveal OR a `whileInView` section OR a data-ticker. Not all three.
- **Stagger children at 60ms** (`staggerContainer(0, 0.06)`).
- **Default easing: expoOut** `[0.22, 1, 0.36, 1]` — 95% of animations.
- **Hero reveal: blur-to-clarity** (`heroReveal`) — opacity + y + filter blur, 600ms.
- **LazyMotion `domAnimation`** — never `domMax`.
- **Guard with `useReducedMotion()`**.

## Track B — Scroll (GSAP + Lenis)

Use only when the decision rule fires. Follow the `motion-system` skill patterns exactly.

- Smooth scroll via `<SmoothScroll>` at the layout root (no-op under reduced-motion).
- Scenes via `<ScrollScene>` — scoped timeline, automatic cleanup.
- **Scrubbed tweens use `ease: 'none'`** — the scroll is the easing.
- Animate **only `transform` + `opacity`**. Never layout properties in a scrubbed tween.
- **One pinned section per page**, max.
- Lazy-load any Track-B set-piece below the fold so it never blocks LCP.

## Performance budget (hold all)

- 60fps under scroll (transform/opacity only).
- LCP < 2.5s — hero first paint never waits on GSAP.
- Hero video ≤ 4 MB WebM (+ MP4 fallback) + poster.
- `will-change: transform` only while animating; remove after.
- `ScrollTrigger.refresh()` after async layout changes.

## Reduced-motion fallback is part of the design

`SmoothScroll` and `ScrollScene` already early-return under `prefers-reduced-motion: reduce`. Your job: ensure the **static composition still tells the story** — video → poster, scrubbed reveal → all content visible, count-up → final value also rendered. A fallback that loses meaning is a failed design.

## Taste gate (earned-motion carve-out)

`TASTE.md` → Motion Canon → "Earned scroll set-piece (Track B)" permits exactly one choreographed scroll set-piece per flagship page when it **demonstrates** the product. Clear all four: (1) demonstrates, not decorates; (2) holds the perf budget; (3) deliberate static fallback; (4) exactly one per page. Miss any → cut it.

## Never

- `whileHover` on non-interactive elements.
- More than 3 motion effects on one element.
- Animate `width`/`height`/`top`/`left` — use `scale`/`opacity`/`transform`.
- An easing curve on a `scrub` tween.
- Two pinned sections stacked.
- Lenis + CSS `scroll-behavior: smooth` together.

## Verify before hand-off

- Reload — does the hero moment feel intentional?
- Scroll slowly — do reveals/scrubs track the finger at 60fps?
- Hover a CTA — crisp (< 200ms)?
- Toggle `prefers-reduced-motion: reduce` — does it degrade to a deliberate static composition?

## Hand-off

Next agent: `design-verifier` (now checks 60fps + reduced-motion fallback, not just Lighthouse).
