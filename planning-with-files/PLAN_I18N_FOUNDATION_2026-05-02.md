# Plan: Starlight Multilingual Foundation + Translation Studio

**Date:** 2026-05-02 (renamed 2026-05-03)
**Branch:** `feature/i18n-foundation` → next PRs on `feature/multilingual-*`
**Package:** `@starlight/multilingual` (was `@arcanea/i18n`)
**Skill:** `multilingual` (was `arcanea-i18n`)
**Owner:** Frank + Lumina
**Status:** Architecture locked, Phase 1 + 1.5 in progress

## Naming rationale

- **Starlight** = the foundation/standards layer beneath all Frank properties (memory: SIS, Architect, Vault, Orchestrator already live here). Cross-property infrastructure.
- **Arcanea** = a creative-platform product built on Starlight. Has Arcanea-specific extensions (canon glossary, Lumina/Guardian voices per locale, book translation economy).
- **FrankX** = personal brand product built on Starlight. Simpler multilingual needs.

`@starlight/multilingual` is the right namespace because this system is meant for *every* Next.js property Frank operates, not just Arcanea. The convention extends: future foundation packages live as `@starlight/seo`, `@starlight/auth`, `@starlight/checkout`, etc.

## North Star

Arcanea is a multi-domain creator platform (books, worlds, lore, tools, community, NFTs) with 17 Library collections, an Open Library publishing system (3-tier with Guardian ratings), and a growing community. To serve global creators and readers we need:

1. **Native multilingual experience** — German URLs feel German, Japanese URLs feel Japanese, not just translated chrome on English routing.
2. **Native multilingual content** — German-original books exist on equal footing with English-original books. English is not privileged as the "real" version.
3. **Community translation pipeline** — any creator can write in their native language; the Arcanean Publishing House (Guardians + paid translators + community contributors) translates and publishes across locales with revenue share.
4. **AEO + SEO authority** — one canonical domain, full hreflang coverage, JSON-LD per locale, llms.txt per locale, so ChatGPT/Perplexity/Claude/Gemini cite Arcanea as the authoritative source for our worlds in every language.
5. **Reusable across all Frank properties** — any Next.js site Frank operates can adopt this in one config call.

## Architecture (Locked)

### URL Strategy: path-based + translated segments + localized slugs

```
arcanea.ai/library/forge-of-ruin                       (English, default, no prefix)
arcanea.ai/de/bibliothek/schmiede-des-untergangs       (German)
arcanea.ai/es/biblioteca/forja-de-la-ruina             (Spanish)
arcanea.ai/ja/toshokan/horobi-no-tankan                (Japanese)
```

**Three layers, each translated:**
1. Locale prefix (`/de/`, `/es/`, `/ja/`) — `localePrefix: 'as-needed'` so default English drops `/en/`
2. Path segment (`/library` → `/bibliothek`) — declared in routing config
3. Content slug (`/forge-of-ruin` → `/schmiede-des-untergangs`) — per-content per-locale registry

### Why not subdomains or ccTLDs?

| Option | AEO authority | SEO | Ops cost | Verdict |
|---|---|---|---|---|
| `arcanea.ai/de/...` (paths) | One entity, consolidated | Full hreflang | Single Vercel project | **Winner** |
| `de.arcanea.ai/...` | Fragmented | Splits authority | Wildcard cookies, more DNS | Lose |
| `arcanea.de/...` (ccTLD) | Many entities, hard for LLMs to connect | Strongest local SEO if country-only brand | Separate Vercel project per ccTLD | Lose for global brand |

### Section locale availability matrix (proposal)

| Section | Path-en | Path-de | Path-es | Path-ja | Notes |
|---|---|---|---|---|---|
| Library | library | bibliothek | biblioteca | toshokan | Books carry their own per-book locale list |
| Worlds | worlds | welten | mundos | sekai | Top tier creative content |
| Lore | lore | ueberlieferung | mitologia | denshou | ASCII-safe slugs |
| Factions | factions | fraktionen | facciones | habatsu | |
| Pricing | pricing | preise | precios | ryokin | Conversion-critical |
| Founding Circle | founding-circle | gruenderkreis | circulo-fundador | sourituskai | |
| Showcase | showcase | schaufenster | escaparate | tenji | |
| About | about | ueber | acerca | gaiyou | |
| Docs / CLI / MCP | docs / cli / mcp | (en-only) | (en-only) | (en-only) | Dev audience reads English |
| Blog / Changelog | blog / changelog | (en+de phase 1) | (phase 2) | (phase 2) | |

**Phase 1 launch locales:** `en` (default), `de` (Frank's home market + first native books)
**Phase 2:** `es`, `ja`
**Phase 3:** `fr`, `pt-BR`, `zh-Hans` if data supports

### AEO Foundation

- **JSON-LD per page**, locale-aware:
  - `Organization` (Arcanea) in root layout
  - `Book` on every book page with `inLanguage`, `author`, `translator`, `workTranslation` linking original
  - `Article` for blog/lore
  - `Person` for Lumina, Frank, each Guardian (treat AI personas as Person for entity clarity)
  - `CreativeWork` for worlds, factions, NFT collections
- **Sitemap-per-locale** referenced from `/sitemap.xml` index, with full hreflang siblings
- **`/llms.txt` and `/llms-full.txt` per locale** — `/llms.txt`, `/de/llms.txt`, `/ja/llms.txt`, etc. Curated map of most citable pages.
- **Provenance metadata** on every page: `dateCreated`, `dateModified`, `inLanguage`, `translationOfWork`, `aiInvolvement` (transparency for AEO trust)
- **hreflang cluster** in `<head>` for every multilingual page

### Translation Studio (the unique invention)

The differentiator. Lives inside Author Studio.

**Three actor types:**
1. **Original author** — writes in their native language (English, German, etc.). Marks `originalLanguage` on the book.
2. **Translator** — claims a translation task, works in side-by-side editor with glossary + voice guide for that book/world.
3. **Reviewer** — Guardian agent (per-language Voice Alchemist + Sensitivity Reader) + human editor.

**Three workflows:**

#### A. Frank/Lumina writes English → translate to N languages
1. Book registered in Author Studio with `originalLanguage: 'en'`
2. Translation tasks auto-created per target locale (`pending`)
3. Routes to: human translator (paid) → community contributor (open) → AI+review (cheap fallback)
4. Translator opens Translation Studio: side-by-side editor with original + draft, glossary lookup, voice guide
5. Guardian review per locale (Voice Alchemist DE, Line Editor DE, Sensitivity Reader DE)
6. Translator approval → publish to Open Library with `inLanguage: 'de'`, `workTranslation` linking original
7. Translator credited as `translator` in JSON-LD; revenue share if paid book

#### B. Community member writes German → translate outward
1. They open Author Studio in their native locale (German UI)
2. Book registered with `originalLanguage: 'de'`
3. Same translation flow, but English becomes a *translation*, not the privileged original
4. AEO: JSON-LD declares German as the source language; English page links via `workTranslation` back to German

#### C. Community translator picks up a book
1. Library shows "Translation Open" filter — books seeking translators in given locale pairs
2. Community member claims a chapter or whole book (lock-token to prevent collisions)
3. Same Translation Studio editor
4. Same Guardian review
5. Revenue share: translator gets X% of Open Library royalties for that locale's sales (configurable per book)

**Data model (sketch):**

```typescript
// supabase tables
translation_tasks {
  id uuid pk
  book_id uuid fk books
  source_locale text
  target_locale text
  scope: 'chapter' | 'whole_book'
  chapter_id uuid? fk book_chapters
  status: 'open' | 'claimed' | 'in_review' | 'approved' | 'published' | 'rejected'
  assignee_id uuid? fk profiles
  claimed_at timestamptz?
  due_at timestamptz?
  reward_share numeric  // 0..1 portion of locale royalties
  created_at, updated_at
}

translations {
  id uuid pk
  source_id uuid  // chapter_id or book_id
  source_kind: 'chapter' | 'book_metadata'
  target_locale text
  translator_id uuid fk profiles
  draft jsonb
  status: 'draft' | 'review' | 'approved'
  reviewed_by uuid? fk profiles
  reviewed_at timestamptz?
  guardian_review jsonb  // structured Guardian feedback
  created_at, updated_at
}

book_locales {
  book_id uuid fk books
  locale text
  slug text  // e.g. 'schmiede-des-untergangs'
  title text
  status: 'planned' | 'in_progress' | 'published'
  primary key (book_id, locale)
  unique (locale, slug)  // slug uniqueness per locale
}
```

**Translation Studio UI (Phase 2):**
- Side-by-side editor (Monaco or Lexical-based)
- Inline glossary lookup (per-world canonical terms — Pyrathis, Vel'Tara, Gate Keys must translate consistently)
- Voice consistency check (Guardian agent reads draft, flags voice drift)
- Comment threads on segments
- Diff viewer for revisions
- Submit-for-review flow

## Components

### 1. `@arcanea/i18n` package (this PR)

Reusable runtime + build helpers:
- `defineLocaleConfig()` — config factory
- `createI18nMiddleware()` — wraps next-intl with our defaults
- `generateHreflang()`, `generateLocaleSitemap()`, `generateLLMsManifest()` — SEO/AEO builders
- `createBookSchema()`, `createCreativeWorkSchema()`, `createPersonSchema()` — typed JSON-LD
- Types: `LocaleConfig`, `LocalizedSlug`, `BookLocale`, `TranslationStatus`

Exports: `index.ts` (main), `seo.ts`, `schema.ts`, `types.ts`, `middleware.ts`, `routing.ts`.

### 2. `/arcanea-i18n` skill (this PR)

`.claude/skills/arcanea-i18n/SKILL.md` — instructions for any agent to apply this pattern to any Next.js site:
- Detect existing i18n state
- Audit AEO/SEO compliance
- Add a new locale (checklist)
- Add a new section + translate slug
- Translate a book through Translation Studio flow
- Verify hreflang + JSON-LD + sitemap

### 3. `apps/web` integration (Phase 2 PR — not this one)

Invasive route migration, deferred to a coordinated PR:
- Move `app/page.tsx`, `app/library/...`, etc. under `app/[locale]/...`
- Update middleware to chain `createI18nMiddleware()` + existing `updateSession`
- Add `messages/{en,de}.json` for UI strings
- Refactor `lib/content/` to be locale-aware (book registry per locale)
- Migrate library + 2 sample sections (worlds, about) as proof
- Generate hreflang sitemap, JSON-LD on book pages, `/llms.txt`

### 4. Translation Studio (Phase 3 PR)

- Supabase migrations for `translation_tasks`, `translations`, `book_locales`
- Author Studio extension: translation task creation
- Translation editor UI
- Guardian agents per locale (extend existing Voice Alchemist, Line Editor, Sensitivity Reader)
- Revenue share rules in publishing pipeline

## Excellence Pass (7-Gate Quality Check)

1. **First Principles** — Domain authority + native UX + content provenance. Path-based + translated slugs serves all three. No quick-monetization shortcut.
2. **Voice** — Lumina's German voice ≠ Japanese voice. Per-locale voice guides feed Guardian review, prevent flat machine-translated voice.
3. **Design** — Always-visible language switcher in header, never silent geo-redirect. Cookie respects user choice.
4. **Performance** — SSG per locale via `generateStaticParams`, zero perf hit. JSON-LD inlined in HTML.
5. **Journey** — Reader → discovers translation in own language → bonds with content. Writer → submits in native language → community translates outward → reaches global audience.
6. **Engineering** — Typed pathnames map, slug uniqueness per locale, redirect chain on slug change, SSG, RSC default.
7. **Strategy** — Community translators get credit + revenue = flywheel. Native-language books get equal canonical status = differentiation vs every other AI publishing platform that translates English first.

## Risks + Mitigations

| Risk | Mitigation |
|---|---|
| Other agents' worktrees touch `app/` and conflict with route migration | Phase 2 is its own PR with explicit coordination; foundation PR is additive only |
| Slug collision across locales | Enforce `unique(locale, slug)` in DB; CI check on `book_locales` migration |
| Machine-translated Lumina voice = brand poison | Tier 0 (native) and Tier 3 (book) require human review; AI translation only for Tier 4 (long tail) with disclaimer |
| Translation Studio scope explosion | Ship in 3 phases — task model first, editor UI second, glossary/voice-check third |
| AEO regressions if hreflang misconfigured | Add CI check that runs `lighthouse-i18n` audit on preview deploy |

## Phases + Definition of Done

### Phase 1 — Foundation (this PR, `feature/i18n-foundation`)
- [x] Plan doc (this file)
- [ ] `@arcanea/i18n` package with types, config builder, SEO/schema helpers
- [ ] `/arcanea-i18n` skill with audit + add-locale checklists
- [ ] `next-intl` peer-dep declared (not yet installed in apps/web)
- [ ] Package builds clean with `pnpm --filter @arcanea/i18n build`
- [ ] README.md showing usage

**DoD:** Package compiles, skill discoverable, no apps/web changes yet. Mergeable into main without route impact.

### Phase 2 — apps/web integration (next PR, coordinated)
- [ ] Install next-intl in apps/web
- [ ] Create `apps/web/i18n/routing.ts` using `@arcanea/i18n.defineLocaleConfig`
- [ ] Move `app/page.tsx` and 2 sample routes (library, about) under `app/[locale]/...`
- [ ] Chain locale middleware with existing Supabase middleware
- [ ] Add `messages/en.json`, `messages/de.json` with UI strings
- [ ] hreflang sitemap, JSON-LD on book page, `/llms.txt` + `/de/llms.txt`
- [ ] Verify on preview deploy (Lighthouse i18n + manual hreflang check)

**DoD:** Two routes live in EN+DE on preview, Lighthouse green, language switcher works, cookie respects choice.

### Phase 3 — Full route migration (next PR after Phase 2)
- [ ] All `app/` routes migrated under `[locale]`
- [ ] All sections in section-matrix translated (UI strings only)
- [ ] Locale-aware content registry refactor in `lib/content/`
- [ ] Per-locale sitemap, JSON-LD coverage 100% of public pages

### Phase 4 — Translation Studio (multi-PR)
- [ ] Supabase migrations
- [ ] Translation task creation in Author Studio
- [ ] Translation editor UI
- [ ] Guardian agents per locale
- [ ] Revenue share in publishing pipeline
- [ ] Open one community-translation flow live (e.g., Forge of Ruin EN→DE)

### Phase 5 — Cross-property reuse
- [ ] Publish `@arcanea/i18n` to npm (or keep workspace-private; decide based on OSS strategy)
- [ ] Document adoption playbook for other Frank properties
- [ ] Apply to second Frank property as proof

## Decision Log

- **2026-05-02** — Locked path-based + translated slugs (not subdomains, not ccTLDs)
- **2026-05-02** — Locked `localePrefix: 'as-needed'` (English drops `/en/`)
- **2026-05-02** — Locked Phase 1 locales: en, de
- **2026-05-02** — Locked next-intl 4.x as i18n library (App Router native, pathnames support)
- **2026-05-02** — Translation Studio scoped as Phase 4 (foundation must ship first)
- **2026-05-02** — Skill + package built together; repo extraction deferred until proven on apps/web
