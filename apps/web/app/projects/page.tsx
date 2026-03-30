import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, ClockCounterClockwise, FolderOpen, Plus } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { listProjectsForCurrentUser } from '@/lib/projects/server';

export const metadata: Metadata = {
  title: 'Projects | Arcanea',
  description: 'Browse Arcanea workspaces that connect chats, creations, memories, and graph context.',
};

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString();
}

export default async function ProjectsIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?next=/projects');
  }

  const projects = await listProjectsForCurrentUser();

  return (
    <main className="min-h-screen bg-cosmic-void">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-atlantean-teal-aqua/80">
              <FolderOpen size={14} />
              Project Workspaces
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">
              Projects
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Arcanea projects are the continuity container for your chats, creations, memories,
              and graph context. Use them to keep work coherent across sessions and surfaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/chat">
                <Plus size={16} />
                Create from chat
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/studio">Open studio</Link>
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card variant="liquid-glass" className="mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>
                Start in chat, move a session into a project, or save work from studio to begin
                building a durable workspace graph.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/chat">Open chat</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/studio">Open studio</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} variant="liquid-glass" className="flex h-full flex-col">
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-white">{project.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3 text-white/60">
                        {project.description || project.goal || 'No description yet.'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-auto space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">Updated</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/65">
                      <ClockCounterClockwise size={14} />
                      {formatTimestamp(project.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <Button asChild variant="ghost">
                      <Link href={`/projects/${project.id}`}>Open workspace</Link>
                    </Button>
                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-atlantean-teal-aqua transition hover:text-atlantean-teal-aqua/80"
                    >
                      View graph
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
