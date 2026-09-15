import { expect, test } from '@playwright/test';

test.describe('Genesis activation', () => {
  test('homepage Answer the call card opens Genesis with the starter prompt', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Answer the call/i }).click();

    await expect(page).toHaveURL(/\/genesis\?prompt=/);
    await expect(page.getByRole('heading', { name: /Turn the call into proof/i })).toBeVisible();
    await expect(page.getByLabel('The Call')).toHaveValue(/Gift Object/);
  });

  test('direct Genesis flow generates, saves, and exports a proof record', async ({ page }) => {
    const prompt =
      'A coastal school for young creators turns synthetic confusion into source-grounded stories and public proof.';

    await page.goto(`/genesis?prompt=${encodeURIComponent(prompt)}`);

    await expect(page.getByRole('heading', { name: /Turn the call into proof/i })).toBeVisible();
    await expect(page.getByLabel('The Call')).toHaveValue(prompt);

    await page.getByRole('button', { name: /Creative amnesia/i }).click();
    await page.getByRole('button', { name: /Publishing/i }).click();
    await page.getByRole('button', { name: /Generate Gift/i }).click();

    await expect(page.getByText('Gift Object', { exact: true })).toBeVisible();
    await expect(page.getByText('World Seed', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The First Trial' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Genesis Proof Relic/i })).toBeVisible();
    await expect(page.getByText('Collectible readiness', { exact: true })).toBeVisible();
    await expect(page.getByText('Rights Review Required', { exact: true })).toBeVisible();
    await expect(page.getByText('Storybook seed', { exact: true })).toBeVisible();
    await expect(page.getByText('Stewardship record', { exact: true })).toBeVisible();
    await expect(page.getByText('Canon status', { exact: true })).toBeVisible();
    await expect(page.getByText('Rights state', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: /Save proof stub/i }).click();
    const saveStatus = page.locator('[aria-live="polite"]').filter({ hasText: /Saved arcanea-proof-/i });
    await expect(saveStatus).toBeVisible();
    await expect(saveStatus).toContainText(/Repo export contains 8 files/i);

    const sisMemory = page.getByText(/Saved as arcanea-proof-/i);
    await expect(sisMemory).toContainText(/world\.arcanea\.json/i);
    await expect(sisMemory).toContainText(/collectible-metadata\.json/i);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export brief/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/genesis-proof\.md$/);
  });
});
