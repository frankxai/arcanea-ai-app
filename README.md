# Arcanea

[![Build](https://github.com/frankxai/arcanea-ai-app/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/frankxai/arcanea-ai-app/actions/workflows/quality-gate.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-See%20LICENSE-green)](./LICENSE)
[![npm](https://img.shields.io/npm/v/arcanea?label=arcanea&color=7fffd4)](https://www.npmjs.com/package/arcanea)
[![npm](https://img.shields.io/npm/v/claude-arcanea?label=claude-arcanea&color=ffd700)](https://www.npmjs.com/package/claude-arcanea)
[![Packages](https://img.shields.io/badge/@arcanea-21%20packages-purple)](https://www.npmjs.com/org/arcanea)

**Arcanea is a creative intelligence platform for builders, authors, and world-makers.**

It brings product, ecosystem, and philosophy into one system: a creator workspace, a developer/tooling layer, and a deep library of canon, Academy structure, and long-form creative thought.

## What Arcanea is

- A creator-facing platform at `arcanea.ai` for chat, research, creation, and world-building
- A developer ecosystem of packages, MCP surfaces, prompts, overlays, and shared tooling
- A long-form library of philosophy, canon, and Academy systems that gives Arcanea depth and continuity
- A monorepo that acts as the control plane for the wider Arcanea ecosystem

## Core experience

- `Chat`: the canonical AI workspace for asking, thinking, researching, and creating
- `Imagine`: visual generation with provider-backed image creation
- `Library`: Arcanea's philosophy and canon surfaced as usable creative context
- `Academy`: the progression and learning layer
- `Community`: gallery, discovery, and living-lore participation

## System model

- `Platform`: the product surface people use every day on `arcanea.ai`
- `Protocols and Tooling`: packages, MCP servers, prompts, overlays, and developer surfaces
- `Philosophy and Canon`: the texts, mythology, and Academy structures that differentiate the system

## Monorepo shape

```text
apps/web/         Canonical product surface for arcanea.ai
apps/premium-web/ Premium and experimental web surface in progress
packages/         Shared libraries, tooling, overlays, MCP, and runtime packages
book/             Arcanea's long-form philosophy and creative texts
docs/             Product, architecture, and strategy documentation
.github/          CI, deployment, and release workflows
```

## Architecture

```text
User
  -> apps/web
     -> /api/ai/chat          Canonical chat transport
     -> /api/imagine/generate Canonical image generation route
     -> Supabase              Auth, persistence, profiles, creations
     -> Model providers       OpenAI, Anthropic, Google, xAI, others
     -> Library content       Arcanea philosophy, lore, Academy context
```

## Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Vercel
- Vercel AI SDK
- Multi-provider model routing across OpenAI, Anthropic, Google, and xAI

## Local development

```bash
git clone https://github.com/frankxai/arcanea.git
cd arcanea
pnpm install
cp .env.example .env.local
pnpm --filter @arcanea/web dev
```

## Quality bar

- Runtime target: Node `20.x`
- Canonical deploy target: `apps/web`
- Primary checks for the web app:
  - `pnpm --filter @arcanea/web type-check`
  - `pnpm --filter @arcanea/web lint`
  - `pnpm --filter @arcanea/web build`
  - `pnpm --filter @arcanea/web test:e2e`

## Stable vs experimental

**Stable direction**

- `apps/web` as the main product
- Chat + imagine + library + academy as the core user journey
- Monorepo package publishing through Changesets

**Experimental / evolving**

- Some secondary routes and older marketing/versioned surfaces
- Billing and credit flows still being hardened
- Memory and some persistence surfaces where schema alignment is still in progress
- Premium and parallel app surfaces outside the canonical `apps/web` path

## License

Proprietary. See [LICENSE](./LICENSE).
