# Performance Audit
**Date**: 2026-03-30
**Baseline CWV**: homepage 35, chat 18, imagine 49

---

## Bundle Analysis

- **Total production dependencies**: 66
- **DevDependencies**: 3 (playwright, eslint, eslint-config-next)
- **Dynamic (`next/dynamic` or `lazy()`) imports in use**: 12 files
- **Client components in `app/` routes**: 286 files
- **Client components in `components/`**: 253 files

### Heavy Dependencies Identified

| Package | Approx. Bundle Size | Notes |
|---|---|---|
| `framer-motion` v11 | ~33KB (motion) / ~7KB (domAnimation) | See usage audit below |
| `@react-three/fiber` + `three` | ~600KB | Already lazy-loaded on /challenges only |
| `react-syntax-highlighter` | ~280KB | Already lazy-loaded in code-block.tsx |
| `@xyflow/react` | ~200KB | Used in /ecosystem, /architecture — not lazy-loaded |
| `gsap` + `@gsap/react` | ~120KB | Imported in design-lab 3D pages only |
| `lenis` | ~15KB | Listed in deps but no usage found — dead dependency |
| `@splinetool/react-spline` | ~300KB | Listed in deps; only a stub in design-labs — dead |
| `embla-carousel-react` | ~30KB | Used in landing pages |
| `@headlessui/react` | ~50KB | Found in auth components |
| `@fal-ai/client` | ~20KB | Used in imagine API |

### Framer-Motion Usage Audit

The codebase has a `lib/motion.tsx` utility that correctly sets up `LazyMotion + domAnimation` (~7KB) instead of the full `motion` bundle (~33KB). Compliance:

- **Compliant** (uses `m` + `LazyMotion`): navbar, v3-content (homepage), imagine/page, most landing components
- **Non-compliant** (uses full `motion` import): `hero-section.tsx`, `hero-v2.tsx`
  - **Impact**: Both files appear to be dead code — no active page imports them. Low priority.
- **Bug — missing `LazyMotion` context**: `chat-message.tsx` uses `m.div` without a `LazyMotion` ancestor
  - The chat layout (`app/chat/layout.tsx`) renders `children` in a plain div without LazyMotion
  - `chat-message.tsx` is only used in `chat-container.tsx` → `/chat-demo` route, NOT the main `/chat` page
  - **Fix applied**: Added `LazyMotion features={domAnimation}` wrapper in `chat-message.tsx`

---

## Image Audit

### Static Image Inventory (public/)

| Path | Size | Issue |
|---|---|---|
| `/public/images/luminors/` (20 files) | 17MB total, avg ~850KB each | Uncompressed JPGs — not served through next/image |
| `/public/images/forge/` (6 files) | 3.2MB total | PNGs — not served through next/image |
| `/public/brand/arcanea-hero.jpg` | 648KB | Used in v3 variations only (not homepage) |
| `/public/brand/arcanea-og.jpg` | 552KB | OG image — acceptable |
| Total `/public/` | 50MB | 17MB is luminor portraits alone |

### next/image Compliance

- **Homepage (`v3-content.tsx`)**: Uses `<Image>` from `next/image` with `priority` for the nav logo. Correct.
- **Hero variants (`hero-v3.tsx`)**: Uses `<Image priority>`. Correct.
- **Luminor detail pages**: Need to verify individual usage.
- **`<img>` tags found** (should be `<Image>`):
  - `app/leaderboard/page.tsx`
  - `app/opengraph-image.tsx` (server-side OG generation — acceptable)
  - `components/chat/tool-result-block.tsx`

### Images Not Served Through next/image

The 17MB of luminor portraits in `/public/images/luminors/` are likely loaded directly via `<img src="/images/luminors/...">` or CSS. If served through `next/image`:
- Automatic WebP/AVIF conversion on first request
- Responsive srcset generation
- Lazy loading by default
- Estimated saving: 70-85% file size reduction (avg ~150-200KB per image vs ~850KB)

---

## Top 10 Optimization Opportunities

| Priority | Fix | Impact | Effort | Files |
|---|---|---|---|---|
| 1 | Compress luminor portrait JPGs (squoosh/sharp) to WebP at 80% quality | High | Quick (CLI) | `public/images/luminors/*.jpg` — 17MB → ~2-3MB |
| 2 | Lazy-load `@xyflow/react` — it's a 200KB graph library used only on /ecosystem and /architecture pages | High | Quick | `app/ecosystem/page.tsx`, `app/architecture/page.tsx` |
| 3 | Remove `@splinetool/react-spline` from package.json — it's installed (~300KB) but only a stub exists | High | Quick | `package.json` — save the install + parsing cost |
| 4 | Remove `lenis` from package.json — imported but zero actual usage found in codebase | Medium | Quick | `package.json` |
| 5 | Add `<img>` → `<Image>` fix for `components/chat/tool-result-block.tsx` | Medium | Quick | One file |
| 6 | Lazy-load the Ecosystem constellation visualization (uses d3-like data structures) | Medium | Medium | `app/ecosystem/page.tsx` |
| 7 | Move `hero-section.tsx` and `hero-v2.tsx` to use `m` + `LazyMotion` (or delete if dead code) | Medium | Quick | `components/landing/hero-section.tsx`, `hero-v2.tsx` |
| 8 | Add `loading="lazy"` and explicit `width`/`height` to `<img>` in leaderboard page | Medium | Quick | `app/leaderboard/page.tsx` |
| 9 | Wrap `chat-container.tsx` (used in `/chat-demo`) with `LazyMotion` at the page level instead of per-component | Low | Quick | `app/(marketing)/chat-demo/page.tsx` |
| 10 | Audit Tailwind purge — with 286 client components in app/ there may be significant unused CSS | Low | Medium | `tailwind.config.ts` |

---

## Quick Wins Applied

| Fix | Files Changed | Estimated Savings |
|---|---|---|
| Added `LazyMotion features={domAnimation}` wrapper to `chat-message.tsx` — fixes silent animation failure on `/chat-demo` where `m.div` was used without a LazyMotion ancestor | `components/chat/chat-message.tsx` | Prevents full 33KB framer-motion bundle load on chat-demo; ensures animations actually work |

---

## Remaining Heavy Hitters

### Highest Impact (need more work)

**Luminor Image Compression** — 17MB of portrait JPGs is the single largest performance liability. These should be:
1. Converted to WebP at 80% quality (target: ~150-200KB each, down from ~850KB)
2. Confirmed to be loaded via `next/image` component (which auto-serves WebP/AVIF to supported browsers)
3. Given explicit `width` and `height` props to prevent CLS

Run: `npx sharp-cli -i public/images/luminors/*.jpg -o public/images/luminors/ -f webp -q 80`

**`@splinetool/react-spline` removal** — This ~300KB package is in `package.json` but only a text stub exists at `app/design-labs/3D-evolution/spline-preview.tsx`. Removing it from deps saves bundle parsing cost:
```
npm uninstall @splinetool/react-spline
```

**`lenis` removal** — Smooth-scroll library present in deps, zero import found in codebase:
```
npm uninstall lenis
```

**`@xyflow/react` lazy-loading** — The flow chart library is imported at top-level in ecosystem/architecture pages. Converting to `next/dynamic` with `ssr: false` would remove it from the initial bundle for those routes.

### Architecture-Level Concerns

- **286 client components in app/** is high. Many are likely `error.tsx` boundaries (which must be client) and legitimate interactive pages. However, there may be components that could be refactored to Server Components, reducing client-side JS shipped.
- **`framer-motion` in 90+ component files** — the `LazyMotion + domAnimation` approach is already in place and correct on all active routes. The dead `hero-section.tsx`/`hero-v2.tsx` files using full `motion` should be deleted to avoid confusion.
- **Chat page (score 18)** — The chat page already lazy-loads all heavy overlays (CommandPalette, ArtifactsPanel, BeamMode, ExportDialog, CreditBalance). The low score is likely TTFB-dominated (Supabase auth check + AI SDK initialization) rather than bundle-related. Investigate edge caching for the initial HTML.

---

## What is Already Working Well

- `next/image` with `priority` on homepage LCP element (nav logo + v3 hero)
- `next/font` with `display: swap` for all 4 fonts in root layout
- `react-syntax-highlighter` (~280KB) lazy-loaded — the previous fix is solid
- `@react-three/fiber` + `three` (~600KB) lazy-loaded on challenges page
- All heavy chat UI overlays use `next/dynamic { ssr: false }` with skeleton loaders
- `framer-motion` uses `LazyMotion + domAnimation` on all active routes
- `optimizePackageImports` in `next.config.js` configured for Radix UI, phosphor-icons, and framer-motion
- `images.formats: ['image/avif', 'image/webp']` configured — next/image will auto-serve AVIF/WebP
- Security headers configured on all routes
- `@next/bundle-analyzer` installed (use with `ANALYZE=true npm run build`)
