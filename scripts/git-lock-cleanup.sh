#!/bin/bash
# git-lock-cleanup.sh — Safely remove stale git locks and optimize repo
# Run before/after overnight sessions, or on cron
# Usage: bash scripts/git-lock-cleanup.sh [--force]

set -euo pipefail

REPO_DIR="${1:-C:/Users/frank/Arcanea}"
FORCE="${2:---safe}"

echo "=== Git Lock Cleanup — $(date) ==="
echo "Repo: $REPO_DIR"

# 1. Check for and remove stale index.lock
LOCK_FILE="$REPO_DIR/.git/index.lock"
if [ -f "$LOCK_FILE" ]; then
    # Check if any git process is still running
    GIT_PROCS=$(tasklist 2>/dev/null | grep -c "git" || echo "0")
    if [ "$GIT_PROCS" -eq 0 ] || [ "$FORCE" = "--force" ]; then
        echo "REMOVING stale index.lock (no active git processes)"
        rm -f "$LOCK_FILE"
    else
        echo "WARNING: index.lock exists and $GIT_PROCS git processes running. Use --force to override."
    fi
else
    echo "OK: No index.lock found"
fi

# 2. Remove other stale lock files in .git
find "$REPO_DIR/.git" -name "*.lock" -type f 2>/dev/null | while read -r lock; do
    echo "REMOVING stale lock: $lock"
    rm -f "$lock"
done

# 3. Run git gc if .git > 500MB
GIT_SIZE=$(du -sm "$REPO_DIR/.git" 2>/dev/null | awk '{print $1}')
if [ "${GIT_SIZE:-0}" -gt 500 ]; then
    echo "GIT DIR: ${GIT_SIZE}MB — running gc..."
    git -C "$REPO_DIR" gc --auto --quiet
else
    echo "GIT DIR: ${GIT_SIZE}MB — OK"
fi

# 4. Update untracked cache
git -C "$REPO_DIR" update-index --untracked-cache 2>/dev/null || true

# 5. Verify performance features
echo "=== Git Performance Config ==="
for key in core.fsmonitor core.untrackedCache feature.manyFiles index.threads core.preloadindex; do
    val=$(git -C "$REPO_DIR" config "$key" 2>/dev/null || echo "NOT SET")
    echo "  $key = $val"
done

# 6. Quick health check
echo "=== Health Check ==="
TIME_START=$(date +%s%N)
git -C "$REPO_DIR" status --porcelain > /dev/null 2>&1
TIME_END=$(date +%s%N)
ELAPSED_MS=$(( (TIME_END - TIME_START) / 1000000 ))
echo "  git status: ${ELAPSED_MS}ms"
if [ "$ELAPSED_MS" -gt 2000 ]; then
    echo "  WARNING: git status > 2s — investigate untracked files or disk I/O"
else
    echo "  OK: git operations fast"
fi

echo "=== Cleanup complete — $(date) ==="
