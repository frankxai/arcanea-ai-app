import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join, resolve, sep, parse } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/index.js";
import { searchLibrary } from "../dist/tools/library-search.js";

const fixture = mkdtempSync(join(tmpdir(), "arcanea-library-test-"));
const corpus = join(fixture, "corpus");
const previous = process.env.ARCANEA_LIBRARY_DIR;
const server = createServer();
const client = new Client({ name: "library-search-proof", version: "1.0.0" });
const decode = (result) =>
  JSON.parse(result.content.find((item) => item.type === "text").text);
function write(path, content) {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, content);
}

before(async () => {
  write(
    join(corpus, "river-notes", "a.md"),
    "# River notes\r\n\r\nRiver memory river.\r\n\r\nLiteral [portal] appears here.\r\n",
  );
  write(
    join(corpus, "river-notes", "b.md"),
    "# Second text\n\nMemory alone survives.\n",
  );
  write(
    join(corpus, "river-notes", "c.md"),
    "# Third text\n\nMemory alone survives.\n",
  );
  process.env.ARCANEA_LIBRARY_DIR = corpus;
  const [left, right] = InMemoryTransport.createLinkedPair();
  await server.connect(right);
  await client.connect(left);
});
after(async () => {
  await client.close();
  await server.close();
  if (previous === undefined) delete process.env.ARCANEA_LIBRARY_DIR;
  else process.env.ARCANEA_LIBRARY_DIR = previous;
  assert.ok(resolve(fixture).startsWith(resolve(tmpdir()) + sep));
  rmSync(fixture, { recursive: true, force: true });
});

test("actual MCP discovery advertises configured read-only search", async () => {
  const { tools } = await client.listTools();
  const tool = tools.find((entry) => entry.name === "search_library");
  assert.ok(tool);
  assert.equal(tool.annotations.readOnlyHint, true);
  assert.match(tool.description, /ARCANEA_LIBRARY_DIR/);
  assert.equal(tool.inputSchema.properties.limit.type, "integer");
});
test("real MCP search returns known excerpts from an isolated corpus", async () => {
  const result = await client.callTool({
    name: "search_library",
    arguments: { query: "river memory" },
  });
  assert.notEqual(result.isError, true);
  const data = decode(result);
  assert.equal(data.totalMatches, 3);
  assert.equal(data.returned, 3);
  assert.equal(data.results[0].file, "river-notes/a.md");
  assert.equal(data.results[0].title, "River notes");
  assert.equal(data.results[0].collection, "River Notes");
  assert.equal(data.results[0].excerpt, "River memory river.");
  assert.equal(data.results[0].relevanceScore, 4);
  assert.equal(data.scan.incomplete, false);
  assert.ok(!JSON.stringify(data).includes(fixture));
});
test("a matching later keyword works even when the first is absent", async () => {
  const data = decode(await searchLibrary("absent memory"));
  assert.equal(data.totalMatches, 3);
  assert.ok(
    data.results.every((r) => r.excerpt.toLowerCase().includes("memory")),
  );
});
test("duplicate terms do not inflate scores and ties sort by relative path", async () => {
  const first = decode(await searchLibrary("memory"));
  const repeated = decode(await searchLibrary("Memory memory MEMORY"));
  assert.deepEqual(repeated.results, first.results);
  assert.deepEqual(
    first.results.map((r) => r.file),
    ["river-notes/a.md", "river-notes/b.md", "river-notes/c.md"],
  );
});
test("metacharacters match literally and limits retain total matches", async () => {
  const literal = decode(await searchLibrary("[portal]"));
  assert.equal(literal.totalMatches, 1);
  assert.match(literal.results[0].excerpt, /\[portal\]/);
  const limited = decode(await searchLibrary("memory", 1));
  assert.equal(limited.returned, 1);
  assert.equal(limited.totalMatches, 3);
});
test("invalid input is rejected by the SDK and direct helper", async () => {
  for (const args of [
    { query: "river", limit: 1.5 },
    { query: "x" },
    { query: "x".repeat(513) },
  ])
    assert.equal(
      (await client.callTool({ name: "search_library", arguments: args }))
        .isError,
      true,
    );
  for (const limit of [0, -1, 21, NaN, Infinity])
    assert.equal((await searchLibrary("river", limit)).isError, true);
  assert.equal((await searchLibrary("a b c")).isError, true);
});
test("unconfigured search does not infer a repository or parent library", async () => {
  delete process.env.ARCANEA_LIBRARY_DIR;
  try {
    const result = await client.callTool({
      name: "search_library",
      arguments: { query: "river" },
    });
    assert.equal(result.isError, true);
    assert.match(decode(result).error, /not configured/);
    assert.deepEqual(decode(result).results, []);
    assert.ok(!JSON.stringify(result).includes(fixture));
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});
test("relative, missing, file, home and drive-root sources fail explicitly", async () => {
  try {
    for (const directory of [
      "relative-library",
      join(fixture, "missing"),
      join(corpus, "river-notes/a.md"),
      homedir(),
      parse(fixture).root,
    ]) {
      process.env.ARCANEA_LIBRARY_DIR = directory;
      const result = await searchLibrary("river");
      assert.equal(result.isError, true, directory);
      assert.ok(!JSON.stringify(result).includes(fixture));
    }
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});
test("hidden paths, README and outside junctions are excluded", async () => {
  const scoped = join(fixture, "filter-corpus");
  write(join(scoped, "allowed.md"), "# Allowed\n\nUniqueprobe");
  write(join(scoped, ".hidden", "private.md"), "Uniqueprobe");
  write(join(scoped, "README.md"), "Uniqueprobe");
  write(join(fixture, "outside", "private.md"), "Uniqueprobe");
  symlinkSync(
    join(fixture, "outside"),
    join(scoped, "outside-link"),
    process.platform === "win32" ? "junction" : "dir",
  );
  process.env.ARCANEA_LIBRARY_DIR = scoped;
  try {
    const data = decode(await searchLibrary("uniqueprobe"));
    assert.equal(data.totalMatches, 1);
    assert.equal(data.results[0].file, "allowed.md");
    assert.equal(data.scan.filesRead, 1);
    assert.ok(data.scan.skipped >= 2);
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});
test("oversized files and excessive depth report a partial scan", async () => {
  const scoped = join(fixture, "bounded-corpus");
  write(join(scoped, "large.md"), "boundprobe ".repeat(53000));
  write(join(scoped, "small.md"), "boundprobe");
  write(
    join(
      scoped,
      ...Array.from({ length: 9 }, (_, i) => "level" + i),
      "deep.md",
    ),
    "boundprobe",
  );
  process.env.ARCANEA_LIBRARY_DIR = scoped;
  try {
    const data = decode(await searchLibrary("boundprobe"));
    assert.equal(data.totalMatches, 1);
    assert.equal(data.results[0].file, "small.md");
    assert.equal(data.scan.incomplete, true);
    assert.match(data.message, /incomplete/);
    assert.ok(data.scan.bytesRead <= 512 * 1024);
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});
test("empty configured folders produce a successful zero-result search", async () => {
  const empty = join(fixture, "empty");
  mkdirSync(empty);
  process.env.ARCANEA_LIBRARY_DIR = empty;
  try {
    const result = await searchLibrary("river");
    assert.notEqual(result.isError, true);
    assert.equal(decode(result).totalMatches, 0);
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});

test("a long paragraph excerpt retains the matched term", async () => {
  const scoped = join(fixture, "long-paragraph");
  write(
    join(scoped, "long.md"),
    "# Long passage\n\n" +
      "ordinary ".repeat(150) +
      "visibleprobe " +
      "ordinary ".repeat(150),
  );
  process.env.ARCANEA_LIBRARY_DIR = scoped;
  try {
    const data = decode(await searchLibrary("visibleprobe"));
    assert.equal(data.returned, 1);
    assert.match(data.results[0].excerpt, /visibleprobe/);
    assert.ok(data.results[0].excerpt.length <= 306);
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});

test("corpus byte and file budgets remain bounded and report truncation", async () => {
  const bytesCorpus = join(fixture, "byte-budget");
  for (let index = 0; index < 17; index++)
    write(
      join(bytesCorpus, index.toString().padStart(2, "0") + ".md"),
      "budgetprobe " + "x".repeat(512 * 1024 - 12),
    );
  process.env.ARCANEA_LIBRARY_DIR = bytesCorpus;
  try {
    const data = decode(await searchLibrary("budgetprobe"));
    assert.equal(data.scan.filesRead, 16);
    assert.equal(data.scan.bytesRead, 8 * 1024 * 1024);
    assert.equal(data.scan.incomplete, true);
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
  const filesCorpus = join(fixture, "file-budget");
  for (let index = 0; index < 1001; index++)
    write(
      join(filesCorpus, index.toString().padStart(4, "0") + ".md"),
      "fileprobe",
    );
  process.env.ARCANEA_LIBRARY_DIR = filesCorpus;
  try {
    const data = decode(await searchLibrary("fileprobe"));
    assert.equal(data.scan.filesRead, 1000);
    assert.equal(data.totalMatches, 1000);
    assert.equal(data.scan.incomplete, true);
  } finally {
    process.env.ARCANEA_LIBRARY_DIR = corpus;
  }
});
