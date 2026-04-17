# Install

## Option 1: Symlink (Claude Code local)

### macOS / Linux
```bash
ln -s "$(pwd)/packages/claude-plugin-design" ~/.claude/plugins/arcanea-design
```

### Windows (PowerShell as admin)
```powershell
New-Item -ItemType SymbolicLink `
  -Path "$env:USERPROFILE\.claude\plugins\arcanea-design" `
  -Target "$PWD\packages\claude-plugin-design"
```

Then restart Claude Code.

## Option 2: Copy (no admin / cross-machine)

```bash
cp -r packages/claude-plugin-design ~/.claude/plugins/arcanea-design
```

Downside: no auto-updates on git pull. Symlink is preferred.

## Verify install

In Claude Code, type `/skills` and look for `arcanea-frontend-excellence` in the list. If present, install worked.

## Required env vars (Windows)

```
setx TWENTYFIRST_API_KEY "your-key"
setx V0_API_KEY "your-key"
setx FAL_KEY "your-key"
setx GEMINI_API_KEY "your-key"
setx REPLICATE_API_TOKEN "your-key"
```

Restart any running Claude Code instance after `setx`.

## Configure MCPs

Copy entries from `mcp/mcp.example.json` into your project's `.mcp.json`. Or, to use globally, add to `~/.claude.json` under `mcpServers`.
