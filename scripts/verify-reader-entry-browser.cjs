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
    return {
      width: rect.width,
      left: rect.left,
      right: rect.right,
      viewportWidth: innerWidth,
      fontSize: style.fontSize,
      textCharacters: element.innerText.length,
    };
  });
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
    browser: null,
    modes: [],
    passed: false,
    errors: [],
    scope:
      "Built Next app, real existing public manuscripts; functional rendered journey, not visual approval, production, full accessibility or reader completion.",
  };
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
  const browser = await chromium.launch();
  evidence.browser = browser.version();
  try {
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
      };
      evidence.modes.push(record);
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        page.on("pageerror", (error) =>
          evidence.errors.push({ mode: mode.name, message: error.message }),
        );
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
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
