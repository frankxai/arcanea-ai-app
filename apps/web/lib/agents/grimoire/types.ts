/**
 * Grimoire Types — The Personalized Creative Universe Product
 *
 * The Grimoire is Arcanea's flagship premium product: AI agents that
 * build a complete creative universe from a buyer's ten-question answers.
 */

// ---------------------------------------------------------------------------
// Question schema
// ---------------------------------------------------------------------------

export interface GrimoireQuestion {
  id: string;
  label: string;
  description: string;
  type: "text" | "textarea" | "select" | "multiselect";
  options?: string[];
  placeholder: string;
  required: boolean;
}

// ---------------------------------------------------------------------------
// Order & section schema
// ---------------------------------------------------------------------------

export interface GrimoireSection {
  id: string;
  title: string;
  agentId: string;
  content: string;
  status: "pending" | "generating" | "complete" | "error";
}

export interface GrimoireOrder {
  id: string;
  userId: string | null;
  email: string;
  answers: Record<string, string>;
  tier: "apprentice" | "mage" | "archmage";
  status:
    | "questionnaire"
    | "generating"
    | "review"
    | "delivered"
    | "failed";
  sections: GrimoireSection[];
  createdAt: string;
  completedAt: string | null;
}

// ---------------------------------------------------------------------------
// Tier schema
// ---------------------------------------------------------------------------

export type GrimoireTier = {
  id: "apprentice" | "mage" | "archmage";
  name: string;
  price: number;
  description: string;
  sections: string[];
  agentCount: number;
};

// ---------------------------------------------------------------------------
// The 10 questions
// ---------------------------------------------------------------------------

export const GRIMOIRE_QUESTIONS: GrimoireQuestion[] = [
  {
    id: "soul",
    label: "What is the soul of your world?",
    description:
      "Describe the core theme or feeling. What emotion lingers after someone leaves your world?",
    type: "textarea",
    placeholder:
      "A world haunted by forgotten gods, where memory itself is a form of magic...",
    required: true,
  },
  {
    id: "era",
    label: "What era does your world inhabit?",
    description: "Choose the age that shapes the rhythm of daily life.",
    type: "select",
    options: [
      "Ancient",
      "Medieval",
      "Renaissance",
      "Industrial",
      "Modern",
      "Future",
      "Timeless",
    ],
    placeholder: "Select an era",
    required: true,
  },
  {
    id: "power",
    label: "What is the source of power?",
    description:
      "How does magic, technology, or force work? What are its costs and limits?",
    type: "textarea",
    placeholder:
      "Magic draws from the grief of ancestors — the more you mourn, the more you can shape reality...",
    required: true,
  },
  {
    id: "conflict",
    label: "What conflict drives everything?",
    description:
      "The central tension beneath every story, every faction, every choice.",
    type: "textarea",
    placeholder:
      "Two forces both believe they are saving the world — and both are right...",
    required: true,
  },
  {
    id: "protagonist",
    label: "Who is your protagonist?",
    description:
      "Name, wound, desire. Who is at the center of your world's story?",
    type: "textarea",
    placeholder:
      "Sera Ashveil — orphaned by the very god she worships, searching for a reason to believe again...",
    required: true,
  },
  {
    id: "aesthetic",
    label: "What aesthetic defines your world?",
    description: "The visual and emotional texture of everything in it.",
    type: "select",
    options: [
      "Dark & Gothic",
      "Luminous & Ethereal",
      "Gritty & Realistic",
      "Vibrant & Mythic",
      "Cosmic & Abstract",
      "Warm & Pastoral",
    ],
    placeholder: "Select an aesthetic",
    required: true,
  },
  {
    id: "elements",
    label: "What elements dominate?",
    description:
      "Choose up to three elements that pulse through your world's veins.",
    type: "multiselect",
    options: ["Fire", "Water", "Earth", "Wind", "Void", "Spirit"],
    placeholder: "Select elements",
    required: true,
  },
  {
    id: "factions",
    label: "How many factions exist?",
    description: "The shape of conflict — binary, triangular, or sprawling.",
    type: "select",
    options: [
      "2 (binary)",
      "3 (triangle)",
      "5+ (complex)",
      "None (solo journey)",
    ],
    placeholder: "Select faction structure",
    required: true,
  },
  {
    id: "forbidden",
    label: "What is forbidden in your world?",
    description:
      "The taboo, the unspeakable act — the thing that shapes all moral tension.",
    type: "textarea",
    placeholder:
      "To speak the name of the Void aloud is to invite its hunger. All texts refer to it only as the Silence...",
    required: true,
  },
  {
    id: "tone",
    label: "What tone should the writing carry?",
    description: "The voice your world speaks in.",
    type: "select",
    options: [
      "Epic & Elevated",
      "Intimate & Personal",
      "Dark & Unflinching",
      "Playful & Whimsical",
      "Philosophical & Questioning",
    ],
    placeholder: "Select a tone",
    required: true,
  },
];

// ---------------------------------------------------------------------------
// The 3 tiers
// ---------------------------------------------------------------------------

export const GRIMOIRE_TIERS: GrimoireTier[] = [
  {
    id: "apprentice",
    name: "Apprentice",
    price: 197,
    description:
      "The foundation of your world — mythology, characters, and the first words.",
    sections: [
      "World Overview & Mythology",
      "3 Deep Characters",
      "Magic System Design",
      "Opening Chapter",
    ],
    agentCount: 3,
  },
  {
    id: "mage",
    name: "Mage",
    price: 297,
    description:
      "Your world expands with factions, more characters, and a visual identity.",
    sections: [
      "World Overview & Mythology",
      "5 Deep Characters",
      "Magic System Design",
      "3 Chapter Openings",
      "2 Faction Profiles",
      "Visual Direction Guide",
    ],
    agentCount: 5,
  },
  {
    id: "archmage",
    name: "Archmage",
    price: 497,
    description:
      "The complete world bible — everything you need to write, publish, and share your universe.",
    sections: [
      "Full World Bible",
      "10 Deep Characters",
      "Magic System Design",
      "5 Chapter Openings",
      "5 Faction Profiles",
      "Visual Direction Guide",
      "Soundtrack Concept",
      "Publishing Plan",
    ],
    agentCount: 8,
  },
];
