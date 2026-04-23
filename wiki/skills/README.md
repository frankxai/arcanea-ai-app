---
title: Skills Registry — Second Brain Workflows
domain: meta
created: 2026-04-10
updated: 2026-04-21
author: claude
status: growing
links: [../meta/second-brain-buildout-plan, ../meta/inbox-architecture, ../meta/prompt-os, ../meta/prompt-os-v1.4.0-architecture]
---

# Skills Registry

Specs for the agent workflows that maintain the second brain. Each skill is specified here first, then implemented as a `.claude/skills/{name}/SKILL.md` when built.

## Active Specs

| Skill | Purpose | Priority | Build effort | Status |
|-------|---------|----------|--------------|--------|
| [/capture](capture.md) | Universal inbox writer — capture any idea in 5 seconds | P0 | 2 hours | spec |
| [/inbox-triage](inbox-triage.md) | Daily 9am ritual — process ARC-INBOX in batch | P0 | 1 day | spec |
| [/repo-triage](repo-triage.md) | Weekly grading of 106 frankxai/ repos | P0 | 1 day | spec |
| [/ship-it](ship-it.md) | Milestone capture — screenshot + social drafts + wiki entry | P1 | 1 evening | spec |
| [/confidential-capture](confidential-capture.md) | Tier-aware capture, refuses T0 material | P1 | half day | spec |
| [/harvest](harvest.md) | Weekly harvest from Obsidian + Legendary Brain → wiki | P2 | 1 day | not-yet |
| [/prompt-capture](prompt-capture.md) | Volume-default prompt logging to Obsidian hot tier | P1 | half day | spec |
| [/prompt-harvest](prompt-harvest.md) | Nightly Obsidian → Notion Captured Prompts drain + Council enrichment | P1 | 1 day | **LIVE 02:15** |
| [/daily-brief](daily-brief.md) | **Load-bearing.** 07:00 Reflective Council artifact → Notion + Slack + Obsidian | **P0** | 2 days | **LIVE 07:00** |
| [/prompt-curate](prompt-curate.md) | Weekly Hero+Shipped OR Replay≥3 → Prompt Library promotion | P1 | 1 day | **LIVE Sun 11:45** |
| [/counter-coach](counter-coach.md) | **Adversarial Coach** — pairs every upgrade with opposite path (Sonnet 4.6 @ 0.8). Naval's loyal opposition. | **P0** | 1 day | spec |
| [/weekly-brief](weekly-brief.md) | **Sunday long-form shippable digest** → OSS + /llms.txt + Notion draft. Atelier top-of-funnel. | **P0** | 2 days | **LIVE Sun 08:05** |
| [/prompt-search](prompt-search.md) | Semantic search via Notion AI native; proactive replay suggestion on overlap | P1 | half day | spec |
| [/prompt-replay](prompt-replay.md) | Fork Library entry with template vars; writes `Parent Prompt` for DAG integrity | P1 | 1 day | spec |
| [/prompt-graph](prompt-graph.md) | d3-force DAG visualization as Cowork artifact + compound audit view | P2 | 1 day | spec |
| [/ship-public](ship-public.md) | Promote Library entry → OSS with lineage block + Atelier/PII vetoes | P2 | 1 day | spec |
| [/vault-atlas](vault-atlas.md) | **Second Brain v2 health audit.** Sun 08:45 — orphan rate, stub rate, link density, MOC freshness, tag sprawl, promotion throughput, kill-criteria checks. Re-renders vault-atlas-v2 Cowork artifact. | **P0** | 1 day | spec |

## Build Order

P0 first. Build in this sequence because each depends on the previous:

1. `/capture` — no dependencies, immediate daily value
2. `/inbox-triage` — depends on capture being used + Linear ARC-INBOX existing
3. `/repo-triage` — depends on `gh auth` being configured
4. `/ship-it` — depends on Linear projects existing with cycles
5. `/confidential-capture` — depends on T1 Notion page existing
6. `/harvest` — depends on Obsidian folder conventions
7. `/prompt-capture` — no dependencies (writes to Obsidian); enables prompt-harvest
8. `/prompt-harvest` — depends on `/prompt-capture` producing daily files + Notion Captured Prompts DB + Council-schema columns
9. `/daily-brief` — **P0, load-bearing.** Depends on `/prompt-harvest` + Captured Prompts enriched by Council + active Goal with Gate tag. If absent 3 days in a row, block other scheduled tasks until restored.
10. `/prompt-curate` — depends on `/prompt-harvest` populating Captured Prompts + Notion Prompt Library DB; now triggered by Replay Count ≥ 3 in addition to manual flag
11. `/counter-coach` — **P0 v1.4.0.** Depends on Coach completing its pass first. Runs inline in 05:30 Council. No separate schedule.
12. `/weekly-brief` — **P0 v1.4.0.** Depends on 7 Daily Briefs + Weekly Briefs Notion DB + `frankxai/starlight-os` OSS repo. Sunday 08:05 local.
13. `/prompt-search` — **P1 v1.4.0.** Depends on Notion AI workspace access. Proactive surface depends on `/prompt-capture` hook.
14. `/prompt-replay` — **P1 v1.4.0.** Depends on `Parent Prompt` self-relation shipped + at least 5 Library entries seeded.
15. `/prompt-graph` — **P2 v1.4.0.** Depends on `/prompt-replay` populating DAG + Cowork artifact API.
16. `/ship-public` — **P2 v1.4.0.** Depends on `frankxai/starlight-os` repo with `/prompts/` + `/llms.txt`, and `Business/legal/confidentiality.md` veto regex list.
17. `/vault-atlas` — **P0 v2 Second Brain.** Depends on the 10-folder scaffold under `Arcanea/wiki/` + the `vault-atlas-v2` Cowork artifact ID. Reads filesystem, not Obsidian API — no MCP needed. Runs Sunday 08:45 local (between `/weekly-brief` 08:05 and `/prompt-curate` 11:45). Outputs: (a) `wiki/meta/vault-atlas/{YYYY-W nn}.md` report, (b) re-rendered `vault-atlas-v2` artifact, (c) Notion Second Brain Health row, (d) Slack alert if any kill-criterion trips.

## Skill Structure Convention

Each skill follows this pattern:

```
.claude/skills/{skill-name}/
├── SKILL.md          # triggering description + full instructions
├── scripts/          # Python/Node helpers the skill invokes
│   └── main.py
├── templates/        # any markdown templates the skill generates
│   └── inbox-item.md
└── README.md         # dev notes, testing, known issues
```

The wiki spec (this directory) is the **intent** + **architecture**. The `.claude/skills/` folder is the **implementation**. Specs update first, then implementations follow.

## Success Metrics

A skill is working when:
- It runs in under 10 seconds (capture, triage previews) or in the background (repo-triage, harvest)
- It produces auditable output (Linear issue IDs, file paths, git commits)
- It requires zero manual cleanup
- It fails loudly when preconditions aren't met
- Frank forgets it exists because it just works

## Skill Kill Criteria

A skill is deleted if:
- Unused for 30 days
- Duplicated by a better skill
- Its preconditions (API, auth, surface) no longer exist
- The manual version is faster (happens more than it should)

---

*Skills are not features. Skills are rituals, encoded.*
