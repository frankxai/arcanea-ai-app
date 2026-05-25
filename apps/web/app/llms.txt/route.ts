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
