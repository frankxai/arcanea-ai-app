---
title: MOC — Second Brain
aliases: ["second brain", "vault home", "index"]
tags: [moc, meta]
created: 2026-04-21
updated: 2026-04-21
status: stable
---

# Second Brain — Map of Content

The entry point. Everything else threads through here.

## Architecture
- [[../meta/second-brain-v2-architecture]] — the canonical ADR
- [[../meta/prompt-os-v1.4.0-architecture]] — the Prompt OS that feeds the vault

## Navigate by intent

- **"What am I working on?"** → [[MOC-Projects]]
- **"What do I know about X?"** → [[MOC-Frameworks]] | [[MOC-People]] | [[MOC-Books]]
- **"What did I ship?"** → [[MOC-Shipped]]
- **"Where is my thinking going?"** → [[MOC-Patterns]]
- **"What prompts compounded?"** → [[MOC-Prompt-OS]]
- **"What Council verdicts held?"** → [[MOC-Council]]
- **"What brand owns this?"** → [[MOC-Brands]]
- **"What's the current gate?"** → [[MOC-Goals]]
- **"What decisions are locked?"** → [[MOC-Decisions]]

## Folders — what lives where

| Folder | Contents |
|---|---|
| `00-MOCs/` | Maps of Content. Navigation. |
| `01-Daily/` | Daily notes. Auto-generated. |
| `02-Briefs/` | Council-produced daily + weekly briefs. |
| `03-Prompts/` | Prompt OS hot tier, 7-day rolling. |
| `04-Sparks/` | Fleeting captures awaiting triage. |
| `05-Atoms/` | Evergreen atomic notes — THE second brain. |
| `06-Projects/` | PARA: active time-bound. |
| `07-Areas/` | PARA: ongoing per brand + life area. |
| `08-Resources/` | PARA: reference, books, people, frameworks. |
| `09-Archive/` | PARA: graveyard. Searchable, not navigable. |

## Cardinal rules

1. One idea per atom. Atomize aggressively.
2. Every atom links ≥2 other notes. Orphans are bugs.
3. MOCs are navigation, not taxonomy — capped at 12.
4. The graph is the product. Dense beats sprawling.
5. Prompt OS writes to hot-tier folders only. `/harvest` is the only path to 05-Atoms.

## Health signals

Run `/vault-atlas` weekly. Targets:

| Metric | Target | Alert |
|---|---|---|
| Orphan rate | <5% | >15% → restructure |
| Stub rate | <10% | >25% → capture > distillation |
| MOC freshness | <14d | >30d → kill the MOC |
| Tag sprawl (unique/atoms) | <3.0 | >5.0 → consolidate |
| Daily-brief-to-atom rate | ≥1/week | 0 → harvest is broken |
