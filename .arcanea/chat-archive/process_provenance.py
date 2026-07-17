#!/usr/bin/env python3
"""
process_provenance.py -- Separate "what Frank actually said/ruled" from "what Claude
asserted and Frank may or may not have validated," across a claude.ai data export.

Heuristic triage layer, not a ground-truth oracle. Keyword/pattern matching, not
semantic understanding. Treat output as "read these N spots first," not verified fact.

Usage:
    python3 process_provenance.py /path/to/data-export.zip
    python3 process_provenance.py /path/to/conversations.json

Output (per Arcanea-relevant conversation):
    provenance/<YYYY-MM>/<slug>--<uuid8>__PROMPTS.md
    provenance/<YYYY-MM>/<slug>--<uuid8>__ASSERTIONS.md
    provenance/INDEX.md
"""

import json
import re
import sys
import zipfile
from pathlib import Path

ARCHIVE_ROOT = Path(__file__).resolve().parent
PROVENANCE_DIR = ARCHIVE_ROOT / "provenance"

ARCANEA_HINTS = re.compile(
    r"\barcanea|luminor|guardian|vel'?tara|shinkami|gate.?(hz|frequency)|canon.?lock|kurusei|"
    r"malachar|thirteen lords|enarys|seraphim|solfeggio\b",
    re.IGNORECASE,
)

ASSERTION_PATTERNS = re.compile(
    r"\b(locked|canon(?:ical)?|decided|resolved|final(?:ized)?|ruling|"
    r"i'?ll (?:build|go with|use|lock)|going with|settle(?:d)? on|"
    r"the (?:answer|call) is|so:? (?:the )?canon is)\b",
    re.IGNORECASE,
)

CONFIRM_PATTERNS = re.compile(
    r"^\s*(yes|yep|yeah|correct|confirmed|agreed|do that|ship it|lock it|good|perfect|"
    r"exactly|that works|approved|go ahead|sounds good)\b",
    re.IGNORECASE,
)

PUSHBACK_PATTERNS = re.compile(
    r"^\s*(no|nope|wait|actually|hold on|that'?s wrong|reconsider|why|hmm|not quite|"
    r"i disagree|change (?:it|that))\b",
    re.IGNORECASE,
)


def slugify(text, max_len=60):
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return (text or "untitled")[:max_len]


def load_conversations(source: Path):
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


def extract_text(content_blocks):
    if isinstance(content_blocks, str):
        return content_blocks
    if not isinstance(content_blocks, list):
        return ""
    parts = []
    for block in content_blocks:
        if isinstance(block, dict) and block.get("text"):
            parts.append(block["text"])
    return "\n".join(parts)


def is_arcanea_relevant(convo):
    name = convo.get("name") or ""
    if ARCANEA_HINTS.search(name):
        return True
    for msg in (convo.get("chat_messages") or convo.get("messages") or [])[:6]:
        text = extract_text(msg.get("text") or msg.get("content"))
        if ARCANEA_HINTS.search(text):
            return True
    return False


def split_into_sentences_for_assertions(text):
    return re.split(r"(?<=[.!?])\s+", text)


def find_assertions(text):
    hits = []
    for sentence in split_into_sentences_for_assertions(text):
        if ASSERTION_PATTERNS.search(sentence):
            hits.append(sentence.strip())
    return hits


def classify_next_human(next_human_text):
    if not next_human_text or not next_human_text.strip():
        return "NO-RESPONSE"
    stripped = next_human_text.strip()
    if CONFIRM_PATTERNS.search(stripped):
        return "CONFIRMED"
    if PUSHBACK_PATTERNS.search(stripped):
        return "PUSHED-BACK"
    return "UNCLEAR"


def process_conversation(convo):
    messages = convo.get("chat_messages") or convo.get("messages") or []
    human_turns = []
    assertions = []

    for i, msg in enumerate(messages):
        sender = msg.get("sender") or msg.get("role") or "unknown"
        text = extract_text(msg.get("text") or msg.get("content")).strip()
        if not text:
            continue
        if sender in ("human", "user"):
            human_turns.append((i, text))
        else:
            hits = find_assertions(text)
            if hits:
                next_human_text = ""
                for j in range(i + 1, len(messages)):
                    s2 = messages[j].get("sender") or messages[j].get("role") or ""
                    if s2 in ("human", "user"):
                        next_human_text = extract_text(messages[j].get("text") or messages[j].get("content"))
                        break
                for sentence in hits:
                    assertions.append({
                        "assistant_index": i,
                        "sentence": sentence,
                        "next_human_text": next_human_text.strip()[:300],
                        "verdict": classify_next_human(next_human_text),
                    })

    return human_turns, assertions


def render_prompts(convo, human_turns):
    name = convo.get("name") or "Untitled conversation"
    lines = [
        f"# Frank's prompts -- {name}",
        "",
        f"Source uuid: {convo.get('uuid','')}",
        f"Created: {convo.get('created_at','')}",
        "",
        "Verbatim, chronological.",
        "",
    ]
    for i, text in human_turns:
        lines.append(f"## Turn {i}")
        lines.append("")
        lines.append(text)
        lines.append("")
    return "\n".join(lines)


def render_assertions(convo, assertions):
    name = convo.get("name") or "Untitled conversation"
    lines = [
        f"# Claude's canon assertions -- {name}",
        "",
        f"Source uuid: {convo.get('uuid','')}",
        "",
        "CONFIRMED = Frank's next message reads as explicit approval. PUSHED-BACK = reads "
        "as disagreement. UNCLEAR/NO-RESPONSE = no clean signal -- treat as OPEN, not LOCKED.",
        "",
        "| Verdict | Claude said | Frank's next message |",
        "|---|---|---|",
    ]
    for a in assertions:
        sentence = a["sentence"].replace("|", "\\|").replace("\n", " ")[:200]
        next_text = (a["next_human_text"] or "(none)").replace("|", "\\|").replace("\n", " ")
        lines.append(f"| {a['verdict']} | {sentence} | {next_text} |")
    return "\n".join(lines)


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    source = Path(sys.argv[1]).expanduser().resolve()
    conversations = load_conversations(source)
    if not isinstance(conversations, list):
        raise SystemExit("Expected conversations.json to contain a list of conversations")

    PROVENANCE_DIR.mkdir(parents=True, exist_ok=True)

    index_rows = []
    relevant_count = 0

    for convo in conversations:
        if not is_arcanea_relevant(convo):
            continue
        relevant_count += 1

        uuid = convo.get("uuid", "")
        name = convo.get("name") or "Untitled conversation"
        created = convo.get("created_at", "") or ""
        month_bucket = created[:7] if created else "undated"
        out_dir = PROVENANCE_DIR / month_bucket
        out_dir.mkdir(parents=True, exist_ok=True)

        slug = slugify(name)
        uuid8 = uuid[:8] if uuid else "nouuid"

        human_turns, assertions = process_conversation(convo)

        prompts_path = out_dir / f"{slug}--{uuid8}__PROMPTS.md"
        prompts_path.write_text(render_prompts(convo, human_turns), encoding="utf-8")

        assertions_path = out_dir / f"{slug}--{uuid8}__ASSERTIONS.md"
        assertions_path.write_text(render_assertions(convo, assertions), encoding="utf-8")

        confirmed = sum(1 for a in assertions if a["verdict"] == "CONFIRMED")
        pushed_back = sum(1 for a in assertions if a["verdict"] == "PUSHED-BACK")
        unclear = sum(1 for a in assertions if a["verdict"] in ("UNCLEAR", "NO-RESPONSE"))

        index_rows.append((created, name, len(human_turns), len(assertions), confirmed, pushed_back, unclear,
                            str(prompts_path.relative_to(PROVENANCE_DIR)),
                            str(assertions_path.relative_to(PROVENANCE_DIR))))

    index_rows.sort(key=lambda r: r[0] or "")

    index_lines = [
        "# Provenance Index",
        "",
        f"{relevant_count} Arcanea-relevant conversations out of {len(conversations)} total in the export.",
        "",
        "Sort by UNCLEAR count descending to triage the riskiest conversations first.",
        "",
        "| Date | Title | Frank turns | Assertions | Confirmed | Pushed back | Unclear/none |",
        "|---|---|---|---|---|---|---|",
    ]
    for created, name, n_human, n_assert, confirmed, pushed_back, unclear, prompts_rel, assertions_rel in index_rows:
        date_str = created[:10] if created else "undated"
        index_lines.append(
            f"| {date_str} | [{name}]({prompts_rel}) | {n_human} | {n_assert} | {confirmed} | {pushed_back} | {unclear} |"
        )

    (PROVENANCE_DIR / "INDEX.md").write_text("\n".join(index_lines), encoding="utf-8")

    total_unclear = sum(r[6] for r in index_rows)
    print(f"Processed {relevant_count} Arcanea-relevant conversations.")
    print(f"Total assertions with unclear/no validation: {total_unclear}")
    print(f"Index: {PROVENANCE_DIR / 'INDEX.md'}")


if __name__ == "__main__":
    main()
