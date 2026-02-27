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
progress: 60
tasks:
  - id: t001
    name: Configure Supabase Storage buckets
    status: done
    note: 3 buckets (avatars, creations, thumbnails) with RLS — migration 20250101000003
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
    note: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY → arcanea-ai-appx
  - id: t007
    name: Configure Supabase auth settings
    status: pending
    note: Site URL → arcanea.ai, redirect URL → /auth/callback
  - id: t008
    name: Test auth flow end-to-end
    status: blocked
    blocked_by: [t006, t007]
  - id: t009
    name: Disconnect orphan Vercel project
    status: pending
    note: Delete arcanea-ai-app (no x) — wastes build minutes
---

# M001 — Supabase Auth & Storage Wiring

Foundation milestone. Get auth working on the live site so creators can sign up, log in, and upload media.

## Context

Auth code exists but env vars are missing in Vercel. Storage buckets are fully configured with RLS policies. Upload API is wired. Just need the connection.

## Definition of Done

- [ ] Login works at arcanea.ai/auth/login
- [ ] Signup → email confirmation → callback redirect works
- [ ] File upload to /api/upload returns public URL
- [ ] Only arcanea-ai-appx builds on push (orphan removed)
