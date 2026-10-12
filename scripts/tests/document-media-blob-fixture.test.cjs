const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { createRequire } = require("node:module");
const {
  createDocumentBlobStore,
  installDocumentBlobFixture,
} = require("../document-media-blob-fixture.cjs");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const { generateClientTokenFromReadWriteToken } = appRequire(
  "@vercel/blob/client",
);
const owner = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  second = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const token = "vercel_blob_rw_arcaneafixture_" + "0".repeat(48);
const pathname = `document-private/${owner}/${owner}/${owner}/${owner}.png`;

test("installed client PUT and private GET execute through isolated signed transport, blocking external network", async () => {
  const fixture = installDocumentBlobFixture({
    token,
    accounts: [{ id: owner }, { id: second }],
    listenPort: 0,
  });
  try {
    const client = await generateClientTokenFromReadWriteToken({
      token,
      pathname,
      maximumSizeInBytes: 3,
      allowedContentTypes: ["image/png"],
      validUntil: Date.now() + 600000,
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    const result = await appRequire("@vercel/blob/client").put(
      pathname,
      Buffer.from([1, 2, 3]),
      { token: client, access: "private", contentType: "image/png" },
    );
    assert.equal(result.pathname, pathname);
    const actual = await appRequire("@vercel/blob").get(pathname, {
      token,
      access: "private",
      useCache: false,
    });
    assert.deepEqual(
      Buffer.from(await new Response(actual.stream).arrayBuffer()),
      Buffer.from([1, 2, 3]),
    );
    const { fetch } = createRequire(appRequire.resolve("@vercel/blob"))(
      "undici",
    );
    await assert.rejects(fetch("https://example.com/"));
    assert.equal(fixture.receipt.puts, 1);
    assert.equal(fixture.receipt.reads, 1);
  } finally {
    await fixture.close();
  }
});
test("actual SDK signed client capability enforces exact private image constraints and immutable readback", async () => {
  const store = createDocumentBlobStore({
    token,
    accounts: [{ id: owner }, { id: second }],
  });
  const now = Date.now(),
    grant = {
      token,
      pathname,
      maximumSizeInBytes: 10485760,
      allowedContentTypes: ["image/png"],
      validUntil: now + 600000,
      addRandomSuffix: false,
      allowOverwrite: false,
    };
  const client = await generateClientTokenFromReadWriteToken(grant);
  const headers = {
    authorization: `Bearer ${client}`,
    "x-vercel-blob-access": "private",
    "x-content-type": "image/png",
  };
  const url = "/?pathname=" + encodeURIComponent(pathname),
    bytes = Buffer.alloc(10485760, 17);
  assert.equal(store.put(url, headers, bytes, now).statusCode, 200);
  assert.equal(store.put(url, headers, bytes, now).statusCode, 400);
  assert.equal(
    store.put(url, { ...headers, "x-vercel-blob-access": "public" }, bytes, now)
      .statusCode,
    403,
  );
  assert.equal(
    store.put(url.replace(owner, second), headers, bytes, now).statusCode,
    403,
  );
  assert.equal(
    store.put(url, headers, Buffer.alloc(10485761), now).statusCode,
    403,
  );
  assert.equal(store.put(url, headers, bytes, now + 600001).statusCode, 403);
  assert.equal(
    store.put(
      url,
      { ...headers, authorization: `Bearer ${client.slice(0, -8)}AAAAAAAA` },
      bytes,
      now,
    ).statusCode,
    403,
  );
  const read = store.get(`/${pathname}?cache=0`, {
    authorization: `Bearer ${token}`,
  });
  assert.equal(read.statusCode, 200);
  assert.deepEqual(read.data, bytes);
  assert.equal(
    store.get(`/${pathname}`, { authorization: `Bearer ${token}` }).statusCode,
    403,
  );
  assert.equal(
    store.get(`/${pathname}?cache=0`, { authorization: `Bearer ${client}` })
      .statusCode,
    403,
  );
  assert.equal(store.receipt.puts, 1);
  assert.equal(store.objects.size, 1);
  assert.equal(store.receipt.productionWrites, 0);
});
