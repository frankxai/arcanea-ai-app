#!/usr/bin/env bash
# Vercel ignoreCommand (vercel.json). Exit 0 SKIPS the build, exit 1 BUILDS.
#
# Preview policy (2026-10-22, estate Vercel build budget): 84% of this
# project's build minutes were non-main branches (2026-10-07..21, 771
# deployments, one branch built 44 times). Previews are now opt-in for agent
# branches and need proof the PR is ready; bots and catch-up merges never
# build; production is never skipped.
#
# Agents that use previews instead of local `pnpm dev` get one by:
#   - putting [preview] anywhere in the commit message
#   - pushing the branch as preview/<name>
#   - running `vercel deploy` (CLI deploys bypass this step)
#
# Past the gate, docs-only changes since the previous successful deployment
# still skip. Fail-safe direction: production and unknown refs build; git
# errors and missing history build.

set +e

REF="${VERCEL_GIT_COMMIT_REF:-}"
MESSAGE="${VERCEL_GIT_COMMIT_MESSAGE:-}"
SUBJECT="$(printf '%s\n' "$MESSAGE" | head -n 1)"

# 0. Production (main -> arcanea.ai), main, and an unknown ref always build.
if [ "${VERCEL_ENV:-}" = "production" ] || [ -z "$REF" ] || [ "$REF" = "main" ]; then
  echo "[preview-gate] production/main — BUILDING."
  exit 1
fi

# 1. Explicit opt-in beats every skip rule below.
case "$REF" in
  preview/*) echo "[preview-gate] preview/* branch — BUILDING."; exit 1 ;;
esac
case "$MESSAGE" in
  *"[preview]"*) echo "[preview-gate] [preview] requested — BUILDING."; exit 1 ;;
esac

# 2. Bots and tooling branches never need a preview.
case "$REF" in
  dependabot/*|renovate/*|copilot/*|changeset-release/*|backup/*|worktree-*)
    echo "[preview-gate] bot/tooling branch $REF — SKIPPING. Add [preview] to build."
    exit 0 ;;
esac

# 3. Catching a branch up with main reviews nothing new (41% of one sibling
#    project's preview minutes were exactly this). Subject line only.
case "$SUBJECT" in
  "Merge branch 'main'"*|"Merge remote-tracking branch 'origin/main'"*)
    echo "[preview-gate] catch-up merge from main — SKIPPING. Add [preview] to build."
    exit 0 ;;
esac

# 4. [agent-wip] in the subject line is an explicit checkpoint.
case "$SUBJECT" in
  *"[agent-wip]"*) echo "[preview-gate] [agent-wip] checkpoint — SKIPPING."; exit 0 ;;
esac

# 5. Draft / no-PR check through the public GitHub API (repo is public, no token).
#    PR_STATE: ready | draft | none | unknown. Rate limits and network errors
#    land on "unknown", never on a skip.
PR_STATE="unknown"
OWNER="${VERCEL_GIT_REPO_OWNER:-}"
SLUG="${VERCEL_GIT_REPO_SLUG:-}"
if [ -n "$OWNER" ] && [ -n "$SLUG" ]; then
  if [ -n "${VERCEL_GIT_PULL_REQUEST_ID:-}" ]; then
    PR_JSON="$(curl -sf --max-time 5 "https://api.github.com/repos/${OWNER}/${SLUG}/pulls/${VERCEL_GIT_PULL_REQUEST_ID}" 2>/dev/null)"
    if [ -n "$PR_JSON" ]; then
      if printf '%s' "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*true'; then
        PR_STATE="draft"
      elif printf '%s' "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*false'; then
        PR_STATE="ready"
      fi
    fi
  else
    PR_JSON="$(curl -sf --max-time 5 "https://api.github.com/repos/${OWNER}/${SLUG}/pulls?head=${OWNER}:${REF}&state=open" 2>/dev/null)"
    if [ -n "$PR_JSON" ]; then
      CLEAN="$(printf '%s' "$PR_JSON" | tr -d '[:space:]')"
      if [ "$CLEAN" = "[]" ]; then
        PR_STATE="none"
      elif printf '%s' "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*false'; then
        PR_STATE="ready"
      elif printf '%s' "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*true'; then
        PR_STATE="draft"
      fi
    fi
  fi
fi

case "$PR_STATE" in
  draft) echo "[preview-gate] PR is a draft — SKIPPING. Add [preview] to build."; exit 0 ;;
  none)  echo "[preview-gate] no open PR for $REF — SKIPPING. Add [preview] to build."; exit 0 ;;
esac

# 6. Agent branches need positive proof the PR is ready. "unknown" (API down,
#    rate-limited) is not proof, so it skips; the opt-in above is the way through.
case "$REF" in
  agent/*|codex/*|grok/*|grok-bot/*|claude/*|jules/*|antigravity/*|hermes/*|gemini/*|v0/*|ccr-*)
    if [ "$PR_STATE" != "ready" ]; then
      echo "[preview-gate] agent branch $REF without a confirmed ready PR — SKIPPING. Add [preview] to build."
      exit 0
    fi ;;
esac


# Past the gate: this branch is allowed a preview.

# The first coherent commit after an ignored [agent-wip] checkpoint builds
# before the path comparison can skip it. Subject only, matching rule 4.
if git log -1 --format=%s HEAD^ 2>/dev/null | grep -Fq "[agent-wip]"; then
  echo "[preview-gate] coherent checkpoint follows [agent-wip] — BUILDING."
  exit 1
fi

# Compare the complete pending tree against the last successful deployment of
# this project/branch. HEAD^ misses code followed by a docs-only checkpoint.
# https://vercel.com/docs/environment-variables/system-environment-variables#vercel_git_previous_sha
PREVIOUS_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"
if ! printf '%s' "$PREVIOUS_SHA" | grep -Eq '^([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$' ||
   ! git cat-file -e "${PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  echo "[preview-gate] previous successful deployment commit unavailable — BUILDING."
  exit 1
fi

# rc 0 = docs only, rc 1 = deployable change, anything else = git error -> build.
git diff --quiet "$PREVIOUS_SHA" HEAD -- ':!*.md' ':!docs/**' ':!planning-with-files/**' ':!book/**' ':!wiki/**' 2>/dev/null
if [ $? -eq 0 ]; then
  echo "[preview-gate] docs-only changes since previous successful deployment — SKIPPING."
  exit 0
fi

echo "[preview-gate] $REF (PR state: $PR_STATE) — BUILDING."
exit 1
