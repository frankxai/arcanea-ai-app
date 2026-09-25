import assert from "node:assert/strict";
import { test } from "node:test";
import { checkImageAdmission } from "../admission.ts";

test("provider access requires an explicit successful spend", () => {
  assert.deepEqual(checkImageAdmission(200, { success: true }), {
    allowed: true,
  });
  for (const body of [null, {}, { success: false }, "<html>redirect</html>"]) {
    assert.deepEqual(checkImageAdmission(200, body), {
      allowed: false,
      status: 503,
      error: "Credit admission is unavailable",
    });
  }
});

test("anonymous, depleted, and throttled requests remain distinct", () => {
  for (const [responseStatus, expectedStatus] of [
    [401, 401],
    [402, 402],
    [429, 429],
    [500, 503],
  ]) {
    const result = checkImageAdmission(responseStatus, {});
    if (result.allowed)
      throw new Error(`Unexpected admission for ${responseStatus}`);
    assert.equal(result.status, expectedStatus);
  }
});
