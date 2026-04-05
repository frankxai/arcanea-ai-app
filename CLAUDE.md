# Arcanea — Claude Code Configuration

## Source Of Truth

Before substantial work, read: `AGENTS.md` → newest `planning-with-files/CURRENT_STATE_*` → `CURRENT_BACKLOG_*` → `CURRENT_CHANGELOG_*` → `AGENT_EXECUTION_PROTOCOL_*`. For lore/canon: `.arcanea/CLAUDE.md`. For content: `book/CLAUDE.md`.

## Behavioral Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files over creating new ones
- NEVER proactively create *.md or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- `apps/web/` — Next.js web app (has own CLAUDE.md)
- `packages/` — workspace packages
- `docs/` — documentation
- `.arcanea/` — shared intelligence substrate (has own CLAUDE.md)
- `book/` — Library content, 17 collections (has own CLAUDE.md)
- `arcanea-onchain/` — onchain/crypto workspace (has own CLAUDE.md + .mcp.json)

## Build & Test

```bash
pnpm run build          # full monorepo
pnpm --dir apps/web run build  # web only
pnpm test && pnpm run lint
```

ALWAYS run build after code changes. ALWAYS verify before committing. Node 20.x via `.nvmrc`. pnpm only — NEVER npm.

## Git Discipline

- Messages: `type(scope): description` (e.g., `feat(worlds): add fork API`)
- Stage specific files only — NEVER `git add .`
- Push to `origin` (arcanea-ai-app). NEVER push to `records`.
- Git lock: `rm -f .git/index.lock`

## Security

NEVER hardcode secrets. NEVER commit .env. Validate input at boundaries. Sanitize file paths.

## Concurrency

All independent operations MUST be concurrent in a single message. Spawn ALL agents in ONE message. Batch ALL file ops in ONE message. After spawning, STOP and wait.

## Repos

- Production: https://github.com/frankxai/arcanea-ai-app
- OSS: https://github.com/frankxai/arcanea
