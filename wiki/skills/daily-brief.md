---
title: /daily-brief — The 07:00 Reflective Artifact
domain: meta
created: 2026-04-20
updated: 2026-04-20
author: claude
status: spec
priority: P0
effort: 2 days
links: [README, prompt-capture, prompt-harvest, prompt-curate, ../meta/prompt-os]
---

# /daily-brief

**Purpose:** Generate the single page Frank reads before touching a keyboard every morning. Synthesizes yesterday's prompt volume through five Luminor roles into an artifact that changes behavior: what to replay, what to connect, what to kill.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "daily brief", "morning review", "what happened yesterday", or on scheduled 07:00 local task. The Brief is the load-bearing artifact of Starlight OS — if it isn't produced, the Reflective Council is broken.

## Usage

```
/daily-brief                            # yesterday's data, full Brief
/daily-brief --date 2026-04-19          # specific day
/daily-brief --skip luminor=strategist  # exclude one section
/daily-brief --preview                  # generate but don't publish
```

## The Reflective Council (5 Luminors, 5 jobs)

| Luminor | Job | Output column on Captured Prompts |
|---|---|---|
| Observer | Cluster prompts by Pattern | `Pattern Cluster` multi-select |
| Coach | Propose upgrades to top-3 by yield | `Coach Suggestion` rich text |
| Connector | Find cross-brand pattern overlap | `Cross-Brand Link` rich text |
| Strategist | Classify On-Gate / Adjacent / Drift / Orphan | `Drift Flag` select |
| Distiller | Flag Replay Count ≥ 3 for Library promotion | promotion queue |

## Execution flow

1. **Fetch**: all Captured Prompts where `Captured At = yesterday`.
2. **Observer pass**: cluster by keyword/embedding similarity. Tag each row's `Pattern Cluster`.
3. **Strategist pass**: for each prompt, compare to active Goal's Gate. Set `Drift Flag`:
   - `On-Gate` — directly serves active Gate
   - `Adjacent` — serves next-Gate or dependency
   - `Drift` — serves future Gate (>1 ahead) or deprioritized area
   - `Orphan` — no Goal relation
4. **Coach pass**: pick top-3 prompts by (`Yield Quality` ∈ {Hero, Solid} AND `Outcome = Shipped`). For each, generate one upgraded version + delta explanation. Write to `Coach Suggestion`.
5. **Connector pass**: semantic search across all projects' recent prompts. For each cross-brand match, write unification hypothesis to `Cross-Brand Link`.
6. **Distiller pass**: list prompts with `Replay Count ≥ 3` and not in Library. Flag for weekly `/prompt-curate`.
7. **Compose** the Brief markdown from sections.
8. **Publish** to: Notion (child of Daily Brief parent page), Slack `#ops`, Obsidian `briefs/{YYYY-MM-DD}.md`.

## Brief structure

```
🎯 ACTIVE GATE — days, volume, alignment %
📊 CLUSTERS — Observer verdict
🧠 COACH — top-3 replay-with-upgrade
🕸️ CONNECTOR — cross-brand patterns
🚨 STRATEGIST — gate risk + proposal
📚 DISTILLER — promotion candidates
⚡ TOP 3 MOVES — decision-ready actions for today
🌟 CREATIVE SPARKS — orphans with 30d timer
```

## Top-3 Moves rule (load-bearing)

Every Brief must end with 3 decision-ready actions. If the Council can't produce 3, it emits 1 or 2 — never padding. "Decision-ready" = a verb + an object + a deadline (e.g., "Replay `compile-sprint` against SP-03 today, ship by 14:00").

## Acceptance Criteria

- [ ] Completes in <5 minutes for ≤200 prompts/day
- [ ] Every section has either a verdict or "nothing to report — X days clean"
- [ ] Top 3 Moves always decision-ready (verb + object + deadline)
- [ ] Skips gracefully if prior day had zero captures (emits "rest day" Brief)
- [ ] Archives prior day's Brief as child page before publishing new one
- [ ] Posts Top 3 Moves (only) to Slack `#arcanea`
- [ ] Never publishes a Brief that hasn't been through all 5 Luminor passes (unless in circuit-breaker bypass mode)

## v2 Circuit-Breaker & Self-Halt Specification

The Daily Brief is the load-bearing reflective system. However, generating empty syntheses during prolonged periods of inactivity creates analytical drift and administrative noise.

### 1. Cold Pipeline Circuit-Breaker
- **Definition**: The prompt capture pipeline is considered **Cold** if yesterday's captured prompt count is 0.
- **Trigger**: If prompt captures are 0 for $\ge 3$ consecutive days:
  - The Daily Brief pipeline **collapses** into a single binary alert page.
  - The Reflective Council passes (Observer, Coach, Connector, Strategist, Distiller) are **bypassed** to conserve token usage and prevent empty hallucinations.
  - The output brief is generated containing only:
    - Current Active Gate Status.
    - Cold pipeline warning stating the consecutive day count of zero captures.
    - 1-2 system diagnostics / meta-failures.
  - Slack notification contains only the system warning/halt status.
  - Notion and Obsidian remain the canonical repositories for these collapsed briefs.

### 2. Self-Halt and Auto-Disable
- **Halt Threshold**: If the system remains in a cold pipeline state for $\ge 4$ consecutive days:
  - The `daily-brief` enters a **Self-Halt** state.
  - **Task Authority**: The daily-brief CLI task is granted the explicitly defined authority to self-disable/exit early (with exit code `0`) when in a self-halt state to avoid producing Notion page clutter or Slack spam.
  - **Resumption**: Halted state persists until one of the un-halt conditions is met:
    - The Gate 0 binary lands (Option A: publish PWYW-capable URL; Option B: reclassify in Goals DB + create Linear issue).
    - Operator explicitly clears the halt state or re-enables the task.

## Dependencies

- `/prompt-harvest` must have run (previous night 02:00 UTC)
- Active Goal exists with a Gate tag
- Notion MCP (read Captured Prompts, write Brief pages)
- Slack MCP (target channel: `#arcanea`)
- Obsidian vault write access
- LLM access (Claude Sonnet sufficient, bypassed in circuit-breaker mode)

## Scheduled Task

```yaml
name: daily-brief
schedule: "0 7 * * *"  # 07:00 local daily
command: /daily-brief
notify_on: always  # always notify; silence is worse than noise for the load-bearing artifact
```

---

*The Brief is the product of the Council. If the Brief doesn't change behavior, kill it — and fix the Council.*
