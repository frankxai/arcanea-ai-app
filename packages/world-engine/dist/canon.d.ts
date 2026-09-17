/**
 * Canonical Arcanea data.
 *
 * Single source of truth for elements, houses, guardians, godbeasts, name
 * roots, and magic ranks. Anything that must match CANON_LOCKED.md lives here.
 */
import type { Element, House, Guardian, Godbeast, MagicRank } from "./types.js";
export declare const ELEMENTS: readonly Element[];
export declare const HOUSES: readonly House[];
export declare const GUARDIANS: readonly Guardian[];
export declare const GODBEASTS: readonly Godbeast[];
export declare const ORIGIN_CLASSES: readonly string[];
export declare const SEVEN_WISDOMS: readonly [{
    readonly name: "Sophron";
    readonly domain: "Form & Architecture";
    readonly element: "Earth";
}, {
    readonly name: "Kardia";
    readonly domain: "Flow & Emotion";
    readonly element: "Water";
}, {
    readonly name: "Valora";
    readonly domain: "Courage & Transformation";
    readonly element: "Fire";
}, {
    readonly name: "Eudaira";
    readonly domain: "Freedom & Joy";
    readonly element: "Wind";
}, {
    readonly name: "Orakis";
    readonly domain: "Mystery & Strategy";
    readonly element: "Void";
}, {
    readonly name: "Poiesis";
    readonly domain: "Consciousness & Creation";
    readonly element: "Light";
}, {
    readonly name: "Enduran";
    readonly domain: "Unity & Resilience";
    readonly element: "All";
}];
export declare const FACTIONS: readonly ["Starlight Corps", "House Lumina", "House Nero", "House Pyros", "House Aqualis", "House Terra", "House Ventus", "House Synthesis", "Gate-Touched Underground", "Void Ascendants", "Starbound Crews", "The Conclave of Archmages", "The Iron Synod", "Order of the Prismatic Veil"];
/** Name root syllables keyed by element/style */
export declare const NAME_ROOTS: Readonly<Record<string, string[]>>;
/** Name endings keyed by gender */
export declare const NAME_SUFFIXES: Readonly<Record<string, string[]>>;
/**
 * Gate frequency mapping (informational — never surface Hz to users directly;
 * use poetic taglines instead).
 */
export declare const GATE_FREQUENCIES: Readonly<Record<number, number>>;
/**
 * Returns the magic rank for a given number of open gates.
 *
 * @param gates - Number of open gates (0–10+)
 */
export declare function getRankFromGates(gates: number): MagicRank;
//# sourceMappingURL=canon.d.ts.map