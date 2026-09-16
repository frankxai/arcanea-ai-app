import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { GET } from "../../app/api/lore/sovereign-depths/route";
import { SOVEREIGN_DEPTHS, SOVEREIGN_ENTRIES } from "./sovereign-depths";
import {
  sovereignCollectionSchema,
  filterSovereignEntries,
  containsExperimental,
} from "./sovereign-depths-schema";

test("every boss belongs to a real dungeon and every image is independently addressable", () => {
  assert.equal(SOVEREIGN_ENTRIES.length, 36);
  assert.equal(
    new Set(SOVEREIGN_ENTRIES.map((entry) => entry.image.src)).size,
    36,
  );
  assert.equal(SOVEREIGN_DEPTHS.canonStatus, "STAGING");
});

test("broken reverse relationships fail validation", () => {
  const broken = structuredClone(SOVEREIGN_DEPTHS);
  broken.bosses[0].dungeonId = "missing-dungeon";
  assert.equal(sovereignCollectionSchema.safeParse(broken).success, false);
});

test("collection cannot silently promote itself to locked canon", () => {
  assert.equal(
    sovereignCollectionSchema.safeParse({
      ...SOVEREIGN_DEPTHS,
      canonStatus: "LOCKED",
    }).success,
    false,
  );
});

test("search combines every term and preserves kind selection", () => {
  const boss = SOVEREIGN_DEPTHS.bosses[0];
  assert.ok(
    filterSovereignEntries(
      SOVEREIGN_ENTRIES,
      boss.name.toUpperCase(),
      "boss",
    ).some((entry) => entry.id === boss.id),
  );
  assert.ok(
    filterSovereignEntries(SOVEREIGN_ENTRIES, "", "dungeon").every(
      (entry) => entry.kind === "dungeon",
    ),
  );
  assert.equal(
    filterSovereignEntries(
      SOVEREIGN_ENTRIES,
      "a-string-that-no-record-contains",
    ).length,
    0,
  );
});

test("public API defaults to excluding proposals and rejects malformed filters", async () => {
  const response = GET(
    new NextRequest("https://www.arcanea.ai/api/lore/sovereign-depths"),
  );
  const result = await response.json();
  assert.deepEqual(result.entries, []);
  assert.equal(result.includeProposals, false);
  assert.equal(result.canonStatus, "STAGING");
  assert.equal(
    GET(
      new NextRequest(
        "https://www.arcanea.ai/api/lore/sovereign-depths?kind=private-world",
      ),
    ).status,
    400,
  );
});

test("public API opt-in returns the requested boss with source and proposal status", async () => {
  const boss = SOVEREIGN_DEPTHS.bosses[0];
  const response = GET(
    new NextRequest(
      `https://www.arcanea.ai/api/lore/sovereign-depths?includeProposals=true&id=${boss.id}`,
    ),
  );
  const result = await response.json();
  assert.equal(result.total, 1);
  assert.equal(result.entries[0].id, boss.id);
  assert.equal(result.entries[0].kind, "boss");
  assert.equal(result.canonStatus, "STAGING");
  assert.deepEqual(result.source, SOVEREIGN_DEPTHS.source);
});

test("experimental records and nested experimental stories require separate opt-in", async () => {
  const base =
    "https://www.arcanea.ai/api/lore/sovereign-depths?includeProposals=true";
  const safe = await GET(new NextRequest(base)).json();
  assert.ok(safe.total > 0 && safe.total < 36);
  assert.equal(safe.includeExperimental, false);
  assert.ok(
    safe.entries.every(
      (entry: { canonStatus: string; story: { canonStatus: string } }) =>
        entry.canonStatus === "STAGING" &&
        entry.story.canonStatus === "STAGING",
    ),
  );
  const complete = await GET(
    new NextRequest(base + "&includeExperimental=true"),
  ).json();
  assert.equal(complete.total, 36);
  assert.equal(complete.series.length, 4);
  assert.equal(
    complete.series.flatMap((series: { books: unknown[] }) => series.books)
      .length,
    12,
  );
  assert.ok(
    safe.series.every(
      (series: { canonStatus: string; books: { canonStatus: string }[] }) =>
        series.canonStatus === "STAGING" &&
        series.books.every((book) => book.canonStatus === "STAGING"),
    ),
  );
  assert.ok(
    complete.entries.some(
      (entry: { canonStatus: string }) => entry.canonStatus === "EXPERIMENTAL",
    ),
  );
});

test("nested experimental mythology is quarantined even when parent and story are staging", () => {
  const mutated = structuredClone(SOVEREIGN_DEPTHS);
  assert.ok(mutated.dungeons[0].mythology);
  mutated.dungeons[0].mythology.canonStatus = "EXPERIMENTAL";
  const parsed = sovereignCollectionSchema.parse(mutated);
  assert.equal(parsed.dungeons[0].canonStatus, "STAGING");
  assert.equal(parsed.dungeons[0].story.canonStatus, "STAGING");
  assert.equal(containsExperimental(parsed.dungeons[0]), true);
});

test("future nested claim status survives parsing before quarantine", () => {
  const mutated = structuredClone(SOVEREIGN_DEPTHS);
  mutated.bosses[0].encounter.phases[0].claim = {
    canonStatus: "EXPERIMENTAL",
    reason: "Test-only unratified claim",
  };
  const parsed = sovereignCollectionSchema.parse(mutated);
  assert.equal(containsExperimental(parsed.bosses[0]), true);
});
