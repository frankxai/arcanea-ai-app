# Arcanea CLI

Install Arcanea skills into your AI coding tool with one command.

## Install

```bash
npm install -g arcanea
```

Or run directly without installing:

```bash
npx arcanea install arcanea-book-cover
```

## Usage

- `arcanea list` — browse available skills
- `arcanea search "writing"` — find skills matching a query
- `arcanea install arcanea-book-cover` — install into detected tools
- `arcanea install arcanea-book-cover --tool claude-code` — install into a specific tool
- `arcanea install arcanea-book-cover --force` — overwrite existing install
- `arcanea update` — update all installed skills
- `arcanea update arcanea-book-cover` — update a specific skill
- `arcanea uninstall arcanea-book-cover` — remove from the current tool
- `arcanea uninstall arcanea-book-cover --all` — remove from every detected tool

## Supported Tools

- Claude Code (`~/.claude/skills/`)
- OpenCode (`~/.opencode/skills/`)
- Cursor (`~/.cursor/skills/`)
- Codex (`~/.codex/skills/`)
- Gemini CLI (`~/.gemini/skills/`)

Arcanea auto-detects which tools you have installed. If more than one tool is
present, you will be prompted to choose (unless you pass `--tool`).

## How It Works

Skills live in the public Arcanea OSS repo under
`oss/skills/arcanea/<slug>/`. The CLI fetches the list of skills via the GitHub
Contents API and downloads the files to your tool's skills directory.

No authentication is required — only public skills are supported.

## License

MIT
