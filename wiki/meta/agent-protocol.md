---
title: Agent Maintenance Protocol
domain: meta
created: 2026-04-08
updated: 2026-04-08
author: claude
status: seed
links: [interlinking-guide, growth-log, review-schedule]
---

# Agent Maintenance Protocol

How AI agents grow and maintain this wiki. Based on Karpathy's LLM Wiki principle: agents incrementally build a persistent, interlinked markdown knowledge base that compounds over time.

## Core Rules

1. **Never delete without review.** Mark articles as `status: stale` instead.
2. **Always interlink.** Every new article should reference 2+ existing articles.
3. **Frontmatter is mandatory.** title, domain, created, updated, author, status, links.
4. **Evidence over opinion.** Link to Linear issues, Notion pages, git commits.
5. **Distill, don't duplicate.** Wiki articles are summaries. Link to source docs.

## Article Lifecycle

| Status | Meaning | Action |
|--------|---------|--------|
| seed | Just created, minimal content | Expand in next pass |
| growing | Has structure, needs depth | Continue adding sections |
| mature | Comprehensive, well-linked | Review quarterly |
| stale | >30 days without update | Flag for review or archive |

## Daily Agent Pass (9am)

1. Read Linear active issues → update `*/blockers.md`
2. Read `planning-with-files/CURRENT_STATE` → update `business/gate-system.md`
3. Check revenue status → update `arcanea/revenue-path.md`
4. Count wiki articles + words → append to `meta/growth-log.md`
5. Create interlinks between new and existing articles

## Weekly Agent Pass (Sundays 10am)

1. Harvest Obsidian `ideas/` → create new `learnings/` articles
2. Scan Notion hubs (5 hubs) → update domain overviews
3. Review git log (all repos) → update domain changelogs
4. Prune: flag articles >30 days without update as stale
5. Generate wiki health report: coverage, gaps, staleness
6. Cross-pollinate: find patterns across brands → `learnings/`

## Interlinking Convention

Use `[[domain/article-name]]` format for internal wiki links:
- `[[arcanea/design-system]]` → links to arcanea/design-system.md
- `[[business/gate-system]]` → links to business/gate-system.md
- `[[decisions/2026-04-04_gtd-architecture]]` → links to dated decision

External links use standard markdown: `[Linear ARC-101](https://linear.app/...)`

## Article Template

```markdown
---
title: Article Title
domain: arcanea | frankx | sis | music | business
created: YYYY-MM-DD
updated: YYYY-MM-DD
author: frank | claude | agent
status: seed | growing | mature | stale
links: [related-article-1, related-article-2]
---

# Article Title

Core content. Dense, clear prose.

## Key Facts
- Fact with source link

## Open Questions
- Question needing resolution

## History
- YYYY-MM-DD: Created (seed)
```

## Growth Targets

| Metric | Week 1 | Month 1 | Month 3 |
|--------|--------|---------|---------|
| Articles | 15 | 40 | 100+ |
| Words | 5K | 20K | 50K+ |
| Interlinks | 20 | 100 | 300+ |
| Domains covered | 5/5 | 5/5 | 5/5 |
