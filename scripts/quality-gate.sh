#!/bin/bash
# ============================================================================
# AuthorOS Quality Gate — pre-commit hook for manuscripts
# Checks: AI verbal tics, passive voice, word stats, canon compliance
# Exit 0 = pass, Exit 1 = fail
#
# Usage:
#   bash scripts/quality-gate.sh                    # check staged .md files
#   bash scripts/quality-gate.sh path/to/file.md    # check specific file
#   bash scripts/quality-gate.sh path/to/dir/       # check all .md in dir
# ============================================================================

set -euo pipefail

# --- Configuration -----------------------------------------------------------

# TIER 1: Pure AI slop — always fail (no legitimate literary use)
FAIL_PATTERN='(^|[^a-zA-Z-])(delve|tapestry|nestled|myriad|synergy|holistic|robust|comprehensive|facilitate|utilize|endeavor|multifaceted|pivotal|cornerstone|underscore|nuanced|game-changer|cutting-edge|groundbreaking|revolutionize|embark|unleash|empower)([^a-zA-Z-]|$)'

# TIER 2: Context-dependent — warn only (legitimate uses exist)
WARN_PATTERN='(^|[^a-zA-Z-])(landscape|paradigm|leverage|beacon|symphony|orchestra|intricate|realm|harness|foster)([^a-zA-Z-]|$)'

# TIER 3: Multi-word AI phrases — always fail
FAIL_PHRASES=(
  "it's worth noting"
  "It is important to note"
  "At its core"
  "In conclusion"
)

# TIER 4: Multi-word AI transitions — warn at start of sentence
WARN_PHRASES=(
  "Moreover"
  "Furthermore"
  "Indeed"
)

PASSIVE_THRESHOLD=20  # warn if passive voice exceeds this percentage

# --- Colors ------------------------------------------------------------------

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# --- Gather files to check ---------------------------------------------------

FILES=()

if [[ $# -gt 0 ]]; then
  TARGET="$1"
  if [[ -f "$TARGET" ]]; then
    FILES=("$TARGET")
  elif [[ -d "$TARGET" ]]; then
    while IFS= read -r -d '' f; do
      FILES+=("$f")
    done < <(find "$TARGET" -name '*.md' -type f -print0 2>/dev/null)
  else
    echo -e "${RED}Error: $TARGET is not a file or directory${RESET}"
    exit 1
  fi
else
  # No argument: check staged .md files in book/ and content/
  while IFS= read -r f; do
    if [[ "$f" == book/*.md || "$f" == content/*.md ]]; then
      FILES+=("$f")
    fi
  done < <(git diff --cached --name-only --diff-filter=ACM 2>/dev/null || true)

  if [[ ${#FILES[@]} -eq 0 ]]; then
    echo -e "${GREEN}No staged manuscript files to check.${RESET}"
    exit 0
  fi
fi

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo -e "${YELLOW}No .md files found to check.${RESET}"
  exit 0
fi

# --- Analysis functions -------------------------------------------------------

TOTAL_VIOLATIONS=0
TOTAL_WARNINGS=0
TOTAL_FILES=0
TOTAL_WORDS_ALL=0
TOTAL_PASSIVE_ALL=0
TOTAL_SENTENCES_ALL=0

check_file() {
  local file="$1"
  local violations=0
  local warnings=0
  local violation_output=""
  local warning_output=""

  if [[ ! -f "$file" ]]; then
    echo -e "${YELLOW}  Skipping (not found): $file${RESET}"
    return
  fi

  TOTAL_FILES=$((TOTAL_FILES + 1))

  # Strip headers, blockquotes, code fences for analysis body
  local body
  body=$(awk '!/^#/ && !/^>/ && !/^```/' "$file")

  # --- Word / sentence / paragraph counts ---
  local word_count sentence_count paragraph_count
  word_count=$(echo "$body" | wc -w | tr -d ' ')
  sentence_count=$(echo "$body" | grep -oE '[.?!][[:space:]]|[.?!]$' | wc -l | tr -d ' ')
  [[ "$sentence_count" -eq 0 ]] && sentence_count=1
  paragraph_count=$(echo "$body" | grep -c '^$' | tr -d ' ')
  [[ "$paragraph_count" -eq 0 ]] && paragraph_count=1

  TOTAL_WORDS_ALL=$((TOTAL_WORDS_ALL + word_count))
  TOTAL_SENTENCES_ALL=$((TOTAL_SENTENCES_ALL + sentence_count))

  # --- TIER 1: Fail-level banned words (single grep pass) ---
  local fail_matches
  fail_matches=$(grep -inE "$FAIL_PATTERN" <<< "$body" || true)
  if [[ -n "$fail_matches" ]]; then
    while IFS= read -r match_line; do
      violations=$((violations + 1))
      violation_output+="    ${RED}FAIL${RESET} $match_line\n"
    done <<< "$fail_matches"
  fi

  # --- TIER 2: Warn-level words (single grep pass) ---
  local warn_matches
  warn_matches=$(grep -inE "$WARN_PATTERN" <<< "$body" || true)
  if [[ -n "$warn_matches" ]]; then
    while IFS= read -r match_line; do
      warnings=$((warnings + 1))
      warning_output+="    ${YELLOW}WARN${RESET} $match_line\n"
    done <<< "$warn_matches"
  fi

  # --- TIER 3: Fail-level phrases ---
  for phrase in "${FAIL_PHRASES[@]}"; do
    local phrase_matches
    phrase_matches=$(grep -in "$phrase" <<< "$body" || true)
    if [[ -n "$phrase_matches" ]]; then
      while IFS= read -r match_line; do
        violations=$((violations + 1))
        violation_output+="    ${RED}FAIL${RESET} $match_line  (\"$phrase\")\n"
      done <<< "$phrase_matches"
    fi
  done

  # --- TIER 4: Warn-level transitions (only at sentence start) ---
  for phrase in "${WARN_PHRASES[@]}"; do
    local phrase_matches
    phrase_matches=$(grep -inE "(^|[.!?][[:space:]]+)${phrase}\b" <<< "$body" || true)
    if [[ -n "$phrase_matches" ]]; then
      while IFS= read -r match_line; do
        warnings=$((warnings + 1))
        warning_output+="    ${YELLOW}WARN${RESET} $match_line  (\"$phrase\")\n"
      done <<< "$phrase_matches"
    fi
  done

  # --- Passive voice check (single grep pass) ---
  local passive_count
  passive_count=$(grep -icE '\b(was|were|been|being|is|are)\b[[:space:]]+[a-z]+(ed|en)\b' <<< "$body" || echo 0)

  TOTAL_PASSIVE_ALL=$((TOTAL_PASSIVE_ALL + passive_count))

  local passive_pct=0
  if [[ "$sentence_count" -gt 0 ]]; then
    passive_pct=$((passive_count * 100 / sentence_count))
  fi

  # --- Report for this file ---
  echo ""
  echo -e "${BOLD}${CYAN}--- $file ---${RESET}"
  echo -e "  Words: $word_count | Sentences: ~$sentence_count | Paragraphs: ~$paragraph_count"
  echo -e "  Avg words/sentence: $((word_count / sentence_count))"

  if [[ $violations -gt 0 ]]; then
    echo -e "  ${RED}${BOLD}AI SLOP: $violations violation(s)${RESET}"
    echo -e "$violation_output"
    TOTAL_VIOLATIONS=$((TOTAL_VIOLATIONS + violations))
  else
    echo -e "  ${GREEN}AI slop: 0 (clean)${RESET}"
  fi

  if [[ $warnings -gt 0 ]]; then
    echo -e "  ${YELLOW}Context words: $warnings (review recommended, not blocking)${RESET}"
    echo -e "$warning_output"
    TOTAL_WARNINGS=$((TOTAL_WARNINGS + warnings))
  fi

  if [[ $passive_pct -gt $PASSIVE_THRESHOLD ]]; then
    echo -e "  ${YELLOW}Passive voice: ~${passive_pct}% ($passive_count instances) — exceeds ${PASSIVE_THRESHOLD}% threshold${RESET}"
  else
    echo -e "  Passive voice: ~${passive_pct}% ($passive_count instances)"
  fi
}

# --- Run checks ---------------------------------------------------------------

echo ""
echo -e "${BOLD}========================================${RESET}"
echo -e "${BOLD}  AuthorOS Quality Gate${RESET}"
echo -e "${BOLD}========================================${RESET}"
echo -e "  Checking ${#FILES[@]} file(s)..."

for f in "${FILES[@]}"; do
  check_file "$f"
done

# --- Summary ------------------------------------------------------------------

echo ""
echo -e "${BOLD}========================================${RESET}"
echo -e "${BOLD}  Summary${RESET}"
echo -e "${BOLD}========================================${RESET}"
echo -e "  Files checked:    $TOTAL_FILES"
echo -e "  Total words:      $TOTAL_WORDS_ALL"
echo -e "  Total sentences:  ~$TOTAL_SENTENCES_ALL"
if [[ $TOTAL_WARNINGS -gt 0 ]]; then
  echo -e "  ${YELLOW}Warnings:       $TOTAL_WARNINGS (context-dependent words, review only)${RESET}"
fi

if [[ $TOTAL_VIOLATIONS -gt 0 ]]; then
  echo ""
  echo -e "  ${RED}${BOLD}FAIL${RESET} — $TOTAL_VIOLATIONS AI slop violation(s) detected"
  echo -e "  ${RED}Fix banned words/phrases before committing.${RESET}"
  echo ""
  exit 1
else
  echo ""
  echo -e "  ${GREEN}${BOLD}PASS${RESET} — Zero AI slop violations"
  if [[ $TOTAL_WARNINGS -gt 0 ]]; then
    echo -e "  ${YELLOW}$TOTAL_WARNINGS context-dependent word(s) flagged for review (non-blocking)${RESET}"
  fi
  echo -e "  ${GREEN}Manuscript quality gate cleared.${RESET}"
  echo ""
  exit 0
fi
