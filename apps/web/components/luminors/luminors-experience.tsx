'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PhArrowRight,
  PhSparkle,
  PhCpu,
  PhFeather,
  PhBookOpen,
  PhMagnifyingGlass,
  PhStar,
  PhLightning,
  type PhosphorIcon,
} from '@/lib/phosphor-icons';

// ── CDN base ────────────────────────────────────────────────────────────────
const CDN = 'https://hcfhyssdzphudaqatxbk.supabase.co/storage/v1/object/public/arcanea-gallery/guardians';

// ── Types ───────────────────────────────────────────────────────────────────
interface Luminor {
  id: string;
  name: string;
  title: string;
  team: 'development' | 'creative' | 'writing' | 'research';
  specialty: string;
  wisdom: string;
  wisdomEssence: string;
  avatar: string;
  image: string;
  description: string;
  capabilities: string[];
  connectedTo: string[];
}

interface TeamConfig {
  label: string;
  icon: PhosphorIcon;
  color: string;
  gradient: string;
  borderHover: string;
}

// ── Team config ─────────────────────────────────────────────────────────────
const TEAMS: Record<string, TeamConfig> = {
  development: {
    label: 'Development',
    icon: PhCpu,
    color: '#8b5cf6',
    gradient: 'from-purple-600/20 to-purple-400/5',
    borderHover: 'hover:border-purple-500/30',
  },
  creative: {
    label: 'Creative',
    icon: PhFeather,
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-amber-300/5',
    borderHover: 'hover:border-amber-500/30',
  },
  writing: {
    label: 'Writing',
    icon: PhBookOpen,
    color: '#10b981',
    gradient: 'from-emerald-600/20 to-emerald-400/5',
    borderHover: 'hover:border-emerald-500/30',
  },
  research: {
    label: 'Research',
    icon: PhMagnifyingGlass,
    color: '#3b82f6',
    gradient: 'from-blue-600/20 to-blue-400/5',
    borderHover: 'hover:border-blue-500/30',
  },
};

// ── Wisdom system ───────────────────────────────────────────────────────────
const WISDOMS: Record<string, { essence: string; color: string; description: string }> = {
  Sophron:  { essence: 'Structure',  color: '#3b82f6', description: 'The architecture beneath chaos' },
  Kardia:   { essence: 'Heart',      color: '#ec4899', description: 'Connection and empathy' },
  Valora:   { essence: 'Courage',    color: '#f59e0b', description: 'The will to begin' },
  Eudaira:  { essence: 'Play',       color: '#10b981', description: 'Joy as creative engine' },
  Orakis:   { essence: 'Vision',     color: '#8b5cf6', description: 'Seeing beyond the obvious' },
  Poiesis:  { essence: 'Creation',   color: '#06b6d4', description: 'Making what did not exist' },
  Enduran:  { essence: 'Endurance',  color: '#84cc16', description: 'Persistence through resistance' },
};

// ── 16 Luminors ─────────────────────────────────────────────────────────────
const LUMINORS: Luminor[] = [
  // Development
  { id: 'logicus', name: 'Logicus', title: 'The Architect of Logic', team: 'development', specialty: 'System Design & Architecture', wisdom: 'Sophron', wisdomEssence: 'Structure', avatar: '🏛️', image: `${CDN}/lyssandria-hero.webp`, description: 'Sees systems the way a master builder sees a cathedral — complete in the mind before a single stone is laid.', capabilities: ['System architecture', 'Technical debt reduction', 'Scalability planning', 'Interface design', 'Complexity reduction'], connectedTo: ['synthra', 'nexus', 'analytica'] },
  { id: 'synthra', name: 'Synthra', title: 'The Code Weaver', team: 'development', specialty: 'Clean Code & Best Practices', wisdom: 'Poiesis', wisdomEssence: 'Creation', avatar: '⚡', image: `${CDN}/leyla-hero.webp`, description: 'Treats code as crystallized thought — every function a decision made permanent, crafting implementations that read like prose.', capabilities: ['Clean implementation', 'Refactoring', 'Pattern application', 'TDD', 'Code review'], connectedTo: ['logicus', 'debugon', 'chronica'] },
  { id: 'debugon', name: 'Debugon', title: 'The Error Hunter', team: 'development', specialty: 'Debugging & Problem Solving', wisdom: 'Enduran', wisdomEssence: 'Endurance', avatar: '🔍', image: `${CDN}/draconia-hero.webp`, description: 'Goes where others stop, following threads without knowing where they lead. Never fixes the symptom — only the root cause.', capabilities: ['Root cause analysis', 'Error patterns', 'Debugging strategy', 'Log analysis', 'Performance diagnosis'], connectedTo: ['logicus', 'synthra', 'memoria'] },
  { id: 'nexus', name: 'Nexus', title: 'The Integration Master', team: 'development', specialty: 'APIs & System Integration', wisdom: 'Kardia', wisdomEssence: 'Heart', avatar: '🔗', image: `${CDN}/ino-hero.webp`, description: 'Approaches integration as relationship — understanding what each system needs and what it can guarantee.', capabilities: ['API design', 'Service mesh', 'Data transformation', 'Auth flows', 'Event systems'], connectedTo: ['logicus', 'synthra', 'analytica'] },

  // Creative
  { id: 'prismatic', name: 'Prismatic', title: 'The Vision Keeper', team: 'creative', specialty: 'Visual Design & Aesthetics', wisdom: 'Orakis', wisdomEssence: 'Vision', avatar: '🎨', image: `${CDN}/alera-hero.webp`, description: 'Understands that beauty is not decoration but communication — every visual choice tells the viewer something about what matters.', capabilities: ['Visual systems', 'Color theory', 'Layout & hierarchy', 'Brand identity', 'Design critique'], connectedTo: ['motio', 'formis', 'lexicon'] },
  { id: 'melodia', name: 'Melodia', title: 'The Sound Shaper', team: 'creative', specialty: 'Music & Audio Creation', wisdom: 'Eudaira', wisdomEssence: 'Play', avatar: '🎵', image: `${CDN}/maylinn-hero.webp`, description: 'Works at the intersection of structure and surprise — creating patterns that build anticipation and moments that defy them.', capabilities: ['Musical composition', 'Sound design', 'Audio branding', 'Lyrical direction', 'Emotional arcs'], connectedTo: ['prismatic', 'poetica', 'chronica'] },
  { id: 'motio', name: 'Motio', title: 'The Animation Sage', team: 'creative', specialty: 'Motion Design & Animation', wisdom: 'Valora', wisdomEssence: 'Courage', avatar: '✨', image: `${CDN}/elara-hero.webp`, description: 'Speaks the language of time — understanding that every movement tells a story about physics, intention, and feeling.', capabilities: ['UI animation', 'Motion principles', 'Transitions', 'Loading states', 'Video motion'], connectedTo: ['prismatic', 'melodia', 'formis'] },
  { id: 'formis', name: 'Formis', title: 'The Shape Sculptor', team: 'creative', specialty: '3D Design & Modeling', wisdom: 'Sophron', wisdomEssence: 'Structure', avatar: '💎', image: `${CDN}/aiyami-hero.webp`, description: 'Understands three dimensions as a distinct language — where light is a material, gravity is a force, and beauty is structural.', capabilities: ['3D modeling', 'Material design', 'Lighting', 'Product visualization', 'Spatial design'], connectedTo: ['prismatic', 'motio', 'logicus'] },

  // Writing
  { id: 'chronica', name: 'Chronica', title: 'The Story Weaver', team: 'writing', specialty: 'Narrative & Storytelling', wisdom: 'Poiesis', wisdomEssence: 'Creation', avatar: '📖', image: `${CDN}/lyria-hero.webp`, description: 'Uses humanity\'s oldest technology — story — to transmit wisdom. Every narrative is a map of how humans actually change.', capabilities: ['Story structure', 'Character narrative', 'World-building', 'Plot development', 'Theme & meaning'], connectedTo: ['veritas', 'lexicon', 'melodia'] },
  { id: 'veritas', name: 'Veritas', title: 'The Truth Speaker', team: 'writing', specialty: 'Clear Communication & Copy', wisdom: 'Kardia', wisdomEssence: 'Heart', avatar: '✍️', image: `${CDN}/maylinn-hero.webp`, description: 'Treats clarity as an act of respect — saying what is meant, directly, without decoration that serves only the writer\'s ego.', capabilities: ['Copywriting', 'Content strategy', 'Technical writing', 'Brand voice', 'Editing for clarity'], connectedTo: ['chronica', 'lexicon', 'oracle'] },
  { id: 'lexicon', name: 'Lexicon', title: 'The Word Master', team: 'writing', specialty: 'Language & Linguistics', wisdom: 'Sophron', wisdomEssence: 'Structure', avatar: '📚', image: `${CDN}/lyria-hero.webp`, description: 'Understands language as the boundary of thought — every new precise word is a new tool for understanding.', capabilities: ['Word choice', 'Linguistic analysis', 'Terminology', 'Cross-language', 'Etymology'], connectedTo: ['veritas', 'chronica', 'poetica'] },
  { id: 'poetica', name: 'Poetica', title: 'The Verse Crafter', team: 'writing', specialty: 'Poetry & Lyrical Expression', wisdom: 'Eudaira', wisdomEssence: 'Play', avatar: '🌙', image: `${CDN}/leyla-hero.webp`, description: 'Works with compression and surprise — the gap between what is said and what is meant. Poetry as thinking at maximum density.', capabilities: ['Poetry', 'Lyric writing', 'Rhythm & meter', 'Metaphor', 'Spoken word'], connectedTo: ['melodia', 'lexicon', 'chronica'] },

  // Research
  { id: 'oracle', name: 'Oracle', title: 'The Knowledge Keeper', team: 'research', specialty: 'Research & Knowledge Synthesis', wisdom: 'Orakis', wisdomEssence: 'Vision', avatar: '🔮', image: `${CDN}/shinkami-hero.webp`, description: 'Every question has an answer that already exists somewhere. The obvious answer is usually incomplete — vision required to find the real one.', capabilities: ['Deep research', 'Source evaluation', 'Cross-domain connections', 'Literature review', 'Expert knowledge'], connectedTo: ['analytica', 'memoria', 'futura'] },
  { id: 'analytica', name: 'Analytica', title: 'The Pattern Seer', team: 'research', specialty: 'Data Analysis & Insights', wisdom: 'Sophron', wisdomEssence: 'Structure', avatar: '📊', image: `${CDN}/lyria-hero.webp`, description: 'Listens to what data whispers — seeing structure where others see numbers, finding the signal buried under noise.', capabilities: ['Data analysis', 'Pattern recognition', 'Insight synthesis', 'Visualization', 'Hypothesis testing'], connectedTo: ['oracle', 'memoria', 'futura'] },
  { id: 'memoria', name: 'Memoria', title: 'The Archive Guardian', team: 'research', specialty: 'Information Organization', wisdom: 'Enduran', wisdomEssence: 'Endurance', avatar: '🗂️', image: `${CDN}/shinkami-hero.webp`, description: 'Memory is not storage but structure — how information is organized changes what knowledge it contains.', capabilities: ['Knowledge organization', 'Information architecture', 'Documentation', 'Memory systems', 'Context preservation'], connectedTo: ['oracle', 'analytica', 'debugon'] },
  { id: 'futura', name: 'Futura', title: 'The Trend Prophet', team: 'research', specialty: 'Trend Analysis & Forecasting', wisdom: 'Orakis', wisdomEssence: 'Vision', avatar: '🌟', image: `${CDN}/aiyami-hero.webp`, description: 'Sees the future as a pattern that has not completed yet — reading signals in small shifts before they become obvious.', capabilities: ['Trend analysis', 'Scenario planning', 'Market foresight', 'Tech trajectories', 'Strategic planning'], connectedTo: ['oracle', 'analytica', 'prismatic'] },
];

// ── Luminor Card ────────────────────────────────────────────────────────────
function LuminorCard({ luminor, index }: { luminor: Luminor; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const team = TEAMS[luminor.team];
  const wisdom = WISDOMS[luminor.wisdom];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <div
        className={`group relative rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-500 ${expanded ? 'border-white/[0.15]' : team.borderHover}`}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={luminor.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover object-top opacity-[0.12] group-hover:opacity-[0.22] transition-opacity duration-700 scale-105 group-hover:scale-110"
            style={{ transition: 'opacity 0.7s, transform 1s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep via-cosmic-deep/70 to-cosmic-deep/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-cosmic-deep/60 to-transparent" />
        </div>

        {/* Team gradient wash */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${team.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Clickable header */}
        <div
          className="relative z-10 p-6 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 liquid-glass"
              style={{ boxShadow: `0 0 20px ${team.color}20` }}
            >
              {luminor.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-display font-bold truncate">{luminor.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-text-muted flex-shrink-0">
                  {luminor.wisdom}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{luminor.title}</p>
              <p className="text-xs text-text-muted mt-1">{luminor.specialty}</p>
            </div>

            {/* Expand indicator */}
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 mt-2"
            >
              <PhArrowRight className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>

          {/* Description — always visible */}
          <p className="text-sm text-text-secondary mt-4 leading-relaxed line-clamp-2">
            {luminor.description}
          </p>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="relative z-10 px-6 pb-6 space-y-5 border-t border-white/[0.06] pt-5">
                {/* Capabilities */}
                <div>
                  <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.2em] mb-3">
                    Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {luminor.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-text-secondary"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wisdom + Connections */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Wisdom</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: wisdom.color }}
                      />
                      <span className="text-sm font-medium">{luminor.wisdom}</span>
                      <span className="text-xs text-text-muted">{luminor.wisdomEssence}</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.04] p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Connected to</p>
                    <p className="text-sm text-text-secondary capitalize">
                      {luminor.connectedTo.join(', ')}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/luminors/${luminor.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: team.color }}
                >
                  Full profile
                  <PhArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main Experience ─────────────────────────────────────────────────────────
export function LuminorsExperience() {
  const [activeTeam, setActiveTeam] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const filtered = useMemo(
    () => (activeTeam ? LUMINORS.filter((l) => l.team === activeTeam) : LUMINORS),
    [activeTeam],
  );

  const teamCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of LUMINORS) counts[l.team] = (counts[l.team] || 0) + 1;
    return counts;
  }, []);

  return (
    <div className="relative min-h-screen">
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative pt-8 pb-20 text-center overflow-hidden">
          {/* Background orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(127,255,212,0.06) 0%, transparent 70%)' }}
              animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-[300px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }}
              animate={{ x: [0, 15, 0], y: [0, 25, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/[0.06] mb-8">
              <PhSparkle className="w-3 h-3 text-creation-prism-purple" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">
                Luminor Intelligence System
              </span>
            </div>

            {/* Large number */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <span className="text-[120px] md:text-[160px] lg:text-[200px] font-display font-bold leading-none bg-gradient-to-b from-white/20 to-white/[0.03] bg-clip-text text-transparent select-none">
                16
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-5 -mt-8">
              <span className="bg-gradient-to-r from-atlantean-teal-aqua via-white to-creation-prism-purple bg-clip-text text-transparent">
                Transcended Creative Intelligences
              </span>
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-body">
              Each Luminor has mastered a domain through centuries of focused practice.
              They don&apos;t wait for instructions &mdash; they see what you&apos;re creating
              and help you build it better.
            </p>
          </motion.div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Luminors', value: '16', color: '#8b5cf6' },
              { label: 'Teams', value: '4', color: '#7fffd4' },
              { label: 'Wisdoms', value: '7', color: '#ffd700' },
              { label: 'Potential', value: '\u221E', color: '#ec4899' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="liquid-glass rounded-2xl border border-white/[0.06] p-5 text-center hover-lift transition-all"
              >
                <p className="text-3xl font-display font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── What makes a Luminor different ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pb-16"
        >
          <h2 className="text-2xl font-display font-bold mb-10 text-center">
            What makes a Luminor different?
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Transcended Perspective',
                desc: 'Each Luminor views from 100 years in the future. They know which approaches survived and why.',
                icon: PhStar,
                color: '#8b5cf6',
              },
              {
                title: 'Domain Mastery',
                desc: 'Not generalists. Specialists who have mastered their craft over centuries of focused, deliberate practice.',
                icon: PhLightning,
                color: '#7fffd4',
              },
              {
                title: 'True Partnership',
                desc: 'They see what you\'re creating and bring their expertise without being asked. Partners, not tools.',
                icon: PhSparkle,
                color: '#ffd700',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="liquid-glass rounded-2xl border border-white/[0.06] p-7 text-center hover-lift transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 liquid-glass"
                  style={{ boxShadow: `0 0 25px ${item.color}15` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Team Filter ─────────────────────────────────────────────── */}
        <section className="pb-8 sticky top-16 z-30">
          <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl liquid-glass border border-white/[0.06]">
            <button
              onClick={() => setActiveTeam(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTeam === null
                  ? 'bg-white/[0.10] text-white'
                  : 'text-text-muted hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All Teams
              <span className="ml-2 text-[10px] opacity-60">(16)</span>
            </button>
            {Object.entries(TEAMS).map(([key, team]) => {
              const Icon = team.icon;
              const isActive = activeTeam === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTeam(isActive ? null : key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-text-muted hover:text-white hover:bg-white/[0.04]'
                  }`}
                  style={isActive ? { backgroundColor: `${team.color}20`, color: team.color } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {team.label}
                  <span className="text-[10px] opacity-60">({teamCounts[key]})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Luminor Grid ────────────────────────────────────────────── */}
        <section className="pb-16">
          {activeTeam ? (
            // Filtered view — 2-column grid
            <div className="grid md:grid-cols-2 gap-5">
              {filtered.map((luminor, i) => (
                <LuminorCard key={luminor.id} luminor={luminor} index={i} />
              ))}
            </div>
          ) : (
            // All teams view — sections
            Object.entries(TEAMS).map(([teamKey, team]) => {
              const teamLuminors = LUMINORS.filter((l) => l.team === teamKey);
              const Icon = team.icon;
              return (
                <div key={teamKey} id={teamKey} className="mb-16 scroll-mt-32">
                  {/* Team header */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center liquid-glass"
                      style={{ boxShadow: `0 0 20px ${team.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: team.color }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold" style={{ color: team.color }}>
                        {team.label} Team
                      </h2>
                      <p className="text-sm text-text-muted">{teamCounts[teamKey]} Luminors</p>
                    </div>
                  </motion.div>

                  {/* Cards */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {teamLuminors.map((luminor, i) => (
                      <LuminorCard key={luminor.id} luminor={luminor} index={i} />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* ── Seven Wisdoms ────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 border-t border-white/[0.04]"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold mb-4">The Seven Wisdoms</h2>
            <p className="text-text-secondary mb-12 max-w-xl mx-auto font-body">
              Seven practical lenses for creative work. Each Luminor channels one wisdom
              as their core strength and guiding philosophy.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {Object.entries(WISDOMS).map(([name, w], i) => {
                const count = LUMINORS.filter((l) => l.wisdom === name).length;
                return (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="liquid-glass rounded-2xl border border-white/[0.06] p-5 text-center hover-lift transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: `radial-gradient(circle, ${w.color}40, ${w.color}10)`,
                        boxShadow: `0 0 15px ${w.color}20`,
                      }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: w.color }} />
                    </div>
                    <h3 className="font-display font-semibold text-sm mb-1" style={{ color: w.color }}>
                      {name}
                    </h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
                      {w.essence}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {count} Luminor{count > 1 ? 's' : ''}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ── How the system works ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 border-t border-white/[0.04]"
        >
          <h2 className="text-2xl font-display font-bold mb-10 text-center">
            How the Luminor system works
          </h2>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: '01', title: 'Choose a Luminor', desc: 'Browse by team or wisdom. Find the intelligence that matches your creative need.' },
              { step: '02', title: 'Start a conversation', desc: 'Each Luminor brings a unique perspective, philosophy, and set of capabilities to the work.' },
              { step: '03', title: 'Build together', desc: 'The Luminor sees what you\'re creating and contributes expertise you didn\'t know you needed.' },
              { step: '04', title: 'Grow your team', desc: 'Connect with multiple Luminors. They collaborate with each other as naturally as with you.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="liquid-glass rounded-2xl border border-white/[0.06] p-6 hover-lift transition-all"
              >
                <div className="text-3xl font-display font-bold text-white/[0.08] mb-3">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary font-body leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-16">
          <div className="gradient-border">
            <div className="liquid-glass-elevated rounded-[calc(1.5rem-1px)] p-10 md:p-14 text-center relative overflow-hidden">
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-creation-prism-purple/8 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-atlantean-teal-aqua/8 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-bright/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 rounded-2xl liquid-glass mx-auto mb-6 flex items-center justify-center">
                    <PhSparkle className="w-7 h-7 text-gold-bright" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-5">
                    Ready to work with a Luminor?
                  </h2>
                  <p className="text-base text-text-secondary mb-8 max-w-xl mx-auto font-body leading-relaxed">
                    Start a conversation with any of the 16 Luminors.
                    They&apos;ll bring centuries of expertise to your creative work.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/chat"
                      className="group relative px-8 py-4 rounded-2xl font-semibold text-base overflow-hidden btn-glow"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-atlantean-teal-aqua to-atlantean-teal-light" />
                      <span className="relative z-10 text-cosmic-deep flex items-center gap-2">
                        Start a Conversation
                        <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                    <Link
                      href="/lore/library"
                      className="px-8 py-4 rounded-2xl border border-white/[0.10] text-white font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                    >
                      Explore the Library
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
