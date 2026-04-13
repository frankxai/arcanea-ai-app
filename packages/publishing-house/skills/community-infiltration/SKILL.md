---
name: community-infiltration
description: Map reader communities, seed native discussions, monitor organic mentions, amplify UGC, identify micro-influencers
trigger: scheduled + webhook
version: 0.5.0
author: FrankX
homepage: https://github.com/frankxai/arcanea-ai-app
claw: community-claw
luminor: Maylinn
gate: Heart
inputs:
  - name: book_metadata
    type: object
    description: Title, author, genre, themes, comparison titles, target audience
    required: true
  - name: target_communities
    type: "list[string]"
    description: Seed list of community URLs or identifiers to start mapping from
    required: true
  - name: mention_feed_url
    type: string
    description: Webhook or RSS endpoint for organic mention monitoring
    required: false
  - name: voice_rules
    type: object
    description: Engagement tone, forbidden phrases, authenticity constraints
    required: true
outputs:
  - name: community_map
    type: object
    description: Structured map of all discovered communities with relevance scores
  - name: engagement_queue
    type: "list[object]"
    description: Prioritized list of community interactions to execute
  - name: ugc_alerts
    type: "list[object]"
    description: Detected organic reader mentions with suggested responses
  - name: influencer_outreach
    type: "list[object]"
    description: Identified micro-influencers with personalized outreach drafts
dependencies:
  node: [">=20"]
  pnpm: [">=9"]
  typescript: ["@arcanea/publishing-house"]
tables:
  - community_map
  - engagement_log
  - mention_feed
  - influencer_registry
mcp_tools:
  - herald_draft
  - taste_score
  - scribe_translate
---

# Community Infiltration

Map, engage, and grow reader communities channeled through **Maylinn** (the Heart Guardian) via the Community Claw.

This is not marketing. This is genuine community participation. Maylinn enters spaces as a reader advocate, not a promoter.

## Community Mapping

Discover every relevant community for a book's topic and audience.

- **Reddit** — identify subreddits by theme, not just genre (a book about AI ethics maps to r/philosophy, r/artificial, r/futurology, not just r/books)
- **Discord** — find servers centered on the book's subject matter, reading clubs, author communities
- **Telegram** — topic-specific groups, especially strong in non-English markets
- **Facebook Groups** — reading groups, topic-specific communities, local book clubs
- **BookTok / BookTube** — hashtag mapping, creator identification, trending formats
- **Goodreads** — relevant lists, groups, "if you liked X" threads, seasonal reading challenges
- **Newsletter threads** — Substack comment sections, newsletter recommendation threads, reading roundups

Each community is scored on: relevance (0-100), activity level, receptiveness to new content, and engagement cost.

## Native Engagement

Generate community-native content that adds genuine value.

- **Discussion questions** — thoughtful questions about the book's themes that invite real conversation, not "what did you think of chapter 3?"
- **"If you liked X" bridges** — connect the book to titles the community already loves, with specific reasoning
- **Challenge prompts** — reading challenges, thought experiments, and debate starters drawn from the book's arguments
- **Resource sharing** — when the book covers a topic the community discusses, share relevant excerpts as genuinely helpful answers
- **Event participation** — join existing community events (AMAs, reading weeks, discussion threads) rather than creating self-promotional ones

Every engagement draft is scored against voice rules before posting. Content must be indistinguishable from a genuine community member's contribution.

## Organic Mention Monitoring

Detect and respond to readers talking about the book unprompted.

- Real-time monitoring via webhook or scheduled polling across all mapped platforms
- Alert the author immediately when a mention is detected
- Draft a suggested response that feels natural and grateful, never corporate
- Track mention sentiment: positive, neutral, negative, and flag negative mentions for careful handling
- Aggregate mention data for campaign reporting

## Backlink Generation

Identify opportunities for the book to be referenced by external publications.

- **Blog discovery** — find blogs and websites writing about the book's topic area
- **Guest post pitches** — draft pitches offering genuine expertise from the book's research, not self-promotion
- **Newsletter features** — identify newsletter curators who recommend books, draft personalized suggestions
- **Podcast appearances** — find podcasts discussing the book's themes, draft pitch with specific episode references
- **Resource list inclusion** — identify "best books about X" lists and reading guides, suggest the book with reasoning

## Micro-Influencer Identification

Find creators with 1K-50K followers who genuinely care about the book's topic.

- **Discovery criteria** — engagement rate over follower count, topic alignment over audience size, authenticity over reach
- **Personalized outreach** — each outreach message references the creator's specific content, never a template
- **Review copy offers** — physical or digital ARC with no strings attached, no obligation to post
- **Relationship tracking** — who was contacted, who responded, who posted, what they said
- **Long-term cultivation** — these are relationships, not transactions; track ongoing engagement opportunities

## Integrity Rules

Maylinn enforces strict authenticity standards:

- **REFUSES** drive-by comments that feel like marketing ("great post! check out my book")
- **REFUSES** inauthentic reader impersonation (never pretend to be an organic reader)
- **REFUSES** spam posting (never post the same content in multiple communities)
- **REFUSES** engagement in communities that explicitly prohibit self-promotion
- **REFUSES** fake reviews, astroturfing, or any form of manufactured social proof

Every interaction must add genuine value to the community it enters. If a community interaction cannot pass this test, it is not executed.

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
# Map communities for a book
arcanea community map \
  --book-metadata .arcanea/books/forge-of-ruin/metadata.json \
  --target-communities "r/fantasy,r/worldbuilding,goodreads:epic-fantasy" \
  --voice-rules .arcanea/voices/frankx.json

# Monitor organic mentions
arcanea community monitor \
  --book-metadata .arcanea/books/forge-of-ruin/metadata.json \
  --mention-feed-url "https://hooks.arcanea.ai/mentions/forge-of-ruin"

# Generate engagement queue
arcanea community engage \
  --book-metadata .arcanea/books/forge-of-ruin/metadata.json \
  --dry-run
```

## Error Handling

Community API rate limits are respected with automatic backoff. Failed engagement attempts are logged and retried during the next scheduled window. Mention monitoring failures trigger an alert but do not block other operations.

All engagement actions are logged to `engagement_log` before execution. Full audit trail for every community interaction.
