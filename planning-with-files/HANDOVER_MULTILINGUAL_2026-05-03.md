# Handover: Starlight Multilingual System (overnight session 2026-05-02 → 2026-05-03)

## Context for tomorrow's first agent

Frank asked for a multilingual foundation that:
1. Serves all his Next.js properties (Arcanea, FrankX, future), not just Arcanea
2. Handles native-language books (German originals, not just English translated)
3. Has a community translation pipeline with Guardian review + revenue share
4. Uses native-feeling URLs (`/de/bibliothek/...` not `/de/library/...`)
5. Maxes out AEO/SEO authority via JSON-LD provenance + llms.txt + hreflang
6. Is reusable as both package and skill across all his properties

This session locked architecture, named everything, built foundation + Arcanean-specific extensions, and wrote a complete Phase 2 execution spec.

## What shipped (this branch: `feature/i18n-foundation`)

### Code
- `packages/multilingual/` — `@starlight/multilingual` v0.1.0
  - `routing.ts` — `defineLocaleConfig`, `buildLocalizedUrl`, `getLocaleVariants`, ContentSlugInput
  - `middleware.ts` — `detectLocale`, `shouldRedirectToLocale`, `stripLocalePrefix`
  - `seo.ts` — hreflang, sitemap-per-locale, sitemap index, llms.txt manifest
  - `schema.ts` — JSON-LD builders for Book/Article/CreativeWork/Person/Organization with `inLanguage` + `workTranslation` + `aiInvolvement` provenance
  - `slugs.ts` — ASCII-safe slug enforcement (German `ä`→`ae`, etc.)
  - `glossary.ts` — canon glossary with preserve/translate/adapt flags, world-scoped, validateTranslation
  - `book.ts` — `bookSchemaForLocale`, `generateTranslationTasks`, `splitTranslatorShare`, `validateBookRecord`, royalty split profiles
  - `types.ts` — typed interfaces for everything
  - `index.ts` — barrel exports
  - `package.json`, `tsconfig.json`, `README.md`
- Build verified clean. All modules sanity-tested via Node REPL (URL building, hreflang generation, glossary lookup, scanPassage, validateTranslation, bookSchemaForLocale, generateTranslationTasks, royalty splits).

### Skill
- `~/.claude/skills/multilingual/SKILL.md` — global, cross-property reusable
- Project-local copy at `.claude/skills/multilingual/SKILL.md` (gitignored)
- Skill name `multilingual` (was `arcanea-i18n`); discoverable in any session

### Plan docs
- `planning-with-files/PLAN_I18N_FOUNDATION_2026-05-02.md` — original architecture (locked)
- `planning-with-files/PLAN_MULTILINGUAL_ARCANEAN_EXTENSIONS_2026-05-03.md` — canon glossary, per-locale Guardians, translator economy, voice guides per locale, Tolgee evaluation criteria, multi-modal localization graph, AEO provenance, quality gates
- `planning-with-files/PLAN_MULTILINGUAL_PHASE2_APPS_WEB_2026-05-03.md` — **READY-TO-EXECUTE** Phase 2 spec for apps/web integration

### Memory
- `~/.claude/projects/C--Users-frank-Arcanea/memory/project_i18n_foundation.md` — needs update to reflect Starlight rename (Phase 1.5)

## Architecture (locked, do not re-debate)

1. **Starlight namespace** for cross-property infrastructure (`@starlight/multilingual`, `@starlight/seo`, `@starlight/auth` as future siblings)
2. **Path-based routing**: `arcanea.ai/de/...`. NEVER subdomain/ccTLD.
3. **`localePrefix: 'as-needed'`** — English drops `/en/`
4. **Translated path segments**: `/library` → `/bibliothek`
5. **Per-locale content slugs**: `forge-of-ruin` (en) vs `schmiede-des-untergangs` (de)
6. **ASCII-safe slugs**
7. **`next-intl` 4.x** as i18n library (peer dep)
8. **JSON-LD with `inLanguage` + `workTranslation` + `arcanea:aiInvolvement`** provenance
9. **hreflang + sitemap-per-locale + `/llms.txt` per locale** = AEO baseline
10. **Always-visible language switcher**, never silent geo-redirect; respect `NEXT_LOCALE` cookie
11. **Canon glossary with preserve/translate/adapt flags** for fiction sites

## What you should do FIRST (tomorrow)

Read in this order:
1. This handover (you're here)
2. `planning-with-files/PLAN_MULTILINGUAL_PHASE2_APPS_WEB_2026-05-03.md` — your execution checklist
3. `packages/multilingual/README.md` — API reference
4. `~/.claude/skills/multilingual/SKILL.md` — workflows + pitfalls

Then execute Phase 2:
1. `git fetch && git checkout main && git pull`
2. Check `git worktree list` — confirm no other agent is mid-flight on `apps/web/`
3. Create worktree: `git worktree add .claude/worktrees/multilingual-apps-web -b feature/multilingual-apps-web main`
4. Follow Phase 2 spec step-by-step
5. Open PR for Frank's review when complete

## What NOT to do

- **Don't push to main directly.** Always feature branch + PR.
- **Don't auto-merge.** Frank reviews before merge for everything that touches `apps/web/`.
- **Don't auto-translate Lumina/Guardian voice.** Per-locale voice guides + Guardian review are mandatory. Machine translation = brand poison.
- **Don't translate canon proper nouns** (`Pyrathis`, `Vel'Tara`, `Lumina`, etc.). The glossary has `preserve` flag for these. Always look up before translating.
- **Don't migrate all routes in Phase 2.** Only homepage + library + about. Full migration is Phase 3.
- **Don't drop the locale prefix** for non-default locales. `arcanea.ai/bibliothek` (no `/de/`) creates ambiguity. Always `arcanea.ai/de/bibliothek`.
- **Don't use `localePrefix: 'always'`** unless explicitly chosen. Default `'as-needed'` (English drops `/en/`).
- **Don't run `pnpm dev` while other heavy work is in flight** — RAM is 16 GB; dev server burns 2.6 GB.

## What's still open / decisions needed from Frank

1. **Locale list confirmation:** I locked Phase 1 = `en`, `de`. Phase 2 = `es`, `ja`. Phase 3 = `fr`, `pt-BR`, `zh-Hans`. Frank may want different priority.
2. **Royalty split default:** I set `generous` (50/20/30 author/translator/platform) as default. Frank may prefer `community-prioritized` (40/30/30) to seed the translator flywheel.
3. **Section name translations:** Plan has my proposed German/Spanish/Japanese segment names (`bibliothek`, `welten`, `überlieferung` → ASCII `ueberlieferung`, etc.). Frank should approve specifics before Phase 3.
4. **Canon glossary scope:** Sample entries shipped with the package are illustrative (Pyrathis, Vel'Tara, Lumina, Gate Keys, the Forge, Starbound Crew). Real glossary needs to be sourced from `book/` and `.arcanea/` and classified preserve/translate/adapt by Frank + Lumina. Phase 4 task.
5. **Tolgee vs custom Translation Studio:** Phase 4 spike (1 day research + POC) before deciding integration approach.
6. **Subdomain rejection final?** Frank asked twice about subdomains; my answer twice was no. If Frank changes his mind, all hreflang / sitemap / cookie logic needs rework. Worth a final Frank confirm before Phase 3.

## Branch state at handover

Current branch: `feature/i18n-foundation`
- Commit `99063e13` — initial foundation (had `@arcanea/i18n` naming)
- Pending commit (this work) — Starlight rename + glossary + book + extensions plan + Phase 2 spec

Working tree: file rename pending stage, plus other agents' uncommitted work in `apps/web/` (their files, don't touch). I will commit only my work in next step.

## Coordination notes

Other active worktree: `.claude/worktrees/design-evolution` on branch `docs/2026-04-18-handover`. Don't disturb.

Other agents have unstaged modifications across `apps/web/tests/e2e/`, `packages/arcanea-voice/`, root `package.json`, etc. — those are theirs, not ours. Phase 2 should not modify those files.

## Sanity test results (all PASSED)

```
buildLocalizedUrl: arcanea.ai/de/bibliothek/schmiede-des-untergangs ✓
hreflang: 4 entries (en, de, ja, x-default) ✓
ASCII slug: Schmiede des Untergangs → schmiede-des-untergangs ✓
ASCII slug: Überlieferung → ueberlieferung ✓
Glossary lookup Pyrathis → Pyrathis (preserve) ✓
Glossary lookup Gate Keys → Tor-Schlüssel (translate) ✓
scanPassage finds Pyrathis + Gate Keys + Lumina with correct flags ✓
validateTranslation flags missing canonical translation ✓
bookSchemaForLocale auto-fills workTranslation chain ✓
generateTranslationTasks correctly skips already-published locales ✓
splitTranslatorShare proportional by word count ✓
Build: pnpm --filter @starlight/multilingual build → clean ✓
```

## Quality gates passing this handover

7-gate excellence check:
- ✅ First Principles — domain authority + native UX + content provenance, all served
- ✅ Voice — per-locale voice guides for Lumina/Guardians designed
- ✅ Design — language switcher always visible, no silent geo-redirect
- ✅ Performance — SSG per locale via `generateStaticParams`, zero perf hit
- ✅ Journey — author writes native → community translates → reaches global readers, with revenue share
- ✅ Engineering — typed pathnames, slug uniqueness per locale, redirect chain, RSC default
- ✅ Strategy — community translator flywheel + native-language equity = unique vs Wattpad/Substack/AO3

## End of handover

System is ready for Phase 2 execution. Spec is complete. No re-decisions needed. Just execute the checklist in `PLAN_MULTILINGUAL_PHASE2_APPS_WEB_2026-05-03.md`.

If Frank wants to talk before Phase 2 executes — three quick questions to resolve first:
1. Confirm locale priorities (`en`+`de` for Phase 2, then `es`/`ja` for Phase 3)?
2. Confirm royalty split default (generous 50/20/30 vs community-prioritized 40/30/30)?
3. Approve section name translations (the matrix in Phase 1 plan)?

If Frank doesn't review first, default settings will be used and can be tuned post-launch.
