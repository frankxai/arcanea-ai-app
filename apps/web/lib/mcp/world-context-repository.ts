import {
  GatewayError,
  canonicalJson,
  canonicalSha256,
  type AuthorizedWorldSnapshot,
  type SnapshotEntity,
  type WorldContextProvenance,
  type WorldContextRepository,
  type WorldContextVisibility,
} from "@arcanea/mcp-server/gateway";

export interface WorldSourceRow {
  id: string;
  creatorId: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  mood: string | null;
  elements: unknown;
  laws: unknown;
  palette: unknown;
  systems: unknown;
  visibility: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CharacterSourceRow {
  id: string;
  worldId: string;
  name: string;
  title: string | null;
  backstory: string | null;
  motivation: string | null;
  element: string | null;
  gate: number | null;
  originClass: string | null;
  personality: unknown;
  factionId: string | null;
  relationships: unknown;
  portraitUrl: string | null;
  themeMusicUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FactionSourceRow {
  id: string;
  worldId: string;
  name: string;
  philosophy: string | null;
  history: string | null;
  territory: unknown;
  visualIdentity: unknown;
  createdAt: string | null;
}

export interface LocationSourceRow {
  id: string;
  worldId: string;
  name: string;
  description: string | null;
  region: string | null;
  significance: string | null;
  coordinates: unknown;
  imageUrl: string | null;
  ambientMusicUrl: string | null;
  createdAt: string | null;
}

export interface WorldContextDataSource {
  loadOwnedWorld(input: {
    actorId: string;
    worldId: string;
  }): Promise<WorldSourceRow | null>;
  listCharacters(worldId: string): Promise<CharacterSourceRow[]>;
  listFactions(worldId: string): Promise<FactionSourceRow[]>;
  listLocations(worldId: string): Promise<LocationSourceRow[]>;
}

const MAX_SOURCE_SNAPSHOT_BYTES = 2_000_000;
const MAX_SOURCE_SNAPSHOT_DEPTH = 32;
const MAX_SOURCE_SNAPSHOT_NODES = 50_000;
const MAX_SOURCE_SNAPSHOT_CODE_UNITS = MAX_SOURCE_SNAPSHOT_BYTES;

interface SourceShapeCounter {
  nodes: number;
  codeUnits: number;
  canonicalBytesUpperBound: number;
}

function addCanonicalStringBudget(
  value: string,
  counter: SourceShapeCounter,
): void {
  counter.codeUnits += value.length;
  if (counter.codeUnits > MAX_SOURCE_SNAPSHOT_CODE_UNITS) {
    throw new GatewayError("context-bound-mismatch");
  }

  // Account for the surrounding JSON quotes without allocating an encoded copy.
  counter.canonicalBytesUpperBound += 2;
  if (counter.canonicalBytesUpperBound > MAX_SOURCE_SNAPSHOT_BYTES) {
    throw new GatewayError("context-bound-mismatch");
  }
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit === 0x22 || codeUnit === 0x5c) {
      counter.canonicalBytesUpperBound += 2;
    } else if (codeUnit <= 0x1f) {
      counter.canonicalBytesUpperBound +=
        codeUnit === 0x08 ||
        codeUnit === 0x09 ||
        codeUnit === 0x0a ||
        codeUnit === 0x0c ||
        codeUnit === 0x0d
          ? 2
          : 6;
    } else if (codeUnit <= 0x7f) {
      counter.canonicalBytesUpperBound += 1;
    } else if (codeUnit <= 0x7ff) {
      counter.canonicalBytesUpperBound += 2;
    } else if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        counter.canonicalBytesUpperBound += 4;
        index += 1;
      } else {
        counter.canonicalBytesUpperBound += 6;
      }
    } else if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      counter.canonicalBytesUpperBound += 6;
    } else {
      counter.canonicalBytesUpperBound += 3;
    }

    if (counter.canonicalBytesUpperBound > MAX_SOURCE_SNAPSHOT_BYTES) {
      throw new GatewayError("context-bound-mismatch");
    }
  }
}

function addCanonicalStructureBudget(
  bytes: number,
  counter: SourceShapeCounter,
): void {
  counter.canonicalBytesUpperBound += bytes;
  if (counter.canonicalBytesUpperBound > MAX_SOURCE_SNAPSHOT_BYTES) {
    throw new GatewayError("context-bound-mismatch");
  }
}

function assertSourceShape(
  value: unknown,
  depth: number,
  ancestors: WeakSet<object>,
  counter: SourceShapeCounter,
): void {
  counter.nodes += 1;
  if (
    counter.nodes > MAX_SOURCE_SNAPSHOT_NODES ||
    depth > MAX_SOURCE_SNAPSHOT_DEPTH
  ) {
    throw new GatewayError("context-bound-mismatch");
  }
  if (value === null) {
    addCanonicalStructureBudget(4, counter);
    return;
  }
  if (typeof value === "string") {
    addCanonicalStringBudget(value, counter);
    return;
  }
  if (typeof value === "boolean") {
    addCanonicalStructureBudget(value ? 4 : 5, counter);
    return;
  }
  if (typeof value === "number") {
    // RFC 8785 number serialization is always comfortably below this bound.
    addCanonicalStructureBudget(32, counter);
    return;
  }
  if (typeof value !== "object") return;
  if (ancestors.has(value)) {
    throw new GatewayError("context-bound-mismatch");
  }
  ancestors.add(value);
  if (Array.isArray(value)) {
    addCanonicalStructureBudget(2 + Math.max(0, value.length - 1), counter);
    for (const entry of value) {
      assertSourceShape(entry, depth + 1, ancestors, counter);
    }
  } else {
    const keys = Object.keys(value);
    addCanonicalStructureBudget(2 + Math.max(0, keys.length - 1), counter);
    for (const key of keys) {
      addCanonicalStringBudget(key, counter);
      addCanonicalStructureBudget(1, counter);
      assertSourceShape(
        (value as Record<string, unknown>)[key],
        depth + 1,
        ancestors,
        counter,
      );
    }
  }
  ancestors.delete(value);
}

function assertBoundedSourceSnapshot(value: unknown): void {
  assertSourceShape(value, 0, new WeakSet<object>(), {
    nodes: 0,
    codeUnits: 0,
    canonicalBytesUpperBound: 0,
  });
  let serialized: string;
  try {
    serialized = canonicalJson(value);
  } catch (error) {
    if (error instanceof GatewayError) throw error;
    throw new GatewayError("revision-unavailable", { cause: error });
  }
  if (
    new TextEncoder().encode(serialized).byteLength > MAX_SOURCE_SNAPSHOT_BYTES
  ) {
    throw new GatewayError("context-bound-mismatch");
  }
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function truncate(value: string, maximum: number): string {
  if (value.length <= maximum) return value;
  let end = maximum;
  const previous = value.charCodeAt(end - 1);
  const next = value.charCodeAt(end);
  if (
    previous >= 0xd800 &&
    previous <= 0xdbff &&
    next >= 0xdc00 &&
    next <= 0xdfff
  ) {
    end -= 1;
  }
  return value.slice(0, end);
}

function timestamp(value: string | null): string {
  if (!value) throw new GatewayError("revision-unavailable");
  const normalized = new Date(value);
  if (!Number.isFinite(normalized.getTime()))
    throw new GatewayError("revision-unavailable");
  return normalized.toISOString();
}

function visibility(value: string | null): WorldContextVisibility {
  if (value === "private") return "private";
  if (value === "unlisted") return "restricted";
  if (value === "public") return "public";
  throw new GatewayError("revision-unavailable");
}

function factValue(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string") return truncate(value, 2000);
  try {
    return truncate(canonicalJson(value), 2000);
  } catch (error) {
    throw new GatewayError("revision-unavailable", { cause: error });
  }
}

function facts(
  entries: Array<[string, unknown]>,
): Array<{ key: string; value: string }> {
  return entries
    .map(([key, value]) => [key, factValue(value)] as const)
    .filter((entry): entry is readonly [string, string] => entry[1] !== null)
    .slice(0, 32)
    .map(([key, value]) => ({ key, value }));
}

function sourceEntity(input: {
  table: "worlds" | "world_characters" | "world_factions" | "world_locations";
  entityId: string;
  entityType: "world" | "character" | "faction" | "location";
  name: string;
  summary: string;
  facts: Array<{ key: string; value: string }>;
  relationIds: string[];
  visibility: WorldContextVisibility;
  capturedAt: string;
  sourceRecord: unknown;
}): { entity: SnapshotEntity; provenance: WorldContextProvenance } {
  const sourceId = `row:${input.table}:${input.entityId}`;
  const entity: SnapshotEntity = {
    entityId: input.entityId,
    entityType: input.entityType,
    name: truncate(input.name, 300),
    state: "source",
    visibility: input.visibility,
    payload: {
      summary: truncate(input.summary, 8000),
      facts: input.facts,
      relationIds: [...new Set(input.relationIds)].sort(compareText),
    },
    sourceIds: [sourceId],
  };
  const provenance: WorldContextProvenance = {
    sourceId,
    entityId: input.entityId,
    sourceKind: "creator-source",
    visibility: input.visibility,
    sourceRecordId: input.entityId,
    sourceHash: canonicalSha256({
      schemaVersion: "arcanea.compatibility-source.v1",
      table: input.table,
      sourceRecord: input.sourceRecord,
    }),
    capturedAt: input.capturedAt,
    generator: "arcanea-owner-source-compatibility-v1",
  };
  return { entity, provenance };
}

export function createOwnerSourceWorldContextRepository(
  dataSource: WorldContextDataSource,
): WorldContextRepository {
  return {
    async loadAuthorizedSnapshot({ actor, worldId, visibilityScope }) {
      const world = await dataSource.loadOwnedWorld({
        actorId: actor.actorId,
        worldId,
      });
      if (!world || world.creatorId !== actor.actorId || world.id !== worldId) {
        throw new GatewayError("world-not-found");
      }

      const worldVisibility = visibility(world.visibility);
      if (visibilityScope === "public-only" && worldVisibility !== "public") {
        throw new GatewayError("visibility-denied");
      }
      const effectiveVisibility =
        visibilityScope === "public-only" ? "public" : worldVisibility;

      let characters: CharacterSourceRow[];
      let factions: FactionSourceRow[];
      let locations: LocationSourceRow[];
      try {
        [characters, factions, locations] = await Promise.all([
          dataSource.listCharacters(worldId),
          dataSource.listFactions(worldId),
          dataSource.listLocations(worldId),
        ]);
      } catch (error) {
        throw error instanceof GatewayError
          ? error
          : new GatewayError("revision-unavailable", { cause: error });
      }
      if (
        characters.some((record) => record.worldId !== world.id) ||
        factions.some((record) => record.worldId !== world.id) ||
        locations.some((record) => record.worldId !== world.id)
      ) {
        throw new GatewayError("context-world-mismatch");
      }
      assertBoundedSourceSnapshot({ world, characters, factions, locations });

      const records = [
        sourceEntity({
          table: "worlds",
          entityId: world.id,
          entityType: "world",
          name: world.name,
          summary: world.description ?? world.tagline ?? world.name,
          facts: facts([
            ["slug", world.slug],
            ["tagline", world.tagline],
            ["mood", world.mood],
            ["elements", world.elements],
            ["laws", world.laws],
            ["palette", world.palette],
            ["systems", world.systems],
          ]),
          relationIds: [],
          visibility: effectiveVisibility,
          capturedAt: timestamp(world.updatedAt ?? world.createdAt),
          sourceRecord: {
            id: world.id,
            creatorId: world.creatorId,
            name: world.name,
            slug: world.slug,
            tagline: world.tagline,
            description: world.description,
            mood: world.mood,
            elements: world.elements,
            laws: world.laws,
            palette: world.palette,
            systems: world.systems,
            visibility: world.visibility,
            createdAt: world.createdAt,
            updatedAt: world.updatedAt,
          },
        }),
        ...characters
          .sort((left, right) => compareText(left.id, right.id))
          .map((character) =>
            sourceEntity({
              table: "world_characters",
              entityId: character.id,
              entityType: "character",
              name: character.name,
              summary:
                character.backstory ??
                character.motivation ??
                character.title ??
                character.name,
              facts: facts([
                ["title", character.title],
                ["motivation", character.motivation],
                ["element", character.element],
                ["gate", character.gate],
                ["originClass", character.originClass],
                ["personality", character.personality],
                ["relationships", character.relationships],
                ["portraitUrl", character.portraitUrl],
                ["themeMusicUrl", character.themeMusicUrl],
              ]),
              relationIds: [
                world.id,
                ...(character.factionId ? [character.factionId] : []),
              ],
              visibility: effectiveVisibility,
              capturedAt: timestamp(character.updatedAt ?? character.createdAt),
              sourceRecord: {
                id: character.id,
                worldId: character.worldId,
                name: character.name,
                title: character.title,
                backstory: character.backstory,
                motivation: character.motivation,
                element: character.element,
                gate: character.gate,
                originClass: character.originClass,
                personality: character.personality,
                factionId: character.factionId,
                relationships: character.relationships,
                portraitUrl: character.portraitUrl,
                themeMusicUrl: character.themeMusicUrl,
                createdAt: character.createdAt,
                updatedAt: character.updatedAt,
              },
            }),
          ),
        ...factions
          .sort((left, right) => compareText(left.id, right.id))
          .map((faction) =>
            sourceEntity({
              table: "world_factions",
              entityId: faction.id,
              entityType: "faction",
              name: faction.name,
              summary: faction.philosophy ?? faction.history ?? faction.name,
              facts: facts([
                ["philosophy", faction.philosophy],
                ["history", faction.history],
                ["territory", faction.territory],
                ["visualIdentity", faction.visualIdentity],
              ]),
              relationIds: [world.id],
              visibility: effectiveVisibility,
              capturedAt: timestamp(faction.createdAt),
              sourceRecord: {
                id: faction.id,
                worldId: faction.worldId,
                name: faction.name,
                philosophy: faction.philosophy,
                history: faction.history,
                territory: faction.territory,
                visualIdentity: faction.visualIdentity,
                createdAt: faction.createdAt,
              },
            }),
          ),
        ...locations
          .sort((left, right) => compareText(left.id, right.id))
          .map((location) =>
            sourceEntity({
              table: "world_locations",
              entityId: location.id,
              entityType: "location",
              name: location.name,
              summary:
                location.description ?? location.significance ?? location.name,
              facts: facts([
                ["region", location.region],
                ["significance", location.significance],
                ["coordinates", location.coordinates],
                ["imageUrl", location.imageUrl],
                ["ambientMusicUrl", location.ambientMusicUrl],
              ]),
              relationIds: [world.id],
              visibility: effectiveVisibility,
              capturedAt: timestamp(location.createdAt),
              sourceRecord: {
                id: location.id,
                worldId: location.worldId,
                name: location.name,
                description: location.description,
                region: location.region,
                significance: location.significance,
                coordinates: location.coordinates,
                imageUrl: location.imageUrl,
                ambientMusicUrl: location.ambientMusicUrl,
                createdAt: location.createdAt,
              },
            }),
          ),
      ];

      return {
        schemaVersion: "arcanea.world-context-snapshot.v1",
        worldId: world.id,
        worldVisibility,
        effectiveVisibility,
        role: "owner",
        grantId: `owner:${world.id}:${actor.actorId}`,
        scope: visibilityScope,
        availableStates: ["source"],
        entities: records.map((record) => record.entity),
        conflicts: [],
        provenance: records.map((record) => record.provenance),
      } satisfies AuthorizedWorldSnapshot;
    },
  };
}
