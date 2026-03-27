'use client';

import { useState, useEffect } from 'react';
import {
  Diamond, Scroll, Book, Package, Shield,
  Sparkle, Lightning, ArrowRight, TrendUp,
} from '@/lib/phosphor-icons';
import { ArcaneWalletCard } from '@/components/commerce/arcane-wallet';
import { QuestBoard } from '@/components/commerce/quest-board';
import { SpellbookStore } from '@/components/commerce/spellbook-store';
import { TransactionHistory } from '@/components/commerce/transaction-history';
import { CommissionStatusCard } from '@/components/commerce/commission-panel';
import type { ArcaneWallet, ArcaneBounty, ManaTransaction, LuminorCommission, SpellbookProduct } from '@/lib/types/commerce';
import { getSpellbookProducts } from '@/lib/commerce/spellbook-store';

type Tab = 'vault' | 'quests' | 'grimoires' | 'bazaar' | 'commissions';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'vault', label: 'Arcane Diamond', icon: Diamond },
  { id: 'quests', label: 'Quest Board', icon: Scroll },
  { id: 'grimoires', label: 'Grimoires', icon: Book },
  { id: 'bazaar', label: 'Bazaar', icon: Package },
  { id: 'commissions', label: 'Commissions', icon: Lightning },
];

const COMMERCE_STATS = [
  { label: 'Mana Flowing', value: '2.4M', icon: Sparkle, color: '#ffd700' },
  { label: 'Active Quests', value: '47', icon: Scroll, color: '#f59e0b' },
  { label: 'Commissions Today', value: '128', icon: Lightning, color: '#a78bfa' },
  { label: 'Creators Earning', value: '892', icon: TrendUp, color: '#34d399' },
];

export default function CommercePage() {
  const [activeTab, setActiveTab] = useState<Tab>('vault');

  // In production, these would come from API calls
  const [wallet] = useState<ArcaneWallet | null>({
    id: 'demo-wallet',
    userId: 'demo-user',
    manaBalance: 2450,
    lockedMana: 300,
    lifetimeEarned: 12800,
    lifetimeBurned: 10350,
    tier: 'creator',
    streak: 7,
    lastDailyClaimAt: null,
    createdAt: new Date().toISOString(),
  });

  const [bounties] = useState<ArcaneBounty[]>([
    {
      id: '1',
      posterId: 'user-1',
      title: 'Epic battle theme for my fire world',
      description: 'Need a 3-minute orchestral battle theme with fire element motifs. Think Two Steps from Hell meets Arcanean mythology.',
      type: 'song',
      element: 'fire',
      reward: 500,
      escrowTransactionId: null,
      status: 'open',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      posterId: 'user-2',
      title: 'Luminor portrait — water element sage',
      description: 'Digital painting of a wise water sage for my world. Fluid, ethereal, with crystal blue tones.',
      type: 'art',
      element: 'water',
      reward: 300,
      escrowTransactionId: null,
      status: 'open',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      posterId: 'user-3',
      title: 'Origin story for the Void Wanderer archetype',
      description: 'A 2000-word origin story for a character who walks between worlds. Dark but hopeful tone.',
      type: 'story',
      element: 'void',
      reward: 200,
      escrowTransactionId: null,
      status: 'claimed',
      claimedById: 'user-4',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]);

  const [transactions] = useState<ManaTransaction[]>([
    {
      id: 'tx-1',
      type: 'credit',
      category: 'daily-well',
      amount: 45,
      fromWalletId: null,
      toWalletId: 'demo-wallet',
      description: 'Day 7 streak. The Well flows with 45 Mana.',
      narrativeName: 'The Well',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'tx-2',
      type: 'credit',
      category: 'commission',
      amount: 240,
      fromWalletId: 'other-wallet',
      toWalletId: 'demo-wallet',
      description: 'Your Luminor "Melodia" completed a song commission.',
      narrativeName: 'Eternal Resonance',
      status: 'completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'tx-3',
      type: 'debit',
      category: 'spellbook-unlock',
      amount: 200,
      fromWalletId: 'demo-wallet',
      toWalletId: 'demo-wallet',
      description: 'Bound Liber Ventorum to your soul.',
      narrativeName: 'Grimoire Binding',
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const spellbookProducts = getSpellbookProducts();
  const ownedSpellbooks = ['liber-ignium', 'liber-aquarum', 'liber-terrae', 'liber-ventorum'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 px-4 pb-12 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <h1 className="font-cinzel text-4xl font-bold text-white md:text-5xl">
            The <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Arcane Economy</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/50">
            Earn Mana through creation. Spend it on power. Commission Luminors.
            Post quests. Trade in the Bazaar. Every transaction is a spell cast.
          </p>
        </div>

        {/* Stats */}
        <div className="relative mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {COMMERCE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl border border-white/5 bg-white/5 p-4 text-center backdrop-blur-sm">
                <Icon className="mx-auto h-6 w-6" style={{ color: stat.color }} weight="duotone" />
                <p className="mt-2 font-cinzel text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tab navigation */}
      <nav className="sticky top-0 z-10 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500/20 text-amber-200'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/60'
                }`}
              >
                <Icon className="h-4 w-4" weight={activeTab === tab.id ? 'fill' : 'regular'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {activeTab === 'vault' && (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ArcaneWalletCard wallet={wallet} />
            </div>
            <div className="lg:col-span-3">
              <TransactionHistory transactions={transactions} walletId="demo-wallet" />
            </div>
          </div>
        )}

        {activeTab === 'quests' && (
          <QuestBoard bounties={bounties} />
        )}

        {activeTab === 'grimoires' && (
          <SpellbookStore
            products={spellbookProducts}
            ownedIds={ownedSpellbooks}
            userMana={wallet?.manaBalance || 0}
          />
        )}

        {activeTab === 'bazaar' && (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-white/20" weight="duotone" />
            <p className="mt-4 font-cinzel text-lg text-white/40">The Bazaar of Wonders</p>
            <p className="mt-1 text-sm text-white/20">
              Marketplace launching soon. List Luminors, creations, and prompt books for sale.
            </p>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-12 text-center">
            <Lightning className="mx-auto h-12 w-12 text-white/20" weight="duotone" />
            <p className="mt-4 font-cinzel text-lg text-white/40">Luminor Commissions</p>
            <p className="mt-1 text-sm text-white/20">
              Commission AI agents to create songs, art, stories, and more. Coming soon.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
