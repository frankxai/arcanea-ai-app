---
id: M006
title: Creator Tools Backend
guardian: Draconia
gate: Fire
priority: P1
status: planned
progress: 0
created: 2026-03-01
target: 2026-03-22
tags: [backend, api, supabase, ai]
depends_on: [M001, M005]
---

# M006: Creator Tools Backend

> Wire all creator-facing tools to Supabase persistence + AI generation APIs.

## Tasks

### T1: Creation Pipeline
- [ ] Finalize /api/creations CRUD (GET list with pagination, POST, PUT, DELETE)
- [ ] Add Supabase Storage upload for image/video/audio creations
- [ ] Add thumbnail generation (sharp for images, ffmpeg for video)
- [ ] Add creation versioning (version column, history endpoint)
- [ ] Wire creation tags with GIN index search

### T2: AI Generation Pipeline
- [ ] Image: Wire Imagen 3 via /api/ai/generate-image (working)
- [ ] Video: Wire Veo 3.1 via /api/ai/generate-video (working)
- [ ] Music: Wire Suno/MusicFX via /api/ai/generate-music (NEW)
- [ ] Text: Wire Gemini via /api/ai/generate-text (enhance)
- [ ] Code: Wire Claude via /api/ai/generate-code (NEW)
- [ ] Add generation cost tracking (ai_usage table)
- [ ] Add generation history per user

### T3: Prompt Books Persistence
- [ ] Create prompt_books + prompts tables in Supabase
- [ ] Wire /api/prompt-books CRUD
- [ ] Add sharing/publishing (public_prompts view)
- [ ] Add community prompt marketplace

### T4: Reading Progress
- [ ] Create reading_progress table
- [ ] Wire /api/library/progress (track per-user, per-text)
- [ ] Add bookmarks table
- [ ] Wire /api/library/bookmarks CRUD

### T5: Academy Course System
- [ ] Create courses, lessons, enrollments tables
- [ ] Wire /api/academy/courses CRUD
- [ ] Add lesson completion tracking
- [ ] Add Gate-based course prerequisites
- [ ] XP reward on lesson completion

### T6: Gallery Social Features
- [ ] Wire likes to /api/gallery/[id]/like (like-service.ts exists)
- [ ] Add comments table + /api/gallery/[id]/comments
- [ ] Add view count tracking (RPC exists)
- [ ] Cursor-based pagination for infinite scroll
