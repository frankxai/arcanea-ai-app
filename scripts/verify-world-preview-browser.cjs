const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const { createClient } = createRequire(resolve("apps/web/package.json"))(
  "@supabase/supabase-js",
);
const fixtureWorld = {
  name: "Tide Ledger",
  slug: "tide-ledger",
  tagline: "Every tide collects a debt.",
  description:
    "A coastal city must repay the sea with memories. Its collectors refuse to forget who is missing.",
  elements: [{ name: "Salt", domain: "Memory", color: "#00bcd4" }],
  laws: [
    {
      name: "The seawall",
      description: "Every repaired stone costs one shared memory.",
    },
    {
      name: "The collector",
      description: "An unpaid debt opens the nearest floodgate.",
    },
    {
      name: "The witness",
      description:
        "A debt can only be paid in front of someone who remembers it.",
    },
  ],
  systems: [
    {
      name: "The ledger",
      type: "Civic ritual",
      rules:
        "Debt is recorded at low tide; a broken jar returns it to the debtor.",
    },
  ],
  characters: [
    {
      name: "Mara",
      backstory: "She refuses to surrender her daughter’s name.",
    },
    { name: "Ivo", backstory: "He collects debts to defend the harbor." },
  ],
  locations: [
    {
      name: "The dry stair",
      description: "A staircase appears only at low tide.",
    },
    { name: "Salt archive", description: "The debts are kept in glazed jars." },
  ],
  first_event: {
    title: "The first bargain",
    description: "The city survives by forgetting its founder.",
  },
  image_prompt: "Salt-stained ledgers in a coastal archive",
};
async function main() {
  const config = JSON.parse(
    await fs.readFile(process.env.WORLD_TEST_CONFIG, "utf8"),
  );
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.base, "http://127.0.0.1:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:54321");
  assert.equal(config.accounts.length, 2);
  assert.ok(config.accounts.every((a) => a.email.endsWith("@example.invalid")));
  const evidence = {
    head: config.head,
    realPasswordLogin: true,
    realPostgrestWrites: true,
    syntheticGeneration: !process.env.WORLD_TEST_API_KEY,
    actualProviderCalls: 0,
    interactions: [],
    passed: false,
  };
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
    acceptDownloads: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const errors = [];
  const failedRequests = [];
  let stage = "login";
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("requestfailed", (request) => {
    const url = new URL(request.url());
    failedRequests.push({
      origin: url.origin,
      path: url.pathname,
      error: request.failure()?.errorText,
    });
  });
  const button = (name) => page.getByRole("button", { name, exact: true });
  const key = page.getByLabel("Your Gemini API key", { exact: true });
  const login = async (account) => {
    await page.goto(
      `${config.base}/auth/login?next=%2Fworlds%2Fcreate%3Fresume%3D1`,
    );
    await page.getByLabel("Email", { exact: true }).fill(account.email);
    await page.getByLabel("Password", { exact: true }).fill(account.password);
    await page
      .locator("form")
      .getByRole("button", { name: "Sign In", exact: true })
      .click();
    await page.waitForURL((url) => url.pathname === "/worlds/create");
    await expect(button("Create world")).toBeVisible();
  };
  const db = createClient(config.supabaseUrl, config.anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const second = createClient(config.supabaseUrl, config.anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  try {
    assert.equal(
      (await db.auth.signInWithPassword(config.accounts[0])).error,
      null,
    );
    assert.equal(
      (await second.auth.signInWithPassword(config.accounts[1])).error,
      null,
    );
    await login(config.accounts[0]);
    stage = "generation-and-edit";
    await expect(key).toHaveValue("");
    const input = page.getByRole("textbox", { name: "Describe your world" });
    await input.fill("A coastal city pays the sea with memories");
    await button("Create world").click();
    await expect(page.getByRole("alert")).toContainText("Gemini");
    const customerKey =
      process.env.WORLD_TEST_API_KEY || "disposable-browser-key";
    await key.fill(customerKey);
    let calls = 0;
    await page.route("**/api/worlds/generate", async (route) => {
      calls++;
      assert.equal(route.request().headers()["x-google-key"], customerKey);
      if (process.env.WORLD_TEST_API_KEY) {
        assert.equal(calls, 1, "At most one live app generation; no retry.");
        return route.continue();
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          draft_id: "12345678-1234-4234-a234-123456789abc",
          world: fixtureWorld,
          saved: false,
        }),
      });
    });
    const generationResponse = page.waitForResponse(
      (response) => response.url().endsWith("/api/worlds/generate"),
      { timeout: 60000 },
    );
    await button("Create world").click();
    const generatedResponse = await generationResponse;
    assert.equal(generatedResponse.status(), 200);
    const generatedWorld = (await generatedResponse.json()).world;
    if (process.env.WORLD_TEST_API_KEY) {
      evidence.actualProviderCalls = 1;
      await fs.writeFile(
        `${config.output}/generated-world.json`,
        JSON.stringify(generatedWorld, null, 2),
      );
    }
    await expect(
      page.getByRole("heading", { name: generatedWorld.name, exact: true }),
    ).toBeVisible();
    assert.equal(calls, 1);
    await button("Edit world draft").click();
    await page
      .getByLabel("World name", { exact: true })
      .fill("The remembered harbor");
    await page
      .getByLabel("Rule 1 consequence", { exact: true })
      .fill(
        "Every repaired stone costs one shared memory; a missing witness voids the repair.",
      );
    await expect(button("Save this world")).toBeDisabled();
    await button("Apply draft changes").click();
    await page.reload();
    await expect(key).toHaveValue("");
    await expect(
      page.getByRole("heading", { name: "The remembered harbor", exact: true }),
    ).toBeVisible();
    const currentKey = `arcanea.world-draft.v1.${config.accounts[0].id}`;
    const raw = await page.evaluate(
      (k) => sessionStorage.getItem(k),
      currentKey,
    );
    const draft = JSON.parse(raw);
    stage = "private-partial-save";
    assert.equal(draft.world.name, "The remembered harbor");
    await button("Save this world").click();
    await expect(page.getByRole("alert")).toContainText("Saving is incomplete");
    assert.equal(
      await page.evaluate((k) => sessionStorage.getItem(k), currentKey),
      raw,
    );
    const partial = await db
      .from("worlds")
      .select("id,slug,visibility")
      .single();
    assert.equal(partial.error, null);
    assert.equal(partial.data.visibility, "private");
    assert.equal(
      (await db.from("world_characters").select("*")).data.length,
      draft.world.characters.length,
    );
    assert.equal((await db.from("world_locations").select("*")).data.length, 0);
    await button("Save this world").click();
    await page.waitForURL(`**/worlds/${partial.data.slug}`);
    await expect(
      page.getByRole("heading", { name: "The remembered harbor", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "The remembered harbor", exact: true }),
    ).toBeVisible();
    assert.equal((await db.from("worlds").select("*")).data.length, 1);
    assert.equal(
      (await db.from("world_characters").select("*")).data.length,
      draft.world.characters.length,
    );
    assert.equal(
      (await db.from("world_locations").select("*")).data.length,
      draft.world.locations.length,
    );
    assert.equal((await db.from("world_events").select("*")).data.length, 1);
    const source = await db
      .from("world_creations")
      .select("content,is_public")
      .single();
    assert.equal(source.error, null);
    assert.equal(source.data.is_public, false);
    assert.deepEqual(JSON.parse(source.data.content), draft.world);
    assert.deepEqual((await second.from("worlds").select("*")).data, []);
    assert.deepEqual(
      (await second.from("world_creations").select("*")).data,
      [],
    );
    const forbidden = await second
      .from("worlds")
      .update({ name: "Foreign overwrite" })
      .eq("id", partial.data.id)
      .select();
    assert.deepEqual(forbidden.data, []);
    await page.screenshot({
      path: `${config.output}/mobile-private-world.png`,
      fullPage: true,
      animations: "disabled",
    });
    // Same-tab account transition: preserve the first owner's backup, do not auto
    // restore it for another account, and clear the credential from React state.
    await page.goto(`${config.base}/worlds/create?resume=1`);
    await page.evaluate(
      ({ currentKey, raw }) => sessionStorage.setItem(currentKey, raw),
      { currentKey, raw },
    );
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "The remembered harbor", exact: true }),
    ).toBeVisible();
    await key.fill("disposable-browser-key");
    await page.evaluate(async () => {
      const keys = Object.keys(localStorage).filter(
        (k) => k.startsWith("sb-") && k.endsWith("-auth-token"),
      );
      for (const k of keys) localStorage.removeItem(k);
    });
    await context.clearCookies();
    stage = "second-account";
    await login(config.accounts[1]);
    await expect(key).toHaveValue("");
    await expect(
      page.getByRole("heading", { name: "The remembered harbor", exact: true }),
    ).toHaveCount(0);
    assert.equal(
      await page.evaluate((k) => sessionStorage.getItem(k), currentKey),
      raw,
    );
    const denied = await page.goto(
      `${config.base}/worlds/${partial.data.slug}`,
    );
    assert.equal(denied.status(), 404);
    const anon = await browser.newContext();
    const anonymous = await anon.newPage();
    assert.equal(
      (
        await anonymous.goto(`${config.base}/worlds/${partial.data.slug}`)
      ).status(),
      404,
    );
    await anon.close();
    await page.goto(`${config.base}/worlds/create?resume=1`);
    await page
      .getByRole("textbox", { name: "Describe your world" })
      .fill("A city inside a clock");
    await key.fill("disposable-browser-key");
    await page.unroute("**/api/worlds/generate");
    await page.route("**/api/worlds/generate", async (route) => {
      await new Promise((r) => setTimeout(r, 1500));
      try {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            world: fixtureWorld,
            draft_id: "a2345678-1234-4234-a234-123456789abc",
            saved: false,
          }),
        });
      } catch {}
    });
    await button("Create world").click();
    await button("Cancel generation").click();
    await expect(
      page.getByRole("textbox", { name: "Describe your world" }),
    ).toHaveValue("A city inside a clock");
    await page.waitForTimeout(1700);
    await expect(
      page.getByRole("heading", { name: fixtureWorld.name, exact: true }),
    ).toHaveCount(0);
    assert.equal(
      await page.evaluate(() =>
        Object.entries(sessionStorage).some(
          ([k, v]) => k.includes("key") || v.includes("disposable-browser-key"),
        ),
      ),
      false,
    );
    assert.equal(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1,
      ),
      true,
    );
    await page.screenshot({
      path: `${config.output}/mobile-cancelled.png`,
      fullPage: true,
      animations: "disabled",
    });
    assert.deepEqual(errors, []);
    if (process.env.WORLD_TEST_API_KEY) {
      // A direct AI Studio-style response is a serious existing alternative.
      // One sample supports inspecting working material, not superiority claims.
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": process.env.WORLD_TEST_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: "Create an original usable world bible for this concept: A coastal city pays the sea with memories. Explain ordinary life, who benefits, who pays and an unresolved story pressure. Include three observable laws with limits and evasion consequences, one social or magical system with scarcity and a failure mode, two or three characters with conflicting obligations and distinct voices, two or three sensory locations with a dispute, and a founding event that causes a present disagreement. Avoid abstract praise, prophecy and ornamental adjective chains. Return readable markdown for a creator to edit.",
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 6000,
              thinkingConfig: { thinkingBudget: 0, includeThoughts: false },
            },
          }),
          signal: AbortSignal.timeout(45000),
          redirect: "error",
        },
      );
      evidence.actualProviderCalls++;
      if (!response.ok)
        throw Error(
          `Bounded direct comparison failed (${response.status}); no retry.`,
        );
      const result = await response.json();
      assert.equal(result.candidates?.[0]?.finishReason, "STOP");
      const text = (result.candidates[0].content?.parts || [])
        .filter((p) => !p.thought)
        .map((p) => p.text || "")
        .join("");
      assert.ok(text.length > 100);
      await fs.writeFile(`${config.output}/direct-model-comparison.md`, text);
      await fs.writeFile(
        `${config.output}/generation-comparison-receipt.json`,
        JSON.stringify(
          {
            head: config.head,
            model: result.modelVersion,
            responseId: result.responseId,
            usage: result.usageMetadata,
            maxCalls: 2,
            maxOutputTokensPerCall: 6000,
            thinkingBudget: 0,
            automaticRetries: 0,
            productionWrites: 0,
            qualityVerdict:
              "Pending inspection of both outputs; a single sample cannot establish superiority",
          },
          null,
          2,
        ),
      );
    }
    evidence.interactions = [
      "real password login",
      "missing customer key refuses",
      process.env.WORLD_TEST_API_KEY
        ? "actual customer-key model generation"
        : "explicit synthetic generation",
      "applied edit reload",
      "real interrupted partial save",
      "idempotent retry and reopen",
      "complete source JSON retained privately",
      "second-account read/write denial",
      "same-tab backup owner isolation",
      "anonymous private-world 404",
      "cancel ignores late result",
      "key absent from recovery storage",
      "375px reduced-motion no overflow",
    ];
    evidence.passed = true;
  } catch (error) {
    evidence.failureStage = stage;
    evidence.failurePath = new URL(page.url()).pathname;
    evidence.failedRequests = failedRequests;
    await page
      .screenshot({
        path: `${config.output}/failure.png`,
        fullPage: true,
        animations: "disabled",
        mask: [page.locator('input[type="password"]')],
      })
      .catch(() => {});
    throw error;
  } finally {
    await fs.writeFile(
      `${config.output}/browser-evidence.json`,
      JSON.stringify(evidence, null, 2),
    );
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
