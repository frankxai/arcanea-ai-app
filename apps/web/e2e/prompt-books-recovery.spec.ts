import { test, expect } from "@playwright/test";
import { setup, owner, promptId, editorUrl } from "./prompt-books-support";

test("built editor autosaves the first edit and reloads the confirmed draft", async ({
  page,
}) => {
  const f = await setup(page);
  await page
    .getByPlaceholder("Write your prompt here...")
    .fill("First automatically saved draft");
  await expect
    .poll(() => f.row().content)
    .toBe("First automatically saved draft");
  await expect(page.getByText(/^Saved /)).toBeVisible();
  await page.reload();
  await expect(page.getByPlaceholder("Write your prompt here...")).toHaveValue(
    "First automatically saved draft",
  );
});

test("built Back button waits for edits made during its outstanding save", async ({
  page,
}) => {
  const f = await setup(page);
  const field = page.getByPlaceholder("Write your prompt here...");
  await field.fill("First Back snapshot");
  f.hold();
  await page
    .getByRole("button", { name: "Back to collection", exact: true })
    .click();
  await expect.poll(f.held).toBe(true);
  await field.fill("Latest keystrokes before Back finishes");
  await expect(page).toHaveURL(new RegExp(`${promptId}$`));
  f.release();
  await expect(page).toHaveURL(/\/prompt-books$/);
  expect(f.row().content).toBe("Latest keystrokes before Back finishes");
  await page.goto(editorUrl);
  await expect(field).toHaveValue("Latest keystrokes before Back finishes");
});

test("built failure UI keeps draft and refuses Back until retry confirms it", async ({
  page,
}) => {
  const f = await setup(page);
  const field = page.getByPlaceholder("Write your prompt here...");
  await field.fill("Recover this private draft");
  f.fail();
  await page
    .getByRole("button", { name: "Back to collection", exact: true })
    .click();
  const saveError = page.getByRole("alert").filter({
    has: page.getByRole("button", { name: "Retry save", exact: true }),
  });
  await expect(saveError).toContainText("Your draft is still here");
  await expect(page).toHaveURL(new RegExp(`${promptId}$`));
  await expect(field).toHaveValue("Recover this private draft");
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect.poll(() => f.row().content).toBe("Recover this private draft");
  await expect(saveError).toHaveCount(0);
  await page
    .getByRole("button", { name: "Back to collection", exact: true })
    .click();
  await expect(page).toHaveURL(/\/prompt-books$/);
});

test("built context-only edits share Back's pending save and failure recovery", async ({
  page,
}) => {
  const f = await setup(page);
  const tokens = page.locator('input[type="number"]');
  await tokens.fill("1536");
  f.hold();
  await page
    .getByRole("button", { name: "Back to collection", exact: true })
    .click();
  await expect.poll(f.held).toBe(true);
  await tokens.fill("2048");
  f.fail();
  f.release();
  const saveError = page.getByRole("alert").filter({
    has: page.getByRole("button", { name: "Retry save", exact: true }),
  });
  await expect(saveError).toContainText("Your draft is still here");
  await expect(page).toHaveURL(new RegExp(`${promptId}$`));
  await expect(tokens).toHaveValue("2048");
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect.poll(() => f.row().context_config.maxTokens).toBe(2048);
  await page
    .getByRole("button", { name: "Back to collection", exact: true })
    .click();
  await expect(page).toHaveURL(/\/prompt-books$/);
  await page.goto(editorUrl);
  await expect(tokens).toHaveValue("2048");
});

test("built direct-link loading preserves loading feedback without a false identity warning", async ({
  page,
}) => {
  await setup(page, async (loadingPage) => {
    await expect(
      loadingPage.getByText("Loading prompt...", { exact: true }),
    ).toBeVisible();
    await expect(loadingPage.getByText(/Your sign-in changed/)).toHaveCount(0);
  });
});

test("built editor retains conflicting work for an explicit retry", async ({
  page,
}) => {
  const f = await setup(page);
  const field = page.getByPlaceholder("Write your prompt here...");
  await field.fill("Pending local revision");
  f.hold();
  await expect.poll(f.held).toBe(true);
  f.remote("Newer confirmed remote creation");
  await page
    .getByRole("button", { name: "Add to favorites", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove from favorites", exact: true }),
  ).toBeVisible();
  f.release();
  await expect(
    page.getByRole("alert").filter({
      has: page.getByRole("button", { name: "Retry save", exact: true }),
    }),
  ).toContainText("Newer changes arrived");
  await expect(field).toHaveValue("Pending local revision");
  expect(f.row().content).toBe("Newer confirmed remote creation");
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect(page.getByText(/^Saved /)).toBeVisible();
  expect(f.row().content).toBe("Pending local revision");
});

test("built template creation waits for the latest draft and detects its variables", async ({
  page,
}) => {
  const f = await setup(page);
  f.hold();
  await page
    .getByPlaceholder("Write your prompt here...")
    .fill("Recovered {{subject}} draft");
  await page.locator('input[type="number"]').fill("1536");
  await page
    .getByRole("button", { name: "Save as template", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Save as template",
    exact: true,
  });
  await expect(dialog.getByText("{{subject}}", { exact: true })).toBeVisible();
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect.poll(f.held).toBe(true);
  expect(f.templates()).toHaveLength(0);
  f.release();
  await expect(dialog).toHaveCount(0);
  expect(f.templates()).toHaveLength(1);
  expect(f.templates()[0]).toMatchObject({
    content: "Recovered {{subject}} draft",
    context_config: { maxTokens: 1536 },
    is_public: false,
    user_id: owner,
    variables: [{ name: "subject" }],
  });
});

test("built template failure retains the dialog draft and allows an explicit retry", async ({
  page,
}) => {
  const f = await setup(page);
  await page
    .getByPlaceholder("Write your prompt here...")
    .fill("Recover this template draft");
  await page
    .getByRole("button", { name: "Save as template", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Save as template",
    exact: true,
  });
  f.failTemplate();
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Your draft is still here",
  );
  expect(f.templates()).toHaveLength(0);
  await expect(page.getByPlaceholder("Write your prompt here...")).toHaveValue(
    "Recover this template draft",
  );
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  expect(f.templates()[0].content).toBe("Recover this template draft");
});

test("built open template dialog reconciles clean remote refresh and keeps custom variables", async ({
  page,
}) => {
  const f = await setup(page);
  await page
    .getByPlaceholder("Write your prompt here...")
    .fill("Draft {{subject}} and {{removed}}");
  await expect(page.getByText(/^Saved /)).toBeVisible();
  f.remote("Newer {{subject}} in {{new_world}}");
  f.hold();
  await page
    .getByRole("button", { name: "Add to favorites", exact: true })
    .click();
  await expect.poll(f.held).toBe(true);
  await page
    .getByRole("button", { name: "Save as template", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Save as template",
    exact: true,
  });
  await dialog
    .getByRole("textbox", { name: "subject label", exact: true })
    .fill("Your protagonist");
  await dialog
    .getByRole("textbox", { name: "subject default", exact: true })
    .fill("Keep my edit");
  f.release();
  await expect(
    dialog.getByText("{{new_world}}", { exact: true }),
  ).toBeVisible();
  await expect(dialog.getByText("{{removed}}", { exact: true })).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  expect(f.templates()[0]).toMatchObject({
    content: "Newer {{subject}} in {{new_world}}",
    variables: [
      { name: "subject", label: "Your protagonist", default: "Keep my edit" },
      { name: "new_world", label: "New World" },
    ],
  });
});

test("built failed direct-link read offers loading recovery", async ({
  page,
}) => {
  await setup(page, undefined, async (failedPage, recover) => {
    const retry = failedPage
      .getByRole("button", { name: "Retry loading", exact: true })
      .first();
    await expect(retry).toBeVisible();
    await expect(failedPage.getByText(/Your sign-in changed/)).toHaveCount(0);
    recover();
    await retry.click();
  });
});

test("built lost template acknowledgement retries without duplicating creation", async ({
  page,
}) => {
  const f = await setup(page);
  await page
    .getByPlaceholder("Write your prompt here...")
    .fill("Unique template {{subject}}");
  await page
    .getByRole("button", { name: "Save as template", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Save as template",
    exact: true,
  });
  f.failTemplateAfterCommit();
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Your draft is still here",
  );
  expect(f.templates()).toHaveLength(1);
  const id = f.templates()[0].id;
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  expect(f.templates()).toHaveLength(1);
  expect(f.templates()[0].id).toBe(id);
});

test("built editor confirms multi-parameter JSONB saves after server key reordering", async ({
  page,
}) => {
  const f = await setup(page);
  await page.locator('input[type="number"]').fill("1536");
  await page
    .locator('input[type="range"][min="0"][max="2"]')
    .press("ArrowRight");
  await expect(page.getByText(/^Saved /)).toBeVisible();
  expect(f.row().context_config.maxTokens).toBe(1536);
  expect(f.row().context_config.temperature).toBeDefined();
  await expect(
    page.getByRole("button", { name: "Retry save", exact: true }),
  ).toHaveCount(0);
  await page.reload();
  await expect(page.locator('input[type="number"]')).toHaveValue("1536");
});
