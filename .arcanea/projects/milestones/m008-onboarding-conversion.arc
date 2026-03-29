---
milestone: M008
title: Onboarding & Conversion
guardian: Maylinn
gate: Heart
priority: P0
progress: 90%
updated: 2026-03-30
---

# M008: Onboarding & Conversion

## Status: 90%

## Completed Tasks
- [x] Auth guard wired — redirects unauthenticated users (pre-2026-03-01)
- [x] 5-step wizard orchestrator working (Welcome -> Creator Type -> Guardian -> Creation -> Universe) (pre-2026-03-01)
- [x] Creation step wired to real AI — Google Gemini via Vercel AI SDK, /api/create edge runtime, 10s timeout, curated Guardian-specific mock fallback when API key absent (2026-03-10)
- [x] Saves to Supabase profile on completion (pre-2026-03-01)
- [x] Redirects to /dashboard after completion (pre-2026-03-01)
- [x] v0 premium onboarding components extracted (6 components in components/arcanea/) (2026-03-01)

## Remaining Tasks
- [ ] Activation loop analytics
  - **Blocked by**: None (can implement with Vercel Analytics or PostHog)
  - **Owner**: agent (Backend + DevOps)
  - **Estimate**: 3-4 hours
  - **Details**: Track conversion funnel — step completion rates, drop-off points, time-to-first-creation, 7-day retention. Instrument with custom events on each wizard step.
- [ ] Add loading.tsx to /onboarding
  - **Blocked by**: None
  - **Owner**: agent (Frontend)
  - **Estimate**: 15 min
- [ ] Add metadata via layout.tsx to /onboarding
  - **Blocked by**: None
  - **Owner**: agent (Frontend)
  - **Estimate**: 15 min

## Dependencies
- Depends on: M005 (Premium UI — v0 onboarding components)
- Blocks: None

## Key Files
- `apps/web/app/onboarding/page.tsx` — Onboarding wizard page
- `apps/web/components/arcanea/` — v0 onboarding step components (welcome, step2-5, orchestrator)
- `apps/web/app/api/create/route.ts` — AI creation API (edge runtime)
- `apps/web/app/dashboard/` — Post-onboarding landing

## Notes
The onboarding flow is functionally complete and connects to real AI generation. The main gap is analytics instrumentation to understand conversion metrics. The loading.tsx and metadata additions are quick wins that should be done in any polish pass. PostHog API key is in the setup backlog (see project_api_setup_backlog memory).
