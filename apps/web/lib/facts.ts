/**
 * FACTS — the single source of truth for every number Arcanea claims publicly.
 *
 * Rule: marketing and product surfaces import from here (repo/package counts
 * stay computed in `lib/public-repo-registry`). Never hardcode these numbers
 * in JSX — that is how the site ended up claiming 13, 16, and 7 agents at the
 * same time.
 *
 * Every value cites how it was verified. When the underlying reality changes,
 * update the value and its provenance in the same PR.
 */
export const FACTS = {
  /** Luminor specialists selectable in chat — entries in lib/luminors/config.ts (Lumina + 12 specialists). */
  luminors: 13,
  /** Guardian archetypes across the Ten Gates — canon. */
  guardians: 10,
  /** Gates of creator progression — canon. */
  gates: 10,
  /** Elements — canon. */
  elements: 5,
  /** Wisdoms channeled by the Luminor teams — canon. */
  wisdoms: 7,
  /** Luminor teams — canon. */
  teams: 4,
  /** MCP tools registered by the main server: 54 existing tools plus four ecology contract tools. */
  mcpTools: 58,
  /** Skills shipped in packages/arcanea-skills/skills/. */
  skills: 20,
} as const;

export type Facts = typeof FACTS;
