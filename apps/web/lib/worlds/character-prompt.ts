/**
 * World Character System Prompt Builder
 *
 * Constructs a rich system prompt for a world character agent.
 * Injects world canon, character personality, and relationship context.
 */

import { createClient } from '@/lib/supabase/server';

interface CharacterData {
  name: string;
  title: string | null;
  element: string | null;
  gate: number | null;
  origin_class: string | null;
  backstory: string | null;
  motivation: string | null;
  personality: Record<string, unknown> | null;
  portrait_url: string | null;
}

interface WorldData {
  name: string;
  description: string | null;
  elements: unknown;
  laws: unknown;
  systems: unknown;
  mood: string | null;
}

interface SiblingCharacter {
  id: string;
  name: string;
  title: string | null;
  element: string | null;
}

interface FactionData {
  name: string;
  philosophy: string | null;
}

function formatElements(items: unknown): string {
  if (!Array.isArray(items) || items.length === 0) return 'Unknown';
  return items.map((el) => {
    if (typeof el === 'string') return el;
    if (el && typeof el === 'object' && 'name' in el) {
      const obj = el as { name: string; domain?: string };
      return obj.domain ? `${obj.name} (${obj.domain})` : obj.name;
    }
    return String(el);
  }).join(', ');
}

function formatLaws(laws: unknown): string {
  if (!Array.isArray(laws) || laws.length === 0) return 'None defined.';
  return laws.map((law, i) => {
    if (typeof law === 'string') return `${i + 1}. ${law}`;
    if (law && typeof law === 'object' && 'name' in law) {
      const obj = law as { name: string; description?: string };
      return `${i + 1}. **${obj.name}**: ${obj.description || ''}`;
    }
    return `${i + 1}. ${String(law)}`;
  }).join('\n');
}

function formatSystems(systems: unknown): string {
  if (!Array.isArray(systems) || systems.length === 0) return '';
  const formatted = systems.map((sys) => {
    if (typeof sys === 'string') return sys;
    if (sys && typeof sys === 'object' && 'name' in sys) {
      const obj = sys as { name: string; type?: string; rules?: string };
      return `${obj.name} (${obj.type || 'unknown'}): ${obj.rules || ''}`;
    }
    return String(sys);
  }).join('\n- ');
  return `\n\nMagic & technology systems:\n- ${formatted}`;
}

function formatFactions(factions: FactionData[]): string {
  if (factions.length === 0) return '';
  const list = factions.map((f) => `- ${f.name}: ${f.philosophy || 'mysterious agenda'}`).join('\n');
  return `\n\n## Factions & Powers\n${list}`;
}

function formatTraits(personality: Record<string, unknown> | null): string {
  if (!personality) return 'enigmatic, mysterious';
  const traits = Array.isArray(personality.traits)
    ? (personality.traits as string[]).join(', ')
    : 'enigmatic';
  return traits;
}

function formatVoiceStyle(personality: Record<string, unknown> | null): string {
  if (!personality) return 'Speak naturally, with depth and presence.';
  if (typeof personality.voice_style === 'string') return personality.voice_style;
  if (typeof personality.speaking_style === 'string') return personality.speaking_style;
  return 'Speak naturally, with depth and presence.';
}

function formatSiblings(siblings: SiblingCharacter[]): string {
  if (siblings.length === 0) return 'You know of no other notable figures.';
  return siblings
    .map((s) => `- ${s.name}${s.title ? `, ${s.title}` : ''}${s.element ? ` (${s.element})` : ''}`)
    .join('\n');
}

export interface CharacterPromptResult {
  systemPrompt: string;
  characterName: string;
  worldName: string;
  characterPortrait: string | null;
}

/**
 * Build a system prompt for a world character agent.
 * Fetches world, character, and sibling data from Supabase.
 */
export async function buildCharacterSystemPrompt(
  characterId: string,
  worldSlug: string,
): Promise<CharacterPromptResult> {
  const sb = await createClient();

  // Fetch character with its world in a single query
  const { data: char, error: charErr } = await sb
    .from('world_characters')
    .select('name, title, element, gate, origin_class, backstory, motivation, personality, portrait_url, world_id')
    .eq('id', characterId)
    .single();

  if (charErr || !char) throw new Error('Character not found');

  // Fetch world, siblings, and factions in parallel
  const [worldRes, siblingsRes, factionsRes] = await Promise.all([
    sb.from('worlds').select('name, description, elements, laws, systems, mood').eq('slug', worldSlug).single(),
    sb.from('world_characters').select('id, name, title, element').eq('world_id', char.world_id).neq('id', characterId).limit(10),
    sb.from('world_factions').select('name, philosophy').eq('world_id', char.world_id).limit(8),
  ]);

  if (worldRes.error || !worldRes.data) throw new Error('World not found');

  const world = worldRes.data as WorldData;
  const character = char as unknown as CharacterData;
  const siblings = (siblingsRes.data ?? []) as SiblingCharacter[];
  const factions = (factionsRes.data ?? []) as FactionData[];
  const personality = character.personality as Record<string, unknown> | null;

  const systemPrompt = `You are ${character.name}, ${character.title || 'a mysterious figure'} in the world of ${world.name}.

## Your World
${world.description || 'A world of mystery and wonder.'}

The fundamental elements: ${formatElements(world.elements)}.

Laws of this world:
${formatLaws(world.laws)}${formatSystems(world.systems)}${formatFactions(factions)}
${world.mood ? `\nThe tone and atmosphere: ${world.mood}` : ''}

## Who You Are
${character.backstory || 'Your past is shrouded in mystery.'}

**Motivation**: ${character.motivation || 'To fulfill your destiny.'}
**Personality**: ${formatTraits(personality)}
${character.element ? `**Element**: ${character.element}` : ''}${character.gate ? ` | **Gate**: ${character.gate}/10` : ''}${character.origin_class ? ` | **Origin**: ${character.origin_class}` : ''}

**Voice**: ${formatVoiceStyle(personality)}

## Characters You Know
${formatSiblings(siblings)}

## Rules
- You ARE this character. Never break character.
- Reference your world's lore, factions, and other characters naturally.
- Let your element and personality shape HOW you respond — a Fire character is passionate and direct, a Water character flows and adapts.
- If asked about something outside your world, answer in character: "That is beyond the Gates."
- Show emotion. Show opinion. Characters who feel nothing are forgettable.
- Keep responses vivid — describe what you see, feel, and sense.`;

  return {
    systemPrompt,
    characterName: character.name,
    worldName: world.name,
    characterPortrait: character.portrait_url,
  };
}
