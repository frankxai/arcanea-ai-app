/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { generateLocaleSitemap, renderSitemapXml } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

/**
 * Per-locale sitemap entries. Add new internalPaths here as the site grows;
 * each entry will be emitted in every configured locale's sitemap with
 * hreflang alternates referencing siblings.
 */
const ENTRIES = [
  { internalPath: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { internalPath: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { internalPath: '/books', priority: 0.9, changeFrequency: 'daily' as const },
];

/**
 * Build a Response containing the per-locale sitemap XML.
 *
 * Why physical per-locale route files instead of a single `[locale]` dynamic
 * route? Next.js 16's typed-routes validator does not recognise dynamic
 * segments embedded inside folder names that also carry a file extension
 * (e.g. `sitemap-[locale].xml`). The folder is treated as a literal route,
 * `ParamMap[Route]` resolves to `{}`, and any `params: Promise<{ locale }>`
 * signature fails the `RouteHandlerConfig` constraint, breaking type-check
 * and the build. Keeping URLs flat (`/sitemap-en.xml`, `/sitemap-de.xml`) is
 * also better for crawler conventions referenced from the sitemap-index.
 */
export function buildLocaleSitemapResponse(locale: string): Response {
  if (!routing.locales.includes(locale)) {
    return new Response('Not found', { status: 404 });
  }
  const entries = generateLocaleSitemap(routing, locale, ENTRIES);
  return new Response(renderSitemapXml(entries), {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
