# Git Hygiene Audit — 2026-05-05 (Sun)

**Scope:** local working trees under `C:\Users\frank\Arcanea`; primary remote `frankxai/arcanea-ai-app`. Sub-repos with non-`frankxai/*` provenance or zero recent activity are listed but not actioned.

**Caveats:**
- `gh` CLI unavailable in audit env → open-PR status not cross-checked. Dependabot branches all carry open PRs by convention; do not delete them remotely until PR is merged or closed.
- Squash-merge workflow strips merge ancestry → no remote branches register as "merged into origin/main" via `git branch -r --merged`. Treat remote-side classification as date-based only.
- `git branch -d` will refuse to delete unmerged branches. The local-side script uses `-d` (safe); switch to `-D` only after explicit confirmation.

---

## 1. Worktree Audit — `arcanea-ai-app`

| Path | Branch | HEAD | Last commit | Status |
|---|---|---|---|---|
| `C:\Users\frank\Arcanea` | `feat/las-tierras-overnight-2026-05-05` | `93758678` | 2026-05-05 | ACTIVE (current) |
| `C:\Users\frank\Arcanea\.claude\worktrees\design-evolution` | `docs/2026-04-18-handover` | `a27f7470` | 2026-04-18 | **PRUNABLE** — gitdir points to non-existent location, 17d stale |

### Worktree action
- Prune the broken `design-evolution` worktree. The branch `docs/2026-04-18-handover` survives the prune and can be deleted separately.

---

## 2. Branch Audit — `arcanea-ai-app`

**Counts:** 29 local · 23 remote (origin) · 22 remote unmerged · 0 remote merged (squash-strip artifact).

### 2a. PROTECTED (never touch)
- `main` / `origin/main`

### 2b. ACTIVE — commits within last 7 days (since 2026-04-28)

Local (6):
- `feat/las-tierras-overnight-2026-05-05` — current worktree HEAD
- `fix/ci-turbo-build-chain-2026-05-05`
- `feat/cockpit-2026-05-05`
- `feat/jarvis-tools-2026-05-05`
- `feat/las-tierras-visual-and-name-2026-05-05`
- `feature/i18n-phase2-apps-web` *(also merged — leave alone, still active)*

Remote-only (10):
- `origin/chore/i18n-phase2-foundation-2026-05-05`
- `origin/fix/lockfile-multilingual-2026-05-05`
- `origin/feat/voice-workflows-2026-05-04`
- `origin/docs/sprint-w19-2026-05-04`
- `origin/chore/ci-and-e2e-fixes-2026-05-04`
- `origin/chore/cost-hygiene-2026-05-04`
- `origin/chore/ops-policy-renovate-2026-05-05`
- `origin/feature/i18n-foundation` (2026-05-03)
- `origin/dependabot/npm_and_yarn/{dev-deps,dev-patches,production-minors,production-patches}` (4× — open PRs)

### 2c. SAFE TO DELETE — merged + >= 7 days old

Local (2):

| Branch | Last commit | Note |
|---|---|---|
| `fix/ts-errors-top5` | 2026-04-17 | merged into main, 18d stale |
| `orchestrator/v1.2.0-release` | 2026-04-18 | merged into main, 17d stale |

Remote: none verified merged (squash-merge artifact). **Do not auto-delete remote branches without PR confirmation.**

### 2d. REVIEW — unmerged, no commits in 7+ days

Local (21 branches; ordered newest -> oldest):

| Branch | Last commit | Notes |
|---|---|---|
| `feat/library-os-fantasy` | 2026-04-25 | unmerged, 10d |
| `backup/voice-dashboard-2.0-pre-canonical` | 2026-04-25 | **BACKUP** — retain by intent |
| `backup/chore-second-brain-pre-canonical` | 2026-04-25 | **BACKUP** — retain by intent |
| `feat/author-council-2026-04-21` | 2026-04-21 | 14d |
| `docs/ao-unification-handover-2026-04-21` | 2026-04-21 | 14d, handover doc |
| `feat/ao-meta-dispatcher-2026-04-21` | 2026-04-21 | 14d |
| `chore/skill-registry-cleanup-2026-04-21` | 2026-04-21 | 14d |
| `docs/ops-handover-autonomous-2026-04-19` | 2026-04-20 | 15d, handover doc |
| `fix/transpile-publishing-house-2026-04-19` | 2026-04-20 | 15d |
| `feat/swarm-invoke-planner-2026-04-19` | 2026-04-20 | 15d |
| `feat/publish-taste-gate-2026-04-19` | 2026-04-20 | 15d |
| `fix/ts-errors-rebased-2026-04-19` | 2026-04-20 | 15d |
| `feat/author-taste-gate-2026-04-19` | 2026-04-20 | 15d |
| `docs/2026-04-18-handover` | 2026-04-18 | 17d, attached to broken worktree — delete after worktree prune |
| `feat/design-excellence` | 2026-04-18 | 17d |
| `orchestrator/post-merge-skill-handover` | 2026-04-18 | 17d |
| `feat/multi-luminor-sprint` | 2026-04-18 | 17d |
| `ops/ci-typecheck-blocking` | 2026-04-18 | 17d |
| `worktree-design-evolution` | 2026-04-18 | 17d, scaffolding artifact |
| `fix/ts-errors-batch5` | 2026-04-18 | 17d |

Remote (5):

| Branch | Last commit |
|---|---|
| `origin/feat/pnpm-v6` | 2026-04-17 |
| `origin/dependabot/github_actions/actions/setup-node-6` | 2026-04-20 |
| `origin/dependabot/github_actions/marocchino/sticky-pull-request-comment-3` | 2026-04-20 |
| `origin/dependabot/github_actions/actions/checkout-6` | 2026-04-21 |
| `origin/dependabot/github_actions/actions/github-script-9` | 2026-04-21 |

---

## 3. Sub-repo snapshots (informational only — not actioned)

| Repo | Local branches | Remote branches | Last activity | Note |
|---|---|---|---|---|
| `arcanea-onchain` | 1 | 1 | 2026-02-17 | dormant, single-branch |
| `oh-my-arcanea` | 1 | 18 | 2026-04-02 | 18 stale remotes — separate audit pass needed |
| `arcanea-orchestrator` | 1 | **643** | 2026-04-03 | upstream fork debris, exclude from cleanup until canon decided |
| `starlight-intelligence-system` | 2 | 3 | 2026-04-03 | feature branch ahead of main |
| `arcanea-code` | 2 | 2 | 2026-04-02 | backup branch pinned by name |
| `apps/web` (nested .git) | 4 | 0 | 2026-04-15 | **anomaly** — nested git repo with no remote, 4 stale branches; should be flattened into root repo |

---

## 4. Cleanup Script

Written to `cleanup.sh` alongside this report. Two-phase: (1) safe local deletions only, (2) optional review-tier with `-D` force flag commented out.

**Net effect of phase 1:**
- Prune 1 broken worktree
- Delete 2 merged local branches (`-d`, safe)
- Total local-branch surface drops 29 -> 27

**Phase 2 (commented):** force-delete 18 stale unmerged local branches (excludes both `backup/*`). Surface drops to 9. Frank to uncomment after spot-check.

**Remote deletions:** none auto-generated. Awaits PR-state cross-check via `gh` once available.
