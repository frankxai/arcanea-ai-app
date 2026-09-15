# Arcanea CTO Ops Policy

**Owner:** Lumina (Opus, swarm queen) under Frank (decisions, gate)
**Scope:** All Arcanea-family repos under `frankxai/*`
**First locked:** 2026-05-05
**Status:** living document — review weekly

This is the canonical operations policy across the Arcanea ecosystem. It encodes how repos are configured, how dependencies move, how PRs flow, and how cost is controlled. When a question is "should we do X", read this first; if not answered, decide and update this doc.

## 1. Repo standards (applied to all 18 Arcanea repos)

Every active Arcanea repo has:

- **Branch protection** on default branch:
  - Required: linear history (squash/rebase only)
  - Blocked: force-push, branch deletion
  - Admin bypass enabled (Frank/Lumina can override on emergency)
  - Required status checks: deferred until CI green across the ecosystem
  - Required reviews: not required (single-author project + AI agents)
- **Repo settings:**
  - Auto-delete head branch on merge: ON (prevents future graveyard)
  - Squash merge: ONLY allowed merge style
  - Merge commits: BLOCKED (linear history)
  - Rebase merge: BLOCKED (we squash, period)
  - Auto-merge: ENABLED (so Renovate can auto-land patches)

Verified live as of 2026-05-05 across:

| Tier | Repos |
|---|---|
| Production | arcanea-ai-app, frankx.ai-vercel-website, AnimeLegends, gencreator.ai, vibeclubs |
| Substrate | Starlight-Intelligence-System, starlight, vibe-os-substrate, sis, agentic-creator-os |
| Agents/Dev | arcanea, oh-my-arcanea, arcanea-orchestrator, arcanea-code, arcanea-flow, arcanea-vault |
| Surface | infogenius, library-os, arcanea-records |

The 2 non-standard-default repos (`oh-my-arcanea: dev`, `arcanea-code: dev-v2`) are protected on their actual default branches.

## 2. Branch discipline

**Naming:**

- `feat/<scope>-<short-desc>` — new features
- `fix/<scope>-<short-desc>` — bug fixes
- `chore/<scope>-<short-desc>` — config, deps, tooling
- `docs/<scope>` — documentation only
- `ops/<scope>` — CI / deployment / infra
- `refactor/<scope>` — code reorganization without behavior change
- Date suffix optional: `-YYYY-MM-DD` for time-anchored work
- AVOID: long descriptive names, no scope, no kebab-case

**Lifecycle:**

- Created from `main` (or default branch)
- Pushed only when ready for PR
- Auto-deleted on merge (no action needed)
- Closed/abandoned PRs delete branch in weekly sweep
- Stale (>14d untouched, no PR): deleted in weekly sweep
- Worktrees max 2 concurrent (RAM constraint)

**Enforcement:**

- Branch protection blocks force-push and deletion of `main`
- `git push` to anything-but-default-branch requires PR
- Frank's `feedback_mass_revert_protection` rule: always check `git diff --stat` before commit; never `git add .`

## 3. PR discipline

**Format:**

- Title: `<type>(<scope>): <imperative description>` — conventional commits
- Squash-merged with single commit message preserving title
- Body uses `.github/pull_request_template.md` (Summary / Changes / Test plan / Risk / Related)

**Review:**

- Self-merge with `--admin` bypass authorized for Lumina + Frank when:
  - PR is solo work and reversible
  - CI checks (when green) pass OR are pre-existing failures unrelated to PR
  - File scope confirmed via `git diff --stat`
- External agent contributions (CodeRabbit, Vercel Agent Review, Guardian Council) are advisory; not blocking

**Limits:**

- Max 50 files per PR (split larger work)
- Max 1500 LOC per PR (split larger work)
- Mixed concerns prohibited; one theme per PR

**Cadence:**

- Open → merge in ≤5 days for chores, ≤14 days for features
- Stale PRs auto-closed in weekly sweep (with reopen comment if work salvageable)

## 4. Dependency strategy — Renovate (replacing Dependabot)

**Decision (2026-05-05):** Migrate from Dependabot to Renovate. Reasons:

- Dependabot produced 43-package mega-PRs that cost Vercel build minutes and violated never-batch rule
- Renovate has native pnpm workspace support, smarter grouping, scheduling, auto-merge
- Single `renovate.json` per repo replaces `dependabot.yml` + reduces config drift

**Config rules** (`renovate.json` in repo root):

- Schedule: weekday business hours Europe/Amsterdam (avoids weekend PR floods)
- Rate limit: 2 PRs/hour, 5 concurrent max
- Auto-merge: dev deps patches + GH Actions patches/minors only
- Manual review required: production deps (any update), foundation library majors
- Blocked majors: `next`, `react`, `react-dom`, `tailwindcss`, `typescript`, `zod`, `stripe`, `framer-motion`, `openai`, `react-markdown`, `@types/node`, `@anthropic-ai/sdk`, `pnpm/action-setup`
- Workspace deps (`@arcanea/*`, `@starlight/*`): managed by pnpm, not Renovate
- Lock file maintenance: weekly Monday early morning
- Vulnerability alerts: any-time, security label

**Rollout:**

- Phase 1 (this week): arcanea-ai-app + arcanea-records (production canaries)
- Phase 2 (week+1): all Tier 1 production repos
- Phase 3 (week+2): all Tier 2 substrate/agent repos
- Phase 4 (week+3): templates and surface repos

**Rollback:** keep `dependabot.yml` valid in repo for 1 week after Renovate config lands. If Renovate produces noise we can't tune in 1 week, revert.

## 5. Vercel cost discipline

**Confirmed cost leak fixed (2026-05-04):**

- Removed `VERCEL_FORCE_NO_BUILD_CACHE: "1"` from `vercel.json` — every preview was cold-building
- Set `commandForIgnoringBuildStep` via Vercel API to `bash scripts/vercel-ignore-build.sh`
- Script skips preview builds for `dependabot/*`, `backup/*`, `worktree-*`, `copilot/*`, `changeset-release/*`, `docs/*`, and docs-only commits

**Per-Vercel-project audit (Tier 1 production):**

| Project | Production URL | Cache | Ignored Build Step |
|---|---|---|---|
| arcanea-ai-appx | www.arcanea.ai | ✅ ON | ✅ wired |
| frankx-ai-vercel-website | www.frankx.ai | ✅ ON | ⚠️ pending — needs script + API call |
| anime-legends | www.animelegends.ai | ✅ ON | ⚠️ pending |
| site (SIS) | starlightintelligence.org | ✅ ON | ⚠️ pending |
| vibeclubs-web | preview only | ✅ ON | ⚠️ pending |

**Strategy:**

- Production projects need Ignored Build Step + matching `vercel-ignore-build.sh` in repo root
- Preview-only / experimental Vercel projects: leave as-is (low traffic)
- Quarterly Vercel project audit to delete dead projects (cost: storage + dashboard noise)

**Dead Vercel projects to consider deleting:**

- `arcanea-2`, `arcanea-web`, `web` (likely deprecated)
- `v0-*` experiments
- `vercel-ai-gateway-demo`
- `arcanea-platform`, `arcanea-lobechat-labs` (64+ days old)

## 6. Multi-repo coordination model

```
  Frank (decisions, strategy, gate-setting)
        ↓
  Lumina (Opus, swarm queen) — ONE active session
        ↓
  Subagents (Sonnet/Haiku) in worktrees — parallel, isolated
```

**State distribution:**

- **`planning-with-files/SPRINT_*.md`** — engineering execution truth (in arcanea-ai-app)
- **`docs/ops/CTO_OPS_POLICY.md`** — this doc, the canonical policy
- **`docs/ops/HANDOVER-*.md`** — session-to-session continuity
- **Notion** — Gate status mirror (Captured Prompts DB when restored)
- **Obsidian** — wisdom capture, decision history
- **`.claude/projects/*/memory/MEMORY.md`** — persistent personal preferences/rules
- **`.arcanea/config/repos.json`** — registry of all Arcanea repos with role + stack

**Resource discipline (CLAUDE.md hard rules):**

- Max 4-5 concurrent Claude Code instances
- Max 2 concurrent worktrees
- Never `pnpm dev` and `pnpm build` simultaneously
- Disk: keep C: above 5 GB or WSL writes fail
- Subagents (Sonnet/Haiku) inside one Claude Code instance > multiple Claude Code instances

## 7. CI / Quality gates

**Current state (post-2026-05-04 PR #78):**

- Workflows use `pnpm --dir apps/web run <task>` (not broken `npx`)
- Build job correctly depends on `[install, lint]` (no more silent-pass)
- ESLint pinned at 9.x via `pnpm.overrides`
- TypeScript / ESLint / Install failures still pre-existing on main — separate triage needed

**Targets:**

- Phase 1 (this sprint): get `Install` job green on main
- Phase 2 (next sprint): TypeScript Check green
- Phase 3 (sprint+2): ESLint green
- Phase 4: enable required status checks in branch protection

**Not yet wired:**

- Workflow concurrency limits (prevent redundant runs on rapid pushes)
- E2E smoke as required check
- Lighthouse CI as informational (not blocking)

## 8. Security posture

**Live:**

- Branch protection blocks main mutation
- No secrets in vercel.json (verified)
- Vercel env vars used for runtime secrets

**Pending:**

- `.npmrc` plaintext token rotation (Frank's hand)
- `~/.claude/` 18+ uncommitted reviews (Frank's hand)
- Secret scanning enable on all repos
- Dependabot security alerts → Renovate vulnerabilityAlerts (in renovate.json)

## 9. Sprint cadence

**Weekly rhythm:**

- Monday: Renovate Lock File Maintenance + Sprint W## doc kickoff
- Daily: `/dawn` morning briefing + `/handover` evening summary
- Friday: `/repo-triage` cross-repo audit, weekly cleanup

**Tracked surfaces:**

- `planning-with-files/SPRINT_2026-W##_*.md` — current sprint
- `docs/ops/HANDOVER-*.md` — session continuity
- This file — long-term policy

## 10. Decision log (append-only)

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-04 | Remove `VERCEL_FORCE_NO_BUILD_CACHE` | Forced cold builds = primary cost driver |
| 2026-05-04 | Tighten Dependabot groups, PR limit 5→3 | 43-package mega-PRs unmergeable |
| 2026-05-04 | Branch protection on `main` for arcanea-ai-app | Prevent force-push / deletion |
| 2026-05-05 | Apply same protection across 18 Arcanea repos | Consistency at scale |
| 2026-05-05 | Migrate Dependabot → Renovate | Better grouping + auto-merge + workspace support |
| 2026-05-05 | Squash-only merges, auto-delete branches | Linear history, no graveyard |

---

*Living document. Update on policy changes. Reviewed weekly during Friday repo-triage.*
