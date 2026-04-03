/**
 * Worldbuilding Generators
 *
 * Pure generation functions that return plain objects. Zero MCP SDK dependency.
 * The MCP server wraps these into content responses; the web app uses them directly.
 */
import type { GenerateCharacterOptions, GenerateMagicAbilityOptions, GenerateLocationOptions, GenerateCreatureOptions, GenerateArtifactOptions, GenerateNameOptions, GenerateStoryPromptOptions } from "./types.js";
/** Pick a random element from an array. */
export declare function pick<T>(arr: readonly T[] | T[]): T;
/** Pick multiple random elements (without replacement up to arr.length). */
export declare function pickMultiple<T>(arr: readonly T[] | T[], count: number): T[];
export declare function generateCharacter(options?: GenerateCharacterOptions): {
    _type: string;
    _note: string;
    name: string;
    primaryElement: string;
    secondaryElement: import("./types.js").Element;
    house: string;
    gatesOpen: number;
    rank: import("./types.js").MagicRank;
    patronGuardian: {
        name: string;
        gate: number;
        domain: string;
        element: string;
        relationship: string;
    };
    godbeast: {
        name: string;
        form: string;
        bond: string;
    } | null;
    abilities: string[];
    personality: {
        traits: string[];
        flaw: string;
        desire: string;
        fear: string;
        secret: string;
    };
    backstory: {
        origin: string;
        definingMoment: string;
        currentState: string;
        tension: string;
    };
    magicStyle: string;
    narrativeHooks: string[];
};
export declare function generateMagicAbility(options: GenerateMagicAbilityOptions): {
    _type: string;
    _note: string;
    name: string;
    element: string;
    gateRequired: number;
    gateName: string;
    guardian: string;
    godbeast: string;
    description: string;
    mechanics: {
        cost: {
            mana: number;
            anima: number | undefined;
        };
        casting: {
            gesture: string;
            incantation: string;
            castTime: string;
        };
        mastery: import("./types.js").MagicRank;
    };
    flavor: {
        visual: string;
        sensation: string;
        sideEffect: string;
    };
    narrativeHooks: string[];
};
export declare function generateLocation(options?: GenerateLocationOptions): {
    name: string;
    type: string;
    dominantElement: string;
    alignment: "light" | "dark" | "balanced";
    guardian: string;
    gate: string;
    description: string;
    features: string[];
};
export declare function generateCreature(options?: GenerateCreatureOptions): {
    name: string;
    species: string;
    element: string;
    size: "tiny" | "small" | "medium" | "large" | "massive";
    temperament: "neutral" | "hostile" | "friendly" | "sacred";
    description: string;
    abilities: string[];
    habitat: string;
};
export declare function generateArtifact(options?: GenerateArtifactOptions): {
    name: string;
    type: string;
    element: string;
    powerLevel: "minor" | "moderate" | "major" | "legendary";
    guardian: string;
    abilities: string[];
    requirement: string;
};
export declare function generateName(options?: GenerateNameOptions): {
    element: string;
    type: "character" | "creature" | "artifact" | "place";
    names: string[];
};
export declare function generateStoryPrompt(options?: GenerateStoryPromptOptions): {
    theme: string;
    gate: number;
    gateName: string;
    guardian: string;
    godbeast: string;
    protagonist: {
        element: "Fire" | "Water" | "Earth" | "Wind" | "Void";
        challenge: string;
    };
    conflict: string | undefined;
    storyPrompt: string;
};
//# sourceMappingURL=generators.d.ts.map