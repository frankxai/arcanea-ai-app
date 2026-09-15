// WorldPack audit tools over a real stdio handshake: the built CLI is spawned as a
// child process, exactly as an MCP host runs it.
// Run: pnpm --dir packages/arcanea-mcp test:worldpack

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { RULES } from "../dist/vendor/world-pack/conflict.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(here, "../dist/cli.js");
const FIXTURE = resolve(here, "../../world-pack/fixtures/slow-chart.worldpack.json");
const CUSTOM_CANON = readFileSync(resolve(here, "../../world-pack/fixtures/custom-canon.md"), "utf8");
const PKG = JSON.parse(readFileSync(resolve(here, "../package.json"), "utf8"));
const README = readFileSync(resolve(here, "../README.md"), "utf8");

const golden = () => JSON.parse(readFileSync(FIXTURE, "utf8"));
const worldGovernance = (pack) => pack.nodes.find((n) => n.type === "World").governance;

// Claims the canon layer AND the canon owner. The name does not resolve in the
// canon document, so neither claim is evidence of anything.
function forgeCanonClaim(pack) {
  pack.nodes.push({
    id: "chr_forged",
    type: "Character",
    name: "Veyra Coldwater",
    layer: "canon",
    attributes: {},
    governance: {
      ...worldGovernance(pack),
      owner: "arcanea",
      canonStatus: "locked",
      rights: { state: "arcanea-owned", spdx: null, commercial: false, attribution: true },
      evalRule: "canon-immutable",
    },
  });
  return pack;
}

let client;

before(async () => {
  client = new Client({ name: "worldpack-stdio-test", version: "1.0.0" });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: [CLI], stderr: "ignore" }));
});

after(async () => {
  await client?.close();
});

async function call(name, args) {
  const result = await client.callTool({ name, arguments: args });
  return { isError: result.isError === true, body: JSON.parse(result.content[0].text) };
}

async function allTools() {
  const tools = [];
  let cursor;
  do {
    const page = await client.listTools(cursor ? { cursor } : {});
    tools.push(...page.tools);
    cursor = page.nextCursor;
  } while (cursor);
  return tools;
}

test("stdio handshake reports the package version and read-only WorldPack tools", async () => {
  assert.deepEqual(client.getServerVersion(), { name: "arcanea-mcp", version: PKG.version });
  const tools = await allTools();
  for (const name of ["worldpack_check", "worldpack_verify", "worldpack_rules"]) {
    const tool = tools.find((t) => t.name === name);
    assert.ok(tool, `${name} missing from tools/list`);
    assert.equal(tool.annotations?.readOnlyHint, true, `${name} must be read-only`);
  }
});

test("a forged layer:'canon' node is a blocker, not a blessing", async () => {
  const { isError, body } = await call("worldpack_check", { pack: forgeCanonClaim(golden()) });
  assert.equal(isError, false);
  assert.equal(body.verdict, "blocked");
  const claim = body.findings.find((f) => f.ruleId === "canon.layer-claim");
  assert.ok(claim, `expected canon.layer-claim, got ${body.findings.map((f) => f.ruleId).join(", ")}`);
  assert.equal(claim.severity, "blocker");
  assert.deepEqual(claim.node, { id: "chr_forged", name: "Veyra Coldwater" });
  assert.equal(claim.evidence.derivedLayer, "user");
  assert.match(claim.fix, /never by the pack/);
  assert.equal(body.findings[0].severity, "blocker", "findings are ordered most severe first");
  assert.ok(body.summary.blocker >= 3, "demoted to its real layer, its status and rights are illegal too");
});

test("a clean pack passes with zero findings against the bundled canon", async () => {
  const pack = golden();
  const { isError, body } = await call("worldpack_check", { pack: JSON.stringify(pack) });
  assert.equal(isError, false);
  assert.equal(body.verdict, "pass", body.headline);
  assert.deepEqual(body.findings, []);
  assert.equal(body.structure.valid, true);
  assert.equal(body.canon.sourceHash, pack.canon.sourceHash, "the bundled canon is the canon the golden pack was cleared against");
});

test("path is read over stdio; bad inputs are tool errors, not crashes", async () => {
  assert.equal((await call("worldpack_check", { path: FIXTURE })).body.verdict, "pass");

  const notJson = await call("worldpack_check", { path: resolve(here, "../../world-pack/fixtures/custom-canon.md") });
  assert.equal(notJson.isError, true);
  assert.match(notJson.body.error, /\.json/);

  const both = await call("worldpack_check", { pack: golden(), path: FIXTURE });
  assert.equal(both.isError, true);
  assert.equal((await call("worldpack_check", {})).isError, true);

  const garbage = await call("worldpack_verify", { pack: "{not json" });
  assert.equal(garbage.isError, true);
  assert.match(garbage.body.error, /not valid JSON/);
});

test("a creator's own canonDocument enforces their locked names", async () => {
  const pack = golden();
  pack.nodes.push({
    id: "chr_maren",
    type: "Character",
    name: "Maren",
    layer: "user",
    attributes: {},
    governance: { ...worldGovernance(pack) },
  });
  const { body } = await call("worldpack_check", { pack, canonDocument: CUSTOM_CANON });
  assert.equal(body.canon.source, "canonDocument");
  assert.equal(body.canon.universe, "Tidewater");
  assert.equal(body.verdict, "blocked");
  const rules = body.findings.map((f) => f.ruleId);
  assert.ok(rules.includes("canon.locked-name-taken"), rules.join(", "));
  assert.ok(rules.includes("canon.binding-foreign"), "a foreign binding is reported, not enforced");
  assert.ok(!rules.includes("canon.binding-mismatch"));
});

test("worldpack_verify tells sealed, tampered, unsealed and canon-mismatch apart", async () => {
  assert.equal((await call("worldpack_verify", { pack: golden() })).body.verdict, "sealed");

  const edited = golden();
  edited.provenance.versions[0].createdBy = "crt_SOMEONE_ELSE";
  const tampered = (await call("worldpack_verify", { pack: edited })).body;
  assert.equal(tampered.verdict, "tampered");
  assert.equal(tampered.checks.digest.ok, false);
  assert.notEqual(tampered.checks.digest.recomputed, tampered.checks.digest.declared);

  const working = golden();
  delete working.digest;
  assert.equal((await call("worldpack_verify", { pack: working })).body.verdict, "unsealed");

  const foreign = (await call("worldpack_verify", { pack: golden(), canonDocument: CUSTOM_CANON })).body;
  assert.equal(foreign.verdict, "canon-mismatch");
  assert.equal(foreign.checks.digest.ok, true);
});

test("worldpack_rules covers exactly the rules the engine can emit", async () => {
  const { body } = await call("worldpack_rules", {});
  assert.deepEqual(body.rules.map((r) => r.ruleId).sort(), Object.keys(RULES).sort());
  for (const rule of body.rules) {
    assert.equal(rule.severity, RULES[rule.ruleId]);
    assert.ok(rule.checks && rule.fix, `${rule.ruleId} needs checks and fix`);
  }

  const one = (await call("worldpack_rules", { ruleId: "canon.layer-claim" })).body;
  assert.equal(one.severity, "blocker");
  assert.equal((await call("worldpack_rules", { ruleId: "canon.made-up" })).isError, true);
});

test("the README tool table lists exactly what tools/list returns", async () => {
  const section = README.split("<!-- tools:start -->")[1]?.split("<!-- tools:end -->")[0];
  assert.ok(section, "README must mark its tool table with <!-- tools:start --> / <!-- tools:end -->");
  const documented = [...section.matchAll(/^\|\s*`([a-z0-9_]+)`\s*\|/gm)].map((m) => m[1]).sort();
  const listed = (await allTools()).map((t) => t.name).sort();
  assert.deepEqual(documented, listed);
  assert.match(section, new RegExp(`\\b${listed.length} tools\\b`));
});
