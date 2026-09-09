import test from "node:test";
import assert from "node:assert/strict";
import {
  createEncounter,
  act,
  advance,
  actionBlocker,
  balanced,
  validateState,
  exportProof,
  importProof,
  HOLD_MS,
} from "../apps/web/lib/encounters/orthea-engine.mjs";

const move = (s, position) => act(s, { type: "move", position });
const open = (s, position) => act(move(s, position), { type: "open" });
const transfer = (s, from, to) =>
  act(move(s, String(from)), { type: "transfer", from, to });
function readyToLower() {
  let s = open(open(createEncounter(), "0"), "1");
  for (let i = 0; i < 5; i++) s = transfer(s, 0, 1);
  for (let i = 0; i < 3; i++) s = transfer(s, 1, 2);
  s = open(s, "2");
  return act(move(s, "refuge"), { type: "pin" });
}

test("the entry lesson has twelve conserved units, a safe refuge and no invented balance claim", () => {
  const s = createEncounter();
  assert.deepEqual(s.water, [9, 2, 1]);
  assert.equal(s.position, "refuge");
  assert.deepEqual(validateState(s), []);
  assert.equal(JSON.parse(exportProof(s)).source.canonState, "proposal");
});

test("two distinct opened sluices advance the lesson; one wheel cannot count twice", () => {
  let s = open(createEncounter(), "0");
  s = act(s, { type: "open" });
  assert.equal(s.phase, 1);
  s = open(s, "1");
  assert.equal(s.phase, 2);
  assert.deepEqual(s.opened, [true, true, false]);
});

test("closed edges, wrong positions, malformed actions and overfilling do not move water", () => {
  let s = open(open(createEncounter(), "0"), "1");
  const before = structuredClone(s.water);
  for (const action of [
    null,
    { type: "delete" },
    { type: "transfer", from: -1, to: 0 },
    { type: "transfer", from: 0, to: 2 },
    { type: "transfer", from: 0, to: 1 },
  ]) {
    assert.ok(actionBlocker(s, action));
    assert.deepEqual(act(s, action).water, before);
  }
  s = transfer(s, 1, 0);
  assert.equal(s.water[0], 10);
  const full = act(s, { type: "transfer", from: 1, to: 0 });
  assert.deepEqual(full.water, s.water);
});

test("a complete solo route opens the dock, balances the network and pins at the refuge", () => {
  const s = readyToLower();
  assert.equal(s.phase, 3);
  assert.deepEqual(s.water, [4, 4, 4]);
  assert.ok(s.opened.every(Boolean));
  assert.equal(s.pinned, true);
  assert.deepEqual(validateState(s), []);
});

test("pinning requires all connections, safe levels and access to the capstan", () => {
  let s = createEncounter();
  assert.match(actionBlocker(s, { type: "pin" }), /all three/);
  s = open(open(open(s, "0"), "1"), "2");
  assert.match(actionBlocker(s, { type: "pin" }), /capstan/);
  assert.match(actionBlocker(move(s, "refuge"), { type: "pin" }), /safe band/);
});

test("a committed footfall cannot follow the player, and the refuge never becomes a target", () => {
  let s = advance(move(createEncounter(), "0"), 3000);
  assert.equal(s.attack.stage, "windup");
  assert.equal(s.attack.target, 0);
  s = move(s, "1");
  assert.equal(s.attack.target, 0);
  s = advance(s, 1700);
  assert.equal(s.falls, 0);
  assert.equal(s.position, "1");
  s = advance(move(s, "refuge"), 30_000);
  assert.equal(s.falls, 0);
  assert.equal(s.position, "refuge");
});

test("a missed cue causes a recoverable fall and preserves learned state", () => {
  let s = move(readyToLower(), "2");
  s = advance(s, 3000);
  const progress = s.progressMs;
  s = advance(s, 1700);
  assert.equal(s.falls, 1);
  assert.equal(s.position, "refuge");
  assert.ok(s.progressMs >= progress && s.progressMs < HOLD_MS);
  assert.deepEqual(s.water, [4, 4, 4]);
  assert.ok(s.opened.every(Boolean));
  assert.equal(s.pinned, true);
  assert.equal(advance(s, 1000).progressMs, s.progressMs);
});

test("the complete encounter can be played solo, dodge every cue and preserve all water", () => {
  let s = move(readyToLower(), "2");
  for (let step = 0; step < 600 && !s.outcome; step++) {
    s = move(
      s,
      s.attack.stage === "windup" && s.attack.target === 2 ? "refuge" : "2",
    );
    s = advance(s, 100);
    assert.deepEqual(validateState(s), []);
  }
  assert.equal(s.outcome, "supply-saved");
  assert.equal(s.falls, 0);
  assert.equal(s.progressMs, HOLD_MS);
  assert.equal(
    s.water.reduce((a, b) => a + b),
    12,
  );
  assert.deepEqual(advance(s, 60_000), s);
});

test("explicit seal breaking records the lost reserve rather than silently removing water", () => {
  let s = move(open(open(createEncounter(), "0"), "1"), "refuge");
  s = act(s, { type: "break-seal" });
  assert.equal(s.outcome, "reserve-lost");
  assert.equal(s.lostWater, 12);
  assert.deepEqual(s.water, [0, 0, 0]);
  assert.deepEqual(validateState(s), []);
  assert.equal(act(s, { type: "move", position: "2" }).outcome, "reserve-lost");
});

test("longer cues change the response window without changing the rule or damage result", () => {
  let s = advance(move(createEncounter({ extendedCues: true }), "0"), 3000);
  assert.equal(s.attack.remainingMs, 2600);
  s = advance(s, 1700);
  assert.equal(s.falls, 0);
  assert.equal(advance(s, 900).falls, 1);
});

test("fixed-step replay is independent of how ticks are batched", () => {
  const s = move(readyToLower(), "2");
  let repeated = s;
  for (let i = 0; i < 100; i++) repeated = advance(repeated, 100);
  assert.deepEqual(advance(s, 10_000), repeated);
  for (const delta of [-1, 1, 99, 100.5, Infinity, 60_100])
    assert.throws(() => advance(s, delta));
});

test("a file round-trip preserves a mid-cue state and continues to the same result", () => {
  const s = advance(move(readyToLower(), "2"), 3500);
  const restored = importProof(exportProof(s));
  assert.deepEqual(restored, s);
  assert.deepEqual(advance(restored, 5000), advance(s, 5000));
  assert.notEqual(restored.water, s.water);
});

test("foreign authority, water creation and forged endings are rejected on import", () => {
  const packet = JSON.parse(exportProof(createEncounter()));
  for (const mutate of [
    (p) => {
      p.source.canonState = "accepted";
    },
    (p) => {
      p.state.water[0]++;
    },
    (p) => {
      p.state.phase = 4;
      p.state.outcome = "supply-saved";
    },
    (p) => {
      p.state.attack.target = "refuge";
    },
    (p) => {
      p.state.opened = [true];
    },
    (p) => {
      p.state.progressMs = 1;
    },
    (p) => {
      p.state.lostWater = -1;
    },
  ]) {
    const corrupted = structuredClone(packet);
    mutate(corrupted);
    assert.throws(() => importProof(JSON.stringify(corrupted)));
  }
  assert.throws(() => importProof("{"));
  assert.throws(() => importProof("x".repeat(32_769)));
});

test("valid accented names and status text are data; imported configuration keys are dropped", () => {
  const packet = JSON.parse(exportProof(createEncounter()));
  packet.state.message = "<script>no execution</script> — Mara, Brío";
  packet.state.innerHTML = "<script>bad</script>";
  const restored = importProof(JSON.stringify(packet));
  assert.equal(restored.innerHTML, undefined);
  assert.equal(restored.message, packet.state.message);
});

test("all reachable water configurations can reach a safe band without destroying the reserve", () => {
  // Exhaustive graph, not a scripted happy path: two open edges already connect
  // the three stores. Movement is always possible through the safe perimeter.
  const states = [];
  for (let a = 0; a <= 10; a++)
    for (let b = 0; b <= 10; b++) {
      const c = 12 - a - b;
      if (c >= 0 && c <= 10) states.push([a, b, c]);
    }
  for (const missing of [0, 1, 2]) {
    const connected = [true, true, true];
    connected[missing] = false;
    for (const water of states) {
      const queue = [water],
        visited = new Set([water.join(",")]);
      let solved = false;
      for (let i = 0; i < queue.length && !solved; i++) {
        const s = {
          ...createEncounter(),
          phase: 2,
          water: queue[i],
          opened: connected,
        };
        if (balanced(s)) {
          solved = true;
          break;
        }
        for (let from = 0; from < 3; from++)
          for (let to = 0; to < 3; to++) {
            const next = transfer(s, from, to).water;
            const key = next.join(",");
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(next);
            }
          }
      }
      assert.ok(
        solved,
        `No solo solution for ${water}, missing edge ${missing}`,
      );
    }
  }
});
