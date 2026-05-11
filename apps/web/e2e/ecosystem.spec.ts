/**
 * /ecosystem page smoke tests.
 *
 * Verifies the three-view explorer (Layered / Ten Gates / Arc ⊕ Nea),
 * the FilterBar, and the NodeDrawer interaction. Requires the Next.js
 * server (handled by playwright.config webServer).
 */

import { test, expect } from '@playwright/test';

test.describe('/ecosystem page', () => {
  test('renders view switcher with three tabs', async ({ page }) => {
    await page.goto('/ecosystem');
    await expect(page.getByRole('tab', { name: 'Layered' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Ten Gates' })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Arc.*Nea/ })).toBeVisible();
  });

  test('switching to Ten Gates renders the wheel', async ({ page }) => {
    await page.goto('/ecosystem');
    await page.getByRole('tab', { name: 'Ten Gates' }).click();
    // The center label inside the SVG wheel
    await expect(page.locator('text=Ten Gates').first()).toBeVisible();
  });

  test('clicking a node opens the drawer', async ({ page }) => {
    await page.goto('/ecosystem');
    // Wait for live explorer section to render
    await expect(page.getByRole('heading', { name: /Ecosystem Explorer/i })).toBeVisible();

    // Click the first node card in the Layered view (each card has an h3
    // containing the node name).
    const firstCard = page
      .locator('section[aria-labelledby="explorer-heading"] button:has(h3)')
      .first();
    await firstCard.click();

    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });
});
