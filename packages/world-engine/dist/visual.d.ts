/**
 * Visual Prompt Generator
 *
 * Converts worldbuilding blueprints into image-generation prompts compatible
 * with ComfyUI, Midjourney, DALL-E, Imagen, and Canva.
 *
 * Returns typed objects — no JSON.stringify here, so callers can decide how
 * to serialize (the MCP server wraps in content, the web app uses directly).
 */
import type { CharacterBlueprint, LocationBlueprint, CreatureBlueprint, ImagePromptResult, ElementAesthetics, RankVisual } from "./types.js";
export declare const ELEMENT_AESTHETICS: Readonly<Record<string, ElementAesthetics>>;
export declare const RANK_VISUAL: Readonly<Record<string, RankVisual>>;
/** Art direction constants for downstream prompting pipelines */
export declare const ART_DIRECTION: {
    readonly defaultCharacterStyle: "digital painting, concept art, fantasy character portrait";
    readonly defaultLocationStyle: "digital painting, fantasy landscape, concept art, wide shot";
    readonly defaultCreatureStyle: "digital painting, creature design, fantasy illustration, concept art";
    readonly negativeCharacter: "text, watermark, blurry, low quality, anime unless specified, modern clothing, guns, technology";
    readonly negativeLocation: "text, watermark, blurry, modern buildings, cars, technology";
    readonly negativeCreature: "text, watermark, blurry, cute cartoon style, chibi, human";
    readonly suggestedModels: string[];
};
/**
 * Build an image-generation prompt for a character portrait.
 *
 * @param char  - Character blueprint (from generateCharacter or user-provided)
 * @param style - Override the default style prefix
 */
export declare function characterToImagePrompt(char: CharacterBlueprint, style?: string): ImagePromptResult;
/**
 * Build an image-generation prompt for a location scene.
 */
export declare function locationToImagePrompt(loc: LocationBlueprint, style?: string): ImagePromptResult;
/**
 * Build an image-generation prompt for a creature.
 */
export declare function creatureToImagePrompt(creature: CreatureBlueprint, style?: string): ImagePromptResult;
//# sourceMappingURL=visual.d.ts.map