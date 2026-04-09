import type { VaultEntry } from '@/lib/vault-data';
import { VAULT_CONFIG, type VaultCategory } from '@/lib/vault-data';

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function ConfidenceDots({ level }: { level: string }) {
  const filled = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
  return (
    <div className="flex gap-1" title={`${level} confidence`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < filled ? 'bg-white/60' : 'bg-white/15'}`}
        />
      ))}
    </div>
  );
}

export function VaultEntryCard({ entry, id }: { entry: VaultEntry; id?: string }) {
  const config = VAULT_CONFIG[entry.vault as VaultCategory];

  return (
    <div
      id={id}
      className="group relative bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.1]"
    >
      <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full" style={{ backgroundColor: config?.color ?? '#666' }} />
      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="text-sm text-[#e6eefc] leading-relaxed flex-1">{entry.content}</p>
          <ConfidenceDots level={entry.confidence} />
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#708094]">
          {entry.metadata?.category && (
            <span className="font-mono tracking-widest uppercase">{entry.metadata.category}</span>
          )}
          <span>{timeAgo(entry.createdAt)}</span>
          {entry.tags?.length > 0 && entry.tags.map((tag) => (
            <span key={tag} className="font-mono px-1.5 py-0.5 rounded bg-white/[0.04]">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
