/**
 * Luminor Service — CRUD operations for the `luminors` Supabase table.
 *
 * Server-side only. Uses cookie-based auth via @/lib/supabase/server.
 * All mutations respect RLS (user must own the luminor to update/delete).
 */

import { createClient } from '@/lib/supabase/server';
import type { LuminorSpec } from './luminor-spec';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Row shape returned by Supabase (snake_case DB columns) */
export interface LuminorRow {
  id: string;
  name: string;
  title: string;
  tagline: string;
  slug: string;
  origin: string;
  creator_id: string | null;
  domain: string;
  voice: string;
  personality: string[];
  element: string;
  wisdom: string | null;
  system_prompt: string;
  preferred_model: string | null;
  temperature: number | null;
  knowledge: string[];
  starters: string[];
  tools: string[];
  tags: string[];
  gate_alignment: number[];
  avatar: string;
  color: string;
  gradient: string;
  companion_id: string | null;
  published: boolean;
  tier: string;
  usage_count: number;
  rating: number;
  rating_count: number;
  export_formats: string[];
  created_at: string;
  updated_at: string;
}

/** Options for browsing published luminors */
export interface BrowseOptions {
  domain?: string;
  element?: string;
  limit?: number;
  offset?: number;
}

// ---------------------------------------------------------------------------
// Mapping: LuminorSpec (camelCase) <-> DB row (snake_case)
// ---------------------------------------------------------------------------

function specToRow(spec: LuminorSpec, userId: string): Record<string, unknown> {
  return {
    id: spec.id,
    name: spec.name,
    title: spec.title,
    tagline: spec.tagline,
    slug: spec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    origin: spec.origin,
    creator_id: userId,
    domain: spec.domain,
    voice: spec.voice,
    personality: spec.personality,
    element: spec.element,
    wisdom: spec.wisdom ?? null,
    system_prompt: spec.systemPrompt,
    preferred_model: spec.preferredModel ?? null,
    temperature: spec.temperature ?? null,
    knowledge: spec.knowledge ?? [],
    starters: spec.starters ?? [],
    tools: spec.tools ?? [],
    tags: spec.tags ?? [],
    gate_alignment: spec.gateAlignment ?? [],
    avatar: spec.avatar,
    color: spec.color,
    gradient: spec.gradient,
    companion_id: spec.companionId,
    published: spec.published ?? false,
    tier: spec.tier ?? 'free',
    usage_count: spec.usageCount ?? 0,
    rating: spec.rating ?? 0,
    rating_count: 0,
    export_formats: spec.exportFormats ?? ['arcanea'],
  };
}

export function rowToSpec(row: LuminorRow): LuminorSpec {
  return {
    id: row.id,
    version: 2,
    name: row.name,
    title: row.title,
    tagline: row.tagline,
    origin: row.origin as LuminorSpec['origin'],
    domain: row.domain as LuminorSpec['domain'],
    voice: row.voice as LuminorSpec['voice'],
    personality: row.personality,
    element: row.element as LuminorSpec['element'],
    wisdom: (row.wisdom as LuminorSpec['wisdom']) ?? undefined,
    systemPrompt: row.system_prompt,
    preferredModel: row.preferred_model ?? undefined,
    temperature: row.temperature ?? undefined,
    knowledge: row.knowledge,
    starters: row.starters,
    tools: row.tools,
    tags: row.tags,
    gateAlignment: row.gate_alignment,
    avatar: row.avatar,
    color: row.color,
    gradient: row.gradient,
    creatorId: row.creator_id,
    companionId: row.companion_id,
    published: row.published,
    tier: row.tier as LuminorSpec['tier'],
    usageCount: row.usage_count,
    rating: row.rating,
    exportFormats: row.export_formats as LuminorSpec['exportFormats'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Service Functions
// ---------------------------------------------------------------------------

/**
 * Save (insert or upsert) a Luminor.
 * If a row with the same `id` exists and belongs to the user, it is updated.
 */
export async function saveLuminor(spec: LuminorSpec, userId: string): Promise<LuminorRow> {
  const supabase = await createClient();
  const row = specToRow(spec, userId);

  const { data, error } = await supabase
    .from('luminors')
    .upsert(row as never, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save luminor: ${error.message}`);
  }

  return data as LuminorRow;
}

/**
 * Get a single Luminor by ID.
 */
export async function getLuminor(id: string): Promise<LuminorRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('luminors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get luminor: ${error.message}`);
  }

  return data as LuminorRow;
}

/**
 * Get a Luminor by its URL slug.
 */
export async function getLuminorBySlug(slug: string): Promise<LuminorRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('luminors')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`Failed to get luminor by slug: ${error.message}`);
  }

  return data as LuminorRow;
}

/**
 * Get all Luminors created by a specific user.
 */
export async function getMyLuminors(userId: string): Promise<LuminorRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('luminors')
    .select('*')
    .eq('creator_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get user luminors: ${error.message}`);
  }

  return (data ?? []) as LuminorRow[];
}

/**
 * Browse published Luminors (marketplace).
 * Supports optional filtering by domain and element.
 */
export async function getPublishedLuminors(options: BrowseOptions = {}): Promise<LuminorRow[]> {
  const { domain, element, limit = 24, offset = 0 } = options;
  const supabase = await createClient();

  let query = supabase
    .from('luminors')
    .select('*')
    .eq('published', true)
    .order('usage_count', { ascending: false })
    .range(offset, offset + limit - 1);

  if (domain) {
    query = query.eq('domain', domain);
  }
  if (element) {
    query = query.eq('element', element);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to browse luminors: ${error.message}`);
  }

  return (data ?? []) as LuminorRow[];
}

/**
 * Increment the usage counter for a Luminor (called when "Use in Chat" is activated).
 */
export async function incrementUsage(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment_luminor_usage', { p_luminor_id: id });

  // Fallback: if RPC doesn't exist, do a manual increment
  if (error) {
    const { data: current } = await supabase
      .from('luminors')
      .select('usage_count')
      .eq('id', id)
      .single();

    if (current) {
      await supabase
        .from('luminors')
        .update({ usage_count: ((current as { usage_count: number }).usage_count ?? 0) + 1 })
        .eq('id', id);
    }
  }
}

/**
 * Delete a Luminor. Only succeeds if the caller owns it (RLS enforced).
 */
export async function deleteLuminor(id: string, userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('luminors')
    .delete()
    .eq('id', id)
    .eq('creator_id', userId);

  if (error) {
    throw new Error(`Failed to delete luminor: ${error.message}`);
  }
}
