import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../../../app/api/feedback/route";

const unavailable = {
  error: "Feedback is temporarily unavailable. Please try again.",
};

function request(body: unknown, address: string) {
  return new NextRequest("https://www.arcanea.ai/api/feedback", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": address,
    },
    body: JSON.stringify(body),
  });
}

function useStorage(t: TestContext, configured: boolean) {
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (configured) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  } else {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
  t.after(() => {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
  });
}

async function expectUnavailable(response: Response) {
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.deepEqual(await response.json(), unavailable);
}

test("feedback is acknowledged only after the insert is saved", async (t) => {
  let mode = "idle";
  let inserted: unknown;
  t.mock.method(
    globalThis,
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      assert.equal(url.pathname, "/rest/v1/feedback");
      if (mode === "400" || mode === "500") {
        return new Response(
          JSON.stringify({ message: "private database table detail" }),
          {
            status: mode === "400" ? 400 : 500,
            headers: { "content-type": "application/json" },
          },
        );
      }
      if (mode === "201") {
        assert.equal(init?.method, "POST");
        inserted = JSON.parse(String(init?.body));
        return new Response(null, { status: 201 });
      }
      throw new Error("No network should be reached");
    },
  );

  useStorage(t, false);
  await expectUnavailable(
    await POST(request({ message: "Please fix the reader." }, "198.51.100.1")),
  );

  useStorage(t, true);
  mode = "400";
  await expectUnavailable(
    await POST(request({ message: "A broken scene." }, "198.51.100.2")),
  );

  mode = "500";
  await expectUnavailable(
    await POST(request({ message: "A missing image." }, "198.51.100.3")),
  );

  mode = "201";
  const response = await POST(
    request(
      {
        type: "feature",
        message: "  More scene context  ",
        email: "  creator@example.test  ",
      },
      "198.51.100.4",
    ),
  );
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(inserted, {
    type: "feature",
    message: "More scene context",
    email: "creator@example.test",
    user_id: null,
  });
});
