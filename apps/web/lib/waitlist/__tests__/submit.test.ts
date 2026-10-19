import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import test from "node:test";
import { submitWaitlist } from "../submit";
import { joinWaitlist } from "../join";

test("footer uses the existing subscribe endpoint and exact source", async () => {
  const result = await submitWaitlist(" Reader@Example.com ", "footer", {
    endpoint: "/api/subscribe",
    request: async (url, options) => {
      assert.equal(url, "/api/subscribe");
      assert.deepEqual(JSON.parse(String(options?.body)), {
        email: "Reader@Example.com",
        source: "footer",
      });
      return Response.json({ success: true });
    },
  });
  assert.deepEqual(result, { success: true });
});

test("only the known invalid-email receipt marks the field invalid", async () => {
  const message = "Please enter a valid email address.";
  assert.deepEqual(
    await submitWaitlist("a@b", "footer", {
      endpoint: "/api/subscribe",
      request: async () =>
        Response.json({ success: false, error: message }, { status: 400 }),
    }),
    { success: false, error: message, invalidEmail: true },
  );
  for (const [status, body] of [
    [400, { success: true, error: message }],
    [400, { success: false, error: "private diagnostic" }],
    [503, { success: false, error: message }],
  ] as const) {
    const result = await submitWaitlist("a@b", "footer", {
      request: async () => Response.json(body, { status }),
    });
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.invalidEmail, undefined);
      assert.equal(
        result.error,
        "We couldn't confirm your signup. Please try again.",
      );
    }
  }
});

test("sends only the current email/source contract and accepts explicit success", async () => {
  const result = await submitWaitlist(
    "  Reader@Example.com  ",
    "community_footer",
    {
      request: async (url, options) => {
        assert.equal(url, "/api/waitlist");
        assert.equal(options?.method, "POST");
        assert.deepEqual(options?.headers, {
          "Content-Type": "application/json",
        });
        assert.deepEqual(JSON.parse(String(options?.body)), {
          email: "Reader@Example.com",
          source: "community_footer",
        });
        assert.ok(options?.signal instanceof AbortSignal);
        return Response.json({
          success: true,
          message: "Welcome to the Founding Circle!",
        });
      },
    },
  );
  assert.deepEqual(result, { success: true });
});

test("HTTP errors cannot claim success even with a success body", async () => {
  for (const status of [400, 429, 503]) {
    const result = await submitWaitlist("a@example.com", "community_footer", {
      request: async () => Response.json({ success: true }, { status }),
    });
    assert.equal(result.success, false);
  }
});

test("HTTP 200 needs a literal true receipt", async () => {
  for (const body of [
    null,
    [],
    {},
    { success: false },
    { success: "true" },
    { success: 1 },
  ]) {
    const result = await submitWaitlist("a@example.com", "community_footer", {
      request: async () => Response.json(body),
    });
    assert.equal(result.success, false, JSON.stringify(body));
  }
});

test("invalid JSON and empty responses remain failures", async () => {
  for (const response of [
    new Response("<html>Bad gateway</html>"),
    new Response(null, { status: 204 }),
  ]) {
    const result = await submitWaitlist("a@example.com", "community_footer", {
      request: async () => response,
    });
    assert.equal(result.success, false);
  }
});

test("transport failure is recoverable without leaking transport details", async () => {
  const result = await submitWaitlist("a@example.com", "community_footer", {
    request: async () => {
      throw new Error("private transport diagnostics");
    },
  });
  assert.equal(result.success, false);
  if (!result.success)
    assert.equal(
      result.error,
      "We couldn't confirm your signup. Please try again.",
    );
});

test(
  "deadline aborts a pending request and describes uncertain persistence",
  { timeout: 1_000 },
  async () => {
    let signal: AbortSignal | undefined;
    const result = await submitWaitlist("a@example.com", "community_footer", {
      timeoutMs: 10,
      request: async (_url, options) => {
        assert.ok(options?.signal);
        signal = options.signal;
        return new Promise<Response>((_resolve, reject) => {
          signal!.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        });
      },
    });
    assert.equal(signal?.aborted, true);
    assert.equal(result.success, false);
    if (!result.success)
      assert.match(result.error, /may have been saved; retrying is safe/);
  },
);

test(
  "deadline also aborts response body consumption",
  { timeout: 1_000 },
  async () => {
    const result = await submitWaitlist("a@example.com", "community_footer", {
      timeoutMs: 10,
      request: async (_url, options) => {
        assert.ok(options?.signal);
        const signal = options.signal;
        return new Response(
          new ReadableStream({
            start(controller) {
              signal.addEventListener(
                "abort",
                () =>
                  controller.error(new DOMException("Aborted", "AbortError")),
                { once: true },
              );
            },
          }),
        );
      },
    });
    assert.equal(result.success, false);
    if (!result.success) assert.match(result.error, /timed out/);
  },
);

test(
  "completed requests clear their deadline",
  { timeout: 1_000 },
  async () => {
    let signal: AbortSignal | undefined;
    const result = await submitWaitlist("a@example.com", "community_footer", {
      timeoutMs: 10,
      request: async (_url, options) => {
        assert.ok(options?.signal);
        signal = options.signal;
        return Response.json({ success: true });
      },
    });
    assert.equal(result.success, true);
    await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(signal?.aborted, false);
  },
);

test(
  "real HTTP fixture preserves the current insert adapter's source and failure receipts",
  { timeout: 5_000 },
  async (t) => {
    const saved: { email: string; source: string }[] = [];
    let fail = false;
    // This fixture executes the unchanged insert adapter, not Next's route or Supabase.
    const server = createServer(async (req, res) => {
      assert.equal(req.method, "POST");
      assert.equal(req.url, "/api/waitlist");
      let body = "";
      for await (const part of req) body += String(part);
      const payload = JSON.parse(body);
      const result = await joinWaitlist(
        payload.email,
        async (row) => {
          if (fail)
            return { error: { code: "42P01", message: "fixture unavailable" } };
          if (saved.some((item) => item.email === row.email))
            return { error: { code: "23505", message: "duplicate" } };
          saved.push(row);
          return { error: null };
        },
        payload.source,
      );
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.body));
    });
    t.after(async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const request: typeof fetch = (url, options) =>
      fetch(`http://127.0.0.1:${address.port}${url}`, options);
    assert.deepEqual(
      await submitWaitlist(" Reader@Example.COM ", "community_footer", {
        request,
      }),
      { success: true },
    );
    assert.deepEqual(saved, [
      { email: "reader@example.com", source: "community_footer" },
    ]);
    assert.deepEqual(
      await submitWaitlist("reader@example.com", "community_footer", {
        request,
      }),
      { success: true },
    );
    assert.equal(saved.length, 1);
    fail = true;
    assert.equal(
      (
        await submitWaitlist("other@example.com", "community_footer", {
          request,
        })
      ).success,
      false,
    );
    assert.equal(saved.length, 1);
    assert.equal(
      (await submitWaitlist("invalid", "community_footer", { request }))
        .success,
      false,
    );
    assert.equal(saved.length, 1);
  },
);
