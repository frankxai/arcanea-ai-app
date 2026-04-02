---
name: daily-ops
description: Daily operations sync — git status, Linear issues, Notion Dev Hub, health checks, priorities report
gate: foundation
guardian: Lyssandria
version: 1.0.0
user_invocable: true
---

# Daily Ops — Arcanea Operations Sync

## What This Skill Does
Runs a complete operational sync across GitHub, Linear, and Notion. Reports current state, blockers, and priorities so Frank (or any agent) knows exactly where things stand.

## When to Use
- Start of every work session
- On `/loop 24h /daily-ops` for automated daily sync
- When context is unclear about what's been done
- Before making priority decisions

## Execution Steps

### 1. Git Intelligence
```bash
# Recent commits (last 7 days)
git log --oneline --since="7 days ago" --decorate | head -30

# Branch state
git branch -a --sort=-committerdate | head -10

# Uncommitted work
git status --short | head -20

# What's on main vs what's deployed
git log --oneline origin/main..HEAD 2>/dev/null | head -10
```

### 2. Linear Sync
Use MCP tools (mcp__linear-server__ or mcp__claude_ai_Linear__):
- `list_issues` with project "Arcanea" — get all current issues
- Check which are In Progress, Backlog, Done
- Flag any Urgent/High priority items
- Report: "X issues in progress, Y in backlog, Z completed this week"

### 3. Notion Dev Hub Update
Use MCP tool `mcp__notion__notion-update-page`:
- Page ID: `33626ac2b7f68189b0ceea79c116f4ee`
- Update "Current Platform State" section with latest from git
- Update roadmap phase statuses
- Add any new architecture decisions

### 4. Health Report
Output a clear summary:

```
## Daily Ops Report — [DATE]

### Git
- X commits in last 7 days
- Current branch: [branch]
- Uncommitted changes: [count]
- Remote main: [hash]

### Linear
- In Progress: [list]
- Urgent/Blocked: [list]
- Completed this week: [list]

### Priorities Today
1. [highest priority based on Linear + git state]
2. [second]
3. [third]

### Blockers
- [any blockers found]
```

### 5. Planning Files Sync
Read and verify:
- `planning-with-files/CURRENT_STATE_*.md` — still accurate?
- `planning-with-files/CURRENT_BACKLOG_*.md` — priorities match Linear?
- Flag any drift between planning files and Linear

## Automation
Wire into recurring execution:
```
/loop 24h /daily-ops
```
Or schedule as a remote trigger:
```
/schedule create --name "daily-ops" --cron "0 8 * * *" --prompt "/daily-ops"
```

## Key IDs
- Linear Arcanea Project: `dd7f6c8e-1333-42d8-b452-3f3149b2b79d`
- Linear Team FrankX: `27c1a417-8eb1-4c65-8a72-e6000c49a37b`
- Notion Arcanea Hub: `cb430b46e54d4036a8ba2cff7050ae39`
- Notion Developer Hub: `33626ac2b7f68189b0ceea79c116f4ee`
