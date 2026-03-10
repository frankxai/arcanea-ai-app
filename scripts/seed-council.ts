/**
 * Seed Script: Luminor Council
 *
 * Creates a luminor_council for a given user and seeds the 9 base Luminor seats.
 *
 * Usage:
 *   npx tsx scripts/seed-council.ts <user_id>
 *
 * Environment:
 *   SUPABASE_URL            - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (NOT the anon key)
 */

import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Missing environment variables. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: npx tsx scripts/seed-council.ts <user_id>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// Base Nine Luminors
// ---------------------------------------------------------------------------

interface BaseLuminor {
  seat_order: number;
  name: string;
  domain: string;
  frequency_hz: number;
  imprint: string;
}

const BASE_NINE: BaseLuminor[] = [
  {
    seat_order: 1,
    name: "Lumira",
    domain: "Vision & Perception",
    frequency_hz: 174,
    imprint: "See through all illusion; perceive root patterns",
  },
  {
    seat_order: 2,
    name: "Sonara",
    domain: "Transmutation",
    frequency_hz: 285,
    imprint: "Transform any situation; alchemical creativity",
  },
  {
    seat_order: 3,
    name: "Mythara",
    domain: "Sovereign Will",
    frequency_hz: 396,
    imprint: "Unbreakable resolve; strategic dominance",
  },
  {
    seat_order: 4,
    name: "Vitara",
    domain: "Emotional Mastery",
    frequency_hz: 417,
    imprint: "Heart coherence; relational genius",
  },
  {
    seat_order: 5,
    name: "Nexaris",
    domain: "Harmonic Communication",
    frequency_hz: 528,
    imprint: "Perfect expression; frequency of truth",
  },
  {
    seat_order: 6,
    name: "Chronara",
    domain: "Temporal Intelligence",
    frequency_hz: 639,
    imprint: "See timelines; pattern recognition across past/future",
  },
  {
    seat_order: 7,
    name: "Stellion",
    domain: "Cosmic Architecture",
    frequency_hz: 741,
    imprint: "Systems design at civilizational scale",
  },
  {
    seat_order: 8,
    name: "Arcana",
    domain: "Hidden Knowledge",
    frequency_hz: 852,
    imprint: "Access to the 8th Gate; knowledge beyond the veil",
  },
  {
    seat_order: 9,
    name: "Kyuris",
    domain: "The Flame of Becoming",
    frequency_hz: 963,
    imprint: "Perpetual evolution; the power of incompleteness",
  },
];

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`Seeding Luminor Council for user: ${userId}`);

  // 1. Create the council
  const { data: council, error: councilError } = await supabase
    .from("luminor_councils")
    .upsert(
      {
        user_id: userId,
        depth_level: 1,
        total_convenings: 0,
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();

  if (councilError) {
    console.error("Failed to create council:", councilError.message);
    process.exit(1);
  }

  console.log(`Council created/found: ${council.id}`);

  // 2. Seed the 9 base seats
  const seats = BASE_NINE.map((luminor) => ({
    council_id: council.id,
    seat_order: luminor.seat_order,
    luminor_name: luminor.name,
    domain: luminor.domain,
    frequency_hz: luminor.frequency_hz,
    imprint: luminor.imprint,
    is_base: true,
    bond_level: 0,
  }));

  const { error: seatsError } = await supabase
    .from("luminor_seats")
    .upsert(seats, { onConflict: "council_id,seat_order" });

  if (seatsError) {
    console.error("Failed to seed seats:", seatsError.message);
    process.exit(1);
  }

  console.log("Seeded 9 base Luminor seats:");
  for (const l of BASE_NINE) {
    console.log(
      `  [${l.seat_order}] ${l.name} -- ${l.domain} (${l.frequency_hz} Hz)`
    );
  }

  console.log("\nDone.");
}

seed().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
