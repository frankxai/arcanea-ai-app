import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  defineGlossary,
  lookupTerm,
  scanPassage,
  validateTranslation,
  SAMPLE_ARCANEAN_GLOSSARY_ENTRIES,
} from '../src/glossary';

describe('defineGlossary', () => {
  it('rejects duplicate terms (case-insensitive)', () => {
    assert.throws(
      () =>
        defineGlossary({
          defaultLocale: 'en',
          entries: [
            { term: 'Pyrathis', flag: 'preserve', perLocale: { en: 'Pyrathis' } },
            { term: 'pyrathis', flag: 'preserve', perLocale: { en: 'Pyrathis' } },
          ],
        }),
      /duplicate term/,
    );
  });

  it('rejects entry missing default-locale rendering', () => {
    assert.throws(
      () =>
        defineGlossary({
          defaultLocale: 'en',
          entries: [{ term: 'X', flag: 'preserve', perLocale: { de: 'X' } }],
        }),
      /missing default-locale rendering/,
    );
  });
});

describe('lookupTerm', () => {
  const g = defineGlossary({
    defaultLocale: 'en',
    entries: SAMPLE_ARCANEAN_GLOSSARY_ENTRIES,
  });

  it('preserves Pyrathis verbatim across locales', () => {
    assert.equal(lookupTerm(g, 'Pyrathis', 'de').rendering, 'Pyrathis');
    assert.equal(lookupTerm(g, 'Pyrathis', 'ja').rendering, 'Pyrathis');
  });

  it('translates Gate Keys', () => {
    assert.equal(lookupTerm(g, 'Gate Keys', 'de').rendering, 'Tor-Schlüssel');
    assert.equal(lookupTerm(g, 'Gate Keys', 'es').rendering, 'Llaves de la Puerta');
  });

  it('falls back to default locale when target missing', () => {
    const partial = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: 'X', flag: 'translate', perLocale: { en: 'X-en', de: 'X-de' } },
      ],
    });
    assert.equal(lookupTerm(partial, 'X', 'fr').rendering, 'X-en');
  });

  it('returns null flag for unknown term', () => {
    assert.equal(lookupTerm(g, 'Unknown', 'de').flag, null);
  });

  it('respects world scoping', () => {
    // Pyrathis is scoped to world 'pyrathis' — should not match in cosmara
    const result = lookupTerm(g, 'Pyrathis', 'de', 'cosmara');
    assert.equal(result.flag, null);
  });
});

describe('scanPassage — Unicode boundaries', () => {
  it("matches term with apostrophe (Vel'Tara)", () => {
    const g = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: "Vel'Tara", flag: 'preserve', perLocale: { en: "Vel'Tara", de: "Vel'Tara" } },
      ],
    });
    const hits = scanPassage(g, "The streets of Vel'Tara echoed.", 'de');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].term, "Vel'Tara");
  });

  it('matches term with hyphen', () => {
    const g = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: 'Star-Forge', flag: 'preserve', perLocale: { en: 'Star-Forge' } },
      ],
    });
    const hits = scanPassage(g, 'The Star-Forge gleams.', 'en');
    assert.equal(hits.length, 1);
  });

  it('matches Japanese term in Japanese passage', () => {
    const g = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: '門の鍵', flag: 'preserve', perLocale: { en: '門の鍵', ja: '門の鍵' } },
      ],
    });
    const hits = scanPassage(g, '彼は門の鍵を持っていた。', 'ja');
    assert.equal(hits.length, 1);
  });

  it('does NOT match partial term inside larger word', () => {
    const g = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: 'cat', flag: 'preserve', perLocale: { en: 'cat' } },
      ],
    });
    const hits = scanPassage(g, 'The category was concatenated.', 'en');
    assert.equal(hits.length, 0);
  });
});

describe('scanPassage — substring/longest-match', () => {
  it("when 'Vel'Tara' and 'Vel'Tara Sword' both match, longest wins", () => {
    const g = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: "Vel'Tara", flag: 'preserve', perLocale: { en: "Vel'Tara" } },
        { term: "Vel'Tara Sword", flag: 'translate', perLocale: { en: "Vel'Tara Sword", de: "Vel'Tara-Schwert" } },
      ],
    });
    const hits = scanPassage(g, "He wielded the Vel'Tara Sword.", 'de');
    assert.equal(hits.length, 1);
    assert.equal(hits[0].term, "Vel'Tara Sword");
  });

  it('when terms do not overlap, both match', () => {
    const g = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: 'Pyrathis', flag: 'preserve', perLocale: { en: 'Pyrathis' } },
        { term: 'Lumina', flag: 'preserve', perLocale: { en: 'Lumina' } },
      ],
    });
    const hits = scanPassage(g, 'Pyrathis sleeps. Lumina watches.', 'de');
    assert.equal(hits.length, 2);
  });
});

describe('validateTranslation', () => {
  const g = defineGlossary({
    defaultLocale: 'en',
    entries: SAMPLE_ARCANEAN_GLOSSARY_ENTRIES,
  });

  it('passes when canonical terms are correctly preserved/translated', () => {
    const violations = validateTranslation(
      g,
      'Pyrathis sleeps. The Gate Keys await.',
      'Pyrathis schläft. Die Tor-Schlüssel warten.',
      'en',
      'de',
    );
    assert.equal(violations.length, 0);
  });

  it('flags missing preserved term', () => {
    const violations = validateTranslation(
      g,
      'Pyrathis sleeps.',
      'Es schläft.', // Pyrathis missing
      'en',
      'de',
    );
    assert.equal(violations.length, 1);
    assert.equal(violations[0].flag, 'preserve');
  });

  it('flags missing canonical translation', () => {
    const violations = validateTranslation(
      g,
      'The Gate Keys await.',
      'Die Schlüssel warten.', // wrong translation
      'en',
      'de',
    );
    assert.equal(violations.length, 1);
    assert.equal(violations[0].flag, 'translate');
    assert.equal(violations[0].expectedRendering, 'Tor-Schlüssel');
  });

  it('does not validate adapt-flag terms (human judgment required)', () => {
    const adaptG = defineGlossary({
      defaultLocale: 'en',
      entries: [
        { term: 'snowdrift', flag: 'adapt', perLocale: { en: 'snowdrift', ja: '雪庭' } },
      ],
    });
    const violations = validateTranslation(
      adaptG,
      'A snowdrift formed.',
      '何もない。', // adapted concept missing literally
      'en',
      'ja',
    );
    assert.equal(violations.length, 0);
  });
});
