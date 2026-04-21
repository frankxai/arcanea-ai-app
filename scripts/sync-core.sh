#!/usr/bin/env bash
# Arcanea ↔ FrankX core sync
# Mirrors canonical commands, agents, and CLAUDE.md pieces between repos.
# Usage:
#   bash scripts/sync-core.sh check       # dry-run, show drift
#   bash scripts/sync-core.sh push        # copy Arcanea → FrankX
#   bash scripts/sync-core.sh pull        # copy FrankX → Arcanea

set -euo pipefail

ARCANEA="${ARCANEA_DIR:-/c/Users/frank/Arcanea}"
FRANKX="${FRANKX_DIR:-/c/Users/frank/FrankX}"

# Canonical files that must match across both repos
# (Lumina / Arcanea / Council / etc — shared brain, not brand-specific)
CORE_FILES=(
  ".claude/commands/lumina.md"
  ".claude/commands/arcanea.md"
  ".claude/commands/superintelligence.md"
  ".claude/commands/council.md"
  ".claude/commands/ao.md"
  ".claude/commands/arco.md"
  ".claude/agents/@lumina-queen.agent.md"
)

MODE="${1:-check}"

diff_file() {
  local rel="$1"
  local a="$ARCANEA/$rel"
  local f="$FRANKX/$rel"

  if [ ! -f "$a" ] && [ ! -f "$f" ]; then
    echo "  ∅ missing in both:      $rel"
    return 0
  fi
  if [ ! -f "$a" ]; then echo "  ← only in FrankX:      $rel"; return 0; fi
  if [ ! -f "$f" ]; then echo "  → only in Arcanea:     $rel"; return 0; fi
  if cmp -s "$a" "$f"; then
    echo "  ✓ match:               $rel"
  else
    echo "  ⚠ DRIFT:               $rel"
  fi
}

case "$MODE" in
  check)
    echo "Sync status (Arcanea ↔ FrankX):"
    for f in "${CORE_FILES[@]}"; do diff_file "$f"; done
    ;;

  push)
    echo "Pushing Arcanea → FrankX..."
    for f in "${CORE_FILES[@]}"; do
      if [ -f "$ARCANEA/$f" ]; then
        mkdir -p "$(dirname "$FRANKX/$f")"
        cp -v "$ARCANEA/$f" "$FRANKX/$f"
      fi
    done
    ;;

  pull)
    echo "Pulling FrankX → Arcanea..."
    for f in "${CORE_FILES[@]}"; do
      if [ -f "$FRANKX/$f" ]; then
        mkdir -p "$(dirname "$ARCANEA/$f")"
        cp -v "$FRANKX/$f" "$ARCANEA/$f"
      fi
    done
    ;;

  *)
    echo "Usage: $0 {check|push|pull}"
    exit 1
    ;;
esac
