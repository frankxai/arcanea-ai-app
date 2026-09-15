#!/usr/bin/env bash
# Portable: source central hook-env for HARNESS/PROJECT detection (claude/grok/codex/agy/da)
HOOK_DIR="$(cd "$(dirname "#!/usr/bin/env bash
")" && pwd)"
if [ -f "$HOOK_DIR/lib/hook-env.sh" ]; then
  source "$HOOK_DIR/lib/hook-env.sh" 2>/dev/null || true
elif [ -f "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" ]; then
  source "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" 2>/dev/null || true
fi
# Arcanea Intelligence OS — Context Tracker
# Tracks context window usage and warns on high utilization.
set +e

TOOL_NAME="${1:-unknown}"
ARCANEA_HOME="${ARCANEA_HOME:-$HOME/.arcanea}"
SESSION_DIR="$ARCANEA_HOME/sessions/current"

mkdir -p "$SESSION_DIR"

# Increment per-tool type counters
COUNTER_FILE="$SESSION_DIR/tool-types"
touch "$COUNTER_FILE"
CURRENT=$(grep "^${TOOL_NAME}=" "$COUNTER_FILE" 2>/dev/null | cut -d= -f2 || echo 0)
NEW=$((CURRENT + 1))
if grep -q "^${TOOL_NAME}=" "$COUNTER_FILE" 2>/dev/null; then
  sed -i "s/^${TOOL_NAME}=.*/${TOOL_NAME}=${NEW}/" "$COUNTER_FILE"
else
  echo "${TOOL_NAME}=${NEW}" >> "$COUNTER_FILE"
fi

# Read total tool count
TOTAL=$(cat "$SESSION_DIR/tool-count" 2>/dev/null || echo "0")

# Context zone estimation based on tool count
if [ "$TOTAL" -gt 80 ]; then
  echo "RED|85|${TOTAL}|200000" > "$SESSION_DIR/context-status"
elif [ "$TOTAL" -gt 50 ]; then
  echo "YELLOW|60|${TOTAL}|200000" > "$SESSION_DIR/context-status"
else
  echo "GREEN|30|${TOTAL}|200000" > "$SESSION_DIR/context-status"
fi
