import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  handleWorkbench,
  snapshotId,
  packetTag,
} from "../src/myth-workbench.mjs";
const atlas = JSON.parse(
  await readFile(new URL("../myth-atlas.v1.json", import.meta.url)),
);
const brief = JSON.parse(
  await readFile(new URL("../myth-brief.example.json", import.meta.url)),
);
const owner = "11111111-1111-4111-8111-111111111111";
function fixture() {
  const rows = new Map();
  const state = {
    owner,
    insertError: null,
    findError: null,
    listError: null,
    loseReceipt: false,
    inserts: 0,
  };
  const dependencies = {
    atlas,
    getOwner: async () => state.owner,
    store: {
      async insert(row) {
        state.inserts++;
        if (state.insertError) return { error: state.insertError, data: null };
        if (rows.has(row.id)) return { data: null, error: { code: "23505" } };
        const data = structuredClone({
          ...row,
          created_at: "2026-10-05T00:00:00Z",
        });
        rows.set(row.id, data);
        return { data: state.loseReceipt ? null : data, error: null };
      },
      async find(id, user) {
        const row = rows.get(id);
        return {
          data: row?.user_id === user ? row : null,
          error: state.findError,
        };
      },
      async list(user) {
        return {
          data: [...rows.values()]
            .filter((x) => x.user_id === user)
            .slice(0, 30),
          error: state.listError,
        };
      },
    },
  };
  const post = (action, value = brief) =>
    handleWorkbench(
      new Request("https://example.test/api/myth-studio", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, brief: value }),
      }),
      dependencies,
    );
  const get = (id = "") =>
    handleWorkbench(
      new Request(
        `https://example.test/api/myth-studio${id ? "?id=" + id : ""}`,
      ),
      dependencies,
    );
  return { post, get, rows, state, dependencies };
}
test("anonymous compilation never touches storage or requests an owner", async () => {
  const f = fixture();
  f.dependencies.getOwner = () =>
    assert.fail("Anonymous compile requested identity");
  const response = await f.post("compile");
  assert.equal(response.status, 200);
  assert.equal(f.state.inserts, 0);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const data = await response.json();
  assert.equal(data.packet.review.releaseEligible, false);
  assert.equal(data.handoff.executionAuthorized, false);
  assert.equal(data.handoff.tasks[1].maxAttempts, 12);
  assert.equal(data.handoff.tasks[1].estimatedCostMicros, 33000000);
});
test("save requires a session and never trusts supplied ownership", async () => {
  const f = fixture();
  f.state.owner = null;
  assert.equal((await f.post("save")).status, 401);
  assert.equal(f.state.inserts, 0);
  const response = await handleWorkbench(
    new Request("https://example.test/api/myth-studio", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "save", brief, userId: owner }),
    }),
    f.dependencies,
  );
  assert.equal(response.status, 400);
});
test("save receipt binds owner, packet and durable timestamp; exact retry returns existing", async () => {
  const f = fixture();
  const first = await f.post("save");
  assert.equal(first.status, 201);
  const data = await first.json();
  const row = f.rows.get(data.receipt.creationId);
  assert.equal(row.user_id, owner);
  assert.equal(row.visibility, "private");
  assert.equal(row.status, "draft");
  assert.deepEqual(row.tags, [packetTag]);
  assert.equal(Object.hasOwn(row, "project_id"), false);
  assert.equal(
    data.receipt.creationId,
    snapshotId(owner, data.packet.packetId),
  );
  assert.equal(data.receipt.createdAt, "2026-10-05T00:00:00Z");
  const again = await f.post("save");
  assert.equal(again.status, 200);
  assert.equal((await again.json()).receipt.disposition, "existing");
  assert.equal(f.rows.size, 1);
});
test("lost confirmation is not success and retry recovers the persisted row", async () => {
  const f = fixture();
  f.state.loseReceipt = true;
  assert.equal((await f.post("save")).status, 503);
  assert.equal(f.rows.size, 1);
  f.state.loseReceipt = false;
  assert.equal((await f.post("save")).status, 200);
  assert.equal(f.rows.size, 1);
});
test("new brief creates a new version and reload restores exact export", async () => {
  const f = fixture();
  const first = await (await f.post("save")).json();
  const second = await (
    await f.post("save", { ...brief, title: "A new direction" })
  ).json();
  assert.notEqual(first.receipt.creationId, second.receipt.creationId);
  assert.equal(f.rows.size, 2);
  const loaded = await (await f.get(first.receipt.creationId)).json();
  assert.deepEqual(loaded.brief, brief);
  assert.equal(loaded.markdown, first.markdown);
  assert.deepEqual(loaded.handoff, first.handoff);
});
test("owner-scoped list/load never returns another owner snapshot", async () => {
  const f = fixture();
  const first = await (await f.post("save")).json();
  f.state.owner = "22222222-2222-4222-8222-222222222222";
  assert.equal((await f.get(first.receipt.creationId)).status, 404);
  assert.deepEqual((await (await f.get()).json()).snapshots, []);
  const second = await (await f.post("save")).json();
  assert.notEqual(first.receipt.creationId, second.receipt.creationId);
});
test("mutated packet rejects reload and retry without overwrite", async () => {
  const f = fixture();
  const data = await (await f.post("save")).json();
  f.rows.get(data.receipt.creationId).content.packet.review.releaseEligible =
    true;
  assert.equal((await f.get(data.receipt.creationId)).status, 409);
  assert.equal((await f.post("save")).status, 409);
  assert.equal(
    f.rows.get(data.receipt.creationId).content.packet.review.releaseEligible,
    true,
  );
  const list = await (await f.get()).json();
  assert.equal(list.unreadableCount, 1);
  assert.deepEqual(list.snapshots, []);
});
test("private stage boundary is checked even when storage adapter returns a public row", async () => {
  const f = fixture();
  const data = await (await f.post("save")).json();
  f.rows.get(data.receipt.creationId).visibility = "public";
  assert.equal((await f.get(data.receipt.creationId)).status, 409);
  assert.equal((await f.post("save")).status, 409);
});
test("database errors never become successful empty lists, saves or missing rows", async () => {
  const f = fixture();
  f.state.insertError = { code: "42501" };
  assert.equal((await f.post("save")).status, 503);
  f.state.listError = { code: "42P01" };
  assert.equal((await f.get()).status, 503);
  f.state.findError = { code: "42501" };
  assert.equal(
    (await f.get("11111111-1111-4111-8111-111111111111")).status,
    503,
  );
  f.dependencies.getOwner = async () => {
    throw new Error("secret database details");
  };
  const response = await f.get();
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /secret/);
});
test("body actual byte cap resists missing or forged content length", async () => {
  const f = fixture();
  const response = await handleWorkbench(
    new Request("https://example.test/api/myth-studio", {
      method: "POST",
      headers: { "content-type": "application/json", "content-length": "10" },
      body: JSON.stringify({
        action: "compile",
        brief: { ...brief, setting: "a".repeat(17000) },
      }),
    }),
    f.dependencies,
  );
  assert.equal(response.status, 413);
  assert.equal(f.state.inserts, 0);
});
test("malformed JSON, invalid type, extra approval and invalid brief fail closed", async () => {
  const f = fixture();
  for (const [body, type, status] of [
    ["{", "application/json", 400],
    ["{}", "text/plain", 415],
    [
      JSON.stringify({ action: "compile", brief, approved: true }),
      "application/json",
      400,
    ],
  ]) {
    const response = await handleWorkbench(
      new Request("https://example.test/api/myth-studio", {
        method: "POST",
        headers: { "content-type": type },
        body,
      }),
      f.dependencies,
    );
    assert.equal(response.status, status);
  }
  assert.equal(
    (await f.post("compile", { ...brief, selectedMyths: [] })).status,
    400,
  );
  assert.equal((await f.get("not-a-uuid")).status, 400);
});
test("over-budget and living-tradition handoffs remain planning only", async () => {
  const f = fixture();
  const row = atlas.records.find((x) => x.livingTradition);
  const result = await (
    await f.post("compile", {
      ...brief,
      maxProductionCostMicros: 0,
      selectedMyths: [row.id],
    })
  ).json();
  assert.equal(result.packet.budget.withinBudget, false);
  assert.equal(result.packet.review.livingTraditionReviewRequired, true);
  assert.match(result.handoff.nextDecision, /living tradition/);
  assert.equal(result.handoff.executionAuthorized, false);
  assert.equal(result.handoff.releaseEligible, false);
});
