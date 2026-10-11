const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const base = process.env.ENTRY_TEST_BASE || "http://127.0.0.1:3001";
const output = path.resolve(
  process.env.ENTRY_TEST_OUTPUT || "screenshots/entry-handoff",
);
const repo = path.resolve(__dirname, "..");
const sources = [
  "apps/web/app/v3/hero-chat-box.tsx",
  "apps/web/app/chat/page.tsx",
  "apps/web/hooks/use-conversation.ts",
  "apps/web/components/chat/chat-input-bar.tsx",
  "apps/web/lib/chat/entry-draft.ts",
  "packages/design-system/src/entry-handoff.module.css",
  "packages/design-system/package.json",
  "scripts/tests/entry-draft.test.cjs",
  "scripts/verify-entry-handoff-browser.cjs",
  ".github/workflows/entry-handoff.yml",
  "planning-with-files/CURRENT_STATE_2026-10-11_ENTRY_HANDOFF.md",
  "apps/web/lib/auth/context.tsx",
  "apps/web/lib/supabase/client.ts",
  "apps/web/app/page.tsx",
  "apps/web/app/v3/v3-content.tsx",
  "apps/web/lib/ai/provider-preferences.ts",
  "apps/web/hooks/use-provider.ts",
  "apps/web/app/api/ai/chat/route.ts",
  "apps/web/package.json",
];
const modes = [
  { name: "desktop", viewport: { width: 1440, height: 1000 } },
  { name: "mobile", viewport: { width: 375, height: 900 } },
  {
    name: "reduced",
    viewport: { width: 375, height: 640 },
    reducedMotion: "reduce",
  },
  {
    name: "forced",
    viewport: { width: 375, height: 900 },
    forcedColors: "active",
  },
];
const digest = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");
const draftKey = "arcanea.chat-entry.v1";
const privateText =
  "海の図書館\nUnder the tide, Mara opened her mother's unfinished map.";
const fakeKey = "entry-fixture-only-no-provider-access";
const draftId = "00000000-0000-4000-8000-000000000008";
const newAccount = "00000000-0000-4000-8000-000000000092";

async function composeEnter(input) {
  await input.dispatchEvent("compositionstart", { data: "海" });
  await input.dispatchEvent("keydown", {
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    isComposing: false,
  });
  await input.dispatchEvent("compositionend", { data: "海" });
  await input.dispatchEvent("keydown", {
    key: "Enter",
    code: "Enter",
    keyCode: 13,
    isComposing: true,
  });
  await input.dispatchEvent("keydown", {
    key: "Enter",
    code: "Enter",
    keyCode: 229,
    isComposing: false,
  });
}
async function identityChange(page, owner = newAccount) {
  await page.evaluate((id) => {
    const channel = new BroadcastChannel("sb-placeholder-auth-token");
    channel.postMessage({
      event: "SIGNED_IN",
      session: {
        user: { id, email: "entry-fixture@example.invalid", user_metadata: {} },
        access_token: "fixture-not-a-credential",
        refresh_token: "fixture-not-a-credential",
        token_type: "bearer",
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      },
    });
    channel.close();
  }, owner);
}
async function main() {
  const target = new URL(base);
  assert.equal(target.protocol, "http:");
  assert.ok(
    ["127.0.0.1", "localhost"].includes(target.hostname),
    "Fixture is restricted to the owned loopback build",
  );
  await fs.mkdir(output, { recursive: true });
  const head = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repo,
    encoding: "utf8",
  }).trim();
  if (process.env.ENTRY_EXPECTED_SHA)
    assert.equal(head, process.env.ENTRY_EXPECTED_SHA);
  const sourceHashes = Object.fromEntries(
    await Promise.all(
      sources.map(async (file) => [
        file,
        digest(await fs.readFile(path.join(repo, file))),
      ]),
    ),
  );
  const receipt = {
    head,
    sourceHashes,
    environment:
      "compiled loopback app, intercepted synthetic AI stream and browser auth event",
    realProviderCalls: 0,
    productionWrites: 0,
    modes: [],
    captures: [],
    failures: [],
    cleanup: { browserClosed: false, streamServerClosed: false },
  };
  const streams = [];
  const fixtureServerErrors = [];
  let holdStream = false;
  const server = http.createServer(async (request, response) => {
    if (request.method !== "POST") {
      response.writeHead(405);
      response.end();
      return;
    }
    try {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      assert.equal(body.provider, "google");
      assert.equal(body.clientApiKey, fakeKey);
      assert.equal(body.gatewayModel, "arcanea-gemini-flash");
      const record = { held: holdStream, aborted: false, finished: false };
      streams.push(record);
      response.on("close", () => {
        if (!record.finished) record.aborted = true;
      });
      response.writeHead(200, {
        "content-type": "text/event-stream",
        "x-vercel-ai-ui-message-stream": "v1",
        "cache-control": "no-store",
      });
      const event = (value) =>
        response.write(`data: ${JSON.stringify(value)}\n\n`);
      event({ type: "start", messageId: `entry-fixture-${streams.length}` });
      event({ type: "start-step" });
      event({ type: "text-start", id: "text-1" });
      event({
        type: "text-delta",
        id: "text-1",
        delta: holdStream
          ? "Interrupted map remains."
          : "The map warmed in Mara's hands.",
      });
      if (!holdStream) {
        event({ type: "text-end", id: "text-1" });
        event({ type: "finish-step" });
        event({ type: "finish", finishReason: "stop" });
        record.finished = true;
        response.end("data: [DONE]\n\n");
      }
    } catch {
      fixtureServerErrors.push(
        "Synthetic fixture rejected a request; request details remain private",
      );
      response.destroy();
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const fixtureUrl = `http://127.0.0.1:${server.address().port}/chat`;
  let browser;
  let activePage;
  const capture = async (page, surface, name) => {
    await expect(surface).toBeVisible();
    await surface.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        surface.evaluate((element) => {
          for (let current = element; current; current = current.parentElement)
            if (Number(getComputedStyle(current).opacity) !== 1) return false;
          return true;
        }),
      )
      .toBe(true);
    const geometry = await surface.boundingBox();
    assert.ok(geometry && geometry.width > 0 && geometry.height > 0);
    const file = `${name}.png`;
    await page.screenshot({ path: path.join(output, file) });
    const record = {
      file,
      head,
      sourceHashes,
      sha256: digest(await fs.readFile(path.join(output, file))),
      geometry,
      fixture: true,
      realProviderCalls: 0,
      productionWrites: 0,
    };
    await fs.writeFile(
      path.join(output, `${name}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
    );
    receipt.captures.push(record);
  };
  try {
    browser = await chromium.launch({ headless: true });
    for (const mode of modes) {
      const context = await browser.newContext(mode);
      const page = await context.newPage();
      activePage = page;
      page.setDefaultTimeout(15000);
      receipt.currentMode = mode.name;
      let posts = 0;
      const errors = [];
      let urlLeak = false;
      let checkPrivateUrls = true;
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => {
        if (
          checkPrivateUrls &&
          (request.url().includes(encodeURIComponent(privateText)) ||
            request.url().includes("unfinished%20map"))
        )
          urlLeak = true;
      });
      await context.addInitScript((key) => {
        localStorage.setItem(
          "arcanea-provider-keys",
          JSON.stringify({ google: key }),
        );
        localStorage.setItem("arcanea-active-provider", "google");
        localStorage.setItem("arcanea-active-model", "arcanea-gemini-flash");
      }, fakeKey);
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== target.origin)
          return route.fulfill({ status: 200, json: {} });
        if (
          url.pathname === "/api/ai/chat" &&
          route.request().method() === "POST"
        ) {
          posts++;
          const body = route.request().postDataJSON();
          assert.equal(body.provider, "google");
          assert.equal(body.clientApiKey, fakeKey);
          assert.equal(body.gatewayModel, "arcanea-gemini-flash");
          assert.ok(JSON.stringify(body.messages).includes("Edited map draft"));
          return route.continue({ url: fixtureUrl });
        }
        if (url.pathname.startsWith("/api/"))
          return route.fulfill({ status: 200, json: {} });
        return route.continue();
      });
      await page.goto(base);
      const home = page.getByTestId("home-chat-entry");
      const entryInput = home.getByLabel("Describe what you want to create", {
        exact: true,
      });
      await expect(entryInput).toBeEnabled();
      await entryInput.fill(privateText);
      await composeEnter(entryInput);
      assert.equal(new URL(page.url()).pathname, "/");
      assert.equal(posts, 0);
      await entryInput.press("Shift+Enter");
      assert.ok((await entryInput.inputValue()).includes("\n"));
      await entryInput.fill(privateText);
      const opener = home.getByRole("button", {
        name: "Open draft in chat",
        exact: true,
      });
      await expect
        .poll(() =>
          entryInput.evaluate(
            (element) =>
              element.scrollTop === 0 &&
              element.scrollHeight <= element.clientHeight + 1,
          ),
        )
        .toBe(true);
      const size = await opener.boundingBox();
      assert.ok(
        size.height >= 44 && size.width >= 44,
        "Home action has a 44px touch target",
      );
      await opener.focus();
      await expect(opener).toBeFocused();
      await capture(page, home, `home-${mode.name}`);
      await opener.click();
      const input = page.getByLabel("Message input", { exact: true });
      await expect(input).toHaveValue(privateText);
      await expect
        .poll(() => new URL(page.url()).searchParams.has("draft"))
        .toBe(false);
      assert.equal(
        await page.evaluate((key) => sessionStorage.getItem(key), draftKey),
        null,
      );
      assert.equal(posts, 0, "Navigation never sends");
      assert.equal(
        urlLeak,
        false,
        "Typed draft stays out of navigation requests",
      );
      await expect(input).toBeFocused();
      const send = page.getByRole("button", {
        name: "Send message",
        exact: true,
      });
      const sendSize = await send.boundingBox();
      assert.ok(sendSize.height >= 44 && sendSize.width >= 44);
      if (mode.forcedColors === "active") {
        const paint = await send.evaluate((element) => ({
          background: getComputedStyle(element).backgroundColor,
          icon: getComputedStyle(element.querySelector("svg")).color,
          border: getComputedStyle(element).borderTopStyle,
        }));
        assert.notEqual(
          paint.icon,
          paint.background,
          "Forced-color send glyph remains visible",
        );
        assert.notEqual(paint.border, "none");
      }
      await capture(page, input, `chat-prefill-${mode.name}`);
      await composeEnter(input);
      assert.equal(posts, 0, "Chat composition Enter never sends");
      await expect(input).toHaveValue(privateText);
      await input.fill("Edited map draft");
      await page
        .getByRole("button", { name: "Send message", exact: true })
        .click();
      await expect(
        page.getByRole("log", { name: "Chat messages", exact: true }),
      ).toContainText("The map warmed in Mara's hands.");
      assert.equal(
        posts,
        1,
        "Explicit Send makes exactly one intercepted request",
      );
      holdStream = true;
      await input.fill("Edited map draft — stop sample");
      await send.click();
      const log = page.getByRole("log", { name: "Chat messages", exact: true });
      await expect(log).toContainText("Interrupted map remains.");
      const held = streams.at(-1);
      await page
        .getByRole("button", { name: "Stop generating", exact: true })
        .click();
      await expect(send).toBeVisible();
      await expect(input).toBeEnabled();
      await expect.poll(() => held.aborted).toBe(true);
      await expect(log).toContainText("Interrupted map remains.");
      assert.equal(
        posts,
        2,
        "Stop never regenerates or submits another request",
      );
      holdStream = false;
      await capture(page, input, `chat-stopped-${mode.name}`);
      await input.fill("Previous account draft");
      await identityChange(page);
      await expect(input).toHaveValue("");
      await expect(log).not.toContainText("Interrupted map remains.");
      await expect(log).not.toContainText("The map warmed in Mara's hands.");
      assert.equal(posts, 2, "Account change does not send");
      // Seed a public synthetic account-A record; this is a browser UI denial check, not real tenant proof.
      await page.evaluate(
        ({ key, id, owner }) =>
          sessionStorage.setItem(
            key,
            JSON.stringify({
              version: 1,
              id,
              owner,
              text: "Synthetic account-A scene",
              expiresAt: Date.now() + 600000,
            }),
          ),
        {
          key: draftKey,
          id: draftId,
          owner: "00000000-0000-4000-8000-000000000093",
        },
      );
      await page.goto(`${base}/chat?draft=${draftId}&keep=1#entry`);
      await expect(
        page
          .getByRole("alert")
          .filter({ hasText: "This draft belongs to another account" }),
      ).toBeVisible();
      await expect(input).toHaveValue("");
      assert.ok(
        await page.evaluate((key) => sessionStorage.getItem(key), draftKey),
      );
      assert.equal(new URL(page.url()).searchParams.get("keep"), "1");
      assert.equal(new URL(page.url()).hash, "#entry");
      assert.equal(posts, 2);
      await page
        .getByRole("button", { name: "Retry draft", exact: true })
        .click();
      await expect(input).toHaveValue("");
      await identityChange(page, "00000000-0000-4000-8000-000000000093");
      await page
        .getByRole("button", { name: "Retry draft", exact: true })
        .click();
      await expect(input).toHaveValue("Synthetic account-A scene");
      assert.equal(
        await page.evaluate((key) => sessionStorage.getItem(key), draftKey),
        null,
      );
      assert.equal(posts, 2, "Account recovery prefills without sending");
      checkPrivateUrls = false; // Old public URL compatibility is tested separately from the new typed-draft path.
      await page.goto(
        `${base}/chat?prompt=Legacy%20public%20scene&auto=1&keep=2`,
      );
      await expect(input).toHaveValue("Legacy public scene");
      assert.equal(new URL(page.url()).searchParams.get("keep"), "2");
      assert.equal(new URL(page.url()).searchParams.has("prompt"), false);
      assert.equal(new URL(page.url()).searchParams.has("auto"), false);
      assert.equal(posts, 2, "Legacy auto links only prefill");
      await page.goto(base);
      await expect(entryInput).toBeEnabled();
      await entryInput.fill("Recovery draft remains on home");
      await page.evaluate((key) => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (name, value) {
          if (name === key)
            throw new DOMException("Fixture quota", "QuotaExceededError");
          return original.call(this, name, value);
        };
      }, draftKey);
      await opener.click();
      await expect(home.getByRole("alert")).toContainText(
        "Your text is still here",
      );
      await expect(entryInput).toHaveValue("Recovery draft remains on home");
      assert.equal(new URL(page.url()).pathname, "/");
      const recoveryLink = home.getByRole("link", {
        name: "Open chat in a new tab",
        exact: true,
      });
      assert.equal(await recoveryLink.getAttribute("href"), "/chat");
      assert.equal(
        await recoveryLink.getAttribute("rel"),
        "noopener noreferrer",
      );
      await home
        .getByRole("button", { name: "Select draft", exact: true })
        .click();
      await expect(entryInput).toBeFocused();
      assert.equal(
        await entryInput.evaluate(
          (element) => element.selectionEnd - element.selectionStart,
        ),
        "Recovery draft remains on home".length,
      );
      await capture(page, home, `home-recovery-${mode.name}`);
      await identityChange(page);
      await expect(entryInput).toHaveValue("");
      assert.equal(posts, 2);
      assert.deepEqual(errors, []);
      const overflow = await home.evaluate(
        (element) => element.getBoundingClientRect().right > window.innerWidth,
      );
      assert.equal(overflow, false, "Entry stays within the viewport");
      receipt.modes.push({
        mode: mode.name,
        homeImeSafe: true,
        compactDraftOpeningVisible: true,
        sendTouchTargetAndPaint: true,
        stopAbortsWithoutReplacement: held.aborted && posts === 2,
        stoppedPartialReplyRetained: true,
        chatImeSafe: true,
        typedDraftUrlSafe: !urlLeak,
        prefillOnly: true,
        explicitSyntheticPosts: posts,
        accountComposerCleared: true,
        accountSessionCleared: true,
        wrongAccountDenied: true,
        rightAccountRetryRecovered: true,
        legacyAutoPrefillOnly: true,
        storageRecoveryPreserved: true,
        pageErrors: errors.length,
      });
      await context.close();
      activePage = null;
    }
    assert.deepEqual(fixtureServerErrors, []);
    receipt.fixtureServerErrors = fixtureServerErrors;
    receipt.state = "passed";
  } catch (error) {
    receipt.state = "failed";
    receipt.failures.push({ name: error.name, message: error.message });
    if (activePage)
      await activePage
        .screenshot({ path: path.join(output, "failure.png") })
        .catch(() => {});
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      receipt.cleanup.browserClosed = true;
    }
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    receipt.cleanup.streamServerClosed = true;
    await fs.writeFile(
      path.join(output, "verification.json"),
      `${JSON.stringify(receipt, null, 2)}\n`,
    );
  }
  console.log(
    `Verified four home-to-chat modes at ${head}; synthetic streams only.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
