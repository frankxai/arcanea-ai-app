# @arcanea/cli

Arcanea's command-line tools and project adapters. The OpenCode adapter described below is a source release candidate; a previously published registry version may not include it.

[![npm version](https://badge.fury.io/js/%40arcanea%2Fcli.svg)](https://www.npmjs.com/package/@arcanea/cli)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# Run instantly with npx
npx @arcanea/cli route "design a character creation flow"

# Or install globally
npm install -g @arcanea/cli
```

## Commands

| Command                                | Description                                                            |
| :------------------------------------- | :--------------------------------------------------------------------- |
| `arcanea init`                         | Initialize Arcanea in a project (creates `.arcanea/`)                  |
| `arcanea auth`                         | Authenticate with arcanea.ai                                           |
| `arcanea status`                       | Show current Guardian, Gate, Element, and session state                |
| `arcanea install <overlay>`            | Install an overlay (claude, openai, gemini, copilot, cursor, opencode) |
| `arcanea update`                       | Update Arcanea to latest version                                       |
| `arcanea route <description>`          | Classify a task using Guardian keywords                                |
| `arcanea voice <text> [--fix]`         | Check text against Voice Bible v2.0                                    |
| `arcanea tokens [--format] [--colors]` | Export design tokens (CSS, Tailwind, JSON)                             |
| `arcanea world`                        | Write a starter worldbuilding template                                 |
| `arcanea create`                       | Create a new Arcanea project                                           |

## Examples

### Route a task to a Guardian

This command uses keyword rules. Its scores are classification output, not measured model quality or model dispatch.

```bash
$ arcanea route "help me design a database schema for user profiles"

Guardian: Lyssandria (Earth)
Gate: Foundation | Frequency: 396 Hz
Confidence: 0.94
Domain: Architecture, database design, system foundations

Alternatives:
  Draconia (Fire) — 0.52 confidence
  Shinkami (Source) — 0.38 confidence
```

### Check voice compliance

```bash
$ arcanea voice "Welcome users to our platform" --fix

Violations found:
  term-user: "users" → "creators"
  term-platform: "platform" → "Arcanea"

Fixed: "Welcome creators to Arcanea"
```

### Export design tokens

```bash
$ arcanea tokens --format css --colors

:root {
  --arcane-crystal: #7fffd4;
  --arcane-fire: #ff4500;
  --arcane-water: #4169e1;
  --arcane-earth: #228b22;
  --arcane-void: #9966ff;
  --arcane-gold: #ffd700;
  --cosmic-void: #0b0e14;
  --cosmic-deep: #0d1117;
  ...
}
```

## Overlays

Install the existing adapters:

```bash
arcanea install claude     # Claude Code / Claude Desktop
arcanea install openai     # ChatGPT overlay
arcanea install gemini     # Gemini / AI Studio
arcanea install copilot    # GitHub Copilot
arcanea install cursor    # Cursor
```

The five existing overlays provide their own Arcanea instructions and assets. OpenCode uses the separate tool adapter below.

### OpenCode project adapter

Use an already-installed Arcanea MCP server entry point. The adapter does not download a server, choose a model, copy credentials or rewrite `opencode.json(c)`.

```bash
arcanea install opencode --mcp-entry /absolute/path/to/arcanea-mcp/dist/cli.js --dir ./my-world --dry-run
arcanea install opencode --mcp-entry /absolute/path/to/arcanea-mcp/dist/cli.js --dir ./my-world
```

Restart OpenCode in the project and run `opencode mcp list`. Choose models and permissions through OpenCode's existing controls. The generated `.opencode/plugins/arcanea-creator.ts` uses the native config hook to add the `arcanea` MCP entry when that name is absent. An existing entry takes precedence, including `enabled: false`. Existing JSONC comments, model pins, permissions and other plugins stay intact.

The standard level enables the server's `core,world` toolsets. `--level minimal` enables `core`. Full and Luminor levels are unavailable in this adapter. These are tool selections; they do not add Arcanea lore or a system prompt to your original world. Individual server tools still have their documented Arcanea scope, so review the tool description before using a canon-specific generator or checker.

The adapter uses the Node executable that runs the CLI and the exact server entry you supply. Choose a Node version supported by that installed server. The current source MCP requires Node 20.18.1–20.x or 22+. Paths with spaces are passed as separate arguments. Project graphs use `.arcanea/data`; an existing server entry retains its own storage settings.

To remove the unchanged adapter, repeat the same entry, project and level with `--remove`:

```bash
arcanea install opencode --mcp-entry /absolute/path/to/arcanea-mcp/dist/cli.js --dir ./my-world --remove
```

Removal keeps saved worlds, other plugins and settings. Identical reinstallation performs no write. Changed options or customized plugin bytes cause a refusal so you can review the file; the CLI does not infer ownership from a comment. Linked roots, symlink/junction plugin directories and foreign files are refused. Preview creates no file. A complete plugin is installed atomically without replacing an existing file.

Native delivery checks target OpenCode 1.18.35 on hosted Linux and Windows. The workflow records configuration, connection and installed-SDK tool/restart checks separately. Model inference, narrative quality, creator acceptance and npm publication require their own evidence.

## Technical

- The CLI builds a standalone CJS executable with its Node shebang, binding all overlay imports of `@arcanea/core` to the built workspace core. Build metadata records the input files and rejects a stale registry core copy.
- Development uses the repository's frozen dependencies and pinned pnpm. The build generates `dist/package` with the standalone executable and a manifest without runtime dependencies. Pack that directory with `pnpm --dir packages/cli/dist/package pack`. Packing the development directory fails with these instructions, preventing an archive that depends on unpublished workspace packages. The shared lockfile remains unchanged.
- CLI runtime: Node.js 18+. Use the installed MCP server's stricter runtime requirement when attaching its tools.
- From the monorepo, build core and CLI, then run `pnpm --dir packages/cli test:opencode-delivery`. The check builds and packs both real packages, installs a fresh consumer and verifies a pinned native OpenCode without model inference. It does not publish packages.

## Ecosystem

| Package                                                                                            | Purpose                                            |
| :------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| [`@arcanea/core`](https://github.com/frankxai/arcanea-ai-app/tree/main/packages/core)              | Core types and intelligence engine                 |
| [`@arcanea/mcp-server`](https://github.com/frankxai/arcanea-ai-app/tree/main/packages/arcanea-mcp) | Local worldbuilding tools with selectable toolsets |
| [`arcanea.ai`](https://arcanea.ai)                                                                 | Live web platform                                  |

## License

MIT - [FrankX](https://github.com/frankxai)
