---
description: Morning briefing — composes /arcanea-status + /pulse + /sis recent + last handover's recommended next stack into a single one-screen boot sequence.
---

# /dawn — First Light

One command to start the day. Runs four information gathers in parallel, then stitches a 1-screen briefing with 3 concrete action items for today.

## Execution

### 0. SI mode check (silent unless reminder needed)

If the agent has not been booted via `prompts/ARCANEA_SUPERINTELLIGENCE.md` this session — i.e., the conversation began without the activation prompt being pasted — surface the BOOT line in the synthesized output (step 3) so Frank can paste it in his next turn. The activation prompt installs the source-of-truth read order, the Ten Principles, the Guardian/Gate routing table, and the slash-command routing table the rest of `/dawn` assumes is already in context.

If SI mode IS already active (the agent has read TASTE.md / DESIGN.md / CLAUDE.md / the newest handover this session), omit the BOOT line — it's just noise.

### 1. Parallel gather (single tool-call batch)

Run these four in one message:

```bash
# Repo + memory state
ls -t docs/ops/HANDOVER*.md 2>/dev/null | head -1
ls -t planning-with-files/CURRENT_STATE_*.md 2>/dev/null | head -1
ls -t planning-with-files/CURRENT_BACKLOG_*.md 2>/dev/null | head -1
git status -sb
```

Plus:
- Read the newest handover doc (full)
- Read the newest CURRENT_STATE (full)
- Call `mcp__starlight-sis__sis_recent_entries(limit=5)` if SIS MCP connected (skip if disconnected)
- Call `mcp__starlight-sis__sis_stats()` if SIS MCP connected

### 2. Pulse check

Invoke the `arcanea-orchestra` skill via Skill tool with subcommand `pulse` for life-domain scorecard (gates, streaks, ceremonies).

### 3. Synthesize

Produce **exactly** this output structure. One screen. No filler.

```
╔═══════════════════════════════════════════════════════════════╗
║                      DAWN — {today's date}                    ║
║              Guardian: {from handover or Shinkami}            ║
╚═══════════════════════════════════════════════════════════════╝

◐ BOOT  ▎ Not in SI mode this session? Paste prompts/ARCANEA_SUPERINTELLIGENCE.md first
        ▎ (Lead-Architect activation: 7-file PRIME ladder, Ten Principles, slash routing)

◐ STATE
• Branch: {branch} · {N} modified · {M} untracked
• Last handover: {filename} — {one-line essence}
• Planning state: {CURRENT_STATE date} · backlog {N items}
• SIS: {N} entries this week · {M} stale

◐ PULSE
• Gate focus: {from /pulse}
• Scorecard: {X/100} · streak {N} days
• Ceremony due: {yes/no}

◐ TODAY — 3 CONCRETE MOVES
1. [P0] {highest-priority item from handover "Recommended Next Stack"}
2. [P1] {second priority — from backlog or SIS signal}
3. [P2] {third — something small to close fast for momentum}

◐ FRICTIONS
• {any blocker from handover or "Current Blockers" section}
• {any 402/deploy/RAM signals visible in git status or logs}

  ─────────────────
  Next: start with move #1. Use /ao to dispatch if not Claude-native.
```

### 4. Brevity rule

If any section has no signal, **write "—"** rather than inventing content. A half-empty dawn is honest. A padded dawn trains distrust.

### 5. No commits, no writes

`/dawn` is read-only. It does not write handovers, does not touch vaults, does not commit. That's `/handover`'s job at end of day.

## Relationship

- `/dawn` (morning, read) ↔ `/handover` (evening, write)
- `/arcanea-status` gives raw state; `/dawn` synthesizes into action
- `/pulse` gives life-domain scorecard; `/dawn` includes a 3-line summary
- `/ao` executes the moves `/dawn` surfaces

Typical daily loop:

```
/dawn        → see state + 3 moves for today
/ao <task>   → dispatch each move
/handover    → capture wisdom at end
```

User args (filter focus, default all): $ARGUMENTS
