/**
 * Arcanean section pathname matrix.
 *
 * For each public-facing section of an Arcanean site, declares the locale-
 * native URL segment. ASCII-safe in all locales (German umlauts → ae/oe/ue,
 * etc.) so URLs survive Twitter cards, email clients, copy-paste, and CMS
 * importers without corruption.
 *
 * Sections that should remain English-only (developer documentation, CLI
 * docs, MCP guides) are declared as plain strings so they have no localized
 * variants.
 *
 * To add a section: edit this file. The convention is:
 * - English path = section name
 * - German path = ASCII-transliterated translation
 * - Spanish/Japanese paths = ASCII-transliterated when full locales activate
 */

import type { PathnameMap } from '@starlight/multilingual';

export const ARCANEAN_PATHNAMES: PathnameMap = {
  '/': '/',

  // Library — books, the primary content
  '/library': {
    en: '/library',
    de: '/bibliothek',
    es: '/biblioteca',
    ja: '/toshokan',
    fr: '/bibliotheque',
    'pt-BR': '/biblioteca',
    'zh-Hans': '/tushuguan',
  },
  '/library/[slug]': {
    en: '/library/[slug]',
    de: '/bibliothek/[slug]',
    es: '/biblioteca/[slug]',
    ja: '/toshokan/[slug]',
    fr: '/bibliotheque/[slug]',
    'pt-BR': '/biblioteca/[slug]',
    'zh-Hans': '/tushuguan/[slug]',
  },

  // Worlds — the living-worlds explorer
  '/worlds': {
    en: '/worlds',
    de: '/welten',
    es: '/mundos',
    ja: '/sekai',
    fr: '/mondes',
    'pt-BR': '/mundos',
  },
  '/worlds/[slug]': {
    en: '/worlds/[slug]',
    de: '/welten/[slug]',
    es: '/mundos/[slug]',
    ja: '/sekai/[slug]',
    fr: '/mondes/[slug]',
    'pt-BR': '/mundos/[slug]',
  },

  // Lore — canonical lore index
  '/lore': {
    en: '/lore',
    de: '/ueberlieferung',
    es: '/mitologia',
    ja: '/denshou',
    fr: '/legende',
    'pt-BR': '/mitologia',
  },

  // Factions — Starlight Corps, Starbound Crews, Leagues
  '/factions': {
    en: '/factions',
    de: '/fraktionen',
    es: '/facciones',
    ja: '/habatsu',
    fr: '/factions',
    'pt-BR': '/faccoes',
  },

  // Showcase — content marketing
  '/showcase': {
    en: '/showcase',
    de: '/schaufenster',
    es: '/escaparate',
    ja: '/tenji',
    fr: '/vitrine',
    'pt-BR': '/vitrine',
  },

  // Pricing — conversion-critical
  '/pricing': {
    en: '/pricing',
    de: '/preise',
    es: '/precios',
    ja: '/ryokin',
    fr: '/tarifs',
    'pt-BR': '/precos',
    'zh-Hans': '/jiage',
  },

  // Founding Circle — premium tier
  '/founding-circle': {
    en: '/founding-circle',
    de: '/gruenderkreis',
    es: '/circulo-fundador',
    ja: '/sourituskai',
    fr: '/cercle-fondateur',
    'pt-BR': '/circulo-fundador',
  },

  // About — brand page
  '/about': {
    en: '/about',
    de: '/ueber',
    es: '/acerca',
    ja: '/gaiyou',
    fr: '/a-propos',
    'pt-BR': '/sobre',
  },

  // Blog — Phase 1 EN + DE only; expand as content scales
  '/blog': {
    en: '/blog',
    de: '/blog',
  },
  '/blog/[slug]': {
    en: '/blog/[slug]',
    de: '/blog/[slug]',
  },

  // Changelog
  '/changelog': {
    en: '/changelog',
    de: '/aenderungen',
  },

  // ── English-only sections (developer / technical content) ──

  '/docs': '/docs',
  '/docs/[...slug]': '/docs/[...slug]',
  '/cli': '/cli',
  '/mcp': '/mcp',
  '/sdk': '/sdk',
  '/api': '/api',
  '/agents': '/agents',
  '/skills': '/skills',
  '/oss': '/oss',
};

/**
 * Section availability matrix per locale. Used by sitemap generation to
 * decide which locale variants of a route to publish.
 *
 * Most sections serve all active locales; dev content is English-only.
 */
export const ARCANEAN_SECTION_LOCALES: Record<string, ReadonlyArray<string>> = {
  '/': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR', 'zh-Hans'],
  '/library': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR', 'zh-Hans'],
  '/library/[slug]': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR', 'zh-Hans'],
  '/worlds': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/worlds/[slug]': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/lore': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/factions': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/showcase': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/pricing': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR', 'zh-Hans'],
  '/founding-circle': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/about': ['en', 'de', 'es', 'ja', 'fr', 'pt-BR'],
  '/blog': ['en', 'de'],
  '/blog/[slug]': ['en', 'de'],
  '/changelog': ['en', 'de'],
  '/docs': ['en'],
  '/docs/[...slug]': ['en'],
  '/cli': ['en'],
  '/mcp': ['en'],
  '/sdk': ['en'],
  '/api': ['en'],
  '/agents': ['en'],
  '/skills': ['en'],
  '/oss': ['en'],
};
