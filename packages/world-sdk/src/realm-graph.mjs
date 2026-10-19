import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";

const git = promisify(execFile);
const VERSION = "realm.arcanea.graph.v0";
const CANON_PATH = ".arcanea/lore/CANON_LOCKED.md";
// A new source pin requires a reviewed compiler change, never an overlay field.
const CANON_SHA =
  "58c9c86fd3b540e274d478b91096523031132388b7b18b2fa1d67dee676bf54f";
const GENERATOR_VERSION = "arcanea.locked-canon-projection.v1";
const LOCKED_SECTIONS = new Map([
  ["## TIER 1: COSMIC FOUNDATION (LOCKED ✅)", "tier-1"],
  ["## TIER 2: THE TEN GATES & ARCANEAN GODS (LOCKED ✅)", "tier-2"],
  ["## TIER 3: THE SEVEN WISDOMS (LOCKED ✅)", "tier-3"],
  ["## TIER 4: THE DARK LORD (LOCKED ✅)", "tier-4"],
  ["## TIER 6: THE SEVEN ACADEMY HOUSES (LOCKED ✅)", "tier-6"],
  ["## EXTENSIBILITY PRINCIPLES (LOCKED ✅)", "extensibility"],
]);
const contexts = new WeakMap();
const TYPES = new Set([
  "character",
  "place",
  "faction",
  "creature",
  "artifact",
  "world-rule",
  "event",
  "timeline",
  "series",
  "work",
  "scene",
  "quest",
  "asset",
  "release",
]);
const ARTIFACTS = new Set([
  "series",
  "work",
  "scene",
  "quest",
  "asset",
  "release",
]);
const idPattern = /^[a-z0-9]+(?:[a-zA-Z0-9:._-]*[a-zA-Z0-9])?$/;
const shaPattern = /^[a-f0-9]{64}$/;
const commitPattern = /^[a-f0-9]{40}$/;
const ordered = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const copy = (value) => JSON.parse(JSON.stringify(value));
const own = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
function requireRealm(ok, detail) {
  if (!ok) {
    const error = new Error(`Invalid realm graph: ${detail}.`);
    error.code = "ERR_ARCANEA_REALM_GRAPH";
    throw error;
  }
}
function jsonData(value, ancestors = new Set(), depth = 0) {
  requireRealm(depth <= 24, "JSON depth exceeds 24");
  if (value === null || typeof value === "boolean" || typeof value === "string")
    return;
  if (typeof value === "number") {
    requireRealm(Number.isFinite(value), "nonfinite number");
    return;
  }
  requireRealm(
    typeof value === "object" && !ancestors.has(value),
    "non-JSON or cyclic value",
  );
  requireRealm(
    Array.isArray(value) ||
      Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null,
    "non-JSON object prototype",
  );
  ancestors.add(value);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  if (Array.isArray(value)) {
    requireRealm(
      value.length <= 8000 &&
        Reflect.ownKeys(descriptors).length === value.length + 1,
      "sparse or extended array",
    );
    for (let i = 0; i < value.length; i++) {
      const item = descriptors[i];
      requireRealm(
        item && "value" in item && item.enumerable,
        "array accessor",
      );
      jsonData(item.value, ancestors, depth + 1);
    }
  } else {
    for (const key of Reflect.ownKeys(descriptors)) {
      const item = descriptors[key];
      requireRealm(
        typeof key === "string" && "value" in item && item.enumerable,
        "hidden key or accessor",
      );
      jsonData(item.value, ancestors, depth + 1);
    }
  }
  ancestors.delete(value);
}
function fields(value, required, optional = []) {
  requireRealm(own(value), "expected object");
  requireRealm(
    required.every((key) => Object.hasOwn(value, key)) &&
      Object.keys(value).every(
        (key) => required.includes(key) || optional.includes(key),
      ),
    "missing or unknown field",
  );
}
function text(value, max = 240) {
  requireRealm(
    typeof value === "string" &&
      value.trim().length > 0 &&
      [...value].length <= max,
    "empty or overlong text",
  );
}
function id(value) {
  requireRealm(
    typeof value === "string" && value.length <= 160 && idPattern.test(value),
    "invalid identifier",
  );
}
function ids(value) {
  requireRealm(
    Array.isArray(value) && new Set(value).size === value.length,
    "invalid identifier list",
  );
  value.forEach(id);
}
function source(value) {
  fields(value, ["path", "sha256"], ["commit", "lineStart", "lineEnd"]);
  text(value.path);
  requireRealm(
    /^[a-zA-Z0-9._/-]+$/.test(value.path) &&
      !value.path.startsWith("/") &&
      value.path
        .split("/")
        .every((part) => part && part !== "." && part !== ".."),
    "invalid source path",
  );
  requireRealm(
    typeof value.sha256 === "string" && shaPattern.test(value.sha256),
    "invalid source hash",
  );
  if (Object.hasOwn(value, "commit"))
    requireRealm(commitPattern.test(value.commit), "invalid source commit");
  if (Object.hasOwn(value, "lineStart") || Object.hasOwn(value, "lineEnd"))
    requireRealm(
      Number.isSafeInteger(value.lineStart) &&
        value.lineStart >= 1 &&
        Number.isSafeInteger(value.lineEnd) &&
        value.lineEnd >= value.lineStart,
      "invalid source lines",
    );
}
function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function canonical(value) {
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  if (own(value))
    return (
      "{" +
      Object.keys(value)
        .sort()
        .map((key) => JSON.stringify(key) + ":" + canonical(value[key]))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}

async function lockedProjection(repoRoot, commit) {
  requireRealm(
    typeof repoRoot === "string" && repoRoot.trim(),
    "repository root required",
  );
  requireRealm(
    typeof commit === "string" && commitPattern.test(commit),
    "full immutable source commit required",
  );
  let bytes;
  try {
    ({ stdout: bytes } = await git(
      "git",
      ["-C", repoRoot, "show", `${commit}:${CANON_PATH}`],
      {
        encoding: "buffer",
        maxBuffer: 128_000,
        timeout: 10_000,
        windowsHide: true,
      },
    ));
  } catch {
    requireRealm(false, "immutable canon source commit could not be read");
  }
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  requireRealm(
    sha256 === CANON_SHA,
    "canon source drift; reviewed compiler source pin required",
  );
  const lines = new TextDecoder("utf-8", { fatal: true })
    .decode(bytes)
    .split(/\r?\n/);
  const canonSource = { path: CANON_PATH, commit, sha256 };
  const entities = [],
    assertions = [],
    sourceSegments = [],
    luminorSources = [];
  let section = "";
  const clean = (cell) => cell.trim().replaceAll("**", "");
  const addEntity = (
    type,
    label,
    key = label.toLowerCase().replaceAll(" ", "-"),
  ) => {
    const entityId = `${type}:${key}`;
    entities.push({ id: entityId, type, label });
    return entityId;
  };
  const addFact = (subjectId, predicate, value, line, tier) =>
    assertions.push({
      id: `fact:${subjectId}:${predicate}`,
      subjectId,
      predicate,
      value,
      cardinality: "one",
      status: "LOCKED",
      canonTier: tier,
      confidence: 1,
      validity: null,
      source: { ...canonSource, lineStart: line, lineEnd: line },
      sourceVerification: "git-byte-verified",
      affectedArtifacts: [],
      supersedes: [],
    });
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      section = lines[i];
      if (LOCKED_SECTIONS.has(section)) {
        let end = i + 1;
        while (end < lines.length && !lines[end].startsWith("## ")) end++;
        sourceSegments.push({
          id: `canon:${LOCKED_SECTIONS.get(section)}`,
          title: section.slice(3),
          canonTier: LOCKED_SECTIONS.get(section),
          text: lines.slice(i, end).join("\n"),
          source: { ...canonSource, lineStart: i + 1, lineEnd: end },
        });
      }
    }
    if (LOCKED_SECTIONS.get(section) === "tier-4") {
      const detail =
        /^- \*\*(Former Name|Former Title|Fall|Current State|Nature):\*\* (.+)$/.exec(
          lines[i],
        );
      if (detail) {
        if (detail[1] === "Former Name") addEntity("character", "Malachar");
        const predicates = {
          "Former Name": "formerName",
          "Former Title": "formerTitle",
          Fall: "fall",
          "Current State": "currentState",
          Nature: "nature",
        };
        addFact(
          "character:malachar",
          predicates[detail[1]],
          detail[2],
          i + 1,
          "tier-4",
        );
      }
    }
    if (LOCKED_SECTIONS.get(section) === "tier-6") {
      const house = /^\d\. \*\*(House [A-Za-z]+)\*\* - (.+)$/.exec(lines[i]);
      if (house)
        addFact(
          addEntity("faction", house[1]),
          "domain",
          house[2],
          i + 1,
          "tier-6",
        );
    }
    if (!lines[i].startsWith("|")) continue;
    const cells = lines[i].split("|").slice(1, -1).map(clean);
    if (
      section === "## TIER 1: COSMIC FOUNDATION (LOCKED ✅)" &&
      cells.length === 3 &&
      ["Lumina", "Nero"].includes(cells[0])
    ) {
      const subjectId = addEntity("character", cells[0]);
      addFact(subjectId, "aspect", cells[1], i + 1, "tier-1");
      addFact(subjectId, "nature", cells[2], i + 1, "tier-1");
    }
    if (
      LOCKED_SECTIONS.get(section) === "tier-1" &&
      cells.length === 3 &&
      ["Fire", "Water", "Earth", "Wind", "Void/Spirit"].includes(cells[0])
    ) {
      const elementId = addEntity(
        "world-rule",
        cells[0],
        `element:${cells[0].toLowerCase().replace("/", "-")}`,
      );
      addFact(elementId, "domain", cells[1], i + 1, "tier-1");
      addFact(elementId, "color", cells[2], i + 1, "tier-1");
    }
    if (
      section === "## TIER 2: THE TEN GATES & ARCANEAN GODS (LOCKED ✅)" &&
      cells.length === 5 &&
      /^\d+ Hz$/.test(cells[1])
    ) {
      const gateId = addEntity("world-rule", cells[0]);
      const subjectId = addEntity("character", cells[2]);
      const beastId = addEntity("creature", cells[3]);
      addFact(
        gateId,
        "frequencyHz",
        Number(cells[1].split(" ")[0]),
        i + 1,
        "tier-2",
      );
      addFact(subjectId, "gate", gateId, i + 1, "tier-2");
      addFact(subjectId, "bondedGodbeast", beastId, i + 1, "tier-2");
      addFact(subjectId, "domain", cells[4], i + 1, "tier-2");
    }
    if (
      LOCKED_SECTIONS.get(section) === "tier-2" &&
      cells.length === 2 &&
      /^\d+-\d+$/.test(cells[0])
    ) {
      const [min, max] = cells[0].split("-").map(Number);
      const rankId = addEntity(
        "world-rule",
        cells[1],
        `rank:${cells[1].toLowerCase()}`,
      );
      addFact(rankId, "openedGates", { min, max }, i + 1, "tier-2");
      if (cells[1] === "Luminor")
        luminorSources.push({
          ...canonSource,
          lineStart: i + 1,
          lineEnd: i + 1,
        });
    }
    if (
      LOCKED_SECTIONS.get(section) === "tier-3" &&
      cells.length === 4 &&
      [
        "Sophron",
        "Kardia",
        "Valora",
        "Eudaira",
        "Orakis",
        "Poiesis",
        "Enduran",
      ].includes(cells[0])
    ) {
      const wisdomId = addEntity(
        "world-rule",
        cells[0],
        `wisdom:${cells[0].toLowerCase()}`,
      );
      for (const [index, predicate] of [
        [1, "archive"],
        [2, "domain"],
        [3, "element"],
      ])
        addFact(wisdomId, predicate, cells[index], i + 1, "tier-3");
    }
    if (
      section === "## TERMINOLOGY LOCKED ✅" &&
      cells.length === 3 &&
      cells[2] === "✅ LOCKED"
    ) {
      const key = cells[0].toLowerCase().replaceAll(" ", "-");
      const termId = addEntity("world-rule", cells[0], `term:${key}`);
      addFact(termId, "definition", cells[1], i + 1, "terminology");
      sourceSegments.push({
        id: `canon:term:${key}`,
        title: cells[0],
        canonTier: "terminology",
        text: lines[i],
        source: { ...canonSource, lineStart: i + 1, lineEnd: i + 1 },
      });
      if (cells[0] === "Luminor")
        luminorSources.push({
          ...canonSource,
          lineStart: i + 1,
          lineEnd: i + 1,
        });
    }
  }
  requireRealm(
    entities.length === 62 &&
      assertions.length === 97 &&
      sourceSegments.length === 11 &&
      luminorSources.length === 2,
    "pinned current locked canon projection changed",
  );
  requireRealm(
    new Set(entities.map((entity) => entity.id)).size === entities.length &&
      new Set(assertions.map((fact) => fact.id)).size === assertions.length,
    "duplicate compiled canon identifier",
  );
  return {
    canonSource,
    locked: {
      entities: entities.sort(ordered),
      assertions: assertions.sort(ordered),
      coverage: "current-locked-sections-and-locked-terminology",
      generatorVersion: GENERATOR_VERSION,
      sourceSegments: sourceSegments.sort(
        (a, b) => a.source.lineStart - b.source.lineStart,
      ),
      ambiguities: [
        {
          id: "ambiguity:luminor-gates",
          status: "human-resolution-required",
          description:
            "The Magic Ranks table assigns Luminor to 9-10 open Gates; the locked terminology row requires all 10. Both source statements are retained without resolution.",
          sources: luminorSources,
        },
      ],
    },
  };
}

/** Compile trusted Git canon and attach a declared, non-promoting local overlay. */
export async function openRealmGraph(repoRoot, commit, input) {
  jsonData(input);
  // Capture caller-owned data before any asynchronous Git read.
  const serialized = JSON.stringify(input);
  requireRealm(
    Buffer.byteLength(serialized) <= 1_000_000,
    "overlay exceeds 1 MB",
  );
  const overlay = JSON.parse(serialized);
  fields(
    overlay,
    ["schemaVersion", "releaseId", "entities", "assertions", "dependencies"],
    ["description"],
  );
  requireRealm(overlay.schemaVersion === VERSION, "unsupported schema version");
  text(overlay.releaseId, 80);
  if (overlay.description !== undefined) text(overlay.description, 2000);
  for (const [key, max] of [
    ["entities", 2000],
    ["assertions", 2000],
    ["dependencies", 8000],
  ])
    requireRealm(
      Array.isArray(overlay[key]) && overlay[key].length <= max,
      `invalid ${key} array`,
    );
  for (const entity of overlay.entities) {
    fields(
      entity,
      ["id", "type", "label"],
      entity.type === "scene"
        ? ["workId", "timelineId", "moment", "participants"]
        : [],
    );
    id(entity.id);
    text(entity.label, 240);
    requireRealm(TYPES.has(entity.type), "unknown entity type");
    if (entity.type === "scene") {
      id(entity.workId);
      id(entity.timelineId);
      ids(entity.participants);
      requireRealm(
        Number.isSafeInteger(entity.moment) && entity.moment >= 0,
        "invalid scene moment",
      );
    }
  }
  for (const fact of overlay.assertions) {
    fields(fact, [
      "id",
      "subjectId",
      "predicate",
      "value",
      "cardinality",
      "status",
      "confidence",
      "validity",
      "source",
      "affectedArtifacts",
      "supersedes",
    ]);
    id(fact.id);
    id(fact.subjectId);
    text(fact.predicate, 80);
    requireRealm(
      /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(fact.predicate),
      "invalid predicate",
    );
    requireRealm(
      ["one", "many"].includes(fact.cardinality) &&
        ["STAGING", "CANDIDATE"].includes(fact.status),
      "candidate canon promotion or invalid cardinality",
    );
    requireRealm(
      typeof fact.confidence === "number" &&
        fact.confidence >= 0 &&
        fact.confidence <= 1,
      "invalid confidence",
    );
    source(fact.source);
    ids(fact.affectedArtifacts);
    ids(fact.supersedes);
    if (fact.validity !== null) {
      fields(fact.validity, ["timelineId", "from", "to"]);
      id(fact.validity.timelineId);
      requireRealm(
        Number.isSafeInteger(fact.validity.from) &&
          fact.validity.from >= 0 &&
          (fact.validity.to === null ||
            (Number.isSafeInteger(fact.validity.to) &&
              fact.validity.to > fact.validity.from)),
        "invalid validity interval",
      );
    }
  }
  for (const dependency of overlay.dependencies) {
    fields(dependency, ["dependsOn", "artifactId"]);
    id(dependency.dependsOn);
    id(dependency.artifactId);
  }
  const projection = await lockedProjection(repoRoot, commit);
  const staging = overlay;
  staging.entities.sort(ordered);
  staging.assertions.sort(ordered);
  staging.dependencies.sort((a, b) =>
    ordered(
      { id: `${a.dependsOn}/${a.artifactId}` },
      { id: `${b.dependsOn}/${b.artifactId}` },
    ),
  );
  const graph = {
    schemaVersion: VERSION,
    releaseId: overlay.releaseId,
    ...projection,
    staging,
    canonPromotionAllowed: false,
  };
  const nodes = new Map(),
    facts = new Map();
  for (const entity of [...graph.locked.entities, ...staging.entities]) {
    requireRealm(!nodes.has(entity.id), "duplicate or locked entity overwrite");
    nodes.set(entity.id, entity);
  }
  for (const fact of [...graph.locked.assertions, ...staging.assertions]) {
    requireRealm(
      !facts.has(fact.id) && !nodes.has(fact.id),
      "duplicate assertion identifier",
    );
    requireRealm(nodes.has(fact.subjectId), "missing assertion subject");
    facts.set(fact.id, fact);
  }
  const artifact = (entityId) => ARTIFACTS.has(nodes.get(entityId)?.type);
  for (const entity of staging.entities)
    if (entity.type === "scene") {
      requireRealm(
        nodes.get(entity.workId)?.type === "work" &&
          nodes.get(entity.timelineId)?.type === "timeline",
        "scene work/timeline reference",
      );
      requireRealm(
        entity.participants.every((entityId) =>
          ["character", "creature"].includes(nodes.get(entityId)?.type),
        ),
        "scene participant reference",
      );
    }
  for (const fact of staging.assertions) {
    requireRealm(
      fact.validity === null ||
        nodes.get(fact.validity.timelineId)?.type === "timeline",
      "validity timeline reference",
    );
    requireRealm(
      fact.affectedArtifacts.every(artifact) &&
        fact.supersedes.every((factId) => facts.has(factId)),
      "assertion artifact or supersession reference",
    );
  }
  const adjacency = new Map();
  const add = (from, to) => {
    if (!adjacency.has(from)) adjacency.set(from, new Set());
    adjacency.get(from).add(to);
  };
  for (const dependency of staging.dependencies) {
    requireRealm(
      (nodes.has(dependency.dependsOn) || facts.has(dependency.dependsOn)) &&
        artifact(dependency.artifactId),
      "missing dependency or non-artifact target",
    );
    add(dependency.dependsOn, dependency.artifactId);
  }
  for (const fact of staging.assertions)
    fact.affectedArtifacts.forEach((target) => add(fact.id, target));
  contexts.set(graph, { nodes, facts, adjacency });
  return freeze(graph);
}
function verified(graph) {
  const context = contexts.get(graph);
  requireRealm(
    context,
    "query requires a verified realm graph; reopen exported staging against Git",
  );
  return context;
}

/** Return applicable facts; supersession proposals never remove LOCKED facts. */
export function realmContinuity(graph, characterId, sceneId) {
  const { nodes, facts } = verified(graph);
  requireRealm(
    ["character", "creature"].includes(nodes.get(characterId)?.type),
    "missing character entity",
  );
  const scene = nodes.get(sceneId);
  requireRealm(
    scene?.type === "scene" && scene.participants.includes(characterId),
    "missing scene or declared participant",
  );
  const validAt = (fact) =>
    fact.validity === null ||
    (fact.validity.timelineId === scene.timelineId &&
      fact.validity.from <= scene.moment &&
      (fact.validity.to === null || scene.moment < fact.validity.to));
  const subjects = new Set([characterId]);
  for (const fact of graph.locked.assertions)
    if (
      fact.subjectId === characterId &&
      typeof fact.value === "string" &&
      nodes.has(fact.value)
    )
      subjects.add(fact.value);
  const active = [...facts.values()]
    .filter((fact) => subjects.has(fact.subjectId) && validAt(fact))
    .sort(ordered);
  const lockedFacts = active.filter((fact) => fact.status === "LOCKED");
  const candidateFacts = active
    .filter((fact) => fact.status !== "LOCKED")
    .map((fact) => ({
      ...fact,
      canonTier: "proposal",
      sourceVerification: "declared",
    }));
  const groups = new Map();
  for (const fact of active) {
    const key = `${fact.subjectId}/${fact.predicate}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(fact);
  }
  const conflicts = [];
  for (const group of groups.values()) {
    if (
      !group.some((fact) => fact.cardinality === "one") ||
      new Set(group.map((fact) => canonical(fact.value))).size < 2
    )
      continue;
    conflicts.push({
      subjectId: group[0].subjectId,
      predicate: group[0].predicate,
      lockedAssertionIds: group
        .filter((fact) => fact.status === "LOCKED")
        .map((fact) => fact.id),
      candidateAssertionIds: group
        .filter((fact) => fact.status !== "LOCKED")
        .map((fact) => fact.id),
    });
  }
  return freeze({
    schemaVersion: VERSION,
    releaseId: graph.releaseId,
    canonSource: graph.canonSource,
    characterId,
    sceneId,
    timelineId: scene.timelineId,
    moment: scene.moment,
    lockedFacts,
    candidateFacts,
    conflicts,
    canonContext: {
      sourceSegments: graph.locked.sourceSegments,
      ambiguities: graph.locked.ambiguities,
    },
    canonPromotionAllowed: false,
  });
}

/** Traverse only supplied dependency links, retaining one deterministic path. */
export function realmImpact(graph, changeId) {
  const { nodes, facts, adjacency } = verified(graph);
  requireRealm(
    nodes.has(changeId) || facts.has(changeId),
    "unknown change reference",
  );
  const paths = new Map([[changeId, [changeId]]]);
  const queue = [changeId];
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    for (const target of [...(adjacency.get(current) || [])].sort())
      if (!paths.has(target)) {
        paths.set(target, [...paths.get(current), target]);
        queue.push(target);
      }
  }
  const affected = [...paths]
    .filter(
      ([entityId]) =>
        entityId !== changeId && ARTIFACTS.has(nodes.get(entityId)?.type),
    )
    .map(([entityId, via]) => ({ ...nodes.get(entityId), via }));
  affected.sort((a, b) => a.via.length - b.via.length || ordered(a, b));
  return freeze({
    schemaVersion: VERSION,
    releaseId: graph.releaseId,
    canonSource: graph.canonSource,
    changeId,
    coverage: "declared-dependencies-only",
    affected,
    canonPromotionAllowed: false,
  });
}

/** Export metadata/facts for inspection; importing it does not establish authority. */
export function exportRealmGraph(graph) {
  verified(graph);
  return copy(graph);
}
