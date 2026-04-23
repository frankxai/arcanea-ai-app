---
title: Karpathy LLM-Wiki
aliases: ["karpathy wiki", "llm-indexable notes", "atomic notes"]
tags: [framework, knowledge-architecture]
created: 2026-04-21
updated: 2026-04-21
status: stable
source: "Karpathy, 2024 — informal tweets + LLM-first personal wiki pattern"
---

# Karpathy LLM-Wiki

**Atomic notes, dense backlinks, LLM-indexable.** A wiki you read with a language model, not with your eyes.

## The pattern

- One idea per file, title-as-concept
- Every note links ≥2 others — the graph, not the file, is the unit
- Frontmatter is typed (title, aliases, tags, status, links) — the LLM indexes against it
- No numeric IDs, no taxonomic hierarchy — the LLM handles retrieval
- Notes are readable by a stranger without context — self-contained atoms

## Why it matters

Traditional note systems fail at scale because retrieval doesn't scale. Dense backlinks + LLM retrieval = navigation by semantic proximity, not folder-hunting. A vault of 200 atomic notes is more useful than a vault of 5,000 mixed-granularity notes.

## Where it shows up

- This vault's `05-Atoms/` folder is literally this
- [[../../meta/second-brain-v2-architecture]] §"The Karpathy LLM-wiki conventions (adopted)"
- Every atom frontmatter follows the Karpathy shape

## What we adopt

- Atomic notes
- Frontmatter typing
- Aggressive linking
- LLM-first retrieval (read the vault via Claude, not via Obsidian search)

## What we don't adopt

- Hand-rolled static-site renderer (we use Obsidian's graph view instead)
- Purely private (Frank's vault ships a subset to OSS via `/ship-public`)

## The paired framework

[[para]] handles mutable work (Projects/Areas/Resources/Archive). LLM-wiki handles durable knowledge (05-Atoms). Together they cover the whole second brain without overlap.

## Related

- [[../people/andrej-karpathy]]
- [[para]]
- [[lyt-moc]]
- [[../concepts/dag-provenance]]
