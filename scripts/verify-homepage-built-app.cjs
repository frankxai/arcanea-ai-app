const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const { createRequire } = require("node:module");
const { resolve } = require("node:path");
const { chromium, expect } = createRequire(resolve("apps/web/package.json"))(
  "@playwright/test",
);
const {
  verifyWorldWorkbench,
} = require("./verify-world-workbench-browser.cjs");

const base = "http://127.0.0.1:3001";
const states = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile-375", viewport: { width: 375, height: 812 } },
  {
    name: "reduced-motion",
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  },
  {
    name: "forced-colors",
    viewport: { width: 375, height: 812 },
    forcedColors: "active",
  },
];
const sourceFiles = [
  "apps/web/app/page.tsx",
  "apps/web/app/home-experience.tsx",
  "apps/web/app/home.module.css",
  "apps/web/components/worlds/world-workbench.tsx",
  "apps/web/components/worlds/world-workbench.module.css",
  "scripts/verify-world-workbench-browser.cjs",
  "scripts/verify-homepage-built-app.cjs",
  "apps/web/app/worlds/create/page.tsx",
  "apps/web/lib/worlds/draft.ts",
  "apps/web/app/api/worlds/generate/route.ts",
  "apps/web/app/api/worlds/save/route.ts",
  "apps/web/app/auth/login/page.tsx",
  "apps/web/app/auth/signup/page.tsx",
  "scripts/verify-world-draft-browser.cjs",
  ".github/workflows/ci.yml",
];

function sourceEvidence() {
  const checkoutCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const event = process.env.GITHUB_EVENT_PATH
    ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"))
    : null;
  const reviewedSourceCommit = event?.pull_request?.head?.sha || checkoutCommit;
  assert.match(checkoutCommit, /^[a-f0-9]{40}$/);
  assert.match(reviewedSourceCommit, /^[a-f0-9]{40}$/);
  for (const path of sourceFiles) {
    const expected = execFileSync("git", [
      "show",
      `${reviewedSourceCommit}:${path}`,
    ]);
    assert.ok(
      fs.readFileSync(path).equals(expected),
      `Source mismatch: ${path}`,
    );
  }
  return {
    checkoutCommit,
    reviewedSourceCommit,
    sourceFilesMatchReviewedCommit: true,
    sourceFileSha256: Object.fromEntries(
      sourceFiles.map((path) => [
        path,
        crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex"),
      ]),
    ),
  };
}

(async () => {
  const output = "screenshots/homepage";
  fs.mkdirSync(output, { recursive: true });
  const source = sourceEvidence();
  const reports = [];
  const captures = [];
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try {
      const response = await fetch(base, { signal: AbortSignal.timeout(2000) });
      if (response.status === 200) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(ready, "Built Next homepage did not become ready");
  const browser = await chromium.launch();
  const capture = async (page, state, name) => {
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    });
    const path = `${output}/${name}-${state.name}.png`;
    await page.screenshot({ path, type: "png", fullPage: false });
    const bytes = fs.readFileSync(path);
    const provenance = {
      kind: "browser-screenshot",
      prompt: `Capture existing built UI: ${name}, ${state.name}, ${page.url()}`,
      model: null,
      provider: "Playwright Chromium",
      seed: null,
      agentSession: "01a0f74f-8bad-7db1-ab06-fd89b5faec84",
      ...source,
      viewport: state.viewport,
      reducedMotion: state.reducedMotion || "no-preference",
      forcedColors: state.forcedColors || "none",
      url: page.url(),
      bytes: bytes.length,
      sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    };
    fs.writeFileSync(
      `${path}.vis.provenance.json`,
      JSON.stringify(provenance, null, 2) + "\n",
    );
    captures.push({ path, ...provenance });
  };
  try {
    for (const state of states) {
      const context = await browser.newContext({
        viewport: state.viewport,
        reducedMotion: state.reducedMotion || "no-preference",
        forcedColors: state.forcedColors || "none",
        deviceScaleFactor: 1,
      });
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(20_000);
        page.setDefaultNavigationTimeout(30_000);
        reports.push(
          await verifyWorldWorkbench({ page, context, base, state, capture }),
        );
        await page.goto(base, { waitUntil: "domcontentloaded" });
        const concept = page.getByLabel("What makes your world different?");
        const feedback = page
          .locator('section[aria-labelledby="home-title"]')
          .getByRole("alert");
        await concept.fill("Tiny");
        await page
          .getByRole("button", { name: "Create a world", exact: true })
          .click();
        await expect(feedback).toContainText("a little more detail");
        await expect(concept).toBeFocused();
        const storageConcept =
          "A city where everyone shares one borrowed memory.";
        await page.evaluate(() => {
          const originalSetItem = Storage.prototype.setItem;
          Object.defineProperty(Storage.prototype, "setItem", {
            configurable: true,
            value(key, value) {
              if (key === "arcanea.world-concept") {
                throw new DOMException(
                  "Fixture blocks concept storage",
                  "SecurityError",
                );
              }
              return originalSetItem.call(this, key, value);
            },
          });
        });
        await concept.fill(storageConcept);
        await page
          .getByRole("button", { name: "Create a world", exact: true })
          .click();
        await expect(feedback).toContainText("Copy your concept");
        await expect(concept).toHaveValue(storageConcept);
        await expect(page).toHaveURL(base + "/");
        await expect(
          page.getByRole("link", { name: "Open world creator", exact: true }),
        ).toHaveAttribute("href", "/worlds/create");
        await capture(page, state, "storage-failure-recovery");
        reports[reports.length - 1].injectedConceptWriteFailureRetainsConcept =
          true;
        reports[reports.length - 1].shortConceptFocused = true;
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
    fs.writeFileSync(
      `${output}/report.json`,
      JSON.stringify(
        {
          scope:
            "Built Next CI checkout: authored-example interaction and anonymous concept recovery; not Vercel, real AI, live storage or creator acceptance",
          ...source,
          states,
          reports,
          captures,
        },
        null,
        2,
      ) + "\n",
    );
  }
  assert.equal(reports.length, states.length);
  console.log(
    `Verified authored homepage, related story changes, anonymous auth return and storage recovery in ${reports.length} Chromium contexts.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
