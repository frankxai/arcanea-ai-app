const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { EventEmitter } = require("node:events");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const sourcePath = path.resolve(
  __dirname,
  "../../apps/web/lib/security/safe-fetch.ts",
);

// A fresh process exercises the real Node HTTP/HTTPS agents. The DNS boundary
// returns loopback deterministically; the owned proxy never forwards a request.
const proxyChild = `
  const assert = require('node:assert/strict');
  const dns = require('node:dns');
  const http = require('node:http');
  const https = require('node:https');
  const { syncBuiltinESMExports } = require('node:module');
  const { pathToFileURL } = require('node:url');
  const [source, target, mode, proxy] = process.argv.slice(1);
  let lookups = 0;
  dns.lookup = (host, options, callback) => {
    lookups++;
    assert.equal(host, 'safe-fetch.invalid');
    assert.deepEqual(options, { all: true, verbatim: true });
    queueMicrotask(() => callback(null, [{ address: '127.0.0.1', family: 4 }]));
  };
  syncBuiltinESMExports();
  if (mode.startsWith('dynamic')) {
    http.globalAgent = new http.Agent({ proxyEnv: { HTTP_PROXY: proxy } });
    https.globalAgent = new https.Agent({ proxyEnv: { HTTPS_PROXY: proxy } });
  }
  (async () => {
    // Prove that the proxy is active, not merely configured.
    const control = await new Promise((resolve, reject) => {
      http.get('http://proxy-control.invalid/synthetic-control', res => {
        let text = '';
        res.on('data', b => { text += b; });
        res.on('end', () => resolve(text));
        res.on('error', reject);
      }).on('error', reject);
    });
    assert.equal(control, 'synthetic-proxy-control');
    const { safeFetchText } = await import(pathToFileURL(source));
    let result;
    try {
      const response = await safeFetchText(target, { timeoutMs: 2000 });
      result = { outcome: 'resolved', text: response.text };
    } catch (error) {
      result = { outcome: 'rejected', name: error.name, code: error.code, message: error.message };
    }
    console.log(JSON.stringify({ control, lookups, result }));
    http.globalAgent.destroy();
    https.globalAgent.destroy();
  })().catch(error => { console.error(error); process.exitCode = 1; });
`;

async function nativeProxyCase(mode) {
  const traffic = [];
  const server = http.createServer((req, res) => {
    traffic.push({ method: req.method, target: req.url });
    res.setHeader("Connection", "close");
    res.end(
      req.url === "http://proxy-control.invalid/synthetic-control"
        ? "synthetic-proxy-control"
        : "synthetic-private-response",
    );
  });
  server.on("connect", (req, socket) => {
    traffic.push({ method: "CONNECT", target: req.url });
    socket.end(
      "HTTP/1.1 502 Synthetic denial\r\nContent-Length: 0\r\nConnection: close\r\n\r\n",
    );
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const proxy = `http://127.0.0.1:${server.address().port}`;
  const protocol = mode.endsWith("https") ? "https" : "http";
  let child;
  let timer;
  try {
    const observation = await new Promise((resolve, reject) => {
      child = spawn(
        process.execPath,
        [
          ...(mode.startsWith("env") ? ["--use-env-proxy"] : []),
          "--eval",
          proxyChild,
          sourcePath,
          `${protocol}://safe-fetch.invalid/synthetic-only`,
          mode,
          proxy,
        ],
        {
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"],
          env: {
            ...process.env,
            NODE_OPTIONS: "",
            NODE_USE_ENV_PROXY: mode.startsWith("env") ? "1" : "0",
            HTTP_PROXY: proxy,
            http_proxy: proxy,
            HTTPS_PROXY: proxy,
            https_proxy: proxy,
            NO_PROXY: "",
            no_proxy: "",
          },
        },
      );
      let stdout = "",
        stderr = "";
      child.stdout.on("data", (b) => {
        stdout += b;
      });
      child.stderr.on("data", (b) => {
        stderr += b;
      });
      child.once("error", reject);
      timer = setTimeout(() => child.kill(), 8000);
      child.once("close", (code) => {
        try {
          assert.equal(code, 0, stderr);
          resolve(JSON.parse(stdout.trim()));
        } catch (error) {
          reject(error);
        }
      });
    });
    assert.equal(
      observation.result.outcome,
      "rejected",
      "A proxy must not supply private bytes",
    );
    assert.equal(
      observation.result.code,
      "EUNSAFEHOST",
      JSON.stringify(observation),
    );
    assert.equal(
      observation.lookups,
      1,
      "The target must pass guarded DNS before connecting",
    );
    assert.deepEqual(
      traffic,
      [
        {
          method: "GET",
          target: "http://proxy-control.invalid/synthetic-control",
        },
      ],
      "Only the positive control may reach the proxy; no target GET or CONNECT",
    );
  } finally {
    clearTimeout(timer);
    if (child && child.exitCode === null && child.signalCode === null)
      child.kill();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

for (const mode of ["env-http", "env-https", "dynamic-http", "dynamic-https"]) {
  test(
    `guarded fetch bypasses the active native ${mode} proxy`,
    { timeout: 10000 },
    () => nativeProxyCase(mode),
  );
}

// The remaining cases execute the actual compiled guard with controlled DNS and
// response boundaries. They prove decision/redirect/budget behavior, not TLS or
// arbitrary network reachability. Native agent isolation is tested above.
function responseFixture(dnsSteps, responses) {
  const dnsCalls = [],
    requests = [],
    connections = [],
    timers = new Set();
  const schedule = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const dns = {
    lookup(host, options, callback) {
      dnsCalls.push({ host, options });
      const addresses = dnsSteps[dnsCalls.length - 1];
      assert.ok(addresses, "Unexpected DNS lookup");
      queueMicrotask(() => callback(null, addresses));
    },
  };
  const client = {
    request(target, options, onResponse) {
      const req = new EventEmitter();
      req.destroyed = false;
      req.destroy = (error) => {
        req.destroyed = true;
        if (error) queueMicrotask(() => req.emit("error", error));
      };
      requests.push({ url: target.href, options });
      req.end = () =>
        queueMicrotask(() =>
          options.lookup(target.hostname, { all: true }, (error, addresses) => {
            if (error) return req.destroy(error);
            connections.push(addresses);
            const spec = responses[connections.length - 1];
            assert.ok(spec, "Unexpected transport connection");
            const emit = () => {
              if (req.destroyed) return;
              const res = new EventEmitter();
              res.statusCode = spec.status ?? 200;
              res.headers = {
                "content-type": "text/plain",
                ...(spec.location ? { location: spec.location } : {}),
              };
              onResponse(res);
              for (const chunk of spec.chunks ?? ["public result"]) {
                if (req.destroyed) break;
                res.emit("data", Buffer.from(chunk));
              }
              if (!req.destroyed) res.emit("end");
            };
            if (spec.delayMs) schedule(emit, spec.delayMs);
            else emit();
          }),
        );
      return req;
    },
  };
  const compiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(
    compiled,
    {
      exports: module.exports,
      module,
      require(id) {
        if (id === "node:dns") return dns;
        if (id === "node:http" || id === "node:https") return client;
        return require(id);
      },
      Buffer,
      URL,
      Date,
      setTimeout: schedule,
      clearTimeout(id) {
        clearTimeout(id);
        timers.delete(id);
      },
    },
    { filename: sourcePath },
  );
  return {
    ...module.exports,
    dnsCalls,
    requests,
    connections,
    close() {
      for (const id of timers) clearTimeout(id);
      timers.clear();
    },
  };
}

const publicV4 = { address: "1.1.1.1", family: 4 };
const publicV6 = { address: "2606:4700:4700::1111", family: 6 };

test("mixed public/private A and AAAA answers fail before any transport connection", async () => {
  for (const privateAddress of [
    { address: "127.0.0.1", family: 4 },
    { address: "::ffff:169.254.169.254", family: 6 },
    { address: "fd12::1", family: 6 },
  ]) {
    const fixture = responseFixture([[publicV4, publicV6, privateAddress]], []);
    try {
      await assert.rejects(
        fixture.safeFetchText("https://public.invalid/"),
        /non-public address/,
      );
      assert.equal(fixture.connections.length, 0);
      assert.equal(fixture.dnsCalls[0].options.all, true);
      assert.equal(fixture.dnsCalls[0].options.verbatim, true);
    } finally {
      fixture.close();
    }
  }
});

test("the checked public address list reaches the transport unchanged", async () => {
  const addresses = [publicV4, publicV6];
  const fixture = responseFixture([addresses], [{}]);
  try {
    const result = await fixture.safeFetchText("https://public.invalid/story");
    assert.equal(result.text, "public result");
    assert.strictEqual(fixture.connections[0], addresses);
    assert.equal(fixture.dnsCalls.length, 1);
  } finally {
    fixture.close();
  }
});

test("a redirect that rebinds the same hostname to loopback is refused", async () => {
  const fixture = responseFixture(
    [[publicV4], [{ address: "127.0.0.1", family: 4 }]],
    [{ status: 302, location: "/rebound" }],
  );
  try {
    await assert.rejects(
      fixture.safeFetchText("https://public.invalid/start"),
      /non-public address/,
    );
    assert.equal(fixture.dnsCalls.length, 2);
    assert.equal(fixture.connections.length, 1);
  } finally {
    fixture.close();
  }
});

test("redirects to private, encoded and credential-bearing targets stop before another request", async () => {
  for (const location of [
    "http://127.0.0.1/",
    "http://2130706433/",
    "http://[::ffff:169.254.169.254]/",
    "http://user:password@public.invalid/",
    "file:///synthetic-only",
  ]) {
    const fixture = responseFixture([[publicV4]], [{ status: 302, location }]);
    try {
      await assert.rejects(
        fixture.safeFetchText("https://public.invalid/start"),
        /not allowed|Only http/,
      );
      assert.equal(fixture.requests.length, 1);
      assert.equal(fixture.connections.length, 1);
    } finally {
      fixture.close();
    }
  }
});

test("redirect chains stop after three followed hops", async () => {
  const fixture = responseFixture(
    Array(4).fill([publicV4]),
    Array(4).fill({ status: 302, location: "/again" }),
  );
  try {
    await assert.rejects(
      fixture.safeFetchText("http://public.invalid/start"),
      /Too many redirects/,
    );
    assert.equal(fixture.requests.length, 4);
  } finally {
    fixture.close();
  }
});

test("oversized response bytes destroy the request and are never returned", async () => {
  const fixture = responseFixture([[publicV4]], [{ chunks: ["1234", "5678"] }]);
  try {
    await assert.rejects(
      fixture.safeFetchText("https://public.invalid/", { maxBytes: 5 }),
      /exceeds 5 bytes/,
    );
  } finally {
    fixture.close();
  }
});

test("the wall-clock deadline covers delayed response headers", async () => {
  const fixture = responseFixture([[publicV4]], [{ delayMs: 500 }]);
  try {
    await assert.rejects(
      fixture.safeFetchText("https://public.invalid/", { timeoutMs: 40 }),
      /timed out/,
    );
  } finally {
    fixture.close();
  }
});

test("empty DNS results fail without a transport connection", async () => {
  const fixture = responseFixture([[]], []);
  try {
    await assert.rejects(
      fixture.safeFetchText("https://public.invalid/"),
      /non-public address/,
    );
    assert.equal(fixture.connections.length, 0);
  } finally {
    fixture.close();
  }
});
