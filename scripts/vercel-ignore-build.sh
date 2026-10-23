#!/usr/bin/env bash
# Vercel "Ignored Build Step" — paste contents into Vercel dashboard:
#   Project Settings → Git → Ignored Build Step → Custom command:
#   bash scripts/vercel-ignore-build.sh
#
# Exit 0 = SKIP build (cheaper). Exit 1 = PROCEED with build.
#
# Skips previews only when no deployable file changed since the prior
# successful deployment, or the author marks an intermediate [agent-wip]
# checkpoint, or the preview comes from a bot/agent branch that did not opt in
# (see the preview gate below). Draft state does not prove the tree is inert.

set -euo pipefail

BRANCH="${VERCEL_GIT_COMMIT_REF:-${GITHUB_REF_NAME:-unknown}}"

# Always build production (main → arcanea.ai)
if [[ "${VERCEL_ENV:-}" == "production" ]]; then
  echo "✅ production deploy — building"
  exit 1
fi

# Bot and agent preview gate (chore/preview-build-gate).
# Measured 2026-10-22 on this project: 34 of the last 44 preview builds that
# actually ran came from dependabot/*, agent/*, claude/* and codex/* branches
# (40 of 44 including ccr-* Claude Code remote branches). GitHub Actions CI
# still runs on every one of those branches, so skipping the Vercel preview
# does not skip any quality check. This deliberately reverses the earlier
# "branch names never hide deployable code" rule FOR PREVIEWS ONLY: the code
# is still built and tested by CI, and production always builds above.
#   - preview/* and cto/* are explicit opt-in branches and are never gated.
#   - dependabot/* previews always skip.
#   - agent branches skip unless the commit message contains [preview].
# Development and an unset VERCEL_ENV or ref fall through unchanged.
# [[ ]] / case only — under `set -euo pipefail` a pipeline here could fail
# and be mistaken for a skip, so none is used.
GATE_MSG="${VERCEL_GIT_COMMIT_MESSAGE:-}"
if [[ "${VERCEL_ENV:-}" == "preview" && -n "${VERCEL_GIT_COMMIT_REF:-}" ]]; then
  GATE_BOT=""
  case "$BRANCH" in
    preview/* | cto/*) GATE_BOT="" ;;
    dependabot/*)
      echo "⏭️  skip: dependabot preview ($BRANCH) — GitHub Actions CI still runs"
      exit 0
      ;;
    agent/* | grok/* | claude/* | codex/* | jules* | google-labs-jules* | ccr-*) GATE_BOT="1" ;;
    *) if [[ "$BRANCH" =~ -[0-9]{10,}$ ]]; then GATE_BOT="1"; fi ;;
  esac
  if [[ -n "$GATE_BOT" ]]; then
    if [[ "$GATE_MSG" == *"[preview]"* ]]; then
      echo "✅ build: agent branch $BRANCH opted in with [preview]"
      exit 1
    fi
    echo "⏭️  skip: agent branch $BRANCH without [preview] — GitHub Actions CI still runs; add [preview] to a commit message or push preview/<name>"
    exit 0
  fi
fi

# Agents may push intermediate commits without spending preview minutes.
# The final coherent commit MUST omit [agent-wip] and will build.
COMMIT_MESSAGE="${VERCEL_GIT_COMMIT_MESSAGE:-}"
if [[ "$COMMIT_MESSAGE" == *"[agent-wip]"* ]]; then
  echo "⏭️  skip: explicit agent work-in-progress checkpoint"
  exit 0
fi

# If the parent was an ignored checkpoint, force this coherent checkpoint to
# build before path comparison can skip it.
if git log -1 --format=%B HEAD^ 2>/dev/null | grep -Fq "[agent-wip]"; then
  echo "✅ build: coherent checkpoint follows [agent-wip]"
  exit 1
fi

# Compare the complete pending tree against the last successful deployment of
# this project/branch. HEAD^ misses code followed by a docs-only checkpoint.
# Vercel supplies this variable to the Ignored Build Step:
# https://vercel.com/docs/environment-variables/system-environment-variables#vercel_git_previous_sha
PREVIOUS_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"

if [[ ! "$PREVIOUS_SHA" =~ ^([0-9a-fA-F]{40}|[0-9a-fA-F]{64})$ ]] ||
   ! git cat-file -e "${PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  echo "✅ build: previous successful deployment commit unavailable"
  exit 1
fi

# Missing/shallow history and Git errors must build, never look like no changes.
if git diff --quiet "$PREVIOUS_SHA" HEAD -- ':!*.md' ':!docs/**' ':!planning-with-files/**' ':!book/**' ':!wiki/**' 2>/dev/null; then
  echo "⏭️  skip: docs-only changes since previous successful deployment"
  exit 0
fi

echo "✅ build: $BRANCH"
exit 1
