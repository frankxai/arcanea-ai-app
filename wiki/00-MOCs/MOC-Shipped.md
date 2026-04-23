---
title: MOC — Shipped
aliases: ["shipped", "public", "oss"]
tags: [moc, shipped, public]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Shipped — Map of Content

Every public surface. Every OSS prompt. Every published brief. This is the **compounding evidence layer** — the reason the OS earns its keep.

## Public OSS

- `frankxai/starlight-os/` — Open-tier prompts + briefs + `/llms.txt`
- `frankxai/starlight-os-pro/` — Pro-tier template pack (private)
- `frankxai/arcanea-ai-app/` — Arcanea production
- `frankxai/arcanea/` — Arcanea OSS mirror
- `frankxai/frankx.ai-vercel-website/` — FrankX production
- `frankxai/FrankX/` — FrankX private dev

## Published briefs (as of 2026-04-21)

First Weekly Brief lands 2026-04-26. This section auto-populates after first ship.

## Shipped prompts (public)

Populated by `/ship-public` on successful commit to `frankxai/starlight-os/prompts/`.

Counter-Coach engagement + replay count + shipped-outcomes shown on each public prompt.

## Weekly ship cadence

| Cadence | Channel | Auditor |
|---|---|---|
| Daily | `02-Briefs/daily/` + Slack | Brief Composer |
| Sunday 08:05 | `02-Briefs/weekly/` + Notion draft | Frank reviews |
| Sunday review | OSS commit → `briefs/` | Frank approves |
| On demand | `/ship-public PR-X` | Frank triggers |

## Compound metrics

Target at T+90:
- ≥12 Weekly Briefs shipped (1/week, no skips)
- ≥50 public OSS prompts with proof-of-compound (replay count + shipped outcomes)
- ≥3 prompts where Counter-Coach beat Coach documented publicly
- ≥1 Atelier client cited the OSS funnel as their discovery path

Rule: **no vanity metrics.** If a metric can't be audited by a stranger in 60 seconds, it doesn't ship here.
