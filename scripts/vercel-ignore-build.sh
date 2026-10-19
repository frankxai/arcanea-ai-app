#!/usr/bin/env bash
# Vercel "Ignored Build Step" — paste contents into Vercel dashboard:
#   Project Settings → Git → Ignored Build Step → Custom command:
#   bash scripts/vercel-ignore-build.sh
#
# Exit 0 = SKIP build (cheaper). Exit 1 = PROCEED with build.
#
# Skips previews only when no deployable file changed since the prior
# successful deployment, or the author marks an intermediate [agent-wip]
# checkpoint. Branch names and draft state do not prove the tree is inert.

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
