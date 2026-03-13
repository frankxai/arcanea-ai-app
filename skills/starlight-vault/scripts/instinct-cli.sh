#!/usr/bin/env bash
# Starlight Vault CLI — Fragment management
# Usage: instinct-cli.sh <command> [args]
#   status    — Show all fragments with confidence
#   export    — Export fragments to stdout (YAML)
#   import    — Import fragments from file
#   evolve    — Attempt to evolve fragments into constellations

set -euo pipefail

VAULT_ROOT="${HOME}/.arcanea/starlight-vault"
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")
PROJECT_HASH=$(echo "$PROJECT_ROOT" | md5sum | cut -c1-12)
PROJECT_DIR="${VAULT_ROOT}/projects/${PROJECT_HASH}"

CMD="${1:-status}"

case "$CMD" in
  status)
    echo "=== Starlight Vault — Fragment Status ==="
    echo ""

    # Global fragments
    GLOBAL_DIR="${VAULT_ROOT}/fragments"
    if [ -d "$GLOBAL_DIR/personal" ]; then
      GLOBAL_COUNT=$(find "$GLOBAL_DIR/personal" -name "*.yaml" -o -name "*.yml" 2>/dev/null | wc -l)
      echo "Global fragments: ${GLOBAL_COUNT}"
    else
      echo "Global fragments: 0"
    fi

    if [ -d "$GLOBAL_DIR/inherited" ]; then
      INHERITED_COUNT=$(find "$GLOBAL_DIR/inherited" -name "*.yaml" -o -name "*.yml" 2>/dev/null | wc -l)
      echo "Inherited fragments: ${INHERITED_COUNT}"
    else
      echo "Inherited fragments: 0"
    fi

    if [ -d "$GLOBAL_DIR/arcanean" ]; then
      ARCANEAN_COUNT=$(find "$GLOBAL_DIR/arcanean" -name "*.yaml" -o -name "*.yml" 2>/dev/null | wc -l)
      echo "Arcanean fragments: ${ARCANEAN_COUNT}"
    else
      echo "Arcanean fragments: 0"
    fi

    # Project fragments
    if [ -d "$PROJECT_DIR/fragments" ]; then
      PROJ_COUNT=$(find "$PROJECT_DIR/fragments" -name "*.yaml" -o -name "*.yml" 2>/dev/null | wc -l)
      echo "Project fragments: ${PROJ_COUNT} ($(basename "$PROJECT_ROOT"))"
    fi

    # Observations
    if [ -f "$PROJECT_DIR/observations.jsonl" ]; then
      OBS_COUNT=$(wc -l < "$PROJECT_DIR/observations.jsonl")
      echo "Pending observations: ${OBS_COUNT}"
    else
      echo "Pending observations: 0"
    fi

    echo ""

    # List fragments with confidence
    for DIR in "$GLOBAL_DIR/personal" "$GLOBAL_DIR/inherited" "$GLOBAL_DIR/arcanean" "$PROJECT_DIR/fragments/personal" 2>/dev/null; do
      if [ -d "$DIR" ]; then
        for F in "$DIR"/*.yaml "$DIR"/*.yml; do
          [ -f "$F" ] || continue
          ID=$(grep "^id:" "$F" 2>/dev/null | head -1 | sed 's/id: *//')
          CONF=$(grep "^confidence:" "$F" 2>/dev/null | head -1 | sed 's/confidence: *//')
          DOMAIN=$(grep "^domain:" "$F" 2>/dev/null | head -1 | sed 's/domain: *"//;s/"//')
          if [ -n "$ID" ]; then
            printf "  %-35s conf=%-5s domain=%s\n" "$ID" "${CONF:-?}" "${DOMAIN:-?}"
          fi
        done
      fi
    done
    ;;

  export)
    echo "# Starlight Vault Export — $(date -Iseconds)"
    echo "# Project: $(basename "$PROJECT_ROOT")"
    echo "---"
    for DIR in "$GLOBAL_DIR/personal" "$PROJECT_DIR/fragments/personal" 2>/dev/null; do
      if [ -d "$DIR" ]; then
        for F in "$DIR"/*.yaml "$DIR"/*.yml; do
          [ -f "$F" ] || continue
          echo ""
          cat "$F"
        done
      fi
    done
    ;;

  import)
    FILE="${2:-}"
    if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
      echo "Usage: instinct-cli.sh import <file.yaml>"
      exit 1
    fi
    DEST="${VAULT_ROOT}/fragments/inherited"
    mkdir -p "$DEST"
    cp "$FILE" "$DEST/"
    echo "Imported: $(basename "$FILE") → inherited/"
    ;;

  *)
    echo "Unknown command: $CMD"
    echo "Usage: instinct-cli.sh {status|export|import}"
    exit 1
    ;;
esac
