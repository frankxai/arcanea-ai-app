const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
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
function sourceEvidence() {
  const checkoutCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const event = process.env.GITHUB_EVENT_PATH
    ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"))
    : null;
  const reviewedSourceCommit = event?.pull_request?.head?.sha || checkoutCommit;
  const files = [
    "apps/web/app/worlds/create/page.tsx",
    "apps/web/lib/worlds/draft.ts",
    "apps/web/lib/worlds/draft-portability.ts",
    "apps/web/lib/worlds/__tests__/draft-portability.test.ts",
    "scripts/verify-world-draft-browser.cjs",
    ".github/workflows/ci.yml",
  ];
  const hashes = {};
  for (const file of files) {
    const bytes = readFileSync(file);
    assert.ok(
      bytes.equals(
        execFileSync("git", ["show", `${reviewedSourceCommit}:${file}`]),
      ),
      `Source mismatch: ${file}`,
    );
    hashes[file] = crypto.createHash("sha256").update(bytes).digest("hex");
  }
  return {
    checkoutCommit,
    reviewedSourceCommit,
    sourceFilesMatchReviewedCommit: true,
    sourceFileSha256: hashes,
  };
}
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
    ...sourceEvidence(),
    modes: [],
    interactions: [],
    captures: [],
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
      await context.route("**/api/worlds/**", (route) => {
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
        draft,
      );
      page.once("dialog", (dialog) => dialog.dismiss());
      await page.getByLabel("Import draft", { exact: true }).setInputFiles({
        name: "same-world.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(draft)),
      });
      await expect(
        page.getByLabel("Import draft", { exact: true }),
      ).toBeEnabled();
      await expect(choice).toContainText("A new city beneath the sea");
      assert.equal(await readStorage(conceptKey), "A new city beneath the sea");
      await button("Keep this draft").click();
      await expect(choice).toHaveCount(0);
      assert.equal(await readStorage(conceptKey), null);
      const fileInput = page.getByLabel("Import draft", { exact: true });
      const upload = async (value) =>
        fileInput.setInputFiles({
          name: "world.json",
          mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify(value)),
        });
      const originalStorage = await readStorage(currentKey);
      await upload({ ...draft, version: 99 });
      await expect(
        page.getByRole("alert").filter({ hasText: "not supported" }),
      ).toBeVisible();
      assert.equal(await readStorage(currentKey), originalStorage);
      await expect(worldTitle).toBeVisible();
      const replacement = {
        ...draft,
        draft_id: "f259e024-a6e9-4f54-b547-901d285377d3",
        world: {
          ...draft.world,
          name: "The second library",
          slug: "the-second-library",
        },
      };
      page.once("dialog", (dialog) => dialog.dismiss());
      await upload(replacement);
      await expect(fileInput).toBeEnabled();
      assert.equal(await readStorage(currentKey), originalStorage);
      page.once("dialog", (dialog) => dialog.accept());
      await upload(replacement);
      await expect(
        page.getByRole("heading", {
          name: replacement.world.name,
          exact: true,
        }),
      ).toBeVisible();
      assert.deepEqual(JSON.parse(await readStorage(previousKey)), draft);
      await page.reload();
      await button("Restore previous draft").click();
      await expect(worldTitle).toBeVisible();
      const sameIdentity = {
        ...draft,
        world: {
          ...draft.world,
          laws: [
            { name: "The cost", description: "Reading costs two memories." },
          ],
        },
      };
      page.once("dialog", (dialog) => dialog.accept());
      await upload(sameIdentity);
      await expect(
        page.getByText("Reading costs two memories.", { exact: true }),
      ).toBeVisible();
      await expect(button("Restore previous draft")).toBeVisible();
      await button("Restore previous draft").click();
      await expect(
        page.getByText("Reading costs one memory.", { exact: true }),
      ).toBeVisible();
      assert.deepEqual(JSON.parse(await readStorage(currentKey)), draft);
      const beforeFailure = await page.evaluate(() => ({
        current: sessionStorage.getItem("arcanea.world-draft.v1"),
        previous: sessionStorage.getItem("arcanea.world-draft.previous.v1"),
      }));
      await page.evaluate((key) => {
        const original = Storage.prototype.setItem;
        let failed = false;
        Storage.prototype.setItem = function (name, value) {
          if (name === key && !failed) {
            failed = true;
            throw new DOMException("Synthetic quota", "QuotaExceededError");
          }
          return original.call(this, name, value);
        };
      }, currentKey);
      page.once("dialog", (dialog) => dialog.accept());
      await upload(replacement);
      await expect(
        page.getByRole("alert").filter({ hasText: "Import did not finish" }),
      ).toBeVisible();
      assert.equal(await readStorage(currentKey), beforeFailure.current);
      assert.equal(await readStorage(previousKey), beforeFailure.previous);
      await expect(worldTitle).toBeVisible();

      // Reopen the actual download after deleting all tab recovery records.
      await page.evaluate(() => sessionStorage.clear());
      await page.reload();
      await expect(
        page.getByRole("textbox", { name: "Describe your world" }),
      ).toBeVisible();
      await fileInput.focus();
      await expect(fileInput).toBeFocused();
      await fileInput.setInputFiles(await download.path());
      await expect(worldTitle).toBeVisible();
      assert.deepEqual(JSON.parse(await readStorage(currentKey)), draft);
      // An outstanding file read must not race reset/refine/another import.
      await page.evaluate((text) => {
        const original = File.prototype.text;
        File.prototype.text = function () {
          return new Promise((resolve) => {
            window.releaseDraftRead = () => {
              File.prototype.text = original;
              resolve(text);
            };
          });
        };
      }, JSON.stringify(draft));
      await upload(draft);
      await expect(fileInput).toBeDisabled();
      await expect(button("Start over")).toBeDisabled();
      await expect(button("Refine")).toBeDisabled();
      assert.deepEqual(JSON.parse(await readStorage(currentKey)), draft);
      await page.evaluate(() => window.releaseDraftRead());
      await expect(fileInput).toBeEnabled();
      assert.deepEqual(JSON.parse(await readStorage(currentKey)), draft);
      page.once("dialog", (dialog) => dialog.accept());
      await upload(draft.world);
      await expect(
        page.getByRole("status").filter({ hasText: "Older world JSON" }),
      ).toBeVisible();
      const legacy = JSON.parse(await readStorage(currentKey));
      assert.notEqual(legacy.draft_id, draft.draft_id);
      assert.deepEqual(legacy.world, draft.world);
      page.once("dialog", (dialog) => dialog.accept());
      await upload(draft);
      await expect(fileInput).toBeEnabled();
      assert.deepEqual(JSON.parse(await readStorage(currentKey)), draft);
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
      const capturePath = `${output}/${mode.name}-restored.png`;
      await page.screenshot({
        path: capturePath,
        fullPage: true,
        animations: "disabled",
      });
      const bytes = await fs.readFile(capturePath);
      const companion = {
        kind: "browser-screenshot",
        prompt: `Capture built draft after JSON round-trip and recovery: ${mode.name}, ${page.url()}`,
        model: null,
        provider: "Playwright Chromium",
        seed: null,
        agentSession: "01a0f74f-8bad-7db1-ab06-fd89b5faec84",
        checkoutCommit: evidence.checkoutCommit,
        reviewedSourceCommit: evidence.reviewedSourceCommit,
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.reducedMotion,
        bytes: bytes.length,
        sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      };
      await fs.writeFile(
        `${capturePath}.vis.provenance.json`,
        JSON.stringify(companion, null, 2) + "\n",
      );
      evidence.captures.push({ path: capturePath, ...companion });
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
      await expect(
        page
          .getByRole("alert")
          .filter({ hasText: "A recovery copy could not be stored" }),
      ).toContainText("A recovery copy could not be stored");
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
      "actual downloaded JSON reopens without tab recovery records",
      "unsupported version preserves the current draft",
      "cancel and confirm file replacement with full previous-draft recovery",
      "failed second storage write rolls back both draft records",
      "older world-only JSON retains complete text with a new identity",
      "native file input accepts keyboard focus",
      "outstanding file read blocks reset/refine/another import",
      "same-identity text changes retain an accessible previous version",
      "explicit pending-concept choice",
      "identical imports still confirm before clearing a pending concept",
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
