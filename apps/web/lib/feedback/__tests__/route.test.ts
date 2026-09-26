import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../../../app/api/feedback/route";

const unavailable = {
  error: "Feedback is temporarily unavailable. Please try again.",
};

let requestNumber = 0;
function request(body: unknown) {
  requestNumber++;
  return new NextRequest("https://www.arcanea.ai/api/feedback", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100." + requestNumber,
    },
    body: JSON.stringify(body),
  });
}

function setStorage(t: TestContext, configured: boolean) {
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

test("unconfigured storage never acknowledges feedback", async (t) => {
  setStorage(t, false);
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("No network should be reached");
  });

  await expectUnavailable(
    await POST(request({ message: "Please fix the reader." })),
  );
});

test("insert failure is retryable and hides backend details", async (t) => {
  setStorage(t, true);
  let inserts = 0;
  t.mock.method(globalThis, "fetch", async (input) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.pathname, "/rest/v1/feedback");
    inserts++;
    return new Response(
      JSON.stringify({
        code: "42P01",
        message: "private database table detail",
        details: null,
        hint: null,
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  });

  await expectUnavailable(await POST(request({ message: "A broken scene." })));
  assert.equal(inserts, 1);
});

test("transport failure remains retryable", async (t) => {
  setStorage(t, true);
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("private network detail");
  });

  await expectUnavailable(await POST(request({ message: "A missing image." })));
});

test("anonymous feedback is acknowledged after the insert", async (t) => {
  setStorage(t, true);
  let inserted: unknown;
  t.mock.method(globalThis, "fetch", async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.pathname, "/rest/v1/feedback");
    assert.equal(init?.method, "POST");
    inserted = JSON.parse(String(init?.body));
    return new Response(null, { status: 201 });
  });

  const response = await POST(
    request({
      type: "feature",
      message: "  More scene context  ",
      email: "  creator@example.test  ",
    }),
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
