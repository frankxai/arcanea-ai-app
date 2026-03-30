#!/usr/bin/env bash
# Arcanea Pre-Commit Quality Gate
# Lightweight checks that run in <10s on typical commits

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "⚡ Arcanea Quality Gate — pre-commit"

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)
if [ -z "$STAGED_FILES" ]; then
  echo -e "${GREEN}✓ No staged files${NC}"
  exit 0
fi

ERRORS=0

# ─── Check 1: No secrets in staged files ────────────────────────────────
echo -n "  Secrets scan... "
SECRET_PATTERNS='(SUPABASE_SERVICE_ROLE|sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{36}|PRIVATE_KEY|password\s*=\s*["\x27][^"\x27]{8,})'
SECRETS_FOUND=$(echo "$STAGED_FILES" | xargs git diff --cached -- 2>/dev/null | grep -iE "$SECRET_PATTERNS" | head -5 || true)
if [ -n "$SECRETS_FOUND" ]; then
  echo -e "${RED}FAIL${NC}"
  echo -e "${RED}  Potential secrets detected in staged changes:${NC}"
  echo "$SECRETS_FOUND" | head -3
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}OK${NC}"
fi

# ─── Check 2: No .env files ─────────────────────────────────────────────
echo -n "  .env files... "
ENV_FILES=$(echo "$STAGED_FILES" | grep -E '\.env(\.|$)' || true)
if [ -n "$ENV_FILES" ]; then
  echo -e "${RED}FAIL${NC}"
  echo -e "${RED}  .env files should never be committed: $ENV_FILES${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}OK${NC}"
fi

# ─── Check 3: File size check (warn on >500 lines for new/modified) ─────
echo -n "  File sizes... "
LARGE_FILES=""
for f in $STAGED_FILES; do
  if [ -f "$f" ] && [[ "$f" == *.ts || "$f" == *.tsx || "$f" == *.js || "$f" == *.jsx ]]; then
    LINES=$(wc -l < "$f" 2>/dev/null || echo 0)
    if [ "$LINES" -gt 500 ]; then
      LARGE_FILES="$LARGE_FILES\n  $f ($LINES lines)"
    fi
  fi
done
if [ -n "$LARGE_FILES" ]; then
  echo -e "${YELLOW}WARN${NC}"
  echo -e "${YELLOW}  Files over 500 lines:${LARGE_FILES}${NC}"
else
  echo -e "${GREEN}OK${NC}"
fi

# ─── Check 4: No console.log in production code ─────────────────────────
echo -n "  console.log... "
TS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(ts|tsx)$' | grep -v '\.test\.' | grep -v '__tests__' || true)
if [ -n "$TS_FILES" ]; then
  CONSOLE_LOGS=$(echo "$TS_FILES" | xargs git diff --cached -- 2>/dev/null | grep '^\+' | grep -v '^\+\+\+' | grep 'console\.log' | head -5 || true)
  if [ -n "$CONSOLE_LOGS" ]; then
    echo -e "${YELLOW}WARN${NC}"
    echo -e "${YELLOW}  New console.log statements found — remove before production${NC}"
  else
    echo -e "${GREEN}OK${NC}"
  fi
else
  echo -e "${GREEN}OK${NC}"
fi

# ─── Summary ─────────────────────────────────────────────────────────────
echo ""
if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}✗ Pre-commit failed with $ERRORS error(s)${NC}"
  exit 1
else
  echo -e "${GREEN}✓ All checks passed${NC}"
  exit 0
fi
