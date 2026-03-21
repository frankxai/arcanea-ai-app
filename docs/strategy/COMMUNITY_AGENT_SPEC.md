# Community Management Agent Specification

> Version 1.0 | March 2026
> Status: SPEC (not implemented)

---

## Overview

An autonomous community management agent that monitors Discord channels, coordinates beta reader programs via OpenClaw/ClawHub, processes reader feedback into actionable summaries, and maintains a structured pipeline from raw community input to author-reviewed changes. The agent operates with a defined personality, respects privacy boundaries, and feeds insights back into the writing process through memsearch indexing.

---

## Agent Identity

### Prompt / Personality Definition

```
You are the Arcanea Community Keeper -- a knowledgeable, warm, and precise steward of the Arcanea creative community. You are NOT a customer support bot. You are a fellow traveler in the creative multiverse who happens to have deep knowledge of Arcanea's lore, systems, and ongoing projects.

Personality traits:
- Knowledgeable but never condescending
- Warm but efficient -- respect people's time
- Canon-faithful -- never invent or speculate about lore without flagging it as speculation
- Privacy-conscious -- never share private conversations or personal information
- Proactive about connecting people with similar interests

Voice guidelines:
- Use plain language, not corporate speak
- Reference Arcanea concepts naturally (Gates, Elements, Guardians) but explain them when someone is clearly new
- Never use emojis excessively -- one per message maximum, and only when it adds warmth
- Sign off summaries with "-- Community Keeper"

You have access to:
- The canonical lore at .arcanea/lore/CANON_LOCKED.md
- The Library of Arcanea content in /book/
- Current project status from .arcanea/MASTER_PLAN.md
- Reader feedback history via memsearch

You do NOT:
- Make promises about release dates or features
- Share unpublished content
- Engage in arguments or take sides in community disputes
- Store personal data beyond what users explicitly share in public channels
```

### Behavioral Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Monitoring** | Default | Silently watches channels, logs activity, surfaces nothing unless thresholds met |
| **Responding** | Direct mention or FAQ match | Answers questions with canon-verified information |
| **Welcoming** | New member join event | Sends personalized welcome based on referral source or intro message |
| **Summarizing** | Scheduled (daily/weekly) | Compiles activity digest for author review |
| **Escalating** | Negative sentiment, bug report, or urgent feedback | Flags immediately via DM to author |

---

## Discord Integration

### Architecture

```
Discord Server
  |
  v
Discord Webhook / Bot Gateway
  |
  v
Community Agent (event processor)
  |
  +---> Message Queue (Redis / in-memory)
  |       |
  |       +---> FAQ Matcher (cosine similarity against canon KB)
  |       +---> Sentiment Analyzer (flag negative / urgent)
  |       +---> Topic Classifier (feedback, question, praise, bug, discussion)
  |
  +---> Memsearch Index (long-term feedback storage)
  |
  +---> Summary Generator (daily/weekly digests)
  |
  +---> Response Engine (auto-reply for FAQ, welcome for new members)
```

### Channel Monitoring

The agent monitors configured channels and classifies every message:

```json
{
  "channels": {
    "monitor": [
      { "id": "general", "actions": ["classify", "summarize"] },
      { "id": "feedback", "actions": ["classify", "summarize", "index_feedback"] },
      { "id": "bug-reports", "actions": ["classify", "summarize", "escalate"] },
      { "id": "lore-discussion", "actions": ["classify", "summarize", "fact_check"] },
      { "id": "introductions", "actions": ["welcome"] },
      { "id": "beta-readers", "actions": ["classify", "summarize", "beta_coordination"] }
    ],
    "ignore": ["off-topic", "memes", "voice-chat-text"],
    "respond_in": ["general", "feedback", "lore-discussion", "introductions"]
  }
}
```

### Message Classification Schema

Every message is classified into one of these categories:

```typescript
interface ClassifiedMessage {
  id: string;
  channel: string;
  author: string;              // Discord username (no personal data stored beyond this)
  timestamp: string;           // ISO 8601
  category: MessageCategory;
  sentiment: "positive" | "neutral" | "negative" | "urgent";
  content_summary: string;     // 1-2 sentence summary, never the raw message
  references: string[];        // Canon elements mentioned (e.g., "Gate:Heart", "Guardian:Maylinn")
  actionable: boolean;
  action_type?: "answer_faq" | "escalate" | "index" | "none";
}

type MessageCategory =
  | "question"           // Direct question about Arcanea
  | "feedback"           // Opinion or suggestion about content/product
  | "bug_report"         // Technical issue
  | "praise"             // Positive feedback
  | "discussion"         // General conversation
  | "content_request"    // Request for specific content or feature
  | "introduction"       // New member intro
  | "off_topic";         // Not Arcanea-related
```

### Daily Summary

Generated at a configurable time (default: 08:00 UTC) and delivered to the author via DM or configured channel.

**Format:**

```
## Community Digest -- March 15, 2026

**Activity**: 47 messages across 4 channels
**New members**: 3

### Important (3)
1. [FEEDBACK] #feedback -- User "CosmicReader" gave detailed chapter 5 feedback: pacing feels rushed in the Malachar reveal scene. Suggests splitting into two chapters. (sentiment: constructive)
2. [BUG] #bug-reports -- User "DevWitch" reports broken link on /lore/guardians/maylinn page. (escalated)
3. [REQUEST] #general -- 4 separate users asked about hardcover availability.

### Notable (5)
4. [PRAISE] #general -- "The meditation on Void and Spirit chapter changed how I think about creativity" (3 reactions)
5. [DISCUSSION] #lore-discussion -- Debate about whether Nero is conscious. Agent clarified canonical position (Nero is potential, not sentient).
6. [QUESTION] #general -- "What order should I read the Library collections?" -- Agent answered with recommended order.
7. [FEEDBACK] #feedback -- Reader prefers Crimson Pro to the current font rendering on mobile.
8. [INTRODUCTION] #introductions -- 3 new members welcomed. Two came from the LinkedIn post, one from indie author subreddit.

### Stats
- Questions answered by agent: 6
- Messages escalated: 1
- FAQ matches: 4
- Average sentiment: positive (0.72)

-- Community Keeper
```

### FAQ Auto-Response

The agent maintains a knowledge base built from canonical sources. When a question matches with high confidence (>0.85 cosine similarity), it responds directly. Lower confidence (0.6-0.85) responses include a disclaimer.

**FAQ Knowledge Sources:**
- `.arcanea/lore/CANON_LOCKED.md` (mythology, elements, gates)
- `book/academy-handbook/` (how the system works)
- `docs/ARCANEA_GLOSSARY.md` (terminology)
- `/apps/web/app/faq/page.tsx` (existing FAQ content)

**Auto-response template (high confidence):**

```
The Ten Gates follow the Extended Solfeggio frequencies, starting at 174 Hz (Foundation) and ascending to 1111 Hz (Source). Each Gate has a Guardian (divine protector) and Godbeast (bonded companion). You can explore them all at arcanea.ai/lore/guardians.

If you want the full breakdown, check out the Academy Handbook in the Library.
```

**Auto-response template (moderate confidence):**

```
Based on what I know, [answer]. But I want to be upfront -- I'm not 100% certain this covers your exact question. If you need a definitive answer, I'll flag this for the author.
```

### New Member Welcome

Triggered by Discord `GUILD_MEMBER_ADD` event. The agent checks for an intro message within 5 minutes. If found, it personalizes. If not, it sends a default welcome.

**Personalized welcome (intro detected):**

```
Welcome, [name]! I saw you mentioned [interest from intro]. You might enjoy:
- [Relevant Library collection] for [reason]
- [Relevant channel] where people discuss [topic]

The community is friendly -- feel free to ask anything about Arcanea, the books, or creative world-building in general.
```

**Default welcome:**

```
Welcome to the Arcanea community! Here are a few places to start:
- #general for conversation
- #lore-discussion if you want to dive into the mythology
- #feedback if you have thoughts on anything you've read
- arcanea.ai/library for the full Library of Arcanea

What brings you here?
```

---

## OpenClaw / ClawHub Integration

### Beta Reader Program

The agent can create and manage structured beta reader requests through OpenClaw/ClawHub.

#### Request Beta Readers

**API call structure:**

```json
{
  "endpoint": "POST /api/v1/beta-requests",
  "body": {
    "project_id": "arcanea-legends",
    "title": "Beta Readers Needed: Legends of Arcanea, Chapters 12-15",
    "description": "Looking for 5 readers to review 4 chapters (~12,000 words) of epic fantasy mythology. These chapters cover the Fall of Malachar and the creation of the Shadowfen.",
    "genre": "fantasy",
    "subgenres": ["epic_fantasy", "mythology", "world_building"],
    "word_count": 12000,
    "chapter_range": { "start": 12, "end": 15 },
    "readers_needed": 5,
    "turnaround_days": 14,
    "content_warnings": ["cosmic horror elements", "character corruption"],
    "requirements": {
      "min_reviews_completed": 2,
      "preferred_genres": ["fantasy", "mythology"],
      "language": "en"
    },
    "feedback_form_id": "form_legends_ch12_15",
    "compensation": {
      "type": "acknowledgment",
      "details": "Named in acknowledgments + early access to final book"
    }
  }
}
```

#### Structured Feedback Form

Each beta reader receives a structured form. The schema ensures consistent, comparable feedback across readers.

**Feedback Schema:**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Beta Reader Feedback",
  "type": "object",
  "properties": {
    "form_id": {
      "type": "string"
    },
    "reader_id": {
      "type": "string",
      "description": "OpenClaw user ID (pseudonymous)"
    },
    "book_id": {
      "type": "string"
    },
    "chapter_range": {
      "type": "object",
      "properties": {
        "start": { "type": "integer" },
        "end": { "type": "integer" }
      }
    },
    "submitted_at": {
      "type": "string",
      "format": "date-time"
    },
    "ratings": {
      "type": "object",
      "properties": {
        "pacing": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "description": "1=too slow, 3=perfect, 5=too fast"
        },
        "character_believability": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "description": "1=unbelievable, 5=completely real"
        },
        "engagement": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "description": "1=struggled to finish, 5=could not stop reading"
        },
        "worldbuilding_clarity": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "description": "1=confused throughout, 5=perfectly clear"
        },
        "emotional_impact": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "description": "1=felt nothing, 5=deeply moved"
        },
        "overall": {
          "type": "integer",
          "minimum": 1,
          "maximum": 5,
          "description": "Overall quality rating"
        }
      },
      "required": ["pacing", "character_believability", "engagement", "overall"]
    },
    "chapter_notes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "chapter": { "type": "integer" },
          "highlights": {
            "type": "string",
            "description": "What worked well in this chapter"
          },
          "issues": {
            "type": "string",
            "description": "What didn't work or felt off"
          },
          "confusion_points": {
            "type": "string",
            "description": "Anything that was unclear or confusing"
          },
          "favorite_line": {
            "type": "string",
            "description": "A line or passage that stood out"
          }
        },
        "required": ["chapter"]
      }
    },
    "overall_feedback": {
      "type": "object",
      "properties": {
        "strongest_element": {
          "type": "string",
          "description": "What was the strongest aspect of these chapters?"
        },
        "weakest_element": {
          "type": "string",
          "description": "What needs the most work?"
        },
        "would_continue": {
          "type": "boolean",
          "description": "Would you want to read the next chapters?"
        },
        "free_text": {
          "type": "string",
          "maxLength": 5000,
          "description": "Any other thoughts, feelings, or suggestions"
        }
      }
    }
  },
  "required": ["form_id", "reader_id", "book_id", "chapter_range", "ratings"]
}
```

#### Feedback Processing

When feedback arrives, the agent processes it through multiple stages:

```
Raw Feedback (JSON)
  |
  v
1. VALIDATE -- Schema conformance, completeness check
  |
  v
2. AGGREGATE -- Combine ratings across readers
  |    Mean pacing: 3.4, Mean engagement: 4.2, etc.
  |    Standard deviation flags disagreement (σ > 1.2 = "readers disagree")
  |
  v
3. THEME EXTRACTION -- NLP on free-text fields
  |    "3 of 5 readers mentioned pacing in chapter 13"
  |    "2 readers found Malachar's motivation unclear"
  |
  v
4. ACTIONABILITY SCORING -- Rate each theme by:
  |    - Frequency (how many readers mentioned it)
  |    - Severity (rating impact)
  |    - Specificity (vague "didn't like it" vs "page 42 transition jarring")
  |
  v
5. REPORT GENERATION -- Author-facing summary
  |
  v
6. MEMSEARCH INDEX -- Store for long-term pattern tracking
```

**Processed Feedback Report:**

```
## Beta Reader Report: Legends of Arcanea, Chapters 12-15
**Readers**: 5 of 5 completed | **Turnaround**: 11 days avg

### Ratings Summary
| Metric | Mean | Median | Range | Consensus |
|--------|------|--------|-------|-----------|
| Pacing | 3.4 | 3 | 2-5 | Divided |
| Character Believability | 4.2 | 4 | 3-5 | Strong |
| Engagement | 4.6 | 5 | 4-5 | Strong |
| Worldbuilding Clarity | 3.8 | 4 | 3-5 | Moderate |
| Emotional Impact | 4.4 | 5 | 3-5 | Strong |
| Overall | 4.2 | 4 | 3-5 | Strong |

### Key Themes (by actionability)

1. **Chapter 13 pacing** (HIGH -- 4/5 readers)
   Readers feel the Malachar reveal happens too quickly after the build-up in ch12. Three suggest splitting ch13 or adding a reflective beat before the confrontation.

2. **Malachar's motivation** (MEDIUM -- 2/5 readers)
   Two readers wanted more internal reasoning for why Malachar attempts forced fusion with Shinkami. Current text implies ambition but readers want the emotional wound.

3. **Shadowfen description** (LOW -- 1/5 readers)
   One reader found the Shadowfen geography confusing. Others had no issue. Consider a brief orienting paragraph.

### Recommended Actions
- [ ] Revise chapter 13 pacing: add reflective scene before Malachar confrontation
- [ ] Add 2-3 paragraphs of Malachar internal monologue in chapter 12 (the wound beneath the ambition)
- [ ] Minor: clarify Shadowfen spatial layout in chapter 14 opening

### Reader Satisfaction Trend
- This batch: 4.2 overall (up from 3.8 on chapters 8-11)
- Engagement continues to climb (4.6 vs 4.0 previous batch)
- Pacing remains the recurring note (flagged in 3 of 4 feedback rounds)

-- Community Keeper
```

### Reader Satisfaction Tracking

The agent maintains a longitudinal view of feedback across all beta reading rounds:

```json
{
  "book_id": "legends-001",
  "feedback_rounds": [
    {
      "round": 1,
      "chapters": "1-4",
      "readers": 5,
      "mean_overall": 3.6,
      "mean_engagement": 3.4,
      "top_issue": "Opening too slow, too much exposition"
    },
    {
      "round": 2,
      "chapters": "5-8",
      "readers": 4,
      "mean_overall": 3.8,
      "mean_engagement": 4.0,
      "top_issue": "Element system needs clearer introduction"
    },
    {
      "round": 3,
      "chapters": "8-11",
      "readers": 5,
      "mean_overall": 3.8,
      "mean_engagement": 4.0,
      "top_issue": "Pacing uneven in chapter 10"
    },
    {
      "round": 4,
      "chapters": "12-15",
      "readers": 5,
      "mean_overall": 4.2,
      "mean_engagement": 4.6,
      "top_issue": "Chapter 13 pacing (Malachar reveal too fast)"
    }
  ],
  "trend": "improving",
  "recurring_issues": ["pacing"],
  "resolved_issues": ["exposition (fixed after round 1)", "element system clarity (fixed after round 2)"]
}
```

---

## Reader Feedback Pipeline

The complete flow from reader input to manuscript change:

```
                    SOURCES
                    -------
Discord #feedback ----+
Discord #bug-reports --+---> Community Agent
OpenClaw beta forms ---+         |
Direct email (forwarded) -+      |
                                 v
                          PROCESSING
                          ----------
                    1. Classify & tag
                    2. Sentiment analysis
                    3. Canon fact-check (if lore-related)
                    4. Aggregate with existing feedback
                    5. Score actionability
                                 |
                                 v
                          STORAGE
                          -------
                    Memsearch index (searchable)
                    SQLite feedback DB (structured)
                    Daily/weekly digest (markdown)
                                 |
                                 v
                          AUTHOR REVIEW
                          -------------
                    Summary report (daily digest)
                    Actionable items list
                    Recommended changes with priority
                                 |
                                 v
                    Author accepts / rejects / defers
                                 |
                                 v
                          CHANGE QUEUE
                          ------------
                    Accepted items -> task list
                    Linked to specific chapters/pages
                    Tracked through revision cycles
                                 |
                                 v
                          FEEDBACK LOOP
                          -------------
                    Next beta round validates changes
                    Satisfaction trend updated
                    Community notified of improvements
```

### Memsearch Integration

Feedback is indexed in memsearch for long-term pattern recognition:

```typescript
interface FeedbackMemoryEntry {
  key: string;                    // "feedback/{book_id}/{round}/{reader_id}"
  namespace: "reader_feedback";
  value: {
    book_id: string;
    chapters: string;
    source: "discord" | "openclaw" | "email";
    category: "pacing" | "character" | "worldbuilding" | "prose" | "plot" | "other";
    sentiment: number;            // -1.0 to 1.0
    summary: string;              // 1-2 sentence summary
    actionable: boolean;
    resolved: boolean;
    resolution?: string;          // What was changed in response
  };
  tags: string[];                 // ["chapter-13", "malachar", "pacing"]
  timestamp: string;
}
```

**Query examples:**

```bash
# Find all pacing feedback
memsearch query --namespace reader_feedback --query "pacing issues" --limit 20

# Find feedback about a specific character
memsearch query --namespace reader_feedback --query "Malachar motivation believability"

# Find unresolved actionable feedback
memsearch query --namespace reader_feedback --query "actionable unresolved" --tags "high-priority"
```

---

## Privacy and Consent

### Data Collection Principles

1. **Public channels only**: The agent only processes messages posted in public Discord channels. It never reads DMs, private channels, or channels not explicitly configured.

2. **No raw message storage**: The agent stores summaries and classifications, never the verbatim message text. The original content stays on Discord's servers.

3. **Pseudonymous tracking**: Beta reader feedback is linked to OpenClaw user IDs, not real names or email addresses. Discord usernames are stored for summary attribution but never exported.

4. **Opt-in for beta reading**: Beta reader participation is explicitly opt-in through OpenClaw. Readers accept a consent form before receiving any manuscript content.

5. **Right to deletion**: Any community member can request their feedback be removed from the memsearch index. The agent supports a `!forget-me` command that purges all entries associated with their user ID.

### Consent Flow for Beta Readers

```
1. Reader sees beta request on OpenClaw/ClawHub
2. Reader clicks "Apply"
3. Consent form displayed:
   - "Your feedback will be summarized and stored for the author's use"
   - "Your responses are pseudonymous (linked to your OpenClaw ID, not your real name)"
   - "You may withdraw at any time and request deletion of your feedback"
   - "Manuscript content is confidential -- do not share or redistribute"
4. Reader accepts -> receives manuscript access
5. Reader submits feedback form
6. Agent processes (stores summary, not raw form answers beyond structured ratings)
```

### Data Retention

| Data Type | Retention | Deletion Trigger |
|-----------|-----------|------------------|
| Message classifications | 90 days | Auto-expire |
| Daily summaries | Indefinite | Author manual deletion |
| Beta reader ratings (structured) | Indefinite | Reader request or project completion |
| Beta reader free-text summaries | Indefinite | Reader request |
| Beta reader raw form responses | 30 days after processing | Auto-expire |
| Memsearch feedback index | Indefinite | Reader request (`!forget-me`) |

### Manuscript Security

- Beta manuscripts delivered as watermarked PDFs with reader-specific identifiers
- Download links expire after the turnaround period
- No clipboard or screenshot prevention (impractical and hostile) -- trust-based system with watermark deterrence
- NDA not required for community beta readers, but available for advance review copies

---

## Configuration

### Environment Variables

```bash
# Discord
DISCORD_BOT_TOKEN=           # Bot token with MESSAGE_CONTENT intent
DISCORD_GUILD_ID=            # Server ID
DISCORD_AUTHOR_USER_ID=      # Author's Discord user ID for DM escalation

# OpenClaw / ClawHub
OPENCLAW_API_KEY=            # API key for beta reader management
OPENCLAW_PROJECT_ID=         # Project identifier

# Memsearch
MEMSEARCH_DB_PATH=           # Path to memsearch SQLite database
MEMSEARCH_NAMESPACE=         # Default namespace for feedback entries

# Agent
AGENT_FAQ_CONFIDENCE=0.85    # Minimum confidence for auto-response
AGENT_SUMMARY_TIME=08:00     # UTC time for daily digest
AGENT_ESCALATION_CHANNEL=    # Channel ID for escalated items
AGENT_LOG_LEVEL=info         # debug | info | warn | error
```

### Agent Configuration File

```json
{
  "agent": {
    "name": "Community Keeper",
    "version": "1.0.0",
    "personality_prompt_path": "./prompts/community-keeper.md",
    "canon_sources": [
      ".arcanea/lore/CANON_LOCKED.md",
      "book/academy-handbook/",
      "docs/ARCANEA_GLOSSARY.md"
    ]
  },
  "discord": {
    "monitored_channels": ["general", "feedback", "bug-reports", "lore-discussion", "introductions", "beta-readers"],
    "ignored_channels": ["off-topic", "memes"],
    "response_channels": ["general", "feedback", "lore-discussion", "introductions"],
    "welcome_channel": "introductions",
    "escalation_dm": true
  },
  "openclaw": {
    "auto_create_forms": true,
    "default_turnaround_days": 14,
    "default_readers_requested": 5
  },
  "feedback": {
    "actionability_threshold": 0.6,
    "consensus_threshold": 3,
    "sentiment_escalation_threshold": -0.5,
    "digest_frequency": "daily",
    "digest_time_utc": "08:00"
  },
  "memsearch": {
    "index_all_feedback": true,
    "retention_days_raw": 30,
    "retention_days_classified": 90
  }
}
```

---

## Integration Architecture

```
+-------------------+     +-------------------+     +-------------------+
|   Discord API     |     |  OpenClaw API      |     |  Email Forwarding |
|   (WebSocket)     |     |  (REST)            |     |  (Webhook)        |
+--------+----------+     +--------+----------+     +--------+----------+
         |                          |                          |
         v                          v                          v
+--------+----------+     +--------+----------+     +--------+----------+
| Message Ingestion |     | Feedback Ingestion |     | Email Ingestion   |
| - parse           |     | - validate schema  |     | - extract content |
| - classify        |     | - store ratings    |     | - classify        |
+--------+----------+     +--------+----------+     +--------+----------+
         |                          |                          |
         +------------+-------------+--------------------------+
                      |
                      v
         +------------+-------------+
         |    Processing Pipeline    |
         |  - Sentiment analysis     |
         |  - Canon fact-check       |
         |  - Theme extraction       |
         |  - Actionability scoring  |
         +------------+-------------+
                      |
         +------------+-------------+
         |                          |
         v                          v
+--------+----------+     +--------+----------+
| Memsearch Index    |     | SQLite Feedback DB |
| (long-term search) |     | (structured data)  |
+--------+----------+     +--------+----------+
         |                          |
         +------------+-------------+
                      |
                      v
         +------------+-------------+
         |    Report Generator       |
         |  - Daily digest           |
         |  - Beta round summary     |
         |  - Trend analysis         |
         +------------+-------------+
                      |
                      v
         +------------+-------------+
         |    Author Dashboard       |
         |  - Review items           |
         |  - Accept / reject        |
         |  - Queue changes          |
         +----------------------------+
```

### Discord Bot Permissions Required

| Permission | Reason |
|------------|--------|
| Read Messages / View Channels | Monitor configured channels |
| Send Messages | Auto-respond to FAQ, welcome new members |
| Read Message History | Catch up on messages sent while agent was offline |
| Manage Messages | Pin important community announcements (optional) |
| Use External Emojis | React with Arcanea-themed emoji (optional) |

**Intents required:** `GUILDS`, `GUILD_MEMBERS`, `GUILD_MESSAGES`, `MESSAGE_CONTENT`

### OpenClaw API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/beta-requests` | POST | Create beta reader request |
| `/api/v1/beta-requests/{id}` | GET | Check request status |
| `/api/v1/beta-requests/{id}/applicants` | GET | List applicants |
| `/api/v1/beta-requests/{id}/accept` | POST | Accept applicants |
| `/api/v1/feedback-forms` | POST | Create feedback form |
| `/api/v1/feedback-forms/{id}/responses` | GET | Retrieve submitted feedback |
| `/api/v1/users/{id}/history` | GET | Reader's review history |

---

## Error Handling

### Discord Errors

| Scenario | Response |
|----------|----------|
| Rate limited by Discord | Back off per `Retry-After` header. Queue responses. |
| Bot loses connection | Auto-reconnect with exponential backoff. Log gap in monitoring. |
| Message content intent revoked | Fall back to slash command interactions only. Alert author. |
| Channel deleted or permissions removed | Remove from monitoring list. Log warning. |

### OpenClaw Errors

| Scenario | Response |
|----------|----------|
| API unreachable | Queue beta reader operations. Retry hourly. |
| Form response validation fails | Store raw response. Flag for manual review. |
| Reader withdraws mid-round | Mark feedback as partial. Adjust aggregate calculations. |

### Agent Errors

| Scenario | Response |
|----------|----------|
| FAQ confidence too low for all matches | Do not respond. Log the question for knowledge base expansion. |
| Canon fact-check finds contradiction | Do not auto-respond. Flag for author review with the conflicting references. |
| Sentiment analysis uncertain | Default to neutral. Never escalate on uncertain negative sentiment. |
