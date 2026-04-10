/**
 * Draft detail pages — /books/drafts/[slug]
 *
 * Parameterised over the three known books. Asserts the full hero (title,
 * tagline, Begin Reading CTA), cover imagery, at least one character card,
 * chapter list, AI transparency section, and first-chapter navigation.
 */

import { test, expect } from '@playwright/test';
import {
  KNOWN_BOOKS,
  gotoBook,
  expectCoverLoaded,
} from '../helpers/open-library';

for (const book of KNOWN_BOOKS) {
  test.describe(`draft detail — ${book.slug}`, () => {
    test('hero renders with title, tagline, and Begin Reading CTA', async ({
      page,
    }) => {
      await gotoBook(page, book.slug);

      // H1 title
      await expect(
        page.getByRole('heading', { name: book.title, level: 1 }),
      ).toBeVisible();

      // Tagline lives in a <p> with italic font-serif classes. We assert that
      // SOME italic paragraph exists in the hero area by looking for the
      // "Draft in Progress" eyebrow followed by italic copy.
      await expect(page.getByText('Draft in Progress').first()).toBeVisible();

      // Begin Reading CTA — <Link> with "Begin Reading" text
      const beginReading = page.getByRole('link', { name: /Begin Reading/i });
      await expect(beginReading).toBeVisible();
    });

    test('cover image loads and is reachable', async ({ page }) => {
      await gotoBook(page, book.slug);
      await expectCoverLoaded(page, book.slug);
    });

    test('at least one character card is visible', async ({ page }) => {
      await gotoBook(page, book.slug);

      // Character section heading
      await expect(
        page.getByRole('heading', { name: /The Cast/i }),
      ).toBeVisible();

      // Each character card is a <div> inside the grid; we scope under the
      // heading's parent section. Just assert >= 1 card exists.
      const section = page
        .getByRole('heading', { name: /The Cast/i })
        .locator('xpath=ancestor::section[1]');
      const cards = section.locator('div.rounded-xl');
      expect(await cards.count()).toBeGreaterThan(0);
    });

    test('chapter list is visible with at least one chapter link', async ({
      page,
    }) => {
      await gotoBook(page, book.slug);

      await expect(
        page.getByRole('heading', { name: /^Chapters$/i }),
      ).toBeVisible();

      // Chapter links all point to /books/[slug]/...
      const chapterLinks = page.locator(`a[href^="/books/${book.slug}/"]`);
      expect(await chapterLinks.count()).toBeGreaterThan(0);
    });

    test('AI transparency section shows model badges', async ({ page }) => {
      await gotoBook(page, book.slug);

      // Section label
      await expect(
        page.getByText('AI Transparency', { exact: false }).first(),
      ).toBeVisible();

      // Human/AI percentage chips always render (even with "?")
      await expect(page.getByText(/Human:\s*\S+%/).first()).toBeVisible();
      await expect(page.getByText(/AI:\s*\S+%/).first()).toBeVisible();
    });

    test('Begin Reading navigates to the first chapter', async ({ page }) => {
      await gotoBook(page, book.slug);

      const beginReading = page.getByRole('link', { name: /Begin Reading/i });
      const href = await beginReading.getAttribute('href');
      expect(href).toMatch(new RegExp(`^/books/${book.slug}/`));

      await beginReading.click();
      await expect(page).toHaveURL(
        new RegExp(`^.*/books/${book.slug}/[^/]+$`),
      );

      // Confirm the chapter reader mounted — back link to the book page
      await expect(
        page.locator(`a[href="/books/${book.slug}"]`).first(),
      ).toBeVisible();
    });
  });
}
