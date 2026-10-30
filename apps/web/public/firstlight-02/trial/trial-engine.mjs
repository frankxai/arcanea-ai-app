/**
 * Firstlight / The Severed Crossing.
 * A deterministic, local simulation. No models, tools, network, or credentials.
 * The producer, delivery receipt and verifier are deliberately distinct roles.
 */

export const ENGINE_VERSION = "firstlight-trial/1.0.0";
export const DEFAULT_SEED = 73026;
export const DEFAULT_BUDGET = 10;

export const ACTIONS = Object.freeze([
  {
    kind: "sense",
    name: "Read the weather",
    character: "seli",
    role: "Seli",
    cost: 1,
    requires: [],
  },
  {
    kind: "plan",
    name: "Map the crossing",
    character: "tovan",
    role: "Tovan",
    cost: 1,
    requires: ["sense"],
  },
  {
    kind: "scout",
    name: "Recover the lantern",
    character: "aven",
    role: "Aven",
    cost: 2,
    requires: ["plan"],
  },
  {
    kind: "handoff",
    name: "Bind the handoff",
    character: "orra",
    role: "Orra",
    cost: 1,
    requires: ["scout"],
  },
  {
    kind: "repair",
    name: "Mend the severed thread",
    character: "orra",
    role: "Orra",
    cost: 1,
    requires: ["handoff"],
  },
  {
    kind: "craft",
    name: "Build the signal",
    character: "caelis",
    role: "Caelis",
    cost: 2,
    requires: ["handoff"],
  },
  {
    kind: "verify",
    name: "Verify the light",
    character: "velis",
    role: "Velis",
    cost: 1,
    requires: ["craft"],
  },
]);

const POLICIES = new Set(["loose", "sealed"]);
const byKind = new Map(ACTIONS.map((action) => [action.kind, action]));
const clone = (value) => JSON.parse(JSON.stringify(value));

function validInteger(value, min, max) {
  return Number.isSafeInteger(value) && value >= min && value <= max;
}

function digest(seed, suffix) {
  // An identity fixture, not a security digest. Production adapters use SHA-256.
  let value = seed >>> 0;
  for (const char of suffix)
    value = Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0;
  return `fixture:${value.toString(16).padStart(8, "0")}`;
}

export function createTrial({
  seed = DEFAULT_SEED,
  budget = DEFAULT_BUDGET,
  handoffPolicy = "sealed",
} = {}) {
  if (!validInteger(seed, 0, 0xffffffff))
    throw new TypeError("seed must be an integer from 0 to 4294967295");
  if (!validInteger(budget, 0, 100))
    throw new TypeError("budget must be an integer from 0 to 100");
  if (!POLICIES.has(handoffPolicy))
    throw new TypeError("unknown handoff policy");
  return {
    version: ENGINE_VERSION,
    seed,
    budget,
    handoffPolicy,
    spent: 0,
    status: "playing",
    completed: [],
    requests: [],
    detectedFault: false,
    repairAttempts: 0,
    source: null,
    receipt: null,
    artifact: null,
    acceptance: null,
    log: [
      {
        kind: "start",
        role: "Expedition",
        message:
          "Kethr has severed one delivery thread. Bring a verified signal across the pass.",
      },
    ],
  };
}

export function expectedSource(state) {
  return {
    id: `lantern-${state.seed}`,
    revision: "r1",
    digest: digest(state.seed, "lantern-r1"),
  };
}

function deny(state, code, message) {
  return { state, ok: false, code, message };
}

/** A verifier checks source identity; it never trusts the producer's success flag. */
export function verifyArtifact(state, artifact = state.artifact) {
  const expected = expectedSource(state);
  const findings = [];
  if (!artifact || artifact.producer !== "caelis")
    findings.push("Missing craft artifact from Caelis.");
  if (artifact?.id !== `signal-${state.seed}-1`)
    findings.push("The artifact identity does not match this expedition.");
  if (
    artifact?.sourceId !== expected.id ||
    artifact?.sourceRevision !== expected.revision ||
    artifact?.sourceDigest !== expected.digest
  ) {
    findings.push("The signal refers to a substituted source.");
  }
  if (
    artifact?.reviewer === artifact?.producer ||
    artifact?.reviewer !== "velis"
  )
    findings.push("Producer and verifier must be distinct.");
  if (state.handoffPolicy === "sealed") {
    if (
      state.receipt?.issuer !== "orra" ||
      state.receipt?.sourceId !== expected.id ||
      state.receipt?.sourceRevision !== expected.revision ||
      state.receipt?.sourceDigest !== expected.digest ||
      state.receipt?.status !== "bound"
    ) {
      findings.push("A sealed delivery receipt is missing.");
    }
  }
  return {
    accepted: findings.length === 0,
    reviewer: "velis",
    rule: "expected-source-and-independent-review/1",
    artifactId: artifact?.id ?? null,
    findings,
  };
}

/** Pure transition. Replayed request IDs and already-complete actions are no-ops. */
export function act(state, { kind, requestId } = {}) {
  if (!state || state.version !== ENGINE_VERSION)
    throw new TypeError("unsupported trial state");
  if (
    typeof requestId !== "string" ||
    requestId.length < 1 ||
    requestId.length > 80
  )
    return deny(
      state,
      "invalid-request",
      "An action needs a bounded request ID.",
    );
  const previousRequest = state.requests.find(
    (request) => request.id === requestId,
  );
  if (previousRequest && previousRequest.kind !== kind)
    return deny(
      state,
      "request-conflict",
      "This request ID belongs to a different action.",
    );
  if (previousRequest)
    return {
      state,
      ok: true,
      code: "duplicate",
      message: "This delivery was already recorded; no extra cost.",
    };
  const action = byKind.get(kind);
  if (!action)
    return deny(
      state,
      "unknown-action",
      "Choose one of the expedition actions.",
    );
  if (state.status !== "playing")
    return deny(
      state,
      "finished",
      "The trial is finished. Start another expedition.",
    );
  if (state.completed.includes(kind))
    return {
      state,
      ok: true,
      code: "complete",
      message: "That work is already complete; no extra cost.",
    };
  if (action.requires.some((required) => !state.completed.includes(required)))
    return deny(
      state,
      "dependency",
      "Complete the earlier expedition work first.",
    );
  if (kind === "repair" && !state.detectedFault)
    return deny(state, "no-fault", "No torn receipt has been detected.");
  if (kind === "repair" && state.repairAttempts >= 1)
    return deny(state, "retry-limit", "This expedition allows one recovery.");
  if (
    kind === "craft" &&
    state.handoffPolicy === "sealed" &&
    state.receipt?.status !== "bound"
  )
    return deny(
      state,
      "unbound-source",
      "Orra must mend the source thread before Caelis can build.",
    );
  if (state.spent + action.cost > state.budget)
    return deny(
      state,
      "budget",
      "The shared light reserve cannot cover this action. Reset to try a different sequence.",
    );

  const next = clone(state);
  next.spent += action.cost;
  next.completed.push(kind);
  next.requests.push({ id: requestId, kind });
  let message;
  switch (kind) {
    case "sense":
      message =
        "Seli hears the seam in the storm: the delivery thread is vulnerable.";
      break;
    case "plan":
      message =
        "Tovan maps one route: source, handoff, craft, then independent review.";
      break;
    case "scout": {
      const source = expectedSource(next);
      next.source = {
        ...source,
        digest: digest(next.seed, "substituted-lantern"),
        recoveredBy: "aven",
      };
      message =
        "Aven brings a lantern through the pass. Kethr has substituted its source mark.";
      break;
    }
    case "handoff": {
      if (next.handoffPolicy === "sealed") {
        next.detectedFault = next.source.digest !== expectedSource(next).digest;
        next.receipt = {
          issuer: "orra",
          sourceId: next.source.id,
          sourceRevision: next.source.revision,
          sourceDigest: next.source.digest,
          status: next.detectedFault ? "torn" : "bound",
        };
        message = next.detectedFault
          ? "Orra catches a torn receipt before it reaches the workbench. One repair will restore the original."
          : "Orra binds the source to its delivery receipt.";
      } else {
        next.receipt = {
          issuer: "orra",
          sourceId: next.source.id,
          status: "unsealed",
        };
        message =
          "The loose handoff carries a name without checking its source mark. The substitution passes unseen.";
      }
      break;
    }
    case "repair": {
      const source = expectedSource(next);
      next.repairAttempts += 1;
      next.source = { ...source, recoveredBy: "aven" };
      next.receipt = {
        issuer: "orra",
        sourceId: source.id,
        sourceRevision: source.revision,
        sourceDigest: source.digest,
        status: "bound",
      };
      message =
        "Orra reconnects the original source. The team spends one shared light, once.";
      break;
    }
    case "craft":
      next.artifact = {
        id: `signal-${next.seed}-1`,
        producer: "caelis",
        reviewer: "velis",
        sourceId: next.source.id,
        sourceRevision: next.source.revision,
        sourceDigest: next.source.digest,
        producerClaimsSuccess: true,
      };
      message =
        "Caelis assembles the signal. A beautiful result still needs a separate check.";
      break;
    case "verify":
      next.acceptance = verifyArtifact(next);
      next.status = next.acceptance.accepted ? "accepted" : "rejected";
      message = next.acceptance.accepted
        ? "Velis verifies the source, receipt and maker. The crossing lights. Pelora opens the sheltered tideway."
        : "Velis refuses the substituted source. The signal looks complete, but the evidence fails.";
      break;
  }
  next.log.push({
    kind,
    role: action.role,
    message,
    cost: action.cost,
    spent: next.spent,
  });
  return { state: next, ok: true, code: next.status, message };
}

export function availableActions(state) {
  return ACTIONS.filter((action) => {
    if (state.status !== "playing" || state.completed.includes(action.kind))
      return false;
    if (action.requires.some((required) => !state.completed.includes(required)))
      return false;
    if (action.kind === "repair")
      return state.detectedFault && state.repairAttempts < 1;
    if (action.kind === "craft" && state.handoffPolicy === "sealed")
      return state.receipt?.status === "bound";
    return true;
  });
}

/** Same controller in both arms; the contract is the only changed setting. */
export function runPolicy(config = {}) {
  let state = createTrial(config);
  let sequence = 0;
  for (const kind of ["sense", "plan", "scout", "handoff", "craft", "verify"]) {
    if (kind === "craft" && state.detectedFault) {
      const recovery = act(state, {
        kind: "repair",
        requestId: `auto-${++sequence}`,
      });
      state = recovery.state;
      if (!recovery.ok) return state;
    }
    const result = act(state, { kind, requestId: `auto-${++sequence}` });
    state = result.state;
    if (!result.ok) return state;
  }
  return state;
}

export function compareHarnesses({
  seed = DEFAULT_SEED,
  budget = DEFAULT_BUDGET,
} = {}) {
  const baseline = runPolicy({ seed, budget, handoffPolicy: "loose" });
  const sealed = runPolicy({ seed, budget, handoffPolicy: "sealed" });
  return {
    kind: "scripted-fixture-comparison",
    version: ENGINE_VERSION,
    fixed: {
      seed,
      budget,
      scenario: "severed-source",
      controller: "recover-detected-fault-then-review/1",
    },
    changedSetting: "handoffPolicy",
    baseline,
    sealed,
    limitation:
      "Local scripted mechanism test. No models, live agent runs, latency measurements or comparative model claims.",
  };
}
