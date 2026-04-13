---
title: Skills Registry — Second Brain Workflows
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: growing
links: [../meta/second-brain-buildout-plan, ../meta/inbox-architecture]
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

## Build Order

P0 first. Build in this sequence because each depends on the previous:

1. `/capture` — no dependencies, immediate daily value
2. `/inbox-triage` — depends on capture being used + Linear ARC-INBOX existing
3. `/repo-triage` — depends on `gh auth` being configured
4. `/ship-it` — depends on Linear projects existing with cycles
5. `/confidential-capture` — depends on T1 Notion page existing
6. `/harvest` — depends on Obsidian folder conventions

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
