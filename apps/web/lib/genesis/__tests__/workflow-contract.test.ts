import assert from "node:assert/strict";
import {
  GENESIS_PROOF_WORKFLOW_STEPS,
  assertGenesisProofWorkflowPacketSafe,
  buildGenesisProofWorkflowPacket,
  normalizeGenesisProofWorkflowInput,
} from "../workflow-contract";

const rawIntent =
  "A studio keeps losing the thread between AI experiments, source material, and publishable proof. Build a world packet that remembers what was promised.";

const packet = buildGenesisProofWorkflowPacket({
  intent: rawIntent,
  driftFace: "creative-amnesia",
  missionLane: "publishing",
  sourceRoute: "/genesis?prompt=should-not-survive",
  actor: {
    userId: "user-secret-123",
    sessionId: "session-secret-456",
  },
});

assert.equal(packet.schemaVersion, "arcanea.genesis-proof-workflow.v0.1");
assert.equal(packet.status, "contract_ready");
assert.equal(packet.input.sourceRoute, "/genesis");
assert.equal(packet.input.driftFace, "creative-amnesia");
assert.equal(packet.input.missionLane, "publishing");
assert.equal(packet.metrics.event, "genesis_workflow_contract_created");
assert.deepEqual(packet.metrics.steps, [...GENESIS_PROOF_WORKFLOW_STEPS]);
assert.equal(packet.metrics.exportFileCount, packet.proof.repoExport.files.length);
assert.equal(packet.runtimeGate.runtimeCodeAllowed, false);
assert.equal(packet.runtimeGate.workflowPackageRequired, true);
assert.equal(packet.runtimeGate.workflowDocsRequired, true);
assert.equal(packet.runtimeGate.eveDocsRequired, true);
assert.equal(assertGenesisProofWorkflowPacketSafe(packet), true);

const metricsPayload = JSON.stringify(packet.metrics);
assert.equal(metricsPayload.includes(rawIntent), false);
assert.equal(metricsPayload.includes("user-secret-123"), false);
assert.equal(metricsPayload.includes("session-secret-456"), false);

const normalizedFallback = normalizeGenesisProofWorkflowInput({
  intent: "  ",
  driftFace: "bad-drift" as never,
  missionLane: "bad-lane" as never,
  sourceRoute: "https://external.example/prompt",
});

assert.equal(normalizedFallback.driftFace, "synthetic-confusion");
assert.equal(normalizedFallback.missionLane, "world");
assert.equal(normalizedFallback.sourceRoute, "/genesis");
assert.ok(normalizedFallback.intent.length > 0);

assert.ok(packet.proof.repoExport.files.some((file) => file.path === "world.arcanea.json"));
assert.ok(packet.proof.repoExport.files.some((file) => file.path === "rights/review-checklist.md"));
assert.ok(packet.steps.every((step) => step.safety.length > 0));
