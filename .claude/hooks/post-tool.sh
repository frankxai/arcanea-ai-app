#!/usr/bin/env bash
# Arcanea Intelligence OS — Post-Tool Use Hook
# Logs tool completion and writes significant operations to AgentDB memories.
set +e

TOOL_NAME="${1:-unknown}"
TOOL_OUTPUT="${2:-}"
ARCANEA_HOME="${ARCANEA_HOME:-$HOME/.arcanea}"
SESSION_DIR="$ARCANEA_HOME/sessions/current"
DB_PATH="${ARCANEA_DB:-$ARCANEA_HOME/agentdb.sqlite3}"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Ensure session directory exists
mkdir -p "$SESSION_DIR"

# Read and increment tool count (single source of truth)
COUNT_FILE="$SESSION_DIR/tool-count"
COUNT=$(cat "$COUNT_FILE" 2>/dev/null || echo "0")
NEW_COUNT=$((COUNT + 1))
echo "$NEW_COUNT" > "$COUNT_FILE"

# Determine output size for logging
OUTPUT_LEN=${#TOOL_OUTPUT}

# Log tool completion
echo "[$TIMESTAMP] [#$NEW_COUNT] DONE  $TOOL_NAME | Output: ${OUTPUT_LEN} chars" >> "$SESSION_DIR/tools.log"

# ── Proactive suggestions ──────────────────────────────────
# Context compression warning
if [ "$NEW_COUNT" -eq 50 ]; then
  echo "[ARCANEA] Context checkpoint: 50 tools used. Consider committing current work."
fi

# Uncommitted work warning (every 20 tools after 30)
if [ "$((NEW_COUNT % 20))" -eq 0 ] && [ "$NEW_COUNT" -gt 30 ]; then
  DIRTY=$(git status --porcelain 2>/dev/null | grep -v "^??" | wc -l)
  if [ "$DIRTY" -gt 5 ]; then
    echo "[ARCANEA] $DIRTY uncommitted files. Commit checkpoint recommended."
  fi
fi

# Write significant operations to AgentDB memories
# Only log Write, Edit, Bash completions with substantial output (meaningful work)
if [ -f "$DB_PATH" ] && [ "$OUTPUT_LEN" -gt 50 ]; then
  case "$TOOL_NAME" in
    Write|Edit|Bash)
      GUARDIAN=$(cat "$SESSION_DIR/guardian" 2>/dev/null || echo "shinkami")
      GUARDIAN_LOWER="$(echo "$GUARDIAN" | tr '[:upper:]' '[:lower:]')"
      OUTPUT_PREVIEW="${TOOL_OUTPUT:0:200}"
      if command -v sqlite3 &>/dev/null; then
        SAFE_PREVIEW="${OUTPUT_PREVIEW//\'/\'\'}"
        sqlite3 "$DB_PATH" "INSERT INTO memories (agent_id, namespace, key, value) VALUES ('$GUARDIAN_LOWER', 'tool-log', '$TOOL_NAME-$TIMESTAMP', '${SAFE_PREVIEW}');" 2>/dev/null
      elif command -v python3 &>/dev/null; then
        python3 << PYEOF 2>/dev/null
import sqlite3
db = sqlite3.connect("$DB_PATH")
c = db.cursor()
c.execute(
    "INSERT INTO memories (agent_id, namespace, key, value) VALUES (?,?,?,?)",
    ("$GUARDIAN_LOWER", "tool-log", "$TOOL_NAME-$TIMESTAMP", "${OUTPUT_PREVIEW//\"/\\\"}")
)
db.commit()
db.close()
PYEOF
      fi
      ;;
  esac
fi
