# Handover — /ao unification + skill registry (2026-04-21)

Autonomous massive-action session. 2 PRs merged, 3 subagents dispatched, skill sprawl mapped + secured.

## Shipped on main today

| PR | Title | Impact |
|---|---|---|
| **#57** | `chore(skills): registry generator + kill stale orchestrator flat file` | 349 entries across 15 dirs visible via `docs/skills/INDEX.md`; drift detectable |
| **#58** | `feat(/ao): unify as meta-dispatcher across LIFE + OPS + ROUTING + SWARM` | One entry point, 22 subcommands, auto-routes based on keywords + planner fallback |

Plus: **AnimeLegends.ai git-initialized** — 6 unique skills (concept-forge, gen-director, publish-orchestrator, remotion-composer, script-forge, storyboard-forge) were NOT in git; now protected outside this repo.

## /ao unification (PR #58)

**Before:** /ao = life tracker only (gates, streak, scorecard, reward).
**After:** /ao = unified meta-dispatcher covering all four domains.

| Domain | Subcommands | Delegates to |
|---|---|---|
| LIFE (unchanged) | pulse, scorecard, gate, rank, ceremony, challenge, herald, streak | in-skill handlers |
| OPS (new) | status, promote, digest, coach, cleanup, plan, handover, publish, sync, sessions | `arcanea-orchestrator` v2.1.0 skill |
| ROUTING (new) | route `<task>`, workflow `<name>` | Bash: `arco` CLI |
| SWARM (new) | swarm `<goal>`, plan-chat `<q>` | Skill: `swarm-lumina` / `ultraworld` / planSwarm |

### Auto-routing

Every `/ao` invocation emits: `/ao → <domain>:<sub> (reason: …)` so Frank can override.

Ordered keyword match:
1. Explicit subcommand token
2. Life keywords (streak|gate|scorecard|…)
3. Ops keywords (PR|branch|promote|merge|…)
4. Routing keywords (route|second opinion|codex|…)
5. Swarm keywords (Luminor|villain|world build|ultraworld|…)
6. Ambiguous → planSwarm heuristic-only (no LLM cost)
7. Still ambiguous → safe fallback to `/ao pulse`

### Swarm dispatch heuristic

Spawn subagents ONLY when ALL THREE hold:
1. Domain span ≥ 2 Guardians
2. Inline cost > 40K tokens OR > 5 min
3. No mutating state in progress

**Never swarm-delegate:** publish, promote, ceremony. Orchestrator keeps the write pen.

## Skill registry (PR #57)

**Stats:** 349 entries / 174 unique names / 24 content drifts / 97 with duplicates.

**Canonical locations:**
- User-scope global: `~/.claude/skills/` (136 skills)
- Project Arcanea: `.claude/skills/` (110)
- OSS publish: `~/.arcanea/arcanea/arcanea-skills-opensource/skills/` (9)

**At-risk resolved:** `AnimeLegends.ai/skills/` (6 unique, no git) → now git-initialized.

**Dedup recommended:** `~/.arcanea/arcanea/oss/skills/` is exact md5 clone of the OSS publish source — delete. `agentic-creator-os/.claude/skills/` is older snapshot of user-global — symlink or generate from upstream.

**Regenerate any time:** `node scripts/build-skill-registry.mjs` — rewrites `docs/skills/INDEX.md` + `registry.json`.

## Deprecation state

- `arcanea-orchestrator.md` (flat) — RETIRED (PR #57)
- `arcanea-orchestrator/` v2.1.0 dir — KEEP, delegate target for `/ao ops:*`
- `arco/` — KEEP forever (real external CLI documented)
- `swarm-lumina/`, `ultraworld/` — KEEP; /ao swarm wraps them

## Deferred for next session (with clear paths)

1. **CI Build infra fix** — `.github/workflows/ci.yml:179` needs `needs: [install, lint]` + fallback install step. Subagent C specified exact change.
2. **`/skills` web page** — render `docs/skills/registry.json` as a visual catalog on arcanea.ai. ~30 min.
3. **pnpm script alias** — `"skills:registry": "node scripts/build-skill-registry.mjs"` in root package.json + CI job to regenerate on push.
4. **Canonical settings repo wire-up** — `frankxai/claude-codex-gemini-opencode-settings` as source of truth with `install.sh` that drops everything into correct dirs.
5. **MASTER_PLAN.md refresh** — still 18 days stale; doc-only session.
6. **`@arcanea/author-studio` extraction** — Subagent D's 4-PR plan (scaffold → server modules → client components → Guardian bridge). Needs Frank's answer on reader scope.
7. **AMCAS V2 remaining** — S2 workflow templates, S4 QUICKSTART, S5 /orchestrator landing.

## Cumulative session totals (2026-04-18 through 2026-04-21)

| | Before | After |
|---|---|---|
| PRs merged | 0 | 10 (#38, #41, #44, #45, #46, #47, #48, #49, #57, #58) |
| TS errors on main | 18 | 0 |
| Typecheck gate | Off | Blocking |
| publishing-house web consumers | 0 | 2 (chat + publish) |
| Swarm planner consistency | Heuristic | LLM in both surfaces |
| /ao capabilities | LIFE only | LIFE + OPS + ROUTING + SWARM |
| Skill registry | None | Live (349→174, drift detectable) |
| AnimeLegends git | NO | YES (6 unique saved) |
| CI billing | Blocked | Resolved (ARC-186 Done) |

## Owner for next handover

Frank (decide reader scope for author-studio, approve settings repo canonicalization, refresh MASTER_PLAN).
Claude Code next session (CI Build fix, /skills web page, pnpm script + CI job, author-studio PR 1 once reader scope answered).

Production arcanea.ai live. Working tree clean. /ao is now the single entry point everything routes through.
