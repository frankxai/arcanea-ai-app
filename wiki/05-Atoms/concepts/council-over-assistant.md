---
title: Council Over Assistant
aliases: [adversarial roles, multi-agent, specialized agents]
tags: [atom, agents, prompts]
status: stable
domain: agents
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/agentic-autonomy-ladder]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Council Over Assistant

A Council of specialized agents with adversarial roles beats one generalist assistant.

A single Claude instance asked "what should I build next?" will give you a sensible answer. A Council of six roles—Strategist (direction), Maker (feasibility), Skeptic (objections), Sage (long-term), Sage-of-Doubt (counter-intuition), Scribe (clarity)—will surface tradeoffs you'd never consider alone.

The multiplier: each agent is optimized for one lens. The Strategist doesn't defend existing bets; the Skeptic doesn't fall in love with ideas. The Maker doesn't pontificate; the Sage doesn't rush. The Council's output is not one answer but a richer decision surface.

The architecture (from Prompt OS v1.4.0):
1. **Strategist** — direction, optionality, long-term compounding
2. **Maker** — execution, feasibility, time-to-ship
3. **Skeptic (Counter-Coach)** — objections, failure modes, why this is wrong
4. **Sage** — wisdom, pattern-matching, "this worked in 1987, it will again"
5. **Sage-of-Doubt** — uncertainty, unknowns, what we can't see
6. **Scribe** — clarity, communication, translation to action

Each runs independently on the same prompt, then a metadata-layer synthesizes conflicts. The Strategist says "build the platform." The Skeptic says "the market timing is wrong." Both are correct. The synthesis is: "build the platform for internal use first, launch to market in Q3."

The leverage: this is not "multiple opinions," which is noisy. This is "complete coverage of decision space," which is coherent. One voice misses 80% of the landscape. Six voices with roles cover 95%.

## Related
- [[../concepts/agentic-autonomy-ladder]] — how to empower them
- [[../../00-MOCs/MOC-Patterns]] — decision structures
