const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const base = "http://127.0.0.1:3001/creator-starters/";
const output = "screenshots/creator-starters";

(async () => {
  await fs.mkdir(output, { recursive: true });
  const { templates } = JSON.parse(
    await fs.readFile("packages/arcanea-creator-starters/catalog.json", "utf8"),
  );
  assert.equal(templates.length, 9);
  const browser = await chromium.launch();
  const errors = [];
  const evidence = {
    sourceCommit: process.env.GITHUB_SHA || null,
    pages: [],
    downloads: [],
    interactions: [],
  };
  try {
    const context = await browser.newContext({
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.setDefaultTimeout(10000);
    for (const template of templates) {
      for (const suffix of [".html.txt", ".md", ".registry.json"]) {
        const file = template.id + suffix;
        const response = await fetch(base + file);
        assert.equal(response.status, 200, file);
        assert.deepEqual(
          Buffer.from(await response.arrayBuffer()),
          await fs.readFile(`apps/web/public/creator-starters/${file}`),
          file,
        );
        evidence.downloads.push(file);
      }
    }
    for (const width of [1440, 375]) {
      await page.setViewportSize({ width, height: 900 });
      for (const id of ["index", ...templates.map((template) => template.id)]) {
        assert.equal((await page.goto(base + id + ".html")).status(), 200, id);
        await expect(page.locator("h1")).toHaveCount(1);
        await page.evaluate(() => document.fonts.ready);
        assert.ok(
          await page.evaluate(
            () =>
              document.documentElement.scrollWidth <=
              document.documentElement.clientWidth + 1,
          ),
          `${id}: horizontal overflow at ${width}`,
        );
        await page.screenshot({
          path: `${output}/${id}-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
        evidence.pages.push({ id, width });
      }
    }
    await page.goto(base + "index.html?category=music");
    await expect(page.locator("[data-category]:visible")).toHaveCount(3);
    await page.getByRole("searchbox").fill("nothing-matches-this");
    await expect(page.locator("[data-category]:visible")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Show all starters" })
      .press("Enter");
    await expect(page.locator("[data-category]:visible")).toHaveCount(9);
    await expect(page.getByRole("searchbox")).toBeFocused();
    evidence.interactions.push(
      "shared gallery filter, empty recovery and keyboard focus",
    );
    await page.goto(base + "session.html");
    const play = page.locator("[data-audio]").first();
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-audio-status]")).toContainText("Playing");
    await play.click();
    await expect(play).toHaveAttribute("aria-pressed", "false");
    evidence.interactions.push("Session user-triggered synthesis and stop");
    await page.goto(base + "margin.html");
    const note = page.locator("details").first();
    await note.locator("summary").press("Enter");
    await expect(note).toHaveAttribute("open", "");
    await page
      .getByRole("button", { name: "Copy the research outline" })
      .click();
    assert.match(
      await page.evaluate(() => navigator.clipboard.readText()),
      /# Research outline/,
    );
    evidence.interactions.push(
      "Margin keyboard disclosure and clipboard outline",
    );
    await page.goto(base + "patch.html");
    const input = page.getByRole("textbox", { name: "Inspect a JSON request" });
    await input.fill('{"broken":');
    await page.getByRole("button", { name: "Validate and format" }).click();
    await expect(input).toHaveValue('{"broken":');
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(
      page.getByRole("button", { name: "Copy JSON" }),
    ).toBeDisabled();
    await input.fill('{"message":"<script>alert(1)</script>"}');
    await page.getByRole("button", { name: "Validate and format" }).click();
    await expect(page.locator("[data-json-output]")).toContainText(
      "<script>alert(1)</script>",
    );
    await page.getByRole("button", { name: "Copy JSON" }).click();
    assert.equal(
      JSON.parse(await page.evaluate(() => navigator.clipboard.readText()))
        .message,
      "<script>alert(1)</script>",
    );
    evidence.interactions.push(
      "Patch invalid-input preservation, literal script text and fresh clipboard output",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(base + "session.html");
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
    await page.screenshot({
      path: `${output}/session-reduced-motion.png`,
      fullPage: true,
    });
    evidence.interactions.push("reduced-motion scroll behavior");
    const noScript = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 375, height: 900 },
    });
    const staticPage = await noScript.newPage();
    await staticPage.goto(base + "index.html");
    await expect(staticPage.locator("[data-category]:visible")).toHaveCount(9);
    await noScript.close();
    evidence.interactions.push(
      "nine readable gallery entries without JavaScript",
    );
    assert.deepEqual(errors, [], "Creator starter runtime errors");
    evidence.status = "pass";
  } catch (error) {
    evidence.status = "fail";
    evidence.error = String(error);
    throw error;
  } finally {
    evidence.runtimeErrors = errors;
    await fs.writeFile(
      `${output}/evidence.json`,
      JSON.stringify(evidence, null, 2) + "\n",
    );
    await browser.close();
  }
  console.log(JSON.stringify(evidence, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
