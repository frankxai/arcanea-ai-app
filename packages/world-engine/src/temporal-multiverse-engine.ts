/**
 * Temporal Multiverse Engine — Arcanea
 *
 * Implements the mathematical, acoustic, and narrative physics of the
 * Kingdom of Light, its Realms, Corridors, Linguistic Matrices, and the
 * Sandersonian Magic Toll & Monomyth Progression Frameworks.
 */

import type {
  RealmDefinition,
  LinguisticFamily,
  SettlementEra,
  CorridorConnection,
  MultiverseProvenanceRecord,
  TemporalEpoch,
  GateId,
  GateFrequency,
  Element,
} from "@arcanea/schemas";

// ============================================================================
// CANONICAL LINGUISTIC FAMILIES (TOLKIEN PHILOLOGICAL FOUNDATION)
// ============================================================================

export const LINGUISTIC_FAMILIES: Record<string, LinguisticFamily> = {
  eldrian: {
    id: "eldrian",
    name: "High Eldrian (Lapis Chords)",
    dominantGate: "source",
    harmonicFrequencyHz: 1111,
    phonology: {
      preferredConsonants: ["Sh", "L", "M", "R", "K", "Th"],
      vowelHarmony: ["a", "i", "u", "ai", "ou"],
      prohibitedClusters: ["skr", "pht", "bz"],
      cadencePattern: "Hexameter with resonant harmonic pauses",
      sensoryTone: "Struck crystal, pure morning ozone, and deep starlight",
    },
    etymologicalRoots: {
      shin: "primordial consciousness",
      kami: "divine guardian",
      lum: "form-giving light",
      ark: "binding covenant",
      ael: "high starlight",
      sol: "undivided center",
    },
    namingPatterns: {
      masculineSuffixes: ["on", "ar", "iel"],
      feminineSuffixes: ["a", "ia", "ami"],
      neutralSuffixes: ["is", "or", "um"],
      toponymPrefixes: ["Eld-", "Celest-", "Shin-", "Sol-"],
    },
  },

  veldarín: {
    id: "veldarín",
    name: "Veldarín (Lyric Voice)",
    dominantGate: "voice",
    harmonicFrequencyHz: 528,
    phonology: {
      preferredConsonants: ["V", "L", "D", "R", "N", "S"],
      vowelHarmony: ["e", "o", "a", "ia"],
      prohibitedClusters: ["kt", "pt", "zg"],
      cadencePattern: "Trochaic lilt with breath caesuras",
      sensoryTone: "Wind through cedar, river reeds, and cooling rain",
    },
    etymologicalRoots: {
      vel: "unfolding valley",
      dor: "voice / spoken truth",
      mar: "flowing tide",
      ale: "clarity",
      syl: "living wood",
    },
    namingPatterns: {
      masculineSuffixes: ["an", "or", "en"],
      feminineSuffixes: ["a", "ina", "elle"],
      neutralSuffixes: ["is", "yn", "ir"],
      toponymPrefixes: ["Vel-", "Valle-", "Mar-", "Syl-"],
    },
  },

  aurevaldan: {
    id: "aurevaldan",
    name: "Aurevaldan (Solar Staccato)",
    dominantGate: "fire",
    harmonicFrequencyHz: 396,
    phonology: {
      preferredConsonants: ["P", "K", "R", "T", "G", "Dr"],
      vowelHarmony: ["a", "o", "u", "au"],
      prohibitedClusters: ["vl", "mn", "zth"],
      cadencePattern: "Anapestic march, sharp and kinetic",
      sensoryTone: "Struck flint, bronze bells, and dry desert heat",
    },
    etymologicalRoots: {
      aur: "gold / solar dawn",
      vald: "dominion / stronghold",
      pyr: "living fire",
      drak: "will / primordial scale",
      ign: "ignited conviction",
    },
    namingPatterns: {
      masculineSuffixes: ["us", "or", "ak"],
      feminineSuffixes: ["ia", "ara", "onys"],
      neutralSuffixes: ["ax", "or", "ix"],
      toponymPrefixes: ["Aur-", "Pyr-", "Fort-", "Drak-"],
    },
  },

  sunder_tongue: {
    id: "sunder_tongue",
    name: "Sunder-tongue (Shadowfen Argot)",
    dominantGate: "unity",
    harmonicFrequencyHz: 963,
    phonology: {
      preferredConsonants: ["Z", "Gh", "K", "R", "X", "M"],
      vowelHarmony: ["o", "u", "e", "ou"],
      prohibitedClusters: ["pl", "fl", "bl"],
      cadencePattern: "Syncopated guttural with lingering sibilance",
      sensoryTone: "Wet slate, cold iron, and dying embers",
    },
    etymologicalRoots: {
      mal: "fractured / fallen",
      fen: "submerged dark",
      khol: "void memory",
      ner: "unformed potential",
      vor: "deep abyss",
    },
    namingPatterns: {
      masculineSuffixes: ["ar", "ok", "ith"],
      feminineSuffixes: ["a", "ix", "yra"],
      neutralSuffixes: ["en", "or", "oth"],
      toponymPrefixes: ["Fen-", "Golg-", "Umbr-", "Khol-"],
    },
  },

  solar_common: {
    id: "solar_common",
    name: "Solar Common (Trade Tongue)",
    dominantGate: "foundation",
    harmonicFrequencyHz: 174,
    phonology: {
      preferredConsonants: ["B", "C", "D", "L", "M", "N", "T"],
      vowelHarmony: ["a", "e", "i", "o", "u"],
      prohibitedClusters: ["czx", "qkp"],
      cadencePattern: "Iambic conversational balance",
      sensoryTone: "Hearth bread, sun-baked clay, and harbor salt",
    },
    etymologicalRoots: {
      sol: "sun",
      ter: "earth",
      aqu: "water",
      vent: "wind",
      civ: "gathering of travelers",
    },
    namingPatterns: {
      masculineSuffixes: ["on", "er", "ard"],
      feminineSuffixes: ["a", "is", "en"],
      neutralSuffixes: ["an", "or", "el"],
      toponymPrefixes: ["Port-", "Cross-", "High-", "Sun-"],
    },
  },

  deep_runic: {
    id: "deep_runic",
    name: "Deep Runic (Granite Whisper)",
    dominantGate: "heart",
    harmonicFrequencyHz: 417,
    phonology: {
      preferredConsonants: ["Gr", "Br", "Th", "K", "D", "N"],
      vowelHarmony: ["u", "o", "a"],
      prohibitedClusters: ["sl", "vr", "shl"],
      cadencePattern: "Spondaic heavy drumbeat",
      sensoryTone: "Subterranean basalt, struck granite, and sulfur veins",
    },
    etymologicalRoots: {
      tor: "unmoving mountain",
      krag: "fractured stone",
      fund: "unyielding bedrock",
      run: "inscribed memory",
    },
    namingPatterns: {
      masculineSuffixes: ["grim", "var", "und"],
      feminineSuffixes: ["da", "run", "ia"],
      neutralSuffixes: ["ok", "um", "ar"],
      toponymPrefixes: ["Tor-", "Krag-", "Iron-", "Deep-"],
    },
  },
};

// ============================================================================
// CANONICAL REALMS OF THE KINGDOM OF LIGHT
// ============================================================================

export const CANONICAL_REALMS: Record<string, RealmDefinition> = {
  eldria_prime: {
    id: "eldria_prime",
    name: "Eldria Prime (The Celestine Heartland)",
    settlementEra: "heartland",
    dominantGate: "source",
    frequencyHz: 1111,
    primaryElement: "spirit",
    linguisticFamilyId: "eldrian",
    geography: {
      terrain:
        "Mount Solaris, floating crystalline monasteries above cloudline",
      soilResonance:
        "Pure Lapis-veined marble holding primordial harmonic memory",
      weatherPhenomena:
        "Perpetual dawn, prism-refracted cloud rivers, ozone mists",
    },
    corridors: [
      {
        targetRealmId: "veldoria",
        resonanceHarmonicDelta: 583,
        stabilityIndex: 0.42,
        travelDaysByCorridor: 21,
        travelDaysBySurface: 360,
        isAquifer: false,
        status: "drifting",
      },
      {
        targetRealmId: "astraea_spires",
        resonanceHarmonicDelta: 370,
        stabilityIndex: 0.85,
        travelDaysByCorridor: 5,
        travelDaysBySurface: 45,
        isAquifer: false,
        status: "open",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/eldria.md",
    isLockedCanon: true,
  },

  veldoria: {
    id: "veldoria",
    name: "Veldoria (The Singing Valleys)",
    settlementEra: "second_settling",
    dominantGate: "voice",
    frequencyHz: 528,
    primaryElement: "wind",
    linguisticFamilyId: "veldarín",
    geography: {
      terrain:
        "Limestone valleys, living stone caves, and reed-choked river deltas",
      soilResonance:
        "Acoustically responsive chalk-stone that hums when stepped on",
      weatherPhenomena:
        "Harmonic wind-gales that tune chimes naturally across ridges",
    },
    corridors: [
      {
        targetRealmId: "mar_arcano",
        resonanceHarmonicDelta: 243,
        stabilityIndex: 0.95,
        travelDaysByCorridor: 7,
        travelDaysBySurface: 90,
        isAquifer: true,
        status: "open",
      },
      {
        targetRealmId: "aurevalde",
        resonanceHarmonicDelta: 132,
        stabilityIndex: 0.65,
        travelDaysByCorridor: 14,
        travelDaysBySurface: 180,
        isAquifer: false,
        status: "open",
      },
      {
        targetRealmId: "eldria_prime",
        resonanceHarmonicDelta: 583,
        stabilityIndex: 0.42,
        travelDaysByCorridor: 21,
        travelDaysBySurface: 360,
        isAquifer: false,
        status: "drifting",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/veldoria.md",
    isLockedCanon: true,
  },

  aurevalde: {
    id: "aurevalde",
    name: "Aurevalde (The Solar Steppes)",
    settlementEra: "first_settling",
    dominantGate: "fire",
    frequencyHz: 396,
    primaryElement: "fire",
    linguisticFamilyId: "aurevaldan",
    geography: {
      terrain: "Red clay mesas, obsidian cliffs, and solar-tempered steppes",
      soilResonance:
        "Thermal ironstone that holds heat through seven-night freezes",
      weatherPhenomena:
        "Dry lightning storms that spark purple phosphor across granite",
    },
    corridors: [
      {
        targetRealmId: "veldoria",
        resonanceHarmonicDelta: 132,
        stabilityIndex: 0.65,
        travelDaysByCorridor: 14,
        travelDaysBySurface: 180,
        isAquifer: false,
        status: "open",
      },
      {
        targetRealmId: "mar_arcano",
        resonanceHarmonicDelta: 111,
        stabilityIndex: 0.88,
        travelDaysByCorridor: 10,
        travelDaysBySurface: 120,
        isAquifer: true,
        status: "open",
      },
      {
        targetRealmId: "matter_reach",
        resonanceHarmonicDelta: 21,
        stabilityIndex: 0.92,
        travelDaysByCorridor: 3,
        travelDaysBySurface: 28,
        isAquifer: false,
        status: "open",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/aurevalde.md",
    isLockedCanon: true,
  },

  mar_arcano: {
    id: "mar_arcano",
    name: "Mar Arcano (The Subterranean Sea)",
    settlementEra: "heartland",
    dominantGate: "flow",
    frequencyHz: 285,
    primaryElement: "water",
    linguisticFamilyId: "veldarín",
    geography: {
      terrain:
        "Inland subterranean sea fed by five realm-aquifers under bedrock",
      soilResonance:
        "Salt-crusted basalt with silver sediment reflecting bioluminescence",
      weatherPhenomena:
        "Subsurface tidal surges responding to celestial gate alignments",
    },
    corridors: [
      {
        targetRealmId: "veldoria",
        resonanceHarmonicDelta: 243,
        stabilityIndex: 0.95,
        travelDaysByCorridor: 7,
        travelDaysBySurface: 90,
        isAquifer: true,
        status: "open",
      },
      {
        targetRealmId: "aurevalde",
        resonanceHarmonicDelta: 111,
        stabilityIndex: 0.88,
        travelDaysByCorridor: 10,
        travelDaysBySurface: 120,
        isAquifer: true,
        status: "open",
      },
      {
        targetRealmId: "the_shadowfen",
        resonanceHarmonicDelta: 111,
        stabilityIndex: 0.35,
        travelDaysByCorridor: 18,
        travelDaysBySurface: 240,
        isAquifer: true,
        status: "drifting",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/mar-arcano.md",
    isLockedCanon: true,
  },

  the_shadowfen: {
    id: "the_shadowfen",
    name: "The Shadowfen (Malachar's Cradle)",
    settlementEra: "fallen",
    dominantGate: "foundation",
    frequencyHz: 174,
    primaryElement: "void",
    linguisticFamilyId: "sunder_tongue",
    geography: {
      terrain:
        "Black peat wetlands, sunken obsidian arches, and petrified cedar groves",
      soilResonance:
        "Cold-conducting peat that absorbs sound within three paces",
      weatherPhenomena:
        "Perpetual silver twilight, fog dampening all acoustic echoes",
    },
    corridors: [
      {
        targetRealmId: "mar_arcano",
        resonanceHarmonicDelta: 111,
        stabilityIndex: 0.35,
        travelDaysByCorridor: 18,
        travelDaysBySurface: 240,
        isAquifer: true,
        status: "drifting",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/the-shadowfen.md",
    isLockedCanon: true,
  },

  astraea_spires: {
    id: "astraea_spires",
    name: "Astraea Spires (Prismatic Observatory)",
    settlementEra: "first_settling",
    dominantGate: "sight",
    frequencyHz: 741,
    primaryElement: "spirit",
    linguisticFamilyId: "eldrian",
    geography: {
      terrain: "Twin needles of quartz rising above glacial valleys",
      soilResonance:
        "Optical quartz that refracts starlight directly into harmonic tone",
      weatherPhenomena:
        "Aurora ribbons descending to touch the observatory domes",
    },
    corridors: [
      {
        targetRealmId: "eldria_prime",
        resonanceHarmonicDelta: 370,
        stabilityIndex: 0.85,
        travelDaysByCorridor: 5,
        travelDaysBySurface: 45,
        isAquifer: false,
        status: "open",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/astraea.md",
    isLockedCanon: true,
  },

  matter_reach: {
    id: "matter_reach",
    name: "Matter Reach (The Granite Bastion)",
    settlementEra: "heartland",
    dominantGate: "heart",
    frequencyHz: 417,
    primaryElement: "earth",
    linguisticFamilyId: "deep_runic",
    geography: {
      terrain:
        "Tiered granite canyons, iron foundry forges carved into bedrock",
      soilResonance:
        "Magnetized lodestone that anchors gravitational equilibrium",
      weatherPhenomena:
        "Dust devils laced with copper filings that glint under sun",
    },
    corridors: [
      {
        targetRealmId: "aurevalde",
        resonanceHarmonicDelta: 21,
        stabilityIndex: 0.92,
        travelDaysByCorridor: 3,
        travelDaysBySurface: 28,
        isAquifer: false,
        status: "open",
      },
    ],
    canonicalLoreFile: ".arcanea/lore/realms/matter-reach.md",
    isLockedCanon: true,
  },
};

// ============================================================================
// CHRONOLOGICAL EPOCHS (TEMPORAL DEEP-TIME)
// ============================================================================

export const CANONICAL_EPOCHS: TemporalEpoch[] = [
  {
    id: "epoch_primordial",
    name: "Dawn of the Duality",
    order: 1,
    timeframeDescription:
      "Before recorded reckoning; Lumina and Nero establish the First Pattern",
    cosmicEvents: [
      "Formation of the Ten Solfeggio Gates",
      "Bonding of the Ten Godbeasts with elemental leylines",
      "Singing of the Primordial Chords",
    ],
    arcaneEntropyRate: 0.01,
  },
  {
    id: "epoch_first_war",
    name: "The First War & The Fall of Malachar",
    order: 2,
    timeframeDescription:
      "3,000 years prior to the Saga; Malachar's attempted forced fusion with Shinkami",
    cosmicEvents: [
      "The Shattering of Mount Solaris",
      "Corridor shifts across all Heartlands",
      "Sealing of Malachar beneath the Shadowfen peat",
    ],
    arcaneEntropyRate: 0.75,
  },
  {
    id: "epoch_settlings",
    name: "The Era of Settlings & Corridors",
    order: 3,
    timeframeDescription:
      "Centuries 1 through 25 post-Sealing; migration into Veldoria, Aurevalde, and Mar Arcano",
    cosmicEvents: [
      "Establishment of the Seven Academy Houses",
      "Discovery of the Mar Arcano five-realm aquifer",
      "Stabilization of the Second Settling realms",
    ],
    arcaneEntropyRate: 0.15,
  },
  {
    id: "epoch_present_saga",
    name: "The Awakening Trials (Current Epoch)",
    order: 4,
    timeframeDescription:
      "Present day; Arion, Mera, and Emilia enter the Entrance Trials",
    cosmicEvents: [
      "The Void Portal breach at the Entrance Crucible",
      "Resurgence of the Lapis Chords across Eldria",
      "Re-tuning of the Ten Gates for a new generation of Seekers",
    ],
    arcaneEntropyRate: 0.45,
  },
];

// ============================================================================
// SANDERSONIAN MAGIC TOLL & LIMITATION ENGINE
// ============================================================================

export interface MagicTollResult {
  gateId: GateId;
  frequencyHz: GateFrequency;
  intensity: "minor" | "moderate" | "severe" | "cataclysmic";
  physicalCost: string;
  sensoryFeedback: string;
  limitation: string;
  acousticDissonance: string;
  counterHarmonicRemedy: string;
}

export const GATE_TOLL_REGISTRY: Record<
  GateId,
  {
    frequencyHz: GateFrequency;
    costs: Record<
      "minor" | "moderate" | "severe" | "cataclysmic",
      {
        physical: string;
        sensory: string;
        limitation: string;
        dissonance: string;
        remedy: string;
      }
    >;
  }
> = {
  foundation: {
    frequencyHz: 174,
    costs: {
      minor: {
        physical: "Mild bone ache and chalky dryness on the back of the tongue",
        sensory: "Low thrumming vibration in the soles of feet",
        limitation: "Cannot affect objects disconnected from geological ground",
        dissonance: "Slight tremor in fine motor finger coordination",
        remedy: "Warm salt bath and resting on packed earth for 1 hour",
      },
      moderate: {
        physical: "Joint stiffness and marrow fatigue lasting two sun-turns",
        sensory:
          "Tasting dry river clay; hearing distant subterranean grinding",
        limitation: "Density alteration limited to 3 paces radius",
        dissonance: "Temporary inability to sense ambient temperature",
        remedy:
          "Submersion in Mar Arcano brine accompanied by 528 Hz wind chime tuning",
      },
      severe: {
        physical:
          "Micro-fractures in tibia and radius; acute calcium depletion",
        sensory:
          "Total silence in auditory field as lower frequencies overwhelm ears",
        limitation:
          "Structural anchor breaks if the channeler moves from their stance",
        dissonance: "Prolonged numbness across limbs for seven days",
        remedy:
          "Ingestion of crushed basalt lichen and total sensory rest in silence",
      },
      cataclysmic: {
        physical: "Partial petrification of peripheral muscular tissue",
        sensory: "Sensation of unyielding bedrock collapsing inward",
        limitation: "Channeler is physically pinned to the earth for 24 hours",
        dissonance: "Harmonic inversion causing local earth rifts",
        remedy:
          "Emergency intervention by Guardian Lyssandria with Solfeggio acoustic reset",
      },
    },
  },
  flow: {
    frequencyHz: 285,
    costs: {
      minor: {
        physical: "Mild thirst and dry lips",
        sensory: "Faint taste of river silt",
        limitation: "Cannot shape liquid already boiling or frozen",
        dissonance: "Slight drop in vascular blood pressure",
        remedy: "Drinking two cups of spring water with silver sediment",
      },
      moderate: {
        physical:
          "Acute cellular dehydration; tears taste intensely of sea brine",
        sensory: "Auditory phantom of rushing tides behind eardrums",
        limitation: "Fluid volume cannot exceed channeler's own body weight",
        dissonance: "Dizziness and sudden cold sweat",
        remedy: "Thermal stone immersion and 396 Hz subharmonic warmth",
      },
      severe: {
        physical:
          "Severe plasma dehydration; skin pales and puckers at fingertips",
        sensory: "Visual blurring as tear ducts dry completely",
        limitation: "Flow dissolves instantly if channeler experiences panic",
        dissonance: "Cardiac rhythm temporarily mimics oceanic swell cadence",
        remedy:
          "Direct infusion of Mar Arcano aquifer water under medical supervision",
      },
      cataclysmic: {
        physical:
          "Total bodily desiccation risk; blood viscosity thickens dangerously",
        sensory: "Absolute aquatic silence, smelling deep ocean trenches",
        limitation: "Channeler cannot manifest warmth for one lunar cycle",
        dissonance: "Rupture of local aquifer membranes",
        remedy:
          "Continuous suspension in a living water chamber guided by Guardian Leyla",
      },
    },
  },
  fire: {
    frequencyHz: 396,
    costs: {
      minor: {
        physical: "Elevated core body temperature (+1.5 deg C); dry throat",
        sensory: "Faint smell of scorched flint and pine sap",
        limitation: "Requires an existing heat source or spark to amplify",
        dissonance: "Restlessness and irritable heartbeat",
        remedy: "Cool river reed tea and shade rest",
      },
      moderate: {
        physical: "Blistering on fingertips and scorched cuticles",
        sensory: "Smell of sulfur; persistent orange after-images in eyes",
        limitation: "Cannot burn inorganic stone without physical fuel",
        dissonance: "Fever spikes lasting through the next evening",
        remedy: "Application of aloe and Mar Arcano river sediment packs",
      },
      severe: {
        physical:
          "Second-degree epidermal thermal burns along forearm channels",
        sensory: "Deafening roar of furnace winds in inner ear",
        limitation:
          "Flame immediately turns on the caster if breath control slips",
        dissonance: "Persistent hyperthermia and metabolic exhaustion",
        remedy:
          "Cryo-infusion of deep aquifer ice and 285 Hz subharmonic calming",
      },
      cataclysmic: {
        physical:
          "Spontaneous combustion of outer dermis; carbonization of fingernails",
        sensory: "Smell of melting iron; absolute white-out vision",
        limitation: "Consumes all available oxygen within 20 paces radius",
        dissonance: "Atmospheric thermal storm that lingers for hours",
        remedy: "Guardian Draconia's solar-tempering veil and complete stasis",
      },
    },
  },
  heart: {
    frequencyHz: 417,
    costs: {
      minor: {
        physical: "Emotional fatigue and dull ache behind sternum",
        sensory: "Tasting raw copper and struck iron",
        limitation:
          "Cannot mend wounds caused by malice without knowing the victim's name",
        dissonance: "Heightened sensitivity to loud voices",
        remedy: "Solitary quietude and chamomile brew",
      },
      moderate: {
        physical:
          "Arrhythmia and palpitations; acute empathy bleed (feeling pain of nearby beings)",
        sensory: "Smell of damp earth after heavy thunder",
        limitation: "Equal emotional burden taken onto the channeler",
        dissonance: "Involuntary weeping or trembling for 3 hours",
        remedy:
          "Resting in a silent granite chamber with 174 Hz foundation hum",
      },
      severe: {
        physical: "Tearing of pectoral muscle fibers; severe tachycardia",
        sensory:
          "Feeling the heartbeat of every living creature in a 50-pace circle",
        limitation:
          "Cannot undo structural organ failure without a living anchor",
        dissonance: "Psychic numbness and loss of personal joy for seven weeks",
        remedy:
          "Guardian Maylinn's empathetic grounding rite and willow bark poultice",
      },
      cataclysmic: {
        physical: "Acute cardiac arrest risk; structural heart chamber strain",
        sensory:
          "A profound, crushing silence as if the world stopped breathing",
        limitation:
          "Life-force tether permanently binds channeler to the recipient",
        dissonance: "Permanent sympathetic pain connection to the subject",
        remedy: "Immediate resuscitation by dual masters of Flow and Matter",
      },
    },
  },
  voice: {
    frequencyHz: 528,
    costs: {
      minor: {
        physical: "Hoarseness and vocal cord tightness",
        sensory: "Slight buzzing in teeth when humming",
        limitation: "Must be enunciated clearly; whispering nullifies power",
        dissonance: "High-frequency ringing in left ear",
        remedy: "Honeyed wild clover tea and silence for 4 hours",
      },
      moderate: {
        physical: "Laryngeal micro-tears; temporary complete muteness",
        sensory: "Smell of cedar wood and ozone; persistent 528 Hz ring",
        limitation: "Sound does not propagate in vacuums or dense peat fog",
        dissonance: "Mild vertigo caused by cochlear fluid vibration",
        remedy: "Marshmallow root decoction and 12 hours of total silence",
      },
      severe: {
        physical: "Vocal cord hemorrhage; blood in saliva after incantation",
        sensory: "Temporary partial deafness to human speech frequencies",
        limitation: "Spoken commands cannot violate the subject's true name",
        dissonance: "Prolonged vestibular imbalance and nausea",
        remedy:
          "Application of soothing veldar reed ointment and silence for one moon cycle",
      },
      cataclysmic: {
        physical:
          "Permanent destruction of vocal folds; internal acoustic concussion",
        sensory: "Total shatter sound like splitting crystal in both ears",
        limitation: "Reverberation shatters all glass and crystal in 100 paces",
        dissonance: "Acoustic shockwave inducing immediate blackout",
        remedy:
          "Reconstruction through High Eldrian crystal harmony by Guardian Alera",
      },
    },
  },
  sight: {
    frequencyHz: 741,
    costs: {
      minor: {
        physical: "Eye strain and mild frontal headache",
        sensory: "Purple phosphor halo around lights",
        limitation: "Cannot penetrate lead or mirror-lined barriers",
        dissonance: "Slight lag in depth perception",
        remedy: "Cool cucumber compress and darkness for 30 minutes",
      },
      moderate: {
        physical:
          "Severe photophobia, bursting of sclera capillaries (bloodshot eyes)",
        sensory: "Chromatic aberration; seeing emotional auras involuntarily",
        limitation:
          "True sight reveals illusions but blinds normal vision for 10 minutes",
        dissonance: "Intense ocular migraine with flashing scotoma",
        remedy:
          "Wearing an obsidian-tinted visor and sleeping in absolute dark",
      },
      severe: {
        physical: "Retinal scorching; temporary blindness lasting 3 sun-turns",
        sensory: "Hallucinatory flashes of ancient cosmic battles",
        limitation:
          "Cannot look upon Malachar's void runes without psychic trauma",
        dissonance:
          "Inability to differentiate physical bodies from spirit projections",
        remedy:
          "Herbal eyewash of Astraea quartz water and 417 Hz soothing compress",
      },
      cataclysmic: {
        physical:
          "Permanent loss of optical sight in one eye; optic nerve crystallization",
        sensory: "Perpetual prism fracturing across the remaining visual field",
        limitation:
          "Forces the channeler to see future outcomes that cannot be changed",
        dissonance: "Total sensory detachment from physical surroundings",
        remedy:
          "Guardian Lyria's sight-transference blessing and permanent starlight veil",
      },
    },
  },
  crown: {
    frequencyHz: 852,
    costs: {
      minor: {
        physical: "Tingling sensation across scalp and occipital ridge",
        sensory: "Smell of fresh snow on hot stone",
        limitation:
          "Requires uninterrupted concentration; touch breaks the link",
        dissonance: "Brief mental fog when shifting tasks",
        remedy: "Drinking rosemary tea and brisk walking outdoors",
      },
      moderate: {
        physical: "Severe tension headache; memory blips of the preceding hour",
        sensory: "Feeling a crown of cold iron pressing down into skull",
        limitation:
          "Cannot read minds with contrary moral alignment without consent",
        dissonance: "Auditory phantom thoughts from strangers within 10 paces",
        remedy:
          "Holding a cold iron sphere and reciting one's ancestral line aloud",
      },
      severe: {
        physical: "Nosebleeds; temporary loss of short-term episodic memory",
        sensory:
          "Sensation of consciousness expanding past the skull into the clouds",
        limitation:
          "Ego dissolution; risk of forgetting one's own name and purpose",
        dissonance:
          "Disorientation regarding whether an event occurred or was imagined",
        remedy:
          "Tactile grounding with packed Aurevalde red clay and Guardian Aiyami's counsel",
      },
      cataclysmic: {
        physical:
          "Comatose psychic state lasting several days; neural exhaustion",
        sensory: "Total cosmic white-out where time has no linear progression",
        limitation:
          "Permanent opening of the crown fontanelle to cosmic radio static",
        dissonance: "Schism between conscious self and subconscious universe",
        remedy: "Full cranial resonance retuning by Archmages of Eldria",
      },
    },
  },
  starweave: {
    frequencyHz: 963,
    costs: {
      minor: {
        physical: "Sensation of zero gravity; hair floating upward slightly",
        sensory: "Faint musical chiming in the teeth",
        limitation:
          "Cannot warp space through consecrated ground without permission",
        dissonance: "Slight disorientation when stepping over thresholds",
        remedy: "Wearing heavy bronze anklets and eating roasted grain",
      },
      moderate: {
        physical: "Gravitational vertigo; body weight fluctuates by 20%",
        sensory: "Smell of interstellar vacuum (burnt electrical ozone)",
        limitation:
          "Cannot fold distances greater than what the eye can clearly see",
        dissonance: "Shadows detached from physical limbs for 2 hours",
        remedy: "Sleeping beneath weighted lead blankets on solid bedrock",
      },
      severe: {
        physical:
          "Cellular density distortion; bruising along spatial stress lines",
        sensory:
          "Seeing stars in broad daylight; feeling pulled in multiple directions",
        limitation:
          "Corridor creation causes temporal lag in the local environment",
        dissonance:
          "Displacement sickness; body feels out of phase with physical matter",
        remedy: "Subterranean lodging in Matter Reach for seven full rotations",
      },
      cataclysmic: {
        physical:
          "Phase-drift; physical matter becomes semi-transparent and intangible",
        sensory:
          "Hearing the rotation of planets; absolute spatial disorientation",
        limitation: "May tear an uncontrolled micro-corridor into the void",
        dissonance:
          "Temporal dislocation; channeler appears 5 seconds after they speak",
        remedy: "Containment in Guardian Ino's star-woven anchor matrix",
      },
    },
  },
  unity: {
    frequencyHz: 963,
    costs: {
      minor: {
        physical: "Mild tingling across both palms; feeling communal heartbeat",
        sensory: "Taste of sweet rainwater and honey",
        limitation: "Must have willing participation of at least two souls",
        dissonance:
          "Slight confusion of personal pronouns (saying 'we' instead of 'I')",
        remedy: "Writing a personal journal entry alone in quiet solitude",
      },
      moderate: {
        physical:
          "Sympathetic physical fatigue matching the weakest party member",
        sensory:
          "Experiencing shared sensory perceptions (smelling what partner smells)",
        limitation:
          "Broken trust immediately shatters the harmonic link with concussive force",
        dissonance:
          "Temporary bleed of foreign childhood memories into consciousness",
        remedy:
          "Carving a personal stone rune and meditating on one's private boundaries",
      },
      severe: {
        physical:
          "Severe psychic drain; physical wounds shared across the entire circle",
        sensory: "Loss of the sensation of individual skin and body boundaries",
        limitation:
          "If one member falls into the void, the entire circle is pulled toward it",
        dissonance: "Identity dissociation lasting several weeks",
        remedy:
          "Isolation in a silent salt room with Guardian Elara's anchoring chords",
      },
      cataclysmic: {
        physical: "Complete dissolution of individual ego into hive resonance",
        sensory:
          "Total oceanic merging where individual thought ceases to exist",
        limitation:
          "Irreversible without the external intervention of a Source Luminor",
        dissonance: "Permanent loss of private thoughts between bonded members",
        remedy: "Ritual severance at Mount Solaris by Guardian Shinkami",
      },
    },
  },
  source: {
    frequencyHz: 1111,
    costs: {
      minor: {
        physical:
          "Skin glows with silver bioluminescence for 1 hour; increased body heat",
        sensory: "Pure crystalline chord resonating through all marrow",
        limitation: "Cannot be directed toward selfish or destructive ends",
        dissonance: "Ordinary food tastes bland and ashen for 24 hours",
        remedy: "Eating fresh fruit and drinking morning dew",
      },
      moderate: {
        physical:
          "Rapid metabolic burn; hair strands turn silver at the temples",
        sensory: "Smell of primordial starlight and burning cedar incense",
        limitation:
          "Channeler cannot lie or conceal truth while channeling Source",
        dissonance: "Insomnia as the pineal gland vibrates continuously",
        remedy:
          "Drinking pure gold-veined glacial meltwater from Mount Solaris",
      },
      severe: {
        physical:
          "Cellular crystallization; fingernails and iris turn iridescent silver",
        sensory:
          "Vision encompasses all 10 gates simultaneously; auditory overload",
        limitation:
          "Draws directly upon the channeler's natural lifespan as fuel",
        dissonance:
          "Physical reality feels thin, like paper waiting to dissolve",
        remedy: "Three-week stasis in the Primordial Spring of Lumina",
      },
      cataclysmic: {
        physical:
          "Ascension or total burnout; body dissolves into pure photonic energy",
        sensory: "The Voice of Lumina and Nero speaking in unison",
        limitation:
          "Changes the fundamental laws of physics in the local realm forever",
        dissonance:
          "Creation of a permanent cosmic singularity or new Solfeggio Gate",
        remedy:
          "Only Shinkami and the Assembly of Luminors can stabilize the remnant",
      },
    },
  },
};

export function calculateSandersonianMagicToll(
  gateId: GateId,
  intensity: "minor" | "moderate" | "severe" | "cataclysmic" = "moderate",
): MagicTollResult {
  const gateData = GATE_TOLL_REGISTRY[gateId] || GATE_TOLL_REGISTRY.voice;
  const cost = gateData.costs[intensity];

  return {
    gateId,
    frequencyHz: gateData.frequencyHz,
    intensity,
    physicalCost: cost.physical,
    sensoryFeedback: cost.sensory,
    limitation: cost.limitation,
    acousticDissonance: cost.dissonance,
    counterHarmonicRemedy: cost.remedy,
  };
}

// ============================================================================
// CAMPBELL-VOGLER 12-STAGE MONOMYTH PROGRESSION ENGINE
// ============================================================================

export interface MonomythStage {
  stageNumber: number;
  name: string;
  gateId: GateId;
  frequencyHz: GateFrequency;
  archetypeRole: string;
  narrativeTension: string;
  sensoryThreshold: string;
  transformationMilestone: string;
}

export const MONOMYTH_STAGES: MonomythStage[] = [
  {
    stageNumber: 1,
    name: "The Ordinary World",
    gateId: "foundation",
    frequencyHz: 174,
    archetypeRole: "The Unawakened Apprentice",
    narrativeTension:
      "Comfortable stagnation; mundane safety masking a deeper yearning",
    sensoryThreshold:
      "Smell of chimney woodsmoke and hearth bread; heavy boots on farm soil",
    transformationMilestone:
      "Recognition that the mundane world cannot answer the soul's questions",
  },
  {
    stageNumber: 2,
    name: "The Call to Adventure",
    gateId: "flow",
    frequencyHz: 285,
    archetypeRole: "The Herald",
    narrativeTension:
      "A disruption in the aquifer leylines or a song heard across the water",
    sensoryThreshold:
      "Sudden chill in the river water; a low vibration that ripples tea cups",
    transformationMilestone:
      "The seeker feels the tug of the current pulling them past familiar borders",
  },
  {
    stageNumber: 3,
    name: "Refusal of the Call",
    gateId: "fire",
    frequencyHz: 396,
    archetypeRole: "The Reluctant Hero",
    narrativeTension:
      "Fear of the physical cost; burning doubts about one's worthiness",
    sensoryThreshold:
      "Dry throat, heat flushing the cheeks, the bitter taste of fear",
    transformationMilestone:
      "Confronting the truth that staying safe is a slower form of dying",
  },
  {
    stageNumber: 4,
    name: "Meeting the Mentor",
    gateId: "heart",
    frequencyHz: 417,
    archetypeRole: "The Gate Guardian",
    narrativeTension:
      "Encountering a Master who does not flatter, but tests resolve with unbending stone",
    sensoryThreshold:
      "Sound of struck granite; a weathered hand offering a cracked compass",
    transformationMilestone:
      "Receiving the first tactile tool or relic and the discipline to wield it",
  },
  {
    stageNumber: 5,
    name: "Crossing the First Threshold",
    gateId: "voice",
    frequencyHz: 528,
    archetypeRole: "The Threshold Guardian",
    narrativeTension:
      "Speaking the First Incantation aloud; leaving the familiar heartlands behind",
    sensoryThreshold:
      "Passing from warm valleys into cold mountain wind; ringing in the inner ear",
    transformationMilestone:
      "There is no turning back; the seeker is now an active Mage in the world",
  },
  {
    stageNumber: 6,
    name: "Tests, Allies, and Enemies",
    gateId: "heart",
    frequencyHz: 417,
    archetypeRole: "The Fellowship & The Rival",
    narrativeTension:
      "Navigating competing agendas, shared bread, and the friction of diverse spirits",
    sensoryThreshold:
      "Campfires under unfamiliar constellations; the clatter of swords and shared laughter",
    transformationMilestone:
      "Forging authentic bonds of brotherhood and discovering who stands firm under fire",
  },
  {
    stageNumber: 7,
    name: "Approach to the Inmost Cave",
    gateId: "sight",
    frequencyHz: 741,
    archetypeRole: "The Seer",
    narrativeTension:
      "Piercing through comfortable illusions; seeing the true magnitude of the Shadowfen rift",
    sensoryThreshold:
      "Light fracturing into prismatic spectrums; shadows lengthening across ancient stone",
    transformationMilestone:
      "Accepting that victory will demand a permanent, irrecoverable physical sacrifice",
  },
  {
    stageNumber: 8,
    name: "The Supreme Ordeal",
    gateId: "crown",
    frequencyHz: 852,
    archetypeRole: "The Shadow / Malachar's Echo",
    narrativeTension:
      "Direct confrontation with the Void; ego death and psychic collapse in darkness",
    sensoryThreshold:
      "Absolute cold; the taste of ash; the terrible silence of the abyss",
    transformationMilestone:
      "Death of the false self; finding the spark of Lumina inside the deepest black",
  },
  {
    stageNumber: 9,
    name: "The Reward (Seizing the Sword)",
    gateId: "starweave",
    frequencyHz: 963,
    archetypeRole: "The Awakened Victor",
    narrativeTension:
      "Claiming the Lapis chord; harmonizing the gate with triumphant revelation",
    sensoryThreshold:
      "Blinding silver light; the ringing of ten cosmic bells in perfect fifths",
    transformationMilestone:
      "Attaining the rank of Archmage; wielding the power with humility rather than pride",
  },
  {
    stageNumber: 10,
    name: "The Road Back",
    gateId: "unity",
    frequencyHz: 963,
    archetypeRole: "The Trailblazer",
    narrativeTension:
      "Navigating unstable, drifting corridors back toward civilization under pursuit",
    sensoryThreshold:
      "Collapsing stone arches; the rush of aquifer tides flooding subterranean exits",
    transformationMilestone:
      "Committing to bring the light back rather than staying in solitary bliss",
  },
  {
    stageNumber: 11,
    name: "The Resurrection & Crucible",
    gateId: "unity",
    frequencyHz: 963,
    archetypeRole: "The Transformed Self",
    narrativeTension:
      "The final test where old wounds threaten to drag the hero back down; the synthesis",
    sensoryThreshold:
      "The simultaneous presence of blazing light and deep shadow, reconciled in peace",
    transformationMilestone:
      "Complete transcendence; understanding that Nero and Lumina are the two hands of one life",
  },
  {
    stageNumber: 12,
    name: "Return with the Elixir",
    gateId: "source",
    frequencyHz: 1111,
    archetypeRole: "The Sovereign Luminor",
    narrativeTension:
      "Re-entering the ordinary village transformed; serving the community as healer and builder",
    sensoryThreshold:
      "Touching the soil of home with silver-veined hands; the calm silence of mastery",
    transformationMilestone:
      "The Apprentice has become the Teacher; the cycle renews for the next generation",
  },
];

export function getMonomythStages(): MonomythStage[] {
  return MONOMYTH_STAGES;
}

export function getMonomythStage(stageNumber: number): MonomythStage {
  return (
    MONOMYTH_STAGES.find((s) => s.stageNumber === stageNumber) ||
    MONOMYTH_STAGES[0]
  );
}

// ============================================================================
// CANONICAL ENTITIES REGISTRY
// ============================================================================

export interface CanonicalGuardianEntity {
  id: string;
  name: string;
  gateNumber: number;
  gateId: GateId;
  frequencyHz: GateFrequency;
  realmId: string;
  element: Element;
  godbeast: string;
  title: string;
  linguisticFamilyId: string;
  tactileAnchor: string;
}

export const CANONICAL_GUARDIANS: CanonicalGuardianEntity[] = [
  {
    id: "lyssandria",
    name: "Lyssandria",
    gateNumber: 1,
    gateId: "foundation",
    frequencyHz: 174,
    realmId: "the_shadowfen",
    element: "earth",
    godbeast: "Kaelith",
    title: "Keeper of the Bedrock",
    linguisticFamilyId: "sunder_tongue",
    tactileAnchor: "Chalk-stone seal and carved slate prayer ring",
  },
  {
    id: "leyla",
    name: "Leyla",
    gateNumber: 2,
    gateId: "flow",
    frequencyHz: 285,
    realmId: "mar_arcano",
    element: "water",
    godbeast: "Veloura",
    title: "Mistress of the Aquifers",
    linguisticFamilyId: "veldarín",
    tactileAnchor: "Silver-sediment vial and iridescent river reed flute",
  },
  {
    id: "draconia",
    name: "Draconia",
    gateNumber: 3,
    gateId: "fire",
    frequencyHz: 396,
    realmId: "aurevalde",
    element: "fire",
    godbeast: "Draconis",
    title: "Sovereign of the Solar Steppes",
    linguisticFamilyId: "aurevaldan",
    tactileAnchor: "Obsidian flint dagger and bronze war torc",
  },
  {
    id: "maylinn",
    name: "Maylinn",
    gateNumber: 4,
    gateId: "heart",
    frequencyHz: 417,
    realmId: "matter_reach",
    element: "earth",
    godbeast: "Laeylinn",
    title: "Healer of the Living Pulse",
    linguisticFamilyId: "deep_runic",
    tactileAnchor: "Lodestone talisman wrapped in willow bark",
  },
  {
    id: "alera",
    name: "Alera",
    gateNumber: 5,
    gateId: "voice",
    frequencyHz: 528,
    realmId: "veldoria",
    element: "wind",
    godbeast: "Otome",
    title: "Chanter of the Wind Chords",
    linguisticFamilyId: "veldarín",
    tactileAnchor: "Hollow cedar reed bell tuned to 528 Hz",
  },
  {
    id: "lyria",
    name: "Lyria",
    gateNumber: 6,
    gateId: "sight",
    frequencyHz: 741,
    realmId: "astraea_spires",
    element: "spirit",
    godbeast: "Yumiko",
    title: "Observer of the Prisms",
    linguisticFamilyId: "eldrian",
    tactileAnchor: "Ground quartz monocle with argent wire frame",
  },
  {
    id: "aiyami",
    name: "Aiyami",
    gateNumber: 7,
    gateId: "crown",
    frequencyHz: 852,
    realmId: "eldria_prime",
    element: "spirit",
    godbeast: "Sol",
    title: "Archivist of the High Intellect",
    linguisticFamilyId: "eldrian",
    tactileAnchor: "Cold iron headpiece and vellum chronometer",
  },
  {
    id: "elara",
    name: "Elara",
    gateNumber: 8,
    gateId: "starweave",
    frequencyHz: 963,
    realmId: "eldria_prime",
    element: "spirit",
    godbeast: "Vaelith",
    title: "Weaver of the Corridors",
    linguisticFamilyId: "eldrian",
    tactileAnchor: "Platinum shuttle with comet-tail silver thread",
  },
  {
    id: "ino",
    name: "Ino",
    gateNumber: 9,
    gateId: "unity",
    frequencyHz: 963,
    realmId: "veldoria",
    element: "void",
    godbeast: "Kyuro",
    title: "Harmonizer of the Duality",
    linguisticFamilyId: "sunder_tongue",
    tactileAnchor: "Twin black-and-white tourmaline spheres",
  },
  {
    id: "shinkami",
    name: "Shinkami",
    gateNumber: 10,
    gateId: "source",
    frequencyHz: 1111,
    realmId: "eldria_prime",
    element: "spirit",
    godbeast: "Source",
    title: "The Undivided Presence",
    linguisticFamilyId: "eldrian",
    tactileAnchor: "Solid Lapis Lazuli staff holding the First Dawn spark",
  },
];

// ============================================================================
// ENGINE METHODS: QUERIES & SYNTHESIS
// ============================================================================

export function getCanonicalRealms(): Record<string, RealmDefinition> {
  return CANONICAL_REALMS;
}

export function getLinguisticFamilies(): Record<string, LinguisticFamily> {
  return LINGUISTIC_FAMILIES;
}

export function getCanonicalEpochs(): TemporalEpoch[] {
  return CANONICAL_EPOCHS;
}

export function getCanonicalGuardians(): CanonicalGuardianEntity[] {
  return CANONICAL_GUARDIANS;
}

/**
 * Calculates corridor stability between two Realms based on Solfeggio acoustic resonance.
 */
export function calculateCorridorResonance(
  realmAId: string,
  realmBId: string,
): {
  harmonicDelta: number;
  stability: number;
  status: "open" | "drifting" | "closed";
  corridorDays: number;
  surfaceDays: number;
  isAquifer: boolean;
} {
  const realmA = CANONICAL_REALMS[realmAId] || CANONICAL_REALMS.veldoria;
  const realmB = CANONICAL_REALMS[realmBId] || CANONICAL_REALMS.aurevalde;

  const delta = Math.abs(realmA.frequencyHz - realmB.frequencyHz);

  // Musical harmony ratio: Small frequency deltas or integer harmonic relationships yield stability
  let stability = Math.max(0.1, 1 - delta / 1200);

  // Existing explicit corridor override
  const existingConn = realmA.corridors.find(
    (c) => c.targetRealmId === realmBId,
  );
  let corridorDays = 14;
  let surfaceDays = 120;
  let isAquifer = false;

  if (existingConn) {
    stability = existingConn.stabilityIndex;
    corridorDays = existingConn.travelDaysByCorridor;
    surfaceDays = existingConn.travelDaysBySurface;
    isAquifer = existingConn.isAquifer;
  } else {
    corridorDays = Math.max(3, Math.round(delta / 25));
    surfaceDays = corridorDays * 12;
  }

  const status =
    stability > 0.6 ? "open" : stability > 0.3 ? "drifting" : "closed";

  return {
    harmonicDelta: delta,
    stability,
    status,
    corridorDays,
    surfaceDays,
    isAquifer,
  };
}

/**
 * Synthesizes an authentic name for a character, location, or relic grounded in a Realm's phonology.
 */
export function generateRealmName(
  realmId: string,
  kind:
    | "character_masculine"
    | "character_feminine"
    | "character_neutral"
    | "toponym"
    | "relic",
): string {
  const realm = CANONICAL_REALMS[realmId] || CANONICAL_REALMS.veldoria;
  const lang =
    LINGUISTIC_FAMILIES[realm.linguisticFamilyId] ||
    LINGUISTIC_FAMILIES.veldarín;

  const roots = Object.keys(lang.etymologicalRoots);
  const root = roots[Math.floor(Math.random() * roots.length)] || "vel";
  const capitalizedRoot = root.charAt(0).toUpperCase() + root.slice(1);

  if (kind === "toponym") {
    const prefixes = lang.namingPatterns.toponymPrefixes;
    const prefix =
      prefixes[Math.floor(Math.random() * prefixes.length)] || "Vel-";
    const suffix = lang.namingPatterns.masculineSuffixes[0] || "ia";
    return `${prefix}${root}${suffix}`;
  }

  if (kind === "relic") {
    const anchor = lang.phonology.sensoryTone.split(",")[0] || "Struck Stone";
    return `${capitalizedRoot}'s ${anchor.trim()} Blade`;
  }

  const suffixes =
    kind === "character_masculine"
      ? lang.namingPatterns.masculineSuffixes
      : kind === "character_feminine"
        ? lang.namingPatterns.feminineSuffixes
        : lang.namingPatterns.neutralSuffixes;

  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)] || "or";
  return `${capitalizedRoot}${suffix}`;
}

/**
 * Returns complete provenance tracking for an entity.
 */
export function traceEntityProvenance(
  entityId: string,
  entityName: string,
  realmId: string,
  epochId: string,
): MultiverseProvenanceRecord {
  const realm = CANONICAL_REALMS[realmId] || CANONICAL_REALMS.veldoria;
  const lang =
    LINGUISTIC_FAMILIES[realm.linguisticFamilyId] ||
    LINGUISTIC_FAMILIES.veldarín;
  const epoch =
    CANONICAL_EPOCHS.find((e) => e.id === epochId) || CANONICAL_EPOCHS[2];

  const rootKey = Object.keys(lang.etymologicalRoots)[0] || "vel";
  const rootMeaning =
    Object.values(lang.etymologicalRoots)[0] || "unfolding presence";

  return {
    entityId,
    entityName,
    originRealmId: realm.id,
    originEpochId: epoch.id,
    primaryGate: realm.dominantGate,
    resonanceHz: realm.frequencyHz,
    linguisticRoot: {
      language: lang.name,
      etymologicalSource: rootKey,
      literalMeaning: rootMeaning,
    },
    temporalCausalityPath: [
      {
        epochId: epoch.id,
        locationRealmId: realm.id,
        eventSummary: `Forged and awakened in ${realm.name} during ${epoch.name}.`,
        physicalModification: `Bearing the ${realm.frequencyHz} Hz acoustic resonance signature in its structural matrix.`,
      },
    ],
    humanCostSummary: `Tuned to ${realm.frequencyHz} Hz; requires physical grounding to avoid acoustic harmonic dissonance.`,
  };
}
