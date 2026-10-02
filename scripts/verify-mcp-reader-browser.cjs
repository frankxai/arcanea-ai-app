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
const output = "screenshots/mcp-reader";
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
  "apps/web/app/mcp/page.tsx",
  "apps/web/app/mcp/mcp-command-center.tsx",
  "apps/web/app/docs/mcp/page.tsx",
  "apps/web/app/docs/mcp/install/page.tsx",
  "apps/web/app/docs/mcp/tools/page.tsx",
  "apps/web/lib/mcp/reader-catalog.ts",
  "apps/web/lib/mcp/__tests__/reader-catalog.test.ts",
  "apps/web/lib/mcp/__tests__/fixtures/reader-tools.json",
  "apps/web/lib/waitlist/submit.ts",
  "apps/web/lib/waitlist/__tests__/submit.test.ts",
  "apps/web/lib/waitlist/join.ts",
  "apps/web/app/api/waitlist/route.ts",
  "apps/web/app/layout.tsx",
  "apps/web/app/globals.css",
  "packages/design-system/src/tokens.css",
  "apps/web/middleware.ts",
  "scripts/verify-mcp-reader-browser.cjs",
  ".github/workflows/ci.yml",
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
  for (const path of sourceFiles)
    assert.ok(
      fs
        .readFileSync(path)
        .equals(
          execFileSync("git", ["show", `${reviewedSourceCommit}:${path}`]),
        ),
      `Source mismatch: ${path}`,
    );
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
        (await fetch(`${base}/mcp`, { signal: AbortSignal.timeout(2000) }))
          .status === 200
      ) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Built Next app did not become ready");
  const browser = await chromium.launch();
  const reports = [],
    captures = [];
  let completed = false;
  const capture = async (panel, page, state, name) => {
    await page.evaluate(() => document.fonts.ready);
    await panel.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    if (!name.startsWith("docs-"))
      await expect
        .poll(() =>
          panel.evaluate((element) =>
            Array.from(element.querySelectorAll("input, button")).every(
              (control) => {
                const box = control.getBoundingClientRect();
                const hit = document.elementFromPoint(
                  box.left + box.width / 2,
                  box.top + box.height / 2,
                );
                return (
                  box.width > 0 &&
                  box.height > 0 &&
                  (control === hit || control.contains(hit))
                );
              },
            ),
          ),
        )
        .toBe(true);
    const path = `${output}/${name}-${state.name}.png`;
    await panel.screenshot({ path, type: "png", animations: "disabled" });
    const bytes = fs.readFileSync(path);
    const provenance = {
      kind: "browser-screenshot",
      screenshotAnimations: "disabled",
      captureScope: name.startsWith("docs-")
        ? "MCP docs content"
        : "MCP Studio waitlist panel",
      prompt: `Capture existing MCP reader ${name}, ${state.name}, ${page.url()}`,
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
        await page.addInitScript(() => {
          window.__arcaneaClipboard = { allow: false, values: [] };
          Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: {
              writeText: async (value) => {
                window.__arcaneaClipboard.values.push(value);
                if (!window.__arcaneaClipboard.allow)
                  throw new Error("Clipboard denied fixture");
              },
            },
          });
        });
        const posts = [],
          runtimeErrors = [],
          unexpected = [],
          overflows = [];
        page.on("pageerror", (error) => runtimeErrors.push(String(error)));
        await page.route(
          "https://arcanea-reader.frankxai.workers.dev/**",
          async (route) => {
            unexpected.push(route.request().url());
            await route.abort();
          },
        );
        await page.route("**/api/subscribe", async (route) => {
          unexpected.push(route.request().url());
          await route.abort();
        });
        let responseMode = "pending",
          releasePending,
          releaseTimeout;
        await page.route("**/api/waitlist", async (route) => {
          assert.equal(route.request().method(), "POST");
          posts.push(route.request().postDataJSON());
          if (responseMode === "pending")
            await new Promise((resolve) => {
              releasePending = resolve;
            });
          if (responseMode === "timeout") {
            await new Promise((resolve) => {
              releaseTimeout = resolve;
            });
            await route.abort().catch(() => {});
            return;
          }
          const status =
            responseMode === "invalid"
              ? 400
              : responseMode === "failure"
                ? 503
                : 200;
          const body =
            responseMode === "invalid"
              ? { success: false, error: "Please enter a valid email address." }
              : responseMode === "failure"
                ? {
                    success: false,
                    error: "Internal detail should not reach the form",
                  }
                : responseMode === "truthy"
                  ? { success: "true" }
                  : { success: true };
          await route
            .fulfill({
              status,
              contentType: "application/json",
              body: JSON.stringify(body),
            })
            .catch(() => {});
        });
        const checkOverflow = async (scope) => {
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth,
          );
          if (overflow) overflows.push(scope);
          assert.equal(overflow, false, `${state.name}: ${scope} overflow`);
        };
        await page.goto(`${base}/mcp`, { waitUntil: "networkidle" });
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(
          page.getByRole("heading", {
            level: 1,
            name: "Arcanea reader",
            exact: true,
          }),
        ).toBeVisible();
        await expect(page.getByRole("main")).not.toContainText("Generate * 4");
        const copy = page.getByRole("button", {
          name: "Copy reader address",
          exact: true,
        });
        await copy.click();
        await expect(
          page.getByRole("status").filter({ hasText: "Copy failed" }),
        ).toBeVisible();
        await page.evaluate(() => {
          window.__arcaneaClipboard.allow = true;
        });
        await copy.click();
        await expect(
          page
            .getByRole("status")
            .filter({ hasText: "Reader address: copied." }),
        ).toBeVisible();
        assert.equal(
          await page.evaluate(() => window.__arcaneaClipboard.values.at(-1)),
          "https://arcanea-reader.frankxai.workers.dev/mcp",
        );
        const input = page
          .getByRole("form", { name: "Studio waitlist" })
          .getByRole("textbox", { name: "Email", exact: true });
        const form = page.getByRole("form", { name: "Studio waitlist" });
        const button = form.getByRole("button");
        const message = form.getByRole("status");
        await button.click();
        assert.equal(
          posts.length,
          0,
          "Native empty email validation must not POST",
        );
        await input.fill("reader@example.test");
        await button.click();
        await expect.poll(() => posts.length).toBe(1);
        await expect(input).toHaveAttribute("readonly", "");
        await expect(form).toHaveAttribute("aria-busy", "true");
        await expect(button).toBeDisabled();
        await expect(message).toHaveText("Saving your email…");
        await input.evaluate((element) => {
          element.value = "replacement@example.test";
          element.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await form.evaluate((element) =>
          element.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true }),
          ),
        );
        assert.equal(posts.length, 1, "Duplicate pending submit must not POST");
        await capture(form, page, state, "pending");
        responseMode = "failure";
        releasePending();
        await expect(message).toHaveText(
          "We couldn't confirm your signup. Please try again.",
        );
        await expect(input).toHaveValue("reader@example.test");
        await expect(input).not.toHaveAttribute("readonly", "");
        await expect(input).not.toHaveAttribute("aria-invalid", "true");
        await capture(form, page, state, "failure");
        responseMode = "truthy";
        await button.click();
        await expect.poll(() => posts.length).toBe(2);
        await expect(message).toHaveText(
          "We couldn't confirm your signup. Please try again.",
        );
        await expect(input).toHaveValue("reader@example.test");
        responseMode = "invalid";
        await button.click();
        await expect.poll(() => posts.length).toBe(3);
        await expect(message).toHaveText("Please enter a valid email address.");
        await expect(input).toHaveAttribute("aria-invalid", "true");
        await expect(input).toBeFocused();
        assert.equal(
          await input.getAttribute("aria-describedby"),
          await message.getAttribute("id"),
        );
        await capture(form, page, state, "invalid");
        await input.fill("retry@example.test");
        responseMode = "timeout";
        await button.click();
        await expect.poll(() => posts.length).toBe(4);
        await page.clock.runFor(10_100);
        await expect(message).toHaveText(
          "The request timed out. Your signup may have been saved; retrying is safe.",
        );
        await expect(input).toHaveValue("retry@example.test");
        await expect(button).toBeEnabled();
        releaseTimeout();
        await capture(form, page, state, "timeout");
        responseMode = "success";
        await button.click();
        await expect.poll(() => posts.length).toBe(5);
        await expect(message).toHaveText(
          "Your email is saved on the Studio list.",
        );
        await expect(input).toHaveCount(0);
        await capture(form, page, state, "saved");
        for (const post of posts) assert.equal(post.source, "mcp_reader");
        assert.equal(posts[0].email, "reader@example.test");
        await checkOverflow("mcp");
        for (const route of [
          "/docs/mcp",
          "/docs/mcp/install",
          "/docs/mcp/tools",
        ]) {
          await page.goto(base + route, { waitUntil: "networkidle" });
          const main = page.getByRole("main");
          await expect(main.getByRole("heading", { level: 1 })).toBeVisible();
          if (route.endsWith("install")) {
            for (const name of [
              "Claude Desktop",
              "Claude Code",
              "Codex",
              "Cursor",
            ])
              await expect(
                main.getByRole("heading", { name, exact: true }),
              ).toBeVisible();
            await expect(main).toContainText("trusted projects");
            await expect(main).not.toContainText("claude_desktop_config.json");
          } else {
            const sourceLink = main.getByRole("link", {
              name: "Read the canonical source",
              exact: true,
            });
            assert.match(
              await sourceLink.getAttribute("href"),
              /arcanea-ai-app\/blob\/[a-f0-9]{40}\/\.arcanea\/lore\/CANON_LOCKED\.md$/,
            );
            await expect(main).toContainText(
              "does not check godbeast elements",
            );
            if (route.endsWith("tools")) {
              const template = main
                .locator("article")
                .filter({ hasText: "arcanea_template" });
              await expect(template).toContainText("name required.");
            }
          }
          await checkOverflow(route);
          await capture(main, page, state, `docs-${route.split("/").at(-1)}`);
        }
        assert.deepEqual(runtimeErrors, []);
        assert.deepEqual(unexpected, []);
        reports.push({
          state: state.name,
          posts: posts.length,
          clipboardFixtureRecovery: true,
          nativeValidation: true,
          pendingRefGuard: true,
          retainedFailure: true,
          literalReceiptRequired: true,
          invalidFieldFocus: true,
          deadlineRecovery: true,
          retryConfirmed: true,
          clientAndToolDocs: true,
          overflows,
          runtimeErrors,
          unexpectedRemoteCalls: unexpected,
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
          ...source,
          completed,
          reports,
          captures,
          scope:
            "Built-app Chromium with intercepted signup and clipboard fixtures. No actual persistence, mail, client registration, provider calls, assistive-technology session, creator or production proof.",
        },
        null,
        2,
      ) + "\n",
    );
  }
  console.log(
    JSON.stringify({
      completed,
      source: source.reviewedSourceCommit,
      states: reports.length,
      captures: captures.length,
    }),
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
