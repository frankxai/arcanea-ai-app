const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const { verifySovereignPreview } = require("./verify-sovereign-browser.cjs");
const {
  verifyWeightOfWondersPreview,
} = require("./verify-weight-of-wonders-browser.cjs");

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

const commitEvidence = () => {
  const builtCommit = process.env.GITHUB_SHA || null;
  if (!process.env.GITHUB_EVENT_PATH)
    return { builtCommit, reviewedSourceCommit: builtCommit };
  const event = JSON.parse(
    fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"),
  );
  return {
    builtCommit,
    reviewedSourceCommit: event.pull_request?.head?.sha || builtCommit,
  };
};

const typographyReport = async (page) =>
  page.evaluate(async () => {
    await document.fonts.ready;
    const sample = (element) => {
      const style = getComputedStyle(element);
      let declaredFontAvailable = null;
      try {
        declaredFontAvailable = document.fonts.check(style.font, "Arcanea");
      } catch {}
      return {
        family: style.fontFamily,
        weight: style.fontWeight,
        size: style.fontSize,
        lineHeight: style.lineHeight,
        declaredFontAvailable,
      };
    };
    return {
      documentFontsStatus: document.fonts.status,
      heading: sample(document.querySelector("h1")),
      body: sample(document.body),
      control: sample(document.querySelector("[aria-pressed]")),
      manualBrief: sample(document.querySelector("textarea[readonly]")),
    };
  });

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
  const wonderReports = [];
  const settlePaint = (page) =>
    page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    });
  const capture = async (page, state, name) => {
    await settlePaint(page);
    const path = `screenshots/${name}-${state.name}.png`;
    await page.screenshot({ path, fullPage: false, type: "png" });
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

        const wonderReport = await verifyWeightOfWondersPreview({
          page,
          context,
          base,
          state: state.name,
        });
        wonderReports.push(wonderReport);
        await capture(page, state, "weight-of-wonders-encounter-desk");
        for (const slug of ["orvess", "vesrane"]) {
          const dossier = await page.goto(
            `${base}/gallery/weight-of-wonders/${slug}`,
            { waitUntil: "domcontentloaded" },
          );
          assert.equal(dossier.status(), 200);
          await page
            .locator("[data-orientation] img")
            .evaluate((image) => image.decode());
          await capture(page, state, `weight-of-wonders-${slug}-dossier`);
        }
        if (state.name === "mobile-375") {
          await page.goto(`${base}/gallery/weight-of-wonders/orvess`, {
            waitUntil: "domcontentloaded",
          });
          await settlePaint(page);
          const specimen = page.locator("[data-type-specimen]");
          await specimen.screenshot({
            path: "screenshots/weight-of-wonders-type-specimen-mobile-375.png",
            type: "png",
            style: "nav.fixed { visibility: hidden !important; }",
          });
          const specimenBytes = fs.readFileSync(
            "screenshots/weight-of-wonders-type-specimen-mobile-375.png",
          );
          captures.push({
            path: "screenshots/weight-of-wonders-type-specimen-mobile-375.png",
            viewport: state.viewport,
            reducedMotion: state.reducedMotion,
            bytes: specimenBytes.length,
            sha256: crypto
              .createHash("sha256")
              .update(specimenBytes)
              .digest("hex"),
            url: page.url(),
            element: "authoring desk typography specimen",
          });
          fs.writeFileSync(
            "screenshots/weight-of-wonders-type-specimen-mobile-375.json",
            JSON.stringify(
              {
                scope: "Real built-app mobile typography specimen",
                url: page.url(),
                viewport: state.viewport,
                deviceScaleFactor: 1,
                reflow: wonderReport.dossierOverflow,
                typography: wonderReport.typography,
              },
              null,
              2,
            ) + "\n",
          );
        }
        const collection = await page.goto(
          `${base}/gallery/weight-of-wonders`,
          { waitUntil: "domcontentloaded" },
        );
        assert.equal(collection.status(), 200);
        await page
          .locator('section[aria-labelledby="wonders-title"] img')
          .first()
          .evaluate((image) => image.decode());
        await capture(page, state, "weight-of-wonders-hero");
        await page
          .getByRole("link", { name: "Explore the six concepts", exact: true })
          .click();
        await page.waitForFunction(() => {
          const top = document
            .querySelector("#atlas")
            .getBoundingClientRect().top;
          return top >= -2 && top <= 100;
        });
        await page
          .locator("#atlas img")
          .first()
          .evaluate((image) => image.decode());
        await capture(page, state, "weight-of-wonders-atlas");
      } finally {
        await context.close();
      }
    }

    const blockedFonts = [];
    const fallbackConsoleErrors = [];
    const fallbackContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    try {
      await fallbackContext.route("**/*", async (route) => {
        if (route.request().resourceType() === "font") {
          blockedFonts.push(route.request().url());
          await route.abort();
        } else await route.continue();
      });
      const fallbackPage = await fallbackContext.newPage();
      fallbackPage.on("console", (message) => {
        if (message.type() === "error")
          fallbackConsoleErrors.push(message.text());
      });
      const fallbackResponse = await fallbackPage.goto(
        `${base}/gallery/weight-of-wonders/orvess`,
        { waitUntil: "domcontentloaded" },
      );
      assert.equal(fallbackResponse.status(), 200);
      await fallbackPage
        .getByRole("heading", { name: "Orvess", exact: true, level: 1 })
        .waitFor();
      const fallbackReflow = await fallbackPage.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      assert.ok(fallbackReflow, "Font fallback retains 375px reflow");
      const fallbackTypography = await typographyReport(fallbackPage);
      const fallbackSpecimen = fallbackPage.locator("[data-type-specimen]");
      const specimenBox = await fallbackSpecimen.boundingBox();
      assert.ok(
        specimenBox && specimenBox.width <= 375,
        "Fallback specimen does not clip horizontally",
      );
      await settlePaint(fallbackPage);
      await fallbackSpecimen.screenshot({
        path: "screenshots/weight-of-wonders-type-specimen-fallback-375.png",
        type: "png",
        style: "nav.fixed { visibility: hidden !important; }",
      });
      const fallbackBytes = fs.readFileSync(
        "screenshots/weight-of-wonders-type-specimen-fallback-375.png",
      );
      captures.push({
        path: "screenshots/weight-of-wonders-type-specimen-fallback-375.png",
        viewport: { width: 375, height: 812 },
        reducedMotion: "reduce",
        bytes: fallbackBytes.length,
        sha256: crypto.createHash("sha256").update(fallbackBytes).digest("hex"),
        url: fallbackPage.url(),
        element: "authoring desk typography fallback specimen",
        fontRequestsBlocked: blockedFonts.length,
      });
      assert.ok(
        blockedFonts.length > 0,
        "Fallback capture blocked at least one webfont request",
      );
      fs.writeFileSync(
        "screenshots/weight-of-wonders-type-specimen-fallback-375.json",
        JSON.stringify(
          {
            scope:
              "Real built-app fallback specimen with webfont requests blocked; readability is shown by the accompanying PNG",
            url: fallbackPage.url(),
            viewport: { width: 375, height: 812 },
            deviceScaleFactor: 1,
            blockedFontRequests: blockedFonts,
            reflow: fallbackReflow,
            specimenBox,
            typography: fallbackTypography,
            consoleErrors: fallbackConsoleErrors,
          },
          null,
          2,
        ) + "\n",
      );
    } finally {
      await fallbackContext.close();
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(
    "screenshots/built-app-manifest.json",
    JSON.stringify(
      {
        scope:
          "Real built Next app at the CI checkout commit; production URL verification is separate",
        ...commitEvidence(),
        states,
        captures,
      },
      null,
      2,
    ) + "\n",
  );
  const failedInteractionGates = wonderReports.filter(
    (report) => !report.performance.dossier.gate.passed,
  );
  const failedBrowserDiagnostics = wonderReports.filter(
    (report) => !report.browserDiagnostics.gatePassed,
  );
  if (failedInteractionGates.length || failedBrowserDiagnostics.length) {
    console.error(
      "Weight of Wonders deferred browser diagnostics:\n" +
        JSON.stringify(
          {
            interactionLatency: failedInteractionGates.map((report) => ({
              state: report.state,
              url: report.url,
              performance: report.performance.dossier,
            })),
            browserErrors: failedBrowserDiagnostics.map((report) => ({
              state: report.state,
              url: report.url,
              browserDiagnostics: report.browserDiagnostics,
            })),
          },
          null,
          2,
        ),
    );
    assert.fail(
      `Deferred browser gates failed: ${failedInteractionGates.length} interaction latency, ${failedBrowserDiagnostics.length} console/page error`,
    );
  }
  console.log(
    `Verified both real gallery collections, private gateway protection, 42 delivered image hashes and ${captures.length} PNG desktop/mobile/reduced-motion captures.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
