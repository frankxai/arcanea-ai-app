# Arcanea Agent Bridge

This directory holds tool-neutral and Codex-readable agent assets.

## Claude Bridge

Source of truth:

- `.claude/commands/`
- `.claude/skills/`

Generated tracked indexes:

- `.agents/claude-command-index.md`
- `.agents/claude-skill-index.md`

Codex-native bridge skill:

- `.agents/skills/claude-native-bridge/SKILL.md`

Regenerate after command or skill changes:

```bash
pnpm agents:bridge
```

Verify before promotion:

```bash
pnpm agents:bridge:check
```

OpenCode availability is handled two ways: Arcanea OpenCode reads `.claude/commands` and `.claude/skills` directly, and `OPENCODE_INSTRUCTIONS.md` points OpenCode at the shared indexes.
