import { expect, type Page } from "@playwright/test";
import type { ContextConfig } from "../lib/prompt-books/types";

// The built app, real browser SDK and actual route/components use a disposable
// transport. This suite is distinct from authenticated owner preview acceptance.
export const owner = "00000000-0000-4000-8000-000000000001";
export const collectionId = "00000000-0000-4000-8000-000000000003";
export const promptId = "00000000-0000-4000-8000-000000000004";
export const collectionUrl = `/prompt-books/${collectionId}`;
export const allEditorUrl = `/prompt-books/_all/${promptId}`;
export const editorUrl = `/prompt-books/${collectionId}/${promptId}`;
const user = {
  id: owner,
  aud: "authenticated",
  role: "authenticated",
  email: "owner@example.test",
  app_metadata: {},
  user_metadata: {},
  created_at: "2026-10-04T12:00:00Z",
};

export async function setup(
  page: Page,
  inspectLoading?: (page: Page) => Promise<void>,
  inspectFailure?: (page: Page, recover: () => void) => Promise<void>,
  entryUrl = editorUrl,
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
  let lostPromptAcknowledgement = false;
  let failingTemplate = false;
  let lostTemplateAcknowledgement = false;
  let failingRead = Boolean(inspectFailure);
  const templates: Record<string, unknown>[] = [];
  const createdTags: Record<string, unknown>[] = [];
  const assignedTags = new Set<string>();
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
    if (url.pathname.endsWith("/pb_tags")) {
      if (request.method() === "POST") {
        const body = request.postDataJSON();
        if (body.collection_id === "_all") {
          await route.fulfill({
            status: 400,
            json: { message: "Invalid UUID collection", code: "22P02" },
          });
          return;
        }
        data = {
          ...body,
          id: "00000000-0000-4000-8000-000000000008",
          created_at: prompt.created_at,
          updated_at: prompt.updated_at,
        };
        createdTags.push(data as Record<string, unknown>);
      } else if (request.method() === "GET")
        data = structuredClone(createdTags);
    }
    if (url.pathname.endsWith("/pb_prompt_tags")) {
      if (request.method() === "POST") {
        const payload = request.postDataJSON();
        for (const row of Array.isArray(payload) ? payload : [payload])
          assignedTags.add(row.tag_id as string);
      }
      if (request.method() === "DELETE")
        assignedTags.delete(
          (url.searchParams.get("tag_id") ?? "").replace(/^eq\./, ""),
        );
      if (request.method() === "GET")
        data = [...assignedTags].map((tag_id) => ({ tag_id }));
    }
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
      if (
        request.method() === "GET" &&
        url.searchParams.get("collection_id") === "eq._all"
      ) {
        await route.fulfill({
          status: 400,
          json: { message: "Invalid UUID collection filter", code: "22P02" },
        });
        return;
      }
      if (request.method() === "GET" && failingRead) {
        await route.fulfill({
          status: 400,
          json: { message: "Disposable failed read", code: "fixture" },
        });
        return;
      }
      if (request.method() === "GET" && inspectLoading) {
        loadingInspection ??= inspectLoading(page);
        await loadingInspection;
      }
      if (request.method() === "PATCH") {
        const expected = url.searchParams.get("updated_at");
        if (expected && expected !== `eq.${prompt.updated_at}`) {
          await route.fulfill({ status: 200, json: null });
          return;
        }
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
        prompt = {
          ...prompt,
          context_config: Object.fromEntries(
            Object.entries(prompt.context_config).reverse(),
          ),
        };
        if (lostPromptAcknowledgement) {
          lostPromptAcknowledgement = false;
          await route.fulfill({
            status: 500,
            json: { message: "Lost prompt acknowledgement", code: "fixture" },
          });
          return;
        }
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
      const body = request.postDataJSON();
      data = templates.find((row) => row.id === body.id) ?? {
        ...body,
        created_at: prompt.created_at,
        updated_at: prompt.updated_at,
      };
      if (!templates.includes(data as Record<string, unknown>))
        templates.push(data as Record<string, unknown>);
      if (lostTemplateAcknowledgement) {
        lostTemplateAcknowledgement = false;
        await route.fulfill({
          status: 500,
          json: { message: "Disposable lost acknowledgement", code: "fixture" },
        });
        return;
      }
    }
    if (url.pathname.endsWith("/pb_templates") && request.method() === "GET") {
      const id = url.searchParams.get("id")?.replace(/^eq\./, "");
      data = templates.find((row) => row.id === id) ?? null;
    }
    await route.fulfill({ status: 200, json: data });
  });
  await page.goto(`/auth/login?next=${encodeURIComponent(entryUrl)}`);
  await page.getByPlaceholder("you@example.com").fill(user.email);
  await page.getByPlaceholder("Enter your password").fill("disposable-fixture");
  await page
    .locator("form")
    .getByRole("button", { name: "Sign In", exact: true })
    .click();
  if (entryUrl.endsWith(`/${promptId}`)) {
    await expect(page).toHaveURL(new RegExp(`${promptId}$`));
    if (inspectFailure)
      await inspectFailure(page, () => {
        failingRead = false;
      });
    await expect(
      page.getByPlaceholder("Write your prompt here..."),
    ).toHaveValue("Original prompt");
  } else {
    await expect(page).toHaveURL(/\/prompt-books$/);
    await expect(
      page.getByRole("heading", { name: "Recovery collection", exact: true }),
    ).toBeVisible();
  }
  if (entryUrl !== allEditorUrl)
    await expect.poll(() => scopedTagRead).toBe(true);
  return {
    row: () => prompt,
    templates: () => templates,
    createdTags: () => createdTags,
    assignedTags: () => [...assignedTags],
    failTemplateAfterCommit: () => {
      lostTemplateAcknowledgement = true;
    },
    failTemplate: () => {
      failingTemplate = true;
    },
    remote: (content: string) => {
      prompt = { ...prompt, content, updated_at: "2026-10-04T13:00:00.000Z" };
    },
    failPromptAfterCommit: () => {
      lostPromptAcknowledgement = true;
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
