---
name: claude-native-bridge
description: "Use when the user invokes a slash command like /arcanea-author, /ao, /status, /research-scan, or asks Codex to use Claude Code commands or Claude skills from this repo."
---

# Claude Native Bridge

This skill makes Codex operate Claude Code command and skill specs from this repository without copying their source files.

## Source Of Truth

- Commands: `.claude/commands/*.md`
- Skills: `.claude/skills/**/SKILL.md`, `.claude/skills/**/skill.md`, and root `.claude/skills/*.md`
- Runtime command index: `.codex/claude-command-index.md`
- Runtime skill index: `.codex/claude-skill-index.md`
- Tracked command index: `.agents/claude-command-index.md`
- Tracked skill index: `.agents/claude-skill-index.md`

Keep `.claude/` as the source of truth. The `.codex/` indexes are lookup aids only.

## Slash Command Protocol

When the user starts a message with `/command`:

1. Look up `command` in `.codex/claude-command-index.md`, then `.agents/claude-command-index.md`.
2. If the command is missing from the index, check `.claude/commands/command.md`.
3. Read the command file.
4. Apply its intent using Codex tools:
   - shell or PowerShell for local commands
   - `apply_patch` for file edits
   - `update_plan` for task tracking
   - `web` for browsing when required
   - connector tools via `tool_search` when a command references a connected app
5. Preserve command arguments as the command's `$ARGUMENTS`.
6. Follow aliases by reading the referenced command file.

## Claude Skill Protocol

When a command or user request names a Claude skill:

1. Resolve the skill in `.codex/claude-skill-index.md`, then `.agents/claude-skill-index.md`.
2. Read only that skill entrypoint first.
3. Load referenced files relative to the skill directory only when needed.
4. Prefer repo-native instructions in `.arcanea/` and `AGENTS.md` when they conflict with older Claude-specific text.

## Tool Translation

Translate Claude-specific tooling to Codex equivalents:

| Claude concept | Codex adaptation |
| --- | --- |
| Read/Edit files | shell reads and `apply_patch` edits |
| Bash | PowerShell or shell command in the current workspace |
| Task/Agent tool | `spawn_agent` only when the user explicitly asked for agents, delegation, or parallel team work |
| MCP server | installed connector via `tool_search`, or note the unavailable tool |
| TodoWrite | `update_plan` |
| WebFetch | `web` browsing, or local defuddle skill when applicable |

## Safety

- Do not run destructive git commands unless the user explicitly asks.
- Do not stage broad changes; stage only target files when committing.
- Do not rewrite Claude command files unless the user requested Claude behavior changes.
- If a command requires a capability unavailable in Codex, execute the parts that are available and identify the gap.
