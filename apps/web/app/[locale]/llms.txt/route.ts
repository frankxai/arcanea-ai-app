import { generateLLMsManifest, buildLocalizedUrl } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_DESCRIPTIONS: Record<string, string> = {
  en: 'A creative multiverse — chat with AI, build fantasy worlds, share what you make, and turn imagination into products.',
  de: 'Ein kreatives Multiversum — chatte mit KI, baue Fantasy-Welten, teile deine Werke und verwandle Vorstellungskraft in Produkte.',
};

const PAGES_BY_LOCALE: Record<string, Array<{ title: string; description: string; internalPath: string }>> = {
  en: [
    { title: 'Home', description: 'Arcanea — Creative Intelligence Platform', internalPath: '/' },
    { title: 'Books', description: 'Living books that grow with their readers', internalPath: '/books' },
    { title: 'About', description: 'Where creators and AI build worlds together', internalPath: '/about' },
  ],
  de: [
    { title: 'Start', description: 'Arcanea — Plattform für kreative Intelligenz', internalPath: '/' },
    { title: 'Bücher', description: 'Lebendige Bücher, die mit ihren Lesern wachsen', internalPath: '/books' },
    { title: 'Über uns', description: 'Wo Schöpfer und KI gemeinsam Welten erschaffen', internalPath: '/about' },
  ],
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    return new Response('Not found', { status: 404 });
  }
  const pages = PAGES_BY_LOCALE[locale] ?? PAGES_BY_LOCALE[routing.defaultLocale];
  const manifest = generateLLMsManifest({
    siteName: 'Arcanea',
    description: SITE_DESCRIPTIONS[locale] ?? SITE_DESCRIPTIONS[routing.defaultLocale],
    locale,
    sections: [
      {
        name: 'Pages',
        entries: pages.map((p) => ({
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
