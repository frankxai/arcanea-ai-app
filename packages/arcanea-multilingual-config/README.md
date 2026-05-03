# @arcanea/multilingual-config

Arcanea property preset for `@starlight/multilingual`. Bundles the Arcanean canon glossary, section pathname matrix, Lumina + Guardian voice guides, Guardian roster mapping, and royalty defaults so any Arcanean Next.js property gets fully-configured multilingual support in one line.

## What this preset is (and isn't)

- **It is** a thin (~600 line) configuration package layered on top of `@starlight/multilingual` (the foundation, ~1,300 lines).
- **It is not** a fork or "edition" of the foundation. The foundation does the work; this package supplies opinionated Arcanean defaults.

This is the right architecture for the same reason React doesn't have "React Edition for Next.js" — one base, many configurations. See `planning-with-files/PLAN_I18N_FOUNDATION_2026-05-02.md` for the rationale.

## Usage

### One-line setup (most properties)

```ts
// apps/web/i18n/routing.ts
import { createArcaneanConfig } from '@arcanea/multilingual-config';

export const routing = createArcaneanConfig({
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.arcanea.ai',
});
```

That's it. You now have:
- Phase 1 locale list (`en`, `de`)
- Full pathname matrix translated to German + Spanish + Japanese (active for ja/es when locale list expands)
- `localePrefix: 'as-needed'` (English drops `/en/`)
- ASCII-safe slugs throughout

### Sister property with extra routes

```ts
import { createArcaneanConfig } from '@arcanea/multilingual-config';

export const routing = createArcaneanConfig({
  domain: 'https://stories.arcanea.ai',
  extraPathnames: {
    '/stories/[slug]': { en: '/stories/[slug]', de: '/geschichten/[slug]' },
  },
});
```

### Phase 2 launch — activate Spanish + Japanese

```ts
import { createArcaneanConfig, ARCANEAN_LOCALES_PHASE_2 } from '@arcanea/multilingual-config';

export const routing = createArcaneanConfig({
  domain: 'https://www.arcanea.ai',
  locales: ARCANEAN_LOCALES_PHASE_2, // ['en', 'de', 'es', 'ja']
});
```

### Canon glossary in Translation Studio

```ts
import { arcaneanGlossary } from '@arcanea/multilingual-config/glossary';
import { scanPassage, validateTranslation } from '@starlight/multilingual';

const hits = scanPassage(arcaneanGlossary, chapterText, 'de', 'pyrathis');
const violations = validateTranslation(arcaneanGlossary, sourceText, draftText, 'en', 'de');
```

### Voice guides for Translation Studio

```ts
import { getVoiceGuide } from '@arcanea/multilingual-config/voices';

const guide = getVoiceGuide('Lumina', 'de');
// → { register, tone, sentenceLength, avoid, prefer, samplePassages, canonAnchors }
```

### Guardian review chain per locale

```ts
import { buildReviewChain } from '@arcanea/multilingual-config/guardians';

const chain = buildReviewChain('de');
// → [{ role: 'voiceAlchemist', agentId: null, required: true }, ...]
// agentId === null means that locale variant doesn't exist yet — fall back to human review
```

## What's bundled

### Locales

- **Phase 1** (active default): `en`, `de`
- **Phase 2** (next): adds `es`, `ja`
- **Phase 3** (later): adds `fr`, `pt-BR`, `zh-Hans`

### Pathname matrix

| English | German | Spanish | Japanese |
|---|---|---|---|
| `/library` | `/bibliothek` | `/biblioteca` | `/toshokan` |
| `/worlds` | `/welten` | `/mundos` | `/sekai` |
| `/lore` | `/ueberlieferung` | `/mitologia` | `/denshou` |
| `/factions` | `/fraktionen` | `/facciones` | `/habatsu` |
| `/showcase` | `/schaufenster` | `/escaparate` | `/tenji` |
| `/pricing` | `/preise` | `/precios` | `/ryokin` |
| `/founding-circle` | `/gruenderkreis` | `/circulo-fundador` | `/sourituskai` |
| `/about` | `/ueber` | `/acerca` | `/gaiyou` |
| `/docs`, `/cli`, `/mcp`, `/sdk`, `/api`, `/agents`, `/skills`, `/oss` | (en-only) | (en-only) | (en-only) |

ASCII-safe throughout (no `ä/ö/ü` in URLs).

### Canon glossary (initial set, expand as needed)

20+ entries covering:
- World names: Pyrathis, Vel'Tara, Cosmara
- AI personas: Lumina, Stellaris, Shinkami
- Faction names: Starlight Corps, Void Ascendant, Starbound Crew
- Artifact categories: Gate Keys, Gate Crystal
- Concepts: Ten Gates, Apprentice, Luminor
- Place metaphors: the Forge
- Product names: Open Library, Author Studio, Translation Studio
- Guardian roles: Voice Alchemist, Sensitivity Reader

Each entry has `preserve` / `translate` / `adapt` flag and per-locale renderings.

### Voice guides

- `LUMINA_VOICE_EN` — base English voice
- `LUMINA_VOICE_DE` — German variant with sample passages, register notes, canon anchors

Phase 4 expansion: per-locale Voice Alchemist Guardians, additional Guardian variants.

### Guardian roster

Maps each Guardian role × locale → agent ID, with null marking "not yet built." Continuity Guardian and Research Librarian are language-agnostic. Voice Alchemist + Sensitivity Reader + Line Editor are Phase 4 work for non-English locales.

### Royalty defaults

Default: `'generous'` (50% author / 20% translator / 30% platform per locale revenue).

## Phase status

- **Phase 1** ✅ Locales (en+de), pathname matrix, canon glossary baseline, Lumina-DE voice guide, Guardian roster scaffold, royalty defaults, preset factory
- **Phase 2** Activate `es`, `ja` — add per-locale glossary entries, build Lumina-JA + Lumina-ES voice guides
- **Phase 4** Build per-locale Voice Alchemist + Sensitivity Reader + Line Editor Guardians

## Tests

`pnpm --filter @arcanea/multilingual-config test` — 19 tests covering all subsystems.

## Cross-property reuse

Use this preset for:
- `arcanea.ai` (the flagship)
- Future Arcanea sister properties (stories.arcanea.ai, library.arcanea.ai, etc.)
- Any fiction-rich Next.js site that uses Arcanean canon

For non-Arcanean properties (frankx.ai, music sites), build a property-specific preset (`@frankx/multilingual-config`) — same pattern, different defaults. The foundation `@starlight/multilingual` is shared across all of them.
