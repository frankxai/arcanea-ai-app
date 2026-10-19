import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { proxy } from "../../../proxy";

// Proxy regression for the MCP cookie-gate bypass. Every case runs with no
// cookie and with network forbidden: the bypass must not call Supabase, and
// every other protected API must still answer the generic cookie 401.

function forbidNetwork(t: { mock: typeof test.mock }) {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests++;
    throw new Error("Network access is forbidden in this test");
  });
  return () => requests;
}

for (const method of ["POST", "GET", "DELETE", "OPTIONS", "PUT", "PATCH"]) {
  test(`proxy hands cookie-less ${method} /api/mcp to the route's Bearer auth`, async (t) => {
    const requests = forbidNetwork(t);
    const response = await proxy(
      new NextRequest("https://www.arcanea.ai/api/mcp", {
        method,
        headers: { authorization: "Bearer invalid.token.x" },
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(requests(), 0);
  });
}

for (const [path, method] of [
  // Look-alikes and nested paths of the bypass stay behind the cookie gate.
  ["/api/mcp/", "POST"],
  ["/api/mcp/tools", "POST"],
  ["/api/mcpx", "POST"],
  ["/api/mcp-bridge", "POST"],
  ["/api/worlds/mcp-bridge", "POST"],
  ["/api/MCP", "POST"],
  // Existing protected APIs are unchanged.
  ["/api/conversations/abc", "GET"],
  ["/api/creations/abc", "POST"],
  ["/api/imagine", "POST"],
  ["/api/forge/run", "POST"],
  ["/api/profile/me", "GET"],
  ["/api/worlds/save", "POST"],
  ["/api/waitlist", "GET"],
]) {
  test(`proxy still requires the cookie for ${method} ${path}`, async (t) => {
    t.mock.method(globalThis, "fetch", async () => {
      throw new Error("Network forbidden");
    });
    const response = await proxy(
      new NextRequest(`https://www.arcanea.ai${path}`, {
        method,
        headers: { authorization: "Bearer looks.like.a-token" },
      }),
    );
    assert.equal(response.status, 401, path);
    assert.equal((await response.json()).error.code, "UNAUTHORIZED");
    assert.equal(response.headers.get("x-middleware-next"), null);
  });
}

test("proxy still redirects signed-out page visits to login", async (t) => {
  forbidNetwork(t);
  const response = await proxy(
    new NextRequest("https://www.arcanea.ai/dashboard"),
  );
  assert.equal(response.status, 307);
  assert.match(response.headers.get("location") ?? "", /\/auth\/login\?next=/);
});

for (const path of [
  "/.well-known/oauth-protected-resource",
  "/.well-known/oauth-protected-resource/api/mcp",
]) {
  test(`proxy serves ${path} without a cookie or network call`, async (t) => {
    const requests = forbidNetwork(t);
    const response = await proxy(
      new NextRequest(`https://www.arcanea.ai${path}`),
    );
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(requests(), 0);
  });
}
