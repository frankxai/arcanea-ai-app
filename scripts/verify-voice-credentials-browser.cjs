const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");
const base = process.env.VOICE_TEST_BASE_URL || "http://localhost:3001";

// Exercise the compiled controls with synthetic capture and intercepted transport.
// This never requests a real microphone or tests provider audio quality.
async function installCaptureFixture(context) {
  await context.addInitScript(() => {
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;
    Object.defineProperty(navigator.mediaDevices, "getUserMedia", {
      configurable: true,
      value: async () => new MediaStream(),
    });
    class CaptureContext {
      state = "running";
      sampleRate = 48000;
      createMediaStreamSource() {
        return { connect() {}, disconnect() {} };
      }
      createAnalyser() {
        return {
          frequencyBinCount: 32,
          fftSize: 64,
          smoothingTimeConstant: 0.8,
          getByteFrequencyData(data) {
            data.fill(8);
          },
          getFloatTimeDomainData(data) {
            data.fill(0.1);
          },
          disconnect() {},
        };
      }
      async resume() {
        this.state = "running";
      }
      async close() {
        this.state = "closed";
      }
    }
    window.AudioContext = CaptureContext;
    window.webkitAudioContext = CaptureContext;
    window.MediaRecorder = class {
      static isTypeSupported() {
        return true;
      }
      state = "inactive";
      ondataavailable = null;
      onstop = null;
      constructor(_stream, options) {
        this.mimeType = options.mimeType;
      }
      start() {
        this.state = "recording";
      }
      stop() {
        if (this.state === "inactive") return;
        this.state = "inactive";
        this.ondataavailable?.({
          data: new Blob([new Uint8Array(5000)], { type: this.mimeType }),
        });
        queueMicrotask(() => this.onstop?.());
      }
    };
  });
}

async function checkReentrantActivation(page, button, input = "/api/ai/speak") {
  await button.evaluate((element, endpoint) => {
    const originalFetch = window.fetch;
    window.__reentrantStarts = 0;
    window.__reentrantAborts = 0;
    let reentered = false;
    window.fetch = function (request, init) {
      if (request === endpoint) {
        window.__reentrantStarts++;
        init.signal.addEventListener(
          "abort",
          () => window.__reentrantAborts++,
          { once: true },
        );
        if (!reentered) {
          reentered = true;
          element.click();
        }
      }
      return originalFetch.call(this, request, init);
    };
  }, input);
  await button.click();
  await expect
    .poll(() => page.evaluate(() => window.__reentrantStarts))
    .toBe(1);
  assert.equal(await page.evaluate(() => window.__reentrantAborts), 1);
  await expect(button).toBeVisible();
}

async function verifyChatRecovery(browser, mode) {
  const context = await browser.newContext({
    viewport: { width: mode.width, height: mode.height },
    reducedMotion: mode.motion,
  });
  await installCaptureFixture(context);
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    let chatPosts = 0;
    let transcriptionStatus = 401;
    const transcriptions = [];
    await page.route("**/api/ai/chat", async (route) => {
      if (route.request().method() === "POST") chatPosts++;
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Customer key required." }),
      });
    });
    await page.route("**/api/ai/transcribe", async (route) => {
      transcriptions.push(route.request().headers()["x-groq-key"]);
      await route.fulfill({
        status: transcriptionStatus,
        contentType: "application/json",
        body: JSON.stringify({
          error:
            transcriptionStatus === 400
              ? "Check your voice key in Settings."
              : "private-upstream-fixture",
          cta: "byok",
        }),
      });
    });
    await page.route("**/api/ai/speak", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "private-upstream-fixture" }),
      }),
    );
    await page.addInitScript(() => {
      localStorage.setItem(
        "arcanea-provider-keys",
        JSON.stringify({ groq: "test-customer-groq" }),
      );
      localStorage.setItem(
        "arcanea_chat_sessions",
        JSON.stringify([
          {
            id: "voice-recovery-fixture",
            title: "Voice recovery fixture",
            createdAt: "2026-10-10T00:00:00.000Z",
            updatedAt: "2026-10-10T00:00:00.000Z",
            messages: [
              {
                id: "fixture-response",
                role: "assistant",
                content:
                  "The keeper folds the chart and turns toward the lighthouse.",
                createdAt: "2026-10-10T00:00:00.000Z",
              },
            ],
          },
        ]),
      );
    });
    assert.equal(
      (
        await page.goto(base + "/chat", { waitUntil: "domcontentloaded" })
      ).status(),
      200,
    );
    const input = page.getByRole("textbox", {
      name: "Message input",
      exact: true,
    });
    await expect(input).toBeVisible({ timeout: 30000 });
    const originalDraft = "  Keep this draft\nwith its spacing.  ";
    const inputAlert = page.getByRole("alert", {
      name: "Voice input",
      exact: true,
    });
    for (const status of [401, 400, 502]) {
      transcriptionStatus = status;
      await input.fill(originalDraft);
      await page
        .getByRole("button", { name: "Voice input (auto-send)", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Stop recording", exact: true })
        .click();
      await expect(inputAlert).toBeVisible();
      await expect(input).toHaveValue(originalDraft);
      await expect(
        inputAlert.getByRole("link", {
          name: "Provider settings",
          exact: true,
        }),
      ).toHaveAttribute("href", "/settings/providers");
      assert.ok(
        !(await inputAlert.innerText()).includes("private-upstream-fixture"),
      );
      await inputAlert
        .getByRole("button", { name: "Dismiss voice input error", exact: true })
        .click();
    }
    assert.equal(
      chatPosts,
      0,
      "An unrecognized recording must not auto-send a typed draft",
    );
    assert.deepEqual(transcriptions, [
      "test-customer-groq",
      "test-customer-groq",
      "test-customer-groq",
    ]);
    await input.fill("");
    await page
      .getByRole("button", {
        name: "Continue: Voice recovery fixture",
        exact: true,
      })
      .click();
    const read = page.getByRole("button", { name: "Read aloud", exact: true });
    await expect(read).toHaveCount(1);
    await checkReentrantActivation(page, read);
    const playbackAlert = page.getByRole("alert", {
      name: "Voice playback",
      exact: true,
    });
    await expect(playbackAlert).toHaveCount(0);
    await read.click();
    await expect(playbackAlert).toBeVisible();
    await input.focus();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    assert.ok(
      await playbackAlert.evaluate((element) => {
        for (
          let ancestor = element;
          ancestor;
          ancestor = ancestor.parentElement
        ) {
          if (Number(getComputedStyle(ancestor).opacity) < 0.99) return false;
        }
        return true;
      }),
      "Playback recovery must stay visible outside message hover controls",
    );
    await expect(
      playbackAlert.getByRole("link", {
        name: "Provider settings",
        exact: true,
      }),
    ).toHaveAttribute("href", "/settings/providers");
    assert.deepEqual(errors, []);
    return {
      draftPreserved: true,
      noSilentTranscription: true,
      noDraftAutoSend: true,
      messageReentrantCancel: true,
      messageErrorVisibleWithoutHover: true,
      providerRequests: 0,
    };
  } finally {
    await context.close();
  }
}

async function verifyRoomRecovery(browser, mode) {
  const context = await browser.newContext({
    viewport: { width: mode.width, height: mode.height },
    reducedMotion: mode.motion,
  });
  await installCaptureFixture(context);
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() =>
      localStorage.setItem("arcanea-voice-groq-key", "test-customer-groq"),
    );
    const reply =
      "The lighthouse keeper carefully unfolds the chart, marks the shoals, and returns to the signal room. ".repeat(
        4,
      );
    await page.route(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/plain",
          body: "Read my lighthouse scene.",
        }),
    );
    await page.route(
      "https://api.groq.com/openai/v1/chat/completions",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ choices: [{ message: { content: reply } }] }),
        }),
    );
    const speechRequests = [];
    await page.route("**/api/ai/speak", async (route) => {
      speechRequests.push(route.request().postDataJSON());
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Connect OpenAI in Settings to read this longer response.",
          cta: "byok",
        }),
      });
    });
    assert.equal(
      (
        await page.goto(base + "/room/jarvis", {
          waitUntil: "domcontentloaded",
        })
      ).status(),
      200,
    );
    await page
      .getByRole("button", { name: "Mute microphone (press M)", exact: true })
      .waitFor({ timeout: 30000 });
    await page.keyboard.down("Space");
    await page.waitForTimeout(650);
    await page.keyboard.up("Space");
    const alert = page.getByRole("alert", { name: "Voice room", exact: true });
    await expect(alert).toContainText("Connect OpenAI");
    await page.waitForTimeout(5200);
    await expect(alert).toBeVisible();
    await expect(
      alert.getByRole("link", { name: "Provider settings", exact: true }),
    ).toHaveAttribute("href", "/settings/providers");
    assert.equal(speechRequests.length, 1);
    assert.equal(speechRequests[0].text, reply.trim());
    assert.deepEqual(errors, []);
    return {
      roomStickySettingsRecovery: true,
      fullRoomReplyPreserved: true,
      providerRequests: 0,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  const evidence = [];
  try {
    for (const mode of [
      { name: "desktop", width: 1440, height: 900, motion: "no-preference" },
      { name: "mobile", width: 375, height: 812, motion: "no-preference" },
      { name: "reduced-motion", width: 375, height: 812, motion: "reduce" },
    ]) {
      const context = await browser.newContext({
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.motion,
      });
      let releasePending;
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        await page.addInitScript(() => {
          const originalFetch = window.fetch;
          window.__voiceRequestAborts = 0;
          window.fetch = function (input, init) {
            if (input === "/api/ai/speak") {
              init?.signal?.addEventListener(
                "abort",
                () => window.__voiceRequestAborts++,
                { once: true },
              );
            }
            return originalFetch.call(this, input, init);
          };
        });
        const voiceAlert = page.getByRole("alert", {
          name: "Voice playback",
          exact: true,
        });
        const errors = [];
        const requests = [];
        page.on("pageerror", (error) => errors.push(error.message));
        let pending = false;
        await page.route("**/api/ai/speak", async (route) => {
          const request = route.request();
          requests.push({
            keys: {
              groq: request.headers()["x-groq-key"],
              openai: request.headers()["x-openai-key"],
              anthropic: request.headers()["x-anthropic-key"],
            },
            body: request.postDataJSON(),
          });
          if (pending) {
            await new Promise((resolve) => {
              releasePending = resolve;
            });
            await route.abort().catch(() => {});
            return;
          }
          await route.fulfill({
            status: requests.length === 1 ? 401 : 502,
            contentType: "application/json",
            body: JSON.stringify({
              error: "Voice provider request failed.",
              cta: requests.length === 1 ? "byok" : "retry",
            }),
          });
        });
        const response = await page.goto(base + "/voice", {
          waitUntil: "domcontentloaded",
        });
        assert.equal(response.status(), 200);
        assert.equal(
          await page.locator("button button").count(),
          0,
          "Voice controls must not nest interactive buttons",
        );
        const listen = page.getByRole("button", {
          name: "Listen to Lumina",
          exact: true,
        });
        const box = await listen.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44);
        await listen.focus();
        await page.keyboard.press("Enter");
        await expect(voiceAlert).toContainText("Settings");
        await expect(
          voiceAlert.getByRole("link", {
            name: "Provider settings",
            exact: true,
          }),
        ).toHaveAttribute("href", "/settings/providers");
        assert.deepEqual(requests[0].keys, {
          groq: undefined,
          openai: undefined,
          anthropic: undefined,
        });
        await page.evaluate(() =>
          localStorage.setItem(
            "arcanea-provider-keys",
            JSON.stringify({
              groq: "test-customer-groq",
              openai: "sk-test-key",
              anthropic: "sk-ant-test",
            }),
          ),
        );
        await listen.click();
        await expect(voiceAlert).toContainText("Voice provider request failed");
        assert.deepEqual(requests[1].keys, {
          groq: "test-customer-groq",
          openai: "sk-test-key",
          anthropic: undefined,
        });
        pending = true;
        await listen.click();
        await expect(voiceAlert).toHaveCount(0);
        await expect.poll(() => requests.length).toBe(3);
        assert.equal(typeof releasePending, "function");
        const stop = page
          .getByRole("group", { name: "Lumina voice", exact: true })
          .getByRole("button", { name: "Stop voice playback", exact: true });
        const stopBox = await stop.boundingBox();
        assert.ok(stopBox && stopBox.width >= 44 && stopBox.height >= 44);
        await stop.click();
        assert.equal(await page.evaluate(() => window.__voiceRequestAborts), 1);
        releasePending();
        await page.waitForTimeout(500);
        await expect(voiceAlert).toHaveCount(0);
        await expect(listen).toBeVisible();
        assert.equal(
          requests.length,
          3,
          "Stopping a pending voice request must not start another",
        );
        pending = false;
        await checkReentrantActivation(page, listen);
        await expect(voiceAlert).toHaveCount(0);
        await page
          .getByRole("button", { name: "Select Draconia", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "Select Draconia", exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
          "Voice page must retain mobile reflow",
        );
        assert.deepEqual(errors, []);
        evidence.push({
          mode: mode.name,
          keyboardRecovery: true,
          touchTarget: true,
          customerKeySelection: true,
          pendingCancel: true,
          reentrantCancel: true,
          providerRequests: 0,
        });
      } finally {
        releasePending?.();
        await context.close();
      }
      evidence.push({
        mode: mode.name,
        ...(await verifyChatRecovery(browser, mode)),
        ...(await verifyRoomRecovery(browser, mode)),
      });
    }
  } finally {
    await browser.close();
  }
  await fs.mkdir("screenshots", { recursive: true });
  await fs.writeFile(
    "screenshots/voice-credentials-behavior.json",
    JSON.stringify(
      { sourceCommit: process.env.GITHUB_SHA || null, evidence },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ evidence }));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
