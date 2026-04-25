---
version: alpha
name: Arcanea
description: Arcanea is a creative-multiverse workspace. Visual identity is restrained AI-lab premium with cosmic-dark backgrounds, Atlantean teal as primary, Arcanean gold as accent, and Geist as the typographic spine. Mythology lives in the content; the chrome stays calm.
colors:
  # Brand spine — see packages/design-system/src/tokens.ts (machine truth)
  primary: "#00bcd4"        # Atlantean Teal
  primaryHover: "#99ffe0"   # Aquamarine bright
  secondary: "#0d47a1"      # Cosmic Blue
  accent: "#ffd700"         # Arcanean Gold
  aquamarine: "#7fffd4"     # Living-graph highlight
  # Surface
  background: "#09090b"     # Cosmic void — the canvas
  surface: "#1a2332"        # Default card surface
  raised: "#242f42"          # Elevated surface
  elevated: "#2d3a52"        # Floating element
  overlay: "#364562"         # Modal / sheet overlay
  # Text
  textPrimary: "#e6eefc"
  textSecondary: "#9bb1d0"
  textMuted: "#708094"
  textDisabled: "#515b6b"
  # Borders (live in alpha space at runtime; hex equivalents at #09090b background)
  border: "#16181d"
  borderBright: "#1f2229"
  # Element accents (per-Luminor / per-domain)
  elementCrystal: "#7fffd4"
  elementFire: "#ff6b35"
  elementWater: "#78a6ff"
  elementWind: "#00ff88"
  elementEarth: "#8b6f47"
  elementVoid: "#9966ff"
  # Semantic
  success: "#22c55e"
  warning: "#eab308"
  error: "#ef4444"
  info: "#0ea5e9"
typography:
  display:
    fontFamily: Geist
    fontSize: clamp(2.2rem, 5.5vw, 4.5rem)
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -0.035em
  h1:
    fontFamily: Geist
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  h2:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.025em
  h3:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  body:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  bodyLarge:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0em
  bodySmall:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  editorial:
    fontFamily: Instrument Serif
    fontSize: 2rem
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.01em
    fontFeature: '"liga", "ss01"'
  caption:
    fontFamily: Geist Mono
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2em
  code:
    fontFamily: Geist Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  "2xl": 24px
  full: 9999px
spacing:
  "0": 0px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px
  "32": 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#0b0e14"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primaryHover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.textPrimary}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.textSecondary}"
    typography: "{typography.bodySmall}"
    rounded: "{rounded.xl}"
    padding: "10px 20px"
  card-glass:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.6}"
  card-glass-strong:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.textPrimary}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.8}"
  pill:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.textSecondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  input:
    backgroundColor: "rgba(255,255,255,0.025)"
    textColor: "{colors.textPrimary}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "14px 16px"
  badge-live:
    backgroundColor: "rgba(34,197,94,0.10)"
    textColor: "{colors.success}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-roadmap:
    backgroundColor: "rgba(148,163,184,0.10)"
    textColor: "#94a3b8"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

## Overview

Arcanea is a BYOK creative-intelligence workspace and the reference implementation of an open multiverse framework. The interface conveys two truths simultaneously: *this is real engineering* (research-lab restraint, density when earned, no decorative hype) and *this builds worlds* (cosmic-dark canvas, breathing aurora ambience, mythological depth in the content layer).

The aesthetic is **AI-lab premium**: think Anthropic, Linear, Vercel, Apple. Cosmic mythology stays inside the work — chapters, characters, world graphs, voice rooms — never in the chrome. A first-time visitor should read the surface as *expensive software, not fantasy game*.

For the curatorial bar that tokens cannot encode (voice, banned patterns, the seven excellence gates), see [`TASTE.md`](./TASTE.md). For the runtime token package, see `@arcanea/design-system` v0.3.0 in `packages/design-system/`. For the live brand-kit registry (`arcanea`, `frankx`, `oss`), see `packages/design-system/src/brand-kits.ts`.

## Colors

Arcanea uses a **dominant cosmic-dark surface** with **sharp brand accents**. Distribute color, do not balance it. Eighty percent of pixels live on cosmic-void / surface / text-primary; the remaining twenty percent carry teal, gold, and elemental accents in places that earn the focus.

- **Atlantean Teal `#00bcd4`** is the primary brand color — used for primary CTAs, focus rings, the chat-box border, the primary-link state, the audio-reactive orb default. It is *the* brand. Never replace it with a generic blue.
- **Cosmic Blue `#0d47a1`** is the deep-space secondary — used in gradient meshes, ambient glows, large-area washes. Pair it with teal in radial gradients; never use it as a flat fill on its own (reads dull).
- **Arcanean Gold `#ffd700`** is the accent of meaning — earned achievements, rare states, "you keep 90%" indicators, sovereignty pillars. Reserved use; gold loses meaning if it is everywhere.
- **Aquamarine `#7fffd4`** is the living-graph highlight — used for connected nodes, "alive" states, the subtle bottom radial warmth on the hero.
- **Element accents** (Crystal/Fire/Water/Wind/Earth/Void) are owned by Luminors and domains. They never appear on chrome — only on persona-bound surfaces (e.g., a Luminor card's hover glow uses the Luminor's element color).
- **Light mode is supported**, not preferred. Dark mode is the brand. Light mode follows the same hierarchy with inverted surface tokens (see `packages/design-system/src/tokens.ts`).

Glass cards live in the alpha-on-white space (`rgba(255,255,255,0.03)` background, `rgba(255,255,255,0.06)` border) on top of the cosmic-void canvas — this single recipe is canonical. Do not roll new opacity values per surface.

## Typography

The Geist family is Arcanea's typographic spine — installed via `geist/font/sans` and `geist/font/mono`. Geist provides display, body, and monospace; Instrument Serif provides the editorial accent for chapter pull quotes, library prose, and the rare lyrical break.

- **Display** (Geist 700, tight tracking) — hero headlines, page titles. Render with `clamp(2.2rem, 5.5vw, 4.5rem)` for fluid sizing.
- **Body** (Geist 400/500) — every paragraph, every UI label, every microcopy line. Variable weight; do not switch families.
- **Editorial accent** (Instrument Serif 400) — used surgically for in-content quotes, hero subtitles when a single sentence carries lyrical weight, and Library long-form. Never as a UI label, never as a CTA.
- **Code** (Geist Mono) — terminals, chat code blocks, technical data, captions with `letterSpacing: 0.2em` for that small-caps research feel.

The fallback stack is intentionally short: `system-ui, sans-serif`. We do not ship Inter as a fallback because it telegraphs default-AI-tool aesthetic.

**Banned families** (anti-pattern list, locked 2026-04-18): Inter, Space Grotesk, Cinzel, Arial, Roboto, system fonts as primary. See [`TASTE.md`](./TASTE.md) Gate 3 for why.

## Layout

Container max-width is **1400px**. Default page padding is `2rem` desktop, `1.5rem` mobile. Hero sections use `max-w-3xl` (672px) for the centered chat-first composition; below-fold sections range from `max-w-5xl` (1024px) for content density to `max-w-6xl` (1152px) for grids.

- **Spacing scale** is the 4px base shown in the YAML — every gap, padding, and margin rounds to a multiple of 4. This produces visual rhythm across mixed devices.
- **Section vertical rhythm:** `py-24` (96px) compact, `py-32` (128px) default, `py-40` (160px) for moments that need to breathe.
- **Grid gaps:** `gap-3` (12px) for dense grids, `gap-4` (16px) standard, `gap-6` (24px) for spaced cards.
- **Asymmetry over symmetry** when it serves a moment. Hero is centered; below-fold sections may break the grid (e.g., World Graph Canvas uses absolute-positioned nodes). Centered three-column "features" grids are the default — earn deviation.

Mobile is the primary target. Every layout works at 375px wide before it works at 1920px.

## Elevation & Depth

Arcanea does not use heavy drop shadows. Depth comes from:

1. **Subtle inner alpha gradients on glass surfaces** — `bg-white/[0.03]` over `bg-white/[0.025]` over the cosmic-void canvas reads as three layers without explicit shadows.
2. **Brand-tinted radial glows on hover** — `radial-gradient(400px circle at <cursor>, <accent>15, transparent 40%)`. Cursor-tracked on premium cards; static on grid tiles.
3. **Atmospheric dividers** — `<AtmosphericDivider variant="teal|purple|gold" />` placed between sections. A 1px gradient line with a centered radial glow. Reserve for narrative beats, not every section break.
4. **Border emphasis on focus** — borders shift from `rgba(255,255,255,0.06)` to `rgba(255,255,255,0.12)` on hover. No border-width changes (causes layout shift).

Explicit shadow tokens (`elevation1` through `elevation3` in `packages/design-system/src/tokens.ts`) exist for modals, popovers, and lifted toolbars. They are the exception, not the default.

## Shapes

Rounded corners scale with element importance:

- **`rounded.full`** — pills, status badges, persona orbs, brand-mark icons. Reads as identity.
- **`rounded.2xl` (24px)** — hero cards, premium showcase tiles. Reads as featured.
- **`rounded.xl` (16px)** — default card, chat input, persona tile. Reads as standard surface.
- **`rounded.lg` (12px)** — buttons, small interactive elements. Reads as actionable.
- **`rounded.md` (8px)** — small badges, inline tags, icon containers (10x10 / 11x11 squares).
- **`rounded.sm` (4px)** — code blocks, technical data callouts.
- **`rounded.none` (0px)** — table cells, dividers, gradient overlays.

Avoid pixel-rounded values that don't appear in the scale. Consistency of curvature is part of the calm.

## Components

The component table in YAML is the source for `button`, `card`, `pill`, `input`, and `badge` defaults. Anything not listed inherits from the Radix-wrapped primitives in `apps/web/components/ui/`.

Notes that don't fit YAML:

- **Buttons** are `button-primary` for the canonical CTA (one per page is ideal), `button-secondary` for the alternate path, `button-ghost` for tertiary "see more" links. Never two primary CTAs side by side.
- **FeatureCard** (`@arcanea/design-system` primitive) handles the cursor-tracking glow + magnetic hover + glass-card recipe. Use it for product pillars, persona tiles, and showcase grids; do not roll a new card component for one-off use.
- **Atmospheric backgrounds** — `<FloatingOrbs preset="aurora" />` for hero, fine grid texture (`opacity-[0.015]`) for ambient depth. One ambient layer per page; never two.
- **Motion** uses Framer Motion via `LazyMotion` with `domAnimation` (NOT `domMax` — see `feedback_design_tier.md`). Default easing is `[0.22, 1, 0.36, 1]` (expoOut). Stagger children 60ms.
- **Icons** are Phosphor (`@/lib/phosphor-icons`) at `weight="duotone"` for product UI, `weight="regular"` for secondary states, `weight="fill"` for active/selected states. Brand-third-party icons are Simple Icons SVG. **No emojis. No Unicode glyphs.** See [`TASTE.md`](./TASTE.md) banned-patterns table.

## Do's and Don'ts

**Do**

- Use `@arcanea/design-system` tokens. Every visual constant in app code must resolve to a token. Lint blocks raw hex.
- Set the active brand kit per property (`arcanea` for arcanea.ai, `frankx` for frankx.ai, `oss` for OSS demos) and never mix.
- Write copy in present tense, with verbs over adjectives, and specific numbers over vague claims.
- Earn motion. One hero motion moment per page. Stagger children 60ms with expoOut easing.
- Honor the seven gates of [`TASTE.md`](./TASTE.md) before you ship.
- Verify on production after every push. `pnpm run build` exit 0 → push → curl the live URL → check Vercel deploy id.

**Don't**

- Ship purple-to-pink gradients on white backgrounds. The single most overused AI-tool aesthetic.
- Use Inter, Space Grotesk, Cinzel, or Arial. Anti-pattern list, locked 2026-04-18.
- Use emojis or Unicode glyphs as UI icons. Phosphor SVG only.
- Add `whileHover={{ scale: 1.05 }}` to every card. Reserved for one card per page maximum.
- Auto-play background videos.
- Ship "Coming soon" without a date and a Linear ticket. Use the `badge-roadmap` component with a real link.
- Render Hz frequencies in user-facing copy. They are backend-only metadata.
- Replace Luminor names with generic agent labels. Names carry character — depth is a feature.

---

## How DESIGN.md is Consumed

This file is the **machine-readable** half of Arcanea's visual identity contract. It conforms to the [Google Labs DESIGN.md spec v0 (alpha)](https://github.com/google-labs-code/design.md), open-sourced 2026-04-21.

**Validate:** `npx @google/design.md lint DESIGN.md`

**Export to Tailwind:** `npx @google/design.md export --format tailwind DESIGN.md`

**Compatible AI agents and IDEs:** Claude Code, Cursor, Antigravity, Codex, Gemini CLI, Stitch, opencode. Each tool reads the YAML frontmatter for tokens and the markdown body for rationale.

### Order of Authority (when in conflict)

1. **Direct user instruction** — highest.
2. [`TASTE.md`](./TASTE.md) — curatorial judgment that tokens cannot capture.
3. **DESIGN.md** (this file) — machine-readable tokens.
4. **`@arcanea/design-system`** v0.3.0 — runtime tokens, brand kits, motion variants, primitives.
5. **`apps/web/CLAUDE.md`** — app-specific rules (Server Components, content loader, etc).
6. **Anthropic `frontend-design` skill** — anti-AI-slop principles when generating one-off non-Arcanea-brand artifacts.

Tokens make a thing buildable. Taste makes it worth shipping.

---

## Provenance

- **Spec:** Google Labs DESIGN.md v0 (alpha) — `google-labs-code/design.md`, Apache 2.0, open-sourced 2026-04-21.
- **Token source:** `packages/design-system/src/tokens.ts` and `packages/design-system/src/brand-kits.ts` (`@arcanea/design-system` v0.3.0).
- **Authored:** 2026-04-25 by Shinkami (Source Gate Guardian) under Frank's autonomous-execution mandate.
- **Living document.** When tokens change in `@arcanea/design-system`, this file updates in the same commit.
