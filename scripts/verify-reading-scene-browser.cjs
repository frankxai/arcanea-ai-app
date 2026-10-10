const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createHash } = require("node:crypto");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const base = process.env.READING_SCENE_BASE || "http://127.0.0.1:3001";
const chapter = "/books/forge-of-ruin/the-forty-seven-names";
const owner = "00000000-0000-4000-8000-000000000001";
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jUxoAAAAASUVORK5CYII=";
const modes = [
  {
    name: "desktop",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  },
  {
    name: "mobile",
    viewport: { width: 375, height: 900 },
    reducedMotion: "no-preference",
    hasTouch: true,
  },
  {
    name: "reduced-motion",
    viewport: { width: 375, height: 900 },
    reducedMotion: "reduce",
    hasTouch: true,
  },
  {
    name: "forced-colors",
    viewport: { width: 375, height: 900 },
    reducedMotion: "reduce",
    forcedColors: "active",
  },
];
async function selectPassage(
  page,
  { keyboard = false, replacement = false } = {},
) {
  await page.locator("article .prose p").first().scrollIntoViewIfNeeded();
  const text = await page.locator("article .prose p").first().textContent();
  assert.ok(
    text.trim().length >= 12,
    "Rendered public chapter must contain real prose",
  );
  await page
    .locator("article .prose p")
    .first()
    .evaluate((element) => {
      // The programmatic selection must leave the brief editor, as a reader
      // does when highlighting chapter prose.
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      if (
        selection.toString().replace(/\s+/g, " ").trim() !==
        element.textContent.replace(/\s+/g, " ").trim()
      )
        throw Error(
          JSON.stringify({
            stage:
              "Fixture must select the rendered chapter text before activation",
            expected: element.textContent.slice(0, 1400),
            selected: selection.toString().slice(0, 1400),
            range: range.toString().slice(0, 1400),
            activeTag: document.activeElement?.tagName,
            connected: element.isConnected,
            userSelect: getComputedStyle(element).userSelect,
          }),
        );
      document.dispatchEvent(new Event("selectionchange"));
    });
  const action = page.getByRole("button", {
    name: "Visualize selection",
    exact: true,
  });
  if (keyboard) {
    await action.focus();
    await action.press("Enter");
  } else await action.click();
  await expect(page.getByLabel("Visual brief", { exact: true })).toBeVisible();
  await expect(
    replacement
      ? page.getByRole("button", { name: "Keep current scene", exact: true })
      : page.getByLabel("Visual brief", { exact: true }),
  ).toBeFocused();
  const firstAction = await page
    .getByRole("button", { name: "Visualize a passage", exact: true })
    .boundingBox();
  const navigation = await page.locator("nav").first().boundingBox();
  assert.ok(
    firstAction.y >= navigation.y + navigation.height,
    "The reader's first action must remain below fixed navigation after selection",
  );
  return text.replace(/\s+/g, " ").trim();
}
async function main() {
  await fs.mkdir("screenshots/reading-scene", { recursive: true });
  const sourceHashes = {};
  const sha = (value) => createHash("sha256").update(value).digest("hex");
  for (const path of [
    "apps/web/components/saga/chapter-reader.tsx",
    "apps/web/components/saga/scene-visualizer.tsx",
    "apps/web/components/saga/scene-workspace-view.tsx",
    "apps/web/components/saga/scene-visualizer.module.css",
    "apps/web/lib/reading-scene/brief.ts",
    "apps/web/lib/reading-scene/session.ts",
    "apps/web/app/api/reading-scenes/route.ts",
    "scripts/verify-reading-scene-browser.cjs",
  ])
    sourceHashes[path] = sha(await fs.readFile(path));
  const browser = await chromium.launch();
  const receipts = [];
  try {
    for (const mode of modes) {
      const context = await browser.newContext({
        ...mode,
        acceptDownloads: true,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(20000);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const requests = [];
      let interrupt = true;
      let saved;
      let providerConfigured = false;
      await context.route("**/api/reading-scenes**", async (route) => {
        if (route.request().method() === "GET") {
          return route.fulfill({
            json: {
              scene: saved ?? null,
              imageGeneration: { providerConfigured },
            },
          });
        }
        const body = route.request().postDataJSON();
        assert.equal(body.source.path, chapter);
        assert.ok(body.source.chapterHash.match(/^[a-f0-9]{64}$/));
        saved = {
          schema: "arcanea.reading-scene.v1",
          owner,
          source: body.source,
          brief: body.brief,
          model: body.model,
          requestKey: body.requestKey,
          creationId: body.requestKey,
          result: {
            generationId: `gen_${body.requestKey}`,
            status: "completed",
            provider: "openrouter",
            model: body.model,
            images: [body.image],
          },
        };
        return route.fulfill({
          json: { creationId: body.requestKey, visibility: "private" },
        });
      });
      await context.route("**/api/imagine/generate", async (route) => {
        const body = route.request().postDataJSON();
        requests.push(body);
        if (interrupt) {
          interrupt = false;
          return route.abort("failed");
        }
        return route.fulfill({
          json: {
            generationId: `gen_${body.requestKey}`,
            status: "completed",
            provider: "openrouter",
            model: body.model,
            images: [
              {
                data: png,
                mimeType: "image/png",
                providerAccount: "private-provider-account",
              },
            ],
            credits: { action: "image.standard", charged: 5, balance: 917 },
          },
        });
      });
      try {
        await page.goto(base + chapter);
        await expect(
          page.getByRole("button", {
            name: "Visualize a passage",
            exact: true,
          }),
        ).toBeVisible();
        const passage = await selectPassage(page);
        const login = page.getByRole("link", {
          name: "Sign in to continue",
          exact: true,
        });
        await expect(login).toHaveAttribute(
          "href",
          `/auth/login?next=${encodeURIComponent(chapter)}`,
        );
        const brief = `${await page.getByLabel("Visual brief").inputValue()}\nShow the river at dusk.`;
        await page.getByLabel("Visual brief").fill(brief);
        // UI fixtures only: no account is created and no provider is contacted.
        await context.route("**/auth/v1/**", (route) =>
          route.fulfill({
            json: {
              user: { id: owner, email: "reading-fixture@example.invalid" },
            },
          }),
        );
        // The application uses SSR cookies, not localStorage auth persistence.
        // This cookie is only a compiled-UI fixture; it is never a real credential.
        const encode = (value) =>
          Buffer.from(JSON.stringify(value)).toString("base64url");
        const expiry = Math.floor(Date.now() / 1000) + 3600;
        const session = {
          access_token: `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ sub: owner, exp: expiry })}.Zml4dHVyZQ`,
          refresh_token: "fixture",
          expires_at: expiry,
          expires_in: 3600,
          token_type: "bearer",
          user: {
            id: owner,
            email: "reading-fixture@example.invalid",
            app_metadata: {},
            user_metadata: {},
          },
        };
        await context.addCookies([
          {
            name: "sb-placeholder-auth-token",
            value: `base64-${encode(session)}`,
            url: base,
            sameSite: "Lax",
          },
        ]);
        await page.reload();
        await page
          .getByRole("button", { name: "Reopen scene", exact: true })
          .click();
        await expect(page.getByLabel("Visual brief")).toHaveValue(brief);
        await expect(
          page.getByRole("button", { name: "Generate scene", exact: true }),
        ).toBeDisabled();
        await expect(
          page
            .getByRole("status")
            .filter({ hasText: "Image generation is currently unavailable" }),
        ).toBeVisible();
        assert.equal(
          requests.length,
          0,
          "An unconfigured provider must not receive a generation request",
        );
        providerConfigured = true;
        await page.reload();
        await page
          .getByRole("button", { name: "Reopen scene", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Generate scene", exact: true }),
        ).toBeEnabled();
        assert.equal(
          await page.evaluate(
            (chapter) =>
              sessionStorage.getItem(
                `arcanea:reading-scene:v1:anonymous:${encodeURIComponent(chapter)}`,
              ),
            chapter,
          ),
          null,
          "The anonymous brief must be consumed only after account persistence",
        );
        await page.locator("article .prose p").first().scrollIntoViewIfNeeded();
        await page
          .locator("article .prose p")
          .first()
          .evaluate((element) => {
            if (document.activeElement instanceof HTMLTextAreaElement)
              document.activeElement.blur();
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            if (
              selection.toString().replace(/\s+/g, " ").trim() !==
              element.textContent.replace(/\s+/g, " ").trim()
            )
              throw Error(
                JSON.stringify({
                  stage:
                    "Replacement fixture must select the rendered chapter text",
                  expected: element.textContent.slice(0, 1400),
                  selected: selection.toString().slice(0, 1400),
                  range: range.toString().slice(0, 1400),
                  connected: element.isConnected,
                  activeTag: document.activeElement?.tagName,
                  userSelect: getComputedStyle(element).userSelect,
                }),
              );
            // Activate in the same task, before selectionchange/React can commit.
            // Ordinary pointer/touch activation is exercised by selectPassage above.
            const action = [...document.querySelectorAll("button")].find(
              (button) => button.textContent.trim() === "Visualize a passage",
            );
            if (!action) throw new Error("Reader action is missing");
            action.click();
          });
        await expect(
          page.getByRole("group", { name: "Replace current scene" }),
        ).toBeVisible();
        await expect(
          page.getByRole("button", { name: "Keep current scene", exact: true }),
        ).toBeFocused();
        await expect(page.getByLabel("Visual brief")).toHaveValue(brief);
        await page
          .getByRole("button", { name: "Keep current scene", exact: true })
          .click();
        await expect(
          page.getByRole("group", { name: "Replace current scene" }),
        ).toHaveCount(0);
        await expect(page.getByLabel("Visual brief")).toBeFocused();
        await page
          .getByRole("button", { name: "Return to reading", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Reopen scene", exact: true }),
        ).toBeVisible();
        await selectPassage(page, { keyboard: true, replacement: true });
        await page
          .getByRole("button", { name: "Keep current scene", exact: true })
          .press("Enter");
        await expect(page.getByLabel("Visual brief")).toBeFocused();
        await expect(page.getByLabel("Visual brief")).toHaveValue(brief);
        await page
          .getByRole("button", { name: "Generate scene", exact: true })
          .click();
        await expect(
          page
            .getByRole("status")
            .filter({ hasText: "response was interrupted" }),
        ).toBeVisible();
        const key = requests[0].requestKey;
        await page.reload();
        await page
          .getByRole("button", { name: "Reopen scene", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Recover request", exact: true })
          .click();
        await expect(
          page.getByRole("img", { name: /Personal visual interpretation/ }),
        ).toBeVisible();
        assert.equal(requests[1].requestKey, key);
        assert.equal(requests[1].prompt, brief);
        const retainedResult = await page.evaluate(
          ({ owner, chapter }) =>
            JSON.parse(
              sessionStorage.getItem(
                `arcanea:reading-scene:v1:${encodeURIComponent(owner)}:${encodeURIComponent(chapter)}`,
              ),
            ).result,
          { owner, chapter },
        );
        assert.equal(retainedResult.credits, undefined);
        assert.equal(retainedResult.images[0].providerAccount, undefined);
        const downloaded = page.waitForEvent("download");
        await page
          .getByRole("button", {
            name: "Download scene and source",
            exact: true,
          })
          .click();
        const download = await downloaded;
        const stream = await download.createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const artifact = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        assert.equal(artifact.source.passage, passage);
        assert.equal(artifact.brief, brief);
        assert.equal(artifact.result.images[0].data, png);
        assert.equal(artifact.schema, "arcanea.reading-scene-export.v1");
        assert.deepEqual(Object.keys(artifact), [
          "schema",
          "source",
          "brief",
          "model",
          "result",
        ]);
        assert.equal(artifact.result.credits, undefined);
        assert.equal(artifact.result.generationId, undefined);
        assert.equal(artifact.result.images[0].providerAccount, undefined);
        assert.equal(JSON.stringify(artifact).includes(owner), false);
        assert.equal(JSON.stringify(artifact).includes(key), false);
        await page
          .getByRole("button", { name: "Save private creation", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Saved privately", exact: true }),
        ).toBeVisible();
        await page.evaluate(
          (chapter) =>
            sessionStorage.removeItem(
              `arcanea:reading-scene:v1:00000000-0000-4000-8000-000000000001:${encodeURIComponent(chapter)}`,
            ),
          chapter,
        );
        await page.reload();
        await page
          .getByRole("button", { name: "Reopen scene", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Saved privately", exact: true }),
        ).toBeVisible();
        const box = await page
          .getByRole("button", { name: "Return to reading", exact: true })
          .boundingBox();
        assert.ok(box.height >= 44);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        const assistant = page.getByRole("button", {
          name: "Open Arcanea assistant",
          exact: true,
        });
        for (const control of await page
          .getByRole("region", { name: "Passage visualization" })
          .getByRole("button")
          .all()) {
          if (!(await control.isVisible())) continue;
          await control.scrollIntoViewIfNeeded();
          const controlBox = await control.boundingBox();
          const assistantBox = await assistant.boundingBox();
          if (assistantBox)
            assert.ok(
              controlBox.x + controlBox.width <= assistantBox.x ||
                assistantBox.x + assistantBox.width <= controlBox.x ||
                controlBox.y + controlBox.height <= assistantBox.y ||
                assistantBox.y + assistantBox.height <= controlBox.y,
              "The floating companion must not cover a reading-scene control",
            );
        }
        assert.deepEqual(errors, []);
        await page
          .getByRole("region", { name: "Passage visualization" })
          .evaluate((element) =>
            element.scrollIntoView({ block: "start", behavior: "instant" }),
          );
        await page
          .getByRole("button", { name: "Return to reading", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Reopen scene", exact: true }),
        ).toBeVisible();
        await selectPassage(page, { keyboard: true, replacement: true });
        await page
          .getByRole("button", { name: "Keep current scene", exact: true })
          .press("Enter");
        await expect(
          page.getByRole("region", { name: "Passage visualization" }),
        ).toBeFocused();
        await expect(
          page.getByRole("img", { name: /Personal visual interpretation/ }),
        ).toBeVisible();
        await expect(
          page.getByRole("button", { name: "Saved privately", exact: true }),
        ).toBeVisible();
        assert.equal(requests.length, 2);
        assert.deepEqual(errors, []);
        await page.screenshot({
          path: `screenshots/reading-scene/${mode.name}.png`,
        });
        const capturePath = `screenshots/reading-scene/${mode.name}.png`;
        const imageSha256 = sha(await fs.readFile(capturePath));
        await fs.writeFile(
          `${capturePath}.json`,
          JSON.stringify(
            {
              head: process.env.READING_SCENE_HEAD,
              sourceHashes,
              imageSha256,
              mode,
              renderer: browser.version(),
              purpose:
                "Compiled UI verification; synthetic raster/auth/provider/storage fixtures",
            },
            null,
            2,
          ),
        );
        receipts.push({
          mode: mode.name,
          passed: true,
          imageSha256,
          checks: [
            "source selection",
            "focus",
            "scene actions clear fixed navigation",
            "anonymous admission",
            "unconfigured provider blocks new generation while retaining the brief",
            "edited brief",
            "passage action snapshots selection before the queued change event",
            "replacement cancellation preserves current scene",
            "keyboard replacement moves focus to confirmation and back",
            "completed scene cancellation retains image/save and focuses workspace",
            "reload",
            "interruption",
            "same-key recovery",
            "source/image export",
            "retained result and portable export exclude private billing metadata",
            "private save/reopen",
            "touch target",
            "no overflow",
            "companion does not cover scene controls",
          ],
        });
      } catch (error) {
        const workspace = await page
          .getByRole("region", { name: "Passage visualization" })
          .innerText()
          .catch(() => "Workspace unavailable");
        await fs.writeFile(
          `screenshots/reading-scene/failure-${mode.name}.json`,
          JSON.stringify(
            {
              head: process.env.READING_SCENE_HEAD,
              sourceHashes,
              mode,
              error: String(error.message ?? error).slice(0, 5000),
              workspace: workspace.slice(0, 10000),
              pageErrors: errors,
              generationRequests: requests.length,
              evidence: "Synthetic compiled UI failure; no real customer data",
            },
            null,
            2,
          ),
        );
        receipts.push({ mode: mode.name, passed: false });
        throw error;
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    await fs.writeFile(
      "screenshots/reading-scene/receipt.json",
      JSON.stringify(
        {
          head: process.env.READING_SCENE_HEAD,
          sourceHashes,
          evidence:
            "compiled UI with auth/provider/storage fixtures; no paid output or real account proof",
          receipts,
        },
        null,
        2,
      ),
    );
  }
}
main().catch((e) => {
  console.error(e.stack ?? e);
  process.exitCode = 1;
});
