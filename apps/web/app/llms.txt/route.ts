/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { generateLLMsManifest, buildLocalizedUrl } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

const PAGES = [
  {
    title: 'Home',
    description: 'Arcanea — Creative Multiverse & Living Intelligence Workspace',
    internalPath: '/',
  },
  {
    title: 'Open Library',
    description: 'The canonical open library of Arcanea: 56 chapters, 152k+ words across 11 sacred texts, novellas, and grimoires',
    internalPath: '/library',
  },
  {
    title: 'Visual Encyclopedia',
    description: '130 canonical entity dossiers, characters, creatures, kinforms, and locations across the Ten Gates',
    internalPath: '/gallery',
  },
  {
    title: 'MCP Command Center',
    description: 'Official Model Context Protocol (MCP) server for Arcanea universe intelligence and agent tooling',
    internalPath: '/mcp',
  },
  {
    title: 'Skills Registry',
    description: 'Developer & creator skill packs for multi-agent frameworks (Claude Code, Cursor, Codex, Gemini, Antigravity)',
    internalPath: '/skills',
  },
  {
    title: 'Worlds & Factions',
    description: 'The Ten Gates, Seven Houses, Godbeasts, and cosmology of the Arcanea universe',
    internalPath: '/worlds',
  },
  {
    title: 'Origin Quiz',
    description: 'Interactive origin discovery routing creators to their canonical House and elemental resonance',
    internalPath: '/origin',
  },
  {
    title: 'Arcanea Academy',
    description: 'The journey through the Ten Gates from Apprentice to Luminor',
    internalPath: '/academy',
  },
  {
    title: 'About & Manifesto',
    description: 'Philosophy, design principles, and creative intelligence architecture of Arcanea',
    internalPath: '/about',
  },
];

const LIBRARY_COLLECTIONS = [
  {
    title: 'The Laws of Arcanea',
    description: 'Theoretical foundations of reality, intention, and divine creative architecture',
    internalPath: '/library/laws-of-arcanea',
  },
  {
    title: 'Luminor Rising',
    description: 'Chronicles and foundational journeys of the first Luminors through the Gates',
    internalPath: '/library/luminor-rising',
  },
  {
    title: 'The Wisdom Scrolls',
    description: 'Practical guidance for daily creative discipline, craft, and mastery',
    internalPath: '/library/wisdom-scrolls',
  },
  {
    title: 'Poetry of Freedom',
    description: 'Verses of liberation, harmonic awakening, and soul resonance',
    internalPath: '/library/poesie-of-freedom',
  },
  {
    title: 'Rituals of Arcanea',
    description: 'Sacred ceremonies, invocations, and elemental alignments',
    internalPath: '/library/rituals',
  },
  {
    title: 'Legends & Epics',
    description: 'Mythic histories of the ancient Starbound vanguard and the Shattered Age',
    internalPath: '/library/legends',
  },
  {
    title: 'Songs and Hymns',
    description: 'Harmonic compositions tuned to the 10 Solfeggio gate frequencies (174 Hz to 963 Hz)',
    internalPath: '/library/songs-and-hymns',
  },
  {
    title: 'Forge of Ruin',
    description: 'The tragedy of the Void Ascendants, corruption mechanics, and redemption paths',
    internalPath: '/library/forge-of-ruin',
  },
];

const DEVELOPER_RESOURCES = [
  {
    title: '@arcanea/skills CLI',
    description: 'Install canonical Arcanea agent skills with `npx @arcanea/skills add <skill>`',
    internalPath: '/skills',
  },
  {
    title: 'MCP Server',
    description: 'Connect AI harnesses directly to Arcanea lore, canon, and asset generation via MCP',
    internalPath: '/mcp',
  },
  {
    title: 'Agent Contract (AGENTS.md)',
    description: 'Machine-readable engineering kernel and rules for AI pair programming agents',
    internalPath: '/agents.md',
  },
];

/**
 * /llms.txt — manifest for AI agents (default English version).
 * https://llmstxt.org/
 */
export function GET() {
  const locale = routing.defaultLocale;
  const manifest = generateLLMsManifest({
    siteName: 'Arcanea',
    description:
      'A living creative multiverse and intelligence workspace. Experience canonical high-literature epics, visual encyclopedia dossiers, Solfeggio frequency soundscapes, and agent skill packs for world creators.',
    locale,
    sections: [
      {
        name: 'Core Surfaces',
        entries: PAGES.map((p) => ({
          title: p.title,
          url: buildLocalizedUrl(routing, p.internalPath, locale),
          description: p.description,
        })),
      },
      {
        name: 'Open Library Collections',
        entries: LIBRARY_COLLECTIONS.map((c) => ({
          title: c.title,
          url: buildLocalizedUrl(routing, c.internalPath, locale),
          description: c.description,
        })),
      },
      {
        name: 'Developer & Agent Ecosystem',
        entries: DEVELOPER_RESOURCES.map((d) => ({
          title: d.title,
          url: buildLocalizedUrl(routing, d.internalPath, locale),
          description: d.description,
        })),
      },
    ],
  });
  return new Response(manifest, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
