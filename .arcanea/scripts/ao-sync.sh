#!/usr/bin/env bash
# Arcanea Orchestrator — Sync shared intelligence to all connected repos
# Run from repo root: bash .arcanea/scripts/ao-sync.sh [--dry-run]
set -e

DRY_RUN=false
[ "$1" = "--dry-run" ] && DRY_RUN=true

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

echo "AO Sync — pushing shared intelligence to connected repos"
[ "$DRY_RUN" = true ] && echo "(DRY RUN — no changes will be pushed)"
echo ""

# --- Config ---
OSS_REPO="frankxai/arcanea"
OSS_BRANCH="main"

OVERLAY_REPOS=(
  "frankxai/arcanea-orchestrator:main:shared-ops"
  "frankxai/arcanea-flow:main:shared-ops"
  "frankxai/oh-my-arcanea:dev:shared-ops"
)

CLAUDE_REPO="frankxai/claude-arcanea"
CLAUDE_BRANCH="master"

# --- Shared .arcanea/ files to sync to OSS ---
SHARED_PATHS=(
  ".arcanea/ops/AGENT_BOOTSTRAP.md"
  ".arcanea/ops/ao.md"
  ".arcanea/ops/commands/status.md"
  ".arcanea/ops/commands/handover.md"
  ".arcanea/ops/commands/digest.md"
  ".arcanea/ops/commands/cleanup.md"
  ".arcanea/ops/commands/sync.md"
  ".arcanea/scripts/ao-init.sh"
  ".arcanea/scripts/ao-init.ps1"
)

# --- Helper: push file to repo via GitHub API ---
push_file() {
  local repo="$1" branch="$2" local_path="$3" remote_path="$4"

  if [ ! -f "$local_path" ]; then
    echo "  SKIP: $local_path (not found)"
    return
  fi

  if [ "$DRY_RUN" = true ]; then
    echo "  DRY: $remote_path → $repo ($branch)"
    return
  fi

  local b64
  b64=$(base64 -w0 < "$local_path")

  # Check if file exists (get SHA for update)
  local sha=""
  sha=$(gh api "repos/$repo/contents/$remote_path?ref=$branch" --jq '.sha' 2>/dev/null) || sha=""

  if [ -n "$sha" ] && [ "$sha" != "null" ]; then
    gh api "repos/$repo/contents/$remote_path" \
      -X PUT -f "message=sync: $remote_path" -f "content=$b64" -f "branch=$branch" -f "sha=$sha" \
      --jq '.content.path' 2>/dev/null && echo "  OK: $remote_path (updated)" || echo "  FAIL: $remote_path"
  else
    gh api "repos/$repo/contents/$remote_path" \
      -X PUT -f "message=sync: $remote_path" -f "content=$b64" -f "branch=$branch" \
      --jq '.content.path' 2>/dev/null && echo "  OK: $remote_path (created)" || echo "  FAIL: $remote_path"
  fi
}

# --- 1. Sync shared files to OSS repo ---
echo "=== OSS repo ($OSS_REPO) ==="
for path in "${SHARED_PATHS[@]}"; do
  push_file "$OSS_REPO" "$OSS_BRANCH" "$path" "$path"
done

# --- 2. Sync ops subset to overlay repos ---
for entry in "${OVERLAY_REPOS[@]}"; do
  IFS=: read -r repo branch prefix <<< "$entry"
  echo ""
  echo "=== $repo ($branch) ==="
  push_file "$repo" "$branch" ".arcanea/ops/AGENT_BOOTSTRAP.md" "$prefix/AGENT_BOOTSTRAP.md"
  push_file "$repo" "$branch" ".arcanea/ops/ao.md" "$prefix/ao.md"
  for cmd in status handover digest cleanup sync; do
    push_file "$repo" "$branch" ".arcanea/ops/commands/$cmd.md" "$prefix/commands/$cmd.md"
  done
done

# --- 3. Sync Claude-specific files ---
echo ""
echo "=== $CLAUDE_REPO ($CLAUDE_BRANCH) ==="
for cmd in ao handover status arcanea-orchestrator; do
  if [ -f ".claude/commands/$cmd.md" ]; then
    push_file "$CLAUDE_REPO" "$CLAUDE_BRANCH" ".claude/commands/$cmd.md" "commands/$cmd.md"
  fi
done
if [ -f ".claude/skills/arcanea-orchestrator/SKILL.md" ]; then
  push_file "$CLAUDE_REPO" "$CLAUDE_BRANCH" ".claude/skills/arcanea-orchestrator/SKILL.md" "skills/arcanea-orchestrator/SKILL.md"
fi

echo ""
echo "Sync complete."
