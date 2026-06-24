/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Suspense } from 'react';
import { getCollections, getAllTexts } from '@/lib/content';
import {
  V3Content as HomeContent,
  V3Loading as HomeLoading,
} from '@/app/v3/v3-content';

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

async function HomeWithData() {
  const collections = await getCollections();
  const allTexts = await getAllTexts();
  const totalWords = allTexts.reduce(
    (sum, t) => sum + (t.frontmatter.wordCount || 0),
    0,
  );

  return (
    <HomeContent
      collectionsCount={collections.length}
      textsCount={allTexts.length}
      totalWords={totalWords}
    />
  );
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Suspense fallback={<HomeLoading />}>
        <HomeWithData />
      </Suspense>
    </main>
  );
}
