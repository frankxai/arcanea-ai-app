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
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical:
        locale === routing.defaultLocale
          ? `${routing.domain}/about`
          : `${routing.domain}/${locale}/about`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${routing.domain}/about`
            : `${routing.domain}/${l}/about`,
        ]),
      ),
    },
  };
}

export default async function LocaleAbout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="font-editorial text-5xl text-text-primary">{t('title')}</h1>
      <p className="mt-4 text-lg text-text-secondary">{t('description')}</p>

      <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-atlantean-aqua">{t('mission')}</h2>
        <p className="mt-4 leading-relaxed text-text-secondary">{t('missionBody')}</p>
      </section>

      <Link
        href="/"
        className="mt-12 inline-block text-sm text-atlantean-aqua hover:underline"
      >
        ← Arcanea
      </Link>
    </div>
  );
}
