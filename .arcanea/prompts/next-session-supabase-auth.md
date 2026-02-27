# Next Session Prompt — Supabase Auth Wiring

> Paste this into your first message when Supabase MCP is configured.

---

## Prompt

I've added the Supabase MCP. Here's what needs to happen this session:

### 1. Verify Supabase Project
- Use Supabase MCP to confirm the project exists and is healthy
- Check that the 3 storage buckets exist: `avatars`, `creations`, `thumbnails`
- Verify the auth schema and RLS policies from `supabase/migrations/20250101000003_storage_buckets.sql`

### 2. Wire Auth to Vercel (CRITICAL)
Auth is currently broken because env vars are missing on the **live** Vercel project.

**Live project**: `arcanea-ai-appx` (prj_bg70JJwiuYTOyP1oX2ddiatX1O95) → `arcanea.ai`
**NOT**: `arcanea-ai-app` (orphan duplicate, wastes build minutes)

Add these env vars to `arcanea-ai-appx` via Vercel MCP or dashboard:
- `NEXT_PUBLIC_SUPABASE_URL` → from Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → from Supabase project API keys
- `SUPABASE_SERVICE_ROLE_KEY` → from Supabase project API keys (secret, server-only)

### 3. Configure Supabase Auth Settings
- **Site URL**: `https://arcanea.ai`
- **Redirect URLs**: Add `https://arcanea.ai/auth/callback`
- **Email confirmations**: Already enabled in `supabase/config.toml`
- Verify Google/GitHub OAuth providers if configured

### 4. Trigger Vercel Redeploy
After env vars are set, trigger a production redeploy of `arcanea-ai-appx` so the `NEXT_PUBLIC_` vars get baked into the client bundle.

### 5. Commit Pending Changes
These 4 changes from last session are uncommitted:
- Removed `@vercel/blob` from `apps/web/package.json`
- Created `apps/web/app/api/upload/route.ts` (Supabase Storage upload API)
- Converted `apps/web/app/records/page.tsx` to `next/image`
- Updated `apps/web/.env.example` with Supabase Storage docs

### 6. Clean Up Orphan Vercel Project
- Disconnect or delete `arcanea-ai-app` (NO x) — it builds from the same repo and wastes build minutes
- Only `arcanea-ai-appx` should remain

### 7. Test Auth Flow
After redeploy:
- Visit `https://arcanea.ai/auth/login` — should show login form (not "not configured" error)
- Test signup → email confirmation → callback redirect
- Test the upload API at `/api/upload` (requires auth)

### Context
- Tech stack: Next.js 16, React 19, Supabase, Vercel
- Auth code: `apps/web/app/auth/login/page.tsx`, `signup/page.tsx`, `callback/route.ts`
- Middleware: `apps/web/middleware.ts` protects `/chat`, `/profile`, `/studio`, `/onboarding`
- Server client: `apps/web/lib/supabase/server.ts`
- Env helper: `apps/web/lib/supabase/env.ts`
