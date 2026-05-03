# @starlight/multilingual

The Starlight multilingual foundation. Path-based routing, translated slugs, canon glossary, AEO JSON-LD with provenance, llms.txt and sitemap generation, community translation pipeline. Cross-property infrastructure for any Next.js site in the Frank ecosystem.

## What this gives you

### Routing + middleware
- `defineLocaleConfig()` — single source of truth (locale + pathnames + domain)
- `buildLocalizedUrl()` / `getLocaleVariants()` — accepts string slug *or* per-locale slug map
- `detectLocale()` / `shouldRedirectToLocale()` / `stripLocalePrefix()` — pure middleware helpers, composable with Supabase auth or any other middleware chain

### AEO / SEO
- `generateHreflang()` — full hreflang clusters with `x-default`
- `generateLocaleSitemap()` / `renderSitemapXml()` / `renderSitemapIndex()` — sitemap-per-locale
- `generateLLMsManifest()` — `/llms.txt` builder (the new AI-crawler standard, 2025+)

### JSON-LD schema with provenance
- `createBookSchema()` — `inLanguage`, `workTranslation`, `translator`, custom `arcanea:aiInvolvement`
- `createCreativeWorkSchema()`, `createArticleSchema()`, `createPersonSchema()` (with AI-persona flag), `createOrganizationSchema()`

### Slug utilities
- `asciiSlug()` — German `Schmiede des Untergangs` → `schmiede-des-untergangs`
- `validateSlug()` — ASCII-safe enforcement
- `buildLocaleSlugMap()` — per-locale slug generator

### Canon glossary (fiction-rich extension)
- `defineGlossary()` — typed glossary with `preserve` / `translate` / `adapt` flags
- `lookupTerm()` — get correct rendering in target locale, world-scoped
- `scanPassage()` — find all glossary terms in a text
- `validateTranslation()` — flag glossary violations in translated content

### Book + Translation Studio helpers
- `bookSchemaForLocale()` — auto-fills `workTranslation` chain for translated books
- `generateTranslationTasks()` — produce open tasks for community/team to claim
- `getRoyaltySplit()` / `splitTranslatorShare()` — translator economy
- `validateBookRecord()` — pre-publish validation

## Locked architectural decisions

See `planning-with-files/PLAN_I18N_FOUNDATION_2026-05-02.md` and `PLAN_MULTILINGUAL_ARCANEAN_EXTENSIONS_2026-05-03.md` for rationale.

1. **Path-based** (`arcanea.ai/de/...`), never subdomain or ccTLD
2. **`localePrefix: 'as-needed'`** — default locale drops its prefix
3. **Translated path segments** (`/library` → `/bibliothek`)
4. **Per-locale content slugs**, ASCII-safe
5. **JSON-LD with `inLanguage` + `workTranslation` + `arcanea:aiInvolvement`** provenance
6. **hreflang + sitemap-per-locale + per-locale `/llms.txt`** as AEO baseline
7. **Always-visible language switcher**, never silent geo-redirect; respect `NEXT_LOCALE` cookie
8. **Canon glossary with preserve/translate/adapt flags** for fiction sites

## Usage

### Basic site (FrankX, marketing pages)

```ts
// i18n/routing.ts
import { defineLocaleConfig } from '@starlight/multilingual/routing';

export const routing = defineLocaleConfig({
  domain: 'https://www.frankx.ai',
  locales: ['en', 'de'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/blog': { en: '/blog', de: '/blog' }, // can stay same word in some cases
    '/about': { en: '/about', de: '/ueber' },
  },
});
```

### Fiction site (Arcanea) — full glossary + book schema

```ts
// i18n/glossary.ts
import { defineGlossary, SAMPLE_ARCANEAN_GLOSSARY_ENTRIES } from '@starlight/multilingual';
export const glossary = defineGlossary({
  defaultLocale: 'en',
  entries: [...SAMPLE_ARCANEAN_GLOSSARY_ENTRIES, /* more from book/ canon */],
});

// app/[locale]/library/[slug]/page.tsx
import { bookSchemaForLocale, scanPassage } from '@starlight/multilingual';
import { routing } from '@/i18n/routing';
import { glossary } from '@/i18n/glossary';

export default async function BookPage({ params }) {
  const { locale, slug } = await params;
  const book = await getBook(slug, locale);
  const schema = bookSchemaForLocale({
    config: routing,
    book,
    locale,
    bookRoutePath: '/library/[slug]',
    authors: book.authors,
    aiInvolvement: book.aiInvolvement,
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

### Middleware (Next.js)

```ts
// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { detectLocale, shouldRedirectToLocale } from '@starlight/multilingual/middleware';
import { routing } from '@/i18n/routing';

export async function middleware(request: NextRequest) {
  const locale = detectLocale(request, routing);
  const redirect = shouldRedirectToLocale(request, routing, locale);
  if (redirect) return NextResponse.redirect(redirect, 308);
  return NextResponse.next();
}
```

## Cross-property reuse

Once integrated in `apps/web`, this package is the multilingual foundation for any Frank Next.js property: `frankx.ai`, `arcanea.ai`, music sites, future creator platforms. Same config shape, same SEO/AEO output. Per-property differences live in:
- The `pathnames` map (which routes are localized to what segments)
- The `messages/*.json` files (UI strings)
- The `glossary.ts` (canon terms — empty for non-fiction sites)

## Phase status

- **Phase 1 — DONE** ✅ Foundation: types, routing, middleware helpers, SEO/AEO, schema, slugs
- **Phase 1.5 — DONE** ✅ Glossary + book + translator economy + Starlight namespace rename
- **Phase 2 — ready to execute** ⏳ apps/web integration (3 sample routes EN+DE) — spec at `planning-with-files/PLAN_MULTILINGUAL_PHASE2_APPS_WEB_2026-05-03.md`
- **Phase 3** ⏳ Full route migration, Library OS locale-awareness
- **Phase 4** ⏳ Translation Studio: Supabase migrations, editor UI, per-locale Guardians, Tolgee evaluation
- **Phase 5** ⏳ Cross-property reuse (frankx.ai, music sites)

## Skill

A Claude Code skill at `~/.claude/skills/multilingual/SKILL.md` documents how to apply this pattern to any Next.js site, audit AEO/SEO compliance, run Translation Studio workflow, and manage canon glossary.
