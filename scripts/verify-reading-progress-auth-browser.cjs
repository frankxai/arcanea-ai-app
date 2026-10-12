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
const article = "/library/laws-of-arcanea/i-the-scientific-foundations";
const textSlug = article.slice("/library/".length);
const collectionSlug = "laws-of-arcanea";
const sha = (value) => createHash("sha256").update(value).digest("hex");
const sourceFiles = [
  "scripts/verify-reading-progress-auth-browser.cjs",
  "scripts/run-reading-scene-auth-fixture.mjs",
  "scripts/fixtures/reading-scene-postgrest.sql",
  "scripts/fixtures/reading-scene-auth.sql",
  "scripts/fixtures/reading-progress-auth.sql",
  ".github/workflows/reading-progress.yml",
  "apps/web/hooks/use-reading-progress.ts",
  "apps/web/app/library/reading-tracker.tsx",
  "apps/web/app/library/[collection]/[text]/page.tsx",
  "apps/web/app/library/collection-texts.tsx",
  "apps/web/lib/auth/context.tsx",
  "apps/web/lib/supabase/client.ts",
  "apps/web/app/auth/login/page.tsx",
  "apps/web/app/layout.tsx",
  "apps/web/app/globals.css",
  "apps/web/components/lumina/lumina-bubble.tsx",
  "apps/web/components/lumina/companion-chat.tsx",
  "packages/design-system/src/companion.module.css",
  "apps/web/hooks/use-provider.ts",
  "apps/web/lib/ai/provider-preferences.ts",
  "apps/web/lib/chat/error-message.ts",
  "TASTE.md",
];

async function main() {
  assert.equal(process.env.GITHUB_ACTIONS, "true");
  assert.equal(process.env.READING_PROGRESS_AUTH, "true");
  const config = JSON.parse(
    await fs.readFile(process.env.READING_SCENE_AUTH_CONFIG, "utf8"),
  );
  assert.equal(config.head, process.env.READING_SCENE_HEAD);
  assert.equal(config.base, "http://127.0.0.1:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:3803");
  assert.equal(config.output, "screenshots/reading-progress-auth");
  assert.equal(config.accounts.length, 2);
  assert.ok(
    config.accounts.every(
      (a) =>
        a.email.endsWith("@example.invalid") && /^[a-f0-9-]{36}$/.test(a.id),
    ),
  );
  const redact = (value) =>
    [config.anon, ...config.accounts.flatMap((a) => [a.email, a.password])]
      .reduce(
        (text, secret) => text.split(secret).join("[redacted]"),
        String(value),
      )
      .replace(
        /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
        "[redacted-jwt]",
      );
  const receipt = {
    head: config.head,
    runId: process.env.GITHUB_RUN_ID,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT,
    auth: "Real UI password login, GoTrue-validated users and delivered SSR cookies",
    database:
      "Disposable Postgres/PostgREST; real non-bypass RLS roles and selected inspected reading_progress contract",
    limits:
      "Disposable accounts and data, no customer or production writes. Profile projection is minimal. Complete production grants/triggers, deployed database binding and production HTTPS CSP remain unverified.",
    csp: "Loopback HTTP acceptance uses bypassCSP; production CSP is unchanged",
    passed: false,
    checks: [],
    captures: [],
    pageErrors: [],
    consoleErrors: [],
    externalOriginsBlocked: [],
    sourceHashes: Object.fromEntries(
      await Promise.all(
        sourceFiles.map(async (file) => [file, sha(await fs.readFile(file))]),
      ),
    ),
  };
  const browser = await chromium.launch();
  const contexts = [];
  let page,
    diagnosticPage,
    stage = "real-sdk-identities";
  const sdk = () =>
    createClient(config.supabaseUrl, config.anon, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (url, options) => {
          assert.equal(new URL(url).origin, config.supabaseUrl);
          return fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
        },
      },
    });
  const clients = [sdk(), sdk()];
  const anonymous = sdk();
  const makeContext = async (mobile = false) => {
    const context = await browser.newContext({
      viewport: mobile
        ? { width: 375, height: 900 }
        : { width: 1440, height: 1000 },
      hasTouch: mobile,
      isMobile: mobile,
      reducedMotion: "reduce",
      bypassCSP: true,
    });
    contexts.push(context);
    await context.route("**/*", (route) => {
      const origin = new URL(route.request().url()).origin;
      if ([config.base, config.supabaseUrl].includes(origin))
        return route.continue();
      receipt.externalOriginsBlocked.push(origin);
      return route.abort();
    });
    context.on("page", (target) => {
      target.setDefaultTimeout(20000);
      target.on("pageerror", (error) =>
        receipt.pageErrors.push(redact(error.message).slice(0, 1200)),
      );
      target.on("console", (message) => {
        if (message.type() === "error")
          receipt.consoleErrors.push(redact(message.text()).slice(0, 800));
      });
    });
    return context;
  };
  const readStatus = (target) =>
    target.getByRole("status").filter({ hasText: /^Read$/ });
  const button = (target, name) =>
    target.getByRole("button", { name, exact: true });
  async function login(target, account) {
    diagnosticPage = target;
    await target.goto(
      `${config.base}/auth/login?next=${encodeURIComponent(article)}`,
    );
    const form = target.locator("form").filter({
      has: target.getByLabel("Email", { exact: true }),
    });
    await expect(form).toHaveCount(1);
    await form.getByLabel("Email", { exact: true }).fill(account.email);
    await form.getByLabel("Password", { exact: true }).fill(account.password);
    await form.getByRole("button", { name: "Sign In", exact: true }).click();
    await target.waitForURL((url) => url.pathname === article);
    await expect(target.locator("#main-content")).toHaveCount(1);
    await expect(target.getByRole("main")).toHaveCount(1);
    await expect(target.locator("#main-content")).toBeVisible();
    await expect(target.locator("article#library-reading-text")).toBeVisible();
    assert.ok(
      (await target.context().cookies(config.base)).some(
        (cookie) =>
          cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"),
      ),
    );
  }
  async function capture(
    target,
    name,
    reason,
    locator,
    readingPosition = true,
  ) {
    await target.evaluate(async () => {
      await document.fonts.ready;
    });
    await locator.scrollIntoViewIfNeeded();
    const breadcrumb = await target
      .getByRole("navigation", { name: "Breadcrumb", exact: true })
      .boundingBox();
    assert.ok(breadcrumb);
    if (readingPosition) assert.ok(breadcrumb.y + breadcrumb.height <= 0);
    receipt.readingBreadcrumbs = [
      ...(receipt.readingBreadcrumbs || []),
      {
        capture: name,
        readingPosition,
        top: breadcrumb.y,
        bottom: breadcrumb.y + breadcrumb.height,
      },
    ];
    const file = `${config.output}/${name}.png`;
    await target.screenshot({ path: file, fullPage: false });
    const record = {
      schema: "arcanea.rendered-fixture.v1",
      prompt: reason,
      model: null,
      seed: null,
      provider: "GitHub Actions / Playwright browser rendering",
      agent_session: `github-actions:${receipt.runId}:${receipt.runAttempt}`,
      sourceCommit: config.head,
      sourceHashes: receipt.sourceHashes,
      captureSha256: sha(await fs.readFile(file)),
      generated: false,
      inspected: false,
      schemaValidation:
        "Canonical sidecar schema unavailable; conformance unverified",
    };
    await fs.writeFile(
      `${file}.vis.provenance.json`,
      JSON.stringify(record, null, 2) + "\n",
    );
    await fs.appendFile(
      `${config.output}/image-generation-ledger.jsonl`,
      JSON.stringify(record) + "\n",
    );
    await fs.appendFile(
      `${config.output}/taste-ledger.jsonl`,
      JSON.stringify({
        source: "TASTE.md",
        sourceSha256: receipt.sourceHashes["TASTE.md"],
        capture: name + ".png",
        instruction:
          "Inspect existing Library typography, account recovery and desktop/mobile reduced-motion controls.",
        agent_session: record.agent_session,
        newFounderFeedback: false,
      }) + "\n",
    );
    receipt.captures.push({
      file: name + ".png",
      sha256: record.captureSha256,
      reason,
    });
  }
  const companionTrigger = (target) =>
    target.getByRole("button", { name: "Open Arcanea companion", exact: true });
  const companionDialog = (target) =>
    target.getByRole("dialog", { name: "Arcanea companion", exact: true });
  async function exerciseReadingCompanion(target, mobile) {
    const trigger = companionTrigger(target);
    await expect(trigger).toHaveCount(1);
    await expect(trigger).toHaveCSS("position", "static");
    await trigger.scrollIntoViewIfNeeded();
    const box = await trigger.boundingBox();
    assert.ok(box && box.height >= 44 && box.width >= 44);
    await capture(
      target,
      mobile ? "mobile-companion-entry" : "desktop-companion-entry",
      "One 44px companion entry sits in the article header, outside the prose, without a floating reading overlay.",
      trigger,
      false,
    );
    if (mobile) await trigger.tap();
    else {
      await trigger.focus();
      await target.keyboard.press("Enter");
    }
    const dialog = companionDialog(target);
    await expect(dialog).toBeVisible();
    const prompt = dialog.getByLabel("Your message", { exact: true });
    await expect(prompt).toBeFocused();
    await expect(prompt).toHaveValue("");
    await prompt.fill(
      mobile ? "Private mobile fixture draft" : "Private A fixture draft",
    );
    if (mobile)
      await capture(
        target,
        "mobile-companion-open",
        "Touch opens the existing account-scoped companion at 375px; a synthetic unsent draft is editable and Escape returns focus.",
        dialog,
        false,
      );
    await target.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(companionTrigger(target)).toBeFocused();
    await expect(companionTrigger(target)).toHaveCSS("position", "static");
    if (mobile) await companionTrigger(target).tap();
    else await target.keyboard.press("Enter");
    await expect(prompt).toHaveValue(
      mobile ? "Private mobile fixture draft" : "Private A fixture draft",
    );
    await dialog
      .getByRole("button", { name: "Close companion", exact: true })
      .click();
    await expect(dialog).toBeHidden();
    await expect(companionTrigger(target)).toBeFocused();
    receipt.checks.push(
      `${mobile ? "Mobile touch" : "Desktop keyboard"} opens one in-flow companion; draft survives close/reopen, Escape and Close restore focus, and the closed trigger cannot float over prose`,
    );
  }
  const ownerRows = () =>
    clients[0]
      .from("reading_progress")
      .select(
        "id,user_id,text_slug,collection_slug,progress_percent,completed_at",
      )
      .eq("text_slug", textSlug);
  const checkedRows = async () => {
    const result = await ownerRows();
    assert.equal(result.error, null);
    assert.equal(result.data.length, 1);
    const row = result.data[0];
    assert.equal(row.user_id, config.accounts[0].id);
    assert.equal(row.collection_slug, collectionSlug);
    assert.equal(row.progress_percent, 100);
    assert.ok(Number.isFinite(Date.parse(row.completed_at)));
    return row;
  };
  try {
    for (const [i, client] of clients.entries()) {
      const { data, error } = await client.auth.signInWithPassword(
        config.accounts[i],
      );
      assert.equal(error, null);
      assert.equal(data.user.id, config.accounts[i].id);
      const verified = await client.auth.getUser();
      assert.equal(verified.error, null);
      assert.equal(verified.data.user.id, config.accounts[i].id);
      const diagnostic = await client.rpc("reading_progress_fixture_contract");
      assert.equal(diagnostic.error, null);
      assert.equal(diagnostic.data.database, "reading_scene_fixture");
      assert.equal(diagnostic.data.role, "authenticated");
      assert.equal(diagnostic.data.uid, config.accounts[i].id);
      assert.equal(diagnostic.data.roleSuperuser, false);
      assert.equal(diagnostic.data.roleBypass, false);
      assert.equal(diagnostic.data.rlsEnabled, true);
      assert.equal(diagnostic.data.policyCount, 3);
      assert.notEqual(diagnostic.data.tableOwner, diagnostic.data.role);
    }
    receipt.checks.push(
      "Two GoTrue password identities verified; real authenticated roles neither own the table nor bypass RLS",
    );
    const context = await makeContext();
    page = await context.newPage();
    stage = "committed-upsert-lost-acknowledgement";
    let dropAcknowledgement = true,
      saveFailure = null;
    const saves = [];
    await context.route("**/rest/v1/reading_progress?**", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      try {
        const payload = route.request().postDataJSON();
        saves.push(payload);
        receipt.desktopSaveAttempts = saves.length;
        assert.equal(payload.user_id, config.accounts[0].id);
        assert.equal(payload.text_slug, textSlug);
        assert.equal(payload.collection_slug, collectionSlug);
        assert.equal(payload.progress_percent, 100);
        const response = await route.fetch({ timeout: 10000, maxRetries: 0 });
        if (![200, 201].includes(response.status()))
          throw Error(`Real upsert returned ${response.status()}`);
        if (dropAcknowledgement) {
          dropAcknowledgement = false;
          receipt.desktopSaveAcknowledgementDropped = true;
          return route.abort("failed");
        }
        await route.fulfill({ response });
      } catch (error) {
        saveFailure = redact(error.message);
        receipt.desktopSaveTransportFailure = saveFailure;
        await route.abort("failed");
      }
    });
    await login(page, config.accounts[0]);
    stage = "desktop-reading-companion";
    await exerciseReadingCompanion(page, false);
    stage = "committed-upsert-lost-acknowledgement";
    await expect(button(page, "Mark as read")).toBeEnabled();
    const articleEnd = page.locator(
      'article#library-reading-text > div[aria-hidden="true"]',
    );
    await expect(articleEnd).toHaveCount(1);
    await button(page, "Mark as read").scrollIntoViewIfNeeded();
    // The tall sticky sidebar may reach the article end while its button scrolls
    // into view. Let that real observer request the first save; a second click
    // could already be the user's retry after the dropped acknowledgement.
    const endVisible = await page.evaluate(async () => {
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      const rect = document
        .getElementById("library-reading-text")
        .getBoundingClientRect();
      return rect.bottom >= 1 && rect.bottom <= innerHeight;
    });
    const automaticSave = endVisible || saves.length > 0;
    receipt.desktopInitialSaveTrigger = automaticSave
      ? "article-end"
      : "manual";
    if (!automaticSave) await button(page, "Mark as read").click();
    await expect(button(page, "Try saving again")).toBeEnabled({
      timeout: 15000,
    });
    await expect(
      page.getByRole("alert").filter({ hasText: /couldn’t confirm that save/ }),
    ).toBeVisible();
    assert.equal(saveFailure, null);
    assert.equal(saves.length, 1);
    await expect(readStatus(page)).toHaveCount(0);
    const firstRow = await checkedRows();
    const retry = button(page, "Try saving again");
    assert.ok((await retry.boundingBox()).height >= 44);
    await retry.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(retry).toBeFocused();
    await capture(
      page,
      "desktop-save-retry",
      "Real Library failed acknowledgement after a committed RLS-protected save; keyboard retry remains available.",
      retry,
    );
    await page.keyboard.press("Enter");
    await expect(readStatus(page)).toBeVisible();
    assert.equal(saveFailure, null);
    assert.equal(saves.length, 2);
    assert.equal((await checkedRows()).id, firstRow.id);
    receipt.checks.push(
      "Actual Library upsert commits before lost acknowledgement; keyboard retry confirms one existing owner/text row",
    );
    await capture(
      page,
      "desktop-read",
      "Real Library confirmed Read after the second acknowledged upsert into the same row.",
      readStatus(page),
    );
    stage = "actual-reload-and-collection-badge";
    await page.reload();
    await expect(readStatus(page)).toBeVisible();
    assert.equal(saves.length, 2);
    const fresh = await context.newPage();
    diagnosticPage = fresh;
    await fresh.goto(config.base + article);
    await expect(readStatus(fresh)).toBeVisible();
    const collection = await context.newPage();
    diagnosticPage = collection;
    await collection.goto(`${config.base}/library/${collectionSlug}`);
    await expect(
      collection
        .locator(`a[href="${article}"]`)
        .first()
        .getByLabel("Read", { exact: true }),
    ).toBeVisible();
    receipt.checks.push(
      "Reload, fresh tab and collection badge recover completion through real authenticated GETs without another save",
    );
    stage = "non-bypass-rls-denial";
    diagnosticPage = null;
    for (const client of [clients[1], anonymous]) {
      const read = await client
        .from("reading_progress")
        .select("id")
        .eq("id", firstRow.id);
      assert.equal(read.error, null);
      assert.deepEqual(read.data, []);
      const forged = await client
        .from("reading_progress")
        .insert({
          user_id: config.accounts[0].id,
          text_slug: textSlug + "-forbidden",
          collection_slug: collectionSlug,
        })
        .select("id");
      assert.equal(forged.error?.code, "42501");
      const update = await client
        .from("reading_progress")
        .update({ progress_percent: 50 })
        .eq("id", firstRow.id)
        .select("id");
      assert.equal(update.error, null);
      assert.deepEqual(update.data, []);
      const deletion = await client
        .from("reading_progress")
        .delete()
        .eq("id", firstRow.id)
        .select("id");
      assert.equal(deletion.error, null);
      assert.deepEqual(deletion.data, []);
    }
    const spoofedRetry = await clients[1]
      .from("reading_progress")
      .upsert(
        {
          user_id: config.accounts[0].id,
          text_slug: textSlug,
          collection_slug: collectionSlug,
          progress_percent: 100,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,text_slug" },
      )
      .select("id");
    assert.equal(spoofedRetry.error?.code, "42501");
    const own = await clients[1]
      .from("reading_progress")
      .insert({
        user_id: config.accounts[1].id,
        text_slug: textSlug,
        collection_slug: collectionSlug,
        progress_percent: 17,
      })
      .select("id")
      .single();
    assert.equal(own.error, null);
    const reassigned = await clients[1]
      .from("reading_progress")
      .update({ user_id: config.accounts[0].id })
      .eq("id", own.data.id)
      .select("id");
    assert.equal(reassigned.error?.code, "42501");
    const ownerDelete = await clients[0]
      .from("reading_progress")
      .delete()
      .eq("id", firstRow.id)
      .select("id");
    assert.equal(ownerDelete.error, null);
    assert.deepEqual(ownerDelete.data, []);
    assert.equal((await checkedRows()).id, firstRow.id);
    receipt.checks.push(
      "Other account and anonymous SELECT/PATCH/DELETE cannot access A; forged INSERT/upsert and B-to-A ownership reassignment fail 42501; no DELETE policy permits even A to delete",
    );
    stage = "real-cross-tab-password-account-switch";
    await page.evaluate(() => window.scrollTo(0, 0));
    await context.clearCookies();
    const switchTab = await context.newPage();
    await login(switchTab, config.accounts[1]);
    await expect(readStatus(switchTab)).toHaveCount(0);
    await expect(button(switchTab, "Mark as read")).toBeEnabled();
    diagnosticPage = page;
    await expect(readStatus(page)).toHaveCount(0);
    await expect(button(page, "Mark as read")).toBeEnabled();
    assert.equal(saves.length, 2);
    await expect(companionDialog(page)).toHaveCount(0);
    await companionTrigger(page).click();
    await expect(
      companionDialog(page).getByLabel("Your message", { exact: true }),
    ).toHaveValue("");
    await companionDialog(page)
      .getByRole("button", { name: "Close companion", exact: true })
      .click();
    receipt.checks.push(
      "Real cross-tab account change retires the old companion and its unsent A draft; B opens a fresh empty draft",
    );
    assert.equal((await checkedRows()).id, firstRow.id);
    receipt.checks.push(
      "Actual second password login in the same browser context retires A's Read in the old tab; B's incomplete row is shown without a write",
    );
    stage = "interrupted-real-get-retry";
    const loadContext = await makeContext();
    const recovery = await loadContext.newPage();
    page = recovery;
    let loadRequests = 0;
    let interruptLoads = true;
    await loadContext.route("**/rest/v1/reading_progress?**", async (route) => {
      if (route.request().method() !== "GET") return route.continue();
      receipt.loadRequests = ++loadRequests;
      // The actual SDK retries GET failures. Keep the transport interrupted
      // through those attempts; only the user's explicit Retry restores it.
      if (interruptLoads) return route.abort("failed");
      return route.continue();
    });
    await login(recovery, config.accounts[0]);
    await expect(button(recovery, "Retry")).toBeEnabled({ timeout: 15000 });
    await expect(readStatus(recovery)).toHaveCount(0);
    receipt.interruptedLoadAttempts = loadRequests;
    interruptLoads = false;
    await button(recovery, "Retry").click();
    await expect(readStatus(recovery)).toBeVisible();
    assert.ok(loadRequests >= 2);
    receipt.loadRequests = loadRequests;
    receipt.checks.push(
      "Interrupted actual PostgREST load stays unconfirmed; explicit Retry retrieves the persisted owner completion",
    );
    stage = "mobile-authenticated-and-anonymous-library";
    const mobileContext = await makeContext(true);
    const mobile = await mobileContext.newPage();
    page = mobile;
    await login(mobile, config.accounts[0]);
    await expect(readStatus(mobile)).toBeVisible();
    await capture(
      mobile,
      "mobile-read",
      "375px reduced-motion Library restores the real authenticated owner's completion.",
      readStatus(mobile),
    );
    await exerciseReadingCompanion(mobile, true);
    const mobileRetryContext = await makeContext(true);
    const mobileRetry = await mobileRetryContext.newPage();
    page = mobileRetry;
    let mobileSaves = 0,
      mobileSaveFailure = null;
    await mobileRetryContext.route(
      "**/rest/v1/reading_progress?**",
      async (route) => {
        if (route.request().method() !== "POST") return route.continue();
        try {
          mobileSaves++;
          receipt.mobileSaveAttempts = mobileSaves;
          assert.equal(
            route.request().postDataJSON().user_id,
            config.accounts[1].id,
          );
          const response = await route.fetch({ timeout: 10000, maxRetries: 0 });
          assert.ok([200, 201].includes(response.status()));
          if (mobileSaves === 1) {
            receipt.mobileSaveAcknowledgementDropped = true;
            return route.abort("failed");
          }
          await route.fulfill({ response });
        } catch (error) {
          mobileSaveFailure = redact(error.message);
          receipt.mobileSaveTransportFailure = mobileSaveFailure;
          await route.abort("failed");
        }
      },
    );
    await login(mobileRetry, config.accounts[1]);
    await expect(button(mobileRetry, "Mark as read")).toBeEnabled();
    await mobileRetry.evaluate(async () => {
      await document.fonts.ready;
    });
    const mobileEnd = mobileRetry.locator(
      'article#library-reading-text > div[aria-hidden="true"]',
    );
    await expect(mobileEnd).toHaveCount(1);
    // The actual end-of-article sentinel, rather than a mocked observer, starts
    // completion when the mobile reader reaches the bottom.
    receipt.mobileArticleEnd = await mobileEnd.evaluate((element) => {
      element.scrollIntoView({ block: "center", behavior: "instant" });
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        width: rect.width,
        viewportHeight: innerHeight,
      };
    });
    assert.ok(receipt.mobileArticleEnd.height > 0);
    assert.ok(receipt.mobileArticleEnd.width > 0);
    assert.ok(
      receipt.mobileArticleEnd.top >= 0 &&
        receipt.mobileArticleEnd.bottom <=
          receipt.mobileArticleEnd.viewportHeight,
    );
    await expect(button(mobileRetry, "Try saving again")).toBeEnabled({
      timeout: 15000,
    });
    await expect(readStatus(mobileRetry)).toHaveCount(0);
    const mobileButton = button(mobileRetry, "Try saving again");
    assert.ok((await mobileButton.boundingBox()).height >= 44);
    assert.equal(mobileSaveFailure, null);
    await capture(
      mobileRetry,
      "mobile-save-retry",
      "Real mobile end-of-article save commits before its acknowledgement is dropped; the visible retry remains available at 375px.",
      mobileButton,
    );
    await mobileButton.tap();
    await expect(readStatus(mobileRetry)).toBeVisible();
    assert.equal(mobileSaveFailure, null);
    assert.equal(mobileSaves, 2);
    const mobileRows = await clients[1]
      .from("reading_progress")
      .select("id,progress_percent")
      .eq("text_slug", textSlug);
    assert.equal(mobileRows.error, null);
    assert.deepEqual(mobileRows.data, [
      { id: own.data.id, progress_percent: 100 },
    ]);
    assert.equal((await checkedRows()).id, firstRow.id);
    const mobileGeometry = await mobileRetry.evaluate(() => ({
      width: innerWidth,
      clientWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      visualViewportWidth: visualViewport?.width,
      codeBlocks: Array.from(
        document.querySelectorAll("#library-reading-text pre"),
      ).map((element) => ({
        width: element.clientWidth,
        scrollWidth: element.scrollWidth,
        overflowX: getComputedStyle(element).overflowX,
        tabindex: element.tabIndex,
      })),
      overflowElements: Array.from(document.querySelectorAll("body *"))
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return (
            rect.width > 0 &&
            (rect.left < -1 ||
              rect.right > document.documentElement.clientWidth + 1)
          );
        })
        .slice(0, 12)
        .map((element) => ({
          tag: element.tagName,
          id: element.id,
          classes: element.getAttribute("class")?.slice(0, 200),
          left: element.getBoundingClientRect().left,
          right: element.getBoundingClientRect().right,
        })),
    }));
    receipt.mobileSaves = mobileSaves;
    receipt.mobileGeometry = mobileGeometry;
    assert.equal(mobileGeometry.clientWidth, 375);
    assert.ok(mobileGeometry.documentWidth <= mobileGeometry.clientWidth + 1);
    const longCodeIndex = mobileGeometry.codeBlocks.findIndex(
      (block) => block.scrollWidth > block.width,
    );
    assert.ok(longCodeIndex >= 0);
    const longCode = mobileRetry
      .getByRole("region", { name: "Equation or code block", exact: true })
      .nth(longCodeIndex);
    await longCode.focus();
    await expect(longCode).toBeFocused();
    const beforeScroll = await longCode.evaluate(
      (element) => element.scrollLeft,
    );
    await mobileRetry.keyboard.press("ArrowRight");
    await expect
      .poll(() => longCode.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(beforeScroll);
    await capture(
      mobileRetry,
      "mobile-equation-scroll",
      "A long original equation stays inside the 375px Library page; its focused region scrolls with the keyboard.",
      longCode,
    );
    receipt.checks.push(
      "The single mobile tracker uses real article-end IntersectionObserver completion; lost acknowledgement exposes a 44px touch retry, one B row is confirmed and A remains unchanged; 375px layout and keyboard-scrolling equation are verified",
    );
    const guestContext = await makeContext(true);
    const guest = await guestContext.newPage();
    diagnosticPage = guest;
    await guest.goto(config.base + article);
    await expect(guest.locator("#main-content")).toHaveCount(1);
    await expect(guest.getByRole("main")).toHaveCount(1);
    await expect(guest.locator("#main-content")).toBeVisible();
    await expect(guest.locator("article#library-reading-text")).toBeVisible();
    await expect(button(guest, "Mark as read")).toHaveCount(0);
    await expect(readStatus(guest)).toHaveCount(0);
    await expect(companionTrigger(guest)).toHaveCount(1);
    await expect(companionTrigger(guest)).toHaveCSS("position", "static");
    await guest.goto(config.base + "/library/" + collectionSlug);
    await expect(companionTrigger(guest)).toHaveCount(1);
    await expect(companionTrigger(guest)).toHaveCSS("position", "fixed");
    await guest.locator(`a[href="${article}"]`).first().click();
    await guest.waitForURL((url) => url.pathname === article);
    await expect(companionTrigger(guest)).toHaveCount(1);
    await expect(companionTrigger(guest)).toHaveCSS("position", "static");
    receipt.checks.push(
      "Anonymous mobile Library keeps its in-flow companion; collection retains the floating entry, and actual client navigation back to the article leaves one static trigger",
    );
    receipt.checks.push(
      "Mobile password login restores Read; signed-out Library exposes no completion action or private progress",
    );
    assert.deepEqual(receipt.pageErrors, []);
    receipt.ownerRowCount = 1;
    receipt.browserUpserts = saves.length;
    receipt.passed = true;
  } catch (error) {
    receipt.stage = stage;
    receipt.error = redact(error.stack || error.message).slice(0, 2200);
    receipt.path = diagnosticPage
      ? new URL(diagnosticPage.url()).pathname
      : null;
    throw Error(
      "Real reading-progress acceptance failed; inspect the bounded receipt.",
    );
  } finally {
    await fs.writeFile(
      `${config.output}/browser-receipt.json`,
      JSON.stringify(receipt, null, 2) + "\n",
    );
    for (const context of contexts) await context.close();
    await browser.close();
  }
}
main().catch(() => {
  console.error(
    "Real reading-progress acceptance failed; inspect its bounded receipt.",
  );
  process.exitCode = 1;
});
