// Fixture model answers. These stand in for a generation call so the round-trip
// test exercises the compiler, the detector and the merge path without a model.

/** A well-formed answer to character.constrained.v1 (gate 6, Sight). */
export const goodCharacter = {
  name: "Sennaris Vale",
  description:
    "A cartographer of drifting corridors who reads a room the way others read weather. She keeps her sixth gate half-open on purpose.",
  attributes: {
    archetype: "cartographer",
    disposition: "watchful",
    element: "Void",
  },
};

/** The same request answered badly: it takes a locked canon name and miscasts Nero. */
export const conflictedCharacter = {
  name: "Draconis",
  description:
    "A wandering blade who serves Nero, the evil beneath the world, and hunts the Gate-keepers.",
  attributes: {
    archetype: "blade",
    originClass: "Nullborn",
    gatesOpen: 3,
    rank: "Archmage",
    element: "Ash",
    house: "House Cinder",
  },
};

/** A location answer used for the branch/merge path. */
export const goodLocation = {
  name: "The Slow Chart Room",
  description:
    "A vaulted hall where corridor maps are redrawn each season, because corridors drift.",
  attributes: { kind: "archive" },
};
