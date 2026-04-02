import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DOC_TYPE_LABELS, type DocType, type DocStatus } from '@/lib/docs/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProjectDocsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: docsRaw } = await (supabase as any)
    .from('project_docs')
    .select(`
      id, title, doc_type, status, icon, updated_at, last_edited_at,
      project_doc_content ( word_count )
    `)
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .order('sort_order', { ascending: true })
    .order('updated_at', { ascending: false });

  const docs: DocListItem[] = (docsRaw ?? []).map(
    (d: Record<string, unknown> & { project_doc_content?: { word_count?: number }[] }) => ({
      id: d.id,
      title: d.title,
      doc_type: d.doc_type,
      status: d.status,
      icon: d.icon ?? null,
      word_count: d.project_doc_content?.[0]?.word_count ?? 0,
      updated_at: d.updated_at as string,
      last_edited_at: d.last_edited_at as string,
    })
  );

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/projects/${projectId}`}
              className="text-xs text-white/30 hover:text-white/50 transition-colors font-sans uppercase tracking-widest"
            >
              Project
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-xs text-white/60 font-sans">Docs</span>
          </div>
          <Link href={`/projects/${projectId}/docs/new`}>
            <Button
              size="sm"
              className="rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-white/70 hover:text-white border border-white/[0.08] font-sans text-xs h-8 px-4 transition-all"
            >
              + New Doc
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {docs.length === 0 ? (
          <EmptyState projectId={projectId} />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-white font-sans">
                {docs.length} {docs.length === 1 ? 'document' : 'documents'}
              </h1>
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

// ---------------------------------------------------------------------------
// Doc row
// ---------------------------------------------------------------------------

function DocRow({ doc, projectId }: { doc: DocListItem; projectId: string }) {
  return (
    <Link href={`/projects/${projectId}/docs/${doc.id}`}>
      <Card className="group flex items-center gap-4 px-5 py-4 bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all cursor-pointer rounded-2xl">
        {/* Icon / type marker */}
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-base">
          {doc.icon ?? typeEmoji(doc.doc_type)}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/80 group-hover:text-white truncate font-sans transition-colors">
            {doc.title || 'Untitled'}
          </p>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-white/30 font-sans">
            <span>{DOC_TYPE_LABELS[doc.doc_type]}</span>
            {doc.word_count > 0 && (
              <>
                <span className="text-white/15">·</span>
                <span>{doc.word_count.toLocaleString()} words</span>
              </>
            )}
            <span className="text-white/15">·</span>
            <span>{relativeDate(doc.last_edited_at)}</span>
          </div>
        </div>

        {/* Status badge */}
        <Badge
          className={`flex-shrink-0 text-[10px] px-2.5 py-0.5 rounded-full border font-sans font-normal ${STATUS_COLORS[doc.status]}`}
        >
          {doc.status}
        </Badge>
      </Card>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyState({ projectId }: { projectId: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-3xl mb-6">
        📄
      </div>
      <h2 className="text-lg font-semibold text-white/70 font-sans mb-2">No documents yet</h2>
      <p className="text-sm text-white/30 font-sans mb-8 max-w-sm">
        Create notes, briefs, lore entries, and specs to support your project.
      </p>
      <Link href={`/projects/${projectId}/docs/new`}>
        <Button className="rounded-xl bg-[#7fffd4]/10 hover:bg-[#7fffd4]/20 text-[#7fffd4] border border-[#7fffd4]/20 font-sans text-sm transition-all">
          Create first document
        </Button>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function typeEmoji(type: DocType): string {
  const map: Record<DocType, string> = {
    note: '📝',
    brief: '📋',
    outline: '🗂',
    lore: '📖',
    research: '🔍',
    prompt_book: '✨',
    spec: '⚙️',
    journal: '📓',
  };
  return map[type] ?? '📄';
}
