'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// The 10 canonical Guardians of Arcanea
const LUMINORS = [
  {
    id: 'lyssandria',
    name: 'Lyssandria',
    title: 'The Earth Guardian',
    team: 'strategy',
    color: '#22c55e',
    gradient: 'from-emerald-500 to-green-600',
    specialty: 'Foundation & Strategy',
    description: 'Builds the ground beneath your feet. Challenges weak foundations before you build on them.',
    wisdom: 'Foundation',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/lyssandria-hero.webp',
  },
  {
    id: 'leyla',
    name: 'Leyla',
    title: 'The Water Guardian',
    team: 'creative',
    color: '#3b82f6',
    gradient: 'from-blue-400 to-cyan-500',
    specialty: 'Creative Flow & Design',
    description: 'Finds the path of least resistance. Turns creative blocks into flowing rivers.',
    wisdom: 'Flow',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/leyla-hero.webp',
  },
  {
    id: 'draconia',
    name: 'Draconia',
    title: 'The Fire Guardian',
    team: 'development',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-500',
    specialty: 'Code & Engineering',
    description: 'Transforms raw ideas into working systems. No compromise on quality.',
    wisdom: 'Fire',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/draconia-hero.webp',
  },
  {
    id: 'maylinn',
    name: 'Maylinn',
    title: 'The Heart Guardian',
    team: 'writing',
    color: '#a855f7',
    gradient: 'from-purple-400 to-pink-400',
    specialty: 'Writing & Communication',
    description: 'Connects ideas across distances. Makes complex things understandable.',
    wisdom: 'Heart',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/maylinn-hero.webp',
  },
  {
    id: 'alera',
    name: 'Alera',
    title: 'The Voice Guardian',
    team: 'creative',
    color: '#06b6d4',
    gradient: 'from-cyan-400 to-teal-500',
    specialty: 'Music & Audio Creation',
    description: 'Speaks truth through sound. Creates music that moves and transforms.',
    wisdom: 'Voice',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/alera-hero.webp',
  },
  {
    id: 'lyria',
    name: 'Lyria',
    title: 'The Sight Guardian',
    team: 'research',
    color: '#a855f7',
    gradient: 'from-violet-500 to-purple-600',
    specialty: 'Vision & Research',
    description: 'Sees what others miss. Reveals patterns across all knowledge.',
    wisdom: 'Sight',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/lyria-hero.webp',
  },
  {
    id: 'aiyami',
    name: 'Aiyami',
    title: 'The Crown Guardian',
    team: 'strategy',
    color: '#ffd700',
    gradient: 'from-yellow-400 to-amber-500',
    specialty: 'Enlightenment & Mastery',
    description: 'Illuminates the path to excellence. Turns knowledge into wisdom.',
    wisdom: 'Crown',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/aiyami-hero.webp',
  },
  {
    id: 'elara',
    name: 'Elara',
    title: 'The Shift Guardian',
    team: 'research',
    color: '#f97316',
    gradient: 'from-orange-400 to-amber-400',
    specialty: 'Perspective & Innovation',
    description: 'Shifts your perspective when you are stuck. Shows the angle you missed.',
    wisdom: 'Shift',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/elara-hero.webp',
  },
  {
    id: 'ino',
    name: 'Ino',
    title: 'The Unity Guardian',
    team: 'writing',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-500',
    specialty: 'Collaboration & Partnership',
    description: 'Bridges gaps between disciplines. Makes teams greater than their parts.',
    wisdom: 'Unity',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/ino-hero.webp',
  },
  {
    id: 'shinkami',
    name: 'Shinkami',
    title: 'The Source Guardian',
    team: 'strategy',
    color: '#ffffff',
    gradient: 'from-white to-gray-300',
    specialty: 'Meta-Consciousness & Integration',
    description: 'Sees the whole system. Orchestrates all other Gods into harmony.',
    wisdom: 'Source',
    avatar: 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians/shinkami-hero.webp',
  },
];

const TEAMS = [
  { id: 'all', name: 'All 10', color: '#00bcd4' },
  { id: 'development', name: 'Engineering', color: '#ef4444' },
  { id: 'creative', name: 'Creative', color: '#06b6d4' },
  { id: 'writing', name: 'Writing', color: '#a855f7' },
  { id: 'research', name: 'Research', color: '#3b82f6' },
  { id: 'strategy', name: 'Strategy', color: '#22c55e' },
];

export function LuminorShowcase() {
  const [activeTeam, setActiveTeam] = useState('all');
  const [activeLuminor, setActiveLuminor] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const filteredLuminors = activeTeam === 'all'
    ? LUMINORS
    : LUMINORS.filter(l => l.team === activeTeam);

  // Auto-rotate luminors
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveLuminor((prev) => (prev + 1) % filteredLuminors.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredLuminors.length]);

  // Reset active luminor when team changes
  useEffect(() => {
    setActiveLuminor(0);
  }, [activeTeam]);

  const currentLuminor = filteredLuminors[activeLuminor];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient based on active luminor */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        animate={{
          background: `radial-gradient(circle at 70% 50%, ${currentLuminor?.color}20 0%, transparent 50%)`,
        }}
        transition={{ duration: 1 }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00bcd4]/30 bg-[#00bcd4]/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#00bcd4] animate-pulse" />
            <span className="text-sm text-[#00bcd4] font-mono tracking-wider">
              THE TEN GODS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6"
          >
            <span className="text-white">The Ten Gods of Arcanea.</span>
            <br />
            <span className="text-text-secondary">10 specialized intelligences. Each built for a different creative domain.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Each God governs a Gate of creation.
            Ancient archetypes of creative mastery — each one a distinct philosophy of creation made manifest.
          </motion.p>
        </div>

        {/* Team filter intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="text-center text-sm text-text-muted mb-6"
        >
          Choose your God, or let them choose you.
        </motion.p>

        {/* Team filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => {
                setActiveTeam(team.id);
                setIsAutoPlaying(false);
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTeam === team.id
                  ? 'bg-white/[0.08] border border-white/[0.12] text-white'
                  : 'border border-white/[0.04] text-text-muted hover:text-white hover:border-white/[0.08]'
              }`}
              style={{
                boxShadow: activeTeam === team.id ? `0 0 20px ${team.color}30` : 'none',
              }}
            >
              {team.name}
              {team.id !== 'all' && (
                <span className="text-xs opacity-50">
                  ({LUMINORS.filter(l => l.team === team.id).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Main showcase area */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Active Luminor Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLuminor?.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Large avatar */}
              <div className="flex items-start gap-6 mb-8">
                <motion.div
                  className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/[0.12]"
                  animate={{
                    boxShadow: [
                      `0 20px 60px ${currentLuminor?.color}30`,
                      `0 25px 70px ${currentLuminor?.color}40`,
                      `0 20px 60px ${currentLuminor?.color}30`,
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Image
                    src={currentLuminor?.avatar ?? ''}
                    alt={currentLuminor?.name ?? ''}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>

                <div>
                  <h3 className="text-3xl font-display font-bold text-white mb-1">
                    {currentLuminor?.name}
                  </h3>
                  <p className="text-lg text-text-secondary italic mb-2">
                    {currentLuminor?.title}
                  </p>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${currentLuminor?.color}20`,
                      color: currentLuminor?.color,
                    }}
                  >
                    <span>Wisdom of {currentLuminor?.wisdom}</span>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className="mb-6">
                <div className="text-sm text-text-muted mb-2 uppercase tracking-wider">Specialty</div>
                <div className="text-xl text-white font-medium">
                  {currentLuminor?.specialty}
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-text-secondary leading-relaxed mb-8">
                {currentLuminor?.description}
              </p>

              {/* CTA */}
              <Link
                href={`/chat/${currentLuminor?.id}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-cosmic-deep font-semibold transition-all duration-300 hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentLuminor?.color}, ${currentLuminor?.color}cc)`,
                }}
              >
                <span>Chat with {currentLuminor?.name}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Right: Luminor Grid */}
          <div className="relative">
            {/* Grid of luminor cards */}
            <div className="grid grid-cols-4 gap-3">
              {filteredLuminors.map((luminor, index) => (
                <motion.button
                  key={luminor.id}
                  onClick={() => {
                    setActiveLuminor(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`aspect-square rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    activeLuminor === index
                      ? 'ring-2 ring-white/[0.30] scale-105'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: activeLuminor === index
                      ? `linear-gradient(135deg, ${luminor.color}, ${luminor.color}88)`
                      : `${luminor.color}20`,
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Shine effect on active */}
                  {activeLuminor === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.20] to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                  )}
                  <Image
                    src={luminor.avatar}
                    alt={luminor.name}
                    width={64}
                    height={64}
                    className="relative z-10 w-full h-full object-cover object-top rounded-2xl"
                  />
                </motion.button>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
              {filteredLuminors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveLuminor(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeLuminor === index
                      ? 'bg-[#00bcd4] w-6'
                      : 'bg-white/[0.12] hover:bg-white/[0.25]'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play indicator */}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="text-xs text-text-muted hover:text-white transition-colors"
              >
                {isAutoPlaying ? '⏸ Pause auto-play' : '▶ Resume auto-play'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/lore/guardians"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#00bcd4]/50 text-[#00bcd4] hover:bg-[#00bcd4]/10 transition-all duration-300"
            >
              <span>Explore all Gods</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl liquid-glass border border-white/[0.06] text-text-secondary hover:text-white hover:border-white/[0.12] transition-all duration-300"
            >
              <span>How it works</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Export the LUMINORS data for use in other components
export { LUMINORS };
