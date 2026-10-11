const assert = require("node:assert/strict");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const { chromium, expect } = appRequire("@playwright/test");

async function main() {
  assert.equal(process.env.GITHUB_ACTIONS, "true");
  assert.equal(process.env.GITHUB_REPOSITORY, "frankxai/arcanea-ai-app");
  assert.equal(process.env.GITHUB_ACTOR, "frankxai");
  assert.equal(process.env.GITHUB_EVENT_NAME, "workflow_dispatch");
  assert.equal(process.env.RUNNER_OS, "Linux");
  assert.equal(
    process.env.GITHUB_REF_NAME,
    "agent/codex/provider-account-20261011",
  );
  const config = JSON.parse(
    fs.readFileSync(process.env.PROVIDER_SETTINGS_FIXTURE, "utf8"),
  );
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.base, "http://localhost:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:54321");
  assert.equal(config.output, "screenshots/provider-settings");
  assert.equal(config.accounts.length, 2);
  assert.ok(
    config.accounts.every((account) =>
      account.email.endsWith("@example.invalid"),
    ),
  );
  const evidence = {
    head: config.head,
    realPasswordLogins: 0,
    aiPosts: 0,
    modes: [],
    passed: false,
    scope:
      "Real isolated GoTrue password login and compiled protected settings; no production or live provider acceptance",
    timingInstrumentation:
      "A real cross-tab sign-in invokes the old form after the actual SDK subscriber and before React cleanup",
    accountSwitchSetup:
      "Fixture-owned auth cookies are cleared before another account logs in; this does not certify the product sign-out UI",
    csp: "Loopback HTTP fixture bypasses browser CSP; production HTTPS policy is unchanged and unverified here",
  };
  fs.mkdirSync(config.output, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const mode of [
      { name: "desktop", width: 1440, height: 900, motion: "no-preference" },
      { name: "mobile", width: 375, height: 812, motion: "no-preference" },
      { name: "reduced-motion", width: 1440, height: 900, motion: "reduce" },
    ]) {
      const context = await browser.newContext({
        viewport: { width: mode.width, height: mode.height },
        reducedMotion: mode.motion,
        bypassCSP: true,
      });
      let page;
      let stage = "guest-denial";
      const result = {
        mode: mode.name,
        passed: false,
        staleSubmitAttempts: 0,
        pageErrors: 0,
      };
      await context.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (
          url.origin === config.base &&
          url.pathname.startsWith("/api/ai/") &&
          request.method() === "POST"
        ) {
          evidence.aiPosts++;
          return route.abort();
        }
        if (url.origin === config.base || url.origin === config.supabaseUrl)
          return route.continue();
        return route.abort();
      });
      await context.addInitScript(
        ({ secondId }) => {
          window.__providerSettingsFixture = {
            armed: false,
            staleSubmitAttempts: 0,
            staleFormConnected: false,
            staleReactSubmitHandled: false,
          };
          const NativeChannel = window.BroadcastChannel;
          // Preserve the actual GoTrue listener. Only insert a submit at the race boundary.
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
                  const state = window.__providerSettingsFixture;
                  const oldForm =
                    state.armed &&
                    event.data?.event === "SIGNED_IN" &&
                    event.data?.session?.user?.id === secondId
                      ? document
                          .getElementById("active-provider")
                          ?.closest("form")
                      : null;
                  const returned =
                    typeof listener === "function"
                      ? listener.call(this, event)
                      : listener.handleEvent(event);
                  if (oldForm) {
                    state.armed = false;
                    state.staleFormConnected =
                      oldForm.isConnected &&
                      oldForm.querySelector("#provider-key-google")?.value ===
                        "fixture-must-not-save-after-switch";
                    let submission;
                    oldForm.addEventListener(
                      "submit",
                      (event) => {
                        submission = event;
                      },
                      { once: true },
                    );
                    state.staleSubmitAttempts++;
                    oldForm.requestSubmit();
                    state.staleReactSubmitHandled =
                      submission?.defaultPrevented === true;
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
        { secondId: config.accounts[1].id },
      );
      try {
        page = await context.newPage();
        page.setDefaultTimeout(15000);
        context.on("page", (tab) =>
          tab.on("pageerror", () => result.pageErrors++),
        );
        page.on("pageerror", () => result.pageErrors++);
        const key = (tab, label = "Google Gemini API key") =>
          tab.getByLabel(label, { exact: true });
        const save = (tab) =>
          tab.getByRole("button", { name: "Save connection", exact: true });
        const names = (id) => ({
          keys: `arcanea-provider-keys:v2:${encodeURIComponent(`user:${id}`)}`,
          provider: `arcanea-active-provider:v2:${encodeURIComponent(`user:${id}`)}`,
        });
        const stored = async (id) =>
          page.evaluate(
            (slot) => ({
              keys: JSON.parse(localStorage.getItem(slot.keys) || "{}"),
              provider: localStorage.getItem(slot.provider),
            }),
            names(id),
          );
        const login = async (tab, account) => {
          await tab.goto(
            `${config.base}/auth/login?next=%2Fsettings%2Fproviders`,
          );
          await tab.getByLabel("Email", { exact: true }).fill(account.email);
          await tab
            .getByLabel("Password", { exact: true })
            .fill(account.password);
          await tab
            .locator("form")
            .getByRole("button", { name: "Sign In", exact: true })
            .click();
          await tab.waitForURL((url) => url.pathname === "/settings/providers");
          await expect(
            tab.getByRole("heading", {
              name: "Your AI connection",
              exact: true,
            }),
          ).toBeVisible();
          await expect(
            tab.getByLabel("Chat provider", { exact: true }),
          ).toBeVisible();
          evidence.realPasswordLogins++;
        };
        await page.goto(`${config.base}/settings/providers`);
        await page.waitForURL(
          (url) =>
            url.pathname === "/auth/login" &&
            url.searchParams.get("next") === "/settings/providers",
        );
        await page.evaluate(() =>
          localStorage.setItem(
            "arcanea-provider-keys",
            '{"google":"fixture-unassigned-key"}',
          ),
        );
        stage = "login-a";
        await login(page, config.accounts[0]);
        await expect(key(page)).toHaveValue("");
        stage = "save-a";
        await key(page).fill("fixture-provider-a-key");
        await save(page).click();
        await expect(
          page
            .getByRole("status")
            .filter({ hasText: "Saved for this account in this browser." }),
        ).toBeVisible();
        assert.deepEqual(await stored(config.accounts[0].id), {
          keys: { google: "fixture-provider-a-key" },
          provider: "google",
        });
        await page.reload();
        await expect(key(page)).toHaveValue("fixture-provider-a-key");
        stage = "cross-tab-conflict";
        const second = await context.newPage();
        await second.goto(`${config.base}/settings/providers`);
        await expect(key(second)).toHaveValue("fixture-provider-a-key");
        await key(page).fill("fixture-unsaved-a-key");
        await key(second).fill("fixture-provider-a-new-key");
        await save(second).click();
        await expect(
          page.locator("form:has(#active-provider)").getByRole("alert"),
        ).toHaveText(
          "Settings changed in another tab. Reload saved settings before saving.",
        );
        await save(page).click();
        assert.equal(
          (await stored(config.accounts[0].id)).keys.google,
          "fixture-provider-a-new-key",
        );
        await page
          .getByRole("button", { name: "Reload saved settings", exact: true })
          .click();
        await expect(key(page)).toHaveValue("fixture-provider-a-new-key");
        stage = "storage-recovery";
        await key(page).fill("fixture-provider-a-recovered-key");
        await page.evaluate(() => {
          const nativeSet = Storage.prototype.setItem;
          window.__restoreProviderStorage = () => {
            Storage.prototype.setItem = nativeSet;
          };
          Storage.prototype.setItem = function (name, value) {
            if (name.startsWith("arcanea-provider-keys:v2:"))
              throw new DOMException(
                "Fixture storage interruption",
                "QuotaExceededError",
              );
            return nativeSet.call(this, name, value);
          };
        });
        await save(page).click();
        await expect(
          page.locator("form:has(#active-provider)").getByRole("alert"),
        ).toHaveText(
          "Your browser could not save these settings. Allow site storage and try again.",
        );
        assert.equal(
          (await stored(config.accounts[0].id)).keys.google,
          "fixture-provider-a-new-key",
        );
        await page.evaluate(() => window.__restoreProviderStorage());
        await save(page).click();
        await expect(save(page)).toBeDisabled();
        assert.equal(
          (await stored(config.accounts[0].id)).keys.google,
          "fixture-provider-a-recovered-key",
        );
        stage = "same-turn-account-switch";
        await key(page).fill("fixture-must-not-save-after-switch");
        await page.evaluate(() => {
          window.__providerSettingsFixture.armed = true;
        });
        await context.clearCookies();
        await second.evaluate(() => {
          for (const name of Object.keys(localStorage))
            if (/^sb-.*-auth-token$/.test(name)) localStorage.removeItem(name);
        });
        await login(second, config.accounts[1]);
        await expect(key(page)).toHaveValue("");
        result.staleSubmitAttempts = await page.evaluate(
          () => window.__providerSettingsFixture.staleSubmitAttempts,
        );
        assert.equal(result.staleSubmitAttempts, 1);
        const staleWitness = await page.evaluate(() => ({
          connected: window.__providerSettingsFixture.staleFormConnected,
          handled: window.__providerSettingsFixture.staleReactSubmitHandled,
        }));
        assert.deepEqual(staleWitness, { connected: true, handled: true });
        result.staleConnectedFormObserved = true;
        result.staleReactSubmitHandled = true;
        assert.equal(
          (await stored(config.accounts[0].id)).keys.google,
          "fixture-provider-a-recovered-key",
        );
        assert.deepEqual((await stored(config.accounts[1].id)).keys, {});
        stage = "save-b";
        // Reload also requires the unchanged server middleware to validate B's cookie.
        await page.reload();
        await page
          .getByLabel("Chat provider", { exact: true })
          .selectOption("openai");
        await expect(key(page, "OpenAI API key")).toHaveValue("");
        await key(page, "OpenAI API key").fill("fixture-provider-b-key");
        await save(page).click();
        await expect(save(page)).toBeDisabled();
        await page.reload();
        await expect(
          page.getByLabel("Chat provider", { exact: true }),
        ).toHaveValue("openai");
        await expect(key(page, "OpenAI API key")).toHaveValue(
          "fixture-provider-b-key",
        );
        assert.deepEqual(await stored(config.accounts[1].id), {
          keys: { openai: "fixture-provider-b-key" },
          provider: "openai",
        });
        stage = "return-a";
        await context.clearCookies();
        await second.evaluate(() => {
          for (const name of Object.keys(localStorage))
            if (/^sb-.*-auth-token$/.test(name)) localStorage.removeItem(name);
        });
        await login(second, config.accounts[0]);
        await page.reload();
        await expect(
          page.getByLabel("Chat provider", { exact: true }),
        ).toHaveValue("google");
        await expect(key(page)).toHaveValue("fixture-provider-a-recovered-key");
        assert.equal(
          (await stored(config.accounts[1].id)).keys.openai,
          "fixture-provider-b-key",
        );
        assert.equal(
          await page.evaluate(() =>
            localStorage.getItem("arcanea-provider-keys"),
          ),
          '{"google":"fixture-unassigned-key"}',
        );
        assert.equal(result.pageErrors, 0);
        assert.equal(evidence.aiPosts, 0);
        result.guestServerDenied = true;
        result.savedAndReloadedBothAccounts = true;
        result.crossTabConflictDenied = true;
        result.storageFailureRecovered = true;
        result.oldAccountSameTurnSaveDenied = true;
        result.accountReturnRestoredPreferences = true;
        result.legacyCredentialsPreservedUnused = true;
        result.passed = true;
        await page.screenshot({
          path: `${config.output}/${mode.name}-settings.png`,
          fullPage: true,
          mask: [page.locator("input")],
        });
      } catch (cause) {
        result.failureStage = stage;
        // Preserve the failing assertion's location without exposing its values.
        result.failureLine =
          Number(
            cause.stack?.match(
              /verify-provider-settings-browser\.cjs:(\d+):\d+/,
            )?.[1],
          ) || null;
        if (page) {
          result.alertCount = await page
            .getByRole("alert")
            .count()
            .catch(() => null);
          result.settingsAlertCount = await page
            .locator("form:has(#active-provider)")
            .getByRole("alert")
            .count()
            .catch(() => null);
        }
        if (page)
          await page
            .screenshot({
              path: `${config.output}/${mode.name}-failure.png`,
              fullPage: true,
              mask: [page.locator("input")],
            })
            .catch(() => {});
        throw Error(
          "The compiled protected-settings assertions did not complete.",
        );
      } finally {
        evidence.modes.push(result);
        await context.close();
        fs.writeFileSync(
          `${config.output}/browser-evidence.json`,
          JSON.stringify(evidence, null, 2),
        );
      }
    }
    assert.equal(evidence.realPasswordLogins, 9);
    evidence.passed = true;
    fs.writeFileSync(
      `${config.output}/browser-evidence.json`,
      JSON.stringify(evidence, null, 2),
    );
    console.log(JSON.stringify(evidence));
  } finally {
    await browser.close();
  }
}
main().catch(() => {
  console.error(
    "Protected-settings fixture assertions failed; inspect the safe stage receipt.",
  );
  process.exitCode = 1;
});
