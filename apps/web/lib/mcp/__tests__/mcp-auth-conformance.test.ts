import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import * as protectedResourceRoot from "../../../app/.well-known/oauth-protected-resource/route";
import * as protectedResourceMcp from "../../../app/.well-known/oauth-protected-resource/api/mcp/route";
import * as mcpRoute from "../../../app/api/mcp/route";
import { proxy } from "../../../proxy";
import {
  buildMcpProtectedResourceMetadata,
  mcpWwwAuthenticate,
} from "../protected-resource-metadata";

// End-to-end through the real proxy and the real /api/mcp route module with
// the real Supabase Bearer check. Only Supabase's /auth/v1/user is stubbed.

const SUPABASE_URL = "https://abcdefghijklmnopqrst.supabase.co";
const ORIGIN = "https://www.arcanea.ai";
const MCP_URL = `${ORIGIN}/api/mcp`;
const METADATA_URL = `${ORIGIN}/.well-known/oauth-protected-resource/api/mcp`;
const VALID_TOKEN = "valid.test.token";
const USER_ID = "20000000-0000-4000-8000-000000000001";
const WWW_AUTHENTICATE = new RegExp(
  `^Bearer resource_metadata="${METADATA_URL.replace(/[./]/g, "\\$&")}"$`,
);

process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE = "compatibility-preview";
process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.test-anon-signature";

interface SupabaseStub {
  tokensChecked: string[];
  otherRequests: string[];
}

/** Stub Supabase Auth: only VALID_TOKEN resolves to a user. */
function stubSupabase(t: { mock: typeof test.mock }): SupabaseStub {
  const stub: SupabaseStub = { tokensChecked: [], otherRequests: [] };
  t.mock.method(
    globalThis,
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url !== `${SUPABASE_URL}/auth/v1/user`) {
        stub.otherRequests.push(url);
        throw new Error(`Unexpected network request: ${url}`);
      }
      const headers = new Headers(init?.headers);
      const token = (headers.get("authorization") ?? "").replace(
        /^Bearer /,
        "",
      );
      stub.tokensChecked.push(token);
      if (token !== VALID_TOKEN) {
        return Response.json(
          { code: 403, error_code: "bad_jwt", msg: "invalid JWT" },
          { status: 403 },
        );
      }
      return Response.json({
        id: USER_ID,
        aud: "authenticated",
        role: "authenticated",
        email: "creator@example.test",
        app_metadata: {},
        user_metadata: {},
        created_at: "2026-10-01T00:00:00.000Z",
      });
    },
  );
  return stub;
}

const toolsList = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {},
});

function mcpRequest(
  method: string,
  authorization?: string,
  body: string | undefined = method === "POST" ? toolsList : undefined,
): NextRequest {
  const headers: Record<string, string> = {
    accept: "application/json, text/event-stream",
    "mcp-protocol-version": "2025-06-18",
  };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (authorization !== undefined) headers.authorization = authorization;
  return new NextRequest(MCP_URL, { method, headers, body });
}

const routeHandlers: Record<
  string,
  ((request: NextRequest) => Promise<Response>) | undefined
> = mcpRoute as never;

/** Run the request through proxy.ts, then the route, as production does. */
async function send(request: NextRequest): Promise<Response> {
  const gated = await proxy(request);
  if (gated.headers.get("x-middleware-next") !== "1") return gated;
  const handler = routeHandlers[request.method];
  assert.ok(handler, `route must export ${request.method}`);
  return handler(request);
}

async function assertNoData(response: Response, label: string) {
  const body = await response.text();
  assert.doesNotMatch(
    body,
    /"result"|"tools"|arcanea_get_world_context/,
    label,
  );
}

const REJECTED_AUTHORIZATION: Array<[string, string | undefined, boolean]> = [
  // [label, Authorization header, reaches Supabase?]
  ["no Authorization header", undefined, false],
  ["empty Authorization header", "", false],
  ["Basic scheme", "Basic dXNlcjpwYXNz", false],
  ["Bearer without token", "Bearer", false],
  ["Bearer with empty token", "Bearer ", false],
  ["Bearer with two tokens", "Bearer a.b.c d.e.f", false],
  ["Bearer with a quote", 'Bearer a"b', false],
  ["non-Bearer token= header", "token=valid.test.token", false],
  ["oversized Bearer token", `Bearer ${"a".repeat(8193)}`, false],
  ["invalid Bearer token", "Bearer invalid.token.x", true],
  ["expired-looking Bearer token", "Bearer eyJhbGciOi.eyJleHAiOjF9.sig", true],
];

for (const [label, authorization, reachesSupabase] of REJECTED_AUTHORIZATION) {
  test(`cookie-less POST /api/mcp with ${label} gets 401 + resource_metadata and no data`, async (t) => {
    const stub = stubSupabase(t);
    const response = await send(mcpRequest("POST", authorization));
    assert.equal(response.status, 401);
    assert.match(
      response.headers.get("www-authenticate") ?? "",
      WWW_AUTHENTICATE,
    );
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = (await response.clone().json()) as {
      error: { code: string };
    };
    // The route's own 401, not the proxy's cookie 401.
    assert.equal(body.error.code, "authentication-required");
    await assertNoData(response, label);
    assert.equal(stub.tokensChecked.length, reachesSupabase ? 1 : 0);
    assert.deepEqual(stub.otherRequests, []);
  });
}

test("an invalid token is rejected even when the JSON-RPC body is a tools/call", async (t) => {
  const stub = stubSupabase(t);
  const response = await send(
    mcpRequest(
      "POST",
      "Bearer invalid.token.x",
      JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: { name: "arcanea_get_world_context", arguments: {} },
      }),
    ),
  );
  assert.equal(response.status, 401);
  assert.deepEqual(stub.tokensChecked, ["invalid.token.x"]);
  await assertNoData(response, "tools/call");
});

for (const method of ["GET", "DELETE", "OPTIONS"]) {
  for (const authorization of [undefined, "Bearer invalid.token.x"]) {
    test(`cookie-less ${method} /api/mcp (${authorization ? "invalid token" : "no token"}) returns 405 and no data`, async (t) => {
      const stub = stubSupabase(t);
      const response = await send(mcpRequest(method, authorization));
      assert.equal(response.status, 405);
      assert.equal(response.headers.get("allow"), "POST");
      await assertNoData(response, method);
      assert.equal(stub.tokensChecked.length, 0);
      assert.deepEqual(stub.otherRequests, []);
    });
  }
}

test("the route exports no other method that could bypass the Bearer check", () => {
  // Next.js answers 405 for methods a route does not export (HEAD reuses GET).
  assert.deepEqual(
    Object.keys(mcpRoute)
      .filter((name) => /^[A-Z]+$/.test(name))
      .sort(),
    ["DELETE", "GET", "OPTIONS", "POST"],
  );
});

test("the route fails closed (503, no data) when the gateway mode is off", async (t) => {
  const stub = stubSupabase(t);
  const previous = process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE;
  delete process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE;
  try {
    const response = await send(mcpRequest("POST", `Bearer ${VALID_TOKEN}`));
    assert.equal(response.status, 503);
    await assertNoData(response, "mode off");
    assert.equal(stub.tokensChecked.length, 0);
  } finally {
    process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE = previous;
  }
});

test("a valid Bearer token without any cookie reaches the MCP handler", async (t) => {
  const stub = stubSupabase(t);
  const response = await send(mcpRequest("POST", `Bearer ${VALID_TOKEN}`));
  assert.equal(response.status, 200);
  assert.deepEqual(stub.tokensChecked, [VALID_TOKEN]);
  assert.match(await response.text(), /arcanea_get_world_context/);
});

test("every POST is validated: a valid call does not authorise the next one", async (t) => {
  const stub = stubSupabase(t);
  assert.equal(
    (await send(mcpRequest("POST", `Bearer ${VALID_TOKEN}`))).status,
    200,
  );
  assert.equal((await send(mcpRequest("POST"))).status, 401);
  assert.equal(
    (await send(mcpRequest("POST", "Bearer invalid.token.x"))).status,
    401,
  );
  assert.deepEqual(stub.tokensChecked, [VALID_TOKEN, "invalid.token.x"]);
});

test("resource_metadata follows the request origin (previews advertise themselves)", () => {
  assert.equal(
    mcpWwwAuthenticate("https://arcanea-ai-app-git-x.vercel.app/api/mcp"),
    'Bearer resource_metadata="https://arcanea-ai-app-git-x.vercel.app/.well-known/oauth-protected-resource/api/mcp"',
  );
});

for (const [label, routeModule, path] of [
  [
    "suffixed",
    protectedResourceMcp,
    "/.well-known/oauth-protected-resource/api/mcp",
  ],
  ["root", protectedResourceRoot, "/.well-known/oauth-protected-resource"],
] as const) {
  test(`${label} protected resource metadata is valid RFC 9728 JSON`, async () => {
    const response = routeModule.GET(new Request(`${ORIGIN}${path}`));
    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("content-type") ?? "",
      /^application\/json/,
    );
    const metadata = JSON.parse(await response.text()) as Record<
      string,
      unknown
    >;
    assert.equal(metadata.resource, MCP_URL);
    assert.deepEqual(metadata.authorization_servers, [
      `${SUPABASE_URL}/auth/v1`,
    ]);
    assert.deepEqual(metadata.bearer_methods_supported, ["header"]);
    // No secret or key material is published.
    const raw = JSON.stringify(metadata);
    assert.doesNotMatch(raw, /anon|service|key|secret|eyJ/i);
  });
}

test("the 401 resource_metadata URL resolves to the metadata route", async (t) => {
  stubSupabase(t);
  const response = await send(mcpRequest("POST"));
  const advertised = /resource_metadata="([^"]+)"/.exec(
    response.headers.get("www-authenticate") ?? "",
  )?.[1];
  assert.equal(advertised, METADATA_URL);
  const metadata = await protectedResourceMcp
    .GET(new Request(advertised!))
    .json();
  assert.equal(metadata.resource, MCP_URL);
});

test("metadata fails closed without a usable Supabase URL", async () => {
  for (const env of [
    {},
    { NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co" },
    { NEXT_PUBLIC_SUPABASE_URL: "http://abc.supabase.co" },
    { NEXT_PUBLIC_SUPABASE_URL: "not a url" },
  ]) {
    assert.equal(buildMcpProtectedResourceMetadata(MCP_URL, env), null);
  }
  assert.deepEqual(
    buildMcpProtectedResourceMetadata(MCP_URL, {
      SUPABASE_URL: "https://abc.supabase.co/",
    })?.authorization_servers,
    ["https://abc.supabase.co/auth/v1"],
  );
});
