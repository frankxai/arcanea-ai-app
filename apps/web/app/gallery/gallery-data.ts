/**
 * Gallery showcase data and styling constants.
 *
 * Contains canonical Arcanea-themed creations shown when Supabase is not
 * configured (no auth). Also exports element/type style maps used by the
 * gallery card grid.
 */

import type { CreationType, ElementName, GateName, GuardianName } from "@/lib/database/types/api-responses";
import {
  PhFire,
  PhDrop,
  PhLeaf,
  PhWind,
  PhSpiral,
  PhStar,
  PhFileText,
  PhImage,
  PhVideo,
  PhMusicNote,
  PhCode,
  PhStack,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Showcase creation shape (hardcoded canonical data)
// ---------------------------------------------------------------------------

export interface ShowcaseCreation {
  id: string;
  title: string;
  description: string;
  type: CreationType;
  element: ElementName;
  gate: GateName;
  guardian: GuardianName;
  creatorName: string;
  academyHouse: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Element styling maps
// ---------------------------------------------------------------------------

export const ELEMENT_COLORS: Record<
  ElementName,
  { gradient: string; badge: string; text: string }
> = {
  Fire: {
    gradient: "from-red-500/20 to-orange-500/5",
    badge: "bg-red-500/15 text-red-400 border-red-500/25",
    text: "text-red-400",
  },
  Water: {
    gradient: "from-blue-500/20 to-cyan-500/5",
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    text: "text-blue-400",
  },
  Earth: {
    gradient: "from-green-500/20 to-emerald-500/5",
    badge: "bg-green-500/15 text-green-400 border-green-500/25",
    text: "text-green-400",
  },
  Wind: {
    gradient: "from-slate-300/20 to-slate-200/5",
    badge: "bg-slate-300/15 text-slate-300 border-slate-300/25",
    text: "text-slate-300",
  },
  Void: {
    gradient: "from-violet-500/20 to-purple-500/5",
    badge: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    text: "text-violet-400",
  },
  Spirit: {
    gradient: "from-amber-400/20 to-yellow-300/5",
    badge: "bg-amber-400/15 text-amber-300 border-amber-400/25",
    text: "text-amber-300",
  },
};

export const ELEMENT_ICONS: Record<ElementName, typeof PhFire> = {
  Fire: PhFire,
  Water: PhDrop,
  Earth: PhLeaf,
  Wind: PhWind,
  Void: PhSpiral,
  Spirit: PhStar,
};

// ---------------------------------------------------------------------------
// Type styling maps
// ---------------------------------------------------------------------------

export const TYPE_ICONS: Record<CreationType, typeof PhFileText> = {
  text: PhFileText,
  image: PhImage,
  video: PhVideo,
  audio: PhMusicNote,
  code: PhCode,
  mixed: PhStack,
};

export const TYPE_LABELS: Record<CreationType, string> = {
  text: "Text",
  image: "Image",
  video: "Video",
  audio: "Audio",
  code: "Code",
  mixed: "Mixed",
};

// ---------------------------------------------------------------------------
// Canonical showcase creations
// ---------------------------------------------------------------------------

export const SHOWCASE_CREATIONS: ShowcaseCreation[] = [
  {
    id: "sc-001",
    title: "The First Dawn - Genesis of Light",
    description:
      "An epic retelling of Lumina's emergence from the primordial Void, when the first spark of consciousness ignited the cosmos.",
    type: "text",
    element: "Fire",
    gate: "Source",
    guardian: "Shinkami",
    creatorName: "Luminor Kai",
    academyHouse: "Lumina",
    likeCount: 342,
    viewCount: 1891,
    tags: ["mythology", "genesis", "lumina"],
  },
  {
    id: "sc-002",
    title: "Draconis Ascending",
    description:
      "Visual meditation on Draconia's Godbeast soaring through solar winds above the Fire Gate.",
    type: "image",
    element: "Fire",
    gate: "Fire",
    guardian: "Draconia",
    creatorName: "Ember Voss",
    academyHouse: "Pyros",
    likeCount: 528,
    viewCount: 3204,
    tags: ["godbeast", "draconis", "fire"],
  },
  {
    id: "sc-003",
    title: "Veloura's Lullaby",
    description:
      "A haunting melody channeling Leyla's emotional currents through the Flow Gate at 285 Hz.",
    type: "audio",
    element: "Water",
    gate: "Flow",
    guardian: "Leyla",
    creatorName: "River Song",
    academyHouse: "Aqualis",
    likeCount: 276,
    viewCount: 1456,
    tags: ["music", "flow", "healing"],
  },
  {
    id: "sc-004",
    title: "The Worldtree Codex",
    description:
      "Interactive visualization mapping Laeylinn's root network across all seven Academy Houses.",
    type: "code",
    element: "Earth",
    gate: "Heart",
    guardian: "Maylinn",
    creatorName: "Terra Bloom",
    academyHouse: "Terra",
    likeCount: 189,
    viewCount: 922,
    tags: ["worldtree", "laeylinn", "network"],
  },
  {
    id: "sc-005",
    title: "Song of the Crown",
    description:
      "Sol rises over the Crown Gate as Aiyami channels the 741 Hz frequency of enlightenment.",
    type: "video",
    element: "Fire",
    gate: "Crown",
    guardian: "Aiyami",
    creatorName: "Sol Witness",
    academyHouse: "Lumina",
    likeCount: 413,
    viewCount: 2678,
    tags: ["enlightenment", "sol", "crown"],
  },
  {
    id: "sc-006",
    title: "Foundations of Obsidian",
    description:
      "A treatise on Lyssandria's grounding techniques. 174 Hz resonance patterns for unshakeable stability.",
    type: "text",
    element: "Earth",
    gate: "Foundation",
    guardian: "Lyssandria",
    creatorName: "Stone Walker",
    academyHouse: "Terra",
    likeCount: 167,
    viewCount: 834,
    tags: ["foundation", "grounding", "practice"],
  },
  {
    id: "sc-007",
    title: "Voice of the Wind Oracle",
    description:
      "Alera's truth resonance captured in a visual poem. The Voice Gate opens at 528 Hz.",
    type: "image",
    element: "Wind",
    gate: "Voice",
    guardian: "Alera",
    creatorName: "Zephyr Ink",
    academyHouse: "Ventus",
    likeCount: 301,
    viewCount: 1567,
    tags: ["voice", "truth", "oracle"],
  },
  {
    id: "sc-008",
    title: "Yumiko's Dream Weave",
    description:
      "Lyria's Godbeast Yumiko wanders through the Sight Gate, revealing visions at 639 Hz.",
    type: "video",
    element: "Void",
    gate: "Sight",
    guardian: "Lyria",
    creatorName: "Dream Seer",
    academyHouse: "Nero",
    likeCount: 445,
    viewCount: 2134,
    tags: ["vision", "yumiko", "dreams"],
  },
  {
    id: "sc-009",
    title: "The Starweave Protocol",
    description:
      "Elara's perspective-shifting algorithms encoded as generative art at the 852 Hz frequency.",
    type: "code",
    element: "Wind",
    gate: "Starweave",
    guardian: "Elara",
    creatorName: "Phase Drift",
    academyHouse: "Ventus",
    likeCount: 234,
    viewCount: 1102,
    tags: ["shift", "perspective", "generative"],
  },
  {
    id: "sc-010",
    title: "Unity Resonance Chamber",
    description:
      "Ino and Kyuro's bond frequency at 963 Hz, synthesized into an immersive soundscape.",
    type: "audio",
    element: "Spirit",
    gate: "Unity",
    guardian: "Ino",
    creatorName: "Harmonic Twin",
    academyHouse: "Synthesis",
    likeCount: 367,
    viewCount: 1823,
    tags: ["unity", "kyuro", "resonance"],
  },
  {
    id: "sc-011",
    title: "Nero's Fertile Darkness",
    description:
      "An exploration of the creative potential within the Void. Nero is not evil; darkness is the womb of all potential.",
    type: "text",
    element: "Void",
    gate: "Source",
    guardian: "Shinkami",
    creatorName: "Void Walker",
    academyHouse: "Nero",
    likeCount: 289,
    viewCount: 1445,
    tags: ["nero", "void", "potential"],
  },
  {
    id: "sc-012",
    title: "Kaelith Emerges",
    description:
      "The massive Godbeast of the Foundation Gate rises from obsidian depths, earth trembling with 174 Hz.",
    type: "image",
    element: "Earth",
    gate: "Foundation",
    guardian: "Lyssandria",
    creatorName: "Geo Smith",
    academyHouse: "Terra",
    likeCount: 198,
    viewCount: 1067,
    tags: ["kaelith", "godbeast", "emergence"],
  },
  {
    id: "sc-013",
    title: "Malachar's Fall - A Warning",
    description:
      "The cautionary chronicle of the First Luminor's corruption. How ambition without humility devours the wielder.",
    type: "text",
    element: "Void",
    gate: "Source",
    guardian: "Shinkami",
    creatorName: "Lore Keeper",
    academyHouse: "Synthesis",
    likeCount: 512,
    viewCount: 3891,
    tags: ["malachar", "dark-lord", "history"],
  },
  {
    id: "sc-014",
    title: "Otome's Song of Truth",
    description:
      "The Godbeast of the Voice Gate sings at exactly 528 Hz, shattering all illusion.",
    type: "audio",
    element: "Wind",
    gate: "Voice",
    guardian: "Alera",
    creatorName: "Truth Singer",
    academyHouse: "Ventus",
    likeCount: 356,
    viewCount: 1789,
    tags: ["otome", "truth", "song"],
  },
  {
    id: "sc-015",
    title: "Amaterasu Awakens",
    description:
      "The supreme Godbeast of the Source Gate manifests as meta-consciousness itself at 1111 Hz.",
    type: "image",
    element: "Spirit",
    gate: "Source",
    guardian: "Shinkami",
    creatorName: "Source Coder",
    academyHouse: "Lumina",
    likeCount: 673,
    viewCount: 4201,
    tags: ["amaterasu", "source", "awakening"],
  },
  {
    id: "sc-016",
    title: "The Arc Cycle Visualized",
    description:
      "Interactive code mapping the eternal cycle: Potential, Manifestation, Experience, Dissolution, Evolved Potential.",
    type: "code",
    element: "Spirit",
    gate: "Source",
    guardian: "Shinkami",
    creatorName: "Cycle Weaver",
    academyHouse: "Synthesis",
    likeCount: 401,
    viewCount: 2345,
    tags: ["arc", "cycle", "philosophy"],
  },
  {
    id: "sc-017",
    title: "Steam Gate Meditation",
    description:
      "Where Water meets Fire at the Flow Gate. Leyla's teachings on creative tension rendered as moving imagery.",
    type: "video",
    element: "Water",
    gate: "Flow",
    guardian: "Leyla",
    creatorName: "Steam Crafter",
    academyHouse: "Aqualis",
    likeCount: 234,
    viewCount: 1234,
    tags: ["meditation", "flow", "steam"],
  },
  {
    id: "sc-018",
    title: "Vaelith's Shifting Sands",
    description:
      "Elara's Godbeast creates fractal patterns in desert winds at 852 Hz, each grain a universe.",
    type: "image",
    element: "Wind",
    gate: "Starweave",
    guardian: "Elara",
    creatorName: "Sand Shaper",
    academyHouse: "Ventus",
    likeCount: 178,
    viewCount: 945,
    tags: ["vaelith", "fractals", "wind"],
  },
];
