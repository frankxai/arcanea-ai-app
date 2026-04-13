#!/usr/bin/env python3
"""
obsidian-harvest.py — Extract ## To Triage sections from Obsidian daily notes.

Usage:
  python wiki/scripts/obsidian-harvest.py --vault ~/Obsidian --days 7
  python wiki/scripts/obsidian-harvest.py --vault ~/Obsidian --dry-run
  python wiki/scripts/obsidian-harvest.py --vault ~/Obsidian --clear

Output (stdout): JSON array of harvested items
Logs (stderr): progress, warnings, errors

Exit codes:
  0 = success
  1 = error (vault not found, parse failure)
  2 = partial (some notes processed, some failed)
"""

import argparse
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path


def last_n_days(n: int) -> list[date]:
    today = date.today()
    return [today - timedelta(days=i) for i in range(n)]


def format_daily_note_path(vault: Path, d: date) -> Path:
    """Try common daily note path conventions."""
    candidates = [
        vault / "Daily" / f"{d.isoformat()}.md",
        vault / "Daily Notes" / f"{d.isoformat()}.md",
        vault / "Journal" / f"{d.isoformat()}.md",
        vault / f"{d.isoformat()}.md",
        vault / "Daily" / f"{d.strftime('%Y-%m-%d')}.md",
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


def extract_triage_section(content: str) -> list[str]:
    """Extract bullet items from ## To Triage section."""
    # Match ## To Triage through next ## heading or end of file
    pattern = r"##\s+To Triage\s*\n(.*?)(?=\n##\s|\Z)"
    match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
    if not match:
        return []

    section = match.group(1)
    items = []
    for line in section.split("\n"):
        line = line.strip()
        # Accept - item, * item, [ ] item, [x] item (skip completed)
        if re.match(r"^[-*]\s+", line):
            text = re.sub(r"^[-*]\s+", "", line).strip()
            if text:
                items.append(text)
        elif re.match(r"^\[\s\]\s+", line):
            text = re.sub(r"^\[\s\]\s+", "", line).strip()
            if text:
                items.append(text)
        # Skip [x] (already done), skip blank lines, skip sub-bullets for now
    return items


def clear_triage_section(content: str, harvested_date: str) -> str:
    """Replace ## To Triage content with harvested marker."""
    def replace_section(m):
        return f"## To Triage\nHarvested {harvested_date}\n"

    pattern = r"(##\s+To Triage\s*\n)(.*?)(?=\n##\s|\Z)"
    return re.sub(pattern, replace_section, content, flags=re.DOTALL | re.IGNORECASE)


def infer_brand(text: str) -> str:
    """Infer brand from item text."""
    text_lower = text.lower()
    keywords = {
        "ARC": ["arcanea", "lumina", "luminor", "guardian", "arcanean", "wiki", "second brain", "publishing", "arco"],
        "FX": ["frankx", "frank x", "creator", "gym", "influencer", "superfan", "frankx.ai"],
        "SIS": ["starlight", "intelligence systems", "oracle", "enterprise", "ai architect", "sis"],
        "MUS": ["music", "beat", "track", "lo-fi", "anime", "sound", "audio", "lofi"],
        "BIZ": ["business", "finance", "legal", "tax", "contract", "vendor", "compliance", "bv", "invoice"],
    }
    for brand, kws in keywords.items():
        if any(kw in text_lower for kw in kws):
            return brand
    return "ARC"  # default


def infer_type(text: str) -> str:
    """Infer item type from text."""
    text_lower = text.lower()
    if any(w in text_lower for w in ["broken", "error", "not working", "failing", "bug", "fix"]):
        return "bug"
    if any(w in text_lower for w in ["post", "video", "article", "tweet", "newsletter", "content"]):
        return "content"
    if any(w in text_lower for w in ["decide", "choose", "should", "which", "decision"]):
        return "decision"
    if any(w in text_lower for w in ["http", "www.", "link", "article", "read"]):
        return "reference"
    if any(w in text_lower for w in ["build", "write", "create", "add", "implement", "deploy", "ship"]):
        return "task"
    return "idea"


def harvest_vault(vault_path: Path, days: int) -> tuple[list[dict], list[str], int]:
    """
    Harvest items from vault.
    Returns: (items, warnings, notes_processed)
    """
    items = []
    warnings = []
    notes_processed = 0

    for d in last_n_days(days):
        note_path = format_daily_note_path(vault_path, d)
        if note_path is None:
            print(f"  [skip] No daily note for {d.isoformat()}", file=sys.stderr)
            continue

        try:
            content = note_path.read_text(encoding="utf-8")
        except Exception as e:
            warnings.append(f"Could not read {note_path}: {e}")
            continue

        extracted = extract_triage_section(content)
        if not extracted:
            print(f"  [empty] {note_path.name}: no ## To Triage items", file=sys.stderr)
            notes_processed += 1
            continue

        print(f"  [found] {note_path.name}: {len(extracted)} item(s)", file=sys.stderr)
        notes_processed += 1

        for text in extracted:
            items.append({
                "title": text[:100],  # cap title length
                "description": text,
                "source": "obsidian",
                "source_file": str(note_path),
                "source_date": d.isoformat(),
                "brand": infer_brand(text),
                "type": infer_type(text),
                "tier": "T2",
            })

    return items, warnings, notes_processed


def clear_vault_sections(vault_path: Path, days: int, clear_date: str) -> int:
    """Clear ## To Triage sections from processed notes. Returns count of notes cleared."""
    cleared = 0
    for d in last_n_days(days):
        note_path = format_daily_note_path(vault_path, d)
        if note_path is None:
            continue
        try:
            content = note_path.read_text(encoding="utf-8")
            new_content = clear_triage_section(content, clear_date)
            if new_content != content:
                note_path.write_text(new_content, encoding="utf-8")
                cleared += 1
                print(f"  [cleared] {note_path.name}", file=sys.stderr)
        except Exception as e:
            print(f"  [error] Could not clear {note_path}: {e}", file=sys.stderr)
    return cleared


def deduplicate(items: list[dict], existing_titles: list[str]) -> tuple[list[dict], int]:
    """Remove items that closely match existing titles."""
    def similarity(a: str, b: str) -> float:
        a_words = set(a.lower().split())
        b_words = set(b.lower().split())
        if not a_words or not b_words:
            return 0.0
        intersection = a_words & b_words
        return len(intersection) / max(len(a_words), len(b_words))

    unique = []
    skipped = 0
    for item in items:
        title = item["title"]
        is_dup = any(similarity(title, ex) > 0.8 for ex in existing_titles)
        if is_dup:
            skipped += 1
            print(f"  [dup] Skipping: {title[:60]}", file=sys.stderr)
        else:
            unique.append(item)
            existing_titles.append(title)  # prevent self-duplicates in batch

    return unique, skipped


def smoke_test():
    """Quick smoke test — runs without a real vault."""
    test_content = """
# 2026-04-13

## Morning
Had coffee.

## To Triage
- Build the /capture skill for Arcanea
- Write FrankX landing page copy for launch
- Fix broken Lumina webhook endpoint
- https://example.com/interesting-article
- Decide on analytics tool for dashboard

## Evening
Done for the day.
"""
    items = extract_triage_section(test_content)
    assert len(items) == 5, f"Expected 5 items, got {len(items)}: {items}"
    assert "Build the /capture skill for Arcanea" in items
    assert infer_brand("Build the /capture skill for Arcanea") == "ARC"
    assert infer_brand("Write FrankX landing page copy") == "FX"
    assert infer_type("Fix broken Lumina webhook") == "bug"
    assert infer_type("Decide on analytics tool") == "decision"
    assert infer_type("https://example.com/interesting-article") == "reference"

    cleared = clear_triage_section(test_content, "2026-04-13")
    assert "Harvested 2026-04-13" in cleared
    assert "Build the /capture skill" not in cleared

    print("✅ Smoke test passed", file=sys.stderr)
    return True


def main():
    parser = argparse.ArgumentParser(description="Harvest Obsidian ## To Triage sections")
    parser.add_argument("--vault", type=Path, help="Path to Obsidian vault")
    parser.add_argument("--days", type=int, default=7, help="Lookback days (default: 7)")
    parser.add_argument("--dry-run", action="store_true", help="Show items without creating or clearing")
    parser.add_argument("--clear", action="store_true", help="Clear ## To Triage sections after harvest")
    parser.add_argument("--existing-titles", type=str, default="", help="Comma-separated existing inbox titles for dedup")
    parser.add_argument("--smoke-test", action="store_true", help="Run smoke test without vault")
    args = parser.parse_args()

    if args.smoke_test:
        success = smoke_test()
        sys.exit(0 if success else 1)

    if not args.vault:
        print("Error: --vault is required (unless --smoke-test)", file=sys.stderr)
        sys.exit(1)

    vault = args.vault.expanduser().resolve()
    if not vault.exists():
        print(f"Error: Vault not found at {vault}", file=sys.stderr)
        sys.exit(1)

    print(f"Harvesting from {vault} (last {args.days} days)...", file=sys.stderr)

    items, warnings, notes_processed = harvest_vault(vault, args.days)

    # Deduplication
    existing = [t.strip() for t in args.existing_titles.split(",") if t.strip()]
    items, skipped = deduplicate(items, existing)

    # Summary to stderr
    print(f"\nSummary:", file=sys.stderr)
    print(f"  Notes processed: {notes_processed}", file=sys.stderr)
    print(f"  Items found: {len(items) + skipped}", file=sys.stderr)
    print(f"  Duplicates skipped: {skipped}", file=sys.stderr)
    print(f"  New items: {len(items)}", file=sys.stderr)

    if warnings:
        print(f"\nWarnings:", file=sys.stderr)
        for w in warnings:
            print(f"  ⚠️  {w}", file=sys.stderr)

    if args.dry_run:
        print(f"\n[DRY RUN] Would create {len(items)} Linear issues. No changes made.", file=sys.stderr)
    elif args.clear and items:
        cleared = clear_vault_sections(vault, args.days, date.today().isoformat())
        print(f"  Cleared {cleared} note(s)", file=sys.stderr)

    # Output JSON to stdout for piping to Linear creation script
    print(json.dumps(items, indent=2))

    exit_code = 0 if not warnings else 2
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
