import type {
  AuthorAgent,
  CouncilSession,
  Critique,
  DeliberationMode,
  Question,
  RosterManifest,
} from "./protocol/types.js";
import {
  parallelMode,
  adversarialMode,
  sequentialMode,
  convergenceMode,
  selectMode,
} from "./modes/index.js";
import { synthesize, type SynthesisOptions } from "./synthesizer/neutral.js";
import { routeQuestion } from "./router/index.js";

export interface ConveneOptions {
  /** Roster to draw from. */
  roster: RosterManifest;
  /** All loaded author agents for this roster. */
  authors: AuthorAgent[];
  /** Critique runner — provided by the host (MCP server or slash command). */
  runCritique: (author: AuthorAgent, question: Question) => Promise<Critique>;
  /** Optional override of question.mode. */
  mode?: DeliberationMode;
  /** Max / min authors to route to. */
  maxAuthors?: number;
  minAuthors?: number;
}

/**
 * End-to-end council session. Routes, runs deliberation, synthesizes.
 * This is the one-call entrypoint for MCP tools and slash commands.
 */
export async function convene(
  question: Question,
  options: ConveneOptions,
): Promise<CouncilSession> {
  const startedAt = Date.now();

  const routing = routeQuestion(question, {
    roster: options.roster.authors,
    ...(options.maxAuthors !== undefined ? { maxAuthors: options.maxAuthors } : {}),
    ...(options.minAuthors !== undefined ? { minAuthors: options.minAuthors } : {}),
  });

  const mode: DeliberationMode = options.mode ?? question.mode ?? routing.mode ?? selectMode(question);

  const selected = options.authors.filter((a) => routing.selectedAuthors.includes(a.slug));
  if (selected.length === 0) {
    throw new Error(
      `convene: no authors matched routing [${routing.selectedAuthors.join(", ")}] against loaded authors [${options.authors.map((a) => a.slug).join(", ")}]`,
    );
  }

  const ctx = {
    question: options.roster.canon ? { ...question, canon: options.roster.canon } : question,
    authors: selected,
    runCritique: options.runCritique,
  };

  let critiques: Critique[];
  switch (mode) {
    case "parallel":
      critiques = await parallelMode(ctx);
      break;
    case "adversarial":
      critiques = await adversarialMode(ctx);
      break;
    case "sequential":
      critiques = await sequentialMode(ctx);
      break;
    case "convergence":
      critiques = await convergenceMode(ctx);
      break;
  }

  const synthOpts: SynthesisOptions = {
    persona: options.roster.synthesizer,
    requireDissent: selected.length >= 3,
  };
  const synthesis = synthesize(critiques, mode, synthOpts);

  return {
    id: `council-${startedAt}-${Math.random().toString(36).slice(2, 10)}`,
    question,
    roster: selected.map((a) => a.slug),
    mode,
    critiques,
    synthesis,
    timestamp: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
  };
}
