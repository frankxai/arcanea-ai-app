import assert from "node:assert/strict";
import { test } from "node:test";
import { searchWeightOfWonders } from "../dist/tools/weight-of-wonders.js";

test("retrieval requires both proposal and experimental opt-ins without network", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("Unexpected network access.");
  };
  try {
    for (const input of [
      {},
      { includeProposals: true },
      { includeExperimental: true },
    ]) {
      const result = await searchWeightOfWonders(input);
      assert.equal(JSON.parse(result.content[0].text).total, 0);
      assert.equal(result.isError, undefined);
    }
  } finally {
    globalThis.fetch = original;
  }
});

test("explicit retrieval uses only the fixed public endpoint", async () => {
  const original = globalThis.fetch;
  let requested;
  globalThis.fetch = async (url) => {
    requested = new URL(url);
    return Response.json({
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: "weight-of-wonders",
      canonStatus: "EXPERIMENTAL",
      includeProposals: true,
      includeExperimental: true,
      total: 1,
      entries: [
        {
          id: "wow-b01",
          kind: "boss",
          canonStatus: "EXPERIMENTAL",
        },
      ],
    });
  };
  try {
    const result = await searchWeightOfWonders({
      includeProposals: true,
      includeExperimental: true,
      query: "water & names",
      kind: "boss",
    });
    assert.equal(result.isError, undefined);
    assert.equal(requested.origin, "https://www.arcanea.ai");
    assert.equal(requested.pathname, "/api/lore/weight-of-wonders");
    assert.equal(requested.searchParams.get("query"), "water & names");
    assert.equal(requested.searchParams.get("includeProposals"), "true");
    assert.equal(requested.searchParams.get("includeExperimental"), "true");
  } finally {
    globalThis.fetch = original;
  }
});

test("a response that weakens the experimental trust contract fails closed", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json({
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: "weight-of-wonders",
      canonStatus: "STAGING",
      includeProposals: true,
      includeExperimental: true,
      total: 0,
      entries: [],
    });
  try {
    assert.equal(
      (
        await searchWeightOfWonders({
          includeProposals: true,
          includeExperimental: true,
        })
      ).isError,
      true,
    );
  } finally {
    globalThis.fetch = original;
  }
});
