---
id: M009
title: Performance & Production Polish
guardian: Elara
gate: Shift
priority: P1
status: planned
progress: 0
created: 2026-03-01
target: 2026-03-22
tags: [performance, seo, accessibility, polish]
depends_on: [M005, M008]
---

# M009: Performance & Production Polish

> Ship quality. Every page must be fast, accessible, and delightful.

## Tasks

### T1: Core Web Vitals
- [ ] Lighthouse audit all Tier 1 pages (target: 90+ all categories)
- [ ] Image optimization (next/image, WebP, lazy loading)
- [ ] Font optimization (display: swap, subset)
- [ ] Bundle analysis + code splitting
- [ ] Remove unused dependencies

### T2: SEO & Discoverability
- [ ] Structured data (JSON-LD) for all content pages
- [ ] Open Graph images (auto-generated per page)
- [ ] Sitemap completeness check
- [ ] robots.txt review
- [ ] Canonical URLs for duplicate content

### T3: Accessibility
- [ ] WCAG 2.2 AA audit
- [ ] Keyboard navigation on all interactive elements
- [ ] Screen reader testing (NVDA/VoiceOver)
- [ ] Color contrast validation (cosmic theme challenge)
- [ ] Focus indicators visible on glass backgrounds

### T4: Error Handling
- [ ] Custom 404 page (Arcanea themed)
- [ ] Custom 500 page
- [ ] API error boundaries with retry
- [ ] Offline fallback (service worker)

### T5: Production Hardening
- [ ] Rate limiting on all API routes
- [ ] CSRF protection
- [ ] Content Security Policy headers
- [ ] Input sanitization audit
- [ ] Supabase RLS final review

### T6: Cleanup
- [ ] Prune 15+ redirect-only pages
- [ ] Remove unused components
- [ ] Consolidate duplicate utilities
- [ ] TypeScript strict mode: resolve remaining `any` types
