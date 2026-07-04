#!/usr/bin/env bash
# Portable: source central hook-env for HARNESS/PROJECT detection (claude/grok/codex/agy/da)
HOOK_DIR="$(cd "$(dirname "#!/usr/bin/env bash
")" && pwd)"
if [ -f "$HOOK_DIR/lib/hook-env.sh" ]; then
  source "$HOOK_DIR/lib/hook-env.sh" 2>/dev/null || true
elif [ -f "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" ]; then
  source "C:/Users/frank/starlight/repos/claude-code-config/hooks/lib/hook-env.sh" 2>/dev/null || true
fi
# Arcanea Excellence System — SessionStart canon loader
# Loads canon highlights, active books, recent state, and skill routing into
# the session context. Pure informational/discovery hook — no permission
# grants, no policy assertions; just makes the canon and skill matrix
# visible so Claude doesn't forget it mid-session.
#
# Cross-platform: bash on Linux, Git Bash on Windows.
# Performance budget: <2s. Reads small files only.
# Failure mode: never breaks a session. Always exits 0.
set +e

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR" 2>/dev/null || exit 0

# Don't double-emit if a sibling hook already loaded canon this session.
SESSION_DIR="${ARCANEA_HOME:-$HOME/.arcanea}/sessions/current"
mkdir -p "$SESSION_DIR" 2>/dev/null
SENTINEL="$SESSION_DIR/excellence-canon-loaded"
if [ -f "$SENTINEL" ]; then exit 0; fi
touch "$SENTINEL" 2>/dev/null

# ── Recent state ────────────────────────────────────────────────────────────
RECENT_COMMITS=""
CURRENT_BRANCH=""
if command -v git &>/dev/null && [ -d .git ]; then
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  RECENT_COMMITS=$(git log -3 --format='  %h %s (%cr)' 2>/dev/null)
fi

# ── Active books (in-progress status only) ──────────────────────────────────
ACTIVE_BOOKS=""
if [ -d book ]; then
  for yaml in book/*/book.yaml; do
    [ -f "$yaml" ] || continue
    if grep -q 'status: in-progress' "$yaml" 2>/dev/null; then
      title=$(grep '^title:' "$yaml" | head -1 | sed 's/^title: *//; s/^"//; s/"$//')
      slug=$(dirname "$yaml" | sed 's|book/||')
      ACTIVE_BOOKS="$ACTIVE_BOOKS
  - $slug — $title"
    fi
  done
fi

[ -z "$ACTIVE_BOOKS" ] && ACTIVE_BOOKS="
  (no books currently in-progress)"
[ -z "$RECENT_COMMITS" ] && RECENT_COMMITS="  (no git history)"
[ -z "$CURRENT_BRANCH" ] && CURRENT_BRANCH="(detached)"

cat <<CANON
═══════════════════════════════════════════════════════════════════════════
  ARCANEA EXCELLENCE — canon + skill routing (informational hook)
═══════════════════════════════════════════════════════════════════════════

CANON HIGHLIGHTS (.arcanea/lore/CANON_LOCKED.md — never violate)

  PRIMORDIAL DUALITY
    Lumina (First Light, form-giver) and Nero (Primordial Darkness, fertile
    unknown). Nero is NOT evil. Shadow = corrupted Void (Dark Lord's
    perversion of Nero's gift). Never write "Nero" as villainous.

  FIVE ELEMENTS
    Fire - Water - Earth - Wind - Void/Spirit
    Void = Nero's aspect (potential).  Spirit = Lumina's aspect.
    Light is Fire's creation aspect.  Shadow is corrupted Void.

  TEN GATES (Guardian shown — see CANON_LOCKED for full table)
    Foundation (Lyssandria) - Flow (Leyla) - Fire (Draconia) -
    Heart (Maylinn) - Voice (Alera) - Sight (Lyria) - Crown (Aiyami) -
    Starweave (Elara) - Unity (Ino) - Source (Shinkami)
    Gate 8 is STARWEAVE (renamed from "Shift" on 2026-03-30).

  RANKS
    Luminor is a RANK (9-10 Gates open), NOT an entity type.

  COMMON VIOLATIONS to refuse outright:
    1. Inventing a "third primordial force" beyond Lumina/Nero
    2. Calling Nero / Void / oscuro "evil"
    3. Saying "Gate 8 Shift" — it is "Gate 8 Starweave"

BOOK-LEVEL CANON
  destellos = canonical word for magical sparks. NEVER "chispas".
  Lumara-specific: florchispa is the kid-friendly flower-vessel name; each
  florchispa HOLDS a destello in its golden centre.

ACTIVE BOOKS$ACTIVE_BOOKS

RECENT GIT (branch: $CURRENT_BRANCH)
$RECENT_COMMITS

═══════════════════════════════════════════════════════════════════════════
  SKILL ROUTING — invoke BEFORE drafting
═══════════════════════════════════════════════════════════════════════════
  /canon-check                 → before touching .arcanea/lore/, book/, gods, gates
  /excellence-book-writing     → drafting/editing book chapters or prose
  /character-forge             → any new character (12-field template)
  /world-forge                 → new world / faction / realm / magic system
  /arcanea-book-cover          → book covers (NB2 + cover-design thinking)
  /design-ship                 → UI page revamps (also load TASTE.md + DESIGN.md)
  /arcanea-orchestrator (/ao)  → cross-cutting kickoff when scope unclear
  /code-review                 → before merging non-trivial PRs
═══════════════════════════════════════════════════════════════════════════
CANON

exit 0
