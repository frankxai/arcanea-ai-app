import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { z } from "zod";
import { validateBody, validateQuery } from "../schemas";

const schema = z.object({ page: z.number().int().positive() });

test("body validation returns useful field errors without throwing", async () => {
  const result = await validateBody(
    new NextRequest("https://arcanea.example/api/fixture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ page: -1 }),
    }),
    schema,
  );
  assert.equal(result.success, false);
  if (result.success) assert.fail("Invalid body was accepted");
  assert.equal(result.error.status, 400);
  const body = await result.error.json();
  assert.equal(body.error, "Validation failed");
  assert.equal(body.details[0].field, "page");
  assert.equal(typeof body.details[0].message, "string");
});

test("query validation returns useful field errors without throwing", async () => {
  const result = validateQuery(
    new NextRequest("https://arcanea.example/api/fixture?page=-1"),
    schema,
  );
  assert.equal(result.success, false);
  if (result.success) assert.fail("Invalid query was accepted");
  assert.equal(result.error.status, 400);
  const body = await result.error.json();
  assert.equal(body.details[0].field, "page");
  assert.equal(typeof body.details[0].message, "string");
});

test("malformed JSON stays a recoverable body error", async () => {
  const result = await validateBody(
    new NextRequest("https://arcanea.example/api/fixture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{broken",
    }),
    schema,
  );
  assert.equal(result.success, false);
  if (result.success) assert.fail("Malformed JSON was accepted");
  assert.equal(result.error.status, 400);
  assert.equal((await result.error.json()).error, "Invalid request body");
});
