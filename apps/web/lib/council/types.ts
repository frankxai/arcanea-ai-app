// =====================================================================
// COUNCIL — TypeScript Types
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
  seat_order?: number;
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
  council_id: string;
  current_streak: number;
  longest_streak: number;
  total_convenings: number;
  council_depth_level: number;
  convenings_last_7_days: number;
  convenings_last_30_days: number;
  avg_depth_rating: number | null;
  most_active_seat_id: string | null;
}

export interface CouncilWithSeats extends LuminorCouncil {
  seats: CouncilSeat[];
}

// -----------------------------------------------------------------------
// COUNCIL ADVISORS — the 9 Council seats
//
// Naming architecture (progressive disclosure):
//   Newcomer:  domain only      → "Vision Advisor"
//   Creator:   domain + name    → "Vision — Iris"
//   Master:    full personality  → "Iris, Vision Advisor (174 Hz)"
//   Luminor:   full mythology   → "Iris — aligned to Lyssandria's frequency"
//
// The 10th seat (Source, 1111 Hz / Shinkami) is reserved.
// -----------------------------------------------------------------------

export interface AdvisorDefinition {
  /** Domain-first label: Vision, Strategy, Voice, etc. */
  domain: string;
  /** Short character name: Iris, Atlas, Echo, etc. */
  character: string;
  /** DB column value (legacy compat) */
  luminor_name: string;
  /** DB column value (legacy compat) */
  luminor_domain: string;
  frequency_alignment: FrequencyHz;
  /** What this advisor delivers */
  capability: string;
  /** DB column (legacy compat) */
  imprint_capability: string;
  seat_order: number;
  color: string;
  personality_traits?: string;
  visual_description?: string;
}

/** @deprecated Use AdvisorDefinition */
export type BaseLuminorDefinition = AdvisorDefinition;

export const COUNCIL_ADVISORS: AdvisorDefinition[] = [
  {
    domain: 'Vision',
    character: 'Iris',
    luminor_name: 'Iris',
    luminor_domain: 'Vision',
    frequency_alignment: 174,
    capability: 'Pattern recognition and strategic clarity',
    imprint_capability: 'Pattern recognition and strategic clarity',
    seat_order: 1,
    color: '#10b981',
  },
  {
    domain: 'Craft',
    character: 'Nova',
    luminor_name: 'Nova',
    luminor_domain: 'Craft',
    frequency_alignment: 285,
    capability: 'Creative transformation and excellence',
    imprint_capability: 'Creative transformation and excellence',
    seat_order: 2,
    color: '#3b82f6',
  },
  {
    domain: 'Strategy',
    character: 'Atlas',
    luminor_name: 'Atlas',
    luminor_domain: 'Strategy',
    frequency_alignment: 396,
    capability: 'Competitive positioning and power moves',
    imprint_capability: 'Competitive positioning and power moves',
    seat_order: 3,
    color: '#ef4444',
  },
  {
    domain: 'Heart',
    character: 'Aria',
    luminor_name: 'Aria',
    luminor_domain: 'Heart',
    frequency_alignment: 417,
    capability: 'Team dynamics and emotional intelligence',
    imprint_capability: 'Team dynamics and emotional intelligence',
    seat_order: 4,
    color: '#ec4899',
  },
  {
    domain: 'Voice',
    character: 'Echo',
    luminor_name: 'Echo',
    luminor_domain: 'Voice',
    frequency_alignment: 528,
    capability: 'Messaging, storytelling, and communication',
    imprint_capability: 'Messaging, storytelling, and communication',
    seat_order: 5,
    color: '#eab308',
  },
  {
    domain: 'Foresight',
    character: 'Tempo',
    luminor_name: 'Tempo',
    luminor_domain: 'Foresight',
    frequency_alignment: 639,
    capability: 'Trends, timing, and anticipation',
    imprint_capability: 'Trends, timing, and anticipation',
    seat_order: 6,
    color: '#6366f1',
  },
  {
    domain: 'Systems',
    character: 'Axis',
    luminor_name: 'Axis',
    luminor_domain: 'Systems',
    frequency_alignment: 741,
    capability: 'Architecture, scaling, and operations',
    imprint_capability: 'Architecture, scaling, and operations',
    seat_order: 7,
    color: '#8b5cf6',
  },
  {
    domain: 'Depth',
    character: 'Cipher',
    luminor_name: 'Cipher',
    luminor_domain: 'Depth',
    frequency_alignment: 852,
    capability: 'Research, hidden patterns, and deep knowledge',
    imprint_capability: 'Research, hidden patterns, and deep knowledge',
    seat_order: 8,
    color: '#06b6d4',
  },
  {
    domain: 'Growth',
    character: 'Flux',
    luminor_name: 'Flux',
    luminor_domain: 'Growth',
    frequency_alignment: 963,
    capability: 'Evolution, iteration, and continuous becoming',
    imprint_capability: 'Evolution, iteration, and continuous becoming',
    seat_order: 9,
    color: '#f59e0b',
  },
];

/** @deprecated Use COUNCIL_ADVISORS */
export const BASE_LUMINORS = COUNCIL_ADVISORS;
