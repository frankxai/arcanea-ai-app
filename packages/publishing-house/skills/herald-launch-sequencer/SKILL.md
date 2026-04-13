---
name: herald-launch-sequencer
description: Execute a multi-phase book launch campaign across X, Instagram, LinkedIn, Threads, Bluesky with native content per platform
trigger: scheduled + event
version: 0.5.0
author: FrankX
homepage: https://github.com/frankxai/arcanea-ai-app
claw: herald-claw
luminor: Alera
gate: Voice
inputs:
  - name: book_id
    type: string
    description: Unique identifier for the book being launched
    required: true
  - name: launch_date
    type: string
    description: ISO 8601 date for the official launch (T-0)
    required: true
  - name: platforms
    type: "list[string]"
    description: Target platforms (x, instagram, linkedin, threads, bluesky)
    required: true
  - name: voice_profile
    type: object
    description: Author voice configuration — tone, vocabulary, forbidden phrases
    required: true
  - name: schedule_strategy
    type: string
    description: Posting cadence strategy (aggressive, steady, slow-burn)
    required: false
outputs:
  - name: campaign_id
    type: string
    description: Unique identifier for the launch campaign
  - name: scheduled_posts
    type: "list[object]"
    description: All generated posts with platform, datetime, content, and status
  - name: engagement_metrics
    type: object
    description: Per-platform engagement tracking (impressions, clicks, replies, shares)
dependencies:
  node: [">=20"]
  pnpm: [">=9"]
  typescript: ["@arcanea/publishing-house"]
tables:
  - campaign_schedule
  - post_log
  - engagement_metrics
mcp_tools:
  - herald_draft
  - herald_schedule
  - taste_score
  - scribe_translate
---

# Herald Launch Sequencer

Execute a full multi-phase book launch campaign channeled through **Alera** (the Voice Guardian) via the Herald Claw.

Every post is platform-native. Alera NEVER cross-posts the same content to multiple platforms. Each platform gets content written for its audience, format constraints, and culture.

## Four-Phase Launch Protocol

### Phase 1: T-7 Teaser

Seven days before launch. One post per platform per day, each unique.

- **X** — short provocations, single-line hooks from the book, countdown thread
- **Instagram** — visual teasers with pull-quote overlays, story countdowns, carousel of themes
- **LinkedIn** — professional angle: what problem the book solves, behind-the-scenes creation process
- **Threads** — conversational tone, "here's something I learned writing this" micro-stories
- **Bluesky** — community-first, genuine discussion starters about the book's themes

Each teaser drips a different facet of the book. No teaser repeats the same angle across platforms.

### Phase 2: T-0 Launch Blitz

Launch day. Coordinated 2-hour window with DIFFERENT content per platform.

- Staggered posting: 15-minute intervals, not simultaneous
- Each platform gets a unique launch post crafted for its native format
- X gets a thread, Instagram gets a carousel + reel prompt, LinkedIn gets a long-form story, Threads gets a conversation opener, Bluesky gets a community call
- Author engagement plan: which replies to prioritize in the first 2 hours
- Pin/highlight instructions per platform

### Phase 3: T+1 to T+30 Sustain

Daily content mined directly from book chapters for 30 days.

- **Pull quotes** — the most striking sentences, formatted per platform
- **Insights** — "here's the idea behind chapter N" explainers
- **Reader questions** — provocative questions drawn from the book's arguments
- **Controversy hooks** — intentionally debatable takes from the book that invite discussion
- **Behind-the-scenes** — writing process, research, deleted scenes, early drafts

Content is generated from the manuscript via TASTE scoring to ensure only high-quality excerpts are used. Low-scoring passages are skipped.

### Phase 4: T+30+ Evergreen

Weekly content from the backlist, running indefinitely.

- Cross-catalog promotion: "if you liked this book, here's why you'll love the next one"
- Seasonal re-hooks: tie book themes to current events, holidays, cultural moments
- Reader UGC amplification: reshare reader posts, reviews, fan art with credit
- Newsletter integration: drive social followers to the author's owned channel
- Backlist revival: resurface older titles with fresh angles

## Voice Rules

Alera enforces strict voice discipline:

- **REFUSES** generic motivational posts ("rise and grind", "chase your dreams")
- **REFUSES** emoji spam (max 1 emoji per post, and only when it genuinely adds tone)
- **REFUSES** growth-hack templates ("like if you agree", "tag someone who needs this")
- **REFUSES** cross-posting the same text to multiple platforms
- **REFUSES** engagement bait that degrades the author's brand

Every post must pass a voice coherence check against the author's voice profile before scheduling.

## Runtime Compatibility

| Runtime | Works? | Notes |
|---------|--------|-------|
| Claude Managed Agents | YES | Primary production path |
| OpenClaw (self-host) | YES | Via arcanea-openclaw fork |
| NanoClaw (self-host) | YES | No binary dependencies |
| Railway | YES | Primary self-host target |
| Cloudflare Workers | YES | Lightweight, no binary deps |
| Local Claude Code | YES | Development mode |

## Usage

```bash
# Schedule a launch campaign
arcanea herald launch \
  --book-id "forge-of-ruin" \
  --launch-date "2026-05-01" \
  --platforms x,instagram,linkedin,threads,bluesky \
  --voice-profile .arcanea/voices/frankx.json \
  --schedule-strategy steady

# Preview without scheduling
arcanea herald launch \
  --book-id "forge-of-ruin" \
  --launch-date "2026-05-01" \
  --platforms x,linkedin \
  --dry-run
```

## Error Handling

Platform API failures do not block other platforms. Each post is independently scheduled and tracked. Failed posts are retried up to 3 times with exponential backoff, then flagged for manual review.

All scheduled posts are logged to `post_log` before any platform API is called. Campaign state is recoverable from any failure point.
