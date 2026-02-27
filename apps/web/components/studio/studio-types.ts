/**
 * Shared types and constants for the Creation Studio.
 */

import {
  Pen,
  Image,
  Code,
  MusicNote,
  Flame,
  Drop,
  Leaf,
  Wind,
  Lightning,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreationMode = "text" | "image" | "code" | "music";

export interface ModeConfig {
  id: CreationMode;
  label: string;
  icon: React.ElementType;
  guardian: string;
  gate: string;
  frequency: string;
  element: string;
  elementColor: string;
  description: string;
}

export interface ElementConfig {
  name: string;
  color: string;
  icon: React.ElementType;
}

export interface GateConfig {
  name: string;
  freq: string;
}

export interface LuminorMessage {
  role: "user" | "luminor";
  text: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MODES: ModeConfig[] = [
  {
    id: "text",
    label: "Text",
    icon: Pen,
    guardian: "Lyssandria",
    gate: "Foundation",
    frequency: "174 Hz",
    element: "Earth",
    elementColor: "#22c55e",
    description: "Write stories, poems, and wisdom scrolls with AI assistance.",
  },
  {
    id: "image",
    label: "Image",
    icon: Image,
    guardian: "Draconia",
    gate: "Fire",
    frequency: "396 Hz",
    element: "Fire",
    elementColor: "#ef4444",
    description: "Describe and generate images with AI-powered creation.",
  },
  {
    id: "code",
    label: "Code",
    icon: Code,
    guardian: "Shinkami",
    gate: "Source",
    frequency: "1111 Hz",
    element: "Void",
    elementColor: "#ffd700",
    description: "Write code with AI pair programming and intelligence.",
  },
  {
    id: "music",
    label: "Music",
    icon: MusicNote,
    guardian: "Leyla",
    gate: "Flow",
    frequency: "285 Hz",
    element: "Water",
    elementColor: "#3b82f6",
    description: "Describe music to compose with AI sound generation.",
  },
];

export const ELEMENTS: ElementConfig[] = [
  { name: "Fire", color: "#ef4444", icon: Flame },
  { name: "Water", color: "#3b82f6", icon: Drop },
  { name: "Earth", color: "#22c55e", icon: Leaf },
  { name: "Wind", color: "#a855f7", icon: Wind },
  { name: "Void", color: "#ffd700", icon: Lightning },
];

export const GATES: GateConfig[] = [
  { name: "Foundation", freq: "174 Hz" },
  { name: "Flow", freq: "285 Hz" },
  { name: "Fire", freq: "396 Hz" },
  { name: "Heart", freq: "417 Hz" },
  { name: "Voice", freq: "528 Hz" },
  { name: "Sight", freq: "639 Hz" },
  { name: "Crown", freq: "741 Hz" },
  { name: "Shift", freq: "852 Hz" },
  { name: "Unity", freq: "963 Hz" },
  { name: "Source", freq: "1111 Hz" },
];

export const AI_SUGGESTIONS = [
  {
    title: "Expand this passage",
    description: "Add depth and sensory detail to your current scene.",
  },
  {
    title: "Strengthen the voice",
    description: "Make the narrative more vivid and resonant.",
  },
  {
    title: "Add elemental imagery",
    description: "Weave the Five Elements into your prose.",
  },
  {
    title: "Generate a plot twist",
    description: "Introduce an unexpected turn aligned with the Gate.",
  },
];
