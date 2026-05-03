import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { defineLocaleConfig } from '../src/routing';
import {
  generateHreflang,
  renderHreflangLinks,
  generateLocaleSitemap,
  renderSitemapXml,
  renderSitemapIndex,
  generateLLMsManifest,
} from '../src/seo';

const config = defineLocaleConfig({
  domain: 'https://example.com',
  locales: ['en', 'de', 'ja'],
  defaultLocale: 'en',
  pathnames: {
    '/library': { en: '/library', de: '/bibliothek', ja: '/toshokan' },
  },
});

describe('generateHreflang', () => {
  it('includes one alternate per locale plus x-default', () => {
    const alternates = generateHreflang(config, '/library');
    assert.equal(alternates.length, 4);
    const tags = alternates.map((a) => a.hreflang).sort();
    assert.deepEqual(tags, ['de', 'en', 'ja', 'x-default']);
  });

  it('x-default points to default locale URL', () => {
    const alternates = generateHreflang(config, '/library');
    const xDefault = alternates.find((a) => a.hreflang === 'x-default');
    const en = alternates.find((a) => a.hreflang === 'en');
    assert.equal(xDefault?.href, en?.href);
  });

  it('uses per-locale slug map', () => {
    const alternates = generateHreflang(config, '/library', {
      en: 'forge-of-ruin',
      de: 'schmiede-des-untergangs',
    });
    const de = alternates.find((a) => a.hreflang === 'de');
    assert.equal(de?.href, 'https://example.com/de/bibliothek/schmiede-des-untergangs');
  });
});

describe('renderHreflangLinks — HTML escape (XSS defense)', () => {
  it('escapes ampersands in URLs', () => {
    const out = renderHreflangLinks([
      { hreflang: 'en', href: 'https://example.com/library?a=1&b=2' },
    ]);
    assert.match(out, /a=1&amp;b=2/);
    assert.equal(out.includes('a=1&b=2'), false);
  });

  it('escapes quotes in attribute values', () => {
    const out = renderHreflangLinks([
      { hreflang: 'en', href: 'https://example.com/"><script>x</script>' },
    ]);
    assert.equal(out.includes('"><script>'), false);
  });
});

describe('renderSitemapXml — XML escape', () => {
  it('escapes ampersands in URL', () => {
    const xml = renderSitemapXml([
      {
        url: 'https://example.com/library?a=1&b=2',
        lastModified: '2026-05-03',
      },
    ]);
    assert.match(xml, /a=1&amp;b=2/);
    assert.equal(xml.includes('a=1&b=2'), false);
  });

  it('escapes ampersands in hreflang alternates', () => {
    const xml = renderSitemapXml([
      {
        url: 'https://example.com/library',
        alternates: [
          { hreflang: 'de', href: 'https://example.com/de/bibliothek?utm=a&z=1' },
        ],
      },
    ]);
    assert.match(xml, /utm=a&amp;z=1/);
  });

  it('produces valid sitemap entry structure', () => {
    const xml = renderSitemapXml([
      {
        url: 'https://example.com/library',
        lastModified: '2026-05-03',
        changeFrequency: 'daily',
        priority: 0.9,
      },
    ]);
    assert.match(xml, /<\?xml version="1.0"/);
    assert.match(xml, /<urlset/);
    assert.match(xml, /<loc>https:\/\/example.com\/library<\/loc>/);
    assert.match(xml, /<lastmod>2026-05-03<\/lastmod>/);
    assert.match(xml, /<changefreq>daily<\/changefreq>/);
    assert.match(xml, /<priority>0\.9<\/priority>/);
  });
});

describe('renderSitemapIndex', () => {
  it('emits one <sitemap> per locale', () => {
    const xml = renderSitemapIndex(config);
    assert.match(xml, /sitemap-en\.xml/);
    assert.match(xml, /sitemap-de\.xml/);
    assert.match(xml, /sitemap-ja\.xml/);
  });
});

describe('generateLocaleSitemap', () => {
  it('produces entry for matching locale', () => {
    const entries = generateLocaleSitemap(config, 'de', [
      { internalPath: '/library', priority: 0.9 },
    ]);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].url, 'https://example.com/de/bibliothek');
  });

  it('respects locales filter on entry', () => {
    // /docs is en-only
    const enEntries = generateLocaleSitemap(config, 'en', [
      { internalPath: '/docs', locales: ['en'] },
    ]);
    const deEntries = generateLocaleSitemap(config, 'de', [
      { internalPath: '/docs', locales: ['en'] },
    ]);
    assert.equal(enEntries.length, 1);
    assert.equal(deEntries.length, 0);
  });

  it('hreflang alternates exclude self', () => {
    const entries = generateLocaleSitemap(config, 'de', [
      { internalPath: '/library' },
    ]);
    const alts = entries[0].alternates ?? [];
    assert.equal(alts.find((a) => a.hreflang === 'de'), undefined);
    assert.ok(alts.find((a) => a.hreflang === 'en'));
    assert.ok(alts.find((a) => a.hreflang === 'ja'));
  });
});

describe('generateLLMsManifest', () => {
  it('produces markdown with header and sections', () => {
    const md = generateLLMsManifest({
      siteName: 'Arcanea',
      description: 'Test',
      locale: 'en',
      sections: [
        {
          name: 'Library',
          entries: [{ title: 'Book A', url: 'https://example.com/a' }],
        },
      ],
    });
    assert.match(md, /^# Arcanea/m);
    assert.match(md, /^> Test/m);
    assert.match(md, /^## Library/m);
    assert.match(md, /\[Book A\]\(https:\/\/example\.com\/a\)/);
  });
});
