#!/usr/bin/env bash
# Arcanea Excellence System — PreToolUse canon/voice check
# Fires before every Write or Edit. Extends voice-check.sh with canon-specific
# rules for Lumara, Las Tierras, and CANON_LOCKED protection.
#
# Performance budget: must complete in <300ms.
# Failure mode: never blocks (exit 0). Warnings written to stdout for surfacing.
set +e

TOOL_INPUT="${1:-}"

# Only act on book/lore paths
if ! echo "$TOOL_INPUT" | grep -qE '(book/|\.arcanea/lore/|/lore/|chronicles|legends|wisdom-scrolls|lumara|las-tierras|destellos|las-chispas)'; then
  exit 0
fi

# ── Generic AI-slop pattern check (from original voice-check.sh) ────────────
if echo "$TOOL_INPUT" | grep -qiE 'delve|tapestry of|vibrant ecosystem|in conclusion|it.s important to note|at the end of the day|navigate the (complex|intricate)|landscape of'; then
  echo "[VOICE] AI-slop pattern detected. Review for authentic Arcanea voice before saving."
fi

# ── CANON_LOCKED protection ─────────────────────────────────────────────────
if echo "$TOOL_INPUT" | grep -qE '\.arcanea/lore/CANON_LOCKED\.md'; then
  echo "[CANON GUARD] You are editing CANON_LOCKED.md — the immutable canon reference."
  echo "[CANON GUARD] Required: explicit user approval for this edit. Pause and confirm."
fi

# ── Lumara: enforce destellos, allow florchispa ─────────────────────────────
if echo "$TOOL_INPUT" | grep -qE 'book/lumara'; then
  # Look for non-florchispa chispa references in content
  CHISPA_LEAKS=$(echo "$TOOL_INPUT" | grep -oE '\bchispa[s]?\b|\bchispita[s]?\b' | grep -v florchispa | head -3)
  if [ -n "$CHISPA_LEAKS" ]; then
    echo "[LUMARA CANON] 'chispa' references detected outside florchispa. Use 'destellos' for the magical sparks."
    echo "[LUMARA CANON] Allowed: 'florchispa' (the flower-vessel). Rejected: 'chispa', 'chispas', 'chispita'."
  fi
fi

# ── Las Tierras: catch most common canon violations ─────────────────────────
if echo "$TOOL_INPUT" | grep -qE 'book/las-tierras'; then
  # Old "Shift" name for Gate 8
  if echo "$TOOL_INPUT" | grep -qiE '\bgate 8 shift\b|shift gate\b|gate.*shift|shift.*gate'; then
    echo "[CANON GUARD] Gate 8 is STARWEAVE (renamed 2026-03-30). 'Shift' is the old name."
  fi
  # Nero / oscuro as evil
  if echo "$TOOL_INPUT" | grep -qiE 'nero.*(evil|villain|wicked)|oscuro.*(evil|villain)|dark.*(force|power).*(corrupt|evil).*nero'; then
    echo "[CANON GUARD] Nero is NOT evil — Nero is the Primordial Darkness, fertile unknown. Shadow (corrupted Void) is the perversion."
  fi
  # Third primordial force invention
  if echo "$TOOL_INPUT" | grep -qiE 'third (primordial|primal|original) (force|power|principle)|beyond lumina (and|&) nero'; then
    echo "[CANON GUARD] No third primordial force exists. Lumina + Nero is the duality. Do not invent a third."
  fi
fi

exit 0
