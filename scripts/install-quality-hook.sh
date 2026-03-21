#!/bin/bash
# ============================================================================
# Install AuthorOS Quality Gate as git pre-commit hook
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
HOOK_TARGET="$REPO_ROOT/.git/hooks/pre-commit"
GATE_SCRIPT="$REPO_ROOT/scripts/quality-gate.sh"

# Check that the quality gate script exists
if [[ ! -f "$GATE_SCRIPT" ]]; then
  echo "Error: quality-gate.sh not found at $GATE_SCRIPT"
  exit 1
fi

# Back up existing pre-commit hook if present
if [[ -f "$HOOK_TARGET" ]]; then
  echo "Backing up existing pre-commit hook to ${HOOK_TARGET}.bak"
  cp "$HOOK_TARGET" "${HOOK_TARGET}.bak"
fi

# Install: create a wrapper that calls quality-gate.sh
cat > "$HOOK_TARGET" << 'HOOK'
#!/bin/bash
# AuthorOS Quality Gate — pre-commit hook
# Installed by scripts/install-quality-hook.sh

REPO_ROOT="$(git rev-parse --show-toplevel)"
bash "$REPO_ROOT/scripts/quality-gate.sh"
HOOK

chmod +x "$HOOK_TARGET"
chmod +x "$GATE_SCRIPT"

echo "Quality gate installed as pre-commit hook."
echo "  Hook: $HOOK_TARGET"
echo "  Gate: $GATE_SCRIPT"
echo ""
echo "To uninstall: rm $HOOK_TARGET"
