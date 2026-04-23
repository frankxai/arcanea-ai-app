---
title: Counter-Coach Rule
aliases: ["counter coach", "loyal opposition", "adversarial pairing"]
tags: [concept, council, prompt-os]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Counter-Coach Rule

**Every Coach upgrade ships paired with an opposite path, or it doesn't ship.**

## Why it matters

Coach at temperature 0.3 produces coherent upgrades — which is also the failure mode. Coherence without adversarial test is consensus, not insight. Naval: *"The best way to learn is to have a smart, loyal opposition."*

Counter-Coach runs Sonnet 4.6 at temperature 0.8 after Coach completes. It doesn't disagree for sport — it proposes the opposite viable path. When no meaningfully different path exists, Counter says "Coach stands" — which is a verdict, not a skip.

## Where it shows up

- [[../../meta/prompt-os-v1.4.0-architecture]] §13.12 — the canonical rule
- `Arcanea/wiki/skills/counter-coach.md` — the skill spec
- Daily Brief structure includes ⚔️ COUNTER row for every Coach suggestion
- [[../../00-MOCs/MOC-Council]] — role table

## The tuning

- Temperature below 0.5 → Counter says the same thing as Coach
- Temperature above 1.0 → Counter produces tautology
- 0.8 is the observed sweet spot (revisit after 30 days of data)

## Success metric

Counter-Coach beats Coach ≥1×/week on a Top-3 Move. If Counter doesn't win across 3 weeks, the role is decorative and either the temperature is wrong or the Coach isn't leaving enough room for alternatives.

## Related

- [[../people/naval-ravikant]]
- [[energy-score]]
- [[drift-flag]]
- [[dag-provenance]]
