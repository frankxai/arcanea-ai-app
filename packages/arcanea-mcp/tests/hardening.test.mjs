// Fault injection against the shipped server: resource budgets over stdio and the
// HTTP body cap. Each test reproduces an adversarial-review finding.
// Run: pnpm --dir packages/arcanea-mcp test:worldpack

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(here, "../dist/cli.js");
const FIXTURE = resolve(
  here,
  "../../world-pack/fixtures/slow-chart.worldpack.json",
);
const golden = () => JSON.parse(readFileSync(FIXTURE, "utf8"));
const KiB = 1024;
const MiB = 1024 * KiB;

let client;

before(async () => {
  client = new Client({ name: "hardening-test", version: "1.0.0" });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [CLI],
      stderr: "ignore",
    }),
  );
});

after(async () => {
  await client?.close();
});

async function call(name, args) {
  const result = await client.callTool({ name, arguments: args });
  return {
    isError: result.isError === true,
    body: JSON.parse(result.content[0].text),
  };
}

function nodeLike(pack, i, extra = {}) {
  const world = pack.nodes.find((n) => n.type === "World");
  return {
    id: `chr_budget_${i}`,
    type: "Character",
    name: `Wanderer ${i}`,
    layer: "user",
    attributes: {},
    governance: { ...world.governance },
    ...extra,
  };
}

// ── P1-4 resource budgets, checked before any processing ─────────────────────

test("P1-4 an object pack over the byte budget is refused before processing", async () => {
  const pack = golden();
  const filler = "a".repeat(30 * KiB);
  for (let i = 0; i < 200; i++)
    pack.nodes.push(nodeLike(pack, i, { description: filler }));
  const { isError, body } = await call("worldpack_check", { pack });
  assert.equal(isError, true);
  assert.match(body.error, /budget/i);
  assert.match(body.error, /bytes/i);
});

test("P1-4 depth, node count and string length each have a budget", async () => {
  const deep = golden();
  let nest = {};
  const root = nest;
  for (let i = 0; i < 200; i++) nest = nest.next = {};
  deep.nodes[1].attributes.lore = root;
  const depth = await call("worldpack_check", { pack: deep });
  assert.equal(depth.isError, true);
  assert.match(depth.body.error, /depth/i);

  const wide = golden();
  for (let i = 0; i < 5001; i++) wide.nodes.push(nodeLike(wide, i));
  const nodes = await call("worldpack_check", { pack: wide });
  assert.equal(nodes.isError, true);
  assert.match(nodes.body.error, /nodes/i);

  const long = golden();
  long.nodes[1].attributes.backstory = "b".repeat(100 * KiB);
  const strings = await call("worldpack_check", { pack: long });
  assert.equal(strings.isError, true);
  assert.match(strings.body.error, /string/i);
});

test("P1-4 a canon document with more terms than the budget is refused", async () => {
  const rows = Array.from(
    { length: 3000 },
    (_, i) => `| Term${i} | Definition ${i} | LOCKED ✅ |`,
  );
  const canonDocument = [
    "# HUGE CANON",
    "",
    "| Term | Definition | Status |",
    "| --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
  const { isError, body } = await call("worldpack_check", {
    pack: golden(),
    canonDocument,
  });
  assert.equal(isError, true);
  assert.match(body.error, /canon/i);
  assert.match(body.error, /budget/i);
});

// ── P1-4 HTTP must not buffer an unbounded body ──────────────────────────────

function startHttp(port) {
  return new Promise((resolveStart, reject) => {
    const child = spawn(
      process.execPath,
      [CLI, "--transport", "http", "--port", String(port)],
      {
        stdio: ["ignore", "ignore", "pipe"],
      },
    );
    const timer = setTimeout(
      () => reject(new Error("http server did not start")),
      15000,
    );
    child.stderr.on("data", (chunk) => {
      if (String(chunk).includes("running (http)")) {
        clearTimeout(timer);
        resolveStart(child);
      }
    });
    child.on("exit", (code) => reject(new Error(`http server exited ${code}`)));
  });
}

function post(port, { bytes, declareLength }) {
  return new Promise((resolvePost) => {
    const headers = { "Content-Type": "application/json" };
    if (declareLength) headers["Content-Length"] = String(bytes);
    const req = http.request({
      host: "127.0.0.1",
      port,
      path: "/mcp",
      method: "POST",
      headers,
    });
    req.on("response", (res) => {
      res.resume();
      resolvePost({ status: res.statusCode });
    });
    req.on("error", (err) => resolvePost({ error: err.code }));
    const chunk = Buffer.alloc(64 * KiB, 0x61);
    let sent = 0;
    const pump = () => {
      while (sent < bytes) {
        sent += chunk.length;
        if (!req.write(chunk)) return req.once("drain", pump);
      }
      req.end();
    };
    pump();
  });
}

function health(port) {
  return new Promise((resolveHealth) => {
    http
      .get({ host: "127.0.0.1", port, path: "/health" }, (res) => {
        res.resume();
        resolveHealth(res.statusCode);
      })
      .on("error", () => resolveHealth(null));
  });
}

test("P1-4 HTTP rejects an oversized body with 413 instead of buffering it", async () => {
  const port = 40000 + Math.floor(Math.random() * 20000);
  const child = await startHttp(port);
  try {
    const declared = await post(port, { bytes: 8 * MiB, declareLength: true });
    assert.equal(declared.status, 413, JSON.stringify(declared));

    const streamed = await post(port, { bytes: 8 * MiB, declareLength: false });
    assert.ok(
      streamed.status === 413 ||
        ["ECONNRESET", "EPIPE"].includes(streamed.error),
      `chunked oversized body must be cut off, got ${JSON.stringify(streamed)}`,
    );
    assert.equal(await health(port), 200, "the server survives both");
  } finally {
    child.kill();
  }
});
