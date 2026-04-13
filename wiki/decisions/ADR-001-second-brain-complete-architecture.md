---
title: "ADR-001: Second Brain — Complete System Architecture"
domain: decisions
created: 2026-04-13
updated: 2026-04-13
author: claude
status: Accepted
links: [../meta/second-brain-buildout-plan.md, ../meta/confidential-tier.md, ../meta/inbox-architecture.md, ../meta/semantic-map-at-scale.md, ../meta/notion-map.md]
---

# ADR-001: Second Brain — Complete System Architecture

**Status:** Accepted  
**Date:** 2026-04-13  
**Decider:** Frank Riemer  
**Context window:** 150+ skills built, 4 Linear projects, 20+ Notion hubs, ARC-INBOX live, 3 scheduled tasks wired, Phase 2 complete

---

## Executive Summary

The second brain is not a note-taking system. It is a **compound intelligence loop** — a self-reinforcing architecture where every captured idea, shipped milestone, and agent interaction increases the precision and speed of future work. This ADR defines the complete system, identifies every gap still open, and specifies what must be built next to close them.

---

## Context

Frank operates across 5 brands (ARC / FX / SIS / MUS / BIZ), 13+ surfaces, 106 GitHub repos, 20+ Notion hubs, 150+ skills, and a Linear workspace. The problem is not lack of tools — it is lack of **routing intelligence**: ideas don't reliably reach action, milestones don't reliably get captured, and knowledge doesn't compound because it's spread across surfaces that don't talk to each other.

**Forces at play:**
- Solo operator: zero coordination overhead tolerance
- Context window resets between sessions: second brain must survive without memory
- Revenue pressure (Gate 0 by Apr 30): automation must serve shipping, not replace it
- Trust constraint: AI agents must never touch T1 material without explicit routing
- 5 brands in parallel: any workflow that doesn't route by brand will collapse under volume

---

## Current Architecture (as of 2026-04-13)

### Layer 0 — Trust Boundary (T0/T1/T2)

```
T0: KeePassXC encrypted USB  ←── NEVER agent-accessible. Physical only.
T1: 1Password + ~/vault/ + Notion Private (integration revoked)
    ←── Agent-assisted routing ONLY. No agent reads. Audit log only.
T2: Everything else (Notion, Linear, GitHub, Slack, Drive, Obsidian)
    ←── Full agent access. Default zone.
```

**Status: ✅ Architecture complete. Pending: 1Password vault init, ~/vault/ setup (Frank's hands)**

---

### Layer 1 — Capture Layer (The Mouth)

All ideas, tasks, signals, and inputs must enter through one of 8 channels:

| Channel | Tool | Latency | Status |
|---------|------|---------|--------|
| Chat/Cowork | `/capture` skill | <30s | ✅ Built |
| Voice notes | Drive /Voice/ → harvest | <7d | ✅ Harvest wired |
| Obsidian daily notes | `## To Triage` → obsidian-harvest.py | <7d | ✅ Script built |
| Legendary Brain Gems | status=Funnel → harvest | <7d | ✅ Harvest wired |
| Slack starred | Slack MCP → harvest | <7d | ✅ Harvest wired |
| Morning Brief action items | wiki/meta/ → harvest | <7d | ✅ Harvest wired |
| Google Drive intake | /FrankX/ /Arcanea/ etc → harvest | <7d | ✅ Harvest wired |
| Manual | ARC-INBOX direct write | instant | ✅ Live |

**Single drain:** All channels → `Linear ARC-INBOX` (f275978c)  
**Status: ✅ Complete. All 8 channels specified and wired.**

**GAPS:**
- ⬜ **Morning Brief skill not yet built** — no structured daily brief generation. Gap means morning context-setting is manual and inconsistent.
- ⬜ **Voice note transcription not automated** — Drive /Voice/ files are listed but not transcribed. Need whisper/transcription step before harvest can extract ideas.

---

### Layer 2 — Triage Layer (The Router)

**ARC-INBOX → Projects** via `/inbox-triage`:

```
ARC-INBOX
  └── Drop (noise, duplicates, stale)
  └── Route → {ARC|FX|SIS|MUS|BIZ} × {project in Linear}
  └── Park (needs decision, unclear brand)
```

**Triage ritual:** Daily 9am, 15-min target, batch confirm.  
**Scheduled trigger:** daily-inbox-reminder task (live, 9am).  
**Status: ✅ Skill built, task wired.**

**GAPS:**
- ⬜ **No label pre-population on ARC-INBOX** — Linear labels for tier/brand/type/source must be manually created before `/capture` can tag correctly. Without labels, issues land unlabeled and triage loses precision.
- ⬜ **No `session-sync` integration with inbox** — end of session work summaries don't auto-feed ARC-INBOX. High-value pattern: every session should surface its own action items.

---

### Layer 3 — Execution Layer (The Engine)

Linear projects by brand:

| Brand | Project | ID | Status |
|-------|---------|-----|--------|
| ARC | Arcanea main | (existing) | ✅ |
| FX | FrankX.ai | 54d8e481 | ✅ |
| SIS | Starlight Intelligence | cd41a403 | ✅ |
| MUS | Music Empire | 071075e3 | ✅ |
| BIZ | Business Ops | 7a80126e | ✅ |
| ALL | ARC-INBOX (triage buffer) | f275978c | ✅ |

Skills that feed execution:
- `/arcanea-orchestrator` — status, promote, plan, handover (✅ exists)
- `/session-sync` — checkpoint, Linear update, Notion sync (✅ exists)
- `/daily-ops` — git intel, Linear sync, Notion dev hub update (✅ exists)
- `/gate-eval` — Gate 0-5 evaluation (✅ exists)
- `/lock-decision` — decision crystallization (✅ exists)

**GAPS:**
- ⬜ **`/daily-ops` not wired as scheduled task** — it exists as a skill but isn't running automatically at session start. Every session starts cold without a brief.
- ⬜ **`/session-sync` not triggered at session end** — session work never auto-surfaces to planning files or Notion Dev Hub.
- ⬜ **No Morning Brief scheduled task** — daily 8am brief would prime the day before inbox triage.

---

### Layer 4 — Knowledge Layer (The Brain)

The semantic wiki at `Arcanea/wiki/`:

```
wiki/
├── README.md                    ← Navigation root (≤150 lines)
├── arcanea/                     ← Brand: Arcanea
├── frankx/                      ← Brand: FrankX.ai
├── sis/                         ← Brand: Starlight Intelligence
├── music/                       ← Brand: Music
├── business/                    ← Brand: Business
├── decisions/                   ← ADRs (this file)
├── learnings/                   ← Distilled insights
├── people/                      ← Key relationships
├── meta/                        ← Architecture docs (8 files)
├── skills/                      ← Skill specs (6 + README)
├── scripts/                     ← Scripts (2 + README)
├── milestones/                  ← Shipped work (0 entries yet)
├── reports/                     ← Repo triage reports (0 yet)
└── .claude/skills/              ← 150+ skill implementations
```

**Notion mirrors:**
- Empire Dashboard ← unified command center
- Arcanea Hub ← brand knowledge
- Legendary Brain ← personal knowledge (parallel system)
- Business Ops Hub ← financial/legal/compliance (new, 4 DBs)

**Status: ✅ Architecture complete. Wiki growing.**

**GAPS:**
- ⬜ **150+ skills are NOT indexed in wiki** — `.claude/skills/` has 150+ implementations but `wiki/skills/` only has 6 specs. The skills are invisible to the knowledge layer. An agent starting a new session has no way to know what exists.
- ⬜ **`wiki/milestones/` is empty** — no shipped milestones captured yet. The milestone loop (`/ship-it`) exists but has never been triggered.
- ⬜ **`wiki/decisions/` had zero ADRs until this one** — no institutional memory of why decisions were made.
- ⬜ **`wiki/learnings/` is empty** — no distilled insights from past sessions.
- ⬜ **`wiki/people/` needs Ahmad Hashem, Trinity AI Alliance** — first client has no wiki page.
- ⬜ **Legendary Brain ↔ wiki bridge is manual** — harvest skill drains Brain Gems but doesn't sync back. Wiki decisions don't propagate to Legendary Brain.

---

### Layer 5 — Output Layer (The Voice)

The second brain exists to accelerate outputs:

| Output Type | Skill | Status |
|-------------|-------|--------|
| Milestone capture | `/ship-it` | ✅ Built |
| Social drafts (X, LinkedIn, Newsletter) | `/ship-it` → brand-voice | ✅ Built |
| Repo health reports | `/repo-triage` | ✅ Built |
| Architecture decisions | `/lock-decision` + `/engineering:architecture` | ✅ Exists |
| Content pipeline | `/publish-distribute` | ✅ Exists |
| ArcaneaClaws (5 social agents) | `/claws` | ✅ Exists |
| Gate evaluations | `/gate-eval` | ✅ Exists |
| Daily briefs | ⬜ NOT BUILT | ❌ Gap |
| Weekly reviews | ⬜ NOT BUILT | ❌ Gap |
| Morning Brief | ⬜ NOT BUILT | ❌ Gap |

**GAPS:**
- ⬜ **No daily brief skill** — biggest operational gap. Every morning starts without a synthesized view of: open inbox, active Linear issues, last git commits, upcoming deadlines, Lumina streak, Gate 0 countdown.
- ⬜ **No weekly review skill** — Sunday should produce a structured review: what shipped, what's blocked, what's learned, what to kill.
- ⬜ **ArcaneaClaws not connected to second brain** — `/claws` exists but doesn't read from wiki/milestones/ or ARC-INBOX. Social output is disconnected from knowledge layer.

---

### Layer 6 — Feedback Layer (The Mirror)

The brain must reflect back what it's learning:

| Loop | Mechanism | Status |
|------|-----------|--------|
| Repo health | weekly-repo-triage scheduled task | ✅ Live |
| Inbox drain | weekly-harvest scheduled task | ✅ Live |
| Milestone capture | daily milestone-scanner in `/ship-it` | ✅ Built (not yet scheduled) |
| Wiki orphan detection | orphan-scan.py | ⬜ Phase 3 |
| Link health | check-wiki-links.py | ⬜ Phase 3 |
| Memory updates | auto-memory system | ✅ Live |
| Session handover | `/session-sync` | ✅ Skill exists, not scheduled |

**GAPS:**
- ⬜ **milestone-scanner not wired as scheduled task** — `/ship-it` specifies a daily 9am/5pm scanner but it wasn't created as a separate scheduled task (daily-inbox-reminder runs at 9am for inbox only).
- ⬜ **No Notion Dev Hub auto-refresh** — `33626ac2-8189` should reflect current platform state after every session. `/session-sync` does this but isn't triggered.

---

## What's NOT in the System (Honest Gaps)

These are the 8 things the system cannot do today that it should:

### G1: No Morning Brief (Critical — Daily Leverage)
No structured daily briefing. Every day starts with a cold context load. A 2-minute morning brief skill reading: inbox count, active issues, git state, Gate 0 countdown, today's priorities from wiki, Lumina streak status → would save 15-30 min/day of context reconstruction.

### G2: Linear Labels Not Created (Blocking /capture)
`/capture` requires labels: `tier:T1`, `tier:T2`, `brand:ARC`, `brand:FX`, `brand:SIS`, `brand:MUS`, `brand:BIZ`, `type:idea`, `type:task`, `type:bug`, `type:content`, `type:decision`, `type:reference`, `source:chat`, `source:obsidian`, `source:brain`, `source:drive`, `source:slack`, `source:brief`, `source:voice`, `source:manual`. These don't exist in Linear yet.

### G3: 150+ Skills Not in Wiki Index (Knowledge Blindness)
The skill library has massive capability — `arcanea-orchestrator`, `hooks-automation`, `swarm-orchestration`, `arcanea-orchestra`, `reasoningbank-intelligence`, `claws`, `agentdb-*`, `gate-eval` — but there's no index that maps them to second brain entry points. Every session, an agent has to rediscover these.

### G4: No Weekly Review Skill (Reflection Loop Missing)
The harvest drains buffers but doesn't synthesize what was learned. A weekly review skill would: count shipped milestones, identify recurring themes in inbox, flag stale decisions, surface the week's key learning, and write it to `wiki/learnings/YYYY-WW.md`.

### G5: Ahmad Hashem / Trinity Not in Wiki People Layer
First client. €180K contract. April 16 launch. Zero wiki page. No context survives session resets. Every new session starts with zero knowledge of who Ahmad is, what was agreed, and what the April 16 deadline means.

### G6: `/session-sync` Not Automated (Context Loss Between Sessions)
The most expensive recurring cost in this system is context reconstruction at session start. `/session-sync` exists and does exactly the right thing — but it only runs if Frank explicitly calls it. It should be the last thing every session does automatically, and the first thing read at session start.

### G7: Gate 0 Revenue Loop Not Instrumented
Gate 0 (€1 by Apr 30) is 17 days away. There's no scheduled task watching for it. No skill that says "Trinity contract is Active, BV formation is In Progress, frankx.ai launches Apr 16 — here's what needs to happen this week." The business layer is in Notion but nothing is actively pulling it into the operational loop.

### G8: Obsidian Vault Path Unknown
`obsidian-harvest.py` uses `~/Obsidian/` but the actual vault path on Frank's machine is unknown. If the path is wrong, Sundays' harvest silently produces zero output from Obsidian — the largest single daily-note buffer.

---

## Architecture Decision: What to Build Next (Priority Order)

| Priority | Item | Effort | Leverage | Can run now? |
|----------|------|--------|----------|--------------|
| **P0** | Create Linear labels for ARC-INBOX | 5 min | Unlocks /capture | ✅ Yes |
| **P0** | Create Ahmad Hashem wiki page | 20 min | Survives context reset | ✅ Yes |
| **P0** | Build morning-brief scheduled task | 30 min | 15-30min/day leverage | ✅ Yes |
| **P0** | Wire session-sync as session-end reminder | 15 min | Eliminates context loss | ✅ Yes |
| **P1** | Create skill-map.md wiki index | 45 min | Makes 150 skills discoverable | ✅ Yes |
| **P1** | Wire milestone-scanner scheduled task | 15 min | Closes shipping loop | ✅ Yes |
| **P1** | Build weekly-review scheduled task | 30 min | Closes reflection loop | ✅ Yes |
| **P1** | Build Gate 0 countdown scheduled task | 20 min | Revenue urgency surfacing | ✅ Yes |
| **P2** | Voice note transcription pipeline | 2h | Unlocks voice buffer | ❌ Needs Frank config |
| **P2** | obsidian-harvest.py vault path config | 5 min | Unlocks Obsidian buffer | ❌ Needs Frank config |
| **P2** | frankxai/second-brain repo init | 10 min | D1 decision | ❌ Needs gh auth |
| **P3** | Weekly review skill | 1h | Reflection loop | ✅ Yes |
| **P3** | ArcaneaClaws ↔ wiki bridge | 2h | Output layer connected | ✅ Yes |

---

## System Interconnection Map

```
                    ┌─────────────────────────────────────────────┐
                    │              CAPTURE LAYER                   │
                    │  Voice → Drive → Obsidian → Brain → Slack   │
                    │  Chat → Cowork → /capture → Manual           │
                    └───────────────────┬─────────────────────────┘
                                        │ all drain to
                                        ▼
                    ┌─────────────────────────────────────────────┐
                    │         LINEAR ARC-INBOX (Single Buffer)     │
                    │    f275978c | Inbox→Triaged→Routed→Dropped   │
                    └───────────────────┬─────────────────────────┘
                                        │ /inbox-triage (daily 9am)
                                        ▼
              ┌────────────────────────────────────────────────────┐
              │                  EXECUTION LAYER                    │
              │  ARC Projects | FX Projects | SIS | MUS | BIZ      │
              │  /arcanea-orchestrator | /daily-ops | /gate-eval    │
              └───────────┬──────────────────────────┬─────────────┘
                          │ /ship-it                  │ /session-sync
                          ▼                           ▼
              ┌───────────────────────┐  ┌───────────────────────┐
              │    KNOWLEDGE LAYER    │  │   NOTION MIRROR LAYER  │
              │  wiki/milestones/     │  │  Empire Dashboard      │
              │  wiki/decisions/      │  │  Dev Hub (33626ac2)    │
              │  wiki/learnings/      │  │  Business Ops Hub      │
              │  wiki/meta/ (8 docs)  │  │  Legendary Brain       │
              │  .claude/skills/ 150+ │  │  Arcanea Hub           │
              └───────────┬───────────┘  └───────────────────────┘
                          │ weekly harvest (Sun 10:30am)
                          ▼
              ┌───────────────────────────────────────────────────┐
              │                 OUTPUT LAYER                        │
              │  /ship-it → social drafts → X/LinkedIn/Newsletter  │
              │  /claws → ArcaneaClaws (5 social agents)           │
              │  /publish-distribute → content pipeline            │
              │  /repo-triage → wiki/reports/ → Linear archive     │
              └───────────────────────────────────────────────────┘
                          │ feedback
                          ▼
              ┌───────────────────────────────────────────────────┐
              │               SCHEDULED FEEDBACK LAYER             │
              │  daily 9am: inbox pulse                            │
              │  daily 8am: morning brief (⬜ build now)           │
              │  daily 9am+5pm: milestone scanner (⬜ build now)   │
              │  Sunday 10am: repo-triage                          │
              │  Sunday 10:30am: harvest                           │
              │  Sunday 11am: weekly review (⬜ build now)         │
              └───────────────────────────────────────────────────┘
```

---

## Consequences

**What becomes easier:**
- Any idea captured in chat is in Linear within 30 seconds via `/capture`
- Morning brief surfaces: inbox count + active issues + gate countdown in 2 min
- Every Sunday automatically: repos graded + buffers drained + inbox prepped
- Every shipped milestone automatically: screenshotted + wiki'd + social-drafted
- Context survives session resets via wiki + auto-memory + `/session-sync`
- Trust tier routing is automatic — T0 material refused at point of capture

**What becomes harder:**
- Adding new surfaces requires wiring them into the harvest skill
- Skill bloat is real — 150+ skills need curation or the index becomes noise
- Obsidian/Legendary Brain are parallel systems that will drift without weekly reconciliation

**What to revisit in Phase 3:**
- orphan-scan.py — detect wiki articles with no incoming links
- check-wiki-links.py — detect broken cross-references
- frankxai/second-brain repo — standalone git-backed wiki
- Webhook-triggered `/ship-it` if shipping velocity > 2×/week

---

## Action Items (Immediate — Claude runs now)

- [x] ARC-INBOX Linear project created (f275978c)
- [x] 6 skill implementations written (.claude/skills/)
- [x] 3 scheduled tasks wired (daily-inbox-reminder, weekly-repo-triage, weekly-harvest)
- [x] Business Ops Hub + 4 DBs created in Notion
- [x] Trinity AI Alliance contract + BV Netherlands seeded
- [x] Create Linear labels for ARC-INBOX — 21 labels (tier/brand/type/source/documented) ✅
- [x] Create Ahmad Hashem wiki page (wiki/people/ahmad-hashem.md) ✅
- [x] Build morning-brief scheduled task (daily 8am) ✅
- [x] Wire session-sync reminder scheduled task (daily 10pm) ✅
- [x] Create wiki/meta/skill-map.md — 150+ skills indexed ✅
- [x] Wire milestone-scanner scheduled task (daily 5pm) ✅
- [x] Build Gate 0 countdown scheduled task (daily 8:30am) ✅
- [x] Build weekly-review scheduled task (Sundays 11am) ✅
- [x] Update notion-map.md with Business Ops Hub IDs ✅
- [x] ADR-001 written to wiki/decisions/ ✅

## Frank's Actions (Cannot be automated)

1. `gh auth login` — unlocks repo triage
2. Create Notion Private/T1 page + revoke integration
3. Set Obsidian vault path: update `obsidian-harvest.py --vault {actual path}`
4. Set up 1Password `arcanea-infra` vault
5. Init `~/Business/confidential/` with age encryption
6. Run scheduled tasks manually once to pre-approve MCP permissions
