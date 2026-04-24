---
title: Energy Score
aliases: ["energy", "energy score", "pivot signal"]
tags: [concept, observer, prompt-os]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Energy Score

**1–5 scale. Observer writes it. High-energy × high-drift = pivot signal.**

## Why it matters

Drift Flag alone is ambiguous — drift can be exploratory (good) or scattered (bad). Energy Score disambiguates. Drift + Energy = pursuit signal. Drift + no Energy = dissipation.

| Score | Signal |
|---|---|
| 1 | Drained, obligatory writing |
| 2 | Routine, no lift |
| 3 | Present, working |
| 4 | Engaged, flow adjacent |
| 5 | Peak creative, rare |

## Where it shows up

- Notion Captured Prompts → `Energy Score` column (number 1–5)
- `prompt-os-dashboard` Cowork artifact → Energy×Drift scatter plot
- Weekly Brief — if a cluster shows Energy≥4 + Drift high for 3 days, flag as pivot signal

## How Observer assigns

Observer (Notion Custom Agent, 05:00) reads the prompt text + session context + ambient signals (Frank's typing cadence if available, timestamp relative to rituals). Outputs 1–5.

Calibration check: Frank reviews 10 sample scores/month, adjusts Observer instructions if drift.

## The anti-pattern

Don't use Energy Score as a habit tracker. Not all prompts need high energy — routine operational prompts (score 2) are fine. The signal is in **clusters** where energy spikes unexpectedly.

## Related

- [[counter-coach-rule]]
- [[drift-flag]]
- [[../../00-MOCs/MOC-Patterns]]
