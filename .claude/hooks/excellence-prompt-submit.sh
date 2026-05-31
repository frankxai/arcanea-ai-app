#!/usr/bin/env bash
# Arcanea Excellence System — UserPromptSubmit skill router
# Detects work type from the user's prompt and surfaces relevant skills.
# Pure discovery hook — no permission grants, no policy assertions.
#
# Sibling to .claude/hooks/prompt-submit.sh (Guardian routing); this script
# focuses on skill discovery, not Guardian state.
#
# Performance budget: <500ms.
# Failure mode: never blocks. Always exits 0.
set +e

# Read prompt from environment, not argv: avoids Windows 32KB command-line
# length limit and shell-parsing/escaping bugs with arbitrary user input.
# Fall back to $1 for older Claude Code versions that still pass via argv.
PROMPT="${CLAUDE_USER_PROMPT:-${1:-}}"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# printf '%s\n' is safe for arbitrary input (echo breaks on leading -n/-e).
PROMPT_LOWER="$(printf '%s\n' "$PROMPT" | tr '[:upper:]' '[:lower:]')"

ROUTED=0

# Lumara / Las Tierras specific (highest specificity first)
if printf '%s\n' "$PROMPT_LOWER" | grep -qE 'lumara|destellos?|florchispa|las tierras|selene|aurelia|lila|conejito|abuela|farolito|veldoria|mira[^a-z]'; then
  cat <<'SKILL'
[EXCELLENCE] Book-content work detected.
  RECOMMENDED chain: /canon-check → /excellence-book-writing
  KEY REMINDERS:
    - destellos (NOT chispas) for the magical sparks
    - Show, don't tell — dialogue-heavy, kid-voiced
    - Lila narrates aloud to Conejito throughout
    - Abuela/mama wisdom internalised through MEMORY, never narrator-explained
    - Florchispa preserved only as the Lumara flower-vessel name
SKILL
  ROUTED=1
fi

# Generic book / chapter work
if [ "$ROUTED" -eq 0 ] && echo "$PROMPT_LOWER" | grep -qE '\bbook\b|chapter|chapters|drafting|prose|novel|narrative|bedtime'; then
  echo "[EXCELLENCE] Book/prose work detected. RECOMMENDED: /excellence-book-writing → /canon-check"
  ROUTED=1
fi

# Canon / lore work
if [ "$ROUTED" -eq 0 ] && echo "$PROMPT_LOWER" | grep -qE '\bcanon\b|\blore\b|guardian|godbeast|gate [0-9]|primordial|lumina|nero|malachar|luminor'; then
  echo "[EXCELLENCE] Canon/lore work detected. MANDATORY: /canon-check against .arcanea/lore/CANON_LOCKED.md before any edit."
  ROUTED=1
fi

# Character work
if [ "$ROUTED" -eq 0 ] && echo "$PROMPT_LOWER" | grep -qE 'new character|create.*character|character.*template|backstory|protagonist|antagonist'; then
  echo "[EXCELLENCE] Character work detected. RECOMMENDED: /character-forge (uses 12-field CHARACTER_TEMPLATE)."
  ROUTED=1
fi

# World/faction work
if [ "$ROUTED" -eq 0 ] && echo "$PROMPT_LOWER" | grep -qE 'world.?build|new (world|realm|faction|order|league)|magic system|cosmology'; then
  echo "[EXCELLENCE] World-building detected. RECOMMENDED: /world-forge → /canon-check"
  ROUTED=1
fi

# Image / cover work (additive — doesn't set ROUTED)
if printf '%s\n' "$PROMPT_LOWER" | grep -qE 'book cover|cover.*book|generate.*image|create.*art|illustrate|forge image|character art|book.?art'; then
  echo "[EXCELLENCE] Image-gen detected. PREFERRED: /arcanea-book-cover skill (NB2 + cover-design thinking) OR Higgsfield MCP."
fi

# UI / design work (additive)
if printf '%s\n' "$PROMPT_LOWER" | grep -qE '\bui\b|\bdesign\b|component|frontend|tailwind|react|next.?js.*page|theme|brand'; then
  echo "[EXCELLENCE] UI/design work detected. MANDATORY load: TASTE.md + DESIGN.md. RECOMMENDED: /design-ship for end-to-end revamps."
fi

# Cross-cutting kickoff
if printf '%s\n' "$PROMPT_LOWER" | grep -qE 'what should i (work on|do)|next step|prioriti|status|where (am|are we)|kickoff'; then
  echo "[EXCELLENCE] Cross-cutting kickoff. RECOMMENDED: /arcanea-orchestrator (/ao) — status, branch state, promotion queue, digest."
fi

exit 0
