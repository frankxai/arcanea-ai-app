import assert from "node:assert/strict";
import { test } from "node:test";
import { createDraftSession } from "../draft-session";

test("save drains the latest edit without overlapping or marking it saved early", async () => {
  const calls: string[] = [];
  const pending: Array<() => void> = [];
  const session = createDraftSession<string>((text) => {
    calls.push(text);
    return new Promise<void>((resolve) => pending.push(resolve));
  });
  session.edit("first revision");
  const flush = session.flush();
  await Promise.resolve();
  session.edit("second revision before debounce");
  const repeated = session.flush();
  assert.deepEqual(calls, ["first revision"]);
  assert.equal(session.snapshot().dirty, true);
  pending.shift()!();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  assert.deepEqual(calls, [
    "first revision",
    "second revision before debounce",
  ]);
  assert.equal(session.snapshot().dirty, true);
  pending.shift()!();
  await Promise.all([flush, repeated]);
  assert.equal(session.snapshot().dirty, false);
  assert.equal(session.snapshot().value, "second revision before debounce");
});

test("a failed acknowledgement retains the current revision for retry and export", async () => {
  let fail = true;
  const calls: string[] = [];
  const session = createDraftSession<string>(async (text) => {
    calls.push(text);
    if (fail) throw new Error("save unavailable");
  });
  session.edit("unsaved chapter");
  await assert.rejects(session.flush(), /save unavailable/);
  assert.equal(session.snapshot().dirty, true);
  assert.equal(session.snapshot().saving, false);
  assert.equal(session.snapshot().value, "unsaved chapter");
  fail = false;
  await session.flush();
  assert.deepEqual(calls, ["unsaved chapter", "unsaved chapter"]);
  assert.equal(session.snapshot().dirty, false);
});

test("an empty edited chapter is a valid latest revision", async () => {
  const writes: string[] = [];
  const session = createDraftSession<string>(async (text) => {
    writes.push(text);
  });
  session.edit("");
  await session.flush();
  assert.deepEqual(writes, [""]);
});
