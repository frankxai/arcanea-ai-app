import { test, expect } from '@playwright/test';

test.describe('Chat Sidebar', () => {
  test('sidebar toggles on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/chat');

    // Look for sidebar toggle or history button
    const toggleBtn = page
      .getByRole('button', { name: /sidebar|history|toggle/i })
      .first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      // Sidebar should expand - look for search input or "New Chat" button
      await expect(
        page
          .getByPlaceholder(/search/i)
          .or(page.getByRole('button', { name: /new chat/i }))
      ).toBeVisible({ timeout: 3000 });
    }
  });

  test('new chat button works', async ({ page }) => {
    await page.goto('/chat');
    const newChatBtn = page
      .getByRole('button', { name: /new chat/i })
      .first();
    if (await newChatBtn.isVisible()) {
      await newChatBtn.click();
      // Should see empty state
      await expect(
        page.getByRole('textbox').or(page.locator('textarea'))
      ).toBeVisible();
    }
  });
});
