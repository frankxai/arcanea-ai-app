import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import {
  GET as getDocument,
  PATCH,
  projectDocRouteDeps,
} from "@/app/api/projects/[id]/docs/[docId]/route";
import {
  createDocumentWriter,
  parseDocumentOperation,
  readDocumentOperation,
  verifiedDocumentReceipt,
  documentSaveLimit,
  readDocumentJson,
} from "@/lib/docs/save";
import {
  createDocumentDraft,
  readDocumentBackup,
  documentBackupKey,
} from "@/lib/docs/client";
import {
  GET as getDocuments,
  POST,
  projectDocsRouteDeps,
} from "@/app/api/projects/[id]/docs/route";
import { createClient as createSdkClient } from "@supabase/supabase-js";

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

test("actual Supabase missing-session auth yields guest denial without a database request", async () => {
  const previousCollection = projectDocsRouteDeps.createClient;
  const previousDocument = projectDocRouteDeps.createClient;
  let networkRequests = 0;
  const sdk = createSdkClient(
    "http://fixture.invalid",
    "nonsecret-fixture-anon",
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: async () => {
          networkRequests++;
          throw Error("Unexpected fixture network request");
        },
      },
    },
  );
  try {
    projectDocsRouteDeps.createClient = async () => sdk as never;
    projectDocRouteDeps.createClient = async () => sdk as never;
    const params = { params: Promise.resolve({ id: project, docId: doc }) };
    const collection = await getDocuments(
      new NextRequest("http://fixture.invalid"),
      params,
    );
    const document = await getDocument(
      new NextRequest("http://fixture.invalid"),
      params,
    );
    assert.equal(collection.status, 401);
    assert.equal(document.status, 401);
    assert.equal(networkRequests, 0);
  } finally {
    projectDocsRouteDeps.createClient = previousCollection;
    projectDocRouteDeps.createClient = previousDocument;
  }
});

test("document creation denies an unavailable or foreign project before inserting", async () => {
  const original = projectDocsRouteDeps.getDocsAuthContext;
  let inserts = 0;
  const filters: Array<[string, unknown]> = [];
  try {
    projectDocsRouteDeps.getDocsAuthContext = async () => ({
      supabase: {} as never,
      user: { id: owner },
      db: {
        from(table: string) {
          return {
            select() {
              return this;
            },
            eq(key: string, value: unknown) {
              filters.push([key, value]);
              return this;
            },
            insert() {
              inserts++;
              return this;
            },
            async single() {
              return {
                data: table === "chat_projects" ? null : { id: doc },
                error: null,
              };
            },
          };
        },
      },
    });
    const response = await POST(
      new NextRequest(
        "http://fixture.invalid/api/projects/" + project + "/docs",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Private note" }),
        },
      ),
      { params: Promise.resolve({ id: project }) },
    );
    assert.equal(response.status, 404);
    assert.equal(inserts, 0);
    assert.deepEqual(filters, [
      ["id", project],
      ["user_id", owner],
    ]);
  } finally {
    projectDocsRouteDeps.getDocsAuthContext = original;
  }
});

test("a stalled incoming document stream is cancelled at its deadline", async () => {
  let cancelled = false;
  const request = new Request("http://fixture.invalid", {
    method: "POST",
    body: new ReadableStream<Uint8Array>({
      cancel() {
        cancelled = true;
      },
    }),
    duplex: "half",
  } as RequestInit);
  await assert.rejects(
    readDocumentJson(request, 20),
    (error) =>
      error instanceof Error && "status" in error && error.status === 408,
  );
  assert.equal(cancelled, true);
});

test("invalid creation metadata is rejected before reading any project or inserting", async () => {
  const original = projectDocsRouteDeps.getDocsAuthContext;
  try {
    projectDocsRouteDeps.getDocsAuthContext = async () => ({
      supabase: {} as never,
      user: { id: owner },
      db: {
        from() {
          throw Error("must not query");
        },
      },
    });
    for (const patch of [
      { title: "x".repeat(501) },
      { title: null },
      { doc_type: "unsafe" },
      { user_id: owner },
    ]) {
      const response = await POST(
        new NextRequest("http://fixture.invalid", {
          method: "POST",
          body: JSON.stringify(patch),
        }),
        { params: Promise.resolve({ id: project }) },
      );
      assert.equal(response.status, 400);
    }
  } finally {
    projectDocsRouteDeps.getDocsAuthContext = original;
  }
});

test("reload replays a persisted uncertain operation without minting another identity", async () => {
  const pending = parseDocumentOperation(body);
  const sent: unknown[] = [];
  const writer = createDocumentWriter(
    { user: owner, project, doc },
    6,
    async (op) => {
      sent.push(op);
      return {
        user_id: owner,
        project_id: project,
        doc_id: doc,
        operation_id: operation,
        revision: 6,
      };
    },
    () => {
      throw Error("must replay");
    },
    pending,
  );
  await writer.save(pending.patch);
  assert.deepEqual(sent, [pending]);
  assert.equal(writer.revision(), 6);
});

test("a mounted document keeps the latest edit through failed acknowledgement and reload", async () => {
  const scope = { user: owner, project, doc };
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  const initial = { title: "World notes", content_text: "old" };
  const draft = createDocumentDraft(
    scope,
    5,
    initial,
    async () => {
      throw Error("lost acknowledgement");
    },
    storage,
    () => true,
  );
  draft.edit({ ...initial, content_text: "first edit" });
  await assert.rejects(draft.flush());
  draft.edit({ ...initial, content_text: "latest edit" });
  const backup = readDocumentBackup(storage, scope)!;
  assert.equal(backup.value.content_text, "latest edit");
  assert.equal(backup.pending?.patch.content_text, "first edit");
  const sent: string[] = [];
  const reopened = createDocumentDraft(
    scope,
    6,
    initial,
    async (op) => {
      sent.push(op.operation_id);
      return {
        user_id: owner,
        project_id: project,
        doc_id: doc,
        operation_id: op.operation_id,
        revision: op.expected_revision + 1,
      };
    },
    storage,
    () => true,
    backup,
  );
  await reopened.flush();
  assert.equal(sent[0], backup.pending?.operation_id);
  assert.notEqual(sent[0], sent[1]);
  assert.equal(reopened.snapshot().dirty, false);
  assert.equal(storage.getItem(documentBackupKey(scope)), null);
});

test("account changes deny sending and foreign recovery copies are not admitted", async () => {
  const scope = { user: owner, project, doc };
  let calls = 0;
  const storage = {
    getItem: () =>
      JSON.stringify({
        version: 1,
        scope: { ...scope, user: "other" },
        revision: 5,
        value: { title: "foreign" },
      }),
    setItem: () => {},
    removeItem: () => {},
  };
  assert.equal(readDocumentBackup(storage, scope), null);
  const draft = createDocumentDraft(
    scope,
    5,
    { title: "mine" },
    async () => {
      calls++;
    },
    storage,
    () => false,
  );
  draft.edit({ title: "kept locally" });
  await assert.rejects(draft.flush(), /account changed/i);
  assert.equal(calls, 0);
  assert.equal(draft.snapshot().dirty, true);
});

test("an edit made during an in-flight save stays dirty until its own acknowledgement", async () => {
  const scope = { user: owner, project, doc };
  const memory = new Map<string, string>();
  const storage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
  };
  let acknowledge!: () => void;
  let entered!: () => void;
  const begun = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const held = new Promise<void>((resolve) => {
    acknowledge = resolve;
  });
  let calls = 0;
  const draft = createDocumentDraft(
    scope,
    5,
    { title: "initial" },
    async (op) => {
      if (++calls === 1) {
        entered();
        await held;
      }
      return {
        user_id: owner,
        project_id: project,
        doc_id: doc,
        operation_id: op.operation_id,
        revision: op.expected_revision + 1,
      };
    },
    storage,
    () => true,
  );
  draft.edit({ title: "first" });
  const saving = draft.flush();
  await begun;
  draft.edit({ title: "latest" });
  assert.equal(draft.snapshot().dirty, true);
  assert.equal(readDocumentBackup(storage, scope)?.value.title, "latest");
  acknowledge();
  await saving;
  assert.equal(calls, 2);
  assert.equal(draft.revision(), 7);
  assert.equal(draft.snapshot().dirty, false);
});

test("browser storage failure is visible while an editable draft can still save", async () => {
  const scope = { user: owner, project, doc };
  const storage = {
    getItem: () => null,
    setItem: () => {
      throw Error("quota");
    },
    removeItem: () => {
      throw Error("unavailable");
    },
  };
  const draft = createDocumentDraft(
    scope,
    5,
    { title: "initial" },
    async (op) => ({
      user_id: owner,
      project_id: project,
      doc_id: doc,
      operation_id: op.operation_id,
      revision: op.expected_revision + 1,
    }),
    storage,
    () => true,
  );
  draft.edit({ title: "recover by download" });
  assert.equal(draft.backupAvailable(), false);
  assert.equal(draft.snapshot().value?.title, "recover by download");
  await draft.flush();
  assert.equal(draft.revision(), 6);
  assert.equal(draft.snapshot().dirty, false);
  assert.equal(draft.backupAvailable(), false);
});

test("account change during a held receipt keeps the original draft unconfirmed", async () => {
  const scope = { user: owner, project, doc };
  let current = true;
  const storage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
  const draft = createDocumentDraft(
    scope,
    5,
    { title: "initial" },
    async (op) => {
      current = false;
      return {
        user_id: owner,
        project_id: project,
        doc_id: doc,
        operation_id: op.operation_id,
        revision: op.expected_revision + 1,
      };
    },
    storage,
    () => current,
  );
  draft.edit({ title: "private A draft" });
  await assert.rejects(draft.flush(), /account changed/i);
  assert.equal(draft.revision(), 5);
  assert.equal(draft.snapshot().dirty, true);
  assert.equal(draft.pending()?.patch.title, "private A draft");
});

test("an old operation receipt cannot lower a newer acknowledged revision", async () => {
  const pending = parseDocumentOperation(body);
  const writer = createDocumentWriter(
    { user: owner, project, doc },
    7,
    async () => ({
      user_id: owner,
      project_id: project,
      doc_id: doc,
      operation_id: operation,
      revision: 6,
    }),
    undefined,
    pending,
  );
  await assert.rejects(writer.save(pending.patch), /saved document changed/i);
  assert.equal(writer.revision(), 7);
  assert.equal(writer.pending()?.operation_id, operation);
});

test("opening a saved document does not erase an existing unreadable recovery copy", () => {
  const scope = { user: owner, project, doc };
  const raw = "{ damaged recovery bytes";
  const storage = {
    getItem: () => raw,
    setItem: () => {
      throw Error("must not write while opening");
    },
    removeItem: () => {
      throw Error("must not erase while opening");
    },
  };
  assert.equal(readDocumentBackup(storage, scope), null);
  const draft = createDocumentDraft(
    scope,
    5,
    { title: "saved document" },
    async () => {},
    storage,
    () => true,
  );
  assert.equal(draft.snapshot().dirty, false);
  assert.equal(storage.getItem(), raw);
});

test("recovery rejects future formats, foreign parents, invalid revisions and swapped pending actors", () => {
  const scope = { user: owner, project, doc };
  const valid = {
    version: 1,
    scope,
    revision: 5,
    value: { title: "retained" },
    pending: parseDocumentOperation(body),
  };
  for (const change of [
    { version: 2 },
    { scope: { ...scope, project: "other" } },
    { revision: -1 },
    {
      pending: {
        ...valid.pending,
        expected_actor: "50000000-0000-4000-8000-000000000005",
      },
    },
    { pending: { ...valid.pending, expected_revision: 4 } },
  ])
    assert.equal(
      readDocumentBackup(
        {
          getItem: () => JSON.stringify({ ...valid, ...change }),
          setItem: () => {},
          removeItem: () => {},
        },
        scope,
      ),
      null,
    );
});
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
