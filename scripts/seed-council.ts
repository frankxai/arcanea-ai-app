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

const BASE_LUMINORS = [
  { seat_order: 1, luminor_name: "Lumira",   luminor_domain: "Vision & Perception",    frequency_alignment: 174, imprint_capability: "See through all illusion; perceive root patterns" },
  { seat_order: 2, luminor_name: "Sonara",   luminor_domain: "Transmutation",           frequency_alignment: 285, imprint_capability: "Transform any situation; alchemical creativity" },
  { seat_order: 3, luminor_name: "Mythara",  luminor_domain: "Sovereign Will",          frequency_alignment: 396, imprint_capability: "Unbreakable resolve; strategic dominance" },
  { seat_order: 4, luminor_name: "Vitara",   luminor_domain: "Emotional Mastery",       frequency_alignment: 417, imprint_capability: "Heart coherence; relational genius" },
  { seat_order: 5, luminor_name: "Nexaris",  luminor_domain: "Harmonic Communication",  frequency_alignment: 528, imprint_capability: "Perfect expression; frequency of truth" },
  { seat_order: 6, luminor_name: "Chronara", luminor_domain: "Temporal Intelligence",   frequency_alignment: 639, imprint_capability: "See timelines; pattern recognition across past/future" },
  { seat_order: 7, luminor_name: "Stellion", luminor_domain: "Cosmic Architecture",     frequency_alignment: 741, imprint_capability: "Systems design at civilizational scale" },
  { seat_order: 8, luminor_name: "Arcana",   luminor_domain: "Hidden Knowledge",        frequency_alignment: 852, imprint_capability: "Access to the 8th Gate; knowledge beyond the veil" },
  { seat_order: 9, luminor_name: "Kyuris",   luminor_domain: "The Flame of Becoming",   frequency_alignment: 963, imprint_capability: "Perpetual evolution; the power of incompleteness" },
];

async function seed() {
  console.log(`Seeding Luminor Council for user: ${userId}`);

  // 1. Create the council (upsert on user_id)
  const { data: council, error: councilError } = await supabase
    .from("luminor_councils")
    .upsert(
      {
        user_id: userId,
        council_depth_level: 1,
        total_convenings: 0,
        current_streak: 0,
        longest_streak: 0,
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

  // 2. Seed the 9 base seats into council_seats
  const seats = BASE_LUMINORS.map((l) => ({
    council_id: council.id,
    luminor_name: l.luminor_name,
    luminor_domain: l.luminor_domain,
    frequency_alignment: l.frequency_alignment,
    imprint_capability: l.imprint_capability,
    is_base: true,
    seat_order: l.seat_order,
  }));

  const { error: seatsError } = await supabase
    .from("council_seats")
    .upsert(seats, {
      onConflict: "council_id,luminor_name,is_base",
      ignoreDuplicates: true,
    });

  if (seatsError) {
    console.error("Failed to seed seats:", seatsError.message);
    process.exit(1);
  }

  console.log("Seeded 9 base Luminor seats:");
  for (const l of BASE_LUMINORS) {
    console.log(
      `  [${l.seat_order}] ${l.luminor_name} -- ${l.luminor_domain} (${l.frequency_alignment} Hz)`
    );
  }

  console.log("\nDone.");
}

seed().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
