#!/usr/bin/env bash
# Portable: source central hook-env for HARNESS/PROJECT detection (claude/grok/codex/agy/da)
HOOK_DIR="$(cd "$(dirname "#!/usr/bin/env bash
")" && pwd)"
if [ -f "$HOOK_DIR/lib/hook-env.sh" ]; then
  source "$HOOK_DIR/lib/hook-env.sh" 2>/dev/null || true
elif [ -f "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" ]; then
  source "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" 2>/dev/null || true
fi
# Arcanea Intelligence OS — Voice Check (Pre-Edit)
# Lightweight check that content written to lore/book files maintains Arcanea voice.
set +e

TOOL_INPUT="${1:-}"

# Only check for book/lore files
if ! echo "$TOOL_INPUT" | grep -qE "(book/|lore/|chronicles|legends|wisdom)"; then
  exit 0
fi

# Warn if common AI-slop patterns detected in the input
if echo "$TOOL_INPUT" | grep -qiE "delve|tapestry of|vibrant ecosystem|in conclusion|it.s important to note|at the end of the day"; then
  echo "[VOICE] Warning: AI slop pattern detected in lore content. Review for authentic Arcanea voice."
fi
