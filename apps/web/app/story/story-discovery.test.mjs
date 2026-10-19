import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CANON,
  STILLS,
  STORY_DISCOVERY,
  STORY_JSON_LD,
} from "./story-content.ts";

test("original story and application retain distinct identities with resolved graph links", () => {
  const graph = JSON.parse(STORY_JSON_LD)["@graph"];
  const ids = new Set(graph.map((node) => node["@id"]));
  assert.equal(ids.size, graph.length);
  for (const node of graph) {
    for (const relation of ["publisher", "mainEntityOfPage", "mainEntity"]) {
      if (node[relation]) assert.ok(ids.has(node[relation]["@id"]));
    }
  }
  const work = graph.find((node) => node["@type"] === "CreativeWork");
  assert.equal(work.url, "https://www.arcanea.ai/story");
  assert.notEqual(work["@id"], "https://www.arcanea.ai/#organization");
  assert.ok(!graph.some((node) => /Application|Series/.test(node["@type"])));
});

test("discovery derives from displayed story and image records without new commercial or canon claims", () => {
  const work = STORY_DISCOVERY["@graph"].find(
    (node) => node["@type"] === "CreativeWork",
  );
  assert.equal(work.name, CANON.title);
  assert.equal(work.description, CANON.lede);
  assert.equal(work.image.length, STILLS.length);
  STILLS.forEach((still, index) => {
    assert.equal(new URL(work.image[index].url).pathname, still.src);
    assert.equal(work.image[index].caption, still.alt);
  });
  for (const field of [
    "offers",
    "license",
    "datePublished",
    "author",
    "alternateName",
    "aggregateRating",
  ]) {
    assert.ok(
      !Object.hasOwn(work, field),
      `${field} needs separate source evidence`,
    );
  }
});

test("server page emits parseable script-safe JSON-LD without replacing the reading path", async () => {
  const page = await readFile(new URL("./page.tsx", import.meta.url), "utf8");
  assert.deepEqual(JSON.parse(STORY_JSON_LD), STORY_DISCOVERY);
  assert.ok(!STORY_JSON_LD.includes("<"));
  assert.match(page, /type="application\/ld\+json"/);
  assert.match(page, /__html: STORY_JSON_LD/);
  assert.match(page, /canonical: "\/story"/);
  assert.match(page, /href=\{PASSAGE.href\}/);
  assert.match(page, /id="story-read"/);
});
