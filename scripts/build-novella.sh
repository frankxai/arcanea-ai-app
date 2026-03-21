#!/bin/bash
# ============================================================================
# AuthorOS — Build Novella: Kael's Ascent
# Compiles individual chapter files into a single manuscript + epub/pdf
# ============================================================================

set -e

BOOK_DIR="book/tales-of-creators"
OUTPUT_DIR="output"
TITLE="Kaels_Ascent"

mkdir -p "$OUTPUT_DIR"

echo "AuthorOS — Building Novella"
echo "=================================="

# Step 1: Compile chapters into single manuscript
echo "  Compiling chapters..."
cat "$BOOK_DIR/00_FRONT_MATTER.md" > "$OUTPUT_DIR/${TITLE}.md"
echo "" >> "$OUTPUT_DIR/${TITLE}.md"
echo "---" >> "$OUTPUT_DIR/${TITLE}.md"
echo "" >> "$OUTPUT_DIR/${TITLE}.md"

for chapter in \
  "$BOOK_DIR/01_THE_WEIGHT_OF_STANDING.md" \
  "$BOOK_DIR/02_THE_THAW.md" \
  "$BOOK_DIR/03_THE_CLAIMING.md" \
  "$BOOK_DIR/THE_OPEN_WOUND.md" \
  "$BOOK_DIR/THE_SILENT_SONG.md"; do
  if [ -f "$chapter" ]; then
    echo "    + $(basename "$chapter")"
    echo "" >> "$OUTPUT_DIR/${TITLE}.md"
    cat "$chapter" >> "$OUTPUT_DIR/${TITLE}.md"
    echo "" >> "$OUTPUT_DIR/${TITLE}.md"
    echo "---" >> "$OUTPUT_DIR/${TITLE}.md"
    echo "" >> "$OUTPUT_DIR/${TITLE}.md"
  else
    echo "    ! MISSING: $(basename "$chapter")"
  fi
done

# Step 2: Word count
TOTAL_WORDS=$(wc -w < "$OUTPUT_DIR/${TITLE}.md")
echo ""
echo "  Total words: $TOTAL_WORDS"
echo ""

# Step 3: Quality check
echo "  Running quality gate..."
SLOP_COUNT=$(grep -ci "delve\|tapestry\|nestled\|myriad\|beacon\|it's worth noting\|moreover\|furthermore\|indeed" "$OUTPUT_DIR/${TITLE}.md" 2>/dev/null || true)
SLOP_COUNT=$(echo "$SLOP_COUNT" | tr -d "\n" | grep -o "[0-9]*" || echo "0")
echo "  AI verbal tics: $SLOP_COUNT"
if [ "$SLOP_COUNT" -eq 0 ] 2>/dev/null || [ "$SLOP_COUNT" = "0" ]; then
  echo "  Quality: PASS"
else
  echo "  Quality: FAIL — fix before publishing"
fi
echo ""

# Step 4: Try epub conversion
if command -v pandoc &> /dev/null; then
  echo "  Generating EPUB..."
  pandoc "$OUTPUT_DIR/${TITLE}.md" \
    --metadata title="Kael's Ascent: Tales from the Ten Gates" \
    --metadata author="FrankX" \
    --toc \
    -o "$OUTPUT_DIR/${TITLE}.epub"
  echo "  -> $OUTPUT_DIR/${TITLE}.epub"

  echo "  Generating PDF..."
  pandoc "$OUTPUT_DIR/${TITLE}.md" \
    --metadata title="Kael's Ascent: Tales from the Ten Gates" \
    --metadata author="FrankX" \
    --toc \
    -o "$OUTPUT_DIR/${TITLE}.pdf" 2>/dev/null || echo "  (PDF requires LaTeX — skipped)"
else
  echo "  pandoc not installed — epub/pdf skipped"
  echo "  Install: sudo apt install pandoc"
fi

echo ""
echo "=================================="
echo "  Manuscript: $OUTPUT_DIR/${TITLE}.md ($TOTAL_WORDS words)"
[ -f "$OUTPUT_DIR/${TITLE}.epub" ] && echo "  EPUB: $OUTPUT_DIR/${TITLE}.epub"
[ -f "$OUTPUT_DIR/${TITLE}.pdf" ] && echo "  PDF: $OUTPUT_DIR/${TITLE}.pdf"
echo "=================================="
