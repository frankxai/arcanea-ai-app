import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { compile, validateSnapshot } from "../rls-initplans.mjs";

const snapshot = JSON.parse(
  readFileSync(
    new URL("../sql/arcanea-auth-policy-snapshot.json", import.meta.url),
  ),
);

test("only the 68 observed policy identities are in the bounded patch", () => {
  assert.equal(validateSnapshot(snapshot).length, 68);
  const sql = compile(snapshot);
  assert.match(sql, /ALTER POLICY %I ON %I\.%I/);
  assert.doesNotMatch(
    sql,
    /DROP POLICY|DISABLE ROW LEVEL SECURITY|GRANT |SECURITY DEFINER/,
  );
  assert.match(sql, /actual\.roles::text IS DISTINCT FROM expected\.roles/);
  assert.match(sql, /actual\.cmd IS DISTINCT FROM expected\.cmd/);
  assert.match(sql, /actual\.permissive IS DISTINCT FROM expected\.permissive/);
});

test("a repeated or out-of-scope identity is rejected before SQL generation", () => {
  assert.throws(() => compile([...snapshot, snapshot[0]]), /Duplicate/);
  assert.throws(
    () => compile([{ ...snapshot[0], schemaname: "auth" }]),
    /public schema/,
  );
});

test("an already optimized snapshot must be refreshed rather than double wrapped", () => {
  assert.throws(
    () =>
      compile([
        { ...snapshot[0], with_check: "((SELECT auth.uid()) = user_id)" },
      ]),
    /Already wrapped/,
  );
});

test("null checks stay null, with no invented authorization conditions", () => {
  const policy = snapshot.find(
    (p) => p.cmd === "UPDATE" && p.with_check === null,
  );
  const sql = compile([policy]);
  assert.match(sql, /IF new_check IS NOT NULL THEN/);
  assert.match(sql, /WITH CHECK drifted:/);
  assert.match(sql, /USING drifted:/);
});

test("rollback restores the original snapshot, under the same drift guard", () => {
  const sql = compile(snapshot, { rollback: true });
  assert.match(sql, /new_using := expected\.qual;/);
  assert.match(sql, /new_check := expected\.with_check;/);
  assert.match(sql, /Policy grants drifted:/);
});
