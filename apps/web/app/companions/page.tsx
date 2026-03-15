'use client';

import React, { useState } from 'react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  PhSparkle,
  PhCode,
  PhPalette,
  PhPen,
  PhMagnifyingGlass,
  PhChatCircle,
  PhHeart,
  PhStar,
  PhFunnel,
  PhArrowRight,
} from '@/lib/phosphor-icons';
import { getFeaturedLuminors } from '@/lib/luminor-images';
import { LUMINORS, TEAMS, type Team, type LuminorConfig } from '@/lib/luminors/config';

/**
 * Companions Hub - Character.ai-like experience
 *
 * Browse and chat with AI companions (Luminors) - each with
 * unique personalities, specialties, and conversation styles.
 */
export default function CompanionsPage() {
  const [selectedTeam, setSelectedTeam] = useState<Team | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const luminors = Object.values(LUMINORS);

  const filteredLuminors = luminors.filter((luminor) => {
    const matchesTeam = selectedTeam === 'all' || luminor.team === selectedTeam;
    const matchesSearch =
      searchQuery === '' ||
      luminor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      luminor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      luminor.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  const teamIcons: Record<Team, React.ReactNode> = {
    development: <PhCode className="w-4 h-4" />,
    creative: <PhPalette className="w-4 h-4" />,
    writing: <PhPen className="w-4 h-4" />,
    research: <PhMagnifyingGlass className="w-4 h-4" />,
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.06)_0%,transparent_60%)]" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Who will you create with?
              </h1>
              <p className="text-xl text-white/55 max-w-2xl mx-auto mb-8">
                16 companions, each with a distinct personality and expertise.
                Development, design, writing, and research — pick the one that fits your work.
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <PhMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search companions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00bcd4] focus:ring-2 focus:ring-[#00bcd4]/30"
                  />
                </div>
              </div>

              {/* Team Filters */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedTeam('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTeam === 'all'
                      ? 'bg-white text-[#09090b]'
                      : 'bg-white/[0.04] text-white/55 hover:bg-white/[0.06]'
                  }`}
                >
                  All Companions
                </button>
                {(Object.keys(TEAMS) as Team[]).map((team) => (
                  <button
                    key={team}
                    onClick={() => setSelectedTeam(team)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedTeam === team
                        ? 'text-white'
                        : 'bg-white/[0.04] text-white/55 hover:bg-white/[0.06]'
                    }`}
                    style={
                      selectedTeam === team
                        ? { backgroundColor: TEAMS[team].color }
                        : {}
                    }
                  >
                    {teamIcons[team]}
                    {TEAMS[team].name}
                  </button>
                ))}
              </div>
            </m.div>
          </div>
        </div>

        {/* Featured Companion Images */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-display font-semibold text-white/70">
              Creative Spirits
            </h2>
            <Link
              href="/gallery/luminors"
              className="flex items-center gap-1.5 text-xs text-[#00bcd4] hover:text-[#00bcd4]/80 transition-colors"
            >
              View all 20
              <PhArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {getFeaturedLuminors(8).map((luminor) => (
              <Link
                key={luminor.id}
                href="/gallery/luminors"
                className="group flex-shrink-0"
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/[0.06] transition-all group-hover:border-white/[0.15]">
                  <Image
                    src={luminor.image}
                    alt={luminor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="96px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-1.5 left-2 text-[10px] font-medium text-white/80">
                    {luminor.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Companions Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredLuminors.map((luminor, index) => (
                <CompanionCard
                  key={luminor.id}
                  luminor={luminor}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredLuminors.length === 0 && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-white/40 text-lg">
                No companions match your search. Try a different query.
              </p>
            </m.div>
          )}
        </div>

        {/* Premium Chat CTA */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-gradient-to-r from-[#0d47a1]/20 to-[#0d47a1]/20 border border-[#00bcd4]/30 rounded-2xl p-8 text-center">
            <PhSparkle className="w-12 h-12 text-[#00bcd4] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Just want a quick chat?
            </h2>
            <p className="text-white/55 mb-6 max-w-md mx-auto">
              Try our premium AI chat - no character selection needed. Get instant,
              intelligent responses powered by the best AI models.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00bcd4] to-[#0d47a1] text-white font-medium rounded-xl hover:from-[#00bcd4] hover:to-indigo-500 transition-all"
            >
              <PhChatCircle className="w-5 h-5" />
              Open Premium Chat
            </Link>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}

function CompanionCard({
  luminor,
  index,
}: {
  luminor: LuminorConfig;
  index: number;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/chat/${luminor.id}`}
        className="block group"
      >
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
          {/* Avatar & Badge */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg"
              style={{
                backgroundColor: `${luminor.color}20`,
                boxShadow: `0 4px 20px ${luminor.color}30`,
              }}
            >
              {luminor.avatar}
            </div>
            <div
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${luminor.color}20`,
                color: luminor.color,
              }}
            >
              {TEAMS[luminor.team].name}
            </div>
          </div>

          {/* Name & Title */}
          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#00bcd4] transition-colors">
            {luminor.name}
          </h3>
          <p
            className="text-sm font-medium mb-2"
            style={{ color: luminor.color }}
          >
            {luminor.title}
          </p>

          {/* Tagline */}
          <p className="text-white/40 text-sm mb-4 line-clamp-2">
            {luminor.tagline}
          </p>

          {/* Specialty */}
          <div className="flex items-center gap-2 text-xs text-white/30">
            <PhStar className="w-3 h-3" />
            <span>{luminor.specialty}</span>
          </div>

          {/* Personality Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {luminor.personality.slice(0, 3).map((trait) => (
              <span
                key={trait}
                className="px-2 py-0.5 bg-white/[0.06] rounded-full text-xs text-white/40"
              >
                {trait}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-sm text-white/40">Start chatting</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-opacity-100"
              style={{ backgroundColor: `${luminor.color}30` }}
            >
              <PhChatCircle className="w-4 h-4" style={{ color: luminor.color }} />
            </div>
          </div>
        </div>
      </Link>
    </m.div>
  );
}
