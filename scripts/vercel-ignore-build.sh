#!/usr/bin/env bash
# Vercel ignoreCommand — exit 0 SKIPS the build, exit 1 PROCEEDS.
#   vercel.json: "ignoreCommand": "bash scripts/vercel-ignore-build.sh"
#
# Measured 2026-09-03: 20 deployment records in 7.7h. The branch skips below were already
# working (5 dependabot builds correctly skipped). The remaining spend was 8 preview builds
# across 5 agent branches — one branch built 3x, another 2x — plus every non-web path in
# this monorepo triggering a full `pnpm --filter @arcanea/web...` build with a 4GB heap.
#
# FAIL SAFE TO PROCEED. Any unexpected condition returns 1 so the build runs. Skipping a
# build that should have run ships stale production; running one that could have been
# skipped is only cost.

set +e  # Exit codes are controlled explicitly below; never abort mid-script.

BRANCH="${VERCEL_GIT_COMMIT_REF:-${GITHUB_REF_NAME:-unknown}}"

# 1. Production always builds.
if [[ "${VERCEL_ENV:-}" == "production" ]]; then
  echo "build: production deploy"
  exit 1
fi

# 2. Explicit agent checkpoint. The final coherent commit MUST omit the marker.
COMMIT_MESSAGE="${VERCEL_GIT_COMMIT_MESSAGE:-}"
if [ -z "$COMMIT_MESSAGE" ]; then
  COMMIT_MESSAGE="$(git log -1 --format=%B HEAD 2>/dev/null)"
fi
if [[ "$COMMIT_MESSAGE" == *"[agent-wip]"* ]]; then
  echo "skip: explicit agent work-in-progress checkpoint"
  exit 0
fi

# 3. Explicit operator override. Use on a coherent commit when the path/draft filters
#    intentionally skipped the preview that must prove a deployment-pipeline change.
if [[ "$COMMIT_MESSAGE" == *"[vercel-force]"* ]]; then
  echo "build: explicit [vercel-force] override"
  exit 1
fi

# 4. First coherent commit after a skipped checkpoint must build, before any filter below.
if git log -1 --format=%B HEAD^ 2>/dev/null | grep -Fq "[agent-wip]"; then
  echo "build: coherent checkpoint follows [agent-wip]"
  exit 1
fi

# 5. Noisy branch classes that never need a preview.
case "$BRANCH" in
  dependabot/*)         echo "skip: dependabot branch ($BRANCH)"; exit 0 ;;
  backup/*)             echo "skip: backup branch ($BRANCH)"; exit 0 ;;
  worktree-*)           echo "skip: worktree ref ($BRANCH)"; exit 0 ;;
  copilot/*)            echo "skip: copilot branch ($BRANCH)"; exit 0 ;;
  changeset-release/*)  echo "skip: changeset release ($BRANCH)"; exit 0 ;;
  docs/*)               echo "skip: docs-only branch ($BRANCH)"; exit 0 ;;
esac

# 6. Draft PR. Ported from frankx.ai-vercel-website, which has had this since 2026-05 —
#    arcanea did not. VERCEL_GIT_PULL_REQUEST_ID is only set for PR-linked previews, so
#    this can never affect production. Any curl or parse failure falls through to the
#    path filters below rather than risking a false skip.
if [ -n "${VERCEL_GIT_PULL_REQUEST_ID:-}" ] && [ -n "${VERCEL_GIT_REPO_OWNER:-}" ] && [ -n "${VERCEL_GIT_REPO_SLUG:-}" ]; then
  PR_JSON=$(curl -sf --max-time 5 \
    "https://api.github.com/repos/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/pulls/${VERCEL_GIT_PULL_REQUEST_ID}" 2>/dev/null)
  if [ -n "$PR_JSON" ] && echo "$PR_JSON" | grep -q '"draft"[[:space:]]*:[[:space:]]*true'; then
    echo "skip: PR #${VERCEL_GIT_PULL_REQUEST_ID} is a draft"
    exit 0
  fi
fi

# Paths that can change what `pnpm --filter @arcanea/web... build` produces.
#
# This replaces an exclusion list (":!*.md :!docs/** ...") with an allowlist. An exclusion
# list has to predict every noisy path and fails open on the ones it forgot — in this repo
# that meant .arcanea lore, .claude, .github, .agents and apps/agenthub all triggering a
# full monorepo build with a 4GB heap.
#
# `packages` is included wholesale on purpose: the `...` in the build filter pulls in
# workspace dependencies, and enumerating which ones is a maintenance trap that fails
# toward NOT building. Erring wide costs an occasional build; erring narrow ships stale.
RELEVANT_PATHS=(
  apps/web
  packages
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  vercel.json
  scripts/vercel-ignore-build.sh
  tsconfig.json
  next.config.mjs
  next.config.js
  tailwind.config.js
  tailwind.config.ts
  postcss.config.js
  postcss.config.mjs
  .npmrc
)

# 7. A preview only earns a build if it differs from what production already built.
#    Catches "Merge branch 'main' into agent/..." commits, which otherwise rebuild a
#    preview that reviews nothing new. Only runs when origin/main is present locally
#    (Vercel clones are shallow); otherwise falls through and builds.
if [ "$BRANCH" != "main" ] && git rev-parse --verify -q origin/main >/dev/null 2>&1; then
  git diff --quiet origin/main HEAD -- "${RELEVANT_PATHS[@]}" 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "skip: branch has no relevant diff against origin/main"
    exit 0
  fi
fi

# 8. Path diff against the previous commit.
if ! git rev-parse HEAD^ >/dev/null 2>&1; then
  echo "build: no parent commit (first build or shallow clone)"
  exit 1
fi

git diff --quiet HEAD^ HEAD -- "${RELEVANT_PATHS[@]}"
RC=$?
case $RC in
  0)
    echo "skip: no paths affecting the web build changed"
    git diff --name-only HEAD^ HEAD 2>/dev/null | sed 's/^/  - /' || true
    exit 0
    ;;
  1)
    echo "build: relevant changes detected"
    git diff --name-only HEAD^ HEAD -- "${RELEVANT_PATHS[@]}" | sed 's/^/  - /'
    exit 1
    ;;
  *)
    echo "build: git diff returned rc=$RC — failing safe"
    exit 1
    ;;
esac
