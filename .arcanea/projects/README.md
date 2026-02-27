# Arcanea Project Management

> *"Own your data forever. Track your Arc."*

A markdown-first, git-native project management system. No vendor lock-in. No SaaS dependency. Your milestones, sprints, and progress live in `.arc` files alongside your code.

## Quick Start

```
.arcanea/projects/
├── arcanea.arc              # Root project definition
├── milestones/              # .arc files per milestone
│   ├── m001-auth-wiring.arc
│   ├── m002-cloudflare.arc
│   └── ...
├── sprints/                 # Sprint/Arc cycle files
│   └── arc-2026-w09.arc
├── log/                     # Progress log (append-only)
│   └── 2026-02.md
├── retro/                   # Retrospectives
│   └── arc-2026-w09.md
└── nea/                     # Tokenizable artifacts
    └── badge-first-deploy.nea
```

## File Formats

### `.arc` — Project/Milestone/Sprint
YAML frontmatter + markdown body. Human-readable, git-diffable, parseable.

### `.nea` — Tokenizable Artifact
YAML frontmatter with chain-ready metadata. For badges, achievements, NFTs.

### `.md` — Logs, Notes, Retros
Standard markdown. Append-only logs, structured retrospectives.

## The Arc Cycle

Sprints follow the Arcanea Arc:
1. **Potential** — Planning, backlog grooming
2. **Manifestation** — Building, shipping code
3. **Experience** — Testing, user feedback
4. **Dissolution** — Retrospective, lessons learned
5. **Evolved Potential** — Next sprint begins with accumulated wisdom

## Integration

- **Claude Code**: Agents read `.arc` files to understand project context
- **SIS**: Starlight Intelligence System indexes milestones for Guardian-aligned task routing
- **Web**: `/api/projects` serves progress data for dashboard visualization
- **Git**: Every state change is a commit — full history, blame, and bisect
