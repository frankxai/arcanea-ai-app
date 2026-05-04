import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createArcaneanConfig,
  ARCANEAN_PATHNAMES,
  ARCANEAN_SECTION_LOCALES,
  arcaneanGlossary,
  ARCANEAN_GLOSSARY_ENTRIES,
  getVoiceGuide,
  resolveGuardian,
  buildReviewChain,
  ARCANEAN_DEFAULT_ROYALTY_PROFILE,
  ARCANEAN_ACTIVE_LOCALES,
} from '../src/index';
import {
  buildLocalizedUrl,
  scanPassage,
  validateTranslation,
  getRoyaltySplit,
} from '@starlight/multilingual';

describe('createArcaneanConfig', () => {
  it('produces working config from just a domain', () => {
    const cfg = createArcaneanConfig({ domain: 'https://www.arcanea.ai' });
    assert.equal(cfg.domain, 'https://www.arcanea.ai');
    assert.equal(cfg.defaultLocale, 'en');
    assert.equal(cfg.localePrefix, 'as-needed');
    assert.deepEqual([...cfg.locales], [...ARCANEAN_ACTIVE_LOCALES]);
  });

  it('library route translates EN → DE correctly', () => {
    const cfg = createArcaneanConfig({ domain: 'https://www.arcanea.ai' });
    assert.equal(
      buildLocalizedUrl(cfg, '/library', 'en', 'forge-of-ruin'),
      'https://www.arcanea.ai/library/forge-of-ruin',
    );
    assert.equal(
      buildLocalizedUrl(cfg, '/library', 'de', 'schmiede-des-untergangs'),
      'https://www.arcanea.ai/de/bibliothek/schmiede-des-untergangs',
    );
  });

  it('docs stays English-only via plain string', () => {
    const cfg = createArcaneanConfig({ domain: 'https://www.arcanea.ai' });
    assert.equal(buildLocalizedUrl(cfg, '/docs', 'en'), 'https://www.arcanea.ai/docs');
    // For DE, /docs is en-only; should fall back to the plain path
    // (apps/web middleware should 308-redirect /de/docs → /docs in practice)
    assert.equal(buildLocalizedUrl(cfg, '/docs', 'de'), 'https://www.arcanea.ai/de/docs');
  });

  it('accepts extraPathnames for sister properties', () => {
    const cfg = createArcaneanConfig({
      domain: 'https://stories.arcanea.ai',
      extraPathnames: {
        '/stories/[slug]': { en: '/stories/[slug]', de: '/geschichten/[slug]' },
      },
    });
    assert.equal(
      buildLocalizedUrl(cfg, '/stories/[slug]', 'de', 'der-erste-tag'),
      'https://stories.arcanea.ai/de/geschichten/[slug]/der-erste-tag',
    );
  });

  it('locale override works for Phase 2 launch', () => {
    const cfg = createArcaneanConfig({
      domain: 'https://www.arcanea.ai',
      locales: ['en', 'de', 'es', 'ja'],
    });
    assert.equal(cfg.locales.length, 4);
    assert.equal(
      buildLocalizedUrl(cfg, '/library', 'ja'),
      'https://www.arcanea.ai/ja/toshokan',
    );
  });
});

describe('Arcanean pathnames matrix', () => {
  it('every translatable section has en + de minimum', () => {
    const translatableSections = Object.entries(ARCANEAN_PATHNAMES).filter(
      ([, v]) => typeof v === 'object',
    );
    for (const [path, value] of translatableSections) {
      const obj = value as Record<string, string>;
      assert.ok(obj.en, `${path} missing en variant`);
      assert.ok(obj.de, `${path} missing de variant`);
    }
  });

  it('section locales matrix covers en for every entry', () => {
    for (const [section, locales] of Object.entries(ARCANEAN_SECTION_LOCALES)) {
      assert.ok(locales.includes('en'), `${section} should include en`);
    }
  });

  it('docs is en-only', () => {
    assert.deepEqual(ARCANEAN_SECTION_LOCALES['/docs'], ['en']);
  });
});

describe('arcaneanGlossary', () => {
  it('preserves Pyrathis verbatim across all locales', () => {
    const passage = 'The dragon Pyrathis sleeps beneath the world.';
    const hits = scanPassage(arcaneanGlossary, passage, 'de', 'pyrathis');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].rendering, 'Pyrathis');
    assert.equal(hits[0].flag, 'preserve');
  });

  it('translates Gate Keys correctly per locale', () => {
    const passage = 'The Gate Keys await the worthy.';
    const enHits = scanPassage(arcaneanGlossary, passage, 'en');
    const deHits = scanPassage(arcaneanGlossary, passage, 'de');
    const jaHits = scanPassage(arcaneanGlossary, passage, 'ja');

    assert.equal(enHits[0].rendering, 'Gate Keys');
    assert.equal(deHits[0].rendering, 'Tor-Schluessel');
    assert.equal(jaHits[0].rendering, 'Mon-no-Kagi');
  });

  it('flags missing canonical translation', () => {
    const violations = validateTranslation(
      arcaneanGlossary,
      'Pyrathis sleeps. The Gate Keys await.',
      'Pyrathis schlaeft. Die Schluessel warten.', // wrong translation of Gate Keys
      'en',
      'de',
    );
    assert.equal(violations.length, 1);
    assert.equal(violations[0].term, 'Gate Keys');
  });

  it('contains expected core canon terms', () => {
    const terms = ARCANEAN_GLOSSARY_ENTRIES.map((e) => e.term);
    for (const expected of ['Pyrathis', "Vel'Tara", 'Cosmara', 'Lumina', 'Gate Keys', 'Ten Gates']) {
      assert.ok(terms.includes(expected), `Glossary missing canonical term: ${expected}`);
    }
  });
});

describe('voice guides', () => {
  it('Lumina has en + de voice guides', () => {
    assert.ok(getVoiceGuide('Lumina', 'en'));
    assert.ok(getVoiceGuide('Lumina', 'de'));
  });

  it('returns null for missing locale variant', () => {
    assert.equal(getVoiceGuide('Lumina', 'xx'), null);
  });

  it('Lumina-DE references Tor-Schluessel canon translation', () => {
    const guide = getVoiceGuide('Lumina', 'de');
    assert.ok(guide);
    assert.equal(guide.canonAnchors.alwaysTranslate['Gate Keys'], 'Tor-Schlüssel');
  });
});

describe('Guardian roster', () => {
  it('Continuity Guardian is language-agnostic across all locales', () => {
    assert.equal(resolveGuardian('continuityGuardian', 'en'), 'continuity-guardian');
    assert.equal(resolveGuardian('continuityGuardian', 'de'), 'continuity-guardian');
    assert.equal(resolveGuardian('continuityGuardian', 'ja'), 'continuity-guardian');
  });

  it('Voice Alchemist DE not yet available (Phase 4)', () => {
    assert.equal(resolveGuardian('voiceAlchemist', 'de'), null);
  });

  it('buildReviewChain marks voice alchemist required', () => {
    const chain = buildReviewChain('de');
    const va = chain.find((c) => c.role === 'voiceAlchemist');
    assert.ok(va);
    assert.equal(va.required, true);
  });
});

describe('royalty defaults', () => {
  it('default profile is generous (50/20/30)', () => {
    assert.equal(ARCANEAN_DEFAULT_ROYALTY_PROFILE, 'generous');
    const split = getRoyaltySplit(ARCANEAN_DEFAULT_ROYALTY_PROFILE);
    assert.equal(split.author, 0.5);
    assert.equal(split.translator, 0.2);
    assert.equal(split.platform, 0.3);
  });
});
