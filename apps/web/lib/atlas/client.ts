import { createClient } from "@/lib/supabase/server";
import type {
  AtlasUniverse,
  AtlasCreature,
  AtlasArcaneaVariant,
  AtlasCreatureWithContext,
  CanonStatus,
} from "./types";

/** All universes ordered by active_since ascending */
export async function getAtlasUniverses(): Promise<AtlasUniverse[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("atlas_universes")
    .select("*")
    .order("active_since", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Single universe by slug */
export async function getAtlasUniverse(id: string): Promise<AtlasUniverse | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("atlas_universes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** All creatures for a given universe, ordered by tier */
export async function getAtlasCreaturesByUniverse(
  universeId: string
): Promise<AtlasCreature[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("atlas_creatures")
    .select("*")
    .eq("universe_id", universeId)
    .order("tier", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Single creature with universe, relationships, and Arcanea variants */
export async function getAtlasCreatureWithContext(
  id: string
): Promise<AtlasCreatureWithContext | null> {
  const supabase = await createClient();

  const [creatureResult, relsResult, variantsResult] = await Promise.all([
    supabase
      .from("atlas_creatures")
      .select("*, universe:atlas_universes(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("atlas_creature_relationships")
      .select("*, target:atlas_creatures!atlas_creature_relationships_target_id_fkey(*)")
      .eq("source_id", id),
    supabase
      .from("atlas_arcanea_variants")
      .select("*")
      .eq("source_creature_id", id)
      .order("arcanea_tier", { ascending: true }),
  ]);

  if (creatureResult.error) throw creatureResult.error;
  if (!creatureResult.data) return null;

  return {
    ...creatureResult.data,
    relationships: relsResult.data ?? [],
    variants: variantsResult.data ?? [],
  } as AtlasCreatureWithContext;
}

/** All Arcanea variants filtered by canon_status */
export async function getAtlasArcaneaVariants(
  status: CanonStatus | "all" = "all"
): Promise<AtlasArcaneaVariant[]> {
  const supabase = await createClient();
  let q = supabase
    .from("atlas_arcanea_variants")
    .select("*")
    .order("arcanea_tier", { ascending: true });

  if (status !== "all") {
    q = q.eq("canon_status", status);
  }

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}
