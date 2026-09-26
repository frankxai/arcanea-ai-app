import { test } from "node:test";
import assert from "node:assert/strict";
import { joinWaitlist, type WaitlistInsert } from "../join";

const ok: WaitlistInsert = async () => ({ error: null });

test("a saved signup succeeds with a normalised email", async () => {
  let saved: { email: string; source: string } | undefined;
  const result = await joinWaitlist("  Reader@Example.COM ", async (row) => {
    saved = row;
    return { error: null };
  });
  assert.equal(result.status, 200);
  assert.deepEqual(saved, {
    email: "reader@example.com",
    source: "pricing_founding_circle",
  });
});

test("a failed save is reported, never shown as success", async () => {
  const result = await joinWaitlist("reader@example.com", async () => ({
    error: { code: "42P01", message: 'relation "public.waitlists" does not exist' },
  }));
  assert.equal(result.status, 503);
  assert.equal(result.body.success, false);
});

test("a repeat signup is already on the list", async () => {
  const result = await joinWaitlist("reader@example.com", async () => ({
    error: { code: "23505", message: "duplicate key value" },
  }));
  assert.equal(result.status, 200);
});

test("invalid emails are rejected before any write", async () => {
  let writes = 0;
  const counting: WaitlistInsert = async () => {
    writes += 1;
    return { error: null };
  };
  for (const email of [undefined, 42, "", "invalid", "a@b", "@example.com", `${"a".repeat(320)}@x.io`]) {
    const result = await joinWaitlist(email, counting);
    assert.equal(result.status, 400, String(email));
  }
  assert.equal(writes, 0);
  assert.equal((await joinWaitlist("a@b.co", ok)).status, 200);
});
