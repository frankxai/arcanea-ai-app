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
    const {
      id: _id,
      created_at: _ca,
      updated_at: _ua,
      star_count: _sc,
      fork_count: _fc,
      character_count: _cc,
      creation_count: _crc,
      marketplace_downloads: _md,
      ...inheritedFields
    } = source;

    const { data: forkedWorld, error: forkErr } = await supabase
      .from('worlds')
      .insert({
        ...inheritedFields,
        slug: forkSlug,
        name: `${source.name} (Fork)`,
        creator_id: user.id,
        forked_from_id: source.id,
        star_count: 0,
        fork_count: 0,
        character_count: 0,
        visibility: 'private',
      })
      .select()
      .single();

    if (forkErr || !forkedWorld) throw new Error(forkErr?.message ?? 'Fork insert failed');

    const forkedId = forkedWorld.id;

    // Copy characters, factions, locations in parallel
    const [chars, factions, locations] = await Promise.all([
      supabase.from('world_characters').select('*').eq('world_id', source.id),
      supabase.from('world_factions').select('*').eq('world_id', source.id),
      supabase.from('world_locations').select('*').eq('world_id', source.id),
    ]);

    type OmitMeta<T> = Omit<T, 'id' | 'world_id' | 'created_at' | 'updated_at'>;

    function copyRows<T extends { id: string; world_id: string; created_at: string | null; updated_at?: string | null }>(
      rows: T[] | null,
    ): (OmitMeta<T> & { world_id: string })[] {
      return (rows ?? []).map(({ id: _rid, world_id: _wid, created_at: _rca, updated_at: _rua, ...rest }) => ({
        ...(rest as OmitMeta<T>),
        world_id: forkedId,
      }));
    }

    await Promise.all([
      chars.data?.length ? supabase.from('world_characters').insert(copyRows(chars.data)) : null,
      factions.data?.length ? supabase.from('world_factions').insert(copyRows(factions.data)) : null,
      locations.data?.length ? supabase.from('world_locations').insert(copyRows(locations.data)) : null,
    ]);

    // Record the fork relationship
    await supabase.from('world_forks').insert({
      parent_world_id: source.id,
      forked_world_id: forkedId,
      forked_by: user.id,
    });

    // Increment parent fork_count
    await supabase
      .from('worlds')
      .update({ fork_count: (source.fork_count ?? 0) + 1 })
      .eq('id', source.id);

    return successResponse({ world: forkedWorld, fork_slug: forkSlug }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
