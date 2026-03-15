#!/usr/bin/env bash
# Starlight Vault Observer Hook
# Captures tool use events as observations for continuous learning.
# Runs on PreToolUse and PostToolUse (async, non-blocking).
#
# Guards:
# 1. Only interactive CLI sessions (not subagents)
# 2. Skip if SV_SKIP_OBSERVE=1
# 3. Skip subagent sessions (agent_id present)
# 4. Scrub secrets before writing

set -euo pipefail

# --- Guard 1: Only interactive sessions ---
if [ "${CLAUDE_CODE_ENTRYPOINT:-}" != "cli" ]; then
  exit 0
fi

# --- Guard 2: Cooperative skip ---
if [ "${SV_SKIP_OBSERVE:-0}" = "1" ]; then
  exit 0
fi

# --- Read stdin (hook payload) ---
INPUT=$(cat)

# --- Guard 3: Skip subagent sessions ---
AGENT_ID=$(echo "$INPUT" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).agent_id || ""' 2>/dev/null || echo "")
if [ -n "$AGENT_ID" ]; then
  exit 0
fi

# --- Determine storage path ---
VAULT_ROOT="${HOME}/.arcanea/starlight-vault"
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")
PROJECT_NAME=$(basename "$PROJECT_ROOT")
PROJECT_HASH=$(echo "$PROJECT_ROOT" | md5sum | cut -c1-12)

PROJECT_DIR="${VAULT_ROOT}/projects/${PROJECT_HASH}"
mkdir -p "$PROJECT_DIR"

# Save project metadata if not exists
if [ ! -f "$PROJECT_DIR/project.json" ]; then
  cat > "$PROJECT_DIR/project.json" <<PROJ
{
  "name": "${PROJECT_NAME}",
  "path": "${PROJECT_ROOT}",
  "hash": "${PROJECT_HASH}",
  "created": "$(date -Iseconds)"
}
PROJ
fi

OBS_FILE="${PROJECT_DIR}/observations.jsonl"

# --- Guard 4: Scrub secrets ---
SCRUBBED=$(echo "$INPUT" | sed -E \
  -e 's/sk-[a-zA-Z0-9]{20,}/[REDACTED_SK]/g' \
  -e 's/sbp_[a-zA-Z0-9]+/[REDACTED_SBP]/g' \
  -e 's/sb_secret_[a-zA-Z0-9]+/[REDACTED_SB]/g' \
  -e 's/ghp_[a-zA-Z0-9]+/[REDACTED_GHP]/g' \
  -e 's/eyJ[a-zA-Z0-9._%+-]{40,}/[REDACTED_JWT]/g' \
)

# --- Write observation ---
TIMESTAMP=$(date -Iseconds)
echo "{\"ts\":\"${TIMESTAMP}\",\"project\":\"${PROJECT_NAME}\",\"data\":${SCRUBBED}}" >> "$OBS_FILE"

# --- Archive if too large (>10MB) ---
OBS_SIZE=$(stat -f%z "$OBS_FILE" 2>/dev/null || stat -c%s "$OBS_FILE" 2>/dev/null || echo 0)
if [ "$OBS_SIZE" -gt 10485760 ]; then
  ARCHIVE_DIR="${PROJECT_DIR}/observations.archive"
  mkdir -p "$ARCHIVE_DIR"
  mv "$OBS_FILE" "${ARCHIVE_DIR}/$(date +%Y%m%d-%H%M%S).jsonl"
fi

exit 0
