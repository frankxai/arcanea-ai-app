const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
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
];
async function selectPassage(page) {
  const text = await page.locator("article .prose p").first().textContent();
  assert.ok(
    text.trim().length >= 12,
    "Rendered public chapter must contain real prose",
  );
  await page
    .locator("article .prose p")
    .first()
    .evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
    });
  await page
    .getByRole("button", { name: "Visualize selection", exact: true })
    .click();
  await expect(page.getByLabel("Visual brief", { exact: true })).toBeVisible();
  assert.equal(
    await page
      .getByLabel("Visual brief")
      .evaluate((e) => document.activeElement === e),
    true,
  );
  return text.replace(/\s+/g, " ").trim();
}
async function main() {
  await fs.mkdir("screenshots/reading-scene", { recursive: true });
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
      await context.route("**/api/reading-scenes**", async (route) => {
        if (route.request().method() === "GET") {
          return route.fulfill({ json: { scene: saved ?? null } });
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
            images: [{ data: png, mimeType: "image/png" }],
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
          name: "Sign in to generate",
          exact: true,
        });
        await expect(login).toHaveAttribute(
          "href",
          `/auth/login?next=${encodeURIComponent(chapter)}`,
        );
        const brief = `${await page.getByLabel("Visual brief").inputValue()}\nShow the river at dusk.`;
        await page.getByLabel("Visual brief").fill(brief);
        // UI fixtures only: no account is created and no provider is contacted.
        await page.evaluate(
          ({ owner, chapter }) => {
            const anonymousKey = `arcanea:reading-scene:v1:anonymous:${encodeURIComponent(chapter)}`;
            const scene = JSON.parse(sessionStorage.getItem(anonymousKey));
            scene.owner = owner;
            sessionStorage.setItem(
              `arcanea:reading-scene:v1:${owner}:${encodeURIComponent(chapter)}`,
              JSON.stringify(scene),
            );
          },
          { owner, chapter },
        );
        await context.route("**/auth/v1/**", (route) =>
          route.fulfill({
            json: {
              user: { id: owner, email: "reading-fixture@example.invalid" },
            },
          }),
        );
        await page.evaluate(
          ({ owner }) => {
            const url = [...document.querySelectorAll("script")]
              .map((s) => s.textContent)
              .join(" ");
            // Build fixture uses placeholder Supabase; no real auth token exists.
            const payload = btoa(
              JSON.stringify({
                sub: owner,
                exp: Math.floor(Date.now() / 1000) + 3600,
              }),
            );
            localStorage.setItem(
              "sb-placeholder-auth-token",
              JSON.stringify({
                access_token: `fixture.${payload}.fixture`,
                refresh_token: "fixture",
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                token_type: "bearer",
                user: {
                  id: owner,
                  email: "reading-fixture@example.invalid",
                  app_metadata: {},
                  user_metadata: {},
                },
              }),
            );
          },
          { owner },
        );
        await page.reload();
        await page
          .getByRole("button", { name: "Reopen scene", exact: true })
          .click();
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
        assert.deepEqual(errors, []);
        await page
          .getByRole("region", { name: "Passage visualization" })
          .screenshot({ path: `screenshots/reading-scene/${mode.name}.png` });
        receipts.push({
          mode: mode.name,
          passed: true,
          checks: [
            "source selection",
            "focus",
            "anonymous admission",
            "edited brief",
            "reload",
            "interruption",
            "same-key recovery",
            "source/image export",
            "private save/reopen",
            "touch target",
            "no overflow",
          ],
        });
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
  console.error(e);
  process.exitCode = 1;
});
