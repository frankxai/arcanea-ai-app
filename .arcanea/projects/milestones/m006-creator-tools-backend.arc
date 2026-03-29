---
milestone: M006
title: Creator Tools Backend
guardian: Draconia
gate: Fire
priority: P1
progress: 75%
updated: 2026-03-30
---

# M006: Creator Tools Backend

## Status: 75%

## Completed Tasks
- [x] Gallery social wired — like/comment components connected (pre-2026-03-10)
- [x] Studio image generation wired — AI generation API (pre-2026-03-10)
- [x] Code AI wired — code tab with AI assistance (pre-2026-03-10)
- [x] Save creations to Supabase — API routes `/api/studio/save` (images) + `/api/creations` (text/code) + `creation-service.ts` (pre-2026-03-10)
- [x] Prompt Books persistence — DB schema live (6 tables: pb_collections, pb_prompts, pb_tags, pb_prompt_tags, pb_prompt_versions, pb_templates), service layer + Zustand store + full UI (2026-03-10)
- [x] Reading progress tracking — DB table `reading_progress` live, `useReadingProgress` hook + `ReadingTracker` component + `ReadBadge` + collection progress bars all wired (2026-03-10)
- [x] Course system — 5 courses (Foundation, Flow, Fire, Voice, Vision), 20+ lessons, `/academy/courses` listing + `/academy/courses/[slug]` detail pages, JSON-LD, loading states, error boundaries, sitemap entries (2026-03-10)
- [x] /creations gallery page — user's saved creations display (2026-03-30)

## Remaining Tasks
- [ ] Gallery infinite scroll / pagination
  - **Blocked by**: None
  - **Owner**: agent (Frontend)
  - **Estimate**: 2-3 hours
- [ ] Gallery like/comment functionality fully wired to Supabase
  - **Blocked by**: M001 auth
  - **Owner**: agent (Backend + Frontend)
  - **Estimate**: 3-4 hours
- [ ] Gallery creator attribution system
  - **Blocked by**: M001 auth (needs user profiles)
  - **Owner**: agent (Backend + Frontend)
  - **Estimate**: 2-3 hours
- [ ] Studio version history
  - **Blocked by**: None
  - **Owner**: agent (Backend)
  - **Estimate**: 4-6 hours
- [ ] Studio collaboration features
  - **Blocked by**: M001 auth, version history
  - **Owner**: agent (Full-stack)
  - **Estimate**: 8-12 hours
- [ ] Studio export options
  - **Blocked by**: None
  - **Owner**: agent (Frontend)
  - **Estimate**: 2-3 hours

## Dependencies
- Depends on: M001 (Auth), M005 (Premium UI)
- Blocks: M007 (Community — needs creator tools for social features)

## Key Files
- `apps/web/app/api/studio/save/route.ts` — Studio image save API
- `apps/web/app/api/creations/route.ts` — Creations CRUD API
- `apps/web/lib/services/creation-service.ts` — Creation service layer
- `apps/web/app/creations/` — Creations gallery page
- `apps/web/app/academy/courses/` — Course system pages
- `apps/web/lib/hooks/useReadingProgress.ts` — Reading progress hook
- `apps/web/components/` — ReadingTracker, ReadBadge components

## Notes
The creation pipeline core is built — users can generate AI content and save it to Supabase. The course system is fully functional with 5 courses. The remaining work focuses on social features (gallery interactions), version control, and collaboration — all P2 features that enhance but don't block the core creator experience.
