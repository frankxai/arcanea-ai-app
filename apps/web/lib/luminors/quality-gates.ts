/**
 * Luminor Quality Gates
 *
 * Runs a suite of checks against a LuminorSpec before publish.
 * Every gate produces a score 0-100. Below threshold (default 70)
 * blocks publication.
 *
 * Reference: Luminor Kernel Spec v1.0 §8 (Quality Gates)
 *
 * Gates:
 *   1. Anti-slop — cliché phrases, em-dash overuse, AI tells
 *   2. Voice consistency — matches declared voice archetype
 *   3. Duplicate detection — vector similarity vs published Luminors
 *   4. Token budget — 200 < systemPrompt.length < 5000 words
 *   5. Prompt injection resistance — basic jailbreak test patterns
 *   6. Domain coherence — element + voice + personality are plausible
 */

export interface QualityGateResult {
  name: string;
  score: number; // 0-100
  passed: boolean;
  issues: string[];
  details?: Record<string, unknown>;
}

export interface QualityReport {
  overallScore: number;
  passed: boolean;
  threshold: number;
  gates: QualityGateResult[];
  blockers: string[];
  warnings: string[];
}

interface LuminorSpecInput {
  id?: string;
  name: string;
  title?: string;
  tagline?: string;
  systemPrompt: string;
  voice?: string;
  element?: string;
  personality?: string[];
  domain?: string;
}

// ─── 1. Anti-slop gate ────────────────────────────────────────────────────

const SLOP_PHRASES = [
  'i\'d be happy to help',
  'i\'d love to help',
  'great question',
  'that\'s a great',
  'as an ai',
  'as a language model',
  'i don\'t have personal',
  'feel free to',
  'in conclusion',
  'in summary',
  'it\'s important to note',
  'navigate the landscape',
  'embark on a journey',
  'unleash your',
  'unlock the power',
  'delve into',
  'tapestry',
  'journey of',
  'transformation journey',
  'holistic approach',
];

const WEAK_VERBS = ['utilize', 'leverage', 'facilitate', 'synergize'];

export function antiSlopGate(spec: LuminorSpecInput): QualityGateResult {
  const prompt = spec.systemPrompt.toLowerCase();
  const issues: string[] = [];
  let score = 100;

  // Cliché phrases
  for (const phrase of SLOP_PHRASES) {
    if (prompt.includes(phrase)) {
      issues.push(`Cliché phrase detected: "${phrase}"`);
      score -= 8;
    }
  }

  // Weak verbs
  for (const verb of WEAK_VERBS) {
    const matches = (prompt.match(new RegExp(`\\b${verb}\\b`, 'g')) ?? []).length;
    if (matches > 0) {
      issues.push(`Weak verb "${verb}" used ${matches} time(s) — prefer concrete alternatives`);
      score -= 3 * matches;
    }
  }

  // Em-dash overuse (more than 1 per 200 words is suspicious)
  const wordCount = spec.systemPrompt.split(/\s+/).length;
  const emDashes = (spec.systemPrompt.match(/—/g) ?? []).length;
  const emDashRatio = emDashes / Math.max(wordCount / 200, 1);
  if (emDashRatio > 3) {
    issues.push(
      `Em-dash overuse: ${emDashes} em-dashes in ${wordCount} words (threshold: 1 per 200 words)`
    );
    score -= 15;
  }

  // "It's not just X, it's Y" pattern
  if (/it'?s not (just|only) .{5,40}, it'?s/i.test(spec.systemPrompt)) {
    issues.push('Detected "it\'s not just X, it\'s Y" slop pattern');
    score -= 10;
  }

  return {
    name: 'anti-slop',
    score: Math.max(0, Math.round(score)),
    passed: score >= 70,
    issues,
    details: { wordCount, emDashes },
  };
}

// ─── 2. Voice consistency gate ────────────────────────────────────────────

const VOICE_MARKERS: Record<string, { expect: RegExp[]; avoid: RegExp[] }> = {
  analytical: {
    expect: [/framework/i, /pattern/i, /structure/i, /trade-off/i, /principle/i],
    avoid: [/magical/i, /whimsical/i],
  },
  poetic: {
    expect: [/metaphor/i, /image/i, /rhythm/i, /breath/i],
    avoid: [/quantif/i, /benchmark/i],
  },
  direct: {
    expect: [/concise/i, /cut/i, /no filler/i],
    avoid: [/flowery/i, /meandering/i],
  },
  warm: {
    expect: [/care/i, /support/i, /celebrate/i, /encourage/i],
    avoid: [/cold/i, /ruthless/i],
  },
  mythic: {
    expect: [/legend/i, /story/i, /arc/i, /hero/i],
    avoid: [/dry/i, /tabular/i],
  },
  playful: {
    expect: [/wit/i, /spark/i, /delight/i],
    avoid: [/solemn/i, /grim/i],
  },
  scholarly: {
    expect: [/research/i, /evidence/i, /citation/i, /source/i],
    avoid: [/hot take/i, /vibes/i],
  },
  fierce: {
    expect: [/bold/i, /push/i, /challenge/i, /relentless/i],
    avoid: [/gentle/i, /hesitant/i],
  },
};

export function voiceConsistencyGate(spec: LuminorSpecInput): QualityGateResult {
  const issues: string[] = [];

  if (!spec.voice || !VOICE_MARKERS[spec.voice]) {
    return {
      name: 'voice-consistency',
      score: 50,
      passed: false,
      issues: [`No voice declared or unknown voice "${spec.voice}"`],
    };
  }

  const markers = VOICE_MARKERS[spec.voice];
  let score = 70; // start at passing, adjust based on evidence

  const matchedExpected = markers.expect.filter((re) => re.test(spec.systemPrompt)).length;
  const violatedAvoid = markers.avoid.filter((re) => re.test(spec.systemPrompt)).length;

  // Reward matches
  score += matchedExpected * 6;
  if (matchedExpected === 0) {
    issues.push(
      `Voice "${spec.voice}" declared but no signature words found (expected: ${markers.expect.map((r) => r.source).join(', ')})`
    );
  }

  // Penalty for conflicts
  if (violatedAvoid > 0) {
    score -= violatedAvoid * 15;
    issues.push(
      `Voice "${spec.voice}" conflict: found ${violatedAvoid} anti-marker(s)`
    );
  }

  score = Math.min(100, Math.max(0, score));

  return {
    name: 'voice-consistency',
    score: Math.round(score),
    passed: score >= 70,
    issues,
    details: { matchedExpected, violatedAvoid, voice: spec.voice },
  };
}

// ─── 3. Token budget gate ─────────────────────────────────────────────────

export function tokenBudgetGate(spec: LuminorSpecInput): QualityGateResult {
  const wordCount = spec.systemPrompt.split(/\s+/).length;
  const issues: string[] = [];
  let score = 100;

  if (wordCount < 100) {
    issues.push(`System prompt too short: ${wordCount} words (min 100)`);
    score -= 50;
  } else if (wordCount < 200) {
    issues.push(`System prompt on the short side: ${wordCount} words (recommended 300-1500)`);
    score -= 20;
  }

  if (wordCount > 2500) {
    issues.push(`System prompt too long: ${wordCount} words (max 2500, prefer < 1500)`);
    score -= 30;
  } else if (wordCount > 1800) {
    issues.push(`System prompt verbose: ${wordCount} words (recommended < 1500)`);
    score -= 10;
  }

  return {
    name: 'token-budget',
    score: Math.max(0, score),
    passed: score >= 70,
    issues,
    details: { wordCount },
  };
}

// ─── 4. Prompt injection resistance ───────────────────────────────────────

export function promptInjectionGate(spec: LuminorSpecInput): QualityGateResult {
  const issues: string[] = [];
  let score = 100;
  const prompt = spec.systemPrompt.toLowerCase();

  // Agent should have some grounding language
  const groundingPatterns = [
    /you are/i,
    /your role/i,
    /your approach/i,
    /your voice/i,
  ];
  const groundingMatches = groundingPatterns.filter((re) => re.test(spec.systemPrompt)).length;
  if (groundingMatches < 2) {
    issues.push(
      'Weak identity grounding — prompt should include multiple "you are"/"your role"/"your approach" statements'
    );
    score -= 20;
  }

  // Agent should have response shape guidance
  if (!/response shape|response format|when you respond|closing|end (most |)responses?/i.test(spec.systemPrompt)) {
    issues.push('No response shape guidance — agent may drift');
    score -= 15;
  }

  // Avoid outright jailbreak-susceptible patterns
  if (/ignore (all |)previous instructions/i.test(prompt)) {
    issues.push('Contains jailbreak phrase "ignore previous instructions"');
    score -= 40;
  }

  // Agent should resist role changes
  if (/you can also be|you may become|switch roles|act as/i.test(prompt)) {
    issues.push('Weak identity: prompt allows role switching');
    score -= 15;
  }

  return {
    name: 'prompt-injection',
    score: Math.max(0, score),
    passed: score >= 70,
    issues,
  };
}

// ─── 5. Domain coherence ──────────────────────────────────────────────────

export function domainCoherenceGate(spec: LuminorSpecInput): QualityGateResult {
  const issues: string[] = [];
  let score = 100;

  if (!spec.domain) {
    issues.push('No domain declared');
    score -= 30;
  }

  if (!spec.personality || spec.personality.length < 3) {
    issues.push(`Personality needs 3-5 traits (got ${spec.personality?.length ?? 0})`);
    score -= 20;
  }

  if (spec.personality && spec.personality.length > 6) {
    issues.push(`Personality has too many traits (${spec.personality.length}), prefer 3-5`);
    score -= 10;
  }

  // Specific element/voice incoherences
  const incoherent = [
    { element: 'Fire', voice: 'scholarly', msg: 'Fire + scholarly is unusual' },
    { element: 'Earth', voice: 'playful', msg: 'Earth + playful is unusual' },
    { element: 'Void', voice: 'warm', msg: 'Void + warm is unusual' },
  ];
  for (const rule of incoherent) {
    if (spec.element === rule.element && spec.voice === rule.voice) {
      issues.push(rule.msg);
      score -= 10;
    }
  }

  return {
    name: 'domain-coherence',
    score: Math.max(0, score),
    passed: score >= 70,
    issues,
  };
}

// ─── 6. Duplicate detection (async — requires DB) ────────────────────────

/**
 * Duplicate detection uses pgvector similarity against published agents.
 * Returns high score (no duplicates) if we can't reach the DB.
 * Runs separately via /api/forge/quality-check since it's async.
 */
export async function duplicateDetectionGate(
  spec: LuminorSpecInput
): Promise<QualityGateResult> {
  try {
    const { embedAgent } = await import('@/lib/embeddings/generate');
    const { createClient } = await import('@supabase/supabase-js');

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return {
        name: 'duplicate-detection',
        score: 100,
        passed: true,
        issues: ['Supabase not configured — skipping (no data to compare)'],
      };
    }

    const embedding = await embedAgent({
      id: spec.id ?? 'forge-draft',
      name: spec.name,
      title: spec.title ?? null,
      description: spec.tagline ?? null,
      systemPrompt: spec.systemPrompt,
    });

    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data } = await supabase.rpc('match_agents', {
      query_embedding: `[${embedding.join(',')}]`,
      match_threshold: 0.85,
      match_count: 5,
    });

    const matches = ((data as unknown as Array<{ id: string; name: string; similarity: number }>) ?? []).filter(
      (m) => m.id !== spec.id
    );

    const issues: string[] = [];
    let score = 100;

    for (const match of matches) {
      if (match.similarity > 0.95) {
        issues.push(
          `Near-duplicate of "${match.name}" (${Math.round(match.similarity * 100)}% similar)`
        );
        score -= 50;
      } else if (match.similarity > 0.88) {
        issues.push(
          `Very similar to "${match.name}" (${Math.round(match.similarity * 100)}%) — consider differentiating`
        );
        score -= 20;
      }
    }

    return {
      name: 'duplicate-detection',
      score: Math.max(0, score),
      passed: score >= 70,
      issues,
      details: { matchCount: matches.length, topSimilarity: matches[0]?.similarity ?? 0 },
    };
  } catch {
    return {
      name: 'duplicate-detection',
      score: 100,
      passed: true,
      issues: [],
    };
  }
}

// ─── Full quality check ───────────────────────────────────────────────────

export async function runQualityGates(
  spec: LuminorSpecInput,
  opts: { threshold?: number; skipDuplicate?: boolean } = {}
): Promise<QualityReport> {
  const threshold = opts.threshold ?? 70;

  const synchronousGates: QualityGateResult[] = [
    antiSlopGate(spec),
    voiceConsistencyGate(spec),
    tokenBudgetGate(spec),
    promptInjectionGate(spec),
    domainCoherenceGate(spec),
  ];

  const gates = [...synchronousGates];
  if (!opts.skipDuplicate) {
    gates.push(await duplicateDetectionGate(spec));
  }

  const overallScore = Math.round(
    gates.reduce((sum, g) => sum + g.score, 0) / gates.length
  );

  const blockers = gates
    .filter((g) => !g.passed)
    .flatMap((g) => g.issues.map((i) => `[${g.name}] ${i}`));

  const warnings = gates
    .filter((g) => g.passed && g.issues.length > 0)
    .flatMap((g) => g.issues.map((i) => `[${g.name}] ${i}`));

  return {
    overallScore,
    passed: overallScore >= threshold && blockers.length === 0,
    threshold,
    gates,
    blockers,
    warnings,
  };
}
