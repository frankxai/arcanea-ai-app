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

- `arcanea-mcp` — `@arcanea/mcp-server`: 59 MCP tools from the bin (57 in `createServer()`, plus 2 lore-archive tools in `cli.ts`), including the WorldPack canon audit (`worldpack_check`, `worldpack_verify`, `worldpack_rules`). Count measured by `scripts/consumer-smoke.mjs`; it bundles `world-pack` into `dist/vendor`.
- `world-pack` — WorldPack.v1 engine: canon conflict detection, digest/seal, Guardian authority model
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
