#!/usr/bin/env python3
"""
process_export.py -- Convert a claude.ai data export (conversations.json,
inside the zip claude.ai emails from Settings > Privacy > Export data)
into one markdown file per conversation, plus a triage index.

Usage:
    python3 process_export.py /path/to/data-export.zip
    python3 process_export.py /path/to/already-unzipped-dir
    python3 process_export.py /path/to/export --all   # process every conversation, not just Arcanea-relevant ones

By default this ONLY processes conversations that look Arcanea-relevant (same keyword
filter as process_provenance.py). A full account export covers years of everything --
business, code, health, personal -- most of which does not belong in this repo. Pass
--all only if you deliberately want every conversation rendered here; otherwise the
non-Arcanea majority should go to the air-gapped second-brain private vault instead
(see dedup_manifest.py and the inbox README for the intended routing), not into a
public-adjacent engineering repo.

Output:
    .arcanea/chat-archive/markdown/<YYYY-MM>/<slug>--<uuid8>.md
    .arcanea/chat-archive/triage/INDEX.md   (chronological index, one line per convo)

VERIFIED 2026-07-15 -- artifact/canvas content IS captured at full fidelity by this
export format: spot-checked the source chat behind CANON_LOCKED_v6.md against the raw
JSON and every known canon string (gate frequencies, gates.yaml, Thirteen Lords, etc.)
appears verbatim. Separately, message-level 'attachments'/'files' fields (pasted text
files, uploaded images) carry an 'extracted_content' field with the full pasted text --
this script now renders that content directly instead of just flagging it as risk.
"""

import json
import re
import sys
import zipfile
from pathlib import Path

ARCHIVE_ROOT = Path(__file__).resolve().parent
MARKDOWN_DIR = ARCHIVE_ROOT / "markdown"
TRIAGE_DIR = ARCHIVE_ROOT / "triage"

ARCANEA_HINTS = re.compile(
    r"\barcanea|luminor|guardian|vel'?tara|shinkami|gate.?(hz|frequency)|canon.?lock|kurusei|"
    r"malachar|thirteen lords|enarys|seraphim|solfeggio\b",
    re.IGNORECASE,
)


def slugify(text: str, max_len: int = 60) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return (text or "untitled")[:max_len]


def load_conversations(source: Path):
    """Accepts a .zip export, a directory containing conversations.json, or the json file itself."""
    if source.is_file() and source.suffix == ".zip":
        with zipfile.ZipFile(source) as zf:
            names = [n for n in zf.namelist() if n.endswith("conversations.json")]
            if not names:
                raise SystemExit("conversations.json not found inside zip")
            with zf.open(names[0]) as f:
                return json.load(f)
    elif source.is_dir():
        candidate = source / "conversations.json"
        if not candidate.exists():
            found = list(source.rglob("conversations.json"))
            if not found:
                raise SystemExit(f"conversations.json not found under {source}")
            candidate = found[0]
        return json.loads(candidate.read_text(encoding="utf-8"))
    elif source.is_file() and source.suffix == ".json":
        return json.loads(source.read_text(encoding="utf-8"))
    else:
        raise SystemExit(f"Don't know how to read: {source}")


def is_arcanea_relevant(convo: dict) -> bool:
    name = convo.get("name") or ""
    if ARCANEA_HINTS.search(name):
        return True
    for msg in (convo.get("chat_messages") or convo.get("messages") or [])[:6]:
        text = extract_text(msg.get("text") or msg.get("content"))
        if ARCANEA_HINTS.search(text):
            return True
    return False


ARTIFACT_LIKE_KEYS = ("attachments", "files", "artifacts", "artifact", "input", "content")


def extract_text(content_blocks, risk_log=None):
    """Claude export messages can be a plain 'text' field or a list of content blocks.
    Also surfaces anything that looks like an artifact/attachment/tool-use payload
    instead of silently dropping it, and records a note in risk_log if provided."""
    if isinstance(content_blocks, str):
        return content_blocks
    if not isinstance(content_blocks, list):
        return ""
    parts = []
    for block in content_blocks:
        if not isinstance(block, dict):
            continue
        btype = block.get("type")
        if block.get("text"):
            parts.append(block["text"])
            continue
        recovered = False
        for key in ARTIFACT_LIKE_KEYS:
            val = block.get(key)
            if val:
                if isinstance(val, str) and val.strip():
                    parts.append(f"[possible artifact/attachment content -- key='{key}']\n{val}")
                    recovered = True
                elif isinstance(val, (dict, list)):
                    dumped = json.dumps(val, ensure_ascii=False, indent=2)
                    if len(dumped) > 20:
                        parts.append(f"[unrecognized block, key='{key}', type='{btype}' -- raw dump below]\n```json\n{dumped}\n```")
                        recovered = True
        if not recovered and btype and btype != "text":
            if risk_log is not None:
                risk_log.append(f"block type='{btype}' had no extractable text or known key")
    return "\n".join(parts)


def render_conversation(convo: dict, risk_log: list) -> str:
    name = convo.get("name") or "Untitled conversation"
    uuid = convo.get("uuid", "")
    created = convo.get("created_at", "")
    updated = convo.get("updated_at", "")

    lines = [
        "---",
        f'title: "{name.replace(chr(34), chr(39))}"',
        f"uuid: {uuid}",
        f"created: {created}",
        f"updated: {updated}",
        "source: claude.ai export",
        "---",
        "",
        f"# {name}",
        "",
    ]

    messages = convo.get("chat_messages") or convo.get("messages") or []
    for msg in messages:
        sender = msg.get("sender") or msg.get("role") or "unknown"
        speaker = "**Frank**" if sender in ("human", "user") else "**Claude**"

        # Message-level attachments/files (pasted text files, uploaded images, etc.)
        # are a separate structure from content blocks -- render them directly instead
        # of just flagging risk, since verified spot-checks confirmed the export DOES
        # carry the pasted-text content verbatim in an 'extracted_content' field.
        attachment_parts = []
        for key in ("attachments", "files"):
            val = msg.get(key)
            if not val:
                continue
            items = val if isinstance(val, list) else [val]
            for item in items:
                if not isinstance(item, dict):
                    continue
                fname = item.get("file_name", "unknown-file")
                extracted = item.get("extracted_content")
                if extracted:
                    attachment_parts.append(f"[attached file: {fname}]\n```\n{extracted}\n```")
                else:
                    attachment_parts.append(f"[attached file: {fname} -- no extractable text, e.g. an image; verify by hand if relevant]")

        text = extract_text(msg.get("text") or msg.get("content"), risk_log)
        combined = "\n\n".join(p for p in [text.strip(), *attachment_parts] if p)
        if not combined.strip():
            continue
        lines.append(f"{speaker}:")
        lines.append("")
        lines.append(combined)
        lines.append("")

    if risk_log:
        lines.append("---")
        lines.append("")
        lines.append("**ARTIFACT RISK -- this conversation had content this script couldn't confidently classify as plain text:**")
        lines.append("")
        for note in risk_log:
            lines.append(f"- {note}")
        lines.append("")
        lines.append("Verify by opening this chat in a browser and checking the Artifacts panel directly.")
        lines.append("")

    return "\n".join(lines)


def main():
    args = [a for a in sys.argv[1:] if a != "--all"]
    process_all = "--all" in sys.argv
    if len(args) != 1:
        print(__doc__)
        sys.exit(1)

    source = Path(args[0]).expanduser().resolve()
    all_conversations = load_conversations(source)
    if not isinstance(all_conversations, list):
        raise SystemExit("Expected conversations.json to contain a list of conversations")

    if process_all:
        conversations = all_conversations
    else:
        conversations = [c for c in all_conversations if is_arcanea_relevant(c)]
        skipped = len(all_conversations) - len(conversations)
        print(f"Filtered to {len(conversations)} Arcanea-relevant conversations "
              f"(skipped {skipped} non-Arcanea conversations -- use --all to process everything).")

    MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)
    TRIAGE_DIR.mkdir(parents=True, exist_ok=True)

    index_rows = []
    flagged_count = 0
    for convo in conversations:
        uuid = convo.get("uuid", "")
        name = convo.get("name") or "Untitled conversation"
        created = convo.get("created_at", "") or ""
        try:
            month_bucket = created[:7] if created else "undated"
        except Exception:
            month_bucket = "undated"

        out_dir = MARKDOWN_DIR / month_bucket
        out_dir.mkdir(parents=True, exist_ok=True)

        slug = slugify(name)
        uuid8 = uuid[:8] if uuid else "nouuid"
        out_path = out_dir / f"{slug}--{uuid8}.md"

        risk_log = []
        out_path.write_text(render_conversation(convo, risk_log), encoding="utf-8")
        if risk_log:
            flagged_count += 1

        msg_count = len(convo.get("chat_messages") or convo.get("messages") or [])
        index_rows.append((created, month_bucket, name, uuid, uuid8, msg_count,
                            str(out_path.relative_to(ARCHIVE_ROOT)), bool(risk_log)))

    index_rows.sort(key=lambda r: r[0] or "")

    index_lines = [
        "# Chat Archive Index",
        "",
        f"Generated from claude.ai export. {len(index_rows)} conversations, {flagged_count} flagged ARTIFACT RISK.",
        "",
        "ARTIFACT RISK = this script found content it couldn't confidently render as plain",
        "text (a content-block shape not seen elsewhere in this corpus). Verify those by hand",
        "in the browser before trusting this archive as complete for that conversation.",
        "",
        "| Date | Title | UUID | Messages | Artifact risk | File |",
        "|---|---|---|---|---|---|",
    ]
    for created, month_bucket, name, uuid, uuid8, msg_count, rel_path, flagged in index_rows:
        date_str = created[:10] if created else "undated"
        flag = "FLAG" if flagged else ""
        index_lines.append(f"| {date_str} | {name} | `{uuid}` | {msg_count} | {flag} | `{rel_path}` |")

    (TRIAGE_DIR / "INDEX.md").write_text("\n".join(index_lines), encoding="utf-8")

    print(f"Wrote {len(index_rows)} conversation files under {MARKDOWN_DIR}")
    print(f"{flagged_count} conversations flagged ARTIFACT RISK -- check those first.")
    print(f"Index: {TRIAGE_DIR / 'INDEX.md'}")


if __name__ == "__main__":
    main()
