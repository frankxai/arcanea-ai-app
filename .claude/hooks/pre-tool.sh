#!/usr/bin/env bash
# Arcanea Intelligence OS — Pre-Tool Use Hook
# Logs tool invocations and tracks usage count.
set +e

TOOL_NAME="${1:-unknown}"
TOOL_INPUT="${2:-}"
ARCANEA_HOME="${ARCANEA_HOME:-$HOME/.arcanea}"
SESSION_DIR="$ARCANEA_HOME/sessions/current"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Ensure session directory exists
mkdir -p "$SESSION_DIR"

# Increment tool count
COUNT_FILE="$SESSION_DIR/tool-count"
if [ -f "$COUNT_FILE" ]; then
  COUNT=$(cat "$COUNT_FILE" 2>/dev/null || echo "0")
else
  COUNT=0
fi
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNT_FILE"

# Log tool invocation (truncate input to prevent huge logs)
INPUT_PREVIEW="${TOOL_INPUT:0:120}"
echo "[$TIMESTAMP] [#$COUNT] START $TOOL_NAME | Input: ${INPUT_PREVIEW}..." >> "$SESSION_DIR/tools.log"

# ── File-Aware Guardian Switching ──────────────────────────────
# When Write or Edit tools are used, route to Guardian based on file path
FILE_PATH="${TOOL_INPUT}"
case "$TOOL_NAME" in
  Write|Edit)
    if echo "$FILE_PATH" | grep -qiE "supabase|migration|schema|database"; then
      echo "Lyssandria" > /tmp/arcanea-guardian
      echo "Foundation" > /tmp/arcanea-gate
    elif echo "$FILE_PATH" | grep -qiE "component|ui/|design|css|tailwind"; then
      echo "Lyria" > /tmp/arcanea-guardian
      echo "Sight" > /tmp/arcanea-gate
    elif echo "$FILE_PATH" | grep -qiE "book/|lore/|\.md$|content/"; then
      echo "Alera" > /tmp/arcanea-guardian
      echo "Voice" > /tmp/arcanea-gate
    elif echo "$FILE_PATH" | grep -qiE "test|spec|\.test\.|\.spec\."; then
      echo "Draconia" > /tmp/arcanea-guardian
      echo "Fire" > /tmp/arcanea-gate
    elif echo "$FILE_PATH" | grep -qiE "agent|swarm|mcp|orchestrat"; then
      echo "Ino" > /tmp/arcanea-guardian
      echo "Unity" > /tmp/arcanea-gate
    elif echo "$FILE_PATH" | grep -qiE "auth|security|permission"; then
      echo "Aiyami" > /tmp/arcanea-guardian
      echo "Crown" > /tmp/arcanea-gate
    elif echo "$FILE_PATH" | grep -qiE "api/|route|endpoint"; then
      echo "Elara" > /tmp/arcanea-guardian
      echo "Starweave" > /tmp/arcanea-gate
    fi
    ;;
esac
