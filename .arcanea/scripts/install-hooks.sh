#!/usr/bin/env bash
# Install Arcanea git hooks

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
HOOK_DIR="$REPO_ROOT/.git/hooks"

echo "Installing Arcanea git hooks..."

# Pre-commit
cp "$SCRIPT_DIR/pre-commit.sh" "$HOOK_DIR/pre-commit"
chmod +x "$HOOK_DIR/pre-commit"

echo "✓ pre-commit hook installed"
echo "Done. Hooks are active."
