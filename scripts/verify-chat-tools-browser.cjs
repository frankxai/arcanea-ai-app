const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");

const base = process.env.CHAT_TOOLS_TEST_BASE_URL || "http://localhost:3001";

async function main() {
  const browser = await chromium.launch();
  const evidence = [];
  try {
    for (const state of [
      { name: "desktop", width: 1440, height: 900, motion: "no-preference" },
      { name: "mobile", width: 375, height: 812, motion: "no-preference" },
      { name: "reduced-motion", width: 375, height: 812, motion: "reduce" },
    ]) {
      const context = await browser.newContext({
        viewport: { width: state.width, height: state.height },
        reducedMotion: state.motion,
      });
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(15_000);
        let inferenceRequests = 0;
        await page.route("**/api/**", async (route) => {
          const request = route.request();
          const pathname = new URL(request.url()).pathname;
          if (
            request.method() === "POST" &&
            [
              "/api/ai/chat",
              "/api/chat",
              "/api/imagine/",
              "/api/voice/tools",
            ].some((prefix) => pathname.startsWith(prefix))
          ) {
            inferenceRequests++;
            await route.abort();
          } else {
            await route.continue();
          }
        });
        const response = await page.goto(base + "/chat", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        const trigger = page.getByRole("button", {
          name: "Tools (0 selected)",
          exact: true,
        });
        await expect(trigger).toBeVisible({ timeout: 30_000 });
        await trigger.focus();
        await page.keyboard.press("Enter");
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        for (const name of [
          /^Image generation/,
          /^Extended thinking/,
          /^Web search/,
        ]) {
          await expect(page.getByRole("button", { name })).toBeDisabled();
        }
        const imagine = page.getByRole("link", {
          name: "Open Imagine",
          exact: true,
        });
        await expect(imagine).toHaveAttribute("href", "/imagine");
        await page.keyboard.press("Tab");
        await expect(imagine).toBeFocused();
        const box = await imagine.boundingBox();
        assert.ok(
          box &&
            box.height >= 44 &&
            box.x >= 0 &&
            box.x + box.width <= state.width + 1,
          "Imagine link is visible with a touch target on this viewport",
        );
        await page.keyboard.press("Escape");
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(trigger).toBeFocused();
        await expect(imagine).toHaveCount(0);
        assert.equal(
          inferenceRequests,
          0,
          "availability inspection never sends a generation request",
        );
        evidence.push({
          ...state,
          unavailableTools: 3,
          keyboardCloseRestoresFocus: true,
          imagineTouchTarget: true,
          inferenceRequests,
        });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  const output = path.resolve("screenshots/chat-tools");
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(
    path.join(output, "behavior.json"),
    JSON.stringify(evidence, null, 2),
  );
  console.log(JSON.stringify({ chatToolAvailability: evidence }));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
