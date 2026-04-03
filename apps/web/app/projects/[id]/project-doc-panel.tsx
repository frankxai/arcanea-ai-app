'use client';

import Link from 'next/link';
import { FileText, Plus } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectDocRecord } from '@/lib/projects/server';

function relativeDate(value: string): string {
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(delta / 60_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(value).toLocaleDateString();
}

function formatDocType(value: string): string {
  return value
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

interface ProjectDocPanelProps {
  projectId: string;
  docs: ProjectDocRecord[];
}

export function ProjectDocPanel({ projectId, docs }: ProjectDocPanelProps) {
  return (
    <Card variant="liquid-glass">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Project Docs</CardTitle>
          <CardDescription>
            Notes, briefs, lore, and specs linked directly to this project graph.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/projects/${projectId}/docs`}>View all</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/projects/${projectId}/docs/new`}>
              <Plus size={14} />
              New doc
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {docs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/55">
            This project has no linked docs yet. Create one to start building durable notes inside the graph.
          </div>
        ) : (
          docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/projects/${projectId}/docs/${doc.id}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <FileText size={14} className="text-atlantean-teal-aqua" />
                    <span className="truncate">{doc.title}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/40">
                    {formatDocType(doc.docType)} · {doc.wordCount} words · {relativeDate(doc.updatedAt)}
                  </p>
                  {doc.excerpt ? (
                    <p className="mt-3 text-sm leading-6 text-white/65">{doc.excerpt}</p>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      Open this doc to add the first durable note for the project.
                    </p>
                  )}
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
                  {doc.status}
                </span>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
