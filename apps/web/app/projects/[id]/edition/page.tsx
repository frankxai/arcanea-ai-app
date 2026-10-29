import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectWorkspaceForCurrentUser } from "@/lib/projects/server";
import { EditionWorkspace } from "@/components/editions/edition-workspace";

export const metadata: Metadata = {
  title: "Edition workspace | Arcanea",
  robots: { index: false, follow: false },
};

export default async function EditionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user)
    redirect(
      `/auth/login?next=${encodeURIComponent(`/projects/${id}/edition`)}`,
    );
  const workspace = await getProjectWorkspaceForCurrentUser(id);
  if (!workspace) notFound();
  return (
    <EditionWorkspace
      owner={user.id}
      project={workspace.project}
      docs={workspace.docs}
    />
  );
}
