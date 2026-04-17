# Current State — April 7, 2026

## Build Health

- **Build:** 42/42 packages PASS
- **Deploy:** Vercel (arcanea-ai-appx) — live
- **Security:** 0 known vulnerabilities
- **CI:** Lint + Typecheck + Build = all blocking gates
- **Content:** 1M+ words across 8+ series, 23 book covers
- **Dirty files:** 1,762 (1,726 modified, 19 untracked, 12 deleted, 5 mixed) — mostly in apps/web (563), .claude/skills (475), packages/ (100+)

## Revenue Status

- **Revenue to date:** €0
- **Gate 0 target:** First €1 by April 15 (ARC-101)
- **BV formation:** June 1, 2026 (55 days)
- **Oracle exit:** Employment ended April 3. Cash gap April–May.
- **Monthly burn:** ~€346/mo subscriptions + living costs
- **Liquid:** ~€6K

## Systems Live (16 total)

| System | Version | Status |
|--------|---------|--------|
| Web app (arcanea.ai) | Next.js 16 + React 19 | LIVE |
| AI Model Arena | 349 models via OpenRouter | LIVE |
| Origin Class Quiz | v2 cosmic glass | LIVE |
| Blog Engine | 6+ posts this sprint | LIVE |
| AEO Surface | llms.txt + agent changelog | LIVE |
| Premium Pricing | 3-tier + trust signals | LIVE |
| Orchestra (/ao) | v1 — 8 commands | ACTIVE |
| Financial Ops | 14-sheet Excel | ACTIVE |
| MCP Server | v0.3.0, 42 tools, SDK 1.29 | BUILT |
| Buddy System | v2 (16 archetypes + 10 Godbeasts) | BUILT |
| Voice System | v3 (12 modes, Groq+Whisper+ElevenLabs) | BUILT |
| Luminor Prompt Library | 10 modules + kernel | BUILT |
| @arcanea/flow | v0.1.0 | BUILT |
| @arcanea/world-engine | v0.2.0 | BUILT |
| NFT Forge | Complete | BUILT |
| Arcanea Vault | 42 TS files scaffolded | PLANNED |

## Fixes Applied Today (Apr 7)

1. **CRITICAL:** `packages/core/src/engine/design-tokens.ts` — fonts declared as Cinzel/Crimson Pro → fixed to Space Grotesk/Inter/Newsreader
2. **HIGH:** `apps/web/components/chat/agent-picker.tsx` — broken `/forge/create` link → fixed to `/forge/luminor`
3. **MEDIUM:** Cinzel purged from 5 active source files:
   - `oss/skills/arcanea/design-system/SKILL.md` (CSS + JS tokens)
   - `oss/agents/design-sage.md` (CSS declarations)
   - `apps/web/components/luminor/README.md` (3 references)
4. **AUDIT:** 58 Cinzel references remain in 30 files (mostly docs/strategy — historical, not active source)
5. **AUDIT:** 1,525 hardcoded hex colors across 182 component files (design debt, not blocking)
6. **AUDIT:** Web app navigation clean — 1 broken link fixed, 0 orphaned routes, 0 dead imports

## API Keys

- Groq: SET | ElevenLabs: SET | OpenAI: SET
- Supabase: NOT SET | Sentry: NOT SET | PostHog: NOT SET

## 5 Manual Blockers (Frank-only — ALL 7+ days unchanged)

| # | Blocker | Days Blocked | Impact |
|---|---------|-------------|--------|
| 1 | Supabase dashboard config (Site URL + OAuth + 3 SQL migrations) | 7+ | No auth, no user data |
| 2 | npm login + publish 13 packages (ARC-76) | 7+ | No marketplace distribution |
| 3 | Gumroad/Whop/Stripe account setup | 7+ | **No revenue possible** |
| 4 | Sentry + PostHog API keys on Vercel | 7+ | No monitoring, no analytics |
| 5 | Regenerate Supabase types after migration | 7+ | No typed DB access |

**Blocker #3 is the gate to Gate 0.** Nothing else on the revenue path matters until a payment account exists.

## Linear Status (Active Issues)

### In Progress (6)
- **ARC-101** Revenue Sprint — First €1 by April 15 (URGENT)
- **ARC-86** X rename @frankxeth → @frankx_ai (URGENT, overdue Apr 5)
- **ARC-88** Post ACOS/MCP threads from queue (URGENT, overdue Apr 5)
- **ARC-83** [EPIC] Presence Layer — AI Avatar System (URGENT)
- **ARC-84** Phase 1: Voice → Simli/Hedra avatar (URGENT)
- **ARC-71** MCP Product Launch — marketplace distribution (URGENT)

### Todo (9)
- **ARC-76** npm login + publish 13 packages (URGENT)
- **ARC-42** VibeOS PDF Guide (HIGH, due Apr 12)
- **ARC-79** NFT Forge × MCP visual bridge (HIGH)
- **ARC-68** CapCut brand templates (HIGH, overdue Apr 5)
- **ARC-70** Postiz + Blotato setup (URGENT, overdue Apr 3)
- **ARC-69** Week 1 daily content pipeline (URGENT, overdue Apr 2)
- **ARC-67** 6 Canva Brand Kits (URGENT, overdue Apr 2)
- **ARC-81** Academy × world_report synergy (MEDIUM)
- **ARC-80** Living Lore × MCP narrative (MEDIUM)

### Overdue Issues: 5 (ARC-86, ARC-88, ARC-68, ARC-69, ARC-67)

## Design System Health

- **Centralization:** 70% (apps/web uses preset correctly)
- **Critical fix today:** Core design-tokens.ts was declaring Cinzel — fixed
- **Remaining debt:** 1,525 hardcoded hex colors, no @arcanea/ui shared package
- **Cinzel residue:** 58 refs in 30 files (mostly docs/historical — 5 active source files fixed today)
- **Preset:** `packages/arcanea-design-preset.js` correctly imported by `apps/web/tailwind.config.ts`

## GTD Architecture (LOCKED Apr 4)

- LINEAR = task board (issues, status, priority)
- PLANNING FILES = agent execution layer
- MEMORY = decision persistence
- NOTION = documentation/wiki
- OBSIDIAN = personal vault (OneDrive, mobile)

## Priority Queue — Week of April 7

1. **Gumroad/Whop account** → unblocks all revenue (Frank, 30 min)
2. **ACOS PDF → list at $29** (ARC-91) → first dollar (Claude + Frank)
3. **VibeOS PDF** (ARC-42) → second product (Claude + Frank)
4. **X rename + post threads** (ARC-86, ARC-88) → audience building (Frank, 15 min)
5. **npm publish 13 packages** (ARC-76) → marketplace distribution (Frank, 45 min)
6. **Verify Oracle bonus dates** → cash flow clarity (Frank, 10 min)
