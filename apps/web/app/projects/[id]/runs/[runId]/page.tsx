import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ClockCounterClockwise, Coins, FileText, Heartbeat } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import {
  getProjectForCurrentUser,
  getProjectRunForCurrentUser,
  listProjectRunEventsForCurrentUser,
} from '@/lib/projects/server';

interface PageProps {
  params: Promise<{ id: string; runId: string }>;
}

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString() : 'In progress';
}

function eventLabel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: projectId, runId } = await params;
  const project = await getProjectForCurrentUser(projectId);
  return {
    title: project ? `${project.title} · Run ${runId.slice(0, 8)} | Arcanea` : 'Project Run | Arcanea',
  };
}

export default async function ProjectRunDetailPage({ params }: PageProps) {
  const { id: projectId, runId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/projects/${projectId}/runs/${runId}`);
  }

  const [project, run, events] = await Promise.all([
    getProjectForCurrentUser(projectId),
    getProjectRunForCurrentUser(projectId, runId),
    listProjectRunEventsForCurrentUser(projectId, runId),
  ]);

  if (!project || !run) notFound();

  return (
    <main className="min-h-screen bg-cosmic-void">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-atlantean-teal-aqua/80">
              <Heartbeat size={14} />
              Run Detail
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">
              {run.kind}
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Trace run <span className="font-mono text-white/82">{run.traceRunId}</span> · {run.runtime}
              {run.provider ? ` / ${run.provider}` : ''} · {run.executionMode}
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href={`/projects/${projectId}/runs`}>
              <ArrowLeft size={14} className="mr-2" />
              Back to runs
            </Link>
          </Button>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Card variant="liquid-glass">
              <CardHeader>
                <CardTitle>Execution summary</CardTitle>
                <CardDescription>{run.commandPreview}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Status</p>
                  <p className="mt-2 font-medium text-white">{eventLabel(run.status)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Run window</p>
                  <p className="mt-2 font-medium text-white">{formatTimestamp(run.startedAt)}</p>
                  <p className="mt-1 text-white/50">Finished {formatTimestamp(run.finishedAt)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Cost preflight</p>
                  <p className="mt-2 font-medium text-white">
                    {run.billingMode} · {run.estimatedCredits ?? 'pending'} credits
                  </p>
                  <p className="mt-1 text-white/50">
                    {run.estimatedUsd != null ? `$${run.estimatedUsd.toFixed(2)} est.` : 'USD estimate pending'}
                    {run.byokEligible ? ' · BYOK available' : ''}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Trace source</p>
                  <p className="mt-2 break-all font-mono text-xs text-white/72">
                    {run.sourceTracePath ?? 'No persisted trace path'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card variant="liquid-glass">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Durable status changes and related artifacts for this run.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/60">
                    No persisted run events yet. The run record exists, but no timeline events were attached during ingestion.
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-atlantean-teal-aqua">
                          {eventLabel(event.eventType)}
                        </p>
                        {event.status ? (
                          <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                            {eventLabel(event.status)}
                          </p>
                        ) : null}
                        <p className="text-xs text-white/40">{formatTimestamp(event.createdAt)}</p>
                      </div>
                      {event.message ? (
                        <p className="mt-2 text-sm text-white/72">{event.message}</p>
                      ) : null}
                      {Object.keys(event.payload).length > 0 ? (
                        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/65">
                          {JSON.stringify(event.payload, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="liquid-glass-subtle">
              <CardHeader>
                <CardTitle>Graph links</CardTitle>
                <CardDescription>What this run is already connected to in the project graph.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="font-medium text-white">Project</p>
                  <p className="mt-1 text-white/55">{project.title}</p>
                </div>
                {run.sourceDocId ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="font-medium text-white">Linked doc</p>
                    <p className="mt-1 font-mono text-xs text-white/55">{run.sourceDocId}</p>
                  </div>
                ) : null}
                {run.sourceCreationId ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="font-medium text-white">Linked creation</p>
                    <p className="mt-1 font-mono text-xs text-white/55">{run.sourceCreationId}</p>
                  </div>
                ) : null}
                {run.sourcePromptId ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="font-medium text-white">Linked prompt</p>
                    <p className="mt-1 font-mono text-xs text-white/55">{run.sourcePromptId}</p>
                  </div>
                ) : null}
                {run.sourceCollectionId || run.sourcePromptCollectionId ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="font-medium text-white">Collection context</p>
                    <p className="mt-1 font-mono text-xs text-white/55">
                      {run.sourceCollectionId ?? run.sourcePromptCollectionId}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card variant="liquid-glass-subtle">
              <CardHeader>
                <CardTitle>Artifacts</CardTitle>
                <CardDescription>Current persisted pointers for follow-up inspection.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/70">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-atlantean-teal-aqua" />
                    <p className="font-medium text-white">Trace path</p>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-white/55">
                    {run.sourceTracePath ?? 'No source trace path available'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="font-medium text-white">Metadata</p>
                  <pre className="mt-2 overflow-x-auto text-xs text-white/55">
                    {JSON.stringify(run.metadata, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
