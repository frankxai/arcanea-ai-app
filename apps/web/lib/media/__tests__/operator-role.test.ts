import assert from "node:assert/strict";
import { test } from "node:test";
import { hasMediaOperatorRole } from "../operator-role";

test("only trusted app metadata authorizes privileged media jobs", () => {
  assert.equal(hasMediaOperatorRole(null), false);
  assert.equal(
    hasMediaOperatorRole({ app_metadata: { role: "member" } }),
    false,
  );
  assert.equal(hasMediaOperatorRole({ app_metadata: { role: "admin" } }), true);
  assert.equal(
    hasMediaOperatorRole({
      app_metadata: { role: "member" },
      user_metadata: { role: "admin" },
    } as { app_metadata: { role: string } }),
    false,
  );
});
