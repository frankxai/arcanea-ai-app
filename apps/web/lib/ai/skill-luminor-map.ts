/**
 * Skill -> Luminor Routing Map
 *
 * When a skill is invoked, this map determines which Luminor
 * should lead the response, creating consistency between
 * skill execution and the swarm coordination layer.
 *
 * Luminor teams (from guardian-swarm.ts):
 *   development: systems-architect, code-crafter, debugger
 *   creative:    visual-designer, composer, motion-designer
 *   writing:     storyteller, voice, poet
 *   research:    deep-researcher, strategist, integrator
 *
 * Guardian domains (from CANON):
 *   lyssandria (Foundation) - earth, structure, stability
 *   leyla (Flow) - creativity, emotion, flow
 *   draconia (Fire) - power, will, transformation
 *   maylinn (Heart) - love, healing, connection
 *   alera (Voice) - truth, expression, communication
 *   lyria (Sight) - intuition, vision, design
 *   aiyami (Crown) - enlightenment, wisdom
 *   elara (Starweave) - perspective, transformation
 *   ino (Unity) - partnership, integration
 *   shinkami (Source) - meta-consciousness, all domains
 */

export interface SkillLuminorEntry {
  luminor: string;
  guardian: string;
  team: string;
}

export const SKILL_LUMINOR_MAP: Record<string, SkillLuminorEntry> = {
  // ---------------------------------------------------------------------------
  // Development Skills
  // ---------------------------------------------------------------------------
  'debug':                { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },
  'systematic-debug':     { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },
  'tdd':                  { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },
  'code-review':          { luminor: 'code-crafter',    guardian: 'alera',      team: 'development' },
  'refactor':             { luminor: 'code-crafter',    guardian: 'leyla',      team: 'development' },
  'refactoring-ritual':   { luminor: 'code-crafter',    guardian: 'leyla',      team: 'development' },
  'architecture':         { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'architecture-patterns':{ luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'api-design':           { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'mcp-builder':          { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'typescript-expert':    { luminor: 'code-crafter',    guardian: 'leyla',      team: 'development' },
  'react-best-practices': { luminor: 'code-crafter',    guardian: 'leyla',      team: 'development' },
  'next-best-practices':  { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'supabase-patterns':    { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'storage-management':   { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'performance-tuning':   { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'playwright-testing':   { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },
  'webapp-testing':       { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },

  // ---------------------------------------------------------------------------
  // Creative Skills
  // ---------------------------------------------------------------------------
  'design':               { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'design-system':        { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'canvas-design':        { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'theme-factory':        { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'premium-visual':       { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'music':                { luminor: 'composer',    guardian: 'leyla',      team: 'creative' },
  'world-build':          { luminor: 'motion-designer',     guardian: 'lyssandria', team: 'creative' },
  'world-architect':      { luminor: 'motion-designer',     guardian: 'lyssandria', team: 'creative' },
  'character-forge':      { luminor: 'motion-designer',     guardian: 'ino',        team: 'creative' },
  'character-alchemist':  { luminor: 'motion-designer',     guardian: 'ino',        team: 'creative' },
  'bestiary-nav':         { luminor: 'motion-designer',     guardian: 'lyssandria', team: 'creative' },
  'creative-bestiary':    { luminor: 'motion-designer',     guardian: 'lyssandria', team: 'creative' },
  'creative-flow':        { luminor: 'motion-designer',      guardian: 'leyla',      team: 'creative' },
  'robot-designer':       { luminor: 'motion-designer',     guardian: 'ino',        team: 'creative' },
  'algorithmic-art':      { luminor: 'motion-designer',      guardian: 'lyria',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // Writing Skills
  // ---------------------------------------------------------------------------
  'story':                { luminor: 'storyteller',   guardian: 'alera',      team: 'writing' },
  'story-weave':          { luminor: 'storyteller',   guardian: 'alera',      team: 'writing' },
  'story-weaver':         { luminor: 'storyteller',   guardian: 'alera',      team: 'writing' },
  'scene-craft':          { luminor: 'storyteller',   guardian: 'alera',      team: 'writing' },
  'voice-check':          { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'voice-alchemy':        { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'revision':             { luminor: 'voice',    guardian: 'elara',      team: 'writing' },
  'revision-ritual':      { luminor: 'voice',    guardian: 'elara',      team: 'writing' },
  'dialogue-mastery':     { luminor: 'voice',    guardian: 'maylinn',    team: 'writing' },
  'poet':              { luminor: 'poet',    guardian: 'lyria',      team: 'writing' },
  'excellence-book-writing': { luminor: 'storyteller', guardian: 'alera',     team: 'writing' },
  'creative-writing':     { luminor: 'storyteller',   guardian: 'alera',      team: 'writing' },

  // ---------------------------------------------------------------------------
  // Research & Knowledge Skills
  // ---------------------------------------------------------------------------
  'research':             { luminor: 'deep-researcher',     guardian: 'elara',      team: 'research' },
  'deep-work':            { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'skill-mastery':        { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'content-strategy':     { luminor: 'strategist',     guardian: 'leyla',      team: 'research' },
  'documentation-patterns': { luminor: 'deep-researcher',  guardian: 'lyssandria', team: 'research' },

  // ---------------------------------------------------------------------------
  // Arcanea Lore & Canon Skills
  // ---------------------------------------------------------------------------
  'arcanea-canon':        { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'arcanea-lore':         { luminor: 'storyteller',   guardian: 'aiyami',     team: 'writing' },
  'arcanea-voice':        { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'arcanea-anti-trope':   { luminor: 'voice',    guardian: 'elara',      team: 'writing' },
  'luminor-wisdom':       { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'luminor-intelligence': { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'luminor-rituals':      { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'luminor-council':      { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'arcanea-guardians':    { luminor: 'deep-researcher',    guardian: 'shinkami',   team: 'research' },
  'lumina':               { luminor: 'deep-researcher',     guardian: 'shinkami',   team: 'research' },
  'nero':                 { luminor: 'deep-researcher',     guardian: 'shinkami',   team: 'research' },
  'prompt-craft':         { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'centaur-mode':         { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'ai-symbiosis':         { luminor: 'integrator',      guardian: 'ino',        team: 'development' },

  // ---------------------------------------------------------------------------
  // Arcanea Design & Products
  // ---------------------------------------------------------------------------
  'arcanea-design-system':  { luminor: 'visual-designer', guardian: 'lyria',     team: 'creative' },
  'arcanea-creator-academy': { luminor: 'deep-researcher',   guardian: 'aiyami',    team: 'research' },
  'arcanea-core':         { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // Arcanea Vibe Gods (Music/Audio)
  // ---------------------------------------------------------------------------
  'arcanea-vibe-gods':    { luminor: 'composer',    guardian: 'leyla',      team: 'creative' },
  'cover-art':            { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'lyricist':             { luminor: 'poet',    guardian: 'lyria',      team: 'writing' },
  'social-composer':      { luminor: 'composer',    guardian: 'leyla',      team: 'creative' },
  'songseed':             { luminor: 'composer',    guardian: 'leyla',      team: 'creative' },
  'suno-engineer':        { luminor: 'composer',    guardian: 'leyla',      team: 'creative' },
  'vibe-engineer':        { luminor: 'composer',    guardian: 'leyla',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // Arcanea Games & Ships
  // ---------------------------------------------------------------------------
  'arcanea-games':        { luminor: 'motion-designer',      guardian: 'draconia',   team: 'creative' },
  'arcanea-game-development': { luminor: 'motion-designer',  guardian: 'draconia',   team: 'creative' },
  'arcanea-ships':        { luminor: 'motion-designer',     guardian: 'ino',        team: 'creative' },

  // ---------------------------------------------------------------------------
  // Academy & Gate Skills
  // ---------------------------------------------------------------------------
  'academy':              { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'gate-foundation':      { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'gate-flow':            { luminor: 'code-crafter',    guardian: 'leyla',      team: 'development' },
  'gate-fire':            { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },
  'gate-heart':           { luminor: 'voice',    guardian: 'maylinn',    team: 'writing' },
  'gate-voice':           { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'gate-sight':           { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'gate-crown':           { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'gate-shift':           { luminor: 'motion-designer',      guardian: 'elara',      team: 'creative' },
  'gate-unity':           { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'gate-source':          { luminor: 'deep-researcher',     guardian: 'shinkami',   team: 'research' },
  'ceremonies':           { luminor: 'poet',    guardian: 'aiyami',     team: 'writing' },
  'progress-tracker':     { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'mentors':              { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },

  // ---------------------------------------------------------------------------
  // Community Skills
  // ---------------------------------------------------------------------------
  'agent-orchestration':  { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'design-systems':       { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'development-workflows': { luminor: 'systems-architect',   guardian: 'lyssandria', team: 'development' },
  'testing-strategies':   { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },

  // ---------------------------------------------------------------------------
  // Document & Export Skills
  // ---------------------------------------------------------------------------
  'doc-coauthoring':      { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'docx':                 { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'pdf':                  { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'pptx':                 { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'xlsx':                 { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'web-artifacts-builder': { luminor: 'motion-designer',    guardian: 'lyria',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // GitHub & DevOps Skills
  // ---------------------------------------------------------------------------
  'github-code-review':   { luminor: 'code-crafter',    guardian: 'alera',      team: 'development' },
  'github-multi-repo':    { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'github-project-management': { luminor: 'systems-architect', guardian: 'lyssandria', team: 'development' },
  'github-release-management': { luminor: 'integrator',  guardian: 'ino',       team: 'development' },
  'github-workflow-automation': { luminor: 'systems-architect', guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // Swarm & Agent Infrastructure Skills
  // ---------------------------------------------------------------------------
  'swarm-orchestration':  { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'swarm-advanced':       { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'hooks-automation':     { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'opus-extended-thinking': { luminor: 'deep-researcher',   guardian: 'aiyami',     team: 'research' },
  'stream-chain':         { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'verification-quality': { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'skill-builder':        { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // AgentDB & Memory Skills
  // ---------------------------------------------------------------------------
  'agentdb-advanced':     { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'agentdb-learning':     { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'agentdb-memory-patterns': { luminor: 'deep-researcher', guardian: 'lyssandria', team: 'research' },
  'agentdb-optimization': { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'agentdb-vector-search': { luminor: 'deep-researcher',   guardian: 'lyssandria', team: 'research' },
  'reasoningbank-agentdb': { luminor: 'deep-researcher',   guardian: 'lyssandria', team: 'research' },
  'reasoningbank-intelligence': { luminor: 'deep-researcher', guardian: 'aiyami',   team: 'research' },

  // ---------------------------------------------------------------------------
  // V3 Implementation Skills
  // ---------------------------------------------------------------------------
  'v3-cli-modernization': { luminor: 'code-crafter',    guardian: 'leyla',      team: 'development' },
  'v3-core-implementation': { luminor: 'systems-architect',  guardian: 'lyssandria', team: 'development' },
  'v3-ddd-architecture':  { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'v3-integration-deep':  { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'v3-mcp-optimization':  { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'v3-memory-unification': { luminor: 'deep-researcher',   guardian: 'lyssandria', team: 'research' },
  'v3-performance-optimization': { luminor: 'deep-researcher', guardian: 'draconia', team: 'research' },
  'v3-security-overhaul': { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },
  'v3-swarm-coordination': { luminor: 'integrator',     guardian: 'ino',        team: 'development' },

  // ---------------------------------------------------------------------------
  // Starlight Skills
  // ---------------------------------------------------------------------------
  'starlight-core':       { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'starlight-engineering': { luminor: 'code-crafter',   guardian: 'leyla',      team: 'development' },
  'starlight-memex':      { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'starlight-orchestrator': { luminor: 'integrator',    guardian: 'ino',        team: 'development' },

  // ---------------------------------------------------------------------------
  // Meta & Workflow Skills
  // ---------------------------------------------------------------------------
  'lore-keeper':          { luminor: 'deep-researcher',    guardian: 'lyssandria', team: 'research' },
  'guardian-voice':       { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'creation-engine':      { luminor: 'motion-designer',     guardian: 'leyla',      team: 'creative' },
  'guardian-evolution-system': { luminor: 'strategist', guardian: 'elara',     team: 'research' },
  'luminor-personality-design': { luminor: 'motion-designer', guardian: 'lyria',   team: 'creative' },
  'scientific-magic':     { luminor: 'deep-researcher',  guardian: 'draconia',   team: 'research' },
  'chess-factory-generation': { luminor: 'systems-architect', guardian: 'draconia',  team: 'development' },
  'slack-gif-creator':    { luminor: 'motion-designer',      guardian: 'leyla',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // Industry & Premium Skills
  // ---------------------------------------------------------------------------
  'enterprise-orchestration': { luminor: 'integrator',  guardian: 'ino',        team: 'development' },
  'industry-verticals':   { luminor: 'strategist',     guardian: 'elara',      team: 'research' },
  'teacher-mentor':       { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'teacher-team':         { luminor: 'deep-researcher',     guardian: 'aiyami',     team: 'research' },
  'visionary-council':    { luminor: 'strategist',     guardian: 'elara',      team: 'research' },
  'visionary-team':       { luminor: 'strategist',     guardian: 'elara',      team: 'research' },
  'game-development':     { luminor: 'motion-designer',      guardian: 'draconia',   team: 'creative' },
  'startup-building':     { luminor: 'strategist',     guardian: 'ino',        team: 'research' },
  'technical-writing':    { luminor: 'voice',    guardian: 'alera',      team: 'writing' },
  'ai-engineering':       { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
  'security':             { luminor: 'debugger',    guardian: 'draconia',   team: 'development' },

  // ---------------------------------------------------------------------------
  // Supabase & Database Skills
  // ---------------------------------------------------------------------------
  'supabase-postgres-best-practices': { luminor: 'systems-architect', guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // OSS Skills (unique to oss/skills directory)
  // ---------------------------------------------------------------------------
  'arcanea-media':        { luminor: 'visual-designer',  guardian: 'lyria',      team: 'creative' },
  'arcanea-orchestrator': { luminor: 'integrator',      guardian: 'ino',        team: 'development' },
  'arcanea-claw-manager': { luminor: 'systems-architect',    guardian: 'lyssandria', team: 'development' },
};

// ---------------------------------------------------------------------------
// Lookup Function
// ---------------------------------------------------------------------------

/**
 * Look up which Luminor should handle a given skill.
 *
 * Normalizes the skill name by:
 *   1. Lowercasing
 *   2. Trimming whitespace
 *   3. Stripping 'arcanea-' prefix when a match without it exists
 *   4. Replacing spaces/underscores with hyphens
 *
 * Returns null if no mapping exists.
 */
export function getLuminorForSkill(skillName: string): SkillLuminorEntry | null {
  const normalized = skillName
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-');

  // Direct match
  if (SKILL_LUMINOR_MAP[normalized]) {
    return SKILL_LUMINOR_MAP[normalized];
  }

  // Try stripping 'arcanea-' prefix
  if (normalized.startsWith('arcanea-')) {
    const stripped = normalized.slice('arcanea-'.length);
    if (SKILL_LUMINOR_MAP[stripped]) {
      return SKILL_LUMINOR_MAP[stripped];
    }
  }

  // Try adding 'arcanea-' prefix
  const prefixed = `arcanea-${normalized}`;
  if (SKILL_LUMINOR_MAP[prefixed]) {
    return SKILL_LUMINOR_MAP[prefixed];
  }

  return null;
}

// ---------------------------------------------------------------------------
// Reverse Lookup: Luminor -> Skills
// ---------------------------------------------------------------------------

/**
 * Get all skills assigned to a specific Luminor.
 * Useful for showing a Luminor's full capability set.
 */
export function getSkillsForLuminor(luminorId: string): string[] {
  const id = luminorId.toLowerCase();
  return Object.entries(SKILL_LUMINOR_MAP)
    .filter(([, entry]) => entry.luminor === id)
    .map(([skill]) => skill);
}

/**
 * Get all skills assigned to a specific Guardian.
 * Useful for showing a Guardian's domain coverage.
 */
export function getSkillsForGuardian(guardianId: string): string[] {
  const id = guardianId.toLowerCase();
  return Object.entries(SKILL_LUMINOR_MAP)
    .filter(([, entry]) => entry.guardian === id)
    .map(([skill]) => skill);
}

/**
 * Get all skills for a team (development, creative, writing, research).
 */
export function getSkillsForTeam(team: string): string[] {
  const t = team.toLowerCase();
  return Object.entries(SKILL_LUMINOR_MAP)
    .filter(([, entry]) => entry.team === t)
    .map(([skill]) => skill);
}
