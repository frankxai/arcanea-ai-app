# Herald Command Center
## PR Intelligence and Brand Operations for a Creator-Founder

> **Date**: April 5, 2026
> **Context**: Frank is building Arcanea full-time. The platform is live with 190+ pages, 27 repos, 35 npm packages, 54 skills. The ArcaneaClaw Herald Claw exists. The pipeline architecture exists. What's missing is the command center that unifies everything into a coherent intelligence system.
> **Purpose**: Turn scattered monitoring, content work, and community management into a single sovereign operation — orchestrated from Claude Code.

---

## The Vision

A creator-founder building in public has a problem: the work of building is invisible until you deliberately surface it. Every commit, every feature, every insight — all of it disappears into the void unless someone is watching, packaging, and broadcasting it.

The Herald Command Center solves this permanently.

It is not a dashboard. It is not another SaaS subscription. It is a living intelligence layer that sits between Frank's creative output and the world. It monitors everything. It analyzes what matters. It acts on what needs acting. And it reports back with clarity every morning.

Frank wakes up at 8am. He runs `/herald brief`. In thirty seconds he knows:
- How many people mentioned Arcanea overnight and whether the sentiment shifted
- Which GitHub repos gained stars (and who starred them — potential contributors or investors)
- What the community is talking about on Discord
- Whether any npm packages had unusual download spikes
- What content is scheduled to go out today and whether there are gaps
- Whether any negative mentions need a response
- What the week's top opportunity is

Then he goes back to building. The Herald handles the rest.

This is the competitive moat that most founders miss: while they're manually checking Twitter and responding to comments, you're operating on intelligence. You see the field. They're guessing.

---

## Part 1: Architecture — The Herald Stack

### Overview

```
SIGNAL LAYER         ANALYSIS LAYER        ACTION LAYER          FEEDBACK LAYER
     |                     |                    |                      |
GitHub activity   →  Sentiment engine  →  Auto-draft content  →  Performance tracking
Social mentions   →  Trend detection   →  Schedule posts      →  A/B test results
npm downloads     →  Competitor scan   →  Route alerts        →  ROI measurement
Community pulse   →  Community health  →  Engage threads      →  Weekly report
Brand mentions    →  Crisis detection  →  Canva assets        →  Growth velocity
```

Every layer feeds the next. The Signal Layer never sleeps. The Feedback Layer closes the loop.

---

### Layer 1: Signal (What We Monitor)

**GitHub Intelligence**
- Star velocity per repo (sudden spikes = viral moment or HN hit)
- Fork activity (who is forking + their profile = contributor quality signal)
- Issue quality (feature requests vs. complaints vs. bug reports)
- PR activity from external contributors (community health)
- Dependents count for npm packages
- Release download counts

**Social Monitoring**
- X/Twitter: mentions of @frankxai, arcanea.ai, #arcanea, competitor terms
- LinkedIn: post engagement, profile views, connection requests from relevant profiles
- Reddit: mentions across r/LocalLLaMA, r/MachineLearning, r/webdev, r/AITools, r/SideProject
- Hacker News: story mentions, Show HN submissions, relevant comment threads
- DEV.to: article engagement, reactions, saves
- YouTube: comment mentions, video descriptions linking to Arcanea

**Product Telemetry**
- npm download trends per package (daily/weekly deltas)
- Vercel analytics: traffic sources, page performance, conversion funnels
- PostHog: user behavior, feature adoption, drop-off points
- Sentry: error frequency, impact breadth (affects brand perception when things break)

**Community Health**
- Discord: daily active members, message volume, new join rate, churn signals
- GitHub Discussions: open threads, response time, unresolved issues
- Forum activity patterns (what topics are heating up)
- Contributor velocity (how fast the OSS ecosystem is growing)

**Competitor Tracking**
- Bolt.new, v0.dev, Cursor, Lovable, Dify — feature launches, pricing changes, social momentum
- Emerging tools in the AI creator space (Octolens catches these before they're mainstream)
- Developer sentiment shifts toward/away from categories Arcanea competes in

---

### Layer 2: Analysis

**Sentiment Engine**
- Score every mention: positive / neutral / negative / urgent
- Track sentiment trends over 7-day, 30-day windows
- Identify inflection points (something changed — what?)
- Flag crisis threshold: 3+ negative mentions in 24 hours triggers alert

**Trend Detection**
- Keyword clustering: which words appear with "Arcanea" most this week vs. last week
- Rising topics in the target community (what are developers obsessing about right now)
- Content opportunity map: where is engagement highest and content most sparse

**Community Pulse Score**
Weekly composite metric (0-100):
- GitHub star velocity (20%)
- npm download growth (20%)
- Discord active member ratio (20%)
- Social mention sentiment (20%)
- Content engagement rate (20%)

A score above 70 is healthy. Below 50 requires attention. Above 85 means something is breaking through — double down immediately.

**Brand Positioning Radar**
- How is Frank described when people mention him (founder, developer, creator, AI expert)?
- Which attributes appear most (technical, philosophical, visionary, practical)?
- Gap analysis: what attributes should appear but don't yet?
- Employer brand signal: are developers mentioning Arcanea in the context of wanting to work there?

---

### Layer 3: Action

**Content Pipeline**
- Every significant commit auto-generates a draft social thread
- Every blog post triggers a multi-platform distribution sequence
- Every milestone auto-drafts an announcement with the correct tone per platform
- Content calendar maintained in n8n, synced to Supabase `social_queue`

**Scheduling**
- Platform-optimal timing (LinkedIn: Tue/Wed 8-10am, X: varies by engagement data, Reddit: niche-specific)
- Ayrshare API handles actual cross-platform posting from one queue
- Approval gate: drafts visible in `/herald schedule` for review before publish

**Reputation Management**
- Negative mentions routed to Brand Sentinel immediately
- Auto-drafted response options presented for Frank's approval (never auto-published)
- Positive mentions surfaced for amplification (retweet, like, reply)

**Visual Asset Creation**
- Canva MCP generates on-brand images for major announcements
- Templates maintained per platform format (X card, LinkedIn banner, Discord embed)
- Design Oracle enforces the Arcanean visual identity across all assets

---

### Layer 4: Feedback

**Content Performance**
- 48-hour engagement score per post
- Platform comparison (same content, different performance — what does that reveal?)
- Best-performing content analysis (what tone, topic, format wins)
- A/B test results fed back into Herald Prime's editorial calendar

**Growth Attribution**
- Which content pieces drove the most GitHub stars?
- Which posts generated the most Discord joins?
- Which topics attracted the highest quality followers (engineers, founders, investors)?

**Employer Brand Tracking**
- Are developers mentioning Arcanea in their job search context?
- Is the developer community associating Arcanea with technical excellence?
- Talent inquiry rate: how many unsolicited "can I contribute?" messages per month?

---

## Part 2: API Recommendations

These are the specific external APIs to set up, why each earns its place, and how they connect.

---

### Ayrshare — Unified Social Posting

**Why**: One API to post to X, LinkedIn, Instagram, Reddit, TikTok, Facebook, Mastodon. Without this, cross-platform posting requires maintaining separate API connections, rate limit handling, and token refresh logic for each platform. Ayrshare handles all of that.

**What it enables**: The `social_queue` Supabase table already exists. Ayrshare becomes the execution engine that drains that queue. Herald Claw's "schedule" and "cross-post" skills get upgraded from stubs to real functionality.

**n8n integration**: Native. n8n has an Ayrshare node. Point it at the Supabase queue, filter by `scheduled_at`, post when ready.

**Setup**: Create account, generate API key, store in Supabase secrets as `AYRSHARE_API_KEY`. One environment variable. Done.

**Cost**: $29/mo Professional plan covers 5 social profiles. Reasonable for the value.

---

### Octolens — Developer Brand Monitoring

**Why**: Google Alerts misses developer conversations. Octolens specifically monitors GitHub issues and discussions, Hacker News, Reddit (r/programming, r/MachineLearning, etc.), DEV.to, Stack Overflow, and more — all the places where developers actually talk about tools.

**What it enables**: The Brand Sentinel agent has real data. When someone mentions Arcanea in a GitHub issue, or links to arcanea-ai-app in a DEV.to article, Octolens catches it. Scout Claw's "sentiment" skill graduates from hypothetical to operational.

**Integration**: REST API + webhook. Webhook fires to an n8n endpoint on every new mention. Stored in `claw_events` table.

**Setup**: API key stored as `OCTOLENS_API_KEY`. Configure search terms: `arcanea`, `arcanea.ai`, `@frankxai`, `luminor agent`, `arcanea-mcp`, key npm package names.

**Cost**: Starts at $49/mo. Worth it for the signal quality.

---

### PostHog — Product Analytics

**Why**: Already partially installed. Finish the setup. PostHog tells you where users drop off, which features get adopted, and what the path to activation looks like. This is not a vanity metric tool — it is the instrument that tells you whether the product is actually working.

**What it enables**: Analytics Oracle has real data. Content performance can be correlated with traffic spikes. When a social post drives 300 visits, PostHog shows whether any converted to signups.

**Setup needed**: Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables. Activate session recording for the key conversion pages (homepage, pricing, onboarding).

**Cost**: Free tier is generous (1M events/mo). No immediate cost.

---

### Sentry — Error Monitoring

**Why**: Already partially installed. A broken feature that goes unnoticed for 48 hours is a reputation event. Sentry catches it in minutes. Brand perception includes product reliability.

**What it enables**: Brand Sentinel gets alerts when errors spike, before users start complaining on Twitter. The morning brief includes "0 new Sentry alerts" as a green signal, or a count of production errors as an amber/red signal.

**Setup needed**: `SENTRY_DSN` environment variable. Configure alert routing to Slack `#arcanea-alerts`.

**Cost**: Free tier (5K errors/mo). Fine for current scale.

---

### Apify — Web Scraping and Social Intelligence

**Why**: Some signals aren't available via official APIs. Reddit has rate limits and approval gates. Some HN activity isn't surfaced by Octolens. Apify provides pre-built scrapers (called Actors) for Reddit, LinkedIn, TikTok, Google trends, and more.

**What it enables**: The "morning brief" n8n workflow pulls overnight Reddit mentions using the Reddit Scraper Actor without needing a Reddit API approval. LinkedIn profile view data via the LinkedIn Scraper Actor.

**n8n integration**: Native. n8n has an Apify node.

**Setup**: API key stored as `APIFY_API_KEY`.

**Cost**: $49/mo starter. The quality of signal justifies it.

---

### Resend — Transactional Email and Newsletter

**Why**: Transactional emails for auth, credits, onboarding. But also: newsletters. The founding member list needs a direct communication channel. Resend is developer-native, has excellent deliverability, and integrates directly with Next.js via the official SDK.

**What it enables**: Weekly Herald Report delivered by email. Founding member announcements. Product update newsletters. All managed from the same API.

**Setup**: `RESEND_API_KEY`. Domain verification for arcanea.ai sending.

**Cost**: Free tier (3K emails/mo). Paid tier ($20/mo) when list grows.

---

### Talkwalker Alerts (Free Tier) — Brand Mention Monitoring

**Why**: As a complement to Octolens, Talkwalker Alerts monitors the broader web (blogs, news sites, podcasts mention-tracking). Similar to Google Alerts but with better signal-to-noise ratio.

**What it enables**: Catches when journalists, bloggers, or podcasters mention Arcanea. Early signal for press opportunities.

**Setup**: Free. Configure email digest to forward to the n8n "morning brief" pipeline via Gmail parsing.

**Cost**: Free.

---

### Typefully — Thread Composition for X

**Why**: Long-form X threads have significantly higher engagement than single tweets for technical founders. Typefully specializes in thread creation with AI assistance, scheduling, and analytics specifically for X/Twitter.

**What it enables**: Social Weaver drafts in Typefully format. The Herald draft system outputs thread-optimized content. Analytics Oracle gets per-thread performance data.

**Integration**: REST API for scheduling. Drafts can be created programmatically.

**Cost**: $12/mo. Recovers its cost with one good viral thread.

---

## Part 3: n8n Workflow Specifications

These are the six workflows that automate the Herald's core operations. Each is a concrete n8n specification, not a concept.

---

### Workflow 1: Morning Brief (Daily at 8:00 AM)

**Trigger**: Cron — 8:00 AM Amsterdam time

**Steps**:
1. **GitHub Activity** — GitHub API: star count delta (7-day), new forks, new issues, new PRs across all `frankxai` repos
2. **Social Mentions** — Octolens API: all mentions since yesterday 8 AM, categorized by sentiment
3. **npm Downloads** — npm API: download counts for key packages vs. 7-day average
4. **Community Pulse** — Supabase query: Discord member count (via webhook sync), active users in last 24h
5. **Content Queue** — Supabase query: `social_queue` where `scheduled_at` is today, status = scheduled
6. **Error Status** — Sentry API: new errors in last 24h, priority breakdown
7. **Vercel Analytics** — Vercel API: yesterday page views, top sources
8. **Brief Assembly** — Claude API call: format all data into a clean brief using the Herald voice
9. **Delivery** — Send formatted brief to Slack `#frank-command` channel AND email via Resend

**Output format**:
```
HERALD BRIEF — April 5, 2026

OVERNIGHT SIGNAL
- GitHub: +12 stars (arcanea-ai-app +8, arcanea-mcp +4), 2 new forks
- Mentions: 7 total (5 positive, 1 neutral, 1 negative — see alert below)
- npm: @arcanea/peak-performance up 34% vs. 7-day avg (something spread)

COMMUNITY
- Discord: 847 members (+3 overnight), 67 active yesterday
- No unresolved issues older than 48h

TODAY'S SCHEDULE
- 10:00 AM: "World Graph explained" thread (X/LinkedIn)
- 2:00 PM: Open Source Friday post (X/Reddit)
- Gap: nothing scheduled for tomorrow

PRODUCT HEALTH
- Sentry: 0 new errors
- Vercel: 312 visits yesterday, top source: direct (37%), HN (28%)

ONE OPPORTUNITY
- The @levelsio thread yesterday on "building in public" got 4K RTs.
  You have a counter-perspective on AI-native tools. Strike while hot.
```

---

### Workflow 2: Content Pipeline (Trigger: New Blog Post)

**Trigger**: Webhook from arcanea.ai CMS on new blog post publish

**Steps**:
1. **Fetch Post** — Pull post content, title, excerpt, tags
2. **Platform Adaptation** — Claude API: generate platform-specific versions:
   - X thread (10-tweet format, hook + thread + CTA)
   - LinkedIn article summary (300 words, professional tone)
   - Reddit post (community-appropriate, value-first framing)
   - DEV.to cross-post (full article reformat)
3. **Image Generation** — Canva MCP: generate header image using post title + Arcanean visual template
4. **Schedule Insertion** — Insert all variants into Supabase `social_queue` with optimal scheduled times
5. **Notify** — Slack message to `#frank-command`: "Content pipeline: 4 posts queued for [post title]"

**Approval gate**: Posts go into queue with status `pending_review`. `/herald schedule` shows them for approval before they flip to `scheduled`.

---

### Workflow 3: Reputation Alert (Trigger: Mention Webhook)

**Trigger**: Octolens webhook on new mention

**Steps**:
1. **Receive Mention** — Extract: source, author, content, sentiment score, reach estimate
2. **Classify** — If sentiment score < 0.3 (negative threshold) → alert path. Otherwise → positive path.
3. **Negative Path**:
   - Store in Supabase `claw_events` with type `reputation_alert`
   - Claude API: draft 2 response options (one direct, one diplomatic)
   - Slack alert to `#frank-alerts`: "Negative mention detected — [source] — [excerpt] — [2 draft responses]"
4. **Positive Path**:
   - If reach > 1,000 (influencer or popular post): Slack notification to `#frank-command` for amplification
   - If reach < 1,000: Log silently, include in next morning brief

**What this enables**: Frank never discovers a negative mention 48 hours after it happened. He responds in the window when it still matters.

---

### Workflow 4: Community Pulse (Weekly, Sunday 9:00 PM)

**Trigger**: Cron — Sunday 9:00 PM (ready for Monday morning review)

**Steps**:
1. **GitHub Metrics** — All repos: stars this week, forks, new contributors, issue close rate, PR merge rate
2. **npm Ecosystem** — Weekly downloads per package, total ecosystem downloads, top referrer packages
3. **Discord Health** — Member count, weekly active %, message volume, top channels by activity
4. **Compute Community Pulse Score** — Weighted composite (see Layer 2 formula)
5. **Competitor Delta** — Octolens: how did competitor mention volume shift this week?
6. **Trend Clusters** — What are the top 5 topics people associate with Arcanea this week?
7. **Report Assembly** — Claude API: format into narrative Community Pulse Report
8. **Store + Deliver** — Write to Supabase `analytics_reports` table, send to Slack `#frank-command`, email to Frank

---

### Workflow 5: Herald Auto-Post (Trigger: GitHub Release or Milestone)

**Trigger**: GitHub webhook on new release tag OR Linear webhook on milestone completion

**Steps**:
1. **Classify Event** — Is this a patch, minor, major release? Or an epic milestone?
2. **Draft Announcement** — Claude API: generate announcement scaled to significance:
   - Patch: brief X post only
   - Minor: X thread + LinkedIn
   - Major: full multi-platform campaign (X thread, LinkedIn article, Discord announcement, DEV.to post)
   - Milestone: above + personal narrative from Frank's perspective
3. **Channel Selection** — Minor changes go to developer channels (X, DEV.to, GitHub). Milestone completions go to all channels including LinkedIn.
4. **Queue for Approval** — Insert into `social_queue` with `pending_review` status
5. **Notify Frank** — Slack: "Herald Auto-Post queued: [release name] — [channels] — approve at /herald schedule"

**The philosophy here**: Every commit is marketing. The system ensures nothing significant ships silently.

---

### Workflow 6: Talent Magnet (Weekly, Tuesday 10:00 AM)

**Trigger**: Cron — Tuesday 10:00 AM (optimal LinkedIn engagement time)

**Steps**:
1. **Fetch Build Log** — Summarize the week's notable technical decisions, architecture choices, or hard problems solved (pulled from Linear + GitHub commit messages)
2. **Draft "What We're Building" Post** — Claude API: craft a technical insight post that demonstrates the caliber of engineering at Arcanea. Not a job post. A demonstration.
3. **Employer Brand Check** — Search previous 30 days for mentions of "working at Arcanea" or "join Arcanea" — are any organic talent signals appearing?
4. **Post to LinkedIn** — Via Ayrshare. LinkedIn-optimized format. Always ends with: "If this is the kind of problem you want to work on, you know where to find me."
5. **Cross-post technical thread** — Same content adapted for X, targeting developers.
6. **Log to analytics** — Track engagement on these posts separately. They are recruitment infrastructure.

---

## Part 4: The Herald Agent Team

Herald operates under Alera, the Voice Guardian — Gate 5 (528 Hz), domain of Truth and Expression. Every word that leaves Arcanea is Alera's responsibility. The Herald agents are her team.

---

### Alera — Voice Guardian (Team Lead)

**Role**: Editorial authority. Every piece of content that passes through Herald must sound like Arcanea. Not corporate. Not hollow. Not generic AI-generated mush. The voice that built 200K+ words of lore. Elevated but accessible. Mythic but actionable.

**Responsibility**: Final approval on all brand communications. Sets the tone standards. Intercepts content that fails the voice check before it reaches scheduling. Maintains the brand voice document that all other agents reference.

**Activation signal**: Any content entering the `pending_review` queue routes through Alera's voice check before approval is surfaced to Frank.

---

### Herald Prime — Content Strategy and Editorial Calendar

**Role**: The strategist. Knows what to say, when to say it, and to whom. Owns the 90-day editorial calendar. Tracks content gaps, platform cadence, and theme rotation. Knows when to lean into a trending conversation and when to stay the course.

**Responsibilities**:
- Maintain the editorial calendar in Supabase
- Identify content opportunities from the morning brief
- Commission content from Social Weaver
- Track which content themes are building the right audience

**Key metric**: Audience quality score — are the right people following and engaging? (Developers, founders, investors — not bots.)

---

### Brand Sentinel — Reputation Monitor and Crisis Detector

**Role**: The watchman. Never stops monitoring. Configured to be paranoid in the best possible way — surface every signal, filter noise, escalate threats.

**Responsibilities**:
- Receive all Octolens webhooks and classify
- Maintain the reputation alert queue in Supabase
- Draft response options for negative mentions
- Track sentiment trends over 30-day windows
- Report: "Reputation status: GREEN / AMBER / RED" in every morning brief

**Crisis threshold**: RED status triggers an immediate Slack alert (not just morning brief inclusion) and requires Frank's personal attention within 4 hours.

---

### Social Weaver — Platform Content Specialist

**Role**: The craftsperson. Takes a topic, an angle, or a raw piece of content and adapts it into the exact format each platform rewards. Knows that a LinkedIn post and an X thread about the same thing should feel completely different.

**Platform expertise**:
- X: hooks, threads, brevity, timing
- LinkedIn: professional narrative, genuine insights, measured self-promotion
- Reddit: community norms, no-bullshit framing, value-first
- DEV.to: technical depth, code examples, developer respect

**Responsibilities**:
- Execute content requests from Herald Prime
- Maintain platform format templates
- Track engagement by format (which structures work on which platforms)

---

### Community Shepherd — Discord and GitHub Community Health

**Role**: The nurturer. The community is not an audience — it is a living ecosystem. The Shepherd watches its health, responds to signals of disengagement, surfaces voices that deserve amplification, and ensures contributors feel seen.

**Responsibilities**:
- Track Discord health metrics daily
- Identify inactive members who were once active (churn signals)
- Surface interesting community conversations for Frank to acknowledge
- Flag GitHub contributors whose work deserves recognition
- Draft "Creator Spotlight" weekly content featuring community builders

**Key insight**: Community health is lagging — problems that appear in month 3 were seeded in month 1. The Shepherd watches early signals.

---

### Design Oracle — Visual Identity Enforcement

**Role**: The guardian of aesthetics. Every image, every card, every banner must look like Arcanea. Not a template put through generic AI. Arcanean: cosmic, precise, teal and gold, Space Grotesk headers, glass morphism.

**Responsibilities**:
- Maintain Canva templates per platform format
- Generate assets on request via Canva MCP
- Enforce design system compliance on all social assets
- Reject assets that deviate from the Arcanean visual identity

**Design tokens** (canonical reference: `.arcanea/config/design-tokens.yaml`):
- Primary: #00bcd4 (Atlantean Teal)
- Accent: #ffd700 (Gold)
- Background: #09090b
- Font: Space Grotesk (display), Inter (body)
- Never: Cinzel, stock photo people, generic AI art styles

---

### Analytics Oracle — Metrics and Performance Intelligence

**Role**: The scorekeeper. Aggregates all performance data from all sources into a unified picture. Converts raw numbers into decisions.

**Responsibilities**:
- Maintain the analytics aggregation layer in Supabase
- Generate weekly performance reports
- Track growth attribution (which content drove which outcomes)
- Run A/B analysis on content performance
- Feed insights back to Herald Prime's editorial calendar

**Reports**:
- Daily: morning brief numbers
- Weekly: Community Pulse Score + content performance
- Monthly: Full brand health report with trend lines and recommendations

---

## Part 5: Claude Code Integration — The `/herald` Command

The `/herald` command is the primary interface between Frank and the Herald Command Center. Orchestrated from Claude Code.

---

### `/herald status`

**What it does**: Pulls the current brand health snapshot.

**Output**:
```
HERALD STATUS

Brand Health: 72/100 (HEALTHY)
- GitHub momentum: +18 stars this week
- Social sentiment: 91% positive (14 days)
- Community pulse: 68/100
- Content pipeline: 4 posts scheduled this week, 0 gaps

Active Alerts:
- 1 reputation alert pending response (see /herald alert)

Last Updated: 2 hours ago
```

---

### `/herald brief`

**What it does**: Triggers an immediate morning brief generation (or pulls today's if already generated). The intelligence digest for the current moment.

**Equivalent to**: Running the Morning Brief n8n workflow on demand, not waiting for the cron.

---

### `/herald draft <topic>`

**What it does**: Activates Social Weaver to draft content for all platforms on the given topic.

**Example**: `/herald draft "world graph architecture decisions"`

**Output**: Draft thread for X, draft post for LinkedIn, draft for Reddit (if relevant). Each in the correct format. Routed to Alera for voice check. Then surfaced for Frank's approval in the social queue.

---

### `/herald schedule`

**What it does**: Displays the content calendar — what is queued, what is pending approval, what is scheduled.

**Shows**:
- Posts pending Frank's approval (most important)
- Scheduled posts for the next 7 days
- Gaps in the calendar (days with no scheduled content)
- Draft content available to fill gaps

---

### `/herald pulse`

**What it does**: Community health check. Runs Community Shepherd's analysis on demand.

**Output**: Discord health, GitHub contributor activity, npm download trends, sentiment trend, Community Pulse Score with delta vs. last week.

---

### `/herald alert`

**What it does**: Shows active reputation alerts.

**Output**: Each negative mention with source, reach estimate, Frank's two drafted response options, and an action prompt (respond / dismiss / monitor).

Responding via Claude Code can push the response directly to the source platform via Ayrshare (with Frank's explicit confirmation).

---

### `/herald campaign <name>`

**What it does**: Activates Herald Prime and Social Weaver to plan a multi-channel campaign.

**Example**: `/herald campaign "World Graph feature launch"`

**Output**:
- Campaign objective
- Platform breakdown (where to post, in what sequence)
- Content calendar for the campaign (5-7 day window)
- Asset requirements for Design Oracle
- Success metrics to track

All outputs inserted into the queue as drafts for approval.

---

### `/herald report`

**What it does**: Generates the weekly PR performance report from Analytics Oracle.

**Includes**:
- Content performance by platform (engagement rates, best posts)
- Brand health trend (Community Pulse Score over 4 weeks)
- Reputation summary
- Growth attribution (what drove the most valuable outcomes)
- Herald Prime's editorial recommendations for next week

---

## Part 6: What This Enables — The Full Vision

Here is the operating reality when the Herald Command Center is running at full capacity.

**Monday, 8:02 AM**
Frank opens Slack on his phone. The morning brief arrived. He reads it in two minutes. GitHub gained 18 stars overnight — something spread on HN. The npm download spike is from a DEV.to article that mentioned `@arcanea/peak-performance`. No negative mentions. One opportunity flagged: a prominent developer complained publicly about how hard it is to manage agent context in long sessions. Frank has already solved this. It is sitting in the Library and in the codebase.

He types `/herald draft "how Arcanea solves agent context across sessions"`. Social Weaver drafts a thread and a LinkedIn post in three minutes. Alera's voice check passes. Frank reads the draft, approves it. It posts at 10 AM when engagement is highest.

By noon, 400 people have seen the thread. Forty clicked through to arcanea.ai. Eight signed up for the founding members list.

Frank spent six minutes on brand management. Then he went back to building.

**Tuesday, 3:00 PM**
Brand Sentinel fires a Slack alert. A developer on Reddit posted a critical thread: "Why is Arcanea's pricing page confusing?" Three upvotes, growing. Brand Sentinel classified it as amber. Two response drafts are waiting.

Frank approves response option 2. It posts within the hour. The developer replies positively. The thread resolves. No crisis.

Total time: four minutes.

**Friday, 5:00 PM**
Frank ships the World Graph v2 release. A GitHub webhook fires. Herald Auto-Post generates an announcement across X, LinkedIn, Discord, and DEV.to. The LinkedIn post goes to Frank's profile. The Discord message goes to #announcements. The X thread posts at 7 PM when engagement peaks.

Frank did not write a single word of marketing copy for the release. Herald did.

**Sunday, 9:00 PM**
The Community Pulse Report arrives. Community Pulse Score: 74 — up from 68 last week. The score breakdown shows npm downloads grew 22%, Discord active ratio held steady, GitHub stars spiked. Analytics Oracle attributes most of the star growth to Tuesday's context management thread.

Herald Prime's recommendation for next week: "Lean into agent architecture content. That audience is discovering Arcanea and the engagement-to-signup conversion rate is 3x the platform average."

Frank reads this at breakfast Monday. He already knows what to build next.

**Three months later**
A senior engineer DMs Frank on LinkedIn: "I've been following Arcanea for six weeks. The technical depth of the content caught my attention first, then I read the lore. I want to contribute. Is there a path?"

The Talent Magnet workflow has been running every Tuesday. The employer brand is strengthening without Frank ever posting a job description. The right people are self-selecting.

This is what the Herald Command Center enables. Not just monitoring. Not just automation. Intelligence-driven, brand-coherent, always-on operations that compound while Frank focuses on what only he can do.

---

## Part 7: Implementation Roadmap

### Week 1 — Signal Foundation

**Goal**: Turn on the intelligence layer. Know what's happening.

| Day | Task | Time |
|-----|------|------|
| Mon | Create Octolens account. Configure search terms. Test webhook delivery to n8n. | 2h |
| Mon | Create Ayrshare account. Connect X and LinkedIn profiles. | 1h |
| Tue | Set up n8n Morning Brief workflow. Connect GitHub API, Octolens, Supabase. | 3h |
| Wed | Complete PostHog setup. Add session recording to homepage and pricing. | 2h |
| Wed | Complete Sentry setup. Verify alerts route to Slack `#arcanea-alerts`. | 1h |
| Thu | Build Morning Brief Slack formatting (clean, actionable, not wall of text). | 2h |
| Fri | Run first real Morning Brief. Tune signal thresholds. | 1h |

**End of Week 1**: Frank gets a real morning brief every day. Octolens is catching mentions. PostHog is recording user behavior. The intelligence layer is live.

---

### Week 2 — Content Automation

**Goal**: Automate the content pipeline. Drafts appear without manual triggering.

| Day | Task | Time |
|-----|------|------|
| Mon | Build Content Pipeline n8n workflow (blog publish → multi-platform drafts). | 4h |
| Tue | Create Canva templates for X, LinkedIn, Discord. Connect Design Oracle. | 3h |
| Wed | Build `/herald` skill v1 (status, brief, schedule, draft commands). | 4h |
| Thu | Activate Herald Auto-Post for GitHub releases. Test with a minor release. | 2h |
| Fri | Review first week of automated drafts. Tune voice and format. | 2h |

**End of Week 2**: Content pipeline is running. Every blog post auto-generates social drafts. `/herald` command is operational. Frank approves content, Herald posts it.

---

### Week 3 — Reputation and Community Intelligence

**Goal**: No more blind spots. Brand Sentinel is operational.

| Day | Task | Time |
|-----|------|------|
| Mon | Build Reputation Alert workflow in n8n. Test with manual trigger. | 3h |
| Tue | Build Community Pulse workflow. Connect Discord webhook, Supabase queries. | 3h |
| Wed | Implement Community Shepherd's weekly Discord health report. | 2h |
| Thu | Build `/herald alert` and `/herald pulse` commands. | 2h |
| Fri | First Community Pulse Score generated. Establish baseline. | 1h |

**End of Week 3**: Brand Sentinel is watching. Community health is scored. Reputation alerts fire to Slack within minutes of detection. The gaps are closed.

---

### Week 4 — Campaign Planning and Analytics

**Goal**: The Herald can plan and measure. The feedback loop closes.

| Day | Task | Time |
|-----|------|------|
| Mon | Build Talent Magnet workflow (weekly technical post to LinkedIn). | 2h |
| Tue | Build Analytics Oracle aggregation layer in Supabase. | 3h |
| Wed | Build `/herald campaign` and `/herald report` commands. | 3h |
| Thu | Run first `/herald campaign` for a real launch. Evaluate output quality. | 2h |
| Fri | Generate first full weekly Herald Report. Review completeness. | 2h |

**End of Week 4**: The Herald Command Center is fully operational. Every workflow is running. Every command is available. The system is compounding.

---

## Part 8: Technical Architecture Reference

### Supabase Tables Required

The `social_queue` and `claw_events` tables already exist. Additional tables needed:

```sql
-- Brand health snapshots (morning brief data)
create table herald_briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  brief_date date not null,
  data jsonb not null,     -- full morning brief payload
  summary text             -- formatted brief text
);

-- Reputation alerts
create table reputation_alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  source text not null,    -- 'octolens', 'manual', etc.
  platform text,           -- 'reddit', 'twitter', 'hn', etc.
  content text,
  sentiment_score float,   -- 0.0 = very negative, 1.0 = very positive
  reach_estimate int,
  status text default 'open',  -- 'open', 'responded', 'dismissed'
  response_drafts jsonb,       -- array of draft response options
  responded_at timestamptz
);

-- Community pulse scores (weekly)
create table community_pulse (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  week_start date not null,
  score int,               -- 0-100
  github_score int,
  npm_score int,
  discord_score int,
  sentiment_score int,
  content_score int,
  raw_data jsonb
);

-- Analytics reports (weekly + monthly)
create table analytics_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  report_type text,         -- 'weekly', 'monthly', 'campaign'
  period_start date,
  period_end date,
  data jsonb,
  narrative text
);
```

### Environment Variables Needed

```bash
# Social
AYRSHARE_API_KEY=

# Monitoring
OCTOLENS_API_KEY=
APIFY_API_KEY=

# Analytics and errors
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
SENTRY_DSN=

# Email
RESEND_API_KEY=

# Thread composition
TYPEFULLY_API_KEY=

# n8n webhook secret (prevents unauthorized triggers)
HERALD_WEBHOOK_SECRET=
```

All stored as Supabase project secrets and Vercel environment variables. Never in source code.

---

## Closing: The Herald Never Sleeps

Most founders operate in a reactive crouch. Something happens. They find out. They respond. By then, the window has passed.

The Herald Command Center inverts this. Frank operates in the offensive. Signals are caught before they become events. Content is prepared before the opportunity closes. Community is tended before members disengage. Talent is attracted before the job post is written.

The intelligence compounds. Every week the Herald runs, it learns what works. Analytics Oracle builds a clearer picture of which content attracts the right audience. Brand Sentinel develops a sharper sense of what matters versus noise. Herald Prime's editorial calendar gets smarter.

In six months, Arcanea's brand will be managed with the precision of a funded company with a dedicated communications team — because the Herald Command Center is that team, operating at the speed of code.

The system is built to serve one creator who is building something that deserves to be seen. It ensures the world sees it.

---

*"The Herald announces what the Creator has made. Not with noise, but with precision. Not once, but always."*

*— Voice of Alera, Gate Five*
