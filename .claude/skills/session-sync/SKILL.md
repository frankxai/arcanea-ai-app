---
name: session-sync
description: End-of-session sync — summarize work, update Linear issues, refresh Notion Dev Hub, checkpoint planning files
gate: unity
guardian: Ino
version: 1.0.0
user_invocable: true
---

# Session Sync — End-of-Session Checkpoint

## What This Skill Does
Captures everything that happened in this session and syncs it across Linear, Notion, planning files, and memory.

## When to Use
- Before closing a session
- After a major engineering milestone
- When switching between projects/contexts
- When Frank says "sync" or "checkpoint" or "save progress"

## Execution Steps

### 1. Summarize Session Work
Scan the conversation and git diff:
```bash
git log --oneline --since="4 hours ago" | head -20
git diff --stat HEAD~5..HEAD 2>/dev/null | tail -5
```

Generate:
- What was built/changed (bullet points)
- What was decided (any /lock-decision moments)
- What's blocked
- What's next

### 2. Update Linear Issues
For each issue touched in this session:
- Use `mcp__linear-server__save_issue` to update status
- Add a comment with session summary if substantial work was done
- Move from Backlog → In Progress if work started
- Move to Done if completed and verified

### 3. Update Notion Developer Hub
Use `mcp__notion__notion-update-page`:
- Page: `33626ac2b7f68189b0ceea79c116f4ee`
- Refresh "Current Platform State" section
- Add to changelog
- Update phase statuses

### 4. Update Planning Files
If in the arcanea-ai-app repo:
```
planning-with-files/CURRENT_STATE_[date].md — refresh
planning-with-files/CURRENT_CHANGELOG_[date].md — append
```

### 5. Save Key Learnings to Memory
If anything surprising or non-obvious was learned:
- Save as feedback or project memory
- Update MEMORY.md index

### 6. Output Session Report
```
## Session Sync — [DATE] [TIME]

### Built
- [bullet points]

### Decisions Locked
- [any decisions]

### Linear Updated
- FRA-XX: [status change]

### Notion Updated
- Developer Hub refreshed

### Next Session Should
1. [priority 1]
2. [priority 2]
3. [priority 3]

### Handoff Prompt
[paste-ready prompt for next session]
```

## Key IDs
- Linear Arcanea Project: `dd7f6c8e-1333-42d8-b452-3f3149b2b79d`
- Notion Developer Hub: `33626ac2b7f68189b0ceea79c116f4ee`
