#!/usr/bin/env bash
# Arcanea Cross-Repo Sync
# Checks health and sync status across all active repositories

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "═══════════════════════════════════════════"
echo "  Arcanea Cross-Repo Health Check"
echo "═══════════════════════════════════════════"
echo ""

# Repository registry (matches repos.json)
REPOS=(
  "frankxai/arcanea-ai-app|production|Main platform"
  "frankxai/arcanea|oss|OSS framework"
  "frankxai/oh-my-arcanea|harness|Claude Code harness"
  "frankxai/arcanea-records|product|Music studio"
  "frankxai/arcanea-mcp|infra|MCP server"
  "frankxai/arcanea-memory|infra|Memory MCP"
  "ruvnet/claude-flow|infra|Multi-agent orchestration"
)

HEALTHY=0
WARNING=0
ERRORS=0

for entry in "${REPOS[@]}"; do
  IFS='|' read -r repo role desc <<< "$entry"

  echo -n "  $repo ($role)... "

  # Check if gh CLI is available
  if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}gh CLI not available${NC}"
    WARNING=$((WARNING + 1))
    continue
  fi

  # Get repo info
  INFO=$(gh api "repos/$repo" --jq '.pushed_at, .open_issues_count, .default_branch' 2>/dev/null || echo "ERROR")

  if [ "$INFO" = "ERROR" ]; then
    echo -e "${RED}UNREACHABLE${NC}"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  PUSHED=$(echo "$INFO" | head -1)
  ISSUES=$(echo "$INFO" | sed -n '2p')
  BRANCH=$(echo "$INFO" | sed -n '3p')

  # Check last push freshness (warn if >7 days)
  if command -v date &> /dev/null; then
    PUSH_EPOCH=$(date -d "$PUSHED" +%s 2>/dev/null || echo "0")
    NOW_EPOCH=$(date +%s)
    DAYS_AGO=$(( (NOW_EPOCH - PUSH_EPOCH) / 86400 ))

    if [ "$DAYS_AGO" -gt 7 ]; then
      echo -e "${YELLOW}STALE (${DAYS_AGO}d ago, $ISSUES issues)${NC}"
      WARNING=$((WARNING + 1))
    else
      echo -e "${GREEN}OK (${DAYS_AGO}d ago, $ISSUES issues)${NC}"
      HEALTHY=$((HEALTHY + 1))
    fi
  else
    echo -e "${GREEN}OK ($ISSUES issues)${NC}"
    HEALTHY=$((HEALTHY + 1))
  fi
done

echo ""
echo "═══════════════════════════════════════════"
echo -e "  ${GREEN}Healthy: $HEALTHY${NC}  ${YELLOW}Warning: $WARNING${NC}  ${RED}Error: $ERRORS${NC}"
echo "═══════════════════════════════════════════"

if [ $ERRORS -gt 0 ]; then
  exit 1
fi
exit 0
