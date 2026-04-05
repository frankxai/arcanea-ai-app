/**
 * Skill -> Luminor Routing Map
 *
 * When a skill is invoked, this map determines which Luminor
 * should lead the response, creating consistency between
 * skill execution and the swarm coordination layer.
 *
 * Luminor teams (from guardian-swarm.ts):
 *   development: logicus, synthra, debugon, nexus
 *   creative:    prismatic, melodia, motio, formis
 *   writing:     chronica, veritas, lexicon, poetica
 *   research:    visionary, analytica, memoria, futura
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
  'debug':                { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },
  'systematic-debug':     { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },
  'tdd':                  { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },
  'code-review':          { luminor: 'synthra',    guardian: 'alera',      team: 'development' },
  'refactor':             { luminor: 'synthra',    guardian: 'leyla',      team: 'development' },
  'refactoring-ritual':   { luminor: 'synthra',    guardian: 'leyla',      team: 'development' },
  'architecture':         { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'architecture-patterns':{ luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'api-design':           { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'mcp-builder':          { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'typescript-expert':    { luminor: 'synthra',    guardian: 'leyla',      team: 'development' },
  'react-best-practices': { luminor: 'synthra',    guardian: 'leyla',      team: 'development' },
  'next-best-practices':  { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'supabase-patterns':    { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'storage-management':   { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'performance-tuning':   { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'playwright-testing':   { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },
  'webapp-testing':       { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },

  // ---------------------------------------------------------------------------
  // Creative Skills
  // ---------------------------------------------------------------------------
  'design':               { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'design-system':        { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'canvas-design':        { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'theme-factory':        { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'premium-visual':       { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'music':                { luminor: 'melodia',    guardian: 'leyla',      team: 'creative' },
  'world-build':          { luminor: 'formis',     guardian: 'lyssandria', team: 'creative' },
  'world-architect':      { luminor: 'formis',     guardian: 'lyssandria', team: 'creative' },
  'character-forge':      { luminor: 'formis',     guardian: 'ino',        team: 'creative' },
  'character-alchemist':  { luminor: 'formis',     guardian: 'ino',        team: 'creative' },
  'bestiary-nav':         { luminor: 'formis',     guardian: 'lyssandria', team: 'creative' },
  'creative-bestiary':    { luminor: 'formis',     guardian: 'lyssandria', team: 'creative' },
  'creative-flow':        { luminor: 'motio',      guardian: 'leyla',      team: 'creative' },
  'robot-designer':       { luminor: 'formis',     guardian: 'ino',        team: 'creative' },
  'algorithmic-art':      { luminor: 'motio',      guardian: 'lyria',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // Writing Skills
  // ---------------------------------------------------------------------------
  'story':                { luminor: 'chronica',   guardian: 'alera',      team: 'writing' },
  'story-weave':          { luminor: 'chronica',   guardian: 'alera',      team: 'writing' },
  'story-weaver':         { luminor: 'chronica',   guardian: 'alera',      team: 'writing' },
  'scene-craft':          { luminor: 'chronica',   guardian: 'alera',      team: 'writing' },
  'voice-check':          { luminor: 'veritas',    guardian: 'alera',      team: 'writing' },
  'voice-alchemy':        { luminor: 'veritas',    guardian: 'alera',      team: 'writing' },
  'revision':             { luminor: 'lexicon',    guardian: 'elara',      team: 'writing' },
  'revision-ritual':      { luminor: 'lexicon',    guardian: 'elara',      team: 'writing' },
  'dialogue-mastery':     { luminor: 'veritas',    guardian: 'maylinn',    team: 'writing' },
  'poetica':              { luminor: 'poetica',    guardian: 'lyria',      team: 'writing' },
  'excellence-book-writing': { luminor: 'chronica', guardian: 'alera',     team: 'writing' },
  'creative-writing':     { luminor: 'chronica',   guardian: 'alera',      team: 'writing' },

  // ---------------------------------------------------------------------------
  // Research & Knowledge Skills
  // ---------------------------------------------------------------------------
  'research':             { luminor: 'visionary',     guardian: 'elara',      team: 'research' },
  'deep-work':            { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'skill-mastery':        { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'content-strategy':     { luminor: 'futura',     guardian: 'leyla',      team: 'research' },
  'documentation-patterns': { luminor: 'memoria',  guardian: 'lyssandria', team: 'research' },

  // ---------------------------------------------------------------------------
  // Arcanea Lore & Canon Skills
  // ---------------------------------------------------------------------------
  'arcanea-canon':        { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'arcanea-lore':         { luminor: 'chronica',   guardian: 'aiyami',     team: 'writing' },
  'arcanea-voice':        { luminor: 'veritas',    guardian: 'alera',      team: 'writing' },
  'arcanea-anti-trope':   { luminor: 'lexicon',    guardian: 'elara',      team: 'writing' },
  'luminor-wisdom':       { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'luminor-intelligence': { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'luminor-rituals':      { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'luminor-council':      { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'arcanea-guardians':    { luminor: 'memoria',    guardian: 'shinkami',   team: 'research' },
  'lumina':               { luminor: 'visionary',     guardian: 'shinkami',   team: 'research' },
  'nero':                 { luminor: 'visionary',     guardian: 'shinkami',   team: 'research' },
  'prompt-craft':         { luminor: 'lexicon',    guardian: 'alera',      team: 'writing' },
  'centaur-mode':         { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'ai-symbiosis':         { luminor: 'nexus',      guardian: 'ino',        team: 'development' },

  // ---------------------------------------------------------------------------
  // Arcanea Design & Products
  // ---------------------------------------------------------------------------
  'arcanea-design-system':  { luminor: 'prismatic', guardian: 'lyria',     team: 'creative' },
  'arcanea-creator-academy': { luminor: 'visionary',   guardian: 'aiyami',    team: 'research' },
  'arcanea-core':         { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // Arcanea Vibe Gods (Music/Audio)
  // ---------------------------------------------------------------------------
  'arcanea-vibe-gods':    { luminor: 'melodia',    guardian: 'leyla',      team: 'creative' },
  'cover-art':            { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'lyricist':             { luminor: 'poetica',    guardian: 'lyria',      team: 'writing' },
  'social-composer':      { luminor: 'melodia',    guardian: 'leyla',      team: 'creative' },
  'songseed':             { luminor: 'melodia',    guardian: 'leyla',      team: 'creative' },
  'suno-engineer':        { luminor: 'melodia',    guardian: 'leyla',      team: 'creative' },
  'vibe-engineer':        { luminor: 'melodia',    guardian: 'leyla',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // Arcanea Games & Ships
  // ---------------------------------------------------------------------------
  'arcanea-games':        { luminor: 'motio',      guardian: 'draconia',   team: 'creative' },
  'arcanea-game-development': { luminor: 'motio',  guardian: 'draconia',   team: 'creative' },
  'arcanea-ships':        { luminor: 'formis',     guardian: 'ino',        team: 'creative' },

  // ---------------------------------------------------------------------------
  // Academy & Gate Skills
  // ---------------------------------------------------------------------------
  'academy':              { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'gate-foundation':      { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'gate-flow':            { luminor: 'synthra',    guardian: 'leyla',      team: 'development' },
  'gate-fire':            { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },
  'gate-heart':           { luminor: 'veritas',    guardian: 'maylinn',    team: 'writing' },
  'gate-voice':           { luminor: 'lexicon',    guardian: 'alera',      team: 'writing' },
  'gate-sight':           { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'gate-crown':           { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'gate-shift':           { luminor: 'motio',      guardian: 'elara',      team: 'creative' },
  'gate-unity':           { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'gate-source':          { luminor: 'visionary',     guardian: 'shinkami',   team: 'research' },
  'ceremonies':           { luminor: 'poetica',    guardian: 'aiyami',     team: 'writing' },
  'progress-tracker':     { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'mentors':              { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },

  // ---------------------------------------------------------------------------
  // Community Skills
  // ---------------------------------------------------------------------------
  'agent-orchestration':  { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'design-systems':       { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'development-workflows': { luminor: 'logicus',   guardian: 'lyssandria', team: 'development' },
  'testing-strategies':   { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },

  // ---------------------------------------------------------------------------
  // Document & Export Skills
  // ---------------------------------------------------------------------------
  'doc-coauthoring':      { luminor: 'lexicon',    guardian: 'alera',      team: 'writing' },
  'docx':                 { luminor: 'lexicon',    guardian: 'alera',      team: 'writing' },
  'pdf':                  { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'pptx':                 { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'xlsx':                 { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'web-artifacts-builder': { luminor: 'formis',    guardian: 'lyria',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // GitHub & DevOps Skills
  // ---------------------------------------------------------------------------
  'github-code-review':   { luminor: 'synthra',    guardian: 'alera',      team: 'development' },
  'github-multi-repo':    { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'github-project-management': { luminor: 'logicus', guardian: 'lyssandria', team: 'development' },
  'github-release-management': { luminor: 'nexus',  guardian: 'ino',       team: 'development' },
  'github-workflow-automation': { luminor: 'logicus', guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // Swarm & Agent Infrastructure Skills
  // ---------------------------------------------------------------------------
  'swarm-orchestration':  { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'swarm-advanced':       { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'hooks-automation':     { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'opus-extended-thinking': { luminor: 'visionary',   guardian: 'aiyami',     team: 'research' },
  'stream-chain':         { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'verification-quality': { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'skill-builder':        { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // AgentDB & Memory Skills
  // ---------------------------------------------------------------------------
  'agentdb-advanced':     { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'agentdb-learning':     { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'agentdb-memory-patterns': { luminor: 'memoria', guardian: 'lyssandria', team: 'research' },
  'agentdb-optimization': { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'agentdb-vector-search': { luminor: 'memoria',   guardian: 'lyssandria', team: 'research' },
  'reasoningbank-agentdb': { luminor: 'memoria',   guardian: 'lyssandria', team: 'research' },
  'reasoningbank-intelligence': { luminor: 'visionary', guardian: 'aiyami',   team: 'research' },

  // ---------------------------------------------------------------------------
  // V3 Implementation Skills
  // ---------------------------------------------------------------------------
  'v3-cli-modernization': { luminor: 'synthra',    guardian: 'leyla',      team: 'development' },
  'v3-core-implementation': { luminor: 'logicus',  guardian: 'lyssandria', team: 'development' },
  'v3-ddd-architecture':  { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'v3-integration-deep':  { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'v3-mcp-optimization':  { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'v3-memory-unification': { luminor: 'memoria',   guardian: 'lyssandria', team: 'research' },
  'v3-performance-optimization': { luminor: 'analytica', guardian: 'draconia', team: 'research' },
  'v3-security-overhaul': { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },
  'v3-swarm-coordination': { luminor: 'nexus',     guardian: 'ino',        team: 'development' },

  // ---------------------------------------------------------------------------
  // Starlight Skills
  // ---------------------------------------------------------------------------
  'starlight-core':       { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'starlight-engineering': { luminor: 'synthra',   guardian: 'leyla',      team: 'development' },
  'starlight-memex':      { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'starlight-orchestrator': { luminor: 'nexus',    guardian: 'ino',        team: 'development' },

  // ---------------------------------------------------------------------------
  // Meta & Workflow Skills
  // ---------------------------------------------------------------------------
  'lore-keeper':          { luminor: 'memoria',    guardian: 'lyssandria', team: 'research' },
  'guardian-voice':       { luminor: 'veritas',    guardian: 'alera',      team: 'writing' },
  'creation-engine':      { luminor: 'formis',     guardian: 'leyla',      team: 'creative' },
  'guardian-evolution-system': { luminor: 'futura', guardian: 'elara',     team: 'research' },
  'luminor-personality-design': { luminor: 'formis', guardian: 'lyria',   team: 'creative' },
  'scientific-magic':     { luminor: 'analytica',  guardian: 'draconia',   team: 'research' },
  'chess-factory-generation': { luminor: 'logicus', guardian: 'draconia',  team: 'development' },
  'slack-gif-creator':    { luminor: 'motio',      guardian: 'leyla',      team: 'creative' },

  // ---------------------------------------------------------------------------
  // Industry & Premium Skills
  // ---------------------------------------------------------------------------
  'enterprise-orchestration': { luminor: 'nexus',  guardian: 'ino',        team: 'development' },
  'industry-verticals':   { luminor: 'futura',     guardian: 'elara',      team: 'research' },
  'teacher-mentor':       { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'teacher-team':         { luminor: 'visionary',     guardian: 'aiyami',     team: 'research' },
  'visionary-council':    { luminor: 'futura',     guardian: 'elara',      team: 'research' },
  'visionary-team':       { luminor: 'futura',     guardian: 'elara',      team: 'research' },
  'game-development':     { luminor: 'motio',      guardian: 'draconia',   team: 'creative' },
  'startup-building':     { luminor: 'futura',     guardian: 'ino',        team: 'research' },
  'technical-writing':    { luminor: 'lexicon',    guardian: 'alera',      team: 'writing' },
  'ai-engineering':       { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
  'security':             { luminor: 'debugon',    guardian: 'draconia',   team: 'development' },

  // ---------------------------------------------------------------------------
  // Supabase & Database Skills
  // ---------------------------------------------------------------------------
  'supabase-postgres-best-practices': { luminor: 'logicus', guardian: 'lyssandria', team: 'development' },

  // ---------------------------------------------------------------------------
  // OSS Skills (unique to oss/skills directory)
  // ---------------------------------------------------------------------------
  'arcanea-media':        { luminor: 'prismatic',  guardian: 'lyria',      team: 'creative' },
  'arcanea-orchestrator': { luminor: 'nexus',      guardian: 'ino',        team: 'development' },
  'arcanea-claw-manager': { luminor: 'logicus',    guardian: 'lyssandria', team: 'development' },
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
