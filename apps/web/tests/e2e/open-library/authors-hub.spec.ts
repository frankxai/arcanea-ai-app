/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Authors hub — /authors
 *
 * Validates the public authors index: heading, eyebrow, and at least one
 * author card derived from book/*\/book.yaml.
 */

import { test, expect } from '@playwright/test';

test.describe('authors hub', () => {
  test('renders the Authors heading and Open Library eyebrow', async ({ page }) => {
    await page.goto('/authors');

    await expect(page.getByText('Arcanea Open Library').first()).toBeVisible();

    await expect(
      page.getByRole('heading', { name: /^Authors$/, level: 1 }),
    ).toBeVisible();
  });

  test('lists at least one author derived from book manifests', async ({ page }) => {
    await page.goto('/authors');

    // FrankX is the creator on every seeded book — must appear.
    const frankxLink = page.getByRole('link', { name: /FrankX/i }).first();
    await expect(frankxLink).toBeVisible();
  });

  test('back link returns to drafts', async ({ page }) => {
    await page.goto('/authors');
    const backLink = page.getByRole('link', { name: /Drafts/i }).first();
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/books/drafts');
  });
});
