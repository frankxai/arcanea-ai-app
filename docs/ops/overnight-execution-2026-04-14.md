# Overnight Autonomous Execution Plan — 2026-04-14

> Copy this entire file as a prompt into a new Claude Code session.
> Run with: `cla --dangerously-skip-permissions`

---

## Context

You are continuing Session A1's work on the Arcanea platform (arcanea.ai). The site is live and healthy — 32/32 public routes return 200. The blueprint showcase, Starlight Vault constellation, motion primitives library, and sovereignty positioning are all shipped.

**Working directory:** `C:\Users\frank\Arcanea`
**Git remote:** `origin` → `frankxai/arcanea-ai-app` (production)
**Branch:** `main`
**Deploy:** Vercel auto-deploys on push to main

Read CLAUDE.md and .claude/CLAUDE.md first. Read `feedback_design_tier.md` from memory for design standards.

## Rules (Non-Negotiable)

- NEVER `git add .` — stage specific files only
- NEVER add Co-Authored-By claude-flow/ruvnet
- NEVER use Cinzel font
- NEVER create files unless absolutely necessary
- ALWAYS `pnpm --dir apps/web run build` after code changes
- ALWAYS push to `origin` (never `records` or `oss`)
- Files under 500 lines
- Use motion primitives from `components/motion/` (SplitText, TiltCard, GlowCard, LiquidGlass, Magnetic, Reveal, etc.)
- Use EASE curves from `lib/motion.tsx` (never default easeOut)
- No fantasy-game language in product UX

## Phase 1: API Security Hardening (Priority 0)

**Problem:** 162 API route files, only 15 have rate limiting. The rest are wide open.

**Fix strategy:** Not every route needs rate limiting. Focus on the expensive/abusable ones:

### Must rate-limit (costs money or resources):
```
app/api/ai/chat/          — DONE (30/min)
app/api/ai/research/      — DONE (5/min)
app/api/ai/speak/         — DONE (10/min)
app/api/ai/transcribe/    — DONE (5/min)
app/api/ai/generate-image/ — Has auth + credits
app/api/ai/generate-video/ — Has auth + rate limit
```

### Should rate-limit (free but abusable):
```
app/api/search/web/       — web search (costs per query)
app/api/models/openrouter/ — external API call
app/api/subscribe/        — email collection
app/api/feedback/         — spam vector
app/api/contact/          — spam vector
```

### Pattern to apply:
```typescript
import { getClientIdentifier, checkRateLimit } from '@/lib/rate-limit/rate-limiter';
const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rl = checkRateLimit(clientId, RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) } }
    );
  }
  // ... existing handler
}
```

Add rate limiting to the 5 "should rate-limit" routes above. Build verify after each batch.

### Remove console.log from production:
- `app/api/credits/webhook/route.ts` — replace console.log with structured error only
- `app/api/feedback/route.ts` — remove console.log

## Phase 2: Book Content Integration (Priority 1)

**Problem:** 17 book collections in `/book/` but most content isn't surfaced on the web UI.

### Tasks:
1. Check how many collections actually load via `getCollections()` from `lib/content/`
2. Verify the `/library` page shows all 17 collections
3. Check if `/books` page links to the saga reader correctly
4. Verify the new "Song of Van Linh" book renders at `/books/song-of-van-linh`
5. Run a broken-link check on all `/books/*` and `/library/*` routes

### If collections are missing:
- Check `book/` directory for frontmatter issues
- Ensure `lib/content/index.ts` scans all collections
- Add missing collections to the library browse page

## Phase 3: Template Package Extraction (Priority 2)

**Goal:** Extract the Cosmic Landing template into a standalone repo.

### Steps:
1. Create repo `frankxai/cosmic-landing-template` on GitHub
2. Extract these files into it:
   - `components/motion/` (all 12 primitives)
   - `components/ui/button.tsx`, `card.tsx`, `skeleton.tsx`
   - `lib/motion.tsx` (easing + spring configs)
   - `packages/arcanea-design-preset.js` (Tailwind preset)
   - A new `app/page.tsx` that demonstrates the primitives
   - `tailwind.config.ts` with the preset
   - `package.json` with just the needed deps
   - `.env.example` (empty — no API keys needed)
   - `README.md` with setup instructions
3. Add Vercel Deploy button to README
4. Link from the `/templates` page on arcanea.ai
5. Push and verify deploy works

## Phase 4: Design Polish Pass (Priority 2)

### Homepage mobile audit:
- Test `/` at 375px viewport
- Check that SplitText doesn't overflow on mobile
- Verify Marquee doesn't cause horizontal scroll
- Check touch targets are 44px+

### Fix any remaining broken images:
- Run: `grep -rn '<img ' apps/web/app/ apps/web/components/ | grep -v 'node_modules'`
- Replace any raw `<img>` with `next/image`

### Gallery companion cards:
- Verify TiltCard + LiquidGlass renders correctly on gallery cards
- Check that the glass sheen effect works on mobile (backdrop-filter can be heavy)

## Phase 5: Documentation (Priority 3)

### Update `/ecosystem` page data:
- Count current repos: `gh repo list frankxai --limit 100 --json name | jq length`
- Update the "27 repos" number if it's changed
- Update LOC counts on `/templates` if significant code was added

### Create `/docs/getting-started` if it doesn't exist:
- Quick-start guide for developers who want to fork Arcanea
- Link to from `/templates` page
- Cover: clone, install, env setup, dev server, first customization

## Phase 6: Commit Strategy

Commit after each phase:
1. `fix(security): rate-limit 5 public API routes + remove console.log`
2. `fix(content): wire all 17 book collections to library`
3. `feat(templates): extract cosmic-landing standalone template`
4. `fix(mobile): homepage + gallery mobile polish`
5. `docs(getting-started): developer quick-start guide`

Push after each commit. Verify build passes before each push.

## Phase 7: Validation

After all phases:
```bash
# Full route check
for route in / /chat /worlds /gallery /imagine /academy /agents /models /forge /library /luminors /showcase /ecosystem /arcanea-vault /starlight-intelligence /templates /developers /docs/mcp /pricing /books; do
  curl -sI "https://www.arcanea.ai$route" -o /dev/null -w "%{http_code} $route\n"
done

# Rate limit test on new endpoints
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  curl -s -X POST https://www.arcanea.ai/api/subscribe -H "Content-Type: application/json" -d '{"email":"test@test.com"}' -o /dev/null -w "req $i: %{http_code}\n"
done

# Build verification
pnpm --dir apps/web run build
```

## Time Budget

| Phase | Estimated | Priority |
|-------|-----------|----------|
| API Security | 45 min | P0 |
| Book Integration | 30 min | P1 |
| Template Extraction | 90 min | P2 |
| Design Polish | 45 min | P2 |
| Documentation | 30 min | P3 |
| Validation | 15 min | P0 |
| **Total** | **~4 hours** | |

## Success Criteria

When done, the overnight session should have:
- [ ] 5 more API routes rate-limited (total: 20/162)
- [ ] Zero console.log in production API routes
- [ ] All 17 book collections visible in library
- [ ] Cosmic Landing template repo created + deployed
- [ ] Homepage mobile-verified
- [ ] Zero broken images
- [ ] Full route check passes (32/32 = 200)
- [ ] Rate limit tests pass (429 at threshold)
- [ ] Build passes
- [ ] All commits pushed to origin
