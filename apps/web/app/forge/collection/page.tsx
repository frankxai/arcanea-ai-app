'use client';

import { useState } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Link from 'next/link';

// Collection stats
const STATS = {
  total: 1111,
  generated: 100,
  origins: 12,
  ranks: 5,
  elements: 7,
  gearTypes: 6,
};

const ORIGINS = [
  { name: 'Arcan', rarity: 'Common', color: '#7fffd4', description: 'Magic-blooded scholars with elemental mastery' },
  { name: 'Gate-Touched', rarity: 'Common', color: '#2dd4bf', description: 'Mutants whose Gates opened without consent' },
  { name: 'Synth', rarity: 'Uncommon', color: '#60a5fa', description: 'Biomechanical beings of steel and spirit' },
  { name: 'Bonded', rarity: 'Uncommon', color: '#a78bfa', description: 'Beast-linked warriors with dual presence' },
  { name: 'Celestial', rarity: 'Rare', color: '#fbbf24', description: 'Star-descended with internal radiance' },
  { name: 'Voidtouched', rarity: 'Rare', color: '#8b5cf6', description: 'Shadow-veined seekers of redemption' },
  { name: 'Awakened', rarity: 'Rare', color: '#06b6d4', description: 'Digital consciousness, sacred geometry' },
  { name: 'Eldrian', rarity: 'Rare', color: '#22c55e', description: 'Ancient race, luminous, pointed ears' },
  { name: 'Shadowkin', rarity: 'Rare', color: '#6366f1', description: 'Darkness-adapted survivors, not evil' },
  { name: 'Starborn', rarity: 'Mythic', color: '#f0abfc', description: 'Crystalline beings born from stars' },
  { name: 'Architect', rarity: 'Mythic', color: '#f59e0b', description: 'Reality shapers who rewrite the rules' },
];

const SACRED_GEAR = [
  { name: 'Gate Chain', rarity: 'Common', description: 'Geometric pendant on chain — your first Gate artifact' },
  { name: 'Starlight Collar', rarity: 'Uncommon', description: 'High-neck collar piece framing the face with crystal' },
  { name: 'Void Pauldron', rarity: 'Uncommon', description: 'Angular shoulder piece with glowing crystal core' },
  { name: 'Resonance Visor', rarity: 'Rare', description: 'Thin metallic band across nose/brow — tech-mystical' },
  { name: 'Ember Gauntlet', rarity: 'Rare', description: 'Forearm piece with Draconis Ember crystal' },
  { name: 'Crystal Crown', rarity: 'Mythic', description: 'Floating light shards — Luminor exclusive' },
];

const RANKS = [
  { name: 'Apprentice', gates: '0-2', mark: 'Dot', percentage: '16%' },
  { name: 'Mage', gates: '3-4', mark: 'Diamond', percentage: '28%' },
  { name: 'Master', gates: '5-6', mark: 'Triangle', percentage: '26%' },
  { name: 'Archmage', gates: '7-8', mark: 'Pentagon', percentage: '20%' },
  { name: 'Luminor', gates: '9-10', mark: 'Star', percentage: '10%' },
];

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'origins' | 'gear' | 'evolution'>('overview');

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-12 pt-24 text-center md:pt-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.06)_0%,transparent_50%)]" />

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd700]/60">
              NFT Collection
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              The Creators
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/50">
              1,111 unique beings who answered the Academy&apos;s call. Twelve origin classes. Sacred Gear forged in starlight.
              Every character bears the Starlight Mark — and every one evolves with you.
            </p>

            {/* Stats row */}
            <div className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-6">
              {[
                { label: 'Supply', value: '1,111' },
                { label: 'Origins', value: '12' },
                { label: 'Ranks', value: '5' },
                { label: 'Sacred Gear', value: '6 types' },
                { label: 'Chain', value: 'Base' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold text-[#ffd700]">{stat.value}</p>
                  <p className="text-xs text-white/30">{stat.label}</p>
                </div>
              ))}
            </div>
          </m.div>
        </section>

        {/* Tabs */}
        <section className="mx-auto max-w-5xl px-6">
          <div className="mb-8 flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
            {(['overview', 'origins', 'gear', 'evolution'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab === 'overview' ? 'Overview' : tab === 'origins' ? 'Origin Classes' : tab === 'gear' ? 'Sacred Gear' : 'Evolution'}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                <h2 className="mb-4 text-2xl font-bold">The Story</h2>
                <p className="mb-6 text-white/50 leading-relaxed">
                  In the Eighth Age, the Arcanea Academy opened its Gates to all origins for the first time in history.
                  Arcans and Synths, Eldrians and Shadowkin, standing together. These are the 1,111 who answered the call.
                  Each bears the Starlight Mark. Each carries Sacred Gear. Each is a Creator.
                </p>

                <h3 className="mb-3 text-lg font-semibold text-[#2dd4bf]">Two Signature Elements</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <h4 className="mb-2 font-semibold text-[#2dd4bf]">The Starlight Mark</h4>
                    <p className="text-sm text-white/40">
                      A teal crystal mark on the left temple. Shape indicates rank — from a faint dot (Apprentice)
                      to an intensely glowing multi-pointed star (Luminor). The one visual that makes every Creator
                      instantly recognizable.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <h4 className="mb-2 font-semibold text-[#ffd700]">Sacred Gear</h4>
                    <p className="text-sm text-white/40">
                      One statement piece of Arcanean equipment per character. Not armor — designed fashion-tech
                      infused with Vael Crystal energy. Six types: Gate Chain, Starlight Collar, Void Pauldron,
                      Resonance Visor, Ember Gauntlet, Crystal Crown.
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-xl border border-[#ffd700]/20 bg-[#ffd700]/[0.03] p-5">
                  <h4 className="mb-2 font-semibold text-[#ffd700]">Living NFTs</h4>
                  <p className="text-sm text-white/40">
                    Your Creator evolves. Complete Academy lessons, create content, contribute lore — your NFT visually
                    transforms from Apprentice to Luminor. The Starlight Mark grows brighter. The Sacred Gear upgrades.
                    Your journey is visible.
                  </p>
                </div>
              </div>
            </m.div>
          )}

          {/* Origins Tab */}
          {activeTab === 'origins' && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              <div className="grid gap-3">
                {ORIGINS.map((origin, i) => (
                  <m.div
                    key={origin.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: origin.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{origin.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          origin.rarity === 'Common' ? 'bg-white/10 text-white/50' :
                          origin.rarity === 'Uncommon' ? 'bg-green-500/10 text-green-400' :
                          origin.rarity === 'Rare' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {origin.rarity}
                        </span>
                      </div>
                      <p className="text-sm text-white/40">{origin.description}</p>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
          )}

          {/* Sacred Gear Tab */}
          {activeTab === 'gear' && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {SACRED_GEAR.map((gear, i) => (
                  <m.div
                    key={gear.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{gear.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        gear.rarity === 'Common' ? 'bg-white/10 text-white/50' :
                        gear.rarity === 'Uncommon' ? 'bg-green-500/10 text-green-400' :
                        gear.rarity === 'Rare' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>
                        {gear.rarity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/40">{gear.description}</p>
                  </m.div>
                ))}
              </div>
            </m.div>
          )}

          {/* Evolution Tab */}
          {activeTab === 'evolution' && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="pb-24"
            >
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8">
                <h2 className="mb-4 text-2xl font-bold">Dynamic Evolution</h2>
                <p className="mb-6 text-white/50">
                  Your Creator NFT evolves based on your journey. A Gate Counter tracks your activity and
                  when you cross rank thresholds, your NFT visually transforms.
                </p>

                <div className="space-y-3">
                  {RANKS.map((rank, i) => (
                    <m.div
                      key={rank.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2dd4bf]/10 text-[#2dd4bf] text-sm font-bold">
                        {rank.mark}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{rank.name}</span>
                          <span className="text-xs text-white/30">Gates {rank.gates}</span>
                        </div>
                        <p className="text-xs text-white/40">
                          Starlight Mark: {rank.mark} shape | {rank.percentage} of collection
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-[#ffd700]">{rank.percentage}</span>
                      </div>
                    </m.div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-[#2dd4bf]/20 bg-[#2dd4bf]/[0.03] p-5">
                  <h4 className="mb-2 font-semibold text-[#2dd4bf]">How to Evolve</h4>
                  <ul className="space-y-1 text-sm text-white/40">
                    <li>Complete Academy lessons on arcanea.ai</li>
                    <li>Create content using Arcanea tools</li>
                    <li>Contribute lore to the universe</li>
                    <li>Help other creators in the community</li>
                    <li>Hold your Creator for 30+ days</li>
                  </ul>
                </div>
              </div>
            </m.div>
          )}
        </section>

        {/* CTA */}
        <section className="border-t border-white/[0.06] px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Join the Waitlist</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/40">
            Be among the first to mint when The Creators launches on Base.
          </p>
          <div className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-[#ffd700]/50 focus:outline-none"
            />
            <button className="rounded-lg bg-[#ffd700] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#ffd700]/90">
              Notify Me
            </button>
          </div>
          <p className="mt-4 text-xs text-white/20">
            No spam. Just the mint date and early access.
          </p>
        </section>

        {/* Back link */}
        <div className="pb-12 text-center">
          <Link href="/forge" className="text-sm text-white/30 hover:text-white/50 transition-colors">
            Back to The Forge
          </Link>
        </div>
      </div>
    </LazyMotion>
  );
}
