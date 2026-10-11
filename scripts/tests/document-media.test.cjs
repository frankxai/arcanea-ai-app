const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const source = path.resolve(__dirname, "../../apps/web/lib/docs/media.ts");
const loaded = { exports: {} };
new Function(
  "exports",
  "require",
  "module",
  ts.transpileModule(fs.readFileSync(source, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
)(loaded.exports, require, loaded);
const media = loaded.exports;
const scope = {
  ownerId: "11111111-1111-4111-8111-111111111111",
  projectId: "22222222-2222-4222-8222-222222222222",
  docId: "33333333-3333-4333-8333-333333333333",
};
const assetId = "44444444-4444-4444-8444-444444444444";
async function input(bytes = new Uint8Array([1, 2, 3])) {
  return {
    ...scope,
    assetId,
    byteSize: bytes.length,
    mimeType: "image/png",
    sha256: await media.mediaDigest(bytes),
    filename: "map.png",
    alt: "A map",
  };
}
function fixtures(claim, bytes) {
  let row = {
    ...claim,
    status: "reserved",
    sourceStatus: "creator_supplied_unverified",
    rightsStatus: "unverified",
  };
  let reserves = 0,
    completes = 0;
  const repository = {
    reserve: async () => {
      reserves++;
      return { ...row };
    },
    complete: async () => {
      completes++;
      row.status = "ready";
      return { ...row };
    },
  };
  const store = { read: async () => ({ bytes, mimeType: claim.mimeType }) };
  return { repository, store, counts: () => ({ reserves, completes }), row };
}

test("account/project/document changes are denied before reservation", async () => {
  const body = await input();
  for (const key of ["ownerId", "projectId", "docId"]) {
    await assert.rejects(
      media.parseDocumentMediaClaim({ ...body, [key]: assetId }, scope),
      (e) => e.status === 409,
    );
  }
});

test("10MiB originals are admitted without increasing the old Imagine JSON cap", async () => {
  const body = await input();
  const claim = await media.parseDocumentMediaClaim(
    { ...body, byteSize: 10 * 1024 * 1024 },
    scope,
  );
  const f = fixtures(claim, new Uint8Array());
  const grant = await media.authorizeDocumentMediaUpload(
    claim,
    media.documentMediaPath(claim),
    f.repository,
    1000,
  );
  assert.equal(grant.maximumSizeInBytes, 10 * 1024 * 1024);
  assert.equal(grant.validUntil, 601000);
  assert.deepEqual(grant.allowedContentTypes, ["image/png"]);
  assert.equal(grant.addRandomSuffix, false);
  assert.equal(grant.allowOverwrite, false);
  await assert.rejects(
    media.parseDocumentMediaClaim(
      { ...body, byteSize: 10 * 1024 * 1024 + 1 },
      scope,
    ),
    (e) => e.status === 413,
  );
});

test("a quota rejection or wrong pathname cannot mint upload authority", async () => {
  const claim = await media.parseDocumentMediaClaim(await input(), scope);
  let touched = 0;
  const deny = {
    reserve: async () => {
      touched++;
      throw new media.DocumentMediaError(507, "Full");
    },
  };
  await assert.rejects(
    media.authorizeDocumentMediaUpload(claim, "public/map.png", deny),
    (e) => e.status === 400,
  );
  assert.equal(touched, 0);
  await assert.rejects(
    media.authorizeDocumentMediaUpload(
      claim,
      media.documentMediaPath(claim),
      deny,
    ),
    (e) => e.status === 507,
  );
});

test("metadata replay is content/scope bound, not just asset UUID bound", async () => {
  const claim = await media.parseDocumentMediaClaim(await input(), scope);
  const f = fixtures(claim, new Uint8Array([1, 2, 3]));
  f.row.docId = assetId;
  await assert.rejects(
    media.authorizeDocumentMediaUpload(
      claim,
      media.documentMediaPath(claim),
      f.repository,
    ),
    (e) => e.status === 409,
  );
});

test("completion reads, hashes and decodes actual bytes before ready status", async () => {
  const bytes = new Uint8Array([1, 2, 3]);
  const claim = await media.parseDocumentMediaClaim(await input(bytes), scope);
  const f = fixtures(claim, bytes);
  let decoded = 0;
  const result = await media.finalizeDocumentMedia(
    claim,
    f.repository,
    f.store,
    async (value) => {
      assert.deepEqual(value, bytes);
      decoded++;
    },
  );
  assert.equal(result.status, "ready");
  assert.equal(decoded, 1);
  assert.deepEqual(f.counts(), { reserves: 1, completes: 1 });
  await media.finalizeDocumentMedia(
    claim,
    f.repository,
    f.store,
    async () => {},
  );
  assert.equal(f.counts().completes, 1);
});

test("missing, corrupt, wrong-type and decoder-rejected bytes retain reservation", async () => {
  const bytes = new Uint8Array([1, 2, 3]);
  const claim = await media.parseDocumentMediaClaim(await input(bytes), scope);
  for (const object of [
    null,
    { bytes: new Uint8Array([1, 2]), mimeType: "image/png" },
    { bytes: new Uint8Array([1, 2, 4]), mimeType: "image/png" },
    { bytes, mimeType: "image/jpeg" },
  ]) {
    const f = fixtures(claim, bytes);
    await assert.rejects(
      media.finalizeDocumentMedia(
        claim,
        f.repository,
        { read: async () => object },
        async () => {},
      ),
    );
    assert.equal(f.counts().completes, 0);
    assert.equal(f.row.status, "reserved");
  }
  const f = fixtures(claim, bytes);
  await assert.rejects(
    media.finalizeDocumentMedia(claim, f.repository, f.store, async () => {
      throw Error("Invalid image");
    }),
  );
  assert.equal(f.counts().completes, 0);
});

test("lost completion acknowledgement recovers the same reservation and bytes", async () => {
  const bytes = new Uint8Array([1, 2, 3]);
  const claim = await media.parseDocumentMediaClaim(await input(bytes), scope);
  const f = fixtures(claim, bytes);
  f.repository.complete = async () => {
    f.row.status = "ready";
    throw Error("Lost acknowledgement");
  };
  await assert.rejects(
    media.finalizeDocumentMedia(claim, f.repository, f.store, async () => {}),
  );
  const recovered = await media.finalizeDocumentMedia(
    claim,
    f.repository,
    f.store,
    async () => {},
  );
  assert.equal(recovered.assetId, assetId);
  assert.equal(recovered.status, "ready");
});

test("ready metadata never permits a second upload capability", async () => {
  const claim = await media.parseDocumentMediaClaim(await input(), scope);
  const f = fixtures(claim, new Uint8Array([1, 2, 3]));
  f.row.status = "ready";
  await assert.rejects(
    media.authorizeDocumentMediaUpload(
      claim,
      media.documentMediaPath(claim),
      f.repository,
    ),
    (e) => e.status === 409,
  );
});

test("active-content types, malformed digests and unsafe filenames are refused", async () => {
  const body = await input();
  for (const patch of [
    { mimeType: "image/svg+xml" },
    { sha256: "not-a-digest" },
    { filename: "x\u0000.png" },
    { alt: "" },
    { byteSize: 0 },
  ]) {
    await assert.rejects(
      media.parseDocumentMediaClaim({ ...body, ...patch }, scope),
    );
  }
});

test("the actual 10MiB original survives byte verification and idempotent completion", async () => {
  const bytes = new Uint8Array(10 * 1024 * 1024).fill(7);
  const claim = await media.parseDocumentMediaClaim(await input(bytes), scope);
  const f = fixtures(claim, bytes);
  await media.finalizeDocumentMedia(
    claim,
    f.repository,
    f.store,
    async (value) => {
      assert.equal(value.byteLength, 10 * 1024 * 1024);
    },
  );
  await media.finalizeDocumentMedia(
    claim,
    f.repository,
    f.store,
    async () => {},
  );
  assert.deepEqual(f.counts(), { reserves: 2, completes: 1 });
  const reader = media.documentMediaByteStream(bytes).getReader();
  const chunks = [];
  for (;;) {
    const next = await reader.read();
    if (next.done) break;
    assert.ok(next.value.byteLength <= 65536);
    chunks.push(next.value);
  }
  assert.equal(await media.mediaDigest(Buffer.concat(chunks)), claim.sha256);
  reader.releaseLock();
});
