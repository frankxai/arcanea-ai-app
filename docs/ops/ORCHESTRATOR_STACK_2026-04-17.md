# Arcanea Orchestrator Stack — 2026-04-17

## TL;DR

Three distinct "orchestrators" live on this machine. They do different things. Stop conflating them.

| Name | Binary | What it is | Where it runs |
|---|---|---|---|
| **Composio Agent Orchestrator** | `ao` | Multi-session manager for `claude-code` workers with web dashboard | Port 4200 (running, PID 55928) |
| **`/ao` skill (Arcanea Orchestrator)** | slash-cmd | Promotion workflow + digest + cleanup rules inside Claude Code | Per Claude Code session |
| **`arcanea-orchestrator` (planned repo)** | TBD | Standalone CLI that codifies our worktree + promotion protocol | Not built yet |

**Naming collision.** Composio's CLI is `ao`. Our skill alias is also `/ao`. Keep them separate in your head: `ao` (terminal) = Composio; `/ao` (Claude Code chat) = Arcanea skill.

---

## 1. Composio Agent Orchestrator — what it actually does

**Repo:** `github.com/composio/agent-orchestrator`
**Local install:** `~/.agent-orchestrator/` (session state), `~/frankx/agent-orchestrator.yaml` (config)
**Status:** Running at `http://localhost:4200`, 2 projects registered (`frankx`, `arcanea`).

### What it gives you

- **Multi-session coordination.** One "orchestrator" session spawns N "worker" sessions. Workers do the code; orchestrator observes.
- **Git worktree isolation.** Every worker gets its own worktree — no branch contention.
- **Tmux runtime.** Each worker runs in a detached tmux pane, visible via `tmux a -t <session>`.
- **Web dashboard.** `http://localhost:4200` shows live session state, worker status, PR linkage.
- **Issue-to-session spawning.** `ao spawn INT-1234` creates a worker for a Linear/GitHub issue.
- **PR claiming.** `ao spawn --claim-pr 123` attaches a worker to an existing PR.

### What it does NOT do

- **Does not wrap Codex, Gemini, or OpenCode.** The default agent is `claude-code` only. Other CLIs would need a plugin.
- **Does not route models.** It runs whatever model Claude Code is configured to use. That's where the Router Spec kicks in.
- **Does not persist memory across sessions.** Each worker starts fresh. Shared knowledge lives in `planning-with-files/` and `.arcanea/`.

### How to use it day-to-day

```bash
ao status                    # all active sessions across projects
ao session ls -p arcanea     # sessions for the arcanea project
ao spawn INT-1234            # new worker for Linear issue
ao send fx-1 "run tests"     # message an active worker
ao batch-spawn A-1 A-2 A-3   # three workers in parallel
```

---

## 2. The `/ao` skill — what it does

**Location:** `.claude/skills/arcanea-orchestrator/SKILL.md`
**Invoked by:** typing `/ao [mode]` in Claude Code chat.

Modes: `status`, `promote`, `digest`, `coach`, `cleanup`, `plan`, `handover`, `sync`.

It's a **workflow skill**, not a background service. It encodes our rules (max 2 worktrees, digest pattern, verify-before-promote) as subcommands. Runs in the foreground Claude Code session.

---

## 3. The big picture — how they compose

```
┌──────────────────────────────────────────────────────────────┐
│  YOU (terminal + Claude Code tabs)                           │
│                                                              │
│  • Opens 4-10 Claude Code tabs (cockpit)                     │
│  • Uses /ao skill for promotion discipline                   │
│  • Uses ao CLI to coordinate worker sessions                 │
└──────────────────────────┬───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Composio AO  │  │  Claude Code  │  │  /ao skill    │
│  (ao CLI)     │  │  (Opus 4.7)   │  │  (workflow)   │
│               │  │               │  │               │
│  - spawn      │  │  - Bash       │  │  - promote    │
│  - session ls │  │  - Task()     │  │  - digest     │
│  - dashboard  │  │  - Agent()    │  │  - cleanup    │
│    :4200      │  │               │  │               │
└───────┬───────┘  └───────┬───────┘  └───────────────┘
        │                  │
        │ spawns workers   │ delegates via Bash
        ▼                  ▼
┌─────────────────────────────────────────────────────┐
│  Worker CLIs (all read @arcanea/router-spec)         │
│                                                     │
│  ┌────────────┐  ┌──────────┐  ┌──────────┐         │
│  │ claude-    │  │ codex    │  │ gemini   │         │
│  │ arcanea    │  │ cli      │  │ cli      │         │
│  └────────────┘  └──────────┘  └──────────┘         │
│                                                     │
│  ┌──────────────────────────────────────┐           │
│  │ opencode + oh-my-arcanea             │           │
│  │ (free Zen models — bulk worker pool) │           │
│  └──────────────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
```

**Subscription economics:**
- Claude Max ($200/mo) covers Opus 4.7 unlimited **only inside Claude Code**.
- Opus via OpenCode Zen costs per-token (Zen doesn't honor the Max sub).
- Therefore: **Claude Code stays the brain.** OpenCode is the free-model worker pool for bulk work.

---

## 4. Visualizing "which agent on which repo"

You already have the answer:

- **Composio AO dashboard** at `http://localhost:4200` shows per-project, per-session state. Each session has a `sessionPrefix` (`fx-*` for frankx, `a-*` for arcanea) and links to its worktree + PR.
- **Claude Code tabs** show whatever you're currently driving.

### Gap: unified surface across both

The dashboard shows AO-spawned workers, but not your ad-hoc Claude Code tabs, your opencode sessions, or your codex runs.

### Options to close the gap

1. **Accept the split.** AO dashboard for managed workers, tabs for exploratory work. Zero effort, what you have now.
2. **Thin web dashboard in `apps/web/app/ops/`.** Server route reads: `ao` API (`localhost:4200/api/sessions`) + local git worktree state + recent Claude Code session files (`~/.claude/projects/...`). Render in one page. ~4 hrs.
3. **Vercel Ops template you mentioned.** Worth exploring as starting point — but custom will probably be faster than adapting a template to our session formats.

**Recommendation:** option (2). Build `apps/web/app/ops/agents/page.tsx` that aggregates:
- AO sessions (`GET localhost:4200/api/sessions`)
- Active git worktrees (`git worktree list --porcelain`)
- Recent Claude Code session metadata (from `~/.claude/projects/*/`)
- Open PRs per repo (via `gh pr list`)

One glance, you see every agent, which repo, which branch, idle/active.

---

## 5. Connection to the Router Spec (shipped today)

`packages/router-spec/models.yaml` is the single source for:
- Which model handles which task-class
- Which surface (claude-arcanea, oh-my-arcanea, arcanea-flow) prefers which tier
- When Opus 4.7 delegates to codex/gemini/opencode

Composio AO workers and Claude Code tabs both consume it. No more drift between surfaces.

---

## 6. Immediate actions

- [x] Ship `@arcanea/router-spec` — shipped 2026-04-17.
- [ ] Update `oh-my-opencode.json` to reference Router Spec task IDs.
- [ ] Add `claude-arcanea` agent frontmatter reference to Router Spec.
- [ ] Refresh blog post with GLM 5 + Opus 4.7 + link to Router Spec.
- [ ] Decide: build `/ops/agents` dashboard, or stick with AO `:4200`.
- [ ] Rename `/ao` skill alias? (collision with Composio `ao`.) Candidates: `/arc` or `/aoskill`.
