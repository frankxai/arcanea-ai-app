const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { execFileSync } = require("node:child_process");
const { createHash } = require("node:crypto");
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
  const header = page.locator("header h1");
  await expect(header).toHaveCount(1);
  const title = await header.innerText();
  const openingHeadings = await article.evaluate((element) => {
    const headings = [];
    for (const node of element.querySelectorAll("h1,h2,h3,p")) {
      if (node.tagName === "P") break;
      headings.push(node.textContent || "");
    }
    return headings;
  });
  const normalizeTitle = (value) =>
    value.normalize("NFC").trim().replace(/\s+/gu, " ").toLowerCase();
  assert.ok(
    !openingHeadings.some(
      (heading) =>
        normalizeTitle(
          heading.replace(
            /^(?:Chapter\s+\w+:\s+|Kapitel\s+\d+:\s+|Capítulo\s+\d+:\s+)/,
            "",
          ),
        ) === normalizeTitle(title),
    ),
    `The chapter header must not repeat before the prose: ${href}, ${title}`,
  );
  const layout = await article.evaluate((element) => {
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
  return { ...layout, title, openingHeadings };
}

async function verifyReadingControls(page, mode) {
  const group = page.getByRole("group", {
    name: "Reading controls",
    exact: true,
  });
  const theme = group.getByRole("button", {
    name: "Cycle reading theme",
    exact: true,
  });
  await theme.focus();
  await expect(theme).toBeFocused();
  await expect(group).toBeVisible();
  const bounds = await group.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return {
      left: box.left,
      right: box.right,
      top: box.top,
      bottom: box.bottom,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      controls: [...element.querySelectorAll("button,a")].map((control) => {
        const r = control.getBoundingClientRect();
        return {
          name: control.getAttribute("aria-label"),
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          width: r.width,
          height: r.height,
        };
      }),
    };
  });
  assert.ok(
    bounds.left >= 0 && bounds.right <= bounds.viewportWidth,
    "Reading controls fit the viewport",
  );
  for (const control of bounds.controls) {
    assert.ok(
      control.width >= 44 && control.height >= 44,
      `Touch target: ${control.name}`,
    );
    assert.ok(
      control.left >= bounds.left &&
        control.right <= bounds.right &&
        control.top >= bounds.top &&
        control.bottom <= bounds.bottom,
      `Unclipped control: ${control.name}`,
    );
  }
  if (mode.hasTouch) {
    assert.ok(
      bounds.bottom <= bounds.viewportHeight - 80,
      "Reading controls reserve the assistant height, inset and a visible gap",
    );
  }
  const companion = page.getByRole("button", {
    name: "Open Arcanea companion",
    exact: true,
  });
  await expect(companion).toBeVisible();
  const companionBounds = await companion.boundingBox();
  assert.ok(companionBounds);
  assert.ok(
    bounds.right <= companionBounds.x ||
      bounds.left >= companionBounds.x + companionBounds.width ||
      bounds.bottom <= companionBounds.y ||
      bounds.top >= companionBounds.y + companionBounds.height,
    "Reading controls do not overlap the actual companion button",
  );
  const paragraph = page.getByRole("article").locator("p").first();
  const increase = group.getByRole("button", {
    name: "Increase font size",
    exact: true,
  });
  if (mode.hasTouch) await increase.tap();
  else await increase.press("Enter");
  await expect
    .poll(() => paragraph.evaluate((p) => getComputedStyle(p).fontSize))
    .toBe("22px");
  await expect(group.locator('[aria-label="Font size"]')).toHaveText("22");
  await page.reload();
  await readChapter(page, entries[0].href, entries[0].text);
  await expect
    .poll(() => paragraph.evaluate((p) => getComputedStyle(p).fontSize))
    .toBe("22px");
  const decrease = group.getByRole("button", {
    name: "Decrease font size",
    exact: true,
  });
  if (mode.hasTouch) await decrease.tap();
  else {
    await decrease.focus();
    await decrease.press("Enter");
  }
  await expect
    .poll(() => paragraph.evaluate((p) => getComputedStyle(p).fontSize))
    .toBe("18px");
  const spacing = group.getByRole("button", {
    name: "Line spacing: normal",
    exact: true,
  });
  if (mode.hasTouch) await spacing.tap();
  else {
    await spacing.focus();
    await spacing.press("Enter");
  }
  await expect(
    group.getByRole("button", { name: "Line spacing: relaxed", exact: true }),
  ).toBeVisible();
  // React's accessible label can update before the browser recalculates style.
  // Wait on the actual prose, with the same expected value and default timeout.
  await expect
    .poll(() =>
      paragraph.evaluate((p) =>
        Number.parseFloat(getComputedStyle(p).lineHeight),
      ),
    )
    .toBe(36);
  const lineHeight = await paragraph.evaluate((p) =>
    Number.parseFloat(getComputedStyle(p).lineHeight),
  );
  assert.equal(lineHeight, 36, "Relaxed line height reaches the actual prose");
  await theme.focus();
  const themeStyles = [];
  for (const expected of ["light", "sepia", "cosmic", "dark"]) {
    if (mode.hasTouch) await theme.tap();
    else await theme.press("Enter");
    await expect(theme).toHaveAttribute("title", `Theme: ${expected}`);
    const readingColors = () =>
      paragraph.evaluate((p) => {
        const style = getComputedStyle(p);
        const reader = p.closest("article").parentElement.parentElement;
        const readerStyle = getComputedStyle(reader);
        return {
          prose: style.color,
          reader: readerStyle.color,
          transitionProperty: readerStyle.transitionProperty,
          transitionDuration: readerStyle.transitionDuration,
        };
      });
    await expect
      .poll(async () => {
        const colors = await readingColors();
        return colors.prose === colors.reader;
      })
      .toBe(true);
    const colors = await readingColors();
    // The global reduced-motion rule sets a tiny duration even when no property
    // can transition. CSS transition-property:none means no transitions occur.
    assert.ok(
      colors.transitionProperty === "none" ||
        colors.transitionDuration
          .split(",")
          .every((duration) => Number.parseFloat(duration) === 0),
      "Reading theme preference switches do not animate",
    );
    assert.equal(
      colors.prose,
      colors.reader,
      "The prose inherits its selected reading theme",
    );
    themeStyles.push({ theme: expected, ...colors });
  }
  await page.evaluate(() =>
    localStorage.setItem(
      "arcanea-reader-prefs",
      JSON.stringify({
        theme: "unsupported",
        fontSize: 9000,
        fontFamily: "other",
        lineHeight: "unsupported",
      }),
    ),
  );
  await page.reload();
  await readChapter(page, entries[0].href, entries[0].text);
  await expect(theme).toHaveAttribute("title", "Theme: dark");
  await expect
    .poll(() => paragraph.evaluate((p) => getComputedStyle(p).fontSize))
    .toBe("18px");
  await expect(
    group.getByRole("button", { name: "Line spacing: normal", exact: true }),
  ).toBeVisible();
  await theme.focus();
  await page.evaluate(() => window.scrollBy(0, 300));
  await expect(theme).toBeFocused();
  await expect
    .poll(() =>
      theme.evaluate((button) => {
        let opacity = 1;
        for (let el = button; el; el = el.parentElement)
          opacity *= Number(getComputedStyle(el).opacity);
        return opacity;
      }),
    )
    .toBe(1);
  await theme.press("Tab");
  await expect(decrease).toBeFocused();
  await expect(group).toBeVisible();
  const capture = `${mode.name}-reading-controls.png`;
  await page.screenshot({ path: `${output}/${capture}` });
  return {
    bounds,
    companionBounds,
    preferenceReload: true,
    invalidPreferencesRecovered: true,
    fontSize: true,
    lineHeight,
    themes: true,
    themeStyles,
    focusSurvivesScroll: true,
    capture,
    passed: true,
  };
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
    sourceHashes: {},
    modes: [],
    initialDocuments: [],
    passed: false,
    errors: [],
    scope:
      "Built Next app, real existing public manuscripts; functional rendered journey, not visual approval, production, full accessibility or reader completion.",
  };
  let browser;
  try {
    for (const file of [
      "apps/web/components/saga/chapter-reader.tsx",
      "apps/web/components/saga/reading-toolbar.tsx",
      "apps/web/components/saga/reading-toolbar.module.css",
      "apps/web/lib/content/reader-presentation.ts",
      "apps/web/components/chat/chat-markdown.tsx",
      "apps/web/app/books/[bookId]/[chapterId]/page.tsx",
      "apps/web/lib/saga/chapter-files.ts",
      "apps/web/lib/content/book-path.ts",
      "apps/web/lib/content/book-visibility.ts",
      "apps/web/app/globals.css",
      "apps/web/components/navigation/navbar.tsx",
      "apps/web/components/lumina/lumina-bubble.tsx",
      "packages/design-system/src/companion.module.css",
      "packages/design-system/src/tokens.css",
      "apps/web/next.config.js",
      "apps/web/app/books/books-data.ts",
      "book/chapters/book1/01-the-storm-that-remembered.md",
      "book/chapters/book1/04-the-triennium.md",
      "book/chapters/book1/10-the-foundation-opens.md",
      "book/song-of-van-linh/chapters/02-the-frequency-of-starlings.md",
      "book/forge-of-ruin/chapters/00-prologue.md",
      "book/heart-of-pyrathis/chapters/01-the-cold-season.md",
      "book/tides-of-silence/chapters/01-the-gyres-hymn.md",
      "book/song-of-van-linh/chapters/01-subject-7.md",
      "scripts/verify-reader-entry-browser.cjs",
      ".github/workflows/ci.yml",
    ]) {
      const bytes = execFileSync("git", [
        "show",
        `${evidence.builtCommit}:${file}`,
      ]);
      evidence.sourceHashes[file] = createHash("sha256")
        .update(bytes)
        .digest("hex");
    }
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
          if (entry === entries[0]) {
            await page.screenshot({
              path: `${output}/${mode.name}-initial-reader.png`,
            });
          }
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
        await readChapter(page, entries[0].href, entries[0].text);
        record.controls = await verifyReadingControls(page, mode);
        record.screenshots.push(record.controls.capture);
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
    // Browser renders, not model-generated images. Keep every actual capture,
    // including failed attempts, with its exact source and capture digest.
    for (const capture of (await fs.readdir(output)).filter((name) =>
      name.endsWith(".png"),
    )) {
      const bytes = await fs.readFile(`${output}/${capture}`);
      const provenance = {
        schema: "arcanea.rendered-fixture.v1",
        prompt: `Capture the actual built public reader journey ${capture}; existing manuscripts/illustrations are unchanged, with no newly generated creative media.`,
        model: null,
        seed: null,
        provider: "GitHub Actions / Playwright browser rendering",
        renderer: evidence.browser,
        agentSession: `github-actions:${evidence.runId}:${evidence.runAttempt}`,
        head: evidence.builtCommit,
        reviewedSourceCommit: evidence.reviewedSourceCommit,
        sourceHashes: evidence.sourceHashes,
        captureSha256: createHash("sha256").update(bytes).digest("hex"),
        generated: false,
        inspected: false,
        limits:
          "Functional browser evidence only; pre-existing manuscript/illustration rights, visual quality, signed-in production, customer usefulness and whole-product acceptance are not certified.",
      };
      await fs.writeFile(
        `${output}/${capture}.vis.provenance.json`,
        JSON.stringify(provenance, null, 2),
      );
    }
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
