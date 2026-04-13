---
title: Semantic Map at Scale
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: active-build
links: [second-brain-buildout-plan, notion-map, inbox-architecture, knowledge-inventory]
---

# Semantic Map at Scale

How the second brain stays coherent when it grows past the point where any human can hold it in their head. Current scale: 150+ assets, 106 repos, 80+ Notion pages, 5 brands, 7 Linear projects. The map must remain navigable.

## The Three Maps

There is no single map. There are three, each optimized for a different reader:

1. **Human Map** — `wiki/README.md` + domain overviews. Hand-edited. Narrative. ~20 articles. Read when Frank opens the vault or onboards a collaborator.

2. **Agent Map** — `wiki/meta/notion-map.md` + this file. Canonical IDs, collection://, parent-child hierarchies. Read when agents need to write to a specific surface.

3. **Graph Map** — auto-generated from wiki frontmatter `links:` field. Not yet built. Will visualize orphans, clusters, and dead-ends.

## The Frontmatter Contract

Every wiki article MUST have YAML frontmatter with:

```yaml
---
title: {{human-readable title}}
domain: {{arcanea | frankx | sis | music | business | meta | decisions | learnings | people}}
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: {{claude | frank | agent-name}}
status: {{seed | growing | active-build | stable | archived}}
links: [{{slug1}}, {{slug2}}, ...]
---
```

Why this matters: the `links:` field is the edge list of the graph. Any article without `links:` is an orphan and should be pruned or connected within 7 days.

## Link Types (Informal)

Wiki links are untyped today, but the following conventions apply:

- `links: [../brand/overview]` — article belongs under a brand overview
- `links: [decisions/2026-04-XX-slug]` — references a specific architecture decision
- `links: [learnings/pattern-name]` — references a pattern or post-mortem
- `links: [people/name]` — references a person
- `links: [meta/*]` — references a meta/infrastructure doc

When Phase 3 tooling builds the graph, these prefixes become edge types.

## Scale Problems (Current)

### Problem 1: Notion sprawl

**Observation:** 80+ Notion pages, 30+ databases, 4 root trees (Arcanea, FrankX.AI Command Center, Empire Dashboard, Becoming). No single place tells you what exists.

**Root cause:** Notion is a capture tool, not an information architecture. Pages spawn without category assignment.

**Fix:**
1. `wiki/meta/notion-map.md` is canonical. Every Notion page worth knowing about is listed there with its collection:// or page ID.
2. The monthly ritual: search Notion for pages created in the last 30 days, append to notion-map, decide Archive / Keep / Promote.
3. Any page that is never referenced from notion-map can be archived.

**Structural gaps (from notion-map):**
1. No Business Notion hub (should sit beside Arcanea, FrankX, SIS)
2. FrankX.AI Hub is stale (6+ months)
3. SIS nested under Arcanea — should be promoted to top-level
4. Dream100 DB fragmented across pages
5. Wealth Command Hub manual-entry only
6. Morning Briefs accumulating without rotation
7. Workshops unexecuted
8. Podcast scripts unrecorded

All 8 are tracked as Phase 3 buildout items in `second-brain-buildout-plan.md`.

### Problem 2: Repo sprawl

**Observation:** 106 repos under frankxai/. No single view shows which are active, which are graveyard, which shipped.

**Fix:** `/repo-triage` skill (see `wiki/skills/repo-triage.md`). Weekly scheduled task grades every repo:
- **Active:** commits in last 14 days
- **Dormant:** commits 14-90 days old, no open issues
- **Graveyard:** 90+ days inactive, archive candidate
- **Shipped:** has a release tag + LIVE deployment

Each repo becomes a Linear issue in `ARC-INBOX` labeled with its grade. Dormant/Graveyard get a weekly ping.

### Problem 3: Cross-platform references are manual

**Observation:** A wiki article might reference a Linear issue, a Notion page, a GitHub repo, a Google Drive doc. The links are manually typed markdown. If any destination moves, links rot.

**Fix (Phase 3):**
1. Short-code registry: `wiki/meta/short-codes.md` maps `ARC-MCP-001` → real Linear issue URL. Wiki articles use short codes, tooling resolves them.
2. Periodic link check scheduled task: `check-wiki-links.py` runs weekly, reports broken references.

For now, this is a known deferred problem.

### Problem 4: Obsidian is a black box

**Observation:** Frank's Obsidian vault has insights, journal entries, quick notes. None of it flows into the wiki without manual harvest.

**Fix (Phase 3):** `/harvest` skill — weekly Sunday pass over Obsidian's `Inbox/` folder. Reads notes, identifies candidates, creates Linear inbox items with back-links.

Not a replacement for the daily triage ritual — an additional source drain.

### Problem 5: Legendary Brain parallel system

**Observation:** Frank has a full custom Notion system (Legendary Brain, 7947ce2d) running in parallel to this wiki. Brain Gems, Project Hub, Goals, Daily Dashboard, Calendar. Risk: the two diverge and Frank has two brains.

**Fix:** 
- Legendary Brain owns **personal** layer: goals, focus questions, daily dashboard, journal, calendar
- This wiki owns **operational/architectural** layer: decisions, systems, repos, canon, client work
- Explicit bridges at the boundary:
  - Brain Gems with `#wiki` tag → weekly harvest into wiki
  - Wiki decisions that affect personal life (e.g., workspace ergonomics) → note in Brain Gems
- Quarterly reconciliation: scan both, flag facts that live in only one

## The Graph View (Phase 3)

Once all articles have `links:` frontmatter, a Python script can build a graph:

```python
# pseudocode
for article in wiki/**/*.md:
    node = article.slug
    edges = article.frontmatter.links
    graph.add_node(node, domain=article.frontmatter.domain)
    for edge in edges:
        graph.add_edge(node, edge)

# Queries:
# - orphans: nodes with degree 0
# - hubs: nodes with degree > 10
# - bridges: nodes connecting domain clusters
# - clusters: connected components per domain
```

Outputs:
- `wiki/meta/graph-snapshot.json` — serialized graph
- `wiki/meta/orphans.md` — weekly report of articles needing connection
- (Optional) Mermaid diagram in `wiki/meta/graph.md`

Not built yet. Add to Phase 3 backlog.

## Scale-Safe Patterns

- **Short articles, many links.** Prefer 10 short articles with cross-links over 1 mega-article. Search finds better; agents read less.
- **Frontmatter is contract.** Don't create articles without it. Don't create articles without at least one `links:` entry.
- **One canonical per fact.** A fact lives in one article. Other articles link to it, not duplicate it.
- **Dated decisions.** Every `wiki/decisions/*.md` is dated `YYYY-MM-DD-slug.md`. No exceptions. Supersession is explicit (`supersedes: 2026-03-14-old-decision`).
- **Archive, don't delete.** Old articles move to `wiki/{domain}/archive/` with a note at the top explaining why archived and pointing to the successor.

## Navigation Guarantees

From any wiki article, Frank or an agent should be able to reach:
- The brand overview in ≤ 2 clicks
- The README in ≤ 3 clicks
- The `buildout-plan` in ≤ 2 clicks
- Any related decision in ≤ 2 clicks

If any path exceeds this, the article is badly connected — add links.

## Daily Maintenance (agent ritual)

Per `agent-protocol.md`, a daily 9am pass should:

1. Count articles added in last 24h → log to `meta/daily-log.md` (future)
2. Count orphans (articles with empty `links:`) → report if > 3
3. Check for stale `status: active-build` articles older than 14 days → flag for review
4. Update `updated:` frontmatter when articles are edited
5. Verify README index line count < 150 (truncation risk)

## Weekly Maintenance (Sunday)

1. Run `/repo-triage` — file 106 repo statuses into Linear
2. Run Notion scan — any new pages in last 7 days? Append to notion-map
3. Harvest Obsidian daily-note inboxes
4. Harvest Legendary Brain Brain Gems with `#wiki` tag
5. Review Parked inbox items
6. Archive old Morning Briefs (keep latest 7)
7. Run link-check (Phase 3)
8. Commit wiki changes with clear message

## The Long Game

When the wiki has 500+ articles (estimated end of 2026):
- Domain overviews become too long → split into `overview.md` + `deep-dives/*.md`
- Linear ARC-INBOX becomes too noisy → per-brand inboxes with unified triage view
- Notion becomes archive → new knowledge lives in wiki first, Notion is read-only mirror
- Graph visualization becomes essential → Phase 4 tooling

The current architecture handles ~200 articles comfortably. Reassess at 300.

---

*The map is not the territory, but without a map the territory is unwalkable. Maintain the map.*
