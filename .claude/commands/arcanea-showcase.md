---
name: arcanea-showcase
description: Generate product showcase content at scale — demo outputs, marketing copy, social posts, and changelog entries from real MCP tool results
allowed-tools: mcp__arcanea-mcp__generate_character, mcp__arcanea-mcp__generate_location, mcp__arcanea-mcp__generate_creature, mcp__arcanea-mcp__generate_quest, mcp__arcanea-mcp__generate_artifact, mcp__arcanea-mcp__generate_magic, mcp__arcanea-mcp__generate_name, mcp__arcanea-mcp__analyze_factions, mcp__arcanea-mcp__generate_conflict, mcp__arcanea-mcp__assess_world, Read, Write, Edit, Bash, Glob, Grep
---

# /arcanea-showcase

Read `.claude/skills/arcanea-showcase/SKILL.md` for full protocol.

Parse `$ARGUMENTS` to determine mode:

| Argument | Mode |
|----------|------|
| *(empty)* | `demo full-session` |
| `demo [type]` | Generate live MCP outputs |
| `content [format]` | Transform outputs to marketing content |
| `capture [target]` | Screenshots and visuals |
| `batch [count]` | Scale content generation |
| `update` | Refresh showcase page data |

## Quick Actions

- `demo` with no type = full session (character + location + creature + quest + artifact + magic)
- `content social` = Twitter thread + LinkedIn post
- `batch 5` = 5 complete demo sessions with social content for each
