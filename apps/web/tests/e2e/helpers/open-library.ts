/**
 * Shared helpers for the Open Library E2E suite.
 *
 * These utilities keep selectors, book metadata, and navigation flows in
 * one place so individual spec files stay focused on the assertions that
 * matter.
 */

import { expect, type Page, type APIResponse } from '@playwright/test';

/* ------------------------------------------------------------------ */
/*  Known book manifests (source of truth for the 3 seeded drafts)    */
/* ------------------------------------------------------------------ */

export interface KnownBook {
  slug: string;
  title: string;
  /** First chapter slug after the numeric prefix is stripped. */
  firstChapterSlug: string;
  /** Expected cover image path (Next.js public/). */
  coverPath: string;
}

export const KNOWN_BOOKS: readonly KnownBook[] = [
  {
    slug: 'forge-of-ruin',
    title: 'The Forge of Ruin',
    firstChapterSlug: 'prologue',
    coverPath: '/images/books/forge-of-ruin-cover-nb2.png',
  },
  {
    slug: 'tides-of-silence',
    title: 'The Tides of Silence',
    firstChapterSlug: 'prologue',
    coverPath: '/images/books/tides-of-silence-cover-v2.png',
  },
  {
    slug: 'heart-of-pyrathis',
    title: 'The Heart of Pyrathis',
    firstChapterSlug: 'prologue',
    coverPath: '/images/books/heart-of-pyrathis-cover-v2.png',
  },
] as const;

export function getBookBySlug(slug: string): KnownBook | undefined {
  return KNOWN_BOOKS.find((b) => b.slug === slug);
}

/* ------------------------------------------------------------------ */
/*  Navigation helpers                                                 */
/* ------------------------------------------------------------------ */

/** Navigate to the drafts hub and wait for network idle. */
export async function gotoDraftsHub(page: Page): Promise<void> {
  await page.goto('/books/drafts');
  // Hero heading confirms the page mounted
  await expect(page.getByRole('heading', { name: /^Drafts$/, level: 1 })).toBeVisible();
}

/** Navigate to a specific draft detail page. */
export async function gotoBook(page: Page, slug: string): Promise<void> {
  await page.goto(`/books/drafts/${slug}`);
  const book = getBookBySlug(slug);
  if (book) {
    await expect(
      page.getByRole('heading', { name: book.title, level: 1 }),
    ).toBeVisible();
  }
}

/** Navigate to a chapter reader URL. */
export async function gotoChapter(
  page: Page,
  bookId: string,
  chapterId: string,
): Promise<void> {
  await page.goto(`/books/${bookId}/${chapterId}`);
}

/* ------------------------------------------------------------------ */
/*  Assertion helpers                                                  */
/* ------------------------------------------------------------------ */

/**
 * Verify that the cover image for a book actually loads (HTTP 200 +
 * non-zero natural width after decode). Covers are surfaced as plain
 * <img> tags with alt="<title> cover" on both the hub and detail pages.
 */
export async function expectCoverLoaded(
  page: Page,
  slug: string,
): Promise<void> {
  const book = getBookBySlug(slug);
  if (!book) throw new Error(`Unknown book slug: ${slug}`);

  // Locate the first cover image for this book (alt contains the title)
  const cover = page
    .locator(`img[alt="${book.title} cover"]`)
    .first();
  await expect(cover).toBeVisible();

  // Probe the src with a HEAD-style GET via the page's request context
  // to ensure it resolves to 2xx (not a 404/500 placeholder).
  const src = await cover.getAttribute('src');
  expect(src, `cover img must have a src`).toBeTruthy();

  const response = await page.request.get(src as string);
  expect(response.status(), `cover ${src} should be reachable`).toBeLessThan(400);

  // Natural dimensions confirm the browser actually decoded the image
  const naturalWidth = await cover.evaluate(
    (el) => (el as HTMLImageElement).naturalWidth,
  );
  expect(naturalWidth, 'cover image should have decoded pixels').toBeGreaterThan(0);
}

/** Assert an API response exposes the expected JSON shape. */
export async function expectJsonShape<T extends object>(
  response: APIResponse,
  shape: (body: unknown) => body is T,
  message = 'response JSON did not match expected shape',
): Promise<T> {
  expect(response.ok(), `response status ${response.status()}`).toBeTruthy();
  const body = (await response.json()) as unknown;
  if (!shape(body)) {
    throw new Error(`${message}: ${JSON.stringify(body).slice(0, 300)}`);
  }
  return body;
}

/* ------------------------------------------------------------------ */
/*  Type guards                                                        */
/* ------------------------------------------------------------------ */

export function isCoversPayload(
  body: unknown,
): body is { slug: string; covers: unknown[] } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'slug' in body &&
    'covers' in body &&
    Array.isArray((body as { covers: unknown }).covers)
  );
}

export interface RatingsSummary {
  average: number;
  count: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

export function isRatingsPayload(
  body: unknown,
): body is {
  ratings: unknown[];
  summary: RatingsSummary;
  myRating: unknown;
} {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.ratings)) return false;
  if (typeof b.summary !== 'object' || b.summary === null) return false;
  const s = b.summary as Record<string, unknown>;
  if (typeof s.average !== 'number') return false;
  if (typeof s.count !== 'number') return false;
  if (typeof s.distribution !== 'object' || s.distribution === null) return false;
  return true;
}
