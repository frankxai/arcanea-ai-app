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
    title: 'Books',
    description: 'Living books that grow with their readers',
    internalPath: '/books',
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
  return new Response(manifest, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
