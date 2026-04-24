---
title: Second Brain v2 — Karpathy LLM-Wiki × PARA × LYT, Fused to Prompt OS
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: canonical
supersedes: [inbox-architecture]
links: [prompt-os-v1.4.0-architecture, ../skills/README, ../skills/vault-atlas]
---

# Second Brain v2

**Thesis.** One vault. Atomic notes. LLM-indexed. Connected to Prompt OS. The graph *is* the product — not the files.

This ADR supersedes the Inbox Architecture doc. It locks the vault shape so every subsequent skill, capture, and brief lands somewhere predictable. Every decision in this file is load-bearing — changing it means migrating ~40 existing wiki notes and breaking Prompt OS wiring.

## The audit (as of 2026-04-21)

| Observation | Count | Verdict |
|---|---|---|
| Total `.md` under `Arcanea/` (incl. `node_modules`, `dist`, generated) | ~5,832 | noise — engineering artifacts, not thinking |
| Curated `Arcanea/wiki/` files | 37 | the real second brain — too small |
| `Arcanea/wiki/` + `docs/` + `lore/` + `prompts/` + `research/` | 491 | candidate migration pool |
| `FrankX/content/` + `docs/` + `prompts/` | 517 | publishing funnel — stays separate |
| `Business/` .md | 82 | operational, lives in place |
| Nested `.obsidian` folders across repos | **16** | **catastrophic** — graph is fragmented 16 ways |
| Active community plugins | 0 | vanilla Obsidian — zero plugin debt |
| Daily/MOC/Inbox/Briefs/Prompts folders in vault | 0 | Prompt OS writes have nowhere to land |

**Diagnosis.** Frank has thousands of markdown files and no second brain. The wiki is 37 files. The graph is fragmented 16 ways. Prompt OS v1.4.0 assumes hot-tier folders that don't exist. This is not a *second-brain* problem — it's an *architecture* problem. The fix is a single vault, a fixed 10-folder shape, and LLM-native indexing.

## Decision — one vault, one graph

The canonical vault is **`C:\Users\frank\Arcanea\wiki\`**.

Everything else (`FrankX/`, `Business/`, `Arcanea/book/`, `Arcanea/docs/`) is a *source* that gets *harvested* into the vault via `/harvest`. The vault is the curated distillate — not the dumping ground.

**Kill criteria** for the 14 nested `.obsidian` directories (everywhere except `Arcanea/.obsidian` and `FrankX/.obsidian`): delete them. They break backlinks and create phantom graph islands. FrankX keeps its vault as the **publishing scratchpad**; Arcanea/wiki is the **second brain**. Two vaults, two purposes. No more.

## Inheritance tree — three second-brain traditions, one stack

| Tradition | What we take | What we drop |
|---|---|---|
| **Karpathy LLM-wiki** (2024) | Atomic notes, LLM-indexable, each note self-contained, aggressive backlinking | Hand-rolled renderer (we use Obsidian) |
| **Tiago Forte PARA** | Projects/Areas/Resources/Archive as top-level partition | "Capture-organize-distill-express" as a process (Prompt OS replaces this) |
| **Nick Milo LYT** | Maps-of-Content as navigational entry points, folders-as-containers-not-taxonomy | MOC sprawl (we cap at 12) |

The fusion: **PARA for mutable work** (Projects/Areas/Resources/Archive) + **LLM-atoms for durable knowledge** (05-Atoms/) + **MOCs as entry points** (00-MOCs/) + **Prompt OS hot tier** (01-Daily, 02-Briefs, 03-Prompts, 04-Sparks).

## Target structure — 10 top-level folders

```
Arcanea/wiki/
├── 00-MOCs/                    ← Maps of Content (LYT). Max 12 files. Entry points.
├── 01-Daily/                   ← Daily notes. Auto-template via /capture.
│   └── 2026/04/2026-04-21.md
├── 02-Briefs/                  ← Prompt OS output. /daily-brief + /weekly-brief land here.
│   ├── daily/2026-04-21.md
│   └── weekly/2026-W17.md
├── 03-Prompts/                 ← Hot-tier prompt capture (/prompt-capture). 7-day TTL before Notion drain.
│   └── 2026-04-21/PR-0142.md
├── 04-Sparks/                  ← Fleeting captures. /capture writes here before triage.
├── 05-Atoms/                   ← Evergreen Karpathy-style notes. ONE idea per file. THE second brain.
│   ├── concepts/
│   ├── frameworks/
│   └── people/
├── 06-Projects/                ← PARA P. Active, time-bound.
│   ├── starlight-os/
│   ├── vibeclubs/
│   ├── gencreator/
│   └── arcanea-v1.4/
├── 07-Areas/                   ← PARA A. Ongoing, no end date. One per brand + key life area.
│   ├── frankx.md
│   ├── arcanea.md
│   ├── sis.md
│   ├── gencreator.md
│   ├── vibeclubs.md
│   ├── health.md
│   ├── finance.md
│   └── family.md
├── 08-Resources/               ← PARA R. Reference material, research, book notes.
│   ├── books/
│   ├── people/                 ← (merge from existing wiki/people/)
│   ├── frameworks/             ← external methodologies (Naval, Graham, Karpathy)
│   └── research/
├── 09-Archive/                 ← PARA Archive. Completed projects, dead ideas.
│
├── meta/                       ← keep. ADRs about the OS itself.
├── decisions/                  ← keep. Decision log.
├── skills/                     ← keep. Skill specs.
├── learnings/                  ← keep. Post-mortems, lessons.
│
└── (legacy — to migrate)
    ├── arcanea/                → 07-Areas/arcanea.md + 05-Atoms/ split
    ├── business/               → 07-Areas/ + 08-Resources/
    ├── frankx/                 → 07-Areas/frankx.md + 05-Atoms/ split
    ├── music/                  → 08-Resources/music/
    ├── people/                 → 08-Resources/people/
    ├── sis/                    → 07-Areas/sis.md + 05-Atoms/ split
    └── scripts/                → stay (tooling)
```

## File count — target and rationale

| Folder | Target at T+30 | At T+90 | Rationale |
|---|---|---|---|
| 00-MOCs | 8–12 | 10–12 | Hard cap. More than 12 = taxonomy, not navigation. |
| 01-Daily | 30 | 90 | 1 per day, auto-generated. |
| 02-Briefs | 30 + 4 | 90 + 12 | Daily + weekly briefs. Auto-generated. |
| 03-Prompts | 50–150 | 50–150 | 7-day rolling window. Older prompts live in Notion. |
| 04-Sparks | 20–50 | 50–100 | Captures awaiting triage. Triage target: <50 at any time. |
| 05-Atoms | 40 | 200 | The second brain. Karpathy-tier atomic notes. Every compound prompt harvest → atom. |
| 06-Projects | 4–6 | 4–6 | Active only. Completed moves to 09-Archive. |
| 07-Areas | 8 | 8 | Fixed set. One per brand + life area. |
| 08-Resources | 30 | 100 | Book notes, framework reference, people dossiers. |
| 09-Archive | 20 | 80 | Graveyard. Searchable, not navigable. |
| **Total curated** | **~250** | **~720** | Dense, not sprawling. Karpathy rule: fewer files, more links. |

**Anti-target**: >1,500 files at T+90 = capture-without-distillation. If we hit 1,500, `/harvest` is broken.

## The Karpathy LLM-wiki conventions (adopted)

Every note in `05-Atoms/` follows this shape:

```markdown
---
title: "Open-Core Pricing"
aliases: ["open core", "three-tier pricing"]
tags: [pricing, strategy, starlight-os]
created: 2026-04-20
updated: 2026-04-21
status: stable | evolving | superseded
links: [[07-Areas/starlight-os]], [[05-Atoms/frameworks/pricing-psychology]]
---

# Open-Core Pricing

**One-line thesis.** The free tier is the distribution moat; the paid tier is the revenue; the atelier tier is the brand ceiling.

## Why it matters
3-paragraph explanation.

## Related
- [[05-Atoms/concepts/loss-leader]]
- [[PR-0142]] — the prompt that produced the Starlight OS pricing
- [[2026-W16]] — week it was derived
```

Load-bearing rules:
1. **One idea per file.** If you can split a note into two atoms, split it.
2. **Every atom links at least 2 other notes.** Orphan atoms get hunted by `/vault-atlas` weekly.
3. **Title is the concept, not a sentence.** "Open-Core Pricing" not "How I think about pricing".
4. **Frontmatter is the API.** Tags, aliases, status, links — these are what the LLM indexes against.
5. **Status: stable → evolving → superseded.** Atoms are never "done" but they are audited.

## Prompt OS wiring

Prompt OS v1.4.0 writes to four folders:

| Flow | Writer | Destination | TTL |
|---|---|---|---|
| Capture | `/prompt-capture` | `03-Prompts/{date}/PR-{id}.md` | 7 days then Notion |
| Spark | `/capture` | `04-Sparks/{date}-{slug}.md` | until triage |
| Daily brief | `/daily-brief` (07:00) | `02-Briefs/daily/{date}.md` | permanent |
| Weekly brief | `/weekly-brief` (Sun 08:05) | `02-Briefs/weekly/{year-week}.md` | permanent |
| Daily note | `/capture --daily` | `01-Daily/{year}/{month}/{date}.md` | permanent |

**The compounding loop** (new, load-bearing):

```
03-Prompts/ → /prompt-harvest → Notion Captured Prompts → Council enrichment
    ↓
02-Briefs/daily/ ← /daily-brief (pulls Captured Prompts of last 24h)
    ↓
Council promotes prompt to Library (Replay≥3 or Hero+Shipped)
    ↓
/harvest extracts Library insight → 05-Atoms/{slug}.md  ← the second brain grows
    ↓
/weekly-brief pulls stable Atoms + Shipped Moves + Library promotions
    ↓
/ship-public renders Atom + Library entry → frankxai/starlight-os OSS
```

Every atom has provenance. Every public prompt has an atom. No orphan knowledge.

## Migration plan — 48-hour path

### Hour 0–2: Scaffold
1. Create the 10 top-level folders with README.md anchors.
2. Delete the 14 phantom `.obsidian` dirs (keep `Arcanea/.obsidian` and `FrankX/.obsidian` only).
3. Seed 8 MOCs: `MOC-Brands.md`, `MOC-Prompt-OS.md`, `MOC-Council.md`, `MOC-People.md`, `MOC-Frameworks.md`, `MOC-Books.md`, `MOC-Decisions.md`, `MOC-Second-Brain.md`.
4. Seed 8 Area notes (one per brand + life area).

### Hour 2–12: Migrate existing 37 wiki files
- `wiki/skills/*` → stays (skill specs are their own category)
- `wiki/meta/*` → stays (ADRs)
- `wiki/decisions/*` → stays
- `wiki/learnings/*` → stays
- `wiki/people/*` → `08-Resources/people/`
- `wiki/music/*` → `08-Resources/music/`
- `wiki/arcanea/*`, `wiki/business/*`, `wiki/frankx/*`, `wiki/sis/*` → decision per file: Area page or Atom

### Hour 12–24: Seed atoms
Harvest 40 atoms from existing Prompt OS v1.4.0 + Starlight OS architecture + Captured Prompts:
- 10 strategy atoms (open-core pricing, counter-coach rule, OODA closure, etc.)
- 10 framework atoms (Karpathy wiki, PARA, LYT, Naval compounding, Graham writing, Lindy, Dispenza, compound interest on thinking)
- 10 people atoms (Naval, Karpathy, Graham, Collison, Perell, Shipper, Lenny, Balaji, Saarinen, Tufte)
- 10 Arcanea-native atoms (12 Chosen, Lumina Queen, Council roles, DAG, Energy Score)

### Hour 24–48: Wire Prompt OS writes
- Update `/prompt-capture` template to write `03-Prompts/{date}/PR-{id}.md`
- Update `/daily-brief` write path to `02-Briefs/daily/{date}.md`
- Update `/weekly-brief` write path to `02-Briefs/weekly/{year-week}.md`
- Verify first scheduled runs land in the right place.

### Hour 48+: Establish `/vault-atlas`
New weekly-Sunday skill that audits:
- Orphan rate (atoms with <2 links): target <5%
- Stub rate (atoms <50 words): target <10%
- Daily-brief-to-atom promotion rate: target ≥1/week
- MOC freshness (days since update): flag >14 days
- Tag sprawl (unique tags / atoms): target <3.0

## MOC seeding order (12 hours of work)

1. **MOC-Second-Brain.md** — meta entry point, links to this ADR
2. **MOC-Brands.md** — 5 brands with 1-line thesis each, links to Area notes
3. **MOC-Prompt-OS.md** — v1.4.0 architecture, links to 10 skill specs
4. **MOC-Council.md** — 6 roles, links to Counter-Coach rule atom
5. **MOC-People.md** — principal-tier thinkers, links to 10 people atoms
6. **MOC-Frameworks.md** — methodologies Frank uses, links to framework atoms
7. **MOC-Books.md** — books that shaped thinking, links to book atoms
8. **MOC-Decisions.md** — major pivot log, links to `decisions/`
9. **MOC-Projects.md** — active 06-Projects/, auto-regenerable
10. **MOC-Goals.md** — bound to Starlight OS Goal DB, links to Gate atom
11. **MOC-Patterns.md** — emerging cluster patterns from Observer role
12. **MOC-Shipped.md** — public OSS + public briefs + public atoms

Hard cap: 12. If a 13th MOC is needed, promote content to an Area instead.

## Why not Obsidian MCP

Frank asked. The MCP registry (checked 2026-04-21) returns no Obsidian connector. Community builds exist (`mcp-obsidian` by MarkusPfundstein, `obsidian-mcp-server` by cyanheads) but:

1. **The vault is already mounted** — Read/Write/Edit + bash do everything an Obsidian MCP would do, with one fewer hop.
2. **Live Obsidian API adds state** — plugin writes fight with file-system writes. The file system is the source of truth.
3. **The valuable thing isn't the connection, it's the graph stats** — `/vault-atlas` reads files and reports. No MCP needed.

**Decision: skip MCP. Add a thin Python graph-stats script under `Arcanea/scripts/vault-atlas.py`** that walks the vault, builds a link graph, and reports orphans, stubs, MOC freshness, tag sprawl. Callable from the `/vault-atlas` skill or via bash.

Reconsider MCP when: Obsidian is open during Cowork sessions and we want live-refreshing graph views. Not there yet.

## Load-bearing invariants

1. **One vault, one graph.** `Arcanea/wiki/` is the second brain. FrankX vault is publishing-only.
2. **Atoms are atomic.** One idea per file. Splits encouraged, merges rare.
3. **Every atom has ≥2 links.** Orphans are defects.
4. **MOCs capped at 12.** Navigation, not taxonomy.
5. **Prompt OS writes only to hot-tier folders.** Never touches atoms directly.
6. **/harvest is the only path from hot to evergreen.** Captures don't become atoms by accident.
7. **Archive is searchable, not navigable.** No MOCs point into 09-Archive.
8. **Vault-atlas runs Sunday 08:45**, between weekly-brief (08:05) and curate (11:45) — flags decay before the curation decision.

## Kill criteria for v2

Revert to pre-v2 if after 30 days:
- Atoms count <40 (distillation isn't happening)
- Orphan rate >20% (atoms don't connect — wrong structure)
- Daily briefs don't land in `02-Briefs/daily/` (wiring broken)
- Frank opens the old `wiki/frankx/` instead of `07-Areas/frankx.md` (habit didn't take)

## How to apply

- When Frank says "save this to the vault" / "add this to my second brain" → route to `04-Sparks/` first, then `/harvest` to 05-Atoms/
- When Frank says "what do I know about X" → search `05-Atoms/` + MOCs
- When Frank says "show me the second brain" → open the Vault Atlas artifact
- When writing a new atom → follow the frontmatter template + link ≥2 other notes
- When an MOC exceeds 40 bullet points → split it; don't let MOCs become essays
- When building a new skill that writes markdown → choose a folder from the 10-folder taxonomy; don't invent new top-levels

---

*The second brain isn't files. It's the graph between them. Make the graph dense.*
