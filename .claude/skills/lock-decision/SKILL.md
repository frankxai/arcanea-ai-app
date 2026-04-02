---
name: lock-decision
description: Lock an architecture or strategy decision — saves to memory, appends to Notion decisions log, updates CLAUDE.md if needed
gate: crown
guardian: Aiyami
version: 1.0.0
user_invocable: true
---

# Lock Decision — Persist Architecture & Strategy Choices

## What This Skill Does
Takes a decision name and rationale, and locks it into the persistent system so no agent undoes it later.

## When to Use
- After agreeing on a technology choice (e.g., "Novel over Tiptap")
- After agreeing on a strategy (e.g., "BYOK-first, managed later")
- After agreeing on a design rule (e.g., "NEVER use Cinzel")
- When Frank says "lock this" or "remember this decision"

## Execution Steps

### 1. Capture the Decision
Ask (or extract from conversation):
- **Decision name**: short label (e.g., "editor-choice")
- **Decision**: what was decided (e.g., "Use Novel, not bare Tiptap")
- **Rationale**: why (e.g., "Apache-2.0, has AI slash commands free, Tiptap Pro not needed")
- **Scope**: what this affects
- **Date**: today

### 2. Save to Claude Memory
Write a feedback memory file:
```
C:\Users\frank\.claude\projects\C--Users-frank-Arcanea\memory\decision_[name].md
```

Format:
```markdown
---
name: Decision — [name]
description: [one-line summary]
type: feedback
---

DECISION: [what]

**Why:** [rationale]

**How to apply:** [when agents should follow this]

**Locked:** [date]
```

Update MEMORY.md index.

### 3. Append to Notion
Use MCP `mcp__notion__notion-update-page` or `notion-create-pages`:
- Append to Notion Developer Hub decisions section
- Or create a dedicated Decisions Log page under Arcanea Hub

### 4. Update CLAUDE.md if Architectural
If the decision affects how agents should behave:
- Update `.claude/CLAUDE.md` with the new constraint
- Example: design system font change, editor choice, storage strategy

### 5. Confirm
Output:
```
LOCKED: [decision name]
- Memory: saved to decision_[name].md
- Notion: appended to Developer Hub
- CLAUDE.md: [updated / not needed]
```

## Examples

```
/lock-decision "Never use Cinzel font" — Frank hates it, codebase uses Inter + Space Grotesk
/lock-decision "Novel over Tiptap Pro" — Apache-2.0, free AI slash commands
/lock-decision "R2 for media at scale" — free egress, $0.08/mo at current volume
/lock-decision "BYOK-first" — no managed provider until BV formation
```
