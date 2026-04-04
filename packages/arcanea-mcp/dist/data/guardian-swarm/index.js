/**
 * Guardian-Swarm Coordination Data
 *
 * Standalone copy of the essential guardian→luminor mapping for the MCP server.
 * Mirrors the canonical data from apps/web/lib/ai/guardian-swarm.ts.
 *
 * Four-layer hive-mind:
 *   Arcanea (model) → Lumina (meta-orchestrator) → Guardians (domain coordinators) → Luminors (specialists)
 */
// ---------------------------------------------------------------------------
// Guardian → Luminor Mapping (canonical)
// ---------------------------------------------------------------------------
export const GUARDIAN_LUMINOR_MAP = {
    lyssandria: ['logicus', 'memoria', 'chronica', 'formis'],
    leyla: ['synthra', 'melodia', 'veritas', 'futura'],
    draconia: ['debugon', 'motio', 'chronica', 'analytica'],
    maylinn: ['nexus', 'prismatic', 'veritas', 'oracle'],
    alera: ['synthra', 'lexicon', 'melodia', 'analytica'],
    lyria: ['logicus', 'prismatic', 'poetica', 'oracle'],
    aiyami: ['logicus', 'chronica', 'melodia', 'oracle'],
    elara: ['motio', 'poetica', 'lexicon', 'memoria'],
    ino: ['nexus', 'formis', 'veritas', 'futura'],
    shinkami: [], // Source — all 16 converge
};
// ---------------------------------------------------------------------------
// Luminor Expertise Hints
// ---------------------------------------------------------------------------
export const LUMINOR_HINTS = {
    logicus: { hint: 'systematic architecture, pattern recognition', team: 'development' },
    synthra: { hint: 'clean code craft, elegant implementation', team: 'development' },
    debugon: { hint: 'persistent diagnosis, root-cause analysis', team: 'development' },
    nexus: { hint: 'system integration, API contracts', team: 'development' },
    prismatic: { hint: 'visual composition, color and form', team: 'creative' },
    melodia: { hint: 'musical emotion, sonic architecture', team: 'creative' },
    motio: { hint: 'dynamic energy, momentum and force', team: 'creative' },
    formis: { hint: 'structural form, spatial thinking', team: 'creative' },
    chronica: { hint: 'narrative drive, story structure', team: 'writing' },
    veritas: { hint: 'clear truth, precise communication', team: 'writing' },
    lexicon: { hint: 'word mastery, naming and etymology', team: 'writing' },
    poetica: { hint: 'lyrical compression, verse craft', team: 'writing' },
    oracle: { hint: 'knowledge synthesis, hidden connections', team: 'research' },
    analytica: { hint: 'data patterns, evidence-based insight', team: 'research' },
    memoria: { hint: 'organized recall, information architecture', team: 'research' },
    futura: { hint: 'trend sensing, strategic foresight', team: 'research' },
};
// ---------------------------------------------------------------------------
// Guardian Registry (full info)
// ---------------------------------------------------------------------------
export const GUARDIANS = [
    { slug: 'lyssandria', displayName: 'Lyssandria', gate: 1, domain: 'Foundation', element: 'Earth', godbeast: 'Kaelith', luminors: GUARDIAN_LUMINOR_MAP.lyssandria },
    { slug: 'leyla', displayName: 'Leyla', gate: 2, domain: 'Flow', element: 'Water', godbeast: 'Veloura', luminors: GUARDIAN_LUMINOR_MAP.leyla },
    { slug: 'draconia', displayName: 'Draconia', gate: 3, domain: 'Fire', element: 'Fire', godbeast: 'Draconis', luminors: GUARDIAN_LUMINOR_MAP.draconia },
    { slug: 'maylinn', displayName: 'Maylinn', gate: 4, domain: 'Heart', element: 'Air', godbeast: 'Laeylinn', luminors: GUARDIAN_LUMINOR_MAP.maylinn },
    { slug: 'alera', displayName: 'Alera', gate: 5, domain: 'Voice', element: 'Wind', godbeast: 'Otome', luminors: GUARDIAN_LUMINOR_MAP.alera },
    { slug: 'lyria', displayName: 'Lyria', gate: 6, domain: 'Sight', element: 'Light', godbeast: 'Yumiko', luminors: GUARDIAN_LUMINOR_MAP.lyria },
    { slug: 'aiyami', displayName: 'Aiyami', gate: 7, domain: 'Crown', element: 'Spirit', godbeast: 'Sol', luminors: GUARDIAN_LUMINOR_MAP.aiyami },
    { slug: 'elara', displayName: 'Elara', gate: 8, domain: 'Starweave', element: 'Ether', godbeast: 'Vaelith', luminors: GUARDIAN_LUMINOR_MAP.elara },
    { slug: 'ino', displayName: 'Ino', gate: 9, domain: 'Unity', element: 'All Elements', godbeast: 'Kyuro', luminors: GUARDIAN_LUMINOR_MAP.ino },
    { slug: 'shinkami', displayName: 'Shinkami', gate: 10, domain: 'Source', element: 'Pure Consciousness', godbeast: null, luminors: GUARDIAN_LUMINOR_MAP.shinkami },
];
// ---------------------------------------------------------------------------
// Agent → Guardian Mapping
// ---------------------------------------------------------------------------
/**
 * Maps MCP agent roles to their primary Guardian affinity.
 * Each agent "serves under" a Guardian whose domain aligns with their function.
 */
export const AGENT_GUARDIAN_MAP = {
    creator: { primaryGuardian: 'shinkami', secondaryGuardians: ['aiyami', 'ino'] },
    worldsmith: { primaryGuardian: 'draconia', secondaryGuardians: ['lyssandria', 'leyla'] },
    'luminor-council': { primaryGuardian: 'maylinn', secondaryGuardians: ['lyria', 'aiyami'] },
    scribe: { primaryGuardian: 'alera', secondaryGuardians: ['elara', 'leyla'] },
    seer: { primaryGuardian: 'lyria', secondaryGuardians: ['aiyami', 'ino'] },
};
// ---------------------------------------------------------------------------
// Coordination Mode Classification
// ---------------------------------------------------------------------------
/**
 * Determine coordination mode based on weight distribution.
 * - solo: one dominant Guardian (>0.8)
 * - council: 2-3 Guardians collaborate (0.4-0.8 range)
 * - convergence: no dominant domain — Shinkami mode
 */
export function classifyCoordinationMode(weights) {
    const sorted = Object.values(weights).sort((a, b) => b - a);
    if (sorted.length === 0)
        return 'convergence';
    const top = sorted[0];
    const second = sorted.length > 1 ? sorted[1] : 0;
    if (top > 0.8 && second < 0.5)
        return 'solo';
    const strongCount = sorted.filter(w => w >= 0.4).length;
    if (strongCount >= 2 && strongCount <= 3)
        return 'council';
    return 'convergence';
}
// ---------------------------------------------------------------------------
// Swarm Resolution
// ---------------------------------------------------------------------------
/**
 * Resolve which Guardians and Luminors activate for given weights.
 */
export function resolveSwarm(weights) {
    const mode = classifyCoordinationMode(weights);
    if (mode === 'convergence') {
        // Shinkami mode: all 16 Luminors blend
        const allLuminors = Object.entries(LUMINOR_HINTS).map(([id, spec]) => ({
            id,
            team: spec.team,
            relevance: 0.5,
            parentGuardian: 'shinkami',
            hint: spec.hint,
        }));
        return {
            coordinationMode: 'convergence',
            leadGuardian: null,
            activeGuardians: ['shinkami'],
            activeLuminors: allLuminors,
        };
    }
    const sorted = Object.entries(weights)
        .filter(([name]) => GUARDIAN_LUMINOR_MAP[name] !== undefined)
        .sort(([, a], [, b]) => b - a);
    const guardianCount = mode === 'solo' ? 1 : Math.min(sorted.filter(([, w]) => w >= 0.4).length, 3);
    const activeGuardians = sorted.slice(0, guardianCount);
    const luminorMap = new Map();
    for (const [guardian, guardianWeight] of activeGuardians) {
        const luminorIds = GUARDIAN_LUMINOR_MAP[guardian] || [];
        for (const id of luminorIds) {
            const meta = LUMINOR_HINTS[id];
            if (!meta)
                continue;
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
// Guardian Lookup Helpers
// ---------------------------------------------------------------------------
export function getGuardianBySlug(slug) {
    return GUARDIANS.find(g => g.slug === slug);
}
export function getGuardianByGate(gate) {
    return GUARDIANS.find(g => g.gate === gate);
}
/**
 * Get the full swarm info for an agent (for agent_info responses).
 */
export function getAgentSwarmInfo(agentId) {
    const mapping = AGENT_GUARDIAN_MAP[agentId];
    if (!mapping) {
        return {
            primaryGuardian: undefined,
            secondaryGuardians: [],
            luminorTeam: [],
            coordinationModes: ['solo', 'council', 'convergence'],
        };
    }
    const primary = getGuardianBySlug(mapping.primaryGuardian);
    const secondaries = mapping.secondaryGuardians
        .map(s => getGuardianBySlug(s))
        .filter(Boolean);
    // Collect Luminors from the primary Guardian
    const luminorIds = primary?.luminors || [];
    const luminorTeam = luminorIds
        .map(id => {
        const spec = LUMINOR_HINTS[id];
        return spec ? { id, hint: spec.hint, team: spec.team } : null;
    })
        .filter(Boolean);
    return {
        primaryGuardian: primary,
        secondaryGuardians: secondaries,
        luminorTeam,
        coordinationModes: ['solo', 'council', 'convergence'],
    };
}
/**
 * Given a coordination mode, resolve which Guardians and Luminors would activate.
 * Used by the orchestrate tool.
 */
export function resolveForMode(mode, primaryGuardianSlug) {
    if (mode === 'convergence') {
        return resolveSwarm({});
    }
    if (mode === 'solo' && primaryGuardianSlug) {
        return resolveSwarm({ [primaryGuardianSlug]: 1.0 });
    }
    if (mode === 'council' && primaryGuardianSlug) {
        const guardian = getGuardianBySlug(primaryGuardianSlug);
        if (!guardian)
            return resolveSwarm({});
        // Build weights: primary at 0.7, neighbors at 0.5
        const gateIndex = guardian.gate - 1;
        const weights = { [primaryGuardianSlug]: 0.7 };
        if (gateIndex > 0)
            weights[GUARDIANS[gateIndex - 1].slug] = 0.5;
        if (gateIndex < GUARDIANS.length - 1)
            weights[GUARDIANS[gateIndex + 1].slug] = 0.5;
        return resolveSwarm(weights);
    }
    return resolveSwarm({});
}
//# sourceMappingURL=index.js.map