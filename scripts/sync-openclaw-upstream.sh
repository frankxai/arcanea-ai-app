#!/usr/bin/env bash
# Sync arcanea-openclaw fork with upstream openclaw/openclaw.
#
# This script:
#   1. Clones or updates arcanea-openclaw locally in a temp directory
#   2. Fetches upstream changes
#   3. Attempts a fast-forward merge from upstream/main
#   4. If conflicts, creates a branch with upstream merged for manual review
#   5. Pushes the result (only if clean fast-forward)
#
# Requires:
#   - gh CLI authenticated
#   - git CLI
#   - GITHUB_TOKEN env var OR gh auth status passing
#
# Usage:
#   bash scripts/sync-openclaw-upstream.sh [--dry-run] [--push]
#
# Exit codes:
#   0 = clean sync (or dry-run reporting no changes needed)
#   1 = conflicts require manual merge
#   2 = other error

set -euo pipefail

UPSTREAM_REPO="openclaw/openclaw"
FORK_REPO="frankxai/arcanea-openclaw"
WORKDIR="${TMPDIR:-/tmp}/arcanea-openclaw-sync-$$"
DRY_RUN=false
PUSH=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --push) PUSH=true ;;
    --help|-h)
      sed -n '2,/^$/p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
  esac
done

log() { echo "[sync-openclaw] $*"; }
err() { echo "[sync-openclaw] ERROR: $*" >&2; }

cleanup() {
  if [ -d "$WORKDIR" ] && [ "$DRY_RUN" = "false" ]; then
    log "Cleaning up $WORKDIR"
    rm -rf "$WORKDIR"
  fi
}
trap cleanup EXIT

# Check prerequisites
if ! command -v gh &> /dev/null; then
  err "gh CLI not installed. Install from https://cli.github.com"
  exit 2
fi
if ! command -v git &> /dev/null; then
  err "git not installed"
  exit 2
fi
if ! gh auth status &> /dev/null; then
  err "gh not authenticated. Run: gh auth login"
  exit 2
fi

log "Preparing workspace at $WORKDIR"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

log "Cloning $FORK_REPO (shallow)"
gh repo clone "$FORK_REPO" . -- --depth=1 2>&1 | sed 's/^/  /'

log "Adding upstream: $UPSTREAM_REPO"
git remote add upstream "https://github.com/$UPSTREAM_REPO.git" 2>/dev/null || \
  git remote set-url upstream "https://github.com/$UPSTREAM_REPO.git"

log "Fetching upstream (shallow)"
git fetch upstream main --depth=50 2>&1 | sed 's/^/  /'

# Detect default branch of fork
FORK_DEFAULT=$(gh api "repos/$FORK_REPO" --jq .default_branch)
log "Fork default branch: $FORK_DEFAULT"

git checkout "$FORK_DEFAULT" 2>&1 | sed 's/^/  /'
git fetch origin "$FORK_DEFAULT" --depth=50 2>&1 | sed 's/^/  /'

# Count commits behind
BEHIND=$(git rev-list --count "origin/$FORK_DEFAULT..upstream/main" 2>/dev/null || echo "unknown")
AHEAD=$(git rev-list --count "upstream/main..origin/$FORK_DEFAULT" 2>/dev/null || echo "unknown")

log "Fork is $BEHIND commits behind upstream, $AHEAD commits ahead"

if [ "$BEHIND" = "0" ]; then
  log "Already up to date. Nothing to do."
  exit 0
fi

if [ "$DRY_RUN" = "true" ]; then
  log "DRY RUN — would sync $BEHIND commits from upstream/main"
  log "Recent upstream commits:"
  git log --oneline "origin/$FORK_DEFAULT..upstream/main" | head -10 | sed 's/^/  /'
  exit 0
fi

log "Attempting fast-forward merge from upstream/main"
if git merge --ff-only upstream/main 2>&1 | sed 's/^/  /'; then
  log "Clean fast-forward merge"

  if [ "$PUSH" = "true" ]; then
    log "Pushing to $FORK_REPO:$FORK_DEFAULT"
    git push origin "$FORK_DEFAULT" 2>&1 | sed 's/^/  /'
    log "Sync complete. $FORK_REPO is now current with upstream."
  else
    log "Skipping push (use --push to enable)"
    log "Run: git push origin $FORK_DEFAULT"
  fi
  exit 0
else
  log "Fast-forward failed — upstream has diverged or local has commits"
  log "Creating sync branch for manual review"

  BRANCH_NAME="sync/upstream-$(date +%Y-%m-%d)"
  git checkout -b "$BRANCH_NAME"

  if git merge upstream/main --no-edit 2>&1 | sed 's/^/  /'; then
    log "Merge succeeded on branch $BRANCH_NAME"
    if [ "$PUSH" = "true" ]; then
      git push -u origin "$BRANCH_NAME"
      log "Pushed branch $BRANCH_NAME — review and merge manually"
    fi
    exit 0
  else
    err "Merge conflicts — manual resolution required"
    err "Workspace at: $WORKDIR (will NOT be cleaned up)"
    DRY_RUN=true  # prevent cleanup
    exit 1
  fi
fi
