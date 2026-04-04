/**
 * Visual Prompt Generator
 *
 * Converts MCP creation blueprints into image generation prompts
 * compatible with ComfyUI, Midjourney, DALL-E, Imagen, Canva.
 *
 * This bridges the gap between "I created a character" and "I can SEE my character."
 */
interface CharacterBlueprint {
    name: string;
    primaryElement: string;
    secondaryElement?: string;
    house: string;
    rank: string;
    gatesOpen: number;
    patronGuardian?: {
        name: string;
        domain: string;
    };
    godbeast?: {
        name: string;
        form: string;
        bond?: string;
    };
    personality?: {
        traits: string[];
        flaw?: string;
    };
}
interface LocationBlueprint {
    name: string;
    dominantElement: string;
    type: string;
    alignment: string;
}
interface CreatureBlueprint {
    name: string;
    element: string;
    size: string;
    temperament: string;
    species?: string;
}
/**
 * Generate an image prompt for a character portrait
 */
export declare function characterToImagePrompt(char: CharacterBlueprint, style?: string): string;
/**
 * Generate an image prompt for a location scene
 */
export declare function locationToImagePrompt(loc: LocationBlueprint, style?: string): string;
/**
 * Generate an image prompt for a creature
 */
export declare function creatureToImagePrompt(creature: CreatureBlueprint, style?: string): string;
export {};
//# sourceMappingURL=visual-prompts.d.ts.map