<div align="center">

# Arcanea

**A BYOK-first creative intelligence workspace.**

Arcanea gives creators a persistent workspace for projects, docs, memory, creations, provenance, project graph context, and workflow orchestration. The public app is the product; the repo is also the operating system, agent substrate, and reference world behind it.

[![arcanea.ai](https://img.shields.io/badge/arcanea.ai-live-00bcd4?style=flat-square)](https://arcanea.ai)
[![npm](https://img.shields.io/badge/npm-@arcanea-00bcd4?style=flat-square&logo=npm)](https://www.npmjs.com/org/arcanea)
[![Agent Native](https://img.shields.io/badge/agent--native-AGENTS.md-111827?style=flat-square)](./AGENTS.md)
[![License](https://img.shields.io/badge/license-proprietary--source--viewable-6b7280?style=flat-square)](./LICENSE)

</div>

## What Arcanea Is

Arcanea is a creative intelligence system with four connected layers:

| Layer                 | Purpose                                                                                 |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| **Workspace**         | Projects, docs, chat, creations, memory, provenance, and reusable workflows             |
| **SIS substrate**     | Vendor-agnostic continuity for agents, sessions, context, memory, voice, and handoffs   |
| **Palace / world OS** | A spatial mental model for navigating projects, canon, creations, agents, and verticals |
| **Verticals**         | Books, media, research, academy, marketplace, voice, community, and creator tools       |

The mythology is not decoration. Arcanea's world, guardians, books, gates, and palace vocabulary are the product's reference implementation for creative systems that compound over time.

## Use Arcanea

| Path                             | What you get                                                                         |
| :------------------------------- | :----------------------------------------------------------------------------------- |
| [arcanea.ai](https://arcanea.ai) | Public web app for chat, creation, library, pages, and product surfaces              |
| `npx @arcanea/mcp-server`        | MCP tools for agent clients that support Model Context Protocol                      |
| `pnpm dev`                       | Local monorepo development for the web app and packages                              |
| [AGENTS.md](./AGENTS.md)         | Runtime instructions for Codex, Claude, Cursor, Gemini, opencode, and Arcanea agents |
| [llms.txt](./llms.txt)           | Agent-readable map of the repo and public docs                                       |

## Capabilities

- **Creative workspace**: project-centered docs, conversations, creations, and continuity.
- **Memory and provenance**: SIS-backed context, durable decisions, session handoff, and source-aware creation history.
- **Agent orchestration**: Luminor Engineering Kernel, task contracts, model routing discipline, and specialist agents.
- **MCP and tools**: MCP packages, workflow tools, research agents, voice bridges, and app integrations.
- **Project graph**: project context activation, Supabase-backed graph plans, and workspace verification.
- **Vertical OS**: books, visual media, marketplace, academy, research, voice, and community layers.
- **Design system**: `@arcanea/design-system` tokens, brand kits, motion variants, and UI rules.

## Repository Map

```text
apps/web/              Next.js app and public product surfaces
packages/              Shared packages: MCP, agents, memory, voice, design, OS, CLI
.arcanea/              Shared intelligence substrate and canonical planning context
planning-with-files/   Execution control plane: state, backlog, changelog, branch audits
book/                  Original books, lore, and creator philosophy
docs/                  Architecture, strategy, research, product, and operations docs
oss/                   Public/open-source packaging surfaces and skill registry work
scripts/               Verification, SIS, project graph, ops, and release automation
```

## For Agents

Read these in order before making substantial changes:

1. [AGENTS.md](./AGENTS.md)
2. newest files in [planning-with-files/](./planning-with-files/)
3. [.arcanea/CLAUDE.md](./.arcanea/CLAUDE.md)
4. [.arcanea/MASTER_PLAN.md](./.arcanea/MASTER_PLAN.md)
5. [TASTE.md](./TASTE.md) and [DESIGN.md](./DESIGN.md) for visual work

Agents must use Node 20.x, pnpm, narrow branches, task contracts, and the verification commands attached to the work.

## Develop Locally

```bash
git clone https://github.com/frankxai/arcanea.git
cd arcanea
pnpm install --frozen-lockfile
pnpm dev
```

Core verification:

```bash
pnpm run type-check
pnpm run lint
pnpm run build
pnpm run verify:project-workspaces
pnpm run sis:check
```

App/media verification:

```bash
pnpm --dir apps/web test:media
```

## Public Status

This repository is source-viewable but not open-licensed. Some packages may have separate publication or licensing terms. See [LICENSE](./LICENSE), [CONTRIBUTING.md](./CONTRIBUTING.md), and [SECURITY.md](./SECURITY.md) before reusing code or submitting changes.

## Maintainer

Arcanea is built and maintained by [FrankX](https://github.com/frankxai).

<div align="center">

**[arcanea.ai](https://arcanea.ai)** | **[AGENTS.md](./AGENTS.md)** | **[llms.txt](./llms.txt)**

</div>
