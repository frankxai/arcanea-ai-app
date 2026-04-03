import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChartBar, ClockCounterClockwise, Coins } from '@/lib/phosphor-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import {
  getProjectForCurrentUser,
  listProjectRunsForCurrentUser,
  type ProjectRunRecord,
} from '@/lib/projects/server';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatTimestamp(value: string | null) {
  return value ? new Date(value).toLocaleString() : 'In progress';
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function statusClass(value: string) {
  if (value === 'completed') return 'text-emerald-300';
  if (value === 'failed' || value === 'cancelled') return 'text-red-300';
  if (value === 'running') return 'text-cyan-300';
  return 'text-amber-300';
}

function billingLabel(run: ProjectRunRecord) {
  const credits =
    typeof run.estimatedCredits === 'number' ? `${run.estimatedCredits} credits` : 'credits pending';
  return `${run.billingMode} · ${credits}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectForCurrentUser(id);
  return {
    title: project ? `${project.title} Runs | Arcanea` : 'Project Runs | Arcanea',
  };
}

export default async function ProjectRunsPage({ params }: PageProps) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/projects/${projectId}/runs`);
  }

  const project = await getProjectForCurrentUser(projectId);
  if (!project) notFound();

  const runs = await listProjectRunsForCurrentUser(projectId, 40);
  const totalEstimatedCredits = runs.reduce((sum, run) => sum + (run.estimatedCredits ?? 0), 0);

  return (
    <main className="min-h-screen bg-cosmic-void">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-atlantean-teal-aqua/80">
              <ChartBar size={14} />
              Project Run Graph
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">
              {project.title} runs
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Durable execution history for agent tasks, orchestration traces, and billable run posture.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="ghost">
              <Link href={`/projects/${projectId}`}>
                <ArrowLeft size={14} className="mr-2" />
                Back to project
              </Link>
            </Button>
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <Card variant="liquid-glass">
            <CardHeader className="pb-3">
              <CardDescription className="uppercase tracking-[0.18em] text-white/40">Runs</CardDescription>
              <CardTitle className="text-3xl text-white">{runs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card variant="liquid-glass">
            <CardHeader className="pb-3">
              <CardDescription className="uppercase tracking-[0.18em] text-white/40">Estimated credits</CardDescription>
              <CardTitle className="text-3xl text-white">{totalEstimatedCredits}</CardTitle>
            </CardHeader>
          </Card>
          <Card variant="liquid-glass">
            <CardHeader className="pb-3">
              <CardDescription className="uppercase tracking-[0.18em] text-white/40">Billing posture</CardDescription>
              <CardTitle className="text-3xl text-white">
                {runs.some((run) => run.billingMode === 'credits') ? 'Credits-aware' : 'Included'}
              </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <Card variant="liquid-glass">
          <CardHeader>
            <CardTitle>Run timeline</CardTitle>
            <CardDescription>
              Arcanea records machine-readable orchestration envelopes here so teams can inspect trust, spend, and execution history.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {runs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/60">
                No persisted runs yet. Ingest an Arcanea Flow trace to seed this project run graph.
              </div>
            ) : (
              runs.map((run) => (
                <div
                  key={run.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-mono text-sm text-white/88">{run.traceRunId.slice(0, 12)}</p>
                        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${statusClass(run.status)}`}>
                          {formatStatus(run.status)}
                        </p>
                        <p className="text-xs uppercase tracking-[0.14em] text-white/40">{run.kind}</p>
                      </div>
                      <p className="mt-2 text-sm text-white/72">{run.commandPreview}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/50">
                        <span className="inline-flex items-center gap-1.5">
                          <ClockCounterClockwise size={13} />
                          {formatTimestamp(run.finishedAt ?? run.startedAt)}
                        </span>
                        <span>{run.runtime}{run.provider ? ` · ${run.provider}` : ''}</span>
                        <span>{run.executionMode}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-xs text-white/60 lg:items-end">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
                        <Coins size={13} />
                        {billingLabel(run)}
                      </div>
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/projects/${projectId}/runs/${run.id}`}>
                          Open run
                          <ArrowRight size={14} className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
