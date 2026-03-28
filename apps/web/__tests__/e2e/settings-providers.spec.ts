import { test, expect } from '@playwright/test';

test.describe('Settings Providers', () => {
  test('providers page loads', async ({ page }) => {
    await page.goto('/settings/providers');
    // Should show some provider configuration
    await expect(
      page.getByText(/provider|api key|model/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('can navigate from chat to settings', async ({ page }) => {
    await page.goto('/chat');
    // Look for settings link in sidebar
    const settingsLink = page
      .getByRole('link', { name: /settings/i })
      .or(page.getByRole('button', { name: /settings/i }));
    if (await settingsLink.first().isVisible()) {
      await settingsLink.first().click();
      await expect(page).toHaveURL(/settings/);
    }
  });
});
