#!/usr/bin/env bash
# Vercel "Ignored Build Step" — apps/web shim
#
# The Vercel project's Root Directory is `apps/web`, so the configured
# Ignored Build Step command `bash scripts/vercel-ignore-build.sh`
# resolves to apps/web/scripts/vercel-ignore-build.sh (this file).
#
# Delegates to the canonical script at the repo root so logic lives in
# one place. The repo-root script handles all branching/path filtering.

set -euo pipefail

ROOT_SCRIPT="../../scripts/vercel-ignore-build.sh"

if [[ ! -f "$ROOT_SCRIPT" ]]; then
  # Fallback: if the root script is missing, default to BUILD so we never
  # silently skip production deploys.
  echo "[ignore-build/web-shim] root script missing — default to BUILD"
  exit 1
fi

exec bash "$ROOT_SCRIPT"
