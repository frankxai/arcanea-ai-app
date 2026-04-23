---
title: /prompt-curate — Weekly Cold→Library Promotion
domain: meta
created: 2026-04-20
updated: 2026-04-20
author: claude
status: spec
priority: P1
effort: 1 day
links: [README, prompt-capture, prompt-harvest, ../meta/prompt-os]
---

# /prompt-curate

**Purpose:** Weekly review pass that promotes Hero-quality Captured Prompts into the **📚 Prompt Library**. Each promoted prompt becomes a parameterized, replayable, sellable asset. The Library is the highest-margin product Starlight OS ships.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "curate prompts", "weekly prompt review", "promote prompts to library", or on scheduled Sunday 11:00 task (after /harvest at 10:00).

## Usage

```
/prompt-curate                          # last 7 days, Hero-flagged only
/prompt-curate --since 2026-04-13       # custom window
/prompt-curate --include-solid          # widen net to Solid yield as well
/prompt-curate --auto                   # LLM-generated draft entries (still requires manual approval)
```

## Source / Target

- Source: `collection://5621839b-bf0d-453f-8937-d6e9dc8991d0` (📥 Captured Prompts)
- Target: `collection://2befda8b-5403-4fcd-aba2-342ec20b3d2b` (📚 Prompt Library)

## Promotion criteria

Promote when **all** are true:
1. `Yield Quality = Hero` (or Solid if `--include-solid`)
2. `Outcome = Shipped` (Iterated and Discarded never promote)
3. `Promote to Library = True` (manual flag — curator's call)
4. Not already in Library (dedupe by Source Prompt relation)

## Promotion workflow (per prompt)

For each candidate Captured Prompt:

1. **Extract parameter shape.** Identify literal values that should become `{placeholders}`. Examples: project names, IDs, paths, dates.
2. **Write Use Case.** One sentence: "When to reach for this."
3. **Write Problem Statement.** What problem does this solve.
4. **Write Expected Output.** Shape of the artifact this should produce.
5. **Assign Tier.**
   - **Open** — generic, no proprietary context, ships in OSS
   - **Pro** — domain-specific, requires Starlight OS context, behind €19/mo
   - **Atelier** — high-leverage workflow, behind €497+€99/mo
   - **Internal** — trade secret or PII risk, never ships
6. **Assign Best Agent.** Which agent the prompt should be replayed against.
7. **Generate Slug.** `{domain}-{action}-{noun}` kebab-case.
8. **Create Library row** with Source Prompt relation back to original.
9. **(Optional) Generate skill file.** If Tier ∈ {Open, Pro}, write `Arcanea/wiki/skills/{slug}.md` from the Library entry.

## Auto mode (`--auto`)

LLM drafts the Library entry from the Captured Prompt. Curator (Frank) reviews, edits, approves. Auto mode never publishes without approval — it pre-fills fields only.

## Quarterly maintenance

In addition to weekly promotion, every quarter:
- Bump `Times Used` for actively replayed prompts
- Refresh `Last Reviewed` date
- Demote stale entries (no use in 90d) from Sellable
- Re-tier based on what's working in the funnel

## Report

```
Prompt Curation — Week of 2026-04-13 to 2026-04-19

Captured Prompts in window: 142
Hero-flagged: 11
Promote-to-Library checked: 8
Already in Library (skipped): 1
Promoted to Library: 7

Tier breakdown of new Library entries:
  Open: 3
  Pro: 3
  Atelier: 1

Skill files generated: 5 (saved to Arcanea/wiki/skills/)

Library now contains: 47 entries (Open: 18, Pro: 22, Atelier: 6, Internal: 1)
Sellable bundle (Pro+Atelier): 28 entries
```

## Acceptance Criteria

- [ ] Never promotes without `Promote to Library = True` flag
- [ ] Never overwrites existing Library entries
- [ ] Generates parameter placeholders consistently
- [ ] Writes skill file for Open/Pro tier promotions
- [ ] Updates Source Prompt relation on Library entry
- [ ] Posts summary to `#ops` Slack and `#starlight-os` for any new Sellable entries

## Dependencies

- Notion MCP (read Captured Prompts, write Prompt Library)
- File write access to `Arcanea/wiki/skills/`
- `/prompt-harvest` (produces Captured Prompts the night before)

## Scheduled Task

```yaml
name: weekly-prompt-curate
schedule: "0 11 * * 0"  # Sundays 11am (after /harvest at 10:00)
command: /prompt-curate --auto
notify_on: success
```

---

*Curation is where prompts become products. The Library is the moat.*
