import assert from "node:assert/strict";
import { test } from "node:test";
import observed from "./fixtures/reader-tools.json";
import {
  CANON_SOURCE_URL,
  READER_CLIENTS,
  READER_TOOLS,
  READER_URL,
} from "../reader-catalog";

test("published tool arguments and examples match the observed remote schema", () => {
  assert.equal(observed.endpoint, READER_URL);
  assert.equal(observed.version, "0.5.1");
  assert.deepEqual(
    READER_TOOLS.map((tool) => tool.name).sort(),
    observed.tools.map((tool) => tool.name).sort(),
  );
  for (const tool of READER_TOOLS) {
    const remote = observed.tools.find((item) => item.name === tool.name)!;
    assert.deepEqual(
      tool.params.map((param) => param.name).sort(),
      Object.keys(remote.inputSchema.properties).sort(),
    );
    const required = remote.inputSchema.required ?? [];
    assert.deepEqual(
      tool.params
        .filter((param) => param.required)
        .map((param) => param.name)
        .sort(),
      [...required].sort(),
    );
    for (const key of required)
      assert.equal(
        typeof (tool.example as Record<string, unknown>)[key],
        "string",
        `${tool.name}.${key}`,
      );
  }
});

test("Desktop remote connectors are distinct from Code, project TOML and project JSON", () => {
  const client = (name: string) =>
    READER_CLIENTS.find((entry) => entry.name === name)!;
  const desktop = client("Claude Desktop");
  assert.equal(desktop.body, READER_URL);
  assert.match(desktop.location, /Connectors/);
  assert.match(desktop.guide, /^https:\/\/support\.claude\.com\//);
  assert.equal(
    client("Claude Code").body,
    `claude mcp add --transport http --scope local arcanea ${READER_URL}`,
  );
  assert.equal(
    client("Codex").body,
    `[mcp_servers.arcanea]\nurl = "${READER_URL}"`,
  );
  assert.match(client("Codex").location, /trusted project/);
  assert.deepEqual(JSON.parse(client("Cursor").body), {
    mcpServers: { arcanea: { url: READER_URL } },
  });
  assert.equal(new Set(READER_CLIENTS.map((entry) => entry.copyLabel)).size, 4);
});

test("canonical source is the existing app lore at a full immutable commit", () => {
  assert.match(
    CANON_SOURCE_URL,
    /^https:\/\/github\.com\/frankxai\/arcanea-ai-app\/blob\/[a-f0-9]{40}\/\.arcanea\/lore\/CANON_LOCKED\.md$/,
  );
});
