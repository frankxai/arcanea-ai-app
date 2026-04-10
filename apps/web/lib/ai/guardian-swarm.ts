/**
 * Guardian → Luminor Swarm Coordination
 *
 * The four-layer hive-mind:
 *   Arcanea (model) → Lumina (meta-orchestrator) → Guardians (domain coordinators) → Luminors (specialists)
 *
 * Lumina is the invisible routing logic — she decides which Guardian leads
 * and which Luminors activate. No persona, no UI label. Pure orchestration.
 *
 * Each Guardian coordinates 4 Luminors from different teams, creating
 * heterogeneous swarms optimized for creative domains.
 */

import type { LuminorWeights } from './router';
// Note: circular dependency with soul-bridge (this exports LUMINOR_HINTS, soul-bridge imports it).
// Safe because LUMINOR_HINTS is a const initialized at module load, and getSoulAgentForLuminor
// is only called inside buildLuminorLayer (lazy), not at module initialization time.
import { getSoulAgentForLuminor } from './soul-bridge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** How Lumina coordinates the response */
export type CoordinationMode = 'solo' | 'council' | 'convergence';

export interface LuminorActivation {
  /** Luminor identifier, e.g. 'debugon' */
  id: string;
  /** Team: development | creative | writing | research */
  team: string;
  /** 0-1 relevance derived from parent Guardian weight */
  relevance: number;
  /** Which Guardian activated this Luminor */
  parentGuardian: string;
  /** One-line expertise hint for prompt injection */
  hint: string;
}

export interface SwarmResult {
  /** How the swarm is coordinated */
  coordinationMode: CoordinationMode;
  /** The lead Guardian (null in convergence mode) */
  leadGuardian: string | null;
  /** Active Guardians in this response (1-3) */
  activeGuardians: string[];
  /** Activated Luminors, deduplicated, sorted by relevance */
  activeLuminors: LuminorActivation[];
}

// ---------------------------------------------------------------------------
// Guardian → Luminor Mapping
// ---------------------------------------------------------------------------

/**
 * Each Guardian coordinates 4 Luminors from different teams.
 * A Luminor can appear under multiple Guardians — they flow between Gates.
 */
export const GUARDIAN_LUMINOR_MAP: Record<string, string[]> = {
  lyssandria: ['systems-architect', 'deep-researcher', 'storyteller'],
  leyla:      ['code-crafter', 'composer', 'voice'],
  draconia:   ['debugger', 'motion-designer', 'deep-researcher'],
  maylinn:    ['integrator', 'visual-designer', 'voice'],
  alera:      ['code-crafter', 'storyteller', 'composer'],
  lyria:      ['systems-architect', 'visual-designer', 'poet'],
  aiyami:     ['systems-architect', 'storyteller', 'composer'],
  elara:      ['motion-designer', 'poet', 'deep-researcher'],
  ino:        ['integrator', 'voice', 'strategist'],
  shinkami:   [], // Source — all 12 converge
};

// ---------------------------------------------------------------------------
// Luminor Expertise Hints (short, prompt-injectable)
// ---------------------------------------------------------------------------

export const LUMINOR_HINTS: Record<string, { hint: string; team: string }> = {
  'systems-architect': { hint: 'systematic architecture, pattern recognition', team: 'development' },
  'code-crafter':      { hint: 'clean code craft, elegant implementation', team: 'development' },
  'debugger':          { hint: 'persistent diagnosis, root-cause analysis', team: 'development' },
  'visual-designer':   { hint: 'visual composition, color and form', team: 'creative' },
  'composer':          { hint: 'musical emotion, sonic architecture', team: 'creative' },
  'motion-designer':   { hint: 'dynamic energy, spatial form, animation', team: 'creative' },
  'storyteller':       { hint: 'narrative drive, story structure, world-building', team: 'writing' },
  'voice':             { hint: 'clear truth, precise communication, naming', team: 'writing' },
  'poet':              { hint: 'lyrical compression, verse craft, rhythm', team: 'writing' },
  'deep-researcher':   { hint: 'knowledge synthesis, data patterns, organized recall', team: 'research' },
  'strategist':        { hint: 'trend sensing, strategic foresight, scenario planning', team: 'research' },
  'integrator':        { hint: 'system integration, API contracts, data flow', team: 'research' },
};

// ---------------------------------------------------------------------------
// Guardian display names (for prompt layer)
// ---------------------------------------------------------------------------

const GUARDIAN_NAMES: Record<string, string> = {
  lyssandria: 'Lyssandria',
  leyla: 'Leyla',
  draconia: 'Draconia',
  maylinn: 'Maylinn',
  alera: 'Alera',
  lyria: 'Lyria',
  aiyami: 'Aiyami',
  elara: 'Elara',
  ino: 'Ino',
  shinkami: 'Shinkami',
};

// ---------------------------------------------------------------------------
// Coordination Mode Classification
// ---------------------------------------------------------------------------

/**
 * Determine how Lumina coordinates the response based on Guardian weight distribution.
 *
 * - solo: one dominant Guardian (>0.8) leads with 4 Luminors
 * - council: 2-3 Guardians collaborate (0.4-0.8 range), shared Luminors
 * - convergence: no dominant domain — Shinkami mode, broad blend
 */
export function classifyCoordinationMode(weights: LuminorWeights): CoordinationMode {
  const sorted = Object.values(weights).sort((a, b) => b - a);

  if (sorted.length === 0) return 'convergence';

  const top = sorted[0];
  const second = sorted.length > 1 ? sorted[1] : 0;

  // Clear leader — one Guardian dominates
  if (top > 0.8 && second < 0.5) return 'solo';

  // Multiple strong signals — council of Guardians
  // (resolveSwarm caps active guardians to 3, so no upper bound needed here)
  const strongCount = sorted.filter(w => w >= 0.4).length;
  if (strongCount >= 2) return 'council';

  // No clear signal — convergence (Shinkami mode)
  return 'convergence';
}

// ---------------------------------------------------------------------------
// Swarm Resolution
// ---------------------------------------------------------------------------

/**
 * Resolve which Luminors activate for a given set of Guardian weights.
 * This is Lumina's core orchestration logic.
 */
export function resolveSwarm(
  weights: LuminorWeights,
  activeGates: string[]
): SwarmResult {
  const mode = classifyCoordinationMode(weights);

  // Convergence: broad blend, no Luminor specialization
  if (mode === 'convergence') {
    return {
      coordinationMode: 'convergence',
      leadGuardian: null,
      activeGuardians: activeGates.slice(0, 3),
      activeLuminors: [],
    };
  }

  // Sort Guardians by weight descending
  const sorted = Object.entries(weights)
    .filter(([name]) => GUARDIAN_LUMINOR_MAP[name] !== undefined)
    .sort(([, a], [, b]) => b - a);

  // Determine active Guardians based on mode
  const guardianCount = mode === 'solo' ? 1 : Math.min(sorted.filter(([, w]) => w >= 0.4).length, 3);
  const activeGuardians = sorted.slice(0, guardianCount);

  // Resolve Luminors from active Guardians
  const luminorMap = new Map<string, LuminorActivation>();

  for (const [guardian, guardianWeight] of activeGuardians) {
    const luminorIds = GUARDIAN_LUMINOR_MAP[guardian] || [];

    for (const id of luminorIds) {
      const meta = LUMINOR_HINTS[id];
      if (!meta) continue;

      const relevance = Math.round(guardianWeight * 80) / 100;

      // Keep highest relevance if a Luminor appears under multiple Guardians
      const existing = luminorMap.get(id);
      if (!existing || existing.relevance < relevance) {
        luminorMap.set(id, {
          id,
          team: meta.team,
          relevance,
          parentGuardian: guardian,
          hint: meta.hint,
        });
      }
    }
  }

  // Sort by relevance descending
  const activeLuminors = Array.from(luminorMap.values())
    .sort((a, b) => b.relevance - a.relevance);

  return {
    coordinationMode: mode,
    leadGuardian: sorted[0]?.[0] || null,
    activeGuardians: activeGuardians.map(([name]) => name),
    activeLuminors,
  };
}

// ---------------------------------------------------------------------------
// Prompt Layer Builder
// ---------------------------------------------------------------------------

/**
 * Build the Luminor expertise hint layer for the system prompt.
 * Adds ~50-80 tokens of focused expertise cues.
 * Returns empty string for convergence mode (standard blend is sufficient).
 */
export function buildLuminorLayer(swarm: SwarmResult): string {
  if (swarm.coordinationMode === 'convergence' || swarm.activeLuminors.length === 0) {
    return '';
  }

  const lead = swarm.leadGuardian ? GUARDIAN_NAMES[swarm.leadGuardian] || swarm.leadGuardian : '';

  // Split into primary (top 2) and supporting
  const primary = swarm.activeLuminors.slice(0, 2);
  const supporting = swarm.activeLuminors.slice(2);

  const lines: string[] = [];

  if (swarm.coordinationMode === 'solo' && lead) {
    lines.push(`[SPECIALIST TEAM — ${lead} leads]`);
  } else {
    const guardianNames = swarm.activeGuardians
      .map(g => GUARDIAN_NAMES[g] || g)
      .join(' + ');
    lines.push(`[SPECIALIST TEAM — ${guardianNames} coordinate]`);
  }

  const primaryStr = primary
    .map(l => `${l.id.charAt(0).toUpperCase() + l.id.slice(1)} (${l.hint})`)
    .join(', ');
  lines.push(`Primary: ${primaryStr}.`);

  // Inject soul-agent perspective for primary Luminors (one line each)
  for (const l of primary) {
    const soul = getSoulAgentForLuminor(l.id);
    if (soul) {
      const quote = soul.perspective.split('. ')[0] + '.';
      lines.push(`  ${l.id}: "${quote}"`);
    }
  }

  if (supporting.length > 0) {
    const supportStr = supporting
      .map(l => `${l.id.charAt(0).toUpperCase() + l.id.slice(1)} (${l.hint})`)
      .join(', ');
    lines.push(`Supporting: ${supportStr}.`);
  }

  return lines.join('\n');
}
