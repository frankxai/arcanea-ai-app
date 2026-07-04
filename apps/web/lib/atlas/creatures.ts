import {
  creatureAtlasEntryToPromptPack,
  type CreatureAtlasEntry,
  type CreatureRightsTier,
} from "@arcanea/world-engine";

export type CreatureAtlasElement = "Fire" | "Water" | "Earth" | "Wind" | "Void" | "Spirit";

export interface CreatureAtlasSearchParams {
  query?: string;
  world?: string;
  element?: CreatureAtlasElement | "all";
  rights?: CreatureRightsTier | "all";
  taxonomy?: string;
  hasApprovedImage?: boolean;
  limit?: number;
}

const UPDATED_AT = "2026-06-26";

const RAW_CREATURES: CreatureAtlasEntry[] = [
  {
    id: "creature-aeralith-sky-grazer",
    slug: "aeralith-sky-grazer",
    name: "Flying Bison",
    shortDescription:
      "A gentle skyborne companion archetype: massive, air-attuned, bonded to travelers, and emotionally central to its party.",
    source: {
      sourceWorld: "Avatar: The Last Airbender",
      sourceWork: "Avatar: The Last Airbender animated series",
      creatureName: "Flying Bison",
      franchiseOwner: "Nickelodeon / Paramount",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["sky mount", "companion beast", "air ecology", "caravan guardian"],
    habitats: ["high plateaus", "wind corridors", "floating monasteries"],
    abilities: ["aerial travel", "pressure-current sensing", "herd memory", "storm avoidance"],
    temperament: "gentle, loyal, stubborn under threat",
    scale: "massive mount",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; no official art or likeness is stored.",
      },
    ],
    relationships: [
      {
        targetSlug: "thundercloud-longma",
        type: "ecological_neighbor",
        label: "Both are benevolent sky-travel archetypes.",
        strength: 0.72,
      },
    ],
    arcaneaVariant: {
      name: "Aeralith Sky Grazer",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "six-limbed wind grazer that carries memory-caravans across pressure rivers",
      element: "Wind",
      visualDna: [
        "wide manta-like shoulders",
        "braided cloud-fur",
        "four walking legs and two steering limbs",
        "teal pressure glyphs along the flank",
      ],
      behavior: [
        "answers to low flute tones",
        "kneels only when it trusts the rider",
        "feeds on mineral lichen growing above cloudline",
      ],
      canonBoundary:
        "Original Arcanea variant. Do not reproduce the Avatar creature silhouette, markings, saddle design, name, or character associations.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "gentle scale, wind-caravan utility, believable mammalian anatomy, and distinct teal-gold Arcanea markings",
      negativeConstraints: ["arrow forehead marking", "brown arrow tattoos", "exact bison face", "Avatar-style saddle"],
    },
    media: [
      {
        id: "media-aeralith-prompt",
        status: "prompt_ready",
      },
    ],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-ember-kin-rail-drake",
    slug: "ember-kin-rail-drake",
    name: "Night Fury",
    shortDescription:
      "A fast, emotionally bonded dragon archetype built around trust, flight, stealth, and rider partnership.",
    source: {
      sourceWorld: "How to Train Your Dragon",
      sourceWork: "How to Train Your Dragon film series",
      creatureName: "Night Fury",
      franchiseOwner: "DreamWorks / Universal",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["dragon", "rider bond", "stealth flyer", "fire ecology"],
    habitats: ["volcanic sea cliffs", "black-glass aeries", "storm caves"],
    abilities: ["silent glide", "ember burst", "rider synchronization", "night navigation"],
    temperament: "wary, precise, fiercely bonded",
    scale: "large rider companion",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; generation prompt uses an original drake.",
      },
    ],
    relationships: [
      {
        targetSlug: "phoenix-ember-crown",
        type: "ecological_neighbor",
        label: "Both encode fire as renewal rather than simple destruction.",
        strength: 0.61,
      },
    ],
    arcaneaVariant: {
      name: "Ember-Kin Rail Drake",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "obsidian cliff drake with rail-thin wing struts and ember-breath used for signaling",
      element: "Fire",
      visualDna: [
        "long glider wings with ember-lit veins",
        "obsidian hide broken by copper seams",
        "forked stabilizer tail",
        "heat shimmer around the jaw",
      ],
      behavior: [
        "hunts by hearing cliff echoes",
        "bonds through shared silence",
        "marks safe landing paths with ember sparks",
      ],
      canonBoundary:
        "Original Arcanea variant. Avoid exact Night Fury proportions, head shape, eyes, tail prosthetic motifs, and franchise symbols.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "stealth, volcanic aerodynamics, restrained firelight, and a non-franchise dragon silhouette",
      negativeConstraints: ["round black cartoon dragon", "Toothless likeness", "tail prosthetic", "DreamWorks style"],
    },
    media: [{ id: "media-ember-kin-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-velouran-crown-stag",
    slug: "velouran-crown-stag",
    name: "Forest Spirit",
    shortDescription:
      "A sacred forest-deity archetype where animal form, ecological judgment, and life-death balance converge.",
    source: {
      sourceWorld: "Princess Mononoke",
      sourceWork: "Princess Mononoke feature film",
      creatureName: "Forest Spirit",
      franchiseOwner: "Studio Ghibli",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["forest deity", "life-death ecology", "sacred cervid", "threshold being"],
    habitats: ["old-growth sanctuaries", "root temples", "mist basins"],
    abilities: ["ecological judgment", "healing bloom", "silence field", "seasonal passage"],
    temperament: "distant, merciful, catastrophic when violated",
    scale: "large sacred guardian",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; Arcanea variant changes mechanism and silhouette.",
      },
    ],
    relationships: [
      {
        targetSlug: "ringroot-witness-ent",
        type: "guardian_of",
        label: "Both act as forest memory institutions.",
        strength: 0.7,
      },
    ],
    arcaneaVariant: {
      name: "Velouran Crown Stag",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "antlered archive-beast whose crown grows living witness-branches",
      element: "Spirit",
      visualDna: [
        "translucent ivory body",
        "root-like antlers holding tiny lantern seeds",
        "moss-gold hooves",
        "soft teal breath in cold air",
      ],
      behavior: [
        "appears where a forest remembers a broken oath",
        "heals only after truth is spoken",
        "sheds antler seeds that become memorial trees",
      ],
      canonBoundary:
        "Original Arcanea variant. Do not reproduce Studio Ghibli facial design, nightwalker form, or film-specific staging.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "sacred archive ecology, memorial forest mood, and distinct antler-lantern anatomy",
      negativeConstraints: ["Ghibli style", "Forest Spirit exact face", "nightwalker", "white deer god replica"],
    },
    media: [{ id: "media-velouran-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-dune-tide-leviathan",
    slug: "dune-tide-leviathan",
    name: "Sandworm",
    shortDescription:
      "A desert leviathan archetype: colossal, territorial, vibration-sensitive, and central to the economy and ecology of its world.",
    source: {
      sourceWorld: "Dune",
      sourceWork: "Dune novels and film adaptations",
      creatureName: "Sandworm",
      franchiseOwner: "Herbert Properties / Legendary licensing ecosystem",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["desert leviathan", "apex ecology", "vibration hunter", "resource keystone"],
    habitats: ["deep deserts", "salt flats", "buried aquifer scars"],
    abilities: ["seismic tracking", "terrain surfacing", "resource-cycle transformation", "territorial resonance"],
    temperament: "ancient, reactive, indifferent to human scale",
    scale: "colossal",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; prompt transforms into a distinct Arcanea desert creature.",
      },
    ],
    relationships: [
      {
        targetSlug: "mirror-shell-atlas-tortoise",
        type: "rival",
        label: "Both reshape geography through movement at mythic scale.",
        strength: 0.58,
      },
    ],
    arcaneaVariant: {
      name: "Dune-Tide Leviathan",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "glass-scaled desert leviathan that swims through powdered quartz dunes",
      element: "Earth",
      visualDna: [
        "segmented glass-crystal armor",
        "wide shovel crown",
        "sand-plume gills",
        "gold seismic rings glowing beneath the skin",
      ],
      behavior: [
        "follows rhythmic mining mistakes",
        "leaves trenches that become trade roads",
        "sings below storms before surfacing",
      ],
      canonBoundary:
        "Original Arcanea variant. Avoid Dune worm mouth design, spice iconography, hooks, stillsuits, and film composition.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "geological organism, quartz dune physics, luminous seismic biology, and monumental scale",
      negativeConstraints: ["Dune sandworm mouth", "spice harvester", "stillsuit", "Arrakis film frame"],
    },
    media: [{ id: "media-dune-tide-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-mirror-shell-atlas-tortoise",
    slug: "mirror-shell-atlas-tortoise",
    name: "World Turtle",
    shortDescription:
      "A cosmic turtle archetype that carries land, cities, or worlds across mythic space.",
    source: {
      sourceWorld: "Global myth and modern fantasy",
      sourceWork: "World turtle folklore and literary adaptations",
      creatureName: "World Turtle",
      referenceMode: "public_domain_adaptation",
    },
    rightsTier: "public_domain",
    taxonomy: ["cosmic turtle", "world bearer", "slow ecology", "foundation myth"],
    habitats: ["astral sea", "sunless oceans", "mythic foundations"],
    abilities: ["world-bearing", "tectonic memory", "orbital migration", "dream weather"],
    temperament: "patient, unknowable, protective by indifference",
    scale: "world-scale",
    citations: [
      {
        label: "Folklore reference",
        note: "Public-domain archetype; avoid copying any modern adaptation's names or staging.",
      },
    ],
    relationships: [
      {
        targetSlug: "dune-tide-leviathan",
        type: "rival",
        label: "One carries land; the other cuts it open.",
        strength: 0.58,
      },
    ],
    arcaneaVariant: {
      name: "Mirror-Shell Atlas Tortoise",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "cosmic tortoise whose mirrored shell reflects unfinished worlds",
      element: "Earth",
      visualDna: [
        "continent-like shell plates",
        "mirror obsidian scutes",
        "teal aurora around the rim",
        "ancient gold fault lines",
      ],
      behavior: [
        "moves only during epochal decisions",
        "dreams maps into existence",
        "hides endangered worlds in shell reflections",
      ],
      canonBoundary:
        "Public-domain archetype adapted into Arcanea. Do not copy named modern fantasy turtles.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "cosmic scale, reflective shell architecture, austere mythic calm, and non-cartoon geology",
      negativeConstraints: ["named modern fantasy turtle", "comedy turtle", "cartoon shell city"],
    },
    media: [{ id: "media-mirror-shell-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-thundercloud-longma",
    slug: "thundercloud-longma",
    name: "Luck Dragon",
    shortDescription:
      "A benevolent sky-serpent archetype associated with hope, luck, flight, and emotionally restorative guidance.",
    source: {
      sourceWorld: "The NeverEnding Story",
      sourceWork: "The NeverEnding Story novel and film adaptations",
      creatureName: "Luck Dragon",
      franchiseOwner: "Rights vary by adaptation and territory",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["sky serpent", "hope guardian", "luck spirit", "companion guide"],
    habitats: ["high storm shelves", "rainbow fronts", "dream routes"],
    abilities: ["storm riding", "morale restoration", "navigation through impossible weather", "probability nudging"],
    temperament: "kind, mischievous, unhurried",
    scale: "large aerial guardian",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; generation prompt avoids the known film creature design.",
      },
    ],
    relationships: [
      {
        targetSlug: "aeralith-sky-grazer",
        type: "ecological_neighbor",
        label: "Both make the sky feel inhabitable rather than hostile.",
        strength: 0.72,
      },
    ],
    arcaneaVariant: {
      name: "Thundercloud Longma",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "equine cloud-serpent that braids luck into storm fronts",
      element: "Wind",
      visualDna: [
        "long horse-dragon body",
        "storm-cloud mane",
        "gold whisker filaments",
        "pearl scales with teal static",
      ],
      behavior: [
        "arrives when a traveler chooses courage without certainty",
        "laughs in thunder rumbles",
        "sheds charged mane threads that guide lost ships",
      ],
      canonBoundary:
        "Original Arcanea variant. Avoid the known Luck Dragon face, fur proportions, and film color language.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "longma mythology, charged weather ecology, gentle intelligence, and distinctive storm-mane silhouette",
      negativeConstraints: ["Falkor likeness", "white shaggy dog dragon", "NeverEnding Story frame"],
    },
    media: [{ id: "media-thundercloud-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-ringroot-witness-ent",
    slug: "ringroot-witness-ent",
    name: "Ent",
    shortDescription:
      "A walking-tree archetype: ancient, slow to anger, rooted in memory, and capable of becoming a forest's political will.",
    source: {
      sourceWorld: "Middle-earth",
      sourceWork: "The Lord of the Rings literary universe",
      creatureName: "Ent",
      franchiseOwner: "Tolkien Estate / Middle-earth licensing ecosystem",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["tree shepherd", "forest elder", "living archive", "ecological witness"],
    habitats: ["old forests", "river roots", "abandoned kingdoms"],
    abilities: ["long memory", "slow assembly", "root speech", "siege strength"],
    temperament: "deliberate, grieving, devastating when resolved",
    scale: "towering",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; generation prompt creates an original Arcanea tree-being.",
      },
    ],
    relationships: [
      {
        targetSlug: "velouran-crown-stag",
        type: "guardian_of",
        label: "Both carry forest continuity, one as witness and one as judgment.",
        strength: 0.7,
      },
    ],
    arcaneaVariant: {
      name: "Ringroot Witness",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "walking ringwood archive whose trunk records every oath spoken under its shade",
      element: "Earth",
      visualDna: [
        "layered bark like stacked manuscripts",
        "root-ring shoulders",
        "moss-lit eyes",
        "gold pollen drifting from carved knots",
      ],
      behavior: [
        "speaks in compressed seasons",
        "votes by growing a new ring",
        "guards violated groves until reparations are made",
      ],
      canonBoundary:
        "Original Arcanea variant. Avoid Tolkien names, Ent language, film silhouettes, and Middle-earth staging.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "archive-tree anatomy, legal memory, living bark manuscripts, and monumental forest restraint",
      negativeConstraints: ["Treebeard likeness", "Middle-earth film still", "Ent language text"],
    },
    media: [{ id: "media-ringroot-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-frostbound-direwolf",
    slug: "frostbound-direwolf",
    name: "Direwolf",
    shortDescription:
      "A bonded great-wolf archetype tied to family, territorial loyalty, omen, and survival in harsh northern landscapes.",
    source: {
      sourceWorld: "A Song of Ice and Fire",
      sourceWork: "A Song of Ice and Fire novels and screen adaptations",
      creatureName: "Direwolf",
      franchiseOwner: "George R. R. Martin / HBO licensing ecosystem",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["great wolf", "house companion", "northern omen", "pack guardian"],
    habitats: ["snow forests", "frozen rivers", "border keeps"],
    abilities: ["pack sensing", "snow tracking", "omen behavior", "protective bond"],
    temperament: "loyal, territorial, emotionally mirrored",
    scale: "large predator companion",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; generation prompt creates a distinct Arcanea frost guardian.",
      },
    ],
    relationships: [
      {
        targetSlug: "moon-mirror-kitsune",
        type: "rival",
        label: "Pack loyalty meets solitary shapeshift cunning.",
        strength: 0.46,
      },
    ],
    arcaneaVariant: {
      name: "Frostbound Oathwolf",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "ice-veined oath guardian that mirrors the vow-state of its bonded house",
      element: "Water",
      visualDna: [
        "blue-white frost mane",
        "transparent ice along the spine",
        "silver oath-rings around the paws",
        "breath that crystallizes into sigils",
      ],
      behavior: [
        "tracks broken promises by scent",
        "refuses commands that violate a sworn bond",
        "howls only before irreversible choices",
      ],
      canonBoundary:
        "Original Arcanea variant. Avoid named house sigils, character associations, and screen adaptation design language.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "oath-bound frost ecology, large wolf anatomy, crystalline breath, and sovereign restraint",
      negativeConstraints: ["Stark sigil", "Game of Thrones frame", "named direwolf likeness"],
    },
    media: [{ id: "media-frostbound-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-reefback-choir-whale",
    slug: "reefback-choir-whale",
    name: "Reefback Leviathan",
    shortDescription:
      "A peaceful leviathan archetype whose body becomes habitat, navigation landmark, and living reef.",
    source: {
      sourceWorld: "Subnautica",
      sourceWork: "Subnautica video game",
      creatureName: "Reefback Leviathan",
      franchiseOwner: "Unknown Worlds / Krafton",
      referenceMode: "factual_reference",
    },
    rightsTier: "factual_reference_only",
    taxonomy: ["gentle leviathan", "living reef", "ocean ecology", "habitat bearer"],
    habitats: ["open ocean", "coral columns", "thermal currents"],
    abilities: ["reef symbiosis", "low-frequency song", "micro-ecosystem hosting", "current reading"],
    temperament: "peaceful, slow, socially resonant",
    scale: "massive aquatic",
    citations: [
      {
        label: "Source work reference",
        note: "Protected-source factual metadata only; prompt creates an original Arcanea ocean carrier.",
      },
    ],
    relationships: [
      {
        targetSlug: "mirror-shell-atlas-tortoise",
        type: "symbiotic_with",
        label: "Both carry ecosystems, one through sea and one through cosmos.",
        strength: 0.52,
      },
    ],
    arcaneaVariant: {
      name: "Reefback Choir Whale",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "cathedral-sized whale whose coral organs sing maps into water",
      element: "Water",
      visualDna: [
        "arched cathedral ribs",
        "living coral crown",
        "moonlit teal bioluminescence",
        "schools of tiny guidefish orbiting its fins",
      ],
      behavior: [
        "sings migration routes for smaller species",
        "hosts coral villages after storms",
        "changes song when ocean memory is damaged",
      ],
      canonBoundary:
        "Original Arcanea variant. Avoid Subnautica creature silhouette, game colors, and exact reefback surface anatomy.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "living cathedral reef, gentle leviathan scale, oceanic bioluminescence, and symbiotic anatomy",
      negativeConstraints: ["Subnautica screenshot", "Reefback exact silhouette", "game UI"],
    },
    media: [{ id: "media-reefback-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-moon-mirror-kitsune",
    slug: "moon-mirror-kitsune",
    name: "Kitsune",
    shortDescription:
      "A fox-spirit archetype associated with shapeshifting, riddles, thresholds, long memory, and social consequence.",
    source: {
      sourceWorld: "Japanese folklore",
      sourceWork: "Kitsune folklore traditions",
      creatureName: "Kitsune",
      referenceMode: "public_domain_adaptation",
    },
    rightsTier: "public_domain",
    taxonomy: ["fox spirit", "shapeshifter", "trickster", "threshold guardian"],
    habitats: ["moonlit shrines", "bamboo roads", "mirror pools"],
    abilities: ["illusion", "shape-change", "oath testing", "memory theft"],
    temperament: "playful, exacting, morally surgical",
    scale: "small to human-scale spirit",
    citations: [
      {
        label: "Folklore reference",
        note: "Public-domain folklore archetype adapted with cultural care and without claiming authority over living traditions.",
      },
    ],
    relationships: [
      {
        targetSlug: "frostbound-direwolf",
        type: "rival",
        label: "Pack truth meets mirror misdirection.",
        strength: 0.46,
      },
    ],
    arcaneaVariant: {
      name: "Moon-Mirror Kitsune",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "mirror-tailed fox spirit that tests whether a promise still reflects its maker",
      element: "Void",
      visualDna: [
        "nine mirror-glass tail planes",
        "silver-black fur",
        "teal moonfire eyes",
        "reflections that lag half a second behind",
      ],
      behavior: [
        "asks questions that sound like gifts",
        "steals only false names",
        "leads travelers to the door they avoided",
      ],
      canonBoundary:
        "Public-domain folklore adapted respectfully. Avoid sacred caricature, costume flattening, and modern anime mascot treatment.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "elegant fox-spirit anatomy, reflective tail planes, moonlit threshold ritual, and restrained mystery",
      negativeConstraints: ["anime mascot", "cultural caricature", "oversexualized spirit"],
    },
    media: [{ id: "media-moon-mirror-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-storm-plume-hippogriff",
    slug: "storm-plume-hippogriff",
    name: "Hippogriff",
    shortDescription:
      "A hybrid eagle-horse archetype associated with pride, etiquette, flight, and the tension between wildness and nobility.",
    source: {
      sourceWorld: "European literary folklore",
      sourceWork: "Hippogriff mythic and literary traditions",
      creatureName: "Hippogriff",
      referenceMode: "public_domain_adaptation",
    },
    rightsTier: "public_domain",
    taxonomy: ["hybrid mount", "eagle horse", "honor beast", "aerial courtship"],
    habitats: ["storm cliffs", "high meadows", "ruined observatories"],
    abilities: ["precision flight", "ritual recognition", "talon strike", "weather reading"],
    temperament: "proud, responsive to respect, quick to leave",
    scale: "large mount",
    citations: [
      {
        label: "Folklore reference",
        note: "Public-domain archetype; avoid copying specific modern franchise treatments.",
      },
    ],
    relationships: [
      {
        targetSlug: "aeralith-sky-grazer",
        type: "mount_of",
        label: "Different answers to the same sky-travel need: grace versus carrying power.",
        strength: 0.5,
      },
    ],
    arcaneaVariant: {
      name: "Storm-Plume Hippogriff",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "courtly storm mount whose feathers conduct atmospheric verdicts",
      element: "Wind",
      visualDna: [
        "long storm-blue crest",
        "brass talon bands grown from bone",
        "horse shoulders built for vertical launch",
        "feathers tipped with white static",
      ],
      behavior: [
        "bows only to mutual respect",
        "refuses dishonest riders",
        "lands by folding thunder under its wings",
      ],
      canonBoundary:
        "Public-domain archetype adapted into Arcanea. Avoid modern franchise-specific hippogriff designs.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "noble hybrid anatomy, storm-feather physics, courtly respect ritual, and realistic mount design",
      negativeConstraints: ["Harry Potter hippogriff likeness", "school uniform", "cartoon eagle horse"],
    },
    media: [{ id: "media-storm-plume-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
  {
    id: "creature-phoenix-ember-crown",
    slug: "phoenix-ember-crown",
    name: "Phoenix",
    shortDescription:
      "A firebird archetype of death, renewal, cyclical time, sacrifice, and the cost of returning changed.",
    source: {
      sourceWorld: "Ancient and medieval bestiary traditions",
      sourceWork: "Phoenix mythic traditions",
      creatureName: "Phoenix",
      referenceMode: "public_domain_adaptation",
    },
    rightsTier: "public_domain",
    taxonomy: ["firebird", "renewal spirit", "cycle beast", "omen"],
    habitats: ["sun temples", "ash groves", "desert dawns"],
    abilities: ["rebirth", "healing ash", "solar navigation", "memory through flame"],
    temperament: "radiant, solitary, severe about waste",
    scale: "large bird spirit",
    citations: [
      {
        label: "Mythic reference",
        note: "Public-domain archetype adapted into Arcanea.",
      },
    ],
    relationships: [
      {
        targetSlug: "ember-kin-rail-drake",
        type: "ecological_neighbor",
        label: "The phoenix renews what the drake warns away from harm.",
        strength: 0.61,
      },
    ],
    arcaneaVariant: {
      name: "Ember-Crown Phoenix",
      arcaneaWorld: "Arcanea Creature Atlas",
      archetype: "solar firebird that regrows from the one memory it refused to abandon",
      element: "Fire",
      visualDna: [
        "crown of low white flame",
        "charcoal-black primary feathers",
        "gold ember eyes",
        "ash constellations across the chest",
      ],
      behavior: [
        "returns only after a true ending",
        "heals with ash that preserves grief",
        "burns false nostalgia out of relics",
      ],
      canonBoundary:
        "Public-domain archetype adapted into Arcanea. Avoid copying any modern franchise phoenix design.",
      generationPolicy: "allowed_original_variant",
      promptFocus:
        "renewal without sentimentality, white-gold fire crown, ash-memory texture, and sacred bird anatomy",
      negativeConstraints: ["Harry Potter phoenix likeness", "cartoon firebird", "flaming logo"],
    },
    media: [{ id: "media-phoenix-prompt", status: "prompt_ready" }],
    status: "approved",
    steward: "Arcanea Canon Council",
    updatedAt: UPDATED_AT,
  },
];

export const CREATURE_ATLAS_ENTRIES: CreatureAtlasEntry[] = RAW_CREATURES.map((entry) => ({
  ...entry,
  promptPack: entry.promptPack ?? creatureAtlasEntryToPromptPack(entry),
}));

export const CREATURE_RIGHTS_LABELS: Record<CreatureRightsTier, string> = {
  original_arcanea: "Original Arcanea",
  public_domain: "Public domain",
  licensed: "Licensed",
  factual_reference_only: "Reference only",
  blocked: "Blocked",
};

export function getCreatureBySlug(slug: string): CreatureAtlasEntry | undefined {
  return CREATURE_ATLAS_ENTRIES.find((entry) => entry.slug === slug);
}

export function searchCreatureAtlas(params: CreatureAtlasSearchParams = {}): CreatureAtlasEntry[] {
  const query = params.query?.trim().toLowerCase();
  const taxonomy = params.taxonomy?.trim().toLowerCase();
  const limit = params.limit ?? CREATURE_ATLAS_ENTRIES.length;

  return CREATURE_ATLAS_ENTRIES.filter((entry) => {
    if (query) {
      const haystack = [
        entry.name,
        entry.shortDescription,
        entry.source.sourceWorld,
        entry.source.sourceWork,
        entry.source.creatureName,
        entry.arcaneaVariant.name,
        entry.arcaneaVariant.archetype,
        ...entry.taxonomy,
        ...entry.habitats,
        ...entry.abilities,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (params.world && params.world !== "all" && entry.source.sourceWorld !== params.world) {
      return false;
    }

    if (params.element && params.element !== "all" && entry.arcaneaVariant.element !== params.element) {
      return false;
    }

    if (params.rights && params.rights !== "all" && entry.rightsTier !== params.rights) {
      return false;
    }

    if (taxonomy && !entry.taxonomy.some((item) => item.toLowerCase().includes(taxonomy))) {
      return false;
    }

    if (params.hasApprovedImage) {
      return entry.media.some((media) => media.status === "approved" && Boolean(media.url));
    }

    return true;
  }).slice(0, limit);
}

export function getCreatureAtlasStats() {
  const rights = countBy(CREATURE_ATLAS_ENTRIES.map((entry) => entry.rightsTier));
  const elements = countBy(CREATURE_ATLAS_ENTRIES.map((entry) => entry.arcaneaVariant.element));
  const worlds = countBy(CREATURE_ATLAS_ENTRIES.map((entry) => entry.source.sourceWorld));
  const approvedImages = CREATURE_ATLAS_ENTRIES.filter((entry) =>
    entry.media.some((media) => media.status === "approved" && Boolean(media.url)),
  ).length;

  return {
    total: CREATURE_ATLAS_ENTRIES.length,
    rights,
    elements,
    worlds,
    approvedImages,
    promptReady: CREATURE_ATLAS_ENTRIES.filter((entry) => Boolean(entry.promptPack)).length,
  };
}

export function getCreatureAtlasFilters() {
  return {
    worlds: uniqueSorted(CREATURE_ATLAS_ENTRIES.map((entry) => entry.source.sourceWorld)),
    elements: uniqueSorted(CREATURE_ATLAS_ENTRIES.map((entry) => entry.arcaneaVariant.element)),
    rights: uniqueSorted(CREATURE_ATLAS_ENTRIES.map((entry) => entry.rightsTier)),
    taxonomy: uniqueSorted(CREATURE_ATLAS_ENTRIES.flatMap((entry) => entry.taxonomy)),
  };
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function countBy(values: string[]): Record<string, number> {
  return values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}
