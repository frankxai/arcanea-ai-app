const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { createHash } = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);

const base = "http://127.0.0.1:3001";
const output = "screenshots/community-capture";
const email = "builder@example.invalid";
const success = "Your interest in Arcanea updates is saved.";
const failure = "We couldn't confirm your signup. Please try again.";
const timeout =
  "The request timed out. Your signup may have been saved; retrying is safe.";
const modes = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  {
    name: "mobile-375",
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
  },
  {
    name: "reduced-motion",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  },
];

async function verifyMode(browser, mode, evidence) {
  const { name, ...options } = mode;
  const context = await browser.newContext({
    ...options,
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const row = { mode: name, cases: [], requests: [], errors: [] };
  evidence.modes.push(row);
  const fixtures = [];
  const held = [];
  page.on("pageerror", (error) => row.errors.push(error.message));

  // Intercept every write. Real rendered form, fixture transport: no database,
  // email delivery, paid-demand or live-signup evidence is claimed.
  await context.route("**/*", async (route) => {
    const request = route.request();
    if (["GET", "HEAD"].includes(request.method())) return route.continue();
    if (request.url() !== `${base}/api/waitlist`) {
      row.errors.push(`Unexpected write: ${request.method()} ${request.url()}`);
      return route.abort();
    }
    row.requests.push({
      method: request.method(),
      body: request.postDataJSON(),
    });
    const fixture = fixtures.shift();
    if (!fixture) {
      row.errors.push("Waitlist write had no fixture");
      return route.abort();
    }
    if (fixture.hold) {
      held.push(route);
      return;
    }
    if (fixture.abort) return route.abort("connectionreset");
    return route.fulfill({
      status: fixture.status,
      contentType: "application/json",
      body: JSON.stringify(fixture.body),
    });
  });

  try {
    await page.goto(`${base}/community`, { waitUntil: "domcontentloaded" });
    const main = page.getByRole("main");
    const links = await main.locator("a[href]").evaluateAll((nodes) =>
      nodes.map((node) => ({
        href: node.getAttribute("href"),
        target: node.getAttribute("target"),
      })),
    );
    const repo = "https://github.com/frankxai/arcanea-ai-app";
    const githubLinks = links.filter((link) =>
      link.href.startsWith("https://github.com/"),
    );
    assert.ok(githubLinks.length > 0);
    assert.ok(
      githubLinks.every(
        (link) => link.href === repo || link.href.startsWith(repo + "/"),
      ),
    );
    assert.ok(links.every((link) => !link.href.includes("discord.gg")));
    assert.ok(
      links
        .filter(
          (link) => link.href.startsWith("/") || link.href.startsWith("#"),
        )
        .every((link) => !link.target || link.target === "_self"),
    );
    for (const folder of ["apps/web", "book", "packages", "docs"])
      assert.ok(
        githubLinks.some((link) => link.href === repo + "/tree/main/" + folder),
      );
    await expect(
      main.getByRole("heading", { name: "Gathering ideas", exact: true }),
    ).toBeVisible();
    await expect(main).toContainText(
      "These formats are proposals. No dates are announced here.",
    );
    await expect(
      main.getByRole("heading", { name: "Creation ideas", exact: true }),
    ).toBeVisible();
    const copy = await main.innerText();
    assert.ok(
      !/fully open source|governance rights|vote on canon decisions|Resonance Mage|Archive Walker|Solfeggio Wanderer/i.test(
        copy,
      ),
    );
    row.cases.push({
      name: "canonical repository, same-tab local links and honest proposal status",
      links,
    });

    const interest = main.getByRole("link", {
      name: "Register interest",
      exact: true,
    });
    await interest.scrollIntoViewIfNeeded();
    if (mode.hasTouch) await interest.tap();
    else {
      await interest.focus();
      await expect(interest).toBeFocused();
      await interest.press("Enter");
    }
    await expect(page).toHaveURL(base + "/community#community-updates");
    await expect(main.locator("#community-updates")).toBeInViewport();
    assert.equal(context.pages().length, 1);
    row.cases.push({
      name: "hero interest action reaches the signup in the same tab",
    });

    for (const destination of ["/books", "/library"]) {
      await page.goto(base + "/community", { waitUntil: "domcontentloaded" });
      const link = page
        .getByRole("main")
        .locator('a[href="' + destination + '"]')
        .first();
      if (mode.hasTouch) await link.tap();
      else {
        await link.focus();
        await expect(link).toBeFocused();
        await link.press("Enter");
      }
      await expect(page).toHaveURL(base + destination);
      await expect(page).toHaveTitle(
        destination === "/books" ? /Books.*Arcanea/ : /Library of Arcanea/,
      );
      const heading = page.getByRole("heading", { level: 1 }).first();
      await expect(heading).toBeVisible();
      assert.ok((await heading.innerText()).trim().length > 0);
      assert.equal(context.pages().length, 1);
      row.cases.push({
        name: "reader entry opens " + destination,
        title: await page.title(),
        heading: await heading.innerText(),
      });
    }
    await page.goto(base + "/community", { waitUntil: "domcontentloaded" });
    const form = page.getByRole("form", { name: "Arcanea updates signup" });
    const input = form.getByRole("textbox", { name: "Email address" });
    const button = form.getByRole("button", { name: "Keep me updated" });
    const message = form.locator("p");
    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
    const ids = await form.evaluate((element) => {
      const control = element.querySelector("input");
      const description = document.getElementById(
        control.getAttribute("aria-describedby"),
      );
      return {
        input: control.id,
        label: element.querySelector("label").htmlFor,
        status: description?.id,
        statusWithinForm: element.contains(description),
        uniqueInput: [...document.querySelectorAll("input")].filter(
          (item) => item.id === control.id,
        ).length,
      };
    });
    assert.equal(ids.input, ids.label);
    assert.equal(ids.uniqueInput, 1);
    assert.ok(ids.status && ids.statusWithinForm);
    row.cases.push({ name: "associated label and live description", ids });

    async function activate() {
      if (mode.hasTouch) await button.tap();
      else {
        await input.focus();
        await expect(input).toBeFocused();
        await input.press("Enter");
      }
    }
    await activate();
    assert.equal(
      await input.evaluate((node) => node.validity.valueMissing),
      true,
    );
    await input.fill("not-an-email");
    await activate();
    assert.equal(
      await input.evaluate((node) => node.validity.typeMismatch),
      true,
    );
    assert.equal(row.requests.length, 0);
    row.cases.push({
      name: "native required and email validation prevents writes",
    });

    await input.fill(email);
    fixtures.push({ hold: true });
    await activate();
    await expect(form).toHaveAttribute("aria-busy", "true");
    await expect(input).toBeDisabled();
    await expect(
      form.getByRole("button", { name: "Saving..." }),
    ).toBeDisabled();
    await expect.poll(() => row.requests.length).toBe(1);
    await form.evaluate((node) => node.requestSubmit());
    assert.equal(row.requests.length, 1);
    await held.shift().fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
    await expect(message).toHaveText(success);
    await expect(input).toHaveValue("");
    await expect(button).toBeEnabled();
    await expect(form).toHaveAttribute("aria-busy", "false");
    assert.equal(row.requests.length, 1);
    row.cases.push({
      name: "one pending submission and confirmed save clears input",
    });

    for (const fixture of [
      {
        name: "HTTP failure despite success body",
        status: 503,
        body: { success: true },
      },
      {
        name: "nonliteral success receipt",
        status: 200,
        body: { success: "true" },
      },
      { name: "connection loss", abort: true },
    ]) {
      await input.fill(email);
      fixtures.push(fixture);
      await activate();
      await expect(message).toHaveText(failure);
      await expect(message).toHaveAttribute("role", "alert");
      await expect(input).toHaveValue(email);
      await expect(button).toBeEnabled();
      fixtures.push({ status: 200, body: { success: true } });
      await activate();
      await expect(message).toHaveText(success);
      await expect(input).toHaveValue("");
      row.cases.push({
        name: `${fixture.name}: address retained, retry succeeds`,
      });
    }

    await input.fill(email);
    fixtures.push({ hold: true });
    const began = Date.now();
    await activate();
    await expect(form).toHaveAttribute("aria-busy", "true");
    await expect(message).toHaveText(timeout, { timeout: 15_000 });
    const elapsedMs = Date.now() - began;
    assert.ok(
      elapsedMs >= 9_000,
      "Exercise the actual ten-second browser deadline",
    );
    await expect(input).toHaveValue(email);
    await expect(button).toBeEnabled();
    fixtures.push({ status: 200, body: { success: true } });
    await activate();
    await expect(message).toHaveText(success);
    row.cases.push({
      name: "real timeout acknowledges uncertain save and permits retry",
      elapsedMs,
    });

    // A receipt for the previous address must not describe a new unsaved one.
    await input.fill("another-builder@example.invalid");
    await expect(message).toHaveText("");
    await expect(message).toHaveAttribute("role", "status");
    row.cases.push({
      name: "editing a new address clears the previous save receipt",
    });

    const bounds = await form.evaluate((element) =>
      [...element.querySelectorAll("input, button, p")].map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          left: rect.left,
          right: rect.right,
          viewport: innerWidth,
        };
      }),
    );
    assert.ok(
      bounds.every(
        (item) => item.left >= -1 && item.right <= item.viewport + 1,
      ),
    );
    for (const request of row.requests) {
      assert.equal(request.method, "POST");
      assert.deepEqual(request.body, { email, source: "community_footer" });
    }
    assert.equal(fixtures.length, 0);
    assert.equal(row.requests.length, 9);
    row.cases.push({
      name: "controls fit viewport and all nine payloads retain community source",
      bounds,
    });
    assert.deepEqual(row.errors, []);
    row.passed = true;
  } catch (error) {
    row.errors.push(error.stack || error.message);
    row.passed = false;
  } finally {
    await context.close();
  }
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const event = process.env.GITHUB_EVENT_PATH
    ? JSON.parse(await fs.readFile(process.env.GITHUB_EVENT_PATH, "utf8"))
    : {};
  const evidence = {
    builtCommit: execFileSync("git", ["rev-parse", "HEAD"]).toString().trim(),
    reviewedSourceCommit:
      event.pull_request?.head?.sha || process.env.GITHUB_SHA || null,
    environment:
      "production-built Next app; intercepted transport; no live writes",
    sources: {},
    browser: null,
    modes: [],
    errors: [],
  };
  let browser;
  try {
    for (const path of [
      "apps/web/app/community/community-data.ts",
      "apps/web/app/community/community-overview.tsx",
      "apps/web/app/community/page.tsx",
      "apps/web/components/community/newsletter-form.tsx",
      "apps/web/lib/waitlist/submit.ts",
      "scripts/verify-community-capture-browser.cjs",
    ])
      evidence.sources[path] = createHash("sha256")
        .update(await fs.readFile(path))
        .digest("hex");
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try {
        const response = await fetch(`${base}/community`, {
          signal: AbortSignal.timeout(2_000),
        });
        if (response.ok) break;
      } catch {}
      if (attempt === 59) throw new Error("Built app did not become ready");
      await new Promise((resolveWait) => setTimeout(resolveWait, 500));
    }
    browser = await chromium.launch();
    evidence.browser = browser.version();
    for (const mode of modes) await verifyMode(browser, mode, evidence);
    evidence.passed =
      evidence.modes.length === modes.length &&
      evidence.modes.every((row) => row.passed);
  } catch (error) {
    evidence.errors.push(error.stack || error.message);
    evidence.passed = false;
  } finally {
    if (browser) await browser.close();
    await fs.writeFile(
      `${output}/evidence.json`,
      JSON.stringify(evidence, null, 2) + "\n",
    );
  }
  console.log(JSON.stringify(evidence));
  if (!evidence.passed) process.exitCode = 1;
})();
