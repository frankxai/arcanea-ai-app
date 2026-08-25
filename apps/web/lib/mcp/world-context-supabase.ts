import type { SupabaseClient } from "@supabase/supabase-js";

import { GatewayError } from "@arcanea/mcp-server/gateway";

import type { Database } from "@/lib/database/types/supabase";

import type {
  CharacterSourceRow,
  FactionSourceRow,
  LocationSourceRow,
  WorldContextDataSource,
  WorldSourceRow,
} from "./world-context-repository";

const MAX_ROWS_PER_ENTITY_TYPE = 100;

type WorldRow = Database["public"]["Tables"]["worlds"]["Row"];
type CharacterRow = Database["public"]["Tables"]["world_characters"]["Row"];
type FactionRow = Database["public"]["Tables"]["world_factions"]["Row"];
type LocationRow = Database["public"]["Tables"]["world_locations"]["Row"];

function assertBounded<T>(rows: T[] | null, count: number | null): T[] {
  const resolved = rows ?? [];
  if (
    count === null ||
    count > MAX_ROWS_PER_ENTITY_TYPE ||
    count !== resolved.length
  ) {
    throw new GatewayError("context-query-plan-unbounded");
  }
  return resolved;
}

export function createSupabaseWorldContextDataSource(
  client: SupabaseClient<Database>,
): WorldContextDataSource {
  return {
    async loadOwnedWorld({ actorId, worldId }): Promise<WorldSourceRow | null> {
      const { data, error } = await client
        .from("worlds")
        .select(
          "id,creator_id,name,slug,tagline,description,mood,elements,laws,palette,systems,visibility,created_at,updated_at",
        )
        .eq("id", worldId)
        .eq("creator_id", actorId)
        .maybeSingle();
      if (error) throw new GatewayError("revision-unavailable");
      if (!data) return null;
      const row = data as Pick<
        WorldRow,
        | "id"
        | "creator_id"
        | "name"
        | "slug"
        | "tagline"
        | "description"
        | "mood"
        | "elements"
        | "laws"
        | "palette"
        | "systems"
        | "visibility"
        | "created_at"
        | "updated_at"
      >;
      return {
        id: row.id,
        creatorId: row.creator_id,
        name: row.name,
        slug: row.slug,
        tagline: row.tagline,
        description: row.description,
        mood: row.mood,
        elements: row.elements,
        laws: row.laws,
        palette: row.palette,
        systems: row.systems,
        visibility: row.visibility,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    },

    async listCharacters(worldId): Promise<CharacterSourceRow[]> {
      const { data, error, count } = await client
        .from("world_characters")
        .select(
          "id,world_id,name,title,backstory,motivation,element,gate,origin_class,personality,faction_id,relationships,portrait_url,theme_music_url,created_at,updated_at",
          { count: "exact" },
        )
        .eq("world_id", worldId)
        .order("id", { ascending: true })
        .limit(MAX_ROWS_PER_ENTITY_TYPE);
      if (error) throw new GatewayError("revision-unavailable");
      return assertBounded(data, count).map((value) => {
        const row = value as Pick<
          CharacterRow,
          | "id"
          | "world_id"
          | "name"
          | "title"
          | "backstory"
          | "motivation"
          | "element"
          | "gate"
          | "origin_class"
          | "personality"
          | "faction_id"
          | "relationships"
          | "portrait_url"
          | "theme_music_url"
          | "created_at"
          | "updated_at"
        >;
        return {
          id: row.id,
          worldId: row.world_id,
          name: row.name,
          title: row.title,
          backstory: row.backstory,
          motivation: row.motivation,
          element: row.element,
          gate: row.gate,
          originClass: row.origin_class,
          personality: row.personality,
          factionId: row.faction_id,
          relationships: row.relationships,
          portraitUrl: row.portrait_url,
          themeMusicUrl: row.theme_music_url,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      });
    },

    async listFactions(worldId): Promise<FactionSourceRow[]> {
      const { data, error, count } = await client
        .from("world_factions")
        .select(
          "id,world_id,name,philosophy,history,territory,visual_identity,created_at",
          { count: "exact" },
        )
        .eq("world_id", worldId)
        .order("id", { ascending: true })
        .limit(MAX_ROWS_PER_ENTITY_TYPE);
      if (error) throw new GatewayError("revision-unavailable");
      return assertBounded(data, count).map((value) => {
        const row = value as Pick<
          FactionRow,
          | "id"
          | "world_id"
          | "name"
          | "philosophy"
          | "history"
          | "territory"
          | "visual_identity"
          | "created_at"
        >;
        return {
          id: row.id,
          worldId: row.world_id,
          name: row.name,
          philosophy: row.philosophy,
          history: row.history,
          territory: row.territory,
          visualIdentity: row.visual_identity,
          createdAt: row.created_at,
        };
      });
    },

    async listLocations(worldId): Promise<LocationSourceRow[]> {
      const { data, error, count } = await client
        .from("world_locations")
        .select(
          "id,world_id,name,description,region,significance,coordinates,image_url,ambient_music_url,created_at",
          { count: "exact" },
        )
        .eq("world_id", worldId)
        .order("id", { ascending: true })
        .limit(MAX_ROWS_PER_ENTITY_TYPE);
      if (error) throw new GatewayError("revision-unavailable");
      return assertBounded(data, count).map((value) => {
        const row = value as Pick<
          LocationRow,
          | "id"
          | "world_id"
          | "name"
          | "description"
          | "region"
          | "significance"
          | "coordinates"
          | "image_url"
          | "ambient_music_url"
          | "created_at"
        >;
        return {
          id: row.id,
          worldId: row.world_id,
          name: row.name,
          description: row.description,
          region: row.region,
          significance: row.significance,
          coordinates: row.coordinates,
          imageUrl: row.image_url,
          ambientMusicUrl: row.ambient_music_url,
          createdAt: row.created_at,
        };
      });
    },
  };
}
