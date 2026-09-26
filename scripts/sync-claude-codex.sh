#!/usr/bin/env bash
set -euo pipefail

# Resolve this wrapper, never a historical home-directory checkout.
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
exec node "${script_dir}/sync-claude-codex.mjs" "$@"
