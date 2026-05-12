import { expect, test } from '@playwright/test';

test.describe('chat entry experience', () => {
  test('hands a homepage hero prompt into the chat composer', async ({ page }) => {
    await page.route('**/api/ai/chat', async (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok' }),
        });
      }
      return route.continue();
    });

    const prompt = 'Design a harbor city built on glass reefs';

    await page.goto('/');
    await page.getByRole('textbox', { name: /Describe what you want to create/i }).fill(prompt);
    await page.getByRole('button', { name: 'Start creating in chat' }).click();

    await expect(page).toHaveURL(/\/chat/);
    await expect(page.getByRole('textbox', { name: 'Message input' })).toHaveValue(prompt);
  });

  test('renders starter prompts and hands one into the composer', async ({ page }) => {
    await page.route('**/api/ai/chat', async (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok' }),
        });
      }
      return route.continue();
    });

    await page.goto('/chat');

    await expect(page.getByRole('log', { name: 'Chat messages' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Design a magic system/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create a character/i })).toBeVisible();

    await page.getByRole('button', { name: /Design a magic system/i }).click();

    const composer = page.getByRole('textbox', { name: 'Message input' });
    await expect(composer).toBeFocused();
    await expect(composer).toHaveValue('Design a magic system');
  });
});
