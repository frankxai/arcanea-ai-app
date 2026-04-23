---
title: 01-Daily/ — Daily Notes
---

# 01-Daily/

One note per day. Auto-generated structure; Frank fills in. Path: `{year}/{month}/{YYYY-MM-DD}.md`.

## Template

```
---
title: {YYYY-MM-DD}
tags: [daily]
day-of-week: {dow}
---

# {YYYY-MM-DD}

## Yesterday
- What closed
- What slipped

## Today
- Top 3 (from Daily Brief)
- One thing I'd skip if fire

## Notes
- Sparks, observations, micro-decisions

## Tomorrow's setup
- What future-Frank needs
```

## Interlocks

- `/capture --daily` creates the daily note
- Morning Daily Brief lands in `02-Briefs/daily/` — daily note links to it
- Sparks captured through the day land in `04-Sparks/` — daily note aggregates relevant ones at end-of-day

## Rule

Daily notes are throwaway scaffolding. Anything durable gets promoted to an atom. `/vault-atlas` flags daily notes with orphan content > 14 days old for harvest-or-archive.
