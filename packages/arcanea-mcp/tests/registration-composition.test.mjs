import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/index.js";

const server = createServer();
const client = new Client({
  name: "registration-composition",
  version: "1.0.0",
});

before(async () => {
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  await client.connect(clientTransport);
});

after(async () => {
  await client.close();
  await server.close();
});

test("every advertised resource can be read through the public server", async () => {
  const { resources } = await client.listResources();
  assert.ok(resources.length > 0);
  for (const resource of resources) {
    const result = await client.readResource({ uri: resource.uri });
    assert.ok(result.contents.length > 0, resource.uri);
    assert.ok(result.contents.some((content) => content.uri === resource.uri));
  }
});

test("the composed worldbuilding prompt retains the creator's focus", async () => {
  const focus = "a city that remembers the names of its rivers";
  const result = await client.getPrompt({
    name: "worldbuild_session",
    arguments: { focus, element: "Water" },
  });
  assert.ok(
    result.messages.some(
      ({ content }) => content.type === "text" && content.text.includes(focus),
    ),
  );
});

test("the composed planning tool preserves the seed and enforces its schema", async () => {
  const idea = "A city whose bells remember forgotten rivers";
  const accepted = await client.callTool({
    name: "plan_world",
    arguments: { idea },
  });
  assert.notEqual(accepted.isError, true);
  const content = accepted.content.find((entry) => entry.type === "text");
  assert.ok(content);
  assert.equal(JSON.parse(content.text).seed, idea);

  const rejected = await client.callTool({
    name: "plan_world",
    arguments: { idea: "" },
  });
  assert.equal(rejected.isError, true);
});
