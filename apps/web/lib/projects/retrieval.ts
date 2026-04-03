export interface ProjectRetrievalSession {
  id: string;
  title: string | null;
}

export interface ProjectRetrievalCreation {
  id: string;
  title: string | null;
  type: string | null;
}

export interface ProjectRetrievalMemory {
  id: string;
  content: string;
  category?: string | null;
}

export interface ProjectRetrievalDoc {
  id: string;
  title: string;
  docType?: string | null;
  excerpt?: string | null;
}

export interface ProjectRetrievalGraphSummary {
  summary?: string | null;
  tags?: string[] | null;
  facts?: string[] | null;
}

export interface ProjectRetrievalInput {
  recentContext: string;
  sessions: ProjectRetrievalSession[];
  creations: ProjectRetrievalCreation[];
  docs: ProjectRetrievalDoc[];
  memories: ProjectRetrievalMemory[];
  graphSummary?: ProjectRetrievalGraphSummary | null;
}

export interface ProjectRetrievalSelection {
  sessions: ProjectRetrievalSession[];
  creations: ProjectRetrievalCreation[];
  docs: ProjectRetrievalDoc[];
  memories: ProjectRetrievalMemory[];
  graphSummary?: ProjectRetrievalGraphSummary | null;
  contextTerms: string[];
}

export interface ProjectRetrievalTraceMetadata {
  sessionCount: number;
  creationCount: number;
  docCount: number;
  memoryCount: number;
  contextTerms: string[];
  hasStoredSummary: boolean;
  factCount: number;
  tagCount: number;
}

const STOP_WORDS = new Set([
  'about', 'after', 'again', 'along', 'also', 'because', 'before', 'being',
  'between', 'build', 'could', 'from', 'have', 'into', 'just', 'make',
  'more', 'need', 'project', 'really', 'should', 'that', 'their', 'them',
  'then', 'these', 'this', 'turn', 'user', 'want', 'with', 'would', 'your',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function uniqueTokens(tokens: string[]): string[] {
  return Array.from(new Set(tokens));
}

function scoreText(text: string, contextTerms: string[]): number {
  if (!text || contextTerms.length === 0) return 0;

  const haystack = text.toLowerCase();
  let score = 0;

  for (const term of contextTerms) {
    if (haystack.includes(term)) {
      score += haystack.includes(` ${term} `) ? 3 : 2;
      if (haystack.startsWith(term) || haystack.endsWith(term)) {
        score += 1;
      }
    }
  }

  return score;
}

function rankItems<T>(items: T[], getText: (item: T) => string, contextTerms: string[], limit: number): T[] {
  return items
    .map((item, index) => ({
      item,
      index,
      score: scoreText(getText(item), contextTerms),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.index - b.index;
    })
    .filter((entry, index) => entry.score > 0 || index < limit)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function selectRelevantProjectContext(input: ProjectRetrievalInput): ProjectRetrievalSelection {
  const contextTerms = uniqueTokens(tokenize(input.recentContext)).slice(0, 12);

  return {
    sessions: rankItems(
      input.sessions,
      (session) => session.title ?? '',
      contextTerms,
      3,
    ),
    creations: rankItems(
      input.creations,
      (creation) => `${creation.title ?? ''} ${creation.type ?? ''}`,
      contextTerms,
      3,
    ),
    docs: rankItems(
      input.docs,
      (doc) => `${doc.title ?? ''} ${doc.docType ?? ''} ${doc.excerpt ?? ''}`,
      contextTerms,
      3,
    ),
    memories: rankItems(
      input.memories,
      (memory) => `${memory.category ?? ''} ${memory.content}`,
      contextTerms,
      4,
    ),
    graphSummary: input.graphSummary ?? null,
    contextTerms,
  };
}

export function buildProjectRetrievalBlock(selection: ProjectRetrievalSelection): string {
  const lines = ['[PROJECT GRAPH]'];

  if (selection.graphSummary?.summary) {
    lines.push(`Summary: ${selection.graphSummary.summary}`);
  }

  if (selection.graphSummary?.tags?.length) {
    lines.push(`Tags: ${selection.graphSummary.tags.join(', ')}`);
  }

  if (selection.graphSummary?.facts?.length) {
    lines.push('Known facts:');
    for (const fact of selection.graphSummary.facts.slice(0, 5)) {
      lines.push(`- ${fact}`);
    }
  }

  lines.push(`Relevant sessions: ${selection.sessions.length}`);
  for (const session of selection.sessions) {
    lines.push(`- Session: ${session.title || 'Untitled conversation'}`);
  }

  lines.push(`Relevant creations: ${selection.creations.length}`);
  for (const creation of selection.creations) {
    lines.push(`- Creation: ${creation.title || 'Untitled creation'} (${creation.type || 'unknown'})`);
  }

  lines.push(`Relevant docs: ${selection.docs.length}`);
  for (const doc of selection.docs) {
    const typeLabel = doc.docType ? ` (${doc.docType})` : '';
    lines.push(`- Doc: ${doc.title || 'Untitled doc'}${typeLabel}`);
    if (doc.excerpt) {
      lines.push(`  Excerpt: ${doc.excerpt}`);
    }
  }

  lines.push(`Relevant memories: ${selection.memories.length}`);
  for (const memory of selection.memories) {
    const label = memory.category ? ` [${memory.category}]` : '';
    lines.push(`- Memory${label}: ${memory.content}`);
  }

  if (selection.contextTerms.length > 0) {
    lines.push(`Active retrieval terms: ${selection.contextTerms.join(', ')}`);
  }

  lines.push('Use this graph to keep continuity across the active project instead of treating the current turn as isolated.');
  lines.push('[/PROJECT GRAPH]');
  lines.push('');

  return lines.join('\n');
}

export function buildProjectRetrievalTraceMetadata(
  selection: ProjectRetrievalSelection,
): ProjectRetrievalTraceMetadata {
  return {
    sessionCount: selection.sessions.length,
    creationCount: selection.creations.length,
    docCount: selection.docs.length,
    memoryCount: selection.memories.length,
    contextTerms: selection.contextTerms,
    hasStoredSummary: Boolean(selection.graphSummary?.summary),
    factCount: selection.graphSummary?.facts?.length ?? 0,
    tagCount: selection.graphSummary?.tags?.length ?? 0,
  };
}
