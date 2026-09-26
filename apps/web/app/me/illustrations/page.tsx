import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your illustrations | Arcanea', robots: { index: false, follow: false } };

export default async function MyIllustrations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?next=%2Fme%2Fillustrations');
  const { data, error } = await supabase.from('creations')
    .select('id,title,content,created_at').eq('user_id', user.id)
    .eq('type', 'image').eq('visibility', 'private')
    .contains('metadata', { source: 'reader', book: 'the-light-she-could-not-see' })
    .order('created_at', { ascending: false }).limit(40);

  const items = await Promise.all((data ?? []).map(async (row: {
    id: string; title: string; content: unknown; created_at: string;
  }) => {
    const content = row.content && typeof row.content === 'object' && !Array.isArray(row.content)
      ? row.content as Record<string, unknown> : {};
    const path = typeof content.storagePath === 'string' ? content.storagePath : '';
    const { data: signed } = path ? await supabase.storage.from('creations').createSignedUrl(path, 3600) : { data: null };
    return { ...row, chapter: Number(content.chapter), excerpt: String(content.excerpt ?? ''), url: signed?.signedUrl };
  }));

  return <main className={styles.page}>
    <div className={styles.header}>
      <Link href="/stories/the-light-she-could-not-see">Back to the story</Link>
      <p>Your space / Illustrations</p>
      <h1>Scenes you made visible.</h1>
      <p>Your private images stay connected to the passages that inspired them.</p>
    </div>
    {error && <p role="alert">Your illustrations could not be loaded right now.</p>}
    {!error && items.length === 0 && <p className={styles.empty}>Select a sentence while reading, then illustrate it. Your images will appear here.</p>}
    <div className={styles.grid}>{items.filter((item) => item.url).map((item) => <article key={item.id} className={styles.card}>
      <Image src={item.url!} alt={`Illustration of ${item.excerpt}`} width={768} height={512} unoptimized />
      <div><p>Chapter {item.chapter}</p><blockquote>{item.excerpt}</blockquote>
        <Link href={`/stories/the-light-she-could-not-see#chapter-${item.chapter}`}>Return to passage</Link>
      </div>
    </article>)}</div>
  </main>;
}
