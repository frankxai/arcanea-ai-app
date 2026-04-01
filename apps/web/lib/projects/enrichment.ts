import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProjectGraphSummaryRecord, ProjectWorkspaceSnapshot } from '@/lib/projects/server';

export interface ProjectWorkspaceEvaluation {
  score: number;
  checks: Array<{
    name: string;
    passed: boolean;
    detail: string;
  }>;
}

export interface ProjectGraphView {
  summary: string;
  tags: string[];
  facts: string[];
  score: number;
  checks: ProjectWorkspaceEvaluation['checks'];
  source: 'stored' | 'derived' | 'enriched';
}

type UntypedQueryResult = PromiseLike<{ data: unknown; error?: unknown }>;

interface UntypedQueryBuilder extends UntypedQueryResult {
  eq(column: string, value: unknown): UntypedQueryBuilder;
  update(values: Record<string, unknown>): UntypedQueryBuilder;
  upsert(values: Record<string, unknown> | Record<string, unknown>[], options?: { onConflict?: string }): UntypedQueryBuilder;
}

interface UntypedProjectGraphClient {
  from(table: string): UntypedQueryBuilder;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'with', 'this', 'from', 'into', 'your', 'their',
  'about', 'have', 'will', 'just', 'than', 'when', 'what', 'where', 'which',
  'while', 'work', 'project', 'chat', 'creation', 'memory', 'untitled',
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));
}

function deriveTags(snapshot: ProjectWorkspaceSnapshot): string[] {
  const frequency = new Map<string, number>();
  const corpus = [
    snapshot.project.title,
    snapshot.project.description ?? '',
    snapshot.project.goal ?? '',
    ...snapshot.sessions.map((session) => session.title ?? ''),
    ...snapshot.creations.map((creation) => creation.title),
    ...snapshot.memories.map((memory) => memory.content.slice(0, 180)),
  ];

  for (const entry of corpus) {
    for (const token of tokenize(entry)) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([token]) => token);
}

function deriveFacts(snapshot: ProjectWorkspaceSnapshot): string[] {
  const facts: string[] = [];

  if (snapshot.project.goal) {
    facts.push(`Goal: ${snapshot.project.goal}`);
  }

  for (const session of snapshot.sessions.slice(0, 3)) {
    facts.push(`Chat session: ${session.title || 'Untitled chat'}`);
  }

  for (const creation of snapshot.creations.slice(0, 3)) {
    facts.push(`Creation: ${creation.title} (${creation.type})`);
  }

  for (const memory of snapshot.memories.slice(0, 3)) {
    facts.push(`Memory: ${memory.content.slice(0, 140)}`);
  }

  return facts;
}

function deriveSummary(snapshot: ProjectWorkspaceSnapshot, tags: string[]): string {
  const parts = [
    `${snapshot.project.title} is an active Arcanea project workspace.`,
    `It currently contains ${snapshot.stats.sessionCount} linked chat sessions, ${snapshot.stats.creationCount} saved creations, and ${snapshot.stats.memoryCount} durable memory links.`,
  ];

  if (snapshot.project.goal) {
    parts.push(`Primary goal: ${snapshot.project.goal}`);
  }

  if (tags.length > 0) {
    parts.push(`Dominant themes: ${tags.join(', ')}.`);
  }

  return parts.join(' ');
}

export function buildProjectGraphView(
  snapshot: ProjectWorkspaceSnapshot,
  summaryRecord?: ProjectGraphSummaryRecord | null,
  source: ProjectGraphView['source'] = 'derived',
): {
  evaluation: ProjectWorkspaceEvaluation;
  graph: ProjectGraphView;
} {
  const evaluation = evaluateProjectWorkspace(snapshot);
  const tags = summaryRecord?.tags?.length ? summaryRecord.tags : deriveTags(snapshot);
  const facts = summaryRecord?.facts?.length ? summaryRecord.facts : deriveFacts(snapshot);
  const summary = summaryRecord?.summary || deriveSummary(snapshot, tags);
  const score = typeof summaryRecord?.score === 'number' ? summaryRecord.score : evaluation.score;
  const checks = summaryRecord?.checks?.length ? summaryRecord.checks : evaluation.checks;

  return {
    evaluation,
    graph: {
      summary,
      tags,
      facts,
      score,
      checks,
      source,
    },
  };
}

export function evaluateProjectWorkspace(
  snapshot: ProjectWorkspaceSnapshot,
): ProjectWorkspaceEvaluation {
  const checks = [
    {
      name: 'has_project',
      passed: Boolean(snapshot.project.id && snapshot.project.title),
      detail: 'Workspace resolves to a concrete project record.',
    },
    {
      name: 'has_chat_continuity',
      passed: snapshot.stats.sessionCount > 0,
      detail: snapshot.stats.sessionCount > 0
        ? `Project has ${snapshot.stats.sessionCount} linked chat session(s).`
        : 'Project has no linked chat sessions yet.',
    },
    {
      name: 'has_artifact_trail',
      passed: snapshot.stats.creationCount > 0,
      detail: snapshot.stats.creationCount > 0
        ? `Project has ${snapshot.stats.creationCount} linked creation(s).`
        : 'Project has no linked creations yet.',
    },
    {
      name: 'has_memory_layer',
      passed: snapshot.stats.memoryCount > 0,
      detail: snapshot.stats.memoryCount > 0
        ? `Project has ${snapshot.stats.memoryCount} memory link(s).`
        : 'Project has no linked memories yet.',
    },
    {
      name: 'has_source_links',
      passed: snapshot.creations.some((creation) => Boolean(creation.sourceSessionId)),
      detail: snapshot.creations.some((creation) => Boolean(creation.sourceSessionId))
        ? 'At least one creation points back to a source chat session.'
        : 'No creation currently points back to its originating chat session.',
    },
  ];

  const score = Math.round(
    (checks.filter((check) => check.passed).length / checks.length) * 100,
  );

  return { score, checks };
}

export async function enrichProjectGraph(
  supabase: SupabaseClient,
  userId: string,
  snapshot: ProjectWorkspaceSnapshot,
): Promise<{
  summary: string;
  tags: string[];
  factCount: number;
  edgeCount: number;
  evaluation: ProjectWorkspaceEvaluation;
}> {
  const { evaluation, graph } = buildProjectGraphView(snapshot);
  const { summary, tags, facts } = graph;
  const db = supabase as unknown as UntypedProjectGraphClient;

  const edges = [
    ...snapshot.sessions.map((session) => ({
      project_id: snapshot.project.id,
      user_id: userId,
      source_type: 'project',
      source_id: snapshot.project.id,
      target_type: 'chat_session',
      target_id: session.id,
      relation: 'belongs_to',
      weight: 1,
      metadata: {
        title: session.title,
        modelId: session.modelId,
        luminorId: session.luminorId,
      },
    })),
    ...snapshot.creations.map((creation) => ({
      project_id: snapshot.project.id,
      user_id: userId,
      source_type: 'project',
      source_id: snapshot.project.id,
      target_type: 'creation',
      target_id: creation.id,
      relation: 'contains',
      weight: 1,
      metadata: {
        title: creation.title,
        type: creation.type,
        status: creation.status,
      },
    })),
    ...snapshot.memories.map((memory) => ({
      project_id: snapshot.project.id,
      user_id: userId,
      source_type: 'project',
      source_id: snapshot.project.id,
      target_type: 'memory',
      target_id: memory.id,
      relation: 'relevant_to',
      weight: 0.8,
      metadata: {
        preview: memory.content.slice(0, 140),
      },
    })),
    ...snapshot.creations
      .filter((creation) => creation.sourceSessionId)
      .map((creation) => ({
        project_id: snapshot.project.id,
        user_id: userId,
        source_type: 'creation',
        source_id: creation.id,
        target_type: 'chat_session',
        target_id: creation.sourceSessionId as string,
        relation: 'derived_from',
        weight: 0.9,
        metadata: {
          title: creation.title,
        },
      })),
  ];

  try {
    await db
      .from('chat_projects')
      .update({
        metadata: {
          summary,
          tags,
          facts,
          evaluation,
          last_enriched_at: new Date().toISOString(),
        },
      })
      .eq('id', snapshot.project.id)
      .eq('user_id', userId);
  } catch (error) {
    console.warn('[projects/enrichment] failed to update chat_projects metadata', error);
  }

  try {
    await db
      .from('project_graph_summaries')
      .upsert({
        project_id: snapshot.project.id,
        user_id: userId,
        summary,
        tags,
        facts,
        score: evaluation.score,
        checks: evaluation.checks,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'project_id' });
  } catch (error) {
    console.warn('[projects/enrichment] project_graph_summaries unavailable', error);
  }

  if (edges.length > 0) {
    try {
      await db
        .from('project_graph_edges')
        .upsert(edges, {
          onConflict: 'project_id,source_type,source_id,target_type,target_id,relation',
        });
    } catch (error) {
      console.warn('[projects/enrichment] project_graph_edges unavailable', error);
    }
  }

  return {
    summary,
    tags,
    factCount: facts.length,
    edgeCount: edges.length,
    evaluation,
  };
}
