import { expect, test } from "@playwright/test";

const BOOK = "/books/the-last-free-path";
const OPENING = `${BOOK}/01-the-house-that-leaned`;

test("mobile invitation shows the cover and free chapter action in the first viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(BOOK);
  const cover = page.getByRole("img", { name: /Cover study showing Arion/ });
  await expect(cover).toBeVisible();
  const bounds = await cover.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y).toBeLessThan(400);
  expect(bounds!.y + bounds!.height).toBeLessThan(812);
  const opening = page.getByRole("link", {
    name: "Read Chapter 1 free",
    exact: true,
  });
  await expect(opening).toBeVisible();
  const action = await opening.boundingBox();
  expect(action!.y + action!.height).toBeLessThan(812);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("all reading preferences work on mobile and the assistant stays outside the reader", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(OPENING);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Open Arcanea assistant", exact: true }),
  ).toHaveCount(0);
  const paragraph = page.locator("article p").first();
  await expect(paragraph).toBeVisible();
  await page
    .getByRole("button", { name: "Increase font size", exact: true })
    .click();
  await expect(page.getByLabel("Font size", { exact: true })).toHaveText("20");
  await expect
    .poll(() => paragraph.evaluate((el) => getComputedStyle(el).fontSize))
    .toBe("20px");
  const font = await paragraph.evaluate(
    (el) => getComputedStyle(el).fontFamily,
  );
  await page.getByRole("button", { name: "Font: serif", exact: true }).click();
  await expect
    .poll(() => paragraph.evaluate((el) => getComputedStyle(el).fontFamily))
    .not.toBe(font);
  const spacing = await paragraph.evaluate((el) =>
    parseFloat(getComputedStyle(el).lineHeight),
  );
  await page
    .getByRole("button", { name: "Line spacing: normal", exact: true })
    .click();
  await expect
    .poll(() =>
      paragraph.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight)),
    )
    .toBeGreaterThan(spacing);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Font: sans", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Line spacing: relaxed", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Font size", { exact: true })).toHaveText("20");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("Chapter 2 is outside the free sample and exposes no prose article", async ({
  page,
}) => {
  await page.goto(`${BOOK}/02-the-voice-removed-from-rain`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /voice removed from rain/i,
  );
  await expect(page.locator("article")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Return to the free opening", exact: true }),
  ).toHaveAttribute("href", OPENING);
});
