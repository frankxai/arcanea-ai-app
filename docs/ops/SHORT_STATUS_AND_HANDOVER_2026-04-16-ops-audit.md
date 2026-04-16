# Short Status And Handover - 2026-04-16 (Ops Audit Session)

## What Landed

- `2df3faa3` docs(todo): update Frank's TODO with 5 repos + npm publish for MCP starter
- `09c2b7d8` feat(templates): add MCP Starter blueprint to /templates page (9 total)
- `9259031c` docs(strategy): Frank's TODO when back
- `f2ad35cc` feat(templates): add arcanea-dashboard-template + free-first strategy
- `d982b912` fix(og): read mascot from assets/ (public/ not bundled in OG function)
- `8851148c` fix(og): declare nodejs runtime + correct mascot path for readFileSync
- `25bfb9f6` docs(strategy): template business model
- `6c3f955e` fix(og): use correct mascot filename (arcanea-primary.png)
- `0a9bbfca` feat(studio): Author Studio v3 — Supabase draft persistence + Publish to Git

## What Changed This Session

This session was a **Peak Performance audit and ops hardening session** — no commits, all changes are uncommitted and staged for review:

### Uncommitted changes (ops infrastructure):
- **CLAUDE.md** (root + .claude/) — Added Resource Management rules: 16GB RAM limits, max 4-5 instances, pnpm dev restrictions, MemFree guard thresholds
- **.claude/hooks/session-start.sh** — Added RAM guard (warns at <2GB, critical at <1GB) and dev server detector (flags Node processes >1GB)
- **.claude/statusline.mjs** — Added live RAM indicator to status line (red/yellow/green based on free memory)
- **.wslconfig** — Reduced WSL2 memory cap from 8GB to 2GB (reclaims ~6GB after `wsl --shutdown`)

### Memory files created:
- `project_pp_audit_2026_04_14.md` — PP audit score 50/D, RAM 92%, Next.js 2.6GB leak
- `project_pp_trend.md` — Rolling trend across 5 audits + defense-in-depth fix layers

### Junk files to clean up:
- `arcanea-og-direct.png` — **NOT A PNG** — HTML auth page from Vercel saved with .png extension. Delete it.
- `arcanea-og-final.png` — Likely same problem. Verify before deleting.

## Current Blockers

1. **WSL reboot needed** — Run `wsl --shutdown` in PowerShell to apply new 2GB memory cap (saves ~6GB)
2. **PostHog not working** — Code installed but API keys not set (`NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`). ~30 min to configure in Vercel env vars.
3. **A6 session was burning money** — `/loop` mode stuck retrying Read on the fake PNG (HTML file). Kill if still running.
4. **Sentry + Supabase OAuth** — Same as PostHog: code installed, keys needed (from `project_api_setup_backlog.md`)

## Recommended Next Stack

1. **Run `wsl --shutdown`** in PowerShell — immediate 6GB RAM recovery
2. **Delete fake PNGs** — `rm arcanea-og-direct.png arcanea-og-final.png` (both are HTML, not images)
3. **Commit ops changes** — The CLAUDE.md, hooks, and statusline edits are solid. Stage and commit.
4. **Set PostHog API keys** — In Vercel dashboard + local `.env.local`. Enables analytics.
5. **Verify OG image route** — The `d982b912` fix moved mascot to `assets/`. Confirm via `curl -I arcanea.ai/api/og` or Vercel MCP.
6. **Resume template work** — See earlier handover for Vercel link, browser testing, world-engine template
7. **Kill idle Claude instances** — Keep max 4-5 running. Each = ~650MB with MCP servers.

## Verification Evidence

- **Session hooks working**: A6 session showed `CRITICAL: Only 854MB free (94% used)` — hook correctly detected low RAM
- **RAM diagnosis confirmed**: `MemTotal: 16530364 kB`, `MemFree: 3238444 kB` at session start (~3.1GB free)
- **Fake PNG confirmed**: `file` command returned `HTML document, ASCII text` and hex dump showed `3c21 646f 6374 7970 65` (`<!doctype`)
- **Defense-in-depth deployed**: 6 layers — .wslconfig (hardware), hooks (session), CLAUDE.md (rules), statusline (telemetry), memory (learning), skills (audit)
