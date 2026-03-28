import { test, expect } from '@playwright/test';

test.describe('Chat Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('sidebar is hidden on mobile by default', async ({ page }) => {
    await page.goto('/chat');
    // Sidebar search should not be visible
    await expect(
      page.getByPlaceholder(/search conversations/i)
    ).not.toBeVisible();
  });

  test('mobile sidebar opens as overlay', async ({ page }) => {
    await page.goto('/chat');
    const menuBtn = page
      .getByRole('button', { name: /sidebar|menu|toggle/i })
      .first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      // Wait for animation
      await page.waitForTimeout(300);
      // Sidebar content should be visible
      await expect(
        page.getByRole('button', { name: /new chat/i })
      ).toBeVisible({ timeout: 3000 });
    }
  });

  test('input bar is visible and functional', async ({ page }) => {
    await page.goto('/chat');
    const input = page.getByRole('textbox').or(page.locator('textarea'));
    await expect(input).toBeVisible();
    await input.fill('Test message');
    await expect(
      page.getByRole('button', { name: /send/i })
    ).toBeEnabled();
  });

  test('chat/imagine tabs are visible', async ({ page }) => {
    await page.goto('/chat');
    await expect(
      page.getByRole('tab', { name: /chat/i })
    ).toBeVisible();
    await expect(
      page.getByRole('tab', { name: /imagine/i })
    ).toBeVisible();
  });
});
