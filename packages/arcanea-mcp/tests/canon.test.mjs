/** Runtime checks grounded in .arcanea/lore/CANON_LOCKED.md, Tier 2 and Tier 6.
 * These assertions read the actual MCP server, never a test-only "actual" table.
 */
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../dist/index.js";

const expected = [
  [1, "Foundation", "174 Hz", "Lyssandria", "Kaelith"],
  [2, "Flow", "285 Hz", "Leyla", "Veloura"],
  [3, "Fire", "396 Hz", "Draconia", "Draconis"],
  [4, "Heart", "417 Hz", "Maylinn", "Laeylinn"],
  [5, "Voice", "528 Hz", "Alera", "Otome"],
  [6, "Sight", "639 Hz", "Lyria", "Yumiko"],
  [7, "Crown", "741 Hz", "Aiyami", "Sol"],
  [8, "Starweave", "852 Hz", "Elara", "Vaelith"],
  [9, "Unity", "963 Hz", "Ino", "Kyuro"],
  [10, "Source", "1111 Hz", "Shinkami", "Source"],
];
const houses = [
  "Lumina",
  "Nero",
  "Pyros",
  "Aqualis",
  "Terra",
  "Ventus",
  "Synthesis",
];
const server = createServer();
const client = new Client({ name: "runtime-canon-test", version: "1.0.0" });
let gates, tools, resources;

before(async () => {
  const [left, right] = InMemoryTransport.createLinkedPair();
  await server.connect(right);
  await client.connect(left);
  ({ tools } = await client.listTools());
  ({ resources } = await client.listResources());
  ({ gates } = await read("arcanea://gates"));
});
after(async () => {
  await client.close();
  await server.close();
});

async function read(uri) {
  const result = await client.readResource({ uri });
  const content = result.contents.find(
    (entry) => entry.uri === uri && "text" in entry,
  );
  assert.ok(content, uri);
  return JSON.parse(content.text);
}
async function call(name, args) {
  const result = await client.callTool({ name, arguments: args });
  assert.notEqual(result.isError, true, name);
  const content = result.content.find((entry) => entry.type === "text");
  assert.ok(content, name);
  return JSON.parse(content.text);
}
function schema(name, field) {
  return tools.find((tool) => tool.name === name).inputSchema.properties[field];
}

test("the resource contains exactly ten ordered gates", () => {
  assert.deepEqual(
    gates.map((gate) => gate.gate),
    expected.map((row) => row[0]),
  );
});
test("resource guardians match the locked names", () => {
  assert.deepEqual(
    gates.map((gate) => gate.guardian),
    expected.map((row) => row[3]),
  );
});
test("resource Godbeasts match their locked gate associations", () => {
  assert.deepEqual(
    gates.map((gate) => gate.veltara),
    expected.map((row) => row[4]),
  );
});
test("resource frequencies are the exact locked values", () => {
  assert.deepEqual(
    gates.map((gate) => gate.frequencyBand),
    expected.map((row) => row[2]),
  );
});
test("resource gate domains match the locked order", () => {
  assert.deepEqual(
    gates.map((gate) => gate.domain),
    expected.map((row) => row[1]),
  );
});
test("the Source Gate exposes Shinkami's companion", () => {
  assert.equal(gates.at(-1).veltara, "Source");
});
test("the element resource represents Void and Spirit as two aspects", async () => {
  assert.deepEqual((await read("arcanea://elements")).elements, [
    "Fire",
    "Water",
    "Earth",
    "Wind",
    "Void",
    "Spirit",
  ]);
});
test("the character input schema agrees with the advertised element choices", async () => {
  assert.deepEqual(
    schema("generate_character", "primaryElement").enum,
    (await read("arcanea://elements")).elements,
  );
});
test("the resource names all seven Academy houses", async () => {
  assert.deepEqual((await read("arcanea://houses")).houses, houses);
});
test("the generator accepts and preserves each declared house", async () => {
  for (const house of houses) {
    const character = await call("generate_character", {
      house,
      gatesOpen: 1,
      sessionId: "canon-houses",
    });
    assert.equal(character.house, house);
  }
});
test("the companion resource contains the registered runtime profiles", async () => {
  const profiles = await read("arcanea://luminors");
  assert.ok(Object.keys(profiles).length > 0);
  for (const profile of Object.values(profiles))
    assert.equal(typeof profile.name, "string");
});
test("companion invocation choices match the actual companion resource", async () => {
  assert.deepEqual(
    Object.keys(await read("arcanea://luminors")).sort(),
    [...schema("invoke_luminor", "luminor").enum].sort(),
  );
});
test("tool discovery exposes the actual unique generator tools", () => {
  const names = tools.map((tool) => tool.name);
  assert.equal(names.length, 55);
  assert.equal(new Set(names).size, names.length);
  for (const name of [
    "generate_character",
    "generate_magic",
    "generate_location",
    "generate_creature",
    "generate_artifact",
    "generate_name",
    "generate_story_prompt",
  ])
    assert.ok(names.includes(name), name);
});
test("resource discovery exposes five actual unique reference resources", () => {
  assert.deepEqual(
    resources.map((resource) => resource.uri).sort(),
    [
      "arcanea://luminors",
      "arcanea://bestiary",
      "arcanea://gates",
      "arcanea://elements",
      "arcanea://houses",
    ].sort(),
  );
});
test("magic and story generators preserve every guardian and Godbeast pairing", async () => {
  for (const [gate, domain, , guardian, godbeast] of expected) {
    for (const [name, args] of [
      ["generate_magic", { gateLevel: gate, element: "Spirit" }],
      ["generate_story_prompt", { gate }],
    ]) {
      const output = await call(name, args);
      assert.equal(output.gateName, domain);
      assert.equal(output.guardian, guardian);
      assert.equal(output.godbeast, godbeast, `${name} gate ${gate}`);
    }
  }
});
test("character forms distinguish locked facts, draft suggestions and unknowns", async () => {
  for (const [gate, , , guardian, godbeast] of expected) {
    const character = await call("generate_character", {
      gatesOpen: gate,
      sessionId: "canon-forms",
    });
    assert.equal(character.patronGuardian, guardian);
    assert.equal(character.godbeast.name, godbeast);
    assert.match(character._note, /draft/i);
    if (gate === 2 || gate === 4) {
      assert.equal(
        character.godbeast.form,
        gate === 2 ? "Phoenix-Serpent" : "Worldtree Deer",
      );
      assert.equal(character.godbeast.formStatus, "Locked");
    } else if (gate === 10) {
      assert.equal(character.godbeast.form, null);
      assert.equal(character.godbeast.formStatus, "Unspecified");
    } else {
      assert.equal(character.godbeast.formStatus, "Draft");
    }
  }
});
test("fractional gate inputs are rejected by each public generator schema", async () => {
  for (const [name, args] of [
    ["generate_character", { gatesOpen: 2.5 }],
    ["generate_magic", { gateLevel: 2.5, element: "Fire" }],
    ["generate_story_prompt", { gate: 2.5 }],
  ]) {
    assert.equal(
      (await client.callTool({ name, arguments: args })).isError,
      true,
    );
    const field =
      name === "generate_character"
        ? "gatesOpen"
        : name === "generate_magic"
          ? "gateLevel"
          : "gate";
    assert.equal(schema(name, field).type, "integer");
  }
});
