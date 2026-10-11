const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createHash, randomUUID } = require("node:crypto");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);

let bootstrapPhase = "hosted-admission";
async function main() {
  if (
    process.env.GITHUB_ACTIONS !== "true" ||
    process.env.GITHUB_REPOSITORY !== "frankxai/arcanea-ai-app" ||
    process.env.GITHUB_REF_NAME !== "agent/codex/generation-admission-20261011"
  )
    throw Error("Only the owned disposable hosted generation lane is admitted");
  bootstrapPhase = "private-config";
  const config = JSON.parse(
    await fs.readFile(process.env.GENERATION_TEST_CONFIG, "utf8"),
  );
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.base, "http://localhost:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:54321");
  assert.equal(config.output, "screenshots/generation-service");
  assert.ok(
    config.accounts.every((account) =>
      account.email.endsWith("@example.invalid"),
    ),
  );
  bootstrapPhase = "fixture-image-read";
  const image = await fs.readFile(config.imageFile);
  const imageHash = createHash("sha256").update(image).digest("hex");
  const rows = [];
  bootstrapPhase = "chromium-launch";
  const browser = await chromium.launch({ headless: true });
  bootstrapPhase = "compiled-client-journeys";
  async function api(path, token = config.admin, init = {}) {
    const response = await fetch(config.supabaseUrl + path, {
      ...init,
      headers: {
        apikey: config.anon,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    return response;
  }
  async function state() {
    const response = await api("/fixture-state", config.fixtureKey);
    assert.equal(response.status, 200);
    return response.json();
  }
  async function operation(userId, key) {
    const response = await api(
      `/rest/v1/billing_operations?reference=eq.${userId}:${key}&user_id=eq.${userId}`,
    );
    assert.equal(response.status, 200);
    const values = await response.json();
    assert.equal(values.length, 1);
    return values[0];
  }
  const asyncFailures = [];
  let evidenceWrites = Promise.resolve();
  function persist(passed = false, fixtureSupplier = null) {
    const evidence = JSON.stringify(
      {
        head: config.head,
        passed:
          passed &&
          rows.length === 9 &&
          rows.every((row) => row.passed) &&
          !asyncFailures.length,
        rows,
        asyncFailures,
        csp: "Authenticated HTTP loopback journeys bypass CSP. Separate no-bypass production-media-csp case tests real headers with intercepted imgen.x.ai fixture bytes; actual supplier CORS is not certified",
        paidProviderCalls: 0,
        providerRequestsAttempted: 0,
        fixtureSupplier,
      },
      null,
      2,
    );
    const path = `${config.output}/browser-evidence.json`;
    evidenceWrites = evidenceWrites.then(async () => {
      await fs.writeFile(path + ".tmp", evidence);
      await fs.rename(path + ".tmp", path);
    });
    return evidenceWrites;
  }
  async function record(row) {
    rows.push(row);
    await persist();
  }
  function failureDetails(error) {
    const names = ["TimeoutError", "TargetClosedError", "AssertionError"];
    const kind = names.includes(error?.name) ? error.name : "Other";
    const match =
      typeof error?.stack === "string" &&
      /verify-generation-preview-browser\.cjs:(\d+):/.exec(error.stack);
    const safeValue = (value) =>
      typeof value === "boolean" ||
      (typeof value === "number" && Number.isFinite(value))
        ? value
        : undefined;
    return {
      kind,
      scriptLine: match ? Number(match[1]) : null,
      expected: safeValue(error?.expected),
      actual: safeValue(error?.actual),
    };
  }
  const onUnhandled = (error) => {
    // Keep async failures blocking without emitting exception bodies or secrets.
    asyncFailures.push(failureDetails(error));
    void persist().catch(() => {});
  };
  process.on("unhandledRejection", onUnhandled);
  const closingContexts = new WeakSet();
  async function closeContext(context) {
    closingContexts.add(context);
    await context.close();
  }
  async function serveImage(route, context, headers) {
    try {
      await route.fulfill({
        status: 200,
        contentType: "image/webp",
        body: image,
        headers,
      });
    } catch (error) {
      // Only teardown races are ignored; unexpected route errors still fail.
      if (!closingContexts.has(context)) throw error;
    }
  }
  await persist();
  async function capture(page, name, kind) {
    const file = `${config.output}/${name}.png`;
    await page.screenshot({
      path: file,
      fullPage: true,
      animations: "disabled",
      mask: [
        page.locator('input[type="password"]'),
        page.locator('input[type="email"]'),
      ],
    });
    await fs.writeFile(
      `${file}.vis.provenance.json`,
      JSON.stringify(
        {
          schema: "arcanea.rendered-fixture.v1",
          kind,
          head: config.head,
          renderer: "Playwright Chromium",
          agentSession: `codex:${process.env.GITHUB_RUN_ID}:${process.env.GITHUB_RUN_ATTEMPT}`,
          model: null,
          provider: "deterministic fixture; zero paid inference",
          seed: null,
          prompt:
            "Actual compiled generation client with real disposable Auth and PostgreSQL; fixture visual is an existing repository asset",
          sourceAsset: "apps/web/public/story/first-light.webp",
          sourceSha256: imageHash,
        },
        null,
        2,
      ),
    );
  }
  async function login(page, account, next = "/studio/image") {
    await page.goto(
      `${config.base}/auth/login?next=${encodeURIComponent(next)}`,
    );
    await page.getByLabel("Email", { exact: true }).fill(account.email);
    await page.getByLabel("Password", { exact: true }).fill(account.password);
    await page
      .locator("form")
      .getByRole("button", { name: "Sign In", exact: true })
      .click();
    await page.waitForURL(`**${next}`, { timeout: 30000 });
  }
  async function logout(page, account) {
    const username = account.email.split("@")[0];
    await page
      .getByRole("button")
      .filter({ has: page.getByText(username, { exact: true }) })
      .click();
    await page.getByRole("menuitem", { name: "Sign Out", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Sign In", exact: true }),
    ).toBeVisible();
  }
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
  try {
    // Inspect the real server CSP separately: loopback Auth requires bypass in
    // the authenticated journeys below, which must not certify this policy.
    const policyContext = await browser.newContext({ bypassCSP: false });
    try {
      const allowed = "https://imgen.x.ai/fixture-csp.webp";
      const blocked = "https://generation-fixture.invalid/fixture-csp.webp";
      await policyContext.route(allowed, (route) =>
        serveImage(route, policyContext, {
          "access-control-allow-origin": config.base,
        }),
      );
      await policyContext.route(blocked, (route) =>
        serveImage(route, policyContext, {
          "access-control-allow-origin": config.base,
        }),
      );
      const page = await policyContext.newPage();
      const response = await page.goto(config.base + "/studio/image");
      assert.ok(response.headers()["content-security-policy"]);
      const result = await page.evaluate(
        async ({ allowed, blocked }) => {
          async function load(url) {
            const img = document.createElement("img");
            const loaded = new Promise((resolve) => {
              img.onload = () => resolve(img.naturalWidth > 0);
              img.onerror = () => resolve(false);
            });
            img.src = url;
            document.body.appendChild(img);
            try {
              return await loaded;
            } finally {
              img.remove();
            }
          }
          const allowedImage = await load(allowed);
          const bytes = await (
            await fetch(allowed, { credentials: "omit" })
          ).arrayBuffer();
          const blockedImage = await load(blocked);
          let blockedFetch = false;
          try {
            await fetch(blocked);
          } catch {
            blockedFetch = true;
          }
          return {
            allowedImage,
            bytes: Array.from(new Uint8Array(bytes)),
            blockedImage,
            blockedFetch,
          };
        },
        { allowed, blocked },
      );
      assert.equal(result.allowedImage, true);
      assert.equal(
        createHash("sha256").update(Buffer.from(result.bytes)).digest("hex"),
        imageHash,
      );
      assert.equal(result.blockedImage, false);
      assert.equal(result.blockedFetch, true);
      await record({
        scope: "production-media-csp",
        passed: true,
        bypassCSP: false,
        supplierHostImageAllowed: true,
        supplierHostFetchAllowed: true,
        unrelatedHostImageDenied: true,
        unrelatedHostFetchDenied: true,
        sourceSha256: imageHash,
      });
    } catch (error) {
      await record({
        ...failureDetails(error),
        scope: "production-media-csp",
        passed: false,
        bypassCSP: false,
      });
    } finally {
      await closeContext(policyContext);
    }
    for (const mode of modes) {
      const context = await browser.newContext({
        // Accepted disposable HTTP loopback rail; production CSP is unchanged.
        bypassCSP: true,
        viewport: mode.viewport,
        reducedMotion: mode.reducedMotion,
        acceptDownloads: true,
      });
      let refuseExport = false;
      await context.route("https://imgen.x.ai/fixture-**", (route) =>
        serveImage(
          route,
          context,
          refuseExport && route.request().resourceType() === "fetch"
            ? {
                "access-control-allow-origin":
                  "https://generation-fixture.invalid",
              }
            : { "access-control-allow-origin": config.base },
        ),
      );
      const page = await context.newPage();
      let authenticated = false;
      let phase = "anonymous-denial";
      try {
        const denied = await context.request.post(
          `${config.base}/api/imagine/generate`,
          {
            data: {
              prompt: "fixture anonymous",
              requestKey: randomUUID(),
              count: 1,
            },
          },
        );
        assert.equal(denied.status(), 401);
        const before = await state();
        phase = "password-login";
        await login(page, config.accounts[0]);
        authenticated = true;
        phase = "pending-image-admission";
        const prompt = `interrupt-fixture lighthouse ${mode.name}`;
        const input = page.getByPlaceholder(
          "Describe what you are creating (use @assets references)...",
        );
        await input.fill(prompt);
        let pending = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === "/api/imagine/generate" &&
            r.request().method() === "POST",
        );
        pending.catch(() => {});
        const forge = page.getByRole("button", { name: /^Forge/ });
        await expect(forge).toBeInViewport();
        await expect(forge).toContainText("10 credits");
        await forge.click();
        const first = await pending;
        assert.equal(first.status(), 409);
        const requestKey = first.request().postDataJSON().requestKey;
        assert.equal((await first.json()).reason, "operation_pending");
        const saved = await operation(config.accounts[0].id, requestKey);
        assert.equal(saved.state, "running");
        assert.equal(saved.result.pendingImage.provider, "grok");
        const accepted = await state();
        assert.equal(accepted.submissions, before.submissions + 1);
        phase = "same-key-reload-recovery";
        await page.reload();
        await input.fill(prompt);
        pending = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === "/api/imagine/generate" &&
            r.request().method() === "POST",
        );
        pending.catch(() => {});
        await expect(forge).toBeInViewport();
        await forge.click();
        const resumed = await pending;
        assert.equal(resumed.status(), 200);
        const receipt = await resumed.json();
        assert.equal(resumed.request().postDataJSON().requestKey, requestKey);
        assert.equal(receipt.generationId, `gen_${requestKey}`);
        assert.equal(receipt.credits.charged, 10);
        assert.equal((await state()).submissions, accepted.submissions);
        const completed = await operation(config.accounts[0].id, requestKey);
        assert.equal(completed.state, "completed");
        assert.equal(completed.charged, 10);
        const replay = await context.request.post(
          `${config.base}/api/imagine/generate`,
          { data: resumed.request().postDataJSON() },
        );
        assert.equal(replay.status(), 200);
        assert.deepEqual((await replay.json()).images, receipt.images);
        assert.equal((await state()).submissions, accepted.submissions);
        phase = "image-render";
        const rendered = page
          .getByRole("img", { name: prompt, exact: true })
          .first();
        await expect(rendered).toBeVisible();
        await expect
          .poll(
            () =>
              rendered.evaluate((img) => img.complete && img.naturalWidth > 0),
            { timeout: 10000 },
          )
          .toBe(true);
        phase = "image-download";
        // Hover the visible image container: its transparent action overlay is
        // a descendant, so targeting the underlying img fails hit testing.
        await rendered.locator("..").hover();
        const download = page.waitForEvent("download");
        download.catch(() => {});
        await page.getByTitle("Download image", { exact: true }).click();
        const artifact = await download;
        assert.match(artifact.suggestedFilename(), /\.webp$/);
        const stream = await artifact.createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        assert.equal(
          createHash("sha256").update(Buffer.concat(chunks)).digest("hex"),
          imageHash,
        );
        phase = "cors-refusal-manual-export";
        refuseExport = true;
        await page.getByTitle("Download image", { exact: true }).click();
        await expect(
          page.getByText(
            "Direct download is unavailable. Open the original image and save it from your browser.",
            { exact: true },
          ),
        ).toBeVisible();
        const original = page.getByRole("link", {
          name: "Open original image",
          exact: true,
        });
        await expect(original).toHaveAttribute("href", receipt.images[0].url);
        await expect(original).toHaveAttribute("target", "_blank");
        await expect(original).toHaveAttribute("rel", "noopener noreferrer");
        assert.equal((await state()).submissions, accepted.submissions);
        phase = "viewport-and-reduced-motion";
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 2,
          ),
          "Horizontal page overflow",
        );
        await capture(page, `${mode.name}-studio`, "rendered image client");
        await record({
          mode: mode.name,
          scope: "studio",
          passed: true,
          requestKey,
          charged: 10,
          providerSubmissions: 1,
          sameKeyRecovered: true,
          completedReplay: true,
          downloadedSha256: imageHash,
          corsRefusalManualExport: true,
        });
      } catch (error) {
        await record({
          ...failureDetails(error),
          mode: mode.name,
          scope: "studio",
          passed: false,
          failurePhase: phase,
        });
        await capture(
          page,
          `${mode.name}-studio-failed`,
          "failed rendered acceptance",
        ).catch(() => {});
      }
      phase = "page-owner-open";
      try {
        if (authenticated)
          await page.goto(`${config.base}/p/generation-fixture-0/edit`);
        else
          await login(page, config.accounts[0], "/p/generation-fixture-0/edit");
        phase = "cover-generation";
        const pending = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === "/api/imagine/generate" &&
            r.request().method() === "POST",
        );
        pending.catch(() => {});
        await page
          .getByRole("button", { name: /^(Generate cover|Regenerate)$/ })
          .click();
        const response = await pending;
        assert.equal(response.status(), 200);
        const input = response.request().postDataJSON();
        assert.equal(input.count, 1);
        assert.equal(input.aspectRatio, "16:9");
        assert.equal(input.provider, "grok");
        const receipt = await response.json();
        phase = "cover-render";
        const cover = page.getByRole("img", { name: "Cover", exact: true });
        await expect
          .poll(
            () => cover.evaluate((img) => img.complete && img.naturalWidth > 0),
            { timeout: 10000 },
          )
          .toBe(true);
        phase = "cover-save-reopen";
        const saving = page.waitForResponse(
          (r) =>
            new URL(r.url()).pathname === "/api/pages/generation-fixture-0" &&
            r.request().method() === "PATCH",
        );
        saving.catch(() => {});
        await page.getByRole("button", { name: "Save", exact: true }).click();
        assert.equal((await saving).status(), 200);
        await page.goto(`${config.base}/p/generation-fixture-0/edit`);
        await expect
          .poll(() =>
            page
              .getByRole("img", { name: "Cover", exact: true })
              .evaluate((img) => img.complete && img.naturalWidth > 0),
          )
          .toBe(true);
        const row = await api("/rest/v1/pages?slug=eq.generation-fixture-0");
        const values = await row.json();
        assert.equal(values[0].cover_image_url, receipt.images[0].url);
        assert.equal(values[0].owner_id, config.accounts[0].id);
        await capture(page, `${mode.name}-cover`, "persisted cover client");
        await record({
          mode: mode.name,
          scope: "page-cover",
          passed: true,
          savedAndReopened: true,
        });
      } catch (error) {
        await record({
          ...failureDetails(error),
          mode: mode.name,
          scope: "page-cover",
          passed: false,
          failurePhase: phase,
        });
        await capture(
          page,
          `${mode.name}-cover-failed`,
          "failed persisted-cover acceptance",
        ).catch(() => {});
      }
      await closeContext(context);
    }
    // A real GoTrue account switch, not synthetic browser identity, admits the
    // middleware-protected settings page and proves browser-local key isolation.
    const settingsContext = await browser.newContext({ bypassCSP: true });
    const settingsPage = await settingsContext.newPage();
    let settingsPhase = "settings-account-a-login";
    try {
      await login(settingsPage, config.accounts[0], "/settings/providers");
      const provider = settingsPage.getByLabel("Chat provider", {
        exact: true,
      });
      const google = settingsPage.getByLabel("Google Gemini API key", {
        exact: true,
      });
      const saved = settingsPage.getByText(
        "Saved for this account in this browser. Provider access has not been verified.",
        { exact: true },
      );
      const save = settingsPage.getByRole("button", {
        name: "Save connection",
        exact: true,
      });
      settingsPhase = "settings-account-a-save-reopen";
      await provider.selectOption("google");
      await google.fill("fixture-settings-account-a-key");
      await save.click();
      await expect(saved).toBeVisible();
      await settingsPage.reload();
      await expect(google).toHaveValue("fixture-settings-account-a-key");
      settingsPhase = "settings-account-a-signout";
      await logout(settingsPage, config.accounts[0]);
      settingsPhase = "settings-account-b-switch";
      await login(settingsPage, config.accounts[1], "/settings/providers");
      await provider.selectOption("google");
      await expect(google).toHaveValue("");
      await google.fill("fixture-settings-account-b-key");
      await save.click();
      await expect(saved).toBeVisible();
      await settingsPage.reload();
      await expect(google).toHaveValue("fixture-settings-account-b-key");
      settingsPhase = "settings-account-b-signout";
      await logout(settingsPage, config.accounts[1]);
      settingsPhase = "settings-account-a-return";
      await login(settingsPage, config.accounts[0], "/settings/providers");
      await expect(google).toHaveValue("fixture-settings-account-a-key");
      const keys = await settingsPage.evaluate(
        (ids) =>
          ids.map(
            (id) =>
              JSON.parse(
                localStorage.getItem(
                  `arcanea-provider-keys:v2:${encodeURIComponent(`user:${id}`)}`,
                ) || "{}",
              ).google,
          ),
        config.accounts.map((account) => account.id),
      );
      assert.deepEqual(keys, [
        "fixture-settings-account-a-key",
        "fixture-settings-account-b-key",
      ]);
      await record({
        scope: "real-auth-provider-settings",
        passed: true,
        mode: "desktop",
        passwordLogin: true,
        savedAndReopened: true,
        sameBrowserAccountIsolation: true,
        returningAccountPreserved: true,
        actualProviderVerification: false,
      });
    } catch (error) {
      await record({
        ...failureDetails(error),
        scope: "real-auth-provider-settings",
        passed: false,
        failurePhase: settingsPhase,
      });
    } finally {
      await closeContext(settingsContext);
    }
    // Real authenticated Data API denial plus a depleted second actor at the app boundary.
    let phase = "second-account-isolation";
    const context = await browser.newContext({ bypassCSP: true });
    const page = await context.newPage();
    try {
      await login(page, config.accounts[1]);
      phase = "second-account-password-token";
      const tokenResponse = await api(
        "/auth/v1/token?grant_type=password",
        config.anon,
        {
          method: "POST",
          body: JSON.stringify({
            email: config.accounts[1].email,
            password: config.accounts[1].password,
          }),
        },
      );
      assert.equal(tokenResponse.status, 200);
      const token = (await tokenResponse.json()).access_token;
      phase = "private-operation-denial";
      const privateRows = await api(
        "/rest/v1/billing_operations?select=*",
        token,
      );
      assert.ok([401, 403].includes(privateRows.status));
      phase = "privileged-recovery-denial";
      const privilegedRpc = await api(
        "/rest/v1/rpc/billing_recovery_ready",
        token,
        { method: "POST", body: "{}" },
      );
      assert.ok([401, 403, 404].includes(privilegedRpc.status));
      phase = "foreign-page-write-denial";
      const foreign = await context.request.patch(
        `${config.base}/api/pages/generation-fixture-0`,
        { data: { title: "Forbidden overwrite" } },
      );
      assert.equal(foreign.status(), 403);
      phase = "second-account-balance-exhausted";
      const emptied = await api(
        `/rest/v1/billing_accounts?user_id=eq.${config.accounts[1].id}`,
        config.admin,
        { method: "PATCH", body: '{"balance":0}' },
      );
      assert.ok(emptied.ok);
      const before = await state();
      phase = "depleted-account-no-submission";
      const denied = await context.request.post(
        `${config.base}/api/imagine/generate`,
        {
          data: {
            prompt: "Depleted fixture",
            requestKey: randomUUID(),
            count: 1,
          },
        },
      );
      assert.equal(denied.status(), 402);
      assert.equal((await state()).submissions, before.submissions);
      await record({
        scope: "account-isolation",
        passed: true,
        privateOperationDenied: true,
        privilegedRpcDenied: true,
        foreignPageDenied: true,
        depletedNoProvider: true,
      });
    } catch (error) {
      await record({
        ...failureDetails(error),
        scope: "account-isolation",
        passed: false,
        failurePhase: phase,
      });
    } finally {
      await closeContext(context);
    }
  } finally {
    const supplier = await state().catch(() => null);
    if (!supplier)
      asyncFailures.push({ kind: "FixtureStateUnavailable", scriptLine: null });
    const passed =
      rows.length === 9 &&
      rows.every((row) => row.passed) &&
      !asyncFailures.length;
    // Save completed/failed rows before closing contexts or exiting the child.
    await persist(passed, supplier);
    for (const context of browser.contexts()) closingContexts.add(context);
    await browser.close();
    process.removeListener("unhandledRejection", onUnhandled);
    await evidenceWrites;
  }
  assert.equal(asyncFailures.length, 0, "Unexpected fixture async failures");
  assert.equal(rows.length, 9);
  assert.ok(
    rows.every((row) => row.passed),
    "Compiled generation acceptance did not pass",
  );
}
main().catch(async () => {
  // Never serialize an exception that may contain private config or credentials.
  const evidencePath = "screenshots/generation-service/browser-evidence.json";
  if (
    process.env.GITHUB_ACTIONS === "true" &&
    process.env.GITHUB_REPOSITORY === "frankxai/arcanea-ai-app" &&
    process.env.GITHUB_REF_NAME ===
      "agent/codex/generation-admission-20261011" &&
    /^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA || "")
  ) {
    try {
      await fs.access(evidencePath);
    } catch {
      await fs.mkdir("screenshots/generation-service", { recursive: true });
      await fs.writeFile(
        evidencePath,
        JSON.stringify(
          {
            head: process.env.GITHUB_SHA,
            passed: false,
            failurePhase: bootstrapPhase,
            rows: [],
            providerCalls: 0,
            providerRequestsAttempted: 0,
          },
          null,
          2,
        ),
      );
    }
  }
  console.error(
    "Disposable generation client acceptance failed; inspect sanitized phase evidence.",
  );
  process.exitCode = 1;
});
