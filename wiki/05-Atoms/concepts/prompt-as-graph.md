---
title: Prompt as Graph
aliases: [prompt DAG, lineage, prompt inheritance]
tags: [atom, prompts, software]
status: stable
domain: prompts
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../concepts/counter-coach-rule-echo]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Prompt as Graph

Prompts are edges in a directed acyclic graph of concepts, not strings in a library. Lineage matters more than wording.

Most prompt engineers treat prompts as strings: "Here's my system prompt." "Here's my user message." They store them in a folder or database. This is folder thinking, not graph thinking.

Graph thinking: every prompt is an edge in a DAG. That edge connects a problem-node to a solution-node through a series of intermediate concept-nodes. The prompt's *lineage*—how it evolved, what concepts it depends on, what newer prompts supersede it—is more valuable than the prompt text itself.

Example: the Prompt OS v1.4.0 Council prompt is not a single text. It's a graph:

```
[General Reasoning Framework]
    ↓
[Role-Specific Reasoning]
    ├→ [Strategist Role]
    ├→ [Maker Role]
    ├→ [Skeptic (Counter-Coach) Role]
    ├→ [Sage Role]
    ├→ [Sage-of-Doubt Role]
    └→ [Scribe Role]
        ↓
    [Synthesis Protocol]
        ↓
    [Output Formalization]
```

Each node is a prompt. But the value is in the DAG structure, not in any single node. When you want to upgrade the Skeptic role, you don't just edit its prompt; you:

1. Fork the node (create a new version)
2. Test against the same inputs that fed the old version
3. Compare outputs (use Counter-Coach to highlight deltas)
4. Promote only if improvement is clear
5. Update edges pointing downstream (synthesis protocol now receives new Skeptic output)

The leverage: you can A/B test prompts systematically because they're explicitly versioned and tracked. You can share prompt lineage with others because you're sharing the graph, not a string.

Frank's Prompt Library (building): 50+ prompts, all versioned, all in a DAG, lineage metadata on each.

## Related
- [[../concepts/counter-coach-rule-echo]] — how to test prompt edges
- [[../../00-MOCs/MOC-Patterns]] — prompt design
