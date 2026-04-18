---
description: Start a design brief for a new page or major UI section. Invokes design-architect subagent.
---

# /design-brief

Invoke the `design-architect` subagent to produce a one-paragraph brief, pick the aesthetic extreme, lock the brand kit, and define hierarchy before any generation begins.

## Input

User arguments: `$ARGUMENTS`

Expected format: a URL path, file path, or short description of what's being designed. Examples:
- `/design-brief homepage hero`
- `/design-brief /apps/web/app/pricing/page.tsx`
- `/design-brief new agents gallery section`

## Workflow

1. Read `@arcanea/design-system` package exports, the canonical spec at `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md`, and the current rollout plan.
2. Dispatch the `design-architect` subagent via the Task tool with the user input as context.
3. Wait for the brief markdown output.
4. Save the brief to `docs/design-briefs/<YYYY-MM-DD>-<slug>.md` for traceability.
5. Tell the user which downstream agent to invoke next based on the brief's needs.

## Rules

- Never skip to generation without a brief
- Never accept "obvious" briefs that don't commit to an aesthetic extreme
- Always save the brief to disk before dispatching downstream work

## Output

Brief markdown path + next-step recommendation.
