import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { middleware } from "../../../middleware";
import { authenticatedRedirectUrl } from "../../supabase/middleware";
import { safeAuthNextPath } from "../../auth/safe-next-path";

test("login, signup and callbacks reject external and encoded redirect targets", () => {
  for (const next of [
    null,
    "",
    "https://other.invalid",
    "//other.invalid",
    "/\\other.invalid",
    "javascript:alert(1)",
    "/%2fother.invalid",
    "/%5cother.invalid",
    "/%252fother.invalid",
    "/%0a/other.invalid",
    " /chat",
    "/chat\t",
    "/%zz",
  ]) {
    assert.equal(
      safeAuthNextPath(next, "/dashboard"),
      "/dashboard",
      String(next),
    );
  }
  for (const next of [
    "/worlds/create?resume=1",
    "/chat",
    "/settings/providers",
    "/worlds/a-world?tab=characters",
    "/search?q=memory%20library",
  ]) {
    assert.equal(safeAuthNextPath(next, "/dashboard"), next);
  }
});

// No cookies, no real project and no network. Missing Supabase sessions must
// be rejected locally; public waitlist submissions must reach their handler.
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";

test("only the exact public waitlist POST bypasses session auth", async (t) => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw new Error("Network access is forbidden in this test");
  });
  const response = await middleware(
    new NextRequest("https://www.arcanea.ai/api/waitlist", { method: "POST" }),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(requests, 0);
});

for (const [path, method] of [
  ["/api/worlds/generate", "POST"],
  ["/api/worlds/save", "POST"],
  ["/api/worlds/generate-image", "POST"],
  ["/api/waitlist", "GET"],
  ["/api/waitlist/export", "POST"],
] as const) {
  test(`anonymous ${method} ${path} stays authenticated`, async (t) => {
    let requests = 0;
    t.mock.method(globalThis, "fetch", async () => {
      requests++;
      throw new Error("Network forbidden");
    });
    const response = await middleware(
      new NextRequest(`https://www.arcanea.ai${path}`, { method }),
    );
    assert.equal(response.status, 401);
    assert.equal((await response.json()).error.code, "UNAUTHORIZED");
    assert.equal(requests, 0);
  });
}

test("an already signed-in creator returns to the exact world resume URL", () => {
  const request = new NextRequest(
    "https://www.arcanea.ai/auth/login?next=%2Fworlds%2Fcreate%3Fresume%3D1",
  );
  assert.equal(
    authenticatedRedirectUrl(request).href,
    "https://www.arcanea.ai/worlds/create?resume=1",
  );
});

test("auth return rejects unapproved, external and malformed destinations", () => {
  for (const next of [
    "https://other.invalid",
    "//other.invalid",
    "/worlds/create?resume=1&redirect=elsewhere",
    "/worlds/create",
    "/settings",
  ]) {
    const request = new NextRequest(
      `https://www.arcanea.ai/auth/signup?next=${encodeURIComponent(next)}`,
    );
    assert.equal(
      authenticatedRedirectUrl(request).href,
      "https://www.arcanea.ai/chat",
    );
  }
});
