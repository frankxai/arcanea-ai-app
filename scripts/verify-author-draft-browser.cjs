const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const configPath = process.env.AUTHOR_TEST_CONFIG;
const chapter = "/studio/author/forge-of-ruin/01-the-forty-seven-names";
const api = "/api/author/forge-of-ruin/chapters/01-the-forty-seven-names";
const rich = (text) => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text, marks: [{ type: "bold" }] }],
    },
  ],
});
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
  },
  {
    name: "reduced-motion",
    viewport: { width: 375, height: 900 },
    reducedMotion: "reduce",
  },
];
async function login(page, base, account) {
  await page.goto(`${base}/auth/login?next=${encodeURIComponent(chapter)}`);
  await page.getByLabel("Email", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(`**${chapter}`, { timeout: 30000 });
}
async function download(page, button) {
  const pending = page.waitForEvent("download");
  await button.click();
  const result = await pending;
  const stream = await result.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function main() {
  const config = configPath
    ? JSON.parse(await fs.readFile(configPath, "utf8"))
    : null;
  if (config) {
    assert.equal(
      config.project,
      "estrxcuwacntfeafqttz",
      "Hosted fixture may only use the owned isolated preview",
    );
    assert.ok(
      config.accounts.every((account) =>
        account.email.endsWith("@example.invalid"),
      ),
    );
    assert.ok(
      !/^https:\/\/(www\.|app\.)?arcanea\.ai/.test(config.base),
      "This fixture must never write production",
    );
  }
  const base = config?.base || "http://localhost:3001";
  const output = config?.output || "screenshots/author-drafts";
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const rows = [];
  try {
    for (const mode of modes) {
      const context = await browser.newContext({
        ...mode,
        acceptDownloads: true,
      });
      const page = await context.newPage();
      page.setDefaultTimeout(20000);
      page.on("dialog", (dialog) => dialog.accept());
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      let server = {
        content: "Initial fixture chapter",
        contentJson: rich("Initial fixture chapter"),
        authorId: "00000000-0000-4000-8000-000000000001",
        source: "draft",
        draftUpdatedAt: "2026-10-10T00:00:00.000Z",
      };
      let failSave = false;
      let capturedFeedback;
      const posts = [];
      await context.route(`**${api}`, async (route) => {
        if (route.request().method() === "POST") {
          const payload = route.request().postDataJSON();
          posts.push(payload);
          if (failSave)
            return route.fulfill({
              status: 503,
              json: { error: "Synthetic interrupted save" },
            });
          if (config) return route.continue();
          assert.equal(payload.authorId, server.authorId);
          assert.equal(payload.draftUpdatedAt, server.draftUpdatedAt);
          server = {
            ...server,
            content: payload.content,
            contentJson: payload.contentJson,
            draftUpdatedAt: new Date(
              Date.parse(server.draftUpdatedAt) + 1,
            ).toISOString(),
          };
          return route.fulfill({
            json: { success: true, draftUpdatedAt: server.draftUpdatedAt },
          });
        }
        if (config) return route.continue();
        return route.fulfill({ json: server });
      });
      await context.route("**/api/ai/author-chat", async (route) => {
        capturedFeedback = {
          body: route.request().postDataJSON(),
          key: route.request().headers()["x-anthropic-key"],
        };
        await route.fulfill({
          status: 400,
          json: { error: "Synthetic bounded request" },
        });
      });
      try {
        if (config?.shareUrl) await page.goto(config.shareUrl);
        if (config) await login(page, base, config.accounts[0]);
        else await page.goto(`${base}${chapter}`);
        const editor = page.locator('.ProseMirror[contenteditable="true"]');
        await expect(editor).toBeVisible();
        if (config) {
          const initial = await context.request.get(`${base}${api}`);
          assert.equal(initial.status(), 200);
          server = await initial.json();
          assert.equal(server.authorId, config.accounts[0].id);
        }
        const initialRevision = server.draftUpdatedAt;
        const marker = `Private lighthouse draft ${mode.name}`;
        await editor.fill(marker);
        await page
          .getByRole("button", { name: "Save draft", exact: true })
          .click();
        await expect(
          page.getByRole("status").filter({ hasText: "Private draft saved" }),
        ).toBeVisible();
        assert.ok(posts.at(-1).content.includes(marker));
        assert.equal(posts.at(-1).draftUpdatedAt, initialRevision);
        await page.reload();
        await expect(editor).toContainText(marker);
        if (config) {
          const reopened = await (
            await context.request.get(`${base}${api}`)
          ).json();
          assert.equal(reopened.source, "draft");
          assert.ok(JSON.stringify(reopened.contentJson).includes(marker));
        }
        await page.evaluate(() =>
          localStorage.setItem(
            "arcanea-author-api-key",
            "test-author-customer-key",
          ),
        );
        await editor.fill(`${marker} newest unsaved paragraph`);
        await page.getByLabel("Model", { exact: true }).selectOption("haiku");
        await page
          .getByLabel("Ask about this chapter", { exact: true })
          .fill("Review the current paragraph");
        await page
          .getByRole("button", { name: "Ask companion", exact: true })
          .click();
        await expect(
          page.getByRole("alert").filter({ hasText: "32,000" }),
        ).toBeVisible();
        assert.ok(
          capturedFeedback.body.editorText.includes("newest unsaved paragraph"),
        );
        assert.equal(capturedFeedback.body.model, "haiku");
        assert.equal(capturedFeedback.key, "test-author-customer-key");
        await expect(
          page.getByLabel("Ask about this chapter", { exact: true }),
        ).toHaveValue("Review the current paragraph");
        failSave = true;
        const interrupted = `${marker} interrupted recovery paragraph`;
        await editor.fill(interrupted);
        await page.keyboard.press("Control+s");
        const recovery = page.getByRole("alert", {
          name: "Draft save recovery",
        });
        await expect(recovery).toBeVisible();
        const savedCopy = await download(
          page,
          recovery.getByRole("button", { name: "Download draft", exact: true }),
        );
        assert.ok(savedCopy.content_text.includes(interrupted));
        assert.ok(JSON.stringify(savedCopy.content_json).includes(interrupted));
        await page.goBack();
        await expect(page).toHaveURL(`${base}${chapter}`);
        await expect(editor).toContainText(interrupted);
        await page.reload();
        await expect(
          page.getByRole("alert", { name: "Recover chapter draft" }),
        ).toBeVisible();
        await page
          .getByRole("button", { name: "Restore unsaved edits", exact: true })
          .click();
        await expect(editor).toContainText(interrupted);
        failSave = false;
        await page
          .getByRole("button", { name: "Save draft", exact: true })
          .click();
        await expect(
          page.getByRole("status").filter({ hasText: "Private draft saved" }),
        ).toBeVisible();
        await page.evaluate(
          ({ authorId }) =>
            localStorage.setItem(
              `arcanea-author-draft:${authorId}:forge-of-ruin:01-the-forty-seven-names`,
              JSON.stringify({ unreadable: "retained recovery copy" }),
            ),
          server,
        );
        await page.reload();
        await expect(
          page.getByRole("alert", { name: "Unreadable recovery copy" }),
        ).toBeVisible();
        await expect(editor).toHaveCount(0);
        const damaged = await download(
          page,
          page.getByRole("button", {
            name: "Download recovery copy",
            exact: true,
          }),
        );
        assert.equal(damaged.unreadable, "retained recovery copy");
        await page
          .getByRole("button", { name: "Discard unreadable copy", exact: true })
          .click();
        await expect(editor).toContainText(interrupted);
        if (config) {
          const latest = await (
            await context.request.get(`${base}${api}`)
          ).json();
          const payload = {
            authorId: latest.authorId,
            draftUpdatedAt: latest.draftUpdatedAt,
            content: `${marker} conflict winner`,
            contentJson: rich(`${marker} conflict winner`),
          };
          assert.equal(
            (
              await context.request.post(`${base}${api}`, { data: payload })
            ).status(),
            200,
          );
          assert.equal(
            (
              await context.request.post(`${base}${api}`, {
                data: { ...payload, content: "stale editor must be refused" },
              })
            ).status(),
            409,
          );
          const after = await (
            await context.request.get(`${base}${api}`)
          ).json();
          assert.ok(after.content.includes("conflict winner"));
          await page.reload();
          await expect(editor).toContainText("conflict winner");
        }
        await expect(
          page.getByRole("button", {
            name: "Publish (review pending)",
            exact: true,
          }),
        ).toBeDisabled();
        for (const name of ["Save draft", "Download draft"]) {
          const box = await page
            .getByRole("button", { name, exact: true })
            .boundingBox();
          assert.ok(box && box.height >= 44 && box.width >= 44);
        }
        assert.equal(
          await page
            .getByLabel("Ask about this chapter", { exact: true })
            .evaluate((element) => getComputedStyle(element).fontSize),
          "16px",
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        );
        if (mode.name !== "desktop") {
          await page.locator("summary").filter({ hasText: "Chapters" }).click();
          await expect(
            page.getByRole("navigation", { name: "Chapters", exact: true }),
          ).toBeVisible();
        }
        assert.deepEqual(errors, []);
        await page.screenshot({
          path: `${output}/${mode.name}.png`,
          fullPage: true,
        });
        rows.push({
          mode: mode.name,
          authenticated: !!config,
          realDatabase: !!config,
          saveReopen: true,
          nativeBackHeldOnFailure: true,
          retry: true,
          recoveryDownload: true,
          unreadableBackupRetained: true,
          latestEditorFeedback: true,
          conflictDenial: !!config,
          touchTargets: true,
          reflow: true,
          paidProviderRequests: 0,
        });
      } finally {
        await context.close();
      }
    }
    if (config) {
      const other = await browser.newContext({ acceptDownloads: true });
      try {
        const page = await other.newPage();
        await login(page, base, config.accounts[1]);
        const response = await other.request.get(`${base}${api}`);
        assert.equal(response.status(), 200);
        const value = await response.json();
        assert.equal(value.authorId, config.accounts[1].id);
        assert.equal(value.source, "published");
        assert.ok(!value.content.includes("conflict winner"));
        rows.push({ secondAccountIsolation: true, realDatabase: true });
      } finally {
        await other.close();
      }
    }
  } finally {
    await browser.close();
    await fs.writeFile(
      `${output}/receipt.json`,
      JSON.stringify(
        {
          sourceCommit: config?.head || process.env.GITHUB_SHA || null,
          environment: config
            ? "isolated hosted preview"
            : "compiled UI with intercepted draft transport",
          evidence: rows,
        },
        null,
        2,
      ),
    );
  }
  console.log(JSON.stringify({ evidence: rows }));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
