---
title: /vault-atlas — Second Brain v2 Health Audit
domain: meta
created: 2026-04-21
updated: 2026-04-21
author: claude
status: spec
priority: P0
cadence: Sunday 08:45 local (Europe/Amsterdam)
artifact_id: vault-atlas-v2
links:
  - ../meta/second-brain-v2-architecture
  - ../meta/prompt-os-v1.4.0-architecture
  - ./README
  - ./weekly-brief
  - ./prompt-curate
  - ./harvest
---

# /vault-atlas

**One-liner.** Weekly second-brain MRI. Reads the canonical vault, scores it against the v2 invariants, re-renders the `vault-atlas-v2` Cowork artifact, writes a dated health report, logs a row to Notion *Second Brain Health*, and pings Slack only if a kill-criterion trips.

**Posture.** This skill is the immune system of v2. If it doesn't run, the vault drifts from "Karpathy LLM-wiki" back to "scattered markdown" within ~3 weeks. Don't optimize it for prettiness — optimize it for **catching drift early enough that one weekend cleanup fixes it**.

---

## Trigger

- Scheduled: **Sunday 08:45 local (Europe/Amsterdam)**, between `/weekly-brief` (08:05) and `/prompt-curate` (11:45).
- Manual: `/vault-atlas` from any chat.
- Reactive: invoked at the end of any `/harvest` run that promoted ≥3 atoms.

## Preconditions

- `Arcanea/wiki/` exists with the canonical 10-folder scaffold (`00-MOCs/` … `09-Archive/`).
- ADR `wiki/meta/second-brain-v2-architecture.md` exists.
- Cowork artifact `vault-atlas-v2` exists (created 2026-04-21).
- Notion DB *Second Brain Health* exists (one row per audit). If absent, skill creates it on first run.
- Slack webhook `STARLIGHT_HEALTH_HOOK` available in env. If absent, skill logs to wiki only.

If preconditions fail, **fail loudly**: write to `wiki/meta/vault-atlas/_failures/{date}.md` with the missing dependency. Do not silently no-op.

---

## What it measures

Eleven metrics, grouped into four health dimensions. Every metric has a **good band**, a **warn band**, and a **kill band**. Crossing a kill band trips the corresponding §6 invariant from the ADR.

### Dimension 1 — Volume & velocity

| # | Metric | Definition | Good | Warn | Kill |
|---|--------|------------|------|------|------|
| 1 | Vault file count | All `.md` files under `Arcanea/wiki/` excluding `.obsidian/` and `_failures/` | trending toward T+30/T+90 targets | ±20% off trajectory | <50% of T+30 target at week 4 |
| 2 | Atom velocity | Atoms added to `05-Atoms/` this week | ≥5 | 2–4 | 0–1 |
| 3 | Spark throughput | Sparks created this week / sparks triaged this week | ratio 0.8–1.2 (capture matches triage) | 1.3–2.0 | >2.0 (capture outrunning synthesis) |

### Dimension 2 — Connection density (the Karpathy test)

| # | Metric | Definition | Good | Warn | Kill |
|---|--------|------------|------|------|------|
| 4 | Atom orphan rate | Atoms with `<2` outbound wikilinks | <10% | 10–25% | >30% (I4 violation) |
| 5 | MOC orphan rate | MOCs that no other file links *to* | 0 | 1 | ≥2 (the MOC is decorative) |
| 6 | Backlink fan-in (median) | Median number of incoming wikilinks per atom | ≥3 | 1–2 | 0 |

### Dimension 3 — Epistemic shape

| # | Metric | Definition | Good | Warn | Kill |
|---|--------|------------|------|------|------|
| 7 | Stub rate | Atoms with body `<200 chars` excluding frontmatter | <15% | 15–30% | >30% |
| 8 | Status distribution | % atoms `stable` / `evolving` / `superseded` | stable ≥30% by T+90 | stable 15–30% | stable <15% by T+90 (everything is "WIP") |
| 9 | MOC count | Files in `00-MOCs/` excluding README | 10–12 | 13–14 | ≥15 (I3 violation, taxonomy creep) |

### Dimension 4 — Loop closure

| # | Metric | Definition | Good | Warn | Kill |
|---|--------|------------|------|------|------|
| 10 | Brief→atom promotion | Atoms whose frontmatter `source` references this week's `02-Briefs/weekly/` file | ≥1 | 0 this week, ≥1 last week | 0 for 2 consecutive weeks |
| 11 | Atom→public surface | Atoms shipped this week to `frankxai/starlight-os` `/prompts/` or `frankx.ai` content | ≥1/month | 0 last 30d | 0 last 60d (compounding loop is open) |

---

## Algorithm (sequential, idempotent)

```
1. Snapshot vault state
   - walk Arcanea/wiki/, collect every .md file
   - skip: .obsidian/, _failures/, node_modules/, dist/, .git/
   - parse frontmatter (yaml-front-matter or minimal regex)
   - extract wikilinks ([[...]] including aliases)

2. Compute the 11 metrics above
   - resolve wikilinks against the file index (handle relative paths,
     trailing slashes on folder links, alias matches)
   - bucket atoms by status frontmatter
   - compute brief-source provenance by grepping atom frontmatter
     for `source:.*02-Briefs/weekly/2026-W{nn}`

3. Score each metric: green / amber / red
   - apply the good/warn/kill bands above
   - any red is a kill-criterion trip

4. Write dated report
   - path: wiki/meta/vault-atlas/{YYYY-W nn}.md
   - sections: Header, Summary verdict, 11-metric table,
     Top-5 orphan atoms, Top-5 stub atoms, Top-5 over-linked
     atoms (>10 outbound — candidate for splitting),
     MOC freshness (last touched), Trajectory chart data (JSON
     embedded for the artifact)

5. Re-render Cowork artifact
   - call mcp__cowork__update_artifact (or create_artifact if 404)
   - id: vault-atlas-v2
   - swap KPI numbers, target bars, growth chart series with
     fresh values; preserve layout and color tokens

6. Log Notion row
   - DB: Second Brain Health
   - props: Date (today), Week (W{nn}), Total files, Atom count,
     Atom velocity, Orphan %, Stub %, Stable %, Verdict
     (green/amber/red), Notes (markdown link to wiki report)

7. Conditional Slack alert
   - if ANY metric is red OR ≥3 are amber → ping #starlight-ops
     with: verdict, the failing metric(s), link to wiki report
   - if all green → silent (no notification noise)

8. Update MEMORY.md
   - bump project_second_brain.md `updated:` field
   - one-line state snapshot in the body
```

## Outputs

| Surface | Path / ID | Lifecycle |
|---------|-----------|-----------|
| Wiki report | `Arcanea/wiki/meta/vault-atlas/2026-W{nn}.md` | append-only, never deleted |
| Cowork artifact | `vault-atlas-v2` | overwritten weekly |
| Notion row | *Second Brain Health* DB | append-only |
| Slack alert | `#starlight-ops` | only on amber/red |
| Memory update | `project_second_brain.md` | bump + one-line state |

## Wiki report template

```markdown
---
title: Vault Atlas — Week {nn} 2026
type: vault-health
date: 2026-04-26
verdict: {green | amber | red}
trips: [I3, I4]   # invariants tripped, if any
links:
  - ../second-brain-v2-architecture
  - ../prompt-os-v1.4.0-architecture
---

# Week {nn} · Vault Atlas

**Verdict.** {one-sentence verdict.}

## Metric scoreboard

| # | Metric | Value | Band | Trend vs last week |
|---|--------|-------|------|---------------------|

## Top-5 orphan atoms (need ≥2 outbound links)

- [[atom-1]] — 0 outbound, last touched 2026-04-15
- ...

## Top-5 stub atoms (<200 chars)

- [[stub-atom-1]] — 87 chars, status: evolving
- ...

## MOC freshness

| MOC | Last touched | Outbound links |
|-----|--------------|----------------|

## Promotion log this week

- {N} atoms promoted from briefs to evergreen (source: weekly-brief)
- {N} atoms shipped to public surface (source: ship-public)

## Recommended actions (next 7 days)

1. ...
2. ...
3. ...
```

---

## Implementation notes

- **Language: Python.** One script `scripts/vault_atlas.py`. No deps beyond stdlib + `pyyaml` + `requests` (Slack/Notion).
- **Run from outputs sandbox** when invoked by Cowork; from `Arcanea/.claude/skills/vault-atlas/` when invoked by Claude Code.
- **Idempotent.** Re-running on the same week overwrites the report and the artifact; Notion uses `upsert` keyed on `Week`.
- **Performance budget.** <30 seconds wall-clock for vaults ≤1000 files. Beyond that, the brain is too big and we add caching.
- **Don't read body content** for metrics 1–9 except character count and frontmatter — keeps the script fast and avoids LLM dependency for this skill.
- **No LLM calls in the audit itself.** This is a static analyzer. The LLM only enters via the artifact's "Recommended actions" pane, which calls `window.cowork.sample()` against the metrics summary.

## Failure modes

| Symptom | Diagnosis | Action |
|---------|-----------|--------|
| Report written but artifact stale | `update_artifact` failed silently | retry once with `create_artifact` (idempotent on id) |
| All metrics green every week | bands too lax OR the brain isn't being used | tighten bands at T+30 review |
| All metrics red every week | bands too strict OR vault is genuinely broken | investigate before relaxing — usually the latter |
| Skill not running on Sundays | scheduled task not registered | re-register via `mcp__scheduled-tasks__create_scheduled_task` with cron `45 8 * * 0` Europe/Amsterdam |
| Notion DB write fails | column schema drift | log to wiki only; create issue ARC-INBOX |

## Cadence calendar

```
Sun 07:00  /daily-brief
Sun 08:05  /weekly-brief
Sun 08:45  /vault-atlas      ← here
Sun 09:00  /harvest (manual on Sundays after weekly review)
Mon 11:45  /prompt-curate
```

The 40-minute gap between `/weekly-brief` and `/vault-atlas` lets the weekly brief land in `02-Briefs/weekly/` so the audit measures it.

## Kill criteria for this skill

- 4 consecutive weeks of all-green with no manual intervention → bands are wrong, recalibrate (don't delete)
- 4 consecutive weeks of all-red with no remediation → Frank isn't reading the alerts; either fix the alert channel or kill the skill
- Wall-clock >120s on a vault <1500 files → performance regression, refactor before next run
- Artifact rendering fails 2 weeks in a row → drop the artifact write, keep the report (the report is the load-bearing output)

---

## Why this exists

A second brain that nobody audits is just a folder. PARA tells you where to put things; LYT tells you how to navigate; Karpathy tells you the atomic shape — but **none of them tell you the brain is starting to rot**. `/vault-atlas` is the dashboard that makes rot visible *before* it kills compounding. Run it weekly, fix one metric per week, and the brain stays Karpathy-class through 1000+ atoms.

Don't skip a Sunday.
