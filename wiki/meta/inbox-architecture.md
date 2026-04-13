---
title: Inbox Architecture — Single Source, Many Surfaces
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: active-build
links: [second-brain-buildout-plan, semantic-map-at-scale, agent-protocol]
---

# Inbox Architecture

One INBOX. Many downstream projections. If a capture surface is not `ARC-INBOX`, it is either (a) a projection (b) a temporary buffer that drains to `ARC-INBOX` within 24 hours.

The current state is fragmented: ideas hit Obsidian, Legendary Brain's Brain Gems, Notion random pages, phone notes, Slack DMs, the Arcanea content pipeline, and chat history. Nothing is canonical. This is the failure mode the semantic map cannot survive. Fix first.

## The Rule

**Every new idea, task, or capture — regardless of source — lands in Linear `ARC-INBOX` within 24 hours.**

`ARC-INBOX` is the only legitimate source-of-truth inbox. Everything else is a buffer that drains here.

## The Linear ARC-INBOX Project

**Project name:** `ARC-INBOX — Unified Capture`
**Workspace:** Arcanea (existing Linear workspace)
**Team:** Frank (solo)
**Status:** Create in Phase 2

**Statuses:**
- `Inbox` — raw capture, unprocessed
- `Triaged` — has been seen, tier and brand assigned
- `Routed` — moved to destination project (and linked back)
- `Dropped` — explicitly decided not to pursue, archived

**Required labels on every inbox item:**
- **Tier:** `T1` / `T2` (T0 never enters Linear)
- **Brand:** `ARC` / `FX` / `SIS` / `MUS` / `BIZ`
- **Type:** `idea` / `task` / `bug` / `content` / `decision` / `reference`
- **Source:** `voice` / `slack` / `chat` / `obsidian` / `legendary-brain` / `web` / `manual`

**Required fields:**
- Title (imperative if task, noun-phrase if idea/reference)
- Description (1-3 sentences minimum; what would future-Frank need to remember this?)
- Related wiki article (link if exists; empty if new)

## Capture Surfaces (Buffers That Drain to ARC-INBOX)

### 1. Voice — primary for ideas on the move
- **Tool:** iOS Voice Memos or dedicated voice capture app with Whisper transcription
- **Drain:** Phone-to-Drive pipeline (Notion page 32126ac2) → daily triage extracts to ARC-INBOX
- **Ritual:** 9am triage scans `/FrankX/` `/Arcanea/` `/Music/` `/Academy/` Drive folders

### 2. Chat / Claude sessions — ideas mid-conversation
- **Tool:** Cowork chat history
- **Drain:** Frank says "add to inbox" → agent writes Linear issue via MCP
- **Ritual:** Any session producing an unused idea ends with "add to inbox" prompt

### 3. Slack — cross-team / cross-brand capture
- **Tool:** Slack channels (all brands)
- **Drain:** Any message starred/bookmarked → weekly Sunday harvest → ARC-INBOX
- **Ritual:** `⭐` reaction = "triage this"

### 4. Obsidian — personal vault capture
- **Tool:** Obsidian daily note template with `## To Triage` section
- **Drain:** `/harvest` skill (Phase 3) reads the section, creates inbox items, clears the section
- **Ritual:** Weekly Sunday

### 5. Legendary Brain Brain Gems — Frank's primary idea funnel
- **Tool:** Notion DB `collection://e233c01d-6ec7-4cb4-bb38-57599877354f`
- **Drain:** Weekly scan — any Brain Gem with status `Funnel` moves to ARC-INBOX with back-link
- **Ritual:** Sunday weekly review

### 6. Web / reading — captured articles, research
- **Tool:** Browser bookmark "Add to Inbox" with Chrome MCP / manual
- **Drain:** Chrome MCP → creates Linear issue with URL + excerpt
- **Ritual:** On-demand during reading sessions

### 7. Manual — anything else
- **Tool:** Linear quick-create (CMD+K)
- **Drain:** Direct to ARC-INBOX
- **Ritual:** Whenever

## The Daily Triage Ritual (9am)

**Duration target:** 15 minutes max. If longer, the inbox is broken.

**Steps:**

1. **Open** Linear ARC-INBOX, filter status=Inbox, sorted by created DESC
2. **Process each item** using the flow below — don't skip, don't "come back to it"
3. **Target:** zero items in Inbox status by 9:15am. Everything moves.

### The 3-Decision Flow

For each inbox item, one of three decisions:

**A. Drop.** Not pursuing. Mark `Dropped`. Log brief reason in description. Done.

**B. Route.** Belongs to an existing project. Actions:
  1. Set Brand label
  2. Change Project from ARC-INBOX to destination project (e.g., `Arcanea`, `FrankX.ai`, `SIS`)
  3. Assign to correct cycle
  4. Change status from `Inbox` → `Routed`
  5. If it's an idea that touches the wiki, add a `wiki-candidate` label

**C. Park.** Needs more thought but not dead. Change status to `Triaged`, move to `ARC-INBOX` "Parked" cycle (a long-running cycle with no deadline), revisit weekly on Sunday.

### Triage Heuristics

- **If < 2 minutes to do → do it now, don't route.** Triage is not an excuse to defer 1-minute actions.
- **If duplicate of existing item → link and drop.** Use Linear's "relates to" relations.
- **If it's a reference (URL, fact, quote) → route to Notion `Resources Library` (collection://364dd882), drop the Linear issue.**
- **If it's a decision needing more thought → park AND open a wiki/decisions/*.md draft.** The draft compels writing, which forces clarity.
- **If it's a milestone candidate → route + add `ship-it` label.** `/ship-it` skill picks these up.

## Inbox Bankruptcy Protocol

If `ARC-INBOX` has >100 items in `Inbox` status, declare bankruptcy:

1. Bulk-select all items older than 14 days
2. Move to `Dropped` with reason `inbox-bankruptcy-YYYY-MM-DD`
3. Create a single Linear issue: `Post-mortem: inbox bankruptcy on {date}` — what broke the daily ritual?
4. Resume daily triage the next morning

Bankruptcy is not failure — it's honesty. The ritual failed; the system is still sound.

## Automation Hooks (Phase 2)

### `/inbox-triage` skill

Invoke at 9am (or any time). Agent:
1. Queries Linear for all ARC-INBOX items with status=Inbox
2. For each, proposes A/B/C decision based on description heuristics
3. Presents to Frank as a single batch review: "Here are 12 items. I propose: Drop 3, Route 7, Park 2. Confirm or override."
4. On confirm, executes all moves in parallel
5. Reports completion with link to each routed destination

**Target interaction:** Frank opens Cowork, says "triage inbox", reviews once, confirms. Ritual complete in 3 minutes.

### `/capture` skill

Universal inbox writer. Invocable from any session.

```
/capture "Build an AI DJ skill that generates transition playlists" --brand MUS --type idea
```

Agent:
1. Creates Linear issue in ARC-INBOX with status=Inbox
2. Assigns labels (Brand=MUS, Type=idea, Tier=T2, Source=chat)
3. Scans wiki for related articles, adds `Related:` links to description
4. Returns issue URL

**Target interaction:** Frank has an idea mid-task, says `/capture "..."`, keeps working.

### Scheduled tasks

- **Daily 9am** — `inbox-triage-reminder` task pings Frank if inbox has items
- **Sunday 10am** — `weekly-drain` task scans all buffer surfaces (Drive, Obsidian, Brain Gems) and bulk-creates inbox items
- **Sunday 11am** — `inbox-sweep-reminder` triggers weekly review of Parked items

## Anti-Patterns to Avoid

- **Multiple inboxes.** If you find yourself creating a second inbox "just for X", stop. The daily triage handles branching.
- **Auto-routing without triage.** Don't let the `/capture` skill skip Inbox status and go straight to a project. Triage is the quality gate.
- **Hoarding ideas unprocessed.** An idea in Inbox for 14 days is dead. Drop with dignity.
- **Using the wiki as inbox.** The wiki is the cold store. Inbox → wiki article is a Route, not a Park.
- **Capturing at triage time.** Triage decides destinations; capture happens continuously via buffers. Don't confuse the two.

## Relationship to Other Systems

| System | Relationship to Inbox |
|--------|----------------------|
| Wiki (this dir) | Destination for `wiki-candidate` items |
| Notion hubs | Destination for team-knowledge-type items |
| Legendary Brain | **Buffer** (Brain Gems drains into Inbox weekly) |
| Obsidian | **Buffer** (daily note drain) |
| Linear other projects | Destination for `Routed` items |
| `.auto-memory/` | Not an inbox — reserved for decisions/feedback |
| Wiki decisions | Destination for `decision` type items with draft doc |

## Success Metric

The second brain is healthy when:
- Daily triage takes < 15 minutes
- Inbox never exceeds 30 items
- Every routed item has a link back to the original inbox source
- New ideas are captured within 30 seconds of being thought
- Nothing important is forgotten

If any of these fail for 3 consecutive days, rerun the triage ritual from scratch and consider bankruptcy.

---

*The inbox is not a list. It is the gate through which all knowledge enters the second brain. Guard it well.*
