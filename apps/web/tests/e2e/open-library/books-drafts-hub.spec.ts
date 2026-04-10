/**
 * Drafts hub — /books/drafts
 *
 * Validates the multi-book listing page: title, book cards, cover imagery,
 * author bylines, and navigation into individual draft detail pages.
 */

import { test, expect } from '@playwright/test';
import {
  KNOWN_BOOKS,
  gotoDraftsHub,
  expectCoverLoaded,
} from '../helpers/open-library';

test.describe('books drafts hub', () => {
  test('renders the Drafts heading and Open Library eyebrow', async ({ page }) => {
    await gotoDraftsHub(page);

    // Eyebrow label identifies the section
    await expect(page.getByText('Arcanea Open Library').first()).toBeVisible();

    // Primary H1
    await expect(
      page.getByRole('heading', { name: /^Drafts$/, level: 1 }),
    ).toBeVisible();
  });

  test('lists all three seeded draft books with titles and author bylines', async ({
    page,
  }) => {
    await gotoDraftsHub(page);

    for (const book of KNOWN_BOOKS) {
      // Card is a <Link> wrapping the h2 title
      const card = page.locator(`a[href="/books/drafts/${book.slug}"]`).first();
      await expect(card, `card for ${book.slug}`).toBeVisible();

      // Title within the card
      await expect(
        card.getByRole('heading', { name: book.title, level: 2 }),
      ).toBeVisible();

      // At least one author badge should be present on the card
      // (authors render as <span> chips — we just assert >= 1 exists inside the card)
      const authorChips = card.locator('span', {
        hasText: /·/, // bylines render as "Name · role"
      });
      expect(
        await authorChips.count(),
        `author byline chip count for ${book.slug}`,
      ).toBeGreaterThan(0);

      // Cover image exists and renders
      await expectCoverLoaded(page, book.slug);
    }
  });

  test('navigates to The Forge of Ruin detail page when its card is clicked', async ({
    page,
  }) => {
    await gotoDraftsHub(page);

    await page.locator('a[href="/books/drafts/forge-of-ruin"]').first().click();
    await expect(page).toHaveURL(/\/books\/drafts\/forge-of-ruin$/);
    await expect(
      page.getByRole('heading', { name: 'The Forge of Ruin', level: 1 }),
    ).toBeVisible();
  });

  test('back navigation and Tides of Silence card works', async ({ page }) => {
    await gotoDraftsHub(page);

    // First into Forge of Ruin
    await page.locator('a[href="/books/drafts/forge-of-ruin"]').first().click();
    await expect(page).toHaveURL(/\/books\/drafts\/forge-of-ruin$/);

    // Browser back should return us to the hub
    await page.goBack();
    await expect(page).toHaveURL(/\/books\/drafts$/);

    // Click Tides of Silence
    await page
      .locator('a[href="/books/drafts/tides-of-silence"]')
      .first()
      .click();
    await expect(page).toHaveURL(/\/books\/drafts\/tides-of-silence$/);
    await expect(
      page.getByRole('heading', { name: 'The Tides of Silence', level: 1 }),
    ).toBeVisible();
  });
});
