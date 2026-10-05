import type { SupabaseClient } from "@supabase/supabase-js";
import * as service from "./service";
const missingRpc = new WeakSet<SupabaseClient>();

// Retain ranked search where installed. The accepted production schema has the
// owner-protected table but no search RPC; its fallback uses RLS table reads.
export async function searchOwnedPrompts(
  client: SupabaseClient,
  owner: string,
  query: string,
) {
  if (!query.trim()) return [];
  if (!missingRpc.has(client)) {
    try {
      return (await service.searchPrompts(client, owner, query))
        .filter((row) => row.userId == null || row.userId === owner)
        .map((row) => ({ ...row, userId: owner }));
    } catch (error) {
      if (
        !error ||
        typeof error !== "object" ||
        !("code" in error) ||
        error.code !== "PGRST202"
      )
        throw error;
      missingRpc.add(client);
    }
  }
  // SDK URL encoding plus quoted PostgREST values keep commas/quotes/parentheses
  // inside the search value. SQL LIKE wildcard characters are escaped as text.
  const literal = query.replace(/[\\%_]/g, (value) => "\\" + value);
  const value = JSON.stringify("%" + literal + "%");
  const { data, error } = await client
    .from("pb_prompts")
    .select("*")
    .eq("user_id", owner)
    .eq("is_archived", false)
    .or(`title.ilike.${value},content.ilike.${value}`)
    .order("updated_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? [])
    .map((row) => ({ ...service.mapPrompt(row), rank: 0 }))
    .filter((row) => row.userId === owner);
}
