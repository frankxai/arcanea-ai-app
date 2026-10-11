const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { execFileSync } = require("node:child_process");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);

const base = "http://127.0.0.1:3001";
const output = "screenshots/reader-entry";
const entries = [
  {
    book: "The Forge of Ruin",
    href: "/books/forge-of-ruin/prologue",
    text: "The candle has burned three times down",
  },
  {
    book: "Heart of Pyrathis",
    href: "/books/heart-of-pyrathis/the-cold-season",
    text: "The thermal vents woke Korvash at dawn",
  },
  {
    book: "Tides of Silence",
    href: "/books/tides-of-silence/the-gyres-hymn",
    text: "The hour before dawn belonged to the water.",
  },
  {
    book: "The Song of Van Linh",
    href: "/books/song-of-van-linh/subject-7",
    text: "The pangolin was dying in the way they always died",
  },
];
const modes = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
    hasTouch: false,
  },
  {
    name: "mobile-375",
    viewport: { width: 375, height: 812 },
    reducedMotion: "no-preference",
    hasTouch: true,
    isMobile: true,
  },
  {
    name: "reduced-motion",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    hasTouch: false,
  },
];

async function readChapter(page, href, text) {
  await expect(page).toHaveURL(base + href);
  const article = page.getByRole("article");
  await expect(article).toBeVisible();
  await expect(article).toContainText(text || /\S/);
  assert.ok(
    (await article.innerText()).length > 500,
    "A real chapter must have prose",
  );
  await expect(page).not.toHaveTitle(/Chapter Not Found/);
  return article.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    let effectiveOpacity = 1;
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      effectiveOpacity *= Number(getComputedStyle(ancestor).opacity);
    }
    return {
      width: rect.width,
      left: rect.left,
      right: rect.right,
      viewportWidth: innerWidth,
      fontSize: style.fontSize,
      textCharacters: element.innerText.length,
      effectiveOpacity,
    };
  });
}

async function recoverMissingChapter(page, href, mode, capture) {
  const response = await page.goto(base + href);
  const status = response?.status() ?? null;
  if (capture) await page.screenshot({ path: `${output}/${capture}` });
  // Next may have sent a streamed 200 before its notFound boundary renders.
  assert.ok(status === 404 || status === 200, "Missing chapter response");
  await expect(page.getByRole("article")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Chapter unavailable", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]').first(),
  ).toHaveAttribute("content", /noindex/);
  const link = page.getByRole("link", { name: "Browse books", exact: true });
  await expect(link).toHaveAttribute("href", "/books");
  if (capture) await page.screenshot({ path: `${output}/${capture}` });
  if (mode.hasTouch) await link.tap();
  else {
    await link.focus();
    await expect(link).toBeFocused();
    await link.press("Enter");
  }
  await expect(page).toHaveURL(base + "/books");
  await expect(page.locator("#multiverse:visible")).toHaveCount(1);
  return { href, status, recoveredTo: "/books", passed: true };
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const event = process.env.GITHUB_EVENT_PATH
    ? JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH, "utf8"))
    : {};
  const evidence = {
    builtCommit: execFileSync("git", ["rev-parse", "HEAD"]).toString().trim(),
    reviewedSourceCommit:
      event.pull_request?.head?.sha || process.env.GITHUB_SHA || null,
    runId: process.env.GITHUB_RUN_ID || null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
    browser: null,
    modes: [],
    initialDocuments: [],
    passed: false,
    errors: [],
    scope:
      "Built Next app, real existing public manuscripts; functional rendered journey, not visual approval, production, full accessibility or reader completion.",
  };
  let browser;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        ready = (
          await fetch(base + "/books", { signal: AbortSignal.timeout(4000) })
        ).ok;
      } catch {}
      if (ready) break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    assert.ok(ready, "Built app did not become ready");
    browser = await chromium.launch();
    evidence.browser = browser.version();
    for (const mode of modes.slice(0, 2)) {
      const context = await browser.newContext({
        javaScriptEnabled: true,
        viewport: mode.viewport,
        hasTouch: mode.hasTouch,
        isMobile: mode.isMobile || false,
      });
      const record = {
        mode: mode.name,
        javaScriptEnabled: true,
        appBundlesBlocked: true,
        blockedAppScripts: [],
        errors: [],
        entries: [],
        recovery: [],
        screenshots: [],
      };
      evidence.initialDocuments.push(record);
      // React's inline streaming script reveals server HTML before hydration.
      // Deny every Next bundle so client rendering cannot produce the prose.
      await context.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, (route) => {
        record.blockedAppScripts.push(new URL(route.request().url()).pathname);
        return route.abort("blockedbyclient");
      });
      try {
        const page = await context.newPage();
        page.on("pageerror", (error) => record.errors.push(error.message));
        page.setDefaultTimeout(15000);
        for (const entry of entries) {
          const chapter = { href: entry.href, passed: false };
          record.entries.push(chapter);
          const response = await page.goto(base + entry.href);
          chapter.status = response?.status() ?? null;
          assert.ok(response?.ok(), "Initial chapter request must succeed");
          chapter.documentArticles = await page
            .locator("article")
            .evaluateAll((articles) =>
              articles.map((article) => ({
                textCharacters: article.textContent?.length ?? 0,
                hiddenByAncestor: Boolean(article.closest("[hidden]")),
              })),
            );
          if (entry === entries[0]) {
            const capture = `${mode.name}-initial-reader.png`;
            await page.screenshot({ path: `${output}/${capture}` });
            record.screenshots.push(capture);
          }
          chapter.layout = await readChapter(page, entry.href, entry.text);
          assert.ok(
            record.blockedAppScripts.length > 0,
            "App bundles were denied",
          );
          assert.ok(
            chapter.layout.effectiveOpacity > 0.99,
            "Chapter prose is opaque",
          );
          assert.ok(
            chapter.layout.left >= -1 &&
              chapter.layout.right <= chapter.layout.viewportWidth + 1,
            "Pre-hydration chapter article fits viewport",
          );
          chapter.passed = true;
        }
        for (const href of [
          "/books/forge-of-ruin/not-a-real-chapter",
          "/books/not-a-real-book/not-a-real-chapter",
          "/books/__proto__/not-a-real-chapter",
        ]) {
          const capture = `${mode.name}-initial-missing-${record.recovery.length}.png`;
          record.screenshots.push(capture);
          record.recovery.push(
            await recoverMissingChapter(page, href, mode, capture),
          );
        }
        assert.deepEqual(
          record.errors,
          [],
          "Pre-hydration reading has no page errors",
        );
      } finally {
        await context.close();
      }
    }
    for (const mode of modes) {
      const context = await browser.newContext({
        viewport: mode.viewport,
        reducedMotion: mode.reducedMotion,
        hasTouch: mode.hasTouch,
        isMobile: mode.isMobile || false,
      });
      const record = {
        mode: mode.name,
        viewport: mode.viewport,
        entries: [],
        featured: [],
        navigation: false,
        recovery: false,
        screenshots: [],
      };
      evidence.modes.push(record);
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        page.on("pageerror", (error) =>
          evidence.errors.push({ mode: mode.name, message: error.message }),
        );
        await page.goto(base + "/books");
        const catalog = page.locator("#multiverse:visible");
        await expect(catalog).toHaveCount(1);
        await catalog.scrollIntoViewIfNeeded();
        await expect(catalog).toBeVisible();
        const catalogImage = `${mode.name}-catalog.png`;
        await catalog.screenshot({ path: `${output}/${catalogImage}` });
        record.screenshots.push(catalogImage);
        for (const entry of entries) {
          await page.goto(base + "/books");
          const card = page
            .locator("#multiverse")
            .locator("div.group")
            .filter({
              has: page.getByRole("heading", { name: entry.book, exact: true }),
            });
          const link = card.getByRole("link", {
            name: "Read Now",
            exact: true,
          });
          await expect(link).toHaveCount(1);
          await expect(link).toHaveAttribute("href", entry.href);
          await link.scrollIntoViewIfNeeded();
          if (mode.hasTouch) await link.tap();
          else {
            await link.focus();
            await expect(link).toBeFocused();
            await link.press("Enter");
          }
          const layout = await readChapter(page, entry.href, entry.text);
          assert.ok(
            layout.left >= -1 && layout.right <= layout.viewportWidth + 1,
            "Chapter article fits viewport",
          );
          record.entries.push({
            ...entry,
            layout,
            input: mode.hasTouch ? "touch" : "keyboard",
            passed: true,
          });
          if (entry === entries[0]) {
            const readerImage = `${mode.name}-reader.png`;
            await page.screenshot({ path: `${output}/${readerImage}` });
            record.screenshots.push(readerImage);
          }
        }
        await page.goto(base + "/books");
        const featured = page.getByRole("link", {
          name: "Read chapter",
          exact: true,
        });
        await expect(featured).toHaveCount(6);
        const hrefs = await featured.evaluateAll((links) =>
          links.map((link) => link.getAttribute("href")),
        );
        assert.ok(hrefs.includes("/books/song-of-van-linh/subject-7"));
        assert.ok(
          hrefs.includes("/books/song-of-van-linh/the-frequency-of-starlings"),
        );
        for (let index = 0; index < hrefs.length; index++) {
          await page.goto(base + "/books");
          await page
            .getByRole("link", { name: "Read chapter", exact: true })
            .nth(index)
            .click();
          await readChapter(page, hrefs[index]);
          record.featured.push({ href: hrefs[index], passed: true });
        }
        await page.goto(base + entries[0].href);
        const next = page
          .locator('nav a[href="/books/forge-of-ruin/the-forty-seven-names"]')
          .first();
        await next.click();
        await readChapter(page, "/books/forge-of-ruin/the-forty-seven-names");
        await page
          .locator('nav a[href="/books/forge-of-ruin/prologue"]')
          .first()
          .click();
        await readChapter(page, entries[0].href, entries[0].text);
        await page.reload();
        await readChapter(page, entries[0].href, entries[0].text);
        record.navigation = true;
        await page.goto(base + "/books/forge-of-ruin/not-a-real-chapter");
        await expect(page.getByRole("article")).toHaveCount(0);
        await expect(
          page.locator('meta[name="robots"][content*="noindex"]').first(),
        ).toHaveAttribute("content", /noindex/);
        await page.goBack();
        await readChapter(page, entries[0].href, entries[0].text);
        const missingImage = `${mode.name}-missing.png`;
        record.screenshots.push(missingImage);
        record.recoveryLink = await recoverMissingChapter(
          page,
          "/books/forge-of-ruin/not-a-real-chapter",
          mode,
          missingImage,
        );
        record.recovery = true;
      } finally {
        await context.close();
      }
    }
    assert.deepEqual(evidence.errors, [], "Unexpected browser runtime errors");
    evidence.passed = true;
  } catch (error) {
    evidence.failure = error.stack || String(error);
    throw error;
  } finally {
    await fs.writeFile(
      output + "/evidence.json",
      JSON.stringify(evidence, null, 2),
    );
    console.log(JSON.stringify(evidence));
    if (browser) await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
