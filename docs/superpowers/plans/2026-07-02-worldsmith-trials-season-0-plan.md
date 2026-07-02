# Worldsmith Trials — Season 0 Execution Plan

*Plan | 2026-07-02 | Companion to `docs/superpowers/specs/2026-07-02-worldsmith-trials-season-0-design.md`*

Each phase is independently approvable. Nothing ships to production `main` without PR review (Safe Branch Deployment).

---

## Phase A — Foundations (this branch: `claude/arcanea-crowd-machine-qd4f85`)

| # | Step | Files | Verify |
|---|---|---|---|
| A1 | Strategy + spec + rules + rubric + terms docs | `docs/strategy/ARCANEA_ARENA_CROWD_STRATEGY.md`, `docs/superpowers/specs/2026-07-02-worldsmith-trials-season-0-design.md`, `docs/community/{season-0-worldsmith-trials,judging-rubric,SUBMISSIONS-LICENSE}.md`, this file | Cross-links resolve; no invented metrics; no "Crowd Machine" in public docs |
| A2 | Fork-route schema fix (`forked_from_id`→`forked_from`; phantom `world_forks`/`world_factions`/`world_locations` removed; copy set = `world_characters`/`world_lore`/`world_assets`) | `apps/web/app/api/worlds/[slug]/fork/route.ts` | `pnpm --dir apps/web run build`; grep for phantom identifiers returns nothing |
| A3 | Season 0 ledger + typed loader | `apps/web/data/challenges/season-0.json`, `apps/web/lib/challenges/season-zero.ts` | Build passes; loader-derived stats are all zero-state |
| A4 | De-mock `/challenges` page (fabricated ARENA_STATS/LEADERBOARD removed; ledger-driven Season 0 card; honest zero states; on-chain fiction copy removed; fictional Spellbooks/Team Forge tabs unrouted) | `apps/web/app/challenges/page.tsx` | Build passes; grep `12,200\|1,434` in `apps/web/app/challenges/` returns nothing |
| A5 | `challenge-judge` skill + judging script (strict-JSON rubric scoring, clamp 0–100, median math, anonymization) | `.claude/skills/challenge-judge/SKILL.md`, `scripts/challenge-judge/run-judges.mjs` | Fixture dry-run: canned judge responses → correct medians + weighted total |
| A6 | OSS repo scaffold (separate PR on `frankxai/arcanea`): season directory, entry template, validator + injection lint, GitHub Action | `challenges/season-0/{README.md,entry-template/,entries/,scripts/validate_entry.py}`, `.github/workflows/validate-entries.yml` | Validator passes on `entry-template/`, fails a broken fixture |

## Phase B — Season open (after Phase A merged; Frank decisions required)

- Set `opensAt`/`closesAt` and publish 2–3 public seeds (Frank authors or approves seeds; they should exercise different canon regions).
- Flip ledger `status` to `open`; announce (site + newsletter + OSS README).
- Monitor entry PRs; validator handles structure; maintainers handle waivers.

## Phase C — Judging & close

- Freeze entries; snapshot PR reactions; reveal held-out seed.
- Run `challenge-judge` per entry (maintainer-local); commit scores + rationales to the ledger via PR.
- Flip `status` to `complete`; leaderboard renders; promote winners to `.claude/skills/community/` (both repos) with attribution.
- Retro doc: what held up, what to automate for Season 1.

## Season 1 gate

Proceed to Season 1 (in-app submissions + Supabase Appendix-A migration) only if Season 0 produced ≥1 promotable external winner and the judge pipeline held up end-to-end.

## Deferred (explicitly not in Season 0)

- Supabase `challenges`/`challenge_submissions`/`challenge_scores` migration — spec'd in the design doc Appendix A; ships with Season 1.
- `get_leaderboard` phantom RPC (`apps/web/app/api/leaderboard/route.ts`) — create the RPC or remove the route.
- Remaining `world_factions`/`world_locations` schema drift in `apps/web/app/api/worlds/[slug]/route.ts` + `generate/route.ts`; regenerate `lib/database/types/supabase-generated.ts` from the live DB.
- In-app submission portal (`components/challenges/submission-portal.tsx` stays unrouted).
- Prize money / payment rails / sponsorships — nothing announced until funded.
- Counsel review of SUBMISSIONS-LICENSE and of the repo-wide licensing inconsistency (MIT code vs "personal use" overlay pack vs CC-BY-NC book bibles).
- Persisting `api/arena/run` results; judge-as-API; sandboxed execution service for untrusted workflows; multi-season automation; anything on-chain.
