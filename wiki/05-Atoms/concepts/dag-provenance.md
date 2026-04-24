---
title: DAG Provenance
aliases: ["parent prompt", "dag", "lineage"]
tags: [concept, prompt-os, architecture]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# DAG Provenance

**Every prompt is a node. Every replay is an edge. The graph is the audit.**

## Why it matters

Flat capture ("I wrote 800 prompts this month") produces no insight. Graph capture ("these 20 prompts have 10 children each and 3 shipped outcomes") surfaces compound leverage.

Notion's `Parent Prompt` self-relation via DUAL synced `Child Prompts` property encodes the DAG. No prompt forks without writing its parent. No orphan children allowed.

## Load-bearing invariants

1. Every replay links `Parent Prompt`.
2. No loops (DAG integrity enforced at write time).
3. Cross-brand replays are valid — same prompt, different Area.
4. Library promotion walks the DAG — children of a Library entry count toward its compound score.

## Where it shows up

- [[../../meta/prompt-os-v1.4.0-architecture]] §13.3 Captured Prompts schema
- `/prompt-replay` writes Parent Prompt
- `/prompt-graph` visualizes the DAG as d3-force
- `/ship-public` renders lineage block in MDX

## Compound score formula

`compound_score = descendant_count × shipped_count`

Library entries ranked by compound score in the `/prompt-graph` audit view. Top entries = real leverage. Bottom entries with 0 shipped after 30 days = archive candidates.

## Related

- [[counter-coach-rule]]
- [[ooda-closure]]
- [[../people/andrej-karpathy]]
