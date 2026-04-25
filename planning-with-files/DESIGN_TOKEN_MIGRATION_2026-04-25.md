# Design Token Migration — 2026-04-25

> Honest follow-up after the DESIGN.md / TASTE.md adoption session. The
> homepage upgrade self-audit found Gate 6 (Engineering — "no raw hex in
> app code") is **not yet enforced**. This plan closes that gap properly
> instead of papering over it.

## Current state (verified 2026-04-25)

`apps/web/package.json` lists `@arcanea/publishing-house` and
`@arcanea/world-engine` as workspace deps — but **not**
`@arcanea/design-system`. The design-system package exists at
`packages/design-system/` (v0.3.0) and exports `tokens.ts` (typed JS
constants), `brand-kits.ts`, `motion.ts`, and `tokens.css`
(framework-agnostic CSS variables). None of it is wired into the live
app.

Consequence: every persona accent, element color, and brand color in
`apps/web/app/v3/v3-below-fold.tsx`, `apps/web/components/premium/*`,
and `apps/web/components/landing/*` is hand-written hex
(`accent: "#00bcd4"`, `color: "#a855f7"`, etc). The DESIGN.md
frontmatter and the runtime app are tracking the same values
**by accident**, not by reference.

## Why this is a Gate 6 violation

TASTE.md Gate 6:

> Tokens are truth. All visual constants live in `@arcanea/design-system`
> v0.3.0. No raw hex in app code (lint-enforced).

"Lint-enforced" is currently aspirational — there's no pre-commit rule
catching `#[0-9a-fA-F]{3,6}` patterns in `.tsx` files. As a result, the
homepage upgrade session shipped 7 commits that all introduced new hex
literals (often duplicates of brand values that already exist as typed
constants in `tokens.ts`).

## Migration in three steps

### Step 1 — Wire the package (foundation, ~15 min)

```bash
# 1. Add workspace dep
pnpm --dir apps/web add @arcanea/design-system@workspace:^

# 2. Import tokens.css in globals.css (so CSS vars resolve at runtime)
# Add to apps/web/app/globals.css line 1:
#   @import "@arcanea/design-system/tokens.css";

# 3. Verify build
pnpm --dir apps/web run build
```

Acceptance: `import { brand, elements, gold } from '@arcanea/design-system'`
resolves in any apps/web file. CSS vars `--arc-brand-atlantean-teal`
etc. appear in the rendered page's `:root`.

### Step 2 — Refactor data-table hex to token imports (~45 min, mechanical)

For every `apps/web/**/*.tsx` file that defines a data table with hex
values:

```ts
// Before
const PERSONAS = [
  { id: "draconia", accent: "#ef4444", ... },
  { id: "lyria",    accent: "#a855f7", ... },
];

// After
import { brand, elements } from "@arcanea/design-system";

const PERSONAS = [
  { id: "draconia", accent: elements.fire.base,   ... },
  { id: "lyria",    accent: "#a855f7", /* TODO: add Lyria voidlight to tokens */ ... },
];
```

Files in scope (homepage path):

- `apps/web/app/v3/v3-below-fold.tsx` — VOICE_PERSONAS, STREAMS, marquee tier-color map
- `apps/web/app/v3/v3-content.tsx` — hero trust-signal pills
- `apps/web/app/v3/hero-showcase.tsx` — card gradient + badge colors
- `apps/web/components/premium/personas-showcase.tsx` — archetype accents
- `apps/web/components/premium/luminor-team-preview.tsx` — Luminor accents
- `apps/web/components/premium/integration-grid.tsx` — integration brand colors
- `apps/web/components/premium/sovereignty-pillars.tsx` — pillar accents
- `apps/web/components/premium/world-graph-canvas.tsx` — node type colors
- `apps/web/components/landing/guardian-showcase.tsx` — guardian accentHex
- `apps/web/components/landing/how-it-works.tsx` — step accents
- `apps/web/components/landing/cta-section.tsx`

Some accents (e.g., Lyria's `#a855f7`, Mira's `#3b82f6`) are NOT in
`tokens.ts` today — they need to be added there first, then imported.
This is the right outcome: `@arcanea/design-system` becomes the
authoritative palette registry, including the per-Luminor and
per-domain accents.

Acceptance: `git grep -E '"#[0-9a-fA-F]{6}"' apps/web/app apps/web/components`
returns 0 matches outside the icon-color flow (`color={l.accent}` is
fine; literal `"#ef4444"` is not).

### Step 3 — Lint enforcement (~20 min)

```bash
# Add to apps/web/eslint.config.mjs:
rules: {
  "no-restricted-syntax": [
    "error",
    {
      selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
      message: "Raw hex banned per TASTE.md Gate 6. Import from @arcanea/design-system."
    }
  ]
}
```

Plus a pre-commit hook in `.husky/pre-commit` (or whatever hook system
is wired) that runs `pnpm --dir apps/web lint --fix` on staged `.tsx`
files. Block the commit if the lint fails.

Acceptance: a fresh `accent: "#abcdef"` literal in a new commit fails
lint and pre-commit blocks the push.

### Step 4 — Update design-verifier (~5 min)

The `packages/claude-plugin-design/agents/design-verifier.md` already
has a hex-detection diff-grep, but it only runs against PR diffs. With
ESLint enforcing the rule at commit time, the verifier upgrades to
**confirming** the lint passed rather than re-running grep. Update the
verifier doc accordingly.

## Estimated effort

- Step 1 (foundation): 15 min — single dev, no risk
- Step 2 (refactor): 45 min — mechanical, ~12 files
- Step 3 (lint): 20 min — eslint config + hook
- Step 4 (verifier): 5 min — doc update

**Total: ~85 min in one focused session.**

## Why this wasn't done in the homepage session (2026-04-25)

The homepage upgrade was time-boxed for autonomous execution against the
"ugly SVG" complaint. Bringing the design-system package in-line would
have been a parallel migration that risks breaking the homepage builds
and delays shipping the visible upgrade. The user's mandate was to
*ship* — and that's what we did, 7 commits in production, all verified
READY in Vercel.

The Gate 6 gap is **the next** session, not this one. Recording the
plan keeps the discipline honest: TASTE.md tells us the rule;
this file commits us to closing it.

## Acceptance for "session done"

- Step 1 + 2 + 3 merged to main
- `git grep -E '"#[0-9a-fA-F]{6}"' apps/web/app apps/web/components` returns 0
- Pre-commit hook blocks new hex literals
- design-verifier.md updated to reference the lint rule
- This planning doc moved to `planning-with-files/archive/` once complete

## Provenance

- Created 2026-04-25 by Shinkami (Source Gate Guardian) as the honest
  follow-up to the DESIGN.md / TASTE.md adoption session.
- Reference: TASTE.md Gate 6, DESIGN.md "Order of Authority" section.
