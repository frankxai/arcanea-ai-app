<div align="center">

# Arcanea

**The imagination layer for AI.**
Superintelligent prompts that make every model feel like magic.

[![arcanea.ai](https://img.shields.io/badge/arcanea.ai-live-00bcd4?style=flat-square)](https://arcanea.ai)
[![npm](https://img.shields.io/badge/npm-@arcanea-00bcd4?style=flat-square&logo=npm)](https://www.npmjs.com/org/arcanea)
[![License](https://img.shields.io/badge/License-Proprietary-gray?style=flat-square)](./LICENSE)

</div>

---

## Use Arcanea now

| How | What you get |
|:----|:-------------|
| **[arcanea.ai](https://arcanea.ai)** | Chat, create images, write stories, compose music — free |
| **Claude Code** | `claude mcp add arcanea -- npx -y @arcanea/mcp-server` |
| **Any AI** | Copy a prompt from [arcanea.ai/sanctum](https://arcanea.ai/sanctum) |
| **Authors** | `npx author-os-cli init` — AI-native book production |

## What's inside

```
apps/web/          The platform — Next.js 16, Supabase, Vercel
packages/          42 shared libraries, VS Code extension, MCP server
book/              200K+ words of original creative philosophy
.arcanea/lore/     The canon — mythology that doubles as architecture
prompts/           Arcanean Prompt Language spec + templates
```

## The philosophy

Arcanea is a creative multiverse where mythology *is* methodology. Every character, location, and progression system in the world is also an architectural pattern you can use to build your own.

Think **Unreal Engine** (not a game — the engine for making games), **D&D** (not a story — the system for infinite stories). Arcanea's world is both real content people engage with *and* templates anyone can fork for their own universe.

**The creator journey:** Imagine a world → Build AI agents that live in it → Create consistent content → Publish → Earn → Expand as your fans become creators too.

## Build with Arcanea

| Package | What it does |
|:--------|:-------------|
| [`@arcanea/mcp-server`](https://www.npmjs.com/package/@arcanea/mcp-server) | MCP server — add Arcanea to Claude Code, Cursor, or any MCP client |
| [`author-os-cli`](https://www.npmjs.com/package/author-os-cli) | AI-native book production pipeline |
| [`arcanea-claw`](./arcanea-claw/) | 24/7 media processing daemon |
| [`@arcanea/vscode`](./packages/vscode/) | VS Code extension with Guardian-powered AI modes |

## For developers

```bash
git clone https://github.com/frankxai/arcanea.git
cd arcanea && pnpm install
cp .env.example .env.local
pnpm dev
```

**Stack:** Next.js 16 · React 19 · TypeScript (strict) · Supabase · Vercel AI SDK · Gemini + Claude

## The Library

> *"These books are not entertainment. They are equipment for living."*

17 collections of creative philosophy in [`book/`](./book/) — Laws, Legends, Meditations, an Academy Handbook, and more. Not content to consume, but frameworks to practice.

## Contributing

We welcome contributions from creators and developers. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

Proprietary. See [LICENSE](./LICENSE). Source is viewable for transparency; viewing does not grant usage rights.

---

<div align="center">

*"Enter seeking, leave transformed, return whenever needed."*

**[arcanea.ai](https://arcanea.ai)** · Built by [FrankX](https://github.com/frankxai)

</div>
