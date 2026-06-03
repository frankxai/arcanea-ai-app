import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { rowToView } from '@/lib/pages/types';
import { getPageRow } from '../page-data';
import { PageEditor } from './page-editor';

export const runtime = 'nodejs';

type Props = { params: Promise<{ slug: string }> };

export default async function EditPageRoute({ params }: Props) {
  const { slug } = await params;
  const row = await getPageRow(slug);
  if (!row) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only the owner may edit; everyone else is bounced to the public view.
  if (!user || user.id !== row.owner_id) redirect(`/p/${slug}`);

  return <PageEditor slug={slug} initial={rowToView(row, true)} />;
}
