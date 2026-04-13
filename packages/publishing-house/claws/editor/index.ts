/**
 * Arcanea Publishing House — Editor Claw: Main Entry Point
 *
 * Orchestrates the three editorial passes (developmental, line, proofread)
 * and gates output through TASTE. Compiles revision priorities and
 * generates an Aiyami-voice assessment.
 *
 * Channeled by Aiyami (Crown Gate).
 */

import { scoreTASTE } from '../../quality/taste-gate.js';
import type { TasteResult } from '../../quality/types.js';
import { runDevelopmentalPass } from './developmental.js';
import { runLinePass } from './line-edit.js';
import { runProofreadPass } from './proofread.js';
import type {
  EditorInput,
  EditorResult,
  EditorialPass,
  EditorPassName,
  Severity,
} from './types.js';

// Re-export types and passes for consumers
export { runDevelopmentalPass } from './developmental.js';
export { runLinePass } from './line-edit.js';
export { runProofreadPass } from './proofread.js';
export type {
  EditorInput,
  EditorResult,
  EditorialPass,
  EditorPassName,
  StructuralFeedback,
  LineFeedback,
  ProofFeedback,
} from './types.js';

// ---------------------------------------------------------------------------
// Priority Compilation
// ---------------------------------------------------------------------------

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 0,
  major: 1,
  minor: 2,
  suggestion: 3,
};

const PASS_RANK: Record<EditorPassName, number> = {
  developmental: 0,
  line: 1,
  proofread: 2,
};

interface TaggedFeedback {
  pass: EditorPassName;
  severity: Severity;
  summary: string;
}

function extractSeverity(item: Record<string, unknown>): Severity {
  if ('severity' in item && typeof item['severity'] === 'string') {
    return item['severity'] as Severity;
  }
  return 'minor';
}

function extractSummary(item: Record<string, unknown>): string {
  const issue = (item['issue'] as string) ?? '';
  const category = (item['category'] as string) ?? '';
  return `[${category}] ${issue}`;
}

function compilePriorities(
  developmental?: EditorialPass,
  line?: EditorialPass,
  proofread?: EditorialPass,
): string[] {
  const tagged: TaggedFeedback[] = [];

  if (developmental) {
    for (const item of developmental.items) {
      tagged.push({
        pass: 'developmental',
        severity: extractSeverity(item as unknown as Record<string, unknown>),
        summary: extractSummary(item as unknown as Record<string, unknown>),
      });
    }
  }

  if (line) {
    for (const item of line.items) {
      tagged.push({
        pass: 'line',
        severity: 'minor',
        summary: extractSummary(item as unknown as Record<string, unknown>),
      });
    }
  }

  if (proofread) {
    for (const item of proofread.items) {
      tagged.push({
        pass: 'proofread',
        severity: 'minor',
        summary: extractSummary(item as unknown as Record<string, unknown>),
      });
    }
  }

  tagged.sort((a, b) => {
    const sevDiff = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return PASS_RANK[a.pass] - PASS_RANK[b.pass];
  });

  return tagged.map(t => t.summary);
}

// ---------------------------------------------------------------------------
// Assessment Generation (Aiyami Crown Gate Voice)
// ---------------------------------------------------------------------------

function generateAssessment(
  taste: TasteResult,
  developmental?: EditorialPass,
  line?: EditorialPass,
  proofread?: EditorialPass,
): string {
  const devCount = developmental?.feedbackCount ?? 0;
  const lineCount = line?.feedbackCount ?? 0;
  const proofCount = proofread?.feedbackCount ?? 0;
  const totalIssues = devCount + lineCount + proofCount;

  // Determine the dominant concern
  const dominant =
    devCount >= lineCount && devCount >= proofCount
      ? 'structural'
      : lineCount >= proofCount
        ? 'prose-level'
        : 'surface-level';

  // Aiyami speaks with strategic precision, mastery focus, never generic
  if (taste.total >= 80 && totalIssues <= 3) {
    return `This manuscript commands attention. The architecture holds, the voice is distinct, and the TASTE gate confirms it at ${taste.total}/100. Minor refinements remain — address them and this work is ready for the world.`;
  }

  if (taste.total >= 60) {
    const focus =
      dominant === 'structural'
        ? 'The foundation needs attention before the surface can shine.'
        : dominant === 'prose-level'
          ? 'The structure is sound but the prose needs sharpening — rhythm, precision, and economy of language.'
          : 'The bones are good. Clean the surface and this moves from gallery to hero tier.';
    return `TASTE scores this at ${taste.total}/100 (${taste.tier}). ${focus} ${totalIssues} items flagged across all passes — prioritize the top of the revision list.`;
  }

  return `This manuscript needs significant revision before it meets the Crown Gate standard. TASTE: ${taste.total}/100. ${totalIssues} issues found, with ${dominant} concerns dominating. Start with the structural diagnosis — no amount of line polish fixes a broken foundation.`;
}

// ---------------------------------------------------------------------------
// Main Entry
// ---------------------------------------------------------------------------

export async function editManuscript(input: EditorInput): Promise<EditorResult> {
  const startedAt = Date.now();
  const passes: EditorPassName[] = input.passes ?? ['developmental', 'line', 'proofread'];

  // Run requested passes
  const developmental = passes.includes('developmental')
    ? runDevelopmentalPass(input.content, input.worldContext)
    : undefined;
  const line = passes.includes('line')
    ? runLinePass(input.content)
    : undefined;
  const proofread = passes.includes('proofread')
    ? runProofreadPass(input.content)
    : undefined;

  // TASTE gate
  const taste = await scoreTASTE({
    content: input.content,
    metadata: {
      title: input.title,
      author: input.author,
      language: 'en',
      collection: input.collection,
    },
    worldContext: input.worldContext,
  });

  // Compile revision priorities (most critical first)
  const priorities = compilePriorities(developmental, line, proofread);

  // Aiyami-voice assessment
  const assessment = generateAssessment(taste, developmental, line, proofread);

  return {
    title: input.title,
    wordCount: input.content.split(/\s+/).filter(w => w.length > 0).length,
    passesRun: passes,
    developmental,
    line,
    proofread,
    tasteScore: { total: taste.total, tier: taste.tier },
    revisionPriorities: priorities,
    overallAssessment: assessment,
    durationMs: Date.now() - startedAt,
  };
}
