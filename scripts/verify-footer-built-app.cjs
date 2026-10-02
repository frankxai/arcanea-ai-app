const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const base = "http://127.0.0.1:3001";
const output = "screenshots/footer";
const states = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile-375", viewport: { width: 375, height: 812 } },
  {
    name: "reduced-motion",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  },
  {
    name: "forced-colors",
    viewport: { width: 375, height: 812 },
    forcedColors: "active",
  },
];
const sourceFiles = [
  "apps/web/components/navigation/footer.tsx",
  "apps/web/lib/waitlist/submit.ts",
  "apps/web/lib/waitlist/__tests__/submit.test.ts",
  "scripts/verify-footer-built-app.cjs",
  ".github/workflows/ci.yml",
  "apps/web/app/api/subscribe/route.ts",
  "apps/web/lib/waitlist/join.ts",
  "apps/web/app/layout.tsx",
  "apps/web/app/globals.css",
  "packages/design-system/src/tokens.css",
  "apps/web/middleware.ts",
];
function sourceEvidence() {
  const checkoutCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const event = process.env.GITHUB_EVENT_PATH
    ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"))
    : null;
  const reviewedSourceCommit = event?.pull_request?.head?.sha || checkoutCommit;
  assert.match(reviewedSourceCommit, /^[a-f0-9]{40}$/);
  assert.match(checkoutCommit, /^[a-f0-9]{40}$/);
  for (const path of sourceFiles) {
    assert.ok(
      fs
        .readFileSync(path)
        .equals(
          execFileSync("git", ["show", `${reviewedSourceCommit}:${path}`]),
        ),
      `Source mismatch: ${path}`,
    );
  }
  return {
    checkoutCommit,
    reviewedSourceCommit,
    sourceFilesMatchReviewedCommit: true,
    sourceFileSha256: Object.fromEntries(
      sourceFiles.map((path) => [
        path,
        crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex"),
      ]),
    ),
  };
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const source = sourceEvidence();
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      if (
        (await fetch(base, { signal: AbortSignal.timeout(2000) })).status ===
        200
      ) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Built Next app did not become ready");
  const browser = await chromium.launch();
  const reports = [];
  const captures = [];
  let completed = false;
  const capture = async (footer, page, state, name) => {
    await page.evaluate(() => document.fonts.ready);
    await footer.scrollIntoViewIfNeeded();
    const path = `${output}/${name}-${state.name}.png`;
    await footer.screenshot({ path, type: "png", animations: "disabled" });
    const bytes = fs.readFileSync(path);
    const provenance = {
      kind: "browser-screenshot",
      screenshotAnimations: "disabled",
      prompt: `Capture existing footer UI: ${name}, ${state.name}, ${page.url()}`,
      model: null,
      provider: "Playwright Chromium",
      seed: null,
      agentSession: "01a0f74f-8bad-7db1-ab06-fd89b5faec84",
      ...source,
      viewport: state.viewport,
      reducedMotion: state.reducedMotion || "no-preference",
      forcedColors: state.forcedColors || "none",
      url: page.url(),
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    };
    fs.writeFileSync(
      `${path}.vis.provenance.json`,
      JSON.stringify(provenance, null, 2) + "\n",
    );
    captures.push({ path, ...provenance });
  };
  try {
    for (const state of states) {
      const context = await browser.newContext({
        viewport: state.viewport,
        reducedMotion: state.reducedMotion || "no-preference",
        forcedColors: state.forcedColors || "none",
        deviceScaleFactor: 1,
      });
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(20_000);
        page.setDefaultNavigationTimeout(30_000);
        await page.clock.install();
        const posts = [];
        const unexpectedWaitlist = [];
        const runtimeErrors = [];
        page.on("pageerror", (error) => runtimeErrors.push(error.message));
        let mode = "held-success";
        let held;
        await page.route("**/api/waitlist", async (route) => {
          unexpectedWaitlist.push(route.request().url());
          await route.fulfill({ status: 503, json: { success: false } });
        });
        await page.route("**/api/subscribe", async (route) => {
          const request = route.request();
          assert.equal(request.method(), "POST");
          const body = request.postDataJSON();
          assert.deepEqual(Object.keys(body).sort(), ["email", "source"]);
          assert.equal(body.source, "footer");
          posts.push(body);
          if (mode === "held-success") {
            held = route;
            return;
          }
          if (mode === "timeout") return;
          if (mode === "network") {
            await route.abort("failed");
            return;
          }
          if (mode === "malformed") {
            await route.fulfill({
              status: 200,
              contentType: "text/plain",
              body: "not JSON",
            });
            return;
          }
          if (mode === "invalid-email") {
            await route.fulfill({
              status: 400,
              json: {
                success: false,
                error: "Please enter a valid email address.",
              },
            });
            return;
          }
          await route.fulfill({
            status: mode === "failure" ? 503 : 200,
            json: { success: true },
          });
        });
        const response = await page.goto(base, {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        const footer = page.getByRole("contentinfo");
        assert.equal(await footer.count(), 1);
        const input = footer.getByLabel("Email address for Arcanea updates", {
          exact: true,
        });
        const form = footer.locator("form");
        const button = form.getByRole("button");
        await expect(button).toHaveAccessibleName("Subscribe");
        await footer.scrollIntoViewIfNeeded();
        await expect(input).toBeVisible();
        const describedBy = (
          await input.getAttribute("aria-describedby")
        ).split(" ");
        for (const id of describedBy)
          assert.equal(await page.locator(`[id="${id}"]`).count(), 1);
        await input.fill("broken");
        await button.click();
        assert.equal(
          await input.evaluate((element) => element.checkValidity()),
          false,
        );
        assert.equal(
          posts.length,
          0,
          "Native invalid email must not send a request",
        );
        await input.fill("reader@example.com");
        await input.press("Tab");
        await expect(button).toBeFocused();
        await button.press("Enter");
        await expect.poll(() => posts.length).toBe(1);
        await expect(input).toHaveJSProperty("readOnly", true);
        await expect(button).toBeDisabled();
        await expect(button).toHaveAccessibleName("Saving…");
        await expect(form).toHaveAttribute("aria-busy", "true");
        await expect(footer.getByRole("status")).toHaveText(
          "Saving your email…",
        );
        await input.focus();
        await input.pressSequentially("replacement");
        await expect(input).toHaveValue("reader@example.com");
        await form.evaluate((element) => {
          element.requestSubmit();
          element.requestSubmit();
        });
        assert.equal(
          posts.length,
          1,
          "Pending guard suppresses duplicate native submits",
        );
        await capture(footer, page, state, "pending");
        await held.fulfill({ status: 200, json: { success: true } });
        await expect(footer.getByRole("status")).toHaveText(
          "Your email is on the updates list.",
        );
        await expect(input).toHaveValue("");
        await expect(input).toHaveJSProperty("readOnly", false);
        await expect(button).toBeEnabled();
        await capture(footer, page, state, "saved");

        const recoveryEmail = `reader-${state.name}@example.com`;
        for (const failure of ["failure", "network", "malformed"]) {
          mode = failure;
          const failedEmail = `reader-${failure}-${state.name}@example.com`;
          await input.fill(failedEmail);
          await expect(footer.getByRole("status")).toHaveText("");
          await button.click();
          await expect(footer.getByRole("status")).toContainText(
            "couldn't confirm your signup",
          );
          await expect(input).toHaveValue(failedEmail);
          await expect(input).toHaveAttribute("aria-invalid", "false");
          await expect(button).toBeEnabled();
        }
        await capture(footer, page, state, "failure-recovery");
        mode = "invalid-email";
        await input.fill("a@b");
        assert.equal(
          await input.evaluate((element) => element.checkValidity()),
          true,
        );
        await button.click();
        await expect(footer.getByRole("status")).toHaveText(
          "Please enter a valid email address.",
        );
        await expect(input).toHaveValue("a@b");
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toBeFocused();
        await capture(footer, page, state, "invalid-email");
        mode = "timeout";
        await input.fill(recoveryEmail);
        await button.click();
        await expect(input).toHaveJSProperty("readOnly", true);
        await page.clock.fastForward(10_001);
        await expect(footer.getByRole("status")).toContainText(
          "may have been saved; retrying is safe",
        );
        await expect(input).toHaveValue(recoveryEmail);
        await expect(input).toHaveAttribute("aria-invalid", "false");
        await expect(button).toBeEnabled();
        await capture(footer, page, state, "uncertain-timeout");
        mode = "success";
        await button.click();
        await expect(footer.getByRole("status")).toHaveText(
          "Your email is on the updates list.",
        );
        await expect(input).toHaveValue("");
        assert.equal(posts.length, 7);
        assert.deepEqual(unexpectedWaitlist, []);
        assert.deepEqual(runtimeErrors, []);
        const overflow = await footer.evaluate(
          (element) => element.scrollWidth - element.clientWidth,
        );
        assert.ok(overflow <= 1, `Footer overflow: ${overflow}px`);
        reports.push({
          state: state.name,
          overflow,
          interceptedPosts: posts.length,
          pendingEmailProtected: true,
          duplicateSuppressed: true,
          nativeValidation: true,
          explicitReceipt: true,
          failuresRetainEmail: true,
          invalidEmailFocused: true,
          uncertainTimeoutRecovery: true,
          runtimeErrors,
        });
      } finally {
        await context.close();
      }
    }
    completed = true;
  } finally {
    await browser.close();
    fs.writeFileSync(
      `${output}/report.json`,
      JSON.stringify(
        {
          scope:
            "Built CI footer with intercepted subscribe responses and virtual deadline; no live signup/database/mail or customer acceptance",
          completed,
          ...source,
          states,
          reports,
          captures,
        },
        null,
        2,
      ) + "\n",
    );
  }
  assert.equal(reports.length, states.length);
  console.log(
    `Verified footer signup pending, explicit save, failure, invalid email and timeout recovery in ${reports.length} Chromium contexts.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
