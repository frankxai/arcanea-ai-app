---
title: MOC — Reflective Council
aliases: ["council", "reflective council", "six roles"]
tags: [moc, council, prompt-os]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Reflective Council — Map of Content

The six-role thinking system that enriches every captured prompt. Roles map onto 12 Chosen + Lumina Queen — no new agent surface.

## Roles

- **Observer** — writes `Pattern Cluster` + `Energy Score`. Maps to Nyx (Archivist).
- **Strategist** — writes `Drift Flag`. Maps to Thalos (Strategist).
- **Distiller** — Notion formula. Promotes to Library on Replay≥3 or Hero+Shipped.
- **Coach** — Sonnet @ 0.3. Temperature for consistency. Writes `Coach Suggestion`.
- **Counter-Coach** — Sonnet @ 0.8. Temperature for divergence. Naval's loyal opposition. Must beat Coach ≥1×/week or role is decorative.
- **Connector** — Sonnet. Writes `Cross-Brand Link`. Connector role answers "where does this apply in a different brand?"
- **Brief Composer** — Sonnet. Produces Daily + Weekly Brief. Never pads. Skinny = truth.

## Cadence

| Time | Role(s) | Output |
|---|---|---|
| 02:15 | `/prompt-harvest` drain | Captured Prompts rows ready |
| 05:00 | Observer Agent | Cluster + Energy written |
| 05:15 | Strategist Agent | Drift Flag written |
| 05:30 | Coach + Counter + Connector (Cowork) | Coach Suggestion + Counter Coach + Cross-Brand Link written |
| 07:00 | Brief Composer (Cowork) | Daily Brief → `02-Briefs/daily/` + Notion + Slack |
| Sun 08:05 | Brief Composer (weekly) | Weekly Brief → `02-Briefs/weekly/` + Notion + OSS draft |
| Sun 11:45 | Distiller + curation | Library promotions |

## Counter-Coach tuning

Temperature 0.8 is load-bearing. Below 0.5 and Counter says the same thing as Coach. Above 1.0 and Counter produces tautologies. The rule: **Counter must propose a meaningfully different path, not a rhetorical reversal.**

When Counter cannot produce a meaningfully different path, Brief Composer writes "Coach stands" — which itself is a verdict, not a skip.

## Success metrics

- Counter wins ≥1/week (beats Coach on a Top-3 Move)
- Cross-brand links ≥5/month
- Daily briefs produced 7/7 days — no skips
- Weekly Brief ships every Sunday — no skips

## Related

- [[MOC-Prompt-OS]]
- [[../05-Atoms/concepts/counter-coach-rule]]
- [[../meta/prompt-os-v1.4.0-architecture]]
