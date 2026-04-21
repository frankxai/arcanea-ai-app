import type { Critique } from "../protocol/types.js";
import type { ModeContext } from "./parallel.js";

/**
 * Convergence mode — Malazan/Erikson model.
 * Authors critique independent slices (split content into N chunks),
 * then threads collapse to one synthesis in post-processing.
 *
 * Used for long-form content where different authors attend to different spans.
 */
export async function convergenceMode(ctx: ModeContext): Promise<Critique[]> {
  const chunks = splitContent(ctx.question.content, ctx.authors.length);
  const assignments = ctx.authors.map((author, i) => ({
    author,
    chunk: chunks[i] ?? chunks[chunks.length - 1] ?? "",
  }));

  const critiques = await Promise.all(
    assignments.map(({ author, chunk }) =>
      ctx.runCritique(author, {
        ...ctx.question,
        content: chunk,
        context: `${ctx.question.context ?? ""}\n\n(You are critiquing section ${assignments.findIndex((x) => x.author.slug === author.slug) + 1} of ${assignments.length} in a convergence-mode session. Focus on what this slice contributes to the whole.)`,
      }),
    ),
  );

  return critiques;
}

function splitContent(content: string, n: number): string[] {
  if (n <= 1) return [content];
  // Paragraph-aware split
  const paragraphs = content.split(/\n\s*\n/);
  if (paragraphs.length < n) {
    // Fall back to char-split
    const size = Math.ceil(content.length / n);
    const chunks: string[] = [];
    for (let i = 0; i < n; i++) {
      chunks.push(content.slice(i * size, (i + 1) * size));
    }
    return chunks;
  }
  const perChunk = Math.ceil(paragraphs.length / n);
  const chunks: string[] = [];
  for (let i = 0; i < n; i++) {
    chunks.push(paragraphs.slice(i * perChunk, (i + 1) * perChunk).join("\n\n"));
  }
  return chunks;
}
