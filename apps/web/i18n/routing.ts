import { defineLocaleConfig } from '@starlight/multilingual/routing';

/**
 * arcanea.ai locale configuration.
 *
 * Phase 2A (2026-05-05): English (default, no prefix) + German (/de prefix).
 * Phase 3 will add Spanish (/es) + Japanese (/ja).
 *
 * Phase 2A keeps URL paths identical across locales (/about, /de/about). Phase
 * 2B will add translated pathnames (/de/about → /de/ueber) once next-intl
 * middleware is wired with selective matching.
 */
export const routing = defineLocaleConfig({
  domain: process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.arcanea.ai',
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/books': '/books',
  },
});

export type Locale = (typeof routing.locales)[number];
