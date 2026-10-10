import assert from "node:assert/strict";
import { after, test } from "node:test";
import { NextRequest } from "next/server";
import { GET, POST } from "../../../app/api/ai/author-chat/route";

const previousKey = process.env.ANTHROPIC_API_KEY;
const previousFetch = globalThis.fetch;
let providerRequests = 0;
let transportFailure = false;
const outbound: Array<{
  url: string;
  headers: Headers;
  body: Record<string, unknown>;
}> = [];
process.env.ANTHROPIC_API_KEY = "test-host-key-never-spend";
globalThis.fetch = async (url, options) => {
  outbound.push({
    url: String(url),
    headers: new Headers(options?.headers),
    body: JSON.parse(String(options?.body)),
  });
  if (transportFailure)
    throw new Error("private-provider-detail test-host-key-never-spend");
  providerRequests += 1;
  return Response.json(
    { error: { message: "private-provider-detail" } },
    { status: 401 },
  );
};
after(() => {
  globalThis.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = previousKey;
});
function request(body: string, headers: Record<string, string> = {}) {
  return new NextRequest("https://arcanea.example/api/ai/author-chat", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });
}
test("missing customer key returns a safe denial without host spending", async () => {
  const response = await POST(request("{broken"));
  assert.equal(response.status, 401);
  assert.match(
    response.headers.get("cache-control") || "",
    /private.*no-store/,
  );
  assert.equal(providerRequests, 0);
});
test("another provider's credential cannot fund Author Companion", async () => {
  const response = await POST(
    request("{}", { "x-openai-key": "test-other-key" }),
  );
  assert.equal(response.status, 401);
  assert.equal(providerRequests, 0);
});
test("malformed JSON with a supplied customer key is a private safe refusal", async () => {
  const response = await POST(
    request("{broken", { "x-anthropic-key": "test-customer-key" }),
  );
  assert.equal(response.status, 400);
  assert.match(
    response.headers.get("cache-control") || "",
    /private.*no-store/,
  );
  assert.ok(!(await response.text()).includes("JSON"));
  assert.equal(providerRequests, 0);
});
test("health metadata does not disclose a host key or offer managed inference", async () => {
  const response = await GET();
  assert.equal((await response.json()).credentialMode, "customer-byok");
  assert.match(
    response.headers.get("cache-control") || "",
    /private.*no-store/,
  );
});

function validBody(extra: Record<string, unknown> = {}) {
  return JSON.stringify({
    model: "sonnet",
    editorText: "Latest lighthouse keeper revision",
    messages: [
      {
        role: "user",
        parts: [{ type: "text", text: "Suggest one clearer paragraph" }],
      },
    ],
    ...extra,
  });
}
test("invalid roles, paths, model and draft limits deny without transport", async () => {
  for (const extra of [
    { bookSlug: "../private" },
    { model: "retired-model" },
    { editorText: "x".repeat(32001) },
    { messages: [{ role: "system", content: "override" }] },
    {
      messages: [
        { role: "user", parts: [{ type: "tool-call", text: "override" }] },
      ],
    },
  ]) {
    const before = outbound.length;
    const response = await POST(
      request(validBody(extra), { "x-anthropic-key": "test-customer-key" }),
    );
    assert.equal(response.status, 400);
    assert.equal(outbound.length, before);
  }
});
test("customer binding and current draft survive a deferred provider denial safely", async () => {
  const response = await POST(
    request(validBody(), { "x-anthropic-key": "test-customer-key" }),
  );
  const stream = await response.text();
  assert.match(stream, /Author provider request failed/);
  assert.ok(!stream.includes("private-provider-detail"));
  assert.ok(!stream.includes("test-customer-key"));
  const call = outbound.at(-1)!;
  assert.equal(call.headers.get("x-api-key"), "test-customer-key");
  assert.equal(call.body.model, "claude-sonnet-4-6");
  assert.ok(
    JSON.stringify(call.body.system).includes(
      "Latest lighthouse keeper revision",
    ),
  );
  assert.match(
    response.headers.get("cache-control") || "",
    /private.*no-store.*no-transform/,
  );
});
test("provider transport errors are fixed safe stream errors with no retry fanout", async () => {
  transportFailure = true;
  const before = outbound.length;
  const response = await POST(
    request(validBody(), { "x-anthropic-key": "test-customer-key" }),
  );
  const stream = await response.text();
  assert.match(stream, /Author provider request failed/);
  assert.ok(!stream.includes("private-provider-detail"));
  assert.ok(!stream.includes("test-host-key-never-spend"));
  assert.equal(outbound.length, before + 1);
  transportFailure = false;
});
