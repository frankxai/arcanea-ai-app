---
milestone: M009
title: Performance & Production Polish
guardian: Elara
gate: Starweave
priority: P1
progress: 99%
updated: 2026-03-30
---

# M009: Performance & Production Polish

## Status: 99%

## Completed Tasks
- [x] Error boundaries added (error.tsx on key routes) (2026-03-01)
- [x] LazyMotion domAnimation migration: only 3 files legitimately need domMax (navbar, profile-view, how-it-works — all use layoutId). All others converted to domAnimation. (2026-03-10)
- [x] `as any` casts removed from council service (proper typed Supabase) (2026-03-10)
- [x] SEO metadata verified on all key pages — added metadata to /lore + /library layouts (2026-03-10)
- [x] Accessibility fixes: chat textarea aria-label, opengraph image alt text, proper heading hierarchy verified (2026-03-10)
- [x] next.config.js hardened (wildcard image hostname removed, AVIF/WebP, poweredByHeader: false) (2026-03-10)
- [x] Security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) (2026-03-01)
- [x] Anti-slop audit: 9 banned patterns verified ZERO across apps/web/ (2026-03-10)
- [x] Luminor count alignment: 10 -> 16 across all user-facing surfaces (2026-03-10)
- [x] Canon fix: Maylinn element Wind -> Air, personality aligned with Heart Gate (2026-03-10)
- [x] SEO: removed duplicate JSON-LD from root layout (2026-03-10)
- [x] SEO: fixed 74 double-branded page titles ("X | Arcanea | Arcanea" -> "X | Arcanea") (2026-03-10)
- [x] SEO: added metadata layouts for blog posts (2026-03-10)
- [x] WCAG: aria-labels on chat send/dismiss/scroll buttons (2026-03-10)
- [x] WCAG: aria-labels on studio toolbar buttons (5), textareas (4), inputs (2), icon buttons (5) (2026-03-10)
- [x] Profile layout.tsx added with metadata (2026-03-10)
- [x] Chat stream parser: fixed Vercel AI SDK 0:"" protocol display bug on /chat (2026-03-10)
- [x] Pricing comparison table: 10->16 Luminors for Creator/Studio (2026-03-10)
- [x] About page metadata: Ten->Sixteen intelligences (4 places) (2026-03-10)
- [x] Welcome/onboarding/contact/v4 copy: Ten->Sixteen intelligences (2026-03-10)
- [x] FAQ: fixed Spark plan (2 Luminors/50 msgs -> 3/100), Studio plan description accuracy (2026-03-10)
- [x] Contact FAQ: accurate pricing info, Apprentice to Luminor rank (2026-03-10)
- [x] Academy: Gate 10 Godbeast Amaterasu->Source (canonical fix) (2026-03-10)
- [x] domMax->domAnimation: 10+ components converted (~8kB/route savings) (2026-03-10)
- [x] WCAG 2.4.7 focus rings: added focus:ring-2 to 10+ inputs across FAQ, chat, companions, blog, hub, changelog, character-book, council (2026-03-10)
- [x] WCAG 1.3.1 aria-labels: 5 unlabeled search/email inputs (2026-03-10)
- [x] Dead code: removed duplicate Inter font load, unused navigation.tsx (2026-03-10)
- [x] Manifest path: /site.webmanifest -> /manifest.webmanifest (2026-03-10)
- [x] Server component conversion: roadmap, arcanea-vault, arcanea-os (removed "use client" + artificial delays) (2026-03-10)
- [x] Removed artificial 800ms loading delay from contact page (2026-03-10)
- [x] Deep count sweep: 10->16 Luminors/intelligences across 15+ files (2026-03-10)
- [x] Anti-slop: all banned phrases verified zero (2026-03-10)
- [x] Error boundaries: added error.tsx to activity, dashboard, community, imagine, companions, discover, feedback, lore, profile, prompt-books, settings (2026-03-10)
- [x] Metadata: added layout.tsx with metadata for chat-demo, components pages (2026-03-10)
- [x] Broken link: /community/create/new -> /studio (2026-03-10)
- [x] WCAG: role="alert" on chat error banner, aria-live="polite" on message container (2026-03-10)
- [x] WCAG focus rings: completed all bare focus:outline-none — 21 files fixed (2026-03-10)
- [x] Naming v2 sweep: Luminor->companion on 13 first-contact surfaces (2026-03-10)
- [x] Gallery cleanup: removed LuminorShowcase, deleted luminor-agents.ts, CDN-only images (2026-03-10)
- [x] Deleted dead files: home-content.tsx, gallery/luminors/page.tsx (2026-03-10)
- [x] Icon barrel removal: 4.5MB savings by eliminating barrel re-export (2026-03-27)
- [x] Syntax highlighter lazy-loading (2026-03-27)
- [x] next/image for homepage (2026-03-27)
- [x] React.memo on MessageBubble, ThinkingSection, ImageGrid (2026-03-30)
- [x] Ops Center dashboard built (2026-03-30)
- [x] Component library added for ops (2026-03-30)
- [x] Intelligence system fixes (2026-03-30)
- [x] Statusline v6 fixed (2026-03-30)
- [x] ACOS v11 installed (2026-03-30)
- [x] Bootstrap hook upgraded to v3 (2026-03-30)
- [x] .arcanea/ directories scaffolded (12 directories) (2026-03-30)
- [x] Pickup Plan created (2026-03-30)
- [x] Session Intelligence System (SIS) operational (2026-03-30)

## Remaining Tasks
- [ ] Core Web Vitals audit (Lighthouse)
  - **Blocked by**: Cannot run Lighthouse locally in WSL2; needs browser-based or CI audit
  - **Owner**: agent (DevOps) or human (Chrome DevTools)
  - **Estimate**: 1-2 hours
  - **Details**: CWV baseline scores (from memory): homepage 35, chat 18, imagine 49. Need to re-measure after recent optimizations (icon barrel removal, lazy-loading, React.memo).

## Dependencies
- Depends on: M005 (Premium UI), M008 (Onboarding)
- Blocks: None (polish milestone)

## Key Files
- `apps/web/next.config.js` — Security headers, image optimization config
- `apps/web/app/` — error.tsx files across routes
- `apps/web/components/` — LazyMotion wrappers, focus ring fixes
- `apps/web/app/ops/` — Ops Center dashboard

## Notes
This milestone is effectively complete at 99%. The only remaining item is a Core Web Vitals audit using Lighthouse, which requires a browser environment. All code-level performance, accessibility, SEO, and quality improvements have been shipped. Recent additions (2026-03-27 to 2026-03-30) include significant bundle size reductions (4.5MB icon barrel removal), React.memo optimizations, and operational tooling (Ops Center, SIS, ACOS v11).
