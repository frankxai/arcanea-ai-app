# Arcanea Media Processor -- Windows Python script
# Reads manifest, converts all images to WebP, generates thumbnails,
# extracts video thumbnails via FFmpeg.
#
# Run: python media-process.py
#      python media-process.py --approved-only
#      python media-process.py --guardian Draconia

import sys
import os
import json
import argparse
import shutil
import subprocess
from pathlib import Path
from datetime import datetime

# ── Config ────────────────────────────────────────────────────────────────────
FFMPEG = r"C:\ProgramData\chocolatey\bin\ffmpeg.exe"
MANIFEST = Path(r"C:\Users\frank\arcanea-manifest.json")
OUTPUT = Path(r"C:\Users\frank\arcanea-processed")
THUMBS = OUTPUT / "_thumbnails"

IMG_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".bmp"}
VID_EXTS = {".mp4", ".mov", ".webm", ".avi", ".mkv"}

# ── Pillow ────────────────────────────────────────────────────────────────────
try:
    from PIL import Image

    PIL_OK = True
except ImportError:
    PIL_OK = False
    print("ERROR: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)


# ── Load manifest ─────────────────────────────────────────────────────────────
def load_manifest():
    if not MANIFEST.exists():
        print(f"No manifest at {MANIFEST}")
        print("Run PowerShell catalog first:")
        print(r"  powershell -File C:\Users\frank\Arcanea\scripts\media-catalog.ps1")
        sys.exit(1)
    with open(MANIFEST, encoding="utf-8-sig") as f:
        return json.load(f)


def save_manifest(data):
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ── Image processing ──────────────────────────────────────────────────────────
def process_image(
    src: Path,
    dest_dir: Path,
    thumb_dir: Path,
    suggested_name: str,
    quality: int = 85,
    max_width: int = 2400,
):
    dest_dir.mkdir(parents=True, exist_ok=True)
    thumb_dir.mkdir(parents=True, exist_ok=True)

    # Main WebP
    webp_name = Path(suggested_name).with_suffix(".webp").name
    webp_path = dest_dir / webp_name
    thumb_path = thumb_dir / (Path(suggested_name).stem + "-thumb.webp")

    try:
        with Image.open(src) as img:
            # Handle RGBA → RGB for JPEG-derived
            if img.mode in ("RGBA", "LA", "P"):
                bg = Image.new("RGB", img.size, (0, 0, 0))
                if img.mode == "P":
                    img = img.convert("RGBA")
                bg.paste(
                    img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None
                )
                img = bg
            elif img.mode != "RGB":
                img = img.convert("RGB")

            w, h = img.size
            if w > max_width:
                ratio = max_width / w
                img = img.resize((max_width, int(h * ratio)), Image.LANCZOS)

            img.save(str(webp_path), "WEBP", quality=quality, method=6)
            orig_size = src.stat().st_size
            new_size = webp_path.stat().st_size
            saved_pct = int((1 - new_size / orig_size) * 100) if orig_size else 0

            # Thumbnail 320x320 cover
            tw, th = img.size
            side = min(tw, th)
            left = (tw - side) // 2
            top = (th - side) // 2
            thumb_img = img.crop((left, top, left + side, top + side))
            thumb_img = thumb_img.resize((320, 320), Image.LANCZOS)
            thumb_img.save(str(thumb_path), "WEBP", quality=70)

            return {
                "ok": True,
                "webp_path": str(webp_path),
                "thumb_path": str(thumb_path),
                "saved_pct": saved_pct,
                "orig_kb": orig_size // 1024,
                "new_kb": new_size // 1024,
            }
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ── Video thumbnail ───────────────────────────────────────────────────────────
def video_thumbnail(src: Path, thumb_dir: Path, suggested_name: str):
    thumb_dir.mkdir(parents=True, exist_ok=True)
    thumb_name = Path(suggested_name).with_suffix("").name + "-thumb.jpg"
    thumb_path = thumb_dir / thumb_name

    if not Path(FFMPEG).exists():
        return {"ok": False, "error": f"FFmpeg not found at {FFMPEG}"}

    try:
        cmd = [
            FFMPEG,
            "-y",
            "-ss",
            "00:00:02",  # 2 seconds in
            "-i",
            str(src),
            "-vframes",
            "1",
            "-vf",
            "scale=320:-2",
            str(thumb_path),
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=30)
        if result.returncode == 0 and thumb_path.exists():
            return {"ok": True, "thumb_path": str(thumb_path)}
        else:
            return {"ok": False, "error": result.stderr.decode()[-200:]}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "FFmpeg timeout"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Arcanea Media Processor")
    parser.add_argument(
        "--approved-only", action="store_true", help="Only process approved entries"
    )
    parser.add_argument(
        "--guardian", help="Only process entries for a specific Guardian"
    )
    parser.add_argument(
        "--type", choices=["image", "video"], help="Only process images or videos"
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        default=True,
        help="Skip already-processed files",
    )
    parser.add_argument("--quality", type=int, default=85, help="WebP quality 0-100")
    parser.add_argument(
        "--max-width", type=int, default=2400, help="Max image width px"
    )
    args = parser.parse_args()

    print("=" * 64)
    print("  ARCANEA MEDIA PROCESSOR")
    print(f"  FFmpeg: {FFMPEG}")
    print(f"  Output: {OUTPUT}")
    print("=" * 64)

    # Verify FFmpeg
    if Path(FFMPEG).exists():
        print(f"  FFmpeg v8: OK")
    else:
        print(f"  WARNING: FFmpeg not found at {FFMPEG}")

    data = load_manifest()
    entries = data.get("media", [])
    print(f"  Manifest: {len(entries)} entries loaded")

    # Filter
    to_process = entries
    if args.approved_only:
        to_process = [e for e in to_process if e.get("status") == "approved"]
        print(f"  Filtering to approved: {len(to_process)}")
    if args.guardian:
        to_process = [
            e
            for e in to_process
            if (e.get("guardian") or "").lower() == args.guardian.lower()
        ]
        print(f"  Filtering to guardian {args.guardian}: {len(to_process)}")
    if args.type:
        to_process = [e for e in to_process if e.get("type") == args.type]
        print(f"  Filtering to {args.type}: {len(to_process)}")

    # Skip duplicates
    to_process = [e for e in to_process if not e.get("duplicate_of")]
    print(f"  (Skipping duplicates: {len(entries) - len(to_process)} excluded)")
    print(f"  Processing: {len(to_process)} files")
    print()

    OUTPUT.mkdir(parents=True, exist_ok=True)
    THUMBS.mkdir(parents=True, exist_ok=True)

    ok_count = err_count = skip_count = 0
    total_saved_kb = 0
    start = datetime.now()

    for i, entry in enumerate(to_process):
        src_path = Path(entry.get("original_path", ""))
        guardian = entry.get("guardian") or "Unassigned"
        sname = entry.get("suggested_name") or entry.get("original_name", "unknown")
        mtype = entry.get("type", "image")
        eid = entry.get("id", "")

        dest_dir = OUTPUT / guardian
        thumb_dir = THUMBS / guardian

        # Progress line - use ASCII for Windows compatibility
        pct = int((i + 1) / len(to_process) * 100)
        bar = ("#" * (pct // 5)).ljust(20)
        print(
            f"\r  [{bar}] {pct:3d}%  {i + 1}/{len(to_process)}  {sname[:45]:<45}",
            end="",
            flush=True,
        )

        if not src_path.exists():
            err_count += 1
            continue

        if mtype == "image":
            ext = src_path.suffix.lower()
            if ext not in IMG_EXTS:
                skip_count += 1
                continue

            # Skip if already processed
            webp_dest = dest_dir / Path(sname).with_suffix(".webp").name
            if args.skip_existing and webp_dest.exists():
                skip_count += 1
                continue

            result = process_image(
                src_path,
                dest_dir,
                thumb_dir,
                sname,
                quality=args.quality,
                max_width=args.max_width,
            )
            if result["ok"]:
                ok_count += 1
                total_saved_kb += (
                    result.get("saved_pct", 0) * result.get("orig_kb", 0) // 100
                )
                # Update manifest entry
                for e in data["media"]:
                    if e.get("id") == eid:
                        e["webp_path"] = result["webp_path"]
                        e["thumbnail_path"] = result["thumb_path"]
                        break
            else:
                err_count += 1

        elif mtype == "video":
            if not Path(FFMPEG).exists():
                skip_count += 1
                continue
            result = video_thumbnail(src_path, thumb_dir, sname)
            if result["ok"]:
                ok_count += 1
                for e in data["media"]:
                    if e.get("id") == eid:
                        e["thumbnail_path"] = result["thumb_path"]
                        break
            else:
                err_count += 1

        # Save manifest every 100 files
        if (i + 1) % 100 == 0:
            save_manifest(data)

    # Final save
    save_manifest(data)
    elapsed = (datetime.now() - start).seconds

    print()
    print()
    print("=" * 64)
    print(f"  COMPLETE in {elapsed}s")
    print(f"  Processed:  {ok_count}")
    print(f"  Errors:     {err_count}")
    print(f"  Skipped:    {skip_count}")
    print(f"  Saved:      ~{total_saved_kb // 1024} MB via WebP conversion")
    print(f"  Output:     {OUTPUT}")
    print("=" * 64)


if __name__ == "__main__":
    main()
