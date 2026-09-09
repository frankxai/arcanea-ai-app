// Pure, deterministic encounter model. No DOM, clock, network or storage access.
export const CISTERNS = Object.freeze(["Harbor", "Aqueduct", "Family dock"]);
export const CAPACITY = 10;
export const WATER_TOTAL = 12;
export const HOLD_MS = 12_000;
export const STEP_MS = 100;
const EDGES = [
  [0, 1],
  [1, 2],
  [2, 0],
];
const POSITIONS = ["refuge", "0", "1", "2"];
const SOURCE = Object.freeze({
  repository: "frankxai/arcanea-agent-skills",
  revision: "515f19cc0b0a684766b211a07ac771118559b214",
  path: "plugins/arcanea-world-atlas/data/bosses.json",
  record: "orthea",
  canonState: "proposal",
  visibility: "restricted",
});

export function createEncounter({ extendedCues = false } = {}) {
  return {
    version: 1,
    water: [9, 2, 1],
    lostWater: 0,
    opened: [false, false, false],
    position: "refuge",
    phase: 1,
    pinned: false,
    progressMs: 0,
    elapsedMs: 0,
    falls: 0,
    extendedCues: Boolean(extendedCues),
    outcome: null,
    attack: { stage: "recovery", remainingMs: 3000, target: null, sequence: 0 },
    message:
      "Open two sluices to reconnect the harbor. The perimeter refuge is always safe.",
  };
}

export function balanced(state) {
  return state.water.every((value) => value >= 3 && value <= 5);
}

function edgeBetween(from, to) {
  return EDGES.findIndex((edge) => edge.includes(from) && edge.includes(to));
}

export function actionBlocker(state, action) {
  if (!action || typeof action !== "object")
    return "Choose an encounter action.";
  if (state.outcome)
    return "This encounter is complete. Export it or begin again.";
  switch (action.type) {
    case "move":
      return POSITIONS.includes(action.position)
        ? null
        : "That route does not exist.";
    case "open": {
      const index = Number(state.position);
      if (state.position === "refuge")
        return "Move to a causeway to operate its wheel.";
      return state.opened[index] ? "This sluice is already open." : null;
    }
    case "transfer": {
      if (state.phase < 2)
        return "Open two sluices before redistributing water.";
      if (state.pinned)
        return "The counterweight is pinned; the network is holding steady.";
      const { from, to } = action;
      if (
        ![from, to].every(
          (value) => Number.isInteger(value) && value >= 0 && value < 3,
        ) ||
        from === to
      )
        return "Choose two different cisterns.";
      if (state.position !== String(from))
        return `Move to the ${CISTERNS[from]} wheel first.`;
      if (!state.opened[edgeBetween(from, to)])
        return "Open the sluice that connects these cisterns first.";
      if (state.water[from] === 0) return "The source cistern is empty.";
      if (state.water[to] === CAPACITY) return "The receiving cistern is full.";
      return null;
    }
    case "pin":
      if (state.position !== "refuge")
        return "The counterweight capstan is at the perimeter refuge.";
      if (state.pinned) return "The counterweight is already pinned.";
      if (!state.opened.every(Boolean))
        return "Open all three sluices, including the family dock.";
      return balanced(state)
        ? null
        : "Bring each cistern into the safe band of 3–5 units.";
    case "break-seal":
      if (state.position !== "refuge")
        return "The emergency release is at the refuge.";
      if (state.phase < 2)
        return "Inspect and reconnect the network before choosing an ending.";
      return null;
    default:
      return "Unknown encounter action.";
  }
}

export function act(state, action) {
  const blocked = actionBlocker(state, action);
  if (blocked) return { ...state, message: blocked };
  const next = structuredClone(state);
  switch (action.type) {
    case "move":
      next.position = action.position;
      next.message =
        action.position === "refuge"
          ? "You reach the safe perimeter and counterweight capstan."
          : `You reach the ${CISTERNS[Number(action.position)]} wheel.`;
      break;
    case "open": {
      const index = Number(state.position);
      next.opened[index] = true;
      const [from, to] = EDGES[index];
      next.message =
        index === 2
          ? "The family dock is open. Mara’s private passage now serves the harbor."
          : `${CISTERNS[from]} and ${CISTERNS[to]} are connected. Water can pass both ways.`;
      if (next.opened.filter(Boolean).length >= 2 && next.phase === 1) {
        next.phase = 2;
        next.message +=
          " Redistribute the twelve units; none can appear or disappear.";
      }
      break;
    }
    case "transfer":
      next.water[action.from] -= 1;
      next.water[action.to] += 1;
      next.message = `One unit moved from ${CISTERNS[action.from]} to ${CISTERNS[action.to]}.`;
      break;
    case "pin":
      next.pinned = true;
      next.phase = 3;
      next.message =
        "The weight is pinned. Hold the family-dock wheel for twelve cumulative seconds; retreat from marked footfalls.";
      break;
    case "break-seal":
      next.lostWater = WATER_TOTAL;
      next.water = [0, 0, 0];
      next.pinned = false;
      next.phase = 4;
      next.outcome = "reserve-lost";
      next.message =
        "Orthea stops. The harbor survives, but the clean reserve is gone. Rationing is the next chapter.";
      break;
  }
  return next;
}

/** Fixed 100ms simulation steps make pause, replay and offline tests identical. */
export function advance(state, milliseconds = STEP_MS) {
  if (
    !Number.isInteger(milliseconds) ||
    milliseconds < 0 ||
    milliseconds > 60_000 ||
    milliseconds % STEP_MS
  )
    throw new RangeError("Advance time in 100ms steps, up to one minute.");
  let next = structuredClone(state);
  for (
    let remaining = milliseconds;
    remaining > 0 && !next.outcome;
    remaining -= STEP_MS
  ) {
    next.elapsedMs += STEP_MS;
    next.attack.remainingMs -= STEP_MS;
    if (next.attack.remainingMs <= 0) {
      if (next.attack.stage === "recovery") {
        next.attack.stage = "windup";
        next.attack.remainingMs = next.extendedCues ? 2600 : 1700;
        next.attack.target =
          next.position === "refuge"
            ? next.attack.sequence % 3
            : Number(next.position);
        next.attack.sequence += 1;
        next.message = `Stone dust marks ${CISTERNS[next.attack.target]}. Leave that causeway before the foot lands.`;
      } else {
        if (next.position === String(next.attack.target)) {
          next.position = "refuge";
          next.falls += 1;
          next.message =
            "The footfall forces you back to the refuge. Open sluices, water and lowering progress are preserved.";
        } else {
          next.message =
            "The foot lands on the marked causeway. The recovery window is open.";
        }
        next.attack = {
          ...next.attack,
          stage: "recovery",
          remainingMs: 2100,
          target: null,
        };
      }
    }
    if (
      next.phase === 3 &&
      next.position === "2" &&
      next.pinned &&
      balanced(next)
    ) {
      next.progressMs = Math.min(HOLD_MS, next.progressMs + STEP_MS);
      if (next.progressMs === HOLD_MS) {
        next.phase = 4;
        next.outcome = "supply-saved";
        next.message =
          "Orthea kneels into its cradle. The twelve units remain clean. Someone must keep the family dock open.";
      }
    }
  }
  return next;
}

export function validateState(state) {
  const errors = [];
  const integer = (value, min, max) =>
    Number.isSafeInteger(value) && value >= min && value <= max;
  if (!state || typeof state !== "object" || Array.isArray(state))
    return ["Missing encounter state."];
  if (state.version !== 1) errors.push("Unsupported encounter version.");
  const waterValid =
    Array.isArray(state.water) &&
    state.water.length === 3 &&
    state.water.every((v) => integer(v, 0, CAPACITY));
  const openedValid =
    Array.isArray(state.opened) &&
    state.opened.length === 3 &&
    state.opened.every((v) => typeof v === "boolean");
  if (
    !waterValid ||
    !integer(state.lostWater, 0, WATER_TOTAL) ||
    (waterValid &&
      state.water.reduce((a, b) => a + b, state.lostWater) !== WATER_TOTAL)
  )
    errors.push("Water conservation or capacity is invalid.");
  if (!openedValid) errors.push("Invalid sluice states.");
  if (!POSITIONS.includes(state.position)) errors.push("Invalid position.");
  if (!integer(state.phase, 1, 4)) errors.push("Invalid phase.");
  if (
    typeof state.pinned !== "boolean" ||
    typeof state.extendedCues !== "boolean"
  )
    errors.push("Invalid control state.");
  if (
    !integer(state.progressMs, 0, HOLD_MS) ||
    state.progressMs % STEP_MS ||
    !integer(state.elapsedMs, 0, Number.MAX_SAFE_INTEGER) ||
    state.elapsedMs % STEP_MS ||
    !integer(state.falls, 0, Number.MAX_SAFE_INTEGER)
  )
    errors.push("Invalid time or recovery count.");
  if (typeof state.message !== "string" || state.message.length > 1000)
    errors.push("Invalid status message.");
  const attack = state.attack;
  if (
    !attack ||
    !["recovery", "windup"].includes(attack.stage) ||
    !integer(
      attack.remainingMs,
      STEP_MS,
      attack.stage === "recovery" ? 3000 : state.extendedCues ? 2600 : 1700,
    ) ||
    attack.remainingMs % STEP_MS ||
    !integer(attack.sequence, 0, Number.MAX_SAFE_INTEGER) ||
    (attack.stage === "recovery"
      ? attack.target !== null
      : !integer(attack.target, 0, 2))
  )
    errors.push("Invalid footfall state.");
  if (
    state.outcome !== null &&
    !["supply-saved", "reserve-lost"].includes(state.outcome)
  )
    errors.push("Unknown ending.");
  if ((state.phase === 4) !== Boolean(state.outcome))
    errors.push("Ending and phase disagree.");
  if (openedValid && waterValid) {
    if (state.phase >= 2 && state.opened.filter(Boolean).length < 2)
      errors.push("The network was not reconnected.");
    if (state.phase === 1 && state.opened.filter(Boolean).length >= 2)
      errors.push("The phase was not advanced.");
    if (state.pinned && (!state.opened.every(Boolean) || !balanced(state)))
      errors.push("An unbalanced network cannot be pinned.");
    if (state.phase === 3 && !state.pinned)
      errors.push("Lowering requires a pinned counterweight.");
    if (state.phase < 3 && (state.pinned || state.progressMs))
      errors.push("Lowering has not begun.");
    if (!state.outcome && (state.lostWater || state.progressMs === HOLD_MS))
      errors.push("An ending is missing.");
    if (
      state.outcome === "supply-saved" &&
      (!state.pinned || state.progressMs !== HOLD_MS || state.lostWater)
    )
      errors.push("The saved-supply ending is inconsistent.");
    if (
      state.outcome === "reserve-lost" &&
      (state.lostWater !== WATER_TOTAL || state.pinned)
    )
      errors.push("The drained-reserve ending is inconsistent.");
  }
  return errors;
}

export function exportProof(state) {
  const errors = validateState(state);
  if (errors.length) throw new Error(errors.join(" "));
  return JSON.stringify(
    { format: "arcanea.encounter-proof.v1", source: SOURCE, state },
    null,
    2,
  );
}

export function importProof(text) {
  if (typeof text !== "string" || text.length > 32_768)
    throw new Error("Choose an encounter proof smaller than 32 KiB.");
  let packet;
  try {
    packet = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON.");
  }
  if (
    packet?.format !== "arcanea.encounter-proof.v1" ||
    !packet.source ||
    Object.entries(SOURCE).some(([key, value]) => packet.source[key] !== value)
  )
    throw new Error(
      "This file belongs to a different source, version or canon state.",
    );
  const errors = validateState(packet.state);
  if (errors.length) throw new Error(errors.join(" "));
  // Copy only known fields: imported keys never become UI configuration or code.
  const input = packet.state;
  return {
    version: 1,
    water: [...input.water],
    lostWater: input.lostWater,
    opened: [...input.opened],
    position: input.position,
    phase: input.phase,
    pinned: input.pinned,
    progressMs: input.progressMs,
    elapsedMs: input.elapsedMs,
    falls: input.falls,
    extendedCues: input.extendedCues,
    outcome: input.outcome,
    message: input.message,
    attack: {
      stage: input.attack.stage,
      remainingMs: input.attack.remainingMs,
      target: input.attack.target,
      sequence: input.attack.sequence,
    },
  };
}
