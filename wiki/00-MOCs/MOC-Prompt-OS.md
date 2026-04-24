---
title: MOC — Prompt OS
aliases: ["prompt os", "prompt operating system", "council"]
tags: [moc, prompt-os, council]
created: 2026-04-21
updated: 2026-04-21
status: stable
links: [[../meta/prompt-os-v1.4.0-architecture]]
---

# Prompt OS — Map of Content

Version 1.4.0 as of 2026-04-21. Six-role Reflective Council, DAG provenance, Weekly Brief OSS output, Cowork live artifact, Energy Score.

## Architecture

- [[../meta/prompt-os-v1.4.0-architecture]] — the full ADR
- [[../../Business/STARLIGHT-OS-V1]] §13 — canonical spec (outside vault)

## The six roles

| Role | Runtime | Purpose |
|---|---|---|
| Observer | Notion Custom Agent | Pattern Cluster + Energy Score |
| Strategist | Notion Custom Agent | Drift Flag |
| Distiller | Notion formula | Promotion queue |
| Coach | Cowork scheduled Sonnet | Coach Suggestion |
| **Counter-Coach** | Cowork scheduled Sonnet @ 0.8 | Adversarial test of Coach |
| Connector | Cowork scheduled Sonnet | Cross-Brand Link |
| Brief Composer | Cowork scheduled Sonnet | Daily + Weekly Brief |

## The ten skills

| Skill | Status | Purpose |
|---|---|---|
| `/prompt-capture` | spec | Write to `03-Prompts/{date}/PR-{id}.md` |
| `/prompt-harvest` | **LIVE 02:15** | Drain hot tier to Notion |
| `/daily-brief` | **LIVE 07:00** | Council artifact to `02-Briefs/daily/` |
| `/prompt-curate` | **LIVE Sun 11:45** | Library promotion |
| `/counter-coach` | spec | Adversarial role |
| `/weekly-brief` | **LIVE Sun 08:05** | Long-form shippable → OSS |
| `/prompt-search` | spec | Semantic search via Notion AI |
| `/prompt-replay` | spec | Fork with template vars |
| `/prompt-graph` | spec | d3-force DAG viz |
| `/ship-public` | spec | Library → OSS with lineage |

## Invariants

1. Every Top-3 Coach upgrade has a paired Counter.
2. Every replay links `Parent Prompt`.
3. Weekly Brief ships every Sunday — skinny beats skipped.
4. Move Shipped Date written on Linear close.
5. Public-shipped prompts show lineage.
6. Atelier prompts never leak to public.
7. Counter-Coach never emits tautology.
8. Brief pads = bug.

## Related atoms (to seed)

- [[../05-Atoms/concepts/counter-coach-rule]]
- [[../05-Atoms/concepts/dag-provenance]]
- [[../05-Atoms/concepts/ooda-closure]]
- [[../05-Atoms/concepts/energy-score]]
- [[../05-Atoms/frameworks/karpathy-llm-wiki]]

## Cowork artifacts

- `prompt-os-dashboard` — daily live view (Active Gate, Moves, Clusters, Energy×Drift, Sparks)
- `vault-atlas-v2` — this vault's graph + health (see [[MOC-Second-Brain]])
