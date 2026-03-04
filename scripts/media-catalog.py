#!/usr/bin/env python3
"""
Arcanea Media Catalog — Intelligent Media Processor
Scans G:\\My Drive\\Arcanea, parses Midjourney/Grok filenames,
deduplicates, generates metadata manifest for Arcanea Content Studio.

Usage (Windows Python — has G: access):
  powershell.exe python C:\\Users\\frank\\Arcanea\\scripts\\media-catalog.py
  powershell.exe python C:\\Users\\frank\\Arcanea\\scripts\\media-catalog.py --sample 20
  powershell.exe python C:\\Users\\frank\\Arcanea\\scripts\\media-catalog.py --rename
"""

import os
import json
import re
import hashlib
import argparse
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional

# ── Canon: Ten Guardians ─────────────────────────────────────────────────────
GUARDIANS = {
    'Lyssandria': {'gate': 'Foundation', 'frequency': 174,  'element': 'Earth',  'godbeast': 'Kaelith',   'colors': ['#8B6914','#6B8E23']},
    'Leyla':      {'gate': 'Flow',       'frequency': 285,  'element': 'Water',  'godbeast': 'Veloura',   'colors': ['#4169E1','#87CEEB']},
    'Draconia':   {'gate': 'Fire',       'frequency': 396,  'element': 'Fire',   'godbeast': 'Draconis',  'colors': ['#FF4500','#FFD700']},
    'Maylinn':    {'gate': 'Heart',      'frequency': 417,  'element': 'Water',  'godbeast': 'Laeylinn',  'colors': ['#FF69B4','#90EE90']},
    'Alera':      {'gate': 'Voice',      'frequency': 528,  'element': 'Wind',   'godbeast': 'Otome',     'colors': ['#87CEEB','#DDA0DD']},
    'Lyria':      {'gate': 'Sight',      'frequency': 639,  'element': 'Arcane', 'godbeast': 'Yumiko',    'colors': ['#9370DB','#191970']},
    'Aiyami':     {'gate': 'Crown',      'frequency': 741,  'element': 'Arcane', 'godbeast': 'Sol',       'colors': ['#FFFFFF','#FFD700']},
    'Elara':      {'gate': 'Shift',      'frequency': 852,  'element': 'Arcane', 'godbeast': 'Vaelith',   'colors': ['#50C878','#40E0D0']},
    'Ino':        {'gate': 'Unity',      'frequency': 963,  'element': 'Arcane', 'godbeast': 'Kyuro',     'colors': ['#FF69B4','#40E0D0']},
    'Shinkami':   {'gate': 'Source',     'frequency': 1111, 'element': 'Arcane', 'godbeast': 'Amaterasu', 'colors': ['#000000','#FFD700']},
}

GODBEAST_TO_GUARDIAN = {info['godbeast']: name for name, info in GUARDIANS.items()}

IMAGE_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.gif'}
VIDEO_EXTS = {'.mp4', '.mov', '.webm', '.avi'}

UUID_PATTERN  = re.compile(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', re.I)
GROK_VID_PAT  = re.compile(r'grok_video_(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})\.mp4', re.I)
GROK_IMG_PAT  = re.compile(r'grok_image_(\d+)\.(jpg|png|webp|jpeg)', re.I)
LV_VID_PAT    = re.compile(r'lv_(\d+)_(\d+)\.mp4', re.I)  # TikTok/Grok lv_ format


# ── Parsing ───────────────────────────────────────────────────────────────────

def parse_midjourney(stem: str) -> dict:
    """frankx77_Description_words_<uuid>  →  {description, source}"""
    s = re.sub(r'^frankx\d+_', '', stem)
    s = UUID_PATTERN.sub('', s).strip('_- ')
    desc = re.sub(r'\s+', ' ', s.replace('_', ' ')).strip()
    return {'description': desc, 'source': 'midjourney'}

def parse_grok(name: str, stem: str) -> dict:
    m = GROK_VID_PAT.match(name)
    if m:
        ts = m.group(1)[:10]
        return {'description': f'Grok video {ts}', 'source': 'grok-video'}
    m = GROK_IMG_PAT.match(name)
    if m:
        return {'description': f'Grok image {m.group(1)}', 'source': 'grok-image'}
    m = LV_VID_PAT.match(name)
    if m:
        return {'description': f'Grok video clip {m.group(1)[-8:]}', 'source': 'grok-video'}
    return {'description': stem.replace('_', ' ').replace('-', ' '), 'source': 'grok'}

def detect_guardian(text: str) -> Optional[str]:
    t = text.lower()
    for g in GUARDIANS:
        if g.lower() in t:
            return g
    for godbeast, guardian in GODBEAST_TO_GUARDIAN.items():
        if godbeast.lower() in t:
            return guardian
    return None

def parse_filename(name: str, stem: str) -> dict:
    if UUID_PATTERN.search(stem) and re.match(r'^frankx', stem, re.I):
        return parse_midjourney(stem)
    if 'grok' in stem.lower() or LV_VID_PAT.match(name):
        return parse_grok(name, stem)
    # Already descriptive
    desc = re.sub(r'[_-]+', ' ', stem).strip()
    return {'description': desc, 'source': 'manual'}


# ── Naming ────────────────────────────────────────────────────────────────────

def slugify(text: str, max_len: int = 40) -> str:
    s = re.sub(r'[^a-z0-9\s]', '', text.lower())
    s = re.sub(r'\s+', '-', s.strip())[:max_len].strip('-')
    return s

def suggest_name(entry: dict, counter: dict) -> str:
    guardian = entry.get('guardian', '')
    prefix   = guardian.lower() if guardian else 'arcanea'
    media    = entry['type']
    ext      = '.webp' if media == 'image' else entry['extension']
    slug     = slugify(entry.get('scene', '')[:60])
    key      = f"{prefix}-{media}"
    counter[key] = counter.get(key, 0) + 1
    n = str(counter[key]).zfill(3)
    if slug:
        return f"{prefix}-{slug}-{n}{ext}"
    return f"{prefix}-{media}-{n}{ext}"


# ── Tagging ───────────────────────────────────────────────────────────────────

def auto_tags(entry: dict) -> list:
    tags = set()
    guardian = entry.get('guardian')
    if guardian:
        info = GUARDIANS[guardian]
        tags |= {
            f'guardian:{guardian.lower()}',
            f'gate:{info["gate"].lower()}',
            f'element:{info["element"].lower()}',
            f'hz:{info["frequency"]}',
            f'godbeast:{info["godbeast"].lower()}',
        }
    source = entry.get('source', '')
    if source: tags.add(f'source:{source}')
    tags.add(f'type:{entry["type"]}')

    folder = entry.get('folder', '').lower()
    scene  = entry.get('scene',  '').lower()
    combined = folder + ' ' + scene

    if 'logo'    in combined: tags.add('category:logo')
    if 'band'    in combined: tags.add('category:music')
    if 'sexy'    in combined or 'capcut' in combined: tags.add('category:social')
    if 'portrait' in combined or 'face' in combined: tags.add('style:portrait')
    if any(w in combined for w in ['dragon','godbeast','beast','creature','serpent']):
        tags.add('content:godbeast')
    if any(w in combined for w in ['battle','armor','warrior','fight']):
        tags.add('content:action')
    if any(w in combined for w in ['embrace','love','tender','gentle','lovingly']):
        tags.add('content:emotional')
    if any(w in combined for w in ['community','group','together','crowd','roaming']):
        tags.add('content:world-building')
    if any(w in combined for w in ['tree','forest','earth','wooden','goddess','nature']):
        tags.add('content:nature')
    if 'academy' in combined or 'school' in combined:
        tags.add('category:academy')
    if any(w in combined for w in ['grok video','2026']):
        tags.add('campaign:2026')

    return sorted(tags)


# ── Hash ──────────────────────────────────────────────────────────────────────

def fast_hash(path: Path, sample: int = 131072) -> str:
    h = hashlib.md5()
    h.update(str(path.stat().st_size).encode())
    try:
        with open(path, 'rb') as f:
            h.update(f.read(sample))
    except (IOError, PermissionError):
        pass
    return h.hexdigest()[:16]


# ── Scanner ───────────────────────────────────────────────────────────────────

def scan(root: Path, sample: int = 0) -> list:
    entries  = []
    hash_map = {}
    counter  = {}
    total    = 0

    for file_path in sorted(root.rglob('*')):
        if not file_path.is_file():
            continue
        ext = file_path.suffix.lower()
        if ext not in IMAGE_EXTS and ext not in VIDEO_EXTS:
            continue

        total += 1
        if total % 50 == 0:
            print(f"  Scanned {total} files...", end='\r')

        stat = file_path.stat()
        rel  = file_path.relative_to(root)
        folder = str(rel.parts[0]) if len(rel.parts) > 1 else 'root'

        # Folder sample limit for testing
        if sample and entries.count(lambda e: e['folder'] == folder) >= sample:
            continue

        name   = file_path.name
        stem   = file_path.stem
        mtype  = 'image' if ext in IMAGE_EXTS else 'video'
        parsed = parse_filename(name, stem)

        guardian = detect_guardian(stem) or detect_guardian(folder)
        fhash    = fast_hash(file_path)
        dup_of   = hash_map.get(fhash)
        if not dup_of:
            hash_map[fhash] = str(file_path)

        entry = {
            'id':            fhash,
            'original_path': str(file_path),
            'original_name': name,
            'type':          mtype,
            'extension':     ext,
            'size_bytes':    stat.st_size,
            'size_mb':       round(stat.st_size / 1_048_576, 2),
            'folder':        folder,
            'guardian':      guardian,
            'gate':          GUARDIANS[guardian]['gate']      if guardian else None,
            'element':       GUARDIANS[guardian]['element']   if guardian else None,
            'frequency_hz':  GUARDIANS[guardian]['frequency'] if guardian else None,
            'godbeast':      GUARDIANS[guardian]['godbeast']  if guardian else None,
            'source':        parsed['source'],
            'scene':         parsed['description'],
            'status':        'review',      # review | approved | archived
            'quality_tier':  None,          # 1=hero | 2=gallery | 3=archive
            'duplicate_of':  dup_of,
            'tags':          [],
            'notes':         '',
            'suggested_name': '',
        }
        entry['suggested_name'] = suggest_name(entry, counter)
        entry['tags']           = auto_tags(entry)
        entries.append(entry)

    print(f"  Scanned {total} files total.           ")
    return entries


# ── Rename (optional) ─────────────────────────────────────────────────────────

def apply_renames(entries: list, dry_run: bool = True):
    output_root = Path('G:/My Drive/Arcanea/_Curated')
    print(f"\n{'[DRY RUN] ' if dry_run else ''}Renaming to: {output_root}\n")
    approved = [e for e in entries if e['status'] == 'approved' and not e['duplicate_of']]
    for e in approved:
        src  = Path(e['original_path'])
        dest = output_root / e.get('guardian', 'Unassigned') / e['suggested_name']
        print(f"  {src.name[:50]:50s}  →  {e['suggested_name']}")
        if not dry_run:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)
    print(f"\nTotal: {len(approved)} approved files")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Arcanea Media Catalog')
    parser.add_argument('--root',    default=r'G:\My Drive\Arcanea',
                        help='Root path to scan (default: G:\\My Drive\\Arcanea)')
    parser.add_argument('--output',  default=r'G:\My Drive\Arcanea\arcanea-manifest.json',
                        help='Output JSON manifest path')
    parser.add_argument('--sample',  type=int, default=0,
                        help='Limit files per folder for testing (0=all)')
    parser.add_argument('--rename',  action='store_true',
                        help='Copy approved files with new names to _Curated folder')
    parser.add_argument('--dry-run', action='store_true', default=True,
                        help='Preview renames without copying (default: True)')
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"ERROR: Path not found: {root}")
        print("Make sure Google Drive is mounted as G: on Windows")
        return 1

    print("=" * 64)
    print("  ARCANEA MEDIA CATALOG")
    print(f"  Root:   {root}")
    print(f"  Output: {args.output}")
    print("=" * 64)

    entries = scan(root, sample=args.sample)

    duplicates = [e for e in entries if e['duplicate_of']]
    by_guardian = {}
    by_type = {}
    for e in entries:
        g = e.get('guardian') or 'Unassigned'
        by_guardian[g] = by_guardian.get(g, 0) + 1
        by_type[e['type']] = by_type.get(e['type'], 0) + 1

    manifest = {
        'generated':     datetime.now().isoformat(),
        'root_path':     str(root),
        'total_files':   len(entries),
        'total_size_mb': round(sum(e['size_mb'] for e in entries), 1),
        'duplicates':    len(duplicates),
        'by_type':       by_type,
        'by_guardian':   dict(sorted(by_guardian.items(), key=lambda x: -x[1])),
        'media':         entries,
    }

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"\n  Results:")
    print(f"  Total files   : {len(entries)}")
    print(f"  Total size    : {manifest['total_size_mb']} MB")
    print(f"  Duplicates    : {len(duplicates)}")
    print(f"  By type       : {by_type}")
    print(f"  By Guardian:")
    for g, count in manifest['by_guardian'].items():
        bar = '#' * min(count, 30)
        print(f"    {g:<14} {count:>3}  {bar}")
    print(f"\n  Manifest saved: {out}")

    if args.rename:
        apply_renames(entries, dry_run=args.dry_run)

    return 0

if __name__ == '__main__':
    exit(main())
