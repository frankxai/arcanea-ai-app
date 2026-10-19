<div align="center">

# Arcanea

**The imagination layer for AI.**
Superintelligent prompts that make every model feel like magic.

[![arcanea.ai](https://img.shields.io/badge/arcanea.ai-live-00bcd4?style=flat-square)](https://arcanea.ai)
[![npm](https://img.shields.io/badge/npm-@arcanea-00bcd4?style=flat-square&logo=npm)](https://www.npmjs.com/org/arcanea)
![License](https://img.shields.io/badge/License-Proprietary-gray?style=flat-square)

</div>

---

## Status / Limits

Live: **[www.arcanea.ai](https://www.arcanea.ai)**. Updated 9 Oct 2026, checked against `main` at `088eba0` and the live site.

- **The shop is a preview.** [/shop](https://www.arcanea.ai/shop) lists four editions. Each one and its price is marked "Proposed".
- **Checkout is gated.** No edition is released, so `/api/shop/checkout` returns `edition_unavailable`. See [`apps/web/lib/shop/checkout.ts`](./apps/web/lib/shop/checkout.ts).
- **Paid edition files aren't released.** The free [World Starter sample](https://www.arcanea.ai/shop/sample) is available now.
- **The art isn't final.** Living Cosmos and the First Collection bundle wait for accepted art masters ([shop plan](./planning-with-files/ARCANEA_SHOP_EXECUTION_2026-10-07.md)).
- **Studio needs an account.** [/studio](https://www.arcanea.ai/studio) redirects to sign-in.

## Use Arcanea now

| How                                  | What you get                                                                                                                      |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **[arcanea.ai](https://arcanea.ai)** | Chat — free to use, bring your own API key in [/settings/providers](https://www.arcanea.ai/settings/providers) (sign-in required) |
| **Claude Code**                      | `claude mcp add arcanea -- npx -y @arcanea/mcp-server`                                                                            |
| **Any AI**                           | Copy a prompt from [arcanea.ai/sanctum](https://arcanea.ai/sanctum)                                                               |
| **Authors**                          | `npx author-os-cli init` — AI-native book production                                                                              |

## What's inside

```
apps/web/          The platform — Next.js 16, Supabase, Vercel
packages/          shared libraries, VS Code extension, MCP server
book/              original creative philosophy
.arcanea/lore/     The canon — mythology that doubles as architecture
prompts/           Arcanean Prompt Language spec + templates
```

## The philosophy

Arcanea is a creative multiverse where mythology _is_ methodology. Every character, location, and progression system in the world is also an architectural pattern you can use to build your own.

Think **Unreal Engine** (not a game — the engine for making games), **D&D** (not a story — the system for infinite stories). Arcanea's world is both real content people engage with _and_ templates anyone can fork for their own universe.

**The creator journey:** Imagine a world → Build AI agents that live in it → Create consistent content → Publish → Earn → Expand as your fans become creators too.

## Build with Arcanea

| Package                                                                    | What it does                                                       |
| :------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| [`@arcanea/mcp-server`](https://www.npmjs.com/package/@arcanea/mcp-server) | MCP server — add Arcanea to Claude Code, Cursor, or any MCP client |
| [`author-os-cli`](https://www.npmjs.com/package/author-os-cli)             | AI-native book production pipeline                                 |
| [`@arcanea/vscode`](./packages/vscode/)                                    | VS Code extension with Guardian-powered AI modes                   |

## For developers

```bash
git clone https://github.com/frankxai/arcanea-ai-app.git
cd arcanea-ai-app && pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev:web
```

The web app serves on http://localhost:3001. Environment variables are described in [`docs/guides/ENVIRONMENT_SETUP.md`](./docs/guides/ENVIRONMENT_SETUP.md).

**Stack:** Next.js 16 · React 19 · TypeScript (strict) · Supabase · Vercel AI SDK · Gemini + Claude

## The Library

> _"These books are not entertainment. They are equipment for living."_

Collections of creative philosophy in [`book/`](./book/) — Laws, Legends, Meditations, an Academy Handbook, and more. Not content to consume, but frameworks to practice.

## Contributing

We welcome contributions from creators and developers.

## License

Proprietary. See LICENSE. Source is viewable for transparency; viewing does not grant usage rights.

---

<div align="center">

_"Enter seeking, leave transformed, return whenever needed."_

**[arcanea.ai](https://arcanea.ai)** · Built by [FrankX](https://github.com/frankxai)

</div>
