const path = require("node:path");
const { createRequire } = require("node:module");

const requireFromWeb = createRequire(
  path.join(process.cwd(), "package.json"),
);
const { chromium, devices } = requireFromWeb("@playwright/test");

const [url, desktopPath, mobilePath, focusPath, firstImagePath] =
  process.argv.slice(2);
const mediaSelector =
  '[data-vwe-thumbnail], img[src*="arcanea-world-engine"]';
const expectedTitle =
  process.env.VWE_EXPECTED_TITLE || "World Tower Social Crop";
const expectedSlug =
  process.env.VWE_EXPECTED_SLUG || "arc-visual-025-world-tower-social-crop";

async function waitForVweBackgrounds(page) {
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.querySelectorAll("[data-vwe-thumbnail]")).map(
        (node) =>
          new Promise((resolve) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = resolve;
            image.src = node.getAttribute("data-vwe-thumbnail");
          }),
      ),
    ),
  );
  await page.evaluate(() =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    ),
  );
}

if (!url || !desktopPath || !mobilePath) {
  console.error(
    "Usage: node gallery-visual-check.cjs <url> <desktop-path> <mobile-path> [focus-path] [first-image-path]",
  );
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1600 },
    deviceScaleFactor: 1,
  });
  const desktopResponse = await desktop.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await desktop.evaluate(
    ({ title, slug }) => {
      window.__vweExpectedTitle = title;
      window.__vweExpectedSlug = slug;
    },
    { title: expectedTitle, slug: expectedSlug },
  );
  await desktop.waitForSelector(mediaSelector, { timeout: 30000 });
  await desktop.evaluate(() =>
    Promise.all(
      Array.from(document.querySelectorAll('img[src*="arcanea-world-engine"]'))
        .map((img) => img.decode().catch(() => undefined)),
    ),
  );
  await desktop.evaluate(() =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    ),
  );
  await waitForVweBackgrounds(desktop);
  await desktop.screenshot({ path: desktopPath, fullPage: true });
  if (focusPath) {
    await desktop.getByText(expectedTitle, { exact: true }).scrollIntoViewIfNeeded();
    await desktop.waitForTimeout(1000);
    await desktop.waitForFunction(() => {
      const images = Array.from(
        document.querySelectorAll('[data-vwe-thumbnail]'),
      );
      return images.some((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.width > 100 &&
          rect.height > 80 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        );
      });
    });
    await desktop.evaluate(() =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
    );
    await waitForVweBackgrounds(desktop);
    await desktop.screenshot({ path: focusPath, fullPage: false });
  }
  if (firstImagePath) {
    const firstImage = desktop.locator(
      `[data-vwe-thumbnail*="${expectedSlug}"], img[src*="${expectedSlug}"]`,
    ).first();
    await firstImage.scrollIntoViewIfNeeded();
    await desktop.waitForTimeout(1000);
    await desktop.evaluate(() =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
    );
    await waitForVweBackgrounds(desktop);
    await firstImage.screenshot({ path: firstImagePath });
  }
  const desktopData = await desktop.evaluate(() => ({
    imageCount: document.querySelectorAll(
      '[data-vwe-thumbnail], img[src*="arcanea-world-engine"]',
    ).length,
    firstImage: (() => {
      const image = document.querySelector(
        `[data-vwe-thumbnail*="${window.__vweExpectedSlug}"], img[src*="${window.__vweExpectedSlug}"]`,
      );
      if (!image) return null;
      const rect = image.getBoundingClientRect();
      const style = getComputedStyle(image);
      let averageRgb = null;
      try {
        if (!("naturalWidth" in image)) throw new Error("background-image-layer");
        const canvas = document.createElement("canvas");
        canvas.width = 12;
        canvas.height = 12;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 12, 12);
        const data = ctx.getImageData(0, 0, 12, 12).data;
        const total = data.length / 4;
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
        }
        averageRgb = {
          r: Math.round(r / total),
          g: Math.round(g / total),
          b: Math.round(b / total),
          a: Math.round(a / total),
        };
      } catch (error) {
        averageRgb = { error: String(error) };
      }
      return {
        complete: "complete" in image ? image.complete : true,
        naturalWidth: "naturalWidth" in image ? image.naturalWidth : null,
        naturalHeight: "naturalHeight" in image ? image.naturalHeight : null,
        src: image.getAttribute("src") ?? image.getAttribute("data-vwe-thumbnail"),
        currentSrc: "currentSrc" in image ? image.currentSrc : null,
        srcset: image.getAttribute("srcset"),
        backgroundImage: style.backgroundImage,
        averageRgb,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        opacity: style.opacity,
        display: style.display,
        visibility: style.visibility,
        zIndex: style.zIndex,
      };
    })(),
    decodedImageCount: Array.from(
      document.querySelectorAll('img[src*="arcanea-world-engine"]'),
    ).filter((img) => img.complete && img.naturalWidth > 0).length,
    visibleDecodedImageCount: Array.from(
      document.querySelectorAll('[data-vwe-thumbnail], img[src*="arcanea-world-engine"]'),
    ).filter((node) => {
      const rect = node.getBoundingClientRect();
      return (
        rect.width > 100 &&
        rect.height > 80 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      );
    }).length,
    hasTopCandidate: document.body.innerText.includes(
      window.__vweExpectedTitle,
    ),
    hasQaSignal:
      document.body.innerText.includes("QA 29") ||
      document.body.innerText.includes("Visual QA"),
  }));
  console.log(
    JSON.stringify({
      viewport: "desktop",
      status: desktopResponse && desktopResponse.status(),
      ...desktopData,
    }),
  );
  await desktop.close();

  const mobile = await browser.newPage({ ...devices["iPhone 15 Pro"] });
  const mobileResponse = await mobile.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await mobile.evaluate(
    ({ title, slug }) => {
      window.__vweExpectedTitle = title;
      window.__vweExpectedSlug = slug;
    },
    { title: expectedTitle, slug: expectedSlug },
  );
  await mobile.waitForSelector(mediaSelector, { timeout: 30000 });
  await waitForVweBackgrounds(mobile);
  await mobile.screenshot({ path: mobilePath, fullPage: true });
  const mobileData = await mobile.evaluate(() => ({
    imageCount: document.querySelectorAll(
      '[data-vwe-thumbnail], img[src*="arcanea-world-engine"]',
    ).length,
    hasTopCandidate: document.body.innerText.includes(
      window.__vweExpectedTitle,
    ),
  }));
  console.log(
    JSON.stringify({
      viewport: "mobile",
      status: mobileResponse && mobileResponse.status(),
      ...mobileData,
    }),
  );

  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
