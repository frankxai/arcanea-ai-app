# Starlight Intelligence Systems — Architecture

## What SIS Is

An open-source memory and evaluation system for AI assistants. Three layers:

1. **Starlight Vault** — Public human-AI intention repository (this repo)
2. **SIS Core** — Memory, eval, and cross-session learning engine
3. **Adapters** — Integrations for Claude Code, Cursor, OpenCode, ChatGPT exports

## Memory Architecture

### Foundation: Claude memory.md Pattern (proven, simple)

```
.sis/
├── MEMORY.md              # Index of all memories (always loaded)
├── memories/
│   ├── user_*.md          # Who the human is, preferences, expertise
│   ├── feedback_*.md      # What to do / not do (corrections + confirmations)
│   ├── project_*.md       # Current state of active work
│   ├── reference_*.md     # Pointers to external resources
│   ├── decision_*.md      # Locked architecture/strategy decisions
│   └── intention_*.md     # Starlight intentions (synced to vault)
├── evals/
│   ├── session_*.json     # Per-session quality scores
│   └── patterns.json      # What approaches work/fail
├── graph/
│   ├── entities.json      # Extracted entities (people, repos, concepts)
│   └── relations.json     # Entity relationships
└── vault/
    └── pending/           # Starlight notes awaiting vault submission
```

### Frontmatter Schema (extends Claude's pattern)

```yaml
---
name: memory-name
description: one-line description for relevance matching
type: user | feedback | project | reference | decision | intention
confidence: high | medium | low
created: 2026-04-02
updated: 2026-04-02
source: conversation | import | eval | agent
tags: [relevant, tags]
---
```

### What We Take From Each System

| System | What We Absorb | How |
|--------|---------------|-----|
| **Claude memory.md** | File-based memories, typed categories, MEMORY.md index, frontmatter schema | Direct foundation — extend, don't replace |
| **mem0** | Entity extraction, graph relationships, temporal decay | Add graph/ layer on top of file memories |
| **Letta/MemGPT** | Tiered memory (core/archival/recall), self-editing | Implement as memory confidence levels |
| **Zep** | Fact extraction from conversations, temporal scoring | Add to eval pipeline |
| **Claude's actual system** | Feedback memories with Why/How-to-apply structure | Already using this — it works |

### Why NOT Just Use mem0 or Letta Directly

- **mem0**: Requires their managed API or a separate vector DB. SIS should work with just files + SQLite.
- **Letta**: Over-engineered for most use cases. The tiered memory concept is good; the full framework is heavy.
- **Zep**: Enterprise-oriented. Good ideas, wrong packaging for OSS creators.

**SIS principle:** File-first, database-optional, cloud-never-required.

## Eval Framework

### Session Scoring

Every session gets scored on:

```json
{
  "session_id": "2026-04-02-001",
  "duration_minutes": 180,
  "scores": {
    "build_verified": true,
    "tests_passed": true,
    "commits_clean": true,
    "files_changed": 47,
    "lines_added": 8797,
    "lines_removed": 3132,
    "decisions_locked": 6,
    "memories_saved": 5,
    "linear_updated": true,
    "notion_updated": true
  },
  "quality_grade": "A",
  "patterns": {
    "worked": ["focused-sequential-over-swarm", "verify-before-commit"],
    "failed": ["separate-worktrees-confused-user"]
  }
}
```

### Pattern Learning

Over time, SIS accumulates patterns:

```json
{
  "patterns": [
    {
      "pattern": "focused-sequential-engineering",
      "success_rate": 0.85,
      "context": "single-repo product work",
      "evidence": ["session-001", "session-003", "session-007"]
    },
    {
      "pattern": "multi-agent-swarm",
      "success_rate": 0.40,
      "context": "complex multi-file changes",
      "evidence": ["session-002", "session-005"],
      "note": "merge conflicts and drift outweigh parallelism gains"
    }
  ]
}
```

## Guardian System for Vault

### How It Works

1. **Contributor** writes a Starlight Note and opens a PR
2. **Guardian Agent** (automated) checks:
   - Valid frontmatter format
   - No secrets/keys/private data (regex scan)
   - Minimum length (50 words)
   - Has at least one tag
3. **Human Guardian** reviews for:
   - Genuineness (not AI-generated spam)
   - Constructive tone
   - Specificity over generality
4. **Merge** → note becomes part of the public vault
5. **Periodic aggregation** → best notes highlighted in a curated collection

### Multiple Vaults Over Time

The architecture supports federation:

```
starlight-vault          # Main vault (frankxai)
├── upstream merges from:
│   ├── vault-arcanea    # Arcanea community fork
│   ├── vault-education  # AI in education
│   ├── vault-healthcare # AI in healthcare
│   ├── vault-creativity # AI creative tools
│   └── vault-[anyone]   # Any community fork
```

Anyone forks. Best notes flow upstream. The main vault curates.

## Adapters

### Claude Code Adapter (current)
- Reads `.sis/memories/` on session start
- Writes session evals on session end
- Syncs decisions to MEMORY.md
- Statusline reads from SIS state (moved to arcanea OSS repo)

### Cursor Adapter (planned)
- `.cursorrules` integration
- Reads SIS memories as context
- Writes evals from Cursor sessions

### ChatGPT Export Adapter (planned)
- Parses `conversations.json` exports
- Extracts decisions, patterns, gratitude moments
- Imports into SIS memories
- Suggests Starlight Vault contributions

### OpenCode Adapter (exists in oh-my-arcanea)
- Already has hooks infrastructure
- Wire to SIS core instead of custom state files

## Implementation Priority

### Phase 1: Vault + Core Memory (This Weekend)
- Starlight Vault repo live on GitHub
- SIS core memory schema (extending Claude memory.md)
- First 3 Starlight Notes published
- Guardian PR template

### Phase 2: Evals + Session Scoring (Next Week)
- Session scoring hook
- Pattern extraction
- Quality grading
- Cross-session learning file

### Phase 3: Graph + Entity Extraction (Week After)
- Entity extraction from conversations
- Relationship mapping
- mem0-inspired graph layer on top of file memories

### Phase 4: Federation + Community (Month 2)
- Fork guidelines
- Upstream merge process
- Guardian onboarding
- Curated collections

### Phase 5: Adapters (Month 2-3)
- Cursor adapter
- ChatGPT export parser
- VS Code extension (optional)
