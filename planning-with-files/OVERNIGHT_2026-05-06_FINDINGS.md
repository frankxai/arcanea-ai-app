# Findings — Overnight 2026-05-06

## Pre-flight ground truth (verified)

### Repo topology
- **44 sibling repos** with own `.git` at `C:/Users/frank/*` (Arcanea, frankx-*, starlight-*, gencreator.ai, vibeclubs.ai, etc.)
- **20 nested `.git` folders** inside `Arcanea/` (NOT registered as submodules — `git submodule status` empty)
- **3 GitHub remotes** on main checkout: `origin=arcanea-ai-app`, `oss=arcanea`, `records=arcanea-records`

### Machine
- RAM: 5.73 GB free / 15.76 total / 63.6% used → can spawn 2-3 sub-agents safely
- Disk C:: 59.4 GB free → above 5 GB threshold, safe
- Top RAM consumers: Memory Compression (562 MB), MsMpEng (555 MB), 3× claude (1041 MB total)

### Branch state
- Current: `fix/ci-sitemap-locale-route-2026-05-06`, exists on origin already
- 2 commits ahead of `origin/<branch>` (the two CI fixes 79e23378 + 3e04dac5)
- 27 modified files + 4 untracked WIP — must be audited before any cleanup

### CI status
- 🔴 NEW failures today: `chore/post-overnight-audit-2026-05-06` PR — Quality Gate + CI both failing
- ✅ This branch's last PR run was green for CI + Quality Gate, only Lighthouse CI failed (likely flaky)

### Recent merge history (last 14 PRs, last ~10 days)
- 4 of 14 are `fix(ci)` — chronic CI fragility
- PR #87 broke main due to lockfile drift (memory confirmed)
- PR #85 was the lockfile regen fix
- Lots of book/i18n/voice work landing successfully — the creative pipeline is shipping

## Source-of-truth docs at root
- `AGENTS.md` (6.9 KB, updated 2026-05-06 20:13 — TODAY)
- `TASTE.md` (9.7 KB)
- `DESIGN.md` (15.7 KB)
- `CLAUDE.md` (3.8 KB)
- `ARCANEA_AGENTHUB_MASTER_PLAN.md` (23.4 KB, 2026-03-31)
- `CHANGELOG.md` (10.7 KB, 2026-03-28)

## Key memory cross-references active this session
- `feedback_audit_before_stash` — MUST audit dirty WIP before any cleanup
- `feedback_mass_revert_protection` — 2026-03-11 incident, 4517 files nuked. Always check diff scope.
- `feedback_lockfile_drift_pattern` — 2 main breaks in 2 days from package.json without lock
- `feedback_cross_tab_race` — long commands can land on wrong branch
- `feedback_ship_means_ship` — commit + push + deploying, not just "build passed"
- `project_may_foundations_2026` — May = foundations only, no monetization push
- `feedback_no_consulting` — products + community only
- `feedback_quality_standard` — 7-gate filter
- `feedback_design_tier` — AI-lab premium, never fantasy-game
