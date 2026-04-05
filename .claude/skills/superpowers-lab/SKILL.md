---
name: "Superpowers Lab"
description: "Parallel creative acceleration system for high-velocity builders. Launch multiple workstreams, track all progress, async review and continue, never lose an idea. Use when Frank says /superpowers-lab or wants to work at superhuman scale across multiple parallel initiatives."
---

# Superpowers Lab

> *"You don't slow down for the system. The system accelerates to match you."*

## What This Is

A parallel creative intelligence amplifier. You think in 10 directions at once — this system tracks, launches, reviews, and continues ALL of them without losing anything.

## Core Powers

### 1. LAUNCH — Fire and forget
```
/superpowers-lab launch "Build the factions codex page with 8 origin classes"
/superpowers-lab launch "Research best avatar APIs for Presence Layer"
/superpowers-lab launch "Write 3 blog posts about world-building"
```
Each launch spawns a background agent with full context. You don't wait. You keep moving.

### 2. STATUS — See everything at once
```
/superpowers-lab status
```
Shows ALL active workstreams: what's running, what completed, what needs your review. One glance = full picture.

### 3. REVIEW — Async review completed work
```
/superpowers-lab review
```
Shows all completed agent results waiting for your eyes. You approve, redirect, or continue each one.

### 4. CONTINUE — Pick up any workstream
```
/superpowers-lab continue "factions codex"
```
Resumes a paused or completed workstream with full context. Like time travel — jump back into any thread.

### 5. BURST — Maximum parallel execution
```
/superpowers-lab burst
```
Takes your current backlog and fires ALL launchable items as parallel agents. Maximum throughput.

### 6. INBOX — Morning intelligence briefing
```
/superpowers-lab inbox
```
Shows: what shipped overnight, what's waiting for review, what broke, what's next. Your command center.

## How It Works

When you say `/superpowers-lab [mode]`, the system:

1. **Reads your active workstreams** from `.arcanea/projects/` and memory
2. **Checks what agents completed** since your last review
3. **Presents actionable choices** — not walls of text, but "approve / redirect / continue / archive"
4. **Spawns background agents** for anything you greenlight — they work while you move to the next idea
5. **Saves state** to memory so you can pick up from ANY session, ANY device

## The Frank Protocol

You are not a sequential worker. You are a parallel creative intelligence. This system:

- NEVER asks you to slow down
- NEVER blocks on one thing before starting another
- ALWAYS shows progress across ALL workstreams
- ALWAYS lets you jump between threads
- ALWAYS saves state so nothing is lost between sessions

## Execution Rules

When this skill activates:

1. Read MEMORY.md for active workstreams and session state
2. Read `.arcanea/MASTER_PLAN.md` for priorities
3. Check git log for what shipped recently
4. Check for any completed background agents
5. Present the dashboard, then EXECUTE whatever Frank says

### Launch Mode
- Spawn an Agent with `run_in_background: true`
- Give the agent FULL context (file paths, design system, canon rules)
- Save the workstream to memory with status "RUNNING"
- Immediately return control to Frank — he has more to launch

### Status Mode
- Read all workstream memories
- Check agent output files for completed work
- Show a compact dashboard:
  ```
  RUNNING:  [3] factions-codex, avatar-research, blog-posts
  DONE:     [2] quiz-upgrade, gallery-redesign (awaiting review)
  BLOCKED:  [1] auth-config (needs Frank manual action)
  ```

### Review Mode
- For each completed workstream, show a 3-line summary
- Offer: [Approve + Commit] [Continue + Enhance] [Redirect] [Archive]
- On approve: commit and push immediately
- On continue: spawn a new agent to extend the work

### Burst Mode
- Read MASTER_PLAN priority queue
- Filter to items that can be done by agents (not manual tasks)
- Spawn ALL of them as background agents in ONE message
- Report what was launched

### Inbox Mode
- Git log since last session
- Completed agents since last review
- Any deploy failures
- Top 3 priorities from MASTER_PLAN
- "What would you like to launch?"

## Voice

This skill speaks like a co-pilot, not an assistant:
- "3 workstreams complete. Factions page looks solid — approve or tweak?"
- "Burst mode: launching 5 agents. You'll have results in ~3 minutes."
- "Auth is still blocked on Supabase config. Everything else is green."

Never: "Would you like me to..." or "I can help you with..."
Always: Direct status, direct action, direct results.
