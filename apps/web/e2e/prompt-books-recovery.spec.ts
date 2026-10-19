import { test, expect, type Page } from "@playwright/test";

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

async function setup(page: Page) {
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
    created_at: "2026-10-04T12:00:00.000Z",
    updated_at: "2026-10-04T12:00:00.000Z",
  };
  let failing = false;
  let hold = false;
  let held = false;
  let release: (() => void) | null = null;
  let gate = Promise.resolve();
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
        if (hold) {
          hold = false;
          held = true;
          await gate;
          held = false;
        }
      }
      data = request.headers().accept?.includes("object") ? prompt : [prompt];
    }
    await route.fulfill({ status: 200, json: data });
  });
  await page.goto(`/auth/login?next=${encodeURIComponent(editorUrl)}`);
  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill("disposable-fixture");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${promptId}$`));
  await expect(page.getByPlaceholder("Write your prompt here...")).toHaveValue(
    "Original prompt",
  );
  return {
    row: () => prompt,
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
  await expect(page.getByRole("alert")).toContainText(
    "Your draft is still here",
  );
  await expect(page).toHaveURL(new RegExp(`${promptId}$`));
  await expect(field).toHaveValue("Recover this private draft");
  await page.getByRole("button", { name: "Retry save", exact: true }).click();
  await expect.poll(() => f.row().content).toBe("Recover this private draft");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Back to collection", exact: true })
    .click();
  await expect(page).toHaveURL(/\/prompt-books$/);
});
