import assert from "node:assert/strict";
import { test } from "node:test";
import { searchSovereignDepths } from "../dist/tools/sovereign-depths.js";

test("default retrieval excludes proposals and makes no network request", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = () => {
    throw new Error("Unexpected network access.");
  };
  try {
    const result = await searchSovereignDepths({});
    assert.equal(JSON.parse(result.content[0].text).total, 0);
    assert.equal(result.isError, undefined);
  } finally {
    globalThis.fetch = original;
  }
});

test("explicit proposals retain their status and use only the fixed public endpoint", async () => {
  const original = globalThis.fetch;
  let requested;
  globalThis.fetch = async (url) => {
    requested = new URL(url);
    return Response.json({
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: "sovereign-depths",
      canonStatus: "STAGING",
      includeProposals: true,
      includeExperimental: false,
      total: 1,
      entries: [
        {
          id: "b01",
          kind: "boss",
          canonStatus: "STAGING",
          story: { canonStatus: "STAGING" },
        },
      ],
    });
  };
  try {
    const result = await searchSovereignDepths({
      includeProposals: true,
      query: "deep & sea",
      kind: "boss",
    });
    assert.equal(result.isError, undefined);
    assert.equal(JSON.parse(result.content[0].text).canonStatus, "STAGING");
    assert.equal(requested.origin, "https://www.arcanea.ai");
    assert.equal(requested.searchParams.get("query"), "deep & sea");
  } finally {
    globalThis.fetch = original;
  }
});

test("a response claiming locked canon fails closed", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json({
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: "sovereign-depths",
      canonStatus: "LOCKED",
      includeProposals: true,
      includeExperimental: false,
      total: 0,
      entries: [],
    });
  try {
    assert.equal(
      (await searchSovereignDepths({ includeProposals: true })).isError,
      true,
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("unrequested experimental narrative fails closed", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    Response.json({
      schemaVersion: "arcanea.public-collection.v1",
      collectionId: "sovereign-depths",
      canonStatus: "STAGING",
      includeProposals: true,
      includeExperimental: false,
      total: 1,
      entries: [
        {
          id: "b21",
          kind: "boss",
          canonStatus: "STAGING",
          story: { canonStatus: "EXPERIMENTAL" },
        },
      ],
    });
  try {
    assert.equal(
      (await searchSovereignDepths({ includeProposals: true })).isError,
      true,
    );
  } finally {
    globalThis.fetch = original;
  }
});
