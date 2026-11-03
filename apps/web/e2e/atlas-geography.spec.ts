import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test("geographic history, linked locations and URL recovery work end to end", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/atlas?tab=geography&moment=49&place=place:fixture-west");
  const atlas = page.getByRole("region", { name: "A world, through time." });
  await expect(atlas).toBeVisible();
  const west = page.locator('[data-feature-id="place:fixture-west"]');
  await expect(west).toHaveAttribute("data-version", "geo:west:before");
  const earlierGeometry = await west.getAttribute("points");
  const slider = page.getByRole("slider", { name: "Story moment" });
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("50");
  await expect(west).toHaveAttribute("data-version", "geo:west:after");
  expect(await west.getAttribute("points")).not.toBe(earlierGeometry);
  await expect(
    atlas.getByRole("button", { name: /Event The survey flood Eastern basin/ }),
  ).toBeVisible();
  await atlas
    .getByRole("button", { name: /Character Test cartographer East port/ })
    .click();
  await expect(
    atlas.getByRole("heading", { name: "East port", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/moment=50/);
  await expect(page).toHaveURL(/place=place%3Afixture-east-port/);
  await page.reload();
  await expect(slider).toHaveValue("50");
  await expect(
    atlas.getByRole("heading", { name: "East port", exact: true }),
  ).toBeVisible();
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(
    atlas.getByRole("button", { name: /Event The survey flood/ }),
  ).toHaveCount(0);
  await atlas.getByLabel("Explore a place").selectOption("place:fixture-west");
  await atlas.getByText("Source and version history", { exact: true }).click();
  await atlas
    .getByRole("button", { name: "Moment 0: geo:west:before" })
    .click();
  await expect(slider).toHaveValue("0");
  await expect(west).toHaveAttribute("points", earlierGeometry!);
  await west.focus();
  await west.press("Enter");
  await expect(
    atlas.getByRole("heading", { name: "Western reach", exact: true }),
  ).toBeVisible();
  await atlas.getByRole("button", { name: "Zoom to place" }).click();
  await expect(atlas.getByRole("button", { name: "Fit survey" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Select East port/ }),
  ).toHaveCount(0);
  await atlas
    .getByLabel("Explore a place")
    .selectOption("place:fixture-east-port");
  await expect(
    page.getByRole("button", { name: /Select East port/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Select West port/ }),
  ).toHaveCount(0);
  await page.goto("/atlas?tab=geography&moment=invalid&place=missing");
  await expect(slider).toHaveValue("0");
  expect(errors).toEqual([]);
});

for (const width of [375, 768, 1440]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`geography is usable at ${width}px in ${colorScheme} mode with reduced motion`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      await page.goto(
        "/atlas?tab=geography&moment=50&place=place:fixture-west",
      );
      const atlas = page.getByRole("region", {
        name: "A world, through time.",
      });
      await expect(
        page.getByRole("slider", { name: "Story moment" }),
      ).toHaveValue("50");
      await expect(
        atlas.getByRole("heading", { name: "Western reach", exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await atlas
        .getByRole("button", { name: /Event The survey flood Eastern basin/ })
        .click();
      await expect(
        atlas.getByRole("heading", { name: "Eastern basin", exact: true }),
      ).toBeVisible();
      await mkdir("../../.visual-proof/atlas-after", { recursive: true });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        fullPage: true,
        path: `../../.visual-proof/atlas-after/${width}-${colorScheme}.png`,
      });
    });
  }
}
