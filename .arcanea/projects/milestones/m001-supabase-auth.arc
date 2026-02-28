---
type: milestone
id: m001-supabase-auth
project: arcanea
name: Supabase Auth & Storage Wiring
status: in_progress
gate: foundation
guardian: Lyssandria
element: earth
priority: P0
created: 2026-02-27
target: 2026-03-03
progress: 71
tasks:
  - id: t001
    name: Configure Supabase Storage buckets
    status: done
    note: 4 buckets (avatars, creations, thumbnails, arcanea-gallery) with RLS
  - id: t002
    name: Create upload API route
    status: done
    note: apps/web/app/api/upload/route.ts — wired to creations bucket
  - id: t003
    name: Convert images to next/image
    status: done
    note: records/page.tsx — 6 images converted, fill + sizes
  - id: t004
    name: Remove @vercel/blob
    status: done
    note: Unused dependency removed from package.json
  - id: t005
    name: Update .env.example
    status: done
    note: Documented Supabase Storage buckets, removed R2/S3 references
  - id: t006
    name: Add Supabase env vars to Vercel
    status: pending
    note: NOT SET — auth fails silently on production. See GitHub issue #4
  - id: t007
    name: Database foundation (7 tables, RLS, triggers)
    status: done
    note: arcanea_foundation migration + fix_function_search_path + like_count_sync + optimize_rls_initplan
  - id: t008
    name: TypeScript types + services layer
    status: done
    note: Auto-generated types, 5 services (profile, creation, like, follow, activity), API response types
  - id: t009
    name: Auth system SSR migration
    status: done
    note: AuthProvider → useRef pattern, profile-bootstrap fixed, middleware configured
  - id: t010
    name: Profile system (view + edit + avatar upload)
    status: done
    note: /profile redirect, /profile/[username] with real data, /profile/edit with avatar upload
  - id: t011
    name: Collection API routes
    status: done
    note: CRUD + items — 3 new route files
  - id: t012
    name: Settings + Activity + Chat auth + Onboarding persistence
    status: done
    note: 4 agent deliverables — real pages replacing stubs
  - id: t013
    name: Sync repos (arcanea-records → arcanea-ai-app)
    status: pending
    note: Vercel watches arcanea-ai-app but we push to arcanea-records — changes not deploying
  - id: t014
    name: Migrate 11 API routes to SSR-safe Supabase client
    status: pending
    note: bonds/*, collections/*, creations/*, profile/* still use old @/lib/supabase singleton
  - id: t015
    name: Configure OAuth providers (Google + GitHub)
    status: pending
    note: Zero providers configured in Supabase dashboard
  - id: t016
    name: Test auth flow end-to-end on arcanea.ai
    status: blocked
    blocked_by: [t013, t014, t015]
  - id: t017
    name: Disconnect orphan Vercel project
    status: pending
    note: Delete arcanea-ai-app (no x) — wastes build minutes
---

# M001 — Supabase Auth & Storage Wiring

Foundation milestone. Get auth working on the live site so creators can sign up, log in, and upload media.

## Context (Updated Feb 27)

Massive progress this session: 7 tables, full RLS, 5 services, profile system, settings, activity feed, chat auth, onboarding persistence. The code layer is 90% done. What remains is deployment plumbing (repo sync, SSR migration) and configuration (OAuth providers).

## Definition of Done

- [ ] Login works at arcanea.ai/auth/login
- [ ] Signup → email confirmation → callback redirect works
- [ ] OAuth (Google + GitHub) works
- [ ] File upload to /api/upload returns public URL
- [ ] All API routes use SSR-safe Supabase client
- [ ] Only arcanea-ai-appx builds on push (orphan removed)

## Blocker

Repo misalignment: `arcanea-records` (where we push) vs `arcanea-ai-app` (where Vercel deploys from). Must fix before anything deploys.
