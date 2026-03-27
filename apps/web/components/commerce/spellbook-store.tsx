'use client';

import { useState } from 'react';
import {
  Book, Sparkle, Lock, CheckCircle, Flame, Drop, Leaf,
  Wind, Eye, ArrowRight,
} from '@/lib/phosphor-icons';
import type { SpellbookProduct } from '@/lib/types/commerce';
import type { Element } from '@/lib/types/challenge';

const ELEMENT_CONFIG: Record<Element, { icon: React.ElementType; color: string; gradient: string }> = {
  fire: { icon: Flame, color: '#ff6b35', gradient: 'from-red-900/40 to-orange-900/30' },
  water: { icon: Drop, color: '#60a5fa', gradient: 'from-blue-900/40 to-cyan-900/30' },
  earth: { icon: Leaf, color: '#34d399', gradient: 'from-emerald-900/40 to-green-900/30' },
  wind: { icon: Wind, color: '#a78bfa', gradient: 'from-indigo-900/40 to-violet-900/30' },
  void: { icon: Eye, color: '#8b5cf6', gradient: 'from-purple-950/50 to-fuchsia-900/30' },
  spirit: { icon: Sparkle, color: '#ffd700', gradient: 'from-amber-900/40 to-yellow-900/30' },
};

interface SpellbookStoreProps {
  products: SpellbookProduct[];
  ownedIds: string[];
  userMana: number;
  onPurchase?: (spellbookId: string) => Promise<void>;
}

export function SpellbookStore({ products, ownedIds, userMana, onPurchase }: SpellbookStoreProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Book className="h-7 w-7 text-amber-400" weight="duotone" />
        <div>
          <h3 className="font-cinzel text-xl text-white">Grimoire Binding</h3>
          <p className="text-sm text-white/40">Bind a grimoire to your soul. Its spells become yours.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <GrimoireCard
            key={product.id}
            product={product}
            isOwned={ownedIds.includes(product.id)}
            canAfford={userMana >= product.price}
            onPurchase={onPurchase}
          />
        ))}
      </div>
    </div>
  );
}

function GrimoireCard({
  product,
  isOwned,
  canAfford,
  onPurchase,
}: {
  product: SpellbookProduct;
  isOwned: boolean;
  canAfford: boolean;
  onPurchase?: (id: string) => Promise<void>;
}) {
  const [purchasing, setPurchasing] = useState(false);
  const config = ELEMENT_CONFIG[product.element] || ELEMENT_CONFIG.fire;
  const Icon = config.icon;
  const isFree = product.price === 0;

  async function handlePurchase() {
    if (!onPurchase || purchasing) return;
    setPurchasing(true);
    try {
      await onPurchase(product.id);
    } finally {
      setPurchasing(false);
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${config.gradient} p-5 backdrop-blur-xl transition-all ${
        isOwned
          ? 'border-emerald-500/30'
          : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Element icon */}
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20">
          <Icon className="h-6 w-6" style={{ color: config.color }} weight="duotone" />
        </div>
        {isOwned ? (
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" weight="fill" />
            <span className="text-xs text-emerald-300">Bound</span>
          </div>
        ) : isFree ? (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">Free</span>
        ) : (
          <div className="flex items-center gap-1">
            <Sparkle className="h-3.5 w-3.5 text-amber-400" weight="fill" />
            <span className="font-cinzel text-sm text-amber-200">{product.price}</span>
          </div>
        )}
      </div>

      {/* Name & description */}
      <h4 className="mt-3 font-cinzel text-lg text-white">{product.name}</h4>
      <p className="mt-1 text-xs capitalize text-white/30">{product.tier} tier</p>

      {/* Spells preview */}
      <div className="mt-3 space-y-1">
        {product.features.slice(0, 3).map((feature, i) => (
          <p key={i} className="text-xs text-white/40">
            {isOwned || isFree ? '  ' : '  '} {feature}
          </p>
        ))}
        {product.features.length > 3 && (
          <p className="text-xs text-white/20">+{product.features.length - 3} more</p>
        )}
      </div>

      {/* Action button */}
      {!isOwned && !isFree && (
        <button
          onClick={handlePurchase}
          disabled={!canAfford || purchasing}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition-all hover:bg-white/20 disabled:opacity-30"
        >
          {!canAfford ? (
            <>
              <Lock className="h-4 w-4" />
              Insufficient Mana
            </>
          ) : purchasing ? (
            'Binding...'
          ) : (
            <>
              <Book className="h-4 w-4" weight="fill" />
              Bind this Grimoire
              <ArrowRight className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
