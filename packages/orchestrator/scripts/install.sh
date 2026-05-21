#!/usr/bin/env bash
#
# arcanea-code installer
#
# Idempotent, cross-platform-ish (bash/zsh on macOS/Linux/WSL). Not a Windows
# PowerShell installer — use `pnpm add -g @arcanea/arcanea-code` on Windows.
#
# What this does:
#   1. Detects installed CLIs (claude, opencode, codex, antigravity).
#   2. Installs @arcanea/arcanea-code globally via pnpm (or npm fallback).
#   3. Runs `arcanea-code doctor` to populate ~/.arcanea/config.yaml.
#   4. Prints a summary.
#
# What this does NOT do:
#   - Install the sub-CLIs themselves (claude, opencode, codex, antigravity).
#     Those are vendor-owned; we point at their installers if missing.
#   - Write to anything under /etc or /usr. User-scope only.
#
# Usage:
#   curl -fsSL https://arcanea.ai/install/code.sh | bash
#   # or from a clone:
#   bash packages/arcanea-code/scripts/install.sh

set -euo pipefail

# ── Pretty output ─────────────────────────────────────────────────────────────

info()  { printf '\033[0;36m[arcanea]\033[0m %s\n' "$*"; }
ok()    { printf '\033[0;32m[arcanea]\033[0m %s\n' "$*"; }
warn()  { printf '\033[0;33m[arcanea]\033[0m %s\n' "$*"; }
fail()  { printf '\033[0;31m[arcanea]\033[0m %s\n' "$*" >&2; exit 1; }

# ── Summary counters ──────────────────────────────────────────────────────────

CREATED=0
UPDATED=0
SKIPPED=0

tick_skip()    { SKIPPED=$((SKIPPED + 1)); }
tick_create()  { CREATED=$((CREATED + 1)); }
tick_update()  { UPDATED=$((UPDATED + 1)); }

# ── Detect package manager ────────────────────────────────────────────────────

if command -v pnpm >/dev/null 2>&1; then
  PKG_CMD="pnpm add -g"
elif command -v npm >/dev/null 2>&1; then
  PKG_CMD="npm install -g"
else
  fail "Neither pnpm nor npm found. Install Node.js 20+ first."
fi

# ── Detect sub-CLIs ───────────────────────────────────────────────────────────

info "Checking sub-CLIs..."
for cli in claude opencode codex antigravity; do
  if command -v "$cli" >/dev/null 2>&1; then
    ok "found: $cli → $(command -v "$cli")"
  else
    warn "missing: $cli"
    case "$cli" in
      claude)   warn "  → npm i -g @anthropic-ai/claude-code && claude login";;
      opencode) warn "  → npm i -g opencode-ai  (free Zen tier works out of the box)";;
      codex)    warn "  → npm i -g @openai/codex  (then set OPENAI_API_KEY)";;
      antigravity) warn "  → install agy / Antigravity CLI  (then set GOOGLE_API_KEY)";;
    esac
  fi
done

# ── Install arcanea-code globally ─────────────────────────────────────────────

info "Installing @arcanea/arcanea-code globally..."
if command -v arcanea-code >/dev/null 2>&1; then
  CURRENT_VERSION="$(arcanea-code --version 2>/dev/null || echo unknown)"
  info "Already installed (version: $CURRENT_VERSION). Upgrading..."
  $PKG_CMD @arcanea/arcanea-code@latest
  tick_update
else
  $PKG_CMD @arcanea/arcanea-code@latest
  tick_create
fi

# ── Run doctor ────────────────────────────────────────────────────────────────

info "Running doctor (writes ~/.arcanea/config.yaml)..."
if arcanea-code doctor; then
  ok "Config written."
else
  warn "Doctor reported issues. You can re-run: arcanea-code doctor"
fi

# ── Summary ───────────────────────────────────────────────────────────────────

echo
ok "Install summary:"
echo "  created: $CREATED"
echo "  updated: $UPDATED"
echo "  skipped: $SKIPPED"
echo
ok "Next: try \`arcanea-code list-tasks\` or \`arcanea-code explain code.debug\`."
echo
