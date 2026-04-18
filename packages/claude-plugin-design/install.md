# Install

## Option 1: Symlink (Claude Code local — recommended)

### macOS / Linux
```bash
# Plugin umbrella
ln -s "$(pwd)/packages/claude-plugin-design" ~/.claude/plugins/arcanea-design

# Or individual slots (if your Claude Code version doesn't auto-discover plugins)
ln -s "$(pwd)/packages/claude-plugin-design/skill" ~/.claude/skills/arcanea-frontend-excellence
ln -s "$(pwd)/packages/claude-plugin-design/agents" ~/.claude/agents/arcanea-design
ln -s "$(pwd)/packages/claude-plugin-design/commands" ~/.claude/commands/arcanea-design
```

### Windows (PowerShell as admin)
```powershell
# Plugin umbrella
New-Item -ItemType SymbolicLink `
  -Path "$env:USERPROFILE\.claude\plugins\arcanea-design" `
  -Target "$PWD\packages\claude-plugin-design"

# Or individual slots
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\skills\arcanea-frontend-excellence" -Target "$PWD\packages\claude-plugin-design\skill"
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\agents\arcanea-design" -Target "$PWD\packages\claude-plugin-design\agents"
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\commands\arcanea-design" -Target "$PWD\packages\claude-plugin-design\commands"
```

Then **fully quit** and relaunch Claude Code (not `/reload` — you need a cold start for the harness to rediscover skills/agents/commands).

## Option 2: Copy (no admin / cross-machine)

```bash
cp -r packages/claude-plugin-design ~/.claude/plugins/arcanea-design
```

Downside: no auto-updates on `git pull`. Symlink is preferred.

## Verify install

In Claude Code after restart:

1. Type `/skills` — look for `arcanea-frontend-excellence` in the list
2. Type `/design-brief test` — should find the command
3. Dispatch a subagent in conversation: "Use the `design-architect` subagent to brief a test hero" — should resolve

If any fail, check:
- Symlinks point to existing files (`ls -la` on the target)
- You fully quit Claude Code (kill process, don't just `/reload`)
- Your Claude Code version supports the plugin directory structure

## Required env vars (Windows)

```
setx TWENTYFIRST_API_KEY "your-key"   # https://21st.dev/magic/console
setx V0_API_KEY "your-key"            # https://v0.dev/chat/settings/keys
setx FAL_KEY "your-key"               # https://fal.ai/dashboard/keys
setx GEMINI_API_KEY "your-key"        # https://aistudio.google.com/apikey
setx REPLICATE_API_TOKEN "your-key"   # https://replicate.com/account/api-tokens
```

Restart any running Claude Code instance after `setx`. Verify with `echo $VAR_NAME` in a new shell.

## Configure MCPs

Copy entries from `mcp/mcp.example.json` into your project's `.mcp.json`. Or, to use globally, add to `~/.claude.json` under `mcpServers`.

## What's included

```
packages/claude-plugin-design/
├── agents/
│   ├── README.md                 # Persona overview
│   ├── design-architect.md       # Brief + aesthetic decisions
│   ├── design-generator.md       # Magic + v0 variants
│   ├── design-motion.md          # Framer Motion choreography
│   ├── design-imagery.md         # Fal / Gemini / Replicate
│   └── design-verifier.md        # Playwright + Lighthouse quality gate
├── commands/
│   ├── design-brief.md           # /design-brief <context>
│   ├── design-ship.md            # /design-ship <target> (full pipeline)
│   ├── design-review.md          # /design-review <page>
│   └── design-verify.md          # alias for /design-review
├── skill/SKILL.md                # arcanea-frontend-excellence
├── mcp/mcp.example.json          # recommended MCP config
├── tokens/                       # (future — framework-agnostic CSS vars)
├── package.json
├── README.md
└── install.md                    # this file
```
