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
    title: 'Imagination Charter',
    description: 'Commitments for human authorship, provenance, and participatory worldbuilding',
    internalPath: '/imagination-charter',
  },
  {
    title: 'Worlds',
    description: 'Build living worlds with AI agents',
    internalPath: '/worlds',
  },
  {
    title: 'Chat',
    description: 'Talk with Arcanea creative partners',
    internalPath: '/chat',
  },
  {
    title: 'Books',
    description: 'Living books that grow with their readers',
    internalPath: '/books',
  },
  {
    title: 'Story',
    description: 'The First Light — Lumina and Nero, origin of the Arcanea universe',
    internalPath: '/story',
  },
  {
    title: 'Library',
    description: 'Philosophy and craft for creators',
    internalPath: '/library',
  },
  {
    title: 'Lore',
    description: 'The Arcanea universe, guardians, and living mythology',
    internalPath: '/lore',
  },
  {
    title: 'Academy',
    description: 'Creative progression for builders',
    internalPath: '/academy',
  },
  {
    title: 'MCP',
    description: 'Model Context Protocol surface for agents',
    internalPath: '/mcp',
  },
  {
    title: 'About',
    description: 'Where creators and AI build worlds together',
    internalPath: '/about',
  },
  {
    title: 'Blog',
    description: 'Insights and stories from Arcanea',
    internalPath: '/blog',
  },
  {
    title: 'Gallery',
    description: 'Visual encyclopedia of inspectable worlds',
    internalPath: '/gallery',
  },
  {
    title: 'Create',
    description: 'Start-building hub for new work',
    internalPath: '/create',
  },
  {
    title: 'Imagine',
    description: 'Image generation studio',
    internalPath: '/imagine',
  },
  {
    title: 'Showcase',
    description: 'Connected-world demos from a single prompt',
    internalPath: '/showcase',
  },
  {
    title: 'Install',
    description: 'Set up Arcanea',
    internalPath: '/install',
  },
  {
    title: 'Agents',
    description: 'HTML product hub for Luminors; machine-readable orientation is /agents.md',
    internalPath: '/agents',
  },
  {
    title: 'Pricing',
    description: 'Sovereign by default, SaaS by choice',
    internalPath: '/pricing',
  },
  {
    title: 'Developers',
    description: 'Build on Arcanea',
    internalPath: '/developers',
  },
  {
    title: 'Contact',
    description: 'Get in touch',
    internalPath: '/contact',
  },
  {
    title: 'Privacy',
    description: 'Privacy policy',
    internalPath: '/privacy',
  },
  {
    title: 'Terms',
    description: 'Terms of service',
    internalPath: '/terms',
  },
];

/**
 * /llms.txt — manifest for AI agents (default English version).
 * https://llmstxt.org/
 * Curated live public doors only. Do not invent counts. Full URL inventory is /sitemap.xml.
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
  return new Response(manifest, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
