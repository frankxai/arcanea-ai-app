'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Link, Sparkle, X } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectCreationRecord, ProjectSessionRecord } from '@/lib/projects/server';

interface ProjectCreationPanelProps {
  projectId: string;
  linkedCreations: ProjectCreationRecord[];
  candidateCreations: ProjectCreationRecord[];
  linkedSessions: ProjectSessionRecord[];
}

export function ProjectCreationPanel({
  projectId,
  linkedCreations,
  candidateCreations,
  linkedSessions,
}: ProjectCreationPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function attachCreation(creationId: string, sourceSessionId?: string | null) {
    await fetch(`/api/projects/${projectId}/creations/${creationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceSessionId: sourceSessionId ?? null }),
    });
    startTransition(() => router.refresh());
  }

  async function detachCreation(creationId: string) {
    await fetch(`/api/projects/${projectId}/creations/${creationId}`, { method: 'DELETE' });
    startTransition(() => router.refresh());
  }

  return (
    <Card variant="liquid-glass" className="min-h-[320px]">
      <CardHeader>
        <CardTitle>Artifact Trail</CardTitle>
        <CardDescription>
          Attach creations to this project and preserve source provenance back to a linked chat session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Linked creations</p>
          {linkedCreations.length === 0 ? (
            <p className="text-sm text-white/50">No creations linked yet. Attach one below to start the artifact trail.</p>
          ) : (
            linkedCreations.map((creation) => (
              <div key={creation.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-start gap-3">
                  {creation.thumbnailUrl ? (
                    <img src={creation.thumbnailUrl} alt={creation.title} className="h-12 w-12 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/45">
                      <Sparkle size={18} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{creation.title}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {creation.type} / {creation.status}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <select
                        className="rounded-lg border border-white/10 bg-[rgba(18,24,38,0.65)] px-3 py-2 text-xs text-white"
                        value={creation.sourceSessionId ?? ''}
                        onChange={(event) => void attachCreation(creation.id, event.target.value || null)}
                        disabled={isPending}
                      >
                        <option value="">No source session</option>
                        {linkedSessions.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.title || session.id}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void detachCreation(creation.id)}
                        disabled={isPending}
                      >
                        <X size={14} />
                        Detach
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Recent creations to attach</p>
          {candidateCreations.length === 0 ? (
            <p className="text-sm text-white/50">No recent creations available outside this project.</p>
          ) : (
            candidateCreations.map((creation) => (
              <div key={creation.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{creation.title}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {creation.projectId ? 'From another project' : 'Unassigned'} / {creation.type}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void attachCreation(creation.id, linkedSessions[0]?.id ?? null)}
                    disabled={isPending}
                  >
                    <Link size={14} />
                    Attach
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
