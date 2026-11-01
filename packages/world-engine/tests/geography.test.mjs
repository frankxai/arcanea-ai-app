import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  openRealmGraph,
  realmContinuity,
  realmImpact,
} from "../../world-sdk/src/realm-graph.mjs";
import { projectAtlasStaging, atlasAtMoment } from "../dist/index.js";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const overlay = JSON.parse(
  await readFile(new URL("../fixtures/atlas-staging.json", import.meta.url)),
);
const project = (input = overlay) => projectAtlasStaging(input);

test("geography uses the existing verified graph and source, without promoting canon", async () => {
  const commit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  const graph = await openRealmGraph(root, commit, overlay);
  assert.deepEqual(project(graph.staging), project());
  assert.equal(graph.canonPromotionAllowed, false);
  assert.equal(graph.locked.entities.length, 62);
  assert.equal(graph.locked.assertions.length, 97);
  const source = await readFile(
    new URL("../fixtures/atlas-source.md", import.meta.url),
  );
  for (const fact of overlay.assertions)
    assert.equal(
      fact.source.sha256,
      createHash("sha256").update(source).digest("hex"),
    );
  const continuity = realmContinuity(
    graph,
    "character:fixture-cartographer",
    "scene:fixture-after",
  );
  assert.equal(
    continuity.candidateFacts.filter((f) => f.predicate === "location")[0]
      .value,
    "place:fixture-east-port",
  );
  const impact = realmImpact(graph, "geo:west:after");
  assert.deepEqual(impact.affected.map((item) => item.id).sort(), [
    "scene:fixture-after",
    "work:atlas-fixture",
  ]);
});

test("half-open revisions change boundaries and linked locations without rewriting history", () => {
  const atlas = project();
  const before = atlasAtMoment(atlas, 49);
  const after = atlasAtMoment(atlas, 50);
  const western = (s) =>
    s.features.find((f) => f.entityId === "place:fixture-west");
  assert.notDeepEqual(western(before).geometry, western(after).geometry);
  assert.notEqual(western(before).assertionId, western(after).assertionId);
  assert.equal(
    before.presences.find(
      (p) => p.entityId === "character:fixture-cartographer",
    ).placeId,
    "place:fixture-west-port",
  );
  assert.equal(
    after.presences.find((p) => p.entityId === "character:fixture-cartographer")
      .placeId,
    "place:fixture-east-port",
  );
  assert.equal(before.presences.filter((p) => p.type === "event").length, 0);
  assert.equal(after.presences.filter((p) => p.type === "event").length, 1);
  assert.equal(
    atlasAtMoment(atlas, 51).presences.filter((p) => p.type === "event").length,
    0,
  );
  assert.deepEqual(atlasAtMoment(atlas, 49), before);
});

test("malformed, overlapping, dangling and cross-world geography refuses", () => {
  for (const mutate of [
    (x) => {
      x.assertions[0].status = "LOCKED";
    },
    (x) => {
      x.assertions[0].value.geometry.coordinates[0][1] = NaN;
    },
    (x) => {
      x.assertions[0].value.extra = true;
    },
    (x) => {
      x.assertions[0].validity.to = 0;
    },
    (x) => {
      x.assertions[1].validity.from = 49;
    },
    (x) => {
      x.assertions[0].value.parentId = "place:missing";
    },
    (x) => {
      x.assertions[0].value.worldId = "place:other-world";
    },
    (x) => {
      x.assertions.find((a) => a.predicate === "location").value =
        "place:missing";
    },
    (x) => {
      x.assertions[0].value.geometry.coordinates.pop();
    },
    (x) => {
      x.assertions[0].value.geometry.coordinates = [
        [0, 0],
        [100, 100],
        [0, 100],
        [100, 0],
        [0, 0],
      ];
    },
    (x) => {
      x.assertions[0].source.sha256 = "unverified";
    },
    (x) => {
      x.assertions[0].validity.timelineId = "timeline:other";
    },
    (x) => {
      x.assertions.find(
        (a) => a.subjectId === "place:fixture-east",
      ).validity.to = 40;
    },
  ]) {
    const input = structuredClone(overlay);
    mutate(input);
    assert.throws(() => project(input));
  }
});

test("timeline gaps, containment failures and unavailable parents refuse", () => {
  const input = structuredClone(overlay);
  input.assertions[1].validity.from = 51;
  assert.throws(() => project(input), /gap|parent|coverage/i);
  const outside = structuredClone(overlay);
  outside.assertions.find(
    (a) => a.subjectId === "place:fixture-west-port",
  ).value.geometry.coordinates = [950, 620];
  assert.throws(() => project(outside), /contain/i);
});

test("moments are bounded integers and snapshots cannot mutate the source", () => {
  const atlas = project();
  for (const moment of [-1, 101, NaN, 0.5])
    assert.throws(() => atlasAtMoment(atlas, moment));
  const snapshot = atlasAtMoment(atlas, 50);
  snapshot.features[0].label = "changed";
  assert.notEqual(atlasAtMoment(atlas, 50).features[0].label, "changed");
});
