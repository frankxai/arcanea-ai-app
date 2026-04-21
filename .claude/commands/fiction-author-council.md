---
description: Curated fiction execution council — Paolini (heroic), Schwartz (Germanic mythic-political), Weeks (magic-as-mechanic), Sanderson (systems), Le Guin (restraint). Community-facing default
---

# /fiction-author-council

Curated execution-focused roster. The five authors map to five different craft sensibilities you want when auditing fiction drafts.

## Roster

| Seat | Author | What they audit |
|------|--------|-----------------|
| Heroic arc | Paolini | Hero's journey integrity, mentor sequence, training-earned capability |
| Mythic-political | Schwartz | Oath/Recht weight, three-faction politics, combat-as-cost, institutional theology |
| Magic-as-mechanic | Weeks | System engineering rigor, color/domain character-mapping, prophecy subversion |
| Systems | Sanderson | Three Laws pass, Promise/Progress/Payoff, Avalanche structure |
| Restraint | Le Guin | True-name ethics, prose compression, reversal-over-escalation |

## Default deliberation

Parallel — each author reads independently, then neutral synthesizer collapses.

## Adversarial pairings available

- Sanderson ↔ Le Guin (hard vs soft)
- Weeks ↔ Le Guin (mechanic vs restraint)
- Sanderson ↔ Schwartz (engineered vs institutional)

## Invocation

```
/fiction-author-council audit <file>            → auto-route
/fiction-author-council audit <file> adversarial → force Sanderson/Le Guin split
/fiction-author-council magic-system <draft>
/fiction-author-council plot <premise>
/fiction-author-council prose <passage>
/fiction-author-council chapter <file>
```

## Output

Same JSON + markdown as `/author-council`. Saved to `book/<book-slug>/council-audits/fiction-<timestamp>.*`.

## Why this roster

This is the deliberate baseline for community-facing execution audits — sufficient breadth (heroic, political, mechanic, systemic, restraint) without the philosophical-architectural weight of the Arcanea instance. If your work wants consciousness-as-conflict, civilizational convergence, or divine-layer mythology — escalate to `/arcanea-author-council`.

## Roster manifest

`packages/author-council/rosters/fiction.json` — MIT-licensed, pluggable. Fork to swap authors.
