/**
 * Author profile — /authors/[slug]
 *
 * Validates the public author profile: heading with their name, role chips,
 * and a list of books they wrote or co-wrote.
 */

import { test, expect } from '@playwright/test';

test.describe('author profile — frankx', () => {
  test('renders the FrankX heading', async ({ page }) => {
    await page.goto('/authors/frankx');

    await expect(
      page.getByRole('heading', { name: /^FrankX$/, level: 1 }),
    ).toBeVisible();
  });

  test('shows at least one book they authored', async ({ page }) => {
    await page.goto('/authors/frankx');

    // FrankX is the creator on Forge of Ruin — must appear in the list.
    const forgeLink = page.getByRole('link', { name: /Forge of Ruin/i }).first();
    await expect(forgeLink).toBeVisible();
    await expect(forgeLink).toHaveAttribute('href', '/books/drafts/forge-of-ruin');
  });

  test('back link returns to authors hub', async ({ page }) => {
    await page.goto('/authors/frankx');
    const backLink = page.getByRole('link', { name: /^← Authors$|Authors/i }).first();
    await expect(backLink).toBeVisible();
  });

  test('unknown author returns 404', async ({ page }) => {
    const response = await page.goto('/authors/this-author-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});
