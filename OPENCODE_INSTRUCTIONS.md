# Arcanea OpenCode Instructions

Read `AGENTS.md` first, then the newest `planning-with-files/` files, then `.arcanea/CLAUDE.md`.

## Claude Command And Skill Bridge

OpenCode should treat `.claude/commands/` and `.claude/skills/` as source files that are directly usable in this repo.

- Slash commands: `.claude/commands/*.md`
- Claude skills: `.claude/skills/**/SKILL.md`, `.claude/skills/**/skill.md`, and root `.claude/skills/*.md`
- Shared indexes: `.agents/claude-command-index.md` and `.agents/claude-skill-index.md`
- Bridge skill: `.agents/skills/claude-native-bridge/SKILL.md`

When a user invokes `/name`, resolve it against `.claude/commands/name.md` or `.agents/claude-command-index.md`, then execute the command intent with OpenCode tools. When a command references a skill, resolve it against `.claude/skills/` or `.agents/claude-skill-index.md`.

Refresh indexes after command or skill changes:

```bash
pnpm agents:bridge
```

Check for drift:

```bash
pnpm agents:bridge:check
```

The Arcanea OpenCode launch scripts run the bridge generator before startup, so normal OpenCode launches refresh the indexes automatically.
