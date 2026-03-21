#!/usr/bin/env python3
"""Package Arcanea skills for Claude.ai upload.

Fixes:
  - Windows \r line endings (breaks YAML parsing)
  - Missing YAML frontmatter
  - Descriptions >200 chars
  - Multi-line YAML descriptions
  - Extra fields (only name + description kept)

Output: .arcanea/skills-export/ with one .zip per skill
"""

import os
import re
import zipfile
from pathlib import Path

SKILLS_DIR = Path("/mnt/c/Users/frank/Arcanea/.arcanea/skills")
EXPORT_DIR = Path("/mnt/c/Users/frank/Arcanea/.arcanea/skills-export")

# Clean up previous exports
if EXPORT_DIR.exists():
    for f in EXPORT_DIR.iterdir():
        f.unlink()
else:
    EXPORT_DIR.mkdir(parents=True)


def truncate_desc(desc: str, limit: int = 200) -> str:
    """Truncate description to limit chars at word boundary."""
    desc = desc.strip()
    if len(desc) <= limit:
        return desc
    cut = desc[:limit - 3]
    last_space = cut.rfind(" ")
    if last_space > limit // 2:
        cut = cut[:last_space]
    return cut + "..."


def extract_frontmatter(content: str):
    """Extract name and description from YAML frontmatter, return (name, desc, body)."""
    # Match --- delimited frontmatter
    fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n?(.*)', content, re.DOTALL)
    if not fm_match:
        return None, None, content

    fm_text = fm_match.group(1)
    body = fm_match.group(2)

    # Extract name
    name_match = re.search(r'^name:\s*(.+)$', fm_text, re.MULTILINE)
    name = name_match.group(1).strip().strip('"').strip("'") if name_match else None

    # Extract description — handle multi-line YAML (> or |)
    desc = None
    desc_match = re.search(r'^description:\s*([>|])\s*$', fm_text, re.MULTILINE)
    if desc_match:
        # Multi-line: collect indented lines after the marker
        lines_after = fm_text[desc_match.end():]
        multi_lines = []
        for line in lines_after.split('\n'):
            if line.startswith('  ') or line.startswith('\t'):
                multi_lines.append(line.strip())
            elif line.strip() == '':
                continue
            else:
                break
        desc = ' '.join(multi_lines)
    else:
        desc_match = re.search(r'^description:\s*(.+)$', fm_text, re.MULTILINE)
        if desc_match:
            desc = desc_match.group(1).strip().strip('"').strip("'")

    return name, desc, body


def derive_from_content(content: str):
    """Derive name and description from content without frontmatter."""
    # Get first heading
    heading_match = re.search(r'^#\s+(.+?)(?:\s*[—–-]\s*.+)?$', content, re.MULTILINE)
    name = heading_match.group(1).strip() if heading_match else None

    # Get first substantive paragraph (not heading, not blockquote, not hr)
    desc = None
    for line in content.split('\n'):
        line = line.strip()
        if not line or line.startswith('#') or line.startswith('>') or line.startswith('---') or line.startswith('```'):
            continue
        if line.startswith('This skill') or line.startswith('This document') or len(line) > 30:
            desc = line
            break

    return name, desc


def package_skill(skill_file: Path, skill_dir: Path | None, skill_name: str) -> bool:
    """Process a single skill into a .zip file."""
    # Read and strip \r
    content = skill_file.read_text(encoding='utf-8', errors='replace').replace('\r', '')

    # Extract or derive metadata
    name, desc, body = extract_frontmatter(content)

    if name is None or desc is None:
        derived_name, derived_desc = derive_from_content(content if body == content else content)
        if name is None:
            name = derived_name or skill_name
        if desc is None:
            desc = derived_desc or f"Arcanea skill: {name}"
        body = content  # No frontmatter was stripped

    # Enforce limits
    name = name[:64]
    desc = truncate_desc(desc)

    # Escape quotes in values
    name_safe = name.replace('"', '\\"')
    desc_safe = desc.replace('"', '\\"')

    print(f"\n  {skill_name}")
    print(f"    Name: {name} ({len(name)} chars)")
    print(f"    Desc: {desc[:80]}{'...' if len(desc) > 80 else ''} ({len(desc)} chars)")

    # Build the fixed SKILL.md
    fixed_content = f'---\nname: "{name_safe}"\ndescription: "{desc_safe}"\n---\n\n{body.lstrip()}'

    # Create the zip
    zip_path = EXPORT_DIR / f"{skill_name}.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Add SKILL.md as skill-name/SKILL.md
        zf.writestr(f"{skill_name}/SKILL.md", fixed_content)

        # Add resource files from the skill directory
        if skill_dir and skill_dir.is_dir():
            for res_file in skill_dir.rglob('*'):
                if res_file.is_file() and res_file.name != 'SKILL.md' and not res_file.suffix == '.zip':
                    rel_path = res_file.relative_to(skill_dir)
                    if res_file.suffix == '.md':
                        res_content = res_file.read_text(encoding='utf-8', errors='replace').replace('\r', '')
                        zf.writestr(f"{skill_name}/{rel_path}", res_content)
                    else:
                        zf.write(res_file, f"{skill_name}/{rel_path}")
                    print(f"    + {rel_path}")

    return True


def main():
    print("=" * 50)
    print(" Arcanea Skills Packager for Claude.ai")
    print("=" * 50)

    total = 0
    issues = []
    packaged_names = set()  # Track names to skip duplicates

    # 1. arcanea/ subdirectory skills (each folder has SKILL.md)
    arcanea_dir = SKILLS_DIR / "arcanea"
    if arcanea_dir.exists():
        print("\n--- arcanea/ ---")
        for d in sorted(arcanea_dir.iterdir()):
            if d.is_dir() and (d / "SKILL.md").exists():
                try:
                    package_skill(d / "SKILL.md", d, d.name)
                    packaged_names.add(d.name)
                    total += 1
                except Exception as e:
                    issues.append((d.name, str(e)))
                    print(f"    ERROR: {e}")

    # 2. arcanea-core/ (mix of SKILL.md dirs and standalone .md)
    core_dir = SKILLS_DIR / "arcanea-core"
    if core_dir.exists():
        print("\n--- arcanea-core/ ---")
        for d in sorted(core_dir.iterdir()):
            if d.is_dir() and (d / "SKILL.md").exists():
                try:
                    package_skill(d / "SKILL.md", d, d.name)
                    packaged_names.add(d.name)
                    total += 1
                except Exception as e:
                    issues.append((d.name, str(e)))
                    print(f"    ERROR: {e}")
            elif d.is_file() and d.suffix == '.md':
                try:
                    package_skill(d, None, d.stem)
                    total += 1
                except Exception as e:
                    issues.append((d.stem, str(e)))
                    print(f"    ERROR: {e}")

    # 3. creative/ subdirectory
    creative_dir = SKILLS_DIR / "creative"
    if creative_dir.exists():
        print("\n--- creative/ ---")
        for d in sorted(creative_dir.iterdir()):
            if d.is_dir() and (d / "SKILL.md").exists():
                try:
                    package_skill(d / "SKILL.md", d, d.name)
                    packaged_names.add(d.name)
                    total += 1
                except Exception as e:
                    issues.append((d.name, str(e)))
                    print(f"    ERROR: {e}")

    # 4. Standalone files in root skills/ (skip if directory version already packaged)
    print("\n--- standalone ---")
    for f in sorted(SKILLS_DIR.iterdir()):
        if f.is_file() and f.suffix == '.md':
            clean_name = f.stem.replace('.skill', '')
            if clean_name in packaged_names:
                print(f"\n  {clean_name} (SKIPPED - directory version already packaged)")
                continue
            try:
                package_skill(f, None, clean_name)
                packaged_names.add(clean_name)
                total += 1
            except Exception as e:
                issues.append((clean_name, str(e)))
                print(f"    ERROR: {e}")

    # 5. source-gate/
    sg_dir = SKILLS_DIR / "source-gate"
    if sg_dir.exists():
        print("\n--- source-gate/ ---")
        for f in sorted(sg_dir.iterdir()):
            if f.is_file() and f.suffix == '.md':
                name = f"source-gate-{f.stem}"
                try:
                    package_skill(f, None, name)
                    total += 1
                except Exception as e:
                    issues.append((name, str(e)))
                    print(f"    ERROR: {e}")

    # Summary
    print("\n" + "=" * 50)
    print(f" DONE: {total} skills packaged")
    if issues:
        print(f" ISSUES: {len(issues)} skills had errors:")
        for name, err in issues:
            print(f"   - {name}: {err}")
    print(f" Output: {EXPORT_DIR}/")
    print("=" * 50)

    # List output files
    print("\nGenerated files:")
    zip_files = sorted(EXPORT_DIR.glob("*.zip"))
    total_size = 0
    for zf in zip_files:
        size = zf.stat().st_size
        total_size += size
        print(f"  {zf.name:45s} {size:>8,} bytes")
    print(f"\n  Total: {len(zip_files)} files, {total_size:,} bytes")

    print("\n--- Upload Instructions ---")
    print("1. Open: https://claude.ai/customize/skills")
    print("2. Drag & drop .zip files (or click 'Upload')")
    print(f"3. Files are at: C:\\Users\\frank\\Arcanea\\.arcanea\\skills-export\\")
    print("4. Each .zip has proper YAML frontmatter + folder structure")


if __name__ == "__main__":
    main()
