import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import {
  PATCH,
  projectDocRouteDeps,
} from "@/app/api/projects/[id]/docs/[docId]/route";
import {
  createDocumentWriter,
  parseDocumentOperation,
  readDocumentOperation,
  verifiedDocumentReceipt,
  documentSaveLimit,
} from "@/lib/docs/save";

const project = "10000000-0000-4000-8000-000000000001";
const doc = "20000000-0000-4000-8000-000000000002";
const operation = "30000000-0000-4000-8000-000000000003";
const owner = "40000000-0000-4000-8000-000000000004";
const body = {
  expected_actor: owner,
  expected_revision: 5,
  operation_id: operation,
  content_json: { type: "doc", content: [] },
  content_text: "Retained creator draft",
  word_count: 3,
};
function request(value: unknown = body) {
  return new NextRequest(
    "http://fixture.invalid/api/projects/" + project + "/docs/" + doc,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    },
  );
}
function database(result: unknown, calls: unknown[], versionError = false) {
  return {
    rpc(name: string, values: unknown) {
      calls.push({ name, values });
      return Promise.resolve(result);
    },
    from(table: string) {
      const builder = {
        select() {
          return builder;
        },
        eq() {
          return builder;
        },
        order() {
          return builder;
        },
        limit() {
          return builder;
        },
        single: async () => ({ data: { version_number: 5 }, error: null }),
        upsert: async () => {
          calls.push({ legacyWrite: table });
          return { error: null };
        },
        insert: async () => {
          calls.push({ legacyWrite: table });
          return {
            error: versionError
              ? { message: "controlled history failure" }
              : null,
          };
        },
      };
      return builder;
    },
  };
}
test("project document save cannot acknowledge a failed history transaction", async () => {
  const original = projectDocRouteDeps.getDocAuthContext,
    calls: unknown[] = [];
  try {
    projectDocRouteDeps.getDocAuthContext = async () => ({
      supabase: {} as never,
      user: { id: owner },
      db: database(
        {
          data: null,
          error: { message: "controlled history failure", code: "23514" },
        },
        calls,
        true,
      ),
    });
    const res = await PATCH(request(), {
      params: Promise.resolve({ id: project, docId: doc }),
    });
    assert.equal(res.status, 503);
    assert.equal((await res.json()).success, false);
    assert.equal(calls.length, 1);
  } finally {
    projectDocRouteDeps.getDocAuthContext = original;
  }
});
test("content-only save checks the requested parent inside the transaction", async () => {
  const original = projectDocRouteDeps.getDocAuthContext,
    calls: unknown[] = [];
  try {
    projectDocRouteDeps.getDocAuthContext = async () => ({
      supabase: {} as never,
      user: { id: owner },
      db: database(
        { data: null, error: { message: "document_not_found", code: "P0001" } },
        calls,
      ),
    });
    const res = await PATCH(request(), {
      params: Promise.resolve({ id: project, docId: doc }),
    });
    assert.equal(res.status, 404);
    assert.deepEqual(calls, [
      {
        name: "save_project_document",
        values: {
          p_project: project,
          p_doc: doc,
          p_revision: 5,
          p_operation: operation,
          p_patch: {
            content_json: body.content_json,
            content_text: body.content_text,
            word_count: 3,
          },
        },
      },
    ]);
  } finally {
    projectDocRouteDeps.getDocAuthContext = original;
  }
});
test("legacy revisionless saves are rejected before any mutation", async () => {
  const original = projectDocRouteDeps.getDocAuthContext,
    calls: unknown[] = [];
  try {
    projectDocRouteDeps.getDocAuthContext = async () => ({
      supabase: {} as never,
      user: { id: owner },
      db: database({ data: {}, error: null }, calls),
    });
    const res = await PATCH(
      request({ content_text: "Do not blindly overwrite" }),
      { params: Promise.resolve({ id: project, docId: doc }) },
    );
    assert.equal(res.status, 428);
    assert.equal(calls.length, 0);
  } finally {
    projectDocRouteDeps.getDocAuthContext = original;
  }
});
test("an account switch is rejected before any document mutation", async () => {
  const original = projectDocRouteDeps.getDocAuthContext,
    calls: unknown[] = [];
  try {
    projectDocRouteDeps.getDocAuthContext = async () => ({
      supabase: {} as never,
      user: { id: "50000000-0000-4000-8000-000000000005" },
      db: database({ data: {}, error: null }, calls),
    });
    const res = await PATCH(request(), {
      params: Promise.resolve({ id: project, docId: doc }),
    });
    assert.equal(res.status, 409);
    assert.equal(calls.length, 0);
  } finally {
    projectDocRouteDeps.getDocAuthContext = original;
  }
});
test("a lost acknowledgement replays the same operation before committing newer edits", async () => {
  let failAck = true,
    ids = 0;
  const sent: Array<{
    operation_id: string;
    expected_revision: number;
    patch: unknown;
  }> = [];
  const writer = createDocumentWriter(
    { user: owner, project, doc },
    5,
    async (operation) => {
      sent.push(structuredClone(operation));
      if (failAck) {
        failAck = false;
        throw Error("lost acknowledgement");
      }
      return {
        user_id: owner,
        project_id: project,
        doc_id: doc,
        operation_id: operation.operation_id,
        revision: operation.expected_revision + 1,
      };
    },
    () => "operation-" + ++ids,
  );
  const first = { content_text: "First creator edit" };
  await assert.rejects(writer.save(first), /lost acknowledgement/);
  first.content_text = "Changed outside the writer";
  const recovery = writer.pending()!;
  recovery.patch.content_text = "Changed outside pending";
  await writer.save({ content_text: "Newer retained edit" });
  assert.equal(ids, 2);
  assert.equal(sent[0].operation_id, sent[1].operation_id);
  assert.deepEqual(sent[1].patch, { content_text: "First creator edit" });
  assert.deepEqual(
    sent.map((x) => x.expected_revision),
    [5, 5, 6],
  );
  assert.equal(writer.revision(), 7);
  assert.equal(writer.pending(), undefined);
});
test("a same-draft retry does not create a second history operation", async () => {
  let first = true,
    ids = 0;
  const writer = createDocumentWriter(
    { user: owner, project, doc },
    5,
    async (operation) => {
      if (first) {
        first = false;
        throw Error("lost acknowledgement");
      }
      return {
        user_id: owner,
        project_id: project,
        doc_id: doc,
        operation_id: operation.operation_id,
        revision: 6,
      };
    },
    () => "stable-" + ++ids,
  );
  await assert.rejects(writer.save({ content_text: "retained" }));
  await writer.save({ content_text: "retained" });
  assert.equal(ids, 1);
  assert.equal(writer.revision(), 6);
});
test("foreign, wrong-parent, wrong-operation and imprecise acknowledgements never confirm a draft", () => {
  const operation = parseDocumentOperation(body);
  const valid = {
    user_id: owner,
    project_id: project,
    doc_id: doc,
    operation_id: body.operation_id,
    revision: 6,
  };
  assert.deepEqual(
    verifiedDocumentReceipt(valid, { user: owner, project, doc }, operation),
    valid,
  );
  for (const invalid of [
    null,
    { ...valid, user_id: "other" },
    { ...valid, project_id: "other" },
    { ...valid, doc_id: "other" },
    { ...valid, operation_id: "other" },
    { ...valid, revision: 5 },
    { ...valid, revision: 7 },
  ])
    assert.throws(
      () =>
        verifiedDocumentReceipt(
          invalid,
          { user: owner, project, doc },
          operation,
        ),
      /not confirmed/,
    );
});
test("stale conflicts retain the operation and never advance the acknowledged revision", async () => {
  const writer = createDocumentWriter(
    { user: owner, project, doc },
    5,
    async () => {
      throw Error("document_revision_conflict");
    },
  );
  await assert.rejects(
    writer.save({ content_text: "creator conflict copy" }),
    /conflict/,
  );
  assert.equal(writer.revision(), 5);
  assert.deepEqual(writer.pending()?.patch, {
    content_text: "creator conflict copy",
  });
});
test("oversized streamed JSON is rejected without trusting Content-Length", async () => {
  const req = new Request("http://fixture.invalid", {
    method: "PATCH",
    body: JSON.stringify({
      ...body,
      content_text: "x".repeat(documentSaveLimit),
    }),
    headers: { "Content-Length": "10" },
  });
  await assert.rejects(
    readDocumentOperation(req),
    (error) =>
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 413,
  );
});
test("invalid authority and unbounded or unknown fields are rejected", () => {
  for (const extra of [
    { expected_revision: -1 },
    { expected_revision: 2147483647 },
    { expected_revision: 1.5 },
    { operation_id: "unsafe" },
    { user_id: owner },
    { content_text: null },
    { content_json: [] },
    { word_count: -1 },
    { title: "x".repeat(501) },
  ])
    assert.throws(() => parseDocumentOperation({ ...body, ...extra }));
});
