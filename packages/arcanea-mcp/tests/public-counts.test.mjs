// Public tool counts come from FACTS.mcpTools, and FACTS.mcpTools is what the
// shipped bin actually lists. A hand-typed count is a claim nobody re-measures.
// Run: pnpm --dir packages/arcanea-mcp test:worldpack

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const here = dirname(fileURLToPath(import.meta.url));
const web = resolve(here, "../../../apps/web");
const FACTS = readFileSync(resolve(web, "lib/facts.ts"), "utf8");
const SURFACES = [
  "app/developers/developers-data.ts",
  "app/docs/mcp/tools/page.tsx",
];
const HARDCODED_COUNT = /\b\d{2,3}\s+(?:[A-Z]\w*\s+){0,2}tools\b/;

test("P3-10 FACTS.mcpTools equals the tools/list count of the shipped bin", async () => {
  const declared = Number(FACTS.match(/mcpTools:\s*(\d+)/)?.[1]);
  const client = new Client({ name: "public-counts", version: "1.0.0" });
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [resolve(here, "../dist/cli.js")],
      stderr: "ignore",
    }),
  );
  try {
    let listed = 0;
    let cursor;
    do {
      const page = await client.listTools(cursor ? { cursor } : {});
      listed += page.tools.length;
      cursor = page.nextCursor;
    } while (cursor);
    assert.equal(declared, listed);
  } finally {
    await client.close();
  }
});

test("P3-10 public surfaces derive the MCP tool count instead of hardcoding it", () => {
  for (const surface of SURFACES) {
    const text = readFileSync(resolve(web, surface), "utf8");
    const hit = text
      .split("\n")
      .map((line, i) => [i + 1, line])
      .find(([, line]) => HARDCODED_COUNT.test(line));
    assert.equal(
      hit,
      undefined,
      `${surface}:${hit?.[0]} hardcodes a count: ${hit?.[1]?.trim()}`,
    );
    assert.match(text, /FACTS\.mcpTools/, `${surface} reads FACTS.mcpTools`);
  }
});
