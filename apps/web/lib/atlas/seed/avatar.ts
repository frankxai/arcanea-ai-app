// Seed constants for Avatar: The Last Airbender vertical slice
// Used by service-role scripts; never imported in browser code
// All creatures: rightsTier = factual_reference, promptable = false
// All variants: canon_status = staging

export const avatarUniverseSeed = {
  id: "avatar-the-last-airbender",
  name: "Avatar: The Last Airbender",
  studio: "Nickelodeon / Paramount",
  medium: "animation",
  rights_tier: "factual_reference",
  active_since: "2005",
  description:
    "Avatar: The Last Airbender is a Nickelodeon animated series set in a world where people can telekinetically manipulate one of the four classical elements. The story follows Aang, the Avatar, and his journey to master all four elements and bring peace.",
  arcanea_elements: ["Fire", "Water", "Earth", "Wind"],
  tags: ["elemental", "spiritual", "asia-inspired", "coming-of-age", "balance"],
} as const;

export const avatarCreaturesSeed = [
  {
    id: "sky-bison",
    universe_id: "avatar-the-last-airbender",
    name: "Sky Bison",
    aliases: ["Appa", "Flying Bison"],
    tier: "T2",
    scale: "large",
    elements: ["Wind"],
    habitat: "Open sky, Air Nomad temples",
    description:
      "Six-legged flying mammals with white fur and a broad flat tail. The original airbenders taught the Air Nomads their bending art. Loyal companions bonded to Air Nomad children for life.",
    abilities: ["Airbending", "Flight", "Air-shock tail swipe", "Sky navigation"],
    significance:
      "Progenitors of airbending; integral to Air Nomad culture and the Avatar's journey.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S1E1", "Avatar S1E2"],
  },
  {
    id: "lion-turtle",
    universe_id: "avatar-the-last-airbender",
    name: "Lion Turtle",
    aliases: ["Ancient One"],
    tier: "T4",
    scale: "world",
    elements: ["Earth", "Fire", "Water", "Wind"],
    habitat: "Open ocean; origin of the world's continents",
    description:
      "Continent-sized ancient beings whose backs formed the first human settlements before humans learned to bend. They are the original source of bending itself, gifting humans with the energy within.",
    abilities: ["Energy bending", "Elemental dominion", "Primordial memory", "Impenetrable shell"],
    significance:
      "The original source of bending in the Avatar world; teaches Aang energybending to defeat Ozai without taking his life.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S3E21"],
  },
  {
    id: "ancient-dragon",
    universe_id: "avatar-the-last-airbender",
    name: "Ancient Dragon",
    aliases: ["Ran", "Shaw"],
    tier: "T2",
    scale: "large",
    elements: ["Fire"],
    habitat: "Sun Warriors' ancient city ruins",
    description:
      "Immense serpentine dragons with iridescent scales. The original firebenders; they taught humanity that fire is life and energy, not destruction. Nearly hunted to extinction for their power.",
    abilities: ["True firebending (life-energy flame)", "Chromatic fire spiral", "Flight"],
    significance: "Original teachers of firebending; living proof that fire is not inherently destructive.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S3E13"],
  },
  {
    id: "badgermole",
    universe_id: "avatar-the-last-airbender",
    name: "Badgermole",
    aliases: [],
    tier: "T2",
    scale: "large",
    elements: ["Earth"],
    habitat: "Subterranean tunnels, mountains",
    description:
      "Massive blind mammals with badger-stripe markings who taught the first earth-benders. Gentle giants unless provoked, able to sculpt entire cave systems with a single gesture.",
    abilities: ["Earthbending mastery", "Echolocation", "Seismic sensing", "Tunnel creation"],
    significance: "Original teachers of earthbending; honored by the Earth Kingdom.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S2E9"],
  },
  {
    id: "flying-lemur",
    universe_id: "avatar-the-last-airbender",
    name: "Flying Lemur",
    aliases: ["Momo", "Winged Lemur"],
    tier: "T1",
    scale: "small",
    elements: ["Wind"],
    habitat: "Air Nomad temples, forest canopy",
    description:
      "Small bat-winged primates with large ears and exceptional aerial agility. Naturally curious companions who survived the Fire Nation's genocide of Air Nomad culture.",
    abilities: ["Flight", "Gliding", "Acrobatic evasion"],
    significance: "Symbolic survivors of the Air Nomad genocide; Momo is Aang's loyal companion.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S1E3"],
  },
  {
    id: "hei-bai",
    universe_id: "avatar-the-last-airbender",
    name: "Hei Bai",
    aliases: ["Black and White", "Giant Panda Spirit"],
    tier: "T3",
    scale: "titan",
    elements: ["Earth", "Spirit"],
    habitat: "Spirit World / Senlin Village forest",
    description:
      "A nature spirit that alternates between a panda form and a terrifying six-armed monster. Manifests in the physical world when its forest is harmed, abducting humans in grief-driven rage.",
    abilities: ["Spirit-world travel", "Form shifting", "Dimensional abduction", "Nature-bond regeneration"],
    significance: "Demonstrates the Avatar's role as bridge between physical and spirit worlds.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S1E7"],
  },
  {
    id: "wan-shi-tong",
    universe_id: "avatar-the-last-airbender",
    name: "Wan Shi Tong",
    aliases: ["He Who Knows Ten Thousand Things"],
    tier: "T3",
    scale: "large",
    elements: ["Spirit", "Wind"],
    habitat: "Spirit World library",
    description:
      "An ancient owl spirit who maintains a vast library of all human knowledge in the Spirit World. Deeply distrustful of humans who seek knowledge for warfare; punishes those who abuse his trust.",
    abilities: ["Omniscient knowledge recall", "Spirit-realm manifestation", "Library dimension anchor", "Shadow-feather attack"],
    significance: "Keeper of all knowledge; pivotal to Aang's discovery of the Day of Black Sun.",
    rights_tier: "factual_reference",
    promptable: false,
    canon_sources: ["Avatar S2E10"],
  },
] as const;

export const avatarArcaneaVariantsSeed = [
  {
    id: "sky-wanderer",
    source_creature_id: "sky-bison",
    name: "Sky Wanderer",
    arcanea_tier: "T2",
    elements: ["Wind", "Void"],
    gate: null,
    domain: "The Uncharted Skies between Gates",
    description:
      "A cloud-glass cetacean that drifts through the upper atmospheric channels of Arcanea, unmapped and unbonded. Its breath carries the Void's potential — where it exhales, new skies crystallise.",
    appearance:
      "Six translucent fins arranged in bilateral pairs, body like sea-glass fading to pure void-black at the extremities. Eyes: deep iridescent amber. Tail: branching crystal prisms scattering every light it touches.",
    abilities: [
      { name: "Crystal Exhale", description: "Breath solidifies into navigable sky-bridges of cloud-glass", element: "Wind" },
      { name: "Void Drift", description: "Phases partially into the Void, becoming intangible for short bursts", element: "Void" },
      { name: "Resonance Song", description: "Infrasonic hum that calms elemental storms within range", element: "Wind" },
    ],
    material_correspondence: "Cloudstone — a translucent mineral harvested only where Sky Wanderers have slept; stores acoustic imprints of wind patterns",
    canon_status: "staging",
  },
  {
    id: "titan-shell",
    source_creature_id: "lion-turtle",
    name: "Titan Shell",
    arcanea_tier: "T4",
    elements: ["Earth", "Void"],
    gate: null,
    domain: "The Abyssal Flats — sunken continents beneath the Drowned Deep",
    description:
      "An ancient landmass that remembers it was alive. The Titan Shell drifted down into the depths after the first age of Arcanea and slowly petrified — but the Void preserved its consciousness. It does not move. It waits, and it remembers everything.",
    appearance:
      "Mountainous shell domed with ancient script that glows Void-gold when a Gate opens nearby. Four earth-column limbs half-buried in silt. Eyes: twin craters filled with supernova light.",
    abilities: [
      { name: "Epochal Memory", description: "Any creature that rests upon its shell gains access to pre-Gate memory; disorienting for the unprepared", element: "Void" },
      { name: "Foundation Pulse", description: "Seismic shockwave that reshapes terrain across a province", element: "Earth" },
      { name: "Lore Anchor", description: "Prevents dimensional shifts within its shell-radius; stabilises leylines", element: "Earth" },
    ],
    material_correspondence: "Foundation Stone — obsidian-dense rock cores extracted only from ancient shell-shed debris; used in Gate-anchor wards",
    canon_status: "staging",
  },
  {
    id: "sight-keeper",
    source_creature_id: "wan-shi-tong",
    name: "Sight Keeper",
    arcanea_tier: "T3",
    elements: ["Void", "Wind"],
    gate: "sight",
    domain: "The Astral Archive — a dimension co-existing with the Sight Gate",
    description:
      "A vast spectral owl whose wingspan spans a library tower, bonded in STAGING alignment to Lyria's Sight Gate. It does not hold knowledge — it holds the *questions* knowledge cannot answer. When Luminors seek the Sight Gate, the Sight Keeper judges whether they are ready to receive what they asked for.",
    appearance:
      "Feathers composed of layered manuscript pages, visible text shifting as the observer's angle changes. Eyes: Void-deep with the Sight Gate glyph as pupils. No beak — a pure quill nib instead.",
    abilities: [
      { name: "Question Weave", description: "Reformulates a seeker's question into its true form; sometimes the answer arrives before they do", element: "Void" },
      { name: "Archive Dive", description: "Pulls a seeker's consciousness into the Astral Archive; they return with one answer and one new question", element: "Void" },
      { name: "Feather of Forgetting", description: "A shed feather, when burned, erases one false belief from the target's mind", element: "Wind" },
    ],
    material_correspondence: "Vellum Shard — a page-thin crystal that records the last question asked in its presence; Luminors of the Sight Gate carry one to focus inquiry",
    canon_status: "staging",
  },
] as const;
