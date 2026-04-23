---
title: /prompt-harvest — Nightly Hot→Cold Drain
domain: meta
created: 2026-04-20
updated: 2026-04-20
author: claude
status: spec
priority: P1
effort: 1 day
links: [README, prompt-capture, prompt-curate, ../meta/prompt-os]
---

# /prompt-harvest

**Purpose:** Drain `Obsidian/prompts/{YYYY-MM-DD}.md` into the Notion **📥 Captured Prompts** DB nightly. Parses each `##`-delimited block into a structured row with Agent, Project, Outcome, Yield Quality, Artifact URL, Tags. Leaves the hot file intact as the append-only archive.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "harvest prompts", "drain prompt log", "sync prompts to Notion", or on scheduled nightly task at 02:00 UTC.

## Usage

```
/prompt-harvest                          # yesterday's file
/prompt-harvest --date 2026-04-19        # specific day
/prompt-harvest --range 7                # last 7 days (catch-up)
/prompt-harvest --dry-run                # preview without writing
```

## Target DB

- Notion data source: `collection://5621839b-bf0d-453f-8937-d6e9dc8991d0` (📥 Captured Prompts)
- Parent page: Empire Dashboard `33c26ac2-b7f6-8162-a085-fa1fa9917883`

## Parse contract

Each Obsidian `##` heading block → one Notion row:

| Obsidian field | Notion column |
|---|---|
| `## HH:MM \| {agent} \| {project} \| {topic}` | Prompt (title=topic), Captured At, Agent, Project |
| `**Prompt:**` body | (full prompt stored as page content) |
| `**Outcome:**` | Outcome SELECT |
| `**Artifact:**` | Artifact URL |
| `**Tags:**` (hashtags) | Tags MULTI_SELECT |
| `**Yield:**` | Yield Quality SELECT |

## Dedupe

Before insert: match against Captured Prompts where `Captured At = {date} AND Agent = {agent} AND Project = {project} AND Prompt (title) LIKE '{topic}'`. Skip duplicates.

## Goal / Sprint auto-linking

After insert, best-effort relation:
- If `#gate-N` tag present → link to active Goals with matching Gate
- If captured within active Sprint window → link to that Sprint Plan
- If Artifact URL matches `linear.app/arcanea/issue/ARC-*` → write to Linear Issue URL column

## Report

```
Prompt Harvest — 2026-04-20 (for 2026-04-19)

Hot-tier file: /obsidian/prompts/2026-04-19.md
Entries parsed: 23
Duplicates skipped: 2
Rows created: 21

Agent breakdown:
  Claude Code: 14
  Cowork: 5
  Claude.ai: 2

Outcome breakdown:
  Shipped: 12
  Iterated: 7
  Discarded: 2

Auto-linked:
  Goals: 8 rows linked
  Sprints: 18 rows linked
  Linear: 5 rows linked

Hero-quality candidates (flagged for /prompt-curate): 3
```

## Acceptance Criteria

- [ ] Idempotent: re-running same day produces zero new rows
- [ ] Handles missing `**Yield:**` gracefully (defaults to unset)
- [ ] Parses malformed blocks without crashing (logs to inbox as triage item)
- [ ] Completes in <2 minutes for 100-entry day
- [ ] Never modifies Obsidian source file
- [ ] Emits report to stdout + posts to `#ops` Slack channel

## Dependencies

- Obsidian vault path + read access
- Notion MCP connected (write access to Captured Prompts DB)
- Linear MCP (optional, for auto-linking)
- `/prompt-capture` deployed (produces hot-tier input)

## Scheduled Task

```yaml
name: nightly-prompt-harvest
schedule: "0 2 * * *"  # 02:00 UTC daily
command: /prompt-harvest
notify_on: success_with_heroes
```

---

*Cold storage is where prompts become searchable. Drain daily or the buffer clogs.*
