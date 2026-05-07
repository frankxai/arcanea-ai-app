# P5 — Live Website Audit (arcanea.ai)

**URL:** https://arcanea.ai/
**Method:** WebFetch + raw curl + heuristic regex on HTML
**Date:** 2026-05-06 evening
**Note:** Lighthouse + axe + PSI not run (no API key handy). Findings below are static-analysis grade.

## What's working

| Signal | State | Evidence |
|---|---|---|
| HTTP 200 (after redirect) | ✅ | `arcanea.ai` 307→`www.arcanea.ai` 200 |
| `<title>` | ✅ | "Arcanea™ — Creative Intelligence Platform" |
| Meta description | ✅ | Present, 195 chars, descriptive |
| OpenGraph tags | ✅ | 11 og:* tags including image (1200px), url, site_name, locale=en_US |
| Twitter card | ✅ | 8 twitter:* tags |
| `<link rel="canonical">` | ✅ | https://arcanea.ai |
| JSON-LD structured data | ✅ | 2 blocks present |
| `<html lang="en">` | ✅ | Set correctly |
| Sitemap.xml | ✅ | 154 URLs, well-categorized, lastmod 2026-05-03 |
| robots.txt | ✅ | Sane, blocks /api, /dashboard, /auth, /onboarding, /command, /private |
| Image lazy loading | ✅ | 5 of 6 images use `loading="lazy"` |
| Resource preload | ✅ | 9× preload, 2× preconnect |
| Next.js streaming | ✅ | 14 markers — RSC + streaming working |
| Hero copy & H1 | ✅ | "What will you create?" + clear creator-focused value prop |
| Navigation IA | ✅ | 5 sections (Create, Explore, Learn, Blog, Pricing) |
| Footer mentions sovereignty | ✅ | "Keep your keys / Keep your IP / Open source (MIT) / No vendor lock-in" |

## Gaps (priority-ordered)

### P0 — observability silent in prod
**No analytics or RUM detected** in the homepage HTML (no PostHog, Plausible, Vercel Analytics, GA, Sentry, Segment). Memory `project_api_setup_backlog` confirms "code installed, needs API keys (30 min)." 

**Implication:** Right now you cannot answer:
- "How many people visited today?"
- "What's our actual LCP/CLS in the wild?"
- "Where did the last error come from?"
- "Which pages drive engagement?"

Until at least one analytics tool is wired with real keys, all decisions are vibes-based.

**Fix:** Vercel Speed Insights + Vercel Analytics are 1-line `<SpeedInsights />` + `<Analytics />` components — should already be deployed if `apps/web/app/layout.tsx` includes them. Verify and wire keys.

### P1 — i18n alternates missing
You merged i18n Phase 2A foundation (`@starlight/multilingual` with en+de) but the live page has **0 `<link rel="alternate" hreflang>` tags**.

**Implication:** Google can't discover the German variants. All the i18n routing work is invisible to search. Spanish (Las Tierras) work also affected.

**Fix:** Verify `apps/web/app/[locale]/layout.tsx` (or wherever) emits `<link rel="alternate">` per locale via `metadata.alternates.languages`. Likely a 5-line fix.

### P2 — TTFB 1.14s is slow for Vercel
Cold-start TTFB at 1.14s. Vercel/Next.js homepage on Fluid Compute should be ~200-400ms with ISR or `force-static` for an above-the-fold marketing page.

**Implication:** Lighthouse Performance score will struggle to break 90 on cold visitors. Memory says baseline was 35 for homepage in 2026-03-27.

**Fix:** Check if homepage uses `export const dynamic = 'force-static'` or has ISR `revalidate`. If the homepage does live data fetching, refactor to streaming with cached primitives. Refer to `vercel:next-cache-components` skill — exactly this problem.

### P3 — `arcanea.ai` 307 → `www.arcanea.ai`
Bare-domain visitors pay an extra ~290ms before the real page. Either:
- Configure www→bare redirect in Vercel domain settings (more common pattern), OR
- Eat the redirect but make sure HSTS preload includes both

**Fix:** 1 setting in Vercel project. Pick a canonical (www or bare) and 301 the other. Currently using 307 (temporary), should be 301 (permanent).

### P4 — A11y baseline gaps (heuristic)
- 0 skip-links — keyboard users land on full nav every page
- Only 7 `aria-label` and 0 `aria-labelledby` for what looks like a complex 154-page app — almost certainly under-labeled
- 3 `role=` attributes — sparse

**Fix:** Run `axe-core` against homepage + 5 representative pages, ship a single PR closing the top 10 violations. The `accessibility-auditor` agent in your fleet is built for this.

### P5 — Document size 98.9 KB initial HTML
~100 KB of streaming HTML before client JS executes. Reasonable for a hydrated Next.js page but worth checking if any of it is repeated or could be deferred.

### P6 — Sitemap missing alternates + missing language sub-trees
Sitemap has 154 URLs, all 2026-05-03 lastmod. But:
- No `<xhtml:link rel="alternate" hreflang>` per URL (Google's strong recommendation for multilingual sites)
- Spanish and German URL trees not present despite books shipping in those languages

**Fix:** Update sitemap generation to emit alternates and to include /de/* and /es/* trees as they go live.

## Quick CWV self-check (proxy signals)

Without a Lighthouse run, indirect signals:
- TTFB 1.14s → **LCP at risk** (likely 2.5-4s, measurable orange)
- 9 preloads + 2 preconnects → **good for FCP**
- 5/6 lazy images → **good for CLS**
- Next.js streaming → **good for INP**
- 98.9 KB initial HTML + presumed JS bundle → **need to verify total transfer**

Recommendation: run PageSpeed Insights against `https://arcanea.ai/` and the 5 highest-traffic interior URLs (chat, worlds, library, /imagine, the most-visited book page). Memory baseline 2026-03-27: home 35, chat 18, imagine 49 — so the budget exists, just hasn't been re-measured.

## Copy & voice spot-check

H1 "What will you create?" is strong — direct, generative, in voice. Hero strapline "Type one sentence. Get a world — characters, locations, lore, music — all connected, all yours." excellent.

**Concerns:**
- 16 AI specialist partners — was this updated when you went from 7-character crew to expanded fleet? Verify the count is current.
- Footer says "190K+ words of creative philosophy" — matches a memory I found, but should it be updated as books ship? "260K+" was mentioned in `project_overnight_bestseller_session`.
- "MIT-licensed open-source components" — make sure this matches actual LICENSE files in repos.

## Status: P5 COMPLETE
