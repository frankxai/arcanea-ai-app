const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const ts = require("typescript");
const { execFileSync } = require("node:child_process");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const base = process.env.COMPANION_TEST_BASE || "http://127.0.0.1:3001";
const output = path.resolve(
  process.env.COMPANION_TEST_OUTPUT || "screenshots/companion",
);
const repo = path.resolve(__dirname, "..");
const source = [
  "apps/web/components/lumina/lumina-bubble.tsx",
  "apps/web/components/lumina/companion-chat.tsx",
  "apps/web/components/chat/chat-area.tsx",
  "apps/web/components/chat/chat-notices.tsx",
  "apps/web/components/chat/chat-overlays.tsx",
  "apps/web/components/chat/chat-welcome.tsx",
  "apps/web/components/chat/chat-input-bar.tsx",
  "apps/web/components/chat/agent-header.tsx",
  "apps/web/app/chat/page.tsx",
  "apps/web/components/chat/chat-storage-status.tsx",
  "apps/web/components/chat/history-sidebar.tsx",
  "apps/web/components/chat/chat-layout.tsx",
  "apps/web/hooks/use-chat-sessions.ts",
  "apps/web/lib/chat/storage-scope.ts",
  "apps/web/lib/chat/local-store.ts",
  "apps/web/lib/chat/project-store.ts",
  "apps/web/lib/chat/cloud-snapshot.ts",
  "apps/web/lib/chat/supabase-store.ts",
  "apps/web/lib/chat/error-message.ts",
  "packages/design-system/src/companion.module.css",
  "packages/design-system/src/tokens.css",
  "packages/design-system/package.json",
  "scripts/verify-companion-browser.cjs",
  "scripts/tests/chat-error-message.test.cjs",
  "scripts/tests/companion-chat-instance.test.cjs",
  "scripts/tests/chat-stop-control.test.cjs",
  "scripts/tests/chat-account-storage.test.cjs",
  "scripts/tests/chat-cloud-persistence.test.cjs",
  "scripts/capture-sovereign-built-app.cjs",
  "scripts/verify-author-draft-browser.cjs",
  ".github/workflows/companion.yml",
  "planning-with-files/CURRENT_STATE_2026-10-11_CHAT_COMPANION.md",
  "apps/web/hooks/use-provider.ts",
  "apps/web/hooks/use-conversation.ts",
  "apps/web/lib/ai/provider-preferences.ts",
  "apps/web/lib/auth/context.tsx",
  "apps/web/lib/supabase/client.ts",
  "apps/web/app/api/ai/chat/route.ts",
  "apps/web/components/command-palette.tsx",
  "apps/web/components/worlds/WorldsOnboarding.tsx",
  "apps/web/package.json",
  "apps/web/app/chat/layout.tsx",
];
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
const digest = (data) => crypto.createHash("sha256").update(data).digest("hex");
const fakeKey = "companion-fixture-only-no-provider-access";

async function composerReadability(page) {
  const measurements = await page.evaluate(() => {
    const composer = document.querySelector("[data-chat-composer]");
    const header = document.querySelector("[data-chat-input-header]");
    if (!composer || !header) throw new Error("Compiled composer is missing");
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const pixel = () => [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
    const luminance = (rgb) =>
      rgb.reduce((sum, value, index) => {
        const channel = value / 255;
        return (
          sum +
          (channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4) *
            [0.2126, 0.7152, 0.0722][index]
        );
      }, 0);
    const measure = (element, label, minimum, pseudo) => {
      const ancestors = [];
      for (let node = element; node; node = node.parentElement)
        ancestors.push(node);
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = "white";
      context.fillRect(0, 0, 1, 1);
      for (const node of ancestors.reverse()) {
        context.fillStyle = getComputedStyle(node).backgroundColor;
        context.fillRect(0, 0, 1, 1);
      }
      const background = luminance(pixel());
      context.fillStyle = getComputedStyle(element, pseudo).color;
      context.fillRect(0, 0, 1, 1);
      const foreground = luminance(pixel());
      const rect = element.getBoundingClientRect();
      return {
        label,
        minimum,
        contrast:
          (Math.max(background, foreground) + 0.05) /
          (Math.min(background, foreground) + 0.05),
        width: rect.width,
        height: rect.height,
      };
    };
    const textarea = composer.querySelector("textarea");
    const result = [
      measure(textarea, "Message placeholder", 4.5, "::placeholder"),
    ];
    for (const button of header.querySelectorAll("button")) {
      if (button.getClientRects().length)
        result.push(
          measure(
            button,
            button.getAttribute("aria-label") || button.textContent.trim(),
            4.5,
          ),
        );
    }
    for (const button of composer.querySelectorAll("button:enabled")) {
      if (button.getClientRects().length)
        result.push(
          measure(
            button,
            button.getAttribute("aria-label") || button.textContent.trim(),
            3,
          ),
        );
    }
    const recovery = document.querySelector("[data-chat-storage-status]");
    if (recovery) {
      for (const label of recovery.querySelectorAll(
        '[role="alert"], [role="status"]',
      ))
        result.push(measure(label, "Conversation recovery message", 4.5));
      for (const button of recovery.querySelectorAll("button:enabled"))
        result.push(measure(button, button.textContent.trim(), 4.5));
    }
    return result;
  });
  for (const item of measurements) {
    assert.ok(
      item.contrast >= item.minimum,
      `${item.label}: ${item.contrast.toFixed(2)} contrast below ${item.minimum}`,
    );
    if (
      !["Message placeholder", "Conversation recovery message"].includes(
        item.label,
      )
    )
      assert.ok(
        item.width >= 44 && item.height >= 44,
        `${item.label}: composer touch target below 44px`,
      );
  }
  return measurements;
}

async function main() {
  const target = new URL(base);
  assert.ok(
    ["127.0.0.1", "localhost"].includes(target.hostname),
    "Synthetic fixture is restricted to an owned loopback build",
  );
  assert.equal(target.protocol, "http:");
  await fs.mkdir(output, { recursive: true });
  const head = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repo,
    encoding: "utf8",
  }).trim();
  if (process.env.COMPANION_EXPECTED_SHA)
    assert.equal(head, process.env.COMPANION_EXPECTED_SHA);
  const sourceHashes = Object.fromEntries(
    await Promise.all(
      source.map(async (file) => [
        file,
        digest(await fs.readFile(path.join(repo, file))),
      ]),
    ),
  );
  const preferences = {};
  vm.runInNewContext(
    ts.transpileModule(
      await fs.readFile(
        path.join(repo, "apps/web/lib/ai/provider-preferences.ts"),
        "utf8",
      ),
      {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
        },
      },
    ).outputText,
    { exports: preferences },
  );
  const guestStorageNames = preferences.providerStorageNames("guest");
  assert.ok(
    guestStorageNames,
    "Use the actual application's account storage contract.",
  );
  const receipt = {
    head,
    sourceHashes,
    environment:
      "compiled loopback app, intercepted provider stream and synthetic auth events",
    realProviderCalls: 0,
    productionWrites: 0,
    modes: [],
    captures: [],
    failures: [],
  };
  const capturePage = async (page, name) => {
    // A closing drawer can obscure a fully painted chat log. Verify its own
    // transitions; unrelated Worlds activity is outside this recovery gate.
    if (new URL(page.url()).pathname === "/chat") {
      const sidebar = page.getByLabel(/^(Chat sidebar|Sidebar)$/);
      await expect(sidebar).toHaveCount(1);
      await expect
        .poll(() =>
          sidebar.evaluate(
            (element) =>
              element
                .getAnimations({ subtree: true })
                .filter(
                  (animation) =>
                    Number.isFinite(
                      animation.effect?.getComputedTiming().iterations,
                    ) && animation.playState === "running",
                ).length,
          ),
        )
        .toBe(0);
      if (
        await page.evaluate(
          () => matchMedia("(prefers-reduced-motion: reduce)").matches,
        )
      )
        await expect(sidebar).toHaveCSS("transition-duration", "0s");
    }
    let recoveryGeometry;
    if (name.startsWith("full-chat-removal-") && !name.includes("recovered")) {
      const recovery = page.locator("[data-chat-storage-status]");
      await expect(recovery).toBeInViewport();
      const retry = recovery.getByRole("button");
      await expect(retry).toBeInViewport();
      await retry.click({ trial: true });
      recoveryGeometry = await recovery.evaluate((element) => {
        const targets = [
          ...element.querySelectorAll(
            '[role="alert"], [role="status"], button',
          ),
        ];
        return targets.map((target) => {
          const box = target.getBoundingClientRect();
          const points = [
            box.left + 2,
            box.left + box.width / 2,
            box.right - 2,
          ];
          return {
            text: target.textContent.trim(),
            width: box.width,
            height: box.height,
            unobscured: points.every((x) => {
              const hit = document.elementFromPoint(
                x,
                box.top + box.height / 2,
              );
              return hit === target || target.contains(hit);
            }),
          };
        });
      });
      assert.ok(
        recoveryGeometry.every((target) => target.unobscured),
        "Recovery text and retry must remain unobscured after history closes",
      );
    }
    const surface = name.startsWith("full-chat-")
      ? page.getByRole("log", { name: "Chat messages", exact: true })
      : page.getByRole("dialog", {
          name: name.startsWith("shortcuts-")
            ? "Keyboard shortcuts"
            : "Arcanea companion",
          exact: true,
        });
    await expect(surface).toBeVisible();
    await expect
      .poll(() =>
        surface.evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter(
                (animation) =>
                  Number.isFinite(
                    animation.effect?.getComputedTiming().iterations,
                  ) && animation.playState === "running",
              ).length,
        ),
      )
      .toBe(0);
    const surfaceGeometry = await surface.evaluate(async (element) => {
      await new Promise(requestAnimationFrame);
      const box = element.getBoundingClientRect();
      const ancestorOpacities = [];
      for (let current = element; current; current = current.parentElement)
        ancestorOpacities.push(Number(getComputedStyle(current).opacity));
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        ancestorOpacities,
      };
    });
    assert.ok(
      surfaceGeometry.width > 0 &&
        surfaceGeometry.height > 0 &&
        surfaceGeometry.ancestorOpacities.every((opacity) => opacity === 1),
      "Capture surface and its ancestors are fully painted",
    );
    const file = `${name}.png`;
    await page.screenshot({ path: path.join(output, file) });
    await expect(surface).toBeVisible();
    if (name.startsWith("shortcuts-")) {
      await expect(surface).toBeInViewport();
      await expect(
        surface.getByRole("button", { name: "Close", exact: true }),
      ).toBeFocused();
    }
    const capture = {
      file,
      sha256: digest(await fs.readFile(path.join(output, file))),
      head,
      sourceHashes,
      surfaceGeometry,
      recoveryGeometry,
      fixture: true,
      realProviderCalls: 0,
      productionWrites: 0,
    };
    await fs.writeFile(
      path.join(output, `${name}.json`),
      `${JSON.stringify(capture, null, 2)}\n`,
    );
    receipt.captures.push(capture);
  };
  let browser;
  let activePage;
  const streams = [];
  const fixtureServerErrors = [];
  let streamMode = "complete";
  const server = http.createServer(async (request, response) => {
    if (request.method !== "POST") {
      response.writeHead(405, { allow: "POST" });
      response.end();
      return;
    }
    try {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      // Assert credentials in memory only. Never put request bodies or keys in artifacts/logs.
      assert.equal(payload.provider, "google");
      assert.equal(payload.clientApiKey, fakeKey);
      assert.equal(payload.gatewayModel, "arcanea-gemini-flash");
      assert.ok(Array.isArray(payload.messages));
      const record = {
        mode: streamMode,
        aborted: false,
        finished: false,
        providerMatched: true,
        keyMatched: true,
        modelMatched: true,
      };
      streams.push(record);
      response.on("close", () => {
        if (!record.finished) record.aborted = true;
      });
      if (streamMode === "error") {
        record.finished = true;
        response.writeHead(503, { "content-type": "text/plain" });
        response.end("Synthetic provider failure: fixture-private-detail");
        return;
      }
      response.writeHead(200, {
        "content-type": "text/event-stream",
        "x-vercel-ai-ui-message-stream": "v1",
        "cache-control": "no-store",
      });
      const event = (value) =>
        response.write(`data: ${JSON.stringify(value)}\n\n`);
      event({ type: "start", messageId: `fixture-${streams.length}` });
      event({ type: "start-step" });
      event({ type: "text-start", id: "text-1" });
      if (streamMode !== "empty")
        event({
          type: "text-delta",
          id: "text-1",
          delta: "A door opens beneath the tide.",
        });
      record.finish = () => {
        if (response.destroyed) return;
        if (streamMode !== "empty")
          event({
            type: "text-delta",
            id: "text-1",
            delta: " Late fixture text.",
          });
        event({ type: "text-end", id: "text-1" });
        event({ type: "finish-step" });
        event({ type: "finish", finishReason: "stop" });
        record.finished = true;
        response.end("data: [DONE]\n\n");
      };
      if (streamMode === "complete" || streamMode === "empty") record.finish();
    } catch {
      fixtureServerErrors.push(
        "Fixture rejected a request; provider payloads remain private",
      );
      response.destroy();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const fixtureUrl = `http://127.0.0.1:${server.address().port}/chat`;
  try {
    browser = await chromium.launch({ headless: true });
    for (const mode of modes) {
      const context = await browser.newContext(mode);
      const page = await context.newPage();
      activePage = page;
      receipt.currentMode = mode.name;
      page.setDefaultTimeout(15000);
      const pageErrors = [];
      receipt.currentPageErrors = pageErrors;
      const errorLocations = [];
      receipt.currentErrorLocations = errorLocations;
      let phase = "worlds";
      page.on("pageerror", (error) => {
        pageErrors.push(error.message);
        errorLocations.push({
          phase,
          path: new URL(page.url()).pathname,
          message: error.message,
          stack: error.stack?.slice(0, 6000),
        });
      });
      receipt.failedRequests = [];
      page.on("requestfailed", (request) => {
        const url = new URL(request.url());
        receipt.failedRequests.push({
          origin: url.origin,
          path: url.pathname,
          error: request.failure()?.errorText,
        });
      });
      let requests = 0;
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin !== target.origin)
          return route.fulfill({ status: 200, json: {} });
        if (
          url.pathname === "/api/ai/chat" &&
          route.request().method() === "POST"
        ) {
          requests++;
          return route.continue({ url: fixtureUrl });
        }
        // This fixture never writes an app API. Auth is an isolated browser event, not a real login.
        if (
          url.pathname.startsWith("/api/") &&
          route.request().method() !== "GET"
        )
          return route.abort();
        return route.continue();
      });
      await page.goto(`${base}/worlds`);
      await page.getByRole("button", { name: "Skip", exact: true }).click();
      const opener = page.getByRole("button", {
        name: "Open Arcanea companion",
        exact: true,
      });
      await expect(opener).toBeVisible({ timeout: 15000 });
      await page.keyboard.press("Control+k");
      const commandPalette = page.getByRole("dialog", {
        name: "Command Palette",
        exact: true,
      });
      await expect(commandPalette).toBeVisible();
      await expect(commandPalette.getByRole("combobox")).toHaveCount(1);
      await expect(commandPalette.getByRole("combobox")).toBeVisible();
      await expect(
        page.getByRole("dialog", { name: "Arcanea companion" }),
      ).toBeHidden();
      await page.keyboard.press("Escape");
      await opener.click();
      const panel = page.getByRole("dialog", {
        name: "Arcanea companion",
        exact: true,
      });
      const input = panel.getByLabel("Your message", { exact: true });
      const log = panel.getByRole("log");
      await expect(input).toBeFocused();
      await panel
        .getByRole("button", {
          name: "Help me shape a character.",
          exact: true,
        })
        .click();
      assert.equal(requests, 0, "Starters must not start paid work");
      await input.fill("Keep this draft until I connect a key.");
      await panel.getByRole("button", { name: "Send", exact: true }).click();
      await expect(panel.getByRole("alert")).toContainText(
        "Connect your provider",
      );
      await expect(input).toHaveValue("Keep this draft until I connect a key.");
      await expect(
        panel.getByRole("link", {
          name: "Open provider settings",
          exact: true,
        }),
      ).toHaveAttribute("href", "/settings/providers");
      assert.equal(requests, 0);
      await page.evaluate(
        ({ key, names }) => {
          localStorage.setItem(names.keys, JSON.stringify({ google: key }));
          localStorage.setItem(names.provider, "google");
          localStorage.setItem(names.model, "arcanea-gemini-flash");
          window.dispatchEvent(new Event("arcanea-model-change"));
        },
        { key: fakeKey, names: guestStorageNames },
      );
      await expect(panel).toContainText("Gemini Flash");
      await input.dispatchEvent("keydown", {
        key: "Enter",
        code: "Enter",
        isComposing: true,
        bubbles: true,
      });
      assert.equal(requests, 0, "IME composition must not send");
      streamMode = "complete";
      await panel.locator("form").evaluate((form) => {
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
        form.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
      });
      await expect(log).toContainText(
        "A door opens beneath the tide. Late fixture text.",
      );
      await expect(
        panel.getByRole("button", { name: "Send", exact: true }),
      ).toBeVisible();
      assert.equal(requests, 1);
      await input.fill("A second thought, still unsent.");
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(opener).toBeFocused();
      await opener.click();
      await expect(input).toHaveValue("A second thought, still unsent.");
      await expect(log).toContainText("A door opens beneath the tide.");
      streamMode = "hold";
      await panel.getByRole("button", { name: "Send", exact: true }).click();
      await expect(log.locator("article").last()).toContainText(
        "A door opens beneath the tide.",
      );
      const stopRecord = streams.at(-1);
      await input.fill("Draft survives stopping.");
      await panel
        .getByRole("button", { name: "Stop response", exact: true })
        .click();
      await expect.poll(() => stopRecord.aborted).toBe(true);
      stopRecord.finish();
      await expect(log.locator("article").last()).toHaveText(
        "ArcaneaA door opens beneath the tide.",
      );
      await expect(input).toHaveValue("Draft survives stopping.");
      assert.equal(requests, 2, "Stopping must never submit an unsent draft");
      await expect(panel.getByRole("status")).toContainText("may charge");
      await panel.getByRole("button", { name: "Send", exact: true }).click();
      await expect(log.locator("article").last()).toContainText(
        "A door opens beneath the tide.",
      );
      const closeRecord = streams.at(-1);
      await input.fill("Draft survives closing.");
      await panel
        .getByRole("button", { name: "Close companion", exact: true })
        .click();
      await expect.poll(() => closeRecord.aborted).toBe(true);
      closeRecord.finish();
      await opener.click();
      await expect(input).toHaveValue("Draft survives closing.");
      await expect(log.locator("article").last()).not.toContainText(
        "Late fixture text",
      );
      streamMode = "error";
      await panel.getByRole("button", { name: "Send", exact: true }).click();
      await expect(panel.getByRole("alert")).toContainText(
        "Response interrupted",
      );
      await expect(panel).not.toContainText("fixture-private-detail");
      await panel
        .getByRole("button", { name: "Edit last message", exact: true })
        .click();
      await expect(input).toHaveValue("Draft survives closing.");
      const userCount = await log
        .locator("article")
        .filter({ hasText: /^You/ })
        .count();
      streamMode = "empty";
      await panel.getByRole("button", { name: "Send", exact: true }).click();
      await expect(panel.getByRole("alert")).toContainText("No text returned");
      assert.equal(
        await log.locator("article").filter({ hasText: /^You/ }).count(),
        userCount,
        "Editing a failed message replaces it instead of duplicating the turn",
      );
      await panel
        .getByRole("button", { name: "Edit last message", exact: true })
        .click();
      await expect(input).toHaveValue("Draft survives closing.");
      // Capture the useful working surface, not provider payloads or authentic account data.
      await capturePage(page, mode.name);
      const geometry = await panel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const controls = [...element.querySelectorAll("button,a,textarea")]
          .filter((control) => control.getClientRects().length)
          .map((control) => ({
            height: control.getBoundingClientRect().height,
            label:
              control.getAttribute("aria-label") || control.textContent?.trim(),
          }));
        return {
          x: rect.x,
          y: rect.y,
          right: rect.right,
          bottom: rect.bottom,
          width: innerWidth,
          height: innerHeight,
          controls,
          overflow: element.scrollWidth > element.clientWidth,
        };
      });
      assert.ok(
        geometry.x >= 0 &&
          geometry.y >= 0 &&
          geometry.right <= geometry.width &&
          geometry.bottom <= geometry.height,
      );
      assert.equal(geometry.overflow, false);
      assert.ok(
        geometry.controls.every((control) => control.height >= 44),
        "Every companion control must have a 44px target",
      );
      if (mode.reducedMotion === "reduce")
        assert.equal(
          await panel.evaluate(
            (element) => element.getAnimations({ subtree: true }).length,
          ),
          0,
        );
      if (mode.forcedColors === "active") {
        await input.focus();
        await expect(input).toHaveCSS("outline-style", "solid");
      }
      // Installed Supabase BroadcastChannel protocol exercises the actual AuthProvider.
      // This proves UI lifetime isolation, not production login, cookies or RLS.
      streamMode = "hold";
      await panel.getByRole("button", { name: "Send", exact: true }).click();
      await expect(log.locator("article").last()).toContainText(
        "A door opens beneath the tide.",
      );
      const identityRecord = streams.at(-1);
      await input.fill("Previous account draft.");
      await page.evaluate(() => {
        const channel = new BroadcastChannel("sb-placeholder-auth-token");
        channel.postMessage({
          event: "SIGNED_IN",
          session: {
            user: {
              id: "00000000-0000-4000-8000-000000000091",
              email: "companion-fixture@example.invalid",
              user_metadata: {},
            },
            access_token: "fixture-not-a-credential",
            token_type: "bearer",
            refresh_token: "fixture-not-a-credential",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          },
        });
        channel.close();
      });
      await expect(opener).toBeVisible();
      await expect.poll(() => identityRecord.aborted).toBe(true);
      identityRecord.finish();
      await opener.click();
      await expect(input).toHaveValue("");
      await expect(log).not.toContainText("A door opens");
      await expect(log).not.toContainText("Previous account");
      assert.deepEqual(
        pageErrors,
        [],
        "Worlds must render without page errors",
      );
      phase = "chat";
      await page.goto(`${base}/chat`);
      await expect(opener).toBeHidden();
      const fullChatHeading = page.getByRole("heading", { level: 1 });
      await expect(fullChatHeading).toBeVisible();
      await fullChatHeading.scrollIntoViewIfNeeded();
      await expect(fullChatHeading).toBeInViewport();
      await fullChatHeading.click();
      const starters = page.getByRole("list", { name: "Creative starters" });
      const starterButtons = starters.getByRole("button");
      await expect(starterButtons).toHaveCount(4);
      assert.ok(
        await starters.evaluate((element) =>
          [...element.querySelectorAll("button")].every(
            (button) =>
              getComputedStyle(button).opacity === "1" &&
              button.getAnimations().length === 0,
          ),
        ),
        "Creative starters are immediately readable without entrance animations",
      );
      const composerContrast = await composerReadability(page);
      await capturePage(page, `full-chat-${mode.name}`);
      const modelTrigger = page.getByRole("button", { name: /^Model: / });
      await modelTrigger.focus();
      await page.keyboard.press("Enter");
      const modelMenu = page.getByRole("menu", { name: "Choose a model" });
      await expect(modelMenu).toBeVisible();
      const modelChoices = modelMenu.getByRole("menuitemradio");
      assert.ok((await modelChoices.count()) > 0);
      await page.keyboard.press("Escape");
      await expect(modelMenu).toBeHidden();
      await expect(modelTrigger).toBeFocused();
      await modelTrigger.click();
      await modelChoices.first().click();
      await expect(modelMenu).toBeHidden();
      await expect(modelTrigger).toBeFocused();
      await starterButtons.first().focus();
      await page.keyboard.press("?");
      const shortcutsDialog = page.getByRole("dialog", {
        name: "Keyboard shortcuts",
      });
      const closeShortcuts = shortcutsDialog.getByRole("button", {
        name: "Close",
        exact: true,
      });
      await expect(closeShortcuts).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(closeShortcuts).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(closeShortcuts).toBeFocused();
      await expect(
        page.getByRole("heading", { name: "Keyboard shortcuts", exact: true }),
      ).toBeVisible();
      await expect(shortcutsDialog).toBeInViewport();
      await closeShortcuts.click({ trial: true });
      await capturePage(page, `shortcuts-${mode.name}`);
      await page.keyboard.press("Escape");
      await expect(shortcutsDialog).toBeHidden();
      await expect(starterButtons.first()).toBeFocused();
      // Seed only disposable guest data. Refuse the intent write, then recover
      // through the actual rendered sidebar and hook; no customer or cloud write.
      await page.evaluate(() => {
        localStorage.setItem(
          "arcanea_chat_sessions:v2:guest",
          JSON.stringify([
            {
              id: "00000000-0000-4000-8000-000000000093",
              title: "Removal recovery fixture",
              messages: [
                {
                  id: "remove-original",
                  role: "user",
                  content: "Keep this original until removal intent is stored.",
                },
              ],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              cloudDirty: true,
            },
          ]),
        );
        localStorage.setItem("arcanea-sidebar-expanded", "false");
      });
      await page.reload();
      await expect(fullChatHeading).toBeVisible();
      await page.evaluate(() => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (key.startsWith("arcanea_chat_deletion:"))
            throw new DOMException(
              "Fixture storage refusal",
              "QuotaExceededError",
            );
          return original.call(this, key, value);
        };
        window.restoreRemovalFixtureStorage = () => {
          Storage.prototype.setItem = original;
        };
      });
      await page
        .getByRole("button", {
          name: mode.viewport.width < 768 ? "Toggle sidebar" : "Show history",
          exact: true,
        })
        .click();
      const removeFixture = page.getByRole("button", {
        name: "Delete: Removal recovery fixture",
        exact: true,
      });
      await removeFixture.click();
      await page
        .getByRole("button", { name: "Confirm delete", exact: true })
        .click();
      await expect(removeFixture).toBeVisible();
      assert.equal(
        await page.evaluate(
          () =>
            JSON.parse(
              localStorage.getItem("arcanea_chat_sessions:v2:guest"),
            )[0].messages[0].content,
        ),
        "Keep this original until removal intent is stored.",
      );
      await page
        .getByRole("button", { name: "Collapse sidebar", exact: true })
        .click();
      const removalAlert = page
        .getByRole("alert")
        .filter({ hasText: "Couldn’t remove a conversation. Try again." });
      await expect(removalAlert).toBeVisible();
      const retryRemoval = page.getByRole("button", {
        name: "Retry removal",
        exact: true,
      });
      await retryRemoval.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      await expect(retryRemoval).toBeFocused();
      await expect(retryRemoval).toHaveCSS("outline-style", "solid");
      const removalContrast = await composerReadability(page);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await capturePage(page, `full-chat-removal-failed-${mode.name}`);
      // Reopen the preserved original before retrying. Successful removal must
      // clear this active editor rather than leave messages under a fresh ID.
      await page
        .getByRole("button", {
          name: mode.viewport.width < 768 ? "Toggle sidebar" : "Show history",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", { name: /^Removal recovery fixture/ })
        .click();
      const fullChatLog = page.getByRole("log", {
        name: "Chat messages",
        exact: true,
      });
      await expect(fullChatLog).toContainText(
        "Keep this original until removal intent is stored.",
      );
      const collapseHistory = page.getByRole("button", {
        name: "Collapse sidebar",
        exact: true,
      });
      if (await collapseHistory.isVisible()) await collapseHistory.click();
      await retryRemoval.focus();
      await page.evaluate(() => window.restoreRemovalFixtureStorage());
      await page.keyboard.press("Enter");
      await expect(removalAlert).toBeHidden();
      await expect(page.locator("[data-chat-composer] textarea")).toBeFocused();
      await expect(fullChatLog).not.toContainText(
        "Keep this original until removal intent is stored.",
      );
      assert.equal(
        await page.evaluate(() =>
          localStorage.getItem(
            "arcanea_chat_deletion:v2:guest:00000000-0000-4000-8000-000000000093",
          ),
        ),
        "confirmed",
      );
      assert.deepEqual(
        await page.evaluate(() =>
          JSON.parse(localStorage.getItem("arcanea_chat_sessions:v2:guest")),
        ),
        [],
      );
      await capturePage(page, `full-chat-removal-recovered-${mode.name}`);
      // A disposable synthetic account owns this pending intent. The intercepted
      // unavailable auth/cloud response must leave it pending and retryable.
      await page.evaluate(() => {
        const actor = "user:00000000-0000-4000-8000-000000000091";
        localStorage.setItem(
          `arcanea_chat_deletion:v2:${encodeURIComponent(actor)}:00000000-0000-4000-8000-000000000094`,
          "pending",
        );
        const channel = new BroadcastChannel("sb-placeholder-auth-token");
        channel.postMessage({
          event: "SIGNED_IN",
          session: {
            user: {
              id: "00000000-0000-4000-8000-000000000091",
              email: "companion-fixture@example.invalid",
              user_metadata: {},
            },
            access_token: "fixture-not-a-credential",
            token_type: "bearer",
            refresh_token: "fixture-not-a-credential",
            expires_at: Math.floor(Date.now() / 1000) + 3600,
          },
        });
        channel.close();
      });
      const pendingRemoval = page
        .getByRole("status")
        .filter({ hasText: "1 conversation removal is waiting to sync." });
      await expect(pendingRemoval).toBeVisible();
      const retryRemovalSync = page.getByRole("button", {
        name: "Retry removal sync",
        exact: true,
      });
      await retryRemovalSync.focus();
      await page.keyboard.press("Enter");
      await expect(retryRemovalSync).toBeEnabled();
      await expect(pendingRemoval).toBeVisible();
      assert.equal(
        await page.evaluate(() =>
          localStorage.getItem(
            "arcanea_chat_deletion:v2:user%3A00000000-0000-4000-8000-000000000091:00000000-0000-4000-8000-000000000094",
          ),
        ),
        "pending",
      );
      const pendingRemovalContrast = await composerReadability(page);
      await capturePage(page, `full-chat-removal-pending-${mode.name}`);
      await page.evaluate(() => {
        const channel = new BroadcastChannel("sb-placeholder-auth-token");
        channel.postMessage({ event: "SIGNED_OUT", session: null });
        channel.close();
      });
      await expect(pendingRemoval).toBeHidden();
      assert.deepEqual(pageErrors, [], "Chat must render without page errors");
      phase = "home";
      await page.goto(base);
      await expect(opener).toBeHidden();
      assert.deepEqual(pageErrors, []);
      receipt.modes.push({
        name: mode.name,
        requests,
        missingKeyDenied: true,
        starterExplicit: true,
        imeDidNotSend: true,
        sdkStream: true,
        stopAborted: stopRecord.aborted,
        closeAborted: closeRecord.aborted,
        identityEventAborted: identityRecord.aborted,
        identityCleared: true,
        draftPreserved: true,
        composerContrast,
        modelMenuKeyboardRecovery: true,
        noRawProviderError: true,
        shortcutSingleOwner: true,
        keyboardFocus: true,
        fullChatHeadingVisible: true,
        shortcutsHeadingVisible: true,
        shortcutsFocusContainedAndRestored: true,
        startersImmediatelyReadable: true,
        removalRefusalVisibleAndOriginalRetained: true,
        removalKeyboardRetryAndComposerFocus: true,
        removalIntentConfirmedAndCacheRemoved: true,
        removedActiveConversationCleared: true,
        recoveryControlsUnobscured: true,
        reducedMotionSidebar: mode.reducedMotion === "reduce",
        removalContrast,
        pendingRemovalVisibleAndUnavailableRetryRetained: true,
        pendingRemovalRetiredOnSignOut: true,
        pendingRemovalContrast,
        geometry,
        pageErrors,
        errorLocations,
      });
      await context.close();
    }
    assert.deepEqual(fixtureServerErrors, []);
    console.log(
      JSON.stringify({
        head,
        modes: receipt.modes.map((mode) => mode.name),
        realProviderCalls: 0,
        productionWrites: 0,
      }),
    );
  } catch (error) {
    receipt.failures.push({ message: error.message });
    if (activePage && !activePage.isClosed()) {
      const url = new URL(activePage.url());
      receipt.failedPage = { origin: url.origin, path: url.pathname };
      const file = `failed-${receipt.currentMode}.png`;
      await activePage.screenshot({ path: path.join(output, file) });
      const capture = {
        file,
        sha256: digest(await fs.readFile(path.join(output, file))),
        head,
        sourceHashes,
        fixture: true,
        failed: true,
        realProviderCalls: 0,
        productionWrites: 0,
      };
      receipt.captures.push(capture);
      await fs.writeFile(
        path.join(output, `failed-${receipt.currentMode}.json`),
        `${JSON.stringify(capture, null, 2)}\n`,
      );
    }
    throw error;
  } finally {
    for (const record of streams) delete record.finish;
    receipt.streams = streams;
    receipt.fixtureServerErrors = fixtureServerErrors;
    receipt.cleanup = {
      attempted: true,
      browserClosed: false,
      streamServerClosed: false,
      errors: [],
    };
    try {
      if (browser) await browser.close();
      receipt.cleanup.browserClosed = true;
    } catch (error) {
      receipt.cleanup.errors.push(error.message);
    }
    try {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      receipt.cleanup.streamServerClosed = true;
    } catch (error) {
      receipt.cleanup.errors.push(error.message);
    }
    await fs.writeFile(
      path.join(output, "receipt.json"),
      `${JSON.stringify(receipt, null, 2)}\n`,
    );
    if (receipt.cleanup.errors.length)
      throw new Error("Owned companion fixture cleanup failed");
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
