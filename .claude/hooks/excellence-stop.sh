#!/usr/bin/env bash
# Portable: source central hook-env for HARNESS/PROJECT detection (claude/grok/codex/agy/da)
HOOK_DIR="$(cd "$(dirname "#!/usr/bin/env bash
")" && pwd)"
if [ -f "$HOOK_DIR/lib/hook-env.sh" ]; then
  source "$HOOK_DIR/lib/hook-env.sh" 2>/dev/null || true
elif [ -f "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" ]; then
  source "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" 2>/dev/null || true
fi
# Arcanea Excellence System — Stop hook
# Surfaces uncommitted/unpushed work when ending a session on a feature
# branch. Pure status hook — no permission grants, no policy assertions.
#
# Performance budget: <1s. Failure mode: never blocks.
set +e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

command -v git &>/dev/null || exit 0
[ -d .git ] || exit 0

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Skip if on main/master (nothing to push/merge from here)
case "$BRANCH" in
  main|master) exit 0 ;;
esac

# Uncommitted work
DIRTY=$(git status --porcelain 2>/dev/null | wc -l)
if [ "$DIRTY" -gt 0 ]; then
  echo "[EXCELLENCE/EOS] $DIRTY uncommitted change(s) on branch '$BRANCH'. Commit before ending session."
fi

# Unpushed commits (only if upstream exists)
if git rev-parse @{u} &>/dev/null; then
  UNPUSHED=$(git log @{u}.. --oneline 2>/dev/null | wc -l)
  if [ "$UNPUSHED" -gt 0 ]; then
    echo "[EXCELLENCE/EOS] $UNPUSHED unpushed commit(s) on branch '$BRANCH'. Push to keep work durable across sessions."
  fi
fi

exit 0
