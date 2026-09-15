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

# Skip patterns (most noise comes from these)
case "$BRANCH" in
  dependabot/*)         echo "⏭️  skip: dependabot branch ($BRANCH)"; exit 0 ;;
  backup/*)             echo "⏭️  skip: backup branch ($BRANCH)"; exit 0 ;;
  worktree-*)           echo "⏭️  skip: worktree ref ($BRANCH)"; exit 0 ;;
  copilot/*)            echo "⏭️  skip: copilot branch ($BRANCH)"; exit 0 ;;
  changeset-release/*)  echo "⏭️  skip: changeset release ($BRANCH)"; exit 0 ;;
  docs/*)               echo "⏭️  skip: docs-only branch ($BRANCH)"; exit 0 ;;
esac

# Skip if HEAD only touches docs/markdown (preview deploy adds no value)
if git diff --quiet HEAD^ HEAD -- ':!*.md' ':!docs/**' ':!planning-with-files/**' ':!book/**' ':!wiki/**' 2>/dev/null; then
  echo "⏭️  skip: docs-only commit"
  exit 0
fi

echo "✅ build: $BRANCH"
exit 1
