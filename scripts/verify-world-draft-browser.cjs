const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const base = "http://127.0.0.1:3001/worlds/create?resume=1";
const output = "screenshots/world-drafts";
const currentKey = "arcanea.world-draft.v1";
const previousKey = "arcanea.world-draft.previous.v1";
const conceptKey = "arcanea.world-concept";
const draft = {
  version: 1,
  description: "A library inside a dying star",
  draft_id: "aaad4508-1165-477b-a644-c9c2c81922a4",
  world: {
    name: "The last library",
    slug: "the-last-library",
    tagline: "Every memory has a home",
    description:
      "A complete synthetic draft used only for browser regression tests.",
    elements: [],
    laws: [{ name: "The cost", description: "Reading costs one memory." }],
    systems: [
      {
        name: "Memory exchange",
        type: "Economy",
        rules: "Every memory is returned when its book closes.",
      },
    ],
    characters: Array.from({ length: 4 }, (_, i) => ({
      name: `Archivist ${i + 1}`,
      backstory: `Complete backstory ${i + 1}.`,
      personality: { traits: ["Patient"], voice_style: "Soft and precise" },
    })),
    locations: Array.from({ length: 4 }, (_, i) => ({
      name: `Reading room ${i + 1}`,
      description: `Complete location ${i + 1}.`,
    })),
    first_event: {
      title: "The arrival",
      description: "A courier brings the last blank book.",
    },
    image_prompt: "A library in a dying star",
  },
};

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch();
  const evidence = {
    sourceCommit: process.env.GITHUB_SHA || null,
    modes: [],
    interactions: [],
  };
  const errors = [];
  try {
    for (const mode of [
      {
        name: "desktop",
        width: 1440,
        height: 900,
        reducedMotion: "no-preference",
      },
      {
        name: "mobile",
        width: 375,
        height: 812,
        reducedMotion: "no-preference",
      },
      {
        name: "reduced-motion",
        width: 1440,
        height: 900,
        reducedMotion: "reduce",
      },
    ]) {
      const context = await browser.newContext({
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.reducedMotion,
        acceptDownloads: true,
      });
      const page = await context.newPage();
      const button = (name) => page.getByRole("button", { name, exact: true });
      const worldTitle = page.getByRole("heading", {
        name: draft.world.name,
        exact: true,
      });
      const choice = page.getByRole("region", { name: "Choose your draft" });
      const readStorage = (key) =>
        page.evaluate((key) => sessionStorage.getItem(key), key);
      page.setDefaultTimeout(15000);
      page.on("pageerror", (error) => errors.push(error.message));
      let modelRequests = 0;
      await page.route("**/api/worlds/generate**", (route) => {
        modelRequests += 1;
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: '{"error":"Unexpected model request in recovery test"}',
        });
      });
      await page.goto(base);
      await expect(
        page.getByRole("textbox", { name: "Describe your world" }),
      ).toBeVisible();
      await page.evaluate(
        ({ currentKey, conceptKey, draft }) => {
          sessionStorage.setItem(currentKey, JSON.stringify(draft));
          sessionStorage.setItem(conceptKey, "A new city beneath the sea");
        },
        { currentKey, conceptKey, draft },
      );
      await page.reload();
      await expect(worldTitle).toBeVisible();
      await expect(choice).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Archivist 4", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Reading room 4", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(draft.world.systems[0].rules, { exact: true }),
      ).toBeVisible();
      assert.ok(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <=
            document.documentElement.clientWidth + 1,
        ),
        `${mode.name}: horizontal overflow`,
      );
      const downloadPromise = page.waitForEvent("download");
      await button("Export draft").click();
      const download = await downloadPromise;
      assert.deepEqual(
        JSON.parse(await fs.readFile(await download.path(), "utf8")),
        draft.world,
      );
      await button("Keep this draft").click();
      await expect(choice).toHaveCount(0);
      assert.equal(await readStorage(conceptKey), null);
      page.once("dialog", (dialog) => dialog.dismiss());
      await button("Start over").click();
      await expect(worldTitle).toBeVisible();
      page.once("dialog", (dialog) => dialog.accept());
      await button("Start over").click();
      await expect(
        page.getByRole("textbox", { name: "Describe your world" }),
      ).toBeVisible();
      assert.equal(await readStorage(currentKey), null);
      assert.equal(
        JSON.parse(await readStorage(previousKey)).draft_id,
        draft.draft_id,
      );
      await page.reload();
      await button("Restore previous draft").click();
      await expect(worldTitle).toBeVisible();
      await page.screenshot({
        path: `${output}/${mode.name}-restored.png`,
        fullPage: true,
        animations: "disabled",
      });
      await page.evaluate(
        (key) => sessionStorage.setItem(key, "A new city beneath the sea"),
        conceptKey,
      );
      await page.reload();
      page.once("dialog", (dialog) => dialog.accept());
      await button("Use new concept").click();
      const input = page.getByRole("textbox", { name: "Describe your world" });
      await expect(input).toHaveValue("A new city beneath the sea");
      await input.press("End");
      await input.press("Enter");
      await expect(input).toHaveValue("A new city beneath the sea\n");
      await button("Restore previous draft").click();
      await page.evaluate(() => {
        Storage.prototype.setItem = function () {
          throw new DOMException(
            "Synthetic full storage",
            "QuotaExceededError",
          );
        };
      });
      page.once("dialog", (dialog) => dialog.accept());
      await button("Start over").click();
      await expect(page.getByRole("alert")).toContainText(
        "A recovery copy could not be stored",
      );
      await expect(worldTitle).toBeVisible();
      assert.equal(
        modelRequests,
        0,
        "Recovery and plain Enter must never request generation",
      );
      evidence.modes.push({ ...mode, passed: true });
      await context.close();
    }
    assert.deepEqual(errors, [], "Unexpected browser runtime errors");
    evidence.interactions = [
      "complete draft inspection and exact JSON export",
      "explicit pending-concept choice",
      "cancel and confirm start over",
      "previous draft survives reload",
      "new concept retains previous draft",
      "plain Enter preserves multiline input",
      "full storage blocks destructive reset",
      "no implicit model calls",
    ];
    await fs.writeFile(
      `${output}/evidence.json`,
      JSON.stringify(evidence, null, 2),
    );
    console.log(JSON.stringify(evidence));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
