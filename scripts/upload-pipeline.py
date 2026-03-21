#!/usr/bin/env python3
"""
Arcanea Multi-Tier Upload Pipeline

Reads a categorized manifest and uploads files to the appropriate storage tier:
- R2: Videos, audio, large images (>2MB)
- Vercel Blob: Thumbnails, icons, logos, social assets (<2MB)
- Supabase: User-generated content (handled separately by the platform)

Prerequisites:
    pip install boto3 requests python-dotenv

Environment vars (.env):
    R2_ACCOUNT_ID=your_cloudflare_account_id
    R2_ACCESS_KEY_ID=your_r2_access_key
    R2_SECRET_ACCESS_KEY=your_r2_secret_key
    R2_BUCKET_NAME=arcanea-media
    R2_PUBLIC_URL=https://media.arcanea.ai
    BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

Usage:
    python upload-pipeline.py categorized-manifest.json
    python upload-pipeline.py categorized-manifest.json --tier r2  # only R2
    python upload-pipeline.py categorized-manifest.json --tier vercel_blob  # only Blob
    python upload-pipeline.py categorized-manifest.json --dry-run  # preview
    python upload-pipeline.py categorized-manifest.json --resume  # skip already-uploaded
"""

import json
import sys
import os
import hashlib
import mimetypes
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Optional

try:
    import boto3
    from botocore.config import Config as BotoConfig
except ImportError:
    boto3 = None

try:
    import requests
except ImportError:
    requests = None

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# ─── R2 PATH BUILDER ─────────────────────────────────────────────────

def build_r2_path(entry: dict) -> str:
    cats = entry.get("categories", {})
    ext = entry.get("extension", "")
    content_type = cats.get("content_type", "other")
    guardian = cats.get("guardian", "general")
    element = cats.get("element", "general")
    usage = cats.get("usage_tier", "archive")
    filename = entry.get("filename", "unknown")

    # Sanitize filename
    safe_name = filename.replace(" ", "-").lower()

    if ext in (".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"):
        if content_type in ("promo_video", "trailer"):
            return f"video/promo/{guardian}/{safe_name}"
        elif content_type == "social_clip":
            return f"video/social/{safe_name}"
        elif content_type == "music_video":
            return f"video/music/{safe_name}"
        else:
            return f"video/raw/{entry.get('folder', 'misc')}/{safe_name}"

    elif ext in (".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac"):
        freq = ""
        if guardian != "general":
            from scripts_data import GUARDIANS  # noqa
        return f"audio/{guardian}/{safe_name}"

    else:  # large images
        return f"images/hires/{guardian}/{safe_name}"


def build_blob_key(entry: dict) -> str:
    cats = entry.get("categories", {})
    usage = cats.get("usage_tier", "gallery")
    content_type = cats.get("content_type", "other")
    guardian = cats.get("guardian", "general")
    element = cats.get("element", "general")
    file_id = entry.get("id", "unknown")[:8]
    ext = entry.get("extension", ".webp")
    return f"{usage}-{content_type}-{guardian}-{file_id}{ext}"


# ─── R2 UPLOAD ────────────────────────────────────────────────────────

def get_r2_client():
    if not boto3:
        raise ImportError("Install boto3: pip install boto3")
    account_id = os.environ["R2_ACCOUNT_ID"]
    return boto3.client(
        "s3",
        endpoint_url=f"https://{account_id}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        config=BotoConfig(signature_version="s3v4"),
        region_name="auto",
    )


def upload_to_r2(client, source_path: str, entry: dict) -> dict:
    bucket = os.environ.get("R2_BUCKET_NAME", "arcanea-media")
    public_url = os.environ.get("R2_PUBLIC_URL", "https://media.arcanea.ai")
    remote_path = build_r2_path(entry)

    with open(source_path, "rb") as f:
        client.put_object(
            Bucket=bucket,
            Key=remote_path,
            Body=f,
            ContentType=entry.get("mime_type", "application/octet-stream"),
            CacheControl="public, max-age=31536000, immutable",
        )

    return {
        "tier": "r2",
        "remote_path": remote_path,
        "public_url": f"{public_url}/{remote_path}",
        "cdn_url": f"{public_url}/{remote_path}",
    }


# ─── VERCEL BLOB UPLOAD ──────────────────────────────────────────────

def upload_to_blob(source_path: str, entry: dict) -> dict:
    if not requests:
        raise ImportError("Install requests: pip install requests")
    token = os.environ["BLOB_READ_WRITE_TOKEN"]
    blob_key = build_blob_key(entry)

    with open(source_path, "rb") as f:
        resp = requests.put(
            f"https://blob.vercel-storage.com/{blob_key}",
            headers={
                "Authorization": f"Bearer {token}",
                "x-content-type": entry.get("mime_type", "application/octet-stream"),
                "x-cache-control-max-age": "31536000",
            },
            data=f,
        )
        resp.raise_for_status()
        result = resp.json()

    return {
        "tier": "vercel_blob",
        "remote_path": blob_key,
        "public_url": result.get("url", ""),
        "cdn_url": result.get("url", ""),
    }


# ─── MAIN PIPELINE ───────────────────────────────────────────────────

def upload_file(entry: dict, source_root: str, r2_client, dry_run: bool) -> dict:
    source_path = os.path.join(source_root, entry["relative_path"].replace("/", os.sep))
    tier = entry.get("storage", {}).get("tier", "r2")

    if not os.path.exists(source_path):
        entry["storage"]["error"] = "file_not_found"
        return entry

    if dry_run:
        if tier == "r2":
            entry["storage"]["remote_path"] = build_r2_path(entry)
        elif tier == "vercel_blob":
            entry["storage"]["remote_path"] = build_blob_key(entry)
        entry["storage"]["status"] = "dry_run"
        return entry

    try:
        if tier == "r2":
            result = upload_to_r2(r2_client, source_path, entry)
        elif tier == "vercel_blob":
            result = upload_to_blob(source_path, entry)
        else:
            entry["storage"]["status"] = "skipped_supabase"
            return entry

        entry["storage"].update(result)
        entry["storage"]["status"] = "uploaded"
        from datetime import datetime, timezone
        entry["storage"]["uploaded_at"] = datetime.now(timezone.utc).isoformat()
    except Exception as e:
        entry["storage"]["error"] = str(e)
        entry["storage"]["status"] = "failed"

    return entry


def main():
    if len(sys.argv) < 2:
        print("Usage: python upload-pipeline.py <categorized-manifest.json> [--dry-run] [--tier r2|vercel_blob] [--resume] [--workers N]")
        sys.exit(1)

    manifest_path = sys.argv[1]
    dry_run = "--dry-run" in sys.argv
    resume = "--resume" in sys.argv
    tier_filter = None
    workers = 4

    for i, arg in enumerate(sys.argv):
        if arg == "--tier" and i + 1 < len(sys.argv):
            tier_filter = sys.argv[i + 1]
        if arg == "--workers" and i + 1 < len(sys.argv):
            workers = int(sys.argv[i + 1])

    with open(manifest_path) as f:
        manifest = json.load(f)

    source_root = manifest.get("source_root", "")
    files = manifest.get("files", [])

    # Filter by tier if specified
    if tier_filter:
        files = [f for f in files if f.get("storage", {}).get("tier") == tier_filter]

    # Skip already uploaded if resuming
    if resume:
        files = [f for f in files if f.get("storage", {}).get("status") != "uploaded"]

    print(f"{'[DRY RUN] ' if dry_run else ''}Uploading {len(files)} files from {source_root}")

    # Initialize R2 client if needed
    r2_client = None
    if any(f.get("storage", {}).get("tier") == "r2" for f in files) and not dry_run:
        r2_client = get_r2_client()

    # Upload with thread pool
    uploaded = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {
            pool.submit(upload_file, entry, source_root, r2_client, dry_run): entry
            for entry in files
        }
        for future in as_completed(futures):
            entry = future.result()
            status = entry.get("storage", {}).get("status", "unknown")
            if status in ("uploaded", "dry_run"):
                uploaded += 1
            else:
                failed += 1
            if (uploaded + failed) % 50 == 0:
                print(f"  Progress: {uploaded + failed}/{len(files)} ({failed} failed)")

    # Write updated manifest
    out_path = manifest_path.replace(".json", "-uploaded.json")
    with open(out_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDone: {uploaded} uploaded, {failed} failed")
    print(f"Updated manifest: {out_path}")


if __name__ == "__main__":
    main()
