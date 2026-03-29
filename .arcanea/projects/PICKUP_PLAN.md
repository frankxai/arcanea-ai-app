# Arcanea Pickup Plan

> For autonomous agents (yolo mode). Read MASTER_PLAN.md first, then execute in order.
> Created: 2026-03-30 | Context: ecosystem audit revealed 72% health, key infrastructure gaps.

---

## BEFORE YOU START

1. Read `.arcanea/MASTER_PLAN.md` — understand milestones and priorities
2. Read `.arcanea/lore/CANON_LOCKED.md` — if doing any content work
3. Verify build: `cd apps/web && npm run build` — must pass before and after your work
4. Do NOT create new packages or directories without checking if they already exist

---

## TIER 1: Quick Wins (15 min each, high impact)

### T1-1: Close P0-3 — Supabase Dashboard Config
**REQUIRES HUMAN** — Frank must do this in Supabase Dashboard:
- Site URL → `https://arcanea.ai`
- Add redirect URL `https://arcanea.ai/auth/callback`
- Enable Google + GitHub OAuth providers
- Then run E2E auth test to verify
**Status:** Open since 2026-03-10. Blocks production auth.

### T1-2: Update progress.md
Last updated March 17. Write a progress entry for today covering:
- ACOS v11 installed
- Statusline v5 fixed (path issue)
- Bootstrap hook upgraded to v3
- .arcanea/ directories scaffolded

### T1-3: Verify settings.json paths persist
Check `C:/Users/frank/Arcanea/.claude/settings.json` — all paths should use `C:/Users/frank/` NOT `/mnt/c/`. If reverted, rewrite using the Bash `cat >` method (Edit/Write get intercepted by hooks).

---

## TIER 2: Infrastructure (30-60 min each)

### T2-1: Populate .arcanea/lore/ with Guardian profiles
Extract from `.arcanea/lore/CANON_LOCKED.md` and create:
- `godbeasts/[name].md` — 10 files (Sol, Yumiko, Kyuro, etc.)
- `gods-goddesses/[name].md` — 10 files (Shinkami, Lyria, Draconia, etc.)
- `guardians/[name].md` — 10 files (gate-keeper profiles)

### T2-2: Create .arcanea/config/ files
- `voice.yaml` — extract from M010 completion notes in MASTER_PLAN
- `design-tokens.yaml` — extract from Arcanean Design System (teal, blue, gold, fonts)
- `models.yaml` — model routing preferences per tool

### T2-3: Sync key agents to .arcanea/agents/
Copy from `.claude/agents/` → `.arcanea/agents/`:
- All 12 @guardian.agent.md files
- arcanea-architect.md, arcanea-backend.md, arcanea-frontend.md
- arcanea-lore-master.md, arcanea-world-expander.md
Purpose: make these available to Cursor/Codex/Gemini.

### T2-4: Package directory audit
In `packages/`, for each of the 43 directories:
- If empty AND not referenced by MASTER_PLAN milestones → delete
- If empty but referenced → add a `package.json` with name/description/status
- Target: reduce from 43 stubs to ~15 real packages
- Key packages to keep: arcanea-mcp, memory-mcp, arc-protocol, auth, core, database

---

## TIER 3: Ecosystem Hardening (1-2 hours)

### T3-1: Create .arc milestone files
For each active milestone in MASTER_PLAN, create a tracking file:
```
.arcanea/projects/milestones/m001-supabase-auth.arc
.arcanea/projects/milestones/m003-memory-system.arc
.arcanea/projects/milestones/m005-premium-ui-v0.arc
.arcanea/projects/milestones/m006-creator-tools-backend.arc
.arcanea/projects/milestones/m008-onboarding-conversion.arc
.arcanea/projects/milestones/m009-performance-polish.arc
```
Format: extract tasks from MASTER_PLAN into standalone trackable files.

### T3-2: MASTER_PLAN.md refresh
Update to reflect current state:
- Package count: 43 → actual count after T2-4 pruning
- Last Updated: set to today
- Add new items discovered in audit (statusline fix, ACOS install, bootstrap v3)
- Mark any newly completed items

### T3-3: Agent contract system
Create `.arcanea/agents/CONTRACT.md` defining:
```yaml
input: { task, context, constraints }
output: { result, changes[], decisions[], blockers[] }
guarantees: Will not modify files outside declared scope
requires: MASTER_PLAN read, CANON_LOCKED loaded (if lore work)
```
Every agent file should reference this contract.

---

## TIER 4: Shipping (P0 milestone completion)

### T4-1: M001 — Complete Supabase Auth (90% → 100%)
After T1-1 (human config), run E2E auth test:
- Sign up flow
- Google OAuth
- GitHub OAuth
- Profile creation on first login
- Protected route access

### T4-2: M008 — Onboarding activation loop (90% → 100%)
- Activation loop analytics (the one remaining task)
- Verify 5-step wizard works end-to-end with real AI

### T4-3: M009 — Core Web Vitals audit
- Run Lighthouse on arcanea.ai (homepage, chat, imagine, studio)
- Baseline from memory: homepage 35, chat 18, imagine 49
- Target: all pages >60

---

## Execution Notes

- Always run `npm run build` after changes to verify nothing breaks
- Commit after each tier, not after each task
- Use conventional commits: `fix:`, `feat:`, `chore:`, `docs:`
- Update MASTER_PLAN.md after completing any milestone work
- If blocked, create a GitHub issue rather than leaving it undocumented
