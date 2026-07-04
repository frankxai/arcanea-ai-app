import { test } from '@playwright/test';

test('capture homepage screenshot', async ({ page }) => {
  // Set viewport to a realistic desktop size
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  // Wait for lazy-loaded V3BelowFold component to mount
  await page.waitForSelector('#what-arcanea-does', { state: 'attached', timeout: 15000 });

  // Scroll down slowly to trigger intersection observers for framer-motion whileInView
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  let currentScroll = 0;
  const scrollStep = 300; // scroll 300px at a time
  
  while (currentScroll < scrollHeight) {
    await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
    await page.waitForTimeout(150); // wait for dynamic layouts and animations
    currentScroll += scrollStep;
  }

  // Scroll back to top to trigger any top-fold entrance animations if needed
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Scroll back to the bottom just to verify all triggers are fully open
  currentScroll = 0;
  while (currentScroll < scrollHeight) {
    await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
    await page.waitForTimeout(100);
    currentScroll += scrollStep;
  }
  
  await page.waitForTimeout(2000); // final settling time

  await page.screenshot({
    path: 'C:/Users/frank/.gemini/antigravity/brain/4ca61e1f-bd99-4d20-9e53-6e51bd5d5ec8/homepage.png',
    fullPage: true
  });
});
