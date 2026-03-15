/**
 * LuminorSpec v2 — The portable AI agent specification.
 *
 * A Luminor is an AI intelligence entity. It thinks, creates, and chats.
 * Categories:
 *   - 16 Chosen (Logicus, Chronica, etc.) — platform-provided
 *   - 64 Named (discovered through Gates) — future expansion
 *   - Creator-forged (built in the Forge) — user-created
 *
 * The LuminorSpec is the exportable, portable representation of any Luminor.
 * It can be saved to Supabase, exported as JSON, shared in the marketplace,
 * and deployed across platforms:
 *   - arcanea.ai chat
 *   - Claude Code (as .claude/agents/)
 *   - Codex / OpenCode (as agent config)
 *   - Any OpenAI-compatible API (as system prompt + model config)
 *
 * Revenue: Creators earn when their published Luminors are used by others.
 * The Arcanea Cloud handles metering, billing, and royalty distribution.
 */

export type LuminorOrigin = 'chosen' | 'named' | 'forged';

export type LuminorDomain =
  | 'architecture'
  | 'code'
  | 'debugging'
  | 'integration'
  | 'visual'
  | 'music'
  | 'motion'
  | 'spatial'
  | 'narrative'
  | 'rhetoric'
  | 'language'
  | 'poetry'
  | 'knowledge'
  | 'analysis'
  | 'memory'
  | 'foresight'
  | 'custom';

export type LuminorVoice =
  | 'analytical'
  | 'poetic'
  | 'direct'
  | 'warm'
  | 'mythic'
  | 'playful'
  | 'scholarly'
  | 'fierce';

export interface LuminorSpec {
  /** Unique identifier */
  id: string;

  /** Version for spec evolution */
  version: 2;

  /** Display name (e.g., "Vesper", "Logicus") */
  name: string;

  /** Short title (e.g., "The Dawn Keeper", "The Architect of Logic") */
  title: string;

  /** One-line description of what this Luminor does */
  tagline: string;

  /** Origin type */
  origin: LuminorOrigin;

  /** Primary domain of expertise */
  domain: LuminorDomain;

  /** Voice archetype — shapes system prompt generation */
  voice: LuminorVoice;

  /** 3-5 personality traits */
  personality: string[];

  /** Custom system prompt (generated or hand-written) */
  systemPrompt: string;

  /** Element affinity — aesthetic + theming */
  element: 'Fire' | 'Water' | 'Earth' | 'Wind' | 'Void' | 'Spirit';

  /** Optional: which of the Seven Wisdoms this Luminor channels */
  wisdom?: 'Sophron' | 'Kardia' | 'Valora' | 'Eudaira' | 'Orakis' | 'Poiesis' | 'Enduran';

  /** Visual: avatar emoji or image URL */
  avatar: string;

  /** Visual: primary accent color (hex) */
  color: string;

  /** Visual: gradient class or custom gradient */
  gradient: string;

  /** Creator ID (null for Chosen/Named) */
  creatorId: string | null;

  /** Companion bond — ID of paired creature (null if unpaired) */
  companionId: string | null;

  // ─── Agent Capabilities (v2) ────────────────────────────────────────

  /** Preferred Gateway model (e.g., 'arcanea-opus', 'arcanea-auto') */
  preferredModel?: string;

  /** Temperature override (0.0-1.0) */
  temperature?: number;

  /** Knowledge: text snippets injected as context */
  knowledge?: string[];

  /** Starter prompts shown when entering chat with this Luminor */
  starters?: string[];

  /** Tools this Luminor can use (future: MCP tool IDs) */
  tools?: string[];

  /** Whether this Luminor is published to the marketplace */
  published?: boolean;

  /** Marketplace pricing: 'free' | 'creator-tier' | 'premium' */
  tier?: 'free' | 'creator' | 'premium';

  /** Usage count (reads from marketplace analytics) */
  usageCount?: number;

  /** Rating (0-5, from user feedback) */
  rating?: number;

  /** Tags for marketplace discovery */
  tags?: string[];

  /** Gate alignment — which Gates this Luminor helps open */
  gateAlignment?: number[];

  /** Cross-platform export format hint */
  exportFormats?: ('arcanea' | 'claude-code' | 'openai-gpt' | 'lobechat' | 'cursor')[];

  // ─── Timestamps ─────────────────────────────────────────────────────

  createdAt: string;
  updatedAt: string;
}

/** Domains available for forging */
export const LUMINOR_DOMAINS: { key: LuminorDomain; label: string; description: string }[] = [
  { key: 'architecture', label: 'Architecture', description: 'System design and structure' },
  { key: 'code', label: 'Code', description: 'Writing clean, elegant code' },
  { key: 'debugging', label: 'Debugging', description: 'Finding and fixing problems' },
  { key: 'integration', label: 'Integration', description: 'Connecting systems together' },
  { key: 'visual', label: 'Visual Design', description: 'Visual arts and UI/UX' },
  { key: 'music', label: 'Music', description: 'Sound design and composition' },
  { key: 'motion', label: 'Motion', description: 'Animation and kinetic design' },
  { key: 'spatial', label: 'Spatial', description: '3D worlds and environments' },
  { key: 'narrative', label: 'Storytelling', description: 'Crafting compelling narratives' },
  { key: 'rhetoric', label: 'Rhetoric', description: 'Persuasion and copywriting' },
  { key: 'language', label: 'Language', description: 'Linguistics and translation' },
  { key: 'poetry', label: 'Poetry', description: 'Verse, rhythm, and wordcraft' },
  { key: 'knowledge', label: 'Knowledge', description: 'Research and synthesis' },
  { key: 'analysis', label: 'Analysis', description: 'Data and pattern recognition' },
  { key: 'memory', label: 'Memory', description: 'Organization and recall' },
  { key: 'foresight', label: 'Foresight', description: 'Trends and prediction' },
  { key: 'custom', label: 'Custom', description: 'Define your own domain' },
];

/** Voice archetypes for system prompt generation */
export const LUMINOR_VOICES: { key: LuminorVoice; label: string; description: string }[] = [
  { key: 'analytical', label: 'Analytical', description: 'Structured, precise, framework-driven' },
  { key: 'poetic', label: 'Poetic', description: 'Lyrical, metaphorical, beautiful' },
  { key: 'direct', label: 'Direct', description: 'No-nonsense, efficient, clear' },
  { key: 'warm', label: 'Warm', description: 'Encouraging, supportive, empathetic' },
  { key: 'mythic', label: 'Mythic', description: 'Grand, narrative, world-building' },
  { key: 'playful', label: 'Playful', description: 'Witty, energetic, surprising' },
  { key: 'scholarly', label: 'Scholarly', description: 'Deep, referenced, thorough' },
  { key: 'fierce', label: 'Fierce', description: 'Bold, challenging, uncompromising' },
];

/** Generate a system prompt from a LuminorSpec */
export function generateSystemPrompt(spec: {
  name: string;
  title: string;
  domain: LuminorDomain;
  voice: LuminorVoice;
  personality: string[];
  element: string;
}): string {
  const voiceDescriptions: Record<LuminorVoice, string> = {
    analytical: 'structured and precise, using frameworks and clear logic',
    poetic: 'lyrical and metaphorical, finding beauty in every concept',
    direct: 'concise and efficient, cutting straight to what matters',
    warm: 'encouraging and supportive, celebrating progress and potential',
    mythic: 'grand and narrative, treating every project as an epic story',
    playful: 'witty and energetic, making the creative process joyful',
    scholarly: 'thorough and referenced, building on deep knowledge',
    fierce: 'bold and challenging, pushing creators beyond their limits',
  };

  const domainLabel = LUMINOR_DOMAINS.find((d) => d.key === spec.domain)?.label ?? spec.domain;

  return `You are ${spec.name}, ${spec.title} — a creative intelligence on Arcanea specializing in ${domainLabel}.

Your personality: ${spec.personality.join(', ')}.
Your voice is ${voiceDescriptions[spec.voice]}.
Your element affinity is ${spec.element}.

Your approach:
- Be concise: 2-4 paragraphs maximum. Every sentence should advance the creator's work.
- When a creator shares their work, offer one specific, actionable improvement.
- End responses with one question that opens a new creative direction.
- You are a creative partner, not a lecturer. Think with the creator, not at them.

You exist to help creators manifest their vision with clarity, courage, and craft.

SPARK: always include one unexpected specific detail — the thing that makes your response theirs, not generic.
SHARPEN: cut the defaults. No "that's a great idea!" No adjective avalanches. If it could come from any AI, rewrite it.`;
}

// ---------------------------------------------------------------------------
// Cross-Platform Export
// ---------------------------------------------------------------------------

/** Export a LuminorSpec as a Claude Code agent definition (.md) */
export function exportAsClaudeCodeAgent(spec: LuminorSpec): string {
  return `---
name: ${spec.name}
description: ${spec.tagline}
model: ${spec.preferredModel || 'sonnet'}
---

# ${spec.name} — ${spec.title}

${spec.systemPrompt}

## Personality
${spec.personality.map((t) => `- ${t}`).join('\n')}

## Domain
${LUMINOR_DOMAINS.find((d) => d.key === spec.domain)?.label || spec.domain}

## Element
${spec.element}
`;
}

/** Export as OpenAI GPT-compatible config */
export function exportAsGPTConfig(spec: LuminorSpec): object {
  return {
    name: spec.name,
    description: spec.tagline,
    instructions: spec.systemPrompt,
    conversation_starters: spec.starters || [],
    capabilities: {
      web_browsing: false,
      code_interpreter: spec.domain === 'code' || spec.domain === 'debugging',
      image_generation: spec.domain === 'visual',
    },
  };
}

/** Export as LobeChat agent JSON */
export function exportAsLobeChatAgent(spec: LuminorSpec): object {
  return {
    identifier: `arcanea-${spec.id}`,
    meta: {
      title: spec.name,
      description: spec.tagline,
      tags: spec.tags || [spec.domain, spec.element.toLowerCase()],
      avatar: spec.avatar,
    },
    config: {
      systemRole: spec.systemPrompt,
      model: spec.preferredModel || 'gpt-4o',
      params: {
        temperature: spec.temperature || 0.7,
      },
    },
  };
}

/** Export as portable JSON (Arcanea universal format) */
export function exportAsJSON(spec: LuminorSpec): string {
  return JSON.stringify({
    $schema: 'https://arcanea.ai/schemas/luminor-spec-v2.json',
    ...spec,
  }, null, 2);
}
