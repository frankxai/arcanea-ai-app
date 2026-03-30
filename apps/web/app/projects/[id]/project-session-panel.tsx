'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowSquareOut, Link, X } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProjectSessionRecord } from '@/lib/projects/server';
import { setActiveChatProject } from '@/lib/chat/project-store';

interface ProjectSessionPanelProps {
  projectId: string;
  linkedSessions: ProjectSessionRecord[];
  candidateSessions: ProjectSessionRecord[];
}

export function ProjectSessionPanel({
  projectId,
  linkedSessions,
  candidateSessions,
}: ProjectSessionPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function attachSession(sessionId: string) {
    await fetch(`/api/projects/${projectId}/sessions/${sessionId}`, { method: 'PATCH' });
    startTransition(() => router.refresh());
  }

  async function detachSession(sessionId: string) {
    await fetch(`/api/projects/${projectId}/sessions/${sessionId}`, { method: 'DELETE' });
    startTransition(() => router.refresh());
  }

  function openInChat(sessionId: string) {
    setActiveChatProject(projectId);
    router.push(`/chat?session=${encodeURIComponent(sessionId)}`);
  }

  return (
    <Card variant="liquid-glass" className="min-h-[320px]">
      <CardHeader>
        <CardTitle>Conversation Continuity</CardTitle>
        <CardDescription>
          Linked sessions define the hot path for this workspace. Attach more sessions or open one directly in chat.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Linked sessions</p>
          {linkedSessions.length === 0 ? (
            <p className="text-sm text-white/50">No chats linked yet. Attach a recent session below.</p>
          ) : (
            linkedSessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{session.title || 'Untitled chat'}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {session.luminorId || 'No luminor'} / {session.modelId || 'default model'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openInChat(session.id)}>
                      <ArrowSquareOut size={14} />
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void detachSession(session.id)}
                      disabled={isPending}
                    >
                      <X size={14} />
                      Detach
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Recent sessions to attach</p>
          {candidateSessions.length === 0 ? (
            <p className="text-sm text-white/50">No recent sessions available outside this project.</p>
          ) : (
            candidateSessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{session.title || 'Untitled chat'}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {session.projectId ? 'From another project' : 'Unassigned'} / updated {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void attachSession(session.id)}
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
