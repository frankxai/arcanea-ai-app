const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { createRequire } = require("node:module");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const { chromium, expect } = appRequire("@playwright/test");

async function largeOriginalPng() {
  // A visible creator attachment exercises layout as well as the byte limit.
  // This deterministic diagram is a test fixture, not generated creator art.
  const grid = Array.from({ length: 15 }, (_, index) => {
    const x = 96 + index * 96;
    return `<path d="M${x} 160V920"/>`;
  }).join("");
  const rows = Array.from({ length: 8 }, (_, index) => {
    const y = 184 + index * 96;
    return `<path d="M64 ${y}H1472"/>`;
  }).join("");
  const map = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
    <rect width="1536" height="1024" fill="#edf1e7"/>
    <rect x="32" y="32" width="1472" height="960" rx="12" fill="none" stroke="#355365" stroke-width="4"/>
    <text x="80" y="98" font-size="44" font-family="sans-serif" fill="#203f50">Continuity map</text>
    <text x="80" y="137" font-size="24" font-family="sans-serif" fill="#476274">Deterministic upload fixture: routes, landmarks and annotations</text>
    <g stroke="#c4d1c2" stroke-width="1">${grid}${rows}</g>
    <path d="M70 340 Q260 250 410 390 T700 310 T1010 470 T1460 350 L1460 840 Q1200 920 950 800 T470 870 T70 790Z" fill="#b5d0ad" stroke="#73956a" stroke-width="4"/>
    <path d="M1220 180 Q1020 400 1150 550 T900 920" fill="none" stroke="#77aaca" stroke-width="48"/>
    <path d="M1220 180 Q1020 400 1150 550 T900 920" fill="none" stroke="#dceef5" stroke-width="7"/>
    <path d="M230 680 Q450 410 750 480 T1290 720" fill="none" stroke="#9a6548" stroke-width="9" stroke-dasharray="20 14"/>
    <g fill="#fcfaf0" stroke="#355365" stroke-width="5">
      <circle cx="230" cy="680" r="22"/><circle cx="510" cy="480" r="22"/>
      <circle cx="910" cy="520" r="22"/><circle cx="1290" cy="720" r="22"/>
    </g>
    <g font-family="sans-serif" font-size="30" fill="#203f50">
      <text x="100" y="744">Harbor</text><text x="350" y="430">North ridge</text>
      <text x="810" y="465">River crossing</text><text x="1160" y="785">Old route</text>
    </g>
    <path d="M1300 270L1340 190L1380 270L1340 250Z" fill="#355365"/>
    <text x="1328" y="173" font-size="28" font-family="sans-serif" fill="#203f50">N</text>
    <path d="M90 940H330M90 930V950M210 930V950M330 930V950" stroke="#355365" stroke-width="4"/>
    <text x="365" y="950" font-size="22" font-family="sans-serif" fill="#476274">Fixture scale only</text>
  </svg>`;
  const png = await appRequire("sharp")(Buffer.from(map))
    .flatten({ background: "#edf1e7" })
    .removeAlpha()
    .png()
    .toBuffer();
  const length = 10485760 - png.length - 12;
  const body = Buffer.concat([
    Buffer.from("tEXt"),
    Buffer.from("Fixture\0"),
    Buffer.alloc(length - 8, 65),
  ]);
  let crc = 0xffffffff;
  for (const byte of body) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  const chunk = Buffer.alloc(body.length + 8);
  chunk.writeUInt32BE(length, 0);
  body.copy(chunk, 4);
  chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, chunk.length - 4);
  const result = Buffer.concat([
    png.subarray(0, png.length - 12),
    chunk,
    png.subarray(png.length - 12),
  ]);
  assert.equal(result.length, 10485760);
  await appRequire("sharp")(result, { failOn: "warning" }).stats();
  return result;
}

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
  const originalImage = await largeOriginalPng();
  const originalDigest = createHash("sha256")
    .update(originalImage)
    .digest("hex");
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
      let imageUploaded = false,
        loseImageCompletion = false,
        imagePutRequests = 0;
      let imageAsset, imageAddress, imageClaim;
      let releaseHeld;
      const hold = new Promise((resolve) => {
        releaseHeld = resolve;
      });
      await context.route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (
          url.origin === "https://vercel.com" &&
          url.pathname === "/api/blob/" &&
          request.method() === "PUT"
        ) {
          assert.ok(request.postDataBuffer().length <= 10485760);
          const response = await route.fetch({
            url: `http://127.0.0.1:54324/${url.search}`,
          });
          assert.equal(response.status(), 200);
          imagePutRequests++;
          imageUploaded = true;
          return route.fulfill({ response });
        }
        if (url.origin !== config.base && url.origin !== config.supabaseUrl)
          return route.abort();
        if (
          imageUploaded &&
          loseImageCompletion &&
          request.method() === "POST" &&
          /\/media$/.test(url.pathname) &&
          request.postDataJSON().action === "complete"
        ) {
          loseImageCompletion = false;
          const response = await route.fetch();
          assert.equal(response.status(), 200);
          imageClaim = request.postDataJSON().claim;
          imageAsset = (await response.json()).asset;
          return route.abort();
        }
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
      let signedInSession;
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
        const tokenResponse = tab.waitForResponse(
          (response) =>
            response
              .url()
              .startsWith("http://127.0.0.1:54321/auth/v1/token?") &&
            response.request().method() === "POST" &&
            response.status() === 200,
        );
        await form
          .getByRole("button", { name: "Sign In", exact: true })
          .click();
        const response = await tokenResponse;
        const session = await response.json();
        assert.equal(session.user.id, account.id);
        signedInSession = {
          accessToken: session.access_token,
          publicKey: response.request().headers().apikey,
        };
        assert.match(
          signedInSession.accessToken,
          /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
        );
        assert.ok(signedInSession.publicKey);
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
      const download = async (button, binary = false) => {
        const pending = page.waitForEvent("download");
        await button.click();
        const stream = await (await pending).createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return binary
          ? Buffer.concat(chunks)
          : Buffer.concat(chunks).toString("utf8");
      };
      const capture = async (label, { locator, fullPage = true } = {}) => {
        const file = `${config.output}/document-${mode.name}-${label}.png`;
        if (locator) {
          await locator.evaluate((element) =>
            element.scrollIntoView({ block: "center", behavior: "instant" }),
          );
          await page.evaluate(
            () =>
              new Promise((resolve) =>
                requestAnimationFrame(() => requestAnimationFrame(resolve)),
              ),
          );
          await locator.screenshot({ path: file });
        } else {
          if (fullPage) {
            await page.evaluate(() =>
              window.scrollTo({ top: 0, behavior: "instant" }),
            );
            await page.evaluate(
              () =>
                new Promise((resolve) =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                ),
            );
          }
          await page.screenshot({ path: file, fullPage });
        }
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
        stage = "project-workspace-footer";
        const workspaceFooter = page.getByRole("contentinfo", {
          name: "Project workspace footer",
        });
        const workspaceLinks = workspaceFooter.getByRole("link");
        await expect(workspaceFooter).toBeVisible();
        await expect(workspaceLinks).toHaveCount(3);
        await expect(workspaceFooter.getByRole("textbox")).toHaveCount(0);
        const footerBounds = await workspaceFooter.boundingBox();
        assert.ok(footerBounds && footerBounds.height <= 96);
        result.workspaceFooterHeight = footerBounds.height;
        for (const [index, href] of [
          "/contact",
          "/privacy",
          "/terms",
        ].entries()) {
          const link = workspaceLinks.nth(index);
          await expect(link).toHaveAttribute("href", href);
          const bounds = await link.boundingBox();
          assert.ok(bounds && bounds.height >= 44 && bounds.width >= 44);
          assert.equal(
            (await page.request.get(`${config.base}${href}`)).status(),
            200,
          );
        }
        await workspaceLinks.first().focus();
        await page.keyboard.press("Tab");
        await expect(workspaceLinks.nth(1)).toBeFocused();
        assert.equal(
          await workspaceLinks
            .nth(1)
            .evaluate((element) => element.matches(":focus-visible")),
          true,
        );
        stage = "scrolled-document-controls";
        // Verify pointer geometry before full-page capture, at a settled real
        // viewport and explicit scroll rather than incidental footer focus.
        await page.evaluate(() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "instant",
          }),
        );
        const controls = page.getByRole("region", {
          name: "Document controls",
        });
        await expect(controls).toBeVisible();
        const scrolledControls = await controls.evaluate(async (header) => {
          const frame = () =>
            new Promise((resolve) => requestAnimationFrame(resolve));
          await frame();
          await frame();
          const inspect = () => {
            const nav = document.querySelector("nav.fixed");
            if (!nav) throw Error("Global navigation unavailable.");
            const navBottom = nav.getBoundingClientRect().bottom;
            return [...header.querySelectorAll("a, button, select")].map(
              (element) => {
                const bounds = element.getBoundingClientRect();
                const hit = document.elementFromPoint(
                  bounds.x + bounds.width / 2,
                  bounds.y + bounds.height / 2,
                );
                return {
                  top: bounds.top,
                  navBottom,
                  unobstructed: hit !== null && element.contains(hit),
                };
              },
            );
          };
          if (window.scrollY <= 0)
            throw Error("The footer focus must scroll the document.");
          const oldTop = header.style.top;
          let legacy;
          try {
            // Reproduce the previous sticky top:0 collision in the real layout.
            header.style.top = "0px";
            await frame();
            await frame();
            legacy = inspect();
          } finally {
            header.style.top = oldTop;
            await frame();
            await frame();
          }
          return { legacy, current: inspect(), scrollY: window.scrollY };
        });
        result.scrolledControls = scrolledControls;
        assert.equal(scrolledControls.legacy[0].unobstructed, false);
        assert.equal(scrolledControls.current.length, 5);
        await expect(
          controls.getByRole("button", {
            name: "Export document",
            exact: true,
          }),
        ).toBeVisible();
        for (const control of scrolledControls.current) {
          assert.ok(control.top >= control.navBottom);
          assert.equal(control.unobstructed, true);
        }
        result.checks.push(
          "scrolled-controls-visible-clickable-legacy-overlap-reproduced",
        );
        await capture("controls-scrolled", { fullPage: false });
        await capture("saved");

        stage = "portable-text-document-download";
        const portableHtml = await download(
          controls.getByRole("button", {
            name: "Export document",
            exact: true,
          }),
        );
        assert.ok(Buffer.byteLength(portableHtml) < 2 * 1024 * 1024);
        assert.match(portableHtml, /^<!doctype html>/);
        const portableMatch = portableHtml.match(
          /id="arcanea-document">([\s\S]*?)<\/script>/,
        );
        assert.ok(
          portableMatch,
          "Portable document must contain its editable JSON",
        );
        const portable = JSON.parse(portableMatch[1]);
        assert.equal(portable.doc_id, doc.id);
        assert.equal(portable.project_id, project.id);
        assert.deepEqual(portable.content_json, content.content_json);
        assert.equal(portable.content_text, content.content_text);
        assert.deepEqual(portable.assets, {});
        result.checks.push(
          "actual-portable-text-document-download-preserves-rich-json",
        );

        stage = "actual-private-original-lost-completion";
        const imageCreation = await page.request.post(
          `${config.base}/api/projects/${project.id}/docs`,
          { data: { title: "Private original document", doc_type: "note" } },
        );
        assert.equal(imageCreation.status(), 201);
        const imageDoc = (await imageCreation.json()).data.doc;
        imageAddress = `/api/projects/${project.id}/docs/${imageDoc.id}/media`;
        const imageDocAddress = `/api/projects/${project.id}/docs/${imageDoc.id}`;
        await page.goto(
          `${config.base}/projects/${project.id}/docs/${imageDoc.id}`,
        );
        await expect(title).toHaveValue("Private original document");
        loseImageCompletion = true;
        await page.locator('input[type="file"]').setInputFiles({
          name: "private-map.png",
          mimeType: "image/png",
          buffer: originalImage,
        });
        const imageRecovery = page.getByRole("region", {
          name: "Image recovery",
        });
        await expect(imageRecovery.getByRole("alert")).toBeVisible();
        const retained = await download(
          imageRecovery.getByRole("button", {
            name: "Download original image",
            exact: true,
          }),
          true,
        );
        assert.equal(
          createHash("sha256").update(retained).digest("hex"),
          originalDigest,
        );
        assert.equal(imagePutRequests, 1);
        assert.equal(imageAsset.byteSize, 10485760);
        assert.equal(imageAsset.sha256, originalDigest);
        await capture("image-recovery");
        await page.reload();
        await expect(imageRecovery.getByRole("alert")).toContainText(
          "recovered from this browser",
        );
        const reopenedOriginal = await download(
          imageRecovery.getByRole("button", {
            name: "Download original image",
            exact: true,
          }),
          true,
        );
        assert.equal(
          createHash("sha256").update(reopenedOriginal).digest("hex"),
          originalDigest,
        );
        blockWrites = true;
        const beforeImageSave = result.patchIdentities.length;
        await imageRecovery
          .getByRole("button", { name: "Retry image", exact: true })
          .click();
        await expect(editor.locator("img")).toHaveCount(1);
        await flush();
        await expect
          .poll(() => result.patchIdentities.length)
          .toBeGreaterThan(beforeImageSave);
        await expect(imageRecovery).toHaveCount(1);
        await page.reload();
        await expect(imageRecovery.getByRole("alert")).toContainText(
          "recovered from this browser",
        );
        await expect(editor.locator("img")).toHaveCount(1);
        blockWrites = false;
        await imageRecovery
          .getByRole("button", { name: "Retry image", exact: true })
          .click();
        await expect(imageRecovery).toHaveCount(0);
        await expect(editor.locator("img")).toHaveCount(1);
        result.checks.push(
          "durable-original-reopen-and-lost-document-save-without-duplicate-image-or-put",
        );
        assert.equal(
          imagePutRequests,
          1,
          "Retry must reconcile the ready original without another PUT",
        );
        await expect(editor.locator("img")).toHaveCount(1);
        await expect
          .poll(() =>
            editor
              .locator("img")
              .evaluate(
                (img) =>
                  img.complete &&
                  img.naturalWidth === 1536 &&
                  img.naturalHeight === 1024,
              ),
          )
          .toBe(true);
        await flush();
        await expect
          .poll(async () =>
            JSON.stringify((await get(imageDocAddress)).content.content_json),
          )
          .toContain(`/media/${imageAsset.assetId}`);
        await page.reload();
        await expect(editor.locator("img")).toHaveCount(1);
        await expect
          .poll(() =>
            editor
              .locator("img")
              .evaluate(
                (img) =>
                  img.complete &&
                  img.naturalWidth === 1536 &&
                  img.naturalHeight === 1024,
              ),
          )
          .toBe(true);
        const imageBounds = await editor.locator("img").boundingBox();
        assert.ok(
          imageBounds && imageBounds.width > 200 && imageBounds.height > 120,
        );
        assert.ok(
          imageBounds.x >= 0 &&
            imageBounds.x + imageBounds.width <= mode.width + 1,
        );
        assert.ok(
          Math.abs(imageBounds.width / imageBounds.height - 1.5) < 0.05,
        );
        const privateUrl = `${imageAddress}/${imageAsset.assetId}`;
        const bytesResponse = await page.request.get(
          `${config.base}${privateUrl}`,
        );
        assert.equal(bytesResponse.status(), 200);
        assert.match(
          bytesResponse.headers()["cache-control"],
          /private.*no-store/,
        );
        const readBytes = await bytesResponse.body();
        assert.equal(readBytes.length, 10485760);
        assert.equal(
          createHash("sha256").update(readBytes).digest("hex"),
          originalDigest,
        );
        const mediaHtml = await download(
          page.getByRole("button", { name: "Export document", exact: true }),
        );
        const mediaManifest = JSON.parse(
          mediaHtml.match(/id="arcanea-document">([\s\S]*?)<\/script>/)[1],
        );
        assert.equal(mediaManifest.doc_id, imageDoc.id);
        assert.equal(mediaManifest.project_id, project.id);
        assert.deepEqual(
          mediaManifest.content_json,
          (await get(imageDocAddress)).content.content_json,
        );
        const exported = mediaManifest.assets[imageAsset.assetId];
        assert.equal(exported.byteSize, 10485760);
        assert.equal(
          createHash("sha256")
            .update(Buffer.from(exported.imageData, "base64"))
            .digest("hex"),
          originalDigest,
        );
        assert.match(mediaHtml, /img src="data:image\/png;base64,/);
        assert.ok(Buffer.byteLength(mediaHtml) < 30 * 1024 * 1024);
        const offlineContext = await browser.newContext({
          viewport: { width: mode.width, height: mode.height },
          reducedMotion: mode.motion,
          bypassCSP: false,
        });
        let offlineRequests = 0;
        await offlineContext.route("**/*", (route) => {
          offlineRequests++;
          return route.abort();
        });
        const offline = attach(await offlineContext.newPage());
        await offline.setContent(mediaHtml);
        await expect
          .poll(() =>
            offline
              .locator("img")
              .evaluate(
                (img) =>
                  img.complete &&
                  img.naturalWidth === 1536 &&
                  img.naturalHeight === 1024,
              ),
          )
          .toBe(true);
        const offlineImageBounds = await offline.locator("img").boundingBox();
        assert.ok(
          offlineImageBounds &&
            offlineImageBounds.width > 200 &&
            offlineImageBounds.height > 120,
        );
        assert.ok(
          offlineImageBounds.x >= 0 &&
            offlineImageBounds.x + offlineImageBounds.width <= mode.width + 1,
        );
        assert.ok(
          Math.abs(offlineImageBounds.width / offlineImageBounds.height - 1.5) <
            0.05,
        );
        const offlinePolicy = await offline.evaluate(async () => {
          const script = document.createElement("script");
          script.textContent = "window.__arcaneaOfflineScriptProbe = true;";
          document.body.appendChild(script);
          let blockedFetch = false;
          try {
            await fetch("https://example.invalid/offline-csp-probe");
          } catch {
            blockedFetch = true;
          }
          return {
            inlineScriptBlocked: window.__arcaneaOfflineScriptProbe !== true,
            networkFetchBlocked: blockedFetch,
          };
        });
        assert.equal(offlinePolicy.inlineScriptBlocked, true);
        assert.equal(offlinePolicy.networkFetchBlocked, true);
        assert.equal(offlineRequests, 0);
        await offlineContext.close();
        // Query through the actual password-login session and owner RLS. No
        // private-file admin key or configurable destination enters this request.
        const counters = await page.request.get(
          "http://127.0.0.1:54321/rest/v1/imagine_storage_accounts?select=user_id,used_bytes,reserved_bytes",
          {
            headers: {
              apikey: signedInSession.publicKey,
              Authorization: `Bearer ${signedInSession.accessToken}`,
            },
            maxRedirects: 0,
            timeout: 10000,
          },
        );
        assert.equal(counters.status(), 200);
        const accounts = await counters.json();
        assert.equal(accounts.length, 1);
        const [account] = accounts;
        assert.equal(account.user_id, config.accounts[0].id);
        assert.equal(
          account.used_bytes,
          (evidence.modes.length + 1) * 10485760,
        );
        assert.equal(account.reserved_bytes, 0);
        result.image = {
          offlinePolicy: {
            ...offlinePolicy,
            bypassCSP: false,
            externalRequests: offlineRequests,
          },
          byteSize: readBytes.length,
          sha256: originalDigest,
          naturalWidth: 1536,
          naturalHeight: 1024,
          editorBounds: imageBounds,
          offlineBounds: offlineImageBounds,
          putRequests: imagePutRequests,
          usedBytes: account.used_bytes,
          reservedBytes: account.reserved_bytes,
        };
        result.checks.push(
          "actual-client-token-private-sdk-10mib-original-save-reopen-export-lost-ack-single-charge",
        );
        await capture("image-reopened");
        await page.goto(documentUrl);
        await expect(title).toHaveValue("Continuity document");

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
        stage = "saved-native-back";
        await page.evaluate(() => history.back());
        await expect(title).toHaveValue("Saved in the other tab");
        await expect(editor).toHaveText(memory.content_text);
        stage = "saved-native-forward";
        await page.evaluate(() => history.forward());
        await page.waitForURL((url) => url.pathname === listPath);
        stage = "saved-native-return";
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
        assert.equal(
          (
            await second.request.get(
              `${config.base}${imageAddress}/${imageAsset.assetId}`,
            )
          ).status(),
          404,
        );
        assert.equal(
          (
            await second.request.get(
              `${config.base}${imageAddress}/${imageAsset.assetId}?metadata=1`,
            )
          ).status(),
          404,
        );
        assert.equal(
          (
            await second.request.post(`${config.base}${imageAddress}`, {
              data: { action: "complete", claim: imageClaim },
            })
          ).status(),
          404,
        );
        result.checks.push(
          "foreign-account-private-original-metadata-bytes-completion-denied",
        );
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
        stage = "public-marketing-footer-navigation";
        await page.goto(config.base);
        stage = "public-marketing-homepage-content-ready";
        await expect(
          page.getByRole("heading", {
            level: 1,
            name: "Build living worlds with AI agents.",
            exact: true,
          }),
        ).toBeVisible();
        // The below-fold chunk replaces its short placeholder after navigation.
        // Its final CTA must exist before measuring or scrolling the footer.
        await expect(
          page.getByRole("heading", {
            level: 2,
            name: "Your world is waiting.",
            exact: true,
          }),
        ).toBeAttached();
        result.publicHomepageReady = "final-below-fold-cta-present";
        const publicFooter = page.getByRole("contentinfo");
        stage = "public-marketing-footer-newsletter-visible";
        await expect(
          publicFooter.getByRole("textbox", {
            name: "Email address for Arcanea updates",
          }),
        ).toBeVisible();
        stage = "public-marketing-footer-subscribe-visible";
        await expect(
          publicFooter.getByRole("button", {
            name: "Subscribe",
            exact: true,
          }),
        ).toBeVisible();
        const newsletter = publicFooter.getByRole("textbox", {
          name: "Email address for Arcanea updates",
        });
        const inspectNewsletter = () =>
          newsletter.evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            const hit = document.elementFromPoint(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
            );
            return {
              passed: hit !== null && element.contains(hit),
              x: bounds.x,
              y: bounds.y,
              width: bounds.width,
              height: bounds.height,
              viewportWidth: window.innerWidth,
              viewportHeight: window.innerHeight,
              scrollY: window.scrollY,
              documentHeight: document.documentElement.scrollHeight,
              hitTag: hit?.tagName || null,
            };
          });
        stage = "public-marketing-footer-newsletter-scroll";
        await newsletter.evaluate((element) =>
          element.scrollIntoView({ block: "center", behavior: "instant" }),
        );
        stage = "public-marketing-footer-newsletter-hit-test";
        await expect
          .poll(async () => {
            const sample = await inspectNewsletter();
            // Geometry only: never put account or entered newsletter text in receipts.
            result.newsletterHitTest = sample;
            return sample.passed;
          })
          .toBe(true);
        stage = "public-marketing-footer-workspace-links-absent";
        await expect(
          page.getByRole("navigation", {
            name: "Workspace links",
          }),
        ).toHaveCount(0);
        result.checks.push(
          "project-footer-touch-keyboard-public-newsletter-preserved",
        );
        stage = "public-marketing-footer-capture";
        await expect(newsletter).toBeInViewport({ ratio: 1 });
        const beforeCapture = await inspectNewsletter();
        // Capture the tested viewport. Re-scrolling an entire tall footer for a
        // locator screenshot previously produced blank desktop captures.
        await capture("public-footer", { fullPage: false });
        stage = "public-marketing-footer-capture-still-hit-tested";
        const afterCapture = await inspectNewsletter();
        result.newsletterCapture = {
          scope: "current-newsletter-viewport",
          before: beforeCapture,
          after: afterCapture,
        };
        assert.equal(beforeCapture.passed, true);
        assert.equal(afterCapture.passed, true);
        assert.ok(Math.abs(afterCapture.y - beforeCapture.y) <= 1);
        await expect(newsletter).toBeInViewport({ ratio: 1 });
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
          await capture(`failed-${stage}`, {
            fullPage: stage !== "scrolled-document-controls",
          });
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
