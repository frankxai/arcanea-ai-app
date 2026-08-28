/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { generateLLMsManifest, buildLocalizedUrl } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

const PAGES = [
  {
    title: 'Home',
    description: 'Arcanea — Creative Intelligence Platform',
    internalPath: '/',
  },
  {
    title: 'Chat',
    description: 'BYOK AI chat — your key stays in your browser',
    internalPath: '/chat',
  },
  {
    title: 'Worlds',
    description: 'Build and explore living fantasy worlds',
    internalPath: '/worlds',
  },
  {
    title: 'Library',
    description: 'The Arcanea library of living texts',
    internalPath: '/library',
  },
  {
    title: 'Books',
    description: 'Living books that grow with their readers',
    internalPath: '/books',
  },
  {
    title: 'Gallery',
    description: 'Curated Arcanea art and world imagery',
    internalPath: '/gallery',
  },
  {
    title: 'Academy',
    description: 'Learn world-building and creative craft',
    internalPath: '/academy',
  },
  {
    title: 'Agents',
    description: 'The Arcanea agent roster',
    internalPath: '/agents',
  },
  {
    title: 'Luminors',
    description: 'The Luminor guides of Arcanea',
    internalPath: '/luminors',
  },
  {
    title: 'MCP',
    description: 'Connect any AI to Arcanea via the Model Context Protocol',
    internalPath: '/mcp',
  },
  {
    title: 'Pricing',
    description: 'Plans and the Founding Circle',
    internalPath: '/pricing',
  },
  {
    title: 'About',
    description: 'Where creators and AI build worlds together',
    internalPath: '/about',
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
      'A creative multiverse — chat with AI, build fantasy worlds, share what you make, and turn imagination into products.',
    locale,
    sections: [
      {
        name: 'Pages',
        entries: PAGES.map((p) => ({
          title: p.title,
          url: buildLocalizedUrl(routing, p.internalPath, locale),
          description: p.description,
        })),
      },
    ],
  });
  // llmstxt.org convention: the index links the full-detail file.
  const fullReference = [
    '',
    '## Full reference',
    `- [Complete MCP tool schemas](${buildLocalizedUrl(routing, '/llms-full.txt', locale)}): every Arcanea MCP tool with parameters`,
    '',
  ].join('\n');
  return new Response(manifest + fullReference, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
