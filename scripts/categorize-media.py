#!/usr/bin/env python3
"""
Arcanea Media Categorization Engine

Takes a manifest JSON (from the inventory agent) and auto-categorizes
each file against the Arcanea canon taxonomy. Outputs enriched manifest.

Usage:
    python categorize-media.py manifest.json > categorized-manifest.json
    python categorize-media.py manifest.json --stats  # print stats only
    python categorize-media.py manifest.json --dry-run  # preview without writing
"""

import json
import sys
import re
from pathlib import Path
from collections import Counter, defaultdict
from typing import Optional

# ─── ARCANEA CANON TAXONOMY ──────────────────────────────────────────

GUARDIANS = {
    "lyssandria": {"gate": "Foundation", "element": "Earth", "freq": 174, "godbeast": "Kaelith",
                   "aliases": ["lyssandria", "lyss"], "colors": ["green", "brown", "stone"]},
    "leyla":      {"gate": "Flow", "element": "Water", "freq": 285, "godbeast": "Veloura",
                   "aliases": ["leyla"], "colors": ["blue", "silver", "crystal"]},
    "draconia":   {"gate": "Fire", "element": "Fire", "freq": 396, "godbeast": "Draconis",
                   "aliases": ["draconia", "draco"], "colors": ["red", "orange", "gold"]},
    "maylinn":    {"gate": "Heart", "element": "Water", "freq": 417, "godbeast": "Laeylinn",
                   "aliases": ["maylinn", "may"], "colors": ["pink", "rose", "green"]},
    "alera":      {"gate": "Voice", "element": "Wind", "freq": 528, "godbeast": "Otome",
                   "aliases": ["alera"], "colors": ["white", "silver", "teal"]},
    "lyria":      {"gate": "Sight", "element": "Spirit", "freq": 639, "godbeast": "Yumiko",
                   "aliases": ["lyria"], "colors": ["purple", "indigo", "violet"]},
    "aiyami":     {"gate": "Crown", "element": "Fire", "freq": 741, "godbeast": "Sol",
                   "aliases": ["aiyami"], "colors": ["gold", "white", "radiant"]},
    "elara":      {"gate": "Shift", "element": "Wind", "freq": 852, "godbeast": "Vaelith",
                   "aliases": ["elara", "thessara"], "colors": ["silver", "aurora"]},
    "ino":        {"gate": "Unity", "element": "All", "freq": 963, "godbeast": "Kyuro",
                   "aliases": ["ino"], "colors": ["rainbow", "iridescent"]},
    "shinkami":   {"gate": "Source", "element": "Spirit", "freq": 1111, "godbeast": "Amaterasu",
                   "aliases": ["shinkami", "shin"], "colors": ["gold", "white", "cosmic"]},
}

GODBEASTS = {g["godbeast"].lower(): name for name, g in GUARDIANS.items()}

ELEMENTS = {
    "fire":  {"aliases": ["fire", "flame", "pyro", "blaze", "inferno", "ember"], "house": "Pyros"},
    "water": {"aliases": ["water", "aqua", "ocean", "sea", "wave", "flow", "river", "rain"], "house": "Aqualis"},
    "earth": {"aliases": ["earth", "terra", "stone", "ground", "mountain", "crystal", "rock"], "house": "Terra"},
    "wind":  {"aliases": ["wind", "air", "ventus", "breeze", "storm", "sky", "cloud"], "house": "Ventus"},
    "void":  {"aliases": ["void", "shadow", "dark", "nero", "abyss", "night"], "house": "Nero"},
    "spirit":{"aliases": ["spirit", "light", "lumina", "glow", "radiant", "holy", "divine", "celestial"], "house": "Lumina"},
}

HOUSES = {e["house"].lower(): elem for elem, e in ELEMENTS.items()}

CONTENT_TYPE_PATTERNS = {
    "logo":         [r"logo", r"emblem", r"crest", r"seal", r"badge"],
    "banner":       [r"banner", r"header", r"cover", r"hero"],
    "character_art": [r"character", r"portrait", r"avatar", r"face", r"goddess", r"god\b", r"guardian"],
    "godbeast_art": [r"godbeast", r"beast", r"creature", r"dragon", r"phoenix", r"serpent", r"deer"],
    "concept_art":  [r"concept", r"sketch", r"draft", r"wip"],
    "thumbnail":    [r"thumb", r"thumbnail", r"preview", r"card"],
    "icon":         [r"icon", r"symbol", r"glyph"],
    "promo_video":  [r"promo", r"trailer", r"teaser", r"commercial", r"ad\b"],
    "music_video":  [r"music", r"mv\b", r"lyric", r"song"],
    "social_clip":  [r"reel", r"tiktok", r"short", r"clip", r"story", r"capcut"],
    "animation":    [r"anim", r"motion", r"loop", r"gif"],
    "meme":         [r"meme", r"funny", r"joke"],
    "photo":        [r"photo", r"selfie", r"irl"],
    "background":   [r"bg\b", r"background", r"wallpaper", r"landscape", r"scene"],
    "audio":        [r"\.mp3$", r"\.wav$", r"\.flac$", r"\.ogg$", r"\.m4a$"],
}

FOLDER_HINTS = {
    "draconia":       {"guardian": "draconia", "element": "Fire"},
    "alera":          {"guardian": "alera", "element": "Wind"},
    "arcanea capcut sexy": {"content_type": "social_clip", "tags": ["sexy", "capcut"]},
    "arcanea 2026":   {"tags": ["2026", "grok"]},
    "arcanea band":   {"content_type": "music_video", "tags": ["band", "music"]},
    "arcanea logo":   {"content_type": "logo"},
    "arcanea music":  {"tags": ["music", "audio"]},
    "arcanea lore":   {"tags": ["lore", "narrative"]},
}

VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp", ".tiff", ".avif"}


def match_guardian(text: str) -> Optional[str]:
    text_lower = text.lower()
    for name, data in GUARDIANS.items():
        for alias in data["aliases"]:
            if re.search(rf'\b{re.escape(alias)}\b', text_lower):
                return name
    for beast_lower, guardian_name in GODBEASTS.items():
        if re.search(rf'\b{re.escape(beast_lower)}\b', text_lower):
            return guardian_name
    return None


def match_element(text: str) -> Optional[str]:
    text_lower = text.lower()
    for elem, data in ELEMENTS.items():
        for alias in data["aliases"]:
            if re.search(rf'\b{re.escape(alias)}\b', text_lower):
                return elem
    return None


def detect_content_type(filename: str, folder: str, ext: str) -> str:
    combined = f"{folder} {filename}".lower()
    if ext in AUDIO_EXTENSIONS:
        return "audio"
    for ctype, patterns in CONTENT_TYPE_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, combined):
                return ctype
    if ext in VIDEO_EXTENSIONS:
        return "promo_video"
    return "other"


def determine_usage_tier(content_type: str, size_bytes: int, folder: str) -> str:
    if content_type in ("logo", "banner"):
        return "hero"
    if content_type in ("thumbnail", "icon"):
        return "social"
    if content_type in ("social_clip",):
        return "social"
    if content_type in ("promo_video", "trailer"):
        return "hero" if size_bytes > 10_000_000 else "gallery"
    if content_type in ("concept_art", "meme", "photo"):
        return "archive"
    if "raw" in folder.lower() or "draft" in folder.lower():
        return "raw"
    return "gallery"


def determine_storage_tier(ext: str, size_bytes: int, usage_tier: str, content_type: str) -> str:
    if ext in VIDEO_EXTENSIONS or ext in AUDIO_EXTENSIONS or size_bytes > 2_000_000:
        return "r2"
    if content_type in ("thumbnail", "icon", "logo", "banner") and size_bytes <= 2_000_000:
        return "vercel_blob"
    if usage_tier in ("hero", "social") and ext in IMAGE_EXTENSIONS and size_bytes <= 2_000_000:
        return "vercel_blob"
    return "r2"


def categorize_file(file_entry: dict) -> dict:
    filename = file_entry.get("filename", "")
    folder = file_entry.get("folder", "__root__")
    ext = file_entry.get("extension", "").lower()
    size = file_entry.get("size_bytes", 0)
    rel_path = file_entry.get("relative_path", "")
    search_text = f"{rel_path} {filename} {folder}"

    # Match canon entities
    guardian = match_guardian(search_text)
    element = match_element(search_text)

    # Folder hints override
    folder_key = folder.lower().strip()
    hints = FOLDER_HINTS.get(folder_key, {})
    if not guardian and "guardian" in hints:
        guardian = hints["guardian"]
    if not element and "element" in hints:
        element = hints["element"]

    # Derive element from guardian if not matched directly
    if guardian and not element:
        element = GUARDIANS[guardian]["element"].lower()

    # Content type
    content_type = hints.get("content_type", detect_content_type(filename, folder, ext))

    # Usage tier
    usage_tier = determine_usage_tier(content_type, size, folder)

    # Storage tier
    storage_tier = determine_storage_tier(ext, size, usage_tier, content_type)

    # Tags
    tags = list(hints.get("tags", []))
    if guardian:
        g = GUARDIANS[guardian]
        tags.extend([guardian, g["godbeast"].lower(), f"{g['freq']}hz"])
    if element:
        tags.append(element)
    if ext in VIDEO_EXTENSIONS:
        tags.append("video")
    elif ext in IMAGE_EXTENSIONS:
        tags.append("image")
    elif ext in AUDIO_EXTENSIONS:
        tags.append("audio")
    tags = sorted(set(tags))

    # Build categories
    categories = {
        "content_type": content_type,
        "usage_tier": usage_tier,
        "tags": tags,
    }
    if guardian:
        categories["guardian"] = guardian
        categories["godbeast"] = GUARDIANS[guardian]["godbeast"]
        categories["gate"] = GUARDIANS[guardian]["gate"]
    if element:
        categories["element"] = element
        if element in ELEMENTS:
            categories["house"] = ELEMENTS[element]["house"]

    file_entry["categories"] = categories
    file_entry["storage"] = {"tier": storage_tier}
    return file_entry


def print_stats(manifest: dict):
    files = manifest.get("files", [])
    print(f"\n{'='*60}")
    print(f"ARCANEA MEDIA CATEGORIZATION REPORT")
    print(f"{'='*60}")
    print(f"Total files: {len(files)}")
    print(f"Total size: {sum(f.get('size_bytes', 0) for f in files) / 1_000_000:.1f} MB")

    # By guardian
    guardian_counts = Counter(f["categories"].get("guardian", "unmatched") for f in files)
    print(f"\n--- By Guardian ---")
    for g, c in guardian_counts.most_common():
        print(f"  {g:20s} {c:5d}")

    # By element
    elem_counts = Counter(f["categories"].get("element", "unmatched") for f in files)
    print(f"\n--- By Element ---")
    for e, c in elem_counts.most_common():
        print(f"  {e:20s} {c:5d}")

    # By content type
    type_counts = Counter(f["categories"]["content_type"] for f in files)
    print(f"\n--- By Content Type ---")
    for t, c in type_counts.most_common():
        print(f"  {t:20s} {c:5d}")

    # By usage tier
    tier_counts = Counter(f["categories"]["usage_tier"] for f in files)
    print(f"\n--- By Usage Tier ---")
    for t, c in tier_counts.most_common():
        print(f"  {t:20s} {c:5d}")

    # By storage tier
    storage_counts = Counter(f["storage"]["tier"] for f in files)
    storage_sizes = defaultdict(int)
    for f in files:
        storage_sizes[f["storage"]["tier"]] += f.get("size_bytes", 0)
    print(f"\n--- By Storage Tier ---")
    for t, c in storage_counts.most_common():
        mb = storage_sizes[t] / 1_000_000
        print(f"  {t:20s} {c:5d} files, {mb:8.1f} MB")

    print(f"\n{'='*60}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python categorize-media.py <manifest.json> [--stats] [--dry-run]", file=sys.stderr)
        sys.exit(1)

    manifest_path = sys.argv[1]
    show_stats = "--stats" in sys.argv
    dry_run = "--dry-run" in sys.argv

    with open(manifest_path) as f:
        manifest = json.load(f)

    # Categorize each file
    for file_entry in manifest.get("files", []):
        categorize_file(file_entry)

    if show_stats or dry_run:
        print_stats(manifest)

    if not dry_run:
        if not show_stats:
            json.dump(manifest, sys.stdout, indent=2)
        else:
            # Write to file alongside input
            out_path = manifest_path.replace(".json", "-categorized.json")
            with open(out_path, "w") as f:
                json.dump(manifest, f, indent=2)
            print(f"\nWritten to: {out_path}")


if __name__ == "__main__":
    main()
