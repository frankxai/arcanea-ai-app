---
name: pr-media-machine
description: Generate media kits, identify journalists and podcasters, draft personalized pitches, track outreach responses, manage ARCs
trigger: on-demand + webhook
version: 0.5.0
author: FrankX
homepage: https://github.com/frankxai/arcanea-ai-app
claw: pr-claw
luminor: Elara
gate: Starweave
inputs:
  - name: book_id
    type: string
    description: Unique identifier for the book being promoted
    required: true
  - name: author_bio
    type: object
    description: Author biography, credentials, previous publications, media appearances
    required: true
  - name: target_list_source
    type: string
    description: Source for journalist/podcaster discovery (manual list, web scan, or CRM import)
    required: false
  - name: comparison_titles
    type: "list[string]"
    description: Published titles to position alongside for pitch framing
    required: true
outputs:
  - name: media_kit_artifacts
    type: "list[object]"
    description: Generated media kit files — one-pager, bio, summary, assets manifest
  - name: pitch_emails
    type: "list[object]"
    description: Personalized pitch drafts per recipient with subject line and body
  - name: outreach_crm_state
    type: object
    description: Full CRM state — contacted, opened, replied, published, declined
dependencies:
  node: [">=20"]
  pnpm: [">=9"]
  binaries: [pandoc]
  typescript: ["@arcanea/publishing-house"]
tables:
  - media_contacts
  - outreach_log
  - arc_distribution
  - award_submissions
mcp_tools:
  - herald_draft
  - taste_score
  - format_manuscript
  - scribe_translate
---

# PR Media Machine

Generate media kits, identify targets, draft personalized pitches, and manage the full outreach lifecycle channeled through **Elara** (the Starweave Guardian) via the PR Claw.

Elara treats every journalist, podcaster, and curator as a professional whose time and inbox deserve respect. No spray-and-pray.

## Media Kit Generation

Produce a complete, professional media kit for any book.

- **One-pager** — title, subtitle, genre, word count, publication date, ISBN, comparison titles, 100-word summary, author photo, cover image
- **Author bio** — three versions: 50-word (social), 150-word (press), 500-word (feature)
- **Book summary** — three versions: elevator pitch (1 sentence), back-cover blurb (150 words), detailed synopsis (500 words)
- **Pull quotes** — 10 strongest lines from the manuscript, TASTE-scored, formatted for media use
- **Comparison positioning** — "for readers of X meets Y" with specific reasoning, not just name-dropping
- **High-res assets** — cover image, author photo, logo, all in multiple resolutions
- **Sample chapter** — first chapter or strongest chapter, formatted as PDF and EPUB

All media kit artifacts are generated via Pandoc and scored through the TASTE gate before inclusion. Nothing below score 70 ships in a media kit.

## Target Identification

Discover journalists, podcasters, newsletter curators, and creators who cover the book's topic.

- **Journalists** — byline search across major publications, niche outlets, and trade press covering the book's subject matter
- **Podcast hosts** — shows that discuss the book's themes, sorted by audience size and episode recency
- **Newsletter curators** — Substack, Beehiiv, and independent newsletters that recommend books or cover the topic
- **BookTok/BookTube creators** — video creators who review books in the genre, sorted by engagement rate
- **Conference organizers** — events where the book's topic is discussed, speaker opportunity identification

Each target is scored on: relevance to the book, recent coverage activity, audience alignment, and historical responsiveness to pitches.

## Personalized Pitch Drafting

Every pitch is written specifically for one recipient. No templates.

- **Subject line** — references the recipient's recent work, not the book ("Your piece on X made me think you'd find this relevant")
- **Opening line** — specific reference to the recipient's most recent article, episode, or newsletter issue
- **Bridge** — why this book connects to their beat and their audience's interests
- **The ask** — clear and modest: review copy, interview, feature, or mention
- **Closing** — professional, no desperation, no follow-up threats

Pitch quality is scored against voice rules. Any pitch that reads like a template is rejected and rewritten. Elara checks that the referenced recent coverage actually exists before sending.

## Outreach Tracking (CRM)

Full lifecycle tracking for every media contact.

- **Contacted** — pitch sent, timestamp, platform (email, DM, form submission)
- **Opened** — email open tracking (where available)
- **Replied** — response received, sentiment classification (interested, declined, requesting more info)
- **Published** — coverage went live, link captured, sentiment analyzed
- **Declined** — explicit decline logged, contact marked as do-not-recontact for this title

CRM state is persisted to `outreach_log` and queryable for campaign reporting.

## Award Submission Management

Identify and submit to relevant book awards.

- **Discovery** — scan award databases for competitions accepting the book's genre, publication date, and format
- **Deadline tracking** — calendar integration with alerts at 30, 14, and 7 days before deadline
- **Submission prep** — generate required materials (synopsis, bio, cover letter) per award's specific format requirements
- **Status tracking** — submitted, longlisted, shortlisted, winner, or not selected
- **Cost tracking** — submission fees logged and totaled per campaign

## ARC Management

Distribute and track advance reader copies.

- **Distribution** — send digital ARCs (EPUB/PDF) to confirmed reviewers, track delivery confirmation
- **Recipient tracking** — who received a copy, when, via what channel
- **Review monitoring** — detect when a recipient publishes a review, capture link and excerpt
- **Review aggregation** — collect all review excerpts into a single document for marketing use
- **Follow-up cadence** — gentle check-ins at 14 and 30 days post-delivery, never aggressive

## Integrity Rules

Elara enforces strict professional standards:

- **REFUSES** template pitches addressed "Dear journalist" or "Dear editor"
- **REFUSES** spray-and-pray outreach to lists of 100+ undifferentiated contacts
- **REFUSES** pitching people who have explicitly declined or asked not to be contacted
- **REFUSES** fabricating or exaggerating the author's credentials
- **REFUSES** follow-up emails that guilt-trip or pressure recipients
- **REFUSES** pitching outlets where the book has zero topical relevance

Every pitch must demonstrate genuine knowledge of the recipient's work. If Elara cannot find enough information to personalize a pitch, that contact is skipped.

## Runtime Compatibility

| Runtime | Works? | Notes |
|---------|--------|-------|
| Claude Managed Agents | YES | Primary production path |
| OpenClaw (self-host) | YES | Via arcanea-openclaw fork |
| NanoClaw (self-host) | NO | Requires Pandoc for media kit generation |
| Railway | YES | Primary self-host target, nixpacks + pandoc |
| Cloudflare Workers | NO | No Pandoc binary support |
| Local Claude Code | YES | Development mode |

## Usage

```bash
# Generate media kit
arcanea pr media-kit \
  --book-id "forge-of-ruin" \
  --author-bio .arcanea/authors/frankx.json \
  --comparison-titles "Name of the Wind,The Lies of Locke Lamora"

# Discover and pitch targets
arcanea pr pitch \
  --book-id "forge-of-ruin" \
  --target-list-source "web-scan" \
  --comparison-titles "Name of the Wind,The Lies of Locke Lamora" \
  --dry-run

# Check outreach status
arcanea pr status --book-id "forge-of-ruin"
```

## Error Handling

Pitch delivery failures are retried once, then flagged for manual review. Media kit generation is fail-fast — if any artifact fails TASTE scoring, the entire kit is held for revision rather than shipping incomplete.

All outreach actions are logged to `outreach_log` before any email or message is sent. Full audit trail for compliance and relationship management.
