#!/bin/bash
# Session Catchup Hook v1.0
# Runs on SessionStart. Shows recent SESSION_LOG entries so the agent
# knows what happened on other devices since last session.
set +e

PROJECT_ROOT="/mnt/c/Users/frank/Arcanea"
SESSION_LOG="$PROJECT_ROOT/.arcanea/SESSION_LOG.md"
DEVICE=$(hostname | cut -d'.' -f1)

cd "$PROJECT_ROOT" 2>/dev/null
git pull --ff-only origin lean-prod 2>/dev/null && PULLED="yes" || PULLED="no"

if [ -f "$SESSION_LOG" ]; then
  RECENT=$(tail -10 "$SESSION_LOG" | grep "^| 20" )
  if [ -n "$RECENT" ]; then
    LINE_COUNT=$(echo "$RECENT" | wc -l)
    OTHER_DEVICE=$(echo "$RECENT" | grep -v "$DEVICE" | tail -3)
    echo "SESSION_LOG: ${LINE_COUNT} recent entries."
    if [ -n "$OTHER_DEVICE" ]; then
      echo "From other devices:"
      echo "$OTHER_DEVICE"
    fi
  fi
fi

echo "Device: ${DEVICE} | Git pull: ${PULLED}"
