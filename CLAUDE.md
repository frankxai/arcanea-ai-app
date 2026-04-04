# Arcanea — Claude Code Configuration

## Source Of Truth

Before coding, read in order:

1. `AGENTS.md`
2. newest `planning-with-files/CURRENT_STATE_*`
3. newest `planning-with-files/CURRENT_BACKLOG_*`
4. newest `planning-with-files/CURRENT_CHANGELOG_*`
5. newest `planning-with-files/AGENT_EXECUTION_PROTOCOL_*`
6. `.arcanea/CLAUDE.md`

`.arcanea/` is the shared intelligence substrate. `planning-with-files/` is the live execution control plane.

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## File Organization

- NEVER save to root folder — use the directories below
- Use `apps/web/` for the Next.js web app
- Use `packages/` for workspace packages
- Use `docs/` for documentation and markdown files
- Use `.arcanea/` for shared intelligence (lore, config, agents, prompts)
- Use `book/` for Library content (17 collections)

## Project Architecture

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript (strict)
- **Styling**: Tailwind CSS with Arcanean Design System
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **AI**: Vercel AI SDK, Google Gemini, Anthropic Claude
- **Deployment**: Vercel (arcanea-ai-appx project)
- **Package Manager**: pnpm (NEVER npm)
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Input validation at system boundaries

## Build & Test

```bash
pnpm run build
pnpm --dir apps/web run build
pnpm test
pnpm run lint
```

- ALWAYS run build after making code changes
- ALWAYS verify build succeeds before committing
- Node 20.x pinned via `.nvmrc`

## Git Discipline

- Commit messages: `type(scope): description` (e.g., `feat(worlds): add fork API`)
- Stage specific files only — NEVER `git add .`
- Push to `origin` (arcanea-ai-app) for production deploys
- NEVER push to `records` (music studio repo)
- If git lock exists: `rm -f .git/index.lock`

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All independent operations MUST be concurrent/parallel in a single message
- ALWAYS spawn ALL background agents in ONE message
- ALWAYS batch ALL file reads/writes/edits in ONE message
- After spawning agents, STOP and wait — do NOT poll or check status
- When agent results arrive, review ALL results before proceeding

## Agent System

Arcanea uses a Luminor-based intelligence hierarchy:

| Layer | Role | Example |
|-------|------|---------|
| **Arcanea** | The model — intelligence substrate | MoE router, system prompt |
| **Lumina** | Orchestrator — coordinates all work | Session lead, swarm queen |
| **Guardians** | Coordinators — domain expertise | Draconia (code), Lyria (research) |
| **Luminors** | Workers — specialized execution | Synthra (coder), Chronica (writer) |

Agent definitions: `.arcanea/agents/`
Luminor kernel: `.arcanea/prompts/luminor-engineering-kernel.md`
Every spawned agent must use the Luminor Engineering Kernel.

## MCP Servers (Active)

| Server | Purpose |
|--------|---------|
| `arcanea-mcp` | 42 world-building + intelligence tools |
| `arcanea-memory` | Vault + horizon persistent memory |
| `starlight-sis` | Session Intelligence System |
| `supabase` | Database operations |
| `comfyui` | Image generation workflows |

Memory operations use `arcanea-memory` MCP tools, not CLI commands.

## Design System

- **Primary**: Atlantean Teal (#00bcd4)
- **Secondary**: Cosmic Blue (#0d47a1)
- **Accent**: Gold (#ffd700)
- **Background**: #09090b
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (code)
- **NEVER use Cinzel font**
- **Glass cards**: `bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm`
- **Framer Motion**: Use `domAnimation` not `domMax`

## Support

- Repository: https://github.com/frankxai/arcanea-ai-app
- OSS: https://github.com/frankxai/arcanea
