# Arcanea Central Orchestrator

> Guardian: Shinkami | Gate: Source (1111 Hz) | Priority: ALWAYS ACTIVE

## Purpose

This skill ensures every agent, command, and session operates from a unified understanding of the Arcanea platform's current state, goals, and priorities.

## Activation

This skill activates automatically at session start or when any of these conditions are met:
- Agent asks "what should I work on?"
- Multi-page or cross-cutting task is requested
- Architecture decisions are being made
- Sprint planning or milestone review is needed
- Any `/arcanea` or `/superintelligence` command is invoked

## Core Protocol

### Step 1: Read Master Plan
```
Read .arcanea/MASTER_PLAN.md
```
This is the single source of truth. It contains:
- Current state of all 111 pages (status, metadata, loading, issues)
- Active milestones (M001-M004) with task-level tracking
- Priority queue (P0-P3, 20 items)
- Agent routing table (which specialist for which domain)
- Cross-cutting concerns (security, design, repo sync)

### Step 2: Check Milestones
```
Read .arcanea/projects/milestones/m001-supabase-auth.arc
Read .arcanea/projects/milestones/m003-memory-system.arc
Read .arcanea/projects/milestones/m004-arcanea-pm.arc
```
These `.arc` files have YAML frontmatter with task lists and progress percentages.

### Step 3: Check Sprint
```
Read .arcanea/projects/sprints/arc-2026-w09.arc
Read .arcanea/projects/log/2026-02.md
```

### Step 4: Route to Specialist
Use the Agent Routing Table from MASTER_PLAN.md:

| Domain | Agent | Gate | Guardian |
|--------|-------|------|----------|
| Auth/Security | security-architect | Foundation | Lyssandria |
| UI/Design | Arcanea Frontend Specialist | Flow | Leyla |
| Backend/API | Arcanea Backend Specialist | Fire | Draconia |
| Content/Lore | Arcanea Lore Master | Heart | Maylinn |
| Chat/AI | Arcanea AI Specialist | Voice | Alera |
| Analytics | researcher | Sight | Lyria |
| Architecture | system-architect | Crown | Aiyami |
| Testing | tester | Starweave | Elara |
| Community | Arcanea World Expander | Unity | Ino |
| Orchestration | Arcanea Master Orchestrator | Source | Shinkami |

### Step 5: Update After Work
After completing any task:
1. Update the relevant page entry in MASTER_PLAN.md (status, needs)
2. Update milestone progress in `.arcanea/projects/milestones/`
3. Log to `progress.md`

## Priority System

### P0 — Deploy Blockers & Core Experience
Things that block the live site or break core user flows.
Examples: Vercel env vars, build errors, broken auth, missing pages.

### P1 — Quality & Polish
Things that degrade user experience but don't block functionality.
Examples: Missing loading.tsx, missing metadata, missing persistence.

### P2 — Feature Expansion
New functionality that expands the platform.
Examples: Academy courses, world builder backend, community features.

### P3 — Cleanup & Optimization
Technical debt, performance, pruning unused code.
Examples: Redirect consolidation, icon fixes, legacy API migration.

## Page Status Definitions

| Status | Meaning |
|--------|---------|
| LIVE | Deployed, functional, has metadata + loading |
| PARTIAL | Deployed but missing metadata, loading, or has issues |
| STUB | UI exists but no backend/functionality |
| REDIRECT | Intentional redirect to parent route |
| PLANNED | Route referenced but page not built yet |

## Integration Points

### With Other Skills
- `/arcanea` — reads MASTER_PLAN for context before activating
- `/superintelligence` — uses priority queue for task selection
- `/arcanea-swarm` — distributes tasks based on agent routing table
- `/arcanea-design` — checks design system concerns
- `/planning-with-files` — `task_plan.md` is session-scoped, MASTER_PLAN is persistent

### With Commands
- `/arcanea-ecosystem` — MASTER_PLAN is the state source
- `/arcanea-daily` — daily check reads MASTER_PLAN priority queue
- `/arcanea-status` — status derived from MASTER_PLAN dashboard

### With PM System
- `.arcanea/projects/` is the structured data layer
- `MASTER_PLAN.md` is the human-readable aggregation
- `command-center/data.ts` is the web-facing visualization
- All three must stay in sync

## Quick Commands

```
# Check current priorities
Read .arcanea/MASTER_PLAN.md (Priority Queue section)

# Check a specific page's state
Search MASTER_PLAN.md for the route path

# Update after completing work
Edit .arcanea/MASTER_PLAN.md — update page status and needs
Edit .arcanea/projects/milestones/[relevant].arc — update task status

# Start a new session
1. Read MASTER_PLAN.md
2. Read latest sprint .arc
3. Create session task_plan.md
4. Work from priority queue
5. Update MASTER_PLAN.md when done
```
