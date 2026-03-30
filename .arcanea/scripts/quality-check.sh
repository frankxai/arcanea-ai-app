#!/usr/bin/env bash
# Arcanea Full Quality Check — run manually or in CI

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEB_DIR="$REPO_ROOT/apps/web"

echo "═══════════════════════════════════════════"
echo "  Arcanea Quality Check"
echo "═══════════════════════════════════════════"
echo ""

ERRORS=0
WARNINGS=0

# ─── TypeScript ──────────────────────────────────────────────────────────
echo "▸ TypeScript check..."
if cd "$WEB_DIR" && npx tsc --noEmit 2>/dev/null; then
  echo -e "  ${GREEN}✓ TypeScript clean${NC}"
else
  TS_ERRORS=$(cd "$WEB_DIR" && npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
  echo -e "  ${YELLOW}⚠ TypeScript: $TS_ERRORS errors (non-blocking)${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

# ─── Build ───────────────────────────────────────────────────────────────
echo "▸ Build check..."
if cd "$WEB_DIR" && npx next build > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓ Build passes${NC}"
else
  echo -e "  ${RED}✗ Build FAILED${NC}"
  ERRORS=$((ERRORS + 1))
fi

# ─── Secrets scan ────────────────────────────────────────────────────────
echo "▸ Secrets scan..."
SECRETS=$(grep -rn --include='*.ts' --include='*.tsx' --include='*.js' -E '(sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|SUPABASE_SERVICE_ROLE_KEY\s*=)' "$WEB_DIR/app" "$WEB_DIR/lib" "$WEB_DIR/components" 2>/dev/null | head -5 || true)
if [ -n "$SECRETS" ]; then
  echo -e "  ${RED}✗ Potential secrets found:${NC}"
  echo "$SECRETS"
  ERRORS=$((ERRORS + 1))
else
  echo -e "  ${GREEN}✓ No secrets detected${NC}"
fi

# ─── Large files ─────────────────────────────────────────────────────────
echo "▸ Large file check (>500 lines)..."
LARGE=$(find "$WEB_DIR/app" "$WEB_DIR/lib" "$WEB_DIR/components" -name '*.ts' -o -name '*.tsx' 2>/dev/null | while read f; do
  lines=$(wc -l < "$f")
  if [ "$lines" -gt 500 ]; then echo "  $f ($lines lines)"; fi
done)
if [ -n "$LARGE" ]; then
  echo -e "  ${YELLOW}⚠ Large files:${NC}"
  echo "$LARGE"
  WARNINGS=$((WARNINGS + 1))
else
  echo -e "  ${GREEN}✓ All files under 500 lines${NC}"
fi

# ─── Summary ─────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
if [ $ERRORS -gt 0 ]; then
  echo -e "  ${RED}RESULT: $ERRORS error(s), $WARNINGS warning(s)${NC}"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "  ${YELLOW}RESULT: PASS with $WARNINGS warning(s)${NC}"
  exit 0
else
  echo -e "  ${GREEN}RESULT: ALL CLEAR${NC}"
  exit 0
fi
