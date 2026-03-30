import {
  Pen,
  Image,
  Code,
  MusicNote,
  type IconProps,
} from "@/lib/phosphor-icons";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreationMode = "text" | "image" | "code" | "music";

export interface ModeConfig {
  id: CreationMode;
  label: string;
  icon: React.ComponentType<IconProps & React.RefAttributes<SVGSVGElement>>;
  guardian: string;
  gate: string;
  element: string;
  elementColor: string;
  description: string;
}

export interface GeneratedImageData {
  id: string;
  url: string;
  prompt: string;
}

export interface RecentCreation {
  id: string;
  title: string;
  mode: CreationMode;
  timeAgo: string;
  preview?: string;
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
    element: "Earth",
    elementColor: "#22c55e",
    description: "Write stories, essays, scripts, and more.",
  },
  {
    id: "image",
    label: "Image",
    icon: Image,
    guardian: "Draconia",
    gate: "Fire",
    element: "Fire",
    elementColor: "#ef4444",
    description: "Generate and refine images from text prompts.",
  },
  {
    id: "code",
    label: "Code",
    icon: Code,
    guardian: "Shinkami",
    gate: "Source",
    element: "Void",
    elementColor: "#ffd700",
    description: "Build software with a thinking partner.",
  },
  {
    id: "music",
    label: "Music",
    icon: MusicNote,
    guardian: "Leyla",
    gate: "Flow",
    element: "Water",
    elementColor: "#3b82f6",
    description: "Compose original music and soundscapes.",
  },
];

export const QUICK_START_CARDS = [
  {
    mode: "text" as CreationMode,
    title: "Write a Story",
    subtitle: "Prose, poetry, scripts",
    gradient: "from-emerald-500/20 via-emerald-600/10 to-teal-500/5",
    borderHover: "hover:border-emerald-500/30",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    mode: "image" as CreationMode,
    title: "Generate Image",
    subtitle: "Art, concepts, portraits",
    gradient: "from-red-500/20 via-orange-500/10 to-amber-500/5",
    borderHover: "hover:border-red-500/30",
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
  },
  {
    mode: "code" as CreationMode,
    title: "Write Code",
    subtitle: "Build with AI pair programming",
    gradient: "from-amber-500/20 via-yellow-500/10 to-orange-500/5",
    borderHover: "hover:border-amber-500/30",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    mode: "music" as CreationMode,
    title: "Compose Music",
    subtitle: "Soundscapes and melodies",
    gradient: "from-blue-500/20 via-indigo-500/10 to-cyan-500/5",
    borderHover: "hover:border-blue-500/30",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
];

export const RECENT_CREATIONS: RecentCreation[] = [
  { id: "1", title: "The Starweave Chronicles — Ch. 7", mode: "text", timeAgo: "2h ago", preview: "In the age before fracture..." },
  { id: "2", title: "Guardian of the Void Gate", mode: "image", timeAgo: "5h ago" },
  { id: "3", title: "Runic Cipher Engine", mode: "code", timeAgo: "1d ago", preview: "SerpentCipher class" },
  { id: "4", title: "Battle Hymn of the Olympians", mode: "music", timeAgo: "2d ago" },
  { id: "5", title: "Meditation on the Five Elements", mode: "text", timeAgo: "3d ago", preview: "The Arc turns..." },
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
    title: "Add imagery",
    description: "Weave richer visual language into your prose.",
  },
  {
    title: "Suggest a direction",
    description: "Get an unexpected angle on where this could go.",
  },
];

export const CODE_SUGGESTIONS = [
  {
    title: "Generate this function",
    description: "Write code from a description of what it should do.",
  },
  {
    title: "Explain this code",
    description: "Break down what the code does step by step.",
  },
  {
    title: "Refactor for clarity",
    description: "Improve readability and structure.",
  },
  {
    title: "Find bugs",
    description: "Spot potential issues and suggest fixes.",
  },
];
