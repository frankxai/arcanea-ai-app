import type React from "react";
import type { IconProps } from "@/lib/phosphor-icons";
import {
  Sparkle,
  Globe,
  Fire,
  Drop,
  Leaf,
  Wind,
  Spiral,
  Books,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PhosphorIcon = React.ComponentType<IconProps>;

export interface VisionCard {
  icon: PhosphorIcon;
  title: string;
  description: string;
  color: string;
}

export interface Element {
  name: string;
  domain: string;
  colors: string;
  border: string;
  text: string;
  icon: PhosphorIcon;
}

export interface Guardian {
  name: string;
  gate: string;
  frequency: string;
  domain: string;
  element: string;
  color: string;
  accent: string;
  border: string;
}

export interface AcademyHouse {
  name: string;
  domain: string;
  color: string;
}

export interface MagicRank {
  gates: string;
  rank: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const VISION_CARDS: VisionCard[] = [
  {
    icon: Sparkle,
    title: "A Fantasy Universe",
    description:
      "Epic mythology with Lumina and Nero's cosmic duality, the Ten Guardians and their Godbeasts, Academies of Creation, and the eternal struggle against the Dark Lord Malachar.",
    color: "gold-bright",
  },
  {
    icon: Globe,
    title: "A Social Platform",
    description:
      "Where creators manifest their visions with AI companions. Build worlds, share creations, and journey through the Gates alongside a community of fellow creators.",
    color: "atlantean-teal-aqua",
  },
  {
    icon: Sparkle,
    title: "A Philosophy of Creation",
    description:
      "Frameworks, rituals, and wisdom for the creative life. The Seven Wisdoms provide practical lenses: Structure, Heart, Courage, Play, Vision, Creation, Endurance.",
    color: "creation-prism-purple",
  },
  {
    icon: Books,
    title: "A Library of Wisdom",
    description:
      "17 collections and 34 original texts of practical guidance for creators. Not entertainment, but equipment for living the creative life.",
    color: "draconic-crimson",
  },
];

export const ELEMENTS: Element[] = [
  {
    name: "Fire",
    domain: "Energy, transformation",
    colors: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
    icon: Fire,
  },
  {
    name: "Water",
    domain: "Flow, healing, memory",
    colors: "from-blue-400/20 to-cyan-400/20",
    border: "border-blue-400/30",
    text: "text-blue-400",
    icon: Drop,
  },
  {
    name: "Earth",
    domain: "Stability, growth",
    colors: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
    icon: Leaf,
  },
  {
    name: "Wind",
    domain: "Freedom, speed, change",
    colors: "from-slate-300/20 to-white/10",
    border: "border-slate-300/30",
    text: "text-slate-300",
    icon: Wind,
  },
  {
    name: "Void / Spirit",
    domain: "Potential & transcendence",
    colors: "from-purple-500/20 to-gold-bright/10",
    border: "border-purple-400/30",
    text: "text-purple-400",
    icon: Spiral,
  },
];

export const GUARDIANS: Guardian[] = [
  {
    name: "Lyssandria",
    gate: "Foundation",
    frequency: "174 Hz",
    domain: "Earth, survival",
    element: "Earth",
    color: "from-green-600/30 to-emerald-800/20",
    accent: "text-green-400",
    border: "border-green-500/20",
  },
  {
    name: "Leyla",
    gate: "Flow",
    frequency: "285 Hz",
    domain: "Creativity, emotion",
    element: "Water",
    color: "from-blue-500/30 to-cyan-700/20",
    accent: "text-blue-400",
    border: "border-blue-400/20",
  },
  {
    name: "Draconia",
    gate: "Fire",
    frequency: "396 Hz",
    domain: "Power, will",
    element: "Fire",
    color: "from-red-600/30 to-orange-800/20",
    accent: "text-red-400",
    border: "border-red-500/20",
  },
  {
    name: "Maylinn",
    gate: "Heart",
    frequency: "417 Hz",
    domain: "Love, healing",
    element: "Wind",
    color: "from-pink-500/30 to-rose-700/20",
    accent: "text-pink-400",
    border: "border-pink-400/20",
  },
  {
    name: "Alera",
    gate: "Voice",
    frequency: "528 Hz",
    domain: "Truth, expression",
    element: "Wind",
    color: "from-sky-500/30 to-blue-700/20",
    accent: "text-sky-400",
    border: "border-sky-400/20",
  },
  {
    name: "Lyria",
    gate: "Sight",
    frequency: "639 Hz",
    domain: "Intuition, vision",
    element: "Water",
    color: "from-indigo-500/30 to-violet-700/20",
    accent: "text-indigo-400",
    border: "border-indigo-400/20",
  },
  {
    name: "Aiyami",
    gate: "Crown",
    frequency: "741 Hz",
    domain: "Enlightenment",
    element: "Void",
    color: "from-violet-500/30 to-purple-800/20",
    accent: "text-violet-400",
    border: "border-violet-400/20",
  },
  {
    name: "Elara",
    gate: "Shift",
    frequency: "852 Hz",
    domain: "Perspective",
    element: "Spirit",
    color: "from-fuchsia-500/30 to-purple-700/20",
    accent: "text-fuchsia-400",
    border: "border-fuchsia-400/20",
  },
  {
    name: "Ino",
    gate: "Unity",
    frequency: "963 Hz",
    domain: "Partnership",
    element: "Spirit",
    color: "from-amber-500/30 to-yellow-700/20",
    accent: "text-amber-400",
    border: "border-amber-400/20",
  },
  {
    name: "Shinkami",
    gate: "Source",
    frequency: "1111 Hz",
    domain: "Meta-consciousness",
    element: "All",
    color: "from-gold-bright/30 to-amber-700/20",
    accent: "text-gold-bright",
    border: "border-gold-bright/30",
  },
];

export const ACADEMY_HOUSES: AcademyHouse[] = [
  { name: "Lumina", domain: "Light and creation", color: "text-gold-bright" },
  { name: "Nero", domain: "Void and potential", color: "text-purple-400" },
  { name: "Pyros", domain: "Fire and transformation", color: "text-red-400" },
  { name: "Aqualis", domain: "Water and flow", color: "text-blue-400" },
  { name: "Terra", domain: "Earth and foundation", color: "text-green-400" },
  { name: "Ventus", domain: "Wind and freedom", color: "text-slate-300" },
  { name: "Synthesis", domain: "Integration of all", color: "text-atlantean-teal-aqua" },
];

export const MAGIC_RANKS: MagicRank[] = [
  { gates: "0-2", rank: "Apprentice", color: "bg-slate-500/20 border-slate-500/30 text-slate-300" },
  { gates: "3-4", rank: "Mage", color: "bg-blue-500/20 border-blue-500/30 text-blue-300" },
  { gates: "5-6", rank: "Master", color: "bg-purple-500/20 border-purple-500/30 text-purple-300" },
  { gates: "7-8", rank: "Archmage", color: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
  { gates: "9-10", rank: "Luminor", color: "bg-gold-bright/20 border-gold-bright/30 text-gold-bright" },
];
