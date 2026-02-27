# ADR-031: Arcanea Project Management Toolkit

**Status**: Accepted
**Date**: 2026-02-27
**Context**: Arcanea needs a vendor-free, markdown-first project management system

## Decision

Build a git-native PM system using three file formats:

### `.arc` — Arcane Record Card
YAML frontmatter + markdown body. The atomic unit of project management.

```yaml
---
id: string              # Unique ID
type: enum              # project | milestone | sprint | task
title: string
status: enum            # pending | in_progress | done | blocked | planned
created: date
gate: number            # 1-10 (Ten Gates)
guardian: string        # Associated Guardian
element: enum           # fire | water | earth | wind | void
priority: enum          # P0 (luminor) | P1 (archmage) | P2 (master) | P3 (mage)
progress: number        # 0-100 percentage
tasks: list             # Inline task tracking
depends_on: list        # Milestone/task dependencies
---
```

### `.nea` — Tokenizable Artifact
For achievements, badges, NFTs. Has optional web3 fields (chain, contract, token_id).

```yaml
---
nea_version: 1
id: string
type: enum              # achievement | badge | artifact | certificate
title: string
rarity: enum            # common | uncommon | rare | epic | legendary | mythic
element: enum
gate: number
guardian: string
origin_project: string
chain: string | null    # Future: ethereum | polygon | base
minted: boolean
---
```

### Standard `.md` — Logs, Retros, Notes
Append-only progress logs, sprint retrospectives, freeform notes.

## Directory Structure

```
.arcanea/projects/
├── arcanea.arc              # Root project
├── config.yaml              # PM configuration
├── ADR-031-*.md             # This document
├── milestones/              # .arc per milestone
├── sprints/                 # .arc per sprint/arc cycle
├── log/                     # Monthly progress logs
├── retro/                   # Sprint retrospectives
└── nea/                     # Tokenizable artifacts
```

## Future CLI (`starlight pm`)

```
starlight pm status           # Project overview
starlight pm board            # Terminal kanban
starlight pm add <title>      # Create task
starlight pm move <id> <st>   # Transition status
starlight pm sprint close     # Close sprint, generate retro
starlight pm velocity         # Velocity sparkline
starlight pm import linear    # One-way Linear import
starlight pm mint <type>      # Create .nea token
```

## Integration Points

- **Claude Code agents**: Read/write .arc files directly (no API needed)
- **SIS**: Task outcomes stored as memory vault wisdom entries
- **Web**: `/api/projects/[slug]/state` serves progress for dashboard
- **Git**: Every state change = commit. Full history, blame, bisect.
- **Statusline**: Sprint progress shown in Claude Code status line

## The Arc Cycle Maps to Sprints

1. **Potential** — Planning
2. **Manifestation** — Building
3. **Experience** — Testing
4. **Dissolution** — Retrospective
5. **Evolved Potential** — Next sprint begins with accumulated wisdom

## Consequences

- No vendor lock-in (data lives in repo)
- No SaaS cost
- Full git history for audit trail
- Agents can participate natively (file read/write)
- Requires `starlight pm` CLI build (~28 story points)
- No real-time collaboration (git push/pull is the sync)
