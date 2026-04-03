/**
 * World Graph Service
 *
 * Unified service connecting Supabase, MCP world-intelligence,
 * AgentDB memory, and the Arcanea Intelligence Gateway (Gemini).
 */

import { createClient } from '@/lib/supabase/server';
import { storeMemory, searchMemories } from '@/lib/agentdb/store';
import type {
  World, WorldWithGraph, WorldCharacter, GenerateWorldInput,
  GeneratedWorld, GenerateCharacterInput, WorldAnalysis, ConflictSeed,
  CharacterAgentConfig, CharacterMemoryEntry, ListWorldsOptions, PaginatedResult,
} from './types';

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

async function requireAuth() {
  const sb = await createClient();
  const { data } = await sb.auth.getUser();
  if (!data?.user?.id) throw new Error('Authentication required');
  return data.user.id;
}

async function getAI() {
  const { generateObject } = await import('ai');
  const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
  const { z } = await import('zod');
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No AI API key configured');
  const google = createGoogleGenerativeAI({ apiKey });
  return { generateObject, model: google('gemini-2.0-flash'), z };
}

const ALL_ELEMENTS = ['Fire', 'Water', 'Earth', 'Wind', 'Void', 'Spirit'];

// ── Zod schema fragments (reused across generation methods) ──────

function characterSchema(z: typeof import('zod').z) {
  return z.object({
    name: z.string(), primary_element: z.string().nullable(),
    gates_open: z.number().min(0).max(10), rank: z.string().nullable(),
    house: z.string().nullable(), archetype: z.string().nullable(),
    backstory: z.string().nullable(), traits: z.array(z.string()),
    abilities: z.array(z.string()), patron_guardian: z.string().nullable(),
    metadata: z.record(z.unknown()).nullable(),
  });
}

function locationSchema(z: typeof import('zod').z) {
  return z.object({
    name: z.string(), location_type: z.string().nullable(),
    dominant_element: z.string().nullable(),
    alignment: z.enum(['light', 'dark', 'balanced']),
    description: z.string().nullable(), features: z.array(z.string()),
    metadata: z.record(z.unknown()).nullable(),
  });
}

export const WorldService = {
  // ── Core CRUD ─────────────────────────────────────────────────

  async getWorld(slug: string): Promise<WorldWithGraph | null> {
    const sb = await createClient();
    const { data: world, error } = await sb.from('worlds').select('*').eq('slug', slug).single();
    if (error || !world) return null;
    const id = world.id;
    const [chars, factions, locs, events, creations] = await Promise.all([
      sb.from('world_characters').select('*').eq('world_id', id).order('created_at'),
      sb.from('world_factions').select('*').eq('world_id', id).order('created_at'),
      sb.from('world_locations').select('*').eq('world_id', id).order('created_at'),
      sb.from('world_events').select('*').eq('world_id', id).order('sequence_order'),
      sb.from('world_creations').select('*').eq('world_id', id).order('created_at'),
    ]);
    return {
      ...world, characters: chars.data ?? [], factions: factions.data ?? [],
      locations: locs.data ?? [], events: events.data ?? [], creations: creations.data ?? [],
    } as WorldWithGraph;
  },

  async createWorld(data: {
    name: string; tagline?: string; description?: string;
    elements?: string[]; tone?: string; is_public?: boolean;
    is_template?: boolean; metadata?: Record<string, unknown>;
  }): Promise<World> {
    const userId = await requireAuth();
    const sb = await createClient();
    const { data: world, error } = await sb.from('worlds').insert({
      slug: slugify(data.name), name: data.name, tagline: data.tagline ?? null,
      description: data.description ?? null, elements: data.elements ?? [],
      tone: data.tone ?? null, is_public: data.is_public ?? false,
      is_template: data.is_template ?? false, star_count: 0, owner_id: userId,
      metadata: data.metadata ?? null,
    }).select().single();
    if (error) throw new Error(`Failed to create world: ${error.message}`);
    return world as World;
  },

  async updateWorld(slug: string, data: Partial<Pick<World, 'name' | 'tagline' | 'description' | 'elements' | 'tone' | 'is_public' | 'cover_image_url' | 'metadata'>>): Promise<World> {
    const userId = await requireAuth();
    const sb = await createClient();
    const updates: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
    if (data.name) updates.slug = slugify(data.name);
    const { data: world, error } = await sb.from('worlds').update(updates).eq('slug', slug).eq('owner_id', userId).select().single();
    if (error) throw new Error(`Failed to update world: ${error.message}`);
    return world as World;
  },

  async listPublicWorlds(opts: ListWorldsOptions = {}): Promise<PaginatedResult<World>> {
    const { page = 1, limit = 20, search, element, sortBy = 'created_at', sortOrder = 'desc' } = opts;
    const sb = await createClient();
    const offset = (page - 1) * limit;
    let q = sb.from('worlds').select('*', { count: 'exact' }).eq('is_public', true)
      .order(sortBy, { ascending: sortOrder === 'asc' }).range(offset, offset + limit - 1);
    if (search) q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%,tagline.ilike.%${search}%`);
    if (element) q = q.contains('elements', [element]);
    const { data, count, error } = await q;
    if (error) throw new Error(`Failed to list worlds: ${error.message}`);
    const total = count ?? 0;
    return { data: (data ?? []) as World[], total, page, limit, hasMore: offset + limit < total };
  },

  async forkWorld(slug: string): Promise<World> {
    const userId = await requireAuth();
    const source = await WorldService.getWorld(slug);
    if (!source) throw new Error('World not found');
    if (!source.is_public && source.owner_id !== userId) throw new Error('Cannot fork a private world');
    const sb = await createClient();
    const forkedSlug = slugify(source.name + ' fork') + '-' + Date.now().toString(36);
    const { data: newWorld, error } = await sb.from('worlds').insert({
      slug: forkedSlug, name: `${source.name} (fork)`, tagline: source.tagline,
      description: source.description, elements: source.elements, tone: source.tone,
      is_public: false, is_template: false, forked_from: source.id,
      star_count: 0, owner_id: userId, metadata: source.metadata,
    }).select().single();
    if (error) throw new Error(`Failed to fork world: ${error.message}`);
    const wid = (newWorld as World).id;
    const strip = <T extends Record<string, unknown>>(items: T[]) =>
      items.map(({ id: _id, created_at: _c, updated_at: _u, ...rest }) => ({ ...rest, world_id: wid }));
    await Promise.all([
      source.characters.length ? sb.from('world_characters').insert(strip(source.characters as unknown as Record<string, unknown>[])) : null,
      source.factions.length ? sb.from('world_factions').insert(strip(source.factions as unknown as Record<string, unknown>[])) : null,
      source.locations.length ? sb.from('world_locations').insert(strip(source.locations as unknown as Record<string, unknown>[])) : null,
      source.events.length ? sb.from('world_events').insert(strip(source.events as unknown as Record<string, unknown>[])) : null,
      source.creations.length ? sb.from('world_creations').insert(strip(source.creations as unknown as Record<string, unknown>[])) : null,
    ].filter(Boolean));
    return newWorld as World;
  },

  async starWorld(slug: string): Promise<{ starred: boolean; starCount: number }> {
    const userId = await requireAuth();
    const sb = await createClient();
    const { data: world } = await sb.from('worlds').select('id, star_count').eq('slug', slug).single();
    if (!world) throw new Error('World not found');
    const { data: existing } = await sb.from('world_stars').select('id').eq('world_id', world.id).eq('user_id', userId).maybeSingle();
    if (existing) {
      await sb.from('world_stars').delete().eq('id', existing.id);
      await sb.from('worlds').update({ star_count: Math.max(0, world.star_count - 1) }).eq('id', world.id);
      return { starred: false, starCount: Math.max(0, world.star_count - 1) };
    }
    await sb.from('world_stars').insert({ world_id: world.id, user_id: userId });
    await sb.from('worlds').update({ star_count: world.star_count + 1 }).eq('id', world.id);
    return { starred: true, starCount: world.star_count + 1 };
  },

  // ── AI Generation ─────────────────────────────────────────────

  async generateWorldFromPrompt(input: GenerateWorldInput): Promise<GeneratedWorld> {
    const { generateObject, model, z } = await getAI();
    const schema = z.object({
      name: z.string(), tagline: z.string(), description: z.string(),
      elements: z.array(z.string()), tone: z.string(),
      characters: z.array(characterSchema(z)).min(2).max(3),
      locations: z.array(locationSchema(z)).min(2).max(3),
      firstEvent: z.object({ title: z.string(), description: z.string(), event_type: z.string() }),
    });
    const { object } = await generateObject({
      model, schema, temperature: 0.8,
      prompt: `You are the Arcanea World Forge. Generate a complete fantasy world from: "${input.description}"
${input.tone ? `Tone: ${input.tone}` : ''}${input.elements?.length ? `\nElements: ${input.elements.join(', ')}` : ''}

Arcanea uses: Five Elements (Fire, Water, Earth, Wind, Void/Spirit), Ten Gates (1-10), Ranks (Apprentice 0-2, Mage 3-4, Master 5-6, Archmage 7-8, Luminor 9-10), Seven Houses (Lumina, Nero, Pyros, Aqualis, Terra, Ventus, Synthesis), Ten Guardians (Lyssandria, Leyla, Draconia, Maylinn, Alera, Lyria, Aiyami, Elara, Ino, Shinkami).

Create 2-3 varied-power characters, 2-3 locations, and one inciting event. Make names evocative, backstories specific, ensure opposing motivations.`,
    });
    return object;
  },

  async generateCharacter(input: GenerateCharacterInput): Promise<Omit<WorldCharacter, 'id' | 'world_id' | 'created_at' | 'updated_at'>> {
    const world = await WorldService.getWorld(input.worldSlug);
    if (!world) throw new Error('World not found');
    const { generateObject, model, z } = await getAI();
    const names = world.characters.map((c) => c.name).join(', ');
    const elems = world.characters.map((c) => c.primary_element).filter(Boolean).join(', ');
    const { object } = await generateObject({
      model, schema: characterSchema(z), temperature: 0.8,
      prompt: `Generate a character for "${world.name}": ${world.description}
Request: "${input.prompt}" ${input.element ? `Element: ${input.element}` : ''} ${input.archetype ? `Archetype: ${input.archetype}` : ''}
Existing: ${names || 'None'} | Elements in use: ${elems || 'None'} | World elements: ${world.elements.join(', ')} | Tone: ${world.tone || 'epic fantasy'}
Complement the existing cast. Avoid duplicate elements/power levels. Give specific motivations tied to this world.`,
    });
    return object;
  },

  async analyzeWorld(worldSlug: string): Promise<WorldAnalysis> {
    const world = await WorldService.getWorld(worldSlug);
    if (!world) throw new Error('World not found');
    const chars = world.characters;
    const locs = world.locations;
    const elemCounts: Record<string, number> = {};
    ALL_ELEMENTS.forEach((e) => (elemCounts[e] = 0));
    chars.forEach((c) => { if (c.primary_element && elemCounts[c.primary_element] !== undefined) elemCounts[c.primary_element]++; });
    const missing = ALL_ELEMENTS.filter((e) => elemCounts[e] === 0);

    const gaps: WorldAnalysis['gaps'] = [];
    const strengths: string[] = [];
    if (!chars.length) gaps.push({ type: 'missing_role', severity: 'critical', description: 'No characters.', suggestion: 'Create a founding character.' });
    if (chars.length > 0 && !locs.length) gaps.push({ type: 'missing_location', severity: 'critical', description: 'No locations.', suggestion: 'Create the central hub.' });
    if (missing.length > 0 && chars.length >= 3) gaps.push({ type: 'missing_element', severity: missing.length >= 3 ? 'important' : 'nice_to_have', description: `Missing: ${missing.join(', ')}.`, suggestion: `Create a ${missing[0]} character or location.` });
    if (chars.length >= 3) {
      const avg = chars.reduce((s, c) => s + c.gates_open, 0) / chars.length;
      if (avg > 7) gaps.push({ type: 'power_imbalance', severity: 'important', description: `Avg power ${avg.toFixed(1)}/10 — too high.`, suggestion: 'Create an Apprentice (1-2 gates).' });
    }
    if (!world.creations.length && chars.length >= 3) gaps.push({ type: 'narrative_gap', severity: 'nice_to_have', description: 'No artifacts.', suggestion: 'Create a legendary artifact.' });

    if (chars.length >= 3) strengths.push(`${chars.length} characters`);
    if (locs.length >= 2) strengths.push(`${locs.length} locations`);
    if (world.factions.length >= 2) strengths.push(`${world.factions.length} factions`);
    if (world.events.length >= 1) strengths.push(`${world.events.length} events`);
    if (!missing.length && chars.length >= 5) strengths.push('Elemental balance');
    if (!strengths.length) strengths.push('Every world starts somewhere.');

    let health = 100;
    gaps.forEach((g) => { health -= g.severity === 'critical' ? 25 : g.severity === 'important' ? 10 : 5; });
    health = Math.max(0, Math.min(100, health));
    const grade = health >= 90 ? 'S' : health >= 80 ? 'A' : health >= 70 ? 'B' : health >= 55 ? 'C' : health >= 35 ? 'D' : 'F';

    const hasHero = chars.some((c) => ['hero', 'protagonist'].some((k) => (c.archetype || '').toLowerCase().includes(k)));
    const hasVillain = chars.some((c) => ['villain', 'antagonist'].some((k) => (c.archetype || '').toLowerCase().includes(k)));
    const narrativePotential = hasHero && hasVillain ? 'Story-ready.' : chars.length >= 3 ? 'Almost ready — add an antagonist.' : 'Not yet story-ready.';

    return { health, grade, strengths, gaps, nextActions: gaps.slice(0, 5).map((g, i) => ({ priority: i + 1, action: g.suggestion })), narrativePotential };
  },

  async generateConflict(worldSlug: string): Promise<ConflictSeed | null> {
    const world = await WorldService.getWorld(worldSlug);
    if (!world || world.characters.length < 2) return null;
    const { generateObject, model, z } = await getAI();
    const charSum = world.characters.map((c) => `${c.name} (${c.primary_element}, ${c.rank})`).join('; ');
    const factionSum = world.factions.map((f) => `${f.name} (${f.alignment})`).join('; ');
    const schema = z.object({
      title: z.string(), type: z.string(), aggressors: z.array(z.string()),
      defenders: z.array(z.string()), stakes: z.string(), rootCause: z.string(),
      escalation: z.array(z.string()), possibleResolutions: z.array(z.string()),
      moralComplexity: z.string(),
    });
    const { object } = await generateObject({
      model, schema, temperature: 0.8,
      prompt: `Generate a morally complex conflict for: ${world.name} — ${world.description}
Characters: ${charSum} | Factions: ${factionSum || 'None'} | Tone: ${world.tone || 'epic'}
Use existing character names. Both sides must have legitimate grievances. 4-6 escalation stages. 3-4 resolutions (none obviously right). Specific to THIS world.`,
    });
    return object;
  },

  // ── Agent Memory Bridge ───────────────────────────────────────

  async getCharacterAgent(characterId: string): Promise<CharacterAgentConfig | null> {
    const sb = await createClient();
    const { data: char } = await sb.from('world_characters')
      .select('*, worlds!inner(slug, name, description, tone, elements)')
      .eq('id', characterId).single();
    if (!char) return null;
    const w = (char as Record<string, unknown>).worlds as { slug: string; name: string; description: string; tone: string };
    const agentId = `world-char-${characterId}`;
    const systemPrompt = `You are ${char.name}, a ${char.rank || 'mysterious figure'} in ${w.name}.\n${w.description || ''}\nElement: ${char.primary_element || 'Unknown'} | Traits: ${(char.traits as string[])?.join(', ') || 'enigmatic'}\nBackstory: ${char.backstory || 'Shrouded in mystery.'}\nStay in character. Respond as ${char.name} would.`;
    return { agentId, characterName: char.name, worldSlug: w.slug, systemPrompt };
  },

  async getCharacterMemory(characterId: string, userId: string, limit = 50): Promise<CharacterMemoryEntry[]> {
    const results = await searchMemories(`world-char-${characterId}`, userId, `conversation-${userId}`, limit);
    return results.sort((a, b) => a.record.key.localeCompare(b.record.key)).map((r) => {
      try { return JSON.parse(r.record.value) as CharacterMemoryEntry; }
      catch { return { role: 'assistant' as const, content: r.record.value, timestamp: r.record.created_at }; }
    });
  },

  async saveCharacterMemory(characterId: string, userId: string, entry: CharacterMemoryEntry): Promise<void> {
    await storeMemory(
      `world-char-${characterId}`,
      `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      JSON.stringify(entry), `conversation-${userId}`, [entry.role, 'world-chat'], null,
    );
  },
};
