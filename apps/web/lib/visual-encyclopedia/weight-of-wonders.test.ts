import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { GET } from "../../app/api/lore/weight-of-wonders/route";
import {
  WEIGHT_OF_WONDERS,
  WONDER_BY_SLUG,
  WONDER_ENTRIES,
} from "./weight-of-wonders";
import { weightOfWondersSchema } from "./weight-of-wonders-schema";

test("the experimental collection has six reciprocal boss and place records", () => {
  assert.equal(WEIGHT_OF_WONDERS.collection.canonStatus, "EXPERIMENTAL");
  assert.equal(WONDER_ENTRIES.length, 6);
  assert.equal(
    WONDER_ENTRIES.filter((entry) => entry.kind === "boss").length,
    3,
  );
  assert.equal(
    WONDER_ENTRIES.filter((entry) => entry.kind === "dungeon").length,
    3,
  );
  for (const entry of WONDER_ENTRIES) {
    const related = WONDER_BY_SLUG.get(entry.relatedSlug);
    assert.ok(related);
    assert.equal(related.relatedSlug, entry.slug);
    assert.notEqual(related.kind, entry.kind);
  }
});

test("broken relationships and promoted canon fail validation", () => {
  const broken = structuredClone(WEIGHT_OF_WONDERS);
  broken.entries[0].relatedSlug = broken.entries[0].slug;
  assert.equal(weightOfWondersSchema.safeParse(broken).success, false);
  assert.equal(
    weightOfWondersSchema.safeParse({
      ...WEIGHT_OF_WONDERS,
      collection: {
        ...WEIGHT_OF_WONDERS.collection,
        canonStatus: "LOCKED",
      },
    }).success,
    false,
  );
});

test("public API returns 0, 0, then 6 as both opt-ins become explicit", async () => {
  const read = (query: string) =>
    GET(
      new NextRequest(
        `https://www.arcanea.ai/api/lore/weight-of-wonders${query}`,
      ),
    ).json();
  const [none, proposals, all] = await Promise.all([
    read(""),
    read("?includeProposals=true"),
    read("?includeProposals=true&includeExperimental=true"),
  ]);
  assert.equal(none.total, 0);
  assert.equal(proposals.total, 0);
  assert.equal(all.total, 6);
  assert.equal(all.entries.length, 6);
  assert.equal(all.canonStatus, "EXPERIMENTAL");
  assert.ok(
    all.entries.every(
      (entry: { canonStatus: string }) => entry.canonStatus === "EXPERIMENTAL",
    ),
  );
});

test("public API supports bounded filters and rejects malformed input", async () => {
  const base =
    "https://www.arcanea.ai/api/lore/weight-of-wonders?includeProposals=true&includeExperimental=true";
  const boss = await GET(
    new NextRequest(`${base}&kind=boss&id=wow-b02`),
  ).json();
  assert.equal(boss.total, 1);
  assert.equal(boss.entries[0].id, "wow-b02");
  assert.equal(GET(new NextRequest(`${base}&kind=private-world`)).status, 400);
});
