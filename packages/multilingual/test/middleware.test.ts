import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { defineLocaleConfig } from '../src/routing';
import {
  detectLocale,
  shouldRedirectToLocale,
  stripLocalePrefix,
  LOCALE_COOKIE,
} from '../src/middleware';

const config = defineLocaleConfig({
  domain: 'https://example.com',
  locales: ['en', 'de', 'ja'],
  defaultLocale: 'en',
  pathnames: {},
});

function mockRequest(opts: {
  pathname?: string;
  cookie?: string;
  acceptLang?: string;
  geo?: string;
}) {
  return {
    nextUrl: new URL(`https://example.com${opts.pathname ?? '/'}`),
    headers: {
      get: (name: string) => {
        if (name === 'accept-language') return opts.acceptLang ?? null;
        return null;
      },
    },
    cookies: {
      get: (name: string) =>
        name === LOCALE_COOKIE && opts.cookie ? { value: opts.cookie } : undefined,
    },
    geo: opts.geo ? { country: opts.geo } : undefined,
  };
}

describe('detectLocale', () => {
  it('priority 1: URL prefix wins over everything', () => {
    const req = mockRequest({
      pathname: '/de/library',
      cookie: 'ja',
      acceptLang: 'fr-FR',
      geo: 'JP',
    });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('priority 2: cookie wins over Accept-Language and geo', () => {
    const req = mockRequest({
      pathname: '/library',
      cookie: 'de',
      acceptLang: 'ja-JP',
      geo: 'JP',
    });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('priority 3: Accept-Language wins over geo', () => {
    const req = mockRequest({
      pathname: '/library',
      acceptLang: 'de-DE,en;q=0.5',
      geo: 'JP',
    });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('Accept-Language: matches by primary language tag (de-AT → de)', () => {
    const req = mockRequest({
      pathname: '/library',
      acceptLang: 'de-AT,en;q=0.5',
    });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('Accept-Language: respects q-values (de;q=0.3 < ja;q=0.9)', () => {
    const req = mockRequest({
      pathname: '/library',
      acceptLang: 'de;q=0.3,ja;q=0.9',
    });
    assert.equal(detectLocale(req, config), 'ja');
  });

  it('Accept-Language: skips locales not in our config', () => {
    const req = mockRequest({
      pathname: '/library',
      acceptLang: 'fr-FR;q=0.9,de;q=0.5',
    });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('priority 4: geo country fallback (DE → de)', () => {
    const req = mockRequest({ pathname: '/library', geo: 'DE' });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('geo: AT (Austrian) maps to de', () => {
    const req = mockRequest({ pathname: '/library', geo: 'AT' });
    assert.equal(detectLocale(req, config), 'de');
  });

  it('geo: JP maps to ja', () => {
    const req = mockRequest({ pathname: '/library', geo: 'JP' });
    assert.equal(detectLocale(req, config), 'ja');
  });

  it('priority 5: falls back to defaultLocale', () => {
    const req = mockRequest({ pathname: '/library' });
    assert.equal(detectLocale(req, config), 'en');
  });

  it('cookie value not in locales is ignored', () => {
    const req = mockRequest({
      pathname: '/library',
      cookie: 'fr', // not in our locales
    });
    assert.equal(detectLocale(req, config), 'en');
  });
});

describe('shouldRedirectToLocale', () => {
  it('returns null when URL already has locale prefix', () => {
    const req = mockRequest({ pathname: '/de/library' });
    assert.equal(shouldRedirectToLocale(req, config, 'ja'), null);
  });

  it('returns null when cookie is set (respect user choice)', () => {
    const req = mockRequest({ pathname: '/library', cookie: 'en' });
    assert.equal(shouldRedirectToLocale(req, config, 'de'), null);
  });

  it('returns null when detected locale is default and as-needed mode', () => {
    const req = mockRequest({ pathname: '/library' });
    assert.equal(shouldRedirectToLocale(req, config, 'en'), null);
  });

  it('returns redirect URL for non-default locale on first visit', () => {
    const req = mockRequest({ pathname: '/library', acceptLang: 'de-DE' });
    const result = shouldRedirectToLocale(req, config, 'de');
    assert.ok(result);
    assert.equal(result.pathname, '/de/library');
  });

  it("redirects default locale when localePrefix is 'always'", () => {
    const alwaysConfig = defineLocaleConfig({
      domain: 'https://example.com',
      locales: ['en', 'de'],
      defaultLocale: 'en',
      localePrefix: 'always',
    });
    const req = mockRequest({ pathname: '/library' });
    const result = shouldRedirectToLocale(req, alwaysConfig, 'en');
    assert.ok(result);
    assert.equal(result.pathname, '/en/library');
  });

  it('preserves query string in redirect', () => {
    const req = {
      ...mockRequest({ pathname: '/library' }),
      nextUrl: new URL('https://example.com/library?q=test&page=2'),
    };
    const result = shouldRedirectToLocale(req, config, 'de');
    assert.ok(result);
    assert.equal(result.search, '?q=test&page=2');
  });
});

describe('stripLocalePrefix', () => {
  it('strips known locale prefix', () => {
    assert.deepEqual(stripLocalePrefix('/de/library', config), {
      locale: 'de',
      path: '/library',
    });
  });

  it('returns default locale when no prefix present', () => {
    assert.deepEqual(stripLocalePrefix('/library', config), {
      locale: 'en',
      path: '/library',
    });
  });

  it('handles root path', () => {
    assert.deepEqual(stripLocalePrefix('/', config), {
      locale: 'en',
      path: '/',
    });
  });

  it('handles deep nested paths', () => {
    assert.deepEqual(stripLocalePrefix('/de/bibliothek/schmiede-des-untergangs', config), {
      locale: 'de',
      path: '/bibliothek/schmiede-des-untergangs',
    });
  });

  it('does not strip path that starts with non-locale segment that looks like one', () => {
    // "do" is not in locales, so should not strip
    assert.deepEqual(stripLocalePrefix('/do/something', config), {
      locale: 'en',
      path: '/do/something',
    });
  });
});
