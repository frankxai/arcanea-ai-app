# Next Session Execution Plan — 2026-04-02

## Pre-Requisites (Frank Tonight)
- [ ] Apply Supabase migrations (20260329000001, 20260329000002, 20260402000001)
- [ ] Regenerate Supabase types
- [ ] Verify build, deploy to Vercel

---

## Session 1: Wire Real Systems (2-3 hours)

### 1A. Consolidate SIS — Stop Duplicating
The real SIS repo is `C:\Users\frank\Starlight-Intelligence-System` (v5.0.0, 109 files, npm package).
The real vault is `C:\Users\frank\starlight-horizon-dataset`.

Actions:
- Remove `oss/starlight-vault/` from arcanea-ai-app (duplicates starlight-horizon-dataset)
- Move today's 3 vault notes to `starlight-horizon-dataset` in JSONL format
- Push updates to both repos
- Wire arcanea-ai-app hooks to use real SIS package instead of ad-hoc statusline.mjs
- Update SIS repo with today's architecture insights (evals, pattern learning, federation)

Skill: `/arcanea-dev`

### 1B. Move Skills to OSS
The 8 new creator skills belong in `arcanea` OSS repo, not arcanea-ai-app (private).

Actions:
- Copy skills to `C:\Users\frank\Arcanea/.tmp/satellite-repos/arcanea/` or clone fresh
- Push to frankxai/arcanea
- Update oh-my-arcanea to reference them
- Keep .claude/settings.json pointing correctly

Skill: `/multi-repo` or `/oss-sync`

### 1C. Notes/Docs + Roadmap Go Live
After DB activation:
- Verify Notes/Docs pages work with real Supabase tables
- Verify /roadmap renders correctly
- Fix any type errors from real generated types

Skill: `/arcanea-build` then `/arcanea-deploy`

---

## Session 2: Visual Excellence (3-4 hours)

### 2A. Homepage Visual Upgrade
Current homepage needs Azuki-level scroll choreography.

Actions:
- Add GSAP ScrollTrigger to homepage sections
- Wire existing Three.js cosmic particles to hero
- Apply liquid glass to cards and panels
- Ensure peacock/aquamarine palette throughout
- Kill any remaining Cinzel references in code

Skill: `/arcanea-design` then `/frontend-design` then `/component-forge`

### 2B. Gallery Visual Upgrade
Actions:
- Add GSAP scroll-driven reveals to gallery grid
- Upgrade guardian detail pages with parallax
- Run `/vis-scan` → `/vis-audit` → `/vis-report`
- Fix any remaining broken image references

### 2C. Design System Audit
Actions:
- Grep entire codebase for 'Cinzel' or 'cinzel' — remove all
- Verify Inter + Space Grotesk used everywhere
- Check all glass-card, glass-surface components use correct palette
- Run `/design-review` on key pages

Skill: `/design-review`

---

## Session 3: Intelligence Layer (2-3 hours)

### 3A. Live Retrieval
After DB is live:
- Verify project-aware retrieval works with real data
- Test scored ranking with actual sessions/creations/memories
- Verify runtime traces log correctly

### 3B. Eval Framework
Build session scoring into SIS:
- Hook into session-end to score: build passed? tests passed? commits clean?
- Save scores to `.sis/evals/` or SIS repo
- Start tracking patterns (what works, what fails)

Skill: `/tdd` for eval tests

### 3C. Provider Traces
- Verify chat logs provider/model/latency
- Build dashboard view (or just API endpoint) showing usage

---

## Session 4: Social Content Push (2 hours)

### 4A. Guardian Reveals
Use existing 2,000 images to create social content:
- Pick 10 best guardian images
- Generate reveal posts with `/faction-reveal`
- Format for X, Instagram, Farcaster
- Schedule or post

Skill: `/publish-distribute` then `/faction-reveal`

### 4B. Roadmap Announcement
- Screenshot /roadmap page
- Write announcement post
- Cross-post to all platforms

---

## Key Files To Read Before Each Session

```
1. planning-with-files/MASTER_ACTION_PLAN_2026-04-02.md
2. planning-with-files/NEXT_SESSION_EXECUTION_2026-04-02.md
3. .arcanea/MASTER_PLAN.md
4. .claude/CLAUDE.md
```

## Key IDs

| System | ID |
|--------|-----|
| Linear Arcanea Project | dd7f6c8e-1333-42d8-b452-3f3149b2b79d |
| Linear Team FrankX | 27c1a417-8eb1-4c65-8a72-e6000c49a37b |
| Notion Arcanea Hub | cb430b46e54d4036a8ba2cff7050ae39 |
| Notion Developer Hub | 33626ac2b7f68189b0ceea79c116f4ee |
| FRA-31 | Supabase Integration |
| FRA-35 | Gallery |
| FRA-42 | Notes/Docs MVP |
| FRA-43 | Visual Roadmap |
| FRA-44 | Media Pipeline R2 |

## Existing Repos to Use (NOT Duplicate)

| Repo | Path | Purpose |
|------|------|---------|
| Starlight-Intelligence-System | C:\Users\frank\Starlight-Intelligence-System | SIS core (v5.0, npm package) |
| starlight-horizon-dataset | C:\Users\frank\starlight-horizon-dataset | Vault (JSONL entries) |
| arcanea | via GitHub frankxai/arcanea | OSS ecosystem (skills, overlays) |
| oh-my-arcanea | C:\Users\frank\oh-my-arcanea | Agent harness |
| arcanea-code | C:\Users\frank\arcanea-code | Claude Code intelligence |
| arcanea-ai-app | C:\Users\frank\Arcanea | Main product (PRIVATE) |

## Skills Per Task

| Task | Best Skill |
|------|-----------|
| Multi-repo sync | `/multi-repo` or `/oss-sync` |
| DB work | `/arcanea-db` |
| Build/deploy | `/arcanea-build` then `/arcanea-deploy` |
| Visual design | `/arcanea-design` → `/frontend-design` → `/component-forge` |
| Design audit | `/design-review` |
| Image audit | `/vis-scan` → `/vis-audit` → `/vis-report` |
| Social posts | `/publish-distribute` → `/faction-reveal` |
| Testing | `/tdd` or `/arcanea-test` |
| Quality check | `/arcanea-quality` |
| Session ops | `/daily-ops` → work → `/session-sync` |
| Lock decisions | `/lock-decision` |
| Start project | `/project-brief` |
| Import content | `/creator-import` |
| World-building | `/world-forge` → `/character-forge` → `/canon-check` |
| Full dev team | `/arcanea-dev` |
| Max parallel | `/ultracode` |
