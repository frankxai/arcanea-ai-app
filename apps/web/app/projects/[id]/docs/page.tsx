import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChatCircleDots, FileText, FolderOpen, Plus } from '@/lib/phosphor-icons';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DOC_TYPE_LABELS, type DocType, type DocStatus } from '@/lib/docs/types';
import { OpenProjectChatButton } from '../open-project-chat-button';

interface DocListItem {
  id: string;
  title: string;
  doc_type: DocType;
  status: DocStatus;
  icon: string | null;
  word_count: number;
  updated_at: string;
  last_edited_at: string;
}

type UntypedQueryResult = PromiseLike<{ data: unknown; error?: unknown }>;

interface UntypedQueryBuilder extends UntypedQueryResult {
  eq(column: string, value: unknown): UntypedQueryBuilder;
  order(column: string, options?: { ascending?: boolean }): UntypedQueryBuilder;
  select(columns: string): UntypedQueryBuilder;
}

interface DocsDbClient {
  from(table: string): UntypedQueryBuilder;
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const STATUS_COLORS: Record<DocStatus, string> = {
  draft: 'bg-white/[0.06] text-white/40 border-white/[0.08]',
  active: 'bg-[#7fffd4]/10 text-[#7fffd4] border-[#7fffd4]/20',
  published: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  archived: 'bg-white/[0.04] text-white/25 border-white/[0.06]',
};

export default async function ProjectDocsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const db = supabase as unknown as DocsDbClient;

  const { data: docsRaw } = await db
    .from('project_docs')
    .select(`
      id, title, doc_type, status, icon, updated_at, last_edited_at,
      project_doc_content ( word_count )
    `)
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  const docsSource = Array.isArray(docsRaw) ? docsRaw : [];

  const docs: DocListItem[] = docsSource.map(
    (doc: Record<string, unknown> & { project_doc_content?: { word_count?: number }[] }) => ({
      id: doc.id as string,
      title: doc.title as string,
      doc_type: doc.doc_type as DocType,
      status: doc.status as DocStatus,
      icon: (doc.icon as string | null) ?? null,
      word_count: doc.project_doc_content?.[0]?.word_count ?? 0,
      updated_at: doc.updated_at as string,
      last_edited_at: doc.last_edited_at as string,
    }),
  );

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#7fffd4]/80">
              <FolderOpen size={14} />
              Project docs
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">
              Durable context for this workspace
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Keep briefs, notes, outlines, lore, research, and specs inside the project so chat
              can pull them back into retrieval and the graph can preserve provenance over time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="ghost">
              <Link href={`/projects/${projectId}`}>
                <FolderOpen size={16} />
                Back to project
              </Link>
            </Button>
            <OpenProjectChatButton projectId={projectId}>
              <ChatCircleDots size={16} />
              Open project chat
            </OpenProjectChatButton>
            <Button asChild>
              <Link href={`/projects/${projectId}/docs/new`}>
                <Plus size={16} />
                New doc
              </Link>
            </Button>
          </div>
        </div>

        {docs.length === 0 ? (
          <EmptyState projectId={projectId} />
        ) : (
          <div className="space-y-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white font-sans">
                {docs.length} {docs.length === 1 ? 'document' : 'documents'}
              </h2>
            </div>
            {docs.map((doc) => (
              <DocRow key={doc.id} doc={doc} projectId={projectId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocRow({ doc, projectId }: { doc: DocListItem; projectId: string }) {
  return (
    <Link href={`/projects/${projectId}/docs/${doc.id}`}>
      <Card className="group flex cursor-pointer items-center gap-4 rounded-2xl border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all hover:border-white/[0.10] hover:bg-white/[0.04]">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-base">
          {doc.icon ?? typeGlyph(doc.doc_type)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-medium text-white/80 transition-colors group-hover:text-white">
            {doc.title || 'Untitled'}
          </p>
          <div className="mt-1 flex items-center gap-3 font-sans text-[11px] text-white/30">
            <span>{DOC_TYPE_LABELS[doc.doc_type]}</span>
            {doc.word_count > 0 ? <span>{doc.word_count.toLocaleString()} words</span> : null}
            <span>{relativeDate(doc.last_edited_at)}</span>
          </div>
        </div>

        <Badge
          className={`flex-shrink-0 rounded-full border px-2.5 py-0.5 font-sans text-[10px] font-normal ${STATUS_COLORS[doc.status]}`}
        >
          {doc.status}
        </Badge>
      </Card>
    </Link>
  );
}

function EmptyState({ projectId }: { projectId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-3xl">
        <FileText className="text-[#7fffd4]" size={28} />
      </div>
      <h2 className="mb-2 font-sans text-lg font-semibold text-white/70">No documents yet</h2>
      <p className="mb-8 max-w-sm font-sans text-sm text-white/30">
        Start with a brief, note, outline, or spec so this project has durable written context
        before the next chat session.
      </p>

      <div className="mb-8 space-y-3 text-left">
        {[
          'Frame the project in writing before execution drifts.',
          'Open project chat once the doc exists so retrieval can use it.',
          'Save creations back into the same project to strengthen provenance.',
        ].map((step) => (
          <div
            key={step}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white/55"
          >
            {step}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-xl border border-[#7fffd4]/20 bg-[#7fffd4]/10 font-sans text-sm text-[#7fffd4] transition-all hover:bg-[#7fffd4]/20">
          <Link href={`/projects/${projectId}/docs/new`}>Create first document</Link>
        </Button>
        <OpenProjectChatButton projectId={projectId} variant="ghost">
          <ChatCircleDots size={16} />
          Open project chat
        </OpenProjectChatButton>
      </div>
    </div>
  );
}

function typeGlyph(type: DocType): string {
  const map: Record<DocType, string> = {
    note: 'N',
    brief: 'B',
    outline: 'O',
    lore: 'L',
    research: 'R',
    prompt_book: 'P',
    spec: 'S',
    journal: 'J',
  };
  return map[type] ?? 'D';
}
