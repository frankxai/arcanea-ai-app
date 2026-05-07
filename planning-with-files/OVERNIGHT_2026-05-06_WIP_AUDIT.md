# P0 — WIP Audit (Pre-cleanup catalog)

**Branch:** `fix/ci-sitemap-locale-route-2026-05-06`
**Snapshot:** session start 2026-05-06 evening
**Verdict:** WIP IS GOLDEN — do not stash, do not reset, do not commit autonomously. Document and route to clean PRs tomorrow.

## Summary

The branch carries **3 distinct workstreams** layered on top of the 2 already-committed CI fixes:

| Workstream | Files | Risk | Recommendation |
|---|---|---|---|
| A. CI fix (already committed, not pushed) | 2 commits, sitemap routes + turbo build | LOW | Push to remote — already PR'd as #93, just needs git push |
| B. Design-token unification (uncommitted, dirty) | 27 files | MEDIUM | New PR tomorrow, separate from CI fix |
| C. Strategic audit + new CLI scaffold + archive (untracked) | 4 dirs / 1 .md | LOW | Commit in 3 separate PRs |

## Workstream A — CI fixes (commits 79e23378 + 3e04dac5)

Already on PR #93. The 2 commits fix:
1. `sitemap-[locale].xml` route TypeScript validator error (Next.js 16 typed-routes can't validate `[locale]` inside extension folder name)
2. Quality Gate Build steps to use `turbo` so workspace deps compile

Status: branch has remote tracking, local 2 ahead. **Safe to push** — these are clean fixes already reviewed by gemini-code-assist on PR #93.

**Action:** push at end of session if no other concerns surface during night audits.

## Workstream B — Design-token unification (27 files, dirty)

This is a coherent brand-token migration aligning code with `.claude/CLAUDE.md` spec (Atlantean Teal #00bcd4, Cosmic Blue #0d47a1, Geist+Instrument Serif fonts, background #09090b).

### B1. Token sources (5 files)
- `packages/design-system/src/tokens.ts` — `streamAccents.marketplace` aqua→teal, `streamAccents.royalty` blue→cosmic, `pillarAccents.worlds` aqua→teal
- `packages/design-system/src/tokens.css` — `--arc-cosmic-void` `#0b0e14`→`#09090b`, removes `--arc-brand-aquamarine`, `--arc-crystal` aqua→teal, `--arc-water` slate→cosmic
- `packages/core/src/engine/design-tokens.ts` — fonts: Space Grotesk/Inter/Newsreader → Geist (display+body+sans) + Instrument Serif
- `packages/core/tests/engine.test.mjs` — test updates for token rename
- `pnpm-lock.yaml` — `next-intl` peer pin tightened `>=16.1.7` → `16.2.2` (1-line, safe)

### B2. App surface (10 files)
All `apps/web/app/academy/*` and `apps/web/app/agents/*` pages:
- Hardcoded `#3b82f6`, `#7fffd4`, `#78a6ff` → CSS vars `var(--arc-brand-cosmic-blue)`, `var(--arc-brand-atlantean-teal)`
- Tailwind classes `[#7fffd4]` → `[var(--arc-brand-atlantean-teal)]`
- Gradient updates to use new tokens

### B3. MCP package (6 files: 1 src + 5 dist)
- `packages/arcanea-mcp/src/tools/generators.ts` — refactor to flatten output schema:
  - Adds `traits` to character output
  - Adds `potentialArc` field
  - Deprecates `patronGuardian` (object→string), adds `patronGuardianProfile` (object)
  - Lifts `cost`/`casting`/`mastery` to top level (with backward-compat under `mechanics`)
- 4× dist build artifacts (matching the src change) + 1 dist source map

**⚠️ Breaking-change risk:** any downstream consumer of MCP tool output depending on `patronGuardian.name` will break. Mitigation: the new field is `patronGuardianProfile`, and `patronGuardian` becomes a string of just the name. Some callers may want both.

### B4. Strategy/skill docs (5 files)
- `.arcanea/prompts/AGENT_PLAYBOOK.md` — token table updated
- `.arcanea/prompts/luminor-frontend-module.md` — same
- `.arcanea/skills/arcanea/premium-visual/SKILL.md` — same
- `.arcanea/skills/design-system.skill.md` — gradient name `Violet → Crystal` → `Teal → Gold`
- `.arcanea/strategy/HERALD_COMMAND_CENTER.md` — token reference fixed

**Recommendation:** New PR `feat(design): unify brand tokens across app + packages + .arcanea`. Single coherent change. Can land tomorrow after Frank reviews the MCP schema migration.

## Workstream C — Strategic audit + new scaffolding (4 untracked items)

| Item | What | Recommendation |
|---|---|---|
| `.arcanea/audits/` | 4 audit docs from earlier session today (plugin-overlap 17.9 KB, repo-architecture, skills-inventory, strategic-charter) | Commit to repo as `docs(audits): 2026-05-06 strategic audit pass` — these are reference docs, no code impact |
| `GEMINI.md` | 1-line pointer to "Starlight Central Command" | Commit as `chore: add GEMINI.md pointer` |
| `_archive/` | 5 archived nested-repo snapshots (arcanea-code, arcanea-flow, arcanea-onchain, arcanea-orchestrator, starlight-intelligence-system, all dated 2026-05-06) | **DO NOT commit yet.** These are full repo copies including their own `.git/`. Committing would balloon repo size and re-introduce the nested-git problem. Add `_archive/` to `.gitignore` until decision made on whether they're moved out of the repo or absorbed |
| `packages/arcanea-cli/src/index.ts` | New CLI package, 1839 bytes, very early | Don't commit until package.json + first useful command exists. Document as "in-flight" |

## What to NOT do tonight

- Do NOT `git stash` the 27 dirty files (per `feedback_audit_before_stash` memory)
- Do NOT `git add .` (per `feedback_mass_revert_protection` memory)
- Do NOT push directly to main on any branch
- Do NOT commit the design-token unification autonomously — brand-wide change deserves Frank's review
- Do NOT commit `_archive/` — full nested .git folders inside, would re-introduce the problem the strategic charter is trying to solve
- Do NOT delete the nested .git folders inside Arcanea/ tonight — strategic charter Phase 1 is gated on Frank saying "go"

## What I CAN do tonight (autonomous, safe)

- Commit only my new audit/plan markdown files in planning-with-files/ (these are mine, no one else's WIP)
- Create no PRs that touch source code
- Run read-only audits + record findings in markdown
- At end of night: optionally push the 2 already-committed CI fixes on the existing branch (PR #93 is open, this just makes the PR catch up)

## Status: P0 COMPLETE
