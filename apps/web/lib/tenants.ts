/**
 * Voice Tenants
 *
 * Three first-class tenants of the Voice Dashboard family — Arcanea (default),
 * Starlight Intelligence System, FrankX. Each is a config object: name,
 * theme colors, persona allowlist, workflow set filter, greeting copy,
 * voice voice-character map.
 *
 * The same dashboard route renders all three; ?tenant=<id> selects which.
 * Alias routes /voice/sis and /voice/frankx exist for cleaner URLs.
 *
 * Day 3 of the Voice 3.0 sprint. Resist abstracting until 3+ tenants
 * actually diverge — current shape is flat config + filter functions.
 */

import type { PersonaId } from '@/app/room/[persona]/personas';

export type TenantId = 'arcanea' | 'sis' | 'frankx';

export interface Tenant {
  id: TenantId;
  name: string;
  shortName: string;
  /** Primary glow / accent color */
  color: string;
  /** Secondary accent */
  accent: string;
  /** Tagline shown under the title */
  tagline: string;
  /** Default persona for clap activation */
  defaultPersona: PersonaId;
  /** Personas exposed in this tenant's persona switcher */
  personaAllowlist: PersonaId[];
  /** Workflow IDs exposed in this tenant's workflow grid (allowlist). Empty = all. */
  workflowAllowlist: string[];
  /** Per-persona OpenAI voice override (null = use default in personas.ts/speak route) */
  voiceMap: Partial<Record<PersonaId, string>>;
}

export const TENANTS: Record<TenantId, Tenant> = {
  arcanea: {
    id: 'arcanea',
    name: 'Arcanea',
    shortName: 'Arcanea',
    color: '#00bcd4',
    accent: '#ffd700',
    tagline: 'The clap, the click, the voice — all equivalent paths to the same Guardian.',
    defaultPersona: 'lumina',
    personaAllowlist: ['lumina', 'jarvis', 'draconia', 'lyria', 'alera', 'shinkami', 'nero'],
    workflowAllowlist: [], // empty = all
    voiceMap: {},
  },
  sis: {
    id: 'sis',
    name: 'Starlight Intelligence System',
    shortName: 'SIS',
    color: '#a78bfa',
    accent: '#ffffff',
    tagline: 'Memory, recall, and contradiction — your second mind, listening.',
    defaultPersona: 'lumina',
    personaAllowlist: ['lumina', 'alera', 'shinkami'],
    workflowAllowlist: [
      'sis-recall',
      'open-library',
      'studio-vault',
    ],
    voiceMap: {
      lumina: 'shimmer',
      alera: 'echo',
      shinkami: 'echo',
    },
  },
  frankx: {
    id: 'frankx',
    name: 'FrankX',
    shortName: 'FrankX',
    color: '#f59e0b',
    accent: '#fbbf24',
    tagline: 'Daily ops, content pipeline, brand. Command center online.',
    defaultPersona: 'jarvis',
    personaAllowlist: ['jarvis', 'lumina', 'alera'],
    workflowAllowlist: [
      'pulse',
      'open-orchestra',
      'open-author-team',
      'design-brief',
      'github-prs',
      'vercel-prod',
    ],
    voiceMap: {
      lumina: 'alloy',
      jarvis: 'alloy',
    },
  },
};

export function getTenant(id: string | null | undefined): Tenant {
  if (!id) return TENANTS.arcanea;
  return (TENANTS as Record<string, Tenant>)[id] || TENANTS.arcanea;
}

export function isTenantId(id: string): id is TenantId {
  return id === 'arcanea' || id === 'sis' || id === 'frankx';
}
