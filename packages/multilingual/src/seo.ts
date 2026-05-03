import type {
  LocaleConfig,
  HreflangAlternate,
  SitemapEntry,
  LLMsManifest,
  LLMsManifestEntry,
} from './types';
import {
  buildLocalizedUrl,
  getLocaleVariants,
  type ContentSlugInput,
} from './routing';

/**
 * Generate hreflang alternates for an internal path across all configured
 * locales. Includes `x-default` pointing to the default-locale URL.
 *
 * Use the result in <head> via:
 *   {alternates.map(a => <link rel="alternate" hrefLang={a.hreflang} href={a.href} />)}
 */
export function generateHreflang(
  config: LocaleConfig,
  internalPath: string,
  contentSlug?: ContentSlugInput,
): HreflangAlternate[] {
  const variants = getLocaleVariants(config, internalPath, contentSlug);
  const alternates: HreflangAlternate[] = variants.map((v) => ({
    hreflang: v.locale,
    href: v.url,
  }));

  const defaultVariant = variants.find((v) => v.locale === config.defaultLocale);
  if (defaultVariant) {
    alternates.push({ hreflang: 'x-default', href: defaultVariant.url });
  }

  return alternates;
}

/**
 * Escape a string for safe inclusion in an HTML attribute.
 */
function htmlAttrEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape a string for safe inclusion in an XML element body.
 */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Render hreflang alternates as HTML <link> tags. Useful when generating
 * sitemap.xml or pre-rendering <head> content as a string.
 *
 * All values are HTML-attribute-escaped to defend against injection from
 * URL query strings, content slugs containing special characters, etc.
 */
export function renderHreflangLinks(alternates: HreflangAlternate[]): string {
  return alternates
    .map(
      (a) =>
        `<link rel="alternate" hreflang="${htmlAttrEscape(a.hreflang)}" href="${htmlAttrEscape(a.href)}" />`,
    )
    .join('\n');
}

interface SitemapInputEntry {
  internalPath: string;
  contentSlug?: ContentSlugInput;
  lastModified?: string;
  changeFrequency?: SitemapEntry['changeFrequency'];
  priority?: number;
  /**
   * If provided, restricts which locales this entry is published in.
   * Defaults to all locales in the config.
   */
  locales?: ReadonlyArray<string>;
}

/**
 * Generate sitemap entries for a given locale. Each entry includes hreflang
 * alternates referencing siblings in other locales (Google standard).
 *
 * Use one call per locale, then write to /sitemap-<locale>.xml. Reference
 * all per-locale sitemaps from a /sitemap.xml index.
 */
export function generateLocaleSitemap(
  config: LocaleConfig,
  locale: string,
  entries: SitemapInputEntry[],
): SitemapEntry[] {
  return entries
    .filter((e) => !e.locales || e.locales.includes(locale))
    .map((e) => {
      const url = buildLocalizedUrl(config, e.internalPath, locale, e.contentSlug);
      const alternates: HreflangAlternate[] = (e.locales ?? config.locales)
        .filter((l) => l !== locale)
        .map((l) => ({
          hreflang: l,
          href: buildLocalizedUrl(config, e.internalPath, l, e.contentSlug),
        }));

      return {
        url,
        lastModified: e.lastModified,
        changeFrequency: e.changeFrequency,
        priority: e.priority,
        alternates,
      };
    });
}

/**
 * Render sitemap entries as XML. The entries already include hreflang
 * alternates. Wraps with the standard urlset header.
 *
 * All URLs and locale codes are XML-escaped to defend against ampersand /
 * angle-bracket characters that would otherwise produce invalid XML
 * (common when URLs contain query strings or content slugs leak special
 * characters).
 */
export function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const altLinks = (e.alternates ?? [])
        .map(
          (a) =>
            `    <xhtml:link rel="alternate" hreflang="${htmlAttrEscape(a.hreflang)}" href="${htmlAttrEscape(a.href)}" />`,
        )
        .join('\n');
      const lastmod = e.lastModified
        ? `    <lastmod>${xmlEscape(e.lastModified)}</lastmod>`
        : '';
      const changefreq = e.changeFrequency
        ? `    <changefreq>${xmlEscape(e.changeFrequency)}</changefreq>`
        : '';
      const priority =
        e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>` : '';

      return [
        '  <url>',
        `    <loc>${xmlEscape(e.url)}</loc>`,
        lastmod,
        changefreq,
        priority,
        altLinks,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

/**
 * Generate a sitemap index pointing at one /sitemap-<locale>.xml per locale.
 */
export function renderSitemapIndex(config: LocaleConfig): string {
  const entries = config.locales
    .map(
      (l) =>
        `  <sitemap>\n    <loc>${xmlEscape(config.domain)}/sitemap-${xmlEscape(l)}.xml</loc>\n  </sitemap>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

/**
 * Generate a /llms.txt manifest for a given locale. The Anthropic +
 * Cloudflare standard (2025+) for telling AI crawlers which pages on
 * your site are most worth citing. AI search engines (ChatGPT, Perplexity,
 * Claude, Gemini) increasingly read this file.
 *
 * Output is plain markdown — see https://llmstxt.org for the spec.
 */
export function generateLLMsManifest(input: LLMsManifest): string {
  const lines: string[] = [];
  lines.push(`# ${input.siteName}`);
  lines.push('');
  lines.push(`> ${input.description}`);
  lines.push('');
  lines.push(`Locale: ${input.locale}`);
  lines.push('');

  for (const section of input.sections) {
    lines.push(`## ${section.name}`);
    lines.push('');
    for (const entry of section.entries) {
      const desc = entry.description ? `: ${entry.description}` : '';
      lines.push(`- [${entry.title}](${entry.url})${desc}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Convenience: build LLMsManifestEntry from common content shapes.
 */
export function llmsEntryFromBook(
  config: LocaleConfig,
  locale: string,
  book: { title: string; slug: string; description?: string; libraryPath?: string },
): LLMsManifestEntry {
  const internalPath = book.libraryPath ?? '/library';
  return {
    title: book.title,
    url: buildLocalizedUrl(config, internalPath, locale, book.slug),
    description: book.description,
    category: 'book',
  };
}
