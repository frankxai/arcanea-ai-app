#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() {
  echo "[mcp-setup] $*"
}

fail() {
  echo "[mcp-setup] ERROR: $*" >&2
  exit 1
}

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js is required."
fi

if command -v corepack >/dev/null 2>&1; then
  PM=(corepack pnpm)
elif command -v pnpm >/dev/null 2>&1; then
  PM=(pnpm)
else
  PM=()
fi

run_build() {
  local pkg="$1"
  if [[ ${#PM[@]} -gt 0 ]]; then
    "${PM[@]}" -C "$pkg" build
  else
    (cd "$pkg" && npm run build)
  fi
}

check_file() {
  local p="$1"
  [[ -r "$p" ]] || fail "Cannot read required file: $p (possible WSL/DrvFS I/O issue)"
}

check_file "$ROOT/.mcp.json"
check_file "$ROOT/packages/arcanea-mcp/package.json"
check_file "$ROOT/packages/memory-mcp/package.json"

log "Building local Arcanea MCP servers..."
if ! run_build "$ROOT/packages/arcanea-mcp"; then
  fail "arcanea-mcp build failed. If you see EIO on /mnt/c paths, restart WSL and retry."
fi
if ! run_build "$ROOT/packages/memory-mcp"; then
  fail "arcanea-memory build failed. If you see EIO on /mnt/c paths, restart WSL and retry."
fi

log "Verifying binaries..."
test -f "$ROOT/packages/arcanea-mcp/dist/cli.js"
test -f "$ROOT/packages/memory-mcp/dist/server.js"

log "Ready. Ensure your client loads: $ROOT/.mcp.json"
