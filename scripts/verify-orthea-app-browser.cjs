const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { createRequire } = require("node:module");

async function waitForServer(base) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      return await fetch(`${base}/lab/orthea`, {
        signal: AbortSignal.timeout(2000),
      });
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("The owned Next server did not start.");
}

async function main() {
  const production = process.argv.includes("--production");
  const base = production ? "http://127.0.0.1:3002" : "http://127.0.0.1:3001";
  const response = await waitForServer(base);
  if (production) {
    assert.equal(
      response.status,
      404,
      "Production cannot render the restricted study",
    );
    assert.equal(await response.text(), "Not found");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(response.headers.get("x-robots-tag") || "", /noindex/);
    const flight = await fetch(`${base}/lab/orthea?_rsc=boundary-check`, {
      headers: { RSC: "1" },
      signal: AbortSignal.timeout(5000),
    });
    assert.equal(flight.status, 404, "Flight requests use the same denial");
    assert.equal(await flight.text(), "Not found");
    console.log("Orthea production route returns 404.");
    return;
  }
  assert.equal(response.status, 200, "Preview route renders in the built app");
  const output = path.resolve("screenshots/orthea");
  await fs.mkdir(output, { recursive: true });
  const { chromium, expect } = createRequire(
    path.resolve("apps/web/package.json"),
  )("@playwright/test");
  const engine = await import("../apps/web/lib/encounters/orthea-engine.mjs");
  const report = {
    builtCommit: process.env.GITHUB_SHA || null,
    checks: [],
    screenshots: [],
  };
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1365, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(7000);
    const pageErrors = [];
    const writes = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("request", (request) => {
      if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(request.method()) &&
        new URL(request.url()).pathname.includes("orthea")
      )
        writes.push(request.url());
    });
    await page.goto(`${base}/lab/orthea`, { waitUntil: "networkidle" });
    const encounter = page.getByRole("region", {
      name: "Playable load-transfer encounter",
      exact: true,
    });
    const button = (name) =>
      encounter.getByRole("button", { name, exact: true });
    const move = (name) =>
      encounter.getByRole("button", { name: new RegExp(`^${name} `) });
    const step = button("Advance 1 second");
    await expect(button("Start live play")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(encounter.getByTestId("reserve")).toHaveText("12");
    report.checks.push(
      "Actual preview route, noindex metadata and initial reserve",
    );

    for (const [name, width, height] of [
      ["desktop", 1365, 900],
      ["mobile", 375, 812],
    ]) {
      await page.setViewportSize({ width, height });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${name}: no horizontal overflow`,
      );
      const smallButtons = await encounter
        .locator("button:visible")
        .evaluateAll((buttons) =>
          buttons
            .filter((item) => item.getBoundingClientRect().height < 43.99)
            .map((item) => item.textContent),
        );
      assert.deepEqual(
        smallButtons,
        [],
        `${name}: buttons are at least 44px high`,
      );
      await page.screenshot({
        path: path.join(output, `${name}-entry.png`),
      });
      report.screenshots.push(`${name}-entry.png`);
    }
    report.checks.push(
      "Desktop and 375px mobile render without overflow and retain touch targets",
    );

    await page.setViewportSize({ width: 1365, height: 900 });
    await move("Harbor").focus();
    await page.keyboard.press("Enter");
    await button("Open this sluice").click();
    await move("Aqueduct").click();
    await button("Open this sluice").click();
    await move("Harbor").click();
    const transfer = button("Send 1 unit to aqueduct");
    await transfer.focus();
    await page.keyboard.press("Enter");
    await expect(transfer).toBeFocused();
    for (let index = 0; index < 4; index += 1) await transfer.click();
    await move("Aqueduct").click();
    for (let index = 0; index < 3; index += 1)
      await button("Send 1 unit to family dock").click();
    await move("Family dock").click();
    await button("Open the family dock").click();
    await move("Perimeter refuge").click();
    await button("Pin the counterweight").click();
    await expect(encounter.getByRole("progressbar")).toHaveAttribute(
      "value",
      "0",
    );
    report.checks.push(
      "Native keyboard actions retain focus and complete the three-sluice balance lesson",
    );

    await page.setViewportSize({ width: 375, height: 812 });
    await button("To dock wheel").click();
    for (let index = 0; index < 3; index += 1) await step.click();
    await expect(
      encounter.getByText("Footfall on Family dock", { exact: true }),
    ).toBeVisible();
    await button("To refuge").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, "mobile-footfall.png") });
    report.screenshots.push("mobile-footfall.png");
    // Miss the first committed cue deliberately to verify recoverable failure.
    await step.click();
    await step.click();
    await expect(move("Perimeter refuge")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(encounter.getByText(/1 recoverable falls/)).toBeVisible();
    await expect(encounter.getByTestId("reserve")).toHaveText("12");
    for (
      let index = 0;
      index < 60 &&
      !(await page
        .getByRole("heading", { name: "The supply survives.", exact: true })
        .count());
      index += 1
    ) {
      const target = await encounter
        .getByText("Footfall on Family dock", { exact: true })
        .count();
      const action = button(target ? "To refuge" : "To dock wheel");
      if (await action.isEnabled()) await action.click();
      await step.click();
    }
    await expect(
      page.getByRole("heading", { name: "The supply survives.", exact: true }),
    ).toBeVisible();
    await expect(step).toHaveCount(0);
    await expect(
      encounter.getByRole("button", { name: "Open this sluice", exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("heading", { name: "The supply survives.", exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, "mobile-ending.png") });
    report.screenshots.push("mobile-ending.png");
    await page.setViewportSize({ width: 1365, height: 900 });
    const desktopEnding = page.getByRole("heading", {
      name: "The supply survives.",
      exact: true,
    });
    await desktopEnding.evaluate((heading) =>
      heading.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    const endingBounds = await desktopEnding.boundingBox();
    const toolbarBounds = await encounter
      .getByTestId("orthea-toolbar")
      .boundingBox();
    assert.ok(
      endingBounds &&
        toolbarBounds &&
        endingBounds.y > toolbarBounds.y + toolbarBounds.height + 16,
      "The desktop ending is visible below the sticky controls",
    );
    await page.screenshot({ path: path.join(output, "desktop-ending.png") });
    report.screenshots.push("desktop-ending.png");
    await page.setViewportSize({ width: 375, height: 812 });
    report.checks.push(
      "Mobile refuge/return controls, recoverable fall and complete supply-saved ending through real actions",
    );

    await encounter
      .getByRole("link", { name: "Keep this world state", exact: true })
      .click();
    await expect(button("Download snapshot")).toBeInViewport();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      button("Download snapshot").click(),
    ]);
    const snapshotPath = path.join(output, "played-snapshot.json");
    await download.saveAs(snapshotPath);
    const snapshot = await fs.readFile(snapshotPath, "utf8");
    assert.equal(engine.importProof(snapshot).outcome, "supply-saved");
    await button("Begin again").click();
    await encounter.locator('input[type="file"]').setInputFiles(snapshotPath);
    await expect(
      encounter.getByText("Snapshot reopened locally. Time is paused.", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The supply survives.", exact: true }),
    ).toBeVisible();
    const hostile = JSON.parse(snapshot);
    hostile.state.message =
      '<img src=x onerror="alert(1)"> Imported text only.';
    await encounter.locator('input[type="file"]').setInputFiles({
      name: "status.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(hostile)),
    });
    await expect(
      encounter.getByText(hostile.state.message, { exact: true }),
    ).toBeVisible();
    assert.equal(await encounter.locator("img").count(), 0);
    await encounter.locator('input[type="file"]').setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{}"),
    });
    await expect(encounter.getByText(/Snapshot not opened:/)).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The supply survives.", exact: true }),
    ).toBeVisible();
    report.checks.push(
      "Real download/reopen, unchanged standalone format, hostile text escaped and invalid file preserves state",
    );

    await button("Begin again").click();
    await move("Harbor").click();
    await button("Open this sluice").click();
    await move("Aqueduct").click();
    await button("Open this sluice").click();
    await move("Perimeter refuge").click();
    await encounter.getByText("The costly way out", { exact: true }).click();
    await button("Drain the clean reserve").click();
    await expect(encounter.getByTestId("reserve")).toHaveText("0");
    await expect(
      page.getByRole("heading", {
        name: "The harbor survives. The reserve does not.",
        exact: true,
      }),
    ).toBeVisible();
    report.checks.push(
      "The deliberate reserve-lost ending is distinct and freezes play",
    );

    await button("Begin again").click();
    await button("Start live play").click();
    await expect
      .poll(() => encounter.getByTestId("elapsed").innerText())
      .not.toBe("0.0");
    await move("Harbor").focus();
    await page.waitForTimeout(350);
    await expect(move("Harbor")).toBeFocused();
    await button("Pause live play").click();
    const paused = await encounter.getByTestId("elapsed").innerText();
    await page.waitForTimeout(350);
    assert.equal(await encounter.getByTestId("elapsed").innerText(), paused);
    report.checks.push(
      "Live ticks retain keyboard focus; pause stops actual time advancement",
    );

    await page.evaluate(() => {
      const original = File.prototype.text;
      File.prototype.text = async function () {
        const value = await original.call(this);
        await new Promise((resolve) => setTimeout(resolve, 350));
        return value;
      };
    });
    await encounter.locator('input[type="file"]').setInputFiles(snapshotPath);
    await button("Begin again").click();
    await page.waitForTimeout(500);
    await expect(encounter.getByTestId("elapsed")).toHaveText("0.0");
    await expect(
      page.getByRole("heading", { name: "The supply survives.", exact: true }),
    ).toHaveCount(0);
    report.checks.push(
      "A late file read cannot replace a newly restarted encounter",
    );

    await page.setViewportSize({ width: 1365, height: 900 });
    await button("Start live play").click();
    await page
      .getByRole("link", { name: "Gallery", exact: true })
      .last()
      .click();
    await page.waitForURL("**/gallery");
    await page.goBack();
    await expect(button("Start live play")).toBeVisible();
    await expect(encounter.getByTestId("elapsed")).toHaveText("0.0");
    report.checks.push(
      "App navigation exits the encounter and returns to a paused fresh session",
    );
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(writes, []);
    report.checks.push("No browser page errors or encounter write requests");
    await context.close();
  } finally {
    await browser.close();
    await fs.writeFile(
      path.join(output, "report.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
  }
  console.log(`Orthea app: ${report.checks.length} browser checks passed.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
