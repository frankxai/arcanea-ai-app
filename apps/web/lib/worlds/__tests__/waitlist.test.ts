import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../../../app/api/waitlist/route";

const body = {
  email: "creator@example.test",
  program: "arcanea-founding-circle",
};
const request = (input: unknown) =>
  new NextRequest("https://www.arcanea.ai/api/waitlist", {
    method: "POST",
    body: JSON.stringify(input),
    headers: { "content-type": "application/json" },
  });

test("waitlist only reports success for an explicit accepted capture", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (_url, init) => {
      const sent = JSON.parse(init!.body as string);
      assert.equal(sent.email, body.email);
      assert.equal(sent.program, body.program);
      return Response.json({ accepted: true });
    };
    const response = await POST(request(body));
    assert.equal(response.status, 201);
    assert.equal((await response.json()).success, true);
  } finally {
    globalThis.fetch = original;
  }
});

test("waitlist rejects invalid email, body and program without contacting storage", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      throw new Error("must not call storage");
    };
    for (const invalid of [
      null,
      [],
      { ...body, email: "invalid" },
      { ...body, program: "unknown" },
    ])
      assert.equal((await POST(request(invalid))).status, 400);
  } finally {
    globalThis.fetch = original;
  }
});

test("waitlist fails closed on transport, rejected, malformed and ambiguous results", async () => {
  const original = globalThis.fetch;
  try {
    const cases = [
      async () => {
        throw new Error("offline");
      },
      async () => Response.json({ accepted: false }),
      async () => new Response("not json"),
      async () => Response.json({ success: true }),
      async () => Response.json({ accepted: true }, { status: 500 }),
    ];
    for (const handler of cases) {
      globalThis.fetch = handler;
      const response = await POST(request(body));
      assert.equal(response.status, 503);
      assert.equal((await response.json()).success, false);
    }
  } finally {
    globalThis.fetch = original;
  }
});

test("waitlist preserves rate limiting", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({}, { status: 429 });
    const response = await POST(request(body));
    assert.equal(response.status, 429);
    assert.ok(response.headers.get("retry-after"));
    assert.equal((await response.json()).success, false);
  } finally {
    globalThis.fetch = original;
  }
});
