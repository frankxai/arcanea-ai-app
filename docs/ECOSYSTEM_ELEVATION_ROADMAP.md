# Arcanea Ecosystem Elevation Roadmap

> Living plan for raising every Arcanea surface to one standard. The bar is set by
> the mobile-foundation + premium-motion + sharpened-mythic-copy pass shipped in
> PR #160 (mobile) and the `claude/arcanea-redesign-6pages` branch (core pages).

**Quality bar (every entry must meet this):**
- Mobile-first: no overflow at 375px, tap targets ≥ 44px, `prefers-reduced-motion` respected, safe-area aware.
- Premium motion: compose existing `components/motion/*` + `components/premium/*` (no new primitives).
- Voice: Arcanea mythic register, sharpened for clarity + conversion (Guardians / Ten Gates / Lumina–Nero / Five Elements).
- Shared rhythm: `.section-pad`, `.container-page`, `--nav-h` tokens (shipped in #160).

---

## Tier 0 — Core pages (in progress, this branch)

| Page | State | Needs |
|---|---|---|
| `/skills` | ✅ redesigned (this branch) | hero + SectionShell browse + FeatureCard CTA + copy — done |
| `/` (home, `app/v3/*`) | strong | reduced-motion guard on hero parallax; lead hero sub with a verb; `.section-pad` rhythm |
| `/agents` | moderate | hero aligned to WorldsHero; chips `min-h-[44px]` + scroll-snap on mobile; grid 1/2/3; sharpen H1/sub |
| `/worlds` | moderate | reduced-motion guard; world cards single-col + ≥44px targets; trim "How It Works" bodies |
| `/ecosystem` | strong | stack cards single-col < 640px; `.container-page`; one-line layer descriptions |
| `/lore/guardians` | strong | mobile audit only (tap targets, text clamps, reduced-motion) |

## Tier 1 — Remaining marketing routes (next)

`/pricing` · `/academy` · `/luminors` · `/gallery` · `/library` · `/creator-economy` · `/community` · `/studio`
— each: hero pass, mobile audit, copy sharpen. Dependency: none (independently shippable).

## Tier 2 — OSS repos + registry

- `frankxai/arcanea` (OSS mirror) — README/landing polish, one-command install UX parity with `/skills`.
- Public-repo registry (`lib/public-repo-registry.ts`) — keep entries + descriptions in the sharpened voice.
- Dependency: align with `/skills` + `/ecosystem` copy.

## Tier 3 — Library / books

- The 17 `book/` collections — web reading experience: typography scale, mobile reader, progress, safe-area.
- Dependency: a shared reader layout; do once, apply across collections.

## Tier 4 — Design-system propagation

- Roll `@arcanea/design-system` tokens + the `components/premium/*` set to sibling apps so every property
  inherits the same motion + glass + type system. Dependency: Tier 0 patterns proven on arcanea.ai first.

---

_Each row is independently mergeable. Prefer small, verified PRs over one sweeping change._
