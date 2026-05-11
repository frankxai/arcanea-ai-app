/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: t('siteName'),
    description: t('tagline'),
    alternates: {
      canonical:
        locale === routing.defaultLocale
          ? `${routing.domain}/`
          : `${routing.domain}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale ? `${routing.domain}/` : `${routing.domain}/${l}`,
        ]),
      ),
    },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-12 backdrop-blur-sm">
        <p className="mb-4 text-sm uppercase tracking-[0.18em] text-atlantean-aqua/80">
          {tCommon('siteName')}
        </p>
        <h1 className="font-editorial text-5xl leading-tight text-text-primary md:text-6xl">
          {t('hero')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          {t('subhero')}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/books"
            className="rounded-full bg-atlantean-aqua px-6 py-3 text-sm font-semibold text-cosmic-deep transition hover:bg-atlantean-aqua/90"
          >
            {t('cta')}
          </Link>
          <Link
            href="/books"
            className="rounded-full border border-white/[0.1] px-6 py-3 text-sm font-semibold text-text-primary transition hover:border-white/[0.25]"
          >
            {t('secondaryCta')}
          </Link>
        </div>
        <p className="mt-12 text-sm text-text-muted">{t('tagline')}</p>
      </div>

      <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary">
        <Link href="/about" className="hover:text-atlantean-aqua">
          {tNav('about')}
        </Link>
        <Link href="/books" className="hover:text-atlantean-aqua">
          {tNav('books')}
        </Link>
      </nav>
    </div>
  );
}
