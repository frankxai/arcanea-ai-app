const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const { verifySovereignPreview } = require("./verify-sovereign-browser.cjs");

const base = "http://127.0.0.1:3001";
const states = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  },
  {
    name: "mobile-375",
    viewport: { width: 375, height: 812 },
    reducedMotion: "no-preference",
  },
  {
    name: "reduced-motion",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  },
];

(async () => {
  fs.mkdirSync("screenshots", { recursive: true });
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(`${base}/gallery/sovereign-depths`, {
        signal: AbortSignal.timeout(5000),
      });
      ready = response.status === 200;
    } catch {}
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  assert.ok(ready, "Built Next app did not start successfully");
  const browser = await chromium.launch();
  const captures = [];
  const capture = async (page, state, name) => {
    const path = `screenshots/${name}-${state.name}.jpg`;
    await page.screenshot({ path, fullPage: false, type: "jpeg", quality: 90 });
    const bytes = fs.readFileSync(path);
    captures.push({
      path,
      viewport: state.viewport,
      reducedMotion: state.reducedMotion,
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      url: page.url(),
    });
  };
  try {
    for (const state of states) {
      const context = await browser.newContext({
        viewport: state.viewport,
        reducedMotion: state.reducedMotion,
        deviceScaleFactor: 1,
      });
      try {
        const page = await context.newPage();
        const response = await page.goto(`${base}/gallery/sovereign-depths`, {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        await verifySovereignPreview({
          page,
          context,
          base,
          state: state.name,
        });
        await capture(page, state, "collection-hero");
        await page
          .getByRole("link", { name: "Explore the collection", exact: true })
          .click();
        await page.waitForFunction(() => {
          const top = document
            .querySelector("#collection")
            .getBoundingClientRect().top;
          return top >= -2 && top <= 100;
        });
        await page
          .locator("#collection img")
          .first()
          .evaluate((image) => image.decode());
        await capture(page, state, "collection-grid");
        const dossier = await page.goto(
          `${base}/gallery/sovereign-depths/vorrak`,
          { waitUntil: "domcontentloaded" },
        );
        assert.equal(dossier.status(), 200);
        await page
          .locator("main img")
          .first()
          .evaluate((image) => image.decode());
        await capture(page, state, "vorrak-dossier");
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(
    "screenshots/built-app-manifest.json",
    JSON.stringify(
      {
        scope:
          "Real built Next app at this CI commit; production URL verification is separate",
        commit: process.env.GITHUB_SHA,
        states,
        captures,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `Verified real gallery interactions, private gateway protection, 36 delivered image hashes and ${captures.length} desktop/mobile/reduced-motion captures.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
