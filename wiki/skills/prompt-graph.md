---
title: /prompt-graph — Visual Provenance DAG as Cowork Artifact
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: spec
priority: P2
effort: 1 day
links: [prompt-replay, prompt-search, ../meta/prompt-os-v1.4.0-architecture]
---

# /prompt-graph

**Purpose:** Renders the Parent/Child prompt DAG as an interactive Cowork artifact. Shows which prompts compound, where lineage forks, which branches died, which became patterns. This is the **architecture visualization** — top thinkers (Tufte, Saarinen) will judge the OS on whether this view is *useful* or decorative.

**Triggering description (for SKILL.md):**
> Use when user says "show me the prompt graph", "visualize prompt lineage", "where did [PR-0142] come from", "which prompts compounded", "draw the DAG", "who's the parent of that", or explicitly when reviewing Weekly Brief and wanting to see the shape of the week.

## Why this exists

The DAG is invisible in tabular Notion views. A flat list of 800 captured prompts obscures the 20 that matter because they have 10 children each. The graph view makes the compound structure legible at a glance.

Naval's rule: *"If you can't see the leverage, you can't use it."*

## Usage

```
/prompt-graph                                         # full DAG, last 30 days
/prompt-graph --root PR-0142                          # subtree rooted at a Library entry
/prompt-graph --since 2026-04-01 --depth 3
/prompt-graph --cluster creative-spark                # only creative-spark lineages
/prompt-graph --agent claude-code                     # only Claude Code lineages
/prompt-graph --shipped                               # only lineages where a child has Move Shipped Date
```

## Visual design

Single-page Cowork artifact. Layout:

```
┌────────────────────────────────────────────────────────────────┐
│ 🧬 PROMPT DAG — {scope} — {N nodes, {M} edges}  [Refresh]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   [filter bar: cluster / agent / date-range / shipped-only]   │
│                                                                │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  d3-force directed graph                             │     │
│   │  - Library entries: large gold nodes                 │     │
│   │  - Captured prompts: small teal nodes                │     │
│   │  - Shipped lineages: green edges                     │     │
│   │  - Drift lineages: amber edges                       │     │
│   │  - Hover: prompt preview + Replay Count + Cluster    │     │
│   │  - Click: deep link to Notion row                    │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                │
│  Stats:                                                        │
│  - Max depth: 4                                                │
│  - Top compound node: PR-0142 (7 children, 3 shipped)         │
│  - Orphan rate: 6% (target <10%)                               │
│  - Cross-brand links: 3                                        │
└────────────────────────────────────────────────────────────────┘
```

## Technical implementation

**Artifact type:** Cowork HTML via `mcp__cowork__create_artifact`.

**Libraries:** d3-force for layout, pure SVG render, no external deps beyond CDN d3@7.

**Data fetch:** `window.cowork.callMcpTool('notion-fetch')` against Captured Prompts + Prompt Library, filtering by `Parent Prompt != null OR has children`.

**Refresh cadence:** On-open (live data from Notion). Also exposes "Refresh" button.

**Color palette** (respects light color-scheme):
- Background: `#fafafa`
- Library nodes: `#d4a017` (gold)
- Captured nodes: `#0f766e` (teal)
- Shipped edges: `#15803d` (green)
- Drift edges: `#c2410c` (amber)
- Text: `#18181b`

## Interaction model

- **Drag** nodes to manually arrange clusters
- **Click** node → slide-over with full prompt, Coach Suggestion, Counter Coach, Replay Count, deep-link to Notion
- **Double-click** Library node → fork (invokes `/prompt-replay` with that as parent)
- **Hover** edge → shows creation date + context delta between parent and child
- **Filter** buttons collapse the graph to the matching subset
- **Export** → PNG or SVG download (useful for Weekly Brief inclusion)

## The "compound audit" view (load-bearing)

Toggle mode that sorts Library entries by `descendant_count × shipped_count`:

```
COMPOUND AUDIT — Library entries ranked by realized leverage

1. PR-0142 "open-core pricing" — 7 descendants, 3 shipped → compound score 21
2. PR-0089 "compile sprint" — 5 descendants, 2 shipped → compound score 10
3. PR-0034 "two-tier capture" — 3 descendants, 0 shipped → compound score 0 [SUPERSEDED]
4. PR-0156 "notion ddl bidirectional" — 2 descendants, 2 shipped → compound score 4
...

Bottom 5 Library entries — candidates for archive:
- PR-0201 "quick brainstorm X" — 0 descendants, 30 days old
```

This is where the OS earns its keep: Frank sees which prompts are *actually* leveraged vs which just sit in the Library looking useful.

## Statistics surfaced

| Stat | Target | Alert threshold |
|---|---|---|
| Orphan rate (captured w/ no parent AND no children) | <10% | >20% → volume-capture drifting off purpose |
| Max DAG depth | ≥3 at T+30 | <2 at T+30 → not replaying enough |
| Compound score top-10 total | >50 at T+60 | <20 → Library is not compounding |
| Cross-brand links | ≥5 at T+30 | 0 → Connector role not firing |
| Shipped-lineage ratio | ≥20% | <5% → Top-3 Moves not derived from prompts |

Weekly Brief pulls these stats automatically.

## Model selection

- **Rendering:** pure client-side JS, no LLM in the hot path
- **Compound audit reasoning:** Sonnet, runs once-per-open when audit mode is toggled — produces the 2-line rationale for each top/bottom entry

Cost: ~$0 on pure graph view, ~$0.02 per audit-mode toggle.

## Acceptance criteria

- [ ] Graph loads in <2s for 500-node scope
- [ ] Respects all filter flags
- [ ] Click-through to Notion works
- [ ] Compound audit view correctly ranks by descendants × shipped
- [ ] Export PNG works at presentation-quality resolution
- [ ] Double-click-to-fork triggers `/prompt-replay` correctly
- [ ] No loops rendered (DAG integrity enforced)
- [ ] Orphan rate + depth + compound stats displayed
- [ ] Light color scheme; high contrast; accessible focus states

## Dependencies

- `Parent Prompt` relation populated (ships v1.4.0)
- `/prompt-replay` shipped (for fork interaction)
- `Move Shipped Date` column populated by milestone-scanner
- Cowork MCP exposes Notion fetch in artifact context

## Scheduled slot

None. On-demand. Could be embedded as a panel in the main Cowork Dashboard artifact (v2).

## Future (v2)

- Timeline mode: scrub through the DAG as it grew day-by-day
- Heatmap: which clusters produce the deepest compound
- Inter-operator view (Atelier tier): compare DAG shapes between users

---

*If you can see which ideas have children, you know where to put your hands.*
