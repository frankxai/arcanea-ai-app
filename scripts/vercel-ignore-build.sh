#!/usr/bin/env bash
# Vercel "Ignored Build Step" — paste contents into Vercel dashboard:
#   Project Settings → Git → Ignored Build Step → Custom command:
#   bash scripts/vercel-ignore-build.sh
#
# Exit 0 = SKIP build (cheaper). Exit 1 = PROCEED with build.
#
# Hardened Vercel Cost & Build Shield (FrankX / Arcanea Architecture)
# Prevents unreviewed preview builds on direct branch pushes and draft PRs.
# Cuts 70-85% of preview build minutes across multi-agent swarms.

set +e  # Don't auto-abort on non-zero — we control exit codes explicitly.

BRANCH="${VERCEL_GIT_COMMIT_REF:-${GITHUB_REF_NAME:-unknown}}"
CURRENT_SHA="${VERCEL_GIT_COMMIT_SHA:-$(git rev-parse HEAD 2>/dev/null)}"
PREVIOUS_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"

# 0. Always build production (main → arcanea.ai)
if [[ "${VERCEL_ENV:-}" == "production" || "$BRANCH" == "main" ]]; then
  echo "✅ [shield] production deploy — building"
  exit 1
fi

# 0a. Manual redeploy on same commit (env-var change) must proceed
if [[ -n "$PREVIOUS_SHA" && "$CURRENT_SHA" == "$PREVIOUS_SHA" ]]; then
  echo "✅ [shield] manual redeploy on same commit ($CURRENT_SHA) — building"
  exit 1
fi

# 0b. Explicit agent work-in-progress checkpoint: skips build
COMMIT_SUBJECT="${VERCEL_GIT_COMMIT_MESSAGE:-$(git log -1 --format=%s HEAD 2>/dev/null || true)}"
COMMIT_SUBJECT="$(printf '%s\n' "$COMMIT_SUBJECT" | head -n 1)"
if printf '%s' "$COMMIT_SUBJECT" | grep -Fq "[agent-wip]"; then
  echo "⏭️  [shield] skip: explicit agent work-in-progress checkpoint"
  exit 0
fi

# 0c. If parent was an ignored checkpoint, force coherent checkpoint to build
if git log -1 --format=%s HEAD^ 2>/dev/null | grep -Fq "[agent-wip]"; then
  echo "✅ [shield] build: coherent checkpoint follows [agent-wip]"
  exit 1
fi

# 0d. Skip known noisy branch patterns that never need a web preview
case "$BRANCH" in
  dependabot/*)         echo "⏭️  [shield] skip: dependabot branch ($BRANCH)"; exit 0 ;;
  backup/*)             echo "⏭️  [shield] skip: backup branch ($BRANCH)"; exit 0 ;;
  worktree-*)           echo "⏭️  [shield] skip: worktree ref ($BRANCH)"; exit 0 ;;
  copilot/*)            echo "⏭️  [shield] skip: copilot branch ($BRANCH)"; exit 0 ;;
  changeset-release/*)  echo "⏭️  [shield] skip: changeset release ($BRANCH)"; exit 0 ;;
  docs/*)               echo "⏭️  [shield] skip: docs-only branch ($BRANCH)"; exit 0 ;;
esac

# 0e. Draft PR check (when build is triggered by a PR)
if [[ -n "${VERCEL_GIT_PULL_REQUEST_ID:-}" && -n "${VERCEL_GIT_REPO_OWNER:-}" && -n "${VERCEL_GIT_REPO_SLUG:-}" ]]; then
  PR_JSON=$(curl -sf --max-time 5 \
    "https://api.github.com/repos/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/pulls/${VERCEL_GIT_PULL_REQUEST_ID}" 2>/dev/null || true)
  if [[ -n "$PR_JSON" ]] && echo "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*true'; then
    echo "⏭️  [shield] skip: PR #${VERCEL_GIT_PULL_REQUEST_ID} is a draft"
    exit 0
  fi
fi

# 0f. Direct branch push check (when VERCEL_GIT_PULL_REQUEST_ID is unset)
# When agents or developers push commits to a feature branch before or without
# opening a pull request, check if an open, non-draft PR exists. If no open PR
# exists or all open PRs are drafts, SKIP the preview build.
if [[ -z "${VERCEL_GIT_PULL_REQUEST_ID:-}" && -n "$BRANCH" && "$BRANCH" != "main" && -n "${VERCEL_GIT_REPO_OWNER:-}" && -n "${VERCEL_GIT_REPO_SLUG:-}" ]]; then
  OPEN_PR=$(curl -sf --max-time 5 \
    "https://api.github.com/repos/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/pulls?head=${VERCEL_GIT_REPO_OWNER}:${BRANCH}&state=open" 2>/dev/null || true)
  if [[ -n "$OPEN_PR" ]]; then
    CLEAN_PR=$(printf '%s' "$OPEN_PR" | tr -d '[:space:]')
    if [[ "$CLEAN_PR" == "[]" ]]; then
      echo "⏭️  [shield] skip: No open PR for branch $BRANCH (intermediate push)"
      exit 0
    elif echo "$OPEN_PR" | grep -q '"draft"[[:space:]]*:[[:space:]]*true' && ! echo "$OPEN_PR" | grep -q '"draft"[[:space:]]*:[[:space:]]*false'; then
      echo "⏭️  [shield] skip: Open PR for branch $BRANCH is a draft"
      exit 0
    fi
  fi
fi

# 1. Base SHA selection
BASE_SHA=""
if [[ -n "$PREVIOUS_SHA" && "$PREVIOUS_SHA" =~ ^([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$ ]] && git cat-file -e "${PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  BASE_SHA="$PREVIOUS_SHA"
elif git rev-parse HEAD^ >/dev/null 2>&1; then
  BASE_SHA="HEAD^"
else
  echo "✅ [shield] build: no base commit available (first build or shallow clone)"
  exit 1
fi

# 2. Skip if changes are docs/notes only
if git diff --quiet "$BASE_SHA" HEAD -- ':!*.md' ':!docs/**' ':!planning-with-files/**' ':!book/**' ':!wiki/**' 2>/dev/null; then
  echo "⏭️  [shield] skip: docs/notes-only changes since previous deployment"
  exit 0
fi

echo "✅ [shield] relevant changes detected — building: $BRANCH"
exit 1
