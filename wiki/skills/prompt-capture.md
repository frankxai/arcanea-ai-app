---
title: /prompt-capture — Yield-Point Prompt Logging
domain: meta
created: 2026-04-20
updated: 2026-04-20
author: claude
status: spec
priority: P1
effort: 0.5 day
links: [README, prompt-harvest, prompt-curate, ../meta/prompt-os]
---

# /prompt-capture

**Purpose:** Append a single prompt entry to the day's hot-tier file the moment something ships. Yield-point capture, not input-point capture. The hot file is `Obsidian/prompts/{YYYY-MM-DD}.md`, append-only, no curation discipline.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "log this prompt", "capture prompt", "save this prompt", "this one shipped", or after any artifact (PR, deploy, doc, file) is produced from a prompt worth replaying.

## Usage

```
/prompt-capture --agent <agent> --project <project> --topic "<topic>" --outcome <Shipped|Iterated|Discarded> --artifact <url> --tags "#tag1 #tag2"
/prompt-capture --quick "<one-liner>"   # auto-detects current agent/project from CLAUDE.md
```

## Hot-tier file format

Path: `{obsidian-vault}/prompts/{YYYY-MM-DD}.md` (created on first call of the day).

Each entry appended as:

```markdown
## HH:MM | {agent} | {project} | {topic}
**Prompt:** {full prompt text — collapsed if >500 chars}
**Outcome:** Shipped | Iterated | Discarded | Saved for Later
**Artifact:** {url or path}
**Tags:** #tag1 #tag2
**Yield:** Hero | Solid | Useful | Weak | Failed
---
```

## Capture rule (load-bearing)

Capture at the **yield point**, not the input point. When something ships → log the prompt that produced it. This compresses ~1000:1 vs naive logging and produces a *replayable* library.

**Do capture:**
- Prompts that produced a shipped artifact (file, PR, deploy, doc)
- Prompts that produced a non-obvious insight or decision
- Prompts that worked unexpectedly well or unexpectedly poorly (Hero or Failed)

**Do not capture:**
- Every chat message
- Clarifying back-and-forth
- Restarts and retries

## Auto-detection

When called without `--agent`/`--project`, the skill reads the current working directory's `CLAUDE.md` and infers:
- Agent: from invocation context (Claude Code, Cowork, etc.)
- Project: from repo root mapping (`Arcanea/` → Arcanea, `FrankX/` → FrankX, `vibeclubs.ai/` → Vibeclubs, etc.)

## Acceptance Criteria

- [ ] Runs in <1 second
- [ ] Creates daily file if missing with header `# Prompts — {YYYY-MM-DD}`
- [ ] Appends without overwriting prior entries
- [ ] Auto-detects agent and project when omitted
- [ ] Refuses to capture if `--outcome Discarded` and `--yield` is missing (forces reflection)
- [ ] Never blocks the user — async write, no confirmation prompt

## Dependencies

- Obsidian vault path configured (env: `OBSIDIAN_VAULT`)
- `/prompt-harvest` to drain hot tier nightly

---

*The yield is the unit. Everything else is noise.*
