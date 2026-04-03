// Worldbuilding Generator Tools

const elements = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"] as const;
const houses = ["Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis"] as const;

const guardians = [
  { name: "Lyssandria", gate: 1, domain: "Foundation", element: "Earth" },
  { name: "Leyla", gate: 2, domain: "Flow", element: "Water" },
  { name: "Draconia", gate: 3, domain: "Fire", element: "Fire" },
  { name: "Maylinn", gate: 4, domain: "Heart", element: "Spirit" },
  { name: "Alera", gate: 5, domain: "Voice", element: "Wind" },
  { name: "Lyria", gate: 6, domain: "Sight", element: "Void" },
  { name: "Aiyami", gate: 7, domain: "Crown", element: "Spirit" },
  { name: "Elara", gate: 8, domain: "Starweave", element: "Void" },
  { name: "Ino", gate: 9, domain: "Unity", element: "Spirit" },
  { name: "Shinkami", gate: 10, domain: "Source", element: "All" },
];

const godbeasts = [
  { name: "Kaelith", gate: 1, form: "Great Serpent of Stone" },
  { name: "Veloura", gate: 2, form: "Shapeshifting Water Dragon" },
  { name: "Draconis", gate: 3, form: "Eternal Flame Dragon" },
  { name: "Laeylinn", gate: 4, form: "Healing Phoenix" },
  { name: "Otome", gate: 5, form: "Thunderbird of Truth" },
  { name: "Yumiko", gate: 6, form: "Dream Fox with Nine Tails" },
  { name: "Sol", gate: 7, form: "Radiant Lion of Dawn" },
  { name: "Vaelith", gate: 8, form: "Dimensional Serpent" },
  { name: "Kyuro", gate: 9, form: "Twin-Headed Unity Beast" },
];

const nameRoots: Record<string, string[]> = {
  fire: ["Pyr", "Ign", "Flam", "Ard", "Cal"],
  water: ["Aqu", "Mar", "Und", "Flu", "Nix"],
  earth: ["Terr", "Geo", "Lith", "Cry", "Fer"],
  wind: ["Aer", "Vent", "Zeph", "Cael", "Vol"],
  void: ["Nyx", "Umb", "Vel", "Obs", "Ten"],
  spirit: ["Lum", "Anim", "Sol", "Aur", "Vit"],
  noble: ["Val", "Rex", "Cel", "Ael", "Lyn"],
};

const nameSuffixes: Record<string, string[]> = {
  masculine: ["or", "us", "an", "is", "on", "ar"],
  feminine: ["a", "ia", "lyn", "ara", "elle", "ira"],
  neutral: ["is", "ix", "yn", "ax", "oth", "iel"],
};

function pick<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMultiple<T>(arr: readonly T[] | T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}

function getRankFromGates(gates: number): string {
  if (gates <= 2) return "Apprentice";
  if (gates <= 4) return "Mage";
  if (gates <= 6) return "Master";
  if (gates <= 8) return "Archmage";
  return "Luminor";
}

type ToolResult = { content: Array<{ type: string; text: string }> };

export async function generateCharacter(options: {
  archetype?: string;
  primaryElement?: string;
  gatesOpen?: number;
  house?: string;
  nameGender?: "masculine" | "feminine" | "neutral";
}): Promise<ToolResult> {
  const gatesOpen = options.gatesOpen ?? Math.floor(Math.random() * 8) + 1;
  const primaryElement = options.primaryElement ?? pick(elements.filter(e => e !== "Spirit"));
  const house = options.house ?? pick(houses);
  const nameGender = options.nameGender ?? pick(["masculine", "feminine", "neutral"] as const);

  const elementKey = primaryElement.toLowerCase();
  const root = pick(nameRoots[elementKey] || nameRoots.noble);
  const suffix = pick(nameSuffixes[nameGender]);
  const name = root + suffix;

  const patronGuardian = guardians[gatesOpen - 1];
  const abilities = guardians.slice(0, gatesOpen).map(g => `${g.domain} Attunement (Gate ${g.gate})`);

  const elementTraits: Record<string, string[]> = {
    Fire: ["passionate", "driven", "quick to act", "transformative"],
    Water: ["adaptive", "intuitive", "emotionally deep", "healing"],
    Earth: ["steadfast", "patient", "nurturing", "grounded"],
    Wind: ["free-spirited", "changeable", "swift-thinking", "communicative"],
    Void: ["mysterious", "contemplative", "potential-seeing", "boundary-crossing"],
    Spirit: ["transcendent", "wise", "connecting", "luminous"],
  };

  // Canonical constraints the LLM must respect
  const godbeast = gatesOpen <= 9 ? godbeasts[gatesOpen - 1] : null;
  const secondaryElement = pick(elements.filter(e => e !== primaryElement));
  const traits = pickMultiple(elementTraits[primaryElement] || elementTraits.Fire, 3);
  const flaw = pick([
    "fears losing control of their power",
    "cannot forgive a betrayal from their past",
    "pushes others away to protect them",
    "carries guilt for a choice they can never undo",
    "doesn't believe they deserve their rank",
    "obsessed with a Gate they cannot open",
    "trusts too easily — has been burned",
    "refuses to use their full power after an accident",
  ]);
  const desire = pick([
    "to open the next Gate and prove themselves worthy",
    "to find the person who disappeared from their life",
    "to reform the institution that failed them",
    "to create something that outlasts them",
    "to understand why their element chose them",
    "to protect someone who doesn't want protecting",
    "to be seen for who they are, not their rank",
  ]);

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        _type: "character_blueprint",
        _note: "This is a canonical scaffolding. Use these constraints as foundation — then add depth, contradictions, secrets, and a voice that makes this person unforgettable.",
        name,
        primaryElement,
        secondaryElement,
        house,
        gatesOpen,
        rank: getRankFromGates(gatesOpen),
        patronGuardian: {
          name: patronGuardian.name,
          gate: patronGuardian.gate,
          domain: patronGuardian.domain,
          element: patronGuardian.element,
          relationship: pick(["devoted student", "reluctant ward", "rebellious apprentice", "chosen champion", "abandoned protege"]),
        },
        godbeast: godbeast ? { name: godbeast.name, form: godbeast.form, bond: pick(["bonded at birth", "earned through trial", "accidental encounter", "inherited from mentor", "not yet bonded — yearning"]) } : null,
        abilities,
        personality: {
          traits,
          flaw,
          desire,
          fear: pick(["losing their element", "becoming like Malachar", "failing the people who believe in them", "never being enough", "the Void consuming what they love"]),
          secret: pick(["has touched the Void and survived", "can hear a Gate that shouldn't exist", "is related to a villain", "has already opened a Gate no one knows about", "was rejected by another house first"]),
        },
        backstory: {
          origin: `Born under ${primaryElement} influence in the ${house} tradition`,
          definingMoment: `The moment that changed everything — when ${name} first ${pick(["felt their element awaken during a crisis", "was chosen by " + patronGuardian.name + " against all expectations", "witnessed something at the Gates that nobody else saw", "lost someone and their grief became power", "broke a rule that turned out to be a prison"])}`,
          currentState: `${getRankFromGates(gatesOpen)} at the ${house} Academy, ${gatesOpen} Gates open`,
          tension: `${name} wants ${desire.replace("to ", "")} but ${flaw}`,
        },
        magicStyle: `Channels ${primaryElement} through ${patronGuardian.domain} attunement, with ${secondaryElement} undertones`,
        narrativeHooks: [
          gatesOpen < 10 ? `Next Gate: ${guardians[gatesOpen].domain} — but the cost may be ${pick(["a memory they treasure", "their relationship with " + patronGuardian.name, "their connection to " + primaryElement, "something they can't get back"])}` : "Luminor — but at what price?",
          `Conflict seed: ${name}'s ${flaw} will clash with ${pick(["the Academy's expectations", "a new ally who sees through them", "a crisis that demands exactly what they're afraid of"])}`,
        ],
      }, null, 2),
    }],
  };
}

export async function generateMagicAbility(options: {
  element: string;
  gateLevel: number;
  purpose?: string;
}): Promise<ToolResult> {
  const { element, gateLevel, purpose } = options;
  const gate = guardians[Math.min(gateLevel - 1, 9)];
  const godbeast = godbeasts[Math.min(gateLevel - 1, 8)];

  const prefixes: Record<string, string[]> = {
    Fire: ["Blazing", "Ember", "Phoenix", "Inferno", "Solar"],
    Water: ["Tidal", "Frost", "Mist", "Torrent", "Crystal"],
    Earth: ["Stone", "Quake", "Root", "Mountain", "Crystal"],
    Wind: ["Gale", "Whisper", "Storm", "Zephyr", "Tempest"],
    Void: ["Shadow", "Null", "Rift", "Abyssal", "Void"],
    Spirit: ["Radiant", "Soul", "Aether", "Divine", "Luminous"],
  };

  const suffixes: Record<string, string[]> = {
    attack: ["Strike", "Blast", "Fury", "Wave"],
    defense: ["Ward", "Shield", "Barrier", "Aegis"],
    utility: ["Step", "Sight", "Touch", "Flow"],
    healing: ["Mend", "Restoration", "Renewal", "Grace"],
    transformation: ["Form", "Shift", "Transmutation", "Awakening"],
  };

  const prefix = pick(prefixes[element] || prefixes.Fire);
  const purposeKey = purpose?.toLowerCase() || pick(Object.keys(suffixes));
  const suffix = pick(suffixes[purposeKey as keyof typeof suffixes] || suffixes.utility);

  const abilityName = `${prefix} ${suffix}`;
  const manaCost = gateLevel * 10 + Math.floor(Math.random() * 20);

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        _type: "magic_blueprint",
        _note: "Canonical magic scaffolding. Add visual spectacle, emotional resonance, and narrative cost. Great magic has consequences.",
        name: abilityName,
        element,
        gateRequired: gateLevel,
        gateName: gate.domain,
        guardian: gate.name,
        godbeast: godbeast?.name,
        description: `${element}-aligned ability channeled through the ${gate.domain} Gate`,
        mechanics: {
          cost: { mana: manaCost, anima: gateLevel > 5 ? Math.floor(gateLevel / 2) : undefined },
          casting: {
            gesture: `Invoke the sigil of ${gate.name}`,
            incantation: `"By ${gate.name}'s ${gate.domain}, let ${element} flow!"`,
            castTime: gateLevel <= 3 ? "instant" : gateLevel <= 6 ? "3 seconds" : "requires preparation",
          },
          mastery: getRankFromGates(gateLevel),
        },
        flavor: {
          visual: pick([
            `${element} erupts from the caster's hands in spiraling patterns`,
            `The air shimmers with ${element.toLowerCase()} energy as reality bends`,
            `${gate.name}'s sigil blazes in the air, visible only to those who've opened this Gate`,
            `The caster's eyes glow with ${element.toLowerCase()} light as the spell takes form`,
          ]),
          sensation: pick([
            "feels like holding lightning in your veins",
            "the world goes quiet, then everything happens at once",
            "tastes like copper and starlight",
            "your bones hum at a frequency that makes your teeth ache",
            "time stretches — you can see each particle of energy move",
          ]),
          sideEffect: pick([
            "leaves the caster trembling for a full minute",
            "nearby plants grow or wilt depending on the caster's intent",
            "the caster temporarily cannot hear their own element",
            "scars glow faintly where the energy channeled through the body",
            "dreams that night will replay the casting in surreal detail",
          ]),
        },
        narrativeHooks: [
          pick(["What happens when this ability is used in desperation?", "Who taught the caster this — and what did learning it cost?", "There's a version of this spell that was banned. Why?"]),
          purpose ? `Designed for ${purpose} — but every tool can be misused` : "The line between creation and destruction is intention",
        ],
      }, null, 2),
    }],
  };
}

export async function generateLocation(options: {
  type?: string;
  dominantElement?: string;
  alignment?: "light" | "dark" | "balanced";
}): Promise<ToolResult> {
  const locationType = options.type ?? pick(["academy", "sanctuary", "ruins", "village", "fortress", "grove", "temple", "marketplace", "library", "nexus"]);
  const dominantElement = options.dominantElement ?? pick(elements.filter(e => e !== "Spirit"));
  const alignment = options.alignment ?? pick(["light", "dark", "balanced"] as const);

  const prefixes: Record<string, string[]> = {
    Fire: ["Ember", "Flame", "Solar", "Burning", "Radiant"],
    Water: ["Crystal", "Tidal", "Mist", "Frozen", "Deep"],
    Earth: ["Stone", "Root", "Mountain", "Ancient", "Verdant"],
    Wind: ["Sky", "Storm", "Floating", "Whispering", "Soaring"],
    Void: ["Shadow", "Twilight", "Hidden", "Liminal", "Void"],
    Spirit: ["Sacred", "Luminous", "Eternal", "Divine", "Transcendent"],
  };

  const locationSuffixes: Record<string, string> = {
    academy: "Academy", sanctuary: "Sanctuary", ruins: "Ruins", village: "Haven",
    fortress: "Citadel", grove: "Grove", temple: "Temple", marketplace: "Bazaar",
    library: "Archives", nexus: "Nexus",
  };

  const prefix = pick(prefixes[dominantElement] || prefixes.Fire);
  const suffix = locationSuffixes[locationType] || "Place";
  const relatedGuardian = guardians.find(g => g.element === dominantElement) || pick(guardians);

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        name: `The ${prefix} ${suffix}`,
        type: locationType,
        dominantElement,
        alignment,
        guardian: relatedGuardian.name,
        gate: `${relatedGuardian.domain} Gate (${relatedGuardian.gate})`,
        description: `A ${alignment} ${locationType} where ${dominantElement} energy flows strong.`,
        features: alignment === "light" ? ["Eternal soft light", `Shrine to ${relatedGuardian.name}`, "Healing springs"] : alignment === "dark" ? ["Dancing shadows", "Wards against Malachar", "Testing grounds"] : ["Light and shadow in harmony", "Balance and transformation", "Sacred to both Lumina and Nero"],
      }, null, 2),
    }],
  };
}

export async function generateCreature(options: {
  element?: string;
  size?: "tiny" | "small" | "medium" | "large" | "massive";
  temperament?: "hostile" | "neutral" | "friendly" | "sacred";
}): Promise<ToolResult> {
  const element = options.element ?? pick(elements.filter(e => e !== "Spirit"));
  const size = options.size ?? pick(["tiny", "small", "medium", "large", "massive"] as const);
  const temperament = options.temperament ?? pick(["hostile", "neutral", "friendly", "sacred"] as const);

  const prefixes: Record<string, string[]> = {
    Fire: ["Ember", "Flame", "Ash", "Scorch"], Water: ["Tide", "Frost", "Mist", "Coral"],
    Earth: ["Stone", "Root", "Crystal", "Iron"], Wind: ["Gale", "Feather", "Cloud", "Storm"],
    Void: ["Shadow", "Night", "Void", "Shade"], Spirit: ["Light", "Soul", "Aether", "Dawn"],
  };

  const types: Record<string, string[]> = {
    tiny: ["sprite", "wisp", "mote"], small: ["fox", "cat", "owl"],
    medium: ["wolf", "stag", "hawk"], large: ["drake", "wyvern", "lion"],
    massive: ["dragon", "leviathan", "titan"],
  };

  const prefix = pick(prefixes[element] || prefixes.Fire);
  const type = pick(types[size]);
  const name = `${prefix}${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        name,
        species: `${prefix} ${type}`,
        element,
        size,
        temperament,
        description: `A ${size} ${element}-attuned creature.`,
        abilities: [`Control ${element.toLowerCase()} energy`, `Enhanced ${size === "massive" ? "devastating" : size === "large" ? "powerful" : "precise"} attacks`],
        habitat: `Found near ${element} sources`,
      }, null, 2),
    }],
  };
}

export async function generateArtifact(options: {
  type?: string;
  element?: string;
  power?: "minor" | "moderate" | "major" | "legendary";
}): Promise<ToolResult> {
  const artifactTypes = ["ring", "amulet", "staff", "tome", "blade", "crown", "orb", "cloak"];
  const type = options.type ?? pick(artifactTypes);
  const element = options.element ?? pick(elements.filter(e => e !== "Spirit"));
  const power = options.power ?? pick(["minor", "moderate", "major", "legendary"] as const);

  const prefixes: Record<string, string[]> = {
    Fire: ["Blazing", "Infernal", "Phoenix"], Water: ["Tidal", "Frozen", "Crystal"],
    Earth: ["Ancient", "Stone", "Mountain"], Wind: ["Stormborn", "Skyforged", "Zephyr"],
    Void: ["Shadowbound", "Twilight", "Void"], Spirit: ["Radiant", "Divine", "Sacred"],
  };

  const prefix = pick(prefixes[element] || prefixes.Fire);
  const relatedGuardian = guardians.find(g => g.element === element) || pick(guardians);
  const name = power === "legendary" ? `${relatedGuardian.name}'s ${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)}` : `${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        name,
        type,
        element,
        powerLevel: power,
        guardian: relatedGuardian.name,
        abilities: [`Channels ${element} energy`, power === "legendary" ? `Can open the ${relatedGuardian.domain} Gate temporarily` : `Enhances ${relatedGuardian.domain} attunement`],
        requirement: power === "legendary" ? `Only those who opened the ${relatedGuardian.domain} Gate` : `${getRankFromGates(power === "major" ? 5 : power === "moderate" ? 3 : 1)} rank`,
      }, null, 2),
    }],
  };
}

export async function generateName(options: {
  element?: string;
  gender?: "masculine" | "feminine" | "neutral";
  type?: "character" | "place" | "artifact" | "creature";
  count?: number;
}): Promise<ToolResult> {
  const element = options.element ?? pick(Object.keys(nameRoots));
  const gender = options.gender ?? pick(["masculine", "feminine", "neutral"] as const);
  const type = options.type ?? "character";
  const count = Math.min(options.count ?? 5, 20);

  const roots = nameRoots[element.toLowerCase()] || nameRoots.noble;
  const suffixes = nameSuffixes[gender];
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    const root = pick(roots);
    const suffix = pick(suffixes);
    if (type === "place") names.push(root + pick(["heim", "garde", "haven", "reach", "vale"]));
    else if (type === "artifact") names.push(root + suffix + "'s " + pick(["Edge", "Heart", "Eye", "Voice"]));
    else names.push(root + suffix);
  }

  return { content: [{ type: "text", text: JSON.stringify({ element, type, names }, null, 2) }] };
}

export async function generateStoryPrompt(options: {
  theme?: string;
  gate?: number;
  includeConflict?: boolean;
}): Promise<ToolResult> {
  const themes = ["discovery", "redemption", "courage", "loss", "growth", "sacrifice", "unity", "transformation"];
  const theme = options.theme ?? pick(themes);
  const gate = options.gate ?? Math.floor(Math.random() * 10) + 1;
  const includeConflict = options.includeConflict ?? true;

  const guardian = guardians[gate - 1];
  const godbeast = godbeasts[Math.min(gate - 1, 8)];
  const protagonistElement = pick(elements.filter(e => e !== "Spirit"));

  const conflicts = [
    `Malachar's shadow cultists seek to corrupt the ${guardian.domain} Gate`,
    `A ${protagonistElement} mage has lost their connection to their element`,
    `${godbeast?.name || "A sacred creature"} has gone missing`,
  ];

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        theme,
        gate: guardian.gate,
        gateName: guardian.domain,
        guardian: guardian.name,
        godbeast: godbeast?.name,
        protagonist: { element: protagonistElement, challenge: `Must confront ${theme}` },
        conflict: includeConflict ? pick(conflicts) : undefined,
        storyPrompt: `A creator of ${protagonistElement} must learn ${theme} on the path to the ${guardian.domain} Gate.`,
      }, null, 2),
    }],
  };
}
