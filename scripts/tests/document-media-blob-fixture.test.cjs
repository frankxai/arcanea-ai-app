const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const {
  createDocumentBlobStore,
  installDocumentBlobFixture,
  readPrivateConfiguration,
} = require("../document-media-blob-fixture.cjs");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const { generateClientTokenFromReadWriteToken } = appRequire(
  "@vercel/blob/client",
);
const owner = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  second = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const token = "vercel_blob_rw_arcaneafixture_" + "0".repeat(48);
const pathname = `document-private/${owner}/${owner}/${owner}/${owner}.png`;

test("private configuration reads the checked descriptor even when its pathname is replaced", () => {
  let checked = false,
    closed = false;
  const source = fs.readFileSync(
    path.resolve("scripts/document-media-blob-fixture.cjs"),
    "utf8",
  );
  const ts = require("typescript");
  const parsed = ts.createSourceFile(
    "fixture.cjs",
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const factory = parsed.statements.find(
    (n) =>
      ts.isFunctionDeclaration(n) &&
      n.name?.text === "readPrivateConfiguration",
  );
  const oldOperations = source.match(
    /assert\.equal\(fs\.statSync\(filename\)\.mode & 0o777, 0o600\);\s*const config = JSON\.parse\(fs\.readFileSync\(filename, "utf8"\)\);/,
  );
  assert.ok(factory || oldOperations);
  const operation = factory
    ? factory.getText(parsed)
    : `function readPrivateConfiguration(filename) { ${oldOperations[0]} return config; }`;
  const actual = vm.runInNewContext(`(${operation})`, {
    assert,
    fs: {
      constants: { O_RDONLY: 0, O_NOFOLLOW: 131072 },
      openSync: (file, flags) => {
        assert.equal(file, "private.json");
        assert.equal(flags, 131072);
        return 47;
      },
      statSync: (file) => {
        assert.equal(file, "private.json");
        checked = true;
        return { mode: 0o100600 };
      },
      fstatSync: (fd) => {
        assert.equal(fd, 47);
        checked = true;
        return { isFile: () => true, mode: 0o100600, size: 13 };
      },
      readFileSync: (fd, encoding) => {
        assert.equal(checked, true);
        assert.equal(fd, 47);
        assert.equal(encoding, "utf8");
        return '{"safe":true}';
      },
      closeSync: (fd) => {
        assert.equal(fd, 47);
        closed = true;
      },
    },
  });
  assert.equal(actual("private.json").safe, true);
  assert.equal(closed, true);
});

test("private configuration closes on malformed input and rejects links and unsafe files", (t) => {
  assert.equal(typeof readPrivateConfiguration, "function");
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "arcanea-doc-config-"),
  );
  const file = path.join(directory, "private.json");
  t.after(() => {
    fs.rmSync(file, { force: true });
    fs.rmSync(path.join(directory, "link.json"), { force: true });
    fs.rmdirSync(directory);
  });
  fs.writeFileSync(file, '{"safe":true}', { mode: 0o600 });
  // POSIX owner permissions and O_NOFOLLOW are enforced by the admitted Linux runner.
  if (process.platform !== "win32") {
    assert.equal(readPrivateConfiguration(file).safe, true);
    fs.chmodSync(file, 0o644);
    assert.throws(() => readPrivateConfiguration(file));
    fs.chmodSync(file, 0o600);
    fs.symlinkSync(file, path.join(directory, "link.json"));
    assert.throws(() =>
      readPrivateConfiguration(path.join(directory, "link.json")),
    );
    fs.writeFileSync(file, "{");
    assert.throws(() => readPrivateConfiguration(file));
  }
});

test("private configuration always closes the descriptor on validation or JSON failure", () => {
  const ts = require("typescript");
  const source = fs.readFileSync(
    path.resolve("scripts/document-media-blob-fixture.cjs"),
    "utf8",
  );
  const parsed = ts.createSourceFile(
    "fixture.cjs",
    source,
    ts.ScriptTarget.Latest,
    true,
  );
  const factory = parsed.statements.find(
    (n) =>
      ts.isFunctionDeclaration(n) &&
      n.name?.text === "readPrivateConfiguration",
  );
  assert.ok(factory);
  for (const bad of ["mode", "directory", "empty", "oversized", "json"]) {
    let closes = 0;
    const actual = vm.runInNewContext(`(${factory.getText(parsed)})`, {
      assert,
      fs: {
        constants: { O_RDONLY: 0, O_NOFOLLOW: 131072 },
        openSync: () => 47,
        fstatSync: () => ({
          isFile: () => bad !== "directory",
          mode: bad === "mode" ? 0o644 : 0o600,
          size: bad === "empty" ? 0 : bad === "oversized" ? 65537 : 13,
        }),
        readFileSync: () => "{",
        closeSync: (fd) => {
          assert.equal(fd, 47);
          closes++;
        },
      },
    });
    assert.throws(() => actual("private.json"), bad);
    assert.equal(closes, 1, bad);
  }
});

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
