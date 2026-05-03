# Phase 2 Execution Spec: apps/web Integration

**Date:** 2026-05-03
**Parent plan:** `PLAN_I18N_FOUNDATION_2026-05-02.md`
**Branch to create:** `feature/multilingual-apps-web`
**Worktree:** `.claude/worktrees/multilingual-apps-web` (recommended for isolation from active worktrees in `.claude/worktrees/design-evolution`)
**Estimated effort:** 4–6 hours focused work, one fresh session

This is the ready-to-execute spec for Phase 2 — first integration of `@starlight/multilingual` into `apps/web`. It is fully self-contained: tomorrow's first agent can run this without making architectural decisions, only implementation choices.

## Pre-flight checks

1. Confirm `feature/i18n-foundation` is on main (or rebase onto main if main has advanced)
2. Confirm `git worktree list` shows no other worktree on `apps/web/` route surface — coordinate with active worktrees
3. RAM check: `cat /proc/meminfo | grep MemFree` — needs ≥2 GB free before starting
4. Kill any running `pnpm dev` server before beginning (Next.js dev burns 2.6 GB)

## Setup

```bash
cd C:/Users/frank/Arcanea
git fetch origin
git checkout main
git pull origin main
git worktree add .claude/worktrees/multilingual-apps-web -b feature/multilingual-apps-web main
cd .claude/worktrees/multilingual-apps-web
pnpm install
pnpm --filter @starlight/multilingual build
```

## Step 1: Install next-intl in apps/web

```bash
pnpm --filter @arcanea/web add next-intl@^4
pnpm --filter @arcanea/web add -D schema-dts
```

Verify in `apps/web/package.json` that `next-intl` and `schema-dts` are added. Confirm `@starlight/multilingual` is a workspace dep:

```jsonc
// apps/web/package.json (add)
"dependencies": {
  "@starlight/multilingual": "workspace:*",
  "next-intl": "^4.0.0",
  // ...
},
"devDependencies": {
  "schema-dts": "^1.1.5",
  // ...
}
```

## Step 2: Create i18n config

### 2a. Create `apps/web/i18n/routing.ts`

```ts
import { defineLocaleConfig } from '@starlight/multilingual/routing';

export const routing = defineLocaleConfig({
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.arcanea.ai',
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/library': { en: '/library', de: '/bibliothek' },
    '/library/[slug]': { en: '/library/[slug]', de: '/bibliothek/[slug]' },
    '/about': { en: '/about', de: '/ueber' },
    // dev content stays English
    '/docs': '/docs',
    '/cli': '/cli',
    '/mcp': '/mcp',
  },
});

export type Locale = (typeof routing.locales)[number];
```

### 2b. Create `apps/web/i18n/request.ts` (next-intl boilerplate)

```ts
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && routing.locales.includes(requested) ? requested : routing.defaultLocale;

  let messages: Record<string, unknown>;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return { locale, messages };
});
```

### 2c. Create `apps/web/messages/en.json`

```json
{
  "common": {
    "siteName": "Arcanea",
    "tagline": "A creator platform for living worlds",
    "switchLocale": "Switch language",
    "loading": "Loading...",
    "error": "Something went wrong"
  },
  "nav": {
    "library": "Library",
    "worlds": "Worlds",
    "about": "About",
    "pricing": "Pricing"
  },
  "library": {
    "title": "The Library",
    "description": "Explore living books that grow with their readers.",
    "browse": "Browse all books",
    "continueReading": "Continue reading"
  },
  "about": {
    "title": "About Arcanea",
    "description": "Where creators and AI build worlds together."
  }
}
```

### 2d. Create `apps/web/messages/de.json`

```json
{
  "common": {
    "siteName": "Arcanea",
    "tagline": "Eine Schöpfer-Plattform für lebendige Welten",
    "switchLocale": "Sprache wechseln",
    "loading": "Wird geladen...",
    "error": "Etwas ist schief gelaufen"
  },
  "nav": {
    "library": "Bibliothek",
    "worlds": "Welten",
    "about": "Über uns",
    "pricing": "Preise"
  },
  "library": {
    "title": "Die Bibliothek",
    "description": "Erkunde lebendige Bücher, die mit ihren Lesern wachsen.",
    "browse": "Alle Bücher durchstöbern",
    "continueReading": "Weiterlesen"
  },
  "about": {
    "title": "Über Arcanea",
    "description": "Wo Schöpfer und KI gemeinsam Welten erschaffen."
  }
}
```

## Step 3: Update `next.config.js`

Add the next-intl plugin:

```js
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  // ... existing config ...
  transpilePackages: [
    '@arcanea/publishing-house',
    '@arcanea/world-engine',
    '@starlight/multilingual', // ADD
  ],
};

module.exports = withNextIntl(nextConfig);
```

Note: existing config uses `module.exports = nextConfig`. Wrap in `withNextIntl`.

## Step 4: Update middleware

Modify `apps/web/middleware.ts` to chain locale detection BEFORE Supabase session refresh:

```ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { detectLocale, shouldRedirectToLocale } from '@starlight/multilingual/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from '@/i18n/routing';

export async function middleware(request: NextRequest) {
  // www canonicalization (existing)
  if (request.headers.get('host') === 'arcanea.ai') {
    const url = request.nextUrl.clone();
    url.host = 'www.arcanea.ai';
    return NextResponse.redirect(url, 308);
  }

  // Locale detection + redirect on first visit
  const locale = detectLocale(request, routing);
  const localeRedirect = shouldRedirectToLocale(request, routing, locale);
  if (localeRedirect) {
    const response = NextResponse.redirect(localeRedirect, 308);
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return response;
  }

  // Pass detected locale to Supabase session refresh
  return updateSession(request, {
    protectedPrefixes: [
      '/profile', '/onboarding', '/dashboard', '/settings',
      // also protect locale-prefixed variants
      '/de/profile', '/de/onboarding', '/de/dashboard', '/de/settings',
    ],
    // ... rest unchanged
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)',
  ],
};
```

## Step 5: Move sample routes under `app/[locale]/`

This is the invasive part. **Only migrate 3 routes in this PR:** homepage, library landing, about. Full route migration is Phase 3.

### 5a. Create `app/[locale]/layout.tsx`

```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 5b. Move existing `app/page.tsx` → `app/[locale]/page.tsx`

Update the page to use `useTranslations`:

```tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('common');
  return <h1>{t('siteName')}: {t('tagline')}</h1>;
}
```

### 5c. Move `app/about/page.tsx` → `app/[locale]/about/page.tsx`

Same pattern — wrap with `setRequestLocale`, use `useTranslations('about')`.

### 5d. Move `app/library/page.tsx` → `app/[locale]/library/page.tsx`

Library content loader stays same (book content is per-book per-locale, handled separately). UI strings come from `messages/<locale>.json`.

### 5e. Update root `app/layout.tsx`

The root layout handles non-locale-prefixed paths (default English). Either:
- Option A: collapse it into `[locale]/layout.tsx` and delete root layout (cleaner, but requires every route under `[locale]`)
- Option B: keep both — root for default-locale paths, `[locale]` for prefixed

**Recommend Option A** for consistency. Move ALL routes under `[locale]` over time. Phase 2 only does 3 routes; Phase 3 does the rest.

For Phase 2, keep root layout for un-migrated routes; just remove the things `[locale]/layout.tsx` now provides.

## Step 6: Add language switcher

Create `apps/web/components/locale-switcher.tsx`:

```tsx
'use client';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('common');

  return (
    <select
      value={locale}
      onChange={(e) => {
        const newLocale = e.target.value;
        router.replace(pathname, { locale: newLocale });
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;samesite=lax`;
      }}
      aria-label={t('switchLocale')}
      className="bg-transparent border border-white/10 rounded px-2 py-1 text-sm"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>{l.toUpperCase()}</option>
      ))}
    </select>
  );
}
```

Add to header component. Style per `@arcanea/design-system` glass-card conventions.

Also create `apps/web/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

## Step 7: hreflang in metadata

In `app/[locale]/layout.tsx`, add `generateMetadata`:

```tsx
import type { Metadata } from 'next';
import { generateHreflang } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateHreflang(routing, '/');
  return {
    alternates: {
      canonical: routing.locales.includes(locale)
        ? `${routing.domain}${locale === routing.defaultLocale ? '' : '/' + locale}`
        : routing.domain,
      languages: Object.fromEntries(alternates.map((a) => [a.hreflang, a.href])),
    },
  };
}
```

## Step 8: Sitemap-per-locale

Create `apps/web/app/sitemap.xml/route.ts`:

```ts
import { renderSitemapIndex } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function GET() {
  return new Response(renderSitemapIndex(routing), {
    headers: { 'content-type': 'application/xml' },
  });
}
```

Create `apps/web/app/sitemap-[locale].xml/route.ts`:

```ts
import { generateLocaleSitemap, renderSitemapXml } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const entries = generateLocaleSitemap(routing, locale, [
    { internalPath: '/', priority: 1.0, changeFrequency: 'weekly' },
    { internalPath: '/library', priority: 0.9, changeFrequency: 'daily' },
    { internalPath: '/about', priority: 0.5, changeFrequency: 'monthly' },
    // dev content English-only
    { internalPath: '/docs', priority: 0.6, locales: ['en'] },
  ]);
  return new Response(renderSitemapXml(entries), {
    headers: { 'content-type': 'application/xml' },
  });
}
```

## Step 9: llms.txt per locale

Create `apps/web/app/llms.txt/route.ts` and `apps/web/app/[locale]/llms.txt/route.ts` — generate manifest from book registry + key marketing pages.

## Step 10: JSON-LD on book page

In `app/[locale]/library/[slug]/page.tsx` (Phase 3 if not migrated), use `bookSchemaForLocale`:

```tsx
import { bookSchemaForLocale } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';

export default async function BookPage({ params }) {
  const { locale, slug } = await params;
  const book = await getBookByLocaleSlug(slug, locale); // Library OS

  const schema = bookSchemaForLocale({
    config: routing,
    book,
    locale,
    bookRoutePath: '/library/[slug]',
    authors: book.authors,
    aiInvolvement: book.aiInvolvement,
    description: book.locales.find((l) => l.locale === locale)?.description,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* book content */}
    </>
  );
}
```

## Step 11: Build + verify

```bash
pnpm --filter @arcanea/web run build
```

Expected: build passes. If TypeScript errors appear, fix per Phase 1 schema (most likely missing imports of `@starlight/multilingual`).

## Step 12: Manual smoke test

```bash
pnpm --filter @arcanea/web run start
# in another terminal
curl -i http://localhost:3000/
curl -i http://localhost:3000/de
curl -i http://localhost:3000/library
curl -i http://localhost:3000/de/bibliothek
curl -s http://localhost:3000/sitemap.xml | head
curl -s http://localhost:3000/sitemap-de.xml | head
```

Expected:
- `/` returns English homepage
- `/de` returns German homepage with `<html lang="de">`
- `/library` returns English library
- `/de/bibliothek` returns German library
- Both sitemap responses are valid XML
- hreflang `<link>` tags appear in `<head>` of localized pages

## Step 13: Verify on Vercel preview

```bash
git push origin feature/multilingual-apps-web
# Vercel auto-creates preview deploy
```

On the preview URL, run:
1. Lighthouse audit (target i18n ≥ 90)
2. Schema.org validator on book page
3. Manual hreflang check via browser DevTools (`<head>` should contain `<link rel="alternate" hreflang="...">` for each locale + `x-default`)
4. Cookie test: visit `/`, switch to DE, refresh → should stay German (cookie persists)

## Step 14: Open PR

PR title: `feat(web): integrate @starlight/multilingual — homepage, library, about in EN+DE`

PR body should include:
- Link to plan docs
- Lighthouse before/after screenshots
- hreflang verification screenshot
- Locale switcher screenshot
- Notes on Phase 3 follow-up

## Definition of done for Phase 2

- [ ] Build passes locally + on Vercel preview
- [ ] Three routes live in EN + DE on preview deploy
- [ ] hreflang tags render correctly
- [ ] JSON-LD validates on book page (if library migrated; else moved to Phase 3)
- [ ] Locale switcher works, cookie persists
- [ ] First-visit redirect works (incognito test)
- [ ] No 404s on existing English-only routes (root layout still serves them)
- [ ] No regressions on `/auth/*`, `/api/*`, `/dashboard` (Supabase middleware still works)
- [ ] Lighthouse i18n ≥ 90 on preview

## What this PR explicitly does NOT do (deferred to Phase 3+)

- Migrating remaining `app/` routes under `[locale]/` (~50+ routes)
- Localizing Library OS book content registry (Phase 3)
- Translation Studio UI (Phase 4)
- Supabase migrations for `translation_tasks` / `book_locales` (Phase 4)
- Per-locale Guardian agents (Phase 4)
- Tolgee integration evaluation (Phase 4 research)
- Spanish, Japanese locales (Phase 3)

## Coordination notes

- **Active worktrees check before starting:** `git worktree list` should show only this worktree on `apps/web/` — if another agent is mid-flight there, hold this PR until theirs lands
- **Don't auto-merge:** Phase 2 is review-required. Frank approves before merge.
- **Don't push to main:** PR must go through review.
- **Resource:** if RAM hits 80%, kill dev server and use `pnpm build` (one-shot) for verification instead.
