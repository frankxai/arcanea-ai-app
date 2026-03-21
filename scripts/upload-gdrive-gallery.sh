#!/bin/bash
# ─── Automated G: Drive → Supabase Storage uploader ──────────────────────
# Runs from WSL, reads G: via powershell.exe, uploads via curl.
# No manual Windows steps needed.
#
# Usage: bash scripts/upload-gdrive-gallery.sh [--dry-run] [--limit N] [--guardian NAME]

set -euo pipefail

SUPABASE_URL="https://hcfhyssdzphudaqatxbk.supabase.co"
BUCKET="arcanea-gallery"
GDRIVE_PATH="G:\\My Drive\\Arcanea"

# Parse the anon key from .mcp.json or use env
ANON_KEY="${SUPABASE_ANON_KEY:?Set SUPABASE_ANON_KEY env var}"

DRY_RUN=false
LIMIT=0
GUARDIAN_FILTER=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --limit) LIMIT=$2; shift 2 ;;
    --guardian) GUARDIAN_FILTER=$2; shift 2 ;;
    *) shift ;;
  esac
done

# Guardian detection from filename
detect_guardian() {
  local name_lower
  name_lower=$(echo "$1" | tr '[:upper:]' '[:lower:]')
  for g in aiyami alera draconia elara ino leyla lyria lyssandria maylinn shinkami; do
    if [[ "$name_lower" == *"$g"* ]]; then
      echo "$g"
      return
    fi
  done
  # Check known patterns
  if [[ "$name_lower" == *"tree_goddess"* ]] || [[ "$name_lower" == *"earth"* ]]; then
    echo "lyssandria"
  elif [[ "$name_lower" == *"dragon"* ]] || [[ "$name_lower" == *"fire"* ]]; then
    echo "draconia"
  elif [[ "$name_lower" == *"water"* ]] || [[ "$name_lower" == *"ocean"* ]]; then
    echo "leyla"
  elif [[ "$name_lower" == *"wind"* ]] || [[ "$name_lower" == *"air"* ]]; then
    echo "elara"
  elif [[ "$name_lower" == *"void"* ]] || [[ "$name_lower" == *"spirit"* ]] || [[ "$name_lower" == *"cosmic"* ]]; then
    echo "shinkami"
  elif [[ "$name_lower" == *"community"* ]] || [[ "$name_lower" == *"wizard"* ]]; then
    echo "community"
  else
    echo "uncategorized"
  fi
}

mime_type() {
  case "${1##*.}" in
    webp) echo "image/webp" ;;
    png)  echo "image/png" ;;
    jpg|jpeg) echo "image/jpeg" ;;
    *) echo "application/octet-stream" ;;
  esac
}

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Arcanea Gallery Upload: G: Drive → Supabase Storage"
echo "═══════════════════════════════════════════════════════════"
echo "  Source: $GDRIVE_PATH"
echo "  Bucket: $BUCKET"
$DRY_RUN && echo "  Mode: DRY RUN (no uploads)"
[[ -n "$GUARDIAN_FILTER" ]] && echo "  Filter: $GUARDIAN_FILTER only"
[[ "$LIMIT" -gt 0 ]] && echo "  Limit: $LIMIT files"
echo ""

# Get file list from G: drive via PowerShell
echo "Scanning G: drive..."
FILE_LIST=$(powershell.exe -Command "
Get-ChildItem -Recurse -Path '$GDRIVE_PATH' -File |
  Where-Object { \$_.Extension -in '.webp','.png','.jpg','.jpeg' } |
  ForEach-Object { \$_.FullName }
" 2>/dev/null | tr -d '\r')

TOTAL=$(echo "$FILE_LIST" | grep -c . || true)
echo "Found $TOTAL images on G: drive"
echo ""

OK=0
FAIL=0
SKIP=0
COUNT=0

while IFS= read -r WIN_PATH; do
  [[ -z "$WIN_PATH" ]] && continue

  FILENAME=$(basename "$WIN_PATH")
  GUARDIAN=$(detect_guardian "$FILENAME")

  # Apply guardian filter
  if [[ -n "$GUARDIAN_FILTER" ]] && [[ "$GUARDIAN" != "$GUARDIAN_FILTER" ]]; then
    continue
  fi

  # Apply limit
  COUNT=$((COUNT + 1))
  if [[ "$LIMIT" -gt 0 ]] && [[ "$COUNT" -gt "$LIMIT" ]]; then
    break
  fi

  # Determine storage path
  STORAGE_PATH="guardians/gallery/${GUARDIAN}-${FILENAME}"
  MIME=$(mime_type "$FILENAME")

  printf "  [%d] %s → %s " "$COUNT" "$FILENAME" "$GUARDIAN"

  if $DRY_RUN; then
    echo "[dry-run]"
    OK=$((OK + 1))
    continue
  fi

  # Read file via PowerShell and pipe to curl
  HTTP=$(powershell.exe -Command "
    [System.IO.File]::ReadAllBytes('$WIN_PATH')
  " 2>/dev/null | curl -s -o /dev/null -w "%{http_code}" \
    -X POST "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${STORAGE_PATH}" \
    -H "Authorization: Bearer ${ANON_KEY}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: ${MIME}" \
    -H "x-upsert: true" \
    --data-binary @- 2>/dev/null || echo "000")

  if [[ "$HTTP" == "200" ]] || [[ "$HTTP" == "201" ]]; then
    echo "✓"
    OK=$((OK + 1))
  elif [[ "$HTTP" == "409" ]]; then
    echo "[exists]"
    SKIP=$((SKIP + 1))
  else
    echo "✗ ($HTTP)"
    FAIL=$((FAIL + 1))
  fi

done <<< "$FILE_LIST"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Uploaded: $OK  |  Skipped: $SKIP  |  Failed: $FAIL"
echo "═══════════════════════════════════════════════════════════"
echo ""
