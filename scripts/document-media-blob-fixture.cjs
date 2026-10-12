const assert = require("node:assert/strict");
const { createHash, createHmac } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { createServer } = require("node:http");
const { createRequire } = require("node:module");
const appRequire = createRequire(path.resolve("apps/web/package.json"));
const sdkRequire = createRequire(appRequire.resolve("@vercel/blob"));

// Network-only fixture: the compiled app and browser execute the installed SDK.
// Production code never imports this file or sees the loopback byte store.
function createDocumentBlobStore(config) {
  assert.match(config.token, /^vercel_blob_rw_arcaneafixture_[a-f0-9]{48}$/);
  const owners = new Set(config.accounts.map((a) => a.id));
  assert.equal(owners.size, 2);
  for (const id of owners) assert.match(id, /^[a-f0-9-]{36}$/);
  const origin = "https://arcaneafixture.private.blob.vercel-storage.com";
  const objects = new Map();
  const receipt = {
    puts: 0,
    reads: 0,
    invalidRequests: 0,
    productionWrites: 0,
    sdk: "@vercel/blob",
    mode: "signed client PUT and private GET transport fixture",
    externalNetworkAllowed: false,
  };
  const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
  const save = () => {
    if (config.receiptPath)
      fs.writeFileSync(
        config.receiptPath,
        JSON.stringify(
          {
            ...receipt,
            objects: [...objects.entries()].map(([pathname, o]) => ({
              pathname,
              size: o.bytes.length,
              sha256: digest(o.bytes),
              mime: o.mime,
            })),
          },
          null,
          2,
        ),
      );
  };
  const owned = (pathname) => {
    const parts =
      /^document-private\/([a-f0-9-]{36})\/([a-f0-9-]{36})\/([a-f0-9-]{36})\/([a-f0-9-]{36})\.(png|jpg|webp)$/.exec(
        pathname,
      );
    return parts && owners.has(parts[1]);
  };
  const fail = () => {
    receipt.invalidRequests++;
    save();
    return {
      statusCode: 403,
      data: JSON.stringify({ error: { code: "forbidden" } }),
    };
  };
  function put(url, headers, bytes, now = Date.now()) {
    try {
      const pathname = new URL(url, "http://127.0.0.1").searchParams.get(
        "pathname",
      );
      const match = /^Bearer vercel_blob_client_arcaneafixture_(.+)$/.exec(
        headers.authorization || "",
      );
      assert.ok(match && owned(pathname));
      const signed = Buffer.from(match[1], "base64").toString("utf8");
      const split = signed.indexOf(".");
      const signature = signed.slice(0, split),
        payload = signed.slice(split + 1);
      assert.equal(
        signature,
        createHmac("sha256", config.token).update(payload).digest("hex"),
      );
      const grant = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
      const mime = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" }[
        pathname.split(".").at(-1)
      ];
      assert.equal(grant.pathname, pathname);
      assert.equal(grant.addRandomSuffix, false);
      assert.equal(grant.allowOverwrite, false);
      assert.equal(
        grant.validUntil > now && grant.validUntil <= now + 602000,
        true,
      );
      assert.deepEqual(grant.allowedContentTypes, [mime]);
      assert.equal(headers["x-vercel-blob-access"], "private");
      assert.equal(headers["x-content-type"], mime);
      assert.ok(
        !headers["x-add-random-suffix"] ||
          headers["x-add-random-suffix"] === "0",
      );
      assert.ok(
        !headers["x-allow-overwrite"] || headers["x-allow-overwrite"] === "0",
      );
      assert.ok(
        Number.isInteger(grant.maximumSizeInBytes) &&
          grant.maximumSizeInBytes <= 10485760,
      );
      assert.ok(bytes.length > 0 && bytes.length <= grant.maximumSizeInBytes);
      assert.ok(
        objects.size < 32 &&
          [...objects.values()].reduce(
            (n, o) => n + o.bytes.length,
            bytes.length,
          ) <=
            64 * 1024 * 1024,
      );
      if (objects.has(pathname))
        return {
          statusCode: 400,
          data: JSON.stringify({ error: { code: "blob_already_exists" } }),
        };
      objects.set(pathname, { bytes: Buffer.from(bytes), mime });
      receipt.puts++;
      save();
      const urlValue = `${origin}/${pathname}`;
      return {
        statusCode: 200,
        data: JSON.stringify({
          url: urlValue,
          downloadUrl: `${urlValue}?download=1`,
          pathname,
          contentType: mime,
          contentDisposition: "inline",
          etag: digest(bytes),
        }),
      };
    } catch {
      return fail();
    }
  }
  function get(url, headers) {
    const address = new URL(url, origin),
      pathname = address.pathname.slice(1);
    if (
      !owned(pathname) ||
      headers.authorization !== `Bearer ${config.token}` ||
      address.searchParams.get("cache") !== "0"
    )
      return fail();
    receipt.reads++;
    save();
    const object = objects.get(pathname);
    if (!object) return { statusCode: 404, data: "" };
    return {
      statusCode: 200,
      data: object.bytes,
      responseOptions: {
        headers: {
          "content-type": object.mime,
          "content-length": String(object.bytes.length),
          "cache-control": "private, no-store",
          etag: digest(object.bytes),
        },
      },
    };
  }
  save();
  return { put, get, origin, receipt, objects };
}
function headerMap(headers) {
  if (Array.isArray(headers)) {
    const result = {};
    for (let i = 0; i < headers.length; i += 2)
      result[String(headers[i]).toLowerCase()] = String(headers[i + 1]);
    return result;
  }
  return Object.fromEntries(
    Object.entries(headers || {}).map(([key, value]) => [
      key.toLowerCase(),
      String(value),
    ]),
  );
}
function installDocumentBlobFixture(config) {
  const { MockAgent, getGlobalDispatcher, setGlobalDispatcher } =
    sdkRequire("undici");
  const previous = getGlobalDispatcher(),
    agent = new MockAgent();
  agent.disableNetConnect();
  agent.enableNetConnect((host) =>
    /^(?:127\.0\.0\.1|localhost):(?:3001|54321)$/.test(host),
  );
  const store = createDocumentBlobStore(config);
  agent
    .get(store.origin)
    .intercept({ method: "GET", path: /^\/document-private\// })
    .reply((options) => store.get(options.path, headerMap(options.headers)))
    .persist();
  // Native tests execute the real client PUT. A signed fixture token is required;
  // no read-write token or unrestricted network is admitted for upload.
  agent
    .get("https://vercel.com")
    .intercept({ method: "PUT", path: /^\/api\/blob\/\?pathname=/ })
    .reply((options) =>
      store.put(
        options.path,
        headerMap(options.headers),
        Buffer.from(options.body),
      ),
    )
    .persist();
  setGlobalDispatcher(agent);
  const server = createServer(async (request, response) => {
    if (request.method !== "PUT" || !request.url.startsWith("/?pathname=")) {
      response.writeHead(404).end();
      return;
    }
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > 10485760) {
          response.writeHead(413).end();
          request.destroy();
          return;
        }
        chunks.push(chunk);
      }
      const result = store.put(
        request.url,
        request.headers,
        Buffer.concat(chunks),
      );
      response
        .writeHead(result.statusCode, { "content-type": "application/json" })
        .end(result.data);
    } catch {
      if (!response.headersSent) response.writeHead(503);
      response.end();
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 10000;
  assert.ok(config.listenPort === undefined || config.listenPort === 0);
  server.listen(config.listenPort ?? 54324, "127.0.0.1");
  return {
    ...store,
    async close() {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      setGlobalDispatcher(previous);
      await agent.close();
    },
  };
}
module.exports = { createDocumentBlobStore, installDocumentBlobFixture };
if (process.env.DOCUMENT_MEDIA_BLOB_FIXTURE) {
  assert.equal(process.env.GITHUB_ACTIONS, "true");
  assert.equal(process.env.GITHUB_REPOSITORY, "frankxai/arcanea-ai-app");
  assert.equal(process.env.GITHUB_ACTOR, "frankxai");
  assert.equal(process.env.GITHUB_EVENT_NAME, "workflow_dispatch");
  assert.equal(process.env.RUNNER_OS, "Linux");
  assert.equal(
    process.env.GITHUB_REF_NAME,
    "agent/codex/project-document-recovery-20261011",
  );
  assert.match(process.env.GITHUB_RUN_ID || "", /^\d+$/);
  assert.match(process.env.GITHUB_RUN_ATTEMPT || "", /^\d+$/);
  const filename = path.join(
    process.env.RUNNER_TEMP,
    `project-document-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT}.private.json`,
  );
  assert.equal(process.env.DOCUMENT_MEDIA_BLOB_FIXTURE, filename);
  assert.equal(fs.statSync(filename).mode & 0o777, 0o600);
  const config = JSON.parse(fs.readFileSync(filename, "utf8"));
  assert.equal(config.head, process.env.GITHUB_SHA);
  assert.equal(config.output, "screenshots/project-document-service");
  assert.equal(config.supabaseUrl, "http://127.0.0.1:54321");
  assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL, config.supabaseUrl);
  assert.equal(process.env.SUPABASE_SERVICE_ROLE_KEY, config.admin);
  assert.equal(process.env.PRIVATE_IMAGINE_STORAGE_ENABLED, "true");
  assert.equal(
    process.env.PRIVATE_IMAGINE_BLOB_READ_WRITE_TOKEN,
    config.blob.token,
  );
  assert.equal(process.env.VERCEL_BLOB_API_URL, "https://blob-fixture.invalid");
  installDocumentBlobFixture({
    ...config.blob,
    accounts: config.accounts,
    receiptPath: path.resolve(`${config.output}/blob-transport-receipt.json`),
  });
}
