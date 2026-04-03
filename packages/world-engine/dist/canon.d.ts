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