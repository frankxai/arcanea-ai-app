---
name: creator-dashboard
description: Show a visual creator dashboard with all active projects, recent creations, progress stats, and next actions. Use when the creator wants to see their current state, track progress, understand what they've built, or decide what to work on next. Combines data from git, Linear, Notion, and local project graph.
---

# Creator Dashboard — Your Creative Intelligence At A Glance

## What This Shows

A unified view of everything a creator has going:

### 1. Active Projects
Pull from Linear + planning-with-files:
```
## Active Projects

| Project | Status | Last Activity | Next Action |
|---------|--------|--------------|-------------|
| [name]  | [phase]| [date]       | [task]      |
```

### 2. Recent Creations
Pull from git log + creation service:
```
## Recent Creations (Last 7 Days)

| Creation | Type | Project | Date |
|----------|------|---------|------|
| [name]   | image/doc/music | [project] | [date] |
```

### 3. World-Building Progress
Pull from canon, lore files, character registry:
```
## World State

- Characters: [count] created, [count] canon-locked
- Locations: [count]
- Lore entries: [count] ([count] canon, [count] staging)
- Word count: [total] across all collections
```

### 4. Content Pipeline
Pull from content staging:
```
## Pipeline

| Content | Stage | Next Step |
|---------|-------|-----------|
| [title] | draft | polish    |
| [title] | ready | publish   |
```

### 5. Stats
```
## Creator Stats

- Total creations: [count]
- This week: [count]
- Projects active: [count]
- Words written: [count]
- Images generated: [count]
- Days active: [count]
```

### 6. Suggested Next Actions
AI-ranked based on what's most impactful:
1. [highest priority from Linear]
2. [most stale project that needs attention]
3. [content ready to publish]

## Data Sources

| Data | Source | How |
|------|--------|-----|
| Projects | Linear MCP | `list_issues` with project filter |
| Creations | Git log | `git log --since="7 days ago"` |
| Lore | `.arcanea/lore/` | File count + word count |
| Content | Content staging dirs | File inventory |
| Stats | Combined | Aggregate all above |
| Notion | Notion MCP | Search + fetch Dev Hub |
