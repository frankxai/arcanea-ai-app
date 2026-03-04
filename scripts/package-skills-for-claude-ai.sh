#!/bin/bash
# Package Arcanea skills for Claude.ai upload
# Fixes: \r line endings, missing YAML frontmatter, description >200 chars, multi-line YAML
# Output: .arcanea/skills-export/ with one .zip per skill

set -euo pipefail

SKILLS_DIR="/mnt/c/Users/frank/Arcanea/.arcanea/skills"
EXPORT_DIR="/mnt/c/Users/frank/Arcanea/.arcanea/skills-export"
STAGING_DIR="/tmp/arcanea-skills-staging"

rm -rf "$STAGING_DIR" "$EXPORT_DIR"
mkdir -p "$EXPORT_DIR" "$STAGING_DIR"

TOTAL=0
FIXED=0
SKIPPED=0

# Truncate description to 200 chars cleanly (at word boundary)
truncate_desc() {
  local desc="$1"
  if [ ${#desc} -le 200 ]; then
    echo "$desc"
    return
  fi
  # Cut at 197 chars, find last space, append "..."
  local cut="${desc:0:197}"
  cut="${cut% *}"
  echo "${cut}..."
}

# Process a single skill file into a properly structured zip
package_skill() {
  local skill_file="$1"
  local skill_dir="$2"    # directory containing the SKILL.md (or empty for standalone)
  local skill_name="$3"   # name for the zip

  echo ""
  echo "=== Processing: $skill_name ==="

  # Read the file content, strip \r
  local content
  content=$(cat "$skill_file" | tr -d '\r')

  # Check if it has YAML frontmatter
  local has_frontmatter=false
  if echo "$content" | head -1 | grep -q '^---$'; then
    has_frontmatter=true
  fi

  local name=""
  local description=""

  if $has_frontmatter; then
    # Extract name and description from existing frontmatter
    # Handle multi-line descriptions (YAML > or |)
    local fm
    fm=$(echo "$content" | sed -n '/^---$/,/^---$/{//!p}')

    name=$(echo "$fm" | grep '^name:' | sed 's/^name: *//' | head -1)

    # Check for multi-line description
    if echo "$fm" | grep -q '^description: *>'; then
      # Multi-line: collect indented continuation lines
      description=$(echo "$fm" | sed -n '/^description: *>/,/^[^ ]/{/^description:/d;/^[^ ]/d;p}' | sed 's/^  *//' | tr '\n' ' ' | sed 's/ *$//')
    elif echo "$fm" | grep -q '^description: *|'; then
      description=$(echo "$fm" | sed -n '/^description: *|/,/^[^ ]/{/^description:/d;/^[^ ]/d;p}' | sed 's/^  *//' | tr '\n' ' ' | sed 's/ *$//')
    else
      description=$(echo "$fm" | grep '^description:' | sed 's/^description: *//' | head -1)
    fi

    # Strip the old frontmatter, rebuild with only name + description
    local body
    body=$(echo "$content" | sed '1{/^---$/d}' | sed '0,/^---$/{/^---$/d}')
  else
    # No frontmatter — derive name and description from content
    local first_heading
    first_heading=$(echo "$content" | grep '^# ' | head -1 | sed 's/^# //' | sed 's/ *—.*//')

    if [ -n "$first_heading" ]; then
      name="$first_heading"
    else
      name="$skill_name"
    fi

    # Try to extract description from first paragraph
    local first_para
    first_para=$(echo "$content" | sed -n '/^[^#>-]/p' | head -2 | tr '\n' ' ' | sed 's/ *$//')
    if [ -n "$first_para" ]; then
      description="$first_para"
    else
      description="Arcanea skill: $name"
    fi

    local body="$content"
  fi

  # Clean up name — remove quotes
  name=$(echo "$name" | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//")

  # Truncate name to 64 chars
  if [ ${#name} -gt 64 ]; then
    name="${name:0:64}"
  fi

  # Truncate description to 200 chars
  description=$(truncate_desc "$description")

  echo "  Name: $name"
  echo "  Desc: $description (${#description} chars)"

  # Create the staging directory structure: skill-name/SKILL.md
  local stage_skill_dir="$STAGING_DIR/$skill_name"
  mkdir -p "$stage_skill_dir"

  # Write the fixed SKILL.md with clean frontmatter
  {
    echo "---"
    echo "name: \"$name\""
    echo "description: \"$description\""
    echo "---"
    echo ""
    if [ -n "${body:-}" ]; then
      echo "$body"
    else
      echo "$content"
    fi
  } > "$stage_skill_dir/SKILL.md"

  # Copy any resource files from the original directory
  if [ -n "$skill_dir" ] && [ -d "$skill_dir" ]; then
    find "$skill_dir" -type f ! -name "SKILL.md" ! -name "*.zip" | while read -r res; do
      local rel_path
      rel_path=$(realpath --relative-to="$skill_dir" "$res")
      local dest_dir
      dest_dir=$(dirname "$stage_skill_dir/$rel_path")
      mkdir -p "$dest_dir"
      # Also strip \r from .md resource files
      if [[ "$res" == *.md ]]; then
        tr -d '\r' < "$res" > "$stage_skill_dir/$rel_path"
      else
        cp "$res" "$stage_skill_dir/$rel_path"
      fi
      echo "  + Resource: $rel_path"
    done
  fi

  # Create the zip using PowerShell (no zip in WSL)
  local win_staging win_export
  win_staging=$(wslpath -w "$STAGING_DIR/$skill_name")
  win_export=$(wslpath -w "$EXPORT_DIR/${skill_name}.zip")
  powershell.exe -NoProfile -c "Compress-Archive -Path '$win_staging' -DestinationPath '$win_export' -Force" 2>/dev/null
  echo "  -> ${skill_name}.zip"
  TOTAL=$((TOTAL + 1))
}

echo "======================================"
echo " Arcanea Skills Packager for Claude.ai"
echo "======================================"

# 1. Process skills in arcanea/ subdirectory (each has SKILL.md)
for dir in "$SKILLS_DIR"/arcanea/*/; do
  if [ -f "$dir/SKILL.md" ]; then
    dirname=$(basename "$dir")
    package_skill "$dir/SKILL.md" "$dir" "$dirname"
  fi
done

# 2. Process skills in arcanea-core/ (mix of SKILL.md dirs and standalone .md)
for item in "$SKILLS_DIR"/arcanea-core/*/; do
  if [ -f "$item/SKILL.md" ]; then
    dirname=$(basename "$item")
    package_skill "$item/SKILL.md" "$item" "$dirname"
  fi
done

# Standalone .md files in arcanea-core/
for f in "$SKILLS_DIR"/arcanea-core/*.md; do
  [ -f "$f" ] || continue
  fname=$(basename "$f" .md)
  package_skill "$f" "" "$fname"
done

# 3. Process skills in creative/ subdirectory
for dir in "$SKILLS_DIR"/creative/*/; do
  if [ -f "$dir/SKILL.md" ]; then
    dirname=$(basename "$dir")
    package_skill "$dir/SKILL.md" "$dir" "$dirname"
  fi
done

# 4. Process standalone .skill.md and .md files in root skills/
for f in "$SKILLS_DIR"/*.skill.md "$SKILLS_DIR"/*.md; do
  [ -f "$f" ] || continue
  fname=$(basename "$f")
  # Derive clean name
  clean_name="${fname%.skill.md}"
  clean_name="${clean_name%.md}"
  package_skill "$f" "" "$clean_name"
done

# 5. Process source-gate/
for f in "$SKILLS_DIR"/source-gate/*.md; do
  [ -f "$f" ] || continue
  fname=$(basename "$f" .md)
  package_skill "$f" "" "source-gate-$fname"
done

echo ""
echo "======================================"
echo " DONE: $TOTAL skills packaged"
echo " Output: $EXPORT_DIR/"
echo "======================================"
echo ""
echo "Upload instructions:"
echo "1. Go to https://claude.ai/customize/skills"
echo "2. Drag and drop .zip files (or click upload)"
echo "3. Each .zip has proper YAML frontmatter and structure"
echo ""
ls -la "$EXPORT_DIR/"
