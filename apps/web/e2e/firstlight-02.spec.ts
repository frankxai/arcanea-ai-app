import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const gallery = "/gallery/firstlight-02";
const evidenceDir = process.env.FIRSTLIGHT_EVIDENCE_DIR;

test("capture the existing gallery before Firstlight publication", async ({
  page,
}, info) => {
  test.skip(
    process.env.FIRSTLIGHT_CAPTURE_BASELINE !== "1",
    "Run explicitly before the production release.",
  );
  await page.goto("https://www.arcanea.ai/gallery", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByRole("heading", { name: "The Sovereign Depths", exact: true }),
  ).toBeVisible();
  if (evidenceDir) await mkdir(evidenceDir, { recursive: true });
  await page.screenshot({
    path: evidenceDir
      ? join(evidenceDir, `before-gallery-${info.project.name}.png`)
      : info.outputPath("before-gallery.png"),
  });
});

test("browse, inspect, share and compare the complete twenty-image cast", async ({
  page,
}, info) => {
  await page.goto(gallery, { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { level: 1, name: "The Kindred Realms" }),
  ).toBeVisible();
  await expect(page.locator("#characters article[data-category]")).toHaveCount(
    10,
  );
  await expect(page.locator("#characters img")).toHaveCount(10);
  if (evidenceDir) await mkdir(evidenceDir, { recursive: true });
  for (const image of await page.locator("#characters img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((element: HTMLImageElement) => element.naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: evidenceDir
      ? join(evidenceDir, `after-gallery-${info.project.name}.png`)
      : info.outputPath("after-gallery.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Companions", exact: true }).click();
  await expect(page.locator("#characters article[data-category]")).toHaveCount(
    6,
  );
  await expect(page).toHaveURL(/category=companion/);
  await page
    .getByRole("searchbox", { name: "Search characters and team roles" })
    .fill("Seli");
  await expect(page.locator("#characters article[data-category]")).toHaveCount(
    1,
  );
  await page
    .getByRole("link", { name: "Explore Seli, The Pocket Weatherkeeper" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page
    .getByRole("button", { name: "Multi-angle reference", exact: true })
    .click();
  await expect(page).toHaveURL(/view=sheet/);
  const detailImage = dialog.locator("img");
  await expect
    .poll(() =>
      detailImage.evaluate((element: HTMLImageElement) => element.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.screenshot({
    path: evidenceDir
      ? join(evidenceDir, `character-sheet-${info.project.name}.png`)
      : info.outputPath("character-sheet.png"),
  });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.getByRole("searchbox").fill("");
  await page
    .getByRole("checkbox", { name: "Compare Seli", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Compare Tovan", exact: true })
    .check();
  await expect(
    page.getByRole("table", {
      name: "Selected character roles, limits and evidence requirements",
    }),
  ).toBeVisible();
  await page.goto(`${gallery}?character=pelora&view=sheet`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Multi-angle reference", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const catalog = await page.request.get("/firstlight-02/catalog.json");
  expect(catalog.ok()).toBe(true);
  const metadata = await catalog.json();
  expect(metadata.canon_state).toBe("proposal");
  expect(metadata.assets).toHaveLength(20);
  expect(metadata.publication.runtime_permissions_granted).toBe(false);
});

test("complete the scripted cooperative crossing and export its evidence", async ({
  page,
}, info) => {
  await page.goto(`${gallery}#cooperation`, { waitUntil: "domcontentloaded" });
  const trial = page.locator(".firstlight-trial");
  await expect(
    trial.getByRole("heading", { name: "The Severed Crossing" }),
  ).toBeVisible();
  for (const action of [
    "Read the weather",
    "Map the crossing",
    "Recover the lantern",
    "Bind the handoff",
    "Mend the severed thread",
    "Build the signal",
    "Verify the light",
  ])
    await trial.getByRole("button", { name: new RegExp(action) }).click();
  await expect(trial.locator('[data-state="accepted"]')).toBeVisible();
  await trial
    .getByRole("button", { name: "Compare both contracts", exact: true })
    .click();
  await expect(
    trial.getByRole("table", {
      name: "Scripted local comparison, not an agent benchmark",
    }),
  ).toBeVisible();
  await expect(
    trial.getByRole("cell", { name: "Rejected by Velis", exact: true }),
  ).toBeVisible();
  await expect(
    trial.getByRole("cell", { name: "Accepted by Velis", exact: true }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await trial
    .getByRole("button", { name: "Export evidence", exact: true })
    .click();
  const download = await downloadPromise;
  await download.saveAs(
    evidenceDir
      ? join(evidenceDir, `simulation-evidence-${info.project.name}.json`)
      : info.outputPath("simulation-evidence.json"),
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await trial.screenshot({
    path: evidenceDir
      ? join(evidenceDir, `cooperation-${info.project.name}.png`)
      : info.outputPath("cooperation.png"),
  });
});
