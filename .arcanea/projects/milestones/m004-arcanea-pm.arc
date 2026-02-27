---
type: milestone
id: m004-arcanea-pm
project: arcanea
name: Arcanea PM Toolkit
status: in_progress
gate: crown
guardian: Aiyami
element: spirit
priority: P2
created: 2026-02-27
target: 2026-03-07
progress: 40
tasks:
  - id: t001
    name: Define .arc file format schema
    status: done
    note: YAML frontmatter + markdown body
  - id: t002
    name: Define .nea tokenizable artifact format
    status: done
  - id: t003
    name: Create directory structure
    status: done
    note: .arcanea/projects/ with milestones/, sprints/, log/, retro/, nea/
  - id: t004
    name: Create initial milestone files
    status: done
    note: m001-m004 .arc files with full task tracking
  - id: t005
    name: Build progress log system
    status: in_progress
  - id: t006
    name: Build CLI parser for .arc files
    status: pending
    note: starlight pm status / starlight pm log
  - id: t007
    name: Build terminal visualization
    status: pending
  - id: t008
    name: Linear migration script
    status: pending
---

# M004 — Arcanea PM Toolkit

Crown milestone. Build the project management system that replaces Linear. Own your data, track your Arc.

## Philosophy

- Markdown-first, git-friendly
- YAML frontmatter for structured data, markdown body for context
- Every change is a git commit — full audit trail
- No SaaS dependency — your `.arc` files are yours forever
- Integrates with Claude Code, SIS, and the Arcanea web platform
