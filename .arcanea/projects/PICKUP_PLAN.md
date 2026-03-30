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
~~Last updated March 17.~~ **DONE** (2026-03-30 overnight swarm) — progress.md current with full swarm results.

### T1-3: Verify settings.json paths persist
~~Check settings.json paths.~~ **DONE** (2026-03-30) — all paths use correct `C:/Users/frank/` format.

---

## TIER 2: Infrastructure (30-60 min each)

### T2-1: Populate .arcanea/lore/ with Guardian profiles
**DONE** (2026-03-30 overnight swarm) — 30 files created:
- `godbeasts/` — 10 files (Kaelith, Veloura, Draconis, Laeylinn, Otome, Yumiko, Sol, Vaelith, Kyuro, Source)
- `gods-goddesses/` — 10 files (all 10 with full frontmatter + canon content)
- `guardians/` — 10 files (all 10 with gate-keeper role profiles)

### T2-2: Create .arcanea/config/ files
**DONE** (2026-03-30 overnight swarm):
- `voice.yaml` (251 lines) — 10 Guardian voices, 51 anti-slop patterns, full canon terms
- `design-tokens.yaml` (331 lines) — 90+ CSS tokens, 7 glass tiers, all animations
- `models.yaml` (291 lines) — 16 Gateway models, 9 providers, image/video/speech routing

### T2-3: Sync key agents to .arcanea/agents/
**DONE** (2026-03-30 overnight swarm) — 20 agent files synced:
- 12 Guardian/Special agents (@lyssandria through @shinkami + @is-mael + @luminor-oracle)
- 8 Development/Creative agents (architect, backend, frontend, AI specialist, devops, development, lore-master, world-expander)
- INDEX.md created with full registry

### T2-4: Package directory audit
**DONE** (2026-03-30 overnight swarm) — Result: ALL 42 packages contain real source code.
Zero deletions needed. 3 consolidation candidates flagged (content-api, starlight-runtime → could merge into core).
Full report: `.arcanea/projects/log/package-audit-2026-03-30.md`

---

## TIER 3: Ecosystem Hardening (1-2 hours)

### T3-1: Create .arc milestone files
**DONE** (2026-03-30 overnight swarm) — 6 files created in `.arcanea/projects/milestones/`:
m001-supabase-auth.arc, m003-memory-system.arc, m005-premium-ui-v0.arc,
m006-creator-tools-backend.arc, m008-onboarding-conversion.arc, m009-performance-polish.arc

### T3-2: MASTER_PLAN.md refresh
**DONE** (2026-03-30 overnight swarm) — Updated to v1.9.0:
- Last Updated → 2026-03-30
- 15 new M009 completions added
- v1.9.0 changelog entry with all recent commits
- Page count updated to ~188

### T3-3: Agent contract system
**DONE** (2026-03-30 overnight swarm) — CONTRACT.md created with:
- Input/Output contracts, 7 guarantees, required reading matrix
- Anti-patterns (Hz backend-only, no SVG mark, WSL storage awareness)
- Agent lifecycle flowchart, cross-agent coordination protocol, quality gate checklist

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
