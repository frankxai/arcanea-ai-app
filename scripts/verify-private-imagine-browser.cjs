const assert = require("node:assert/strict");
const { createHash, randomUUID } = require("node:crypto");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const { chromium, expect } = appRequire("@playwright/test");
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const bytes = Buffer.from(png, "base64");
const checksum = createHash("sha256").update(bytes).digest("hex");

async function main() {
  for (const [name, expected] of Object.entries({
    GITHUB_ACTIONS: "true",
    GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
    GITHUB_ACTOR: "frankxai",
    GITHUB_EVENT_NAME: "workflow_dispatch",
    RUNNER_OS: "Linux",
    GITHUB_REF_NAME: "agent/codex/private-imagine-assets-20261011",
  }))
    assert.equal(process.env[name], expected);
  const configPath = path.resolve(process.env.PRIVATE_IMAGINE_FIXTURE);
  assert.equal(path.dirname(configPath), path.resolve(process.env.RUNNER_TEMP));
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.base, "http://localhost:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:54321");
  assert.equal(config.output, "screenshots/private-imagine");
  assert.equal(config.accounts.length, 2);
  assert.ok(
    config.accounts.every((account) =>
      account.email.endsWith("@example.invalid"),
    ),
  );
  const evidence = {
    head: config.head,
    passed: false,
    realPasswordLogins: 0,
    liveSupplierPosts: 0,
    injectedGenerationReceipts: 0,
    sourceImageSha256: checksum,
    sourceImageBytes: bytes.length,
    modes: [],
    scope:
      "Compiled app, real disposable GoTrue/PostgREST/Postgres and installed Blob SDK with ephemeral undici transport; literal PNG generation receipt, no paid creation or live Blob acceptance",
    csp: "Loopback browser CSP bypass only; live HTTPS CSP remains a separate check",
    accountSwitchSetup:
      "Fixture cookies are cleared before real password login in another tab; actual SDK BroadcastChannel updates the original tab, not product sign-out acceptance",
  };
  const persist = () =>
    fs.writeFileSync(
      `${config.output}/browser-evidence.json`,
      JSON.stringify(evidence, null, 2),
    );
  const browser = await chromium.launch();
  try {
    for (const [index, mode] of [
      { name: "desktop", width: 1440, height: 900, motion: "no-preference" },
      {
        name: "mobile",
        width: 375,
        height: 812,
        motion: "no-preference",
        touch: true,
      },
      { name: "reduced-motion", width: 1440, height: 900, motion: "reduce" },
    ].entries()) {
      const context = await browser.newContext({
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.motion,
        hasTouch: Boolean(mode.touch),
        bypassCSP: true,
        acceptDownloads: true,
      });
      const page = await context.newPage();
      let phase = "guest-denial";
      const result = { mode: mode.name, passed: false, pageErrors: 0 };
      page.on("pageerror", () => result.pageErrors++);
      const capture = async (kind) => {
        const file = `${config.output}/${mode.name}-${kind}.png`;
        await page.screenshot({
          path: file,
          fullPage: true,
          mask: [
            page.locator('input[type="password"]'),
            page.locator('input[type="email"]'),
          ],
        });
        fs.writeFileSync(
          `${file}.vis.provenance.json`,
          JSON.stringify(
            {
              schema: "arcanea.rendered-fixture.v1",
              kind,
              head: config.head,
              renderer: "Playwright Chromium",
              agentSession: `codex:${process.env.GITHUB_RUN_ID}:${process.env.GITHUB_RUN_ATTEMPT}`,
              model: null,
              provider: "deterministic transport fixture; zero paid inference",
              seed: null,
              prompt: `Actual private Imagine compiled client, real disposable Auth and PostgreSQL, ${mode.name}; literal one-pixel PNG for byte retention, not creative output`,
              sourceAsset:
                "literal PNG in scripts/verify-private-imagine-browser.cjs",
              sourceSha256: checksum,
            },
            null,
            2,
          ),
        );
      };
      await context.route("**/*", async (route) => {
        const request = route.request(),
          url = new URL(request.url());
        if (
          url.origin === config.base &&
          url.pathname === "/api/imagine/generate" &&
          request.method() === "POST"
        ) {
          const input = request.postDataJSON();
          evidence.injectedGenerationReceipts++;
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              generationId: `gen_${input.requestKey}`,
              images: [
                { data: png, mimeType: "image/png", prompt: input.prompt },
              ],
            }),
          });
        }
        if (url.origin === config.base || url.origin === config.supabaseUrl)
          return route.continue();
        if (/api\.(?:x\.ai|fal\.ai)|queue\.fal\.run/.test(url.hostname))
          evidence.liveSupplierPosts++;
        return route.abort();
      });
      const api = (endpoint, method = "GET", body) =>
        page.evaluate(
          async ({ endpoint, method, body }) => {
            const response = await fetch(endpoint, {
              method,
              credentials: "same-origin",
              cache: "no-store",
              ...(body
                ? {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  }
                : {}),
            });
            const text = await response.text();
            return {
              status: response.status,
              body: (() => {
                try {
                  return JSON.parse(text);
                } catch {
                  return null;
                }
              })(),
            };
          },
          { endpoint, method, body },
        );
      const login = async (tab, account) => {
        await tab.goto(`${config.base}/auth/login?next=%2Fimagine`);
        await tab.getByLabel("Email", { exact: true }).fill(account.email);
        await tab
          .getByLabel("Password", { exact: true })
          .fill(account.password);
        await tab
          .locator("form")
          .getByRole("button", { name: "Sign In", exact: true })
          .click();
        await tab.waitForURL((url) => url.pathname === "/imagine");
        await expect(
          tab.getByPlaceholder("Describe what you want to create..."),
        ).toBeVisible();
        evidence.realPasswordLogins++;
      };
      const [a, b] = config.accounts;
      const claim = (id, source = id, ownerId = a.id) => ({
        ownerId,
        assetId: id,
        imageData: png,
        mimeType: "image/png",
        prompt: `Fixture private image ${source}`,
        alt: `Literal transport test ${source}`,
        sourceId: source,
        provider: "fixture-literal",
      });
      let releaseGallery;
      try {
        await page.goto(`${config.base}/auth/login`);
        assert.equal((await api("/api/imagine/save", "POST", {})).status, 401);
        assert.equal((await api("/api/imagine/gallery")).status, 401);
        phase = "login-a";
        await login(page, a);
        phase = "sdk-uncertain-put-recovery";
        const uncertainId = config.blob.interruptedAssetIds[index],
          uncertain = claim(uncertainId);
        assert.equal(
          (await api("/api/imagine/save", "POST", uncertain)).status,
          503,
        );
        const recovered = await api("/api/imagine/save", "POST", uncertain);
        assert.equal(recovered.status, 200);
        assert.equal(recovered.body.assetId, uncertainId);
        assert.equal(
          (await api("/api/imagine/save", "POST", uncertain)).status,
          200,
        );
        assert.equal(
          (
            await api("/api/imagine/save", "POST", {
              ...uncertain,
              alt: "changed binding",
            })
          ).status,
          409,
        );
        assert.equal(
          (
            await api("/api/imagine/save", "POST", {
              ...claim(randomUUID()),
              imageData: Buffer.from("not pixels").toString("base64"),
            })
          ).status,
          400,
        );
        result.sdkUnknownPutReconciledSameIdentity = true;
        phase = "compiled-save-with-cache-failure";
        await page.evaluate(() => {
          window.__nativeImagineSet = Storage.prototype.setItem;
          Storage.prototype.setItem = function (name, value) {
            if (name.startsWith("arcanea-imagine-favorites:v2:"))
              throw new DOMException(
                "Controlled browser cache failure",
                "QuotaExceededError",
              );
            return window.__nativeImagineSet.call(this, name, value);
          };
        });
        const prompt = `Private retention ${mode.name}`;
        await page
          .getByPlaceholder("Describe what you want to create...")
          .fill(prompt);
        await page
          .getByPlaceholder("Describe what you want to create...")
          .press("Enter");
        const save = page
          .getByRole("button", { name: "Save image to favorites", exact: true })
          .first();
        await expect(save).toBeEnabled();
        const savedResponse = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === "/api/imagine/save" &&
            response.request().method() === "POST",
        );
        await save.click();
        const saved = await (await savedResponse).json();
        assert.equal(saved.ownerId, a.id);
        assert.equal(saved.size, bytes.length);
        await expect(
          page
            .getByRole("button", { name: "Remove from favorites", exact: true })
            .first(),
        ).toHaveAttribute("aria-pressed", "true");
        result.compiledCloudSaveConfirmedDespiteCacheFailure = true;
        await page.evaluate(() => {
          Storage.prototype.setItem = window.__nativeImagineSet;
          delete window.__nativeImagineSet;
        });
        phase = "cache-loss-gallery-download-and-focus";
        await page.evaluate(() => {
          for (const name of Object.keys(localStorage))
            if (name.startsWith("arcanea-imagine-favorites:v2:"))
              localStorage.removeItem(name);
        });
        await page.reload();
        const opener = page
          .getByRole("button", { name: "Open favorites", exact: true })
          .first();
        await opener.focus();
        await opener.press("Enter");
        const dialog = page.getByRole("dialog", {
          name: "Favorites",
          exact: true,
        });
        await expect(dialog.getByText(prompt, { exact: true })).toBeVisible();
        assert.ok(
          await dialog.evaluate((node) =>
            node.contains(document.activeElement),
          ),
        );
        const download = dialog.getByRole("button", {
          name: `Download ${prompt}`,
          exact: true,
        });
        const bounds = await download.boundingBox();
        assert.ok(bounds.width >= 44 && bounds.height >= 44);
        const downloadPromise = page.waitForEvent("download");
        await download.click();
        const actualDownload = await downloadPromise,
          chunks = [];
        for await (const chunk of await actualDownload.createReadStream())
          chunks.push(chunk);
        assert.equal(
          createHash("sha256").update(Buffer.concat(chunks)).digest("hex"),
          checksum,
        );
        assert.ok(actualDownload.suggestedFilename().endsWith(".png"));
        result.cacheLossReopenAndExactDownload = true;
        phase = "cloud-favorite-lost-acknowledgement";
        let mutation;
        await page.route(`**${saved.url}`, async (route) => {
          if (route.request().method() !== "PATCH" || mutation)
            return route.continue();
          mutation = route.request().postDataJSON();
          const response = await route.fetch();
          assert.equal(response.status(), 200);
          await route.abort("failed"); // Real committed RPC, deliberately discarded HTTP acknowledgement.
        });
        await dialog
          .getByRole("button", {
            name: `Remove favorite: ${prompt}`,
            exact: true,
          })
          .click();
        await expect(dialog.getByRole("alert")).toBeVisible();
        assert.ok(mutation);
        await page.unroute(`**${saved.url}`);
        const replay = await api(saved.url, "PATCH", mutation);
        assert.equal(replay.status, 200);
        assert.equal(replay.body.favoriteRevision, saved.favoriteRevision + 1);
        assert.equal(
          (await api(saved.url + "?metadata=1")).body.favorited,
          false,
        );
        assert.equal(
          (
            await api(saved.url, "PATCH", {
              ...mutation,
              operationId: randomUUID(),
            })
          ).status,
          409,
        );
        const restored = await api(saved.url, "PATCH", {
          ownerId: a.id,
          favorited: true,
          revision: replay.body.favoriteRevision,
          operationId: randomUUID(),
        });
        assert.equal(restored.status, 200);
        assert.equal(
          restored.body.favoriteRevision,
          saved.favoriteRevision + 2,
        );
        await dialog
          .getByRole("button", { name: "Sync favorites", exact: true })
          .click();
        await expect(dialog.getByText(prompt, { exact: true })).toBeVisible();
        result.lostFavoriteAckReplayedAndStaleRevisionDenied = true;
        await capture("favorites");
        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
        result.dialogFocusEscapeAndReturn = true;
        phase = "real-keyset-pagination";
        if (mode.name === "desktop") {
          for (let i = 0; i < 51; i++)
            assert.equal(
              (
                await api(
                  "/api/imagine/save",
                  "POST",
                  claim(randomUUID(), `page-${i}`),
                )
              ).status,
              200,
            );
          const first = await api("/api/imagine/gallery?favorites=true");
          assert.equal(first.body.images.length, 50);
          assert.ok(first.body.next);
          const query = new URLSearchParams(first.body.next);
          const next = await api(
            `/api/imagine/gallery?favorites=true&${query}`,
          );
          assert.ok(next.body.images.length > 0);
          const ids = [...first.body.images, ...next.body.images].map(
            (row) => row.assetId,
          );
          assert.equal(new Set(ids).size, ids.length);
          await opener.click();
          await dialog
            .getByRole("button", { name: "Load more favorites", exact: true })
            .click();
          await expect(dialog.getByRole("listitem")).toHaveCount(ids.length);
          await page.keyboard.press("Escape");
          result.exactCursorPagingWithoutDuplicates = true;
        }
        phase = "actual-broadcast-account-switch-and-late-gallery";
        let held = false,
          notifyHeld;
        const heldResponse = new Promise((done) => (notifyHeld = done));
        const released = new Promise((done) => (releaseGallery = done));
        let delivered;
        const delivery = new Promise((done) => (delivered = done));
        await page.route("**/api/imagine/gallery?*", async (route) => {
          if (held) return route.continue();
          held = true;
          const response = await route.fetch();
          assert.equal(response.status(), 200);
          notifyHeld();
          await released;
          try {
            await route.fulfill({ response }); // Actual old-account response, without editing metadata.
            result.lateGalleryTransport = "delivered";
          } catch {
            result.lateGalleryTransport = "request-aborted-by-account-change";
          } finally {
            delivered();
          }
        });
        await opener.click();
        await heldResponse;
        const second = await context.newPage();
        await context.clearCookies();
        await login(second, b);
        await expect(
          page.getByRole("dialog", { name: "Favorites", exact: true }),
        ).not.toBeVisible();
        await page
          .getByRole("button", { name: "Open favorites", exact: true })
          .first()
          .click();
        await expect(
          dialog.getByText("No favorites yet", { exact: true }),
        ).toBeVisible();
        releaseGallery();
        await delivery;
        await page.unroute("**/api/imagine/gallery?*");
        await expect(dialog.getByRole("listitem")).toHaveCount(0);
        assert.equal((await api(saved.url + "?metadata=1")).status, 404);
        assert.equal((await api(saved.url)).status, 404);
        assert.equal(
          (
            await api(saved.url, "PATCH", {
              ownerId: b.id,
              favorited: false,
              revision: restored.body.favoriteRevision,
              operationId: randomUUID(),
            })
          ).status,
          404,
        );
        assert.equal(
          (
            await api(
              "/api/imagine/save",
              "POST",
              claim(randomUUID(), "wrong-account", a.id),
            )
          ).status,
          409,
        );
        assert.equal(
          (
            await api(
              "/api/imagine/save",
              "POST",
              claim(randomUUID(), "zero-test-capacity", b.id),
            )
          ).status,
          507,
        );
        assert.equal(
          (await api("/api/imagine/gallery?favorites=true")).body.images.length,
          0,
        );
        result.foreignGuestStaleOwnerAndZeroCapacityDenied = true;
        await context.clearCookies();
        await login(second, a);
        assert.equal(
          (await api(saved.url + "?metadata=1")).body.favorited,
          true,
        );
        result.realAccountReturnRetainsOwnWork = true;
        phase = "generated-actions-mobile-and-keyboard-visibility";
        await second.close();
        await page.reload();
        await page
          .getByPlaceholder("Describe what you want to create...")
          .fill(`Visible controls ${mode.name}`);
        await page
          .getByPlaceholder("Describe what you want to create...")
          .press("Enter");
        const animate = page
          .getByRole("button", { name: "Save and animate", exact: true })
          .first();
        await expect(animate).toBeEnabled();
        await animate.focus();
        assert.ok(
          await animate.evaluate((node) => {
            for (let current = node; current; current = current.parentElement)
              if (Number(getComputedStyle(current).opacity) < 0.99)
                return false;
            return true;
          }),
          "Keyboard-focused animation control must be visible",
        );
        const animateBounds = await animate.boundingBox();
        assert.ok(
          animateBounds.width >= 44 && animateBounds.height >= 44,
          "Touch controls require a 44px target",
        );
        result.generatedActionsVisibleOnKeyboardAndTouch = true;
        assert.equal(result.pageErrors, 0);
        await capture("generated-controls");
        result.passed = true;
      } catch (cause) {
        result.failurePhase = phase;
        result.failureLine =
          Number(
            cause.stack?.match(
              /verify-private-imagine-browser\.cjs:(\d+):\d+/,
            )?.[1],
          ) || null;
        await capture("failure").catch(() => {});
      } finally {
        releaseGallery?.();
        evidence.modes.push(result);
        persist();
        await context.close();
      }
    }
    evidence.passed =
      evidence.modes.length === 3 &&
      evidence.modes.every((mode) => mode.passed) &&
      evidence.realPasswordLogins === 9 &&
      evidence.liveSupplierPosts === 0;
    persist();
    if (!evidence.passed)
      throw Error(
        "Private image acceptance remains incomplete; inspect the sanitized stage receipt.",
      );
    console.log(
      JSON.stringify({
        head: evidence.head,
        passed: true,
        modes: evidence.modes.length,
        realPasswordLogins: evidence.realPasswordLogins,
        liveSupplierPosts: evidence.liveSupplierPosts,
      }),
    );
  } finally {
    await browser.close();
  }
}
main().catch(() => {
  console.error(
    "Private Imagine browser assertions did not complete; safe evidence retains the failing phase.",
  );
  process.exitCode = 1;
});
