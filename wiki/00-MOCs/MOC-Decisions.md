---
title: MOC — Decisions
aliases: ["decisions", "adrs", "decision log"]
tags: [moc, decisions]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Decisions — Map of Content

Major architectural + strategic decisions. Every decision has: date, option space collapsed, chosen path, kill criteria. Points to `decisions/` subfolder.

## v1.4.0 decisions (2026-04-21)

- Counter-Coach ships as Sonnet @ 0.8, runs inline at 05:30 (not separate cadence)
- `Parent Prompt` uses DUAL synced relation, not inverse formula
- Weekly Brief publishes to Notion draft first — Frank reviews before OSS commit
- Cowork artifact uses Chart.js UMD — no React/d3 for v1 (simplicity > features)
- Energy Score on 1–5 scale (1 = drained, 5 = creative flow)

## v1.3.0 decisions (2026-04-20)

- Pivot to hybrid runtime: Notion Custom Agents (Observer, Strategist) + Cowork scheduled (Coach, Connector, Brief Composer) + Notion formula (Distiller)
- Open-core pricing: €0 OSS + €19/mo Pro + €497 setup + €99/mo Atelier
- Notion Template Marketplace as Pro distribution rail

## v1.2.0 decisions

- Reflective Council emerges; volume-default prompt logging (all prompts, no triage)

## Architecture pivots (2026-04)

- [[../meta/second-brain-v2-architecture]] — ONE vault, Karpathy + PARA + LYT fusion (2026-04-21)
- [[../meta/prompt-os-v1.4.0-architecture]] — six-role Council + DAG (2026-04-21)

## Business decisions

- Oracle exit accepted; BV incorporation June 1 2026
- GenCreator launch paused pending credentials (ARC-139)
- Trinity AI first Atelier client — supportive-only per 2026-04-16 reframe

## Rule for this MOC

Every entry: **one line + date + decision**, no longer. Rationale lives in `decisions/{slug}.md`. If the decision is frameworky, extract an atom into `05-Atoms/frameworks/`.
