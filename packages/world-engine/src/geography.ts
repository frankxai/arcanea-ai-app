import {
  AtlasAssertionSchema,
  AtlasFeatureSchema,
  AtlasTimelineSchema,
  type AtlasAssertion,
  type AtlasFeatureValue,
  type AtlasTimelineValue,
} from "@arcanea/schemas";

/** Read-only projection of a Realm Graph STAGING overlay. Never a canon authority. */
export interface AtlasStagingInput {
  readonly entities: readonly {
    readonly id: string;
    readonly type: string;
    readonly label: string;
  }[];
  readonly assertions: readonly unknown[];
}
interface Version {
  entityId: string;
  label: string;
  assertionId: string;
  status: AtlasAssertion["status"];
  source: AtlasAssertion["source"];
  validity: NonNullable<AtlasAssertion["validity"]>;
}
export interface AtlasFeature extends AtlasFeatureValue, Version {}
export interface AtlasPresence extends Version {
  placeId: string;
  type: "character" | "event";
}
export interface GeographicAtlas {
  schemaVersion: "atlas.projection.v1";
  nonCanon: true;
  title: string;
  timelineId: string;
  timeline: AtlasTimelineValue;
  features: AtlasFeature[];
  presences: AtlasPresence[];
}
function requireAtlas(ok: unknown, message: string): asserts ok {
  if (!ok) throw new Error(`Invalid atlas: ${message}`);
}
const active = (v: Version, at: number) =>
  v.validity.from <= at && (v.validity.to === null || at < v.validity.to);
type Point = [number, number];
const cross = (a: Point, b: Point, c: Point) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const onSegment = (p: Point, a: Point, b: Point) =>
  cross(a, b, p) === 0 &&
  p[0] >= Math.min(a[0], b[0]) &&
  p[0] <= Math.max(a[0], b[0]) &&
  p[1] >= Math.min(a[1], b[1]) &&
  p[1] <= Math.max(a[1], b[1]);
function contains(ring: Point[], point: Point) {
  let inside = false;
  for (let i = 0, j = ring.length - 2; i < ring.length - 1; j = i++) {
    const a = ring[j],
      b = ring[i];
    if (onSegment(point, a, b)) return true;
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}
function validateRing(ring: Point[]) {
  requireAtlas(
    JSON.stringify(ring[0]) === JSON.stringify(ring.at(-1)),
    "polygon ring must close",
  );
  requireAtlas(
    new Set(ring.slice(0, -1).map((p) => p.join(","))).size === ring.length - 1,
    "duplicate polygon vertex",
  );
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const a = ring[i],
      b = ring[i + 1];
    area += a[0] * b[1] - b[0] * a[1];
    for (let j = i + 2; j < ring.length - 1; j++) {
      if (i === 0 && j === ring.length - 2) continue;
      const c = ring[j],
        d = ring[j + 1];
      const intersects =
        (cross(a, b, c) * cross(a, b, d) < 0 &&
          cross(c, d, a) * cross(c, d, b) < 0) ||
        onSegment(a, c, d) ||
        onSegment(b, c, d) ||
        onSegment(c, a, b) ||
        onSegment(d, a, b);
      requireAtlas(!intersects, "self-intersecting polygon");
    }
  }
  requireAtlas(Math.abs(area) > 0, "zero-area polygon");
}

export function projectAtlasStaging(input: AtlasStagingInput): GeographicAtlas {
  requireAtlas(
    input.entities.length <= 2000 && input.assertions.length <= 2000,
    "projection bounds",
  );
  const entities = new Map(input.entities.map((e) => [e.id, e]));
  requireAtlas(entities.size === input.entities.length, "duplicate entity");
  const facts = input.assertions
    .map((fact) => AtlasAssertionSchema.parse(fact))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  requireAtlas(
    new Set(facts.map((f) => f.id)).size === facts.length,
    "duplicate assertion",
  );
  const timelineFacts = facts.filter((f) => f.predicate === "atlasTimeline");
  requireAtlas(timelineFacts.length === 1, "one atlas timeline required");
  const timelineFact = timelineFacts[0];
  const timeline = AtlasTimelineSchema.parse(timelineFact.value);
  const world = entities.get(timeline.worldId);
  requireAtlas(
    world?.type === "place" &&
      entities.get(timelineFact.subjectId)?.type === "timeline",
    "world or timeline reference",
  );
  requireAtlas(
    timelineFact.validity === null && timeline.to >= timeline.from,
    "timeline bounds",
  );
  requireAtlas(
    timeline.eras.every(
      (era, i) =>
        era.moment >= timeline.from &&
        era.moment <= timeline.to &&
        (i === 0 || era.moment > timeline.eras[i - 1].moment),
    ),
    "era order or bounds",
  );
  const version = (fact: AtlasAssertion): Version => {
    const entity = entities.get(fact.subjectId);
    requireAtlas(entity, "missing entity");
    requireAtlas(
      fact.validity &&
        fact.validity.timelineId === timelineFact.subjectId &&
        (fact.validity.to === null || fact.validity.to > fact.validity.from),
      "invalid validity interval or timeline",
    );
    requireAtlas(
      fact.validity.from >= timeline.from &&
        fact.validity.from <= timeline.to &&
        (fact.validity.to === null || fact.validity.to <= timeline.to + 1),
      "validity outside atlas coverage",
    );
    return {
      entityId: entity.id,
      label: entity.label,
      assertionId: fact.id,
      status: fact.status,
      source: fact.source,
      validity: fact.validity,
    };
  };
  const features = facts
    .filter((f) => f.predicate === "geography")
    .map((fact): AtlasFeature => {
      const value = AtlasFeatureSchema.parse(fact.value);
      requireAtlas(
        entities.get(fact.subjectId)?.type === "place" &&
          value.worldId === timeline.worldId,
        "geography world/place reference",
      );
      if (value.geometry.type === "Polygon")
        validateRing(value.geometry.coordinates);
      return { ...value, ...version(fact) };
    });
  const presences = facts
    .filter((f) => f.predicate === "location")
    .map((fact): AtlasPresence => {
      const type = entities.get(fact.subjectId)?.type;
      requireAtlas(
        type === "character" || type === "event",
        "location subject type",
      );
      requireAtlas(
        typeof fact.value === "string",
        "location must reference a place ID",
      );
      return { ...version(fact), type, placeId: fact.value };
    });
  // Do not silently resolve competing versions, even when their geometry agrees.
  for (const versions of [features, presences]) {
    const ids = new Set(versions.map((v) => v.entityId));
    for (const id of ids) {
      const history = versions
        .filter((v) => v.entityId === id)
        .sort((a, b) => a.validity.from - b.validity.from);
      for (let i = 1; i < history.length; i++) {
        requireAtlas(
          history[i - 1].validity.to !== null &&
            history[i - 1].validity.to! <= history[i].validity.from,
          "overlapping versions",
        );
        if (versions === features)
          requireAtlas(
            history[i - 1].validity.to === history[i].validity.from,
            "geographic history gap",
          );
      }
    }
  }
  const moments = new Set(
    [
      timeline.from,
      ...features.flatMap((f) => [f.validity.from, f.validity.to]),
      ...presences.flatMap((p) => [p.validity.from, p.validity.to]),
    ].filter((n): n is number => n !== null && n <= timeline.to),
  );
  for (const at of moments) {
    const current = features.filter((f) => active(f, at));
    for (const feature of current) {
      if (feature.parentId === null) {
        requireAtlas(feature.kind === "region", "settlement requires parent");
        continue;
      }
      const parent = current.find((p) => p.entityId === feature.parentId);
      requireAtlas(
        parent?.kind === "region" &&
          parent.parentId === null &&
          parent.geometry.type === "Polygon",
        "parent coverage or unsupported nested region",
      );
      requireAtlas(
        feature.geometry.type === "Point" &&
          contains(parent.geometry.coordinates, feature.geometry.coordinates),
        "parent containment",
      );
    }
    for (const presence of presences.filter((p) => active(p, at)))
      requireAtlas(
        current.some((f) => f.entityId === presence.placeId),
        "location coverage or dangling place",
      );
  }
  return {
    schemaVersion: "atlas.projection.v1",
    nonCanon: true,
    title: world.label,
    timelineId: timelineFact.subjectId,
    timeline,
    features,
    presences,
  };
}

export function atlasAtMoment(atlas: GeographicAtlas, moment: number) {
  requireAtlas(
    Number.isSafeInteger(moment) &&
      moment >= atlas.timeline.from &&
      moment <= atlas.timeline.to,
    "moment outside timeline",
  );
  return structuredClone({
    features: atlas.features.filter((f) => active(f, moment)),
    presences: atlas.presences.filter((p) => active(p, moment)),
  });
}
