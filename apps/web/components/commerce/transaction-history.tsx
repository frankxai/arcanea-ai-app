'use client';

import {
  Sparkle, TrendUp, TrendDown, ArrowsClockwise, Lightning,
  Book, Package, Scroll, Heart, Sun, Star,
} from '@/lib/phosphor-icons';
import type { ManaTransaction, TransactionCategory } from '@/lib/types/commerce';

const CATEGORY_CONFIG: Record<TransactionCategory, {
  icon: React.ElementType;
  color: string;
  label: string;
}> = {
  reward: { icon: Lightning, color: '#ffd700', label: "Guardian's Bounty" },
  commission: { icon: Sparkle, color: '#a78bfa', label: 'Luminor Commission' },
  bounty: { icon: Scroll, color: '#f59e0b', label: 'Quest Reward' },
  tip: { icon: Heart, color: '#f472b6', label: 'Mana Offering' },
  'spellbook-unlock': { icon: Book, color: '#60a5fa', label: 'Grimoire Binding' },
  'marketplace-sale': { icon: Package, color: '#34d399', label: 'Bazaar Sale' },
  'marketplace-purchase': { icon: Package, color: '#ef4444', label: 'Bazaar Purchase' },
  'escrow-lock': { icon: ArrowsClockwise, color: '#f59e0b', label: 'Sealed Covenant' },
  'escrow-release': { icon: ArrowsClockwise, color: '#10b981', label: 'Covenant Fulfilled' },
  'daily-well': { icon: Sun, color: '#06b6d4', label: 'The Well' },
  'system-grant': { icon: Star, color: '#ffd700', label: 'Gift' },
};

interface TransactionHistoryProps {
  transactions: ManaTransaction[];
  walletId?: string;
}

export function TransactionHistory({ transactions, walletId }: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center">
        <ArrowsClockwise className="mx-auto h-10 w-10 text-white/20" />
        <p className="mt-3 text-sm text-white/40">No arcane flows yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-cinzel text-lg text-white">Arcane Flows</h3>
      <div className="divide-y divide-white/5">
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} walletId={walletId} />
        ))}
      </div>
    </div>
  );
}

function TransactionRow({
  transaction: tx,
  walletId,
}: {
  transaction: ManaTransaction;
  walletId?: string;
}) {
  const config = CATEGORY_CONFIG[tx.category] || CATEGORY_CONFIG['system-grant'];
  const Icon = config.icon;
  const isIncoming = tx.type === 'credit' || (walletId && tx.toWalletId === walletId && tx.fromWalletId !== walletId);

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Icon */}
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
        <Icon className="h-5 w-5" style={{ color: config.color }} weight="duotone" />
      </div>

      {/* Description */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-white/80">{tx.narrativeName}</p>
        <p className="truncate text-xs text-white/30">{tx.description}</p>
      </div>

      {/* Amount */}
      <div className="flex flex-shrink-0 items-center gap-1 text-right">
        {isIncoming ? (
          <TrendUp className="h-4 w-4 text-emerald-400" />
        ) : (
          <TrendDown className="h-4 w-4 text-red-400" />
        )}
        <span
          className={`font-cinzel text-sm font-bold ${
            isIncoming ? 'text-emerald-300' : 'text-red-300'
          }`}
        >
          {isIncoming ? '+' : '-'}{tx.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
