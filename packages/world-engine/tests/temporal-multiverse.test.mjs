import test from "node:test";
import assert from "node:assert/strict";
import {
  getCanonicalRealms,
  getLinguisticFamilies,
  getCanonicalEpochs,
  getCanonicalGuardians,
  getMonomythStages,
  getMonomythStage,
  calculateCorridorResonance,
  calculateSandersonianMagicToll,
  generateRealmName,
  traceEntityProvenance,
} from "../dist/index.js";

test("Canonical Realms cover core multiverse regions", () => {
  const realms = getCanonicalRealms();
  assert.ok(realms.eldria_prime, "Eldria Prime exists");
  assert.ok(realms.veldoria, "Veldoria exists");
  assert.ok(realms.aurevalde, "Aurevalde exists");
  assert.ok(realms.mar_arcano, "Mar Arcano exists");
  assert.ok(realms.the_shadowfen, "The Shadowfen exists");
  assert.ok(realms.astraea_spires, "Astraea Spires exists");
  assert.ok(realms.matter_reach, "Matter Reach exists");

  assert.equal(realms.eldria_prime.frequencyHz, 1111);
  assert.equal(realms.veldoria.frequencyHz, 528);
  assert.equal(realms.aurevalde.frequencyHz, 396);
  assert.equal(realms.mar_arcano.frequencyHz, 285);
  assert.equal(realms.the_shadowfen.frequencyHz, 174);
});

test("Linguistic families define Tolkien-grade phonologies", () => {
  const families = getLinguisticFamilies();
  assert.ok(families.eldrian, "High Eldrian exists");
  assert.ok(families.veldarín, "Veldarín exists");
  assert.ok(families.aurevaldan, "Aurevaldan exists");
  assert.ok(families.sunder_tongue, "Sunder-tongue exists");
  assert.ok(families.solar_common, "Solar Common exists");
  assert.ok(families.deep_runic, "Deep Runic exists");

  assert.ok(families.eldrian.phonology.preferredConsonants.includes("Sh"));
  assert.ok(families.aurevaldan.phonology.sensoryTone.includes("flint"));
  assert.ok(families.sunder_tongue.phonology.sensoryTone.includes("cold iron"));
});

test("Corridor resonance calculation computes harmonic stability", () => {
  // Between Veldoria (528) and Aurevalde (396)
  const resVA = calculateCorridorResonance("veldoria", "aurevalde");
  assert.equal(resVA.harmonicDelta, 132);
  assert.equal(resVA.status, "open");
  assert.equal(resVA.corridorDays, 14);

  // Between Eldria Prime (1111) and Veldoria (528)
  const resEV = calculateCorridorResonance("eldria_prime", "veldoria");
  assert.equal(resEV.harmonicDelta, 583);
  assert.equal(resEV.status, "drifting");
});

test("Sandersonian magic toll enforces physical and acoustic costs", () => {
  const fireToll = calculateSandersonianMagicToll("fire", "severe");
  assert.equal(fireToll.gateId, "fire");
  assert.equal(fireToll.frequencyHz, 396);
  assert.ok(fireToll.physicalCost.includes("burns"));
  assert.ok(fireToll.limitation.length > 0);
  assert.ok(fireToll.counterHarmonicRemedy.length > 0);

  const voiceToll = calculateSandersonianMagicToll("voice", "moderate");
  assert.ok(voiceToll.physicalCost.includes("muteness"));
  assert.ok(voiceToll.counterHarmonicRemedy.includes("silence"));
});

test("Campbell-Vogler Monomyth progression maps all 12 stages to Gates", () => {
  const stages = getMonomythStages();
  assert.equal(stages.length, 12);

  const stage1 = getMonomythStage(1);
  assert.equal(stage1.name, "The Ordinary World");
  assert.equal(stage1.gateId, "foundation");
  assert.equal(stage1.frequencyHz, 174);

  const stage8 = getMonomythStage(8);
  assert.equal(stage8.name, "The Supreme Ordeal");
  assert.equal(stage8.gateId, "crown");

  const stage12 = getMonomythStage(12);
  assert.equal(stage12.name, "Return with the Elixir");
  assert.equal(stage12.gateId, "source");
  assert.equal(stage12.frequencyHz, 1111);
});

test("Canonical Guardians registry has all 10 Guardians anchored", () => {
  const guardians = getCanonicalGuardians();
  assert.equal(guardians.length, 10);
  assert.ok(guardians.some((g) => g.name === "Lyssandria" && g.gateNumber === 1));
  assert.ok(guardians.some((g) => g.name === "Alera" && g.gateNumber === 5));
  assert.ok(guardians.some((g) => g.name === "Shinkami" && g.gateNumber === 10));
});

test("Realm name generation adheres to phonology", () => {
  const masculine = generateRealmName("veldoria", "character_masculine");
  assert.ok(masculine.length > 2);

  const toponym = generateRealmName("aurevalde", "toponym");
  assert.ok(toponym.length > 3);

  const relic = generateRealmName("eldria_prime", "relic");
  assert.ok(relic.includes("Blade"));
});

test("Entity provenance traces causality and deep-time origins", () => {
  const record = traceEntityProvenance(
    "123e4567-e89b-12d3-a456-426614174000",
    "Staff of Lapis Chords",
    "eldria_prime",
    "epoch_first_war"
  );
  assert.equal(record.entityName, "Staff of Lapis Chords");
  assert.equal(record.originRealmId, "eldria_prime");
  assert.equal(record.originEpochId, "epoch_first_war");
  assert.equal(record.resonanceHz, 1111);
  assert.ok(record.temporalCausalityPath.length > 0);
  assert.ok(record.humanCostSummary.includes("1111 Hz"));
});
