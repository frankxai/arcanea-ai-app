const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const base = process.env.VOICE_TEST_BASE_URL || "http://localhost:3001";

async function main() {
  const browser = await chromium.launch();
  const evidence = [];
  try {
    for (const mode of [
      { name: "desktop", width: 1440, height: 900, motion: "no-preference" },
      { name: "mobile", width: 375, height: 812, motion: "no-preference" },
      { name: "reduced-motion", width: 375, height: 812, motion: "reduce" },
    ]) {
      const context = await browser.newContext({
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.motion,
      });
      let releasePending;
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        await page.addInitScript(() => {
          const originalFetch = window.fetch;
          window.__voiceRequestAborts = 0;
          window.fetch = function (input, init) {
            if (input === "/api/ai/speak") {
              init?.signal?.addEventListener(
                "abort",
                () => window.__voiceRequestAborts++,
                { once: true },
              );
            }
            return originalFetch.call(this, input, init);
          };
        });
        const voiceAlert = page.getByRole("alert", {
          name: "Voice playback",
          exact: true,
        });
        const errors = [];
        const requests = [];
        page.on("pageerror", (error) => errors.push(error.message));
        let pending = false;
        await page.route("**/api/ai/speak", async (route) => {
          const request = route.request();
          requests.push({
            keys: {
              groq: request.headers()["x-groq-key"],
              openai: request.headers()["x-openai-key"],
              anthropic: request.headers()["x-anthropic-key"],
            },
            body: request.postDataJSON(),
          });
          if (pending) {
            await new Promise((resolve) => {
              releasePending = resolve;
            });
            await route.abort().catch(() => {});
            return;
          }
          await route.fulfill({
            status: requests.length === 1 ? 401 : 502,
            contentType: "application/json",
            body: JSON.stringify({
              error: "Voice provider request failed.",
              cta: requests.length === 1 ? "byok" : "retry",
            }),
          });
        });
        const response = await page.goto(base + "/voice", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        assert.equal(
          await page.locator("button button").count(),
          0,
          "Voice controls must not nest interactive buttons",
        );
        const listen = page.getByRole("button", {
          name: "Listen to Lumina",
          exact: true,
        });
        const box = await listen.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44);
        await listen.focus();
        await page.keyboard.press("Enter");
        await expect(voiceAlert).toContainText("Settings");
        await expect(
          voiceAlert.getByRole("link", {
            name: "Provider settings",
            exact: true,
          }),
        ).toHaveAttribute("href", "/settings/providers");
        assert.deepEqual(requests[0].keys, {
          groq: undefined,
          openai: undefined,
          anthropic: undefined,
        });
        await page.evaluate(() =>
          localStorage.setItem(
            "arcanea-provider-keys",
            JSON.stringify({
              groq: "test-customer-groq",
              openai: "sk-test-key",
              anthropic: "sk-ant-test",
            }),
          ),
        );
        await listen.click();
        await expect(voiceAlert).toContainText("Voice provider request failed");
        assert.deepEqual(requests[1].keys, {
          groq: "test-customer-groq",
          openai: "sk-test-key",
          anthropic: undefined,
        });
        pending = true;
        await listen.click();
        await expect(voiceAlert).toHaveCount(0);
        await expect.poll(() => requests.length).toBe(3);
        assert.equal(typeof releasePending, "function");
        await listen.click();
        assert.equal(await page.evaluate(() => window.__voiceRequestAborts), 1);
        releasePending();
        await page.waitForTimeout(500);
        await expect(voiceAlert).toHaveCount(0);
        assert.equal(
          requests.length,
          3,
          "Stopping a pending voice request must not start another",
        );
        await page
          .getByRole("button", { name: "Select Draconia", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Select Draconia", exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
          "Voice page must retain mobile reflow",
        );
        assert.deepEqual(errors, []);
        evidence.push({
          mode: mode.name,
          keyboardRecovery: true,
          touchTarget: true,
          customerKeySelection: true,
          pendingCancel: true,
          providerRequests: 0,
        });
      } finally {
        releasePending?.();
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  await fs.mkdir("screenshots", { recursive: true });
  await fs.writeFile(
    "screenshots/voice-credentials-behavior.json",
    JSON.stringify(
      { sourceCommit: process.env.GITHUB_SHA || null, evidence },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ evidence }));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
