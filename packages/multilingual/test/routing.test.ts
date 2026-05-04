import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  defineLocaleConfig,
  resolvePathname,
  buildLocalizedUrl,
  getLocaleVariants,
} from '../src/routing';

describe('defineLocaleConfig', () => {
  it('rejects defaultLocale not in locales array', () => {
    assert.throws(
      () =>
        defineLocaleConfig({
          domain: 'https://example.com',
          locales: ['en', 'de'],
          defaultLocale: 'fr',
        }),
      /defaultLocale "fr" must be in locales/,
    );
  });

  it('rejects domain without protocol', () => {
    assert.throws(
      () =>
        defineLocaleConfig({
          domain: 'example.com',
          locales: ['en'],
          defaultLocale: 'en',
        }),
      /domain must include protocol/,
    );
  });

  it('strips trailing slash from domain', () => {
    const config = defineLocaleConfig({
      domain: 'https://example.com/',
      locales: ['en'],
      defaultLocale: 'en',
    });
    assert.equal(config.domain, 'https://example.com');
  });

  it('defaults localePrefix to as-needed', () => {
    const config = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en'],
      defaultLocale: 'en',
    });
    assert.equal(config.localePrefix, 'as-needed');
  });

  it('defaults pathnames to empty object', () => {
    const config = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en'],
      defaultLocale: 'en',
    });
    assert.deepEqual(config.pathnames, {});
  });
});

describe('resolvePathname', () => {
  const config = defineLocaleConfig({
    domain: 'https://example.com',
    locales: ['en', 'de', 'ja'],
    defaultLocale: 'en',
    pathnames: {
      '/library': { en: '/library', de: '/bibliothek', ja: '/toshokan' },
      '/docs': '/docs',
    },
  });

  it('resolves localized path from per-locale map', () => {
    assert.equal(resolvePathname(config, '/library', 'de'), '/bibliothek');
    assert.equal(resolvePathname(config, '/library', 'ja'), '/toshokan');
    assert.equal(resolvePathname(config, '/library', 'en'), '/library');
  });

  it('returns string pathname unchanged for all locales', () => {
    assert.equal(resolvePathname(config, '/docs', 'de'), '/docs');
    assert.equal(resolvePathname(config, '/docs', 'ja'), '/docs');
  });

  it('falls back to default locale when target locale missing in map', () => {
    const partialConfig = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en', 'de', 'fr'],
      defaultLocale: 'en',
      pathnames: { '/about': { en: '/about', de: '/ueber' } }, // fr missing
    });
    assert.equal(resolvePathname(partialConfig, '/about', 'fr'), '/about');
  });

  it('returns internal path unchanged when not in pathnames', () => {
    assert.equal(resolvePathname(config, '/unknown', 'de'), '/unknown');
  });
});

describe('buildLocalizedUrl', () => {
  const config = defineLocaleConfig({
    domain: 'https://example.com',
    locales: ['en', 'de', 'ja'],
    defaultLocale: 'en',
    pathnames: {
      '/library': { en: '/library', de: '/bibliothek', ja: '/toshokan' },
    },
  });

  it('drops prefix for default locale with as-needed mode', () => {
    assert.equal(
      buildLocalizedUrl(config, '/library', 'en'),
      'https://example.com/library',
    );
  });

  it('adds prefix for non-default locale', () => {
    assert.equal(
      buildLocalizedUrl(config, '/library', 'de'),
      'https://example.com/de/bibliothek',
    );
  });

  it('appends single string content slug', () => {
    assert.equal(
      buildLocalizedUrl(config, '/library', 'de', 'forge-of-ruin'),
      'https://example.com/de/bibliothek/forge-of-ruin',
    );
  });

  it('resolves per-locale slug map', () => {
    const slugMap = {
      en: 'forge-of-ruin',
      de: 'schmiede-des-untergangs',
      ja: 'horobi-no-tankan',
    };
    assert.equal(
      buildLocalizedUrl(config, '/library', 'en', slugMap),
      'https://example.com/library/forge-of-ruin',
    );
    assert.equal(
      buildLocalizedUrl(config, '/library', 'de', slugMap),
      'https://example.com/de/bibliothek/schmiede-des-untergangs',
    );
    assert.equal(
      buildLocalizedUrl(config, '/library', 'ja', slugMap),
      'https://example.com/ja/toshokan/horobi-no-tankan',
    );
  });

  it('falls back to default-locale slug when target missing', () => {
    const slugMap = { en: 'forge-of-ruin', de: 'schmiede-des-untergangs' };
    // ja missing → falls back to en
    assert.equal(
      buildLocalizedUrl(config, '/library', 'ja', slugMap),
      'https://example.com/ja/toshokan/forge-of-ruin',
    );
  });

  it("respects localePrefix 'always'", () => {
    const alwaysConfig = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en', 'de'],
      defaultLocale: 'en',
      localePrefix: 'always',
      pathnames: { '/library': { en: '/library', de: '/bibliothek' } },
    });
    assert.equal(
      buildLocalizedUrl(alwaysConfig, '/library', 'en'),
      'https://example.com/en/library',
    );
  });

  it("respects localePrefix 'never'", () => {
    const neverConfig = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en', 'de'],
      defaultLocale: 'en',
      localePrefix: 'never',
      pathnames: { '/library': { en: '/library', de: '/bibliothek' } },
    });
    assert.equal(
      buildLocalizedUrl(neverConfig, '/library', 'de'),
      'https://example.com/bibliothek',
    );
  });

  it('handles pathname without leading slash', () => {
    const configNoSlash = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en', 'de'],
      defaultLocale: 'en',
      pathnames: { '/library': { en: 'library', de: 'bibliothek' } },
    });
    assert.equal(
      buildLocalizedUrl(configNoSlash, '/library', 'de'),
      'https://example.com/de/bibliothek',
    );
  });
});

describe('getLocaleVariants', () => {
  const config = defineLocaleConfig({
    domain: 'https://example.com',
    locales: ['en', 'de', 'ja'],
    defaultLocale: 'en',
    pathnames: { '/library': { en: '/library', de: '/bibliothek', ja: '/toshokan' } },
  });

  it('returns one variant per locale', () => {
    const variants = getLocaleVariants(config, '/library');
    assert.equal(variants.length, 3);
    assert.deepEqual(
      variants.map((v) => v.locale),
      ['en', 'de', 'ja'],
    );
  });

  it('uses per-locale slug map for each variant', () => {
    const variants = getLocaleVariants(config, '/library', {
      en: 'forge',
      de: 'schmiede',
      ja: 'koubou',
    });
    assert.equal(variants[0].url, 'https://example.com/library/forge');
    assert.equal(variants[1].url, 'https://example.com/de/bibliothek/schmiede');
    assert.equal(variants[2].url, 'https://example.com/ja/toshokan/koubou');
  });
});
