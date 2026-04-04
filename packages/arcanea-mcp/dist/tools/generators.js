// Worldbuilding Generator Tools
const elements = ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"];
const houses = ["Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis"];
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
const nameRoots = {
    fire: ["Pyr", "Ign", "Flam", "Ard", "Cal"],
    water: ["Aqu", "Mar", "Und", "Flu", "Nix"],
    earth: ["Terr", "Geo", "Lith", "Cry", "Fer"],
    wind: ["Aer", "Vent", "Zeph", "Cael", "Vol"],
    void: ["Nyx", "Umb", "Vel", "Obs", "Ten"],
    spirit: ["Lum", "Anim", "Sol", "Aur", "Vit"],
    noble: ["Val", "Rex", "Cel", "Ael", "Lyn"],
};
const nameSuffixes = {
    masculine: ["or", "us", "an", "is", "on", "ar"],
    feminine: ["a", "ia", "lyn", "ara", "elle", "ira"],
    neutral: ["is", "ix", "yn", "ax", "oth", "iel"],
};
export function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function pickMultiple(arr, count) {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}
function getRankFromGates(gates) {
    if (gates <= 2)
        return "Apprentice";
    if (gates <= 4)
        return "Mage";
    if (gates <= 6)
        return "Master";
    if (gates <= 8)
        return "Archmage";
    return "Luminor";
}
export async function generateCharacter(options) {
    const gatesOpen = options.gatesOpen ?? Math.floor(Math.random() * 8) + 1;
    const primaryElement = options.primaryElement ?? pick(elements.filter(e => e !== "Spirit"));
    const house = options.house ?? pick(houses);
    const nameGender = options.nameGender ?? pick(["masculine", "feminine", "neutral"]);
    const elementKey = primaryElement.toLowerCase();
    const root = pick(nameRoots[elementKey] || nameRoots.noble);
    const suffix = pick(nameSuffixes[nameGender]);
    const name = root + suffix;
    const patronGuardian = guardians[gatesOpen - 1];
    const abilities = guardians.slice(0, gatesOpen).map(g => `${g.domain} Attunement (Gate ${g.gate})`);
    const elementTraits = {
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
export async function generateMagicAbility(options) {
    const { element, gateLevel, purpose } = options;
    const gate = guardians[Math.min(gateLevel - 1, 9)];
    const godbeast = godbeasts[Math.min(gateLevel - 1, 8)];
    const prefixes = {
        Fire: ["Blazing", "Ember", "Phoenix", "Inferno", "Solar"],
        Water: ["Tidal", "Frost", "Mist", "Torrent", "Crystal"],
        Earth: ["Stone", "Quake", "Root", "Mountain", "Crystal"],
        Wind: ["Gale", "Whisper", "Storm", "Zephyr", "Tempest"],
        Void: ["Shadow", "Null", "Rift", "Abyssal", "Void"],
        Spirit: ["Radiant", "Soul", "Aether", "Divine", "Luminous"],
    };
    const suffixes = {
        attack: ["Strike", "Blast", "Fury", "Wave"],
        defense: ["Ward", "Shield", "Barrier", "Aegis"],
        utility: ["Step", "Sight", "Touch", "Flow"],
        healing: ["Mend", "Restoration", "Renewal", "Grace"],
        transformation: ["Form", "Shift", "Transmutation", "Awakening"],
    };
    const prefix = pick(prefixes[element] || prefixes.Fire);
    const purposeKey = purpose?.toLowerCase() || pick(Object.keys(suffixes));
    const suffix = pick(suffixes[purposeKey] || suffixes.utility);
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
export async function generateLocation(options) {
    const locationType = options.type ?? pick(["academy", "sanctuary", "ruins", "village", "fortress", "grove", "temple", "marketplace", "library", "nexus"]);
    const dominantElement = options.dominantElement ?? pick(elements.filter(e => e !== "Spirit"));
    const alignment = options.alignment ?? pick(["light", "dark", "balanced"]);
    const prefixes = {
        Fire: ["Ember", "Flame", "Solar", "Burning", "Radiant"],
        Water: ["Crystal", "Tidal", "Mist", "Frozen", "Deep"],
        Earth: ["Stone", "Root", "Mountain", "Ancient", "Verdant"],
        Wind: ["Sky", "Storm", "Floating", "Whispering", "Soaring"],
        Void: ["Shadow", "Twilight", "Hidden", "Liminal", "Void"],
        Spirit: ["Sacred", "Luminous", "Eternal", "Divine", "Transcendent"],
    };
    const locationSuffixes = {
        academy: "Academy", sanctuary: "Sanctuary", ruins: "Ruins", village: "Haven",
        fortress: "Citadel", grove: "Grove", temple: "Temple", marketplace: "Bazaar",
        library: "Archives", nexus: "Nexus",
    };
    const prefix = pick(prefixes[dominantElement] || prefixes.Fire);
    const suffix = locationSuffixes[locationType] || "Place";
    const relatedGuardian = guardians.find(g => g.element === dominantElement) || pick(guardians);
    const locationName = `The ${prefix} ${suffix}`;
    const history = pick([
        "Built by the first Eldrians before the Fall",
        `Founded after ${relatedGuardian.name}'s victory at the ${relatedGuardian.domain} Gate`,
        "Rose from the earth during a Gate Resonance Event — no one built it",
        "Once a stronghold of Malachar, reclaimed and purified",
        "Created by an unnamed Luminor who vanished after completing it",
    ]);
    const secret = pick([
        "A sealed chamber beneath the foundation holds something that predates the Gates",
        `The walls hum at ${relatedGuardian.name}'s frequency — but only at midnight`,
        "A passage connects this place to the Shadowfen, sealed by oath",
        "The founding stone is a fragment of Nero's original darkness — not corrupted, but fertile",
        "Those who sleep here dream the same dream, but none speak of it",
    ]);
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    _type: "location_blueprint",
                    _note: "Canonical scaffolding. Add sensory detail, history, and the feeling of being there. Great places have personality.",
                    name: locationName,
                    type: locationType,
                    dominantElement,
                    alignment,
                    guardian: { name: relatedGuardian.name, domain: relatedGuardian.domain, gate: relatedGuardian.gate },
                    atmosphere: {
                        visual: alignment === "light" ? `Warm ${dominantElement.toLowerCase()} light filters through everything` : alignment === "dark" ? `Shadows move with purpose, ${dominantElement.toLowerCase()} energy pulses beneath the surface` : `${dominantElement} energy shifts between light and shadow like breathing`,
                        sound: pick(["Constant low hum of elemental energy", "Wind carries whispered voices", "Water flows in patterns that sound like speech", "Absolute silence broken only by Gate resonance", "Distant rumbling from deep below"]),
                        smell: pick(["Ozone and old stone", "Incense and growing things", "Cold metal and starlight", "Warm earth after rain", "Something electric, like the air before a storm"]),
                    },
                    features: [
                        pick(["A central courtyard where element practice is visible", "A library with texts that rewrite themselves", "Training grounds scarred by centuries of combat", "Gardens where plants respond to emotional state"]),
                        pick([`A shrine to ${relatedGuardian.name} that glows during Gate hours`, "An observation tower overlooking the Gate network", "Dormitories where roommates are paired by opposing elements", "A forge that only lights for those who need it"]),
                        pick(["A restricted wing that students whisper about", "An ancient tree growing through the center of the building", "A map room showing Gate connections in real time", "A mess hall where the food changes based on the dominant element of those present"]),
                    ],
                    history,
                    secret,
                    narrativeHooks: [
                        `What happens when the ${dominantElement} energy here suddenly inverts?`,
                        `Someone important vanished from this place. Their belongings are still here.`,
                        alignment === "dark" ? "Not everyone who enters comes back unchanged" : "This place heals wounds that magic cannot — but it takes something in return",
                    ],
                }, null, 2),
            }],
    };
}
export async function generateCreature(options) {
    const element = options.element ?? pick(elements.filter(e => e !== "Spirit"));
    const size = options.size ?? pick(["tiny", "small", "medium", "large", "massive"]);
    const temperament = options.temperament ?? pick(["hostile", "neutral", "friendly", "sacred"]);
    const prefixes = {
        Fire: ["Ember", "Flame", "Ash", "Scorch"], Water: ["Tide", "Frost", "Mist", "Coral"],
        Earth: ["Stone", "Root", "Crystal", "Iron"], Wind: ["Gale", "Feather", "Cloud", "Storm"],
        Void: ["Shadow", "Night", "Void", "Shade"], Spirit: ["Light", "Soul", "Aether", "Dawn"],
    };
    const types = {
        tiny: ["sprite", "wisp", "mote"], small: ["fox", "cat", "owl"],
        medium: ["wolf", "stag", "hawk"], large: ["drake", "wyvern", "lion"],
        massive: ["dragon", "leviathan", "titan"],
    };
    const prefix = pick(prefixes[element] || prefixes.Fire);
    const type = pick(types[size]);
    const name = `${prefix}${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const relatedGuardian = guardians.find(g => g.element === element) || pick(guardians);
    const relatedGodbeast = godbeasts.find(g => g.gate === relatedGuardian.gate);
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    _type: "creature_blueprint",
                    _note: "Canonical scaffolding. Add behavior patterns, sounds, movement, and the feeling of encountering this creature. Great creatures feel alive.",
                    name,
                    species: `${prefix} ${type}`,
                    element,
                    size,
                    temperament,
                    appearance: {
                        body: pick([`Sleek ${element.toLowerCase()}-infused form`, `Armored hide that shifts like ${element.toLowerCase()}`, `Semi-transparent body revealing inner ${element.toLowerCase()} energy`, `Muscular build with ${element.toLowerCase()} markings`]),
                        eyes: pick(["Ember-bright and intelligent", "Reflective silver, seeing more than the visible spectrum", "Deep black with swirling inner light", "Constantly shifting color based on mood"]),
                        distinctFeature: pick(["Leaves ${element.toLowerCase()} traces in the air when it moves", "Its shadow moves independently", "Surrounding plants/water/air respond to its presence", `Scars from a fight with a ${pick(["shadow creature", "rival elemental", "Gate guardian"])}`]),
                    },
                    behavior: {
                        temperamentDetail: temperament === "hostile" ? pick(["Territorial — attacks anything within its domain", "Hunting pack mentality — never truly alone", "Wounded and desperate — more dangerous than natural hostility"]) : temperament === "friendly" ? pick(["Bonds with those who share its element", "Playful but unpredictable — its games can be dangerous", "Protective of the weak — will adopt lost travelers"]) : temperament === "sacred" ? pick(["Appears only during Gate Resonance Events", "Its presence indicates a major shift in elemental balance", "Ancient beyond counting — may be as old as the Gates themselves"]) : pick(["Observes before acting — patience is its weapon", "Will trade favors for the right offering", "Neither ally nor enemy — responds to intent, not identity"]),
                        sound: pick(["Low rumbling purr that vibrates elemental frequencies", "Clicks and whistles that other creatures respond to", "Completely silent — absence of sound follows it", `Howl that resonates with the ${relatedGuardian.domain} Gate`]),
                        diet: pick(["Pure elemental energy — draws from nearby sources", "Other creatures of opposing elements", "Crystallized mana deposits", "Emotion — feeds on the feelings of nearby beings"]),
                    },
                    abilities: [
                        `Control ${element.toLowerCase()} energy in a ${size === "massive" ? "devastating" : size === "large" ? "wide" : "precise"} radius`,
                        pick(["Phase through solid matter briefly", "Sense intent before action", "Heal wounds by channeling its element", "Create temporary elemental barriers", "Communicate telepathically with bonded mages"]),
                    ],
                    habitat: {
                        location: pick([`Deep ${element.toLowerCase()} zones where few mages venture`, `Near the ${relatedGuardian.domain} Gate's earthly anchor`, "The boundary between two elemental territories", "Ancient ruins predating the Academy system"]),
                        behavior: pick(["Solitary — encounters another of its kind only to mate", "Small packs of 3-5, led by the eldest", "Migratory — follows elemental tides", "Stationary guardian of a specific location"]),
                    },
                    lore: {
                        godBeastConnection: relatedGodbeast ? `Scholars debate whether ${name} species are distant descendants of ${relatedGodbeast.name} (${relatedGodbeast.form})` : "No known divine lineage",
                        culturalSignificance: pick(["Academy students consider sighting one a good omen", "Hunters prize its core for alchemical uses — ethically controversial", "Ancient pact forbids harming them near Gate sites", "Some believe they carry messages from the Guardians"]),
                    },
                    narrativeHooks: [
                        pick(["This creature has been following a specific character. Why?", "A clutch of eggs was found in an impossible location", "This species is going extinct — and the elemental balance is shifting because of it"]),
                        `What happens when a ${element} ${type} encounters its elemental opposite?`,
                    ],
                }, null, 2),
            }],
    };
}
export async function generateArtifact(options) {
    const artifactTypes = ["ring", "amulet", "staff", "tome", "blade", "crown", "orb", "cloak"];
    const type = options.type ?? pick(artifactTypes);
    const element = options.element ?? pick(elements.filter(e => e !== "Spirit"));
    const power = options.power ?? pick(["minor", "moderate", "major", "legendary"]);
    const prefixes = {
        Fire: ["Blazing", "Infernal", "Phoenix"], Water: ["Tidal", "Frozen", "Crystal"],
        Earth: ["Ancient", "Stone", "Mountain"], Wind: ["Stormborn", "Skyforged", "Zephyr"],
        Void: ["Shadowbound", "Twilight", "Void"], Spirit: ["Radiant", "Divine", "Sacred"],
    };
    const prefix = pick(prefixes[element] || prefixes.Fire);
    const relatedGuardian = guardians.find(g => g.element === element) || pick(guardians);
    const name = power === "legendary" ? `${relatedGuardian.name}'s ${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)}` : `${prefix} ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const age = pick(["Pre-Fall (before Malachar)", "Academy Era (current)", "Ancient — predates the Gates", "Recently forged by a living Luminor"]);
    const creator = power === "legendary"
        ? pick([`Forged by ${relatedGuardian.name} personally`, "Created by the First Luminor before the Fall", "Formed spontaneously during a Gate Resonance Event", "Made by Malachar before his corruption — still pure"])
        : pick(["Crafted by an unknown Academy smith", "Grown from elemental crystal over centuries", "Assembled from fragments of a greater artifact", "A student project that exceeded all expectations"]);
    return {
        content: [{
                type: "text",
                text: JSON.stringify({
                    _type: "artifact_blueprint",
                    _note: "Canonical scaffolding. Add weight, texture, the feeling of holding it, and the moral cost of using it. Great artifacts change their wielder.",
                    name,
                    type,
                    element,
                    powerLevel: power,
                    guardian: { name: relatedGuardian.name, domain: relatedGuardian.domain },
                    origin: { creator, age, location: pick(["Lost for centuries, recently unearthed", "Kept in the Academy vault under guard", "Passed down through a bloodline", "Hidden in plain sight — disguised as something mundane"]) },
                    appearance: {
                        form: pick([`${type} that seems to breathe with ${element.toLowerCase()} energy`, `Deceptively simple ${type} — power reveals itself only to the worthy`, `Ornate ${type} covered in Gate sigils that glow when held`, `${type} that changes appearance based on the wielder's emotional state`]),
                        material: pick(["Condensed elemental force given physical form", `${element}-infused metal that's warm to the touch`, "Living crystal that grows imperceptibly", "Material that doesn't exist in any catalogue"]),
                        telltale: pick(["Hums at a specific frequency when danger approaches", "Casts no shadow", "Weighs nothing to the worthy, immovable to others", "Leaves a faint trail of elemental particles"]),
                    },
                    abilities: {
                        primary: power === "legendary" ? `Can temporarily open the ${relatedGuardian.domain} Gate for the unworthy — at a cost` : `Enhances ${relatedGuardian.domain} attunement by ${power === "major" ? "2" : "1"} Gate level(s)`,
                        secondary: pick(["Protects the wielder from their element's opposite", "Stores memories that can be replayed", "Translates the language of creatures", "Reveals hidden truths when held to the eye"]),
                        cost: pick(["Drains the wielder's stamina with each use", "Feeds on a specific emotion — the wielder feels less of it over time", "Shortens the wielder's connection to one Gate each time its full power is unleashed", "Attracts attention from entities that should not be disturbed"]),
                    },
                    requirement: power === "legendary" ? `Only those who opened the ${relatedGuardian.domain} Gate` : `${getRankFromGates(power === "major" ? 5 : power === "moderate" ? 3 : 1)} rank minimum`,
                    lore: {
                        previousWielders: pick(["Three known wielders — all died differently, all at the peak of their power", "One wielder, who refused to give it up and became something other than human", "Nobody has used it in living memory — the last wielder sealed it and disappeared", "A long line of wielders, each adding an inscription to the surface"]),
                        legend: pick(["Said to be one piece of a set — the others are lost", "Prophecy says it will choose its final wielder when the Gates begin to close", "The Academy Council has debated destroying it for decades", "It's sentient — or at least, it dreams"]),
                    },
                    narrativeHooks: [
                        pick(["The artifact has started behaving differently since last Tuesday. Why?", "Someone is forging counterfeits. The fakes work — but differently.", "The artifact's creator left instructions that contradict everything known about it"]),
                        `What does the wielder become if they rely on ${name} too much?`,
                    ],
                }, null, 2),
            }],
    };
}
export async function generateName(options) {
    const element = options.element ?? pick(Object.keys(nameRoots));
    const gender = options.gender ?? pick(["masculine", "feminine", "neutral"]);
    const type = options.type ?? "character";
    const count = Math.min(options.count ?? 5, 20);
    const roots = nameRoots[element.toLowerCase()] || nameRoots.noble;
    const suffixes = nameSuffixes[gender];
    const names = [];
    for (let i = 0; i < count; i++) {
        const root = pick(roots);
        const suffix = pick(suffixes);
        if (type === "place")
            names.push(root + pick(["heim", "garde", "haven", "reach", "vale"]));
        else if (type === "artifact")
            names.push(root + suffix + "'s " + pick(["Edge", "Heart", "Eye", "Voice"]));
        else
            names.push(root + suffix);
    }
    return { content: [{ type: "text", text: JSON.stringify({ element, type, names }, null, 2) }] };
}
export async function generateStoryPrompt(options) {
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
//# sourceMappingURL=generators.js.map