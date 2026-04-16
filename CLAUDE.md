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

## Resource Management (16GB machine — ENFORCED)

- This machine has 16GB RAM. Every agent must respect this.
- NEVER run `pnpm dev` unless actively testing UI in browser. Use `pnpm build` (one-shot) to verify. Use Vercel preview deploys for visual checks.
- NEVER leave dev servers running after work is done. Kill them.
- MAX 4-5 concurrent Claude Code instances. Each instance + MCP servers = ~650MB.
- Before spawning agents, check RAM: `cat /proc/meminfo | grep MemFree`. If < 2GB free, do NOT spawn more agents — work sequentially instead.
- If fork() fails or "Resource temporarily unavailable" appears, RAM is critical. Stop spawning, recommend closing idle instances.
- Prefer `model: haiku` for background agents to reduce memory pressure.
- NEVER run `pnpm dev` and `pnpm build` simultaneously — they compete for RAM.
- WSL vmmem takes ~1GB. If not using WSL features, avoid WSL-dependent workflows.

## Cached-Belief Validation Protocol

Any claim about CURRENT state — versions, ship status, file paths, architecture, deployment, quantities, dates of events older than this turn — requires same-turn verification (Read/Bash) OR explicit prefix: "unverified, from [memory|prior-turn|claude.md] (date X):".

Memory is authoritative ONLY for: intent, strategy, preferences, decision history, rationale.
Memory is NEVER authoritative for: current state of code, deploys, or systems.

Vague status claims ("X is mature", "Y is shipped") without provenance are violations. Either verify or disclaim.

Latency permission: 3-5 seconds of disk reads beats instant stale answers. Correct-slow over confident-wrong.

## Concurrency

All independent operations MUST be concurrent in a single message. Spawn ALL agents in ONE message. Batch ALL file ops in ONE message. After spawning, STOP and wait.

## Repos

- Production: https://github.com/frankxai/arcanea-ai-app
- OSS: https://github.com/frankxai/arcanea
