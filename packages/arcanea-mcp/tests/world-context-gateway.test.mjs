import assert from "node:assert/strict";
import test from "node:test";

import {
  GatewayError,
  canonicalJson,
  canonicalSha256,
  createInMemoryPreviewAuthority,
  createWorldContextGatewayServer,
  executeWorldContextQuery,
  handleStatelessWorldContextMcpRequest,
  normalizeWorldContextQuery,
  worldContextOutputSchema,
} from "../dist/gateway/index.js";

const WORLD_ID = "10000000-0000-4000-8000-000000000001";
const ACTOR_ID = "20000000-0000-4000-8000-000000000001";
const OTHER_ACTOR_ID = "20000000-0000-4000-8000-000000000002";

const actor = Object.freeze({
  actorId: ACTOR_ID,
  tenantId: `personal:${ACTOR_ID}`,
});

function source(entityId, capturedAt = "2026-08-25T09:30:00.000Z") {
  const sourceId = `row:world_entities:${entityId}`;
  return {
    sourceId,
    entityId,
    sourceKind: "creator-source",
    visibility: "private",
    sourceRecordId: entityId,
    sourceHash: canonicalSha256({ entityId, capturedAt }),
    capturedAt,
    generator: "test-fixture",
  };
}

function entity(
  entityId,
  name,
  summary,
  { entityType = "character", visibility = "private", capturedAt } = {},
) {
  const provenance = source(entityId, capturedAt);
  return {
    record: {
      entityId,
      entityType,
      name,
      state: "source",
      visibility,
      payload: {
        summary,
        facts: [{ key: "name", value: name }],
        relationIds: [WORLD_ID],
      },
      sourceIds: [provenance.sourceId],
    },
    provenance,
  };
}

function makeSnapshot({
  order = "forward",
  suffix = "",
  visibility = "private",
  actorId = ACTOR_ID,
} = {}) {
  const entries = [
    entity(
      "30000000-0000-4000-8000-000000000001",
      "Alera",
      `Keeper of ember law${suffix}`,
      {
        visibility,
      },
    ),
    entity(
      "30000000-0000-4000-8000-000000000002",
      "Orin",
      "Navigator of the glass sea",
      {
        visibility,
      },
    ),
    entity(
      "30000000-0000-4000-8000-000000000003",
      "Thal",
      "Witness of the north gate",
      {
        visibility,
      },
    ),
  ];
  if (order === "reverse") entries.reverse();

  return {
    schemaVersion: "arcanea.world-context-snapshot.v1",
    worldId: WORLD_ID,
    worldVisibility: visibility,
    effectiveVisibility: visibility,
    role: "owner",
    grantId: `owner:${WORLD_ID}:${actorId}`,
    scope: "authorized",
    availableStates: ["source"],
    entities: entries.map((entry) => entry.record),
    conflicts: [],
    provenance: entries.map((entry) => entry.provenance),
  };
}

function makeRequest(overrides = {}) {
  return {
    worldId: WORLD_ID,
    query: "Show Alera for the current canon review",
    queryMode: "relevant-context",
    purpose: "canon-review",
    filters: {
      entityTypes: ["character"],
      entityIds: ["30000000-0000-4000-8000-000000000001"],
      sourceIds: [],
    },
    includeStates: ["source"],
    maxEntities: 40,
    visibilityScope: "authorized",
    ...overrides,
  };
}

function repositoryFor(snapshot = makeSnapshot()) {
  return {
    async loadAuthorizedSnapshot({
      actor: requestedActor,
      worldId,
      visibilityScope,
    }) {
      if (requestedActor.actorId !== ACTOR_ID || worldId !== WORLD_ID) {
        throw new GatewayError("world-not-found");
      }
      if (
        visibilityScope === "public-only" &&
        snapshot.worldVisibility !== "public"
      ) {
        throw new GatewayError("visibility-denied");
      }
      return {
        ...snapshot,
        scope: visibilityScope,
        effectiveVisibility:
          visibilityScope === "public-only"
            ? "public"
            : snapshot.worldVisibility,
      };
    },
  };
}

function deps(snapshot = makeSnapshot(), auditEvents = []) {
  return {
    actor,
    repository: repositoryFor(snapshot),
    authority: createInMemoryPreviewAuthority({
      clock: () => new Date("2026-08-25T10:00:00.000Z"),
    }),
    audit: {
      record(event) {
        auditEvents.push(event);
      },
    },
  };
}

async function expectGatewayError(promise, code) {
  await assert.rejects(promise, (error) => {
    assert.ok(error instanceof GatewayError);
    assert.equal(error.code, code);
    return true;
  });
}

test("RFC 8785 canonicalization and SHA-256 are deterministic", () => {
  assert.equal(
    canonicalJson({ numbers: [333333333.33333329, 1e30, 4.5, 2e-3, 1e-27] }),
    '{"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27]}',
  );
  assert.equal(canonicalJson({ b: 1, a: 2 }), '{"a":2,"b":1}');
  assert.match(canonicalSha256({ b: 1, a: 2 }), /^sha256:[a-f0-9]{64}$/);
  assert.equal(
    canonicalSha256({ b: 1, a: 2 }),
    canonicalSha256({ a: 2, b: 1 }),
  );
  assert.throws(() => canonicalJson({ invalid: Number.NaN }), /Non-finite/);
  assert.throws(() => canonicalJson({ invalid: "\ud800" }), /Unicode scalar/);
});

test("query normalization uses NFKC, lowercase, and collapsed whitespace", () => {
  assert.equal(
    normalizeWorldContextQuery("  ＡＬＥＲＡ\n  Ember\tLaw  "),
    "alera ember law",
  );
});

test("owner receives bounded private source context with valid provenance", async () => {
  const output = await executeWorldContextQuery(makeRequest(), deps());
  worldContextOutputSchema.parse(output);

  assert.equal(output.access.role, "owner");
  assert.equal(output.access.worldVisibility, "private");
  assert.equal(output.entities.length, 1);
  assert.equal(output.entities[0].name, "Alera");
  assert.deepEqual(output.coverage.availableStates, ["source"]);
  assert.equal(output.provenance[0].entityId, output.entities[0].entityId);
  assert.ok(
    output.entities[0].sourceIds.includes(output.provenance[0].sourceId),
  );
});

test("absent and unauthorized worlds share the same failure", async () => {
  const otherActorDeps = {
    ...deps(),
    actor: { actorId: OTHER_ACTOR_ID, tenantId: `personal:${OTHER_ACTOR_ID}` },
  };
  await expectGatewayError(
    executeWorldContextQuery(makeRequest(), otherActorDeps),
    "world-not-found",
  );
  await expectGatewayError(
    executeWorldContextQuery(
      makeRequest({ worldId: "10000000-0000-4000-8000-000000000099" }),
      deps(),
    ),
    "world-not-found",
  );
});

test("malformed world IDs are rejected before repository access", async () => {
  let repositoryCalls = 0;
  await assert.rejects(
    executeWorldContextQuery(makeRequest({ worldId: "world-1" }), {
      ...deps(),
      repository: {
        async loadAuthorizedSnapshot() {
          repositoryCalls += 1;
          throw new GatewayError("world-not-found");
        },
      },
    }),
  );
  assert.equal(repositoryCalls, 0);
});

test("public-only fails closed for a private world", async () => {
  await expectGatewayError(
    executeWorldContextQuery(
      makeRequest({ visibilityScope: "public-only" }),
      deps(),
    ),
    "visibility-denied",
  );
});

test("unavailable requested states fail closed instead of implying empty coverage", async () => {
  await expectGatewayError(
    executeWorldContextQuery(
      makeRequest({ includeStates: ["source", "accepted"] }),
      deps(),
    ),
    "state-coverage-unavailable",
  );
});

test("inventory requests and selector-free requests are denied", async () => {
  await expectGatewayError(
    executeWorldContextQuery(
      makeRequest({ query: "Return every record" }),
      deps(),
    ),
    "query-too-broad",
  );
  await expectGatewayError(
    executeWorldContextQuery(
      makeRequest({
        filters: { entityTypes: ["character"], entityIds: [], sourceIds: [] },
      }),
      deps(),
    ),
    "query-too-broad",
  );
});

test("snapshot revision ignores row order and query filtering but changes with content", async () => {
  const forward = await executeWorldContextQuery(
    makeRequest(),
    deps(makeSnapshot()),
  );
  const reverse = await executeWorldContextQuery(
    makeRequest({ query: "Different bounded job" }),
    deps(makeSnapshot({ order: "reverse" })),
  );
  const changed = await executeWorldContextQuery(
    makeRequest(),
    deps(makeSnapshot({ suffix: " changed" })),
  );

  assert.equal(forward.revision, reverse.revision);
  assert.notEqual(
    forward.queryReceipt.contextRequestHash,
    reverse.queryReceipt.contextRequestHash,
  );
  assert.notEqual(forward.revision, changed.revision);
});

test("selection never expands beyond exact entity/source selectors", async () => {
  const sourceId = source("30000000-0000-4000-8000-000000000002").sourceId;
  const output = await executeWorldContextQuery(
    makeRequest({
      query: "Alera Orin Thal everything nearby",
      filters: { entityTypes: [], entityIds: [], sourceIds: [sourceId] },
    }),
    deps(),
  );
  assert.deepEqual(
    output.entities.map((item) => item.name),
    ["Orin"],
  );
});

test("limits and truncation are deterministic", async () => {
  const ids = [
    "30000000-0000-4000-8000-000000000001",
    "30000000-0000-4000-8000-000000000002",
    "30000000-0000-4000-8000-000000000003",
  ];
  const output = await executeWorldContextQuery(
    makeRequest({
      query: "world characters",
      filters: { entityTypes: ["character"], entityIds: ids, sourceIds: [] },
      maxEntities: 2,
    }),
    deps(makeSnapshot({ order: "reverse" })),
  );
  assert.equal(output.entities.length, 2);
  assert.equal(output.coverage.truncated, true);
  assert.deepEqual(
    output.entities.map((item) => item.entityId),
    ids.slice(0, 2),
  );
});

test("worst-case multibyte context stays within the hosted response budget", async () => {
  const entries = Array.from({ length: 64 }, (_, index) => {
    const suffix = String(index + 1).padStart(3, "0");
    const entityId = `entity-${suffix}`;
    const provenance = source(entityId);
    return {
      record: {
        entityId,
        entityType: "character",
        name: `Character ${suffix}`,
        state: "source",
        visibility: "private",
        payload: {
          summary: "界".repeat(8_000),
          facts: Array.from({ length: 32 }, (_, factIndex) => ({
            key: `fact-${String(factIndex).padStart(2, "0")}`,
            value: "界".repeat(2_000),
          })),
          relationIds: [WORLD_ID],
        },
        sourceIds: [provenance.sourceId],
      },
      provenance,
    };
  });
  const snapshot = {
    ...makeSnapshot(),
    entities: entries.map((entry) => entry.record),
    provenance: entries.map((entry) => entry.provenance),
  };
  const argumentsValue = makeRequest({
    query: "Selected multilingual creator characters",
    filters: {
      entityTypes: ["character"],
      entityIds: entries.slice(0, 32).map((entry) => entry.record.entityId),
      sourceIds: entries.slice(32).map((entry) => entry.provenance.sourceId),
    },
    maxEntities: 100,
  });
  const response = await handleStatelessWorldContextMcpRequest(
    mcpRequest("tools/call", {
      name: "arcanea_get_world_context",
      arguments: argumentsValue,
    }),
    deps(snapshot),
  );
  assert.equal(response.status, 200);
  const wireBody = await response.text();
  const wireBytes = new TextEncoder().encode(wireBody).byteLength;
  assert.ok(wireBytes <= 1_100_000, `wire response was ${wireBytes} bytes`);
  const payload = JSON.parse(wireBody);
  assert.equal(payload.result.structuredContent.coverage.truncated, true);
  assert.ok(payload.result.structuredContent.entities.length < 64);
  assert.ok(payload.result.content[0].text.length < 512);
  assert.equal(payload.result.content[0].text.includes("界"), false);
});

test("authority binding substitution fails closed", async () => {
  const authority = createInMemoryPreviewAuthority({
    clock: () => new Date("2026-08-25T10:00:00.000Z"),
  });
  const maliciousAuthority = {
    async authorize(input) {
      const record = await authority.authorize(input);
      return { ...record, membershipGrantId: "owner:substituted" };
    },
  };
  await expectGatewayError(
    executeWorldContextQuery(makeRequest(), {
      ...deps(),
      authority: maliciousAuthority,
    }),
    "context-grant-mismatch",
  );
});

test("snapshot identity, state, and provenance partitions fail closed", async () => {
  const duplicateEntitySnapshot = makeSnapshot();
  duplicateEntitySnapshot.entities.push(duplicateEntitySnapshot.entities[0]);
  await expectGatewayError(
    executeWorldContextQuery(makeRequest(), deps(duplicateEntitySnapshot)),
    "context-world-mismatch",
  );

  const orphanProvenanceSnapshot = makeSnapshot();
  orphanProvenanceSnapshot.provenance.push({
    ...orphanProvenanceSnapshot.provenance[0],
    sourceId: "row:world_entities:orphan",
    entityId: "30000000-0000-4000-8000-000000000099",
  });
  await expectGatewayError(
    executeWorldContextQuery(makeRequest(), deps(orphanProvenanceSnapshot)),
    "context-provenance-unresolved",
  );

  const statePartitionSnapshot = makeSnapshot();
  statePartitionSnapshot.entities[0] = {
    ...statePartitionSnapshot.entities[0],
    state: "proposal",
  };
  await expectGatewayError(
    executeWorldContextQuery(makeRequest(), deps(statePartitionSnapshot)),
    "context-state-partition-mismatch",
  );
});

test("preview authority enforces the twenty-request actor/world window", async () => {
  const authority = createInMemoryPreviewAuthority({
    clock: () => new Date("2026-08-25T10:00:00.000Z"),
  });
  const requestDependencies = { ...deps(), authority };
  for (let index = 0; index < 20; index += 1) {
    await executeWorldContextQuery(makeRequest(), requestDependencies);
  }
  await expectGatewayError(
    executeWorldContextQuery(makeRequest(), requestDependencies),
    "context-query-rate-limited",
  );
});

test("audit receipts never contain raw query, token, or private payload", async () => {
  const events = [];
  await executeWorldContextQuery(makeRequest(), deps(makeSnapshot(), events));
  const serialized = JSON.stringify(events);
  assert.ok(events.length > 0);
  assert.equal(serialized.includes(makeRequest().query), false);
  assert.equal(serialized.includes("Keeper of ember law"), false);
  assert.equal(serialized.toLowerCase().includes("bearer"), false);
  assert.equal(serialized.toLowerCase().includes("token"), false);
});

function mcpRequest(method, params) {
  return new Request("https://gateway.arcanea.ai/api/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      "mcp-protocol-version": "2025-06-18",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method,
      params,
    }),
  });
}

test("fresh stateless MCP server exposes exactly one read-only tool", async () => {
  const initializeResponse = await handleStatelessWorldContextMcpRequest(
    mcpRequest("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "arcanea-gateway-test", version: "1.0.0" },
    }),
    deps(),
  );
  assert.equal(initializeResponse.status, 200);
  const initializePayload = await initializeResponse.json();
  assert.equal(
    initializePayload.result.serverInfo.name,
    "arcanea-world-context-gateway",
  );

  const response = await handleStatelessWorldContextMcpRequest(
    mcpRequest("tools/list", {}),
    deps(),
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(
    payload.result.tools.map((tool) => tool.name),
    ["arcanea_get_world_context"],
  );
  assert.deepEqual(payload.result.tools[0].annotations, {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
    idempotentHint: true,
  });
});

test("stateless transport refuses GET and DELETE without opening SSE", async () => {
  for (const method of ["GET", "DELETE"]) {
    const response = await handleStatelessWorldContextMcpRequest(
      new Request("https://gateway.arcanea.ai/api/mcp", { method }),
      deps(),
    );
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "POST");
  }
});

test("stateless MCP tool call returns schema-valid structured content", async () => {
  const response = await handleStatelessWorldContextMcpRequest(
    mcpRequest("tools/call", {
      name: "arcanea_get_world_context",
      arguments: makeRequest(),
    }),
    deps(),
  );
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.result.isError, undefined);
  worldContextOutputSchema.parse(payload.result.structuredContent);
});

test("server factory never returns the legacy singleton", () => {
  const first = createWorldContextGatewayServer(deps());
  const second = createWorldContextGatewayServer(deps());
  assert.notEqual(first, second);
});
