---
type: milestone
id: m002-cloudflare-stream
project: arcanea
name: Cloudflare Stream for Video
status: planned
gate: flow
guardian: Leyla
element: water
priority: P1
created: 2026-02-27
target: 2026-03-15
progress: 0
depends_on: [m001-supabase-auth]
tasks:
  - id: t001
    name: Create Cloudflare account and Stream subscription
    status: pending
  - id: t002
    name: Wire tus.js upload for large video files
    status: pending
  - id: t003
    name: Add Cloudflare env vars to Vercel
    status: pending
  - id: t004
    name: Update upload API to route video to Stream
    status: pending
  - id: t005
    name: Add HLS player component for video playback
    status: pending
  - id: t006
    name: Update community/create with video upload flow
    status: pending
---

# M002 — Cloudflare Stream for Video

Flow milestone. Enable video uploads and streaming for the community creation features.

## Context

Supabase Storage handles images and audio well, but video streaming at scale needs a CDN-backed solution. Cloudflare Stream provides HLS adaptive bitrate, thumbnail generation, and global delivery.

## Definition of Done

- [ ] Creators can upload video (up to 200MB) via tus.js
- [ ] Videos play with adaptive bitrate in community feed
- [ ] Thumbnails auto-generated for video cards
