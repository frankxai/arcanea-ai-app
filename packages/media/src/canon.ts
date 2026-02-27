/**
 * Arcanea Canon — Guardian, Gate and element constants
 * Single source of truth for the media intelligence layer.
 */

import type { GuardianName } from './types.js';

export interface GuardianInfo {
  gate:        string;
  frequency:   number;
  element:     string;
  godbeast:    string;
  color:       string;
}

export const GUARDIANS: Record<GuardianName, GuardianInfo> = {
  Lyssandria: { gate: 'Foundation', frequency: 174,  element: 'Earth',  godbeast: 'Kaelith',   color: '#8B6914' },
  Leyla:      { gate: 'Flow',       frequency: 285,  element: 'Water',  godbeast: 'Veloura',   color: '#4169E1' },
  Draconia:   { gate: 'Fire',       frequency: 396,  element: 'Fire',   godbeast: 'Draconis',  color: '#FF4500' },
  Maylinn:    { gate: 'Heart',      frequency: 417,  element: 'Water',  godbeast: 'Laeylinn',  color: '#FF69B4' },
  Alera:      { gate: 'Voice',      frequency: 528,  element: 'Wind',   godbeast: 'Otome',     color: '#87CEEB' },
  Lyria:      { gate: 'Sight',      frequency: 639,  element: 'Arcane', godbeast: 'Yumiko',    color: '#9370DB' },
  Aiyami:     { gate: 'Crown',      frequency: 741,  element: 'Arcane', godbeast: 'Sol',       color: '#FFD700' },
  Elara:      { gate: 'Shift',      frequency: 852,  element: 'Arcane', godbeast: 'Vaelith',   color: '#50C878' },
  Ino:        { gate: 'Unity',      frequency: 963,  element: 'Arcane', godbeast: 'Kyuro',     color: '#40E0D0' },
  Shinkami:   { gate: 'Source',     frequency: 1111, element: 'Arcane', godbeast: 'Amaterasu', color: '#C0C0C0' },
};

export const GUARDIAN_NAMES = Object.keys(GUARDIANS) as GuardianName[];

export const GODBEAST_TO_GUARDIAN: Record<string, GuardianName> = Object.fromEntries(
  Object.entries(GUARDIANS).map(([g, info]) => [info.godbeast, g as GuardianName])
);

export function detectGuardian(text: string): GuardianName | null {
  const t = text.toLowerCase();
  for (const name of GUARDIAN_NAMES) {
    if (t.includes(name.toLowerCase())) return name;
  }
  for (const [godbeast, guardian] of Object.entries(GODBEAST_TO_GUARDIAN)) {
    if (t.includes(godbeast.toLowerCase())) return guardian;
  }
  return null;
}
