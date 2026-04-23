---
title: Prompt OS v1.4.0 — Product Architecture
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: active
links: [../skills/daily-brief, ../skills/counter-coach, ../skills/weekly-brief, ../skills/prompt-search, ../skills/prompt-replay, prompt-os, ../../Business/STARLIGHT-OS-V1.md]
---

# Prompt OS v1.4.0 — Product Architecture

> The fourth substrate of Starlight OS, designed for principal / AI-lab / founder-operator audiences. v1.4.0 closes the five holes top thinkers identified in v1.3.0: no adversary, no DAG, no shippable output, no live artifact, no energy signal.

## Target user

Principal-level knowledge worker who:
- Runs 50–200 prompts/day across 5+ AI surfaces (Claude, GPT, Gemini, Perplexity, coding agents)
- Ships across multiple brands/domains (not a single product)
- Needs behavioral change, not a knowledge graph
- Will not tolerate daily curation overhead
- Reads a single artifact before touching a keyboard
- Wants the system to *push back*, not merely organize

**Not the target:** casual note-takers, PKM hobbyists, single-domain specialists. Those are Obsidian or Tana users. Prompt OS is for people whose prompts *are* their leverage.

## Competitive frame

| System | What it does well | What v1.4.0 does that it doesn't |
|---|---|---|
| **Raycast + AI** | Speed, keyboard-first, cross-app | Persistence, DAG, daily synthesis, Council |
| **Tana** | Supertags, node graph, AI queries | Cross-surface (not just Tana graph), scheduled Council, shippable artifacts |
| **Mem / Reflect** | Personal AI recall | Goal alignment, drift flagging, adversarial Coach |
| **Obsidian + Copilot** | Local-first, graph, plugins | Scheduled agent workflows, Notion sync, marketplace distribution |
| **Granola / Fellow** | Meeting capture | Prompt + creative capture, cross-brand synthesis |
| **Linear + GitHub** | Execution tracking | Generative layer — what *should* we ship, not just what we did |
| **Notion AI + Custom Agents** | In-DB agents, autofill | Cross-surface (GitHub/Linear/Obsidian/Slack), adversarial roles, shippable Brief |

**Defensible edge:** the combination of in-DB enrichment (Notion) + cross-surface Sonnet synthesis (Cowork) + adversarial Council + daily behavioral artifact + Marketplace distribution. No competitor stacks all five.

## Architecture — three layers, six roles, one artifact

### Layer 1 — Capture (hot, volume-default)
- Obsidian markdown at `prompts/{YYYY-MM-DD}.md` — 5-second capture
- Voice capture via OS-level Whisper (macOS dictation / Windows Voice) → appended to same file
- Browser extension (future) for yield-point capture from Claude.ai/ChatGPT/Perplexity threads
- No schema enforcement at capture. Parse later.

### Layer 2 — Reflective Council (six roles, hybrid runtime)

| Role | Job | Runtime | Notes |
|---|---|---|---|
| **Observer** | Cluster by semantic pattern + energy signal | Notion Custom Agent | Fills `Pattern Cluster`, `Energy Score` (1–5 how energizing this was) |
| **Strategist** | Drift flag vs active Gate | Notion Custom Agent | Fills `Drift Flag` |
| **Distiller** | Flag Replay Count ≥ 3 | Notion formula | Zero LLM cost |
| **Coach** | Upgrade top-3 by yield | Cowork scheduled (Sonnet) | Cross-surface — reads Linear/GitHub/Obsidian for full context |
| **Counter-Coach** (new) | Adversarial upgrade — steelman the opposite | Cowork scheduled (Sonnet) | Separates principal-level from amateur systems; Naval's "loyal opposition" |
| **Connector** | Cross-brand pattern hypothesis | Cowork scheduled (Sonnet) | Semantic search across 5 brands |
| **Brief Composer** | Synthesize all into single-page artifact | Cowork scheduled (Sonnet) | The only role that writes outputs |

### Layer 3 — Artifacts (three shippable surfaces)

| Artifact | Cadence | Surface | Purpose |
|---|---|---|---|
| **Daily Brief** | 07:00 daily | Notion + Slack + Obsidian + Cowork sidebar artifact (live HTML) | Behavior-change before keyboard |
| **Weekly Brief** | Sunday 08:00 | Notion + Obsidian + `frankxai/starlight-os/briefs/{YYYY-MM-DD}.md` → /llms.txt | Long-form, shippable, compounds inbound |
| **Prompt DAG** | On-demand (`/prompt-graph`) | Cowork artifact | Visual provenance graph via Parent Prompt relation |

## Schema extensions (v1.4.0)

Added to Captured Prompts DB `5621839b-bf0d-453f-8937-d6e9dc8991d0`:

| Column | Type | Writer | Role |
|---|---|---|---|
| `Parent Prompt` | RELATION(self, DUAL `Child Prompts`) | `/prompt-replay`, `/prompt-fork` | DAG provenance. Every replay/fork links to source. |
| `Energy Score` | NUMBER (1–5) | Observer | Anti-drift complement. High drift + high energy = pivot signal. |
| `Counter Coach` | RICH_TEXT | Counter-Coach | Adversarial alternative to Coach Suggestion. |
| `Move Shipped Date` | DATE | Closure tracker | When a Top-3 Move actually completed. Feeds Council hit-rate. |
| `Published to Weekly` | CHECKBOX | `/weekly-brief` | Idempotency guard for newsletter inclusion. |

## New skills shipped v1.4.0

| Skill | Priority | Purpose |
|---|---|---|
| `/counter-coach` | P0 | Adversarial pass — always runs alongside Coach |
| `/weekly-brief` | P0 | Sunday long-form shippable digest → public MDX |
| `/prompt-search` | P1 | Semantic search (Notion AI native) across Captured + Library, scoped by agent/project/goal/date |
| `/prompt-replay` | P1 | Re-run a Library entry with new params, link via Parent Prompt |
| `/prompt-graph` | P2 | Visual provenance DAG as Cowork artifact |
| `/ship-public` | P2 | Promote curated Brief/Library entry → public OSS repo |

## Action loop closure (OODA for operators)

v1.3.0 emitted Top 3 Moves but didn't close the loop. v1.4.0 fix:

1. Daily Brief emits Top 3 Moves → auto-creates Linear issues tagged `council-move-{date}`
2. Linear issue closes → webhook or `milestone-scanner` (17:00 daily, already running) writes `Move Shipped Date` back to source prompt
3. Weekly Brief analyzes hit rate: "Last week the Council called 21 moves. 14 shipped on time, 5 partially, 2 missed." Adjusts Coach weighting.
4. Missed-move patterns surface in Strategist's drift flag next week.

This is the *platform* signal Collison demanded — data that compounds, not just a tool.

## Live Cowork artifact

Persistent HTML widget in Cowork sidebar. Loads:
- Active Gate countdown + alignment %
- Yesterday's Brief Top 3 Moves with closure status (shipped / in-flight / missed)
- Today's running Pattern Cluster distribution
- Energy vs Drift 2×2 for last 7 days (scatter)
- Creative Sparks list (orphans with countdown)

One page. Re-openable. Data live from Notion MCP. This is the "behavioral lock-in" Graham would demand.

## Distribution (product, not pricing)

OSS layer: `frankxai/starlight-os` GitHub repo. Contains:
- `prompts/` — Open-tier hero prompts (markdown)
- `briefs/` — published weekly briefs (MDX)
- `skills/` — skill specs
- `/llms.txt` — LLM citation index
- README — "The OS that thinks before you do"

Notion Marketplace layer: template pack with pre-configured DBs + Custom Agents + Daily Brief template + setup guide.

Atelier layer: private Slack + custom Council config + quarterly prompt-engineering session. Stripe rail.

## What v1.4.0 explicitly does NOT do (vetoes)

- **No audio / video transcription.** Whisper at OS level; Prompt OS consumes the text. Granola's job, not ours.
- **No chat UI.** This isn't a chat app; it's an agent substrate. Interface with it via Cowork, Claude Code, Notion directly.
- **No mobile app.** Mobile = Obsidian mobile + Slack notifications + Cowork on iPad. Native mobile is a distraction.
- **No cross-user aggregation in v1.** Single-operator. Platform data model is ready; aggregation layer is Atelier+ territory.
- **No real-time collaboration.** This is a solo thinking tool. Weekly Brief is the collaboration surface.
- **No custom LLM fine-tunes.** Leverage Sonnet + Notion's auto-model selection. Our edge is orchestration, not model.

## Success criteria (T+30)

- [ ] Daily Brief emitted 30/30 days
- [ ] Top 3 Moves: ≥70% closure rate
- [ ] Captured Prompts: >1,000 rows
- [ ] Prompt Library: >30 entries, >10 promoted via Replay Count ≥ 3
- [ ] Weekly Brief shipped 4/4 Sundays
- [ ] Council hit rate tracked and surfacing in Brief
- [ ] Cowork artifact loads <2s, accurate
- [ ] One Counter-Coach suggestion per week beats the Coach original (Frank picks)

If any fail, the OS is the defect. Refactor or kill.

---

*Designed 2026-04-21. Shipped same day.*
