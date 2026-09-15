import { test, expect } from '@playwright/test';

const artifactDir = 'C:/Users/frank/.gemini/antigravity/brain/4ca61e1f-bd99-4d20-9e53-6e51bd5d5ec8';

async function scrollPageSlowly(page: any) {
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  let currentScroll = 0;
  const scrollStep = 350;
  while (currentScroll < scrollHeight) {
    await page.evaluate((y: number) => window.scrollTo(0, y), currentScroll);
    await page.waitForTimeout(100);
    currentScroll += scrollStep;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
}

test.describe('visual experience capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('capture homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('#what-arcanea-does', { state: 'attached', timeout: 15000 });
    await scrollPageSlowly(page);
    await page.screenshot({ path: `${artifactDir}/homepage.png`, fullPage: true });
  });

  test('capture library hub', async ({ page }) => {
    await page.goto('/books/drafts');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 });
    await scrollPageSlowly(page);
    await page.screenshot({ path: `${artifactDir}/library.png`, fullPage: true });
  });

  test('capture book detail', async ({ page }) => {
    await page.goto('/books/drafts/forge-of-ruin');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 });
    await scrollPageSlowly(page);
    await page.screenshot({ path: `${artifactDir}/book-detail.png`, fullPage: true });
  });

  test('capture skills marketplace', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 });
    await scrollPageSlowly(page);
    await page.screenshot({ path: `${artifactDir}/marketplace.png`, fullPage: true });

    // Grab first skill card link to navigate to detail
    const firstCard = page.locator('a[href^="/skills/"]').first();
    const href = await firstCard.getAttribute('href');
    if (href) {
      await page.goto(href);
      await page.waitForLoadState('domcontentloaded');
      await scrollPageSlowly(page);
      await page.screenshot({ path: `${artifactDir}/skill-detail.png`, fullPage: true });
    }
  });

  test('capture worlds page', async ({ page }) => {
    await page.goto('/worlds');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('h1', { state: 'visible', timeout: 15000 });
    await scrollPageSlowly(page);
    await page.screenshot({ path: `${artifactDir}/worlds.png`, fullPage: true });
  });
});
