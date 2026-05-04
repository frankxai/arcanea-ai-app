import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { defineLocaleConfig } from '../src/routing';
import {
  bookSchemaForLocale,
  generateTranslationTasks,
  getRoyaltySplit,
  splitTranslatorShare,
  validateBookRecord,
  assertValidRoyaltySplit,
  ROYALTY_SPLIT_PROFILES,
} from '../src/book';
import type { BookRecord } from '../src/types';

const config = defineLocaleConfig({
  domain: 'https://example.com',
  locales: ['en', 'de', 'ja'],
  defaultLocale: 'en',
  pathnames: { '/library': { en: '/library', de: '/bibliothek', ja: '/toshokan' } },
});

const validBook: BookRecord = {
  id: 'forge-of-ruin',
  originalLanguage: 'en',
  authorIds: ['frank'],
  locales: [
    {
      locale: 'en',
      slug: 'forge-of-ruin',
      title: 'Forge of Ruin',
      status: 'published',
      publishedAt: '2026-04-08',
    },
    {
      locale: 'de',
      slug: 'schmiede-des-untergangs',
      title: 'Schmiede des Untergangs',
      status: 'published',
      publishedAt: '2026-05-01',
    },
  ],
};

describe('bookSchemaForLocale', () => {
  it('builds schema with workTranslation chain for translation', () => {
    const schema = bookSchemaForLocale({
      config,
      book: validBook,
      locale: 'de',
      bookRoutePath: '/library',
      authors: [{ name: 'Frank' }],
      translators: [{ name: 'Lumina', isAi: true }],
    });
    assert.equal(schema.url, 'https://example.com/de/bibliothek/schmiede-des-untergangs');
    assert.equal(schema.inLanguage, 'de');
    assert.deepEqual(schema.translationOfWork, {
      '@type': 'Book',
      url: 'https://example.com/library/forge-of-ruin',
      inLanguage: 'en',
    });
  });

  it('omits translationOfWork for original language', () => {
    const schema = bookSchemaForLocale({
      config,
      book: validBook,
      locale: 'en',
      bookRoutePath: '/library',
      authors: [{ name: 'Frank' }],
    });
    assert.equal('translationOfWork' in schema, false);
  });

  it('throws when target locale not in book.locales', () => {
    assert.throws(
      () =>
        bookSchemaForLocale({
          config,
          book: validBook,
          locale: 'ja',
          bookRoutePath: '/library',
          authors: [{ name: 'Frank' }],
        }),
      /no locale "ja" registered/,
    );
  });

  it('throws when originalLanguage not in book.locales (data integrity)', () => {
    const orphan: BookRecord = {
      id: 'orphan',
      originalLanguage: 'en',
      authorIds: ['x'],
      locales: [
        // missing the en locale that originalLanguage references
        {
          locale: 'de',
          slug: 'orphan-de',
          title: 'Orphan',
          status: 'published',
        },
      ],
    };
    assert.throws(
      () =>
        bookSchemaForLocale({
          config,
          book: orphan,
          locale: 'de',
          bookRoutePath: '/library',
          authors: [{ name: 'X' }],
        }),
      /workTranslation chain/,
    );
  });
});

describe('generateTranslationTasks', () => {
  it('generates tasks for missing locales', () => {
    const tasks = generateTranslationTasks({
      book: validBook,
      targetLocales: ['de', 'es', 'ja'],
    });
    // de is already published; should be skipped
    const targets = tasks.map((t) => t.targetLocale).sort();
    assert.deepEqual(targets, ['es', 'ja']);
  });

  it('does not generate task for original language', () => {
    const tasks = generateTranslationTasks({
      book: validBook,
      targetLocales: ['en', 'es'],
    });
    const targets = tasks.map((t) => t.targetLocale);
    assert.equal(targets.includes('en'), false);
  });

  it('uses default reward share 0.2', () => {
    const tasks = generateTranslationTasks({
      book: validBook,
      targetLocales: ['es'],
    });
    assert.equal(tasks[0].rewardShare, 0.2);
  });

  it('respects custom reward share', () => {
    const tasks = generateTranslationTasks({
      book: validBook,
      targetLocales: ['es'],
      defaultRewardShare: 0.3,
    });
    assert.equal(tasks[0].rewardShare, 0.3);
  });
});

describe('royalty splits', () => {
  it('all built-in profiles sum to 1.0', () => {
    for (const profile of Object.values(ROYALTY_SPLIT_PROFILES)) {
      const sum = profile.author + profile.translator + profile.platform;
      assert.ok(Math.abs(sum - 1) < 0.0001);
    }
  });

  it('assertValidRoyaltySplit accepts built-in profiles', () => {
    for (const profile of Object.values(ROYALTY_SPLIT_PROFILES)) {
      assert.doesNotThrow(() => assertValidRoyaltySplit(profile));
    }
  });

  it('assertValidRoyaltySplit rejects sum > 1', () => {
    assert.throws(
      () =>
        assertValidRoyaltySplit({ author: 0.7, translator: 0.5, platform: 0.3 }),
      /sum is/,
    );
  });

  it('assertValidRoyaltySplit rejects negative value', () => {
    assert.throws(
      () =>
        assertValidRoyaltySplit({ author: 1.2, translator: -0.2, platform: 0 }),
      /outside \[0,1\]/,
    );
  });

  it('getRoyaltySplit defaults to generous', () => {
    const split = getRoyaltySplit();
    assert.equal(split.author, 0.5);
    assert.equal(split.translator, 0.2);
  });
});

describe('splitTranslatorShare', () => {
  it('splits proportionally by word count', () => {
    const splits = splitTranslatorShare(
      [
        { translatorId: 'a', wordCount: 5000 },
        { translatorId: 'b', wordCount: 3000 },
      ],
      0.2,
    );
    assert.equal(splits.a, 0.125); // 5000/8000 * 0.2
    assert.ok(Math.abs(splits.b - 0.075) < 0.0001);
  });

  it('returns empty when no contributions', () => {
    assert.deepEqual(splitTranslatorShare([], 0.2), {});
  });

  it('returns empty when total words is 0', () => {
    assert.deepEqual(
      splitTranslatorShare([{ translatorId: 'a', wordCount: 0 }], 0.2),
      {},
    );
  });
});

describe('validateBookRecord', () => {
  it('passes for valid record', () => {
    assert.deepEqual(validateBookRecord(validBook), []);
  });

  it('flags missing originalLanguage in locales', () => {
    const issues = validateBookRecord({
      ...validBook,
      originalLanguage: 'fr', // not in locales
    });
    assert.equal(issues.length, 1);
    assert.match(issues[0], /not present in locales/);
  });

  it('flags published locale with no publishedAt', () => {
    const issues = validateBookRecord({
      ...validBook,
      locales: [
        ...validBook.locales,
        {
          locale: 'es',
          slug: 'forja',
          title: 'Forja',
          status: 'published',
          // missing publishedAt
        },
      ],
    });
    assert.ok(issues.some((i) => /publishedAt/.test(i)));
  });
});
