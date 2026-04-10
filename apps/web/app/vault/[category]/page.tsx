import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchVaultCategory } from '@/lib/starlight-api';
import { VAULT_CONFIG, VAULT_CATEGORIES, type VaultCategory } from '@/lib/vault-data';
import { VaultEntryCard } from '@/app/arcanea-vault/vault-entry-card';

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return VAULT_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const config = VAULT_CONFIG[category as VaultCategory];
  if (!config) return { title: 'Vault — Arcanea' };

  return {
    title: `${config.label} Vault — ${config.tagline} | Arcanea`,
    description: `${config.label} insights from the Starlight Intelligence System. Guardian: ${config.guardian}.`,
    openGraph: {
      title: `${config.label} Vault — Arcanea`,
      description: config.tagline,
    },
  };
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function VaultCategoryPage({ params }: Props) {
  const { category } = await params;
  if (!VAULT_CATEGORIES.includes(category as VaultCategory)) notFound();

  const cat = category as VaultCategory;
  const config = VAULT_CONFIG[cat];
  const entries = await fetchVaultCategory(cat);
  entries.sort((a, b) => b.createdAt - a.createdAt);

  // Group entries by date
  const grouped = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = formatDate(entry.createdAt);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(entry);
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse at 50% 30%, ${config.color}12, transparent 60%)` }} />
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {/* ── Back link ── */}
        <div className="pt-8">
          <Link href="/arcanea-vault" className="text-xs font-mono tracking-widest text-[#708094] hover:text-[#e6eefc] transition-colors uppercase">
            Back to constellation
          </Link>
        </div>

        {/* ── Category nav ── */}
        <nav className="flex flex-wrap gap-2 mt-6 mb-8">
          {VAULT_CATEGORIES.map((c) => {
            const cfg = VAULT_CONFIG[c];
            const isActive = c === cat;
            return (
              <Link
                key={c}
                href={`/vault/${c}`}
                className="px-3 py-1.5 rounded-full text-xs font-mono border transition-colors"
                style={{
                  color: isActive ? cfg.color : '#708094',
                  borderColor: isActive ? `${cfg.color}40` : 'rgba(255,255,255,0.06)',
                  backgroundColor: isActive ? `${cfg.color}12` : 'transparent',
                }}
              >
                {cfg.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-[#e6eefc]">{config.label}</h1>
              <p className="text-xs text-[#708094] font-mono tracking-widest uppercase">{config.guardian}</p>
            </div>
          </div>
          <p className="text-sm text-[#9bb1d0] mt-2">{config.tagline}</p>
          <p className="text-xs text-[#708094] mt-1 font-mono">
            {entries.length} {entries.length === 1 ? 'insight' : 'insights'}
            {entries.length > 0 && <> &middot; Latest {timeAgo(entries[0].createdAt)}</>}
          </p>
        </div>

        {/* ── Timeline ── */}
        {entries.length > 0 ? (
          <div className="space-y-8 pb-24">
            {Array.from(grouped).map(([date, dayEntries]) => (
              <div key={date}>
                <p className="text-xs font-mono tracking-widest text-[#708094] mb-3 uppercase">{date}</p>
                <div className="space-y-3 pl-4 border-l border-white/[0.06]">
                  {dayEntries.map((entry) => (
                    <VaultEntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${config.color}08` }}>
              <div className="w-4 h-4 rounded-full opacity-30" style={{ backgroundColor: config.color }} />
            </div>
            <p className="text-[#708094] text-sm">Empty.</p>
            <p className="text-[#708094]/50 text-xs mt-1">Entries appear here as the vault grows.</p>
          </div>
        )}
      </main>
    </div>
  );
}
