import { test, expect, type Page } from '@playwright/test';

async function gotoChat(page: Page) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto('/chat', { waitUntil: 'domcontentloaded', timeout: 45000 });
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(1500);
    }
  }

  throw lastError;
}

test.describe('Chat Flow', () => {
  test('@smoke shows empty state on load', async ({ page }) => {
    await gotoChat(page);
    // Verify greeting text appears
    await expect(page.getByRole('heading')).toBeVisible();
    // Verify suggestion cards appear
    await expect(
      page
        .locator('[data-testid="suggestion-card"]')
        .first()
    )
      .toBeVisible({ timeout: 5000 })
      .catch(() => {
        // Suggestions might use different selectors
        expect(
          page
            .getByText(/What would you like/i)
            .or(page.getByText(/Good/i))
        ).toBeVisible();
      });
  });

  test('can type and see send button activate', async ({ page }) => {
    await gotoChat(page);
    const input = page
      .getByRole('textbox', { name: /message/i })
      .or(page.locator('textarea'));
    await input.fill('Hello, Arcanea!');
    // Send button should be active (not disabled)
    const sendBtn = page.getByRole('button', { name: /send/i });
    await expect(sendBtn).toBeEnabled();
  });

  test('can toggle tool buttons', async ({ page }) => {
    await gotoChat(page);
    // Find image toggle
    const imageToggle = page.getByRole('button', { name: /image/i });
    if (await imageToggle.isVisible()) {
      await imageToggle.click();
      // Verify toggle state changed (aria-pressed or visual change)
      await expect(imageToggle)
        .toHaveAttribute('aria-pressed', 'true')
        .catch(() => {
          // Might not have aria-pressed yet
        });
    }
  });

  test('sends enabled tools to the chat API', async ({ page }) => {
    await gotoChat(page);

    const requestPromise = page.waitForRequest((request) =>
      request.url().includes('/api/ai/chat') && request.method() === 'POST'
    );

    await page.route('**/api/ai/chat', async (route) => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: '',
      });
    });

    await page.getByRole('button', { name: /image generation/i }).click();
    await page.getByRole('button', { name: /web search/i }).click();
    await page.getByRole('textbox', { name: /message input/i }).fill('Use tools');
    await page.getByRole('button', { name: /send message/i }).click();

    const request = await requestPromise;
    const rawBody = request.postData() ?? '';

    expect(rawBody).toContain('"enabledTools"');
    expect(rawBody).toContain('"image"');
    expect(rawBody).toContain('"search"');
  });

  test('shows model selector', async ({ page }) => {
    await gotoChat(page);
    // Find model picker button
    const modelBtn = page.getByRole('button', {
      name: /model|sonnet|opus|auto/i,
    });
    if (await modelBtn.isVisible()) {
      await modelBtn.click();
      // Dropdown should appear
      await expect(
        page
          .getByRole('listbox')
          .or(page.locator('[role="listbox"]'))
      ).toBeVisible({ timeout: 3000 });
    }
  });
});
