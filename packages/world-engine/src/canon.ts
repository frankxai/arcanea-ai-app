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
  { name: "Kaelith",  gate: 1, form: "Great Obsidian Tortoise"      },
  { name: "Veloura",  gate: 2, form: "Tidal Phoenix-Serpent"        },
  { name: "Draconis", gate: 3, form: "Eternal Solar Wyrm"           },
  { name: "Laeylinn", gate: 4, form: "Worldtree Jade Stag"          },
  { name: "Otome",    gate: 5, form: "Starlight Songbird of Truth"  },
  { name: "Yumiko",   gate: 6, form: "Nine-Tailed Crystal Fox"      },
  { name: "Sol",      gate: 7, form: "Radiant Sun Lion of Dawn"     },
  { name: "Vaelith",  gate: 8, form: "Dimensional Void Panther"     },
  { name: "Kyuro",    gate: 9, form: "Silent Twin-Spirited Wolf"    },
  { name: "Source",   gate: 10, form: "The Living Singularity"      },
] as const;

export const ORIGIN_CLASSES: readonly string[] = [
  "Arcan",
  "Gate-Touched",
  "The Awakened",
  "Synth",
  "Bonded",
  "Celestial",
  "Voidtouched",
  "Architect",
] as const;

export const SEVEN_WISDOMS = [
  { name: "Sophron", domain: "Form & Architecture", element: "Earth" },
  { name: "Kardia", domain: "Flow & Emotion", element: "Water" },
  { name: "Valora", domain: "Courage & Transformation", element: "Fire" },
  { name: "Eudaira", domain: "Freedom & Joy", element: "Wind" },
  { name: "Orakis", domain: "Mystery & Strategy", element: "Void" },
  { name: "Poiesis", domain: "Consciousness & Creation", element: "Light" },
  { name: "Enduran", domain: "Unity & Resilience", element: "All" },
] as const;

export const FACTIONS = [
  "Starlight Corps",
  "House Lumina",
  "House Nero",
  "House Pyros",
  "House Aqualis",
  "House Terra",
  "House Ventus",
  "House Synthesis",
  "Gate-Touched Underground",
  "Void Ascendants",
  "Starbound Crews",
  "The Conclave of Archmages",
  "The Iron Synod",
  "Order of the Prismatic Veil",
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
