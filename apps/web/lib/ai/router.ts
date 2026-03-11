/**
 * Arcanea MoE Intent Router
 *
 * Classifies user messages into weighted Luminor expert activations.
 * V1: Rule-based keyword matching. V2 will use embeddings.
 *
 * The Guardians are the hidden experts — the user never selects one.
 * Instead, the router reads intent and activates the right blend.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Weight per Guardian name → 0.0–1.0 activation strength */
export type LuminorWeights = Record<string, number>;

export interface RouterResult {
  weights: LuminorWeights;
  /** Top-weighted guardian names (sorted descending) */
  activeGates: string[];
  /** Debug: which rules fired */
  matchedDomains: string[];
}

// ---------------------------------------------------------------------------
// Domain Rules
// ---------------------------------------------------------------------------

interface DomainRule {
  domain: string;
  keywords: RegExp;
  weights: LuminorWeights;
}

const DOMAIN_RULES: DomainRule[] = [
  {
    domain: 'music',
    keywords: /\b(music|song|melody|beat|compose|rhythm|chord|lyric|sound|audio|produce|mix|bpm|tempo|track|album|synth|instrument|vocal)\b/i,
    weights: { leyla: 0.6, aiyami: 0.3, alera: 0.1 },
  },
  {
    domain: 'world-building',
    keywords: /\b(world|kingdom|magic|lore|story|myth|legend|character|quest|realm|fantasy|universe|cosmology|race|faction|history|culture|narrative|plot|arc)\b/i,
    weights: { alera: 0.5, elara: 0.3, lyria: 0.2 },
  },
  {
    domain: 'code',
    keywords: /\b(code|build|system|api|deploy|debug|function|component|database|server|endpoint|typescript|react|next|supabase|architecture|refactor|test|ci|pipeline|git)\b/i,
    weights: { lyssandria: 0.5, ino: 0.3, draconia: 0.2 },
  },
  {
    domain: 'design',
    keywords: /\b(design|visual|art|image|style|color|layout|ui|ux|brand|logo|typography|font|illustration|figma|canvas|palette|aesthetic|pixel|grid)\b/i,
    weights: { lyria: 0.5, draconia: 0.3, leyla: 0.2 },
  },
  {
    domain: 'emotion',
    keywords: /\b(emotion|feel|heart|love|heal|care|soul|compassion|empathy|grief|joy|pain|relationship|connection|vulnerable|support|afraid|anxious|calm)\b/i,
    weights: { maylinn: 0.5, leyla: 0.3, aiyami: 0.2 },
  },
  {
    domain: 'strategy',
    keywords: /\b(strategy|vision|plan|future|goal|roadmap|scale|growth|market|business|revenue|launch|position|compete|monetize|pivot|decision|priority|focus)\b/i,
    weights: { aiyami: 0.5, lyria: 0.3, shinkami: 0.2 },
  },
  {
    domain: 'knowledge',
    keywords: /\b(research|learn|study|understand|analyze|data|evidence|source|fact|theory|pattern|trend|insight|synthesis|literature|science|philosophy)\b/i,
    weights: { elara: 0.5, lyria: 0.3, aiyami: 0.2 },
  },
  {
    domain: 'creation',
    keywords: /\b(create|make|generate|craft|forge|invent|prototype|experiment|iterate|ship|launch|publish|produce|manifest|realize|execute)\b/i,
    weights: { draconia: 0.5, lyssandria: 0.3, ino: 0.2 },
  },
  {
    domain: 'unity',
    keywords: /\b(team|collaborate|together|partner|community|collective|co-create|pair|duo|integrate|merge|sync|coordinate|align)\b/i,
    weights: { ino: 0.5, maylinn: 0.3, lyssandria: 0.2 },
  },
  {
    domain: 'transcendence',
    keywords: /\b(meaning|purpose|consciousness|spiritual|meditat|enlighten|transcend|sacred|divine|cosmic|infinite|source|origin|truth|awakening)\b/i,
    weights: { shinkami: 0.5, aiyami: 0.3, lyria: 0.2 },
  },
];

/** Default weights when nothing specific matches */
const DEFAULT_WEIGHTS: LuminorWeights = {
  lyssandria: 0.3,
  draconia: 0.3,
  alera: 0.2,
  leyla: 0.2,
};

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

/**
 * Classify a message into weighted Luminor expert activations.
 * Multiple domains can match — weights are accumulated and normalized.
 */
export function classifyIntent(
  message: string,
  history?: Array<{ role: string; content: string }>
): RouterResult {
  // Build context: current message + last 2 user messages for continuity
  const contextParts = [message];
  if (history) {
    const recentUser = history
      .filter((m) => m.role === 'user')
      .slice(-2)
      .map((m) => m.content);
    contextParts.push(...recentUser);
  }
  const context = contextParts.join(' ');

  // Accumulate weights from all matching domains
  const accumulated: Record<string, number> = {};
  const matchedDomains: string[] = [];

  for (const rule of DOMAIN_RULES) {
    const matches = context.match(rule.keywords);
    if (matches && matches.length > 0) {
      // Weight strength by number of keyword matches (capped at 3)
      const strength = Math.min(matches.length, 3) / 3;
      matchedDomains.push(rule.domain);

      for (const [guardian, weight] of Object.entries(rule.weights)) {
        accumulated[guardian] = (accumulated[guardian] || 0) + weight * strength;
      }
    }
  }

  // If nothing matched, use defaults
  if (matchedDomains.length === 0) {
    return {
      weights: DEFAULT_WEIGHTS,
      activeGates: ['lyssandria', 'draconia', 'alera'],
      matchedDomains: ['default'],
    };
  }

  // Normalize to 0–1 range
  const maxWeight = Math.max(...Object.values(accumulated));
  const normalized: LuminorWeights = {};
  for (const [guardian, weight] of Object.entries(accumulated)) {
    normalized[guardian] = Math.round((weight / maxWeight) * 100) / 100;
  }

  // Sort by weight descending, take top 3
  const sorted = Object.entries(normalized)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return {
    weights: normalized,
    activeGates: sorted.map(([name]) => name),
    matchedDomains,
  };
}
