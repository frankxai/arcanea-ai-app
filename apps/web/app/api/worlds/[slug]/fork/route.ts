/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * World Fork API Route
 *
 * POST /api/worlds/[slug]/fork - Fork a world (deep copy)
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api-utils';
import type { WorldRow } from '@/lib/database/types/world-graph-types';

type RouteParams = { params: Promise<{ slug: string }> };

export async function POST(_request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
    }

    // Resolve source world
    const { data: source, error: srcErr } = await supabase
      .from('worlds')
      .select('*')
      .eq('slug', slug)
      .single();

    if (srcErr || !source) {
      return errorResponse('NOT_FOUND', 'World not found', 404);
    }

    if (source.visibility !== 'public' && source.creator_id !== user.id) {
      return errorResponse('NOT_FOUND', 'World not found', 404);
    }

    // Determine unique fork slug
    const { count } = await supabase
      .from('worlds')
      .select('id', { count: 'exact', head: true })
      .like('slug', `${slug}-fork-%`);

    const forkSlug = `${slug}-fork-${(count ?? 0) + 1}`;

    // Build the forked world payload — omit server-managed fields
    // (counters, sync state, and the parent's repo binding stay behind)
    const {
      id: _id,
      created_at: _ca,
      updated_at: _ua,
      star_count: _sc,
      fork_count: _fc,
      character_count: _cc,
      visit_count: _vc,
      genesis_status: _gs,
      repo_url: _ru,
      repo_managed: _rm,
      last_synced_at: _lsa,
      last_indexed_sha: _lis,
      ...inheritedFields
    } = source;

    const { data: forkedWorld, error: forkErr } = await supabase
      .from('worlds')
      .insert({
        ...inheritedFields,
        slug: forkSlug,
        name: `${source.name} (Fork)`,
        creator_id: user.id,
        forked_from: source.id,
        star_count: 0,
        fork_count: 0,
        character_count: 0,
        visibility: 'private',
      })
      .select()
      .single();

    if (forkErr || !forkedWorld) throw new Error(forkErr?.message ?? 'Fork insert failed');

    const forkedId = forkedWorld.id;

    // Copy characters, lore, assets in parallel
    // (world_memories are per-character evolution state and stay with the parent)
    const [chars, lore, assets] = await Promise.all([
      supabase.from('world_characters').select('*').eq('world_id', source.id),
      supabase.from('world_lore').select('*').eq('world_id', source.id),
      supabase.from('world_assets').select('*').eq('world_id', source.id),
    ]);

    if (chars.error) throw chars.error;
    if (lore.error) throw lore.error;
    if (assets.error) throw assets.error;

    type OmitMeta<T> = Omit<T, 'id' | 'world_id' | 'created_at' | 'updated_at'>;

    function copyRows<T extends { id: string; world_id: string; created_at: string | null; updated_at?: string | null }>(
      rows: T[] | null,
    ): (OmitMeta<T> & { world_id: string })[] {
      return (rows ?? []).map(({ id: _rid, world_id: _wid, created_at: _rca, updated_at: _rua, ...rest }) => ({
        ...(rest as OmitMeta<T>),
        world_id: forkedId,
      }));
    }

    const insertResults = await Promise.all([
      chars.data?.length ? supabase.from('world_characters').insert(copyRows(chars.data)) : null,
      lore.data?.length ? supabase.from('world_lore').insert(copyRows(lore.data)) : null,
      assets.data?.length ? supabase.from('world_assets').insert(copyRows(assets.data)) : null,
    ]);

    for (const res of insertResults) {
      if (res?.error) throw res.error;
    }

    // Fork lineage lives on worlds.forked_from; increment parent fork_count
    await supabase
      .from('worlds')
      .update({ fork_count: (source.fork_count ?? 0) + 1 })
      .eq('id', source.id);

    return successResponse({ world: forkedWorld, fork_slug: forkSlug }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
