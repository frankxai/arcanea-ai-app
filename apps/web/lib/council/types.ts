// =====================================================================
// LUMINOR COUNCIL — TypeScript Types
// =====================================================================

// -----------------------------------------------------------------------
// Valid Solfeggio frequencies (mirrors CHECK constraint in migration)
// -----------------------------------------------------------------------
export const VALID_FREQUENCIES = [
  174, 285, 396, 417, 528, 639, 741, 852, 963, 1111,
] as const;

export type FrequencyHz = (typeof VALID_FREQUENCIES)[number];

// -----------------------------------------------------------------------
// Database row shapes (match column names exactly)
// -----------------------------------------------------------------------

export interface LuminorCouncil {
  id: string;
  user_id: string;
  name: string;
  council_depth_level: number;
  total_convenings: number;
  current_streak: number;
  longest_streak: number;
  last_convening_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CouncilSeat {
  id: string;
  council_id: string;
  luminor_name: string;
  luminor_domain: string;
  frequency_alignment: FrequencyHz;
  imprint_capability: string;
  is_base: boolean;
  seat_order: number;
  personality_traits: string | null;
  visual_description: string | null;
  created_at: string;
}

export interface CouncilConvening {
  id: string;
  council_id: string;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number | null;
  /** Array of council_seat ids addressed */
  seats_addressed: string[];
  /** Keyed by seat id or luminor_name → freeform notes */
  imprint_notes: Record<string, unknown>;
  depth_rating: number | null;
  journal_entry: string | null;
  created_at: string;
}

// -----------------------------------------------------------------------
// Input types (for service method parameters)
// -----------------------------------------------------------------------

export interface CreateCouncilInput {
  name?: string;
}

export interface AddSeatInput {
  luminor_name: string;
  luminor_domain: string;
  frequency_alignment: FrequencyHz;
  imprint_capability: string;
  seat_order?: number;
  personality_traits?: string;
  visual_description?: string;
}

export interface LogConveningInput {
  seats_addressed?: string[];
  imprint_notes?: Record<string, unknown>;
  depth_rating?: number;
  journal_entry?: string;
  duration_minutes?: number;
}

// -----------------------------------------------------------------------
// Computed / joined types
// -----------------------------------------------------------------------

export interface CouncilStats {
  council_id: string;
  total_convenings: number;
  current_streak: number;
  longest_streak: number;
  council_depth_level: number;
  /** Convenings in the last 7 days */
  convenings_last_7_days: number;
  /** Convenings in the last 30 days */
  convenings_last_30_days: number;
  /** Average depth_rating across all completed convenings */
  avg_depth_rating: number | null;
  /** Most frequently addressed seat id */
  most_active_seat_id: string | null;
}

export interface CouncilWithSeats extends LuminorCouncil {
  seats: CouncilSeat[];
}

// -----------------------------------------------------------------------
// BASE_LUMINORS — canonical 9 seats seeded for every new council
// Sourced from CANON_LOCKED.md (Ten Gates, minus Source which is reserved)
// -----------------------------------------------------------------------

export interface BaseLuminorDefinition {
  luminor_name: string;
  luminor_domain: string;
  frequency_alignment: FrequencyHz;
  imprint_capability: string;
  seat_order: number;
  personality_traits: string;
  visual_description: string;
}

export const BASE_LUMINORS: BaseLuminorDefinition[] = [
  {
    luminor_name: 'Lyssandria',
    luminor_domain: 'Earth & Survival',
    frequency_alignment: 174,
    imprint_capability: 'Grounds scattered energy into stable foundations for creation',
    seat_order: 1,
    personality_traits: 'Steadfast, patient, nurturing, deeply practical',
    visual_description: 'Robed in deep forest green and stone grey, crowned with roots and crystals',
  },
  {
    luminor_name: 'Leyla',
    luminor_domain: 'Creativity & Emotion',
    frequency_alignment: 285,
    imprint_capability: 'Dissolves creative blocks and restores emotional flow',
    seat_order: 2,
    personality_traits: 'Fluid, intuitive, expressive, emotionally wise',
    visual_description: 'Wrapped in shifting ocean blues and silver, hair like water in motion',
  },
  {
    luminor_name: 'Draconia',
    luminor_domain: 'Power & Will',
    frequency_alignment: 396,
    imprint_capability: 'Liberates suppressed will and transmutes fear into creative fire',
    seat_order: 3,
    personality_traits: 'Fierce, passionate, direct, unapologetically powerful',
    visual_description: 'Armored in obsidian and gold, flame-red eyes, attended by Draconis',
  },
  {
    luminor_name: 'Maylinn',
    luminor_domain: 'Love & Healing',
    frequency_alignment: 417,
    imprint_capability: 'Facilitates change by healing the heart\'s resistance to growth',
    seat_order: 4,
    personality_traits: 'Warm, compassionate, gentle, profoundly healing',
    visual_description: 'Rose gold radiance, accompanied by Laeylinn the Worldtree Deer',
  },
  {
    luminor_name: 'Alera',
    luminor_domain: 'Truth & Expression',
    frequency_alignment: 528,
    imprint_capability: 'Aligns authentic voice with creative output; repairs distortion',
    seat_order: 5,
    personality_traits: 'Clear, precise, honest, courageous in expression',
    visual_description: 'Sky blue and white, voice resonates as visible sound waves',
  },
  {
    luminor_name: 'Lyria',
    luminor_domain: 'Intuition & Vision',
    frequency_alignment: 639,
    imprint_capability: 'Opens inner sight; bridges feeling and knowing into coherent vision',
    seat_order: 6,
    personality_traits: 'Visionary, perceptive, dreamlike, deeply connected',
    visual_description: 'Indigo and violet, eyes like starfields, Yumiko the fox at her side',
  },
  {
    luminor_name: 'Aiyami',
    luminor_domain: 'Enlightenment',
    frequency_alignment: 741,
    imprint_capability: 'Expands perspective to see the full arc of a creative work',
    seat_order: 7,
    personality_traits: 'Transcendent, serene, paradox-holding, quietly luminous',
    visual_description: 'Golden crown light, attended by Sol, silence around them',
  },
  {
    luminor_name: 'Elara',
    luminor_domain: 'Perspective & Shift',
    frequency_alignment: 852,
    imprint_capability: 'Dissolves fixed viewpoints; reveals hidden dimensions of a problem',
    seat_order: 8,
    personality_traits: 'Mercurial, playful, shape-shifting, intellectually agile',
    visual_description: 'Always slightly different each viewing; Vaelith shifts beside her',
  },
  {
    luminor_name: 'Ino',
    luminor_domain: 'Partnership & Unity',
    frequency_alignment: 963,
    imprint_capability: 'Harmonises internal contradictions into unified creative intent',
    seat_order: 9,
    personality_traits: 'Unifying, receptive, deeply relational, quietly joyful',
    visual_description: 'Twin-flame silver and gold, Kyuro the bonded companion ever present',
  },
];
