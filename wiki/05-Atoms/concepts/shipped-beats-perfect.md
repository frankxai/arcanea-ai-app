---
title: Shipped Beats Perfect
aliases: [launch velocity, production feedback, iterative refinement]
tags: [atom, software, business]
status: stable
domain: software
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/invariants-over-rules]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Shipped Beats Perfect

Shipped in production beats perfect in staging. The gap is where learning lives.

This is Frank's core engineering principle. A product at 80% completion in production teaches you more in one week than 99% completion in staging teaches you in four weeks.

Why: staging is a simulation. Production is reality. Users use the product in ways you didn't anticipate. They find edge cases. They ignore features you spent weeks on. They demand features you didn't think of. Data in production is honest; feedback in staging is polite.

The corollary: you don't ship "broken" things. You ship "incomplete but coherent" things. The invariants must hold (no data loss, no security holes, no 500 errors). But 20% of the features can be missing, and you should ship.

Frank's deployment timeline (Arcanea, Apr 2026):
- **Week 1:** Core surfaces (arcanea.ai, frankx.ai) shipped. ~60% feature complete.
- **Week 2:** Prompt OS shipped to production (in use by Frank). ~70% feature complete.
- **Week 3:** Extension shipped (Chrome Web Store pending). ~50% feature complete.
- **Week 4:** GenCreator shipped (gencreator.ai live). ~65% feature complete.

Not a single product was "perfect." All four have live users asking for changes daily. And in three weeks, Frank has learned more than he would in three months of staging-only work.

The rule: if you've been in staging for >6 weeks and you're still below 80%, ship anyway. The remaining 20% will be clearer once users are touching it.

## Related
- [[../concepts/invariants-over-rules]] — what can't slip
- [[../../00-MOCs/MOC-Patterns]] — software delivery
