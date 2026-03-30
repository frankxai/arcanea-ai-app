import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, ClockCounterClockwise, FolderOpen, Sparkle } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createClient } from '@/lib/supabase/server';
import { buildProjectCompletionSummary } from '@/lib/projects/progress';
import { getProjectWorkspaceForCurrentUser } from '@/lib/projects/server';
import { OpenProjectChatButton } from './open-project-chat-button';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString();
}

function statusLabel(value: string): string {
  return value
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const workspace = await getProjectWorkspaceForCurrentUser(id);

  if (!workspace) {
    return {
      title: 'Project Workspace | Arcanea',
    };
  }

  return {
    title: `${workspace.project.title} | Projects | Arcanea`,
    description:
      workspace.project.description ??
      workspace.project.goal ??
      'Project workspace graph for Arcanea chats, creations, and memories.',
  };
}

export default async function ProjectWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/projects/${id}`);
  }

  const workspace = await getProjectWorkspaceForCurrentUser(id);
  if (!workspace) {
    notFound();
  }

  const completion = buildProjectCompletionSummary(workspace);
  const progress = completion.progress;
  const stats = [
    { label: 'Chats', value: workspace.stats.sessionCount },
    { label: 'Creations', value: workspace.stats.creationCount },
    { label: 'Memories', value: workspace.stats.memoryCount },
    { label: 'Completion', value: `${progress.completionPercent}%` },
  ];
  const remainingSteps = progress.steps.filter((step) => !step.completed);

  return (
    <main className="min-h-screen bg-cosmic-void">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-atlantean-teal-aqua/80">
              <FolderOpen size={14} />
              Project Workspace
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">
              {workspace.project.title}
            </h1>
            {(workspace.project.description || workspace.project.goal) && (
              <div className="mt-4 space-y-3 text-sm leading-7 text-white/70">
                {workspace.project.description && <p>{workspace.project.description}</p>}
                {workspace.project.goal && (
                  <p>
                    <span className="mr-2 font-semibold text-white/90">Goal:</span>
                    {workspace.project.goal}
                  </p>
                )}
              </div>
            )}
            <p className="mt-4 flex items-center gap-2 text-xs text-white/45">
              <ClockCounterClockwise size={14} />
              Updated {formatTimestamp(workspace.project.updatedAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <OpenProjectChatButton projectId={workspace.project.id} />
            <Button asChild variant="ghost">
              <Link href="/chat">View Chat Shell</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="liquid-glass">
              <CardHeader className="pb-3">
                <CardDescription className="uppercase tracking-[0.18em] text-white/40">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl text-white">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
          <Card variant="liquid-glass" className="min-h-[320px]">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle>Graph Summary</CardTitle>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-white/55">
                  {statusLabel(progress.status)}
                </span>
              </div>
              <CardDescription>
                {completion.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/40">
                  <span>Workspace progress</span>
                  <span>{progress.completedCount}/{progress.totalSteps}</span>
                </div>
                <Progress value={progress.completionPercent} variant="brand" size="lg" animated />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Next action</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{progress.nextRecommendedAction}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Graph health</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    {progress.completionPercent === 100
                      ? 'Frame, sessions, creations, memory, and provenance are all connected.'
                      : `Graph is ${progress.completionPercent}% complete and still missing ${remainingSteps.length} step(s).`}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Node inventory</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-2xl font-semibold text-white">{workspace.sessions.length}</p>
                    <p className="text-xs text-white/45">Linked sessions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-white">{workspace.creations.length}</p>
                    <p className="text-xs text-white/45">Linked creations</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-white">{workspace.memories.length}</p>
                    <p className="text-xs text-white/45">Linked memories</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="liquid-glass-subtle" className="self-start">
            <CardHeader>
              <CardTitle>Next Actions</CardTitle>
              <CardDescription>
                The workspace graph is live. These are the remaining steps Arcanea can still learn from.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              {remainingSteps.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <p className="font-medium text-white">Workspace complete</p>
                  <p className="mt-1 text-white/60">
                    The project has the frame, continuity, artifacts, memory, and source provenance Arcanea expects.
                  </p>
                </div>
              ) : (
                remainingSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <ArrowRight size={14} className="mt-1 text-atlantean-teal-aqua" />
                    <div className="min-w-0">
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="mt-1 text-white/55">{step.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Card variant="liquid-glass" className="min-h-[320px]">
            <CardHeader>
              <CardTitle>Conversation Continuity</CardTitle>
              <CardDescription>
                Recent sessions already linked to this project. This is the hot path Arcanea uses to keep work coherent.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.sessions.length === 0 ? (
                <p className="text-sm text-white/50">
                  No chats linked yet. Open the project in chat and start building.
                </p>
              ) : (
                workspace.sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {session.title || 'Untitled chat'}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          {session.luminorId || 'No luminor'} · {session.modelId || 'default model'}
                        </p>
                      </div>
                      <span className="text-[11px] text-white/35">
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="liquid-glass" className="min-h-[320px]">
            <CardHeader>
              <CardTitle>Artifact Trail</CardTitle>
              <CardDescription>
                Outputs already attached to this workspace graph.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.creations.length === 0 ? (
                <p className="text-sm text-white/50">
                  No creations linked yet. Save from chat or studio to begin building a durable project trail.
                </p>
              ) : (
                workspace.creations.map((creation) => (
                  <div
                    key={creation.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      {creation.thumbnailUrl ? (
                        <img
                          src={creation.thumbnailUrl}
                          alt={creation.title}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/45">
                          <Sparkle size={18} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{creation.title}</p>
                        <p className="mt-1 text-xs text-white/45">
                          {creation.type} · {creation.status}
                          {creation.sourceSessionId ? ` · from ${creation.sourceSessionId.slice(0, 8)}` : ' · unlinked'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
          <Card variant="liquid-glass">
            <CardHeader>
              <CardTitle>Memory Links</CardTitle>
              <CardDescription>
                Retrieved memory snippets already attached to this project container.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.memories.length === 0 ? (
                <p className="text-sm text-white/50">
                  No durable memory links yet. They will appear as Arcanea extracts and connects relevant insights in the background.
                </p>
              ) : (
                workspace.memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/75"
                  >
                    {memory.content}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card variant="liquid-glass-subtle" className="self-start">
            <CardHeader>
              <CardTitle>Workspace Actions</CardTitle>
              <CardDescription>
                Move between the project graph and the chat shell without losing continuity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-atlantean-teal-aqua" />
                <span>Open this project in chat to continue the active context.</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-atlantean-teal-aqua" />
                <span>Save a creation from chat or studio to attach provenance to the graph.</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={14} className="mt-1 text-atlantean-teal-aqua" />
                <span>Link or extract memories to keep the workspace semantically useful.</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
