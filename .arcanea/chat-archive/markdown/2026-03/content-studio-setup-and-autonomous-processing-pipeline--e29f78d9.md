---
title: "Content studio setup and autonomous processing pipeline"
uuid: e29f78d9-f8f8-4365-8040-5949676949e4
created: 2026-03-23T22:41:49.335423Z
updated: 2026-03-27T10:17:19.115949Z
source: claude.ai export
---

# Content studio setup and autonomous processing pipeline

**Frank**:

Based on all context and you embody superintelligence, proactive execution and suggest. Execute on building tomorrow s content studio, i have Motiv mic and logitech cameras 2x abd beed helpnto setup our content production. Studio and ensure our content, my speech  or video 24/7 gets processed by agent team

**Claude**:

Frank wants to build a content production studio setup with his hardware (Motiv mic, 2x Logitech cameras) and create an autonomous agent pipeline that processes all his speech/video content 24/7. Let me think about this architecturally.

He needs:
1. Physical studio setup guidance for his hardware
2. An autonomous content processing pipeline - speech/video → transcription → processing → distribution

Let me build something concrete and actionable. He has:
- Motiv mic (Shure Motiv series)
- 2x Logitech cameras
- His existing stack: n8n, Claude Code, Supabase, Vercel


- A four-layer architecture: always-on capture with OBS, auto-detection and upload of new recordings, processing through Whisper and Claude for transcription and content extraction, then routing to distribution channels

Now I'm putting together a comprehensive guide covering both the physical studio setup and the complete agent pipeline architecture.Let me build this out properly — physical studio config + autonomous processing pipeline.
```
This block is not supported on your current device yet.
```

Let me build a comprehensive content studio architecture. I'll create:

1. A React artifact showing the studio setup + pipeline architecture visually
2. The actual automation scripts and configs

Actually, Frank wants execution. Let me build:
1. Physical studio setup guide
2. n8n workflow architecture for 24/7 processing
3. The actual scripts needed

Let me create a comprehensive markdown document with the full architecture, then build the key automation scripts.
```
This block is not supported on your current device yet.
```

Let me build the content studio architecture. I'll create:

1. A comprehensive React dashboard showing the full pipeline
2. The actual shell scripts for the automation

Let me think about the architecture:

**Physical Studio Setup:**
- Shure Motiv mic (USB condenser)
- 2x Logitech cameras (likely C920/C922 or Brio)
- OBS Studio for capture
- Dual-camera setup: face cam + overhead/screen

**24/7 Processing Pipeline:**
1. **Capture**: OBS → auto-record segments → watch folder
2. **Ingestion**: File watcher (fswatch/inotify) → upload to Supabase Storage


3. **Transcription**: Whisper API or local whisper.cpp
4. **Processing**: Claude API → extract content types (social posts, blog drafts, brain dump categorization, action items)
5. **Distribution**: n8n workflows → route to platforms

I'll focus on building a comprehensive architecture document with the actual processing scripts Frank can deploy right away.Building the full Content Studio architecture — physical setup + autonomous processing pipeline.
```
This block is not supported on your current device yet.
```

Let me build a React artifact that serves as the Content Studio Command Center — showing the full architecture, setup checklist, and pipeline visualization. Then I'll also create the actual automation scripts.
```
This block is not supported on your current device yet.
```

Now let me create the actual automation scripts Frank needs to deploy this pipeline.Now let me build the actual deployment scripts — the watcher daemon, processing pipeline, and n8n workflow config:
```
This block is not supported on your current device yet.
```

Now let me create the n8n workflow JSON and the Claude processing script.
```
This block is not supported on your current device yet.
```

Now let me create a quick .env template and a README for setup.
```
This block is not supported on your current device yet.
```

Now let me create a quick-start setup script that initializes everything.
```
This block is not supported on your current device yet.
```

Let me present all the files now.
```
This block is not supported on your current device yet.
```

Done. Let me summarize what was built.Five deliverables shipped:

**Command Center Dashboard** — interactive architecture map with 4 tabs: full pipeline visualization, setup checklist (clickable), lighting/environment guide for IJburg, and all three agent system prompts (Content Architect, Brand Voice Router, Clip Intelligence).

**Setup Script** — run once, creates `~/ContentStudio/` with full directory tree, validates dependencies (ffmpeg, node, fswatch/inotifywait), copies scripts, prints OBS configuration.

**File Watcher Daemon** — always-on service monitoring `raw/` folder. Detects new recordings, waits for write-complete, extracts 16kHz mono WAV (Whisper-optimal), uploads to Supabase, triggers n8n webhook. Includes systemd service generator for Linux auto-start.

**Content Processor** — Node.js script called by n8n post-transcription. Sends transcript to Claude with the Content Architect prompt, receives structured JSON with segments classified across all 8 content types, writes per-type route files that n8n picks up for distribution to Notion/Linear/social queues.

**Env Template** — all API keys in one place.

The pipeline flow: **OBS record → raw/ folder → watcher daemon → ffmpeg audio extract → Supabase upload → n8n webhook → Whisper transcription → Claude Content Architect → routed JSON outputs → n8n distributes to Notion (brain dumps), Linear (actions), social queues (posts), Arcanea KB (lore).**

One decision to lock in: local Whisper vs OpenAI Whisper API for transcription. Local gives you privacy and no per-minute cost but needs GPU. API is instant but ~$0.006/min. Given your volume ambition, API is the right call initially — switch to local whisper.cpp when you're running 4+ hours/day of recordings.

**Frank**:

Can you put this all into notion for me
