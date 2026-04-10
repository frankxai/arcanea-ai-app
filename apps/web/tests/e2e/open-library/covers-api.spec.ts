/**
 * Covers API — /api/books/covers
 *
 * Pure API contract tests (no UI). Verifies:
 *   - GET with valid slug returns { slug, covers: [] }
 *   - GET without slug returns 400
 *   - GET with unknown slug returns a non-5xx response with an empty array
 *   - POST without auth returns 401
 *   - PATCH without auth returns 401
 *
 * Authenticated write paths are skipped until a test user fixture exists.
 */

import { test, expect } from '@playwright/test';
import { isCoversPayload } from '../helpers/open-library';

test.describe('covers API', () => {
  test('GET with valid slug returns 200 and a covers array', async ({
    request,
  }) => {
    const response = await request.get('/api/books/covers?slug=forge-of-ruin');
    expect(response.status()).toBe(200);

    const body = (await response.json()) as unknown;
    expect(isCoversPayload(body)).toBe(true);

    if (isCoversPayload(body)) {
      expect(body.slug).toBe('forge-of-ruin');
      expect(Array.isArray(body.covers)).toBe(true);
    }
  });

  test('GET without slug parameter returns 400', async ({ request }) => {
    const response = await request.get('/api/books/covers');
    expect(response.status()).toBe(400);
  });

  test('GET with an unknown slug returns empty covers (no 500)', async ({
    request,
  }) => {
    const response = await request.get(
      '/api/books/covers?slug=absolutely-not-a-real-book',
    );
    // Must not be a server error
    expect(response.status()).toBeLessThan(500);

    if (response.ok()) {
      const body = (await response.json()) as unknown;
      expect(isCoversPayload(body)).toBe(true);
      if (isCoversPayload(body)) {
        expect(body.covers.length).toBe(0);
      }
    }
  });

  test('POST without authentication returns 401', async ({ request }) => {
    const response = await request.post('/api/books/covers', {
      data: {
        bookSlug: 'forge-of-ruin',
        storageTier: 'git',
        storagePath: '/covers/test.png',
        publicUrl: '/covers/test.png',
        modelId: 'nb2',
        modelTier: 'nb2',
        prompt: 'e2e test cover',
      },
    });
    // The route returns 401 for unauthenticated writes; some middleware
    // configurations may respond with 403 instead.
    expect([401, 403]).toContain(response.status());
  });

  test('PATCH without authentication returns 401', async ({ request }) => {
    const response = await request.patch('/api/books/covers', {
      data: { slug: 'forge-of-ruin', version: 1 },
    });
    expect([401, 403]).toContain(response.status());
  });

  test('all three seeded books have a covers endpoint', async ({ request }) => {
    const slugs = ['forge-of-ruin', 'tides-of-silence', 'heart-of-pyrathis'];
    for (const slug of slugs) {
      const response = await request.get(`/api/books/covers?slug=${slug}`);
      expect(response.status(), `${slug} covers GET`).toBeLessThan(500);
    }
  });

  // -- Skipped: requires authenticated test fixture & may call LLM pipelines --
  test.skip('authenticated POST registers a new cover', async () => {
    // Requires a test user with a valid Supabase session cookie.
  });
});
