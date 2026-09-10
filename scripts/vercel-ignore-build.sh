#!/usr/bin/env bash
# Vercel "Ignored Build Step" — paste contents into Vercel dashboard:
#   Project Settings → Git → Ignored Build Step → Custom command:
#   bash scripts/vercel-ignore-build.sh
#
# Exit 0 = SKIP build (cheaper). Exit 1 = PROCEED with build.
#
# Skips preview builds for noisy branches that don't need a Vercel preview
# (Dependabot auto-PRs, backup snapshots, worktree refs, doc-only branches).
# This is the primary lever for reducing Vercel build minutes.

set -euo pipefail

BRANCH="${VERCEL_GIT_COMMIT_REF:-${GITHUB_REF_NAME:-unknown}}"

# Always build production (main → arcanea.ai)
if [[ "${VERCEL_ENV:-}" == "production" ]]; then
  echo "✅ production deploy — building"
  exit 1
fi

# Agents may push intermediate commits without spending preview minutes.
# The final coherent commit MUST omit [agent-wip] and will build.
COMMIT_MESSAGE="${VERCEL_GIT_COMMIT_MESSAGE:-}"
if [[ "$COMMIT_MESSAGE" == *"[agent-wip]"* ]]; then
  echo "⏭️  skip: explicit agent work-in-progress checkpoint"
  exit 0
fi

# If the parent was an ignored checkpoint, force this coherent checkpoint to
# build before any branch/path filters can skip it.
if git log -1 --format=%B HEAD^ 2>/dev/null | grep -Fq "[agent-wip]"; then
  echo "✅ build: coherent checkpoint follows [agent-wip]"
  exit 1
fi

# Skip patterns (most noise comes from these)
case "$BRANCH" in
  dependabot/*)         echo "⏭️  skip: dependabot branch ($BRANCH)"; exit 0 ;;
  backup/*)             echo "⏭️  skip: backup branch ($BRANCH)"; exit 0 ;;
  worktree-*)           echo "⏭️  skip: worktree ref ($BRANCH)"; exit 0 ;;
  copilot/*)            echo "⏭️  skip: copilot branch ($BRANCH)"; exit 0 ;;
  changeset-release/*)  echo "⏭️  skip: changeset release ($BRANCH)"; exit 0 ;;
  docs/*)               echo "⏭️  skip: docs-only branch ($BRANCH)"; exit 0 ;;
esac

# Compare the complete pending tree against the last successful deployment of
# this project/branch. HEAD^ misses code followed by a docs-only checkpoint.
# Vercel supplies this variable to the Ignored Build Step:
# https://vercel.com/docs/environment-variables/system-environment-variables#vercel_git_previous_sha
PREVIOUS_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"

# Check if triggering PR is a draft (unauthenticated GitHub API check)
if [[ -n "${VERCEL_GIT_PULL_REQUEST_ID:-}" && -n "${VERCEL_GIT_REPO_OWNER:-}" && -n "${VERCEL_GIT_REPO_SLUG:-}" ]]; then
  PR_JSON=$(curl -sf --max-time 5 \
    "https://api.github.com/repos/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/pulls/${VERCEL_GIT_PULL_REQUEST_ID}" 2>/dev/null || true)
  if [[ -n "$PR_JSON" ]] && echo "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*true'; then
    echo "⏭️  skip: PR #${VERCEL_GIT_PULL_REQUEST_ID} is a draft"
    exit 0
  fi
fi

if [[ ! "$PREVIOUS_SHA" =~ ^([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$ ]] ||
   ! git cat-file -e "${PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  echo "✅ build: previous successful deployment commit unavailable"
  exit 1
fi

# In this monorepo, only changes to apps/web, workspace packages, dependency configs,
# or root build manifests affect the Vercel web deployment. Changes to .arcanea/lore,
# book/, docs/, scripts/, etc. do NOT require rebuilding the web app.
RELEVANT_PATHS=(
  apps/web
  packages/design-system
  packages/mcp-server
  packages/orchestrator
  packages/publishing-house
  packages/world-engine
  packages/multilingual
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  vercel.json
)

if git diff --quiet "$PREVIOUS_SHA" HEAD -- "${RELEVANT_PATHS[@]}" 2>/dev/null; then
  echo "⏭️  skip: no changes in apps/web or web-dependent packages since last deploy"
  exit 0
fi

echo "✅ build: relevant web changes detected for $BRANCH"
exit 1

