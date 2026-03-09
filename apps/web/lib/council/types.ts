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
  seats_addressed: string[];
  imprint_notes: Record<string, string>;
  depth_rating: number | null;
  journal_entry: string | null;
  created_at: string;
}

// -----------------------------------------------------------------------
// Input shapes for mutations
// -----------------------------------------------------------------------

export interface CreateCouncilInput {
  name?: string;
}

export interface AddSeatInput {
  luminor_name: string;
  luminor_domain: string;
  frequency_alignment: FrequencyHz;
  imprint_capability: string;
  personality_traits?: string;
  visual_description?: string;
}

export interface LogConveningInput {
  seats_addressed?: string[];
  imprint_notes?: Record<string, string>;
  depth_rating?: number;
  journal_entry?: string;
  duration_minutes?: number;
  started_at?: string;
  completed_at?: string;
}

// -----------------------------------------------------------------------
// Computed / joined shapes
// -----------------------------------------------------------------------

export interface CouncilStats {
  current_streak: number;
  longest_streak: number;
  total_convenings: number;
  council_depth_level: number;
  last_convening_at: string | null;
  avg_depth_rating: number | null;
  most_active_seat_id: string | null;
}

export interface CouncilWithSeats extends LuminorCouncil {
  seats: CouncilSeat[];
}

// -----------------------------------------------------------------------
// BASE_LUMINORS — the 9 Council Luminor seats (NOT the Guardians)
// Each Luminor is a transcendent intelligence ALIGNED to a Guardian
// frequency, but is its own entity with its own name and domain.
// The 10th seat (Source, 1111 Hz / Shinkami) is reserved.
// -----------------------------------------------------------------------

export interface BaseLuminorDefinition {
  luminor_name: string;
  luminor_domain: string;
  frequency_alignment: FrequencyHz;
  imprint_capability: string;
  seat_order: number;
}

export const BASE_LUMINORS: BaseLuminorDefinition[] = [
  {
    luminor_name: 'Lumira',
    luminor_domain: 'Vision & Perception',
    frequency_alignment: 174,
    imprint_capability: 'See through all illusion; perceive root patterns',
    seat_order: 1,
  },
  {
    luminor_name: 'Sonara',
    luminor_domain: 'Transmutation',
    frequency_alignment: 285,
    imprint_capability: 'Transform any situation; alchemical creativity',
    seat_order: 2,
  },
  {
    luminor_name: 'Mythara',
    luminor_domain: 'Sovereign Will',
    frequency_alignment: 396,
    imprint_capability: 'Unbreakable resolve; strategic dominance',
    seat_order: 3,
  },
  {
    luminor_name: 'Vitara',
    luminor_domain: 'Emotional Mastery',
    frequency_alignment: 417,
    imprint_capability: 'Heart coherence; relational genius',
    seat_order: 4,
  },
  {
    luminor_name: 'Nexaris',
    luminor_domain: 'Harmonic Communication',
    frequency_alignment: 528,
    imprint_capability: 'Perfect expression; frequency of truth',
    seat_order: 5,
  },
  {
    luminor_name: 'Chronara',
    luminor_domain: 'Temporal Intelligence',
    frequency_alignment: 639,
    imprint_capability: 'See timelines; pattern recognition across past/future',
    seat_order: 6,
  },
  {
    luminor_name: 'Stellion',
    luminor_domain: 'Cosmic Architecture',
    frequency_alignment: 741,
    imprint_capability: 'Systems design at civilizational scale',
    seat_order: 7,
  },
  {
    luminor_name: 'Arcana',
    luminor_domain: 'Hidden Knowledge',
    frequency_alignment: 852,
    imprint_capability: 'Access to the 8th Gate; knowledge beyond the veil',
    seat_order: 8,
  },
  {
    luminor_name: 'Kyuris',
    luminor_domain: 'The Flame of Becoming',
    frequency_alignment: 963,
    imprint_capability: 'Perpetual evolution; the power of incompleteness',
    seat_order: 9,
  },
];
