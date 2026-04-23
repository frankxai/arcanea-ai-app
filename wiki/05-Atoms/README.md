---
title: 05-Atoms/ — Evergreen Atomic Notes
---

# 05-Atoms/

**The second brain.** Karpathy-style atomic notes. One idea per file. Every atom links ≥2 other notes. Orphans are bugs.

## Subfolders

- `concepts/` — native concepts Frank coined or defined (Counter-Coach Rule, OODA Closure, Energy Score)
- `frameworks/` — methodologies (PARA, LYT, Karpathy LLM-wiki, Open-Core Pricing)
- `people/` — principal-tier thinkers, one idea stolen per person

## Frontmatter template

```
---
title: "Short conceptual title"
aliases: ["alt name 1", "alt name 2"]
tags: [domain, secondary]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: stable | evolving | superseded
links: [[05-Atoms/concepts/x]], [[07-Areas/y]]
---
```

## Atom structure

```
# {Title}

**One-line thesis.**

## Why it matters
1–3 paragraphs.

## Where it shows up
Links to 2+ places in the OS where this idea is active.

## Related
- [[atom-1]]
- [[atom-2]]
```

## Status lifecycle

- `evolving` — new atom, <30 days old OR actively being rewritten
- `stable` — stood up to review, referenced across 2+ projects
- `superseded` — replaced by a better atom (links in frontmatter show the replacement)

## Forbidden

- No daily notes here (that's 01-Daily/)
- No captures here (that's 04-Sparks/ or 03-Prompts/)
- No project notes here (that's 06-Projects/)
- No essay-length atoms — if an atom exceeds 600 words, split it
