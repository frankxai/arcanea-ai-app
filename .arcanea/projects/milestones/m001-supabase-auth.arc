---
milestone: M001
title: Supabase Auth & Storage
guardian: Lyssandria
gate: Foundation
priority: P0
progress: 90%
updated: 2026-03-30
---

# M001: Supabase Auth & Storage

## Status: 90%

## Completed Tasks
- [x] Auth context implementation (date: pre-2026-03-01)
- [x] OAuth providers (Google + GitHub) (date: pre-2026-03-01)
- [x] Auth callback route (date: pre-2026-03-01)
- [x] Profile bootstrap on first login (date: pre-2026-03-01)
- [x] Middleware for protected routes (date: pre-2026-03-01)
- [x] Protected route definitions (date: pre-2026-03-01)
- [x] RLS policies for all tables (date: pre-2026-03-01)
- [x] Set 3 env vars on Vercel project `arcanea-ai-appx` (2026-03-10)
- [x] Sync repos — arcanea-records to arcanea-ai-app lean-prod branch (2026-03-10)
- [x] Migrate legacy API routes — lib/supabase.ts deleted, 0 imports remain (2026-03-01)
- [x] DB tables created: profiles, creations, reading_progress, pb_* (Prompt Books), chat_sessions, luminor_councils, activity_log (2026-03-10)

## Remaining Tasks
- [ ] Supabase Dashboard config (15 min)
  - **Blocked by**: Admin access to Supabase Dashboard
  - **Owner**: human
  - **Estimate**: 15 min
  - **Details**: Site URL -> `https://arcanea.ai`, add redirect URL `https://arcanea.ai/auth/callback`, enable Google + GitHub OAuth providers
- [ ] E2E auth test — verify full flow on production
  - **Blocked by**: Supabase Dashboard config (above)
  - **Owner**: agent (Playwright)
  - **Estimate**: 30 min

## Dependencies
- Depends on: None
- Blocks: M002 (Cloudflare Stream), M006 (Creator Tools Backend), M007 (Community & Social)

## Key Files
- `apps/web/lib/supabase/` — Supabase client utilities
- `apps/web/app/auth/callback/route.ts` — OAuth callback handler
- `apps/web/middleware.ts` — Auth middleware
- `apps/web/lib/services/` — Service layer using Supabase

## Notes
All code is complete. The two remaining items are admin-only tasks that require manual Supabase Dashboard configuration and production E2E verification. This milestone is functionally complete from a code perspective.

## GitHub Issues
- [#1](https://github.com/frankxai/arcanea-ai-app/issues/1)
- [#4](https://github.com/frankxai/arcanea-ai-app/issues/4)
- [#6](https://github.com/frankxai/arcanea-ai-app/issues/6)
