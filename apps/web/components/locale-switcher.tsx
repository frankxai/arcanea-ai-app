'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTransition } from 'react';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  de: 'DE',
  es: 'ES',
  ja: 'JA',
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => {
      router.replace(pathname, { locale: next as Locale });
    });
  }

  return (
    <label className="inline-flex items-center gap-2 text-xs text-text-secondary">
      <span className="sr-only">{t('switchLocale')}</span>
      <select
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t('switchLocale')}
        disabled={isPending}
        className="cursor-pointer rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs uppercase tracking-wider text-text-primary backdrop-blur-sm transition hover:border-white/[0.18] focus:outline-none focus:ring-1 focus:ring-atlantean-aqua disabled:opacity-50"
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="bg-cosmic-deep text-text-primary">
            {LOCALE_LABELS[l] ?? l.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
