const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");

const experimental = (value) =>
  value &&
  typeof value === "object" &&
  (value.canonStatus === "EXPERIMENTAL" ||
    Object.values(value).some(experimental));

/** Runs against the real built Next app in the existing project CI. */
module.exports.verifySovereignPreview = async ({
  page,
  context,
  base,
  state,
}) => {
  await page
    .getByRole("heading", { name: "The Sovereign Depths", exact: true })
    .waitFor();
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    content: document.documentElement.scrollWidth,
  }));
  assert.ok(
    overflow.content <= overflow.viewport + 1,
    "Collection has horizontal overflow",
  );
  await page.getByRole("button", { name: "Dungeons", exact: true }).click();
  await page.getByText("12 works", { exact: true }).waitFor();
  await page
    .getByLabel("Search names, regions, factions and books", { exact: true })
    .fill("Pelagic Cathedral");
  await page.getByText("1 work", { exact: true }).waitFor();
  await page
    .locator("#collection a")
    .filter({ hasText: "The Pelagic Cathedral" })
    .click();
  await page.waitForURL(
    `${base}/gallery/sovereign-depths/the-pelagic-cathedral`,
  );
  await page
    .getByRole("heading", {
      name: "The Pelagic Cathedral",
      exact: true,
      level: 1,
    })
    .waitFor();
  assert.ok(
    new URL(page.url()).pathname.startsWith("/gallery/sovereign-depths/"),
    "Dossier navigation failed",
  );
  const dossierOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth + 1,
  );
  assert.ok(dossierOverflow, "Dossier has horizontal overflow");
  await page.goto(`${base}/gallery/sovereign-depths`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("button", { name: "Bosses", exact: true }).click();
  await page.getByText("24 works", { exact: true }).waitFor();
  await page
    .getByLabel("Search names, regions, factions and books", { exact: true })
    .fill("no-such-sovereign-entry-12345");
  await page
    .getByText("No works match this search.", { exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByText("36 works", { exact: true }).waitFor();
  const report = {
    state,
    overflow,
    dossierOverflow,
    filters: true,
    search: true,
    emptyReset: true,
    dossierNavigation: true,
  };

  if (state === "desktop") {
    const read = async (query) => {
      const response = await context.request.get(
        `${base}/api/lore/sovereign-depths${query}`,
      );
      assert.equal(
        response.status(),
        200,
        "Public collection API requires no user login",
      );
      return response.json();
    };
    const [none, safe, all] = await Promise.all([
      read(""),
      read("?includeProposals=true"),
      read("?includeProposals=true&includeExperimental=true"),
    ]);
    assert.equal(none.total, 0);
    assert.equal(safe.total, 30);
    assert.ok(!experimental(safe));
    assert.equal(all.total, 36);
    assert.equal(all.canonStatus, "STAGING");
    report.api = { default: none.total, proposals: safe.total, all: all.total };
    report.assets = [];
    for (let offset = 0; offset < all.entries.length; offset += 6) {
      const checked = await Promise.all(
        all.entries.slice(offset, offset + 6).map(async (entry) => {
          assert.match(
            entry.image.src,
            /^\/images\/sovereign-depths\/[bd]\d{2}\.webp$/,
          );
          const url = `${base}${entry.image.src}`;
          const response = await context.request.get(url);
          assert.equal(
            response.status(),
            200,
            `${entry.id}: public artwork response`,
          );
          const bytes = await response.body();
          const hash = crypto.createHash("sha256").update(bytes).digest("hex");
          assert.equal(
            hash,
            entry.image.renditionSha256,
            `${entry.id}: delivered bytes match approved rendition`,
          );
          return {
            id: entry.id,
            url,
            status: response.status(),
            bytes: bytes.length,
            sha256: hash,
          };
        }),
      );
      report.assets.push(...checked);
    }
    const privateResponse = await context.request.post(`${base}/api/mcp`, {
      data: { jsonrpc: "2.0", method: "tools/list", id: 1 },
    });
    assert.ok(
      [401, 403].includes(privateResponse.status()),
      "Private MCP gateway must remain authenticated",
    );
    report.privateGatewayStatus = privateResponse.status();
  }
  fs.writeFileSync(
    `screenshots/sovereign-checks-${state}.json`,
    JSON.stringify(report, null, 2) + "\n",
  );
  await page.goto(`${base}/gallery/sovereign-depths`, {
    waitUntil: "domcontentloaded",
  });
  await page
    .locator("main img")
    .first()
    .evaluate((image) => image.decode());
};
