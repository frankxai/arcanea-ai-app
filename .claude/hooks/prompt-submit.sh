#!/usr/bin/env bash
# Arcanea Intelligence OS - Prompt Submit Hook v2.1
# Routes prompts to Guardian, detects realm/team/focus for statusline.
set +e

PROMPT="${1:-}"
ARCANEA_HOME="${ARCANEA_HOME:-$HOME/.arcanea}"
SESSION_DIR="${ARCANEA_HOME}/sessions/current"
DB_PATH="${ARCANEA_DB:-${ARCANEA_HOME}/agentdb.sqlite3}"
HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
TMP_DIR="${TMPDIR:-/tmp}"
LOG_FILE="${SESSION_DIR}/hook-events.log"

safe_log() {
  mkdir -p "$SESSION_DIR" 2>/dev/null || true
  printf '[%s] prompt-submit %s\n' "$TIMESTAMP" "$1" >> "$LOG_FILE" 2>/dev/null || true
}

safe_write_tmp() {
  local name="$1"
  local value="$2"
  local tmp_file="${TMP_DIR}/${name}"
  local session_file="${SESSION_DIR}/${name}"

  printf '%s' "$value" > "$tmp_file" 2>/dev/null || printf '%s' "$value" > "$session_file" 2>/dev/null || true
}

read_state_file() {
  local name="$1"
  if [ -f "${TMP_DIR}/${name}" ]; then
    cat "${TMP_DIR}/${name}" 2>/dev/null
    return
  fi
  if [ -f "${SESSION_DIR}/${name}" ]; then
    cat "${SESSION_DIR}/${name}" 2>/dev/null
  fi
}

mkdir -p "$SESSION_DIR" 2>/dev/null || true
safe_log "start"

PROMPT_LOWER="$(printf '%s' "$PROMPT" | tr '[:upper:]' '[:lower:]')"

GUARDIAN="Shinkami"
GATE="Source"
KEYWORDS=""

if echo "$PROMPT_LOWER" | grep -qE 'coordinat|orchestrat|meta|oversee|council|starlight'; then
  GUARDIAN="Shinkami"; GATE="Source"; KEYWORDS="coordinate/orchestrate"
elif echo "$PROMPT_LOWER" | grep -qE 'debug|bug|error|fix|broken|crash|undefined'; then
  GUARDIAN="Elara"; GATE="Starweave"; KEYWORDS="debug/fix/error"
elif echo "$PROMPT_LOWER" | grep -qE 'review|audit|security|quality|inspect|verify|lint'; then
  GUARDIAN="Alera"; GATE="Voice"; KEYWORDS="review/audit/quality"
elif echo "$PROMPT_LOWER" | grep -qE 'github|merge|pull.*request|commit|push|branch| pr '; then
  GUARDIAN="Ino"; GATE="Unity"; KEYWORDS="github/merge/pr"
elif echo "$PROMPT_LOWER" | grep -qE 'architect|schema|foundation|database|supabase|migration|data.*model'; then
  GUARDIAN="Lyssandria"; GATE="Foundation"; KEYWORDS="architect/schema/foundation"
elif echo "$PROMPT_LOWER" | grep -qE 'strategy|plan|roadmap|priority|vision|foresight|research'; then
  GUARDIAN="Lyria"; GATE="Sight"; KEYWORDS="strategy/plan/vision"
elif echo "$PROMPT_LOWER" | grep -qE 'deploy|build|implement|code|compile|component|react'; then
  GUARDIAN="Draconia"; GATE="Fire"; KEYWORDS="implement/build/code"
elif echo "$PROMPT_LOWER" | grep -qE 'refactor|migrate|restructure|transform|modernize'; then
  GUARDIAN="Elara"; GATE="Starweave"; KEYWORDS="refactor/migrate/transform"
elif echo "$PROMPT_LOWER" | grep -qE 'test|accessibility|wellness| ux |css|tailwind|design.*system'; then
  GUARDIAN="Maylinn"; GATE="Heart"; KEYWORDS="test/ux/design"
elif echo "$PROMPT_LOWER" | grep -qE 'visual|image|world.*build|infographic|generate.*image'; then
  GUARDIAN="Aiyami"; GATE="Crown"; KEYWORDS="visual/world/image"
elif echo "$PROMPT_LOWER" | grep -qE 'write|narrative|content|story|compose|lore|create|voice'; then
  GUARDIAN="Leyla"; GATE="Flow"; KEYWORDS="write/content/creative"
elif echo "$PROMPT_LOWER" | grep -qE 'explain|teach|principle|wisdom|understand|enlighten'; then
  GUARDIAN="Aiyami"; GATE="Crown"; KEYWORDS="explain/teach/wisdom"
fi

safe_write_tmp "arcanea-guardian" "$GUARDIAN"
safe_write_tmp "arcanea-gate" "$GATE"

if [ -f "$HOOK_DIR/context-detect.sh" ]; then
  bash "$HOOK_DIR/context-detect.sh" "$PROMPT" "" 2>/dev/null || safe_log "context-detect-skipped"
fi

echo "[$TIMESTAMP] Guardian: $GUARDIAN | Gate: $GATE | Prompt: ${PROMPT:0:80}..." >> "$SESSION_DIR/routing.log"

LAST_CTX="$(read_state_file "arcanea-last-session")"
if [ -n "$LAST_CTX" ]; then
  printf '%s\n' "[ARCANEA] Continuing from previous session:"
  printf '%s\n' "$LAST_CTX"
  rm -f "${TMP_DIR}/arcanea-last-session" "${SESSION_DIR}/arcanea-last-session" 2>/dev/null || true
fi

if [ -f "$DB_PATH" ] && command -v sqlite3 >/dev/null 2>&1; then
  PROMPT_HASH="$(echo -n "$PROMPT" | md5sum 2>/dev/null | cut -d' ' -f1 || echo 'unknown')"
  sqlite3 "$DB_PATH" "INSERT INTO routing_log (prompt_hash, detected_guardian, confidence, keywords_matched) VALUES ('$PROMPT_HASH', '$GUARDIAN', 1.0, '$KEYWORDS');" 2>/dev/null || safe_log "sqlite-insert-failed"
elif [ -f "$DB_PATH" ]; then
  safe_log "sqlite3-missing"
fi

safe_log "complete guardian=$GUARDIAN gate=$GATE"
