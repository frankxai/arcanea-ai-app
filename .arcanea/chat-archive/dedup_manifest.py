#!/usr/bin/env python3
"""
dedup_manifest.py — Run this yourself, locally. Not designed to run through Claude/Cowork.

Your second-brain vault's own contract (private/README.md) says: "No MCP server points
here. No LLM has access. By design... The privacy contract is non-waivable." That
folder holds your raw claude-ai chat-history imports. Correctly, I (Claude) never read
its contents in this session — I only confirmed the folder exists via a directory
listing, then stopped. This script is how the dedup work gets done without breaking
that boundary: it runs on your machine, reads only filenames/titles/dates (never full
content) from both sides, and writes a manifest of what's already captured where. You
can share the manifest output back with an AI session if you want help acting on it —
that's just a list of titles/dates, not your private chat content.

What it compares:
  A) C:\\Users\\frank\\second-brain\\private\\chat-history\\claude-ai\\   (your air-gapped vault)
  B) C:\\Users\\frank\\starlight\\repos\\arcanea-ai-app\\.arcanea\\chat-archive\\markdown\\  (this session's export pipeline output)
  C) C:\\Users\\frank\\starlight\\repos\\arcanea-ai-app\\.arcanea\\chat-archive\\canon-recovered\\  (manually pulled artifacts)

It matches conversations by claude.ai UUID when filenames contain one (both this
session's `process_export.py` and most ingestion scripts embed the UUID or its first 8
chars in the filename), falling back to fuzzy title matching when no UUID is present.

Usage (from a normal terminal, not this session):
    python3 dedup_manifest.py

Output:
    dedup_manifest_output.md — three lists: already in both places (skip), only in
    second-brain (nothing to do, already captured), only in arcanea-ai-app (candidate
    for also copying into second-brain if you want one archive to be authoritative).

Edit the three PATH constants below if your folders are laid out differently.
"""

import re
from pathlib import Path

SECOND_BRAIN_CLAUDE_HISTORY = Path(r"C:\Users\frank\second-brain\private\chat-history\claude-ai")
ARCANEA_MARKDOWN = Path(r"C:\Users\frank\starlight\repos\arcanea-ai-app\.arcanea\chat-archive\markdown")
ARCANEA_CANON_RECOVERED = Path(r"C:\Users\frank\starlight\repos\arcanea-ai-app\.arcanea\chat-archive\canon-recovered")

UUID_RE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.IGNORECASE)
UUID8_RE = re.compile(r"--([0-9a-f]{8})\b", re.IGNORECASE)


def slug_key(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[^a-z0-9]+", "-", name).strip("-")
    return name


def index_folder(folder: Path):
    """Returns dict: key (uuid8 or slug) -> filename, for every file found."""
    index = {}
    if not folder.exists():
        return index
    for p in folder.rglob("*"):
        if not p.is_file():
            continue
        name = p.stem
        m = UUID_RE.search(name) or UUID8_RE.search(name)
        if m:
            key = m.group(0)[:8].lower() if UUID_RE.match(m.group(0)) else m.group(1).lower()
        else:
            key = slug_key(name)
        index[key] = str(p)
    return index


def main():
    sb_index = index_folder(SECOND_BRAIN_CLAUDE_HISTORY)
    arc_md_index = index_folder(ARCANEA_MARKDOWN)
    arc_canon_index = index_folder(ARCANEA_CANON_RECOVERED)
    arc_index = {**arc_md_index, **arc_canon_index}

    sb_keys = set(sb_index)
    arc_keys = set(arc_index)

    both = sorted(sb_keys & arc_keys)
    only_sb = sorted(sb_keys - arc_keys)
    only_arc = sorted(arc_keys - sb_keys)

    lines = [
        "# Dedup Manifest",
        "",
        f"second-brain/private/chat-history/claude-ai: {len(sb_index)} files found"
        + ("" if SECOND_BRAIN_CLAUDE_HISTORY.exists() else "  (folder not found — check the path constant)"),
        f"arcanea-ai-app/.arcanea/chat-archive (markdown + canon-recovered): {len(arc_index)} files found",
        "",
        f"## Already in both ({len(both)}) — skip, no action needed",
        "",
    ]
    for k in both:
        lines.append(f"- `{k}` — second-brain: `{sb_index[k]}` | arcanea-ai-app: `{arc_index[k]}`")

    lines += [
        "",
        f"## Only in second-brain ({len(only_sb)}) — already captured there, arcanea-ai-app pipeline hasn't touched these",
        "",
    ]
    for k in only_sb:
        lines.append(f"- `{k}` — `{sb_index[k]}`")

    lines += [
        "",
        f"## Only in arcanea-ai-app ({len(only_arc)}) — pulled this session, not yet in second-brain",
        "",
    ]
    for k in only_arc:
        lines.append(f"- `{k}` — `{arc_index[k]}`")

    out_path = Path(__file__).resolve().parent / "dedup_manifest_output.md"
    out_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {out_path}")
    print(f"Both: {len(both)} | Only second-brain: {len(only_sb)} | Only arcanea-ai-app: {len(only_arc)}")


if __name__ == "__main__":
    main()
