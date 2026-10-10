const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createHash } = require("node:crypto");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const {
  createClient,
} = require("../apps/web/node_modules/@supabase/supabase-js");
const chapter = "/books/forge-of-ruin/the-forty-seven-names";
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jUxoAAAAASUVORK5CYII=";

async function main() {
  assert.equal(process.env.GITHUB_ACTIONS, "true");
  const config = JSON.parse(
    await fs.readFile(process.env.READING_SCENE_AUTH_CONFIG, "utf8"),
  );
  assert.equal(config.head, process.env.READING_SCENE_HEAD);
  assert.equal(config.base, "http://127.0.0.1:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:3803");
  assert.equal(config.accounts.length, 2);
  assert.ok(config.accounts.every((a) => a.email.endsWith("@example.invalid")));
  const output = config.output;
  const redact = (value) =>
    [config.anon, ...config.accounts.map((a) => a.password)]
      .reduce(
        (text, credential) => text.split(credential).join("[redacted]"),
        String(value),
      )
      .replace(
        /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
        "[redacted-jwt]",
      );
  const receipt = {
    head: config.head,
    auth: "real password login and Auth-validated SSR cookies in disposable GoTrue",
    database: "real PostgREST and inspected creations RLS expressions",
    generation:
      "synthetic raster response; actual provider/credits not exercised",
    csp: "Loopback HTTP fixture bypasses browser CSP; production HTTPS CSP unchanged and unverified here",
    passed: false,
    checks: [],
  };
  const browser = await chromium.launch();
  const contexts = [];
  const db = (account) => {
    const client = createClient(config.supabaseUrl, config.anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, signal: AbortSignal.timeout(10000) }),
      },
    });
    return { client, account };
  };
  const owner = db(config.accounts[0]),
    other = db(config.accounts[1]),
    anonymous = db(null);
  const pageErrors = [];
  let page;
  let stage = "initial-anonymous-reader";
  const makeContext = async () => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 900 },
      hasTouch: true,
      reducedMotion: "reduce",
      bypassCSP: true,
      acceptDownloads: true,
    });
    contexts.push(context);
    return context;
  };
  async function login(target, account, viaLink = false) {
    if (viaLink)
      await target
        .getByRole("link", { name: "Sign in to continue", exact: true })
        .click();
    else
      await target.goto(
        `${config.base}/auth/login?next=${encodeURIComponent(chapter)}`,
      );
    await target.getByLabel("Email", { exact: true }).fill(account.email);
    await target.getByLabel("Password", { exact: true }).fill(account.password);
    await target.getByRole("button", { name: "Sign In", exact: true }).click();
    await target.waitForURL((url) => url.pathname === chapter);
    await expect(
      target.getByRole("button", { name: "Visualize a passage", exact: true }),
    ).toBeVisible();
  }
  try {
    for (const actor of [owner, other]) {
      const { data, error } = await actor.client.auth.signInWithPassword(
        actor.account,
      );
      assert.equal(error, null);
      assert.equal(data.user.id, actor.account.id);
      assert.equal(
        (await actor.client.auth.getUser()).data.user.id,
        actor.account.id,
      );
      const { data: contract, error: contractError } = await actor.client.rpc(
        "reading_scene_fixture_contract",
      );
      assert.equal(contractError, null);
      assert.equal(contract.uid, actor.account.id);
      assert.equal(contract.role, "authenticated");
      assert.equal(contract.roleSuperuser, false);
      assert.equal(contract.roleBypass, false);
      assert.equal(contract.rlsEnabled, true);
      assert.equal(contract.policyCount, 4);
    }
    receipt.checks.push(
      "Two password identities verified by GoTrue; real RLS roles have no bypass",
    );
    const context = await makeContext();
    page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(config.base + chapter);
    const prose = page.locator("article .prose p").first();
    const passage = (await prose.textContent()).replace(/\s+/g, " ").trim();
    assert.ok(passage.length >= 12 && passage.length <= 1200);
    await prose.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selected = getSelection();
      selected.removeAllRanges();
      selected.addRange(range);
      document.dispatchEvent(new Event("selectionchange"));
    });
    await page
      .getByRole("button", { name: "Visualize selection", exact: true })
      .click();
    const brief = `${await page.getByLabel("Visual brief").inputValue()}\nShow the river at dusk.`;
    await page.getByLabel("Visual brief").fill(brief);
    const anonResponse = await context.request.get(
      `${config.base}/api/reading-scenes?path=${encodeURIComponent(chapter)}`,
    );
    assert.equal(anonResponse.status(), 401);
    stage = "real-password-ui-login";
    await login(page, owner.account, true);
    await page
      .getByRole("button", { name: "Reopen scene", exact: true })
      .click();
    await expect(page.getByLabel("Visual brief")).toHaveValue(brief);
    await expect(
      page.getByRole("button", { name: "Generate scene", exact: true }),
    ).toBeEnabled();
    const cookies = await context.cookies(config.base);
    assert.ok(
      cookies.some(
        (cookie) =>
          cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"),
      ),
      "Normal password login must deliver SSR cookies",
    );
    receipt.checks.push(
      "Anonymous draft survives actual login; SSR route validates delivered cookie",
    );
    stage = "scene-generation-fixture";
    let generation;
    let generationCalls = 0;
    await page.route("**/api/imagine/generate", async (route) => {
      generationCalls++;
      generation = route.request().postDataJSON();
      assert.equal(generation.prompt, brief);
      assert.match(generation.requestKey, /^[a-f0-9-]{36}$/);
      await route.fulfill({
        json: {
          generationId: `gen_${generation.requestKey}`,
          status: "completed",
          provider: "openrouter",
          model: generation.model,
          images: [{ data: png, mimeType: "image/png" }],
        },
      });
    });
    await page
      .getByRole("button", { name: "Generate scene", exact: true })
      .click();
    await expect(
      page.getByRole("img", { name: /Personal visual interpretation/ }),
    ).toBeVisible();
    assert.equal(generationCalls, 1);
    let lostAck = true;
    const saves = [];
    await page.route("**/api/reading-scenes", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      saves.push(route.request().postDataJSON());
      // Commit through the real application/session/database before dropping its
      // acknowledgement. Retry must not create a second private creation.
      const response = await route.fetch();
      assert.equal(response.status(), 200);
      if (lostAck) {
        lostAck = false;
        return route.abort("failed");
      }
      await route.fulfill({ response });
    });
    stage = "committed-save-lost-acknowledgement";
    await page
      .getByRole("button", { name: "Save private creation", exact: true })
      .click();
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: "Private save could not be confirmed" }),
    ).toBeVisible();
    const savedRows = () =>
      owner.client
        .from("creations")
        .select("id,user_id,visibility,status,content")
        .eq("id", generation.requestKey);
    const firstRead = await savedRows();
    assert.equal(firstRead.error, null);
    assert.equal(firstRead.data.length, 1);
    await page
      .getByRole("button", { name: "Save private creation", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Saved privately", exact: true }),
    ).toBeVisible();
    assert.equal(saves.length, 2);
    assert.deepEqual(saves[1], saves[0]);
    const row = (await savedRows()).data;
    assert.equal(row.length, 1);
    assert.equal(row[0].user_id, owner.account.id);
    assert.equal(row[0].visibility, "private");
    assert.equal(row[0].status, "draft");
    assert.equal(row[0].content.source.passage, passage);
    assert.equal(row[0].content.generation.brief, brief);
    assert.equal(row[0].content.image.data, png);
    receipt.checks.push(
      "Actual SSR save commits; lost acknowledgement retries the same payload into one private row",
    );
    stage = "fresh-tab-private-reopen";
    const fresh = await context.newPage();
    fresh.setDefaultTimeout(20000);
    await fresh.goto(config.base + chapter);
    await fresh
      .getByRole("button", { name: "Reopen scene", exact: true })
      .click();
    await expect(
      fresh.getByRole("button", { name: "Saved privately", exact: true }),
    ).toBeVisible();
    await expect(fresh.getByLabel("Visual brief")).toHaveValue(brief);
    const apiRead = await context.request.get(
      `${config.base}/api/reading-scenes?path=${encodeURIComponent(chapter)}`,
    );
    assert.equal(apiRead.status(), 200);
    assert.equal(
      (await apiRead.json()).scene.creationId,
      generation.requestKey,
    );
    receipt.checks.push(
      "A fresh tab restores private image/source from the actual authenticated GET route",
    );
    stage = "second-account-and-anonymous-denial";
    for (const actor of [other, anonymous]) {
      const foreign = await actor.client
        .from("creations")
        .select("id")
        .eq("id", generation.requestKey);
      assert.equal(foreign.error, null);
      assert.deepEqual(foreign.data, []);
    }
    const forge = await other.client
      .from("creations")
      .insert({
        id: generation.requestKey,
        user_id: owner.account.id,
        title: "Forbidden",
        content: {},
      })
      .select("id");
    assert.ok(forge.error);
    assert.equal(forge.error.code, "42501");
    const secondContext = await makeContext();
    const secondPage = await secondContext.newPage();
    secondPage.setDefaultTimeout(20000);
    await login(secondPage, other.account);
    const privateRead = await secondContext.request.get(
      `${config.base}/api/reading-scenes?path=${encodeURIComponent(chapter)}`,
    );
    assert.equal(privateRead.status(), 200);
    assert.equal((await privateRead.json()).scene, null);
    await expect(
      secondPage.getByRole("button", { name: "Reopen scene", exact: true }),
    ).toHaveCount(0);
    const stolenRetry = await secondContext.request.post(
      `${config.base}/api/reading-scenes`,
      { data: saves[0] },
    );
    assert.equal(stolenRetry.status(), 409);
    const anonContext = await makeContext();
    const denied = await anonContext.request.post(
      `${config.base}/api/reading-scenes`,
      { data: saves[0] },
    );
    assert.equal(denied.status(), 401);
    assert.equal((await savedRows()).data.length, 1);
    receipt.checks.push(
      "Second real account cannot read/reopen/claim the saved request; anonymous POST is denied",
    );
    assert.deepEqual(pageErrors, []);
    receipt.passed = true;
  } catch (error) {
    receipt.stage = stage;
    receipt.error = redact(error.stack || error.message).slice(0, 2500);
    receipt.workspace = await page
      ?.getByRole("region", { name: "Passage visualization" })
      .innerText()
      .catch(() => "Unavailable");
    throw Error(receipt.error);
  } finally {
    // Never record passwords, sessions, JWTs or cookie values in public evidence.
    receipt.pageErrors = pageErrors.map(redact);
    receipt.sourceHashes = Object.fromEntries(
      await Promise.all(
        [
          "scripts/verify-reading-scene-auth-browser.cjs",
          "apps/web/components/saga/scene-visualizer.tsx",
          "apps/web/lib/reading-scene/session.ts",
          "apps/web/app/api/reading-scenes/route.ts",
          "apps/web/app/auth/login/page.tsx",
          "apps/web/lib/supabase/server.ts",
        ].map(async (file) => [
          file,
          createHash("sha256")
            .update(await fs.readFile(file))
            .digest("hex"),
        ]),
      ),
    );
    await fs.writeFile(
      `${output}/browser-receipt.json`,
      JSON.stringify(receipt, null, 2),
    );
    for (const context of contexts) await context.close();
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
