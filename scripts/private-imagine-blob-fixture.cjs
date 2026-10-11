const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const { createRequire } = require("node:module");
const path = require("node:path");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const blobRequire = createRequire(appRequire.resolve("@vercel/blob"));
const { MockAgent, getGlobalDispatcher, setGlobalDispatcher } =
  blobRequire("undici");

// The compiled app still executes the installed Blob SDK. Only its network is a
// disposable byte store. This module is never imported by production app code.
function installPrivateBlobFixture(config) {
  assert.match(config.token, /^vercel_blob_rw_arcaneafixture_[a-f0-9]{32,64}$/);
  assert.equal(config.apiOrigin, "https://blob-fixture.invalid");
  const accounts = new Set(config.accounts.map((account) => account.id));
  assert.equal(accounts.size, 2);
  for (const id of accounts) assert.match(id, /^[a-f0-9-]{36}$/);
  const oldDispatcher = getGlobalDispatcher();
  const agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect((host) =>
    /^(?:127\.0\.0\.1|localhost):(?:3001|54321)$/.test(host),
  );
  const objects = new Map();
  const hiddenReads = new Set();
  const interrupted = new Set();
  const receipt = {
    sdk: "@vercel/blob",
    mode: "undici transport fixture",
    puts: 0,
    reads: 0,
    invalidRequests: 0,
    uncertainPuts: 0,
    productionWrites: 0,
    externalNetworkAllowed: false,
  };
  const privateOrigin =
    "https://arcaneafixture.private.blob.vercel-storage.com";
  const headers = (values) => {
    if (Array.isArray(values)) {
      const pairs = [];
      for (let i = 0; i < values.length; i += 2)
        pairs.push([String(values[i]).toLowerCase(), String(values[i + 1])]);
      return Object.fromEntries(pairs);
    }
    return Object.fromEntries(
      Object.entries(values || {}).map(([key, value]) => [
        key.toLowerCase(),
        String(value),
      ]),
    );
  };
  const ownedPath = (value) => {
    const matched =
      /^imagine-private\/([a-f0-9-]{36})\/([a-f0-9-]{36})\.(png|jpg|webp)$/.exec(
        value,
      );
    return matched && accounts.has(matched[1]);
  };
  const saveReceipt = () => {
    if (!config.receiptPath) return;
    fs.writeFileSync(
      config.receiptPath,
      JSON.stringify(
        {
          ...receipt,
          objects: [...objects.values()].map(({ bytes }) => ({
            size: bytes.length,
            sha256: createHash("sha256").update(bytes).digest("hex"),
          })),
        },
        null,
        2,
      ),
    );
  };
  const fail = () => {
    receipt.invalidRequests++;
    saveReceipt();
    return {
      statusCode: 403,
      data: JSON.stringify({ error: { code: "forbidden" } }),
    };
  };
  agent
    .get(config.apiOrigin)
    .intercept({ method: "PUT", path: /^\/\?pathname=/ })
    .reply((options) => {
      const requestHeaders = headers(options.headers);
      const url = new URL(options.path, config.apiOrigin);
      const pathname = url.searchParams.get("pathname");
      if (
        !ownedPath(pathname) ||
        requestHeaders.authorization !== `Bearer ${config.token}` ||
        requestHeaders["x-vercel-blob-access"] !== "private" ||
        requestHeaders["x-add-random-suffix"] !== "0" ||
        requestHeaders["x-allow-overwrite"] !== "0"
      )
        return fail();
      const mime = requestHeaders["x-content-type"];
      if (
        !{ png: "image/png", jpg: "image/jpeg", webp: "image/webp" }[
          pathname.split(".").at(-1)
        ] ||
        mime !==
          { png: "image/png", jpg: "image/jpeg", webp: "image/webp" }[
            pathname.split(".").at(-1)
          ]
      )
        return fail();
      if (objects.has(pathname))
        return {
          statusCode: 400,
          data: JSON.stringify({ error: { code: "blob_already_exists" } }),
        };
      if (!(
        Buffer.isBuffer(options.body) ||
        options.body instanceof Uint8Array ||
        typeof options.body === "string"
      ))
        return fail();
      const bytes = Buffer.from(options.body);
      if (
        !bytes.length ||
        bytes.length > 3145728 ||
        objects.size >= 256 ||
        [...objects.values()].reduce(
          (sum, value) => sum + value.bytes.length,
          bytes.length,
        ) >
          16 * 1024 * 1024
      )
        return fail();
      objects.set(pathname, { bytes, mime });
      receipt.puts++;
      const id = pathname.split("/").at(-1).split(".")[0];
      if (config.interruptedAssetIds?.includes(id) && !interrupted.has(id)) {
        interrupted.add(id);
        hiddenReads.add(pathname);
        receipt.uncertainPuts++;
        saveReceipt();
        return {
          statusCode: 503,
          data: JSON.stringify({ error: { code: "unknown_error" } }),
        };
      }
      saveReceipt();
      const urlValue = `${privateOrigin}/${pathname}`;
      return {
        statusCode: 200,
        data: JSON.stringify({
          url: urlValue,
          downloadUrl: `${urlValue}?download=1`,
          pathname,
          contentType: mime,
          contentDisposition: "inline",
          etag: createHash("sha256").update(bytes).digest("hex"),
        }),
        responseOptions: { headers: { "content-type": "application/json" } },
      };
    })
    .persist();
  agent
    .get(privateOrigin)
    .intercept({ method: "GET", path: /^\/imagine-private\// })
    .reply((options) => {
      const url = new URL(options.path, privateOrigin);
      const pathname = url.pathname.slice(1);
      if (
        !ownedPath(pathname) ||
        headers(options.headers).authorization !== `Bearer ${config.token}` ||
        url.searchParams.get("cache") !== "0"
      )
        return fail();
      receipt.reads++;
      const object = objects.get(pathname);
      const hidden = hiddenReads.delete(pathname);
      saveReceipt();
      if (!object || hidden) return { statusCode: 404, data: "" };
      return {
        statusCode: 200,
        data: object.bytes,
        responseOptions: {
          headers: {
            "content-type": object.mime,
            "content-length": String(object.bytes.length),
            "cache-control": "private, no-store",
            etag: createHash("sha256").update(object.bytes).digest("hex"),
          },
        },
      };
    })
    .persist();
  setGlobalDispatcher(agent);
  saveReceipt();
  return {
    receipt,
    objects,
    async close() {
      setGlobalDispatcher(oldDispatcher);
      await agent.close();
    },
  };
}
module.exports = { installPrivateBlobFixture };

if (process.env.PRIVATE_IMAGINE_FIXTURE) {
  assert.equal(process.env.GITHUB_ACTIONS, "true");
  assert.equal(process.env.GITHUB_REPOSITORY, "frankxai/arcanea-ai-app");
  assert.equal(process.env.GITHUB_ACTOR, "frankxai");
  assert.equal(process.env.GITHUB_EVENT_NAME, "workflow_dispatch");
  assert.equal(process.env.RUNNER_OS, "Linux");
  assert.equal(
    process.env.GITHUB_REF_NAME,
    "agent/codex/private-imagine-assets-20261011",
  );
  const configPath = path.resolve(process.env.PRIVATE_IMAGINE_FIXTURE);
  assert.equal(path.dirname(configPath), path.resolve(process.env.RUNNER_TEMP));
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.output, "screenshots/private-imagine");
  assert.equal(process.env.VERCEL_BLOB_API_URL, config.blob.apiOrigin);
  assert.equal(
    process.env.PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN,
    config.blob.token,
  );
  assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, "http://127.0.0.1:54321");
  installPrivateBlobFixture({
    ...config.blob,
    accounts: config.accounts,
    receiptPath: `${config.output}/blob-transport-receipt.json`,
  });
}
