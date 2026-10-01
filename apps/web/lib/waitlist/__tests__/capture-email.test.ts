import { test } from "node:test";
import assert from "node:assert/strict";
import { captureEmail, type EmailInsert } from "../capture-email.ts";

const ok: EmailInsert = async () => ({ error: null });

test("a saved signup succeeds with a normalised email", async () => {
  let saved: { email: string; source: string } | undefined;
  const result = await captureEmail("  Reader@Example.COM ", async (row) => {
    saved = row;
    return { error: null };
  });
  assert.equal(result.status, 200);
  assert.deepEqual(saved, {
    email: "reader@example.com",
    source: "footer",
  });
});

test("a failed save is reported, never shown as success", async () => {
  const result = await captureEmail("reader@example.com", async () => ({
    error: {
      code: "42P01",
      message: 'relation "public.subscribers" does not exist',
    },
  }));
  assert.equal(result.status, 503);
  assert.equal(result.body.success, false);
});

test("a repeat signup is already on the list", async () => {
  const result = await captureEmail("reader@example.com", async () => ({
    error: { code: "23505", message: "duplicate key value" },
  }));
  assert.equal(result.status, 200);
});

test("invalid emails are rejected before any write", async () => {
  let writes = 0;
  const counting: EmailInsert = async () => {
    writes += 1;
    return { error: null };
  };
  for (const email of [
    undefined,
    42,
    "",
    "invalid",
    "a@b",
    "@example.com",
    "a@@b.co",
    "a@b@c.co",
    "a@.co",
    "a@b.",
    "a b@c.co",
    `${"a".repeat(320)}@x.io`,
  ]) {
    const result = await captureEmail(email, counting);
    assert.equal(result.status, 400, String(email));
  }
  assert.equal(writes, 0);
  assert.equal((await captureEmail("a@b.co", ok)).status, 200);
});

test("hostile input is refused quickly", async () => {
  const started = performance.now();
  const result = await captureEmail(`!@!${"!.".repeat(50_000)}`, ok);
  assert.equal(result.status, 400);
  assert.ok(performance.now() - started < 50);
});
