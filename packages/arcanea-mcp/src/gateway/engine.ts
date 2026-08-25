import {
  canonicalSha256,
  normalizeWorldContextQuery,
  normalizedTokens,
} from "./canonical.js";
import { asGatewayError, GatewayError } from "./errors.js";
import {
  authorizedWorldSnapshotSchema,
  WORLD_CONTEXT_STATES,
  worldContextInputSchema,
  worldContextOutputSchema,
  type AuthorizedWorldSnapshot,
  type SnapshotEntity,
  type WorldContextConflict,
  type WorldContextInput,
  type WorldContextOutput,
  type WorldContextProvenance,
  type WorldContextState,
  type WorldContextVisibility,
} from "./schema.js";
import type {
  WorldContextAuthorityInput,
  WorldContextAuthorityRecord,
  WorldContextGatewayDependencies,
} from "./types.js";

const EXPLICIT_INVENTORY_PHRASES = [
  "return everything",
  "show everything",
  "give me everything",
  "dump world",
  "whole world",
] as const;
const INVENTORY_QUANTIFIERS = new Set([
  "all",
  "every",
  "entire",
  "complete",
  "whole",
]);
const PROTECTED_OBJECTS = new Set([
  "record",
  "records",
  "asset",
  "assets",
  "prompt",
  "prompts",
  "collaborator",
  "collaborators",
  "everything",
]);
const STATE_ORDER = new Map(
  WORLD_CONTEXT_STATES.map((state, index) => [state, index]),
);
const VISIBILITY_ORDER: Record<WorldContextVisibility, number> = {
  private: 0,
  restricted: 1,
  public: 2,
};

export const WORLD_CONTEXT_MAX_STRUCTURED_RESPONSE_BYTES = 1_000_000;

export function serializedWorldContextBytes(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).byteLength;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortStates(states: WorldContextState[]): WorldContextState[] {
  return [...new Set(states)].sort(
    (left, right) =>
      (STATE_ORDER.get(left) ?? 99) - (STATE_ORDER.get(right) ?? 99),
  );
}

function sortVisibilities(
  visibilities: WorldContextVisibility[],
): WorldContextVisibility[] {
  return [...new Set(visibilities)].sort(
    (left, right) => VISIBILITY_ORDER[left] - VISIBILITY_ORDER[right],
  );
}

function canonicalEntity(entity: SnapshotEntity): SnapshotEntity {
  return {
    ...entity,
    payload: {
      summary: entity.payload.summary,
      facts: [...entity.payload.facts].sort(
        (left, right) =>
          compareText(left.key, right.key) ||
          compareText(left.value, right.value),
      ),
      relationIds: [...entity.payload.relationIds].sort(compareText),
    },
    sourceIds: [...entity.sourceIds].sort(compareText),
  };
}

function canonicalConflict(
  conflict: WorldContextConflict,
): WorldContextConflict {
  return {
    ...conflict,
    entityIds: [...conflict.entityIds].sort(compareText),
    sourceIds: [...conflict.sourceIds].sort(compareText),
  };
}

function canonicalSnapshot(snapshot: AuthorizedWorldSnapshot) {
  return {
    schemaVersion: snapshot.schemaVersion,
    worldId: snapshot.worldId,
    worldVisibility: snapshot.worldVisibility,
    effectiveVisibility: snapshot.effectiveVisibility,
    scope: snapshot.scope,
    availableStates: sortStates(snapshot.availableStates),
    entities: snapshot.entities
      .map(canonicalEntity)
      .sort(
        (left, right) =>
          compareText(left.entityType, right.entityType) ||
          compareText(left.entityId, right.entityId),
      ),
    conflicts: snapshot.conflicts
      .map(canonicalConflict)
      .sort((left, right) => compareText(left.conflictId, right.conflictId)),
    provenance: [...snapshot.provenance].sort(
      (left, right) =>
        compareText(left.sourceId, right.sourceId) ||
        compareText(left.entityId, right.entityId),
    ),
  };
}

function assertBoundedQuery(
  normalizedQuery: string,
  request: WorldContextInput,
): void {
  if (normalizedQuery.length === 0 || normalizedQuery.length > 256) {
    throw new GatewayError("query-too-broad");
  }
  if (
    EXPLICIT_INVENTORY_PHRASES.some((phrase) =>
      normalizedQuery.includes(phrase),
    )
  ) {
    throw new GatewayError("query-too-broad");
  }
  const tokens = new Set(normalizedTokens(normalizedQuery));
  const inventoryIntent =
    [...INVENTORY_QUANTIFIERS].some((token) => tokens.has(token)) &&
    [...PROTECTED_OBJECTS].some((token) => tokens.has(token));
  if (inventoryIntent) throw new GatewayError("query-too-broad");

  if (
    request.filters.entityIds.length === 0 &&
    request.filters.sourceIds.length === 0
  ) {
    throw new GatewayError("query-too-broad");
  }
}

function validateSnapshotBindings(
  snapshot: AuthorizedWorldSnapshot,
  request: WorldContextInput,
): void {
  if (snapshot.worldId !== request.worldId)
    throw new GatewayError("context-world-mismatch");
  if (snapshot.scope !== request.visibilityScope) {
    throw new GatewayError("context-visibility-scope-mismatch");
  }
  if (request.visibilityScope === "public-only") {
    if (snapshot.effectiveVisibility !== "public") {
      throw new GatewayError("context-effective-visibility-mismatch");
    }
    const containsNonPublic =
      snapshot.entities.some((item) => item.visibility !== "public") ||
      snapshot.conflicts.some((item) => item.visibility !== "public") ||
      snapshot.provenance.some((item) => item.visibility !== "public");
    if (containsNonPublic) throw new GatewayError("context-visibility-leak");
  }
}

function validateProvenance(
  snapshot: AuthorizedWorldSnapshot,
): Map<string, WorldContextProvenance> {
  const availableStates = new Set(snapshot.availableStates);
  const entitiesById = new Map<string, SnapshotEntity>();
  for (const entity of snapshot.entities) {
    if (entitiesById.has(entity.entityId)) {
      throw new GatewayError("context-world-mismatch");
    }
    if (!availableStates.has(entity.state)) {
      throw new GatewayError("context-state-partition-mismatch");
    }
    entitiesById.set(entity.entityId, entity);
  }

  const conflictIds = new Set<string>();
  for (const conflict of snapshot.conflicts) {
    if (conflictIds.has(conflict.conflictId)) {
      throw new GatewayError("context-source-mismatch");
    }
    if (!availableStates.has("conflict")) {
      throw new GatewayError("context-state-partition-mismatch");
    }
    conflictIds.add(conflict.conflictId);
  }

  const provenanceById = new Map<string, WorldContextProvenance>();
  for (const provenance of snapshot.provenance) {
    if (provenanceById.has(provenance.sourceId)) {
      throw new GatewayError("context-provenance-unresolved");
    }
    if (!entitiesById.has(provenance.entityId)) {
      throw new GatewayError("context-provenance-unresolved");
    }
    provenanceById.set(provenance.sourceId, provenance);
  }

  for (const entity of snapshot.entities) {
    for (const sourceId of entity.sourceIds) {
      const provenance = provenanceById.get(sourceId);
      if (!provenance) throw new GatewayError("context-provenance-unresolved");
      if (provenance.entityId !== entity.entityId) {
        throw new GatewayError("context-provenance-partition-mismatch");
      }
      if (provenance.visibility !== entity.visibility) {
        throw new GatewayError("context-provenance-partition-mismatch");
      }
    }
  }
  for (const conflict of snapshot.conflicts) {
    for (const entityId of conflict.entityIds) {
      if (!entitiesById.has(entityId))
        throw new GatewayError("context-provenance-unresolved");
    }
    for (const sourceId of conflict.sourceIds) {
      const provenance = provenanceById.get(sourceId);
      if (!provenance) throw new GatewayError("context-provenance-unresolved");
      if (!conflict.entityIds.includes(provenance.entityId)) {
        throw new GatewayError("context-provenance-partition-mismatch");
      }
    }
  }
  return provenanceById;
}

function relevanceScore(
  entity: SnapshotEntity,
  normalizedQuery: string,
): number {
  const queryTokens = new Set(normalizedTokens(normalizedQuery));
  const documentTokens = new Set(
    normalizedTokens(
      [
        entity.name ?? "",
        entity.entityType,
        entity.payload.summary,
        ...entity.payload.facts.flatMap((fact) => [fact.key, fact.value]),
      ].join(" "),
    ),
  );
  if (queryTokens.size === 0) return 0;
  let matches = 0;
  for (const token of queryTokens) if (documentTokens.has(token)) matches += 1;
  return Math.round((matches / queryTokens.size) * 1_000_000) / 1_000_000;
}

function assertAuthorityRecord(
  expected: WorldContextAuthorityInput,
  record: WorldContextAuthorityRecord,
): void {
  if (
    record.authenticatedTenantId !== expected.authenticatedTenantId ||
    record.authenticatedActorId !== expected.authenticatedActorId ||
    record.contextRequestHash !== expected.contextRequestHash ||
    record.normalizedQueryHash !== expected.normalizedQueryHash
  ) {
    throw new GatewayError("context-query-binding-mismatch");
  }
  if (record.filtersHash !== expected.filtersHash)
    throw new GatewayError("context-filter-mismatch");
  if (record.worldId !== expected.worldId)
    throw new GatewayError("context-world-mismatch");
  if (record.membershipRole !== expected.membershipRole)
    throw new GatewayError("context-role-mismatch");
  if (record.membershipGrantId !== expected.membershipGrantId) {
    throw new GatewayError("context-grant-mismatch");
  }
  if (record.worldVisibility !== expected.worldVisibility) {
    throw new GatewayError("context-access-visibility-mismatch");
  }
  if (record.effectiveVisibility !== expected.effectiveVisibility) {
    throw new GatewayError("context-effective-visibility-mismatch");
  }
  if (record.visibilityScope !== expected.visibilityScope) {
    throw new GatewayError("context-visibility-scope-mismatch");
  }
  if (record.revision !== expected.revision)
    throw new GatewayError("context-revision-mismatch");
  if (
    record.snapshotHash !== expected.snapshotHash ||
    record.contentHash !== expected.contentHash
  ) {
    throw new GatewayError("context-snapshot-mismatch");
  }
  if (
    record.maxEntities !== expected.maxEntities ||
    JSON.stringify(record.includeStates) !==
      JSON.stringify(expected.includeStates)
  ) {
    throw new GatewayError("context-requested-states-mismatch");
  }
  if (record.classification !== "bounded-relevant") {
    throw new GatewayError("context-query-classification-unverified");
  }
  const expectedAuthorityKey = canonicalSha256({
    schemaVersion: "arcanea.world-context-authority-key.v1",
    contextRequestHash: expected.contextRequestHash,
    authenticatedTenantId: expected.authenticatedTenantId,
    authenticatedActorId: expected.authenticatedActorId,
    worldId: expected.worldId,
    membershipGrantId: expected.membershipGrantId,
    revision: expected.revision,
    snapshotHash: expected.snapshotHash,
  });
  if (record.authorityKey !== expectedAuthorityKey) {
    throw new GatewayError("context-query-binding-mismatch");
  }
}

function safeWorldId(input: unknown): string | undefined {
  if (typeof input !== "object" || input === null || !("worldId" in input))
    return undefined;
  const value = (input as { worldId?: unknown }).worldId;
  return typeof value === "string" && value.length <= 128 ? value : undefined;
}

async function execute(
  input: unknown,
  dependencies: WorldContextGatewayDependencies,
): Promise<WorldContextOutput> {
  const request = worldContextInputSchema.parse(input);
  const normalizedQuery = normalizeWorldContextQuery(request.query);
  assertBoundedQuery(normalizedQuery, request);

  const normalizedFilters = {
    entityTypes: [...request.filters.entityTypes].sort(compareText),
    entityIds: [...request.filters.entityIds].sort(compareText),
    sourceIds: [...request.filters.sourceIds].sort(compareText),
  };
  const requestedStates = sortStates(request.includeStates);
  const normalizedQueryHash = canonicalSha256(normalizedQuery);
  const filtersHash = canonicalSha256(normalizedFilters);
  const contextRequestHash = canonicalSha256({
    worldId: request.worldId,
    queryMode: request.queryMode,
    purpose: request.purpose,
    normalizedQueryHash,
    filtersHash,
    includeStates: requestedStates,
    maxEntities: request.maxEntities,
    visibilityScope: request.visibilityScope,
  });

  let unparsedSnapshot: AuthorizedWorldSnapshot;
  try {
    unparsedSnapshot = await dependencies.repository.loadAuthorizedSnapshot({
      actor: dependencies.actor,
      worldId: request.worldId,
      visibilityScope: request.visibilityScope,
    });
  } catch (error) {
    throw asGatewayError(error);
  }

  let snapshot: AuthorizedWorldSnapshot;
  try {
    snapshot = authorizedWorldSnapshotSchema.parse(unparsedSnapshot);
  } catch (error) {
    throw new GatewayError("revision-unavailable", { cause: error });
  }
  validateSnapshotBindings(snapshot, request);
  const provenanceById = validateProvenance(snapshot);

  const availableStates = sortStates(snapshot.availableStates);
  const unavailableStates = requestedStates.filter(
    (state) => !availableStates.includes(state),
  );
  if (unavailableStates.length > 0)
    throw new GatewayError("state-coverage-unavailable");

  const canonicalSnapshotValue = canonicalSnapshot(snapshot);
  const snapshotHash = canonicalSha256(canonicalSnapshotValue);
  const revision = snapshotHash;
  const authorityInput: WorldContextAuthorityInput = {
    authenticatedTenantId: dependencies.actor.tenantId,
    authenticatedActorId: dependencies.actor.actorId,
    contextRequestHash,
    normalizedQueryHash,
    filtersHash,
    worldId: request.worldId,
    membershipRole: snapshot.role,
    membershipGrantId: snapshot.grantId,
    worldVisibility: snapshot.worldVisibility,
    effectiveVisibility: snapshot.effectiveVisibility,
    revision,
    snapshotHash,
    includeStates: requestedStates,
    maxEntities: request.maxEntities,
    visibilityScope: request.visibilityScope,
    contentHash: snapshotHash,
  };
  const authorityRecord =
    await dependencies.authority.authorize(authorityInput);
  assertAuthorityRecord(authorityInput, authorityRecord);

  const entityTypeSet = new Set(normalizedFilters.entityTypes);
  const entityIdSet = new Set(normalizedFilters.entityIds);
  const sourceIdSet = new Set(normalizedFilters.sourceIds);
  const requestedStateSet = new Set(requestedStates);
  const selectedEntities = snapshot.entities
    .filter(
      (entity) =>
        entityTypeSet.size === 0 || entityTypeSet.has(entity.entityType),
    )
    .filter(
      (entity) =>
        entityIdSet.has(entity.entityId) ||
        entity.sourceIds.some((sourceId) => sourceIdSet.has(sourceId)),
    )
    .filter((entity) => requestedStateSet.has(entity.state))
    .filter(
      (entity) =>
        request.visibilityScope !== "public-only" ||
        entity.visibility === "public",
    )
    .map((entity) => ({
      ...canonicalEntity(entity),
      relevanceScore: relevanceScore(entity, normalizedQuery),
    }))
    .sort(
      (left, right) =>
        right.relevanceScore - left.relevanceScore ||
        compareText(left.entityType, right.entityType) ||
        compareText(left.entityId, right.entityId),
    );

  const selectedConflicts = requestedStateSet.has("conflict")
    ? snapshot.conflicts
        .filter(
          (conflict) =>
            conflict.entityIds.some((entityId) => entityIdSet.has(entityId)) ||
            conflict.sourceIds.some((sourceId) => sourceIdSet.has(sourceId)),
        )
        .filter(
          (conflict) =>
            request.visibilityScope !== "public-only" ||
            conflict.visibility === "public",
        )
        .map(canonicalConflict)
        .sort((left, right) => compareText(left.conflictId, right.conflictId))
    : [];

  const maximumEntityCount = Math.min(
    selectedEntities.length,
    request.maxEntities,
  );
  const maximumConflictCount = Math.min(selectedConflicts.length, 100);
  const selectionWasAlreadyTruncated =
    selectedEntities.length > maximumEntityCount ||
    selectedConflicts.length > maximumConflictCount;

  function buildOutput(
    entityCount: number,
    conflictCount: number,
    responseBudgetTruncated: boolean,
  ): WorldContextOutput {
    const entities = selectedEntities.slice(0, entityCount);
    const conflicts = selectedConflicts.slice(0, conflictCount);
    const returnedSourceIds = new Set([
      ...entities.flatMap((entity) => entity.sourceIds),
      ...conflicts.flatMap((conflict) => conflict.sourceIds),
    ]);
    const provenance = [...returnedSourceIds]
      .map((sourceId) => provenanceById.get(sourceId))
      .filter((item): item is WorldContextProvenance => item !== undefined)
      .sort(
        (left, right) =>
          compareText(left.sourceId, right.sourceId) ||
          compareText(left.entityId, right.entityId),
      );
    if (provenance.length !== returnedSourceIds.size) {
      throw new GatewayError("context-provenance-unresolved");
    }
    if (provenance.length > 3200) {
      throw new GatewayError("context-bound-mismatch");
    }

    const returnedStates = sortStates([
      ...entities.map((entity) => entity.state),
      ...(conflicts.length > 0 ? (["conflict"] as const) : []),
    ]);
    const returnedVisibilities = sortVisibilities([
      ...entities.map((entity) => entity.visibility),
      ...conflicts.map((conflict) => conflict.visibility),
      ...provenance.map((item) => item.visibility),
    ]);
    return worldContextOutputSchema.parse({
      revision,
      snapshotHash,
      access: {
        worldId: snapshot.worldId,
        worldVisibility: snapshot.worldVisibility,
        effectiveVisibility: snapshot.effectiveVisibility,
        role: snapshot.role,
        grantId: snapshot.grantId,
        scope: snapshot.scope,
      },
      entities,
      conflicts,
      provenance,
      coverage: {
        requestedStates,
        availableStates,
        unavailableStates: [],
        returnedStates,
        visibilityScope: request.visibilityScope,
        returnedVisibilities,
        maxEntitiesApplied: request.maxEntities,
        returnedEntities: entities.length,
        returnedConflicts: conflicts.length,
        returnedProvenance: provenance.length,
        truncated:
          selectionWasAlreadyTruncated ||
          responseBudgetTruncated ||
          entityCount < maximumEntityCount ||
          conflictCount < maximumConflictCount,
      },
      queryReceipt: {
        schemaVersion: "arcanea.world-context-query.v1",
        queryMode: request.queryMode,
        purpose: request.purpose,
        normalizedQueryHash,
        filtersHash,
        contextRequestHash,
      },
    });
  }

  function maximumFittingCount(
    maximum: number,
    candidate: (count: number) => WorldContextOutput,
  ): number {
    let lower = 0;
    let upper = maximum;
    let best = 0;
    while (lower <= upper) {
      const middle = Math.floor((lower + upper) / 2);
      let fits = false;
      try {
        fits =
          serializedWorldContextBytes(candidate(middle)) <=
          WORLD_CONTEXT_MAX_STRUCTURED_RESPONSE_BYTES;
      } catch (error) {
        if (
          !(error instanceof GatewayError) ||
          error.code !== "context-bound-mismatch"
        ) {
          throw error;
        }
      }
      if (fits) {
        best = middle;
        lower = middle + 1;
      } else {
        upper = middle - 1;
      }
    }
    return best;
  }

  let output: WorldContextOutput;
  let requiresBudgetFit = false;
  try {
    output = buildOutput(maximumEntityCount, maximumConflictCount, false);
    requiresBudgetFit =
      serializedWorldContextBytes(output) >
      WORLD_CONTEXT_MAX_STRUCTURED_RESPONSE_BYTES;
  } catch (error) {
    if (
      !(error instanceof GatewayError) ||
      error.code !== "context-bound-mismatch"
    ) {
      throw error;
    }
    output = buildOutput(0, 0, true);
    requiresBudgetFit = true;
  }
  if (requiresBudgetFit) {
    // Relevant entities have priority; conflicts use the deterministic
    // remaining budget. Compatibility mode currently exposes source entities
    // only, while production conflict prioritization remains an adapter gate.
    const entityCount = maximumFittingCount(maximumEntityCount, (count) =>
      buildOutput(count, 0, true),
    );
    const conflictCount = maximumFittingCount(maximumConflictCount, (count) =>
      buildOutput(entityCount, count, true),
    );
    output = buildOutput(entityCount, conflictCount, true);
    if (
      serializedWorldContextBytes(output) >
      WORLD_CONTEXT_MAX_STRUCTURED_RESPONSE_BYTES
    ) {
      throw new GatewayError("context-bound-mismatch");
    }
  }

  await dependencies.audit?.record({
    schemaVersion: "arcanea.world-context-audit.v1",
    outcome: "allowed",
    authenticatedTenantId: dependencies.actor.tenantId,
    authenticatedActorId: dependencies.actor.actorId,
    worldId: request.worldId,
    contextRequestHash,
    normalizedQueryHash,
    filtersHash,
    revision,
    returnedEntities: output.entities.length,
    returnedConflicts: output.conflicts.length,
    returnedProvenance: output.provenance.length,
  });
  return output;
}

export async function executeWorldContextQuery(
  input: unknown,
  dependencies: WorldContextGatewayDependencies,
): Promise<WorldContextOutput> {
  try {
    return await execute(input, dependencies);
  } catch (error) {
    const gatewayError = asGatewayError(error);
    await dependencies.audit?.record({
      schemaVersion: "arcanea.world-context-audit.v1",
      outcome: "denied",
      code: gatewayError.code,
      authenticatedTenantId: dependencies.actor.tenantId,
      authenticatedActorId: dependencies.actor.actorId,
      worldId: safeWorldId(input),
    });
    throw gatewayError;
  }
}
