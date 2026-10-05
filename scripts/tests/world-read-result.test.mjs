import assert from "node:assert/strict";
import test from "node:test";
import {
  WorldReadUnavailableError,
  worldReadFailure,
  worldRootFromResult,
} from "../../apps/web/lib/worlds/read-result.ts";

test("only a successful zero-row result means missing or invisible", () => {
  assert.equal(worldRootFromResult({ data: null, error: null }), null);
  const world = { id: "world-id", visibility: "public" };
  assert.equal(worldRootFromResult({ data: world, error: null }), world);
});

for (const code of ["42P17", "42501", "57014", "PGRST116", "PGRST301"]) {
  test(`${code} remains unavailable even when data is absent or present`, () => {
    for (const data of [null, { id: "world-id" }]) {
      assert.throws(
        () =>
          worldRootFromResult({
            data,
            error: { code, message: "private database detail" },
          }),
        WorldReadUnavailableError,
      );
    }
  });
}

test("safe diagnostics retain the policy code without messages or hints", () => {
  assert.deepEqual(
    worldReadFailure({ code: "42P17", message: "private row", hint: "secret" }),
    { code: "42P17" },
  );
  for (const error of [
    null,
    "secret",
    new Error("credential"),
    { code: "https://secret.invalid" },
  ]) {
    assert.deepEqual(worldReadFailure(error), { code: "unavailable" });
  }
  const error = new WorldReadUnavailableError();
  assert.equal(
    error.message,
    "This world could not be loaded. Please try again.",
  );
  assert.equal("cause" in error, false);
});
