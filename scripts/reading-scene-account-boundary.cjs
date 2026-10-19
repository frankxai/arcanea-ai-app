const assert = require("node:assert/strict");

function sceneRedactor(config) {
  // Keep fixture passwords, session JWTs and anonymous keys out of receipts.
  return (value) =>
    [config.anon, ...config.accounts.map((account) => account.password)]
      .reduce(
        (text, credential) => text.split(credential).join("[redacted]"),
        String(value),
      )
      .replace(
        /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
        "[redacted-jwt]",
      );
}

async function installSceneAccountBoundary(context, secondId) {
  await context.addInitScript(
    ({ secondId }) => {
      window.__readingSceneAccountBoundary = {
        armed: false,
        label: "",
        attempts: 0,
        connected: false,
        enabled: false,
        clickObserved: false,
        synchronousRecoveryWrites: 0,
        insideBoundary: false,
        holdNotification: false,
        heldNotifications: [],
      };
      const nativeSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (name, value) {
        const state = window.__readingSceneAccountBoundary;
        if (state.insideBoundary && name.startsWith("arcanea:reading-scene:"))
          state.synchronousRecoveryWrites++;
        return nativeSet.call(this, name, value);
      };
      const NativeChannel = window.BroadcastChannel;
      // Keep the actual SDK listener and real password session. Insert one browser
      // click after the listener runs, while the previous button is connected.
      window.BroadcastChannel = class extends NativeChannel {
        wrappedListeners = new WeakMap();
        addEventListener(type, listener, options) {
          if (
            type !== "message" ||
            !listener ||
            !/^sb-.*-auth-token$/.test(this.name)
          )
            return super.addEventListener(type, listener, options);
          let wrapped = this.wrappedListeners.get(listener);
          if (!wrapped) {
            wrapped = (event) => {
              const state = window.__readingSceneAccountBoundary;
              if (
                state.holdNotification &&
                event.data?.session?.user?.id === secondId
              ) {
                // Delay only this fixture tab's actual SDK notification; the
                // second tab's real login cookie has already been delivered.
                state.heldNotifications.push(() =>
                  typeof listener === "function"
                    ? listener.call(this, event)
                    : listener.handleEvent(event),
                );
                return;
              }
              const oldButton =
                state.armed &&
                event.data?.event === "SIGNED_IN" &&
                event.data?.session?.user?.id === secondId
                  ? [...document.querySelectorAll("button")].find(
                      (button) => button.textContent.trim() === state.label,
                    )
                  : null;
              const returned =
                typeof listener === "function"
                  ? listener.call(this, event)
                  : listener.handleEvent(event);
              if (oldButton) {
                state.armed = false;
                state.connected = oldButton.isConnected;
                state.enabled = !oldButton.disabled;
                oldButton.addEventListener(
                  "click",
                  () => {
                    state.clickObserved = true;
                  },
                  { once: true },
                );
                state.attempts++;
                state.insideBoundary = true;
                try {
                  oldButton.click();
                } finally {
                  state.insideBoundary = false;
                }
              }
              return returned;
            };
            this.wrappedListeners.set(listener, wrapped);
          }
          return super.addEventListener(type, wrapped, options);
        }
        removeEventListener(type, listener, options) {
          return super.removeEventListener(
            type,
            this.wrappedListeners.get(listener) || listener,
            options,
          );
        }
      };
    },
    { secondId },
  );
}

async function readSceneDiagnostics(page) {
  if (!page) return null;
  return page.evaluate(() => {
    const selection = getSelection();
    const anchor = selection?.anchorNode;
    const element =
      anchor?.nodeType === Node.ELEMENT_NODE ? anchor : anchor?.parentElement;
    return {
      selectionCollapsed: selection?.isCollapsed,
      selectionLength: selection?.toString().length,
      selectionInChapter: Boolean(element?.closest("article .prose")),
      anchorConnected: anchor?.isConnected,
      actions: [...document.querySelectorAll("button")]
        .filter((button) =>
          /^Visualize (a passage|selection)$/.test(button.textContent.trim()),
        )
        .map((button) => ({
          label: button.textContent.trim(),
          disabled: button.disabled,
        })),
    };
  });
}

function observeSceneConsole(context, onError) {
  context.on("page", (tab) =>
    tab.on("console", (message) => {
      if (message.type() === "error") onError(message.text());
    }),
  );
}

async function selectScenePassage(prose) {
  return prose.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selected = getSelection();
    selected.removeAllRanges();
    selected.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
    return {
      collapsed: selected.isCollapsed,
      length: selected.toString().length,
    };
  });
}

async function verifyCookieActorBoundary({
  makeContext,
  login,
  accounts,
  base,
  chapter,
  png,
  expect,
  clients,
  onPage,
}) {
  const checks = [];
  for (const action of ["Generate scene", "Save private creation"]) {
    const context = await makeContext();
    const page = await context.newPage();
    onPage(page);
    page.setDefaultTimeout(20000);
    await login(page, accounts[0]);
    await expect(
      page.getByRole("button", { name: "Reopen scene", exact: true }),
    ).toBeVisible();
    assert.equal(
      (await selectScenePassage(page.locator("article .prose p").first()))
        .collapsed,
      false,
    );
    await page
      .getByRole("button", { name: "Visualize selection", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Replace with selected passage",
        exact: true,
      })
      .click();
    if (action === "Save private creation") {
      await page.route("**/api/imagine/generate", async (route) => {
        const request = route.request().postDataJSON();
        await route.fulfill({
          json: {
            generationId: `gen_${request.requestKey}`,
            status: "completed",
            provider: "openrouter",
            model: request.model,
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
      await page.unroute("**/api/imagine/generate");
    }
    await expect(
      page.getByRole("button", { name: action, exact: true }),
    ).toBeEnabled();
    await page.evaluate(() => {
      window.__readingSceneAccountBoundary.holdNotification = true;
    });
    const loginPage = await context.newPage();
    await context.clearCookies();
    await page.evaluate(() => {
      for (const name of Object.keys(localStorage))
        if (/^sb-.*-auth-token$/.test(name)) localStorage.removeItem(name);
    });
    await login(loginPage, accounts[1]);
    await page.waitForFunction(
      () => window.__readingSceneAccountBoundary.heldNotifications.length > 0,
    );
    // A still displays its unsaved scene, while actual SSR Auth now reads B.
    const privateRead = await context.request.get(
      `${base}/api/reading-scenes?path=${encodeURIComponent(chapter)}`,
    );
    assert.equal(privateRead.status(), 200);
    assert.equal((await privateRead.json()).scene, null);
    const endpoint =
      action === "Generate scene"
        ? "/api/imagine/generate"
        : "/api/reading-scenes";
    const pending = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === endpoint &&
        response.request().method() === "POST",
    );
    await page.getByRole("button", { name: action, exact: true }).click();
    const response = await pending;
    const request = response.request().postDataJSON();
    assert.equal(request.expectedActor, accounts[0].id);
    assert.equal(response.status(), 403);
    assert.equal((await response.json()).reason, "account_changed");
    for (const client of clients) {
      const rows = await client
        .from("creations")
        .select("id")
        .eq("id", request.requestKey);
      assert.equal(rows.error, null);
      assert.deepEqual(rows.data, []);
    }
    await page.evaluate(() => {
      const state = window.__readingSceneAccountBoundary;
      state.holdNotification = false;
      for (const notify of state.heldNotifications.splice(0)) void notify();
    });
    await expect(
      page.getByRole("button", { name: "Reopen scene", exact: true }),
    ).toHaveCount(0);
    checks.push({
      action,
      status: response.status(),
      oldActorAsserted: true,
      notificationDelayed: true,
      privateRows: 0,
    });
    await context.close();
  }
  return checks;
}

module.exports = {
  installSceneAccountBoundary,
  readSceneDiagnostics,
  observeSceneConsole,
  selectScenePassage,
  verifyCookieActorBoundary,
  sceneRedactor,
};
