import assert from "node:assert/strict";
import test from "node:test";

import {
  GatewayError,
  canonicalSha256,
  createInMemoryPreviewAdmissionLimiter,
  createInMemoryPreviewAuthority,
  executeWorldContextQuery,
  type AuthorizedWorldSnapshot,
  type WorldContextActor,
  type WorldContextRepository,
} from "@arcanea/mcp-server/gateway";

import {
  createOwnerSourceWorldContextRepository,
  type WorldContextDataSource,
} from "../world-context-repository";
import {
  createWorldContextMcpHttpHandler,
  type AuthenticatedWorldContextSession,
} from "../world-context-http";

const WORLD_ID = "10000000-0000-4000-8000-000000000001";
const ACTOR_ID = "20000000-0000-4000-8000-000000000001";
const OTHER_ACTOR_ID = "20000000-0000-4000-8000-000000000002";

const actor: WorldContextActor = {
  actorId: ACTOR_ID,
  tenantId: `personal:${ACTOR_ID}`,
};

function dataSource(
  overrides: Partial<WorldContextDataSource> = {},
): WorldContextDataSource {
  return {
    async loadOwnedWorld({ actorId, worldId }) {
      if (actorId !== ACTOR_ID || worldId !== WORLD_ID) return null;
      return {
        id: WORLD_ID,
        creatorId: ACTOR_ID,
        name: "Asterfall",
        slug: "asterfall",
        tagline: "A world beneath a broken aurora",
        description: "A creator-owned source world.",
        mood: "fantasy",
        elements: ["light", "memory"],
        laws: ["Names retain heat"],
        palette: { dawn: "arcanea-gold" },
        systems: { magic: "resonance" },
        visibility: "private",
        createdAt: "2026-08-24T08:00:00.000Z",
        updatedAt: "2026-08-25T08:00:00.000Z",
      };
    },
    async listCharacters() {
      return [
        {
          id: "30000000-0000-4000-8000-000000000001",
          worldId: WORLD_ID,
          name: "Alera",
          title: "Keeper of Embers",
          backstory: "She remembers the first dawn.",
          motivation: "Protect the Ember Archive.",
          element: "fire",
          gate: 3,
          originClass: "guardian",
          personality: { cadence: "measured" },
          factionId: null,
          relationships: null,
          portraitUrl: null,
          themeMusicUrl: null,
          createdAt: "2026-08-24T09:00:00.000Z",
          updatedAt: "2026-08-25T09:00:00.000Z",
        },
      ];
    },
    async listFactions() {
      return [];
    },
    async listLocations() {
      return [];
    },
    ...overrides,
  };
}

test("owner/source repository normalizes allowlisted rows and provenance", async () => {
  const repository = createOwnerSourceWorldContextRepository(dataSource());
  const snapshot = await repository.loadAuthorizedSnapshot({
    actor,
    worldId: WORLD_ID,
    visibilityScope: "authorized",
  });

  assert.equal(snapshot.role, "owner");
  assert.equal(snapshot.worldVisibility, "private");
  assert.deepEqual(snapshot.availableStates, ["source"]);
  assert.deepEqual(
    snapshot.entities.map((entity) => entity.entityType),
    ["world", "character"],
  );
  assert.equal(snapshot.conflicts.length, 0);
  assert.equal(snapshot.provenance.length, snapshot.entities.length);
  assert.ok(snapshot.entities.every((entity) => entity.sourceIds.length === 1));
  assert.equal(JSON.stringify(snapshot).includes("agent_system_prompt"), false);
});

test("repository makes absent and non-owner worlds indistinguishable", async () => {
  const repository = createOwnerSourceWorldContextRepository(dataSource());
  for (const request of [
    {
      actor: {
        actorId: OTHER_ACTOR_ID,
        tenantId: `personal:${OTHER_ACTOR_ID}`,
      },
      worldId: WORLD_ID,
    },
    { actor, worldId: "10000000-0000-4000-8000-000000000099" },
  ]) {
    await assert.rejects(
      repository.loadAuthorizedSnapshot({
        ...request,
        visibilityScope: "authorized",
      }),
      (error) =>
        error instanceof GatewayError && error.code === "world-not-found",
    );
  }
});

test("repository denies public-only reads for private/restricted worlds", async () => {
  const repository = createOwnerSourceWorldContextRepository(dataSource());
  await assert.rejects(
    repository.loadAuthorizedSnapshot({
      actor,
      worldId: WORLD_ID,
      visibilityScope: "public-only",
    }),
    (error) =>
      error instanceof GatewayError && error.code === "visibility-denied",
  );
});

test("repository rejects child rows bound to another world", async () => {
  const repository = createOwnerSourceWorldContextRepository(
    dataSource({
      async listCharacters() {
        return [
          {
            id: "30000000-0000-4000-8000-000000000001",
            worldId: "10000000-0000-4000-8000-000000000099",
            name: "Cross-world leak",
            title: null,
            backstory: null,
            motivation: null,
            element: null,
            gate: null,
            originClass: null,
            personality: {},
            factionId: null,
            relationships: null,
            portraitUrl: null,
            themeMusicUrl: null,
            createdAt: "2026-08-24T09:00:00.000Z",
            updatedAt: "2026-08-25T09:00:00.000Z",
          },
        ];
      },
    }),
  );
  await assert.rejects(
    repository.loadAuthorizedSnapshot({
      actor,
      worldId: WORLD_ID,
      visibilityScope: "authorized",
    }),
    (error) =>
      error instanceof GatewayError && error.code === "context-world-mismatch",
  );
});

test("repository fails closed on oversized or deeply nested source snapshots", async () => {
  const base = dataSource();
  const oversizedRepository = createOwnerSourceWorldContextRepository(
    dataSource({
      async loadOwnedWorld(input) {
        const world = await base.loadOwnedWorld(input);
        return world ? { ...world, description: "界".repeat(700_000) } : null;
      },
    }),
  );
  await assert.rejects(
    oversizedRepository.loadAuthorizedSnapshot({
      actor,
      worldId: WORLD_ID,
      visibilityScope: "authorized",
    }),
    (error) =>
      error instanceof GatewayError && error.code === "context-bound-mismatch",
  );

  const oversizedStringRepository = createOwnerSourceWorldContextRepository(
    dataSource({
      async loadOwnedWorld(input) {
        const world = await base.loadOwnedWorld(input);
        return world ? { ...world, description: "x".repeat(2_000_001) } : null;
      },
    }),
  );
  await assert.rejects(
    oversizedStringRepository.loadAuthorizedSnapshot({
      actor,
      worldId: WORLD_ID,
      visibilityScope: "authorized",
    }),
    (error) =>
      error instanceof GatewayError && error.code === "context-bound-mismatch",
  );

  const oversizedKeyRepository = createOwnerSourceWorldContextRepository(
    dataSource({
      async loadOwnedWorld(input) {
        const world = await base.loadOwnedWorld(input);
        return world
          ? { ...world, elements: { ["k".repeat(2_000_001)]: true } }
          : null;
      },
    }),
  );
  await assert.rejects(
    oversizedKeyRepository.loadAuthorizedSnapshot({
      actor,
      worldId: WORLD_ID,
      visibilityScope: "authorized",
    }),
    (error) =>
      error instanceof GatewayError && error.code === "context-bound-mismatch",
  );

  let deepValue: unknown = "leaf";
  for (let depth = 0; depth < 40; depth += 1) {
    deepValue = { child: deepValue };
  }
  const deepRepository = createOwnerSourceWorldContextRepository(
    dataSource({
      async loadOwnedWorld(input) {
        const world = await base.loadOwnedWorld(input);
        return world ? { ...world, elements: deepValue } : null;
      },
    }),
  );
  await assert.rejects(
    deepRepository.loadAuthorizedSnapshot({
      actor,
      worldId: WORLD_ID,
      visibilityScope: "authorized",
    }),
    (error) =>
      error instanceof GatewayError && error.code === "context-bound-mismatch",
  );
});

test("full allowlisted source changes rotate revision beyond output truncation", async () => {
  const factionId = "40000000-0000-4000-8000-000000000001";
  const repositoryWithHistory = (suffix: string) =>
    createOwnerSourceWorldContextRepository(
      dataSource({
        async listCharacters() {
          return [];
        },
        async listFactions() {
          return [
            {
              id: factionId,
              worldId: WORLD_ID,
              name: "The Long Archive",
              philosophy: null,
              history: `${"a".repeat(8_100)}${suffix}`,
              territory: { region: "north" },
              visualIdentity: { color: "gold" },
              createdAt: "2026-08-24T09:00:00.000Z",
            },
          ];
        },
      }),
    );
  const request = {
    worldId: WORLD_ID,
    query: "Selected creator faction",
    queryMode: "relevant-context" as const,
    purpose: "creator-question" as const,
    filters: {
      entityTypes: ["faction"],
      entityIds: [factionId],
      sourceIds: [],
    },
    includeStates: ["source"] as const,
    maxEntities: 10,
    visibilityScope: "authorized" as const,
  };
  const first = await executeWorldContextQuery(request, {
    actor,
    repository: repositoryWithHistory("first"),
    authority: createInMemoryPreviewAuthority(),
  });
  const second = await executeWorldContextQuery(request, {
    actor,
    repository: repositoryWithHistory("second"),
    authority: createInMemoryPreviewAuthority(),
  });

  assert.deepEqual(first.entities, second.entities);
  assert.notEqual(
    first.provenance[0].sourceHash,
    second.provenance[0].sourceHash,
  );
  assert.notEqual(first.revision, second.revision);
});

function gatewaySnapshot(
  requestedActor: WorldContextActor = actor,
  requestedWorldId = WORLD_ID,
): AuthorizedWorldSnapshot {
  const entityId =
    requestedActor.actorId === ACTOR_ID
      ? "30000000-0000-4000-8000-000000000001"
      : "30000000-0000-4000-8000-000000000002";
  const sourceId = `row:world_characters:${entityId}`;
  return {
    schemaVersion: "arcanea.world-context-snapshot.v1",
    worldId: requestedWorldId,
    worldVisibility: "private",
    effectiveVisibility: "private",
    role: "owner",
    grantId: `owner:${requestedWorldId}:${requestedActor.actorId}`,
    scope: "authorized",
    availableStates: ["source"],
    entities: [
      {
        entityId,
        entityType: "character",
        name: requestedActor.actorId === ACTOR_ID ? "Alera" : "Orin",
        state: "source",
        visibility: "private",
        payload: {
          summary: "Bounded private context",
          facts: [],
          relationIds: [requestedWorldId],
        },
        sourceIds: [sourceId],
      },
    ],
    conflicts: [],
    provenance: [
      {
        sourceId,
        entityId,
        sourceKind: "creator-source",
        visibility: "private",
        sourceRecordId: entityId,
        sourceHash: canonicalSha256({ entityId }),
        capturedAt: "2026-08-25T09:00:00.000Z",
        generator: "test-fixture",
      },
    ],
  };
}

function repositoryFor(
  requestedActor: WorldContextActor,
  requestedWorldId = WORLD_ID,
): WorldContextRepository {
  return {
    async loadAuthorizedSnapshot(input) {
      if (
        input.actor.actorId !== requestedActor.actorId ||
        input.worldId !== requestedWorldId ||
        input.visibilityScope !== "authorized"
      ) {
        throw new GatewayError("world-not-found");
      }
      return gatewaySnapshot(requestedActor, requestedWorldId);
    },
  };
}

function sessionFor(
  requestedActor: WorldContextActor = actor,
  requestedWorldId = WORLD_ID,
): AuthenticatedWorldContextSession {
  return {
    actor: requestedActor,
    repository: repositoryFor(requestedActor, requestedWorldId),
  };
}

function jsonRpcRequest(
  token: string,
  body: unknown,
  origin?: string,
): Request {
  const headers = new Headers({
    accept: "application/json, text/event-stream",
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "mcp-protocol-version": "2025-06-18",
  });
  if (origin) headers.set("origin", origin);
  return new Request("https://gateway.arcanea.ai/api/mcp", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function toolsListBody() {
  return {
    jsonrpc: "2.0",
    id: crypto.randomUUID(),
    method: "tools/list",
    params: {},
  };
}

test("HTTP compatibility mode is disabled by default before authentication", async () => {
  let authenticationCalls = 0;
  const handler = createWorldContextMcpHttpHandler({
    getMode: () => undefined,
    admissionLimiter: createInMemoryPreviewAdmissionLimiter(),
    authority: createInMemoryPreviewAuthority(),
    async authenticate() {
      authenticationCalls += 1;
      return sessionFor();
    },
  });
  const response = await handler(jsonRpcRequest("valid", toolsListBody()));
  assert.equal(response.status, 503);
  assert.equal(authenticationCalls, 0);
});

test("HTTP handler authenticates before parsing the body", async () => {
  const handler = createWorldContextMcpHttpHandler({
    getMode: () => "compatibility-preview",
    admissionLimiter: createInMemoryPreviewAdmissionLimiter(),
    authority: createInMemoryPreviewAuthority(),
    async authenticate() {
      return null;
    },
  });
  const response = await handler(
    jsonRpcRequest("invalid", "{ definitely not json"),
  );
  assert.equal(response.status, 401);
  assert.match(response.headers.get("www-authenticate") ?? "", /^Bearer/);
});

test("HTTP handler rejects untrusted browser origins and oversized bodies", async () => {
  let authenticationCalls = 0;
  const handler = createWorldContextMcpHttpHandler({
    getMode: () => "compatibility-preview",
    admissionLimiter: createInMemoryPreviewAdmissionLimiter(),
    authority: createInMemoryPreviewAuthority(),
    async authenticate() {
      authenticationCalls += 1;
      return sessionFor();
    },
  });
  const deniedOrigin = await handler(
    jsonRpcRequest("valid", toolsListBody(), "https://attacker.example"),
  );
  assert.equal(deniedOrigin.status, 403);
  assert.equal(authenticationCalls, 0);

  const configuredCrossOrigin = await handler(
    jsonRpcRequest("valid", toolsListBody(), "https://arcanea.ai"),
  );
  assert.equal(configuredCrossOrigin.status, 403);
  assert.equal(
    configuredCrossOrigin.headers.has("access-control-allow-origin"),
    false,
  );

  const oversized = await handler(jsonRpcRequest("valid", "x".repeat(65_537)));
  assert.equal(oversized.status, 413);
});

test("HTTP handler exposes one tool and keeps concurrent actors isolated", async () => {
  const otherActor: WorldContextActor = {
    actorId: OTHER_ACTOR_ID,
    tenantId: `personal:${OTHER_ACTOR_ID}`,
  };
  const handler = createWorldContextMcpHttpHandler({
    getMode: () => "compatibility-preview",
    admissionLimiter: createInMemoryPreviewAdmissionLimiter(),
    authority: createInMemoryPreviewAuthority(),
    async authenticate(request) {
      return request.headers.get("authorization") === "Bearer actor-two"
        ? sessionFor(otherActor)
        : sessionFor(actor);
    },
  });

  const listResponse = await handler(
    jsonRpcRequest("actor-one", toolsListBody()),
  );
  assert.equal(listResponse.status, 200);
  const listPayload = await listResponse.json();
  assert.deepEqual(
    listPayload.result.tools.map((tool: { name: string }) => tool.name),
    ["arcanea_get_world_context"],
  );
  assert.deepEqual(
    listPayload.result.tools[0].inputSchema.properties.includeStates.default,
    ["source"],
  );

  function callBody(requestedActor: WorldContextActor) {
    const entityId =
      requestedActor.actorId === ACTOR_ID
        ? "30000000-0000-4000-8000-000000000001"
        : "30000000-0000-4000-8000-000000000002";
    return {
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "tools/call",
      params: {
        name: "arcanea_get_world_context",
        arguments: {
          worldId: WORLD_ID,
          query: "Selected creator character",
          queryMode: "relevant-context",
          purpose: "creator-question",
          filters: {
            entityTypes: ["character"],
            entityIds: [entityId],
            sourceIds: [],
          },
          includeStates: ["source"],
          maxEntities: 10,
          visibilityScope: "authorized",
        },
      },
    };
  }

  const [firstResponse, secondResponse] = await Promise.all([
    handler(jsonRpcRequest("actor-one", callBody(actor))),
    handler(jsonRpcRequest("actor-two", callBody(otherActor))),
  ]);
  const [first, second] = await Promise.all([
    firstResponse.json(),
    secondResponse.json(),
  ]);
  assert.equal(first.result.structuredContent.entities[0].name, "Alera");
  assert.equal(second.result.structuredContent.entities[0].name, "Orin");
  assert.notEqual(
    first.result.structuredContent.access.grantId,
    second.result.structuredContent.access.grantId,
  );

  const omittedStatesBody = callBody(actor);
  delete (omittedStatesBody.params.arguments as { includeStates?: string[] })
    .includeStates;
  const omittedStatesResponse = await handler(
    jsonRpcRequest("actor-one", omittedStatesBody),
  );
  const omittedStatesPayload = await omittedStatesResponse.json();
  assert.equal(omittedStatesPayload.result.isError, undefined);
  assert.deepEqual(
    omittedStatesPayload.result.structuredContent.coverage.requestedStates,
    ["source"],
  );
});

test("HTTP admission limiter bounds non-owner world cycling before repository work", async () => {
  let repositoryCalls = 0;
  const handler = createWorldContextMcpHttpHandler({
    getMode: () => "compatibility-preview",
    admissionLimiter: createInMemoryPreviewAdmissionLimiter({
      maximumActorRequestsPerWindow: 2,
      clock: () => new Date("2026-08-25T10:00:00.000Z"),
    }),
    authority: createInMemoryPreviewAuthority(),
    async authenticate() {
      return {
        actor,
        repository: {
          async loadAuthorizedSnapshot() {
            repositoryCalls += 1;
            throw new GatewayError("world-not-found");
          },
        },
      };
    },
  });
  const requestForWorld = (worldId: string) => ({
    jsonrpc: "2.0",
    id: crypto.randomUUID(),
    method: "tools/call",
    params: {
      name: "arcanea_get_world_context",
      arguments: {
        worldId,
        query: "Selected creator character",
        queryMode: "relevant-context",
        purpose: "creator-question",
        filters: {
          entityTypes: ["character"],
          entityIds: ["30000000-0000-4000-8000-000000000001"],
          sourceIds: [],
        },
        includeStates: ["source"],
        maxEntities: 10,
        visibilityScope: "authorized",
      },
    },
  });

  for (let index = 1; index <= 2; index += 1) {
    const response = await handler(
      jsonRpcRequest(
        "actor-one",
        requestForWorld(`10000000-0000-4000-8000-00000000000${index}`),
      ),
    );
    assert.equal(response.status, 200);
  }
  const blocked = await handler(
    jsonRpcRequest(
      "actor-one",
      requestForWorld("10000000-0000-4000-8000-000000000003"),
    ),
  );
  assert.equal(blocked.status, 429);
  assert.equal(blocked.headers.get("retry-after"), "60");
  assert.equal(repositoryCalls, 2);
});
