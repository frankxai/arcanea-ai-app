# @arcanea/i18n

The Arcanean i18n foundation. Path-based routing, translated slugs, AEO/SEO helpers, JSON-LD schema, llms.txt and sitemap generation. Reusable across all Frank properties.

## What this gives you

- `defineLocaleConfig()` — single-source-of-truth locale + pathnames + domain config
- `detectLocale()` / `shouldRedirectToLocale()` — pure middleware helpers, composable with Supabase auth and any other middleware chain
- `generateHreflang()` / `generateLocaleSitemap()` / `renderSitemapXml()` / `renderSitemapIndex()` — per-locale sitemap with hreflang clusters
- `generateLLMsManifest()` — `/llms.txt` per locale (AEO foundation)
- `createBookSchema()` / `createCreativeWorkSchema()` / `createArticleSchema()` / `createPersonSchema()` — typed JSON-LD with `inLanguage`, `workTranslation`, `aiInvolvement` provenance
- `asciiSlug()` / `validateSlug()` — ASCII-safe slug enforcement (German `ä` → `ae`, etc.)

## Architectural decisions (locked)

See `planning-with-files/PLAN_I18N_FOUNDATION_2026-05-02.md` for full rationale.

1. **Path-based** (`arcanea.ai/de/...`), never subdomain or ccTLD
2. **`localePrefix: 'as-needed'`** — default locale drops its prefix
3. **Translated path segments** (`/library` → `/bibliothek`), not just translated content
4. **Per-locale content slugs**, ASCII-safe
5. **JSON-LD + hreflang + per-locale sitemap + per-locale `/llms.txt`** as the AEO baseline
6. **Always-visible language switcher**, never silent geo-redirect; respect cookie

## Usage

```ts
// i18n/routing.ts
import { defineLocaleConfig } from '@arcanea/i18n/routing';

export const routing = defineLocaleConfig({
  domain: 'https://www.arcanea.ai',
  locales: ['en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/library': { en: '/library', de: '/bibliothek' },
    '/library/[slug]': { en: '/library/[slug]', de: '/bibliothek/[slug]' },
    '/worlds': { en: '/worlds', de: '/welten' },
    '/about': { en: '/about', de: '/ueber' },
    // dev content stays English
    '/docs': '/docs',
    '/cli': '/cli',
  },
});
```

```ts
// middleware.ts (compose with Supabase auth)
import { detectLocale, shouldRedirectToLocale } from '@arcanea/i18n/middleware';
import { routing } from '@/i18n/routing';

export async function middleware(request: NextRequest) {
  const locale = detectLocale(request, routing);
  const redirect = shouldRedirectToLocale(request, routing, locale);
  if (redirect) return NextResponse.redirect(redirect, 308);
  return updateSession(request, /* ... */);
}
```

```tsx
// app/[locale]/library/[slug]/page.tsx
import { generateHreflang, createBookSchema } from '@arcanea/i18n';
import { routing } from '@/i18n/routing';

export default async function BookPage({ params }) {
  const book = await getBook(params.slug, params.locale);
  const alternates = generateHreflang(routing, '/library/[slug]', params.slug);
  const schema = createBookSchema({
    id: book.id,
    url: `https://www.arcanea.ai/library/${book.slug}`,
    name: book.title,
    inLanguage: params.locale,
    authors: book.authors,
    translators: book.translators,
    originalWorkUrl: book.originalUrl,
    originalLanguage: book.originalLanguage,
    aiInvolvement: book.aiInvolvement,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* ... */}
    </>
  );
}

export async function generateMetadata({ params }) {
  return {
    alternates: {
      canonical: `https://www.arcanea.ai/library/${params.slug}`,
      languages: Object.fromEntries(
        generateHreflang(routing, '/library/[slug]', params.slug).map((a) => [
          a.hreflang,
          a.href,
        ]),
      ),
    },
  };
}
```

## Cross-property reuse

Once proven on `apps/web`, this package is the i18n foundation for any Frank Next.js property: `frankx.ai`, `arcanea.ai`, future creator sites. Same config shape, same SEO/AEO output.

## Phase status

- **Phase 1 — this package** ✅ Foundation: types, routing, middleware helpers, SEO/AEO builders, schema. Mergeable.
- **Phase 2 — apps/web integration** ⏳ Move 2 sample routes under `app/[locale]/`, install `next-intl`, add hreflang sitemap + JSON-LD on book page.
- **Phase 3 — full route migration** ⏳ All `app/` routes under `[locale]`, all section UI strings translated.
- **Phase 4 — Translation Studio** ⏳ Supabase tables, editor UI, Guardian per-locale review, revenue share.
- **Phase 5 — cross-property reuse** ⏳ Apply to second Frank property as proof.

## Skill

A Claude Code skill at `.claude/skills/arcanea-i18n/SKILL.md` documents how to apply this pattern to any Next.js site, audit AEO/SEO compliance, and run the Translation Studio workflow.
