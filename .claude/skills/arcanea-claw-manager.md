---
name: arcanea-claw-manager
description: >
  Deep operational knowledge for managing the ArcaneaClaw media processing engine.
  Covers architecture, pipeline debugging, skill authoring, TASTE scoring,
  Supabase schema, social publishing, and common failure modes.
version: 1.0.0
triggers:
  - /arcanea-claw
aliases:
  - claw-manager
  - media-engine
---

# ArcaneaClaw Engine — Deep Operations Guide

## Architecture Overview

ArcaneaClaw is a Python asyncio daemon that runs on the Linux filesystem (WSL2) and manages the full lifecycle of Arcanea's visual and media assets — from raw file discovery through AI classification, quality scoring, processing, upload, and social media preparation.

### Directory Layout

```
~/arcanea-claw/
  config.yaml          # All configuration (scan paths, thresholds, model, guardians)
  run.sh               # Bash runner: start/stop/status/logs/restart
  arcanea-claw.pid     # PID of running daemon
  .env                 # SUPABASE_URL, SUPABASE_SERVICE_KEY, GEMINI_API_KEY (NEVER commit)
  venv/                # Python virtual environment
  logs/
    daemon.log         # Main log (rotated daily, max 10MB)
    notifications.log  # Pipeline summary notifications
  staging/             # Temp directory for image processing
  processed/           # Output directory for WebP variants
  engine/
    __init__.py
    daemon.py          # Main event loop: heartbeat + pipeline + health HTTP server
    supabase_client.py # All DB operations (agent registry, asset CRUD, social queue)
    skills/
      __init__.py
      media_scan.py    # Skill 1: Walk filesystem, hash files, register new assets
      media_classify.py # Skill 2: Gemini Vision classifies guardian/element/gate
      media_dedup.py   # Skill 3: Remove duplicate assets by MD5 hash
      media_process.py # Skill 4: Convert to WebP, generate size variants
      taste_score.py   # Skill 5: 5-dimension aesthetic scoring via Gemini Vision
      media_upload.py  # Skill 6: Upload to Vercel Blob (hero) or Supabase Storage
      social_prep.py   # Skill 7: Generate social queue entries with AI captions
      notify.py        # Skill 8: Send pipeline summary via webhooks/file log
```

### Daemon Architecture

The daemon (`engine/daemon.py`) runs three concurrent tasks:

1. **Health HTTP Server** (port 8080) — serves `/health` JSON with daemon state
2. **Heartbeat Loop** — pings `agent_registry` in Supabase every 300s
3. **Pipeline Loop** — runs the full 8-skill chain every 900s (15 min)

The daemon registers itself in Supabase's `agent_registry` table on startup with `agent_id: arcanea-claw-primary` and sets status to `online`. During pipeline runs it switches to `processing`, then back to `online`.

Shutdown is graceful: SIGTERM triggers an asyncio Event, loops exit cleanly, agent status is set to `offline`.

## The 8-Skill Pipeline

Skills run sequentially in this fixed order. Each skill is a Python module with a `run(config, supabase, ...)` function that returns a results dict.

### Skill 1: media_scan
- Walks configured `scan.paths` from config.yaml
- Filters by `scan.extensions` (jpg, png, webp, gif, mp4, mov, mp3, wav, flac)
- Skips paths matching `scan.ignore_patterns` (dotfiles, node_modules, .git, .next)
- Computes MD5 hash for each file
- Checks `asset_metadata` table for existing hashes to avoid duplicates
- Inserts new rows with status `new`, file metadata (size, MIME, dimensions via PIL)
- Returns `{new_files_count, file_hashes}`

**Configured scan paths:**
```
/mnt/c/Users/frank/Arcanea/apps/web/public/guardians
/mnt/c/Users/frank/Arcanea/assets
/mnt/c/Users/frank/Arcanea/.arcanea/forge
```

### Skill 2: media_classify
- Fetches assets where `classified_at IS NULL` from `asset_metadata`
- Sends each image (base64-encoded) to Gemini 2.0 Flash with a classification prompt
- Gemini returns JSON: `{guardian, element, gate, tags, content_type, confidence}`
- Content types: character, landscape, artifact, scene, abstract
- Updates the asset row with guardian, element, gate, tags, content_type, confidence, classified_at
- Batch size: 20 per run
- Returns `{classified_count}`

### Skill 3: media_dedup
- Finds assets with duplicate MD5 hashes
- Keeps the earliest (first scanned) version
- Marks later duplicates as `status: duplicate`
- Returns `{duplicates_found}`

### Skill 4: media_process
- Fetches classified but unprocessed assets
- Converts to WebP at configured quality (85)
- Generates size variants defined in `process.size_variants`:
  - hero: 1920x1080
  - gallery: 1200x800
  - social_square: 1080x1080
  - social_story: 1080x1920
  - social_wide: 1200x628
  - thumbnail: 320x320
- Outputs to `~/arcanea-claw/processed/` with structured naming
- Max dimension cap: 2400px
- Updates `processed_at` timestamp
- Returns `{processed_count}`

### Skill 5: taste_score
- Fetches processed but unscored assets
- Sends each to Gemini Vision with the TASTE scoring prompt
- **Five scoring dimensions** (each 0-20, total 0-100):
  1. **Canon Alignment** — Does it match Arcanea's aesthetic? Fantasy, mythological, elemental themes?
  2. **Design Compliance** — Composition, color palette, professional quality?
  3. **Emotional Impact** — Does it evoke wonder, power, mystery?
  4. **Technical Fit** — Resolution, clarity, suitable for web hero/gallery use?
  5. **Uniqueness** — Distinct from typical AI art? Has character and originality?
- **Quality tiers from total score:**
  - hero: 80-100 (uploaded to Vercel Blob, used as hero images)
  - gallery: 60-79 (uploaded to Supabase Storage gallery bucket)
  - thumbnail: 40-59 (uploaded to thumbnails bucket)
  - reject: 0-39 (not uploaded, kept for reference)
- Batch size: 15 per run
- Returns `{scored_count, hero_count}`

### Skill 6: media_upload
- Fetches scored assets above threshold that have not been uploaded
- Routes by tier:
  - **hero (80+)** goes to Vercel Blob via a Node.js helper subprocess
  - **gallery (60-79)** goes to Supabase Storage `arcanea-gallery` bucket
  - **thumbnail (40-59)** goes to Supabase Storage `thumbnails` bucket
- Updates `uploaded_at` and stores the public URL
- Thresholds configured: `upload.hero_threshold: 80`, `upload.gallery_threshold: 60`

### Skill 7: social_prep
- Takes hero-tier uploaded assets
- Generates platform-specific social media queue entries for: Instagram, LinkedIn, X, YouTube
- Each platform gets the appropriate image variant (square for IG, wide for LinkedIn, hero for X/YT)
- AI-generated captions via Gemini with platform-specific guidelines
- Anti-slop: captions must not use "unleash, unlock, harness, journey"
- Inserts entries into `social_queue` table
- Returns `{queued_count}`

### Skill 8: notify
- Collects stats from all preceding skill results
- Formats a summary message with counts for each pipeline stage
- Delivers via configured channels (currently: file log at `logs/notifications.log`)
- Can also deliver to Discord/Slack webhooks when configured

## Supabase Schema

### `agent_registry`
| Column | Type | Description |
|--------|------|-------------|
| agent_id | text PK | `arcanea-claw-primary` |
| agent_name | text | Display name |
| status | text | online / processing / offline / error |
| started_at | timestamptz | Last daemon start |
| last_heartbeat | timestamptz | Updated every 300s |
| metadata | jsonb | Daemon state snapshot |

### `asset_metadata`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Auto-generated |
| file_path | text | Absolute path on filesystem |
| file_hash | text | MD5 hex digest |
| file_size | bigint | Bytes |
| mime_type | text | e.g. image/webp |
| width | int | Pixel width |
| height | int | Pixel height |
| guardian | text | Classified guardian name (Lyssandria, Leyla, etc.) |
| element | text | Earth, Water, Fire, Wind, Void |
| gate | text | Foundation, Flow, Fire, Heart, Voice, Sight, Crown, Starweave, Unity, Source |
| tags | jsonb | AI-generated tags array |
| content_type | text | character, landscape, artifact, scene, abstract |
| confidence | float | Classification confidence 0-1 |
| taste_score | int | 0-100 total TASTE score |
| canon_alignment | int | 0-20 sub-score |
| design_compliance | int | 0-20 sub-score |
| emotional_impact | int | 0-20 sub-score |
| technical_fit | int | 0-20 sub-score |
| uniqueness | int | 0-20 sub-score |
| tier | text | hero, gallery, thumbnail, reject |
| approved | boolean | Manual approval flag |
| classified_at | timestamptz | When AI classification ran |
| processed_at | timestamptz | When variants were generated |
| uploaded_at | timestamptz | When uploaded to storage |
| upload_url | text | Public URL after upload |
| status | text | new, classified, processed, scored, uploaded, duplicate |
| created_at | timestamptz | Row creation |

### `social_queue`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | Auto-generated |
| asset_id | uuid FK | References asset_metadata |
| platform | text | instagram, linkedin, x, youtube |
| variant | text | Image variant used (social_square, hero, etc.) |
| caption | text | AI-generated caption |
| hashtags | jsonb | Array of hashtags |
| guardian | text | Guardian name for the asset |
| published_at | timestamptz | NULL until published |
| created_at | timestamptz | Row creation |

### `publish_pipeline`
Final distribution tracking for published assets.

## Debugging Common Issues

### Daemon won't start
1. Check for stale PID: `cat ~/arcanea-claw/arcanea-claw.pid` then `ps -p <PID>`
2. If stale, remove: `rm ~/arcanea-claw/arcanea-claw.pid`
3. Check venv exists: `ls ~/arcanea-claw/venv/bin/python`
4. Check .env exists: `ls ~/arcanea-claw/.env`
5. Check port 8080 not in use: `lsof -i :8080`
6. Read the log: `tail -30 ~/arcanea-claw/logs/daemon.log`

### Classification fails
- Gemini API key missing or expired: check `GEMINI_API_KEY` in `.env`
- Rate limited: Gemini 2.0 Flash has per-minute quotas. Reduce `BATCH_SIZE` in `media_classify.py`
- Image too large for base64 encoding: check file size, max ~20MB
- JSON parse failure: Gemini sometimes wraps response in markdown fences. The `_parse_gemini_response` helper strips these.

### TASTE scoring returns unexpected results
- Scores cluster low: images may not match Arcanea's fantasy aesthetic
- Scores cluster high: review the prompt for bias
- All zeros: Gemini returned invalid JSON, check logs for parse errors
- Tier assignment: hero >= 80, gallery >= 60, thumbnail >= 40, reject < 40

### Upload failures
- Vercel Blob: requires Node.js helper script and `BLOB_READ_WRITE_TOKEN` env var
- Supabase Storage: requires `SUPABASE_SERVICE_KEY` with storage permissions
- Check bucket exists: `arcanea-gallery` and `thumbnails` buckets must be created in Supabase dashboard

### Scan finds nothing
- Paths in config.yaml must be absolute and accessible from WSL2
- NTFS paths under `/mnt/c/` are case-insensitive but slow
- Check `scan.extensions` includes the file type
- Check `scan.ignore_patterns` is not too aggressive

### Health endpoint not responding
- Daemon may have crashed: check `is_running` via PID
- Port conflict: another process on 8080
- Firewall: WSL2 may block localhost in some configurations

## Adding a New Skill

1. Create `~/arcanea-claw/engine/skills/my_skill.py`
2. Implement the `run(config, supabase, **kwargs)` async function
3. Return a dict with results (will be stored in pipeline state)
4. Add the skill name to `SKILL_CHAIN` in `engine/daemon.py`
5. Position matters: skills run sequentially and may depend on previous skill output

Template:
```python
"""my-skill: Description of what this skill does."""
from __future__ import annotations
import logging
from typing import Any

logger = logging.getLogger("arcanea-claw.my-skill")

async def run(config: dict[str, Any]) -> dict[str, Any]:
    """Main entry point. Config is the arcanea_claw section of config.yaml."""
    logger.info("Running my-skill...")
    # Your logic here
    return {"processed": 0}
```

## Configuring Scan Paths

Edit `~/arcanea-claw/config.yaml` under `arcanea_claw.scan.paths`:

```yaml
scan:
  paths:
    - /mnt/c/Users/frank/Arcanea/apps/web/public/guardians
    - /mnt/c/Users/frank/Arcanea/assets
    - /mnt/c/Users/frank/Arcanea/.arcanea/forge
    # Add Google Drive when mounted:
    # - "/mnt/g/My Drive/Arcanea"
  extensions: [.jpg, .jpeg, .png, .webp, .gif, .mp4, .mov, .mp3, .wav, .flac]
  ignore_patterns: [".*", "__pycache__", "node_modules", ".git", ".next"]
```

After editing, restart the daemon for changes to take effect. The daemon reads config once on startup.

## TASTE Score Interpretation

The TASTE scoring system evaluates media on five dimensions aligned with Arcanea's creative standards:

| Dimension | What It Measures | Low Score (0-8) | High Score (16-20) |
|-----------|-----------------|-----------------|-------------------|
| Canon Alignment | Fantasy/mythological aesthetic match | Generic stock photo | Unmistakably Arcanean |
| Design Compliance | Composition, color, professionalism | Poor framing, muddy colors | Gallery-ready composition |
| Emotional Impact | Wonder, power, mystery evoked | Flat, uninspiring | Breathtaking, awe-inducing |
| Technical Fit | Resolution, clarity, web-readiness | Blurry, wrong aspect | Crisp, properly sized |
| Uniqueness | Distinctiveness from typical AI art | Cookie-cutter generation | Unique character and style |

**Tier mapping:**
- **Hero (80-100):** Front-page worthy. Used for hero banners, featured galleries, social headers.
- **Gallery (60-79):** Good quality. Suitable for gallery pages, collection thumbnails.
- **Thumbnail (40-59):** Acceptable. Used for small previews, background elements.
- **Reject (0-39):** Below threshold. Kept in database for reference but not published.

## Agent Registry Management

The daemon self-manages its entry in `agent_registry`. To query it manually:

```python
from engine import supabase_client as db
c = db.get_client()
agent = c.table("agent_registry").select("*").eq("agent_id", "arcanea-claw-primary").execute()
print(agent.data)
```

To manually set agent offline (if daemon crashed without cleanup):
```python
db.update_agent_status("arcanea-claw-primary", "offline")
```

## Social Publishing Workflow

1. `social_prep` skill creates queue entries for hero-tier assets
2. Each entry targets a specific platform with the right image variant and AI caption
3. Entries sit in `social_queue` with `published_at = NULL` until published
4. Publishing is currently manual — review queue, approve, then post
5. Future: automated publishing via platform APIs

Platform variant mapping:
- Instagram: `social_square` (1080x1080)
- LinkedIn: `social_wide` (1200x628)
- X: `hero` (1920x1080)
- YouTube: `hero` (1920x1080)

## Canonical Guardian Reference

The classifier maps media to these ten Guardians (from config.yaml):

| Guardian | Element | Gate | Frequency |
|----------|---------|------|-----------|
| Lyssandria | Earth | Foundation | 174 Hz |
| Leyla | Water | Flow | 285 Hz |
| Draconia | Fire | Fire | 396 Hz |
| Maylinn | Air | Heart | 417 Hz |
| Alera | Sound | Voice | 528 Hz |
| Lyria | Void | Sight | 639 Hz |
| Aiyami | Void | Crown | 741 Hz |
| Elara | Fire | Starweave | 852 Hz |
| Ino | Water | Unity | 963 Hz |
| Shinkami | Void | Source | 1111 Hz |

## Quick Reference Commands

```bash
# Activate environment
source ~/arcanea-claw/.env && source ~/arcanea-claw/venv/bin/activate && export PYTHONPATH=~/arcanea-claw

# Daemon control
bash ~/arcanea-claw/run.sh start|stop|status|restart|logs

# Health check
curl -s localhost:8080/health | python3 -m json.tool

# Tail logs
tail -f ~/arcanea-claw/logs/daemon.log

# Python REPL with engine loaded
cd ~/arcanea-claw && python3 -c "from engine import supabase_client as db; c = db.get_client(); print('Connected')"
```
