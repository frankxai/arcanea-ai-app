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
    for (const mode of modes) {
      const context = await browser.newContext({
        // Accepted disposable HTTP loopback rail; production CSP is unchanged.
        bypassCSP: true,
        viewport: mode.viewport,
        reducedMotion: mode.reducedMotion,
        acceptDownloads: true,
      });
      await context.route("https://generation-fixture.invalid/**", (route) =>
        route.fulfill({
          status: 200,
          contentType: "image/webp",
          body: image,
          headers: { "access-control-allow-origin": config.base },
        }),
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
        await page.getByRole("button", { name: /^Forge/ }).click();
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
        await page.getByRole("button", { name: /^Forge/ }).click();
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
        await rendered.hover();
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
        phase = "viewport-and-reduced-motion";
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 2,
          ),
          "Horizontal page overflow",
        );
        await capture(page, `${mode.name}-studio`, "rendered image client");
        rows.push({
          mode: mode.name,
          scope: "studio",
          passed: true,
          requestKey,
          charged: 10,
          providerSubmissions: 1,
          sameKeyRecovered: true,
          completedReplay: true,
          downloadedSha256: imageHash,
        });
      } catch {
        rows.push({
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
        rows.push({
          mode: mode.name,
          scope: "page-cover",
          passed: true,
          savedAndReopened: true,
        });
      } catch {
        rows.push({
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
      await context.close();
    }
    // Real authenticated Data API denial plus a depleted second actor at the app boundary.
    let phase = "second-account-isolation";
    const context = await browser.newContext({ bypassCSP: true });
    const page = await context.newPage();
    try {
      await login(page, config.accounts[1]);
      const tokenResponse = await api(
        "/auth/v1/token?grant_type=password",
        config.anon,
        { method: "POST", body: JSON.stringify(config.accounts[1]) },
      );
      assert.equal(tokenResponse.status, 200);
      const token = (await tokenResponse.json()).access_token;
      const privateRows = await api(
        "/rest/v1/billing_operations?select=*",
        token,
      );
      assert.ok([401, 403].includes(privateRows.status));
      const privilegedRpc = await api(
        "/rest/v1/rpc/billing_recovery_ready",
        token,
        { method: "POST", body: "{}" },
      );
      assert.ok([401, 403, 404].includes(privilegedRpc.status));
      const foreign = await context.request.patch(
        `${config.base}/api/pages/generation-fixture-0`,
        { data: { title: "Forbidden overwrite" } },
      );
      assert.equal(foreign.status(), 403);
      const emptied = await api(
        `/rest/v1/billing_accounts?user_id=eq.${config.accounts[1].id}`,
        config.admin,
        { method: "PATCH", body: '{"balance":0}' },
      );
      assert.ok(emptied.ok);
      const before = await state();
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
      rows.push({
        scope: "account-isolation",
        passed: true,
        privateOperationDenied: true,
        privilegedRpcDenied: true,
        foreignPageDenied: true,
        depletedNoProvider: true,
      });
    } catch {
      rows.push({
        scope: "account-isolation",
        passed: false,
        failurePhase: phase,
      });
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
    await fs.writeFile(
      `${config.output}/browser-evidence.json`,
      JSON.stringify(
        {
          head: config.head,
          passed: rows.length === 7 && rows.every((row) => row.passed),
          rows,
          csp: "Disposable HTTP loopback fixture bypasses browser CSP; production HTTPS CSP is unchanged and is not certified",
          paidProviderCalls: 0,
          providerRequestsAttempted: 0,
          fixtureSupplier: await state(),
        },
        null,
        2,
      ),
    );
  }
  assert.equal(rows.length, 7);
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
