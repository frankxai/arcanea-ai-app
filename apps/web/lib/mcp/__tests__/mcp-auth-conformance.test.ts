import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import * as protectedResourceRoot from "../../../app/.well-known/oauth-protected-resource/route";
import * as protectedResourceMcp from "../../../app/.well-known/oauth-protected-resource/api/mcp/route";
import * as mcpRoute from "../../../app/api/mcp/route";
import { proxy } from "../../../proxy";
import {
  buildMcpProtectedResourceMetadata,
  canonicalMcpResource,
  mcpWwwAuthenticate,
  PRODUCTION_MCP_RESOURCE_URL,
} from "../protected-resource-metadata";

// End-to-end through the real proxy and the real /api/mcp route module with
// the real Supabase Bearer check. Only Supabase's /auth/v1/user is stubbed.

const SUPABASE_URL = "https://abcdefghijklmnopqrst.supabase.co";
const ORIGIN = "https://www.arcanea.ai";
const MCP_URL = `${ORIGIN}/api/mcp`;
const METADATA_URL = `${ORIGIN}/.well-known/oauth-protected-resource/api/mcp`;
const USER_ID = "20000000-0000-4000-8000-000000000001";
const ISSUER = `${SUPABASE_URL}/auth/v1`;
const WWW_AUTHENTICATE = new RegExp(
  `^Bearer resource_metadata="${METADATA_URL.replace(/[./]/g, "\\$&")}"$`,
);
const WWW_AUTHENTICATE_INVALID = new RegExp(
  `^Bearer error="invalid_token", error_description="[^"]+", resource_metadata="${METADATA_URL.replace(/[./]/g, "\\$&")}"$`,
);

// Tokens the stubbed Supabase Auth accepts (stands in for its signature check).
const issuedTokens = new Set<string>();

/** Mint a test JWT. The signature is a placeholder; Supabase is stubbed. */
function mintToken(claims: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const token = `${encode({ alg: "ES256", typ: "JWT" })}.${encode({
    iss: ISSUER,
    sub: USER_ID,
    role: "authenticated",
    exp: 4102444800,
    ...claims,
  })}.test-signature`;
  issuedTokens.add(token);
  return token;
}

const VALID_TOKEN = mintToken({ aud: MCP_URL });
const SESSION_TOKEN = mintToken({ aud: "authenticated" });

process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE = "compatibility-preview";
process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key-not-a-credential";
delete process.env.ARCANEA_MCP_RESOURCE_URL;
delete process.env.VERCEL_ENV;

interface SupabaseStub {
  tokensChecked: string[];
  otherRequests: string[];
}

/** Stub Supabase Auth: only tokens from mintToken resolve to a user. */
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
      if (!issuedTokens.has(token)) {
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

const MISSING_CREDENTIALS: Array<[string, string | undefined]> = [
  ["no Authorization header", undefined],
  ["empty Authorization header", ""],
  ["Basic scheme", "Basic dXNlcjpwYXNz"],
  ["Bearer without token", "Bearer"],
  ["Bearer with empty token", "Bearer "],
  ["Bearer with two tokens", "Bearer a.b.c d.e.f"],
  ["Bearer with a quote", 'Bearer a"b'],
  ["non-Bearer token= header", "token=valid.test.token"],
  ["oversized Bearer token", `Bearer ${"a".repeat(8193)}`],
];

for (const [label, authorization] of MISSING_CREDENTIALS) {
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
    assert.equal(stub.tokensChecked.length, 0);
    assert.deepEqual(stub.otherRequests, []);
  });
}

const REJECTED_TOKENS: Array<[string, string]> = [
  ["a token Supabase rejects", "invalid.token.x"],
  ["an expired-looking token Supabase rejects", "expired.test.token"],
  ["a plain Supabase session token (aud authenticated)", SESSION_TOKEN],
  ["a token without aud", mintToken({})],
  [
    "a token for a different resource",
    mintToken({ aud: "https://other.example/api/mcp" }),
  ],
  ["a token for a look-alike path", mintToken({ aud: `${ORIGIN}/api/mcp/` })],
  [
    "a token whose aud array omits the resource",
    mintToken({ aud: ["authenticated", "https://other.example/api/mcp"] }),
  ],
  ["a token with aud as an object", mintToken({ aud: { url: MCP_URL } })],
  [
    "a token from another issuer",
    mintToken({ aud: MCP_URL, iss: "https://evil.supabase.co/auth/v1" }),
  ],
  [
    "a token for another subject",
    mintToken({ aud: MCP_URL, sub: "20000000-0000-4000-8000-000000000009" }),
  ],
];

for (const [label, token] of REJECTED_TOKENS) {
  test(`cookie-less POST /api/mcp with ${label} gets 401 invalid_token and no data`, async (t) => {
    const stub = stubSupabase(t);
    const response = await send(mcpRequest("POST", `Bearer ${token}`));
    assert.equal(response.status, 401);
    assert.match(
      response.headers.get("www-authenticate") ?? "",
      WWW_AUTHENTICATE_INVALID,
    );
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(
      ((await response.clone().json()) as { error: { code: string } }).error
        .code,
      "invalid-token",
    );
    await assertNoData(response, label);
    // Supabase verified the token before any claim was trusted.
    assert.deepEqual(stub.tokensChecked, [token]);
  });
}

for (const [label, aud] of [
  ["aud equal to the resource", MCP_URL],
  ["aud array containing the resource", ["authenticated", MCP_URL]],
] as const) {
  test(`a cookie-less token with ${label} reaches the MCP handler`, async (t) => {
    const stub = stubSupabase(t);
    const token = mintToken({ aud });
    const response = await send(mcpRequest("POST", `Bearer ${token}`));
    assert.equal(response.status, 200);
    assert.deepEqual(stub.tokensChecked, [token]);
    assert.match(await response.text(), /arcanea_get_world_context/);
  });
}

test("Supabase Auth being unreachable is a 503, never a pass", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("fetch failed");
  });
  const response = await send(mcpRequest("POST", `Bearer ${VALID_TOKEN}`));
  assert.equal(response.status, 503);
  await assertNoData(response, "auth down");
});

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

test("a session token is rejected even for a tools/call body", async (t) => {
  const stub = stubSupabase(t);
  const response = await send(
    mcpRequest(
      "POST",
      `Bearer ${SESSION_TOKEN}`,
      JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: { name: "arcanea_get_world_context", arguments: {} },
      }),
    ),
  );
  assert.equal(response.status, 401);
  assert.deepEqual(stub.tokensChecked, [SESSION_TOKEN]);
  await assertNoData(response, "session tools/call");
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

test("with the gateway mode off, only an authenticated client sees the 503", async (t) => {
  const stub = stubSupabase(t);
  const previous = process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE;
  delete process.env.ARCANEA_WORLD_CONTEXT_GATEWAY_MODE;
  try {
    const anonymous = await send(mcpRequest("POST"));
    assert.equal(anonymous.status, 401);
    assert.match(
      anonymous.headers.get("www-authenticate") ?? "",
      WWW_AUTHENTICATE,
    );
    const invalid = await send(mcpRequest("POST", "Bearer invalid.token.x"));
    assert.equal(invalid.status, 401);
    assert.match(
      invalid.headers.get("www-authenticate") ?? "",
      WWW_AUTHENTICATE_INVALID,
    );
    const session = await send(mcpRequest("POST", `Bearer ${SESSION_TOKEN}`));
    assert.equal(session.status, 401);
    const valid = await send(mcpRequest("POST", `Bearer ${VALID_TOKEN}`));
    assert.equal(valid.status, 503);
    assert.equal(
      ((await valid.clone().json()) as { error: { code: string } }).error.code,
      "adapter-required",
    );
    await assertNoData(valid, "mode off");
    assert.deepEqual(stub.tokensChecked, [
      "invalid.token.x",
      SESSION_TOKEN,
      VALID_TOKEN,
    ]);
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
    mcpWwwAuthenticate(
      "https://arcanea-ai-app-git-x.vercel.app/api/mcp",
      {},
      {},
    ),
    'Bearer resource_metadata="https://arcanea-ai-app-git-x.vercel.app/.well-known/oauth-protected-resource/api/mcp"',
  );
});

test("canonical resource: env override, then production URL, then request origin", () => {
  const preview = "https://arcanea-ai-app-git-x.vercel.app/api/mcp";
  assert.equal(canonicalMcpResource(preview, {}), preview);
  assert.equal(
    canonicalMcpResource(preview, { VERCEL_ENV: "preview" }),
    preview,
  );
  assert.equal(PRODUCTION_MCP_RESOURCE_URL, "https://www.arcanea.ai/api/mcp");
  assert.equal(
    canonicalMcpResource("https://arcanea-ai-app.vercel.app/api/mcp", {
      VERCEL_ENV: "production",
    }),
    "https://www.arcanea.ai/api/mcp",
  );
  assert.equal(
    canonicalMcpResource(preview, {
      VERCEL_ENV: "production",
      ARCANEA_MCP_RESOURCE_URL: "https://mcp.arcanea.ai/api/mcp",
    }),
    "https://mcp.arcanea.ai/api/mcp",
  );
  for (const bad of [
    "http://www.arcanea.ai/api/mcp",
    "not a url",
    "https://x.test/api/mcp?a=1",
  ]) {
    assert.throws(() =>
      canonicalMcpResource(preview, { ARCANEA_MCP_RESOURCE_URL: bad }),
    );
  }
  // Production metadata advertises the canonical www resource.
  assert.equal(
    buildMcpProtectedResourceMetadata(
      "https://arcanea-ai-app.vercel.app/.well-known/oauth-protected-resource/api/mcp",
      { VERCEL_ENV: "production", NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL },
    )?.resource,
    "https://www.arcanea.ai/api/mcp",
  );
});

test("in production a token bound to a preview origin is rejected", async (t) => {
  stubSupabase(t);
  process.env.VERCEL_ENV = "production";
  try {
    const previewBound = mintToken({
      aud: "https://arcanea-ai-app-git-x.vercel.app/api/mcp",
    });
    const rejected = await send(mcpRequest("POST", `Bearer ${previewBound}`));
    assert.equal(rejected.status, 401);
    const prodBound = mintToken({ aud: PRODUCTION_MCP_RESOURCE_URL });
    const accepted = await send(mcpRequest("POST", `Bearer ${prodBound}`));
    assert.equal(accepted.status, 200);
  } finally {
    delete process.env.VERCEL_ENV;
  }
});

for (const [label, routeModule, path, resource] of [
  [
    "suffixed",
    protectedResourceMcp,
    "/.well-known/oauth-protected-resource/api/mcp",
    MCP_URL,
  ],
  // RFC 9728 §3.3: the root document describes the origin itself.
  [
    "root",
    protectedResourceRoot,
    "/.well-known/oauth-protected-resource",
    ORIGIN,
  ],
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
    assert.equal(metadata.resource, resource);
    assert.deepEqual(metadata.authorization_servers, [ISSUER]);
    assert.deepEqual(metadata.bearer_methods_supported, ["header"]);
    // No secret or key material is published.
    const raw = JSON.stringify(metadata);
    assert.doesNotMatch(raw, /anon|service|key|secret|eyJ/i);
  });
}

test("a token bound to the root resource (origin) is not accepted for /api/mcp", async (t) => {
  stubSupabase(t);
  const response = await send(
    mcpRequest("POST", `Bearer ${mintToken({ aud: ORIGIN })}`),
  );
  assert.equal(response.status, 401);
});

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
