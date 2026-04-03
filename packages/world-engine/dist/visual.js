/**
 * Visual Prompt Generator
 *
 * Converts worldbuilding blueprints into image-generation prompts compatible
 * with ComfyUI, Midjourney, DALL-E, Imagen, and Canva.
 *
 * Returns typed objects — no JSON.stringify here, so callers can decide how
 * to serialize (the MCP server wraps in content, the web app uses directly).
 */
// ── Canon Visual Maps ────────────────────────────────────────────────────────
export const ELEMENT_AESTHETICS = {
    Fire: {
        colors: "warm reds, deep oranges, molten gold, ember glow",
        atmosphere: "heat shimmer, floating sparks, smoky haze",
        materials: "polished obsidian, volcanic glass, hammered bronze",
        lighting: "dramatic rim light from below, fire-lit, warm shadows",
    },
    Water: {
        colors: "deep ocean blue, silver, crystalline teal, moonlit white",
        atmosphere: "mist, light rain, reflective surfaces, flowing fabric",
        materials: "liquid silver, coral, pearl, sea glass",
        lighting: "cool moonlight, underwater caustics, bioluminescent glow",
    },
    Earth: {
        colors: "forest green, stone grey, warm brown, moss gold",
        atmosphere: "ancient forest, stone dust, roots breaking through",
        materials: "rough stone, living wood, crystal geodes, copper",
        lighting: "dappled sunlight through canopy, golden hour warmth",
    },
    Wind: {
        colors: "sky white, silver-blue, cloud grey, pale gold",
        atmosphere: "windswept, floating particles, flowing robes, open sky",
        materials: "silk, feathers, blown glass, titanium",
        lighting: "bright overcast, ethereal glow, ambient diffused light",
    },
    Void: {
        colors: "deep purple, midnight black, dark indigo, starfield",
        atmosphere: "spatial distortion, void particles, reality fractures",
        materials: "dark crystal, shadow metal, null-stone, obsidian mirror",
        lighting: "rim light from void glow, dark with pinpoint stars, eclipse lighting",
    },
    Spirit: {
        colors: "pure white, divine gold, prismatic, aurora spectrum",
        atmosphere: "transcendent glow, sacred geometry, floating light motes",
        materials: "pure light crystallized, opalescent stone, divine metal",
        lighting: "omnidirectional soft glow, halo lighting, heavenly rays",
    },
};
export const RANK_VISUAL = {
    Apprentice: {
        complexity: "simple, understated",
        aura: "faint elemental shimmer around hands",
        attire: "student robes, practical, well-worn",
    },
    Mage: {
        complexity: "growing confidence, developing style",
        aura: "visible elemental energy around shoulders and hands",
        attire: "personalized robes with house insignia, first enchanted accessories",
    },
    Master: {
        complexity: "refined power, controlled elegance",
        aura: "strong elemental presence, energy patterns in the air",
        attire: "master-crafted armor or robes, multiple enchanted items, Gate sigils visible",
    },
    Archmage: {
        complexity: "commanding presence, reality-bending detail",
        aura: "elemental energy restructures the environment around them",
        attire: "legendary gear, godbeast motifs, reality warps near enchantments",
    },
    Luminor: {
        complexity: "transcendent, otherworldly, beyond mortal aesthetics",
        aura: "all elements respond to their presence, light itself bends",
        attire: "gear that seems alive, made of condensed elemental force, crowned with Gate energy",
    },
};
/** Art direction constants for downstream prompting pipelines */
export const ART_DIRECTION = {
    defaultCharacterStyle: "digital painting, concept art, fantasy character portrait",
    defaultLocationStyle: "digital painting, fantasy landscape, concept art, wide shot",
    defaultCreatureStyle: "digital painting, creature design, fantasy illustration, concept art",
    negativeCharacter: "text, watermark, blurry, low quality, anime unless specified, modern clothing, guns, technology",
    negativeLocation: "text, watermark, blurry, modern buildings, cars, technology",
    negativeCreature: "text, watermark, blurry, cute cartoon style, chibi, human",
    suggestedModels: ["SDXL", "Flux", "Midjourney v6"],
};
// ── Generators ───────────────────────────────────────────────────────────────
/**
 * Build an image-generation prompt for a character portrait.
 *
 * @param char  - Character blueprint (from generateCharacter or user-provided)
 * @param style - Override the default style prefix
 */
export function characterToImagePrompt(char, style) {
    const elem = ELEMENT_AESTHETICS[char.primaryElement] ?? ELEMENT_AESTHETICS.Fire;
    const rank = RANK_VISUAL[char.rank] ?? RANK_VISUAL.Mage;
    const secondElem = char.secondaryElement ? ELEMENT_AESTHETICS[char.secondaryElement] : null;
    const stylePrefix = style ?? ART_DIRECTION.defaultCharacterStyle;
    const parts = [
        stylePrefix,
        `portrait of ${char.name}, a ${char.rank} of the ${char.house} Academy`,
        `${char.primaryElement} elemental mage${secondElem ? ` with ${char.secondaryElement} undertones` : ""}`,
        rank.attire,
        rank.aura,
        `color palette: ${elem.colors}`,
        `atmosphere: ${elem.atmosphere}`,
        `lighting: ${elem.lighting}`,
        `materials: ${elem.materials}`,
        rank.complexity,
    ];
    if (char.godbeast) {
        parts.push(`companion creature: ${char.godbeast.form} (${char.godbeast.name}) partially visible`);
    }
    if (char.personality?.traits) {
        parts.push(`expression conveys: ${char.personality.traits.slice(0, 2).join(", ")}`);
    }
    return {
        prompt: parts.join(", "),
        negativePrompt: ART_DIRECTION.negativeCharacter,
        suggestedModels: [...ART_DIRECTION.suggestedModels],
        suggestedSize: "832x1216",
        suggestedSteps: 30,
        tags: [char.primaryElement.toLowerCase(), char.rank.toLowerCase(), char.house.toLowerCase(), "character", "portrait"],
    };
}
/**
 * Build an image-generation prompt for a location scene.
 */
export function locationToImagePrompt(loc, style) {
    const elem = ELEMENT_AESTHETICS[loc.dominantElement] ?? ELEMENT_AESTHETICS.Earth;
    const stylePrefix = style ?? ART_DIRECTION.defaultLocationStyle;
    const alignmentMood = loc.alignment === "light" ? "hopeful, sacred, welcoming, golden light" :
        loc.alignment === "dark" ? "ominous, ancient, foreboding, deep shadows" :
            "mysterious, balanced between light and shadow, twilight";
    const parts = [
        stylePrefix,
        `${loc.name}, a ${loc.type} in the Arcanea universe`,
        `${loc.dominantElement}-aligned environment`,
        `color palette: ${elem.colors}`,
        `atmosphere: ${elem.atmosphere}`,
        `lighting: ${elem.lighting}`,
        `mood: ${alignmentMood}`,
        `materials and textures: ${elem.materials}`,
        "epic scale, painterly detail, no characters in scene",
    ];
    return {
        prompt: parts.join(", "),
        negativePrompt: ART_DIRECTION.negativeLocation,
        suggestedModels: [...ART_DIRECTION.suggestedModels],
        suggestedSize: "1216x832",
        suggestedSteps: 30,
        tags: [loc.dominantElement.toLowerCase(), loc.type, loc.alignment, "location", "landscape"],
    };
}
/**
 * Build an image-generation prompt for a creature.
 */
export function creatureToImagePrompt(creature, style) {
    const elem = ELEMENT_AESTHETICS[creature.element] ?? ELEMENT_AESTHETICS.Fire;
    const stylePrefix = style ?? ART_DIRECTION.defaultCreatureStyle;
    const sizeScale = {
        tiny: "small enough to sit on a palm, delicate, jewel-like",
        small: "cat-sized, quick, darting",
        medium: "wolf-sized, powerful but agile",
        large: "horse-sized, imposing, majestic",
        massive: "building-sized, awe-inspiring, mythical scale",
    };
    const temperamentMood = {
        hostile: "aggressive stance, bared teeth, predatory eyes, threat display",
        neutral: "watchful, still, assessing, calm power",
        friendly: "gentle eyes, relaxed posture, approachable, playful",
        sacred: "ethereal, glowing, divine presence, otherworldly beauty",
    };
    const parts = [
        stylePrefix,
        `${creature.name}, a ${creature.element}-aligned magical creature`,
        ...(creature.species ? [`species: ${creature.species}`] : []),
        sizeScale[creature.size] ?? sizeScale.medium,
        temperamentMood[creature.temperament] ?? temperamentMood.neutral,
        `color palette: ${elem.colors}`,
        `atmosphere: ${elem.atmosphere}`,
        `lighting: ${elem.lighting}`,
        "detailed anatomy, believable fantasy biology",
    ];
    return {
        prompt: parts.join(", "),
        negativePrompt: ART_DIRECTION.negativeCreature,
        suggestedModels: [...ART_DIRECTION.suggestedModels],
        suggestedSize: "1024x1024",
        suggestedSteps: 30,
        tags: [creature.element.toLowerCase(), creature.size, creature.temperament, "creature"],
    };
}
//# sourceMappingURL=visual.js.map