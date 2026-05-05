import { renderSitemapIndex } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

/**
 * Sitemap index — lists per-locale sitemaps.
 * https://www.sitemaps.org/protocol.html#index
 */
export function GET() {
  return new Response(renderSitemapIndex(routing), {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
