import { generateLocaleSitemap, renderSitemapXml } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ENTRIES = [
  { internalPath: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { internalPath: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { internalPath: '/books', priority: 0.9, changeFrequency: 'daily' as const },
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    return new Response('Not found', { status: 404 });
  }
  const entries = generateLocaleSitemap(routing, locale, ENTRIES);
  return new Response(renderSitemapXml(entries), {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
