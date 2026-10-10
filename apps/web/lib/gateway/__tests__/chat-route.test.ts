import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { NextRequest } from "next/server";
import { GET, POST } from "../../../app/api/v1/chat/completions/route";
import { CURATED_MODELS } from "../models";

const originalFetch = globalThis.fetch;
const originalServerKey = process.env.OPENAI_API_KEY;
const model = CURATED_MODELS.find(
  (candidate) => candidate.provider === "openai",
)!;
const calls: Array<{
  url: string;
  headers: Headers;
  body: Record<string, unknown>;
}> = [];
let requestNumber = 0;

function request(
  headers: Record<string, string> = {},
  body: unknown = {
    model: model.id,
    messages: [{ role: "user", content: "Draft a scene." }],
  },
) {
  return new NextRequest("https://arcanea.example/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `198.51.100.${++requestNumber}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  calls.length = 0;
  process.env.OPENAI_API_KEY = "test-server-key-never-forward";
  globalThis.fetch = async (input, init) => {
    calls.push({
      url: String(input),
      headers: new Headers(init?.headers),
      body: JSON.parse(String(init?.body)),
    });
    return Response.json({
      id: "test-completion",
      object: "chat.completion",
      model: "provider-model",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: "A scene." },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 },
    });
  };
});

after(() => {
  globalThis.fetch = originalFetch;
  if (originalServerKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalServerKey;
});

test("anonymous compatibility chat cannot spend a configured server key", async () => {
  const response = await POST(request({ "x-arcanea-tier": "studio" }));
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});

test("customer credential stays bound to OpenAI and caller tier is ignored", async () => {
  const response = await POST(
    request({
      "x-openai-key": "test-customer-key",
      "x-arcanea-tier": "studio",
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-ratelimit-tier"), "seeker");
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].headers.get("authorization"),
    "Bearer test-customer-key",
  );
  assert.equal(calls[0].body.model, model.providerModelId);
  assert.equal((await response.json()).model, model.id);
});

test("malformed credential maps fail before provider execution", async () => {
  for (const packed of [
    "{",
    "null",
    "[]",
    '{"__proto__":"test-private-value"}',
    '{"openai":7}',
  ]) {
    const response = await POST(request({ "x-provider-keys": packed }));
    assert.equal(response.status, 400, packed);
    assert.doesNotMatch(
      await response.text(),
      /test-private-value|test-server-key/,
    );
    assert.equal(calls.length, 0);
  }
});

test("invalid JSON and message structure return a client error", async () => {
  const malformed = new NextRequest(
    "https://arcanea.example/api/v1/chat/completions",
    { method: "POST", body: "{" },
  );
  assert.equal((await POST(malformed)).status, 400);
  for (const body of [
    null,
    { model: model.id, messages: "hello" },
    { model: model.id, messages: [null] },
  ]) {
    assert.equal(
      (await POST(request({ "x-openai-key": "test-customer-key" }, body)))
        .status,
      400,
    );
  }
  assert.equal(calls.length, 0);
});

test("upstream failure does not expose provider response contents", async () => {
  globalThis.fetch = async () =>
    new Response("test-customer-key and private prompt", { status: 401 });
  const response = await POST(request({ "x-openai-key": "test-customer-key" }));
  assert.equal(response.status, 401);
  assert.doesNotMatch(
    await response.text(),
    /test-customer-key|private prompt/,
  );
});

test("health describes the public credential contract", async () => {
  const response = await GET();
  const health = await response.json();
  assert.equal(health.status, "customer-key-required");
  assert.equal(health.credentialMode, "customer-byok");
  assert.equal(health.managedInference, "disabled");
});

test("proxy admits only the exact customer-key compatibility path and verbs", async () => {
  const { proxy } = await import("../../../proxy");
  for (const method of ["GET", "POST"]) {
    const response = await proxy(
      new NextRequest("https://www.arcanea.ai/api/v1/chat/completions", {
        method,
      }),
    );
    assert.equal(response.headers.get("x-middleware-next"), "1");
  }
  for (const [method, pathname] of [
    ["PUT", "/api/v1/chat/completions"],
    ["GET", "/api/v1/chat/completions/extra"],
    ["GET", "/api/v1/chat/completions-evil"],
    ["GET", "/api/v1/models"],
  ]) {
    const response = await proxy(
      new NextRequest("https://www.arcanea.ai" + pathname, { method }),
    );
    assert.notEqual(response.headers.get("x-middleware-next"), "1");
    assert.ok(response.status >= 400);
  }
  assert.equal(calls.length, 0);
});

test("a real AI SDK client reaches customer-key chat through middleware without a session", async () => {
  const { createOpenAI } = await import("@ai-sdk/openai");
  const { generateText } = await import("ai");
  const { proxy } = await import("../../../proxy");
  const customer = createOpenAI({
    apiKey: "sk-test-key",
    baseURL: "https://www.arcanea.ai/api/v1",
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set("x-forwarded-for", `198.51.100.${++requestNumber}`);
      const req = new NextRequest(String(input), {
        ...init,
        headers,
        signal: init?.signal ?? undefined,
      });
      assert.equal(req.nextUrl.pathname, "/api/v1/chat/completions");
      assert.equal((await proxy(req)).headers.get("x-middleware-next"), "1");
      return POST(req);
    },
  });
  const result = await generateText({
    model: customer.chat(model.id),
    prompt: "Draft a scene.",
    maxRetries: 0,
  });
  assert.equal(result.text, "A scene.");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.get("authorization"), "Bearer sk-test-key");
});

test("keys for another provider cannot fall back to server credentials", async () => {
  const response = await POST(
    request({ "x-anthropic-key": "test-anthropic-key" }),
  );
  assert.equal(response.status, 401);
  assert.equal(calls.length, 0);
});

test("oversized keys and unsupported managed tokens fail before dispatch", async () => {
  const invalidHeaders: Record<string, string>[] = [
    { "x-openai-key": "x".repeat(8193) },
    { "x-provider-keys": JSON.stringify({ openai: "x".repeat(16385) }) },
    { authorization: "Bearer arc_test-unissued-token" },
  ];
  for (const headers of invalidHeaders) {
    assert.equal((await POST(request(headers))).status, 400);
  }
  assert.equal(calls.length, 0);
});

test("recognized bearer keys and explicit headers override a packed key", async () => {
  const response = await POST(
    request({
      "x-provider-keys": '{"openai":"test-packed-key"}',
      "x-openai-key": "test-header-key",
      authorization: "Bearer sk-test-bearer-key",
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(
    calls[0].headers.get("authorization"),
    "Bearer sk-test-bearer-key",
  );
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});

test("customer streaming preserves text and remaps the model identifier", async () => {
  globalThis.fetch = async (_input, init) => {
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer test-stream-key",
    );
    return new Response(
      'data: {"id":"test-stream","object":"chat.completion.chunk","model":"provider-model","choices":[{"index":0,"delta":{"content":"A scene."},"finish_reason":null}]}\n\ndata: [DONE]\n\n',
      { headers: { "content-type": "text/event-stream" } },
    );
  };
  const response = await POST(
    request(
      { "x-openai-key": "test-stream-key" },
      {
        model: model.id,
        messages: [{ role: "user", content: "Draft a scene." }],
        stream: true,
      },
    ),
  );
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("cache-control"),
    "private, no-store, no-transform",
  );
  assert.equal(response.headers.get("x-accel-buffering"), "no");
  const text = await response.text();
  assert.match(text, /A scene\./);
  assert.ok(text.includes(model.id));
  assert.match(text, /\[DONE\]/);
});

test("transport errors are sanitized", async () => {
  globalThis.fetch = async () => {
    throw new Error("test-customer-key and private prompt");
  };
  const response = await POST(request({ "x-openai-key": "test-customer-key" }));
  assert.equal(response.status, 500);
  assert.doesNotMatch(
    await response.text(),
    /test-customer-key|private prompt/,
  );
});

test("UI chat and its alias deny missing keys and advertise customer credentials", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  const alias = await import("../../../app/api/chat/route");
  assert.equal(alias.POST, ui.POST);
  const body = {
    provider: "openai",
    messages: [{ role: "user", content: "Draft a scene." }],
  };
  assert.equal((await ui.POST(request({}, body))).status, 401);
  assert.equal((await alias.POST(request({}, body))).status, 401);
  assert.equal(calls.length, 0);
  const health = await (await ui.GET()).json();
  assert.equal(health.credentialMode, "customer-byok");
  assert.equal(health.managedInference, "disabled");
  assert.ok(
    Object.values(health.providers).every((enabled) => enabled === false),
  );
});

test("UI malformed JSON and non-object bodies return a private client error before transport", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  for (const body of ["{invalid", "null", "[]", "7"]) {
    const response = await ui.POST(
      new NextRequest("https://arcanea.example/api/ai/chat", {
        method: "POST",
        headers: { "x-forwarded-for": `198.51.100.${++requestNumber}` },
        body,
      }),
    );
    assert.equal(response.status, 400);
    assert.equal(await response.text(), "Invalid request body.");
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
  assert.equal(calls.length, 0);
});

test("UI empty customer keys use the same private Settings recovery as missing keys", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  for (const clientApiKey of ["", " ", "\t"]) {
    const response = await ui.POST(
      request(
        {},
        {
          provider: "openai",
          clientApiKey,
          messages: [{ role: "user", content: "Draft a scene." }],
        },
      ),
    );
    assert.equal(response.status, 401);
    assert.equal(
      await response.text(),
      "Connect your provider key in Settings → Providers to use chat.",
    );
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
  assert.equal(calls.length, 0);
});

test("UI chat cannot invoke platform-funded tools with a customer text key", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  const response = await ui.POST(
    request(
      {},
      {
        provider: "openai",
        clientApiKey: "test-customer-key",
        enabledTools: ["image"],
        messages: [{ role: "user", content: "Generate an image." }],
      },
    ),
  );
  assert.equal(response.status, 403);
  assert.match(await response.text(), /Imagine/);
  assert.equal(calls.length, 0);
  for (const tool of ["search", "research", "think", "jarvis"]) {
    const funded = await ui.POST(
      request(
        {},
        {
          provider: "openai",
          clientApiKey: "test-customer-key",
          searchApiKey: "test-customer-search-key",
          enabledTools: [tool],
          messages: [{ role: "user", content: "Investigate this topic." }],
        },
      ),
    );
    assert.equal(funded.status, 403);
  }
  assert.equal(calls.length, 0);
  for (const enabledTools of ["image", null, {}, [7]]) {
    const malformed = await ui.POST(
      request(
        {},
        {
          provider: "openai",
          clientApiKey: "test-customer-key",
          enabledTools,
          messages: [{ role: "user", content: "Generate an image." }],
        },
      ),
    );
    assert.equal(malformed.status, 400);
  }
  assert.equal(calls.length, 0);
});

test("public operator endpoint refuses host actions without inspecting files", async () => {
  const operator = await import("../../../app/api/voice/tools/route");
  for (const action of [
    "system_status",
    "git_today",
    "list_open_prs",
    "search_repo",
    "read_file",
    "explain_arcanea",
  ]) {
    const response = await operator.POST(
      new Request("https://arcanea.example/api/voice/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          args: { path: "sensitive-marker.env", query: "fixture" },
        }),
      }),
    );
    assert.equal(response.status, 403);
    assert.equal((await response.json()).ok, false);
  }
  assert.equal(calls.length, 0);
});

test("UI chat refuses malformed customer keys before SDK transport", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  for (const clientApiKey of [7, "x".repeat(8193), "test\nkey"]) {
    const response = await ui.POST(
      request(
        {},
        {
          provider: "openai",
          clientApiKey,
          messages: [{ role: "user", content: "Draft a scene." }],
        },
      ),
    );
    assert.equal(response.status, 400);
  }
  assert.equal(calls.length, 0);
});

test("UI customer chat streams through the real AI SDK with the customer key", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  let providerCalls = 0;
  globalThis.fetch = async (input, init) => {
    providerCalls++;
    assert.equal(String(input), "https://api.anthropic.com/v1/messages");
    assert.equal(
      new Headers(init?.headers).get("x-api-key"),
      "test-ui-customer-key",
    );
    const events = [
      {
        type: "message_start",
        message: {
          id: "msg_test",
          type: "message",
          role: "assistant",
          content: [],
          model: "claude-sonnet-4-6",
          stop_reason: null,
          stop_sequence: null,
          usage: { input_tokens: 3, output_tokens: 0 },
        },
      },
      {
        type: "content_block_start",
        index: 0,
        content_block: { type: "text", text: "" },
      },
      {
        type: "content_block_delta",
        index: 0,
        delta: {
          type: "text_delta",
          text: "A scene from the customer provider.",
        },
      },
      { type: "content_block_stop", index: 0 },
      {
        type: "message_delta",
        delta: { stop_reason: "end_turn", stop_sequence: null },
        usage: { output_tokens: 7 },
      },
      { type: "message_stop" },
    ];
    return new Response(
      events
        .map(
          (event) => `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
        )
        .join(""),
      { headers: { "content-type": "text/event-stream" } },
    );
  };
  const response = await ui.POST(
    request(
      {},
      {
        provider: "anthropic",
        clientApiKey: "test-ui-customer-key",
        messages: [{ role: "user", content: "Draft a scene." }],
      },
    ),
  );
  assert.equal(response.status, 200);
  const content = await response.text();
  assert.match(content, /A scene from the customer provider\./);
  assert.equal(providerCalls, 1);
  assert.equal(response.headers.get("x-arcanea-api-key-source"), "client-byok");
  assert.equal(
    response.headers.get("cache-control"),
    "private, no-store, no-transform",
  );
  assert.equal(response.headers.get("x-accel-buffering"), "no");
});

test("UI provider failures after returning the response have a fixed private stream error", async () => {
  const ui = await import("../../../app/api/ai/chat/route");
  const customerKey = "test-ui-customer-key";
  const prompt = "Private scene draft in a provider failure fixture.";
  const error = {
    type: "authentication_error",
    message: `${customerKey}: ${prompt}`,
  };
  for (const mode of ["http", "stream"]) {
    let providerCalls = 0;
    const originalError = console.error;
    const logs: string[] = [];
    console.error = (...values: unknown[]) => {
      logs.push(values.map(String).join(" "));
    };
    globalThis.fetch = async () => {
      providerCalls++;
      return mode === "http"
        ? Response.json({ type: "error", error }, { status: 401 })
        : new Response(
            `event: error\ndata: ${JSON.stringify({ type: "error", error })}\n\n`,
            { headers: { "content-type": "text/event-stream" } },
          );
    };
    try {
      const response = await ui.POST(
        request(
          {},
          {
            provider: "anthropic",
            clientApiKey: customerKey,
            messages: [{ role: "user", content: prompt }],
          },
        ),
      );
      assert.equal(response.status, 200);
      assert.equal(
        response.headers.get("cache-control"),
        "private, no-store, no-transform",
      );
      assert.equal(response.headers.get("x-accel-buffering"), "no");
      const content = await response.text();
      assert.ok(!content.includes(customerKey));
      assert.ok(!content.includes(prompt));
      assert.ok(!logs.join(" ").includes(customerKey));
      assert.ok(!logs.join(" ").includes(prompt));
      assert.match(content, /"errorText":"Provider request failed\."/);
      assert.deepEqual(logs, ["Chat provider stream failed."]);
      assert.equal(providerCalls, 1);
    } finally {
      console.error = originalError;
    }
  }
});
