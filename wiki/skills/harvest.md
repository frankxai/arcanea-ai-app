---
title: /harvest — Weekly Multi-Source Drain
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: spec
priority: P2
effort: 1 day
links: [README, ../meta/inbox-architecture]
---

# /harvest

**Purpose:** Weekly Sunday pass that drains buffer surfaces (Obsidian daily notes, Legendary Brain Brain Gems, Google Drive phone-to-drive intake, Slack starred messages) into `ARC-INBOX`. Keeps the inbox as the single source of capture truth.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "harvest", "weekly review", "sunday triage", "drain my inbox buffers", or on scheduled Sunday 10am task.

## Usage

```
/harvest
/harvest --source obsidian,legendary-brain
/harvest --dry-run
```

## Sources

### 1. Obsidian daily notes
- Path: `{obsidian-vault}/Daily/YYYY-MM-DD.md`
- Scan: last 7 days
- Extract: content under `## To Triage` heading
- Action: create ARC-INBOX issue per line, clear the section in the daily note

### 2. Legendary Brain — Brain Gems
- Notion DB: `collection://e233c01d-6ec7-4cb4-bb38-57599877354f`
- Filter: status=`Funnel` OR tag contains `#wiki`
- Extract: title + description
- Action: create ARC-INBOX issue, add Notion back-link, update Brain Gem status to `Routed`

### 3. Google Drive phone-to-drive intake
- Folders: `/FrankX/`, `/Arcanea/`, `/Music/`, `/Academy/`
- Scan: files created in last 7 days
- Extract: file name + first 200 chars if text-based
- Action: create ARC-INBOX reference-type issue with Drive link

### 4. Slack starred messages
- Scan: messages with `⭐` reaction by Frank in last 7 days
- Extract: message text + channel + permalink
- Action: create ARC-INBOX issue, remove the star reaction after routing

### 5. Morning Briefs (Notion)
- Scan: Morning Brief pages under Git Hygiene
- Extract: any items marked `@action` or `TODO`
- Action: create ARC-INBOX issue, archive brief after harvest

## Behavior

For each source, fetch → extract → dedupe against existing ARC-INBOX (title similarity) → bulk-create.

Report summary:
```
Harvest — 2026-04-10

Sources scanned:
  Obsidian daily notes: 23 items extracted, 18 new (5 duplicates)
  Legendary Brain: 7 new Brain Gems routed
  Drive phone intake: 12 files, 3 routed
  Slack starred: 4 messages routed
  Morning Briefs: 6 action items, 4 routed

Total new ARC-INBOX items: 35
Review inbox → /inbox-triage
```

## Acceptance Criteria

- [ ] Runs in < 2 minutes for full scan
- [ ] Dedupes against existing inbox
- [ ] Handles source failures gracefully (continues with others)
- [ ] Clears/updates source after routing (Obsidian section, Notion status, Slack star)
- [ ] Never loses data — if routing fails, source remains untouched

## Dependencies

- Obsidian vault path configured
- Notion MCP connected (for Brain Gems + Morning Briefs)
- Google Drive MCP connected
- Slack MCP connected
- Legendary Brain Idea Funnel DB ID confirmed
- `/inbox-triage` deployed (to process what harvest creates)

## Scheduled Task

```yaml
name: weekly-harvest
schedule: "0 10 * * 0"  # Sundays 10am (same slot as repo-triage)
command: /harvest
notify_on: success
```

Note: runs alongside `/repo-triage`. Consider running harvest first, then repo-triage, or parallelizing.

---

*The harvest is the second brain's heartbeat. Miss it for 3 weeks and the buffers clog.*
