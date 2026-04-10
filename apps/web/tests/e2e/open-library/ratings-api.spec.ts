/**
 * Ratings API — /api/books/[slug]/ratings
 *
 * Contract tests for the ratings endpoint. Auth-gated POST/PATCH/DELETE
 * are covered in smoke form (401 expectation). Full happy-path creation
 * is skipped until a test user fixture exists.
 *
 * Guardian review POST paths are also skipped — they spin up LLM calls
 * which are out of scope for a deterministic E2E run.
 */

import { test, expect } from '@playwright/test';
import {
  KNOWN_BOOKS,
  isRatingsPayload,
  type RatingsSummary,
} from '../helpers/open-library';

test.describe('ratings API', () => {
  test('GET returns a ratings payload with a well-formed summary', async ({
    request,
  }) => {
    const response = await request.get('/api/books/forge-of-ruin/ratings');

    // The route always returns <500 even if the DB is unreachable
    // (it falls back to an "unavailable" payload with status 200).
    expect(response.status()).toBeLessThan(500);

    if (response.ok()) {
      const body = (await response.json()) as unknown;
      expect(isRatingsPayload(body)).toBe(true);

      if (isRatingsPayload(body)) {
        const summary = body.summary as RatingsSummary;
        expect(summary).toHaveProperty('average');
        expect(summary).toHaveProperty('count');
        expect(summary).toHaveProperty('distribution');

        // Distribution must have all 5 star buckets
        expect(summary.distribution).toHaveProperty('1');
        expect(summary.distribution).toHaveProperty('2');
        expect(summary.distribution).toHaveProperty('3');
        expect(summary.distribution).toHaveProperty('4');
        expect(summary.distribution).toHaveProperty('5');

        // When count === 0, average must be 0
        if (summary.count === 0) {
          expect(summary.average).toBe(0);
        }
      }
    }
  });

  test('POST without authentication returns 401', async ({ request }) => {
    const response = await request.post('/api/books/forge-of-ruin/ratings', {
      data: { stars: 5, review: 'e2e unauth POST' },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('POST with out-of-range stars returns 400 (or 401 if auth runs first)', async ({
    request,
  }) => {
    const response = await request.post('/api/books/forge-of-ruin/ratings', {
      data: { stars: 99, review: 'invalid' },
    });
    // Validation happens BEFORE the auth check in the route, so a 400 is
    // the most likely response; some deployments may order this differently.
    expect([400, 401, 403]).toContain(response.status());
  });

  test('PATCH without authentication returns 401', async ({ request }) => {
    const response = await request.patch('/api/books/forge-of-ruin/ratings', {
      data: { stars: 4 },
    });
    expect([401, 403, 404]).toContain(response.status());
  });

  test('DELETE without authentication returns 401', async ({ request }) => {
    const response = await request.delete('/api/books/forge-of-ruin/ratings');
    expect([401, 403, 404]).toContain(response.status());
  });

  test('all three seeded books support the ratings endpoint', async ({
    request,
  }) => {
    for (const book of KNOWN_BOOKS) {
      const response = await request.get(`/api/books/${book.slug}/ratings`);
      expect(
        response.status(),
        `${book.slug} ratings GET`,
      ).toBeLessThan(500);

      if (response.ok()) {
        const body = (await response.json()) as unknown;
        expect(
          isRatingsPayload(body),
          `${book.slug} payload shape`,
        ).toBe(true);
      }
    }
  });

  test('GET on a non-existent book returns 404 or unavailable payload', async ({
    request,
  }) => {
    const response = await request.get(
      '/api/books/definitely-not-a-real-book/ratings',
    );
    // The route returns 404 when the slug doesn't resolve, or 200 with
    // an "unavailable" fallback when the DB errors.
    expect([200, 404]).toContain(response.status());
  });

  // -- Skipped: requires authenticated test fixture --
  test.skip('authenticated POST creates a rating', async () => {
    // Needs a Supabase test user with a valid session cookie.
  });

  // -- Skipped: guardian review triggers an LLM call --
  test.skip('POST /api/books/[slug]/guardian-review triggers a review', async () => {
    // Out of scope for deterministic E2E — requires LLM access.
  });
});
