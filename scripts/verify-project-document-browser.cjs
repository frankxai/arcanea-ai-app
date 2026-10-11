const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { createRequire } = require("node:module");
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
    "agent/codex/project-document-recovery-20261011",
  );
  assert.match(process.env.GITHUB_RUN_ID || "", /^\d+$/);
  assert.match(process.env.GITHUB_RUN_ATTEMPT || "", /^\d+$/);
  const expectedConfig = path.join(
    process.env.RUNNER_TEMP,
    `project-document-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}.private.json`,
  );
  assert.equal(process.env.PROJECT_DOCUMENT_FIXTURE, expectedConfig);
  const config = JSON.parse(fs.readFileSync(expectedConfig, "utf8"));
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.base, "http://localhost:3001");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:54321");
  assert.equal(config.output, "screenshots/project-document-service");
  assert.equal(config.accounts.length, 2);
  assert.ok(
    config.accounts.every((a) =>
      /^document-[01]@example\.invalid$/.test(a.email),
    ),
  );
  const evidence = {
    head: config.head,
    realPasswordLogins: 0,
    supplierPosts: 0,
    modes: [],
    passed: false,
    scope:
      "Compiled documents, actual disposable Auth/Postgres/RLS and migration; no production or supplier output",
    csp: "Loopback HTTP fixture bypasses CSP; production HTTPS policy is not tested here",
    accountSwitchSetup:
      "Fixture-owned cookies cleared before real cross-tab password login; product sign-out UI not certified",
    timingInstrumentation:
      "Actual SDK auth subscriber runs before an old connected React recovery form is submitted",
  };
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
      const result = {
        mode: mode.name,
        passed: false,
        pageErrors: 0,
        checks: [],
        staleSubmitAttempts: 0,
        patchIdentities: [],
        authStatuses: [],
      };
      let stage = "guest-denial";
      let blockWrites = false;
      let loseAcknowledgement = false;
      let holdAcknowledgement = false;
      let held;
      let releaseHeld;
      const hold = new Promise((resolve) => {
        releaseHeld = resolve;
      });
      await context.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.origin !== config.base && url.origin !== config.supabaseUrl)
          return route.abort();
        if (
          url.origin === config.base &&
          /^\/api\/(?:ai|generate|imagine|voice|credits)(?:\/|$)/.test(
            url.pathname,
          ) &&
          request.method() === "POST"
        ) {
          evidence.supplierPosts++;
          return route.abort();
        }
        if (
          /^\/api\/projects\/[^/]+\/docs\/[^/]+$/.test(url.pathname) &&
          request.method() === "PATCH"
        ) {
          const body = request.postDataJSON();
          result.patchIdentities.push({
            actor: body.expected_actor,
            operation: body.operation_id,
            revision: body.expected_revision,
          });
          if (blockWrites) return route.abort();
          if (loseAcknowledgement) {
            loseAcknowledgement = false;
            blockWrites = true;
            const response = await route.fetch();
            assert.equal(response.status(), 200);
            return route.abort();
          }
          if (holdAcknowledgement) {
            holdAcknowledgement = false;
            const response = await route.fetch();
            held = { status: response.status(), operation: body.operation_id };
            await Promise.race([
              hold,
              new Promise((resolve) => setTimeout(resolve, 15000)),
            ]);
            try {
              return await route.fulfill({ response });
            } catch {
              return;
            }
          }
        }
        return route.continue();
      });
      await context.addInitScript(
        ({ secondId }) => {
          window.__documentFixture = {
            armed: false,
            failStorage: false,
            staleSubmitAttempts: 0,
            staleFormConnected: false,
            staleReactSubmitHandled: false,
          };
          const write = Storage.prototype.setItem;
          Storage.prototype.setItem = function (key, value) {
            if (
              window.__documentFixture.failStorage &&
              key.startsWith("arcanea-document-draft:v1:")
            )
              throw new DOMException(
                "Fixture storage failure",
                "QuotaExceededError",
              );
            return write.call(this, key, value);
          };
          const NativeChannel = window.BroadcastChannel;
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
                  const state = window.__documentFixture;
                  const oldForm =
                    state.armed &&
                    event.data?.event === "SIGNED_IN" &&
                    event.data?.session?.user?.id === secondId
                      ? document.querySelector(
                          '[aria-label="Document recovery"] form',
                        )
                      : null;
                  const returned =
                    typeof listener === "function"
                      ? listener.call(this, event)
                      : listener.handleEvent(event);
                  if (oldForm) {
                    state.armed = false;
                    state.staleFormConnected = oldForm.isConnected;
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
      const attach = (page) => {
        page.setDefaultTimeout(15000);
        page.on("response", (response) => {
          const url = new URL(response.url());
          if (
            url.origin === config.supabaseUrl &&
            url.pathname === "/auth/v1/token"
          )
            result.authStatuses.push(response.status());
        });
        page.on("pageerror", (error) => {
          result.pageErrors++;
          result.errorKinds ??= [];
          result.errorKinds.push(
            /Minified React error #\d+/.exec(error.message)?.[0] || error.name,
          );
        });
        page.on("dialog", (dialog) => dialog.accept());
        return page;
      };
      const page = attach(await context.newPage());
      const login = async (tab, account) => {
        result.loginStep = "open-login";
        await tab.goto(
          `${config.base}/auth/login?next=%2Fsettings%2Fproviders`,
        );
        result.loginStep = "fill-email";
        await tab.getByLabel("Email", { exact: true }).fill(account.email);
        await tab
          .getByLabel("Password", { exact: true })
          .fill(account.password);
        result.loginStep = "submit-password";
        // The desktop header also opens an auth modal. Submit this password form.
        const form = tab.locator("form").filter({
          has: tab.getByLabel("Email", { exact: true }),
        });
        await expect(form).toHaveCount(1);
        await form
          .getByRole("button", { name: "Sign In", exact: true })
          .click();
        result.loginStep = "wait-destination";
        await tab.waitForURL((url) => url.pathname === "/settings/providers");
        result.loginStep = "verify-account-settings";
        await expect(
          tab.getByRole("heading", { name: "Your AI connection", exact: true }),
        ).toBeVisible();
        evidence.realPasswordLogins++;
      };
      const get = async (address) => {
        const response = await page.request.get(`${config.base}${address}`);
        assert.equal(response.status(), 200);
        return (await response.json()).data.doc;
      };
      const backup = (key) =>
        page.evaluate((key) => localStorage.getItem(key), key);
      const editor = page.locator(".ProseMirror");
      const title = page.getByLabel("Document title", { exact: true });
      const recovery = page.getByRole("region", { name: "Document recovery" });
      const flush = () => page.keyboard.press("Control+s");
      const download = async (button) => {
        const pending = page.waitForEvent("download");
        await button.click();
        const stream = await (await pending).createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks).toString("utf8");
      };
      const capture = async (label) => {
        const file = `${config.output}/document-${mode.name}-${label}.png`;
        await page.screenshot({ path: file, fullPage: true });
        fs.writeFileSync(
          `${file}.vis.provenance.json`,
          JSON.stringify(
            {
              prompt: `Actual compiled project document ${label} in ${mode.name}; disposable fixture content`,
              model: null,
              provider: "Playwright Chromium",
              seed: null,
              agentSession: `github:${process.env.GITHUB_RUN_ID}:${process.env.GITHUB_RUN_ATTEMPT}`,
              sourceRevision: config.head,
              imageSha256: createHash("sha256")
                .update(fs.readFileSync(file))
                .digest("hex"),
              generated: false,
            },
            null,
            2,
          ),
        );
      };
      try {
        assert.equal(
          (
            await page.request.get(
              `${config.base}/api/projects/00000000-0000-4000-8000-000000000001/docs/00000000-0000-4000-8000-000000000002`,
            )
          ).status(),
          401,
        );
        stage = "login-a";
        await login(page, config.accounts[0]);
        stage = "actual-project-and-document-creation";
        const projectResponse = await page.request.post(
          `${config.base}/api/projects`,
          { data: { title: `Document fixture ${mode.name}` } },
        );
        assert.equal(projectResponse.status(), 201);
        const project = (await projectResponse.json()).data.project;
        const creation = await page.request.post(
          `${config.base}/api/projects/${project.id}/docs`,
          { data: { title: "Initial document", doc_type: "note" } },
        );
        assert.equal(creation.status(), 201);
        const doc = (await creation.json()).data.doc;
        const address = `/api/projects/${project.id}/docs/${doc.id}`;
        const documentUrl = `${config.base}/projects/${project.id}/docs/${doc.id}`;
        const key = `arcanea-document-draft:v1:${config.accounts[0].id}:${project.id}:${doc.id}`;
        assert.equal((await get(address)).save_revision, 0);
        await page.goto(documentUrl);
        await expect(title).toHaveValue("Initial document");
        stage = "edit-and-cloud-reopen";
        await title.fill("Continuity document");
        await editor.fill("The map remembers the harbour and its keeper.");
        await flush();
        await expect
          .poll(async () => (await get(address)).content.content_text)
          .toBe("The map remembers the harbour and its keeper.");
        await expect(
          page.getByRole("status").filter({ hasText: /^Saved$/ }),
        ).toBeVisible();
        assert.equal(await backup(key), null);
        await page.reload();
        await expect(editor).toHaveText(
          "The map remembers the harbour and its keeper.",
        );
        await expect(title).toHaveValue("Continuity document");
        const content = (await get(address)).content;
        assert.equal(content.content_json.type, "doc");
        result.checks.push("actual-owner-save-cloud-reopen-rich-json");
        await capture("saved");

        stage = "lost-acknowledgement-reload-replay";
        loseAcknowledgement = true;
        await editor.fill("Committed once while its acknowledgement is lost.");
        await flush();
        await expect(recovery.getByRole("alert")).toBeVisible();
        const uncertain = JSON.parse(await backup(key));
        assert.ok(uncertain.pending.operation_id);
        await editor.fill(
          "A newer recoverable edit follows the uncertain save.",
        );
        assert.equal(
          JSON.parse(await backup(key)).value.content_text,
          "A newer recoverable edit follows the uncertain save.",
        );
        await page.reload();
        await expect(editor).toHaveText(
          "A newer recoverable edit follows the uncertain save.",
        );
        blockWrites = false;
        const replayStart = result.patchIdentities.length;
        await recovery
          .getByRole("button", { name: "Retry saving", exact: true })
          .click();
        await expect
          .poll(async () => (await get(address)).content.content_text)
          .toBe("A newer recoverable edit follows the uncertain save.");
        await expect
          .poll(() => result.patchIdentities.length)
          .toBeGreaterThan(replayStart + 1);
        assert.equal(
          result.patchIdentities[replayStart].operation,
          uncertain.pending.operation_id,
        );
        assert.notEqual(
          result.patchIdentities[replayStart + 1].operation,
          uncertain.pending.operation_id,
        );
        result.checks.push("lost-ack-same-operation-before-new-edit");

        stage = "two-tab-revision-conflict-export-reopen";
        const second = attach(await context.newPage());
        await second.goto(documentUrl);
        await expect(
          second.getByLabel("Document title", { exact: true }),
        ).toHaveValue("Continuity document");
        await second
          .getByLabel("Document title", { exact: true })
          .fill("Saved in the other tab");
        await second.keyboard.press("Control+s");
        await expect
          .poll(async () => (await get(address)).title)
          .toBe("Saved in the other tab");
        await editor.fill(
          "This conflicting draft must survive and be exportable.",
        );
        await flush();
        await expect(recovery.getByRole("alert")).toContainText(
          "saved revision changed",
        );
        const conflicting = JSON.parse(
          await download(
            recovery.getByRole("button", {
              name: "Download draft",
              exact: true,
            }),
          ),
        );
        assert.equal(
          conflicting.content_text,
          "This conflicting draft must survive and be exportable.",
        );
        assert.equal(conflicting.content_json.type, "doc");
        assert.ok(conflicting.pending_operation.operation_id);
        await capture("recovery");
        await recovery
          .getByRole("button", { name: "Reopen saved version", exact: true })
          .click();
        await expect(title).toHaveValue("Saved in the other tab");
        assert.equal(await backup(key), null);
        result.checks.push(
          "conflict-preserved-structured-export-explicit-reopen",
        );

        stage = "unreadable-original-backup";
        await page.evaluate(
          (key) => localStorage.setItem(key, "{broken fixture original"),
          key,
        );
        await page.reload();
        await expect(recovery).toContainText("could not be read");
        assert.equal(
          await download(
            recovery.getByRole("button", {
              name: "Download original recovery copy",
              exact: true,
            }),
          ),
          "{broken fixture original",
        );
        await editor.fill(
          "Editable while the original broken backup is protected.",
        );
        await flush();
        await expect
          .poll(async () => (await get(address)).content.content_text)
          .toBe("Editable while the original broken backup is protected.");
        assert.equal(await backup(key), "{broken fixture original");
        await recovery
          .getByRole("button", { name: "Reopen saved version", exact: true })
          .click();
        await expect(editor).toHaveText(
          "Editable while the original broken backup is protected.",
        );
        result.checks.push("unreadable-original-preserved-and-downloadable");

        stage = "storage-failure-and-native-back";
        await page.evaluate(() => {
          window.__documentFixture.failStorage = true;
        });
        blockWrites = true;
        await editor.fill(
          "Memory draft remains recoverable after storage fails.",
        );
        await flush();
        await expect(recovery.getByRole("alert")).toBeVisible();
        const memory = JSON.parse(
          await download(
            recovery.getByRole("button", {
              name: "Download draft",
              exact: true,
            }),
          ),
        );
        assert.equal(
          memory.content_text,
          "Memory draft remains recoverable after storage fails.",
        );
        stage = "native-back-preserves-memory-draft";
        await page.evaluate(() => history.back());
        await expect(editor).toHaveText(
          "Memory draft remains recoverable after storage fails.",
        );
        assert.equal(page.url(), documentUrl);
        stage = "recovery-touch-targets";
        const targets = await recovery
          .locator("button")
          .evaluateAll((buttons) =>
            buttons.map((b) => ({
              height: b.getBoundingClientRect().height,
              width: b.getBoundingClientRect().width,
            })),
          );
        assert.ok(targets.every((b) => b.height >= 44 && b.width >= 44));
        stage = "recovery-keyboard-focus";
        await recovery
          .getByRole("button", { name: "Download draft", exact: true })
          .focus();
        // Exercise keyboard modality, rather than inheriting the download click.
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        assert.equal(
          await recovery
            .getByRole("button", { name: "Download draft", exact: true })
            .evaluate(
              (b) =>
                b === document.activeElement &&
                getComputedStyle(b).outlineStyle !== "none",
            ),
          true,
        );
        stage = "recovery-horizontal-overflow";
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          true,
        );
        stage = "retry-after-storage-restored";
        await page.evaluate(() => {
          window.__documentFixture.failStorage = false;
        });
        blockWrites = false;
        await recovery
          .getByRole("button", { name: "Retry saving", exact: true })
          .click();
        await expect
          .poll(async () => (await get(address)).content.content_text)
          .toBe(memory.content_text);
        result.checks.push(
          "storage-memory-export-native-back-touch-focus-no-overflow",
        );

        stage = "saved-document-back-forward";
        const listPath = `/projects/${project.id}/docs`;
        await page
          .getByRole("link", { name: "Documents", exact: true })
          .click();
        await page.waitForURL((url) => url.pathname === listPath);
        await page.evaluate(() => history.back());
        await expect(title).toHaveValue("Saved in the other tab");
        await expect(editor).toHaveText(memory.content_text);
        await page.evaluate(() => history.forward());
        await page.waitForURL((url) => url.pathname === listPath);
        await page.evaluate(() => history.back());
        await expect(title).toHaveValue("Saved in the other tab");
        await expect(editor).toHaveText(memory.content_text);
        result.checks.push("saved-document-back-forward-retains-cloud-content");

        stage = "late-old-account-response-and-stale-form";
        blockWrites = true;
        await editor.fill("Account A draft must never save as account B.");
        await flush();
        await expect(recovery.getByRole("alert")).toBeVisible();
        blockWrites = false;
        holdAcknowledgement = true;
        await recovery
          .getByRole("button", { name: "Retry saving", exact: true })
          .click();
        await expect.poll(() => held?.status).toBe(200);
        const beforeSwitch = await backup(key);
        await page.evaluate(() => {
          window.__documentFixture.armed = true;
        });
        await context.clearCookies();
        await login(second, config.accounts[1]);
        releaseHeld();
        await expect
          .poll(() =>
            page.evaluate(() => window.__documentFixture.staleSubmitAttempts),
          )
          .toBe(1);
        const boundary = await page.evaluate(() => window.__documentFixture);
        assert.equal(boundary.staleFormConnected, true);
        assert.equal(boundary.staleReactSubmitHandled, true);
        result.staleSubmitAttempts = boundary.staleSubmitAttempts;
        await expect(title).toHaveCount(0);
        assert.equal(await backup(key), beforeSwitch);
        assert.equal(
          (await second.request.get(`${config.base}${address}`)).status(),
          404,
        );
        const foreignCreation = await second.request.post(
          `${config.base}/api/projects/${project.id}/docs`,
          { data: { title: "Must be denied" } },
        );
        assert.equal(foreignCreation.status(), 404);
        const bProjectResponse = await second.request.post(
          `${config.base}/api/projects`,
          { data: { title: "Account B project" } },
        );
        assert.equal(bProjectResponse.status(), 201);
        const bProject = (await bProjectResponse.json()).data.project;
        const bDocResponse = await second.request.post(
          `${config.base}/api/projects/${bProject.id}/docs`,
          { data: { title: "Account B document" } },
        );
        assert.equal(bDocResponse.status(), 201);
        const bDoc = (await bDocResponse.json()).data.doc;
        assert.equal(bDoc.user_id, config.accounts[1].id);
        assert.equal(
          result.patchIdentities.some((p) => p.actor === config.accounts[1].id),
          false,
        );
        await context.clearCookies();
        await login(second, config.accounts[0]);
        await page.goto(documentUrl);
        await expect(editor).toHaveText(
          "Account A draft must never save as account B.",
        );
        await recovery
          .getByRole("button", { name: "Retry saving", exact: true })
          .click();
        await expect(
          page.getByRole("status").filter({ hasText: /^Saved$/ }),
        ).toBeVisible();
        assert.equal(await backup(key), null);
        result.checks.push(
          "actual-a-b-a-auth-stale-form-and-late-response-isolation",
        );
        assert.equal(result.pageErrors, 0);
        result.passed = true;
      } catch (error) {
        result.failureStage = stage;
        result.failureKind = error.name;
        for (const field of ["actual", "expected"]) {
          if (
            typeof error[field] === "number" ||
            typeof error[field] === "boolean"
          )
            result[field] = error[field];
        }
        try {
          result.failurePath = new URL(page.url()).pathname;
          result.failureControls = await page.evaluate(() => ({
            titlePresent: !!document.getElementById("document-title"),
            loginPresent: !!document.querySelector('input[type="password"]'),
            alertPresent: !!document.querySelector('[role="alert"]'),
            recoveryPresent: !!document.querySelector(
              '[aria-label="Document recovery"]',
            ),
            overflow: document.documentElement.scrollWidth > window.innerWidth,
            keyboardFocus:
              document.activeElement?.matches(":focus-visible") === true,
          }));
          await capture(`failed-${stage}`);
        } catch {
          result.failureCaptureUnavailable = true;
        }
        process.exitCode = 1;
      } finally {
        releaseHeld();
        evidence.modes.push(result);
        await context.close();
        fs.writeFileSync(
          `${config.output}/browser-evidence.json`,
          JSON.stringify(evidence, null, 2),
        );
      }
    }
    evidence.passed =
      evidence.modes.length === 3 &&
      evidence.modes.every((m) => m.passed && m.pageErrors === 0) &&
      evidence.realPasswordLogins === 9 &&
      evidence.supplierPosts === 0;
    if (!evidence.passed) process.exitCode = 1;
  } finally {
    await browser.close();
    fs.writeFileSync(
      `${config.output}/browser-evidence.json`,
      JSON.stringify(evidence, null, 2),
    );
    console.log(
      JSON.stringify({
        head: evidence.head,
        passed: evidence.passed,
        stages: evidence.modes.map((m) => ({
          mode: m.mode,
          failed: m.failureStage || null,
        })),
      }),
    );
  }
}
main().catch(() => {
  console.error(
    "Document browser fixture did not complete; no credentials are logged.",
  );
  process.exitCode = 1;
});
