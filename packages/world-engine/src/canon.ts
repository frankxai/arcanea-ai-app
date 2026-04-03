/**
 * Canonical Arcanea data.
 *
 * Single source of truth for elements, houses, guardians, godbeasts, name
 * roots, and magic ranks. Anything that must match CANON_LOCKED.md lives here.
 */

import type { Element, House, Guardian, Godbeast, MagicRank } from "./types.js";

export const ELEMENTS: readonly Element[] = [
  "Fire", "Water", "Earth", "Wind", "Void", "Spirit",
] as const;

export const HOUSES: readonly House[] = [
  "Lumina", "Nero", "Pyros", "Aqualis", "Terra", "Ventus", "Synthesis",
] as const;

export const GUARDIANS: readonly Guardian[] = [
  { name: "Lyssandria", gate: 1,  domain: "Foundation", element: "Earth"  },
  { name: "Leyla",      gate: 2,  domain: "Flow",        element: "Water"  },
  { name: "Draconia",   gate: 3,  domain: "Fire",        element: "Fire"   },
  { name: "Maylinn",    gate: 4,  domain: "Heart",       element: "Spirit" },
  { name: "Alera",      gate: 5,  domain: "Voice",       element: "Wind"   },
  { name: "Lyria",      gate: 6,  domain: "Sight",       element: "Void"   },
  { name: "Aiyami",     gate: 7,  domain: "Crown",       element: "Spirit" },
  { name: "Elara",      gate: 8,  domain: "Starweave",   element: "Void"   },
  { name: "Ino",        gate: 9,  domain: "Unity",       element: "Spirit" },
  { name: "Shinkami",   gate: 10, domain: "Source",      element: "All"    },
] as const;

export const GODBEASTS: readonly Godbeast[] = [
  { name: "Kaelith",  gate: 1, form: "Great Serpent of Stone"      },
  { name: "Veloura",  gate: 2, form: "Shapeshifting Water Dragon"   },
  { name: "Draconis", gate: 3, form: "Eternal Flame Dragon"         },
  { name: "Laeylinn", gate: 4, form: "Healing Phoenix"              },
  { name: "Otome",    gate: 5, form: "Thunderbird of Truth"         },
  { name: "Yumiko",   gate: 6, form: "Dream Fox with Nine Tails"    },
  { name: "Sol",      gate: 7, form: "Radiant Lion of Dawn"         },
  { name: "Vaelith",  gate: 8, form: "Dimensional Serpent"          },
  { name: "Kyuro",    gate: 9, form: "Twin-Headed Unity Beast"      },
] as const;

/** Name root syllables keyed by element/style */
export const NAME_ROOTS: Readonly<Record<string, string[]>> = {
  fire:   ["Pyr", "Ign", "Flam", "Ard",  "Cal"],
  water:  ["Aqu", "Mar", "Und",  "Flu",  "Nix"],
  earth:  ["Terr","Geo", "Lith", "Cry",  "Fer"],
  wind:   ["Aer", "Vent","Zeph", "Cael", "Vol"],
  void:   ["Nyx", "Umb", "Vel",  "Obs",  "Ten"],
  spirit: ["Lum", "Anim","Sol",  "Aur",  "Vit"],
  noble:  ["Val", "Rex", "Cel",  "Ael",  "Lyn"],
} as const;

/** Name endings keyed by gender */
export const NAME_SUFFIXES: Readonly<Record<string, string[]>> = {
  masculine: ["or", "us", "an", "is", "on", "ar"],
  feminine:  ["a",  "ia", "lyn","ara","elle","ira"],
  neutral:   ["is", "ix", "yn", "ax", "oth", "iel"],
} as const;

/**
 * Gate frequency mapping (informational — never surface Hz to users directly;
 * use poetic taglines instead).
 */
export const GATE_FREQUENCIES: Readonly<Record<number, number>> = {
  1: 174, 2: 285, 3: 396, 4: 417, 5: 528,
  6: 639, 7: 741, 8: 852, 9: 963, 10: 1111,
} as const;

/**
 * Returns the magic rank for a given number of open gates.
 *
 * @param gates - Number of open gates (0–10+)
 */
export function getRankFromGates(gates: number): MagicRank {
  if (gates <= 2) return "Apprentice";
  if (gates <= 4) return "Mage";
  if (gates <= 6) return "Master";
  if (gates <= 8) return "Archmage";
  return "Luminor";
}
