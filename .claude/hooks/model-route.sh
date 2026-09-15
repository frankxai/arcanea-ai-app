#!/usr/bin/env bash
# Portable: source central hook-env for HARNESS/PROJECT detection (claude/grok/codex/agy/da)
HOOK_DIR="$(cd "$(dirname "#!/usr/bin/env bash
")" && pwd)"
if [ -f "$HOOK_DIR/lib/hook-env.sh" ]; then
  source "$HOOK_DIR/lib/hook-env.sh" 2>/dev/null || true
elif [ -f "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" ]; then
  source "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" 2>/dev/null || true
fi
# Arcanea Intelligence OS — Model Router
# Analyzes prompt complexity and suggests model tier.
set +e

PROMPT="${1:-}"
ARCANEA_HOME="${ARCANEA_HOME:-$HOME/.arcanea}"
SESSION_DIR="$ARCANEA_HOME/sessions/current"
mkdir -p "$SESSION_DIR"

[ -z "$PROMPT" ] && exit 0

# Simple heuristic routing based on prompt length and keywords
PROMPT_LEN=${#PROMPT}
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Detect complexity signals
COMPLEXITY="low"
if echo "$PROMPT" | grep -qiE "architect|refactor|design|security|audit|plan|strategy|debug complex"; then
  COMPLEXITY="high"
elif echo "$PROMPT" | grep -qiE "build|implement|create|fix|update|add|write|test"; then
  COMPLEXITY="medium"
fi

# Long prompts suggest higher complexity
if [ "$PROMPT_LEN" -gt 500 ]; then
  COMPLEXITY="high"
elif [ "$PROMPT_LEN" -gt 200 ] && [ "$COMPLEXITY" = "low" ]; then
  COMPLEXITY="medium"
fi

# Log routing decision
echo "[$TIMESTAMP] complexity=$COMPLEXITY len=$PROMPT_LEN" >> "$SESSION_DIR/routing.log"
