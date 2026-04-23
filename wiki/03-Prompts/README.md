---
title: 03-Prompts/ — Prompt OS Hot Tier
---

# 03-Prompts/

Hot-tier prompt capture. `/prompt-capture` writes here. 7-day rolling window before `/prompt-harvest` (02:15 daily) drains to Notion Captured Prompts DB.

## Structure

```
03-Prompts/
└── 2026-04-21/
    ├── PR-0142.md
    ├── PR-0143.md
    └── PR-0144.md
```

## Frontmatter

```
---
id: PR-0142
agent: claude-sonnet-4-6 | claude-code | gpt-4 | etc
project: starlight-os
goal: first-weekly-brief
created: 2026-04-21T14:22:00Z
---
```

## Rules

- Volume-default: every prompt captured, no triage at capture time
- Triage happens in Notion via Council enrichment
- After 7 days, source file can be deleted — Notion is the authoritative copy
- If capture fails, prompt is lost — write-and-forget, low ceremony
- Never edited by hand after capture — immutable record

See [[../skills/prompt-capture]] and [[../meta/prompt-os-v1.4.0-architecture]].
