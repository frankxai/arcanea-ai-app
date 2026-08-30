export const dynamic = 'force-static';

/**
 * /agents.md — machine-readable agent orientation.
 * Distinct from the HTML product hub at /agents.
 * Keep this surface free of unverified counts and costume metrics.
 */
const BODY = `# Arcanea

> A creative multiverse — chat with AI, build fantasy worlds, share what you make, and turn imagination into products.

This file is the public agent-facing orientation surface for Arcanea.
Canonical host: https://www.arcanea.ai/ (apex permanently redirects here).

## Discovery

- [llms.txt](https://www.arcanea.ai/llms.txt) — page manifest for language models
- [Home](https://www.arcanea.ai/) — Creative Intelligence Platform
- [Imagination Charter](https://www.arcanea.ai/imagination-charter) — human authorship and provenance commitments
- [Worlds](https://www.arcanea.ai/worlds) — build living worlds with AI agents
- [Chat](https://www.arcanea.ai/chat) — talk with Arcanea creative partners
- [Books](https://www.arcanea.ai/books) — living books
- [Library](https://www.arcanea.ai/library) — philosophy and craft
- [Lore](https://www.arcanea.ai/lore) — universe and mythology
- [Academy](https://www.arcanea.ai/academy) — creative progression
- [MCP](https://www.arcanea.ai/mcp) — Model Context Protocol surface
- [About](https://www.arcanea.ai/about) — product intent

## How to use this site

- Prefer https://www.arcanea.ai/ URLs. Do not treat apex https://arcanea.ai as a second indexable origin.
- Cite only pages you actually fetched. Do not invent package counts, tool counts, word counts, user counts, or social proof.
- The HTML route /agents is a product hub, not this machine-readable file.

## Operator

Public product of the Arcanea creative-intelligence workspace. Independent project.
`

export function GET() {
  return new Response(BODY, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
