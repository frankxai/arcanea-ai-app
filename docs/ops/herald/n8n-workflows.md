# Herald n8n Workflow Specifications

> Automation backbone for the Herald Command Center. Each workflow runs on n8n (self-hosted or cloud) and connects to ArcaneaClaw, Supabase, and external APIs.

---

## Workflow 1: Morning Brief

**Trigger:** Cron — Daily 08:00 UTC
**Purpose:** Aggregate overnight signals into executive digest

```
[Cron 08:00] 
  → [GitHub API] Get stars/forks/issues since yesterday
  → [Ayrshare API] Get social metrics (followers, engagement)
  → [Supabase] Query campaign_signals for overnight mentions
  → [Supabase] Query social_queue for today's scheduled posts
  → [Claude API] Synthesize into morning brief format
  → [Slack] Post to #herald-brief channel
  → [Gmail] Send digest to frank@
```

**n8n Nodes:**
- Schedule Trigger → HTTP Request (GitHub) → HTTP Request (Ayrshare) → Supabase (query) → Supabase (query) → AI Agent (Claude) → Slack → Gmail

---

## Workflow 2: Content Distribution Pipeline

**Trigger:** Webhook — when blog post published on arcanea.ai
**Purpose:** Auto-generate platform-specific social content from blog posts

```
[Webhook: blog published]
  → [HTTP Request] Fetch blog content from URL
  → [Claude API] Generate:
    - X thread (6-8 tweets)
    - LinkedIn post
    - Reddit post
    - Newsletter excerpt
  → [Supabase] Insert into social_queue (status: draft)
  → [Slack] Notify #herald-review for approval
  → [Wait for approval webhook]
  → [Ayrshare API] Schedule posts on approved platforms
  → [Supabase] Update social_queue status to scheduled
```

---

## Workflow 3: Reputation Monitor

**Trigger:** Cron — Every 4 hours
**Purpose:** Scan for new mentions, analyze sentiment, alert on negatives

```
[Cron 4h]
  → [Apify] Scrape Twitter mentions, Reddit posts, HN threads
  → [Claude API] Analyze sentiment for each mention
  → [IF negative sentiment >= 3/5 severity]
    → [Slack] Alert #herald-alerts with context
    → [Claude API] Draft response options
    → [Supabase] Insert into campaign_signals (urgency: alert)
  → [ELSE]
    → [Supabase] Insert into campaign_signals (urgency: info)
```

---

## Workflow 4: Community Pulse (Weekly)

**Trigger:** Cron — Every Monday 09:00 UTC
**Purpose:** Weekly community health report

```
[Cron Monday 09:00]
  → [GitHub API] Stars, forks, contributors, issues, PRs (week delta)
  → [npm API] Weekly download count
  → [Ayrshare API] Social follower counts and engagement
  → [Supabase] Query campaign_signals for week's mention count
  → [Claude API] Generate Community Pulse report
  → [Write File] Save to docs/ops/herald/reports/
  → [Slack] Post summary to #herald-weekly
  → [Gmail] Send full report to frank@
```

---

## Workflow 5: Herald Auto-Announce

**Trigger:** Webhook — GitHub release, milestone, or notable commit
**Purpose:** Auto-generate announcements for product milestones

```
[GitHub Webhook: release/tag]
  → [HTTP Request] Get release notes
  → [Claude API] Generate announcement:
    - X tweet (single, celebration tone)
    - LinkedIn post (professional milestone)
    - Discord message (community celebration)
  → [Supabase] Insert into social_queue (status: draft)
  → [Slack] Notify #herald-review
```

---

## Workflow 6: Talent Magnet

**Trigger:** Cron — 3x/week (Mon, Wed, Fri at 14:00 UTC)
**Purpose:** Employer brand content for attracting top talent

```
[Cron 3x/week]
  → [Claude API] Generate content from pillars:
    - "Building in public" updates
    - Tech stack deep dives
    - Team culture / creator philosophy
    - Open source contribution highlights
  → [Supabase] Insert into social_queue (status: draft, campaign: talent)
  → [Slack] Notify #herald-review
```

---

## API Keys Required

| Service | Key | Status | Monthly Cost |
|---------|-----|--------|-------------|
| Ayrshare | `AYRSHARE_API_KEY` | Planned | $29/mo (Business) |
| Apify | `APIFY_API_KEY` | Planned | Free tier (30 runs/mo) |
| Octolens | `OCTOLENS_API_KEY` | Planned | $15/mo (Pro) |
| n8n | Self-hosted or `N8N_API_KEY` | Planned | Free (self-hosted) |
| Resend | `RESEND_API_KEY` | Planned | Free tier (100/day) |

**Total estimated: ~$44/month for full Herald automation stack**

---

## Setup Order

1. Install n8n (Docker or npm) — `docker run -d -p 5678:5678 n8nio/n8n`
2. Sign up for Ayrshare, connect social accounts
3. Create Apify actors for Twitter/Reddit/HN scraping
4. Import workflow templates into n8n
5. Configure Supabase webhook endpoints
6. Set up Slack channels: #herald-brief, #herald-alerts, #herald-review, #herald-weekly
7. Test each workflow individually
8. Enable cron triggers
