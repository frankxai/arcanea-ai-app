# Arcanea Packages — packages/

## Overview

Workspace packages in the pnpm monorepo. Each package is independently buildable and publishable.

## Standards

- TypeScript strict mode, no `any`
- Typed interfaces for all exports
- Keep files under 500 lines
- Input validation at package boundaries
- Each package should have its own `package.json`, `tsconfig.json`, and build script

## Key Packages

- `arcanea-mcp` — 56 world-building + intelligence MCP tools in 8 toolsets; the CLI serves the 12-tool `core` set by default (`--toolsets`)
- `arcanea-vault` — Persistent memory and vault system
- `ai-core` — AI provider abstraction layer
- `arcanea-skills` — Creative and universe knowledge skills
- `arcanea-flow` — Workflow orchestration
- `auth` — Authentication package

## Build

```bash
pnpm run build           # all packages
pnpm --filter <pkg> build  # single package
```
