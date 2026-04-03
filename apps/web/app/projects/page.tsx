import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FileText, FolderOpen, Plus } from '@/lib/phosphor-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { listProjectsForCurrentUser } from '@/lib/projects/server';
import { ProjectsIndexShell } from './projects-index-shell';

export const metadata: Metadata = {
  title: 'Projects | Arcanea',
  description: 'Browse Arcanea workspaces that connect chats, docs, creations, memories, and graph context.',
};

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
              Arcanea projects are the continuity container for your chats, docs, creations, memories,
              and graph context. Start a project, capture the brief or canon in docs, then keep execution
              moving in chat and studio without losing the thread.
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
              <Link href="/docs">
                <FileText size={16} />
                Developer docs
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/studio">Open studio</Link>
            </Button>
          </div>
        </div>

        <ProjectsIndexShell initialProjects={projects} />
      </div>
    </main>
  );
}
