import { expect, test } from '@playwright/test';

test.describe('/lore/ecology', () => {
  test('renders the Living Atlas and filters organisms', async ({ page }) => {
    await page.goto('/lore/ecology');
    await expect(
      page.getByRole('heading', { name: 'Nothing here glows without reason.' }),
    ).toBeVisible();
    await page.getByPlaceholder('Search organism, biome, signal…').fill('moth');
    await expect(page.getByText('No organisms match this lens.')).toBeVisible();
    await expect(page.getByRole('status')).toContainText(
      'Showing 0 organisms.',
    );
    await expect(page.getByRole('button', { name: /Serein Moth/ })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole('button', { name: /Choirheart Rose/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Trace the covenant.' }),
    ).toHaveCount(0);
  });

  test('keeps selection inside the filtered result set', async ({ page }) => {
    await page.goto('/lore/ecology');
    await page
      .getByPlaceholder('Search organism, biome, signal…')
      .fill('stonegrass');

    const stonegrass = page.getByRole('button', { name: /Select Stonegrass/ });
    await expect(stonegrass).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('status')).toContainText(
      'Stonegrass selected.',
    );
    await expect(
      page.getByRole('button', { name: 'Trace from Stonegrass' }),
    ).toBeVisible();
  });

  test('traces a causal covenant and opens a dossier', async ({ page }) => {
    await page.goto('/lore/ecology');
    await page
      .getByRole('button', { name: /Choirheart Rose/ })
      .first()
      .click();
    await page
      .getByRole('button', { name: /Trace from Choirheart Rose/ })
      .click();
    await expect(
      page.getByText(/Covenant traced from Choirheart Rose/),
    ).toBeAttached();
    await page.getByRole('link', { name: 'Open field dossier' }).click();
    await expect(page).toHaveURL(/\/lore\/ecology\/choirheart-rose$/);
    await expect(
      page.getByRole('heading', { name: 'Choirheart Rose' }),
    ).toBeVisible();
  });

  test('remains usable with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/lore/ecology');
    await page
      .getByRole('button', { name: /Trace from Choirheart Rose/ })
      .click();
    await expect(
      page.getByRole('heading', { name: 'Trace the covenant.' }),
    ).toBeVisible();
    const originNode = page.getByText('Origin signal').locator('..');
    await expect
      .poll(() =>
        originNode.evaluate(
          (node) => getComputedStyle(node, '::after').animationName,
        ),
      )
      .toBe('none');
  });

  test('keeps mobile details after the catalog and avoids page overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/lore/ecology');

    await expect(
      page.locator('section[aria-labelledby="garden-heading"] aside'),
    ).toBeHidden();
    await page.getByRole('button', { name: /Select Tideplant/ }).click();
    await expect(
      page.getByRole('link', { name: 'Open field dossier' }),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth,
        ),
      )
      .toBe(true);
  });

  test('withholds graph-only support dossiers and noindexes proposals', async ({
    page,
  }) => {
    await page.goto('/lore/ecology/choirheart-rose');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );

    const response = await page.goto('/lore/ecology/serein-moth');
    expect(response?.status()).toBe(404);
  });
});
