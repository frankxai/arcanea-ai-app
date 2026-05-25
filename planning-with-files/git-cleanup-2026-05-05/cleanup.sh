#!/usr/bin/env bash
# ============================================================================
# Git Cleanup Script — generated 2026-05-05 (Sun) by worktree-branch-cleaner
# Repo: frankxai/arcanea-ai-app  (cwd assumed: C:\Users\frank\Arcanea)
#
# REVIEW BEFORE RUNNING. Author Frank.
# Phase 1 = safe (-d, refuses unmerged). Phase 2 = force (-D), commented.
# Remote deletes are intentionally NOT generated — open PRs not verifiable
# without `gh` CLI available in this audit environment.
# ============================================================================

set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

CURRENT_BRANCH="$(git branch --show-current)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "WARN: current branch is '$CURRENT_BRANCH', not main."
  echo "      Switch to main before deleting branches you may want to keep checked out."
  echo "      Continue anyway? (y/N)"
  read -r ans
  [[ "$ans" == "y" || "$ans" == "Y" ]] || exit 1
fi

# ----------------------------------------------------------------------------
# PHASE 1 — SAFE: prune broken worktree + delete merged branches
# ----------------------------------------------------------------------------

echo "==> Phase 1.1: prune stale worktree (design-evolution, gitdir broken, 17d stale)"
git worktree prune -v
# If the broken worktree is still listed after prune, force-remove its admin dir:
# rm -rf .git/worktrees/design-evolution

echo "==> Phase 1.2: delete merged local branches (-d, safe; refuses if unmerged)"
git branch -d fix/ts-errors-top5            # merged 2026-04-17, 18d stale
git branch -d orchestrator/v1.2.0-release   # merged 2026-04-18, 17d stale

echo "==> Phase 1 complete. Local branch count:"
git branch | wc -l

# ----------------------------------------------------------------------------
# PHASE 2 — REVIEW: force-delete unmerged stale branches (≥ 7d, not backup/*)
# Uncomment after spot-checking each branch's last commit. Both backup/* are
# preserved deliberately.
# ----------------------------------------------------------------------------

# echo "==> Phase 2: force-delete stale unmerged branches (-D)"
# git branch -D feat/library-os-fantasy                  # 2026-04-25, 10d
# git branch -D feat/author-council-2026-04-21           # 2026-04-21, 14d
# git branch -D docs/ao-unification-handover-2026-04-21  # 2026-04-21, 14d, handover doc
# git branch -D feat/ao-meta-dispatcher-2026-04-21       # 2026-04-21, 14d
# git branch -D chore/skill-registry-cleanup-2026-04-21  # 2026-04-21, 14d
# git branch -D docs/ops-handover-autonomous-2026-04-19  # 2026-04-20, 15d, handover doc
# git branch -D fix/transpile-publishing-house-2026-04-19# 2026-04-20, 15d
# git branch -D feat/swarm-invoke-planner-2026-04-19     # 2026-04-20, 15d
# git branch -D feat/publish-taste-gate-2026-04-19       # 2026-04-20, 15d
# git branch -D fix/ts-errors-rebased-2026-04-19         # 2026-04-20, 15d
# git branch -D feat/author-taste-gate-2026-04-19        # 2026-04-20, 15d
# git branch -D docs/2026-04-18-handover                 # 2026-04-18, 17d, was attached to broken worktree
# git branch -D feat/design-excellence                   # 2026-04-18, 17d
# git branch -D orchestrator/post-merge-skill-handover   # 2026-04-18, 17d
# git branch -D feat/multi-luminor-sprint                # 2026-04-18, 17d
# git branch -D ops/ci-typecheck-blocking                # 2026-04-18, 17d
# git branch -D worktree-design-evolution                # 2026-04-18, 17d
# git branch -D fix/ts-errors-batch5                     # 2026-04-18, 17d

# Preserved deliberately:
#   backup/voice-dashboard-2.0-pre-canonical    (2026-04-25)
#   backup/chore-second-brain-pre-canonical     (2026-04-25)

# ----------------------------------------------------------------------------
# PHASE 3 — REMOTE (NOT AUTO-GENERATED)
# ----------------------------------------------------------------------------
# Cross-check open-PR state with `gh pr list --state open` before any
# `git push origin --delete`. Likely candidates after PR review:
#
#   origin/feat/pnpm-v6                                              (2026-04-17)
#   origin/dependabot/github_actions/actions/setup-node-6            (2026-04-20)
#   origin/dependabot/github_actions/marocchino/sticky-pull-request-comment-3 (2026-04-20)
#   origin/dependabot/github_actions/actions/checkout-6              (2026-04-21)
#   origin/dependabot/github_actions/actions/github-script-9         (2026-04-21)
#
# All five are dependabot PRs — the right action is `gh pr merge` or
# `gh pr close`, which auto-deletes the remote branch.

echo "==> Done. Run: git fetch --prune origin   (clears local refs to deleted remotes)"
