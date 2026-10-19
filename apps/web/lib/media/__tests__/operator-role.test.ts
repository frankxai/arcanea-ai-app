import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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

test("media analyze and taste route handlers enforce operator guard, service-role writes, and ordered catalog pagination", () => {
  const webRoot = path.resolve(import.meta.dirname, "../../..");
  const analyzeSource = fs.readFileSync(
    path.join(webRoot, "app/api/media/analyze/route.ts"),
    "utf8",
  );
  const tasteSource = fs.readFileSync(
    path.join(webRoot, "app/api/media/taste/route.ts"),
    "utf8",
  );

  assert.match(analyzeSource, /await requireMediaOperator\(\)/);
  assert.match(analyzeSource, /order=storage_path\.asc/);
  assert.match(analyzeSource, /on_conflict=storage_path/);

  assert.match(tasteSource, /await requireMediaOperator\(\)/);
  assert.match(tasteSource, /resolveTrustedStorageImageUrl/);
  assert.match(tasteSource, /isValidScoreDimension/);
  assert.doesNotMatch(tasteSource, /SERVICE_KEY \|\| SUPABASE_ANON/);
});
