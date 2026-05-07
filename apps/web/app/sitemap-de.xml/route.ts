import { buildLocaleSitemapResponse } from '../_sitemap-locale';

export const dynamic = 'force-static';

export function GET() {
  return buildLocaleSitemapResponse('de');
}
