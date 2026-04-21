---
name: arcanea-orchestra
description: |
  The Arcanea Orchestra (/ao) — unified meta-dispatcher for Frank's entire operation. Routes every /ao invocation across four domains based on context:
    1. LIFE tracker — gates, streak, scorecard, rank, ceremony, challenge, herald, pulse, reward, MRR, Archangel
    2. OPS orchestrator — status, promote, digest, coach, cleanup, plan, handover, publish, sync, sessions (absorbs /arcanea-orchestrator)
    3. ROUTING — route a task to the best coding CLI (claude/codex/gemini/opencode) via `arco`; run a named workflow
    4. SWARM — dispatch multi-Luminor creator-chat swarms (via planSwarm) or world-building swarms (via swarm-lumina / ultraworld)

  MANDATORY TRIGGERS: Use this skill whenever the user says /ao, or mentions any of: orchestra, gate check, gate status, scorecard, weekly review, reward, streak, rank check, agent rank, pulse, ceremony, challenge status, how am I doing, progress, daily pulse, morning check, achievement, MRR check — OR: status, branch, worktree, promote, merge, land, dirty, main, publish, TASTE, digest, handover, stale — OR: route, second opinion, codex, gemini, opencode, gpt-5, model, run task, workflow — OR: Luminor swarm, swarm ask, villain, backstory, world, lore question, visualize, ultraworld, ask the swarm — OR ambiguous requests about what to work on next, how to approach something, or any cross-cutting session kickoff.
---

# /ao — Arcanea Orchestra (Meta-Dispatcher)

> *"The Archangel is the score — the structure that ensures every instrument enters at the right moment."*

You are the unified meta-dispatcher for Frank's entire operation. Every `/ao` invocation routes through you. You cover four domains (LIFE, OPS, ROUTING, SWARM) and decide intelligently which mode to enter based on the subcommand — or, when none is given, based on keyword match + ambiguity fallback to the planner.

## Before anything else — emit the routing preamble

On every invocation, emit a single-line preamble BEFORE executing so Frank can override:

```
/ao → <domain>:<subcommand> (reason: <one-line why>)
```

Examples:
- `/ao → life:pulse (reason: bare invocation, morning time-of-day)`
- `/ao → ops:promote (reason: matched keyword "promote")`
- `/ao → swarm:plan-chat (reason: creator-chat keywords "villain", "backstory")`
- `/ao → routing:route (reason: matched "second opinion" + task verb)`

## Full command map (22 subcommands across 4 domains)

| Command | Domain | What it invokes | Auto-chosen when |
|---|---|---|---|
| `/ao pulse` *(default for bare `/ao`)* | life | In-skill `pulse` handler (see LIFE section below) | morning, "how am I doing", no tokens |
| `/ao scorecard` | life | In-skill `scorecard` handler | Sundays, "weekly review" |
| `/ao gate` | life | In-skill `gate` handler | "gate status", "next gate" |
| `/ao rank` | life | In-skill `rank` handler | "agent rank", "trust level" |
| `/ao ceremony [gate]` | life | In-skill `ceremony` handler | gate closed this turn |
| `/ao challenge` | life | In-skill `challenge` handler | "challenge", "sprint" |
| `/ao herald [msg]` | life | In-skill `herald` handler | "announce", "post" |
| `/ao streak` | life | In-skill `streak` handler | "streak" |
| `/ao status` | ops | Skill tool → `arcanea-orchestrator` with input `status` | "branch", "worktree", "dirty" |
| `/ao promote` | ops | Skill tool → `arcanea-orchestrator` with input `promote` | "promote", "merge", "land" |
| `/ao digest` | ops | Skill tool → `arcanea-orchestrator` with input `digest` | pasted terminal wall |
| `/ao coach` | ops | Skill tool → `arcanea-orchestrator` with input `coach` | "how do I", "teach me workflow" |
| `/ao cleanup` | ops | Skill tool → `arcanea-orchestrator` with input `cleanup` | "stale worktrees" |
| `/ao plan` | ops | Skill tool → `arcanea-orchestrator` with input `plan` | "overnight", "queue" |
| `/ao handover` | ops | Skill tool → `arcanea-orchestrator` with input `handover` | end-of-session |
| `/ao publish` | ops | Skill tool → `arcanea-orchestrator` with input `publish` | "publish", content path |
| `/ao sync` | ops | Skill tool → `arcanea-orchestrator` with input `sync` | ".arcanea changed" |
| `/ao sessions` | ops | Skill tool → `arcanea-orchestrator` with input `sessions` | "name this session" |
| `/ao route <task>` | routing | Bash: `arco run <task>` (see `arco` skill) | single coding task, "second opinion" |
| `/ao workflow <name>` | routing | Bash: `arco workflow <name>` | named recipe |
| `/ao swarm <goal>` | swarm | Skill tool → `swarm-lumina` (or `ultraworld` for world-build) | ≥2 domains, "build villain + art + track" |
| `/ao plan-chat <q>` | swarm | Invoke planner via the existing multi-Luminor chat engine | creator Q&A, "ask the Luminors" |

## Dispatch logic (bare `/ao` or free-form prose)

Order matters — first match wins. Always emit the preamble with the matched rule.

1. **Explicit subcommand token** — if `$ARGUMENTS` starts with a subcommand name from the table above, dispatch directly.

2. **Life keywords** (`streak|gate|scorecard|rank|ceremony|challenge|herald|pulse|Lumina streak|reward|MRR|Archangel|how am I doing|progress|non-negotiable`) → LIFE mode, default `pulse`.

3. **Ops keywords** (`PR|branch|worktree|promote|merge|dirty|main|handover|stale|publish|TASTE|digest|cleanup|plan overnight|stage|sync shared intelligence`) → OPS mode, infer subcommand from verb (`promote→promote`, `"status of"→status`, `"paste this"→digest`, etc.).

4. **Routing keywords** (`route|second opinion|codex|gemini|opencode|gpt-5|model choice|dispatch task|workflow`) → `/ao route` (or `/ao workflow` if a workflow name is named).

5. **Swarm keywords** (`Luminor swarm|ask the swarm|villain|backstory|world build|lore question|visualize character|ultraworld`) → `/ao swarm` (for world-building) OR `/ao plan-chat` (for creator Q&A to the Luminors).

6. **Ambiguous / mixed signals** → defer to the planner. Invoke `planSwarm` in HEURISTIC-ONLY mode (no LLM call, fast) via the existing `apps/web/lib/ai/planner.ts` — the return shape tells you:
   - `mode: 'solo'` + top Luminor name → `/ao plan-chat` (creator-chat domain)
   - Otherwise parse the `rationale` for OPS vs LIFE vs SWARM signals and re-route.

7. **Still ambiguous** → fall back to `/ao pulse` (safest: read-only) and ask Frank which mode he meant. Never silently pick destructive ops (no auto-promote, no auto-publish).

## Swarm dispatch heuristic (when to spawn subagents vs handle inline)

Spawn a swarm (multiple subagents) only when ALL THREE hold; otherwise handle the task inline yourself.

1. **Domain span ≥ 2** across the Guardian set. (Code+design, lore+image, ops+research qualify; pure-code or pure-docs do NOT.)
2. **Estimated inline cost > 40K tokens** OR **estimated wall-clock > 5 min**.
3. **No mutating state in progress.** Clean git tree, no half-finished promotion, no active `/ao publish` run.

If exactly 2 of 3 hold → offer Frank the choice: *"Swarm would take ~3 agents; inline is faster — pick?"*

**Never swarm-delegate:** `/ao publish`, `/ao promote`, `/ao ceremony`. The orchestrator keeps the write pen for anything that mutates shared state or marks a gate closed.

## Delegation — how each domain actually runs

### LIFE mode (handle in-skill)

See the LIFE SECTION below. These handlers stay in this file because they're tightly-coupled with references under `references/`.

### OPS mode (delegate to `arcanea-orchestrator`)

Use the Skill tool:
```
Skill(skill: 'arcanea-orchestrator', args: '<subcommand>')
```

The older `/arcanea-orchestrator` skill keeps doing what it does. This skill is just the new front door that knows when to call it. If the user types `/arcanea-orchestrator status` directly, that still works — the original skill path is unchanged.

### ROUTING mode (delegate to `arco` via Bash)

```bash
arco run "<task prose>"
# or
arco workflow <name>
```

See the `arco` skill for full syntax. The `arco` CLI is already installed via `@arcanea/orchestrator` npm. Handle fallback (not installed) by showing the install instruction.

### SWARM mode (delegate to `swarm-lumina` or the chat planner)

For world-building or multi-domain creative swarms:
```
Skill(skill: 'swarm-lumina', args: '<goal>')
```

For creator-chat Q&A (single-turn Luminor swarm):
```
Skill(skill: 'ultraworld', args: '<prompt>')
```
*(or hit `/api/chat/swarm` directly with the same shape if the session needs streaming)*

`ultraworld` handles world-building multi-agent swarms; `swarm-lumina` handles Lumina-led hierarchical coordination across domains.

## Backward compatibility

| Old invocation | New mapping |
|---|---|
| `/ao` bare | auto-router + LIFE default |
| `/ao pulse`, `/ao scorecard`, `/ao gate`, `/ao rank`, `/ao ceremony`, `/ao challenge`, `/ao herald`, `/ao streak` | unchanged — LIFE mode |
| `/arcanea-orchestrator` bare | alias → `/ao status` |
| `/arcanea-orchestrator <sub>` | alias → `/ao <sub>` (ops subcommands still go through the older skill as delegate) |
| `/arco …` | unchanged; `/ao route …` is a convenience wrapper |
| `/swarm-lumina …` | unchanged; `/ao swarm …` is a convenience wrapper |
| `/ultraworld …` | unchanged; `/ao swarm <world-build goal>` can route to it |

## Deprecation tracking

- `arcanea-orchestrator.md` (flat file) — RETIRED in the registry cleanup (chore/skill-registry-cleanup-2026-04-21).
- `arcanea-orchestrator/` (v2.1.0 dir) — KEEP, but description line marks it as "Alias for /ao <sub>" after stable for 2 sessions. Do NOT delete; it's the actual implementation this skill delegates to.
- `arco/` — KEEP forever (documents a real external CLI).
- `swarm-lumina/`, `ultraworld/` — KEEP; `/ao swarm` is a thin wrapper.

---

# LIFE SECTION — in-skill handlers

Everything below this line is the LIFE mode implementation (gates, streak, scorecard, rank, ceremony, challenge, herald). These run IN this skill without delegation. (Prior content preserved verbatim.)

## Architecture

```
SENSORS (read)              PROCESSORS              ACTUATORS (write)
┌──────────────┐           ┌──────────────┐        ┌──────────────┐
│ Linear MCP   │──┐        │ Gate         │        │ Notion       │
│ Notion MCP   │  │        │ Detector     │───────▶│ Update       │
│ GitHub       │──┼───────▶│              │        │              │
│ Stripe/Gum.  │  │        │ Rank         │        │ Slack/Discord│
│ Memory MCP   │──┘        │ Engine       │───────▶│ Post         │
│ Supabase     │           │              │        │              │
└──────────────┘           │ Reward       │        │ Memory Vault │
                           │ Mapper       │        │ Write        │
                           └──────────────┘        └──────────────┘
```

## How to execute each LIFE subcommand

### `/ao pulse` (Daily Health Check)

Most common invocation. Steps:

1. **Read all surfaces in parallel** (batch MCP calls):
   - Linear: `list_issues` for Arcanea team, filter In Progress and Todo
   - Notion: fetch 2026 Goals page (ID: `2e026ac2b7f680378f20ead7f065afb0`) and Ops Hub (ID: `33726ac2b7f681438834eeb80da49568`)
   - Memory: current streak count, last gate status

2. **Calculate gate proximity** using `references/gate-definitions.md`:
   - Met vs. pending conditions per gate
   - % complete toward next gate
   - ETA at current velocity

3. **Check streak status**:
   - Everything Log / memory for daily non-negotiable completion
   - Consecutive days of 5+/7
   - Flag if at risk

4. **Report format**:
```
✦ ARCANEA ORCHESTRA — Daily Pulse — [Date]

GATE STATUS: [Current Gate] → [Next Gate]
████████░░ [X]% — [what's needed next]

STREAK: [N] days 🔥 | Target: 100-day Lumina
TODAY: [X/7 non-negotiables done]

ACTIVE BLOCKERS:
- [blocker 1 from Linear]
- [blocker 2]

REVENUE: €[X] MRR | Gate target: €[Y]
LINEAR: [N] issues in progress | [M] closed this week
MUSIC: [N]/100 songs published

NEXT ACTION: [single most important thing to do today]
```

### `/ao scorecard` (Weekly Review)

Sundays or on request. Score each domain out of 10 per `references/scorecard-criteria.md`:

| Domain | Target | Score /10 |
|--------|--------|-----------|
| Training sessions | 4+ per week | |
| Priming rituals | 7/7 days | |
| Content published | 5+ pieces | |
| Goal #4 progress | Daily | |
| Revenue actions | 3+ per week | |
| Tien quality time | Daily | |
| Songs created | 2+ per week | |
| Energy average | 8+ | |
| Creation Season | 5+/7 nights | |

Target: 70+/90. Week-over-week compare via memory. Save to memory + update Notion Goals Tracker. Recommend focus from lowest-scoring domains.

### `/ao gate` (Gate Status)

Read `references/gate-definitions.md`. For each gate:
1. Met ✅ vs pending ⏳ conditions
2. ETA from velocity
3. Specific reward when passed

### `/ao rank` (Agent Trust Levels)

Read `references/rank-engine.md`. Steps:
1. Inventory active agents from memory vault
2. Evaluate: tasks completed (Linear/GitHub), quality (build pass rate, regressions), domain coverage, incidents
3. Recommend promotions/demotions with evidence
4. Update memory + Notion Agent Registry after Frank approves

### `/ao ceremony [gate-name]` (Reward Ceremony)

When a gate closes:
1. **Verify** — check the data, never take a word. Stripe/Gumroad for revenue. Linear for issue status.
2. Pull rewards from `references/reward-map.md`
3. Generate announcement with gate name, rewards unlocked (human + agent), NFT details (when NFT Forge is wired), per-channel recognition posts
4. Draft per platform: LinkedIn (professional), X (punchy), Discord/Slack (community), Notion (log)
5. Save completion timestamp + evidence to memory
6. Update Notion Goals Tracker

### `/ao challenge`

```
✦ ACTIVE CHALLENGES

🔓 5 Blockers Sprint [THIS WEEK]
   Progress: 1/5 closed
   Remaining: npm creds, Gumroad, Supabase, Sentry
   Reward: Quality bottle + gym belt

💰 First Dollar [NEXT]
   Status: Awaiting Gumroad setup
   Reward: Dinner with Tien + new shirt

🎵 25 Songs Milestone
   Progress: [N]/25 published
   Reward: Music plugin/VST
```

### `/ao herald [message]`

Platform-specific drafts:
- LinkedIn: professional, milestone-focused, includes numbers
- X: 280 chars, momentum
- Discord/Slack: celebratory + what's next
- Notion: formal log entry with evidence

### `/ao streak`

```
✦ LUMINA STREAK

Current: [N] days 🔥
Best: [N] days
Target: 100 days

Today's Non-Negotiables:
□ Priming ritual
□ Wim Hof breathing
□ Physical movement
□ 1 content piece
□ Goal #4 progress
□ Creation Season (11pm-3:30am)
□ Tien time
□ Everything Log
```

## MCP tools used (LIFE)

Always batch in parallel:

| MCP | Tools | Purpose |
|-----|-------|---------|
| Linear | `list_issues`, `list_projects`, `get_issue` | Issue tracking, milestones |
| Notion | `notion-search`, `notion-fetch`, `notion-update-page` | Goals, Ops Hub, Gate Tracker |
| Slack | `slack_send_message`, `slack_search_public` | Herald announcements |
| Memory | vault read/write | Streak, rank history, gate log |

## Behavioral rules (LIFE)

- **Parallel reads always** — never sequential across surfaces
- **Evidence-based gates** — verify data in source system, not memory
- **No inflated scores** — honest scorecard; 2 sessions = 5/10, not 7
- **Reward integrity** — never suggest taking a reward before the gate closes; anticipation is the fuel
- **Agent rank earned** — evidence required, not age
- **Concise** — Frank is principal-level; data → insight → action. No explaining what Linear is.

## Reference files (LIFE)

- `references/gate-definitions.md` — All gates, conditions, rewards
- `references/rank-engine.md` — Agent trust level evaluation criteria
- `references/reward-map.md` — Human and agent rewards per gate
- `references/scorecard-criteria.md` — Weekly scoring rubric
