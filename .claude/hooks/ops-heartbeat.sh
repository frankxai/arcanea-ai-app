#!/usr/bin/env bash
# ops-heartbeat.sh — Lightweight heartbeat hook for SessionStart
# Writes system metrics to ~/.arcanea/ops/heartbeat.json
# Optimized for Windows Git Bash: parallel background jobs, < 1 second

set -uo pipefail

OPS_DIR="$HOME/.arcanea/ops"
HEARTBEAT_FILE="$OPS_DIR/heartbeat.json"
TEMP_DIR="$OPS_DIR/.tmp.$$"

# Ensure directories exist
mkdir -p "$OPS_DIR" "$TEMP_DIR"

# Timestamp and platform are instant — do inline
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%S")

PLATFORM="unknown"
if [[ "${OSTYPE:-}" == "msys" || "${OSTYPE:-}" == "cygwin" || "${OSTYPE:-}" == "win32" ]]; then
  PLATFORM="windows"
elif [[ "${OSTYPE:-}" == linux-gnu* ]]; then
  PLATFORM="linux"
elif [[ "${OSTYPE:-}" == darwin* ]]; then
  PLATFORM="macos"
fi

HOST="${HOSTNAME:-${COMPUTERNAME:-unknown}}"

# --- Run slow commands in parallel background jobs ---

# Disk free
(df -h "$HOME" 2>/dev/null | awk 'NR==2 {print $4}' > "$TEMP_DIR/disk" 2>/dev/null || echo "unknown" > "$TEMP_DIR/disk") &

# Session count (use ls instead of find for speed)
(ls -d /tmp/arcanea-session* 2>/dev/null | wc -l | tr -d ' ' > "$TEMP_DIR/sessions" 2>/dev/null || echo "0" > "$TEMP_DIR/sessions") &

# Node version
(node --version > "$TEMP_DIR/node" 2>/dev/null || echo "not installed" > "$TEMP_DIR/node") &

# Wait for all background jobs (combined wall time ~ max of individual times)
wait

# Read results
DISK_FREE=$(cat "$TEMP_DIR/disk" 2>/dev/null || echo "unknown")
SESSION_COUNT=$(cat "$TEMP_DIR/sessions" 2>/dev/null || echo "0")
NODE_VERSION=$(cat "$TEMP_DIR/node" 2>/dev/null || echo "unknown")

# Clean up temp files
rm -rf "$TEMP_DIR"

# Sanitize session count (ensure numeric)
[[ "$SESSION_COUNT" =~ ^[0-9]+$ ]] || SESSION_COUNT=0

# Write heartbeat JSON atomically (write to temp, then move)
TEMP_FILE="$OPS_DIR/.heartbeat.tmp"
cat > "$TEMP_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "host": "$HOST",
  "platform": "$PLATFORM",
  "sessions": {
    "active": $SESSION_COUNT
  },
  "system": {
    "diskFree": "$DISK_FREE",
    "nodeVersion": "$NODE_VERSION"
  }
}
EOF

mv "$TEMP_FILE" "$HEARTBEAT_FILE"
