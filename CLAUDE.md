# Arcanea — Claude Code Configuration

## Visual Showcase Uplift (World-Class Mandate)
For arcanea-ai-app (paired with frankx.ai-vercel-website): the creative visual showcase per plan. Read DESIGN.md + TASTE.md + SHARING.md + SIP.md first (deeper). gstack (qa/design-review/benchmark + plan-*) + santa/excellence/verification gates on all visual. Atomic + annotated health 99+ before/after. Interactive demos (harness catalog, SIP visualizer + attest, gstack viz, 3D subagent/Luminor swarm, ACOS dogfood, multi proofs — core only; Kenya .grok magical .grok/personal only, SIP encoded-self). Restraint per TASTE (Geist only, no banned, premium AI-lab chrome, mythology in content). SIP "Built on SIP". Subagents + premium-visual/einui + ui-ux-pro-max. Deploy + post gstack canary. See visual subagent report for before, fixes, roadmap. God 99 evidence.

## LLM + API key policy (machine-global)
**Authoritative source: `~/.claude/CLAUDE.md` on this machine.** Default LLM route = OpenRouter (`OPENROUTER_API_KEY` + `OPENROUTER_BASE_URL`). Image gen for Arcanea book covers, character art, marketplace cards = Higgsfield MCP (preferred) or direct (NB2 = `gemini-3.1-flash-image`, GPT Image 2 = `gpt-image-1`/`gpt-image-2`). **Reason first** — don't auto-call external LLMs when you can think. Daily monitoring + secret scan via `StarlightAPIKeyMonitor` + `StarlightSecretScan` scheduled tasks. Arcanea-specific overrides: book covers → `/arcanea-book-cover` skill (NB2 with cover-design thinking).

## Source Of Truth

Before substantial work, read: `AGENTS.md` → newest `planning-with-files/CURRENT_STATE_*` → `CURRENT_BACKLOG_*` → `CURRENT_CHANGELOG_*` → `AGENT_EXECUTION_PROTOCOL_*`. For lore/canon: `.arcanea/CLAUDE.md`. For content: `book/CLAUDE.md`. **For any UI/visual work: `TASTE.md` (curatorial judgment) → `DESIGN.md` (Google Labs spec, machine tokens) → `@arcanea/design-system` (runtime).**

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
