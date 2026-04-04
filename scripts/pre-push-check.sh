#!/usr/bin/env bash
# pre-push-check.sh — Deploy collision warning for Arcanea monorepo
# Run manually or wire into .git/hooks/pre-push
# Prints warnings but does NOT block the push (agents need autonomy)

set -euo pipefail

COOLDOWN_SECONDS=180  # 3 minutes

echo "=== Arcanea Deploy Lock Check ==="
echo ""

# --- 1. Check time since last remote push to main ---
last_commit_epoch=$(git log -1 --format="%ct" origin/main 2>/dev/null || echo "0")
now_epoch=$(date +%s)
diff_seconds=$((now_epoch - last_commit_epoch))
diff_minutes=$((diff_seconds / 60))

last_commit_msg=$(git log -1 --format="%s" origin/main 2>/dev/null || echo "(unknown)")
last_commit_date=$(git log -1 --format="%ci" origin/main 2>/dev/null || echo "(unknown)")

echo "Last push to origin/main:"
echo "  $last_commit_date"
echo "  $last_commit_msg"
echo "  ($diff_minutes min ago)"
echo ""

if [ "$diff_seconds" -lt "$COOLDOWN_SECONDS" ]; then
  echo "WARNING: Last push was less than 3 minutes ago."
  echo "         Another deploy may still be building."
  echo "         Consider waiting before pushing."
  echo ""
else
  echo "OK: Cooldown period clear."
  echo ""
fi

# --- 2. Show last 3 commits on main for context ---
echo "Recent commits on origin/main:"
git log --oneline -3 origin/main 2>/dev/null || echo "  (could not read remote log)"
echo ""

# --- 3. Show Vercel deploy status if CLI is available ---
if command -v vercel &>/dev/null; then
  echo "Recent Vercel deploys:"
  vercel ls --limit 3 2>/dev/null || echo "  (vercel CLI available but query failed)"
  echo ""
else
  echo "Vercel CLI not found — skipping deploy status."
  echo "  Install with: npm i -g vercel"
  echo ""
fi

echo "=== Check complete ==="
