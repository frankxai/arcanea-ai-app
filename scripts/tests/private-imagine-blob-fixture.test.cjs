const assert = require("node:assert/strict");
const { createRequire } = require("node:module");
const path = require("node:path");
const test = require("node:test");
const { execFileSync, spawnSync } = require("node:child_process");
const { tmpdir } = require("node:os");
const {
  installPrivateBlobFixture,
} = require("../private-imagine-blob-fixture.cjs");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const sdk = appRequire("@vercel/blob");
const sdkRequire = createRequire(appRequire.resolve("@vercel/blob"));
const { fetch } = sdkRequire("undici");
const token = "vercel_blob_rw_arcaneafixture_" + "0".repeat(48);
const owner = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const second = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const interrupted = "11111111-1111-4111-8111-111111111111";

test("installed SDK enforces private immutable bytes, cache bypass and unknown-put readback", async () => {
  const oldApi = process.env.VERCEL_BLOB_API_URL;
  const oldRetries = process.env.VERCEL_BLOB_RETRIES;
  process.env.VERCEL_BLOB_API_URL = "https://blob-fixture.invalid";
  process.env.VERCEL_BLOB_RETRIES = "0";
  const fixture = installPrivateBlobFixture({
    token,
    apiOrigin: process.env.VERCEL_BLOB_API_URL,
    accounts: [{ id: owner }, { id: second }],
    interruptedAssetIds: [interrupted],
  });
  const pathname = `imagine-private/${owner}/${interrupted}.png`;
  const read = () =>
    sdk.get(pathname, { token, access: "private", useCache: false });
  const bytes = Buffer.from("literal synthetic SDK bytes");
  const options = {
    token,
    access: "private",
    contentType: "image/png",
    addRandomSuffix: false,
    allowOverwrite: false,
  };
  try {
    assert.equal(await read(), null);
    await assert.rejects(sdk.put(pathname, bytes, options));
    assert.equal(
      await read(),
      null,
      "Interrupted first read leaves a real uploaded object unresolved",
    );
    const object = await read();
    assert.equal(object.statusCode, 200);
    assert.equal(object.blob.contentType, "image/png");
    assert.equal(object.blob.size, bytes.length);
    assert.deepEqual(
      Buffer.from(await new Response(object.stream).arrayBuffer()),
      bytes,
    );
    await assert.rejects(sdk.put(pathname, Buffer.from("changed"), options));
    assert.equal(fixture.receipt.puts, 1);
    assert.equal(fixture.receipt.uncertainPuts, 1);
    await assert.rejects(
      sdk.get(pathname, { token, access: "private" }),
      "Cache-enabled reads are rejected",
    );
    await assert.rejects(
      sdk.put(
        `imagine-private/cccccccc-cccc-4ccc-8ccc-cccccccccccc/${interrupted}.png`,
        bytes,
        options,
      ),
    );
    await assert.rejects(
      fetch("https://example.com/"),
      "No paid or external network can escape the fixture dispatcher",
    );
    assert.equal(fixture.objects.size, 1);
    assert.equal(fixture.receipt.invalidRequests, 2);
  } finally {
    await fixture.close();
    if (oldApi === undefined) delete process.env.VERCEL_BLOB_API_URL;
    else process.env.VERCEL_BLOB_API_URL = oldApi;
    if (oldRetries === undefined) delete process.env.VERCEL_BLOB_RETRIES;
    else process.env.VERCEL_BLOB_RETRIES = oldRetries;
  }
});

test("non-fixture token and foreign API origin are denied before dispatcher replacement", () => {
  assert.throws(() =>
    installPrivateBlobFixture({
      token: "not-a-fixture",
      apiOrigin: "https://blob-fixture.invalid",
      accounts: [],
    }),
  );
  assert.throws(() =>
    installPrivateBlobFixture({
      token,
      apiOrigin: "https://example.com",
      accounts: [],
    }),
  );
});

test("actual isolated runner denies foreign dispatch and inherited credentials before allocating services", () => {
  const inherited = Object.fromEntries(
    ["PATH", "Path", "SystemRoot", "TEMP", "TMP"]
      .filter((key) => process.env[key])
      .map((key) => [key, process.env[key]]),
  );
  const admitted = {
    ...inherited,
    GITHUB_ACTIONS: "true",
    GITHUB_REPOSITORY: "frankxai/arcanea-ai-app",
    GITHUB_ACTOR: "frankxai",
    GITHUB_EVENT_NAME: "workflow_dispatch",
    RUNNER_OS: "Linux",
    GITHUB_REF_NAME: "agent/codex/private-imagine-assets-20261011",
    GITHUB_RUN_ID: "1",
    GITHUB_RUN_ATTEMPT: "1",
    RUNNER_TEMP: tmpdir(),
    GITHUB_SHA: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
  };
  for (const [overrides, expected] of [
    [{ GITHUB_ACTIONS: "false" }, /owned hosted fixture lane/],
    [{ GITHUB_REF_NAME: "foreign-branch" }, /owned hosted fixture lane/],
    [{ GITHUB_SHA: "0".repeat(40) }, /exact checked-out source/],
    [
      { XAI_API_KEY: "nonsecret-native-denial-fixture" },
      /Hosted credentials are prohibited/,
    ],
    [
      {
        PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN:
          "nonsecret-native-denial-fixture",
      },
      /Hosted credentials are prohibited/,
    ],
    [
      { NEXT_PUBLIC_SUPABASE_URL: "https://example.invalid" },
      /inherited Supabase project is prohibited/,
    ],
    [
      {
        GITHUB_REF_NAME: "agent/codex/provider-account-20261011",
        XAI_API_KEY: "nonsecret-native-denial-fixture",
      },
      /Hosted credentials are prohibited/,
    ],
  ]) {
    const result = spawnSync(
      process.execPath,
      ["scripts/run-provider-account-fixture.mjs"],
      { env: { ...admitted, ...overrides }, encoding: "utf8", timeout: 10000 },
    );
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1);
    assert.match(result.stderr, expected);
    assert.equal(
      result.stdout,
      "",
      "Admission denial cannot allocate or report a running fixture",
    );
  }
});
