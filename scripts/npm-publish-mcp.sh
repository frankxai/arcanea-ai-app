#!/bin/bash
# Publish MCP-related packages to npm
# Run after: npm login
# Usage: bash scripts/npm-publish-mcp.sh

set -e

echo "=== Arcanea MCP Package Publisher ==="
echo ""

# Check npm auth
echo "Checking npm auth..."
NPM_USER=$(npm whoami 2>/dev/null)
if [ -z "$NPM_USER" ]; then
  echo "ERROR: Not logged in to npm. Run: npm login"
  echo "Then create a permanent token at https://www.npmjs.com/settings/tokens/create"
  echo "(Granular Access Token, no expiry, scope: @arcanea, Publish permission)"
  exit 1
fi
echo "Logged in as: $NPM_USER"
echo ""

# Build all packages
echo "Building packages..."
cd "$(dirname "$0")/.."

echo "  Building @arcanea/mcp-server..."
cd packages/arcanea-mcp && pnpm build && cd ../..

echo "  Building @arcanea/memory-mcp..."
cd packages/memory-mcp && pnpm build && cd ../..

echo "  Building @arcanea/flow..."
cd packages/arcanea-flow && pnpm build && cd ../..

echo "  Building @arcanea/world-engine..."
cd packages/world-engine && pnpm build && cd ../..

echo ""
echo "All packages built."
echo ""

# Publish in dependency order
echo "Publishing packages..."

echo ""
echo "1/4: @arcanea/world-engine"
cd packages/world-engine
npm publish --access public || echo "  (may already be published)"
cd ../..

echo ""
echo "2/4: @arcanea/flow"
cd packages/arcanea-flow
npm publish --access public || echo "  (may already be published)"
cd ../..

echo ""
echo "3/4: @arcanea/memory-mcp"
cd packages/memory-mcp
npm publish --access public || echo "  (may already be published)"
cd ../..

echo ""
echo "4/4: @arcanea/mcp-server v1.0.0"
cd packages/arcanea-mcp
npm publish --access public || echo "  (may already be published)"
cd ../..

echo ""
echo "=== Done! ==="
echo ""
echo "Verify:"
echo "  npm view @arcanea/mcp-server"
echo "  npm view @arcanea/flow"
echo "  npm view @arcanea/world-engine"
echo "  npm view @arcanea/memory-mcp"
echo ""
echo "Install test:"
echo "  npx @arcanea/mcp-server --help"
