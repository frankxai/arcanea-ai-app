/**
 * World Linking — When a Studio document is classified as a character,
 * location, or similar, and attached to a world, also populate the
 * corresponding world graph table so the world itself actually grows.
 *
 * This is what makes "drop a character sheet in Studio → appears in your
 * world" work end-to-end. Without it, the character lives in
 * `ingested_documents` but `/worlds/[slug]` doesn't see it.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export type LinkableClassification = 'character' | 'location' | 'magic';

export interface WorldLinkInput {
  worldId: string;
  userId: string;
  classification: string;
  title: string;
  markdownContent: string;
  tags?: string[];
  documentId: string;
}

export interface WorldLinkResult {
  linked: boolean;
  table?: string;
  nodeId?: string;
  skipped?: string;
  error?: string;
}

const CLASSIFICATION_TABLE: Record<LinkableClassification, string> = {
  character: 'world_characters',
  location: 'world_locations',
  magic: 'world_magic_systems', // may not exist yet — we handle gracefully
};

/**
 * Pull a one-sentence summary from the first meaningful line of markdown.
 */
function firstSentence(text: string, maxChars = 240): string {
  const cleaned = text.replace(/^#+\s+.*$/gm, '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  const sentence = cleaned.split(/(?<=[.!?])\s+/)[0] ?? cleaned;
  return sentence.slice(0, maxChars);
}

/**
 * Link a Studio document into the world graph when its classification
 * maps to a known node type. Idempotent on its own in the sense that
 * duplicate inserts will produce two rows — caller is responsible for
 * passing each document once.
 */
export async function linkToWorldGraph(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  input: WorldLinkInput,
): Promise<WorldLinkResult> {
  const classification = input.classification as LinkableClassification;
  const table = CLASSIFICATION_TABLE[classification];
  if (!table) {
    return { linked: false, skipped: `classification "${input.classification}" is not a world graph node` };
  }

  // Verify the world belongs to this user — cheap check that prevents
  // a client from hot-linking a worldId they don't own through RLS.
  // (RLS should block the insert anyway; this gives a clearer error.)
  try {
    const { data: world, error: worldErr } = await supabase
      .from('worlds')
      .select('id, user_id')
      .eq('id', input.worldId)
      .maybeSingle();

    if (worldErr || !world) {
      return { linked: false, error: 'World not found' };
    }
    if (world.user_id && world.user_id !== input.userId) {
      return { linked: false, error: 'World not owned by current user' };
    }
  } catch (e) {
    return { linked: false, error: e instanceof Error ? e.message : 'world lookup failed' };
  }

  const summary = firstSentence(input.markdownContent);

  // Build the insert payload per table
  let payload: Record<string, unknown> = {
    world_id: input.worldId,
    name: input.title.slice(0, 120),
  };

  if (classification === 'character') {
    // Extract element hint from tags if present
    const elementTag = (input.tags ?? []).find((t) =>
      ['fire', 'water', 'earth', 'wind', 'void', 'spirit', 'light'].includes(t.toLowerCase()),
    );
    payload = {
      ...payload,
      title: null,
      personality: {},
      backstory: summary,
      element: elementTag ?? null,
      origin_class: null,
      // Cross-reference back to the source document
      source_document_id: input.documentId,
    };
  } else if (classification === 'location') {
    payload = {
      ...payload,
      region: null,
      description: summary,
      significance: null,
      source_document_id: input.documentId,
    };
  } else if (classification === 'magic') {
    payload = {
      ...payload,
      description: summary,
      source_document_id: input.documentId,
    };
  }

  try {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      // Table may not exist (42P01) or column (42703) — don't hard-fail
      if (error.code === '42P01' || error.code === '42703') {
        return {
          linked: false,
          skipped: `Table ${table} not ready (${error.code}). Doc stored; add ${table} schema to link.`,
        };
      }
      return { linked: false, error: error.message };
    }

    return {
      linked: true,
      table,
      nodeId: data?.id as string | undefined,
    };
  } catch (e) {
    return { linked: false, error: e instanceof Error ? e.message : 'insert failed' };
  }
}
