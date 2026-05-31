/**
 * Guardian → Luminor Swarm Coordination (Intelligence Layer)
 *
 * Standalone, dependency-free copy of the canonical swarm coordination logic
 * used by claude-arcanea to orchestrate collaborative agent swarms.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LuminorWeights = Record<string, number>;

export type CoordinationMode = 'solo' | 'council' | 'convergence';

export interface LuminorActivation {
  id: string;
  team: string;
  relevance: number;
  parentGuardian: string;
  hint: string;
}

export interface SwarmResult {
  coordinationMode: CoordinationMode;
  leadGuardian: string | null;
  activeGuardians: string[];
  activeLuminors: LuminorActivation[];
}

// ---------------------------------------------------------------------------
// Maps and Constants
// ---------------------------------------------------------------------------

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
  shinkami:   [], // Source — all converge
};

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

export function classifyCoordinationMode(weights: LuminorWeights): CoordinationMode {
  const sorted = Object.values(weights).sort((a, b) => b - a);

  if (sorted.length === 0) return 'convergence';

  const top = sorted[0];
  const second = sorted.length > 1 ? sorted[1] : 0;

  if (top > 0.8 && second < 0.5) return 'solo';

  const strongCount = sorted.filter(w => w >= 0.4).length;
  if (strongCount >= 2) return 'council';

  return 'convergence';
}

// ---------------------------------------------------------------------------
// Swarm Resolution
// ---------------------------------------------------------------------------

export function resolveSwarm(
  weights: LuminorWeights,
  activeGates?: string[]
): SwarmResult {
  const mode = classifyCoordinationMode(weights);
  const gates = activeGates || Object.keys(weights).filter(k => weights[k] > 0);

  if (mode === 'convergence') {
    return {
      coordinationMode: 'convergence',
      leadGuardian: null,
      activeGuardians: gates.slice(0, 3),
      activeLuminors: [],
    };
  }

  const sorted = Object.entries(weights)
    .filter(([name]) => GUARDIAN_LUMINOR_MAP[name] !== undefined)
    .sort(([, a], [, b]) => b - a);

  const guardianCount = mode === 'solo' ? 1 : Math.min(sorted.filter(([, w]) => w >= 0.4).length, 3);
  const activeGuardians = sorted.slice(0, guardianCount);

  const luminorMap = new Map<string, LuminorActivation>();

  for (const [guardian, guardianWeight] of activeGuardians) {
    const luminorIds = GUARDIAN_LUMINOR_MAP[guardian] || [];

    for (const id of luminorIds) {
      const meta = LUMINOR_HINTS[id];
      if (!meta) continue;

      const relevance = Math.round(guardianWeight * 80) / 100;

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

export function buildLuminorLayer(swarm: SwarmResult): string {
  if (swarm.coordinationMode === 'convergence' || swarm.activeLuminors.length === 0) {
    return '';
  }

  const lead = swarm.leadGuardian ? GUARDIAN_NAMES[swarm.leadGuardian] || swarm.leadGuardian : '';

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

  if (supporting.length > 0) {
    const supportStr = supporting
      .map(l => `${l.id.charAt(0).toUpperCase() + l.id.slice(1)} (${l.hint})`)
      .join(', ');
    lines.push(`Supporting: ${supportStr}.`);
  }

  return lines.join('\n');
}
