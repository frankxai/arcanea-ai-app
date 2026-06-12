import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  llmFromEnv,
  coverFromEnv,
  themeFromEnv,
  embedChunks,
  supabasePersister,
  createWorldWithProviders,
} from "../src/providers.mjs";
import { readWorld } from "../src/fs-world.mjs";
import { validateManifest } from "../src/validate.mjs";
import { buildIndex } from "../src/index-build.mjs";

const tmp = () => fs.mkdtemp(path.join(os.tmpdir(), "arcanea-providers-"));

test("empty env -> all provider factories return null", () => {
  assert.equal(llmFromEnv({}), null);
  assert.equal(coverFromEnv({}), null);
  assert.equal(themeFromEnv({}), null);
});

test("createWorldWithProviders on empty env equals the offline path", async () => {
  const dir = await tmp();
  const res = await createWorldWithProviders(dir, "a city of glass bells", {}, { useWorldEngine: false });
  assert.equal(res.usedLLM, false);
  assert.equal(res.usedCover, false);
  assert.equal(res.usedTheme, false);
  const { valid, errors } = validateManifest(res.manifest);
  assert.ok(valid, "manifest invalid: " + errors.join("; "));
});

test("embedChunks on empty env leaves embedding null (staged no-op)", async () => {
  const out = await embedChunks([{ id: "a", text: "hi" }], {});
  assert.equal(out.length, 1);
  assert.equal(out[0].embedding, null);
  assert.equal(out[0].id, "a");
});

test("supabasePersister maps a built index to upserts (worlds included)", async () => {
  const dir = await tmp();
  await createWorldWithProviders(dir, "a city of glass bells", {}, { useWorldEngine: false });
  const index = buildIndex(await readWorld(dir));

  const calls = [];
  const mockClient = {
    from(table) {
      return { upsert: async (rows) => { calls.push({ table, rows }); } };
    },
  };

  const persist = supabasePersister(mockClient);
  const { upserts } = await persist(index, {});

  assert.ok(calls.some((c) => c.table === "worlds"), "received a worlds upsert");
  assert.equal(upserts.worlds, 1);
  const worldRow = calls.find((c) => c.table === "worlds").rows[0];
  assert.match(worldRow.id, /^wld_/);
  assert.equal(worldRow.genesis_status, "seeded");
});
