import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  realpathSync,
  rmSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import * as sdk from "../src/index.mjs";

const repo = fileURLToPath(new URL("../../../", import.meta.url));
const commit = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: repo,
  encoding: "utf8",
}).trim();
const fixture = JSON.parse(
  readFileSync(
    new URL("./fixtures/realm-graph.staging.json", import.meta.url),
    "utf8",
  ),
);
const clone = (value) => structuredClone(value);
const open = (overlay = clone(fixture)) =>
  sdk.openRealmGraph(repo, commit, overlay);

test("current locked canon supplies missing creative rules without changing Gate IDs", async () => {
  const graph = await open();
  const facts = new Map(graph.locked.assertions.map((a) => [a.id, a.value]));
  assert.equal(
    facts.get("fact:world-rule:element:fire:domain"),
    "Energy, transformation",
  );
  assert.equal(
    facts.get("fact:world-rule:element:void-spirit:color"),
    "Black/Gold, purple/white",
  );
  assert.deepEqual(facts.get("fact:world-rule:rank:luminor:openedGates"), {
    min: 9,
    max: 10,
  });
  assert.equal(facts.get("fact:world-rule:wisdom:kardia:archive"), "Flow");
  assert.equal(facts.get("fact:world-rule:wisdom:eudaira:element"), "Air");
  assert.equal(
    facts.get("fact:character:malachar:formerName"),
    "Malachar Lumenbright",
  );
  assert.equal(
    facts.get("fact:character:malachar:currentState"),
    "Sealed in the Shadowfen",
  );
  assert.equal(
    facts.get("fact:faction:house-synthesis:domain"),
    "Integration of all",
  );
  assert.equal(
    facts.get("fact:world-rule:term:luminor:definition"),
    "Rank for those who opened all 10 Gates",
  );
  assert.equal(facts.get("fact:world-rule:fire:frequencyHz"), 396);
  assert.equal(
    facts.get("fact:character:maylinn:bondedGodbeast"),
    "creature:laeylinn",
  );
  assert.equal(graph.locked.entities.length, 62);
  assert.equal(graph.locked.assertions.length, 97);
  assert.equal(new Set(graph.locked.entities.map((a) => a.id)).size, 62);
  assert.equal(
    graph.locked.entities.find((a) => a.id === "world-rule:wisdom:kardia").type,
    "world-rule",
  );
  assert.equal(
    graph.locked.entities.find((a) => a.id === "faction:house-nero").type,
    "faction",
  );
});

test("locked source context preserves prose and only explicit locked terminology rows", async () => {
  const graph = await open();
  const lines = execFileSync(
    "git",
    ["show", `${commit}:.arcanea/lore/CANON_LOCKED.md`],
    { cwd: repo, encoding: "utf8" },
  ).split(/\r?\n/);
  assert.equal(
    graph.locked.coverage,
    "current-locked-sections-and-locked-terminology",
  );
  assert.equal(
    graph.locked.generatorVersion,
    "arcanea.locked-canon-projection.v1",
  );
  assert.equal(graph.locked.sourceSegments.length, 11);
  for (const segment of graph.locked.sourceSegments) {
    assert.equal(
      segment.text,
      lines
        .slice(segment.source.lineStart - 1, segment.source.lineEnd)
        .join("\n"),
    );
    assert.deepEqual(segment.source, {
      ...graph.canonSource,
      lineStart: segment.source.lineStart,
      lineEnd: segment.source.lineEnd,
    });
  }
  const context = graph.locked.sourceSegments.map((a) => a.text).join("\n");
  assert.match(context, /Nero is NOT evil/);
  assert.match(context, /Malachar is tragic, not purely evil/);
  assert.match(context, /Wisdoms are aspects\/virtues, not entities/);
  assert.match(context, /Houses are institutional, not geographic/);
  assert.match(context, /explicit Creator \(Frank\) approval/);
  assert.doesNotMatch(
    context,
    /APPROVAL LOG|Las Tierras de Luz|The Awakened|Pyrathis|First-Witness|Veldoria|Velora/,
  );
});

test("Luminor discrepancy keeps both actual source lines for human resolution", async () => {
  const graph = await open();
  assert.equal(graph.locked.ambiguities.length, 1);
  const ambiguity = graph.locked.ambiguities[0];
  assert.equal(ambiguity.id, "ambiguity:luminor-gates");
  assert.equal(ambiguity.status, "human-resolution-required");
  const lines = execFileSync(
    "git",
    ["show", `${commit}:.arcanea/lore/CANON_LOCKED.md`],
    { cwd: repo, encoding: "utf8" },
  ).split(/\r?\n/);
  assert.equal(ambiguity.sources.length, 2);
  assert.match(lines[ambiguity.sources[0].lineStart - 1], /9-10 \| Luminor/);
  assert.match(
    lines[ambiguity.sources[1].lineStart - 1],
    /opened all 10 Gates/,
  );
  assert.throws(() => {
    ambiguity.status = "resolved";
  }, TypeError);
  const exported = sdk.exportRealmGraph(graph);
  exported.locked.sourceSegments[0].text = "tampered";
  assert.notEqual(graph.locked.sourceSegments[0].text, "tampered");
  const reopened = await sdk.openRealmGraph(repo, commit, exported.staging);
  assert.deepEqual(reopened.locked, graph.locked);
});

test("Malachar scene continuity carries factual and qualified canon context without promotion", async () => {
  const staging = {
    schemaVersion: "realm.arcanea.graph.v0",
    releaseId: "creative-context-fixture",
    entities: [
      { id: "work:fixture", type: "work", label: "Synthetic context work" },
      { id: "timeline:fixture", type: "timeline", label: "Synthetic ordering" },
      {
        id: "scene:fixture",
        type: "scene",
        label: "Synthetic Malachar context",
        workId: "work:fixture",
        timelineId: "timeline:fixture",
        moment: 0,
        participants: ["character:malachar"],
      },
    ],
    assertions: [],
    dependencies: [],
  };
  const graph = await open(staging);
  const result = sdk.realmContinuity(
    graph,
    "character:malachar",
    "scene:fixture",
  );
  assert.equal(result.lockedFacts.length, 5);
  assert.ok(result.lockedFacts.some((a) => a.predicate === "nature"));
  assert.deepEqual(
    result.canonContext.sourceSegments,
    graph.locked.sourceSegments,
  );
  assert.deepEqual(result.canonContext.ambiguities, graph.locked.ambiguities);
  assert.match(
    result.canonContext.sourceSegments.find((a) => a.canonTier === "tier-4")
      .text,
    /once the greatest of Lumina's champions/,
  );
  assert.equal(result.canonPromotionAllowed, false);
  assert.throws(() => {
    result.canonContext.sourceSegments[0].text = "altered";
  }, TypeError);
  await assert.rejects(
    open({ ...staging, canonContext: result.canonContext }),
    /unknown field/,
  );
});

test("locked projection is deterministic and binds actual immutable Git bytes", async () => {
  const first = await open();
  const second = await open();
  assert.deepEqual(sdk.exportRealmGraph(first), sdk.exportRealmGraph(second));
  assert.equal(
    first.canonSource.sha256,
    "58c9c86fd3b540e274d478b91096523031132388b7b18b2fa1d67dee676bf54f",
  );
  assert.equal(first.canonSource.commit, commit);
  assert.equal(first.canonSource.path, ".arcanea/lore/CANON_LOCKED.md");
  assert.ok(first.locked.entities.some((n) => n.id === "character:lyria"));
  assert.ok(
    !first.locked.entities.some((n) =>
      /oria|veldoria|pyrathis|awakened/i.test(n.id),
    ),
  );
  assert.ok(
    first.locked.assertions.every(
      (a) =>
        a.status === "LOCKED" && a.source.sha256 === first.canonSource.sha256,
    ),
  );
  const frequency = first.locked.assertions.find(
    (a) => a.id === "fact:world-rule:heart:frequencyHz",
  );
  assert.equal(frequency.value, 417);
});

test("continuity keeps locked facts and reports a time-bounded conflicting proposal", async () => {
  const graph = await open();
  const early = sdk.realmContinuity(graph, "character:lyria", "scene:early");
  assert.equal(
    early.lockedFacts.find((a) => a.predicate === "bondedGodbeast").value,
    "creature:yumiko",
  );
  assert.equal(early.candidateFacts.length, 1);
  assert.equal(early.conflicts.length, 1);
  assert.deepEqual(early.conflicts[0].lockedAssertionIds, [
    "fact:character:lyria:bondedGodbeast",
  ]);
  assert.deepEqual(early.conflicts[0].candidateAssertionIds, ["proposal:bond"]);
  assert.equal(early.candidateFacts[0].sourceVerification, "declared");
  assert.equal(early.canonPromotionAllowed, false);
  const late = sdk.realmContinuity(graph, "character:lyria", "scene:late");
  assert.equal(late.conflicts.length, 0);
  assert.deepEqual(
    late.candidateFacts.map((a) => a.id),
    ["proposal:location"],
  );
  assert.ok(late.lockedFacts.some((a) => a.value === "creature:yumiko"));
});

test("impact follows declared dependencies through scene, book, asset, quest and release", async () => {
  const graph = await open();
  const result = sdk.realmImpact(graph, "fact:character:lyria:bondedGodbeast");
  assert.deepEqual(
    result.affected.map((a) => a.id),
    [
      "scene:early",
      "quest:fixture",
      "work:dragonborne-book-01",
      "asset:cover",
      "release:arc-rel-001",
    ],
  );
  assert.equal(result.coverage, "declared-dependencies-only");
  assert.deepEqual(
    result.affected.find((a) => a.id === "release:arc-rel-001").via,
    [
      "fact:character:lyria:bondedGodbeast",
      "scene:early",
      "quest:fixture",
      "release:arc-rel-001",
    ],
  );
});

test("export/reopen preserves work while re-verifying the locked source", async () => {
  const graph = await open();
  const exported = JSON.parse(JSON.stringify(sdk.exportRealmGraph(graph)));
  const reopened = await sdk.openRealmGraph(
    repo,
    exported.canonSource.commit,
    exported.staging,
  );
  assert.deepEqual(
    sdk.realmContinuity(reopened, "character:lyria", "scene:early"),
    sdk.realmContinuity(graph, "character:lyria", "scene:early"),
  );
  assert.throws(
    () => sdk.realmContinuity(exported, "character:lyria", "scene:early"),
    /verified realm/i,
  );
  assert.throws(() => {
    graph.locked.assertions[0].value = "mutated";
  }, TypeError);
});

test("caller edits during the Git read cannot change the verified overlay or its authority", async () => {
  const overlay = clone(fixture);
  const pending = open(overlay);
  overlay.releaseId = "MUTATED";
  overlay.assertions[0].status = "LOCKED";
  overlay.assertions[0].value = "changed while awaiting Git";
  const graph = await pending;
  assert.equal(graph.releaseId, "ARC-REL-001");
  const context = sdk.realmContinuity(graph, "character:lyria", "scene:early");
  assert.equal(context.candidateFacts[0].status, "CANDIDATE");
  assert.equal(context.candidateFacts[0].value, "creature:sol");
  assert.ok(context.lockedFacts.every((a) => a.id.startsWith("fact:")));
});

test("a different immutable canon blob refuses even when its tables still parse", async (t) => {
  const parent = realpathSync(os.tmpdir());
  const scratch = mkdtempSync(path.join(parent, "arcanea-realm-drift-"));
  try {
    const run = (...args) =>
      execFileSync("git", args, {
        cwd: scratch,
        encoding: "utf8",
        timeout: 10000,
      });
    run("init", "-q");
    mkdirSync(path.join(scratch, ".arcanea", "lore"), { recursive: true });
    const canon = execFileSync(
      "git",
      ["show", `${commit}:.arcanea/lore/CANON_LOCKED.md`],
      { cwd: repo },
    );
    writeFileSync(
      path.join(scratch, ".arcanea", "lore", "CANON_LOCKED.md"),
      Buffer.concat([canon, Buffer.from("\nChanged unapproved source.\n")]),
    );
    run("add", "--", ".arcanea/lore/CANON_LOCKED.md");
    run(
      "-c",
      "user.name=Realm fixture",
      "-c",
      "user.email=realm-fixture@example.invalid",
      "commit",
      "-q",
      "-m",
      "drift fixture",
    );
    const sourceCommit = run("rev-parse", "HEAD").trim();
    await assert.rejects(
      sdk.openRealmGraph(scratch, sourceCommit, fixture),
      /source drift/i,
    );
  } catch (error) {
    if (
      process.platform === "win32" &&
      /starlight-ops denied: git failed/.test(String(error.stderr))
    ) {
      t.skip(
        "Local Git ownership admission refuses the temporary fixture; hosted Linux/Windows must execute it without this skip.",
      );
    } else {
      throw error;
    }
  } finally {
    const resolved = realpathSync(scratch);
    const relative = path.relative(parent, resolved);
    assert.equal(resolved, scratch);
    assert.ok(
      relative.startsWith("arcanea-realm-drift-") &&
        !path.isAbsolute(relative) &&
        !relative.includes(path.sep),
    );
    rmSync(resolved, { recursive: true, force: true });
  }
});

test("interval endpoints, multiple values and object equality avoid false conflicts", async () => {
  const overlay = clone(fixture);
  overlay.entities.find((n) => n.id === "scene:early").moment = 5;
  const original = clone(overlay.assertions[1]);
  overlay.assertions.push({
    ...original,
    id: "proposal:friends-a",
    predicate: "alliesWith",
    cardinality: "many",
    value: "a",
  });
  overlay.assertions.push({
    ...original,
    id: "proposal:friends-b",
    predicate: "alliesWith",
    cardinality: "many",
    value: "b",
  });
  overlay.assertions.push({
    ...original,
    id: "proposal:object-a",
    predicate: "state",
    value: { a: 1, b: 2 },
  });
  overlay.assertions.push({
    ...original,
    id: "proposal:object-b",
    predicate: "state",
    value: { b: 2, a: 1 },
  });
  const result = sdk.realmContinuity(
    await open(overlay),
    "character:lyria",
    "scene:early",
  );
  assert.equal(result.conflicts.length, 0);
  assert.ok(!result.candidateFacts.some((a) => a.id === "proposal:bond"));
  assert.ok(result.candidateFacts.some((a) => a.id === "proposal:location"));
  overlay.assertions.find((a) => a.id === "proposal:friends-b").cardinality =
    "one";
  assert.equal(
    sdk.realmContinuity(await open(overlay), "character:lyria", "scene:early")
      .conflicts.length,
    1,
  );
});

test("non-JSON values, accessors and oversized inputs refuse without invocation", async () => {
  let invoked = false;
  const accessor = clone(fixture);
  Object.defineProperty(accessor.assertions[0], "value", {
    enumerable: true,
    get() {
      invoked = true;
      return "unsafe";
    },
  });
  await assert.rejects(open(accessor), /accessor/i);
  assert.equal(invoked, false);
  for (const bad of [undefined, () => {}, Symbol("private")]) {
    const overlay = clone(fixture);
    overlay.assertions[0].value = bad;
    await assert.rejects(open(overlay), /non-JSON/i);
  }
  const large = clone(fixture);
  large.assertions[0].value = "x".repeat(1_000_000);
  await assert.rejects(open(large), /1 MB/i);
});

for (const [label, modify] of [
  [
    "LOCKED candidate",
    (v) => {
      v.assertions[0].status = "LOCKED";
    },
  ],
  [
    "locked field injection",
    (v) => {
      v.locked = {};
    },
  ],
  [
    "source entity overwrite",
    (v) => {
      v.entities.push({
        id: "character:lyria",
        type: "character",
        label: "overwrite",
      });
    },
  ],
  [
    "unknown entity type",
    (v) => {
      v.entities[0].type = "god";
    },
  ],
  [
    "duplicate assertion",
    (v) => {
      v.assertions.push(clone(v.assertions[0]));
    },
  ],
  [
    "dangling dependency",
    (v) => {
      v.dependencies[0].dependsOn = "missing:source";
    },
  ],
  [
    "non-artifact dependency target",
    (v) => {
      v.dependencies[0].artifactId = "character:lyria";
    },
  ],
  [
    "invalid interval",
    (v) => {
      v.assertions[0].validity.to = 1;
    },
  ],
  [
    "invalid timeline reference",
    (v) => {
      v.entities[2].timelineId = "work:dragonborne-book-01";
    },
  ],
  [
    "nonfinite moment",
    (v) => {
      v.entities[2].moment = Infinity;
    },
  ],
  [
    "unknown nested key",
    (v) => {
      v.assertions[0].source.secret = "private";
    },
  ],
  [
    "invalid source path",
    (v) => {
      v.assertions[0].source.path = "../secret";
    },
  ],
]) {
  test(`invalid overlay refuses without changing input: ${label}`, async () => {
    const overlay = clone(fixture);
    modify(overlay);
    const before = clone(overlay);
    await assert.rejects(open(overlay), /realm/i);
    assert.deepEqual(overlay, before);
    assert.ok((await open()).locked.assertions.length > 0);
  });
}

test("invalid commit and unknown query references refuse", async () => {
  await assert.rejects(sdk.openRealmGraph(repo, "HEAD", fixture), /commit/i);
  await assert.rejects(
    sdk.openRealmGraph(repo, "0".repeat(40), fixture),
    /source|commit/i,
  );
  const graph = await open();
  assert.throws(
    () => sdk.realmContinuity(graph, "character:missing", "scene:early"),
    /character|entity/i,
  );
  assert.throws(
    () => sdk.realmContinuity(graph, "character:lyria", "scene:missing"),
    /scene/i,
  );
  assert.throws(
    () => sdk.realmImpact(graph, "missing:change"),
    /change|reference/i,
  );
});

test("impact handles cycles and input ordering deterministically", async () => {
  const fixtureWithCycle = clone(fixture);
  fixtureWithCycle.dependencies.push({
    dependsOn: "release:arc-rel-001",
    artifactId: "scene:early",
  });
  const graph = await open(fixtureWithCycle);
  const reversed = clone(fixtureWithCycle);
  reversed.entities.reverse();
  reversed.assertions.reverse();
  reversed.dependencies.reverse();
  assert.deepEqual(
    sdk.realmImpact(await open(reversed), "proposal:bond"),
    sdk.realmImpact(graph, "proposal:bond"),
  );
  assert.equal(sdk.realmImpact(graph, "proposal:bond").affected.length, 5);
});

test("CLI serves both queries and export without modifying the fixture or source", () => {
  const fixturePath = fileURLToPath(
    new URL("./fixtures/realm-graph.staging.json", import.meta.url),
  );
  const original = readFileSync(fixturePath);
  const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));
  const run = (action, ...ids) =>
    JSON.parse(
      execFileSync(
        process.execPath,
        [cli, "realm", action, repo, commit, fixturePath, ...ids],
        { cwd: path.dirname(cli), encoding: "utf8", timeout: 10000 },
      ),
    );
  assert.equal(
    run("continuity", "character:lyria", "scene:early").conflicts.length,
    1,
  );
  assert.equal(run("impact", "proposal:bond").affected.length, 5);
  assert.equal(run("export").schemaVersion, "realm.arcanea.graph.v0");
  assert.deepEqual(readFileSync(fixturePath), original);
});
