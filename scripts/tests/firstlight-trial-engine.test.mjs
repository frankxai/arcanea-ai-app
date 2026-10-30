import test from "node:test";
import assert from "node:assert/strict";
import {
  ACTIONS,
  act,
  availableActions,
  compareHarnesses,
  createTrial,
  expectedSource,
  runPolicy,
  verifyArtifact,
} from "../../apps/web/public/firstlight-02/trial/trial-engine.mjs";

function advance(kinds, config) {
  let state = createTrial(config);
  for (const [index, kind] of kinds.entries()) {
    const result = act(state, { kind, requestId: `test-${index}` });
    assert.equal(result.ok, true, `${kind}: ${result.message}`);
    state = result.state;
  }
  return state;
}

test("the one-setting comparison rejects substituted evidence and accepts a recovered sealed handoff", () => {
  const result = compareHarnesses();
  assert.equal(result.changedSetting, "handoffPolicy");
  assert.equal(result.baseline.seed, result.sealed.seed);
  assert.equal(result.baseline.budget, result.sealed.budget);
  assert.equal(result.baseline.status, "rejected");
  assert.equal(result.sealed.status, "accepted");
  assert.equal(result.baseline.spent, 8);
  assert.equal(result.sealed.spent, 9);
  assert.equal(result.sealed.repairAttempts, 1);
  assert.equal(result.sealed.acceptance.reviewer, "velis");
});

test("same seed, budget and policy reproduce the full transition log", () => {
  assert.deepEqual(runPolicy({ seed: 31 }), runPolicy({ seed: 31 }));
  assert.notEqual(
    expectedSource(createTrial({ seed: 31 })).digest,
    expectedSource(createTrial({ seed: 32 })).digest,
  );
});

test("dependencies and unknown actions cannot spend the reserve or mutate state", () => {
  const initial = createTrial();
  const copy = structuredClone(initial);
  assert.equal(
    act(initial, { kind: "craft", requestId: "out-of-order" }).code,
    "dependency",
  );
  assert.equal(
    act(initial, { kind: "fly", requestId: "unknown" }).code,
    "unknown-action",
  );
  assert.deepEqual(initial, copy);
  assert.equal(initial.spent, 0);
});

test("the reserve is checked before mutation, including a zero-budget expedition", () => {
  for (const budget of [0, 8]) {
    const state =
      budget === 0
        ? createTrial({ budget })
        : advance(["sense", "plan", "scout", "handoff", "repair", "craft"], {
            budget,
          });
    const copy = structuredClone(state);
    const blocked = act(state, {
      kind: budget === 0 ? "sense" : "verify",
      requestId: "over-budget",
    });
    assert.equal(blocked.code, "budget");
    assert.deepEqual(state, copy);
    assert.ok(state.spent <= state.budget);
    assert.equal(state.acceptance, null);
  }
});

test("duplicate callbacks are free; reusing their ID for another action is a conflict", () => {
  const first = act(createTrial(), {
    kind: "sense",
    requestId: "delivery-1",
  }).state;
  const replay = act(first, { kind: "sense", requestId: "delivery-1" });
  assert.equal(replay.code, "duplicate");
  assert.strictEqual(replay.state, first);
  assert.equal(replay.state.spent, 1);
  const conflict = act(first, { kind: "plan", requestId: "delivery-1" });
  assert.equal(conflict.code, "request-conflict");
  assert.strictEqual(conflict.state, first);
});

test("already-completed work with another ID does not spend twice", () => {
  const first = act(createTrial(), { kind: "sense", requestId: "once" }).state;
  const result = act(first, { kind: "sense", requestId: "twice" });
  assert.equal(result.code, "complete");
  assert.strictEqual(result.state, first);
});

test("sealed handoff stops craft until one explicit repair binds the expected source", () => {
  const torn = advance(["sense", "plan", "scout", "handoff"]);
  assert.equal(torn.detectedFault, true);
  assert.equal(torn.receipt.status, "torn");
  assert.deepEqual(
    availableActions(torn).map((action) => action.kind),
    ["repair"],
  );
  assert.equal(
    act(torn, { kind: "craft", requestId: "premature" }).code,
    "unbound-source",
  );
  const repaired = act(torn, { kind: "repair", requestId: "mend" }).state;
  assert.equal(repaired.receipt.status, "bound");
  assert.equal(repaired.source.digest, expectedSource(repaired).digest);
  const repeated = act(repaired, { kind: "repair", requestId: "mend-again" });
  assert.equal(repeated.code, "complete");
  assert.equal(repeated.state.repairAttempts, 1);
});

test("a repair without evidence of a fault is unavailable and free", () => {
  const loose = advance(["sense", "plan", "scout", "handoff"], {
    handoffPolicy: "loose",
  });
  const result = act(loose, { kind: "repair", requestId: "speculative" });
  assert.equal(result.code, "no-fault");
  assert.strictEqual(result.state, loose);
});

test("a producer success claim cannot override source evidence or independent review", () => {
  const accepted = runPolicy();
  const wrongSource = {
    ...accepted.artifact,
    producerClaimsSuccess: true,
    sourceDigest: "fixture:forged",
  };
  assert.equal(verifyArtifact(accepted, wrongSource).accepted, false);
  assert.equal(
    verifyArtifact(accepted, { ...accepted.artifact, reviewer: "caelis" })
      .accepted,
    false,
  );
  assert.equal(verifyArtifact(accepted, null).accepted, false);
});

test("a sealed result with a forged or missing receipt cannot pass", () => {
  const accepted = runPolicy();
  assert.equal(verifyArtifact({ ...accepted, receipt: null }).accepted, false);
  assert.equal(
    verifyArtifact({
      ...accepted,
      receipt: { ...accepted.receipt, issuer: "caelis" },
    }).accepted,
    false,
  );
});

test("a receipt binds the exact source identity, revision and digest", () => {
  const accepted = runPolicy();
  for (const field of ["sourceId", "sourceRevision", "sourceDigest"]) {
    for (const value of [undefined, "", "another-source"]) {
      assert.equal(
        verifyArtifact({
          ...accepted,
          receipt: { ...accepted.receipt, [field]: value },
        }).accepted,
        false,
        `${field}=${value}`,
      );
    }
  }
});

test("an accepted artifact must retain the exact nonempty expedition identity", () => {
  const accepted = runPolicy();
  for (const id of [
    undefined,
    "",
    "another-signal",
    `signal-${accepted.seed + 1}-1`,
  ]) {
    assert.equal(
      verifyArtifact(accepted, { ...accepted.artifact, id }).accepted,
      false,
    );
  }
});

test("terminal expeditions cannot spend further or accept new work", () => {
  for (const handoffPolicy of ["sealed", "loose"]) {
    const state = runPolicy({ handoffPolicy });
    assert.deepEqual(availableActions(state), []);
    const next = act(state, { kind: "repair", requestId: "after-end" });
    assert.equal(next.code, "finished");
    assert.strictEqual(next.state, state);
  }
});

test("invalid seeds, budgets and contracts fail before a run is created", () => {
  for (const budget of [-1, 1.5, NaN, Infinity, "10", 101])
    assert.throws(() => createTrial({ budget }), TypeError);
  for (const seed of [-1, 0x100000000, NaN, "1"])
    assert.throws(() => createTrial({ seed }), TypeError);
  assert.throws(() => createTrial({ handoffPolicy: "anything" }), TypeError);
});

test("invalid request IDs cannot mutate the run", () => {
  const state = createTrial();
  for (const requestId of ["", null, 5, "a".repeat(81)]) {
    const result = act(state, { kind: "sense", requestId });
    assert.equal(result.code, "invalid-request");
    assert.strictEqual(result.state, state);
  }
});

test("every action has a unique bounded cost and a distinct stable character role", () => {
  assert.equal(
    new Set(ACTIONS.map((action) => action.kind)).size,
    ACTIONS.length,
  );
  assert.ok(
    ACTIONS.every(
      (action) => Number.isSafeInteger(action.cost) && action.cost > 0,
    ),
  );
  assert.equal(new Set(ACTIONS.map((action) => action.character)).size, 6);
});
