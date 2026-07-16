# TASTE.md — Arcanea Curatorial Bar

> Companion to [`DESIGN.md`](./DESIGN.md). DESIGN.md is the *machine-readable* schema (Google Labs spec, Apr 2026). TASTE.md is the *human-readable* judgment — the things tokens cannot capture.
>
> When tokens and taste disagree, taste wins. Tokens make a thing buildable. Taste makes it worth shipping.

---

## North Star

**AI-lab premium. Never fantasy-game.**

The bar is Anthropic, Linear, Vercel, Apple — companies whose interfaces feel inevitable, restrained, expensive. Arcanea is *about* a creative multiverse; the chrome around it must feel like a research lab where mythology is computed, not LARPed. Cosmic mythology stays in the *content*, not the *chrome*.

The seven gates that follow are non-negotiable. A page passes all seven before it ships.

---

## Gate 1 — First Principles

Every interface element exists because removing it would make the experience worse. If you cannot answer *why is this here* in one sentence, delete it. Arcanea has too many surfaces and too little time for chrome that signals capability instead of demonstrating it.

- **Every label justifies its pixels.** Decorative copy ("Welcome to the future of...") is banned.
- **Every CTA points somewhere live.** Dead links and "coming soon" badges are credibility leaks. Honest "Roadmap" badges with linked Linear issues are fine; vague "Soon" is not.
- **Every section answers one question.** Two questions = two sections.

## Gate 2 — Voice

Arcanea writes the way a senior engineer talks to another senior engineer who happens to also build worlds. Spare. Specific. Confident without performance.

- **Banned phrases:** "elevate," "unlock," "harness," "leverage," "in this digital age," "we believe," "imagine if you could," "powered by AI."
- **Banned tone moves:** marketing exclamation marks, *italicized hype words*, ALL-CAPS shouting, three-em-dashes for drama.
- **Required moves:** verbs over adjectives ("type a sentence" beats "powerful AI generation"), specific numbers over vague claims ("16 specialist Luminors · 27 OSS repos · 190K words" beats "vast ecosystem"), present tense over future ("Arcanea remembers your world" beats "Arcanea will remember").
- **Hz frequencies are backend-only.** Never user-facing. (See `feedback_hz_identity.md`.)
- **Names matter.** Luminors are characters with depth (Skyrim-NPC bar), not generic labels. Never rename them to "Agent 7." (See `feedback_luminor_naming_depth.md`.)

## Gate 3 — Design

Restraint is the look. Density is earned. Animation is rare and intentional.

- **Typography:** Geist (display + body), Instrument Serif (editorial accent only), Geist Mono (code). NEVER Cinzel, Space Grotesk, Inter, Arial. Confirmed deprecated 2026-04-18 — Anthropic frontend-design anti-pattern list.
- **Color discipline:** Atlantean Teal (#00bcd4) primary, Cosmic Blue (#0d47a1) secondary, Arcanean Gold (#ffd700) accent. Background #09090b. The aquamarine-on-cosmic-dark formula is the brand. Purple gradients on white = AI slop, banned.
- **Glass cards:** `bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm`. One canonical recipe; do not re-roll opacity values per surface.
- **Icons:** Phosphor duotone for product UI, brand SVGs (Simple Icons) for third-party tools. **No emojis as icons. No Unicode glyphs (✦ ◈ ⌥ ✶ ⎈) as icons** — they fall back per-OS and look generic. Per `frontend-design` rule: SVG only.
- **Logo:** Always `arcanea-mark.jpg` (crystalline angular A). Never SVG ArcaneanMark — confirmed 2026-04-09.
- **Asymmetry over centered grids** when it serves a moment; centered when it doesn't. Avoid the default Bootstrap-ish three-column-features pattern.

## Gate 4 — Performance

Speed is part of the design.

- **Core Web Vitals targets:** LCP < 2.5s, INP < 200ms, CLS < 0.1.
- **Hero JS budget:** the chat box is the only above-fold interactive element; everything else is dynamic-imported with `ssr: false`. (See `apps/web/app/v3/v3-content.tsx`.)
- **No `pnpm dev` left running.** 16GB machine; Next.js dev mode leaks 2.6GB. (See `feedback_ops_workflow.md`.)
- **Images:** `next/image` with `sizes` set, AVIF/WebP source, never raw `<img>` for hero or above-fold.
- **Motion:** `LazyMotion` with `domAnimation` (NOT `domMax`). One hero motion moment per page; never scattered micro-interactions for their own sake.

## Gate 5 — Journey

The user's first 30 seconds decide if they ever come back.

- **Above the fold:** brand mark → one-line value prop → chat input → trust pills. That's it. No carousels. No video autoplay.
- **Anchor structure:** every page has a clear primary action, a secondary action, and an exit ramp (either "see all X" or a related-page link). No dead-end pages.
- **Below-fold sequencing:** what it is → why it's different → who it's for → what's shipped → what you keep when you leave.
- **Mobile is the primary target.** 75% of first visits are mobile. If it doesn't work at 375px wide, it doesn't ship.

## Gate 6 — Engineering

Clean code is part of the brand.

- **Tokens are truth.** All visual constants live in `@arcanea/design-system` v0.3.0. No raw hex in app code.
  - **Status (2026-04-25):** Aspirational. The package is published but not yet a workspace dep of `apps/web`, and `tokens.css` is not imported in `globals.css`. ~12 files in `apps/web/app` and `apps/web/components/{premium,landing}` still hold literal hex in data tables. Migration plan: [`planning-with-files/DESIGN_TOKEN_MIGRATION_2026-04-25.md`](./planning-with-files/DESIGN_TOKEN_MIGRATION_2026-04-25.md). Lint enforcement comes after the refactor.
- **Server Components by default.** `'use client'` only when state, refs, or browser APIs are required.
- **TypeScript strict, no `any`.** Typed interfaces at every boundary.
- **No commented-out code in commits.** Delete it; git remembers.
- **No `// TODO: refactor` left for later.** Either refactor now or open a Linear issue with a date.

## Gate 7 — Strategy

The interface must serve the business reality, not aesthetic ambition.

- **Sovereignty is the moat.** BYOK, MIT-licensed, exportable, forkable. Every page reinforces this in word and structure.
- **Open source is the marketing.** Show the repo count. Show the GitHub link. Show the fork count when it earns mention.
- **Honest status badges.** Live · Beta · Soon · Roadmap. Faking shipped state is a credibility loss worse than missing a deadline.
- **Revenue surfaces drive layout priority.** GenCreator, Whop tiers, marketplace — these get the prime real estate, not vanity features.

---

## Motion Canon

Gate 3 says "animation is rare and intentional." This section names the *specific* patterns that count as intentional, and the easings, timings, and reference sites that hit the April 2026 AI-lab premium bar. Cargo-culted Framer Motion defaults fail Gate 3 — every motion ships with deliberate choices, not library defaults.

> Promoted to TASTE.md on 2026-05-22 from memory `feedback_design_tier.md`. Reference sites: linear.app, vercel.com, anthropic.com/claude, rauno.me, emilkowal.ski, framer.com, apple.com/airpods-pro.

### Motion patterns that earn their pixels

- **Scroll-linked animation** — `useScroll` + `useTransform`. Reveals respond to scroll position, not autoplay timers.
- **Shared-element transitions** — `layoutId` between routes/states. The hero card on /worlds becomes the lore card on /worlds/[slug].
- **Spring physics** — custom `stiffness`/`damping`. Never default `easeOut`.
- **Staggered children** — `staggerChildren: 0.05` with `delayChildren`. Lists reveal as a wave, not a wall.
- **Split-text character reveal** — map each char with stagger. Reserve for one hero line per page.
- **Magnetic hover** — cursor attraction via mouse position. CTAs that earn the moment.
- **Parallax depth** — multiple layers responding to mouse with different speeds. Background drift, foreground steady.
- **Blur-to-focus** — `filter: blur(20px) → blur(0)` on enter. Replaces basic opacity fade.
- **`whileInView`** — with `viewport={{ once: true, margin: "-100px" }}`. Below-fold content earns reveal.
- **Ambient motion** — subtle Brownian drift on hero elements. Never sleep on the brand.
- **View Transitions API** — for route changes where supported. Cross-route continuity.

### Canvas / 3D — when used at all

- **React Three Fiber** for hero moments. Not Canvas2D circles.
- **Particle systems** with bloom shaders for atmospheric depth.
- **Depth parallax** with camera pan on mouse position.
- **Gradient mesh backgrounds** (Shadertoy-style) for premium hero canvases.

### Earned scroll set-piece (Track B — the carve-out)

The patterns above are mostly **Track A** (Framer Motion: mount, hover, `whileInView`, spring). Gate 3's "rare and intentional" also permits **Track B** — one *choreographed scroll set-piece per flagship page* driven by GSAP `ScrollTrigger` + Lenis (a pinned section, parallax depth, or scroll-scrubbed video/3D). This is the move that separates a premium product page from a competent one. It is governed, not free.

A Track-B set-piece ships only when it clears **all four**:

1. **Demonstrates, not decorates.** It shows the product/idea unfolding (a feature loop, a system assembling, a narrative beat) — never motion for its own sake.
2. **Holds the performance budget.** 60fps under scroll, transform/opacity only, LCP < 2.5s, hero video ≤ 4 MB. Verified, not assumed.
3. **Degrades deliberately.** Under `prefers-reduced-motion: reduce` the static composition still tells the whole story (video → poster, reveal → all content visible).
4. **Exactly one per page.** One pinned/scrubbed scene. A second is a tech demo, not a product.

Miss any of the four → it is slop, cut it. Operators: the `motion-system` skill holds the patterns; `<SmoothScroll>` / `<ScrollScene>` (`apps/web/components/motion`) hold the code; the `design-motion` agent runs the two tracks; `design-verifier` enforces the 60fps + fallback gate.

### Easing curves — never the default

| Curve | Bezier | Use for |
|---|---|---|
| Linear-style premium | `[0.22, 1, 0.36, 1]` | Standard reveals, transitions |
| Apple expo-out | `[0.16, 1, 0.3, 1]` | Hero reveals with cinematic feel |
| Material standard | `[0.4, 0, 0.2, 1]` | UI affordances, accordions |
| Spring | `{ type: "spring", stiffness: 260, damping: 20 }` | Anything that should feel physical |

### Timing ladder

| Duration | Use for |
|---|---|
| 150 ms | Micro — hover, button press |
| 300 ms | Standard — reveals, transitions |
| 500 ms | Dramatic — hero reveals, modal entry |
| 800 ms+ | Cinematic — one key moment per page, no more |

### Motion anti-patterns (fail Gate 3 immediately)

| Anti-pattern | Why it fails |
|---|---|
| Flat `opacity: 0 → 1` fade without stagger or spring | 2022-tier default |
| `height: auto` accordion without layout animation | Jank on every open |
| Canvas2D for fewer than 200 points | WebGL or SVG-with-motion is the bar |
| Glass cards stacked without scroll choreography | Static density that looks like Notion |
| `transition-colors` Tailwind class as the only hover state | Color-only hovers feel un-finished |
| Default Framer `duration: 0.3` with no spring or custom ease | The library default that screams cargo-cult |
| "Awaiting first insight" / "the constellation waits" empty-state copy | Skyrim-tier voice, not Anthropic-tier |

### Reference sites — study these monthly

The motion bar is set by these properties, in 2026. If your page would feel slow next to these, push it harder.

- `linear.app` — landing + pricing scroll choreography
- `vercel.com` — homepage + `v0` interaction grammar
- `anthropic.com/claude` — model page restraint
- `rauno.me` — the personal-portfolio gold standard
- `emilkowal.ski` — interaction-design playground
- `framer.com` — official motion examples
- `apple.com/airpods-pro` — scroll-driven storytelling

---

## Banned Patterns

A non-exhaustive list of things that immediately fail Gate 3:

| Banned | Why | Use instead |
|---|---|---|
| Inter, Space Grotesk, Cinzel, Arial | Generic AI-slop default; Anthropic anti-pattern list 2026-04-18 | Geist, Instrument Serif, Geist Mono |
| Purple-to-pink gradients on white backgrounds | The single most overused AI-tool aesthetic | Atlantean teal on cosmic dark, with gold or aquamarine accent |
| Emoji as UI icons (💬 🌍 ⚒) | Per-OS fallback, looks generic, breaks accessibility | Phosphor duotone SVG icons |
| Unicode glyphs as icons (✦ ◈ ⌥ ✶ ⎈ ✒) | Same problem; reads as "we did not finish this" | Phosphor SVG or brand monograms |
| Centered three-column "features" grids | The default; says nothing about who Arcanea is | Asymmetric layout, one hero moment, scroll-revealed depth |
| Decorative section dividers (`<hr/>` styled with gradients) | Empty calories | Atmospheric divider with brand-tinted radial glow only when it earns it |
| `whileHover={{ scale: 1.05 }}` on every card | Cargo-culted micro-interaction; causes layout shift | Color/border/shadow transitions; reserve scale for one card per page |
| Stock photography or generic 3D renders | Fantasy-game aesthetic | Custom WebP guardian portraits, SVG world graphs, or no image |
| "Coming soon" with no date or Linear ticket | Credibility leak | Roadmap badge with linked issue, or omit until ready |
| Background videos auto-playing | Bandwidth waste, accessibility hostile | Static hero with CSS gradient + subtle motion |
| Skeleton loading screens longer than 1s | The site looks broken | Optimize the underlying load; skeletons are bandages, not features |

---

## How TASTE.md is Used

- **Before any new page:** read this file end-to-end. Confirm the page hits all 7 gates before you start building.
- **During code review:** each Gate is a section reviewers check. PR description must answer "which gates does this strengthen?"
- **By design subagents:** `design-architect` reads TASTE.md as priority-2 input (after the user brief, before tokens). `design-verifier` blocks merge on any banned-pattern hit.
- **By writing voice:** the Voice gate (#2) is enforced by the `brand-voice` skill and `Line Editor & Voice Alchemist` agent. Both consume this file.

## Authority Order

1. Direct user instruction (highest)
2. **TASTE.md** (this file) — curatorial judgment
3. **DESIGN.md** — machine-readable tokens
4. `@arcanea/design-system` — runtime tokens + primitives
5. `apps/web/CLAUDE.md` — app-specific rules
6. Default Anthropic `frontend-design` skill (lowest)

When in doubt, the page that earns Frank's "yes" beats the page that satisfies the spec.

---

## Provenance

- Authored 2026-04-25 by Shinkami (Source Gate Guardian) under Frank's autonomous-execution mandate.
- Synthesizes: Anthropic `frontend-design` skill (anti-AI-slop), Google Labs DESIGN.md spec (Apr 21 2026), Arcanea memory feedback files (`feedback_design_taste.md`, `feedback_design_tier.md`, `feedback_quality_standard.md`, `feedback_luminor_naming_depth.md`, `feedback_hz_identity.md`, `feedback_logo_never_svg.md`).
- Living document. Update when a banned pattern is discovered or a new bar is set.
