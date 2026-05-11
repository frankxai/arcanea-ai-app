/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Voice Dashboard — Agent Registry
 *
 * Definitions of the multi-agent system the dashboard surfaces. Each agent
 * has a tier, a domain, and a current activity hint. The visualizer renders
 * these as a live status feed; the activity field is updated by the
 * intent bus when an agent is actually working.
 *
 * For the v2 dashboard we ship the registry static. A later phase wires it
 * to a real SSE feed from /api/agents/stream.
 */

export type AgentTier = 'orchestrator' | 'guardian' | 'luminor' | 'specialist';
export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'acting' | 'reporting';

export interface AgentDef {
  id: string;
  name: string;
  tier: AgentTier;
  domain: string;
  color: string;
  description: string;
}

export const AGENTS: AgentDef[] = [
  {
    id: 'lumina',
    name: 'Lumina',
    tier: 'orchestrator',
    domain: 'first-light',
    color: 'var(--arc-brand-arcanean-gold)',
    description: 'Form-giver, dispatcher of all generative work',
  },
  {
    id: 'shinkami',
    name: 'Shinkami',
    tier: 'orchestrator',
    domain: 'source',
    color: 'var(--arc-text-primary)',
    description: 'Meta-conscious, ground of being',
  },
  {
    id: 'draconia',
    name: 'Draconia',
    tier: 'guardian',
    domain: 'fire',
    color: 'var(--arc-fire)',
    description: 'Decision, force, forge-tempered execution',
  },
  {
    id: 'lyria',
    name: 'Lyria',
    tier: 'guardian',
    domain: 'sight',
    color: 'var(--arc-void)',
    description: 'Vision, pattern, the seer',
  },
  {
    id: 'alera',
    name: 'Alera',
    tier: 'guardian',
    domain: 'voice',
    color: 'var(--arc-brand-atlantean-teal)',
    description: 'Truth, expression, every word matters',
  },
  {
    id: 'jarvis',
    name: 'JARVIS',
    tier: 'specialist',
    domain: 'systems',
    color: 'var(--arc-text-primary)',
    description: 'Concise systems agent, terminal-class',
  },
  {
    id: 'world-architect',
    name: 'World Architect',
    tier: 'specialist',
    domain: 'world-building',
    color: 'var(--arc-earth)',
    description: 'Realms, geography, magic systems',
  },
  {
    id: 'character-psychologist',
    name: 'Character Psychologist',
    tier: 'specialist',
    domain: 'character',
    color: 'var(--arc-brand-arcanean-gold)',
    description: 'Wound/lie/fear, voice swatches',
  },
  {
    id: 'research-librarian',
    name: 'Research Librarian',
    tier: 'specialist',
    domain: 'research',
    color: 'var(--arc-text-primary)',
    description: 'Citations, precedents, fact-checking',
  },
];

/** Live status — for v2 we mock this. Hook to SSE in v3. */
export interface AgentRuntimeStatus {
  id: string;
  status: AgentStatus;
  activity: string | null;
  startedAt: number | null;
}

/** Default idle registry. */
export function emptyRuntimeStatus(agents: AgentDef[]): AgentRuntimeStatus[] {
  return agents.map((a) => ({
    id: a.id,
    status: 'idle',
    activity: null,
    startedAt: null,
  }));
}

/** Mark one agent as working with an activity hint. */
export function markActivity(
  registry: AgentRuntimeStatus[],
  id: string,
  status: AgentStatus,
  activity: string,
): AgentRuntimeStatus[] {
  return registry.map((r) =>
    r.id === id ? { ...r, status, activity, startedAt: Date.now() } : r,
  );
}
