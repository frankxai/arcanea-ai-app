import assert from "node:assert/strict";
import test from "node:test";
import { withAbortDeadline } from "../async-deadline";

test("hard deadline settles work even when the client ignores abort", async () => {
  let observedSignal: AbortSignal | undefined;
  const startedAt = performance.now();

  await assert.rejects(
    withAbortDeadline("hung operation", 25, (signal) => {
      observedSignal = signal;
      return new Promise<never>(() => {});
    }),
    /hung operation exceeded 25ms/
  );

  assert.equal(observedSignal?.aborted, true);
  assert.ok(
    performance.now() - startedAt < 500,
    "the hard deadline must not inherit the hung operation's lifetime"
  );
});

test("completed work clears the deadline without aborting", async () => {
  let observedSignal: AbortSignal | undefined;

  const result = await withAbortDeadline(
    "fast operation",
    1_000,
    async (signal) => {
      observedSignal = signal;
      return "ok";
    }
  );

  assert.equal(result, "ok");
  assert.equal(observedSignal?.aborted, false);
});
