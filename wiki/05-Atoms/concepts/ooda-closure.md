---
title: OODA Closure
aliases: ["ooda", "observe orient decide act", "move shipped date"]
tags: [concept, prompt-os, operations]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# OODA Closure

**Every Council Move has a closing write-back. No ship date = no data.**

## Why it matters

Boyd's OODA loop (observe, orient, decide, act) fails in knowledge work because "act" has no commit point. Daily Briefs surface Top-3 Moves — but if Frank ships a Move and nothing writes it back, the Council learns nothing.

Fix: every Top-3 Move gets a Linear tag `council-move-{date}-{n}`. When Frank closes the Linear issue, `milestone-scanner` writes `Move Shipped Date` on the Captured Prompt. Weekly Brief computes the Council's hit rate automatically.

## The write-back chain

```
Daily Brief Top-3 Move
  → Linear issue tagged council-move-*
    → Frank ships, closes issue
      → milestone-scanner webhook fires
        → Captured Prompt row Move Shipped Date = now
          → Weekly Brief hit-rate calculation picks it up
```

## Where it shows up

- [[../../meta/prompt-os-v1.4.0-architecture]] §13.10 Action Loop
- Notion Captured Prompts DB → `Move Shipped Date` column
- `Arcanea/scripts/milestone-scanner.py`

## Failure modes

- Milestone-scanner down 3 days → alert, Council data integrity at risk
- Frank closes Linear without the tag → Move doesn't count; retrain tagging habit
- Move takes >7 days to ship → flag in Weekly Brief as stalled

## Related

- [[counter-coach-rule]]
- [[energy-score]]
- [[../frameworks/compound-interest-of-thinking]]
