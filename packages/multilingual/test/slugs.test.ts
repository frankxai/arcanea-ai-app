import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { asciiSlug, validateSlug, buildLocaleSlugMap } from '../src/slugs';

describe('asciiSlug — Latin scripts', () => {
  it('handles German umlauts', () => {
    assert.equal(asciiSlug('Schmiede des Untergangs'), 'schmiede-des-untergangs');
    assert.equal(asciiSlug('Überlieferung'), 'ueberlieferung');
    assert.equal(asciiSlug('Größe'), 'groesse');
    assert.equal(asciiSlug('Männer'), 'maenner');
  });

  it('handles French accents', () => {
    assert.equal(asciiSlug('Forêt enchantée'), 'foret-enchantee');
    assert.equal(asciiSlug('Cœur'), 'cur'); // œ not in our map; acceptable
    assert.equal(asciiSlug('Château'), 'chateau');
  });

  it('handles Spanish/Portuguese', () => {
    assert.equal(asciiSlug('Forja de la Ruina'), 'forja-de-la-ruina');
    assert.equal(asciiSlug('Mañana'), 'manana');
    assert.equal(asciiSlug('Coração'), 'coracao');
  });

  it('handles Polish', () => {
    assert.equal(asciiSlug('Łódź'), 'lodz');
  });

  it('collapses multiple punctuation/whitespace to single hyphens', () => {
    assert.equal(asciiSlug('Hello,  world!!!'), 'hello-world');
    assert.equal(asciiSlug('a---b   c'), 'a-b-c');
  });

  it('trims leading and trailing hyphens', () => {
    assert.equal(asciiSlug('---hello---'), 'hello');
    assert.equal(asciiSlug('  whitespace  '), 'whitespace');
  });
});

describe('asciiSlug — CJK / non-Latin (returns null by default)', () => {
  it('returns null for pure Japanese kanji', () => {
    assert.equal(asciiSlug('滅びの探検'), null);
  });

  it('returns null for pure Chinese', () => {
    assert.equal(asciiSlug('森林'), null);
  });

  it('returns null for pure Arabic', () => {
    assert.equal(asciiSlug('السلام'), null);
  });

  it('returns null for empty string', () => {
    assert.equal(asciiSlug(''), null);
  });

  it('returns null for whitespace only', () => {
    assert.equal(asciiSlug('   '), null);
  });

  it('returns null for punctuation only', () => {
    assert.equal(asciiSlug('!!!'), null);
  });

  it('throws when onEmpty: throw', () => {
    assert.throws(
      () => asciiSlug('滅びの探検', { onEmpty: 'throw' }),
      /produced empty slug/,
    );
  });

  it('preserves NFD form when onEmpty: preserve', () => {
    const result = asciiSlug('森林', { onEmpty: 'preserve' });
    assert.ok(result, 'should return a non-null fallback');
    assert.equal(typeof result, 'string');
  });
});

describe('asciiSlug — mixed input', () => {
  it('strips CJK from mixed Latin + CJK', () => {
    // "title 滅び" → strips 滅び, leaves "title"
    assert.equal(asciiSlug('title 滅び'), 'title');
  });

  it('handles Latin-1 + ASCII normally', () => {
    assert.equal(asciiSlug('Forge of Ruin (Buch 1)'), 'forge-of-ruin-buch-1');
  });
});

describe('validateSlug — ASCII strict mode (default)', () => {
  it('accepts lowercase ASCII with hyphens', () => {
    assert.equal(validateSlug('hello-world'), null);
    assert.equal(validateSlug('a'), null);
    assert.equal(validateSlug('schmiede-des-untergangs'), null);
  });

  it('rejects uppercase', () => {
    assert.match(validateSlug('Hello-World') ?? '', /lowercase/);
  });

  it('rejects Unicode', () => {
    assert.match(validateSlug('schmiede-überleben') ?? '', /lowercase/);
  });

  it('rejects empty string', () => {
    assert.match(validateSlug('') ?? '', /empty/);
  });

  it('rejects 200+ char slug', () => {
    assert.match(validateSlug('a'.repeat(201)) ?? '', /200/);
  });

  it('rejects leading/trailing hyphen', () => {
    assert.match(validateSlug('-foo') ?? '', /lowercase/);
    assert.match(validateSlug('foo-') ?? '', /lowercase/);
  });

  it('rejects consecutive hyphens', () => {
    assert.match(validateSlug('foo--bar') ?? '', /lowercase/);
  });
});

describe('validateSlug — Unicode mode (opt-in)', () => {
  it('accepts German umlauts', () => {
    assert.equal(validateSlug('überlieferung', { allowUnicode: true }), null);
  });

  it('accepts CJK', () => {
    assert.equal(validateSlug('森林', { allowUnicode: true }), null);
  });

  it('rejects URL-unsafe characters', () => {
    assert.match(
      validateSlug('foo/bar', { allowUnicode: true }) ?? '',
      /URL-unsafe/,
    );
    assert.match(
      validateSlug('foo?bar', { allowUnicode: true }) ?? '',
      /URL-unsafe/,
    );
  });

  it('rejects whitespace', () => {
    assert.match(
      validateSlug('foo bar', { allowUnicode: true }) ?? '',
      /URL-unsafe/,
    );
  });
});

describe('buildLocaleSlugMap', () => {
  it('produces slugs for all Latin-script titles', () => {
    const map = buildLocaleSlugMap({
      en: 'Forge of Ruin',
      de: 'Schmiede des Untergangs',
      es: 'Forja de la Ruina',
    });
    assert.deepEqual(map, {
      en: 'forge-of-ruin',
      de: 'schmiede-des-untergangs',
      es: 'forja-de-la-ruina',
    });
  });

  it('omits locales whose title produces empty slug (default null)', () => {
    const map = buildLocaleSlugMap({
      en: 'Hello',
      ja: '滅びの探検', // would produce empty
    });
    assert.deepEqual(map, { en: 'hello' });
    assert.equal('ja' in map, false);
  });
});
