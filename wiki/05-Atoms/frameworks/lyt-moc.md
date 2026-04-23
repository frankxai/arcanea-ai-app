---
title: LYT Maps of Content
aliases: ["lyt", "moc", "maps of content", "nick milo"]
tags: [framework, knowledge-architecture, navigation]
created: 2026-04-21
updated: 2026-04-21
status: stable
source: "Nick Milo — Linking Your Thinking"
---

# LYT Maps of Content

**MOCs are navigation, not taxonomy.** Small number of entry-point pages that link to atoms by intent, not by category.

## The distinction

**Taxonomy:** folders and tags that classify. Breaks down at scale — classification is domain-dependent and prone to drift.

**MOC:** a markdown page of links organized by intent ("what am I trying to find?") with 1-line annotations.

## Rules

1. MOCs are entry points, not containers
2. Hard cap (we use 12) — more than that = taxonomy leaking in
3. One MOC per big domain, not per category
4. If an MOC exceeds 40 bullet points, split or promote content
5. MOCs are never essays — links + 1-liners only

## Where it shows up

- `00-MOCs/` — exactly this pattern
- [[../../00-MOCs/MOC-Second-Brain]] — the master MOC
- [[../../meta/second-brain-v2-architecture]]

## What we adopt

- MOCs as primary navigation
- 12-item hard cap
- Structure: title, aliases, tags, link sections by intent

## What we don't adopt

- "MOCs of MOCs" — recursive MOC layering becomes bureaucracy
- MOC sprawl — we aggressively kill MOCs that go stale >30 days

## Anti-pattern

Turning MOCs into outlines of outlines. MOC = navigation page. Outline = atom. They're different.

## Related

- [[karpathy-llm-wiki]]
- [[para]]
- [[../people/nick-milo]] (if seeded)
