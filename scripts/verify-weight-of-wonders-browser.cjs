const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");

/** Runs against the real built Next app started by the existing CI capture loop. */
module.exports.verifyWeightOfWondersPreview = async ({
  page,
  context,
  base,
  state,
  verifyDiscovery = true,
}) => {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (message) => {
    if (message.type() === "error")
      consoleErrors.push({
        text: message.text(),
        location: message.location(),
      });
  };
  const onPageError = (error) => pageErrors.push(error.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  await page.addInitScript(() => {
    window.__weightOfWondersLab = {
      cls: 0,
      inp: 0,
      eventCount: 0,
      interactionCount: 0,
      interactionEventCount: 0,
      events: [],
      lcp: 0,
    };
    document.addEventListener(
      "click",
      () => {
        window.__weightOfWondersLab.interactionCount += 1;
      },
      { capture: true },
    );
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput)
          window.__weightOfWondersLab.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__weightOfWondersLab.lcp = entries.at(-1)?.startTime ?? 0;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__weightOfWondersLab.eventCount += 1;
        const target = entry.target;
        const targetText =
          target instanceof Element
            ? target.getAttribute("aria-label") ||
              target.closest("label")?.textContent ||
              target.textContent ||
              target.getAttribute("value") ||
              ""
            : "";
        window.__weightOfWondersLab.events.push({
          name: entry.name,
          interactionId: entry.interactionId,
          startTime: entry.startTime,
          duration: entry.duration,
          target:
            target instanceof Element
              ? {
                  tag: target.tagName.toLowerCase(),
                  id: target.id || null,
                  type: target.getAttribute("type"),
                  text: targetText.trim().replace(/\s+/gu, " ").slice(0, 120),
                }
              : null,
        });
        if (!(entry.interactionId > 0)) continue;
        window.__weightOfWondersLab.interactionEventCount += 1;
        window.__weightOfWondersLab.inp = Math.max(
          window.__weightOfWondersLab.inp,
          entry.duration,
        );
      }
    }).observe({ type: "event", buffered: true, durationThreshold: 16 });
  });

  try {
    if (verifyDiscovery) {
      const response = await page.goto(`${base}/gallery`, {
        waitUntil: "domcontentloaded",
      });
      assert.equal(response.status(), 200);
      await page
        .getByRole("heading", { name: "The Weight of Wonders", exact: true })
        .waitFor();
      await page
        .getByRole("link", {
          name: "Explore the atlas and encounter desk",
          exact: true,
        })
        .click();
      await page.waitForURL(`${base}/gallery/weight-of-wonders`);
    } else {
      const response = await page.goto(`${base}/gallery/weight-of-wonders`, {
        waitUntil: "domcontentloaded",
      });
      assert.equal(response.status(), 200);
    }
    await page
      .getByRole("heading", { name: "The Weight of Wonders", exact: true })
      .waitFor();
    await page
      .getByText("EXPERIMENTAL / Proposed trilogy", { exact: true })
      .waitFor();
    const hero = page
      .locator('section[aria-labelledby="wonders-title"] img')
      .first();
    await hero.evaluate((image) => image.decode());
    const collectionOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    assert.ok(collectionOverflow, "Weight of Wonders collection reflows");
    const collectionPerformance = await page.evaluate(
      () => window.__weightOfWondersLab,
    );

    await page
      .locator("#atlas a")
      .filter({ hasText: "Orvess" })
      .first()
      .click();
    await page.waitForURL(`${base}/gallery/weight-of-wonders/orvess`);
    await page
      .getByRole("heading", { name: "Orvess", exact: true, level: 1 })
      .waitFor();
    await page
      .getByText("EXPERIMENTAL / Encounter concept", { exact: false })
      .waitFor();
    await page
      .locator("[data-orientation] img")
      .evaluate((image) => image.decode());
    const dossierOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    assert.ok(dossierOverflow, "Weight of Wonders dossier reflows");

    const phaseButtons = page.getByRole("button", { name: /^Phase \d/u });
    assert.equal(await phaseButtons.count(), 3);
    await phaseButtons.nth(1).click();
    await page
      .locator("p")
      .filter({
        hasText:
          /^Opening an emergency bypass exposes the damaged hip regulator\./u,
      })
      .waitFor();

    await phaseButtons.nth(0).focus();
    await page.keyboard.press("Tab");
    assert.ok(
      await phaseButtons
        .nth(1)
        .evaluate((element) => element === document.activeElement),
      "Phase controls retain visible keyboard order",
    );
    const radios = page.getByRole("radio");
    await radios.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    assert.ok(
      await radios.nth(1).isChecked(),
      "Native outcome radios support keyboard choice",
    );
    await page.getByRole("radio", { name: /Destroy Orvess/u }).check();
    const manualBrief = page.getByLabel("Manual copy", { exact: true });
    await manualBrief.waitFor();
    assert.ok(
      (await manualBrief.inputValue()).includes(
        "SELECTED OUTCOME\nDestroy Orvess",
      ),
      "Chosen outcome updates the copy-ready brief",
    );
    await manualBrief.click();
    assert.ok(
      await manualBrief.evaluate(
        (element) =>
          element.selectionStart === 0 &&
          element.selectionEnd === element.value.length,
      ),
      "Visible manual fallback selects the full brief",
    );
    await context.grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: base,
    });
    await page.getByRole("button", { name: "Copy brief", exact: true }).click();
    await page.getByText("Copied to clipboard", { exact: true }).waitFor();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(
      copied.includes("Destroy Orvess"),
      "Clipboard receives selected outcome",
    );
    await page.getByRole("radio", { name: /Repair the protector/u }).check();
    await page.getByText("Ready to copy", { exact: true }).waitFor();
    assert.ok(
      (await manualBrief.inputValue()).includes(
        "SELECTED OUTCOME\nRepair the protector",
      ),
      "Editing the brief clears the previous clipboard success state",
    );
    await page.getByRole("radio", { name: /Destroy Orvess/u }).check();

    const rejectionPage = await context.newPage();
    try {
      await rejectionPage.addInitScript(() => {
        Object.defineProperty(navigator, "clipboard", {
          configurable: true,
          value: {
            writeText: async () => {
              throw new Error("Test clipboard rejection");
            },
          },
        });
      });
      await rejectionPage.goto(`${base}/gallery/weight-of-wonders/orvess`, {
        waitUntil: "domcontentloaded",
      });
      await rejectionPage
        .getByRole("heading", { name: "Orvess", exact: true, level: 1 })
        .waitFor();
      const rejectionBrief = rejectionPage.getByLabel("Manual copy", {
        exact: true,
      });
      await rejectionPage
        .getByRole("button", { name: "Copy brief", exact: true })
        .click();
      await rejectionPage
        .getByText(
          "Clipboard unavailable. Select the brief below and copy it manually.",
          { exact: true },
        )
        .waitFor();
      await rejectionBrief.click();
      assert.ok(
        await rejectionBrief.evaluate(
          (element) =>
            element.selectionStart === 0 &&
            element.selectionEnd === element.value.length,
        ),
        "Clipboard rejection keeps the selectable manual fallback",
      );
    } finally {
      await rejectionPage.close();
    }

    const typography = await page.evaluate(async () => {
      await document.fonts.ready;
      const sample = (element) => {
        const style = getComputedStyle(element);
        return {
          family: style.fontFamily,
          weight: style.fontWeight,
          size: style.fontSize,
          lineHeight: style.lineHeight,
        };
      };
      return {
        documentFontsStatus: document.fonts.status,
        heading: sample(document.querySelector("h1")),
        body: sample(document.body),
        control: sample(document.querySelector("[aria-pressed]")),
        manualBrief: sample(document.querySelector("textarea[readonly]")),
      };
    });
    assert.doesNotMatch(
      `${typography.heading.family} ${typography.body.family}`,
      /Arial|Inter|Space Grotesk|Cinzel/iu,
      "Computed typography follows Arcanea's current font contract",
    );
    assert.equal(typography.documentFontsStatus, "loaded");
    assert.match(typography.heading.family, /Instrument Serif/iu);
    assert.equal(typography.heading.weight, "400");
    assert.match(typography.body.family, /Geist/iu);
    assert.match(typography.control.family, /Geist/iu);
    assert.match(typography.manualBrief.family, /Geist Mono/iu);
    for (const sample of [
      typography.heading,
      typography.body,
      typography.control,
      typography.manualBrief,
    ]) {
      assert.ok(sample.family.length > 0, "Computed font family is present");
      assert.match(sample.weight, /^\d+$/u, "Computed font weight is numeric");
      assert.ok(parseFloat(sample.size) > 0, "Computed font size is positive");
      assert.ok(
        sample.lineHeight === "normal" || parseFloat(sample.lineHeight) > 0,
        "Computed line height is present",
      );
    }
    const controlMotion = await phaseButtons.nth(0).evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        transitionDuration: style.transitionDuration,
      };
    });
    assert.equal(
      controlMotion.animationName,
      "none",
      "No decorative control motion",
    );
    if (state === "reduced-motion")
      assert.equal(
        controlMotion.transitionDuration,
        "0s",
        "Reduced-motion controls are static",
      );

    const dossierPerformance = await page.evaluate(
      () => window.__weightOfWondersLab,
    );
    assert.ok(
      dossierPerformance.interactionCount > 0,
      "Lab observation includes real interactions",
    );
    const interactionGroups = [];
    for (const event of dossierPerformance.events) {
      if (!(event.interactionId > 0)) continue;
      let group = interactionGroups.find(
        (candidate) => candidate.interactionId === event.interactionId,
      );
      if (!group) {
        group = {
          interactionId: event.interactionId,
          valueMs: 0,
          events: [],
        };
        interactionGroups.push(group);
      }
      group.valueMs = Math.max(group.valueMs, event.duration);
      group.events.push(event);
    }
    interactionGroups.sort((left, right) => right.valueMs - left.valueMs);
    const inpObservation =
      interactionGroups.length > 0
        ? {
            status: "measured",
            valueMs: interactionGroups[0].valueMs,
            eventCount: dossierPerformance.interactionEventCount,
            interactionCount: interactionGroups.length,
            slowestInteraction: interactionGroups[0],
          }
        : {
            status: "below-observer-threshold",
            valueMs: null,
            upperBoundMs: 16,
            eventCount: 0,
            interactionCount: 0,
            slowestInteraction: null,
          };
    const interactionLatencyWithinBudget =
      inpObservation.valueMs === null || inpObservation.valueMs <= 200;
    const report = {
      state,
      url: page.url(),
      viewport: page.viewportSize(),
      devicePixelRatio: await page.evaluate(() => window.devicePixelRatio),
      collectionNavigation: true,
      dossierNavigation: true,
      phaseNavigation: true,
      selectedOutcome: "destroy",
      clipboardSuccess: true,
      clipboardRejection: true,
      manualCopyFallback: true,
      keyboardFocus: true,
      collectionOverflow,
      dossierOverflow,
      typography,
      controlMotion,
      performance: {
        scope: "Local built-app lab observation; not field data",
        collection: collectionPerformance,
        dossier: {
          measurementScope:
            "Gallery discovery, collection-to-dossier navigation, and Orvess phase, keyboard outcome, manual selection, clipboard and outcome-reset interactions",
          cls: dossierPerformance.cls,
          lcp: dossierPerformance.lcp,
          clickCount: dossierPerformance.interactionCount,
          inp: inpObservation,
          gate: {
            thresholdMs: 200,
            passed: interactionLatencyWithinBudget,
          },
          rawEventCount: dossierPerformance.eventCount,
          interactionEventCount: dossierPerformance.interactionEventCount,
          events: dossierPerformance.events,
        },
      },
    };

    if (state === "desktop") {
      const read = async (query) => {
        const apiResponse = await context.request.get(
          `${base}/api/lore/weight-of-wonders${query}`,
        );
        assert.equal(
          apiResponse.status(),
          200,
          "Public reader requires no login",
        );
        return apiResponse.json();
      };
      const [none, proposals, all] = await Promise.all([
        read(""),
        read("?includeProposals=true"),
        read("?includeProposals=true&includeExperimental=true"),
      ]);
      assert.deepEqual([none.total, proposals.total, all.total], [0, 0, 6]);
      assert.equal(all.canonStatus, "EXPERIMENTAL");
      report.api = { default: 0, proposals: 0, all: 6 };
      report.assets = [];
      for (const entry of all.entries) {
        const assetResponse = await context.request.get(
          `${base}${entry.image.src}`,
        );
        assert.equal(
          assetResponse.status(),
          200,
          `${entry.id}: artwork response`,
        );
        const bytes = await assetResponse.body();
        const hash = crypto.createHash("sha256").update(bytes).digest("hex");
        assert.equal(
          hash,
          entry.image.sha256,
          `${entry.id}: delivered artwork hash`,
        );
        report.assets.push({
          id: entry.id,
          status: assetResponse.status(),
          bytes: bytes.length,
          sha256: hash,
        });
      }
    }
    const localTelemetryPaths = new Set([
      "/_vercel/speed-insights/script.js",
      "/_vercel/insights/script.js",
    ]);
    const baseUrl = new URL(base);
    const expectedLocalInfrastructureErrors = consoleErrors.filter((error) => {
      if (baseUrl.origin !== "http://127.0.0.1:3001") return false;
      try {
        const locationUrl = new URL(error.location.url);
        return (
          locationUrl.origin === baseUrl.origin &&
          localTelemetryPaths.has(locationUrl.pathname)
        );
      } catch {
        return false;
      }
    });
    const unexpectedConsoleErrors = consoleErrors.filter(
      (error) => !expectedLocalInfrastructureErrors.includes(error),
    );
    report.browserDiagnostics = {
      rawConsoleErrors: consoleErrors,
      expectedLocalInfrastructureErrors,
      unexpectedConsoleErrors,
      pageErrors,
      gatePassed:
        unexpectedConsoleErrors.length === 0 && pageErrors.length === 0,
      productionTelemetryVerification:
        "Separate production check must confirm both Vercel telemetry scripts return HTTP 200",
    };
    fs.writeFileSync(
      `screenshots/weight-of-wonders-checks-${state}.json`,
      JSON.stringify(report, null, 2) + "\n",
    );
    return report;
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
};
