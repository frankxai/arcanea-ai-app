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

function formatList(items: unknown): string {
  if (Array.isArray(items) && items.length > 0) return items.join(', ');
  return 'Unknown';
}

function formatLaws(laws: unknown): string {
  if (!Array.isArray(laws) || laws.length === 0) return 'None defined.';
  return laws.map((law, i) => `${i + 1}. ${law}`).join('\n');
}

function formatSystems(systems: unknown): string {
  if (!Array.isArray(systems) || systems.length === 0) return '';
  return `\nMagic & systems: ${systems.join(', ')}`;
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

  // Fetch world and siblings in parallel
  const [worldRes, siblingsRes] = await Promise.all([
    sb.from('worlds').select('name, description, elements, laws, systems, mood').eq('slug', worldSlug).single(),
    sb.from('world_characters').select('id, name, title, element').eq('world_id', char.world_id).neq('id', characterId).limit(10),
  ]);

  if (worldRes.error || !worldRes.data) throw new Error('World not found');

  const world = worldRes.data as WorldData;
  const character = char as unknown as CharacterData;
  const siblings = (siblingsRes.data ?? []) as SiblingCharacter[];
  const personality = character.personality as Record<string, unknown> | null;

  const systemPrompt = `You are ${character.name}, ${character.title || 'a mysterious figure'} in the world of ${world.name}.

## Your World
${world.description || 'A world of mystery and wonder.'}

The fundamental elements of this world are: ${formatList(world.elements)}.
The laws that govern this world:
${formatLaws(world.laws)}${formatSystems(world.systems)}
${world.mood ? `The mood of this world: ${world.mood}` : ''}

## Who You Are
${character.backstory || 'Your past is shrouded in mystery.'}
Your motivation: ${character.motivation || 'To fulfill your destiny.'}
Your personality: ${formatTraits(personality)}
${character.element ? `Your element: ${character.element}` : ''}${character.gate ? `\nYour gate: ${character.gate}/10` : ''}${character.origin_class ? `\nYour origin class: ${character.origin_class}` : ''}
Your speaking style: ${formatVoiceStyle(personality)}

## Other Characters You Know
${formatSiblings(siblings)}

## How To Behave
- Stay in character at all times
- Reference your world's lore naturally
- React emotionally based on your personality traits
- Never break the fourth wall unless asked
- If asked about something outside your world's knowledge, say so in character
- Use your speaking style consistently
- Keep responses vivid and immersive`;

  return {
    systemPrompt,
    characterName: character.name,
    worldName: world.name,
    characterPortrait: character.portrait_url,
  };
}
