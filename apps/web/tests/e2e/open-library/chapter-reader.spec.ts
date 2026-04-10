/**
 * Chapter reader — /books/[bookId]/[chapterId]
 *
 * Tests the full reading experience: content rendering, the floating
 * reading toolbar (theme / font size / bookmark), keyboard navigation,
 * and back-link behaviour. Uses `forge-of-ruin/the-forty-seven-names`
 * as the canonical fixture.
 */

import { test, expect } from '@playwright/test';
import { gotoChapter } from '../helpers/open-library';

const BOOK_ID = 'forge-of-ruin';
const CHAPTER_ID = 'the-forty-seven-names';

test.describe('chapter reader', () => {
  test('renders chapter title and non-empty content', async ({ page }) => {
    await gotoChapter(page, BOOK_ID, CHAPTER_ID);

    // Title renders as an <h1> inside the header — its exact text depends
    // on the first `# Chapter …` heading in the markdown. We assert there
    // is an <h1> with non-trivial text.
    const h1 = page.getByRole('heading', { level: 1 }).first();
    await expect(h1).toBeVisible();
    const titleText = (await h1.textContent())?.trim() ?? '';
    expect(titleText.length).toBeGreaterThan(3);

    // The rendered prose article must exist and contain text content.
    const article = page.locator('article').first();
    await expect(article).toBeVisible();
    // Wait for the dynamic markdown component to hydrate
    await expect
      .poll(async () => (await article.textContent())?.length ?? 0, {
        timeout: 10_000,
      })
      .toBeGreaterThan(200);
  });

  test('reading toolbar is visible with theme, font size, and bookmark controls', async ({
    page,
  }) => {
    await gotoChapter(page, BOOK_ID, CHAPTER_ID);

    // Theme cycle button
    await expect(
      page.getByRole('button', { name: /Cycle reading theme/i }),
    ).toBeVisible();

    // Font size controls
    await expect(
      page.getByRole('button', { name: /Increase font size/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Decrease font size/i }),
    ).toBeVisible();

    // Bookmark toggle (label switches between "Bookmark chapter" and
    // "Remove bookmark" depending on state)
    await expect(
      page.getByRole('button', { name: /Bookmark chapter|Remove bookmark/i }),
    ).toBeVisible();
  });

  test('cycling the theme changes the page background color', async ({
    page,
  }) => {
    await gotoChapter(page, BOOK_ID, CHAPTER_ID);

    // Outermost wrapper div receives the theme background classes
    const root = page.locator('div.min-h-screen').first();

    const before = await root.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );

    await page.getByRole('button', { name: /Cycle reading theme/i }).click();

    // Wait for the class-driven style to flip
    await expect
      .poll(
        async () =>
          await root.evaluate(
            (el) => window.getComputedStyle(el).backgroundColor,
          ),
        { timeout: 5_000 },
      )
      .not.toBe(before);
  });

  test('increasing the font size makes the prose text larger', async ({
    page,
  }) => {
    await gotoChapter(page, BOOK_ID, CHAPTER_ID);

    // The prose container carries the text-size class
    const prose = page.locator('article > div').first();
    const initialSize = await prose.evaluate(
      (el) => window.getComputedStyle(el).fontSize,
    );

    await page.getByRole('button', { name: /Increase font size/i }).click();

    await expect
      .poll(
        async () =>
          await prose.evaluate(
            (el) => parseFloat(window.getComputedStyle(el).fontSize),
          ),
        { timeout: 5_000 },
      )
      .toBeGreaterThan(parseFloat(initialSize));
  });

  test('ArrowRight keyboard navigation advances to the next chapter', async ({
    page,
  }) => {
    await gotoChapter(page, BOOK_ID, CHAPTER_ID);

    // Ensure focus is on the body so the keydown listener fires
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('ArrowRight');

    // URL should change to the next chapter (still under /books/forge-of-ruin/*)
    await expect(page).toHaveURL(
      new RegExp(`^.*/books/${BOOK_ID}/(?!${CHAPTER_ID}$)[^/]+$`),
    );
  });

  test('back link returns to the book page', async ({ page }) => {
    await gotoChapter(page, BOOK_ID, CHAPTER_ID);

    // Breadcrumb link at the top points back to /books/[bookId]
    const backLink = page.locator(`a[href="/books/${BOOK_ID}"]`).first();
    await expect(backLink).toBeVisible();
    await backLink.click();

    await expect(page).toHaveURL(new RegExp(`/books/${BOOK_ID}$`));
  });
});
