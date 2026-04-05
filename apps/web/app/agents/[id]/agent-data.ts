/**
 * Agent marketplace catalog data and types.
 *
 * Separated from the page component to keep file sizes manageable
 * and allow reuse from other parts of the app (e.g. marketplace listing).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RunStatus = "idle" | "streaming" | "completed" | "error";

export interface MarketplaceAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  priceCredits: number;
  element: string;
  icon: string;
  color: string;
  gradient: string;
  rating: number;
  usageCount: number;
  isFeatured: boolean;
  capabilities: string[];
  examplePrompts: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatUsageCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

// ---------------------------------------------------------------------------
// Agent catalog
// ---------------------------------------------------------------------------

export const AGENTS_CATALOG: MarketplaceAgent[] = [
  {
    id: "quillblade",
    name: "Quillblade",
    title: "Story Writer",
    description: "Crafts compelling narratives, chapters, and complete story arcs with rich character development and world-consistent prose.",
    priceCredits: 15,
    element: "Fire",
    icon: "\u{1F5E1}\uFE0F",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    rating: 4.8,
    usageCount: 3241,
    isFeatured: true,
    capabilities: ["Long-form narratives", "Chapter generation", "Dialogue writing", "Scene description"],
    examplePrompts: [
      "Write chapter 3 of my fantasy novel where the hero discovers their power",
      "Create a tense confrontation scene between two rivals",
      "Write a prologue that hooks readers from the first sentence",
    ],
  },
  {
    id: "soulforge",
    name: "Soulforge",
    title: "Character Designer",
    description: "Builds deep, memorable characters with backstory, motivations, voice, and personality that feel genuinely alive.",
    priceCredits: 10,
    element: "Spirit",
    icon: "\u{1F525}",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    rating: 4.9,
    usageCount: 2876,
    isFeatured: true,
    capabilities: ["Character backstory", "Personality profiling", "Voice development", "Character sheets"],
    examplePrompts: [
      "Create a morally grey villain who believes they are the hero",
      "Design a side character who steals every scene they appear in",
      "Build a protagonist with a compelling inner conflict",
    ],
  },
  {
    id: "cosmograph",
    name: "Cosmograph",
    title: "World Builder",
    description: "Constructs entire fantasy worlds with geography, history, cultures, magic systems, and internal consistency.",
    priceCredits: 20,
    element: "Earth",
    icon: "\u{1F30D}",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    rating: 4.7,
    usageCount: 1654,
    isFeatured: false,
    capabilities: ["World geography", "History & lore", "Magic systems", "Cultural design"],
    examplePrompts: [
      "Create a world where magic is powered by music",
      "Design the political factions of a steampunk empire",
      "Build a pantheon of gods for my fantasy world",
    ],
  },
  {
    id: "inkwarden",
    name: "Inkwarden",
    title: "Editor",
    description: "Refines, polishes, and elevates your writing — fixing structure, voice, pacing, and clarity without losing your style.",
    priceCredits: 10,
    element: "Water",
    icon: "\u{1F4DD}",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    rating: 4.6,
    usageCount: 4102,
    isFeatured: false,
    capabilities: ["Line editing", "Structural feedback", "Pacing analysis", "Voice consistency"],
    examplePrompts: [
      "Edit this scene to improve the pacing and tension",
      "Strengthen the dialogue to feel more natural",
      "Rewrite this paragraph to match the chapter's tone",
    ],
  },
  {
    id: "codeweaver",
    name: "Codeweaver",
    title: "Code Builder",
    description: "Writes production-quality code for your creative tools, interactive stories, and web experiences.",
    priceCredits: 15,
    element: "Fire",
    icon: "\u26A1",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
    rating: 4.5,
    usageCount: 987,
    isFeatured: false,
    capabilities: ["TypeScript & React", "API integration", "Interactive fiction engines", "Web components"],
    examplePrompts: [
      "Build a character generator component with randomization",
      "Create an interactive story branching system",
      "Write a REST API for my world-building database",
    ],
  },
  {
    id: "loreseeker",
    name: "Loreseeker",
    title: "Research Agent",
    description: "Digs deep into mythology, history, science, and culture to provide rich reference material for your world.",
    priceCredits: 10,
    element: "Wind",
    icon: "\u{1F50D}",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #94a3b8, #cbd5e1)",
    rating: 4.4,
    usageCount: 1234,
    isFeatured: false,
    capabilities: ["Mythology research", "Historical accuracy", "Scientific grounding", "Cultural context"],
    examplePrompts: [
      "Research real-world mythology that inspired Norse gods",
      "Find historical precedents for a matriarchal warrior society",
      "Explain how alchemy works to inform my magic system",
    ],
  },
  {
    id: "resonance",
    name: "Resonance",
    title: "Music Composer",
    description: "Creates original music concepts, lyrics, chord progressions, and full song structures for your creative universe.",
    priceCredits: 15,
    element: "Water",
    icon: "\u{1F3B5}",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
    rating: 4.7,
    usageCount: 782,
    isFeatured: false,
    capabilities: ["Lyric writing", "Chord progressions", "Song structure", "Musical themes"],
    examplePrompts: [
      "Write a haunting ballad for my villain's backstory",
      "Create a battle hymn with epic orchestral feel",
      "Compose lyrics for a bard character in my fantasy world",
    ],
  },
  {
    id: "visioncraft",
    name: "Visioncraft",
    title: "Cover Artist Director",
    description: "Creates detailed visual art direction and prompts for stunning book covers, character art, and world illustrations.",
    priceCredits: 10,
    element: "Void",
    icon: "\u{1F3A8}",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    rating: 4.6,
    usageCount: 2341,
    isFeatured: false,
    capabilities: ["Art direction", "Image prompts", "Style guides", "Cover composition"],
    examplePrompts: [
      "Create an art direction brief for my novel's cover",
      "Write detailed prompts for character portrait illustrations",
      "Design a visual style guide for my fantasy world",
    ],
  },
  {
    id: "bindmaster",
    name: "Bindmaster",
    title: "Publisher",
    description: "Prepares your work for publication — formatting, metadata, blurbs, query letters, and distribution strategy.",
    priceCredits: 20,
    element: "Earth",
    icon: "\u{1F4DA}",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e, #854d0e)",
    rating: 4.3,
    usageCount: 445,
    isFeatured: false,
    capabilities: ["Book formatting", "Blurb writing", "Query letters", "Distribution planning"],
    examplePrompts: [
      "Write a compelling back-cover blurb for my novel",
      "Create a query letter for literary agents",
      "Format my manuscript for Amazon KDP",
    ],
  },
  {
    id: "heraldspark",
    name: "Heraldspark",
    title: "Social Manager",
    description: "Builds your author platform with compelling social content, newsletters, and launch campaigns.",
    priceCredits: 10,
    element: "Wind",
    icon: "\u{1F4E3}",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #64748b, #94a3b8)",
    rating: 4.2,
    usageCount: 678,
    isFeatured: false,
    capabilities: ["Social content", "Newsletter writing", "Launch campaigns", "Audience building"],
    examplePrompts: [
      "Write a Twitter thread announcing my book launch",
      "Create a month of social content for a fantasy author",
      "Draft a newsletter for my readers about the next book",
    ],
  },
  {
    id: "tonguebridge",
    name: "Tonguebridge",
    title: "Translator",
    description: "Translates your creative works with cultural nuance and narrative faithfulness across 50+ languages.",
    priceCredits: 15,
    element: "Wind",
    icon: "\u{1F310}",
    color: "#f8fafc",
    gradient: "linear-gradient(135deg, #78a6ff, #7fffd4)",
    rating: 4.5,
    usageCount: 334,
    isFeatured: false,
    capabilities: ["Literary translation", "Cultural adaptation", "Localization", "50+ languages"],
    examplePrompts: [
      "Translate this chapter to Spanish, keeping the poetic tone",
      "Adapt the cultural references for a Japanese audience",
      "Localize the magic system terminology for French readers",
    ],
  },
  {
    id: "gatewarden",
    name: "Gatewarden",
    title: "Curriculum Designer",
    description: "Designs structured learning experiences, workshops, and courses that teach world-building and creative craft.",
    priceCredits: 20,
    element: "Spirit",
    icon: "\u{1F393}",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    rating: 4.8,
    usageCount: 221,
    isFeatured: false,
    capabilities: ["Course design", "Workshop curricula", "Learning paths", "Craft exercises"],
    examplePrompts: [
      "Design a 6-week course on fantasy world-building",
      "Create a workshop on writing compelling villains",
      "Build a learning path from beginner to published author",
    ],
  },
];
