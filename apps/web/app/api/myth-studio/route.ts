import type { SupabaseClient } from "@supabase/supabase-js";
import atlas from "@arcanea/creator-starters/myth-atlas";
import { validateAtlas } from "@arcanea/creator-starters/myth-packets";
import {
  handleWorkbench,
  packetTag,
  type SnapshotRow,
  type StoreResult,
} from "@arcanea/creator-starters/myth-workbench";
import type { Database, Json } from "@/lib/database/types/supabase";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
const columns =
  "id,user_id,title,type,status,visibility,tags,created_at,content";

async function handle(request: Request) {
  // This is a per-instance limit, not a distributed spend guard. No inference occurs here.
  if (
    !rateLimit(`myth:${rateLimitKey(request)}`, {
      limit: 30,
      windowSeconds: 60,
    }).success
  )
    return Response.json(
      { error: "Too many requests. Try again in a minute." },
      {
        status: 429,
        headers: { "Cache-Control": "private, no-store", "Retry-After": "60" },
      },
    );
  try {
    // Lazy for anonymous compilation: it does not require Supabase configuration.
    let client: SupabaseClient<Database> | undefined;
    async function db() {
      return (client ??= (await createClient()) as SupabaseClient<Database>);
    }
    return await handleWorkbench(request, {
      atlas: validateAtlas(atlas),
      getOwner: async () => {
        const { data, error } = await (await db()).auth.getUser();
        if (error && error.name !== "AuthSessionMissingError") throw error;
        return data.user?.id ?? null;
      },
      store: {
        insert: async (row) =>
          (await (
            await db()
          )
            .from("creations")
            .insert({ ...row, content: row.content as unknown as Json })
            .select(columns)
            .single()) as unknown as StoreResult<SnapshotRow>,
        find: async (id, owner) =>
          (await (
            await db()
          )
            .from("creations")
            .select(columns)
            .eq("id", id)
            .eq("user_id", owner)
            .maybeSingle()) as unknown as StoreResult<SnapshotRow>,
        list: async (owner) =>
          (await (
            await db()
          )
            .from("creations")
            .select(columns)
            .eq("user_id", owner)
            .contains("tags", [packetTag])
            .order("created_at", { ascending: false })
            .limit(30)) as unknown as StoreResult<SnapshotRow[]>,
      },
    });
  } catch {
    return Response.json(
      { error: "Storage is unavailable. Your brief remains in the editor." },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
export const GET = handle;
export const POST = handle;
