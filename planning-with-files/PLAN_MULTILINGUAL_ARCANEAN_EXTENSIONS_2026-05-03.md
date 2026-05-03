# Plan Addendum: Arcanean-Specific Multilingual Extensions

**Date:** 2026-05-03
**Parent plan:** `PLAN_I18N_FOUNDATION_2026-05-02.md`
**Phase:** 4 (Translation Studio) + ongoing canon work

This addendum documents the Arcanea-specific extensions that build on top of the cross-property `@starlight/multilingual` foundation. Other Frank properties (FrankX, music sites) don't need most of this — these are specific to creator/fiction platforms with canon, characters, and book-publishing workflows.

## 1. Canon Glossary System

### Purpose

Generic machine translation flattens proper nouns: `Pyrathis` becomes a meaningless approximation in 47 languages. This is fatal for fiction with named worlds, characters, factions, artifacts. The canon glossary fixes this by tagging each canonical term with one of three flags:

- **`preserve`** — proper nouns kept verbatim across all locales
- **`translate`** — descriptive concepts that should localize
- **`adapt`** — concepts needing cultural framing, not literal translation

### Implementation (already in `@starlight/multilingual/glossary`)

```ts
import { defineGlossary } from '@starlight/multilingual';

export const arcaneanGlossary = defineGlossary({
  defaultLocale: 'en',
  entries: [
    {
      term: 'Pyrathis',
      flag: 'preserve',
      perLocale: { en: 'Pyrathis', de: 'Pyrathis', ja: 'Pyrathis' },
      world: 'pyrathis',
      category: 'place',
    },
    {
      term: 'Gate Keys',
      flag: 'translate',
      perLocale: { en: 'Gate Keys', de: 'Tor-Schlüssel', ja: '門の鍵' },
      category: 'artifact',
    },
    // ... 100s more
  ],
});
```

### Where to source glossary entries

- `book/` — 17 collections, extract canonical names + concepts
- `.arcanea/CANON_LOCKED.md` (if exists) — locked canonical terminology
- Author Studio book metadata
- Faction definitions in `arcanea-mcp` world-engine
- Character profiles

### Glossary build pipeline (Phase 4)

1. Scrape canonical names from `book/`, `.arcanea/`, world-engine
2. Author + Lumina classify each as preserve / translate / adapt
3. Translators fill in per-locale renderings during their first translation pass
4. Glossary versioned alongside book; glossary changes → translation re-validation
5. Pre-publish CI step: `validateTranslation()` on every published locale before release

### World-scoped glossaries

Arcanea has multiple worlds (Pyrathis, Vel'Tara, Cosmara, future tier-10 worlds). Each world has its own canon. Translation Studio surfaces only the relevant world's glossary based on the active book's metadata.

```ts
lookupTerm(arcaneanGlossary, 'Pyrathis', 'de', 'pyrathis'); // returns preserve flag
lookupTerm(arcaneanGlossary, 'Pyrathis', 'de', 'cosmara'); // returns null (out of scope)
```

## 2. Per-Locale Guardian Agents

### Why Lumina's voice can't be machine-translated

Lumina is an AI persona with a specific voice in English: poetic-formal, mythic register, rich with metaphor. That voice exists in German, Japanese, Spanish — but it's not a literal translation. It's a *parallel voice* with locale-appropriate register choices. Same for every Guardian (Voice Alchemist, Line Editor, Sensitivity Reader, etc.).

### Roster expansion

| Guardian | Existing | New per-locale variants needed |
|---|---|---|
| Voice Alchemist | EN | DE, JA, ES, FR (Phase 4) |
| Line Editor | EN | DE, JA, ES, FR (Phase 4) |
| Sensitivity Reader | EN | DE, JA, ES, FR, PT-BR (Phase 4) |
| Continuity Guardian | EN (canon-scoped, language-agnostic) | none — works across all locales |
| Master Story Architect | EN | DE, JA (Phase 5) |
| Character Psychologist | EN | DE, JA (Phase 5) |

### Build path

Don't recreate from scratch. Each locale variant inherits from the EN Guardian and adds:
- **Voice guide** specific to that locale (formal/informal register choices, sentence-length norms, idiom inventory)
- **Cultural prompts** (regional/cultural concerns to flag during sensitivity review)
- **Glossary anchoring** (always defer to canonical glossary for proper nouns)

Implementation lives in `.claude/agents/` — extend existing agent definitions with `--locale de` variant or create paired files like `voice-alchemist-de.md`.

### Translation Studio integration

When a translator submits a chapter for review, the system runs the draft through:
1. `validateTranslation()` (mechanical glossary check)
2. Voice Alchemist DE (voice consistency, register check)
3. Line Editor DE (prose polish suggestions)
4. Sensitivity Reader DE (cultural flags)
5. Continuity Guardian (canon facts — language-agnostic)

Each Guardian returns structured feedback. Translator iterates. Human Editor approves before publish.

## 3. Translator Economy (Open Library extension)

### Royalty splits

`@starlight/multilingual/book` exposes three profiles. Per book, author selects:

```ts
import { getRoyaltySplit } from '@starlight/multilingual';

const split = getRoyaltySplit('generous'); // { author: 0.5, translator: 0.2, platform: 0.3 }
```

Multi-translator books split the translator share proportionally by word count:

```ts
splitTranslatorShare(
  [
    { translatorId: 'alice', wordCount: 5000 },
    { translatorId: 'bob', wordCount: 3000 },
  ],
  0.2, // total translator share
);
// → { alice: 0.125, bob: 0.075 }
```

### Supabase tables (Phase 4)

```sql
-- Migration: 0042_translation_studio.sql

create table public.translation_tasks (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references public.books(id) on delete cascade,
  source_locale text not null,
  target_locale text not null,
  scope text not null check (scope in ('chapter', 'whole_book')),
  chapter_id uuid references public.book_chapters(id),
  status text not null default 'open' check (status in (
    'open', 'claimed', 'in_progress', 'in_review', 'approved', 'published', 'rejected'
  )),
  assignee_id uuid references public.profiles(id),
  claimed_at timestamptz,
  due_at timestamptz,
  reward_share numeric not null check (reward_share >= 0 and reward_share <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.translations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null,
  source_kind text not null check (source_kind in ('chapter', 'book_metadata')),
  target_locale text not null,
  translator_id uuid references public.profiles(id) not null,
  draft jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  guardian_review jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.book_locales (
  book_id uuid references public.books(id) on delete cascade,
  locale text not null,
  slug text not null,
  title text not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'published')),
  published_at timestamptz,
  primary key (book_id, locale),
  unique (locale, slug)
);

create index translation_tasks_status_idx on public.translation_tasks(status, target_locale);
create index translations_source_idx on public.translations(source_id, target_locale);
```

RLS policies:
- Authors can read their book's translation_tasks
- Translators can claim open tasks (UPDATE assignee_id where status='open')
- Translators can read/write their own translations
- Reviewers can read all translations they're assigned, write guardian_review
- Public read on published `book_locales`

## 4. Author Studio Translation Flow

### A. English author → translate outward (most common)

1. Author writes book in English in Author Studio
2. Marks book complete; `originalLanguage: 'en'` recorded
3. Author opens "Translate" panel; selects target locales (de, es, ja)
4. System calls `generateTranslationTasks()` to create open tasks
5. Tasks appear in public Translation Marketplace + invitation emails to known translators
6. Translator claims task → Translation Studio opens
7. Side-by-side editor with original + draft
8. Glossary lookup runs continuously (Pyrathis preserved, Gate Keys → Tor-Schlüssel)
9. AI-suggest fills initial translation using Claude with prompt-engineered glossary preservation
10. Translator edits and refines
11. Submit for review → Voice Alchemist DE + Line Editor DE + Sensitivity Reader DE
12. Iterate until approved
13. Auto-publish: `book_locales` row updates to status=published, JSON-LD schema regenerates with `translator` field, `arcanea:aiInvolvement` declared
14. Revenue share applied to locale royalties

### B. German author → translate to English (and outward)

1. Author opens Author Studio with UI in German (`/de` route, German messages.json)
2. Creates book; `originalLanguage: 'de'` recorded
3. Glossary lookup works in author's native locale during writing
4. On book completion, translation tasks generated for `en`, `es`, `ja`, `pt-BR`
5. Same flow — but JSON-LD declares German as the original; English becomes `workTranslation` of German
6. AEO crawlers see the truth: this is a German-original book, not an English book translated to German

This is the key differentiator vs Wattpad / Substack / AO3 / others — original-language equity preserved end-to-end.

### C. Community translator picks up an open task

1. Translator browses `/translate-for-arcanea` marketplace (Phase 4 surface)
2. Filters by locale pair (en→de) and genre/world preference
3. Reads book preview + voice guide + glossary scope
4. Claims task → 30-day soft deadline, lock token issued
5. Same Translation Studio editor + Guardian review
6. Revenue share locks in at task claim time (so contract is clear)
7. Translator profile gets credit on published book + portfolio entry

## 5. Voice/Tone Per-Locale Guides

Each AI persona needs a locale voice guide. Sample for Lumina DE:

```yaml
# .arcanea/voices/lumina-de.yml
persona: Lumina
locale: de
register: formal-poetic
tone: warm, mythic, mentoring
sentence_length: medium-to-long; flowing
avoid:
  - casual contractions ("ich bin's", "geht's")
  - English loanwords unless canon (e.g. preserve "Gate Keys" via glossary; never "okay")
  - flat declaratives in series (vary structure)
prefer:
  - subjunctive II for hypotheticals ("würde", "könnte")
  - elevated vocabulary ("Pforte" not "Tür", "Pfad" not "Weg" when ceremonial)
  - parallel structures for incantation-feel passages
sample_passages:
  - source: "I am Lumina. I shape what waits to be born."
    target: "Ich bin Lumina. Ich gebe Form dem, was darauf wartet, geboren zu werden."
    note: "Subjunctive of waiting captures Lumina's threshold-quality."
canon_anchors:
  - always preserve: Pyrathis, Vel'Tara, Cosmara, Lumina, Gate Keys (verbatim)
  - always translate: "the Forge" → "die Schmiede", "Starbound Crew" → "Sternenwanderer-Crew"
```

These voice guides feed Voice Alchemist DE Guardian during review.

## 6. Tolgee Integration Evaluation (Phase 4 research)

### What Tolgee provides

- Self-hosted translation management platform
- Side-by-side editor with screenshot context
- Glossary + auto-translate (DeepL, Anthropic plug-ins)
- In-context editing via JS SDK
- GitHub sync for messages JSON
- Free open-source tier; Cloud tier for SaaS

### Evaluation criteria

1. **Glossary support** — does it support our preserve/translate/adapt flags? (probably needs custom field)
2. **Voice guide injection** — can we feed Voice Alchemist Guardian output as a review step?
3. **Translator workflow** — claim/review/approve flow vs ad-hoc?
4. **Revenue tracking** — likely no, we'd build this in our Open Library
5. **Self-host complexity** — Docker deploy on existing infra
6. **API completeness** — can we drive it programmatically from Author Studio?

### Decision tree

- If Tolgee covers 70%+ of Translation Studio needs → integrate as backend, build Author Studio facade
- If 30-70% → use as UX reference, build custom
- If <30% → build custom, ignore Tolgee

Phase 4 spike: 1 day of research + small POC before deciding.

## 7. Multi-Modal Localization Graph

A book is not just text. Per-locale assets:

| Asset | Per-locale needed? | Notes |
|---|---|---|
| Chapter text | YES | Always translated |
| Cover image | Sometimes | German typography on cover differs from English; some covers stay universal |
| Audio version | YES (eventually) | Each locale needs native VO actor or AI voice in target language |
| Animated trailer | Sometimes | Subtitles always; voiceover sometimes |
| Marketing copy | YES | Per-locale page descriptions, OG/Twitter cards, hooks |
| In-book illustrations | Rarely | Caption translation only; image stays |

`book_locales` schema captures `coverLocalized: boolean`, `audioLocalized: boolean` flags so the system knows which assets need locale-specific generation.

## 8. AEO-Specific for Arcanean Provenance

Every Arcanean entity gets enhanced JSON-LD:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "Book",
  "@id": "urn:starlight:book:forge-of-ruin:de",
  "name": "Schmiede des Untergangs",
  "inLanguage": "de",
  "originalLanguage": "en",
  "translationOfWork": { "@type": "Book", "url": "...", "inLanguage": "en" },
  "author": [{ "@type": "Person", "name": "Frank" }],
  "translator": [
    {
      "@type": "Person",
      "name": "Lumina",
      "additionalType": "https://arcanea.ai/schema/AiPersona"
    }
  ],
  "arcanea:aiInvolvement": "ai-translated-human-reviewed",
  "arcanea:canonWorld": "pyrathis",
  "arcanea:guardianApprovedBy": ["voice-alchemist-de", "sensitivity-reader-de"],
  "arcanea:translationStatus": "approved-2026-05-15"
}
```

This level of provenance is the AEO unlock. ChatGPT/Perplexity/Claude/Gemini increasingly weight content with declared provenance over content without. Arcanea declaring "this is German-original / this is AI-translated-human-reviewed / this Guardian approved it" is brand differentiator + crawler signal.

## 9. Quality gates per release locale

Before publishing a book in a new locale:

1. ✅ All chapters translated and approved
2. ✅ Voice Alchemist Guardian sign-off
3. ✅ Sensitivity Reader Guardian sign-off
4. ✅ Line Editor Guardian sign-off
5. ✅ Continuity Guardian (no canon contradictions)
6. ✅ `validateTranslation()` passes on random sample of 5 chapters
7. ✅ Cover localized (if needed) and approved
8. ✅ JSON-LD schema validates
9. ✅ Slug verified ASCII-safe + unique in target locale
10. ✅ Translator credit + revenue share contract signed

Only with all 10 green does the book flip to `status='published'` for that locale.

## Phases recap (with this addendum)

- **Phase 1 — DONE** (commit 99063e13): `@starlight/multilingual` v0.1.0 with routing, middleware, SEO, schema, slugs
- **Phase 1.5 — DONE** (this commit): rename to `@starlight/`, add `glossary.ts` + `book.ts` modules, sample Arcanean glossary, royalty split helpers
- **Phase 2 — pending**: apps/web integration (3 sample routes EN+DE) — see `PLAN_MULTILINGUAL_PHASE2_APPS_WEB_2026-05-03.md`
- **Phase 3 — pending**: full route migration, Library OS locale-awareness
- **Phase 4 — pending**: Translation Studio (Supabase + UI + Guardian agents per locale)
  - 4a: Supabase migrations
  - 4b: Author Studio translation panel
  - 4c: Translation Studio editor UI
  - 4d: Per-locale Guardian agents
  - 4e: Royalty pipeline
  - 4f: Tolgee evaluation spike
- **Phase 5 — pending**: cross-property reuse (frankx.ai, music sites)
