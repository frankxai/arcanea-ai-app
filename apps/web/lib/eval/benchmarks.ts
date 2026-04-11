/**
 * Luminor Eval Benchmarks
 *
 * A seed benchmark suite used by the Eval Arena to score Luminors
 * against baseline models on standardized tasks.
 *
 * Each benchmark has:
 *   - domain: which LuminorSpec.domain it tests
 *   - tasks: 3-5 concrete prompts
 *   - rubric: what the judge evaluates
 *
 * The Arena runs each Luminor against all benchmarks in its domain,
 * uses Claude Opus 4.6 as judge, and produces a score 0-100.
 */

export interface BenchmarkTask {
  id: string;
  prompt: string;
  context?: string;
}

export interface Benchmark {
  id: string;
  domain: string;
  title: string;
  description: string;
  tasks: BenchmarkTask[];
  rubric: string;
}

export const BENCHMARKS: Benchmark[] = [
  {
    id: 'architecture-v1',
    domain: 'architecture',
    title: 'Systems Architecture Benchmark v1',
    description: 'Tests ability to design systems under real constraints.',
    tasks: [
      {
        id: 'arch-1',
        prompt:
          'Design a rate-limited job queue for 10M events/day with fair scheduling across 500 tenants. Sketch the architecture, pick the storage layer, explain the consistency model.',
      },
      {
        id: 'arch-2',
        prompt:
          'A team has a Postgres database growing 100GB/month. They want to add vector search for semantic retrieval over 50M documents. Recommend an architecture.',
      },
      {
        id: 'arch-3',
        prompt:
          "Our monolith has 30+ services couplings. Design a first-step decomposition that doesn't require a full microservices migration.",
      },
    ],
    rubric: `Score each response 0-100 on:
- Technical correctness (does it work?)
- Specificity (concrete components, not generic principles)
- Trade-off awareness (what's being sacrificed and why)
- Production realism (addresses auth, failure modes, scaling)
- Signal density (no filler, every sentence advances the design)`,
  },

  {
    id: 'code-craft-v1',
    domain: 'code',
    title: 'Code Craft Benchmark v1',
    description: 'Tests clean implementation, refactoring, code review.',
    tasks: [
      {
        id: 'code-1',
        prompt:
          'Refactor this function to be more testable. Explain your reasoning:\n\n```typescript\nfunction processOrder(order) { const tax = order.total * 0.08; const shipping = order.items.length * 5; order.final = order.total + tax + shipping; db.save(order); email.send(order.userId, "confirmation"); return order; }\n```',
      },
      {
        id: 'code-2',
        prompt:
          'Write a TypeScript utility that debounces an async function but cancels in-flight requests when a new call comes in.',
      },
    ],
    rubric: `Score each response 0-100 on:
- Correctness (does the code work as described?)
- Craftsmanship (naming, structure, clarity)
- TypeScript idioms (strict types, no any)
- Explanation quality (reasoning, not just code)
- Respect for the reader (would a junior engineer understand?)`,
  },

  {
    id: 'debugging-v1',
    domain: 'debugging',
    title: 'Debugging Benchmark v1',
    description: 'Tests root cause analysis and diagnosis methodology.',
    tasks: [
      {
        id: 'debug-1',
        prompt:
          'A React app leaks memory. DevTools shows detached DOM nodes growing over time. The leak only happens on a specific tab (Tab B, which renders a paginated table with 500 rows/page). What are your top 3 hypotheses and how would you verify each?',
      },
      {
        id: 'debug-2',
        prompt:
          'Production API p99 latency jumped from 200ms to 2000ms 3 hours ago. No deploys. No config changes. What do you investigate, in what order, and why?',
      },
    ],
    rubric: `Score each response 0-100 on:
- Hypothesis quality (specific, testable)
- Investigation order (high-value first)
- Tool awareness (what you'd actually run)
- Failure mode coverage
- No guesses without verification plans`,
  },

  {
    id: 'narrative-v1',
    domain: 'narrative',
    title: 'Storytelling Benchmark v1',
    description: 'Tests narrative structure, character, world-building.',
    tasks: [
      {
        id: 'narr-1',
        prompt:
          'A protagonist who has lost their voice must warn a village of an approaching threat. Write the opening paragraph in a way that makes the stakes immediate without infodumping.',
      },
      {
        id: 'narr-2',
        prompt:
          "A magic system has one rule: any spell you cast, someone else pays the price. Design the three opening scenes that introduce this to readers without the narrator ever explaining it.",
      },
    ],
    rubric: `Score each response 0-100 on:
- Show vs tell (no infodumping)
- Character specificity (not a generic hero)
- Prose craft (rhythm, image, restraint)
- Subtext (what's underneath what's said)
- Hook (would you turn the page?)`,
  },

  {
    id: 'research-v1',
    domain: 'knowledge',
    title: 'Deep Research Benchmark v1',
    description: 'Tests synthesis, source evaluation, insight.',
    tasks: [
      {
        id: 'research-1',
        prompt:
          "Summarize the three main arguments for and against running LLMs locally vs via API. Be concrete about trade-offs, not abstract.",
      },
      {
        id: 'research-2',
        prompt:
          "Give me a 5-point briefing on the state of agent memory architectures in 2026 — what's SOTA, what's unproven, what's hype.",
      },
    ],
    rubric: `Score each response 0-100 on:
- Synthesis (patterns, not just bullets)
- Concrete examples (specific products/papers/teams)
- Trade-off honesty (no false balance)
- Signal-to-noise (cut everything generic)
- Decision-usefulness (can someone act on it?)`,
  },
];

export function getBenchmarksForDomain(domain: string): Benchmark[] {
  return BENCHMARKS.filter((b) => b.domain === domain);
}

export function getAllBenchmarks(): Benchmark[] {
  return BENCHMARKS;
}
