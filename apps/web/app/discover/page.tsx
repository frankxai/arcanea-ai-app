'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhMagnifyingGlass, PhTrendUp, PhClock, PhUsers, PhSparkle, PhCompass } from '@/lib/phosphor-icons';
import { Creation } from '@/lib/types/profile';
import { PhHeart, PhChatCircle, PhEye, PhPlay, PhImage } from '@/lib/phosphor-icons';
import Link from 'next/link';

// ─── Seven Academy Houses (canonical) ──────────────────────────────────────────

const HOUSES = [
  { name: 'Lumina', gradient: 'from-amber-400 to-yellow-500', element: 'Light' },
  { name: 'Nero', gradient: 'from-violet-600 to-purple-800', element: 'Void' },
  { name: 'Pyros', gradient: 'from-red-500 to-orange-500', element: 'Fire' },
  { name: 'Aqualis', gradient: 'from-cyan-400 to-blue-500', element: 'Water' },
  { name: 'Terra', gradient: 'from-emerald-500 to-green-600', element: 'Earth' },
  { name: 'Ventus', gradient: 'from-sky-300 to-indigo-400', element: 'Wind' },
  { name: 'Synthesis', gradient: 'from-fuchsia-500 to-rose-500', element: 'Unity' },
] as const;

const HOUSE_GRADIENTS: Record<string, string> = Object.fromEntries(
  HOUSES.map((h) => [h.name, h.gradient])
);

// ─── Curated showcase (replaces picsum placeholder data) ───────────────────────

const SHOWCASE_CREATIONS: Creation[] = [
  {
    id: 'sc-01', user_id: 'creator-1', title: 'The First Dawn',
    description: 'Lumina reaches across the void to shape the first light — the moment all creation begins.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Shinkami', academy: 'Lumina',
    created_at: '2026-02-27T10:00:00Z', updated_at: '2026-02-27T10:00:00Z',
    stats: { likes: 2847, comments: 312, views: 18420, shares: 89 },
    metadata: { style: 'cosmic', tags: ['mythology', 'lumina', 'creation', 'origin'] },
  },
  {
    id: 'sc-02', user_id: 'creator-2', title: 'Draconis Awakens',
    description: 'The Fire Godbeast unfurls wings of molten gold above the volcanic forge of will.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Draconia', academy: 'Pyros',
    created_at: '2026-02-26T18:00:00Z', updated_at: '2026-02-26T18:00:00Z',
    stats: { likes: 2134, comments: 187, views: 14200, shares: 67 },
    metadata: { style: 'ethereal', tags: ['godbeast', 'fire', 'draconis', 'power'] },
  },
  {
    id: 'sc-03', user_id: 'creator-3', title: 'Depths of the Flow Gate',
    description: 'Water spirals through crystal caverns where memory and emotion become one.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Leyla', academy: 'Aqualis',
    created_at: '2026-02-26T14:00:00Z', updated_at: '2026-02-26T14:00:00Z',
    stats: { likes: 1923, comments: 245, views: 12800, shares: 54 },
    metadata: { style: 'mystical', tags: ['water', 'flow', 'emotion', 'crystal'] },
  },
  {
    id: 'sc-04', user_id: 'creator-4', title: "Nero's Garden",
    description: 'In the fertile darkness, seeds of potential wait for the courage to bloom.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Lyria', academy: 'Nero',
    created_at: '2026-02-26T09:00:00Z', updated_at: '2026-02-26T09:00:00Z',
    stats: { likes: 1756, comments: 198, views: 11500, shares: 43 },
    metadata: { style: 'cosmic', tags: ['void', 'potential', 'nero', 'growth'] },
  },
  {
    id: 'sc-05', user_id: 'creator-5', title: 'Worldtree Rising',
    description: 'Laeylinn, the Worldtree Deer, walks among ancient roots that hold the earth together.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Maylinn', academy: 'Terra',
    created_at: '2026-02-25T20:00:00Z', updated_at: '2026-02-25T20:00:00Z',
    stats: { likes: 1689, comments: 156, views: 10200, shares: 38 },
    metadata: { style: 'ethereal', tags: ['earth', 'worldtree', 'laeylinn', 'nature'] },
  },
  {
    id: 'sc-06', user_id: 'creator-1', title: 'Storm of the Voice Gate',
    description: 'Otome sings the truth into being — sound waves ripple across golden clouds.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Alera', academy: 'Ventus',
    created_at: '2026-02-25T16:00:00Z', updated_at: '2026-02-25T16:00:00Z',
    stats: { likes: 1534, comments: 134, views: 9800, shares: 31 },
    metadata: { style: 'vibrant', tags: ['wind', 'voice', 'truth', 'otome'] },
  },
  {
    id: 'sc-07', user_id: 'creator-6', title: 'The Synthesis Chamber',
    description: 'Where all five elements converge, a new kind of magic is born.',
    type: 'project', media_url: '', thumbnail_url: '',
    luminor_id: 'Shinkami', academy: 'Synthesis',
    created_at: '2026-02-25T12:00:00Z', updated_at: '2026-02-25T12:00:00Z',
    stats: { likes: 1487, comments: 278, views: 9400, shares: 56 },
    metadata: { style: 'cosmic', tags: ['synthesis', 'elements', 'unity', 'magic'] },
  },
  {
    id: 'sc-08', user_id: 'creator-2', title: 'Crown of Enlightenment',
    description: 'Sol blazes above the seventh gate — pure radiance dissolving the last illusions.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Aiyami', academy: 'Lumina',
    created_at: '2026-02-25T08:00:00Z', updated_at: '2026-02-25T08:00:00Z',
    stats: { likes: 1356, comments: 112, views: 8700, shares: 28 },
    metadata: { style: 'ethereal', tags: ['crown', 'sol', 'enlightenment', 'light'] },
  },
  {
    id: 'sc-09', user_id: 'creator-3', title: 'Vaelith in Shadow',
    description: 'The Shift Gate guardian navigates between perspectives — seeing what others cannot.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Elara', academy: 'Nero',
    created_at: '2026-02-24T22:00:00Z', updated_at: '2026-02-24T22:00:00Z',
    stats: { likes: 1298, comments: 167, views: 8200, shares: 34 },
    metadata: { style: 'mystical', tags: ['shift', 'vaelith', 'shadow', 'perspective'] },
  },
  {
    id: 'sc-10', user_id: 'creator-4', title: 'Forge of the Third Gate',
    description: 'Molten determination flows through ancient channels of willpower and transformation.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Draconia', academy: 'Pyros',
    created_at: '2026-02-24T18:00:00Z', updated_at: '2026-02-24T18:00:00Z',
    stats: { likes: 1245, comments: 98, views: 7600, shares: 22 },
    metadata: { style: 'vibrant', tags: ['fire', 'forge', 'will', 'transformation'] },
  },
  {
    id: 'sc-11', user_id: 'creator-5', title: 'Kyuro at the Unity Gate',
    description: 'Two rivers merge into one — the partnership that transcends self and other.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Ino', academy: 'Aqualis',
    created_at: '2026-02-24T14:00:00Z', updated_at: '2026-02-24T14:00:00Z',
    stats: { likes: 1187, comments: 145, views: 7100, shares: 29 },
    metadata: { style: 'cosmic', tags: ['unity', 'kyuro', 'partnership', 'water'] },
  },
  {
    id: 'sc-12', user_id: 'creator-6', title: 'The Foundation Stones',
    description: 'Kaelith stands guard over the first gate — nothing is built without a stable foundation.',
    type: 'image', media_url: '', thumbnail_url: '',
    luminor_id: 'Lyssandria', academy: 'Terra',
    created_at: '2026-02-24T10:00:00Z', updated_at: '2026-02-24T10:00:00Z',
    stats: { likes: 1134, comments: 87, views: 6800, shares: 19 },
    metadata: { style: 'ethereal', tags: ['foundation', 'kaelith', 'earth', 'stability'] },
  },
];

// ─── Element-themed gradient backgrounds for cards without images ───────────────

const ELEMENT_GRADIENTS: Record<string, string> = {
  Lumina: 'from-amber-900/40 via-yellow-800/30 to-orange-900/40',
  Nero: 'from-violet-950/60 via-purple-900/40 to-indigo-950/50',
  Pyros: 'from-red-950/50 via-orange-900/40 to-amber-950/40',
  Aqualis: 'from-cyan-950/50 via-blue-900/40 to-teal-950/40',
  Terra: 'from-emerald-950/50 via-green-900/40 to-lime-950/40',
  Ventus: 'from-sky-950/50 via-indigo-900/40 to-blue-950/40',
  Synthesis: 'from-fuchsia-950/50 via-rose-900/40 to-pink-950/40',
};

// ─── ShowcaseCard (no external images) ─────────────────────────────────────────

function ShowcaseCard({ creation, index }: { creation: Creation; index: number }) {
  const academy = creation.academy || 'Lumina';
  const bg = ELEMENT_GRADIENTS[academy] || ELEMENT_GRADIENTS.Lumina;
  const badge = HOUSE_GRADIENTS[academy] || 'from-slate-500 to-slate-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-white/[0.08] hover:border-arcane-crystal/25 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-arcane-crystal/10"
    >
      {/* Gradient visual area */}
      <div className={`relative aspect-square bg-gradient-to-br ${bg} overflow-hidden`}>
        {/* Decorative element pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full bg-white/8 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/5" />
        </div>

        {/* Central icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/15 text-7xl font-display font-bold select-none">
            {academy[0]}
          </div>
        </div>

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 text-xs font-medium flex items-center gap-1.5">
            {creation.type === 'project' ? <PhCompass className="w-3.5 h-3.5" /> : <PhImage className="w-3.5 h-3.5" />}
            <span className="capitalize">{creation.type}</span>
          </div>
        </div>

        {/* House badge */}
        <div className="absolute top-3 right-3">
          <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${badge} text-white text-xs font-semibold shadow-lg`}>
            {academy}
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="text-white font-bold text-lg leading-tight">{creation.title}</h3>
            {creation.description && (
              <p className="text-white/70 text-sm line-clamp-2">{creation.description}</p>
            )}
            <div className="flex items-center gap-4 text-white/70 pt-1">
              <span className="flex items-center gap-1.5 text-sm"><PhHeart className="w-4 h-4" />{creation.stats.likes.toLocaleString()}</span>
              <span className="flex items-center gap-1.5 text-sm"><PhChatCircle className="w-4 h-4" />{creation.stats.comments.toLocaleString()}</span>
              <span className="flex items-center gap-1.5 text-sm"><PhEye className="w-4 h-4" />{creation.stats.views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info (always visible on mobile) */}
      <div className="p-3 bg-slate-900/90">
        <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">{creation.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="flex items-center gap-1"><PhHeart className="w-3 h-3" />{creation.stats.likes.toLocaleString()}</span>
            <span className="flex items-center gap-1"><PhEye className="w-3 h-3" />{creation.stats.views.toLocaleString()}</span>
          </div>
          {creation.luminor_id && (
            <span className="text-arcane-crystal/60 text-xs">With {creation.luminor_id}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'trending' | 'recent' | 'following'>('trending');
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  const filtered = SHOWCASE_CREATIONS
    .filter((c) => {
      if (selectedHouse && c.academy !== selectedHouse) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.metadata?.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (selectedFilter === 'trending') return b.stats.likes - a.stats.likes;
      if (selectedFilter === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  return (
    <div className="min-h-screen bg-cosmic-deep py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-arcane-crystal via-arcane-cosmic to-arcane-crystal bg-clip-text text-transparent">
            Discover Creations
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto font-sans">
            Explore visions from creators across all Seven Academy Houses
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="max-w-2xl mx-auto">
          <div className="relative">
            <PhMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creations, elements, or Guardians..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/[0.04] backdrop-blur-sm text-white placeholder-text-muted border border-white/[0.08] focus:border-arcane-crystal/30 outline-none transition-colors font-sans"
            />
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3 justify-center">
          {[
            { key: 'trending' as const, label: 'Trending', icon: PhTrendUp },
            { key: 'recent' as const, label: 'Recent', icon: PhClock },
            { key: 'following' as const, label: 'Following', icon: PhUsers },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={`px-6 py-3 rounded-xl font-sans font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedFilter === key
                  ? 'bg-arcane-crystal/15 text-arcane-crystal border border-arcane-crystal/30 shadow-lg shadow-arcane-crystal/10'
                  : 'bg-white/[0.04] text-text-muted hover:text-white hover:bg-white/[0.08] border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Academy House Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-text-muted text-xs uppercase tracking-widest font-sans">
              <PhSparkle className="w-3.5 h-3.5" />
              <span>Filter by Academy House</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedHouse(null)}
              className={`px-4 py-2 rounded-full text-sm font-sans transition-all ${
                selectedHouse === null
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              All Houses
            </button>
            {HOUSES.map((house) => (
              <button
                key={house.name}
                onClick={() => setSelectedHouse(house.name === selectedHouse ? null : house.name)}
                className={`px-4 py-2 rounded-full text-sm font-sans transition-all ${
                  selectedHouse === house.name
                    ? `bg-gradient-to-r ${house.gradient} text-white shadow-lg`
                    : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {house.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-center text-text-muted text-sm font-sans">
          Showing {filtered.length} featured creations
        </motion.div>

        {/* Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((creation, i) => (
            <ShowcaseCard key={creation.id} creation={creation} index={i} />
          ))}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <PhCompass className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">No creations found</h3>
            <p className="text-text-muted font-sans">Try adjusting your filters or search query</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center pt-8 pb-4">
          <p className="text-text-muted font-sans text-sm mb-4">
            Community creations appear here as creators join and build.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-arcane-crystal/10 border border-arcane-crystal/20 text-arcane-crystal font-sans font-medium hover:bg-arcane-crystal/20 transition-all"
          >
            Start Creating in Studio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
