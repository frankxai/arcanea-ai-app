/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Voice Dashboard — Workflows
 *
 * Quick-launch workflow definitions. Each workflow has an id, label, hint,
 * intent, and a target — either a route, a CLI command (delivered via the
 * intent bus to the connected daemon), or a remote service URL.
 *
 * Workflows are the bridge between voice/clap intents and concrete actions.
 * The same definition powers: workflow grid tiles, command palette items,
 * voice intent matchers.
 */

export type WorkflowAction =
  | { kind: 'route'; href: string }
  | { kind: 'external'; url: string }
  | { kind: 'cli'; command: string; copyOnly?: boolean };

export interface Workflow {
  id: string;
  label: string;
  hint: string;
  voiceTriggers: string[];
  category: 'create' | 'review' | 'ops' | 'discover';
  action: WorkflowAction;
  /** Hex color for category dot. */
  color: string;
}

export const WORKFLOWS: Workflow[] = [
  {
    id: 'open-author-team',
    label: 'Author Team',
    hint: 'Spin up the multi-agent fiction roster',
    voiceTriggers: ['author team', 'open author', 'arcanea author'],
    category: 'create',
    action: { kind: 'cli', command: '/arcanea-author', copyOnly: true },
    color: 'var(--arc-brand-arcanean-gold)',
  },
  {
    id: 'open-orchestra',
    label: 'Orchestra',
    hint: 'Multi-CLI routing brain',
    voiceTriggers: ['orchestra', 'arcanea orchestra', 'a o'],
    category: 'ops',
    action: { kind: 'cli', command: '/ao', copyOnly: true },
    color: 'var(--arc-brand-atlantean-teal)',
  },
  {
    id: 'open-library',
    label: 'Open Library',
    hint: 'Browse all books and chapters',
    voiceTriggers: ['library', 'open library', 'show books'],
    category: 'discover',
    action: { kind: 'route', href: '/books' },
    color: 'var(--arc-void)',
  },
  {
    id: 'open-las-tierras',
    label: 'Las Tierras de Luz',
    hint: 'Today’s legend — read or continue',
    voiceTriggers: ['las tierras', 'tierras de luz', 'mira'],
    category: 'discover',
    action: { kind: 'route', href: '/books/las-tierras-de-luz' },
    color: 'var(--arc-brand-arcanean-gold)',
  },
  {
    id: 'open-worlds',
    label: 'Living Worlds',
    hint: 'World graph — cosmologies and Realms',
    voiceTriggers: ['worlds', 'world graph', 'living worlds'],
    category: 'discover',
    action: { kind: 'route', href: '/worlds' },
    color: 'var(--arc-earth)',
  },
  {
    id: 'design-brief',
    label: 'Design Brief',
    hint: 'Start a new page design brief',
    voiceTriggers: ['design brief', 'new design', 'start brief'],
    category: 'create',
    action: { kind: 'cli', command: '/design-brief', copyOnly: true },
    color: 'var(--arc-brand-atlantean-teal)',
  },
  {
    id: 'pulse',
    label: 'Pulse',
    hint: 'Daily ops rhythm — gates, scorecard, agent rank',
    voiceTriggers: ['pulse', 'daily pulse'],
    category: 'ops',
    action: { kind: 'cli', command: '/pulse', copyOnly: true },
    color: 'var(--arc-fire)',
  },
  {
    id: 'sis-recall',
    label: 'SIS Recall',
    hint: 'Search the Starlight Intelligence System',
    voiceTriggers: ['sis', 'recall', 'remember'],
    category: 'review',
    action: { kind: 'cli', command: '/sis recent', copyOnly: true },
    color: 'var(--arc-text-primary)',
  },
  {
    id: 'github-prs',
    label: 'GitHub PRs',
    hint: 'Open PR review board',
    voiceTriggers: ['github', 'pull requests', 'open p rs'],
    category: 'ops',
    action: { kind: 'external', url: 'https://github.com/frankxai/arcanea-ai-app/pulls' },
    color: 'var(--arc-text-primary)',
  },
  {
    id: 'vercel-prod',
    label: 'Vercel Production',
    hint: 'Latest deployments',
    voiceTriggers: ['vercel', 'deployments', 'production'],
    category: 'ops',
    action: {
      kind: 'external',
      url: 'https://vercel.com/starlight-intelligence/arcanea-ai-appx',
    },
    color: 'var(--arc-text-primary)',
  },
  {
    id: 'voice-page',
    label: 'Voice Home',
    hint: 'Back to the voice landing page',
    voiceTriggers: ['voice home', 'voice page'],
    category: 'discover',
    action: { kind: 'route', href: '/voice' },
    color: 'var(--arc-brand-atlantean-teal)',
  },
  {
    id: 'studio-vault',
    label: 'Studio Vault',
    hint: 'Captured ideas and notes',
    voiceTriggers: ['vault', 'studio vault', 'open vault'],
    category: 'review',
    action: { kind: 'route', href: '/studio/vault' },
    color: 'var(--arc-void)',
  },
];

export function findWorkflowByVoice(query: string): Workflow | null {
  const q = query.toLowerCase().trim();
  for (const w of WORKFLOWS) {
    for (const trigger of w.voiceTriggers) {
      if (q === trigger || q.includes(trigger)) return w;
    }
  }
  return null;
}
