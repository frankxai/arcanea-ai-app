#!/bin/bash
# Publish all packages with fixed workspace:* → actual version references
# Run this after updating ~/.npmrc with a granular access token that bypasses 2FA
#
# Usage: bash scripts/publish-fixed-packages.sh

set -e

echo "=== Publishing fixed @arcanea packages ==="
echo "Checking npm authentication..."
npm whoami || { echo "ERROR: Not logged in to npm. Check your ~/.npmrc token."; exit 1; }
echo ""

# Tier 1: Packages that depend only on @arcanea/core (already clean on npm)
TIER1_PACKAGES=(
  "packages/auth"
  "packages/overlay-claude"
  "packages/overlay-chatgpt"
  "packages/overlay-gemini"
  "packages/overlay-copilot"
  "packages/overlay-cursor"
  "packages/extension-core"
  "packages/guardian-memory"
  "packages/aios"
  "packages/claude-arcanea"
)

# Tier 2: Packages that depend on Tier 1 packages
TIER2_PACKAGES=(
  "packages/council"
  "packages/guardian-evolution"
  "packages/cli"
)

publish_package() {
  local pkg_dir="$1"
  local pkg_name=$(node -e "console.log(require('./$pkg_dir/package.json').name)")
  local pkg_version=$(node -e "console.log(require('./$pkg_dir/package.json').version)")

  echo "Publishing $pkg_name@$pkg_version..."
  cd "$pkg_dir"
  npm publish --access public 2>&1
  cd - > /dev/null
  echo "  OK: $pkg_name@$pkg_version published!"
  echo ""
}

echo "--- Tier 1: Base packages ---"
for pkg in "${TIER1_PACKAGES[@]}"; do
  publish_package "$pkg"
done

echo "--- Tier 2: Dependent packages ---"
for pkg in "${TIER2_PACKAGES[@]}"; do
  publish_package "$pkg"
done

echo "=== All packages published successfully! ==="
echo ""
echo "Test with:"
echo "  npm install @arcanea/overlay-claude"
echo "  npm install -g @arcanea/cli"
