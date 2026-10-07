const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const {
  chromium,
  expect,
} = require("../apps/web/node_modules/@playwright/test");

const base = process.env.SHOP_TEST_BASE_URL || "http://localhost:3001";
const output = path.resolve("screenshots/shop");

async function main() {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch();
  const evidence = [];
  try {
    for (const state of [
      { name: "desktop", width: 1440, height: 900, motion: "no-preference" },
      { name: "mobile", width: 375, height: 812, motion: "no-preference" },
      { name: "reduced-motion", width: 375, height: 812, motion: "reduce" },
    ]) {
      const context = await browser.newContext({
        viewport: { width: state.width, height: state.height },
        reducedMotion: state.motion,
      });
      const page = await context.newPage();
      for (const route of [
        { path: "/shop", name: "home", heading: /Worlds worth/ },
        {
          path: "/shop/worldbuilder-production-edition",
          name: "edition",
          heading: /Worldbuilder/,
        },
        { path: "/shop/sample", name: "sample", heading: /One rule/ },
      ]) {
        const response = await page.goto(base + route.path, {
          waitUntil: "load",
        });
        assert.equal(response.status(), 200, route.path);
        const shop = page.locator(".arc-shop").filter({ visible: true });
        await expect(shop).toHaveCount(1);
        await shop
          .getByRole("heading", { level: 1, name: route.heading })
          .waitFor();
        await page.evaluate(() => document.fonts.ready);
        const dimensions = await page.evaluate(() => ({
          viewport: window.innerWidth,
          content: document.documentElement.scrollWidth,
        }));
        assert.ok(
          dimensions.content <= dimensions.viewport + 1,
          `${state.name} ${route.path} overflows`,
        );
        assert.equal(
          await page.locator('link[rel="canonical"]').getAttribute("href"),
          "https://www.arcanea.ai" + route.path,
        );
        if (route.name === "home") {
          await expect(
            shop.locator(".shop-hero-art img").filter({ visible: true }),
          ).toHaveCount(1);
          const hero = shop.getByRole("img", {
            name: "A vast luminous sea creature passes through the arches of a submerged city.",
            exact: true,
          });
          await expect(hero).toHaveCount(1);
          await hero.evaluate((img) => img.decode());
          await expect(
            shop.locator(".shop-edition-card").filter({ visible: true }),
          ).toHaveCount(4);
        }
        if (route.name === "edition") {
          assert.equal(
            await shop
              .getByRole("link", { name: "Explore the sample", exact: true })
              .count(),
            1,
          );
          assert.equal(await shop.locator(".shop-action button").count(), 0);
          const product = await shop
            .locator('script[type="application/ld+json"]')
            .evaluateAll((nodes) =>
              nodes
                .map((node) => JSON.parse(node.textContent))
                .find((value) => value["@type"] === "Product"),
            );
          assert.ok(product && !product.offers && !product.aggregateRating);
          if (state.motion === "reduce") {
            const duration = await shop
              .locator(".shop-action .shop-button")
              .evaluate((el) => getComputedStyle(el).transitionDuration);
            assert.ok(
              duration.split(",").every((value) => parseFloat(value) === 0),
              "Reduced-motion transition remains",
            );
          }
        }
        await page.screenshot({
          path: path.join(output, `${state.name}-${route.name}.png`),
          fullPage: true,
        });
        evidence.push({
          state: state.name,
          route: route.path,
          status: response.status(),
          ...dimensions,
        });
      }
      const json = await context.request.get(
        base + "/downloads/arcanea-world-starter.json",
      );
      assert.equal(json.status(), 200);
      assert.equal(
        (await json.json()).canonState,
        "proposal-outside-official-arcanea-canon",
      );
      const md = await context.request.get(
        base + "/downloads/arcanea-world-starter.md",
      );
      assert.equal(md.status(), 200);
      assert.ok((await md.text()).includes("Mara"));
      for (const route of [
        "/shop/unknown",
        "/shop/guides/unknown",
        "/shop/collections/unknown",
      ]) {
        assert.equal(
          (await context.request.get(base + route)).status(),
          404,
          route,
        );
      }
      const checkout = await context.request.post(base + "/api/shop/checkout", {
        data: { slug: "worldbuilder-production-edition" },
      });
      assert.equal(checkout.status(), 503);
      assert.equal((await checkout.json()).code, "edition_unavailable");
      const forged = await context.request.post(base + "/api/shop/checkout", {
        data: { slug: "worldbuilder-production-edition", amount: 1 },
      });
      assert.equal(forged.status(), 400);
      await context.close();
    }
    await fs.writeFile(
      path.join(output, "evidence.json"),
      JSON.stringify(
        { base, builtGitHubSha: process.env.GITHUB_SHA || null, evidence },
        null,
        2,
      ) + "\n",
    );
    console.log(
      "Shop desktop, 375px, reduced motion, downloads, canonical URLs, 404s and checkout verified.",
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
