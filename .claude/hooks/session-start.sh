#!/usr/bin/env bash
# Arcanea Intelligence OS - Session Start Hook v2.1
# Initializes session state, Guardian defaults, realm context, and AgentDB.
set +e

ARCANEA_HOME="${ARCANEA_HOME:-$HOME/.arcanea}"
SESSION_DIR="${ARCANEA_HOME}/sessions/current"
DB_PATH="${ARCANEA_DB:-${ARCANEA_HOME}/agentdb.sqlite3}"
HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENTDB_DIR="$(cd "$HOOK_DIR/../agentdb" 2>/dev/null && pwd)"
TMP_DIR="${TMPDIR:-/tmp}"
LOG_FILE="${SESSION_DIR}/hook-events.log"

safe_log() {
  mkdir -p "$SESSION_DIR" 2>/dev/null || true
  printf '[%s] session-start %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$1" >> "$LOG_FILE" 2>/dev/null || true
}

safe_write_tmp() {
  local name="$1"
  local value="$2"
  local tmp_file="${TMP_DIR}/${name}"
  local session_file="${SESSION_DIR}/${name}"

  printf '%s' "$value" > "$tmp_file" 2>/dev/null || printf '%s' "$value" > "$session_file" 2>/dev/null || true
}

mkdir -p "$ARCANEA_HOME/sessions" 2>/dev/null || true
mkdir -p "$SESSION_DIR" 2>/dev/null || true
safe_log "start"

if [ ! -f "$DB_PATH" ] && [ -f "$AGENTDB_DIR/init.sh" ]; then
  bash "$AGENTDB_DIR/init.sh" >/dev/null 2>&1 || safe_log "agentdb-init-skipped"
fi

safe_write_tmp "arcanea-tokens.json" '{"input": 0, "output": 0, "total": 0}'
safe_write_tmp "arcanea-guardian" "Shinkami"
safe_write_tmp "arcanea-gate" "Source"
safe_write_tmp "arcanea-element" "Void"
safe_write_tmp "arcanea-realm" "Intelligence Sanctum"
safe_write_tmp "arcanea-team" "Source Council"
safe_write_tmp "arcanea-focus" ""

echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] Session started" > "$SESSION_DIR/start.log"
echo "0" > "$SESSION_DIR/tool-count"
touch "$SESSION_DIR/routing.log"
touch "$SESSION_DIR/tools.log"
touch "$SESSION_DIR/voice-violations.log"

if [ -f "$DB_PATH" ]; then
  if command -v sqlite3 >/dev/null 2>&1; then
    sqlite3 "$DB_PATH" "UPDATE agents SET status='idle', last_active=datetime('now') WHERE status='active'; UPDATE agents SET status='active', last_active=datetime('now') WHERE id='shinkami';" 2>/dev/null || safe_log "sqlite-reset-failed"
  else
    safe_log "sqlite3-missing"
  fi
fi

LAST_SESSION_FILE="$ARCANEA_HOME/sessions/last-summary.md"
if [ -f "$LAST_SESSION_FILE" ]; then
  LAST_SUMMARY="$(head -20 "$LAST_SESSION_FILE" 2>/dev/null)"
  safe_write_tmp "arcanea-last-session" "$LAST_SUMMARY"
fi

safe_log "complete"
echo "Arcanea Intelligence OS initialized. Guardian: Shinkami. Gate: Source."
