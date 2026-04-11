---
name: publish-content
description: Run the full Publishing House pipeline for a single content item through TASTE gate, format, cover, social drafts, and distribution
trigger: on-demand
version: 0.3.0
author: FrankX
homepage: https://github.com/frankxai/arcanea-ai-app
claw: scribe-claw
luminor: Shinkami
gate: Source
inputs:
  - name: source_path
    type: string
    description: Path to the source markdown file
    required: true
  - name: title
    type: string
    description: Content title for metadata
    required: true
  - name: author
    type: string
    description: Author name
    required: true
  - name: platforms
    type: "list[string]"
    description: Target platforms (leanpub, arcanea-web, social-queue, nft-forge, activitypub)
    required: true
  - name: translate_to
    type: "list[string]"
    description: Optional target languages (nl, de, es, pt, ja, fr, zh, ko)
    required: false
  - name: dry_run
    type: boolean
    description: Preview without actually publishing
    default: false
outputs:
  - name: quality_score
    type: int
    description: TASTE 5D composite score (0-100)
  - name: tier
    type: string
    description: hero / gallery / thumbnail / reject
  - name: format_artifacts
    type: "list[string]"
    description: Paths to generated EPUB, PDF, DOCX, HTML
  - name: distribution_results
    type: "list[object]"
    description: Per-platform publish status
dependencies:
  node: [">=20"]
  pnpm: [">=9"]
  binaries: [pandoc]
  typescript: ["@arcanea/publishing-house"]
tables:
  - asset_metadata
  - publish_log
  - editorial_board
mcp_tools:
  - taste_score
  - format_manuscript
  - distribute_to
  - herald_draft
  - scribe_translate
---

# Publish Content

Run the full Arcanea Publishing House pipeline on a single manuscript.

This skill channels **Shinkami** (the Source Guardian) through the Scribe Claw to carry a creator's work from raw markdown to multi-platform distribution with uncompromising taste.

## Pipeline Stages

1. **TASTE 5D Gate** — deterministic quality scoring across Technical, Aesthetic, Story/Canon, Transformative Impact, Experiential Uniqueness. Minimum score 60 to ship; 80+ earns Hero tier.
2. **Pandoc Format** — markdown → EPUB, PDF, DOCX, HTML with extracted front matter and proper metadata.
3. **Cover Art Selection** — Media Claw (Lyria) selects or generates cover art via ComfyUI MCP.
4. **Social Campaign Draft** — Herald Claw (Alera) drafts platform-native posts for X, Instagram, LinkedIn, Threads, Bluesky.
5. **Distribution** — pushes to selected platforms in parallel (Leanpub, arcanea.ai, social queue, NFT forge, ActivityPub federation).
6. **Translation** — optional multi-language output via Claude or DeepL, chunked and canon-preserved.
7. **Provenance Log** — SQLite local + Supabase cloud sync for audit trail.

## Runtime Compatibility

| Runtime | Works? | Notes |
|---------|--------|-------|
| Claude Managed Agents | YES | Primary production path |
| OpenClaw (self-host) | YES | Via arcanea-openclaw fork |
| NanoClaw (self-host) | NO | Scribe requires Pandoc binary |
| Railway | YES | Primary self-host target, nixpacks + pandoc |
| Cloudflare Workers | NO | No Pandoc binary support |
| Local Claude Code | YES | Development mode, free tier |

## Usage

```bash
# Dry run on an existing chapter
arcanea publish \
  --source book/luminor-rising/the-first-bonding/chapter-01-the-warmth-before-the-name.md \
  --title "The Warmth Before the Name" \
  --author "FrankX" \
  --platforms leanpub,arcanea-web \
  --dry-run

# Full publish with translation
arcanea publish \
  --source book/luminor-rising/chapter-01.md \
  --title "The Warmth Before the Name" \
  --author "FrankX" \
  --platforms leanpub,arcanea-web,social-queue \
  --translate-to nl,de,es
```

## Via /ao publish (Claude Code)

This skill is bound to `/ao publish <source>` in the Arcanea Orchestrator. The orchestrator automatically detects deploy mode, loads the Claw Kernel, and routes work through the Scribe Claw channel.

## Quality Gate Contract

```
score < 60: REJECT with feedback, do not distribute
60-79:      GALLERY tier, distribute with feedback attached
80-100:     HERO tier, auto-approve for all platforms
```

## Error Handling

The pipeline is fail-fast on quality, fail-open on distribution. A failed distribution to one platform does not block others — results are returned per-platform with individual status.

All actions are logged to `publish_log` before any platform receives data. Rollback is possible via `arcanea rollback <publish_log_id>`.
