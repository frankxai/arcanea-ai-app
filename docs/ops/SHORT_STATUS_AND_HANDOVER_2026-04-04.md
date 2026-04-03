# Short Status And Handover - 2026-04-04

## Session: A6 Deploy — Imagine UX + Deploy Crisis

## What Landed (on main)
- `0bc22283` fix(deploy): clear Vercel build cache + restore --webpack for 16.1.1
- `83a1ca45` feat(api): MCP Bridge — REST endpoint for MCP tool logic
- `659a9d91` fix(deploy): prerenderEarlyExit false
- `aa22911e` fix(deploy): remove --webpack from vercel.json
- `78595f85` fix(deploy): force Next.js 16.1.1 via pnpm override
- `7a5c029e` fix(deploy): remove custom global-error.tsx
- `41c81b7a` fix(deploy): nuke ALL generateStaticParams + force-dynamic everywhere
- `5116bbb8` fix(build): resolve Next.js 16 workStore invariant — force-dynamic + remove yaml
- `61b6c79e` fix(build): remove generateStaticParams from all content pages
- `aed01680` fix(build): remove js-yaml 3 custom engine from gray-matter
- `46c921f0` feat(imagine): Grok-inspired UX overhaul — floating input, resilient fallback
- `7ee39bf4` fix(build): convert all require('gray-matter') to ESM import

## What Changed This Session
- **Imagine page full rewrite** — Grok-inspired floating bottom input bar, featured templates, Image/Video + Speed/Quality toggles
- **Provider fallback chain fixed** — OpenRouter (first) -> Grok -> Gemini, any error cascades to next
- **Quality/Speed model mapping** — Speed uses Gemini Flash, Quality uses Gemini Pro
- **gray-matter ESM migration** — all require() converted to import
- **generateStaticParams removed** from ALL pages (8 files)
- **force-dynamic added** to all dynamic route pages
- **global-error.tsx deleted** (caused workStore crash)
- **Next.js 16.1.1 pinned** via pnpm override in root package.json
- **VERCEL_FORCE_NO_BUILD_CACHE=1** added to vercel.json build env

## Current Blockers

### CRITICAL: Vercel Deploy Broken (20+ consecutive ERROR deploys)
- **Root cause**: Next.js workStore invariant crash during static page prerendering
- **Why**: pnpm on Vercel resolves Next.js 16.2.2 despite 16.1.1 pin (lockfile not honored with --no-frozen-lockfile)
- **Local build passes** — the code is fine, only Vercel's build environment differs
- **Production still live** — last READY deploy (dpl_FGPTrmPPk4pXHaCY8wS8VmqAXPAY) is still serving arcanea.ai
- **Vercel CLI deploy blocked** — EBUSY file lock from other Claude sessions having handles open

### What's Been Tried (all failed on Vercel)
1. force-dynamic on all pages
2. Removed ALL generateStaticParams
3. ESM imports for gray-matter
4. Next.js 16.1.1 pin (package.json + lockfile + pnpm override)
5. standalone output mode
6. Turbopack mode (no --webpack)
7. prerenderEarlyExit: false
8. Removed global-error.tsx
9. VERCEL_FORCE_NO_BUILD_CACHE=1
10. Vercel CLI deploy (EBUSY lock)

### What Hasn't Been Tried
1. **Vercel Dashboard**: Settings > General > Build Cache > Clear — manual action
2. **Vercel Redeploy**: Dashboard > Deployments > last READY > Redeploy (without cache)
3. **vercel deploy --prod** from a CLEAN machine (no file locks)
4. **Frozen lockfile**: Change installCommand to `pnpm install --frozen-lockfile`
5. **Revert to last READY commit** (a7096bc) and cherry-pick imagine changes only

## Recommended Next Stack

### Priority 0: Fix Deploy (blocks everything)
1. Open Vercel Dashboard, clear build cache
2. Change installCommand in vercel.json to `pnpm install --frozen-lockfile`
3. Push and monitor — if 16.1.1 is in the lockfile, frozen-lockfile will use it
4. If still failing: revert to commit a7096bc (last READY), cherry-pick imagine changes

### Priority 1: Imagine Page Polish (after deploy works)
1. Test live on desktop + mobile
2. Verify OpenRouter image generation works on production
3. Compare UX with grok.com/imagine — iterate on template cards, loading states
4. Add community discover feed (gallery of generated images)

### Priority 2: AI Ops Architecture
1. Establish session naming convention (A1-A7+)
2. Create /arcanea-deploy skill that checks build before pushing
3. Add pre-push hook that runs `next build --webpack` locally
4. Implement branch protection — no direct push to main from agents
5. Create deploy-health monitoring loop

### Priority 3: Imagine Page Evolution
1. Video generation mode wiring (mode toggle exists but not connected)
2. Style presets integration with the floating bar
3. Gallery/discover section with saved community images
4. Mobile-first responsive polish

## Slash Commands for Next Session
```
/arcanea-deploy    — Deploy workflow (verify build, push, monitor Vercel)
/arcanea-build     — Diagnose and fix build errors
/arcanea-dev       — Full dev team activation
/status            — Quick repo status dashboard
/ao                — Arcanea Orchestrator ops dashboard
/handover          — Write session handover
/loop 5m /status   — Monitor deploy every 5 minutes
```

## Verification Evidence
- **TypeScript check**: PASSED (0 errors in imagine files)
- **Local build** (`next build --webpack`): PASSED (exit code 0)
- **API test**: Image generation via OpenRouter WORKS (19s, Gemini 3.1 Flash)
- **Dev server**: HTTP 200 on /imagine, all UI elements render
- **Vercel deploy**: 20+ ERROR deploys (workStore invariant, Vercel-specific)
- **Production**: LIVE on last READY deploy (a7096bc, Next.js 16.1.1)
