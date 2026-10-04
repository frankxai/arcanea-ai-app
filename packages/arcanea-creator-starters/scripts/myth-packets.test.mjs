import test from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import {
  compilePacket,
  digest,
  packetMarkdown,
  validateAtlas,
} from "../src/myth-packets.mjs";
import { run } from "./compile-myth-packet.mjs";
import { artifacts } from "./build.mjs";

const atlas = JSON.parse(
  await readFile(new URL("../myth-atlas.v1.json", import.meta.url), "utf8"),
);
const brief = JSON.parse(
  await readFile(
    new URL("../myth-brief.example.json", import.meta.url),
    "utf8",
  ),
);
const cli = fileURLToPath(
  new URL("./compile-myth-packet.mjs", import.meta.url),
);
const example = fileURLToPath(
  new URL("../myth-brief.example.json", import.meta.url),
);
const clone = (value) => structuredClone(value);

test("budget counts all attempts and reviews, with explicit currency and exclusions", () => {
  const packet = compilePacket(brief, atlas);
  assert.equal(packet.budget.currency, "EUR");
  assert.equal(packet.budget.totalCostMicros, 49_000_000);
  assert.equal(packet.budget.remainingMicros, 101_000_000);
  assert.equal(packet.budget.withinBudget, true);
  assert.equal(
    packet.budget.estimates.reduce((n, item) => n + item.plannedAttempts, 0),
    14,
  );
  assert.equal(
    packet.budget.estimates.reduce((n, item) => n + item.reviewMinutes, 0),
    90,
  );
  assert.match(packet.budget.assumptions.join(" "), /not verified/);
  assert.match(packet.budget.assumptions.join(" "), /excluded/);
});

test("budget threshold is inclusive; an overrun remains visible and does not approve execution", () => {
  const exact = { ...brief, maxProductionCostMicros: 49_000_000 };
  assert.equal(compilePacket(exact, atlas).budget.withinBudget, true);
  const over = compilePacket(
    { ...exact, maxProductionCostMicros: 48_999_999 },
    atlas,
  );
  assert.equal(over.budget.withinBudget, false);
  assert.equal(over.budget.remainingMicros, -1);
  assert.equal(over.review.releaseEligible, false);
});

test("fractional review micros round up per line without floating-point drift", () => {
  const b = clone(brief);
  b.reviewRateMicrosPerHour = 1;
  b.deliverables = [
    {
      id: "one",
      format: "text",
      acceptedUnits: 1,
      attemptsPerUnit: 1,
      unitCostMicros: 0,
      reviewMinutesPerAttempt: 1,
    },
  ];
  assert.equal(compilePacket(b, atlas).budget.totalCostMicros, 1);
});

test("rejects unknown, duplicate and missing selected myths", () => {
  for (const selectedMyths of [
    [],
    ["missing"],
    ["lernaean-hydra", "lernaean-hydra"],
    Array(9).fill("sirens"),
  ]) {
    assert.throws(
      () => compilePacket({ ...brief, selectedMyths }, atlas),
      /Invalid/,
    );
  }
});

test("rejects undeclared fields and caller-supplied approval state", () => {
  for (const extra of [
    { commercialClearance: "cleared" },
    { canonStatus: "LOCKED" },
    { providerKey: "not-a-key" },
  ]) {
    assert.throws(() => compilePacket({ ...brief, ...extra }, atlas), /fields/);
  }
  const a = clone(atlas);
  a.records[0].source.editionRights = "cleared";
  assert.throws(() => compilePacket(brief, a), /edition rights/);
  const b = clone(brief);
  delete b.setting;
  assert.throws(() => compilePacket(b, atlas), /fields/);
});

test("bounds numeric inputs, validates duplicates and rejects computed overflow", () => {
  for (const bad of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER, "1"]) {
    const b = clone(brief);
    b.deliverables[0].unitCostMicros = bad;
    assert.throws(() => compilePacket(b, atlas), /unit cost/);
  }
  for (const [field, value] of [
    ["acceptedUnits", 0],
    ["acceptedUnits", 1001],
    ["attemptsPerUnit", 21],
    ["reviewMinutesPerAttempt", 1441],
  ]) {
    const b = clone(brief);
    b.deliverables[0][field] = value;
    assert.throws(() => compilePacket(b, atlas), /Invalid/);
  }
  const duplicate = clone(brief);
  duplicate.deliverables.push(duplicate.deliverables[0]);
  assert.throws(() => compilePacket(duplicate, atlas), /duplicate/);
  const overflow = clone(brief);
  Object.assign(overflow.deliverables[0], {
    acceptedUnits: 1000,
    attemptsPerUnit: 20,
    unitCostMicros: 1_000_000_000_000,
  });
  assert.throws(() => compilePacket(overflow, atlas), /overflow/);
});

test("atlas rejects duplicate ids, malformed references and unsupported evidence states", () => {
  assert.equal(validateAtlas(atlas).records.length, 12);
  const duplicate = clone(atlas);
  duplicate.records.push(duplicate.records[0]);
  assert.throws(() => validateAtlas(duplicate), /duplicate/);
  for (const url of [
    "http://example.com",
    "javascript:alert(1)",
    "https://user:pass@example.com",
    "not a URL",
  ]) {
    const a = clone(atlas);
    a.records[0].source.url = url;
    assert.throws(() => validateAtlas(a), /source URL/);
  }
  const a = clone(atlas);
  a.records[0].source.evidenceStatus = "historically-proven";
  assert.throws(() => validateAtlas(a), /evidence/);
});

test("source uncertainty survives compilation; proposals are separate and clearance stays unresolved", () => {
  const p = compilePacket(brief, atlas);
  assert.equal(
    p.research.find((r) => r.id === "sirens").source.evidenceStatus,
    "reading-pending",
  );
  assert.equal(
    p.research.find((r) => r.id === "scylla-charybdis").geography.status,
    "identification-unresolved",
  );
  assert.ok(p.creativeProposals.every((r) => r.status === "proposal"));
  assert.ok(
    p.creativeProposals.every((r) =>
      p.research.some(
        (s) => s.id === r.mythId && s.sourceDigest === r.sourceDigest,
      ),
    ),
  );
  assert.equal(p.review.stage, "research");
  assert.equal(p.review.canonStatus, "unreviewed");
  assert.equal(p.review.commercialClearance, "unresolved");
  assert.equal(p.review.releaseEligible, false);
});

test("living-tradition selection retains its identity, consultation and attribution questions", () => {
  const p = compilePacket(
    { ...brief, selectedMyths: ["trentren-caicai"] },
    atlas,
  );
  assert.equal(p.research[0].tradition, "Mapuche");
  assert.equal(p.review.livingTraditionReviewRequired, true);
  assert.match(
    p.review.questions.map((q) => q.question).join(" "),
    /Mapuche knowledge holders/,
  );
  assert.equal(p.review.releaseEligible, false);
});

test("fingerprints ignore object key order but detect brief, source and witness changes", () => {
  const p = compilePacket(brief, atlas);
  const reordered = Object.fromEntries(Object.entries(brief).reverse());
  assert.equal(compilePacket(reordered, atlas).packetId, p.packetId);
  assert.equal(compilePacket(brief, atlas).packetId, p.packetId);
  assert.notEqual(
    compilePacket({ ...brief, setting: "Another setting" }, atlas).packetId,
    p.packetId,
  );
  const a = clone(atlas);
  a.records[0].source.anchor = "Different witness anchor";
  const changed = compilePacket(brief, a);
  assert.notEqual(changed.provenance.atlasDigest, p.provenance.atlasDigest);
  assert.notEqual(changed.research[0].sourceDigest, p.research[0].sourceDigest);
  assert.notEqual(changed.packetId, p.packetId);
  const { packetId, ...body } = p;
  assert.equal(packetId, `mp-${digest(body)}`);
});

test("compiler does not mutate caller inputs or leak later edits into packets", () => {
  const b = clone(brief),
    a = clone(atlas);
  const originals = JSON.stringify([b, a]);
  const p = compilePacket(b, a);
  assert.equal(JSON.stringify([b, a]), originals);
  a.records[0].source.anchor = "edited after compile";
  b.deliverables[0].unitCostMicros = 99;
  assert.equal(p.research[0].source.anchor, "2.5.2");
  assert.equal(p.budget.estimates[0].unitCostMicros, 500_000);
});

test("Markdown escapes active HTML, image links and table separators in creator text", () => {
  const p = compilePacket(
    {
      ...brief,
      title: '<img src=x onerror="alert(1)">',
      setting: "![image](https://example.com)|table",
    },
    atlas,
  );
  const md = packetMarkdown(p);
  assert.ok(!md.includes("<img"));
  assert.ok(!md.includes("![image]("));
  assert.match(md, /&lt;img/);
  assert.ok(md.includes("\\|table"));
  assert.match(md, /Commercial clearance unresolved/);
});

test("existing export pipeline emits reproducible packet and source metadata", async () => {
  const files = await artifacts();
  assert.deepEqual(JSON.parse(files.get("myth-atlas.v1.json")), atlas);
  assert.deepEqual(JSON.parse(files.get("myth-brief.example.json")), brief);
  assert.deepEqual(
    JSON.parse(files.get("myth-packet.example.json")),
    compilePacket(brief, atlas),
  );
  assert.equal(
    files.get("myth-packet.example.md"),
    packetMarkdown(compilePacket(brief, atlas)),
  );
});

test("CLI validates flags and emits the same packet in JSON and Markdown", async () => {
  const p = compilePacket(brief, atlas);
  assert.deepEqual(JSON.parse(await run(["--brief", example])), p);
  assert.equal(
    await run(["--brief", example, "--format", "md"]),
    packetMarkdown(p),
  );
  for (const args of [
    [],
    ["--unknown", "x"],
    ["--brief"],
    ["--brief", example, "--brief", example],
    ["--brief", example, "--format", "html"],
  ]) {
    await assert.rejects(run(args));
  }
});

test("CLI failures have nonzero exit status, bounded input and no partial success output", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "arcanea-myth-test-"));
  try {
    for (const [name, bytes] of [
      ["bad.json", "{"],
      ["oversize.json", " ".repeat(262145)],
      [
        "unknown.json",
        JSON.stringify({ ...brief, selectedMyths: ["missing"] }),
      ],
    ]) {
      const filename = path.join(dir, name);
      await writeFile(filename, bytes);
      const result = spawnSync(process.execPath, [cli, "--brief", filename], {
        encoding: "utf8",
      });
      assert.equal(result.status, 1, name);
      assert.equal(result.stdout, "", name);
      assert.ok(result.stderr.trim(), name);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test(
  "CLI rejects a FIFO input without waiting for a writer",
  { skip: process.platform === "win32" },
  async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "arcanea-myth-fifo-test-"));
    try {
      const filename = path.join(dir, "input.json");
      const made = spawnSync("mkfifo", [filename], { encoding: "utf8" });
      assert.equal(made.status, 0, made.stderr);
      const result = spawnSync(process.execPath, [cli, "--brief", filename], {
        encoding: "utf8",
        timeout: 2000,
      });
      assert.equal(result.error, undefined);
      assert.equal(result.status, 1);
      assert.equal(result.stdout, "");
      assert.match(result.stderr, /regular JSON file/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  },
);
