#!/usr/bin/env bash
# Install Arcanea version-controlled git hooks.
# Run once after cloning: bash scripts/install-hooks.sh

set -euo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

echo "Installing Arcanea git hooks..."

chmod +x .githooks/pre-commit .githooks/pre-push 2>/dev/null || true
git config core.hooksPath .githooks

echo "✓ core.hooksPath = .githooks"
echo "✓ pre-commit: mass-delete guard + secrets"
echo "✓ pre-push:   force-push + sacred-path guard"
echo ""
echo "Test:  git diff --cached --shortstat"
echo "Bypass (emergency only): git commit --no-verify"
