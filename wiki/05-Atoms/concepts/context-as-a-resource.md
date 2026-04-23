---
title: Context as a Resource
aliases: [token budget, context management, metered cognition]
tags: [atom, memory, software]
status: stable
domain: memory
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/memory-is-not-knowledge]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Context as a Resource

Context is metered like RAM; treat every token as cost, prune aggressively, reload on demand.

LLM context windows are not unlimited. Even with 200K tokens available, using all of them in a single request is wasteful. Every token has latency cost and reasoning cost. More context doesn't always mean better reasoning; it often means slower reasoning with more opportunity for hallucination.

The heuristic: load only the context that's directly relevant to the current task.

For Arcanea's vault (200+ atoms):
- A request about "wealth" loads the Wealth MOC (12 atoms) + related frameworks (~5 files), not the full vault.
- A request about "building a product" loads the Software + Business domains (~10 atoms) + the startup playbook, not MOCs about health or relationships.
- A request about "hiring" loads nothing because Arcanea is solo (no hiring context exists).

The pruning discipline:
1. **Layer 0 (in every request):** The task itself, plus the current date/context
2. **Layer 1 (based on task):** The relevant MOC + 3-5 atoms
3. **Layer 2 (if needed):** Related frameworks or adjacent domains
4. **Layer 3 (rarely):** Full-vault context only for synthesis tasks or end-of-week reviews

Most requests are solved with Layer 1 (15-30 KB). Few need Layer 2 (50-80 KB). Virtually none need the full 200+ KB.

The payoff: faster responses, cheaper inference, lower hallucination rate, clearer reasoning traces. The cost: you have to manually manage what context to load instead of relying on the system to "read everything."

Frank's practice: use tags and wikilinks as the *index*, not as a crutch for loading everything. Before you request, ask "what's the minimum set of atoms/frameworks I need?" Then load only that.

## Related
- [[../concepts/memory-is-not-knowledge]] — what you're managing
- [[../../00-MOCs/MOC-Patterns]] — information architecture
