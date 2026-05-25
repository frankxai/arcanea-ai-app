/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Voice Dashboard — Multi-Runtime Launcher
 *
 * Defines the AI coding runtimes the dashboard can launch. The dashboard
 * renders these as small tiles; clicking copies the launch command to the
 * clipboard (CLI mode) or opens the hosted app. A future native helper
 * will execute the command directly when the daemon is connected.
 *
 * Routing principle: every runtime resolves to the same `Intent` object
 * upstream. The runtime is just *which surface* the intent lands on.
 */

export interface Runtime {
  id: string;
  name: string;
  tagline: string;
  /** Brand color. */
  color: string;
  /** Shell command to launch this runtime in the cwd. */
  command: string;
  /** Optional hosted URL alternative. */
  hosted?: string;
  /** Status: ready means "can be launched right now"; install means "needs setup". */
  status: 'ready' | 'install' | 'planned';
}

export const RUNTIMES: Runtime[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    tagline: 'Anthropic — agentic CLI',
    color: 'var(--arc-fire)',
    command: 'claude',
    hosted: 'https://claude.ai/code',
    status: 'ready',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini',
    tagline: 'Google — multimodal CLI',
    color: 'var(--arc-brand-atlantean-teal)',
    command: 'gemini',
    hosted: 'https://gemini.google.com',
    status: 'ready',
  },
  {
    id: 'codex',
    name: 'Codex',
    tagline: 'OpenAI — code-first agent',
    color: 'var(--arc-brand-atlantean-teal)',
    command: 'codex',
    hosted: 'https://chatgpt.com/codex',
    status: 'ready',
  },
  {
    id: 'kilo',
    name: 'Kilo Code',
    tagline: 'VS Code extension agent',
    color: 'var(--arc-void)',
    command: 'kilo',
    status: 'install',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    tagline: 'TUI multi-model agent',
    color: 'var(--arc-brand-arcanean-gold)',
    command: 'opencode',
    status: 'ready',
  },
  {
    id: 'aichat',
    name: 'AIChat',
    tagline: 'Rust router — 20+ providers',
    color: 'var(--arc-text-primary)',
    command: 'aichat',
    status: 'install',
  },
];
