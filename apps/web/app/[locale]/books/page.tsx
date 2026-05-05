import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'books' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical:
        locale === routing.defaultLocale
          ? `${routing.domain}/books`
          : `${routing.domain}/${locale}/books`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${routing.domain}/books`
            : `${routing.domain}/${l}/books`,
        ]),
      ),
    },
  };
}

const FEATURED_BOOK = {
  // Mila's book — first canonical multilingual asset
  slug: 'das-maedchen-drei-sprachen',
  title: { en: 'The Girl Who Heard Three Languages', de: 'Das Mädchen, das drei Sprachen hörte' },
  description: {
    en: 'A trilingual children\'s book about a six-year-old girl who hears the world in German, Dutch, and Croatian.',
    de: 'Ein dreisprachiges Kinderbuch über ein sechsjähriges Mädchen, das die Welt auf Deutsch, Niederländisch und Kroatisch hört.',
  },
};

export default async function LocaleBooks({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('books');

  const title = FEATURED_BOOK.title[locale as 'en' | 'de'] ?? FEATURED_BOOK.title.en;
  const desc = FEATURED_BOOK.description[locale as 'en' | 'de'] ?? FEATURED_BOOK.description.en;

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <header>
        <h1 className="font-editorial text-5xl text-text-primary">{t('title')}</h1>
        <p className="mt-4 text-lg text-text-secondary">{t('description')}</p>
      </header>

      <section className="mt-12">
        <article className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-atlantean-aqua/80">
            {t('newBook')}
          </p>
          <h2 className="mt-3 font-editorial text-3xl text-text-primary">{title}</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">{desc}</p>
          <Link
            href={`/books/${FEATURED_BOOK.slug}`}
            className="mt-6 inline-block rounded-full bg-atlantean-aqua px-5 py-2.5 text-sm font-semibold text-cosmic-deep transition hover:bg-atlantean-aqua/90"
          >
            {t('readNow')}
          </Link>
        </article>
      </section>

      <p className="mt-12 text-sm text-text-muted">
        {locale === 'de'
          ? 'Vollständiger Bibliothekskatalog folgt in Phase 3.'
          : 'Full library catalog coming in Phase 3.'}
      </p>
    </div>
  );
}
