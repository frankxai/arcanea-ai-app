import test from "node:test";
import assert from "node:assert/strict";

import {
  canChallengeDungeonBoss,
  canGenerateDungeonArt,
  dungeonAtlasEntryToPromptPack,
  evaluateDungeonRun,
  getDungeonCollapseStage,
  getDungeonMinutesRemaining,
} from "../dist/index.js";

const sampleVault = {
  id: "dungeon-veiled-crown-scriptorium",
  slug: "veiled-crown-scriptorium",
  name: "Hidden high-rank dungeon pattern",
  shortDescription: "A benchmark entry for rank mismatch, time pressure, and boss unlock structure.",
  source: {
    sourceWorld: "Solo Leveling",
    sourceWork: "Solo Leveling anime and related official franchise materials",
    dungeonName: "Double Dungeon pattern",
    franchiseOwner: "D&C Media / Kakao Entertainment licensing ecosystem",
    referenceMode: "factual_reference",
  },
  rightsTier: "factual_reference_only",
  taxonomy: ["rank mismatch", "hidden depth", "timed boss", "gate collapse"],
  mechanics: [
    {
      label: "The visible rank is false",
      pattern: "rank_mismatch",
      whyItWorks: "The user enters with one expectation and discovers a deeper system.",
      arcaneaUse: "The Vault looks Apprentice-safe until Sight resonance exposes Crown machinery.",
    },
  ],
  progressionPattern: "complete required rooms, unlock boss, defeat boss before collapse",
  communitySignal: "Easy to explain, tense to watch, generous with progression payoff.",
  citations: [{ label: "Official series reference", url: "https://www.crunchyroll.com/series/GDKHZEJ0K/solo-leveling" }],
  relationships: [],
  arcaneaVariant: {
    name: "Veiled Crown Scriptorium",
    publicName: "The False D-Rank Library",
    arcaneaWorld: "Arcanea Resonance Vaults",
    vaultType: "Sight-Crown trial archive",
    gateAlignment: [7, 6],
    godbeastResonance: "Sol",
    rankBand: "mage",
    partySize: { min: 1, max: 4 },
    storyFunction: "Reveal that the creator's first problem is actually a higher-order responsibility.",
    gameLoop: "Scout shelves, solve resonance locks, recover ink keys, unlock the Scriptor boss, extract the proof page.",
    animeBeats: [
      "safe-looking entry",
      "wrong-rank reveal",
      "clock activates",
      "boss writes the party's failures into the room",
      "proof page burns clean",
    ],
    bookBeats: [
      "arrival with false confidence",
      "first clue contradicts the mission brief",
      "one character chooses truth over speed",
      "boss confrontation externalizes the hidden flaw",
      "reward becomes future plot material",
    ],
    authorUse: "Use when a protagonist must learn that a simple quest masks a larger calling.",
    agenticMission: "Research, synthesize, draft, critic-review, and ship a proof artifact before the timer closes.",
    laws: [
      "Every false sentence spoken creates one extra shelf maze.",
      "Only completed proof artifacts open the boss door.",
    ],
    costs: [
      "Rushing reduces map certainty.",
      "Uncited claims become hostile marginalia.",
    ],
    rooms: [
      {
        id: "scout-index",
        label: "Scout the moving index",
        type: "scout",
        required: true,
        estimatedMinutes: 8,
        proofArtifact: "source packet",
        gate: 6,
      },
      {
        id: "solve-ink-lock",
        label: "Solve the ink lock",
        type: "solve",
        required: true,
        estimatedMinutes: 12,
        proofArtifact: "mechanic map",
        gate: 7,
      },
      {
        id: "gather-gold-leaf",
        label: "Gather gold leaf annotations",
        type: "gather",
        required: false,
        estimatedMinutes: 6,
        proofArtifact: "material note",
        gate: 7,
      },
    ],
    hazards: ["citation debt", "moving shelves", "false-rank echo"],
    creatures: ["index wisp", "margin sentinel"],
    materials: [
      {
        name: "Sol Quartz Margin",
        materialClass: "vael_crystal",
        gateAffinity: 7,
        useCases: ["boss key art", "proof artifact", "future Crown trial"],
        rightsNotes: "Original Arcanea material.",
      },
      {
        name: "Alera Ink Thread",
        materialClass: "story_seed",
        gateAffinity: 5,
        useCases: ["author outline", "dialogue trial"],
        rightsNotes: "Original Arcanea material.",
      },
    ],
    boss: {
      name: "The Scriptor of Unfinished Proof",
      archetype: "archive boss that weaponizes uncited claims",
      unlockCondition: "Complete every required room before challenging the boss.",
      phases: [
        {
          id: "phase-citation",
          name: "Citation Storm",
          trigger: "boss door opens",
          mechanic: "uncited claims become projectiles",
          counterplay: "anchor every claim to source or canon",
          failureRisk: "lost time",
        },
        {
          id: "phase-proof",
          name: "Proof Page",
          trigger: "boss below half stability",
          mechanic: "one page must be completed under pressure",
          counterplay: "ship the smallest coherent artifact",
          failureRisk: "collapse",
        },
      ],
      victoryCondition: "Extract with the proof page before the resonance window closes.",
      proofArtifact: "verified dungeon contract",
    },
    timer: {
      resonanceWindowMinutes: 45,
      warningAtMinutesRemaining: [15, 5],
      collapseStages: [
        {
          id: "stage-index-drift",
          startsAtMinute: 20,
          name: "Index Drift",
          pressure: "moderate",
          hazard: "route instability",
          consequence: "Future checks cost extra time.",
        },
        {
          id: "stage-shelf-collapse",
          startsAtMinute: 40,
          name: "Shelf Collapse",
          pressure: "critical",
          hazard: "boss arena closing",
          consequence: "Only immediate victory or partial extraction remains.",
        },
      ],
      bossDeadlineBehavior: "The Scriptor seals the proof page and the party exits with partial notes only.",
    },
    canonBoundary:
      "Original Arcanea variant. Do not reproduce protected Solo Leveling locations, statues, symbols, system UI, or encounter text.",
    generationPolicy: "allowed_original_variant",
    promptFocus: "a mythic archive under timed collapse with original Arcanea law-driven boss pressure",
    negativeConstraints: ["stone statue smile", "blue system interface", "Solo Leveling style", "Cartenon Temple likeness"],
  },
  status: "draft",
  steward: "Arcanea Canon Council",
  updatedAt: "2026-07-01",
};

test("dungeon timer and collapse stage are calculated from the resonance window", () => {
  assert.equal(getDungeonMinutesRemaining(sampleVault, 12), 33);
  assert.equal(getDungeonMinutesRemaining(sampleVault, 50), 0);
  assert.equal(getDungeonCollapseStage(sampleVault, 10), undefined);
  assert.equal(getDungeonCollapseStage(sampleVault, 21)?.id, "stage-index-drift");
  assert.equal(getDungeonCollapseStage(sampleVault, 44)?.id, "stage-shelf-collapse");
});

test("boss unlock requires every required objective", () => {
  assert.equal(canChallengeDungeonBoss(sampleVault, ["scout-index"]), false);
  assert.equal(canChallengeDungeonBoss(sampleVault, ["scout-index", "solve-ink-lock"]), true);
});

test("dungeon run evaluation handles victory, locked boss, and collapse", () => {
  const locked = evaluateDungeonRun(sampleVault, {
    elapsedMinutes: 25,
    completedObjectiveIds: ["scout-index"],
    bossAttempted: true,
  });

  assert.equal(locked.verdict, "boss_locked");
  assert.equal(locked.bossUnlocked, false);
  assert.match(locked.notes.join(" "), /Complete every required room/);

  const victory = evaluateDungeonRun(sampleVault, {
    elapsedMinutes: 42,
    completedObjectiveIds: ["scout-index", "solve-ink-lock", "gather-gold-leaf"],
    bossDefeated: true,
  });

  assert.equal(victory.verdict, "victory");
  assert.equal(victory.rewardsUnlocked.length, 2);
  assert.ok(victory.xp > 500);

  const collapsed = evaluateDungeonRun(sampleVault, {
    elapsedMinutes: 46,
    completedObjectiveIds: ["scout-index", "solve-ink-lock"],
    bossDefeated: false,
  });

  assert.equal(collapsed.verdict, "collapse_failure");
  assert.equal(collapsed.minutesRemaining, 0);
});

test("dungeon prompt packs keep protected source names out of art prompts", () => {
  const pack = dungeonAtlasEntryToPromptPack(sampleVault);

  assert.equal(canGenerateDungeonArt(sampleVault), true);
  assert.match(pack.keyArtPrompt, /Original Arcanea Resonance Vault/);
  assert.doesNotMatch(pack.keyArtPrompt, /Solo Leveling/);
  assert.doesNotMatch(pack.bossPrompt, /Double Dungeon/);
  assert.match(pack.negativePrompt, /Solo Leveling style/);
  assert.match(pack.safetyNotes.join(" "), /Reference source is Solo Leveling anime/);

  const blocked = {
    ...sampleVault,
    rightsTier: "blocked",
    arcaneaVariant: {
      ...sampleVault.arcaneaVariant,
      generationPolicy: "blocked",
    },
  };

  assert.equal(canGenerateDungeonArt(blocked), false);
});

