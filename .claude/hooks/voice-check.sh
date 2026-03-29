#!/usr/bin/env bash
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
