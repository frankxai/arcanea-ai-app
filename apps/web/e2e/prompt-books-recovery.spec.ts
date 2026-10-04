import { test, expect, type Page } from "@playwright/test";
import type { ContextConfig } from "../lib/prompt-books/types";

// The built app, real browser SDK and actual route/components use a disposable
// transport. This suite is distinct from authenticated owner preview acceptance.
const owner = "00000000-0000-4000-8000-000000000001";
const collectionId = "00000000-0000-4000-8000-000000000003";
const promptId = "00000000-0000-4000-8000-000000000004";
const editorUrl = `/prompt-books/${collectionId}/${promptId}`;
const user = {
  id: owner,
  aud: "authenticated",
  role: "authenticated",
  email: "owner@example.test",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-10-04T12:00:00Z",
};

async function setup(
  page: Page,
  inspectLoading?: (page: Page) => Promise<void>,
) {
  const token = [
    Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url"),
    Buffer.from(
      JSON.stringify({
        sub: owner,
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: "authenticated",
        role: "authenticated",
      }),
    ).toString("base64url"),
    "fixture-signature",
  ].join(".");
  let prompt = {
    id: promptId,
    user_id: owner,
    collection_id: collectionId,
    title: "Recovery prompt",
    content: "Original prompt",
    prompt_type: "general",
    context_config: {} as ContextConfig,
    created_at: "2026-10-04T12:00:00.000Z",
    updated_at: "2026-10-04T12:00:00.000Z",
  };
  let scopedTagRead = false;
  let failing = false;
  let failingTemplate = false;
  const templates: Record<string, unknown>[] = [];
  let hold = false;
  let held = false;
  let release: (() => void) | null = null;
  let gate = Promise.resolve();
  let loadingInspection: Promise<void> | null = null;
  await page.route("**/auth/v1/**", async (route) => {
    const body = route.request().url().includes("/token")
      ? {
          access_token: token,
          refresh_token: "fixture-refresh",
          token_type: "bearer",
          expires_in: 3600,
          user,
        }
      : user;
    await route.fulfill({ status: 200, json: body });
  });
  await page.route("**/rest/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    let data: unknown = [];
    if (
      url.pathname.endsWith("/pb_tags") &&
      (url.searchParams.get("or") ?? "").includes(
        `collection_id.eq.${collectionId}`,
      )
    )
      scopedTagRead = true;
    if (url.pathname.endsWith("/pb_collections"))
      data = [
        {
          id: collectionId,
          user_id: owner,
          name: "Recovery collection",
          visibility: "private",
          prompt_count: 1,
        },
      ];
    if (url.pathname.endsWith("/pb_prompts")) {
      if (request.method() === "GET" && inspectLoading) {
        loadingInspection ??= inspectLoading(page);
        await loadingInspection;
      }
      if (request.method() === "PATCH") {
        if (failing) {
          failing = false;
          await route.fulfill({
            status: 400,
            json: { message: "Disposable failed write", code: "fixture" },
          });
          return;
        }
        prompt = {
          ...prompt,
          ...request.postDataJSON(),
          updated_at: new Date(
            Date.parse(prompt.updated_at) + 1000,
          ).toISOString(),
        };
        // Hold this request's response, not a later global row. Otherwise the
        // newer-revision regression can pass without the hook refreshing.
        data = structuredClone(prompt);
        if (hold) {
          hold = false;
          held = true;
          await gate;
          held = false;
        }
      }
      if (request.method() !== "PATCH") data = structuredClone(prompt);
      if (!request.headers().accept?.includes("object")) data = [data];
    }
    if (url.pathname.endsWith("/pb_templates") && request.method() === "POST") {
      if (failingTemplate) {
        failingTemplate = false;
        await route.fulfill({
          status: 400,
          json: { message: "Disposable template failure", code: "fixture" },
        });
        return;
      }
      data = {
        ...request.postDataJSON(),
        id: "00000000-0000-4000-8000-000000000005",
        created_at: prompt.created_at,
        updated_at: prompt.updated_at,
      };
      templates.push(data as Record<string, unknown>);
    }
    await route.fulfill({ status: 200, json: data });
  });
  await page.goto(`/auth/login?next=${encodeURIComponent(editorUrl)}`);
  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill("disposable-fixture");
  await page
    .locator("form")
    .getByRole("button", { name: "Sign In", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`${promptId}$`));
  await expect(page.getByPlaceholder("Write your prompt here...")).toHaveValue(
    "Original prompt",
  );
  await expect.poll(() => scopedTagRead).toBe(true);
  return {
    row: () => prompt,
    templates: () => templates,
    failTemplate: () => {
      failingTemplate = true;
    },
    remote: (content: string) => {
      prompt = { ...prompt, content, updated_at: "2026-10-04T13:00:00.000Z" };
    },
    fail: () => {
      failing = true;
    },
    hold: () => {
      hold = true;
      gate = new Promise<void>((done) => {
        release = done;
      });
    },
    held: () => held,
    release: () => release?.(),
  };
}

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

test("built editor refreshes a newer cached revision when its pending save becomes clean", async ({
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
  await expect(field).toHaveValue("Newer confirmed remote creation");
  await expect(page.getByText(/^Saved /)).toBeVisible();
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

test("built template reconciles refreshed placeholders received during the save barrier", async ({
  page,
}) => {
  const f = await setup(page);
  f.hold();
  await page
    .getByPlaceholder("Write your prompt here...")
    .fill("Draft {{subject}} and {{removed}}");
  await expect.poll(f.held).toBe(true);
  f.remote("Newer {{subject}} in {{new_world}}");
  await page
    .getByRole("button", { name: "Add to favorites", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Remove from favorites", exact: true }),
  ).toBeVisible();
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
  await dialog
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  expect(f.templates()).toHaveLength(0);
  f.release();
  await expect(dialog).toHaveCount(0);
  expect(f.templates()[0]).toMatchObject({
    content: "Newer {{subject}} in {{new_world}}",
    variables: [
      { name: "subject", label: "Your protagonist", default: "Keep my edit" },
      { name: "new_world", label: "New World" },
    ],
  });
});
